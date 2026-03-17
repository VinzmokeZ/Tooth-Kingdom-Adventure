import sqlite3
import os

# Base directory for databases
DB_DIR = os.path.dirname(__file__)

def get_conn(db_name):
    path = os.path.join(DB_DIR, f"{db_name}.db")
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn

def init_all_dbs():
    # 1. AUTH DB
    with get_conn("auth") as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uid TEXT UNIQUE,
                name TEXT,
                email TEXT UNIQUE,
                password_hash TEXT,
                role TEXT DEFAULT 'child',
                phone TEXT,
                dob TEXT,
                provider TEXT DEFAULT 'local',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uid TEXT,
                token TEXT,
                expires_at DATETIME
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS otp_codes (
                phone TEXT PRIMARY KEY,
                code TEXT,
                expires_at DATETIME
            )
        ''')
        
    # 2. GAME DB
    with get_conn("game") as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS character_stats (
                uid TEXT PRIMARY KEY,
                level INTEGER DEFAULT 1,
                xp INTEGER DEFAULT 0,
                gold INTEGER DEFAULT 0,
                enamel_health INTEGER DEFAULT 100,
                total_stars INTEGER DEFAULT 0,
                selected_char INTEGER DEFAULT 1,
                current_streak INTEGER DEFAULT 0,
                best_streak INTEGER DEFAULT 0,
                total_days INTEGER DEFAULT 0,
                completed_chapters INTEGER DEFAULT 0,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS chapter_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uid TEXT,
                chapter_id INTEGER,
                chapter_name TEXT,
                stars_earned INTEGER,
                score INTEGER,
                completed INTEGER DEFAULT 0,
                attempts INTEGER DEFAULT 1,
                UNIQUE(uid, chapter_id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS brushing_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uid TEXT,
                session_date TEXT,
                duration_seconds INTEGER,
                quality_score INTEGER,
                xp_earned INTEGER,
                gold_earned INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

    # 3. REWARDS DB
    with get_conn("rewards") as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS achievements (
                uid TEXT,
                achievement_id TEXT,
                unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY(uid, achievement_id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS unlocked_rewards (
                uid TEXT,
                reward_id TEXT,
                unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY(uid, reward_id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS inventory (
                uid TEXT,
                item_id TEXT,
                quantity INTEGER DEFAULT 1,
                PRIMARY KEY(uid, item_id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS reward_catalog (
                item_id TEXT PRIMARY KEY,
                name TEXT,
                cost INTEGER,
                type TEXT
            )
        ''')

    # 4. QUESTS DB
    with get_conn("quests") as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS quest_definitions (
                quest_id TEXT PRIMARY KEY,
                title TEXT,
                description TEXT,
                reward_xp INTEGER,
                reward_gold INTEGER
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS quest_progress (
                uid TEXT,
                quest_id TEXT,
                progress INTEGER DEFAULT 0,
                completed INTEGER DEFAULT 0,
                PRIMARY KEY(uid, quest_id)
            )
        ''')

    # 5. SOCIAL DB
    with get_conn("social") as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS parent_children (
                parent_uid TEXT,
                child_uid TEXT,
                PRIMARY KEY(parent_uid, child_uid)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS teacher_students (
                teacher_uid TEXT,
                student_uid TEXT,
                class_id TEXT,
                PRIMARY KEY(teacher_uid, student_uid)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS leaderboard (
                uid TEXT PRIMARY KEY,
                name TEXT,
                total_stars INTEGER,
                rank INTEGER
            )
        ''')

    # 6. AI DB
    with get_conn("ai") as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uid TEXT,
                role TEXT,
                content TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

if __name__ == "__main__":
    init_all_dbs()
    print("All 6 databases initialized successfully.")
