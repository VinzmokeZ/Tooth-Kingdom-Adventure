from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import sys
import os
from datetime import datetime

# Path hack
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_conn
import logger as log

router = APIRouter(prefix="/game", tags=["game"])

# --- MODELS ---
class BrushingLog(BaseModel):
    date: str
    duration: int
    quality: int
    xp: int
    gold: int

class ChapterComplete(BaseModel):
    chapterId: int
    chapterName: str
    stars: int
    score: int

class XPUpdate(BaseModel):
    xpRaw: int
    level: int
    gold: int

class VRSession(BaseModel):
    duration: int
    sugarBugsCaught: int

# --- ROUTES ---
@router.post("/{uid}/brushing-log")
def add_brushing_log(uid: str, log_data: BrushingLog):
    with get_conn("game") as conn:
        conn.execute("""
            INSERT INTO brushing_logs (uid, session_date, duration_seconds, quality_score, xp_earned, gold_earned)
            VALUES (?,?,?,?,?,?)
        """, (uid, log_data.date, log_data.duration, log_data.quality, log_data.xp, log_data.gold))
        conn.commit()
    log.db_log("GAME", f"Log added for {uid}: {log_data.duration}s brushing", "INFO")
    return {"success": True}

@router.get("/{uid}/brushing-logs")
def get_brushing_logs(uid: str):
    with get_conn("game") as conn:
        rows = conn.execute("SELECT * FROM brushing_logs WHERE uid=? ORDER BY created_at DESC", (uid,)).fetchall()
        logs = [dict(r) for r in rows]
    return {"success": True, "logs": logs}

@router.post("/{uid}/chapter-complete")
def chapter_complete(uid: str, req: ChapterComplete):
    with get_conn("game") as conn:
        cursor = conn.cursor()
        # Update or Insert chapter progress
        cursor.execute("""
            INSERT INTO chapter_progress (uid, chapter_id, chapter_name, stars_earned, score, completed)
            VALUES (?,?,?,?,?,1)
            ON CONFLICT(uid, chapter_id) DO UPDATE SET
                stars_earned = MAX(stars_earned, EXCLUDED.stars_earned),
                score = MAX(score, EXCLUDED.score),
                attempts = attempts + 1
        """, (uid, req.chapterId, req.chapterName, req.stars, req.score))
        
        # Increment total completed chapters in stats
        cursor.execute("UPDATE character_stats SET completed_chapters = completed_chapters + 1 WHERE uid=?", (uid,))
        conn.commit()
        
    log.db_log("GAME", f"Chapter {req.chapterId} completed by {uid} stars={req.stars}", "INFO")
    return {"success": True}

@router.post("/{uid}/xp")
def update_xp(uid: str, req: XPUpdate):
    with get_conn("game") as conn:
        conn.execute("""
            UPDATE character_stats SET xp=?, level=?, gold=?, updated_at=DATETIME('now')
            WHERE uid=?
        """, (req.xpRaw, req.level, req.gold, uid))
        conn.commit()
    log.db_log("GAME", f"XP Sync for {uid}: lv={req.level} xp={req.xpRaw}", "INFO")
    return {"success": True}

@router.post("/{uid}/vr-session")
def vr_session(uid: str, req: VRSession):
    # VR sessions can be logged or used to trigger special rewards
    log.db_log("GAME", f"VR Session for {uid}: {req.sugarBugsCaught} bugs caught", "INFO")
    return {"success": True, "reward_multiplier": 1.5}
