from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import sys
import os

# Path hack
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_conn
import logger as log

router = APIRouter(prefix="/quests", tags=["quests"])

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
