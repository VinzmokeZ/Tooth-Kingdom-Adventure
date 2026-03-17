from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import sys
import os

# Path hack
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_conn
import logger as log

router = APIRouter(prefix="/social", tags=["social"])

# --- ROUTES ---
@router.get("/leaderboard")
def get_leaderboard():
    # In a real app, this would be an aggregation. For now, we fetch top players from game.db
    with get_conn("game") as gconn:
        rows = gconn.execute("""
            SELECT uid, total_stars FROM character_stats 
            ORDER BY total_stars DESC LIMIT 10
        """).fetchall()
        
    leaderboard = []
    with get_conn("auth") as aconn:
        for idx, r in enumerate(rows):
            name_row = aconn.execute("SELECT name FROM users WHERE uid=?", (r["uid"],)).fetchone()
            leaderboard.append({
                "rank": idx + 1,
                "uid": r["uid"],
                "name": name_row["name"] if name_row else "Hero",
                "stars": r["total_stars"]
            })
    return {"success": True, "leaderboard": leaderboard}

@router.get("/parent/{parent_uid}/children")
def get_children(parent_uid: str):
    with get_conn("social") as sconn:
        child_rows = sconn.execute("SELECT child_uid FROM parent_children WHERE parent_uid=?", (parent_uid,)).fetchall()
        
    children = []
    with get_conn("auth") as aconn:
        with get_conn("game") as gconn:
            for r in child_rows:
                c_uid = r["child_uid"]
                auth_row = aconn.execute("SELECT name, email FROM users WHERE uid=?", (c_uid,)).fetchone()
                game_row = gconn.execute("SELECT level, total_stars, enamel_health FROM character_stats WHERE uid=?", (c_uid,)).fetchone()
                children.append({
                    "uid": c_uid,
                    "name": auth_row["name"] if auth_row else "Child",
                    "level": game_row["level"] if game_row else 1,
                    "stars": game_row["total_stars"] if game_row else 0,
                    "health": game_row["enamel_health"] if game_row else 100
                })
    return {"success": True, "children": children}

@router.get("/teacher/{teacher_uid}/students")
def get_students(teacher_uid: str):
    with get_conn("social") as sconn:
        student_rows = sconn.execute("SELECT student_uid, class_id FROM teacher_students WHERE teacher_uid=?", (teacher_uid,)).fetchall()
        
    students = []
    with get_conn("auth") as aconn:
        for r in student_rows:
            s_uid = r["student_uid"]
            auth_row = aconn.execute("SELECT name FROM users WHERE uid=?", (s_uid,)).fetchone()
            students.append({
                "uid": s_uid,
                "name": auth_row["name"] if auth_row else "Student",
                "classId": r["class_id"]
            })
    return {"success": True, "students": students}

@router.post("/parent/{parent_uid}/link")
def link_child(parent_uid: str, child_uid: str):
    with get_conn("social") as conn:
        conn.execute("INSERT OR IGNORE INTO parent_children (parent_uid, child_uid) VALUES (?,?)",
                     (parent_uid, child_uid))
        conn.commit()
    log.db_log("SOCIAL", f"Link: Parent {parent_uid} -> Child {child_uid}", "INFO")
    return {"success": True}
