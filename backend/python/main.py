"""
Tooth Kingdom Adventure - Main Backend Server
FastAPI + SQLite | Port 8010
Covers: Auth, Users, Game, Rewards, Quests, Social, AI
"""
import os
import sys
import time
import json
import sqlite3
import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn
import smtplib
from email.message import EmailMessage
import logger as log

# --- CONFIG & PATHS ---
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "tooth_kingdom_secret_v3_2026")
ALGORITHM = "HS256"

# --- DB ENGINE (Unified) ---
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Users & Auth
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            uid TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'hero',
            dob TEXT,
            phone TEXT,
            provider TEXT DEFAULT 'local',
            provider_id TEXT,
            avatar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    # Game Stats
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS game_stats (
            uid TEXT PRIMARY KEY,
            level INTEGER DEFAULT 1,
            xp INTEGER DEFAULT 0,
            gold INTEGER DEFAULT 0,
            enamel_health INTEGER DEFAULT 100,
            current_streak INTEGER DEFAULT 0,
            last_brush_date TEXT,
            selected_character INTEGER DEFAULT 1,
            completed_chapters TEXT DEFAULT '[]',
            FOREIGN KEY(uid) REFERENCES users(uid)
        )
    """)
    # Brushing Logs
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS brushing_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT,
            session_date TEXT,
            duration_seconds INTEGER,
            quality_score INTEGER,
            xp_earned INTEGER,
            gold_earned INTEGER,
            FOREIGN KEY(uid) REFERENCES users(uid)
        )
    """)
    # Quests & Progress
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS daily_quests (
            quest_id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            requirement INTEGER,
            reward_xp INTEGER,
            reward_gold INTEGER
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_quests (
            uid TEXT,
            quest_id TEXT,
            progress INTEGER DEFAULT 0,
            completed BOOLEAN DEFAULT 0,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(uid, quest_id),
            FOREIGN KEY(uid) REFERENCES users(uid),
            FOREIGN KEY(quest_id) REFERENCES daily_quests(quest_id)
        )
    """)
    # Rewards & Inventory
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS inventory (
            uid TEXT,
            item_id TEXT,
            quantity INTEGER DEFAULT 1,
            purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(uid, item_id),
            FOREIGN KEY(uid) REFERENCES users(uid)
        )
    """)
    # AI History
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ai_chat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT,
            role TEXT,
            content TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(uid) REFERENCES users(uid)
        )
    """)
    # Relations (Parent-Child, Teacher-Student)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_relations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            parent_uid TEXT,
            child_uid TEXT,
            relation_type TEXT, -- 'parent_child' or 'teacher_student'
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(parent_uid, child_uid, relation_type)
        )
    """)
    # Rewards Tracking
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS unlocked_rewards (
            uid TEXT,
            reward_id TEXT,
            unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (uid, reward_id)
        )
    """)
    # 11. Notifications / Reminders
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_uid TEXT,
            receiver_uid TEXT,
            message TEXT,
            type TEXT,
            status TEXT DEFAULT 'unread',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()
    log.db_log("SYSTEM", "Unified Database Schema v3.0 initialized.", "INFO")

# --- MODELS ---
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    dob: Optional[str] = None
    role: Optional[str] = "hero"
    phone: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class GameSyncRequest(BaseModel):
    level: int
    xp: int
    gold: int
    enamel_health: int
    current_streak: int

class SyncRequest(BaseModel):
    uid: str
    email: str
    name: Optional[str] = "G-Hero"
    avatar_url: Optional[str] = None
    provider: Optional[str] = "google"

class PhoneAuthRequest(BaseModel):
    phone: str

class ReminderRequest(BaseModel):
    sender_uid: str
    receiver_uid: str
    message: Optional[str] = "Time to brush! 🦷✨"
    type: Optional[str] = "reminder"

class DebugLogRequest(BaseModel):
    message: str

class AIRequest(BaseModel):
    text: str

class OTPRequest(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    otp: str

class LinkRequest(BaseModel):
    parent_uid: str
    child_identifier: str
    relation_type: str

class UserProfileUpdate(BaseModel):
    userData: Optional[Dict[str, Any]] = None
    name: Optional[str] = None
    email: Optional[str] = None

# --- SECURITY ---
def hash_pw(pw: str) -> str:
    # Truncate to 72 bytes for bcrypt safety
    return bcrypt.hashpw(pw.encode('utf-8')[:72], bcrypt.gensalt()).decode('utf-8')

def check_pw(pw: str, hashed: str) -> bool:
    return bcrypt.checkpw(pw.encode('utf-8')[:72], hashed.encode('utf-8'))

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- APP SETUP ---
app = FastAPI(title="Tooth Kingdom Adventure - Solid Backend v4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = int((time.time() - start) * 1000)
    log.api_log(request.method, request.url.path, response.status_code, duration)
    return response

def send_email_otp(target_email: str, otp: str):
    smtp_user = os.getenv("SMTP_EMAIL")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    
    if not smtp_user or not smtp_pass:
        log.db_log("OTP_SERVICE", f"SKIP REAL EMAIL: SMTP credentials missing in .env", "WARNING")
        return False

    try:
        msg = EmailMessage()
        msg.set_content(f"Your Tooth Kingdom Adventure verification code is: {otp}\n\nDo not share this code with anyone.")
        msg["Subject"] = "Tooth Kingdom Verification Code"
        msg["From"] = smtp_user
        msg["To"] = target_email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(smtp_user, smtp_pass)
            smtp.send_message(msg)
        
        log.db_log("OTP_SERVICE", f"REAL EMAIL SENT to {target_email}", "INFO")
        return True
    except Exception as e:
        log.db_log("OTP_SERVICE", f"FAILED to send real email to {target_email}: {e}", "ERROR")
        return False

@app.post("/auth/send-otp")
def send_otp(req: OTPRequest):
    phone = req.phone
    otp = req.otp
    email = req.email
    
    # Try to find user email if only phone provided
    if phone and not email and phone != "LOCAL":
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        user = conn.execute("SELECT email FROM users WHERE phone = ?", (phone,)).fetchone()
        conn.close()
        if user: 
            email = user['email']
            log.db_log("OTP_SERVICE", f"Found linked email {email} for phone {phone}", "INFO")

    print("\n" + "="*60)
    print(f"   [OTP REQUEST]  ID: {phone or email}")
    print(f"   [OTP REQUEST]  CODE: {otp}")
    print(f"   [OTP REQUEST]  EMAIL TARGET: {email or 'NONE'}")
    print("="*60 + "\n")

    if email:
        log.db_log("OTP_SERVICE", f"Attempting Real Email delivery to {email}", "INFO")
        success = send_email_otp(email, otp)
        if success:
            return {"success": True, "message": "Email sent"}
        else:
            return {"success": False, "message": "Email failed"}
    
    log.db_log("OTP_SERVICE", f"SMS Simulation ONLY for {phone}", "WARNING")
    return {"success": True, "message": "SMS Simulated"}

@app.post("/debug/log")
def debug_log(req: DebugLogRequest):
    log.db_log("DEBUG", req.message, "INFO")

@app.post("/auth/phone")
def auth_phone(req: PhoneAuthRequest):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        user = conn.execute("SELECT * FROM users WHERE phone = ?", (req.phone,)).fetchone()
        if not user:
            uid = f"phone_{int(time.time())}"
            conn.execute("INSERT INTO users (uid, name, phone, role, provider) VALUES (?,?,?,?,?)",
                         (uid, "Phone Hero", req.phone, "hero", "phone"))
            conn.execute("INSERT OR IGNORE INTO game_stats (uid) VALUES (?)", (uid,))
            conn.commit()
            user = conn.execute("SELECT * FROM users WHERE uid = ?", (uid,)).fetchone()
            log.db_log("AUTH", f"New phone user: {req.phone}", "INFO")
        else:
            log.db_log("AUTH", f"Phone login: {req.phone}", "INFO")
        
        token = create_token({"uid": user['uid'], "phone": req.phone})
        return {"success": True, "token": token, "user": dict(user)}
    except Exception as e:
        log.db_log("AUTH", f"Phone auth failed: {e}", "ERROR")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/users/{uid}")
def update_profile(uid: str, req: UserProfileUpdate):
    conn = sqlite3.connect(DB_PATH)
    try:
        # Update name/email if provided
        if req.name or req.email:
            conn.execute("UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE uid = ?",
                         (req.name, req.email, uid))
        
        # Save nested userData to game_stats if provided
        if req.userData:
            lvl = req.userData.get("level", 1)
            xp = req.userData.get("xp", 0)
            gold = req.userData.get("gold", 0)
            hp = req.userData.get("enamelHealth", 100)
            char_id = req.userData.get("selectedCharacter", 1)
            streak = req.userData.get("currentStreak", 0)
            
            conn.execute("""
                UPDATE game_stats SET 
                    level = ?, xp = ?, gold = ?, enamel_health = ?,
                    selected_character = ?, current_streak = ?,
                    completed_chapters = ?
                WHERE uid = ?
            """, (lvl, xp, gold, hp, char_id, streak, json.dumps(req.userData.get("completedChapters", [])), uid))
            
        conn.commit()
        log.db_log("USERS", f"Updated profile for {uid} (Sync)", "INFO")
        return {"success": True}
    except Exception as e:
        log.db_log("USERS", f"Update failed for {uid}: {e}", "ERROR")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# --- AUTH ROUTES ---
@app.post("/auth/sync")
def sync_firebase_user(req: SyncRequest):
    """Bridges Firebase Auth with Local Python Persistence"""
    conn = sqlite3.connect(DB_PATH)
    try:
        # 1. Upsert User
        conn.execute("""
            INSERT INTO users (uid, name, email, avatar_url, provider)
            VALUES (?,?,?,?,?)
            ON CONFLICT(uid) DO UPDATE SET
                name = excluded.name,
                avatar_url = excluded.avatar_url,
                provider = excluded.provider
        """, (req.uid, req.name, req.email, req.avatar_url, req.provider))
        
        # 2. Ensure Game Stats exist
        conn.execute("INSERT OR IGNORE INTO game_stats (uid) VALUES (?)", (req.uid,))
        conn.commit()
        
        log.db_log("SYNC", f"Firebase user synced: {req.email} ({req.provider})", "INFO")
        return {"success": True, "uid": req.uid}
    except Exception as e:
        log.db_log("SYNC", f"Sync failed for {req.email}: {e}", "ERROR")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/auth/register")
def register(req: RegisterRequest):
    uid = f"local_{int(time.time())}"
    hashed = hash_pw(req.password)
    conn = sqlite3.connect(DB_PATH)
    try:
        # CHECK PHONE UNIQUENESS
        if req.phone:
            exists = conn.execute("SELECT uid FROM users WHERE phone = ?", (req.phone,)).fetchone()
            if exists:
                log.db_log("AUTH", f"Registration failed: Phone {req.phone} already exists", "ERROR")
                raise HTTPException(status_code=400, detail="Phone number already registered")

        conn.execute("INSERT INTO users (uid, name, email, password, role, dob, phone) VALUES (?,?,?,?,?,?,?)",
                     (uid, req.name, req.email, hashed, req.role, req.dob, req.phone))
        conn.execute("INSERT INTO game_stats (uid) VALUES (?)", (uid,))
        conn.commit()
        log.db_log("AUTH", f"User registered: {req.email} (uid: {uid})", "INFO")
        return {"success": True, "token": create_token({"uid": uid, "email": req.email}), "user": {"uid": uid, "name": req.name, "email": req.email, "role": req.role}}
    except sqlite3.IntegrityError:
        log.db_log("AUTH", f"Registration failed: {req.email} already exists", "ERROR")
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        log.db_log("AUTH", f"Registration failed for {req.email}: {e}", "ERROR")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
    finally:
        conn.close()

@app.post("/auth/login")
def login(req: LoginRequest):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    user = conn.execute("SELECT * FROM users WHERE email = ?", (req.email,)).fetchone()
    conn.close()
    
    if user and check_pw(req.password, user['password']):
        log.db_log("AUTH", f"User logged in: {req.email}", "INFO")
        token = create_token({"uid": user['uid'], "email": user['email']})
        return {"success": True, "token": token, "user": dict(user)}
    
    log.db_log("AUTH", f"Login failed: {req.email}", "ERROR")
    raise HTTPException(status_code=401, detail="Invalid credentials")

# --- USER & GAME ROUTES ---
@app.get("/users/{uid}")
def get_profile(uid: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    user = conn.execute("SELECT name, email, role, dob, avatar_url FROM users WHERE uid = ?", (uid,)).fetchone()
    stats = conn.execute("SELECT * FROM game_stats WHERE uid = ?", (uid,)).fetchone()
    conn.close()
    
    if not user:
        # Auto-create profile if missing (helps with offline migration)
        log.db_log("USERS", f"Auto-creating missing profile for {uid}", "INFO")
        conn = sqlite3.connect(DB_PATH)
        conn.execute("INSERT OR IGNORE INTO users (uid, name, role) VALUES (?,?,?)", (uid, "Guest Hero", "hero"))
        conn.execute("INSERT OR IGNORE INTO game_stats (uid) VALUES (?)", (uid,))
        conn.commit()
        conn.close()
        return {"uid": uid, "name": "Guest Hero", "role": "hero", "gameStats": {"level": 1, "xp": 0, "gold": 0}}
        
    res = dict(user)
    res["gameStats"] = dict(stats) if stats else {}
    
    # Fetch recent notifications
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    notes = conn.execute("SELECT id, message, type, status, created_at FROM notifications WHERE receiver_uid = ? ORDER BY created_at DESC LIMIT 10", (uid,)).fetchall()
    res["notifications"] = [dict(n) for n in notes]
    conn.close()
    
    log.db_log("USERS", f"Fetched profile for {uid} with {len(notes)} notifications", "INFO")
    return res

@app.post("/game/{uid}/sync")
def sync_game(uid: str, req: GameSyncRequest):
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        UPDATE game_stats SET level=?, xp=?, gold=?, enamel_health=?, current_streak=?
        WHERE uid = ?
    """, (req.level, req.xp, req.gold, req.enamel_health, req.current_streak, uid))
    conn.commit()
    conn.close()
    log.db_log("GAME", f"Synced stats for {uid} | level={req.level} xp={req.xp}", "INFO")
    return {"success": True}

@app.post("/game/{uid}/xp")
def add_xp(uid: str, req: Dict[str, Any]):
    amount = req.get('amount', 0)
    conn = sqlite3.connect(DB_PATH)
    conn.execute("UPDATE game_stats SET xp = xp + ? WHERE uid = ?", (amount, uid))
    conn.commit()
    conn.close()
    log.db_log("GAME", f"Added {amount} XP to {uid}", "INFO")
    return {"success": True}

@app.post("/game/{uid}/brushing-log")
def add_brushing_log(uid: str, req: Dict[str, Any]):
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute("""
            INSERT INTO brushing_logs (uid, duration_seconds, quality_score, session_date)
            VALUES (?, ?, ?, ?)
        """, (uid, req.get('duration_seconds', 120), req.get('quality_score', 80), datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        conn.commit()
        log.db_log("GAME", f"Added brushing log for {uid}", "INFO")
        return {"success": True}
    finally:
        conn.close()

@app.post("/quests/{uid}/progress")
def update_quest_progress(uid: str, req: Dict[str, Any]):
    conn = sqlite3.connect(DB_PATH)
    try:
        q_id = req.get('quest_id')
        inc = req.get('increment', 1)
        # Simple upsert for quest progress
        conn.execute("""
            INSERT INTO user_quests (uid, quest_id, progress)
            VALUES (?, ?, ?)
            ON CONFLICT(uid, quest_id) DO UPDATE SET
                progress = progress + excluded.progress,
                last_updated = CURRENT_TIMESTAMP
        """, (uid, q_id, inc))
        conn.commit()
        return {"success": True}
    finally:
        conn.close()

# --- ROLE-BASED & DASHBOARD DATA ---
@app.get("/leaderboard")
def get_leaderboard(filter: str = "stars"):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        # We join users with game_stats to get names and stars/streaks
        if filter == "stars":
            order_by = "gs.gold DESC"
        else:
            order_by = "gs.current_streak DESC"
            
        rows = conn.execute(f"""
            SELECT u.uid, u.name, u.avatar_url, gs.gold as stars, gs.current_streak as streak, gs.selected_character
            FROM users u
            JOIN game_stats gs ON u.uid = gs.uid
            WHERE u.role = 'hero'
            ORDER BY {order_by}
            LIMIT 50
        """).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

@app.get("/teacher/{teacher_uid}/students")
def get_teacher_students(teacher_uid: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        rows = conn.execute("""
            SELECT u.uid, u.name, gs.level, gs.gold as stars, gs.enamel_health as health, gs.selected_character as character
            FROM users u
            JOIN user_relations ur ON u.uid = ur.child_uid
            JOIN game_stats gs ON u.uid = gs.uid
            WHERE ur.parent_uid = ? AND ur.relation_type = 'teacher_student'
        """, (teacher_uid,)).fetchall()
        
        return [dict(r) for r in rows]
    finally:
        conn.close()

@app.get("/parent/{parent_uid}/children")
def get_parent_children(parent_uid: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        rows = conn.execute("""
            SELECT u.*, gs.*
            FROM users u
            JOIN user_relations ur ON u.uid = ur.child_uid
            JOIN game_stats gs ON u.uid = gs.uid
            WHERE ur.parent_uid = ? AND ur.relation_type = 'parent_child'
        """, (parent_uid,)).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

@app.post("/reminders/send")
def send_reminder(req: ReminderRequest):
    print(f"\n[REMINDER_DEBUG] Sender: {req.sender_uid} | Receiver: {req.receiver_uid}")
    sender = req.sender_uid
    receiver = req.receiver_uid
    msg = req.message
    rtype = req.type
    
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute("""
            INSERT INTO notifications (sender_uid, receiver_uid, message, type)
            VALUES (?, ?, ?, ?)
        """, (sender, receiver, msg, rtype))
        conn.commit()
        log.db_log("NOTIFY", f"Reminder sent from {sender} to {receiver}", "INFO")
        return {"success": True}
    finally:
        conn.close()

@app.post("/relations/link")
def link_relation(req: LinkRequest):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        # 1. Find the child by email or phone
        child = conn.execute("SELECT uid FROM users WHERE email = ? OR phone = ?", (req.child_identifier, req.child_identifier)).fetchone()
        
        if not child:
            raise HTTPException(status_code=404, detail="Child/Student not found with that email or phone.")
        
        child_uid = child['uid']
        
        # 2. Create the relation
        conn.execute("""
            INSERT OR IGNORE INTO user_relations (parent_uid, child_uid, relation_type)
            VALUES (?, ?, ?)
        """, (req.parent_uid, child_uid, req.relation_type))
        conn.commit()
        
        log.db_log("RELATIONS", f"Link created: {req.parent_uid} -> {child_uid} ({req.relation_type})", "INFO")
        return {"success": True, "message": "Link successful!", "child_uid": child_uid}
    except Exception as e:
        log.db_log("ERROR", f"Linking failed: {e}", "ERROR")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/notifications/{uid}")
def get_notifications(uid: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        notes = conn.execute("""
            SELECT * FROM notifications WHERE receiver_uid = ? ORDER BY created_at DESC LIMIT 20
        """, (uid,)).fetchall()
        return [dict(n) for n in notes]
    finally:
        conn.close()

@app.post("/rewards/unlock")
def unlock_reward(uid: str, reward_id: int, cost: int):
    conn = sqlite3.connect(DB_PATH)
    try:
        # 1. Check if user has enough stars
        stats = conn.execute("SELECT gold FROM game_stats WHERE uid = ?", (uid,)).fetchone()
        if not stats or stats[0] < cost:
            return {"success": False, "message": "Not enough stars"}
            
        # 2. Add to unlocked_rewards and deduct gold
        conn.execute("INSERT OR IGNORE INTO unlocked_rewards (uid, reward_id) VALUES (?,?)", (uid, reward_id))
        conn.execute("UPDATE game_stats SET gold = gold - ? WHERE uid = ?", (cost, uid))
        conn.commit()
        return {"success": True}
    finally:
        conn.close()

# --- AI & ANALYTICS ---
@app.post("/process")
@app.post("/ai/process")
async def process_ai(req: AIRequest):
    # Mock AI for stability (User can add Gemini later)
    response = f"Hello! I am Tanu. You told me: {req.text}. Remember to brush twice a day!"
    log.db_log("AI", f"Processed chat request: {req.text[:20]}...", "INFO")
    return {"text": response, "audio": None}

# --- DEBUG ROUTES INTROSPECTION ---
@app.get("/debug/routes")
def list_routes():
    routes = [{"path": r.path, "methods": list(r.methods)} for r in app.routes if hasattr(r, 'methods')]
    return {"total": len(routes), "routes": sorted(routes, key=lambda x: x["path"])}

# --- SYSTEM ---
@app.get("/")
def health():
    return {
        "status": "online", 
        "version": "4.0.0 (Solid Architecture)",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    init_db()
    print("=" * 60)
    print("    TOOTH KINGDOM ADVENTURE v4.0")
    print("    ABSOLUTE STABILITY ENGINE")
    print("=" * 60)
    print("\n🔗 REGISTERED ROUTES:")
    for route in app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            methods = list(route.methods)
            print(f"   {', '.join(methods):<8} {route.path}")
    print("=" * 60 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8010, log_level="warning", access_log=False)
