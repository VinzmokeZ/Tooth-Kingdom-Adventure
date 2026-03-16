"""
Tooth Kingdom Adventure - Database Initializer
Creates and configures all 6 SQLite databases.
Run this once on startup from main.py
"""
import sqlite3
import os

DB_DIR = os.path.join(os.path.dirname(__file__))


def get_db_path(name: str) -> str:
    return os.path.join(DB_DIR, f"{name}.db")


# ──────────────────────────────────────────────
# AUTH DB  (users, sessions, otp_codes)
# ──────────────────────────────────────────────
def init_auth_db():
    conn = sqlite3.connect(get_db_path("auth"))
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            uid         TEXT UNIQUE NOT NULL,
            name        TEXT NOT NULL,
            email       TEXT UNIQUE,
            phone       TEXT UNIQUE,
            password_hash TEXT,
            role        TEXT NOT NULL DEFAULT 'child',
            provider    TEXT DEFAULT 'local',
            provider_id TEXT,
            dob         TEXT,
            created_at  TEXT DEFAULT (datetime('now')),
            is_active   INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            uid         TEXT NOT NULL,
            token       TEXT NOT NULL,
            created_at  TEXT DEFAULT (datetime('now')),
            expires_at  TEXT NOT NULL,
            is_valid    INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS otp_codes (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            phone       TEXT NOT NULL,
            code        TEXT NOT NULL,
            created_at  TEXT DEFAULT (datetime('now')),
            expires_at  TEXT NOT NULL,
            used        INTEGER DEFAULT 0
        );
    """)
    conn.commit()
    conn.close()


# ──────────────────────────────────────────────
# GAME DB  (chapter_progress, brushing_logs, character_stats)
# ──────────────────────────────────────────────
def init_game_db():
    conn = sqlite3.connect(get_db_path("game"))
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS character_stats (
            uid             TEXT PRIMARY KEY,
            level           INTEGER DEFAULT 1,
            xp              INTEGER DEFAULT 0,
            gold            INTEGER DEFAULT 0,
            enamel_health   INTEGER DEFAULT 100,
            total_stars     INTEGER DEFAULT 0,
            selected_char   INTEGER DEFAULT 1,
            current_streak  INTEGER DEFAULT 0,
            best_streak     INTEGER DEFAULT 0,
            total_days      INTEGER DEFAULT 0,
            completed_chapters INTEGER DEFAULT 0,
            last_active     TEXT DEFAULT (datetime('now')),
            updated_at      TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS chapter_progress (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            uid             TEXT NOT NULL,
            chapter_id      INTEGER NOT NULL,
            chapter_name    TEXT,
            stars_earned    INTEGER DEFAULT 0,
            score           INTEGER DEFAULT 0,
            completed       INTEGER DEFAULT 0,
            completed_at    TEXT,
            attempts        INTEGER DEFAULT 0,
            UNIQUE(uid, chapter_id)
        );

        CREATE TABLE IF NOT EXISTS brushing_logs (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            uid             TEXT NOT NULL,
            session_date    TEXT NOT NULL,
            duration_seconds INTEGER DEFAULT 120,
            quality_score   INTEGER DEFAULT 0,
            xp_earned       INTEGER DEFAULT 0,
            gold_earned     INTEGER DEFAULT 0,
            created_at      TEXT DEFAULT (datetime('now'))
        );
    """)
    conn.commit()
    conn.close()


# ──────────────────────────────────────────────
# REWARDS DB  (achievements, unlocked_rewards, inventory)
# ──────────────────────────────────────────────
def init_rewards_db():
    conn = sqlite3.connect(get_db_path("rewards"))
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS achievements (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            uid             TEXT NOT NULL,
            achievement_id  TEXT NOT NULL,
            name            TEXT,
            description     TEXT,
            xp_reward       INTEGER DEFAULT 0,
            unlocked_at     TEXT DEFAULT (datetime('now')),
            UNIQUE(uid, achievement_id)
        );

        CREATE TABLE IF NOT EXISTS unlocked_rewards (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            uid             TEXT NOT NULL,
            reward_id       TEXT NOT NULL,
            reward_name     TEXT,
            reward_type     TEXT,
            unlocked_at     TEXT DEFAULT (datetime('now')),
            UNIQUE(uid, reward_id)
        );

        CREATE TABLE IF NOT EXISTS inventory (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            uid             TEXT NOT NULL,
            item_id         TEXT NOT NULL,
            item_name       TEXT,
            item_type       TEXT,
            quantity        INTEGER DEFAULT 1,
            acquired_at     TEXT DEFAULT (datetime('now')),
            UNIQUE(uid, item_id)
        );

        CREATE TABLE IF NOT EXISTS reward_catalog (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            reward_id       TEXT UNIQUE NOT NULL,
            name            TEXT NOT NULL,
            description     TEXT,
            reward_type     TEXT DEFAULT 'cosmetic',
            cost_gold       INTEGER DEFAULT 0,
            cost_xp         INTEGER DEFAULT 0,
            unlock_level    INTEGER DEFAULT 1,
            image_key       TEXT
        );
    """)
    # Seed default reward catalog items
    conn.execute("""
        INSERT OR IGNORE INTO reward_catalog (reward_id, name, description, reward_type, cost_gold, unlock_level, image_key)
        VALUES
        ('royal_crown', 'Royal Crown', 'The crown of the Tooth Kingdom', 'cosmetic', 500, 5, 'crown'),
        ('golden_toothbrush', 'Golden Toothbrush', 'A legendary brushing tool', 'cosmetic', 300, 3, 'golden_brush'),
        ('sugar_bug_badge', 'Sugar Bug Slayer Badge', 'Defeated 50 Sugar Bugs', 'badge', 0, 2, 'badge_bug'),
        ('cavity_shield', 'Cavity Shield', 'Protects your enamel', 'cosmetic', 200, 2, 'shield'),
        ('tooth_fairy_wings', 'Tooth Fairy Wings', 'Mythical wings for heroes', 'cosmetic', 800, 8, 'wings'),
        ('dentist_coat', 'Dentist Hero Coat', 'Become the hero dentist!', 'cosmetic', 150, 1, 'dentist_coat'),
        ('sparkle_pack', 'Sparkle Pack', 'Make your teeth sparkle!', 'powerup', 100, 1, 'sparkle')
    """)
    conn.commit()
    conn.close()


# ──────────────────────────────────────────────
# QUESTS DB  (daily_quests, quest_progress)
# ──────────────────────────────────────────────
def init_quests_db():
    conn = sqlite3.connect(get_db_path("quests"))
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS quest_definitions (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            quest_id        TEXT UNIQUE NOT NULL,
            title           TEXT NOT NULL,
            description     TEXT,
            quest_type      TEXT DEFAULT 'daily',
            target_count    INTEGER DEFAULT 1,
            xp_reward       INTEGER DEFAULT 50,
            gold_reward     INTEGER DEFAULT 20,
            icon            TEXT
        );

        CREATE TABLE IF NOT EXISTS quest_progress (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            uid             TEXT NOT NULL,
            quest_id        TEXT NOT NULL,
            current_count   INTEGER DEFAULT 0,
            completed       INTEGER DEFAULT 0,
            completed_at    TEXT,
            assigned_date   TEXT DEFAULT (date('now')),
            UNIQUE(uid, quest_id, assigned_date)
        );
    """)
    # Seed default daily quest definitions
    conn.execute("""
        INSERT OR IGNORE INTO quest_definitions (quest_id, title, description, quest_type, target_count, xp_reward, gold_reward, icon)
        VALUES
        ('daily_brush_morning', 'Morning Warrior', 'Brush your teeth in the morning', 'daily', 1, 50, 20, 'sun'),
        ('daily_brush_night', 'Nighttime Guardian', 'Brush your teeth at night', 'daily', 1, 50, 20, 'moon'),
        ('daily_chapter', 'Knowledge Seeker', 'Complete one game chapter', 'daily', 1, 100, 40, 'book'),
        ('daily_ai_chat', 'Tanu Friend', 'Ask Tanu one question', 'daily', 1, 30, 10, 'chat'),
        ('weekly_streak', 'Week Warrior', 'Brush 7 days in a row', 'weekly', 7, 300, 100, 'fire'),
        ('daily_quest_log', 'Quest Logger', 'Complete any 2 daily quests', 'daily', 2, 75, 25, 'star')
    """)
    conn.commit()
    conn.close()


# ──────────────────────────────────────────────
# SOCIAL DB  (parent_children, teacher_students, leaderboard)
# ──────────────────────────────────────────────
def init_social_db():
    conn = sqlite3.connect(get_db_path("social"))
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS parent_children (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            parent_uid      TEXT NOT NULL,
            child_uid       TEXT NOT NULL,
            child_name      TEXT,
            linked_at       TEXT DEFAULT (datetime('now')),
            UNIQUE(parent_uid, child_uid)
        );

        CREATE TABLE IF NOT EXISTS teacher_students (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            teacher_uid     TEXT NOT NULL,
            student_uid     TEXT NOT NULL,
            student_name    TEXT,
            class_code      TEXT,
            joined_at       TEXT DEFAULT (datetime('now')),
            UNIQUE(teacher_uid, student_uid)
        );

        CREATE TABLE IF NOT EXISTS leaderboard (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            uid             TEXT UNIQUE NOT NULL,
            name            TEXT NOT NULL,
            class_code      TEXT,
            total_xp        INTEGER DEFAULT 0,
            total_stars     INTEGER DEFAULT 0,
            current_streak  INTEGER DEFAULT 0,
            level           INTEGER DEFAULT 1,
            updated_at      TEXT DEFAULT (datetime('now'))
        );
    """)
    conn.commit()
    conn.close()


# ──────────────────────────────────────────────
# AI DB  (chat_history)
# ──────────────────────────────────────────────
def init_ai_db():
    conn = sqlite3.connect(get_db_path("ai"))
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS chat_history (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            uid             TEXT NOT NULL,
            role            TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
            message         TEXT NOT NULL,
            audio_response  INTEGER DEFAULT 0,
            created_at      TEXT DEFAULT (datetime('now'))
        );
    """)
    conn.commit()
    conn.close()


# ──────────────────────────────────────────────
# MASTER INIT — call from main.py
# ──────────────────────────────────────────────
def init_all_databases():
    """Initialize all 6 databases. Safe to call on every startup."""
    os.makedirs(DB_DIR, exist_ok=True)
    init_auth_db()
    init_game_db()
    init_rewards_db()
    init_quests_db()
    init_social_db()
    init_ai_db()


def get_auth_conn():
    conn = sqlite3.connect(get_db_path("auth"))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def get_game_conn():
    conn = sqlite3.connect(get_db_path("game"))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def get_rewards_conn():
    conn = sqlite3.connect(get_db_path("rewards"))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def get_quests_conn():
    conn = sqlite3.connect(get_db_path("quests"))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def get_social_conn():
    conn = sqlite3.connect(get_db_path("social"))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def get_ai_conn():
    conn = sqlite3.connect(get_db_path("ai"))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn
