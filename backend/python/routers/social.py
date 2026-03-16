"""
Social Router
Routes: Parent dashboard, teacher dashboard, leaderboard, linking
"""
import os
import sys
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db.init_db import get_social_conn, get_auth_conn, get_game_conn
import logger as log

router = APIRouter(tags=["social"])


class LinkParentRequest(BaseModel):
    parent_uid: str
    child_uid: str
    child_name: Optional[str] = None


class LinkTeacherRequest(BaseModel):
    teacher_uid: str
    student_uid: str
    student_name: Optional[str] = None
    class_code: Optional[str] = None


# ── Parent Dashboard ──────────────────────────────────────

@router.get("/parent/{uid}/children")
def get_children(uid: str):
    s_conn = get_social_conn()
    g_conn = get_game_conn()
    try:
        links = s_conn.execute(
            "SELECT * FROM parent_children WHERE parent_uid=?", (uid,)
        ).fetchall()

        children = []
        for link in links:
            cuid = link["child_uid"]
            stats = g_conn.execute("SELECT * FROM character_stats WHERE uid=?", (cuid,)).fetchone()
            children.append({
                "uid": cuid, "name": link["child_name"],
                "level": stats["level"] if stats else 1,
                "xp": stats["xp"] if stats else 0,
                "currentStreak": stats["current_streak"] if stats else 0,
                "completedChapters": stats["completed_chapters"] if stats else 0,
                "totalStars": stats["total_stars"] if stats else 0,
                "enamelHealth": stats["enamel_health"] if stats else 100,
            })
        log.db_log("social", f"Parent {uid} fetched {len(children)} children")
        return {"success": True, "children": children}
    finally:
        s_conn.close()
        g_conn.close()


@router.get("/parent/{uid}/child/{child_uid}")
def get_child_detail(uid: str, child_uid: str):
    g_conn = get_game_conn()
    try:
        stats = g_conn.execute("SELECT * FROM character_stats WHERE uid=?", (child_uid,)).fetchone()
        logs = g_conn.execute(
            "SELECT * FROM brushing_logs WHERE uid=? ORDER BY session_date DESC LIMIT 30",
            (child_uid,)
        ).fetchall()
        chapters = g_conn.execute(
            "SELECT * FROM chapter_progress WHERE uid=? ORDER BY chapter_id",
            (child_uid,)
        ).fetchall()

        return {
            "success": True,
            "childUid": child_uid,
            "stats": {
                "level": stats["level"] if stats else 1,
                "xp": stats["xp"] if stats else 0,
                "gold": stats["gold"] if stats else 0,
                "currentStreak": stats["current_streak"] if stats else 0,
                "bestStreak": stats["best_streak"] if stats else 0,
                "totalDays": stats["total_days"] if stats else 0,
                "completedChapters": stats["completed_chapters"] if stats else 0,
                "totalStars": stats["total_stars"] if stats else 0,
                "enamelHealth": stats["enamel_health"] if stats else 100,
            },
            "brushingLogs": [{"date": r["session_date"], "quality": r["quality_score"],
                               "duration": r["duration_seconds"]} for r in logs],
            "chapterProgress": [{"chapterId": r["chapter_id"], "stars": r["stars_earned"],
                                  "completed": bool(r["completed"])} for r in chapters]
        }
    finally:
        g_conn.close()


# ── Teacher Dashboard ──────────────────────────────────────

@router.get("/teacher/{uid}/students")
def get_students(uid: str):
    s_conn = get_social_conn()
    g_conn = get_game_conn()
    try:
        links = s_conn.execute(
            "SELECT * FROM teacher_students WHERE teacher_uid=? ORDER BY student_name",
            (uid,)
        ).fetchall()

        students = []
        for link in links:
            suid = link["student_uid"]
            stats = g_conn.execute("SELECT * FROM character_stats WHERE uid=?", (suid,)).fetchone()
            students.append({
                "uid": suid, "name": link["student_name"], "classCode": link["class_code"],
                "level": stats["level"] if stats else 1,
                "xp": stats["xp"] if stats else 0,
                "currentStreak": stats["current_streak"] if stats else 0,
                "completedChapters": stats["completed_chapters"] if stats else 0,
                "totalStars": stats["total_stars"] if stats else 0,
            })
        log.db_log("social", f"Teacher {uid} fetched {len(students)} students")
        return {"success": True, "students": students}
    finally:
        s_conn.close()
        g_conn.close()


@router.get("/teacher/{uid}/leaderboard")
def get_leaderboard(uid: str):
    s_conn = get_social_conn()
    g_conn = get_game_conn()
    try:
        links = s_conn.execute(
            "SELECT * FROM teacher_students WHERE teacher_uid=?", (uid,)
        ).fetchall()

        board = []
        for link in links:
            suid = link["student_uid"]
            stats = g_conn.execute("SELECT * FROM character_stats WHERE uid=?", (suid,)).fetchone()
            board.append({
                "uid": suid, "name": link["student_name"],
                "totalXp": stats["xp"] if stats else 0,
                "totalStars": stats["total_stars"] if stats else 0,
                "currentStreak": stats["current_streak"] if stats else 0,
                "level": stats["level"] if stats else 1,
            })

        board.sort(key=lambda x: x["totalXp"], reverse=True)
        for i, s in enumerate(board):
            s["rank"] = i + 1

        return {"success": True, "leaderboard": board}
    finally:
        s_conn.close()
        g_conn.close()


# ── Linking ───────────────────────────────────────────────

@router.post("/social/link-parent")
def link_parent(req: LinkParentRequest):
    conn = get_social_conn()
    try:
        conn.execute(
            "INSERT OR IGNORE INTO parent_children (parent_uid, child_uid, child_name) VALUES (?,?,?)",
            (req.parent_uid, req.child_uid, req.child_name)
        )
        conn.commit()
        log.db_log("social", f"Parent {req.parent_uid} linked to child {req.child_uid}")
        return {"success": True}
    finally:
        conn.close()


@router.post("/social/link-teacher")
def link_teacher(req: LinkTeacherRequest):
    conn = get_social_conn()
    try:
        conn.execute(
            "INSERT OR IGNORE INTO teacher_students (teacher_uid, student_uid, student_name, class_code) VALUES (?,?,?,?)",
            (req.teacher_uid, req.student_uid, req.student_name, req.class_code)
        )
        conn.commit()
        log.db_log("social", f"Teacher {req.teacher_uid} linked to student {req.student_uid}")
        return {"success": True}
    finally:
        conn.close()
