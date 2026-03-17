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
import logger as log

router = APIRouter(prefix="/auth", tags=["auth"])

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

class OTPVerifyRequest(BaseModel):
    phone: str
    code: str

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
