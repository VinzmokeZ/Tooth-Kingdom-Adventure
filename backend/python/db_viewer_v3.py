"""
Tooth Kingdom Adventure - Unified Database Viewer v3.0
Real-time view of unified database.db (Users, Stats, Logs).
Refreshes every 5 seconds. Press CTRL+C to exit.
"""
import os, sys, time, sqlite3
from datetime import datetime

try:
    from colorama import init, Fore, Style
    init(autoreset=True)
except ImportError:
    class MockColor:
        def __getattr__(self, name): return ""
    Fore = Style = MockColor()

DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

def safe_slice(val, length):
    if val is None: return "N/A"
    s = str(val)
    return (s[:length-1] + "…") if len(s) > length else s

def clear():
    os.system("cls" if os.name == "nt" else "clear")

def get_row_count(conn, table):
    try:
        return conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    except:
        return 0

def render():
    if not os.path.exists(DB_PATH):
        print(f"{Fore.RED}Database not found at: {DB_PATH}")
        return

    conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    
    clear()
    now = datetime.now().strftime("%H:%M:%S")
    print(f"{Fore.CYAN}{Style.BRIGHT}╔═════════════════════════════════════════════════════════════════════════╗")
    print(f"{Fore.CYAN}{Style.BRIGHT}║   🦷  TOOTH KINGDOM — UNIFIED DB VIEWER v3.0               {now}  ║")
    print(f"{Fore.CYAN}{Style.BRIGHT}╚═════════════════════════════════════════════════════════════════════════╝")
    
    # 1. Users table
    print(f"\n{Fore.GREEN}{Style.BRIGHT}👤 USERS TABLE {Fore.WHITE}(Total: {get_row_count(conn, 'users')})")
    print(f"{Fore.WHITE}{'-' * 85}")
    users = conn.execute("SELECT uid, name, email, phone, role FROM users").fetchall()
    if not users:
        print(f"{Fore.RED}No users found.")
    for u in users:
        uid = safe_slice(u['uid'], 15)
        name = safe_slice(u['name'], 12)
        email = safe_slice(u['email'], 20)
        phone = safe_slice(u['phone'], 12)
        role = u['role'] if u['role'] else "N/A"
        print(f"{Fore.YELLOW}{uid:<16} {Fore.WHITE}{name:<13} {Fore.BLUE}{email:<21} {Fore.CYAN}{phone:<13} {role:<8}")

    # 2. Game Stats table
    print(f"\n{Fore.MAGENTA}{Style.BRIGHT}🎮 GAME STATS {Fore.WHITE}(Total: {get_row_count(conn, 'game_stats')})")
    print(f"{Fore.WHITE}{'-' * 85}")
    stats = conn.execute("SELECT uid, level, xp, gold, enamel_health FROM game_stats LIMIT 5").fetchall()
    for s in stats:
        suid = safe_slice(s['uid'], 15)
        print(f"{Fore.YELLOW}{suid:<16} {Fore.CYAN}Lv {s['level'] or 0:<2}  {Fore.GREEN}XP: {s['xp'] or 0:<5}  {Fore.YELLOW}Gold: {s['gold'] or 0:<5}  {Fore.RED}HP: {s['enamel_health'] or 0}%")

    # 3. User Relations
    print(f"\n{Fore.CYAN}{Style.BRIGHT}🔗 USER RELATIONS {Fore.WHITE}(Total: {get_row_count(conn, 'user_relations')})")
    print(f"{Fore.WHITE}{'-' * 85}")
    relations = conn.execute("""
        SELECT parent_uid, child_uid, relation_type 
        FROM user_relations 
        ORDER BY created_at DESC LIMIT 5
    """).fetchall()
    if not relations:
        print(f"{Fore.RED}No relations found yet.")
    for r in relations:
        p_uid = safe_slice(r['parent_uid'], 15)
        c_uid = safe_slice(r['child_uid'], 15)
        rtype = r['relation_type']
        print(f"{Fore.YELLOW}{p_uid:<16} {Fore.BLUE}──({rtype})──▶ {Fore.CYAN}{c_uid:<16}")

    # 4. Unlocked Rewards
    print(f"\n{Fore.YELLOW}{Style.BRIGHT}🏆 UNLOCKED REWARDS {Fore.WHITE}(Total: {get_row_count(conn, 'unlocked_rewards')})")
    print(f"{Fore.WHITE}{'-' * 85}")
    rewards = conn.execute("SELECT uid, reward_id FROM unlocked_rewards LIMIT 5").fetchall()
    if not rewards:
        print(f"{Fore.RED}No rewards unlocked yet.")
    for rw in rewards:
        ruid = safe_slice(rw['uid'], 15)
        print(f"{Fore.YELLOW}{ruid:<16} {Fore.WHITE}Unlocked Reward ID: {rw['reward_id']}")

    # 5. User Quests
    print(f"\n{Fore.MAGENTA}{Style.BRIGHT}📜 ACTIVE QUESTS {Fore.WHITE}(Total: {get_row_count(conn, 'user_quests')})")
    print(f"{Fore.WHITE}{'-' * 85}")
    quests = conn.execute("""
        SELECT uq.uid, dq.title, uq.progress, dq.requirement, uq.completed
        FROM user_quests uq
        JOIN daily_quests dq ON uq.quest_id = dq.quest_id
        LIMIT 5
    """).fetchall()
    if not quests:
        print(f"{Fore.RED}No active quests yet.")
    for q in quests:
        quid = safe_slice(q['uid'], 15)
        status = "✅ DONE" if q['completed'] else f"⏳ {q['progress']}/{q['requirement']}"
        print(f"{Fore.YELLOW}{quid:<16} {Fore.WHITE}{q['title']:<25} {Fore.CYAN}{status}")

    # 6. Brushing Logs
    print(f"\n{Fore.BLUE}{Style.BRIGHT}🪥 BRUSHING LOGS {Fore.WHITE}(Total: {get_row_count(conn, 'brushing_logs')})")
    print(f"{Fore.WHITE}{'-' * 85}")
    logs = conn.execute("SELECT uid, session_date, duration_seconds, quality_score FROM brushing_logs ORDER BY session_date DESC LIMIT 3").fetchall()
    for l in logs:
        luid = safe_slice(l['uid'], 15)
        print(f"{Fore.YELLOW}{luid:<16} {Fore.WHITE}{l['session_date'] or 'N/A'}  {l['duration_seconds'] or 0}s  Quality: {l['quality_score'] or 0}%")

    conn.close()

if __name__ == "__main__":
    while True:
        try:
            render()
            time.sleep(1.5)
        except KeyboardInterrupt:
            print(f"\n{Fore.YELLOW}DB Viewer closed.")
            sys.exit(0)
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(5)
