"""
Tooth Kingdom Adventure - Main Backend Server
FastAPI + SQLite | Port 8010
Covers: Auth, Users, Game, Rewards, Quests, Social, AI
"""
import os
import sys
import time
import socket
import faulthandler
from datetime import datetime
from typing import Any
from dotenv import load_dotenv

# Crash logger (writes hard crash to file before terminal dies)
faulthandler.enable(file=open(
    os.path.join(os.path.dirname(__file__), 'hard_crash.log'), 'w'
))

# Load .env from project root (two levels up from backend/python/)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

try:
    from fastapi import FastAPI, Request, Response
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import JSONResponse
    import uvicorn
except ImportError as e:
    print(f"[FATAL] Missing core libraries: {e}")
    print("[FATAL] Run: pip install fastapi uvicorn python-dotenv")
    sys.exit(1)

# ── Our custom modules ─────────────────────────────────────
sys.path.insert(0, os.path.dirname(__file__))

import logger as log
from db.init_db import init_all_databases
from routers import auth, users, game, rewards, quests, social, ai as ai_router

# ── Initialize all 6 databases on startup ─────────────────
try:
    init_all_databases()
    log.success("All 6 databases ready (auth, game, rewards, quests, social, ai)")
except Exception as e:
    log.error("Database initialization failed", e)
    sys.exit(1)

# ── App setup ──────────────────────────────────────────────
app = FastAPI(
    title="Tooth Kingdom Adventure - API",
    description="Python backend for the Tooth Kingdom Adventure app",
    version="2.0.0",
    docs_url="/docs",         # Swagger UI at http://localhost:8010/docs
    redoc_url="/redoc"
)

# CORS — allow all origins for local dev + Android phone on same LAN
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request/Response Logger Middleware ─────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    client_ip = request.client.host if request.client else "unknown"

    # Skip favicon etc
    if request.url.path in ("/favicon.ico",):
        return await call_next(request)

    try:
        response: Response = await call_next(request)
    except Exception as exc:
        log.error(f"Unhandled exception on {request.method} {request.url.path}", exc)
        return JSONResponse(status_code=500, content={"success": False, "error": str(exc)})

    duration_ms = (time.perf_counter() - start) * 1000
    log.request_log(
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        duration_ms=duration_ms,
        client_ip=client_ip
    )
    return response


# ── Mount All Routers ──────────────────────────────────────
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(game.router)
app.include_router(rewards.router)
app.include_router(quests.router)
app.include_router(social.router)
app.include_router(ai_router.router)


# ── Core Routes ────────────────────────────────────────────
@app.get("/", tags=["health"])
def health_check():
    """Health check — returns server status and route count."""
    return {
        "status": "online",
        "server": "Tooth Kingdom Adventure API v2.0",
        "timestamp": datetime.now().isoformat(),
        "databases": ["auth", "game", "rewards", "quests", "social", "ai"]
    }


@app.post("/debug/log", tags=["debug"])
def debug_log(data: dict):
    """Accepts log messages from the frontend and echoes them to terminal."""
    msg = data.get("message", "(empty)")
    log.info(f"[FRONTEND LOG] {msg}")
    return {"ok": True}


@app.get("/debug/routes", tags=["debug"])
def list_routes():
    """List all registered API routes."""
    routes = []
    for route in app.routes:
        if hasattr(route, "methods") and hasattr(route, "path"):
            for method in route.methods:
                routes.append({"method": method, "path": route.path})
    return {"routes": sorted(routes, key=lambda x: x["path"])}


# ── Startup Banner ─────────────────────────────────────────
def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


if __name__ == "__main__":
    lan_ip = get_lan_ip()

    log.banner(
        "TOOTH KINGDOM ADVENTURE - BACKEND v2.0",
        [
            f"Local URL  : http://127.0.0.1:8010",
            f"Phone URL  : http://{lan_ip}:8010   <-- use on Android",
            f"Swagger UI : http://127.0.0.1:8010/docs",
            f"All Routes : http://127.0.0.1:8010/debug/routes",
            "",
            "Databases  : auth.db | game.db | rewards.db",
            "             quests.db | social.db | ai.db",
            "",
            "Press CTRL+C to stop the server.",
        ]
    )

    try:
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8010,
            log_level="warning",   # Suppress uvicorn's own logs; we handle logging
            reload=False,
        )
    except KeyboardInterrupt:
        log.info("Server stopped by user.")
    except Exception as e:
        log.error("Server crashed", e)
        input("\nPress ENTER to close...")
