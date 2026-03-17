<<<<<<< HEAD
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any
import random
import json
import jwt
from datetime import datetime, timedelta
import os
import sys
import bcrypt
from passlib.context import CryptContext

# Path hack for sibling imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_conn
=======
"""
Authentication Router
Routes: /auth/register, /auth/login, /auth/google, /auth/phone,
        /auth/verify-otp, /auth/logout, /auth/me
"""
import os
import json
import random
import jwt
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_auth_conn, get_game_conn, get_rewards_conn, get_quests_conn
>>>>>>> 7202e6ef40987237d747d24a920e2c14e55500f8
import logger as log

router = APIRouter(prefix="/auth", tags=["auth"])

<<<<<<< HEAD
# --- SECURITY CONFIG ---
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "tooth-kingdom-secret-2024")
ALGORITHM = "HS256"

# Passlib 1.7.4 compatibility for bcrypt 4.0+
if not hasattr(bcrypt, '__about__'):
    class About: pass
    About.__version__ = getattr(bcrypt, '__version__', '4.0.0')
    bcrypt.__about__ = About()
PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- MODELS ---
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "child"

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    email: str
    name: str
    provider_id: str

class PhoneAuthRequest(BaseModel):
    phone: str

=======
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "tooth-kingdom-secret-2024-change-in-prod")
ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 7


# ── Password hashing (direct bcrypt — avoids passlib 4.x issues) ──
try:
    import bcrypt as _bcrypt
    _USE_BCRYPT = True
except ImportError:
    _USE_BCRYPT = False
    log.warn("bcrypt not installed — passwords stored as plain text (dev only)")


def hash_password(pw: str) -> str:
    if _USE_BCRYPT:
        return _bcrypt.hashpw(pw.encode("utf-8"), _bcrypt.gensalt()).decode("utf-8")
    return pw


def verify_password(pw: str, hashed: str) -> bool:
    if _USE_BCRYPT:
        try:
            return _bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
        except Exception:
            return pw == hashed
    return pw == hashed


def make_token(uid: str) -> str:
    payload = {"uid": uid, "exp": datetime.utcnow() + timedelta(days=TOKEN_EXPIRE_DAYS)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_uid_from_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["uid"]
    except Exception:
        raise HTTPException(401, "Invalid or expired token")


def _ensure_game_profile(uid: str, name: str):
    """Create game + rewards profile for new users."""
    try:
        conn = get_game_conn()
        conn.execute(
            "INSERT OR IGNORE INTO character_stats (uid) VALUES (?)", (uid,)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        log.warn(f"Game profile init failed for {uid}: {e}")

    try:
        conn2 = get_quests_conn()
        today = datetime.now().strftime("%Y-%m-%d")
        quests = conn2.execute("SELECT quest_id FROM quest_definitions WHERE quest_type='daily'").fetchall()
        for q in quests:
            conn2.execute(
                "INSERT OR IGNORE INTO quest_progress (uid, quest_id, assigned_date) VALUES (?,?,?)",
                (uid, q["quest_id"], today)
            )
        conn2.commit()
        conn2.close()
    except Exception as e:
        log.warn(f"Quest init failed for {uid}: {e}")


# ── Models ────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    dob: Optional[str] = None
    role: Optional[str] = "child"


class LoginRequest(BaseModel):
    email: str
    password: str


class GoogleAuthRequest(BaseModel):
    email: str
    name: str
    provider: Optional[str] = "google"
    provider_id: Optional[str] = None


class PhoneRequest(BaseModel):
    phone: str


>>>>>>> 7202e6ef40987237d747d24a920e2c14e55500f8
class OTPVerifyRequest(BaseModel):
    phone: str
    code: str

<<<<<<< HEAD
# --- UTILS ---
def create_token(uid: str):
    expire = datetime.utcnow() + timedelta(days=7)
    return jwt.encode({"uid": uid, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def safe_hash(password: str):
    """Byte-safe bcrypt truncation (72-byte limit)."""
    if not password: return ""
    pw_bytes = password.encode('utf-8')[:72]
    safe_pw = pw_bytes.decode('utf-8', 'ignore')
    return PWD_CONTEXT.hash(safe_pw)

def safe_verify(password: str, hashed: str):
    """Byte-safe bcrypt verification."""
    if not password or not hashed: return False
    pw_bytes = password.encode('utf-8')[:72]
    safe_pw = pw_bytes.decode('utf-8', 'ignore')
    return PWD_CONTEXT.verify(safe_pw, hashed)

# --- ROUTES ---
@router.post("/register")
def register(user: UserRegister):
    with get_conn("auth") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT uid FROM users WHERE email=?", (user.email,))
        if cursor.fetchone():
            log.db_log("AUTH", f"Register fail: Email {user.email} exists", "WARN")
            raise HTTPException(400, "Email already registered")
        
        uid = f"local_{random.randint(100000, 999999)}"
        hashed = safe_hash(user.password)
        
        cursor.execute("""
            INSERT INTO users (uid, name, email, password_hash, role, provider)
            VALUES (?,?,?,?,?,?)
        """, (uid, user.name, user.email, hashed, user.role, "local"))
        conn.commit()
        
        # Also initialize game stats
        with get_conn("game") as gconn:
            gconn.execute("INSERT OR IGNORE INTO character_stats (uid) VALUES (?)", (uid,))
            gconn.commit()
            
        log.db_log("AUTH", f"New account: {user.email} -> {uid}", "INFO")
        return {"success": True, "token": create_token(uid), "user": {"id": uid, "name": user.name}}

@router.post("/login")
def login(user: UserLogin):
    with get_conn("auth") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email=?", (user.email,))
        row = cursor.fetchone()
        
        if not row or not safe_verify(user.password, row["password_hash"]):
            log.db_log("AUTH", f"Login fail: Incorrect credentials for {user.email}", "WARN")
            raise HTTPException(401, "Invalid email or password")
        
        token = create_token(row["uid"])
        log.db_log("AUTH", f"Login success: {user.email}", "INFO")
        return {"success": True, "token": token, "user": {"id": row["uid"], "name": row["name"]}}

@router.post("/google")
def auth_google(req: GoogleAuthRequest):
    with get_conn("auth") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email=?", (req.email,))
        row = cursor.fetchone()
        
        uid = req.provider_id
        if not row:
            cursor.execute("""
                INSERT INTO users (uid, name, email, role, provider)
                VALUES (?,?,?,?,?)
            """, (uid, req.name, req.email, "child", "google"))
            conn.commit()
            
            with get_conn("game") as gconn:
                gconn.execute("INSERT OR IGNORE INTO character_stats (uid) VALUES (?)", (uid,))
                gconn.commit()
            log.db_log("AUTH", f"Google Sync: Created new user {req.email}", "INFO")
        else:
            uid = row["uid"]
            log.db_log("AUTH", f"Google Sync: Existing user {req.email}", "INFO")
            
        return {"success": True, "token": create_token(uid), "user": {"id": uid, "name": req.name}}

@router.post("/phone")
def auth_phone(req: PhoneAuthRequest):
    otp = str(random.randint(100000, 999999))
    with get_conn("auth") as conn:
        conn.execute("""
            INSERT OR REPLACE INTO otp_codes (phone, code, expires_at)
            VALUES (?,?,?)
        """, (req.phone, otp, (datetime.now() + timedelta(minutes=5)).isoformat()))
        conn.commit()
        
    log.db_log("AUTH", f"OTP Generated for {req.phone}: {otp}", "INFO")
    return {"success": True, "otp": otp} # In production, this would be sent via SMS

@router.post("/verify-otp")
def verify_otp(req: OTPVerifyRequest):
    with get_conn("auth") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT code FROM otp_codes WHERE phone=?", (req.phone,))
        row = cursor.fetchone()
        
        if not row or row["code"] != req.code:
            log.db_log("AUTH", f"OTP Fail: Invalid code for {req.phone}", "WARN")
            raise HTTPException(400, "Invalid or expired OTP")
        
        # Check if user exists
        cursor.execute("SELECT uid, name FROM users WHERE phone=?", (req.phone,))
        user_row = cursor.fetchone()
        
        if not user_row:
            uid = f"phone_{int(datetime.now().timestamp())}"
            cursor.execute("""
                INSERT INTO users (uid, name, phone, role, provider)
                VALUES (?,?,?,?,?)
            """, (uid, "Phone Hero", req.phone, "child", "phone"))
            conn.commit()
            
            with get_conn("game") as gconn:
                gconn.execute("INSERT OR IGNORE INTO character_stats (uid) VALUES (?)", (uid,))
                gconn.commit()
            name = "Phone Hero"
        else:
            uid = user_row["uid"]
            name = user_row["name"]
            
        log.db_log("AUTH", f"OTP Verified: {req.phone} -> {uid}", "INFO")
        return {"success": True, "token": create_token(uid), "user": {"id": uid, "name": name}}
=======

# ── Routes ────────────────────────────────────────────────
@router.post("/register")
def register(req: RegisterRequest):
    conn = get_auth_conn()
    try:
        existing = conn.execute("SELECT uid FROM users WHERE email=?", (req.email,)).fetchone()
        if existing:
            raise HTTPException(400, "Email already registered")

        uid = f"local_{random.randint(100000, 999999)}"
        pw_hash = hash_password(req.password)

        conn.execute(
            "INSERT INTO users (uid, name, email, password_hash, role, provider, dob) VALUES (?,?,?,?,?,?,?)",
            (uid, req.name, req.email, pw_hash, req.role, "local", req.dob)
        )
        conn.commit()
        _ensure_game_profile(uid, req.name)

        token = make_token(uid)
        log.success(f"New user registered: {req.email} [{req.role}] uid={uid}")
        return {"success": True, "token": token, "user": {"id": uid, "name": req.name, "email": req.email, "role": req.role}}
    finally:
        conn.close()


@router.post("/login")
def login(req: LoginRequest):
    conn = get_auth_conn()
    try:
        row = conn.execute("SELECT * FROM users WHERE email=?", (req.email,)).fetchone()
        if not row:
            raise HTTPException(401, "No account found with that email")
        if not verify_password(req.password, row["password_hash"]):
            raise HTTPException(401, "Incorrect password")

        token = make_token(row["uid"])
        log.success(f"Login: {req.email} [{row['role']}]")
        return {
            "success": True, "token": token,
            "user": {"id": row["uid"], "name": row["name"], "email": row["email"],
                     "role": row["role"], "phone": row["phone"]}
        }
    finally:
        conn.close()


@router.post("/google")
def google_auth(req: GoogleAuthRequest):
    conn = get_auth_conn()
    try:
        row = conn.execute("SELECT * FROM users WHERE email=?", (req.email,)).fetchone()
        if row:
            token = make_token(row["uid"])
            log.success(f"Google login (existing): {req.email}")
            return {"success": True, "token": token,
                    "user": {"id": row["uid"], "name": row["name"], "email": row["email"], "role": row["role"]}}

        # New Google user
        uid = f"google_{req.provider_id or random.randint(100000, 999999)}"
        conn.execute(
            "INSERT INTO users (uid, name, email, role, provider, provider_id) VALUES (?,?,?,?,?,?)",
            (uid, req.name, req.email, "child", "google", req.provider_id)
        )
        conn.commit()
        _ensure_game_profile(uid, req.name)

        token = make_token(uid)
        log.success(f"Google register: {req.email} uid={uid}")
        return {"success": True, "token": token,
                "user": {"id": uid, "name": req.name, "email": req.email, "role": "child"}}
    finally:
        conn.close()


@router.post("/phone")
def phone_auth(req: PhoneRequest):
    """Send OTP (mock — returns OTP in dev mode)."""
    conn = get_auth_conn()
    try:
        otp = str(random.randint(100000, 999999))
        expires = (datetime.utcnow() + timedelta(minutes=10)).isoformat()
        conn.execute("DELETE FROM otp_codes WHERE phone=?", (req.phone,))
        conn.execute("INSERT INTO otp_codes (phone, code, expires_at) VALUES (?,?,?)",
                     (req.phone, otp, expires))
        conn.commit()
        log.info(f"OTP for {req.phone}: {otp} (DEV MODE - shown in logs only)")
        return {"success": True, "message": "OTP sent", "dev_otp": otp}
    finally:
        conn.close()


@router.post("/verify-otp")
def verify_otp(req: OTPVerifyRequest):
    conn = get_auth_conn()
    try:
        row = conn.execute(
            "SELECT * FROM otp_codes WHERE phone=? AND code=? AND used=0 ORDER BY id DESC LIMIT 1",
            (req.phone, req.code)
        ).fetchone()

        if not row:
            raise HTTPException(400, "Invalid OTP code")
        if datetime.fromisoformat(row["expires_at"]) < datetime.utcnow():
            raise HTTPException(400, "OTP has expired")

        conn.execute("UPDATE otp_codes SET used=1 WHERE id=?", (row["id"],))

        # Find or create user
        user_row = conn.execute("SELECT * FROM users WHERE phone=?", (req.phone,)).fetchone()
        if user_row:
            uid = user_row["uid"]
            name = user_row["name"]
            role = user_row["role"]
        else:
            uid = f"phone_{random.randint(100000, 999999)}"
            name = "Mobile Hero"
            role = "child"
            conn.execute(
                "INSERT INTO users (uid, name, phone, role, provider) VALUES (?,?,?,?,?)",
                (uid, name, req.phone, role, "phone")
            )
            _ensure_game_profile(uid, name)

        conn.commit()
        token = make_token(uid)
        log.success(f"OTP verified for {req.phone}, uid={uid}")
        return {"success": True, "token": token,
                "user": {"id": uid, "name": name, "role": role, "phone": req.phone}}
    finally:
        conn.close()


@router.get("/me")
def get_me(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "No token provided")
    token = authorization.split(" ", 1)[1]
    uid = get_uid_from_token(token)
    conn = get_auth_conn()
    try:
        row = conn.execute("SELECT * FROM users WHERE uid=?", (uid,)).fetchone()
        if not row:
            raise HTTPException(404, "User not found")
        return {"success": True, "user": {"id": row["uid"], "name": row["name"],
                "email": row["email"], "role": row["role"], "phone": row["phone"]}}
    finally:
        conn.close()


@router.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    log.info("Logout requested")
    return {"success": True, "message": "Logged out"}
>>>>>>> 7202e6ef40987237d747d24a920e2c14e55500f8
