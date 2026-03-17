"""
Tooth Kingdom Adventure - Live Database Viewer v2.0
Beautiful real-time view of all 6 SQLite databases.
Shows tables, primary keys, foreign keys, row counts, and live data.
Refreshes every 5 seconds. Press CTRL+C to exit.
"""
import os, sys, time, sqlite3
from datetime import datetime

try:
    import colorama; colorama.init(autoreset=True)
except ImportError:
    pass

# ── Color palette ────────────────────────────────────────────────────
R     = "\033[0m"
BOLD  = "\033[1m"
DIM   = "\033[2m"
RED   = "\033[91m"
GREEN = "\033[92m"
YEL   = "\033[93m"
BLUE  = "\033[94m"
MAG   = "\033[95m"
CYAN  = "\033[96m"
WHITE = "\033[97m"
GRAY  = "\033[90m"
ORAN  = "\033[38;5;208m"

DB_DIR = os.path.join(os.path.dirname(__file__), "db")

# ── DB definitions with table schemas ──────────────────────────────
DBS = [
    {
        "file": "auth.db",
        "label": "AUTH",
        "color": CYAN,
        "icon": "[AUTH]",
        "tables": {
            "users": {
                "pk": "uid",
                "cols": ["uid", "name", "email", "role", "provider"],
                "display": lambda r: (
                    f"  {CYAN}{str(r.get('uid',''))[:22]:<22}{R}  "
                    f"{WHITE}{str(r.get('name',''))[:18]:<18}{R}  "
                    f"{ MAG if r.get('role')=='parent' else BLUE if r.get('role')=='teacher' else GREEN}"
                    f"{str(r.get('role','')):<10}{R}  "
                    f"{GRAY}{str(r.get('email') or r.get('provider') or '')[:30]}{R}"
                )
            }
        }
    },
    {
        "file": "game.db",
        "label": "GAME",
        "color": GREEN,
        "icon": "[GAME]",
        "tables": {
            "character_stats": {
                "pk": "uid",
                "cols": ["uid", "level", "xp", "gold", "enamel_health", "current_streak"],
                "display": lambda r: (
                    f"  {GREEN}{str(r.get('uid',''))[:20]:<20}{R}  "
                    f"Lv{YEL}{str(r.get('level','?')):<3}{R}  "
                    f"XP:{CYAN}{str(r.get('xp','0')):<6}{R}  "
                    f"Gold:{YEL}{str(r.get('gold','0')):<6}{R}  "
                    f"HP:{_hpbar(r.get('enamel_health',100))}  "
                    f"Streak:{RED if r.get('current_streak',0)==0 else GREEN}{str(r.get('current_streak','0')):<4}{R}"
                )
            },
            "brushing_logs": {
                "pk": "id",
                "cols": ["uid", "session_date", "duration_seconds", "quality_score", "xp_earned"],
                "display": lambda r: (
                    f"  {GREEN}{str(r.get('uid',''))[:20]:<20}{R}  "
                    f"{YEL}{r.get('session_date',''):<12}{R}  "
                    f"{r.get('duration_seconds','?')}s  "
                    f"Quality:{_qbar(r.get('quality_score',0))}  "
                    f"+{CYAN}{r.get('xp_earned','0')}{R}xp"
                )
            },
        }
    },
    {
        "file": "quests.db",
        "label": "QUESTS",
        "color": MAG,
        "icon": "[QUEST]",
        "tables": {
            "quest_progress": {
                "pk": "uid+id",
                "cols": ["uid", "quest_id", "progress", "completed"],
                "display": lambda r: (
                    f"  {MAG}{str(r.get('uid',''))[:18]:<20}{R}  "
                    f"{str(r.get('quest_id','')):<25}  "
                    f"{_pbar(r.get('progress',0))}  "
                    f"{ GREEN+'✓ DONE'+R if r.get('completed') else YEL+'⟳ active'+R }"
                )
            }
        }
    },
    {
        "file": "rewards.db",
        "label": "REWARDS",
        "color": YEL,
        "icon": "[REWARD]",
        "tables": {
            "achievements": {
                "pk": "uid+id",
                "cols": ["uid", "achievement_id", "unlocked_at"],
                "display": lambda r: (
                    f"  {YEL}{str(r.get('uid',''))[:18]:<20}{R}  "
                    f"{GREEN}✓{R}  "
                    f"{str(r.get('achievement_id','')):<30}  "
                    f"{GRAY}{r.get('unlocked_at','')[:16]}{R}"
                )
            }
        }
    },
    {
        "file": "ai.db",
        "label": "AI / TANU",
        "color": ORAN,
        "icon": "[AI]   ",
        "tables": {
            "chat_history": {
                "pk": "id",
                "cols": ["uid", "role", "content", "timestamp"],
                "display": lambda r: (
                    f"  {'👤' if r.get('role')=='user' else '🤖'}  "
                    f"{CYAN if r.get('role')=='user' else YEL}{str(r.get('uid',''))[:16]:<18}{R}  "
                    f"{GRAY}{str(r.get('content',''))[:50]:<50}{R}"
                )
            }
        }
    },
]

# ── Helpers ──────────────────────────────────────────────────────────
def _bar(val, max_val, width, fill_col, empty_col=GRAY, char="█", empty="░"):
    try:
        filled = max(0, min(width, int((float(val) / float(max_val)) * width)))
    except Exception:
        filled = 0
    return f"{fill_col}{char*filled}{empty_col}{empty*(width-filled)}{R}"

def _hpbar(v):
    v = v or 0
    c = GREEN if v > 70 else YEL if v > 40 else RED
    return f"{_bar(v,100,8,c)} {c}{v}%{R}"

def _qbar(v):
    v = v or 0
    c = GREEN if v >= 80 else YEL if v >= 50 else RED
    return f"{_bar(v,100,8,c)} {c}{v}%{R}"

def _pbar(v):
    v = v or 0
    return f"{_bar(v,100,10,MAG)} {MAG}{v}%{R}"

def get_conn(db_file):
    path = os.path.join(DB_DIR, db_file)
    if not os.path.exists(path): return None
    try:
        conn = sqlite3.connect(f"file:{path}?mode=ro", uri=True, timeout=1, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception: return None

def fetch_rows(conn, table, cols, limit=5):
    try:
        col_str = ", ".join(cols)
        return conn.execute(f"SELECT {col_str} FROM {table} ORDER BY rowid DESC LIMIT {limit}").fetchall()
    except Exception: return []

def row_count(conn, table):
    try: return conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    except Exception: return "?"

def table_exists(conn, table):
    try:
        conn.execute(f"SELECT 1 FROM {table} LIMIT 1")
        return True
    except Exception: return False

def clear(): os.system("cls" if os.name == "nt" else "clear")

def render():
    clear()
    now = datetime.now().strftime("%H:%M:%S")

    print(f"\n{CYAN}{BOLD}  ╔══════════════════════════════════════════════════════════════════╗{R}")
    print(f"{CYAN}{BOLD}  ║   🦷  TOOTH KINGDOM — LIVE DATABASE VIEWER v2.0       {now}  ║{R}")
    print(f"{CYAN}{BOLD}  ╚══════════════════════════════════════════════════════════════════╝{R}")
    print(f"{GRAY}  Refreshes every 5s  |  Press CTRL+C to exit  |  Read-only mode{R}")

    for db in DBS:
        conn = get_conn(db["file"])
        print(f"\n{db['color']}{BOLD}  {db['icon']}  {db['label']} DATABASE{R}  {GRAY}({db['file']}){R}")
        print(f"{db['color']}  {'─'*72}{R}")

        if not conn:
            print(f"  {GRAY}  Database not found yet.{R}")
            continue

        has_any = False
        for tname, tdef in db["tables"].items():
            if not table_exists(conn, tname): continue
            has_any = True
            count = row_count(conn, tname)
            print(f"  {GRAY}Table: {WHITE}{BOLD}{tname}{R}  {GREEN}PK:{tdef['pk']}{R}  {GRAY}Total rows: {WHITE}{count}{R}")
            print(f"{GRAY}  {'─'*70}{R}")

            rows = fetch_rows(conn, tname, tdef["cols"])
            if rows:
                for r in rows:
                    try: print(tdef["display"](dict(r)))
                    except Exception as e: print(f"  {RED}(error: {e}){R}")
            else:
                print(f"  {GRAY}  No records yet.{R}")
        
        if not has_any: print(f"  {GRAY}  No tables found.{R}")
        conn.close()

def main():
    while True:
        try:
            render()
            time.sleep(5)
        except KeyboardInterrupt:
            print(f"\n  {YEL}DB Viewer closed.{R}\n")
            sys.exit(0)
        except Exception: time.sleep(5)

if __name__ == "__main__":
    main()
