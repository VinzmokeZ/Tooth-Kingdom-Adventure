from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import sys
import os
import requests
import base64
import json

# Path hack
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_conn
import logger as log

router = APIRouter(prefix="/ai", tags=["ai"])

# --- CONFIG ---
GEMINI_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
ELEVEN_KEY = os.getenv("ELEVENLABS_API_KEY")

# --- MODELS ---
class AIProcessRequest(BaseModel):
    text: Optional[str] = None
    audio: Optional[str] = None
    uid: Optional[str] = "guest"

class VRAnalyzeRequest(BaseModel):
    image_b64: str
    uid: str

# --- ROUTES ---
@router.post("/process")
@router.post("/chat") # Supporting both aliases
async def process_ai(req: AIProcessRequest):
    user_input = req.text or ""
    
    # 1. Mockup Plan Fast-Track (Zero Crash)
    mock_responses = [
        (["hello", "hi ", "hey", "who"], "Hello there! I'm Guide Tanu, your Royal Guide to the Tooth Kingdom!"),
        (["how", "brush", "properly", "way", "do i"], "Brush your teeth in small circles for two whole minutes! Don't forget to reach the back!"),
        (["pain", "hurt", "bleed", "blood", "ache"], "Oh no! If your teeth hurt, you should tell your parents so they can schedule a dentist visit!"),
        (["sugar", "candy", "sweet", "chocolate"], "Candy is yummy, but Sugar Bugs love it too! Make sure to brush nicely after eating sweet treats!"),
        (["why", "important", "cavity", "decay"], "Brushing keeps the Sugar Bugs away and your teeth strong and shiny!"),
    ]
    
    tanu_answer = None
    user_lower = user_input.lower()
    for keywords, answer in mock_responses:
        if any(kw in user_lower for kw in keywords):
            tanu_answer = answer
            log.db_log("AI", "Matched mockup keyword. Fast-tracking response.", "INFO")
            break

    # 2. Gemini Fallback
    if not tanu_answer and GEMINI_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GEMINI_KEY}"
            payload = {
                "contents": [{
                    "parts": [{"text": f"You are Tanu, the cheerful dental guide. Answer briefly: {user_input}"}]
                }]
            }
            resp = requests.post(url, json=payload, timeout=10)
            if resp.status_code == 200:
                tanu_answer = resp.json()['candidates'][0]['content']['parts'][0]['text'].strip()
                tanu_answer = "".join(c for c in tanu_answer if ord(c) < 65536) # Stripping multi-byte for old consoles if any
        except Exception as e:
            log.db_log("AI", f"Gemini Error: {e}", "ERROR")

    if not tanu_answer:
        tanu_answer = "I'm having a little trouble thinking! Let's talk about brushing!"

    # 3. ElevenLabs TTS (Optional)
    audio_b64 = None
    if ELEVEN_KEY and tanu_answer:
        try:
             v_id = "EXAVITQu4voX998R6I7k" # Harmony/Bella
             v_url = f"https://api.elevenlabs.io/v1/text-to-speech/{v_id}"
             headers = {"xi-api-key": ELEVEN_KEY, "Content-Type": "application/json"}
             v_payload = {"text": tanu_answer[:250], "model_id": "eleven_monolingual_v1"}
             v_resp = requests.post(v_url, json=v_payload, headers=headers, timeout=8)
             if v_resp.status_code == 200:
                 audio_b64 = base64.b64encode(v_resp.content).decode('utf-8')
        except: pass

    # 4. Save to History
    with get_conn("ai") as conn:
        conn.execute("INSERT INTO chat_history (uid, role, content) VALUES (?,?,?)", (req.uid, "user", user_input))
        conn.execute("INSERT INTO chat_history (uid, role, content) VALUES (?,?,?)", (req.uid, "assistant", tanu_answer))
        conn.commit()

    log.db_log("AI", f"Response ready for {req.uid}", "INFO")
    return {
        "success": True,
        "text": tanu_answer,
        "audio": audio_b64,
        "query": user_input
    }

@router.post("/vr-analyze")
async def vr_analyze(req: VRAnalyzeRequest):
    # Simulated analysis for VR mode
    log.db_log("AI", f"VR Analysis triggered for {req.uid}", "INFO")
    return {
        "success": True,
        "analysis": "Sugar Bugs detected in Chapter 3! Recommendation: Circular Brushing Motion.",
        "difficulty_adjustment": "normal"
    }

@router.get("/history/{uid}")
def get_history(uid: str):
    with get_conn("ai") as conn:
        rows = conn.execute("SELECT role, content, timestamp FROM chat_history WHERE uid=? ORDER BY timestamp ASC", (uid,)).fetchall()
        return {"success": True, "history": [dict(r) for r in rows]}
