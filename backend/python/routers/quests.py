<<<<<<< HEAD
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import sys
import os

# Path hack
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_conn
=======
"""
Quests Router
Routes: GET /quests/{uid}, POST /quests/{uid}/progress, POST /quests/{uid}/complete
"""
import os
import sys
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_quests_conn, get_game_conn
>>>>>>> 7202e6ef40987237d747d24a920e2c14e55500f8
import logger as log

router = APIRouter(prefix="/quests", tags=["quests"])

<<<<<<< HEAD
# --- MODELS ---
class QuestProgressUpdate(BaseModel):
    progress: int

# --- ROUTES ---
@router.get("/{uid}")
def get_user_quests(uid: str):
    with get_conn("quests") as conn:
        # Get all definitions
        defs = conn.execute("SELECT * FROM quest_definitions").fetchall()
        # Get user progress
        progress_rows = conn.execute("SELECT * FROM quest_progress WHERE uid=?", (uid,)).fetchall()
        progress_map = {r["quest_id"]: r for r in progress_rows}
        
    quests = []
    for d in defs:
        p = progress_map.get(d["quest_id"])
        quests.append({
            "id": d["quest_id"],
            "title": d["title"],
            "description": d["description"],
            "rewardXp": d["reward_xp"],
            "rewardGold": d["reward_gold"],
            "progress": p["progress"] if p else 0,
            "completed": bool(p["completed"]) if p else False
        })
    return {"success": True, "quests": quests}

@router.post("/{uid}/{quest_id}/progress")
def update_quest_progress(uid: str, quest_id: str, req: QuestProgressUpdate):
    with get_conn("quests") as conn:
        conn.execute("""
            INSERT INTO quest_progress (uid, quest_id, progress)
            VALUES (?,?,?)
            ON CONFLICT(uid, quest_id) DO UPDATE SET progress = EXCLUDED.progress
        """, (uid, quest_id, req.progress))
        conn.commit()
    log.db_log("QUESTS", f"Progress for {uid} on {quest_id} -> {req.progress}%", "INFO")
    return {"success": True}

@router.post("/{uid}/{quest_id}/complete")
def complete_quest(uid: str, quest_id: str):
    with get_conn("quests") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM quest_definitions WHERE quest_id=?", (quest_id,))
        qdef = cursor.fetchone()
        if not qdef:
            raise HTTPException(404, "Quest not found")
            
        cursor.execute("""
            INSERT INTO quest_progress (uid, quest_id, progress, completed)
            VALUES (?,?,100,1)
            ON CONFLICT(uid, quest_id) DO UPDATE SET progress = 100, completed = 1
        """, (uid, quest_id))
        conn.commit()
        
    # Reward XP and Gold in game db
    with get_conn("game") as gconn:
        gconn.execute("UPDATE character_stats SET xp = xp + ?, gold = gold + ? WHERE uid=?",
                      (qdef["reward_xp"], qdef["reward_gold"], uid))
        gconn.commit()
        
    log.db_log("QUESTS", f"Quest COMPLETED by {uid}: {quest_id} (+{qdef['reward_xp']}XP)", "INFO")
    return {"success": True, "rewards": {"xp": qdef["reward_xp"], "gold": qdef["reward_gold"]}}

# Seeds
default_quests = [
    {"id": "daily_brush_1", "title": "Breakfast Brushing", "desc": "Brush your teeth after breakfast.", "xp": 50, "gold": 10},
    {"id": "daily_brush_2", "title": "Night Guard", "desc": "Brush your teeth before bed.", "xp": 50, "gold": 10},
    {"id": "chapter_explorer", "title": "Explorer", "desc": "Complete any chapter level.", "xp": 100, "gold": 25}
]

@router.on_event("startup")
def seed_quests():
    with get_conn("quests") as conn:
        for q in default_quests:
            conn.execute("""
                INSERT OR IGNORE INTO quest_definitions (quest_id, title, description, reward_xp, reward_gold)
                VALUES (?,?,?,?,?)
            """, (q["id"], q["title"], q["desc"], q["xp"], q["gold"]))
        conn.commit()
=======

class QuestProgressRequest(BaseModel):
    quest_id: str
    increment: Optional[int] = 1


class QuestCompleteRequest(BaseModel):
    quest_id: str


def _ensure_daily_quests(uid: str):
    """Assign today's daily quests to the user if not already assigned."""
    conn = get_quests_conn()
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        quests = conn.execute("SELECT quest_id FROM quest_definitions WHERE quest_type='daily'").fetchall()
        for q in quests:
            conn.execute(
                "INSERT OR IGNORE INTO quest_progress (uid, quest_id, assigned_date) VALUES (?,?,?)",
                (uid, q["quest_id"], today)
            )
        conn.commit()
    finally:
        conn.close()


@router.get("/{uid}")
def get_quests(uid: str):
    _ensure_daily_quests(uid)
    conn = get_quests_conn()
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        rows = conn.execute("""
            SELECT qp.*, qd.title, qd.description, qd.target_count, qd.xp_reward,
                   qd.gold_reward, qd.icon, qd.quest_type
            FROM quest_progress qp
            JOIN quest_definitions qd ON qp.quest_id = qd.quest_id
            WHERE qp.uid=? AND (qp.assigned_date=? OR qd.quest_type='weekly')
            ORDER BY qp.completed ASC, qd.quest_type
        """, (uid, today)).fetchall()

        active, completed = [], []
        for r in rows:
            q = {
                "questId": r["quest_id"], "title": r["title"], "description": r["description"],
                "currentCount": r["current_count"], "targetCount": r["target_count"],
                "xpReward": r["xp_reward"], "goldReward": r["gold_reward"],
                "icon": r["icon"], "type": r["quest_type"]
            }
            (completed if r["completed"] else active).append(q)

        return {"success": True, "activeQuests": active, "completedQuests": completed}
    finally:
        conn.close()


@router.post("/{uid}/progress")
def update_quest_progress(uid: str, req: QuestProgressRequest):
    conn = get_quests_conn()
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        row = conn.execute("""
            SELECT qp.*, qd.target_count, qd.xp_reward, qd.gold_reward
            FROM quest_progress qp
            JOIN quest_definitions qd ON qp.quest_id = qd.quest_id
            WHERE qp.uid=? AND qp.quest_id=? AND (qp.assigned_date=? OR qd.quest_type='weekly') AND qp.completed=0
        """, (uid, req.quest_id, today)).fetchone()

        if not row:
            return {"success": True, "message": "Quest not found or already completed"}

        new_count = row["current_count"] + req.increment
        completed = new_count >= row["target_count"]

        conn.execute("""
            UPDATE quest_progress SET current_count=?, completed=?, completed_at=?
            WHERE uid=? AND quest_id=? AND assigned_date=?
        """, (new_count, 1 if completed else 0,
              datetime.now().isoformat() if completed else None,
              uid, req.quest_id, row["assigned_date"]))
        conn.commit()

        result = {"success": True, "currentCount": new_count, "completed": completed}
        if completed:
            result["xpReward"] = row["xp_reward"]
            result["goldReward"] = row["gold_reward"]
            log.db_log("quests", f"Quest [{req.quest_id}] completed by {uid}! +{row['xp_reward']} XP +{row['gold_reward']} gold")

        return result
    finally:
        conn.close()


@router.post("/{uid}/complete")
def complete_quest(uid: str, req: QuestCompleteRequest):
    conn = get_quests_conn()
    g_conn = get_game_conn()
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        row = conn.execute("""
            SELECT qp.*, qd.xp_reward, qd.gold_reward
            FROM quest_progress qp
            JOIN quest_definitions qd ON qp.quest_id = qd.quest_id
            WHERE qp.uid=? AND qp.quest_id=? AND (qp.assigned_date=? OR qd.quest_type='weekly')
        """, (uid, req.quest_id, today)).fetchone()

        if not row:
            raise HTTPException(404, "Quest not found")

        if not row["completed"]:
            conn.execute("""
                UPDATE quest_progress SET completed=1, current_count=target_count, completed_at=datetime('now')
                WHERE uid=? AND quest_id=? AND assigned_date=?
            """, (uid, req.quest_id, row["assigned_date"]))
            conn.commit()

        # Award XP + Gold
        g_conn.execute(
            "UPDATE character_stats SET xp=xp+?, gold=gold+? WHERE uid=?",
            (row["xp_reward"], row["gold_reward"], uid)
        )
        g_conn.commit()

        log.db_log("quests", f"Quest [{req.quest_id}] rewards claimed by {uid}: +{row['xp_reward']} XP, +{row['gold_reward']} gold")
        return {"success": True, "xpEarned": row["xp_reward"], "goldEarned": row["gold_reward"]}
    finally:
        conn.close()
        g_conn.close()
>>>>>>> 7202e6ef40987237d747d24a920e2c14e55500f8
