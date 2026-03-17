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
Rewards Router
Routes: achievements, unlocked rewards, inventory, reward catalog
"""
import os
import sys
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_rewards_conn, get_game_conn
>>>>>>> 7202e6ef40987237d747d24a920e2c14e55500f8
import logger as log

router = APIRouter(prefix="/rewards", tags=["rewards"])

<<<<<<< HEAD
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
=======

@router.get("/catalog")
def get_catalog():
    conn = get_rewards_conn()
    try:
        rows = conn.execute("SELECT * FROM reward_catalog ORDER BY unlock_level, cost_gold").fetchall()
        return {
            "success": True,
            "catalog": [{
                "id": r["reward_id"], "name": r["name"], "description": r["description"],
                "type": r["reward_type"], "costGold": r["cost_gold"],
                "unlockLevel": r["unlock_level"], "imageKey": r["image_key"]
            } for r in rows]
        }
    finally:
        conn.close()


class AchievementRequest(BaseModel):
    achievement_id: str
    name: Optional[str] = None
    description: Optional[str] = None
    xp_reward: Optional[int] = 50


class UnlockRewardRequest(BaseModel):
    reward_id: str
    reward_name: Optional[str] = None
    reward_type: Optional[str] = "cosmetic"


class PurchaseRequest(BaseModel):
    reward_id: str


@router.get("/{uid}")
def get_rewards(uid: str):
    conn = get_rewards_conn()
    try:
        achievements = conn.execute(
            "SELECT * FROM achievements WHERE uid=? ORDER BY unlocked_at DESC", (uid,)
        ).fetchall()
        unlocked = conn.execute(
            "SELECT * FROM unlocked_rewards WHERE uid=? ORDER BY unlocked_at DESC", (uid,)
        ).fetchall()
        inventory = conn.execute(
            "SELECT * FROM inventory WHERE uid=? ORDER BY acquired_at DESC", (uid,)
        ).fetchall()

        return {
            "success": True,
            "achievements": [{"id": r["achievement_id"], "name": r["name"],
                               "description": r["description"], "xpReward": r["xp_reward"],
                               "unlockedAt": r["unlocked_at"]} for r in achievements],
            "unlockedRewards": [{"id": r["reward_id"], "name": r["reward_name"],
                                  "type": r["reward_type"], "unlockedAt": r["unlocked_at"]} for r in unlocked],
            "inventory": [{"id": r["item_id"], "name": r["item_name"],
                            "type": r["item_type"], "quantity": r["quantity"]} for r in inventory]
        }
    finally:
        conn.close()


@router.post("/{uid}/achievement")
def unlock_achievement(uid: str, req: AchievementRequest):
    conn = get_rewards_conn()
    game_conn = get_game_conn()
    try:
        existing = conn.execute(
            "SELECT id FROM achievements WHERE uid=? AND achievement_id=?",
            (uid, req.achievement_id)
        ).fetchone()

        if existing:
            return {"success": True, "alreadyUnlocked": True}

        conn.execute("""
            INSERT INTO achievements (uid, achievement_id, name, description, xp_reward)
            VALUES (?,?,?,?,?)
        """, (uid, req.achievement_id, req.name, req.description, req.xp_reward))
        conn.commit()

        # Award XP
        if req.xp_reward:
            game_conn.execute(
                "UPDATE character_stats SET xp=xp+? WHERE uid=?", (req.xp_reward, uid)
            )
            game_conn.commit()

        log.db_log("rewards", f"Achievement [{req.achievement_id}] unlocked for {uid}: +{req.xp_reward} XP")
        return {"success": True, "alreadyUnlocked": False, "xpAwarded": req.xp_reward}
    finally:
        conn.close()
        game_conn.close()


@router.post("/{uid}/unlock")
def unlock_reward(uid: str, req: UnlockRewardRequest):
    conn = get_rewards_conn()
    try:
        conn.execute("""
            INSERT OR IGNORE INTO unlocked_rewards (uid, reward_id, reward_name, reward_type)
            VALUES (?,?,?,?)
        """, (uid, req.reward_id, req.reward_name, req.reward_type))
        conn.commit()
        log.db_log("rewards", f"Reward [{req.reward_id}] unlocked for {uid}")
        return {"success": True}
    finally:
        conn.close()


@router.post("/{uid}/purchase")
def purchase_item(uid: str, req: PurchaseRequest):
    """Buy an item from the Kingdom Bazaar using gold."""
    r_conn = get_rewards_conn()
    g_conn = get_game_conn()
    try:
        catalog_item = r_conn.execute(
            "SELECT * FROM reward_catalog WHERE reward_id=?", (req.reward_id,)
        ).fetchone()
        if not catalog_item:
            raise HTTPException(404, "Item not found in catalog")

        stats = g_conn.execute("SELECT gold, level FROM character_stats WHERE uid=?", (uid,)).fetchone()
        if not stats:
            raise HTTPException(404, "Player stats not found")

        if catalog_item["unlock_level"] > stats["level"]:
            raise HTTPException(403, f"Requires level {catalog_item['unlock_level']}")

        if stats["gold"] < catalog_item["cost_gold"]:
            raise HTTPException(400, f"Not enough gold. Need {catalog_item['cost_gold']}, have {stats['gold']}")

        # Deduct gold
        g_conn.execute("UPDATE character_stats SET gold=gold-? WHERE uid=?",
                       (catalog_item["cost_gold"], uid))
        g_conn.commit()

        # Add to inventory
        r_conn.execute("""
            INSERT OR IGNORE INTO inventory (uid, item_id, item_name, item_type)
            VALUES (?,?,?,?)
        """, (uid, req.reward_id, catalog_item["name"], catalog_item["reward_type"]))
        r_conn.commit()

        log.db_log("rewards", f"Purchase: {uid} bought [{req.reward_id}] for {catalog_item['cost_gold']} gold")
        return {"success": True, "item": catalog_item["name"], "goldSpent": catalog_item["cost_gold"]}
    finally:
        r_conn.close()
        g_conn.close()


>>>>>>> 7202e6ef40987237d747d24a920e2c14e55500f8
