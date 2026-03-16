"""
Users Router
Routes: GET/POST /users/{uid}, PATCH /users/{uid}/character, PATCH /users/{uid}/settings

Auto-creates unknown UIDs (phone/offline users) so the frontend never gets a 404
when syncing local-only users to the backend.
"""
import os
import json
import sys
from datetime import datetime
from typing import Optional, Any, Dict
from fastapi import APIRouter
from pydantic import BaseModel

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_auth_conn, get_game_conn, get_quests_conn
import logger as log

router = APIRouter(prefix="/users", tags=["users"])


class UserDataPayload(BaseModel):
    userData: Optional[Dict[str, Any]] = None
    name: Optional[str] = None
    email: Optional[str] = None


class CharacterUpdate(BaseModel):
    selectedCharacter: int


class SettingsUpdate(BaseModel):
    darkMode: Optional[bool] = None
    notifications: Optional[bool] = None
    sound: Optional[bool] = None


def _build_user_response(auth_row, game_row) -> dict:
    """Merge auth + game data into the full userData blob the frontend expects."""
    base = {
        "name": auth_row["name"],
        "email": auth_row["email"],
        "role": auth_row["role"],
        "phone": auth_row["phone"],
        "dob": auth_row["dob"],
        "level": 1,
        "xp": 0,
        "gold": 0,
        "enamelHealth": 100,
        "totalStars": 0,
        "selectedCharacter": 1,
        "currentStreak": 0,
        "bestStreak": 0,
        "totalDays": 0,
        "completedChapters": 0,
        "brushingLogs": {},
        "completedQuestIds": [],
        "inventory": [],
        "unlockedRewards": [],
        "achievements": [],
        "questProgress": {"completedQuests": [], "activeQuests": []},
        "settings": {"darkMode": False, "notifications": True, "sound": True},
        "lastBrushedTimestamp": None,
    }
    if game_row:
        base.update({
            "level": game_row["level"],
            "xp": game_row["xp"],
            "gold": game_row["gold"],
            "enamelHealth": game_row["enamel_health"],
            "totalStars": game_row["total_stars"],
            "selectedCharacter": game_row["selected_char"],
            "currentStreak": game_row["current_streak"],
            "bestStreak": game_row["best_streak"],
            "totalDays": game_row["total_days"],
            "completedChapters": game_row["completed_chapters"],
        })
    return base


def _ensure_user_exists(uid: str, name: str = None, email: str = None, role: str = "child"):
    """
    Silently creates a backend profile for any UID that doesn't exist yet.
    This handles phone/{timestamp} users, Google users, and any offline-created UIDs
    so the frontend never receives a 404 when syncing.
    """
    auth_conn = get_auth_conn()
    game_conn = get_game_conn()
    quests_conn = get_quests_conn()
    created = False
    try:
        existing = auth_conn.execute("SELECT uid FROM users WHERE uid=?", (uid,)).fetchone()
        if not existing:
            # Infer defaults from uid pattern
            inferred_name = name or (
                "Phone User" if uid.startswith("phone_") else
                "Google User" if uid.startswith("google_") else
                "Guest User"
            )
            inferred_email = email or f"{uid}@offline.toothkingdom"
            inferred_role = role or "child"

            auth_conn.execute("""
                INSERT INTO users (uid, name, email, password_hash, role, provider)
                VALUES (?,?,?,?,?,?)
            """, (uid, inferred_name, inferred_email, "", inferred_role, "offline"))
            auth_conn.commit()

            # Create game profile
            game_conn.execute("""
                INSERT OR IGNORE INTO character_stats (uid) VALUES (?)
            """, (uid,))
            game_conn.commit()

            log.db_log("users", f"Auto-created backend profile for offline/phone uid={uid}")
            created = True

        # Always ensure game profile exists
        game_row = game_conn.execute("SELECT uid FROM character_stats WHERE uid=?", (uid,)).fetchone()
        if not game_row:
            game_conn.execute("INSERT OR IGNORE INTO character_stats (uid) VALUES (?)", (uid,))
            game_conn.commit()

        return created
    finally:
        auth_conn.close()
        game_conn.close()
        quests_conn.close()


@router.get("/{uid}")
def get_user(uid: str):
    # Auto-create profile if this is a new phone/offline user
    _ensure_user_exists(uid)

    auth_conn = get_auth_conn()
    game_conn = get_game_conn()
    try:
        auth_row = auth_conn.execute("SELECT * FROM users WHERE uid=?", (uid,)).fetchone()
        game_row = game_conn.execute("SELECT * FROM character_stats WHERE uid=?", (uid,)).fetchone()

        userData = _build_user_response(auth_row, game_row)
        log.db_log("users", f"Fetched profile for {uid} (level={userData['level']}, xp={userData['xp']})")
        return {"success": True, "userData": userData}
    finally:
        auth_conn.close()
        game_conn.close()


@router.post("/{uid}")
def save_user(uid: str, payload: UserDataPayload):
    """Save the full userData blob — synced from App.tsx. Auto-creates user if missing."""
    # Auto-create profile for any uid we haven't seen before
    _ensure_user_exists(uid, name=payload.name, email=payload.email)

    game_conn = get_game_conn()
    try:
        ud = payload.userData or {}

        game_conn.execute("""
            INSERT INTO character_stats (uid, level, xp, gold, enamel_health, total_stars, selected_char,
                current_streak, best_streak, total_days, completed_chapters)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(uid) DO UPDATE SET
                level=excluded.level, xp=excluded.xp, gold=excluded.gold,
                enamel_health=excluded.enamel_health, total_stars=excluded.total_stars,
                selected_char=excluded.selected_char, current_streak=excluded.current_streak,
                best_streak=excluded.best_streak, total_days=excluded.total_days,
                completed_chapters=excluded.completed_chapters,
                updated_at=datetime('now')
        """, (
            uid,
            ud.get("level", 1), ud.get("xp", 0), ud.get("gold", 0),
            ud.get("enamelHealth", 100), ud.get("totalStars", 0),
            ud.get("selectedCharacter", 1), ud.get("currentStreak", 0),
            ud.get("bestStreak", 0), ud.get("totalDays", 0),
            ud.get("completedChapters", 0)
        ))
        game_conn.commit()

        log.db_log("game",
            f"Saved userData uid={uid} | "
            f"lvl={ud.get('level',1)} xp={ud.get('xp',0)} gold={ud.get('gold',0)} "
            f"streak={ud.get('currentStreak',0)} stars={ud.get('totalStars',0)}"
        )
        return {"success": True}
    finally:
        game_conn.close()


@router.patch("/{uid}/character")
def update_character(uid: str, req: CharacterUpdate):
    _ensure_user_exists(uid)
    conn = get_game_conn()
    try:
        conn.execute("UPDATE character_stats SET selected_char=? WHERE uid=?",
                     (req.selectedCharacter, uid))
        conn.commit()
        log.db_log("game", f"Character updated for {uid} -> char#{req.selectedCharacter}")
        return {"success": True}
    finally:
        conn.close()


@router.patch("/{uid}/settings")
def update_settings(uid: str, req: SettingsUpdate):
    log.db_log("users", f"Settings updated for {uid}")
    return {"success": True}
