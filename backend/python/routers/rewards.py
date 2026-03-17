from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import sys
import os

# Path hack
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_conn
import logger as log

router = APIRouter(prefix="/rewards", tags=["rewards"])

# --- MODELS ---
class AchievementUnlock(BaseModel):
    achievementId: str

class PurchaseRequest(BaseModel):
    itemId: str
    cost: int

# --- ROUTES ---
@router.get("/catalog")
def get_catalog():
    with get_conn("rewards") as conn:
        rows = conn.execute("SELECT * FROM reward_catalog").fetchall()
        return {"success": True, "catalog": [dict(r) for r in rows]}

@router.get("/{uid}")
def get_user_rewards(uid: str):
    with get_conn("rewards") as conn:
        achievements = conn.execute("SELECT achievement_id FROM achievements WHERE uid=?", (uid,)).fetchall()
        unlocked = conn.execute("SELECT reward_id FROM unlocked_rewards WHERE uid=?", (uid,)).fetchall()
        inventory = conn.execute("SELECT * FROM inventory WHERE uid=?", (uid,)).fetchall()
        
    return {
        "success": True,
        "achievements": [r["achievement_id"] for r in achievements],
        "unlockedRewards": [r["reward_id"] for r in unlocked],
        "inventory": [dict(r) for r in inventory]
    }

@router.post("/{uid}/achievement")
def unlock_achievement(uid: str, req: AchievementUnlock):
    with get_conn("rewards") as conn:
        conn.execute("INSERT OR IGNORE INTO achievements (uid, achievement_id) VALUES (?,?)",
                     (uid, req.achievementId))
        conn.commit()
    log.db_log("REWARDS", f"Achievement Unlocked for {uid}: {req.achievementId}", "INFO")
    return {"success": True}

@router.post("/{uid}/purchase")
def purchase_item(uid: str, req: PurchaseRequest):
    # 1. Check gold in game db
    with get_conn("game") as gconn:
        row = gconn.execute("SELECT gold FROM character_stats WHERE uid=?", (uid,)).fetchone()
        if not row or row["gold"] < req.cost:
            log.db_log("REWARDS", f"Purchase Fail: {uid} short on gold for {req.itemId}", "WARN")
            raise HTTPException(400, "Insufficient gold")
        
        # 2. Deduct gold
        gconn.execute("UPDATE character_stats SET gold = gold - ? WHERE uid=?", (req.cost, uid))
        gconn.commit()
        
    # 3. Add to inventory
    with get_conn("rewards") as rconn:
        rconn.execute("""
            INSERT INTO inventory (uid, item_id, quantity)
            VALUES (?,?,1)
            ON CONFLICT(uid, item_id) DO UPDATE SET quantity = quantity + 1
        """, (uid, req.itemId))
        rconn.commit()
        
    log.db_log("REWARDS", f"Purchase Success: {uid} bought {req.itemId} (-{req.cost} gold)", "INFO")
    return {"success": True}

stories_catalog = [
    {"item_id": "sticker_brush", "name": "Golden Brush Sticker", "cost": 50, "type": "sticker"},
    {"item_id": "hat_royal", "name": "Royal Crown", "cost": 500, "type": "cosmetic"},
    {"item_id": "bg_castle", "name": "Enamel Castle Background", "cost": 200, "type": "background"}
]

@router.on_event("startup")
def seed_catalog():
    with get_conn("rewards") as conn:
        for item in stories_catalog:
            conn.execute("""
                INSERT OR IGNORE INTO reward_catalog (item_id, name, cost, type)
                VALUES (?,?,?,?)
            """, (item["item_id"], item["name"], item["cost"], item["type"]))
        conn.commit()
