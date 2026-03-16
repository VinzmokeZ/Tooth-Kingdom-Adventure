"""
Game Router
Routes: stats, XP, chapter progress, brushing logs, VR sessions
"""
import os
import sys
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_game_conn
import logger as log

router = APIRouter(prefix="/game", tags=["game"])

# XP thresholds for each level (cumulative XP needed)
LEVEL_XP_TABLE = [0, 0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200]


def _ensure_stats(conn, uid: str):
    """Guarantee a character_stats row exists for any uid."""
    conn.execute("INSERT OR IGNORE INTO character_stats (uid) VALUES (?)", (uid,))
    conn.commit()


def _get_level_for_xp(xp: int) -> int:
    level = 1
    for lvl, threshold in enumerate(LEVEL_XP_TABLE):
        if xp >= threshold:
            level = lvl
    return min(level, 10)


class XPRequest(BaseModel):
    amount: int
    reason: Optional[str] = "general"


class ChapterCompleteRequest(BaseModel):
    chapter_id: int
    chapter_name: Optional[str] = None
    stars: Optional[int] = 3
    score: Optional[int] = 100


class BrushingLogRequest(BaseModel):
    session_date: Optional[str] = None
    duration_seconds: Optional[int] = 120
    quality_score: Optional[int] = 80


class VRSessionRequest(BaseModel):
    session_type: Optional[str] = "brushing_quest"
    duration_seconds: Optional[int] = 120
    score: Optional[int] = 100


@router.get("/{uid}/stats")
def get_stats(uid: str):
    conn = get_game_conn()
    try:
        _ensure_stats(conn, uid)  # auto-create if phone/offline user
        row = conn.execute("SELECT * FROM character_stats WHERE uid=?", (uid,)).fetchone()
        return {
            "success": True,
            "stats": {
                "level": row["level"], "xp": row["xp"], "gold": row["gold"],
                "enamelHealth": row["enamel_health"], "totalStars": row["total_stars"],
                "currentStreak": row["current_streak"], "bestStreak": row["best_streak"],
                "totalDays": row["total_days"], "completedChapters": row["completed_chapters"],
                "selectedCharacter": row["selected_char"]
            }
        }
    finally:
        conn.close()


@router.post("/{uid}/xp")
def add_xp(uid: str, req: XPRequest):
    conn = get_game_conn()
    try:
        row = conn.execute("SELECT xp, level FROM character_stats WHERE uid=?", (uid,)).fetchone()
        if not row:
            conn.execute("INSERT INTO character_stats (uid) VALUES (?)", (uid,))
            current_xp, current_level = 0, 1
        else:
            current_xp, current_level = row["xp"], row["level"]

        new_xp = current_xp + req.amount
        new_level = _get_level_for_xp(new_xp)
        leveled_up = new_level > current_level

        conn.execute(
            "UPDATE character_stats SET xp=?, level=?, updated_at=datetime('now') WHERE uid=?",
            (new_xp, new_level, uid)
        )
        conn.commit()
        log.db_log("game", f"+{req.amount} XP for {uid} (reason: {req.reason}) -> total: {new_xp} | level: {new_level}")
        return {"success": True, "xp": new_xp, "level": new_level, "leveledUp": leveled_up}
    finally:
        conn.close()


@router.post("/{uid}/chapter-complete")
def complete_chapter(uid: str, req: ChapterCompleteRequest):
    conn = get_game_conn()
    try:
        _ensure_stats(conn, uid)
        existing = conn.execute(
            "SELECT * FROM chapter_progress WHERE uid=? AND chapter_id=?",
            (uid, req.chapter_id)
        ).fetchone()

        if existing:
            conn.execute("""
                UPDATE chapter_progress SET stars_earned=MAX(stars_earned,?), score=MAX(score,?),
                    completed=1, attempts=attempts+1, completed_at=datetime('now')
                WHERE uid=? AND chapter_id=?
            """, (req.stars, req.score, uid, req.chapter_id))
        else:
            conn.execute("""
                INSERT INTO chapter_progress (uid, chapter_id, chapter_name, stars_earned, score, completed, completed_at, attempts)
                VALUES (?,?,?,?,?,1,datetime('now'),1)
            """, (uid, req.chapter_id, req.chapter_name, req.stars, req.score))

        # Award based on stars
        gold_award = req.stars * 20
        conn.execute("""
            UPDATE character_stats
            SET gold=gold+?, total_stars=total_stars+?,
                completed_chapters=(SELECT COUNT(*) FROM chapter_progress WHERE uid=? AND completed=1),
                updated_at=datetime('now')
            WHERE uid=?
        """, (gold_award, req.stars, uid, uid))
        conn.commit()

        log.db_log("game", f"Chapter {req.chapter_id} complete for {uid}: {req.stars} stars, +{gold_award} gold")
        return {"success": True, "goldAwarded": gold_award, "starsAwarded": req.stars}
    finally:
        conn.close()


@router.post("/{uid}/brushing-log")
def log_brushing(uid: str, req: BrushingLogRequest):
    conn = get_game_conn()
    try:
        _ensure_stats(conn, uid)
        session_date = req.session_date or datetime.now().strftime("%Y-%m-%d")
        xp_earned = min(int(req.quality_score * 0.5) + 25, 100)
        gold_earned = 10

        # Check if already logged today
        existing = conn.execute(
            "SELECT id FROM brushing_logs WHERE uid=? AND session_date=?",
            (uid, session_date)
        ).fetchone()

        if not existing:
            conn.execute("""
                INSERT INTO brushing_logs (uid, session_date, duration_seconds, quality_score, xp_earned, gold_earned)
                VALUES (?,?,?,?,?,?)
            """, (uid, session_date, req.duration_seconds, req.quality_score, xp_earned, gold_earned))

            # Update streak and totals
            conn.execute("""
                UPDATE character_stats
                SET gold=gold+?, total_days=total_days+1,
                    current_streak=current_streak+1,
                    best_streak=MAX(best_streak, current_streak+1),
                    updated_at=datetime('now')
                WHERE uid=?
            """, (gold_earned, uid))
            conn.commit()
            log.db_log("game", f"Brushing logged for {uid}: {session_date} ({req.duration_seconds}s, quality={req.quality_score})")
        else:
            log.db_log("game", f"Brushing already logged for {uid} on {session_date}")

        return {"success": True, "xpEarned": xp_earned, "goldEarned": gold_earned, "date": session_date}
    finally:
        conn.close()


@router.get("/{uid}/brushing-logs")
def get_brushing_logs(uid: str, limit: int = 30):
    conn = get_game_conn()
    try:
        rows = conn.execute(
            "SELECT * FROM brushing_logs WHERE uid=? ORDER BY session_date DESC LIMIT ?",
            (uid, limit)
        ).fetchall()
        logs = [{"date": r["session_date"], "duration": r["duration_seconds"],
                 "quality": r["quality_score"], "xp": r["xp_earned"]} for r in rows]
        return {"success": True, "logs": logs}
    finally:
        conn.close()


@router.post("/{uid}/vr-session")
def log_vr_session(uid: str, req: VRSessionRequest):
    conn = get_game_conn()
    try:
        _ensure_stats(conn, uid)
        xp_bonus = 50
        conn.execute(
            "UPDATE character_stats SET xp=xp+?, gold=gold+10, updated_at=datetime('now') WHERE uid=?",
            (xp_bonus, uid)
        )
        conn.commit()
        log.db_log("game", f"VR session logged for {uid}: +{xp_bonus} XP bonus")
        return {"success": True, "xpBonus": xp_bonus, "message": "VR Brushing Quest Complete!"}
    finally:
        conn.close()


@router.get("/{uid}/chapter-progress")
def get_chapter_progress(uid: str):
    conn = get_game_conn()
    try:
        rows = conn.execute(
            "SELECT * FROM chapter_progress WHERE uid=? ORDER BY chapter_id",
            (uid,)
        ).fetchall()
        progress = [{
            "chapterId": r["chapter_id"], "chapterName": r["chapter_name"],
            "stars": r["stars_earned"], "score": r["score"],
            "completed": bool(r["completed"]), "attempts": r["attempts"]
        } for r in rows]
        return {"success": True, "progress": progress}
    finally:
        conn.close()
