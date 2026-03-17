<<<<<<< HEAD
import os
import sys
import time
from datetime import datetime

try:
    from colorama import init, Fore, Style
    init(autoreset=True)
except ImportError:
    # Fallback for systems without colorama
    class MockColor:
        def __getattr__(self, name): return ""
    Fore = Style = MockColor()

# Configuration
LOG_DIR = os.path.join(os.path.dirname(__file__), "logs")
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

LOG_FILE = os.path.join(LOG_DIR, f"backend_{datetime.now().strftime('%Y-%m-%d')}.log")

def _write_file(msg):
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n")
    except:
        pass

def api_log(method, path, status, duration):
    """Logs API requests with high-visibility colors"""
    color = Fore.GREEN if 200 <= status < 300 else Fore.YELLOW if status < 500 else Fore.RED
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    msg = f"[BACKEND] [{timestamp}] INFO:  127.0.0.1 - \"{method} {path} HTTP/1.1\" {status} OK"
    console_msg = f"{Fore.GREEN}[BACKEND]{Style.RESET_ALL} INFO:     127.0.0.1 - \"{method} {path} HTTP/1.1\" {color}{status} OK{Style.RESET_ALL}"
    
    print(console_msg)
    _write_file(msg)

def db_log(category, message, level="INFO"):
    """Logs database operations like the user's reference image"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    color = Fore.CYAN if level == "INFO" else Fore.RED
    
    msg = f"[BACKEND] [{timestamp}] [{category}] {message}"
    console_msg = f"{Fore.GREEN}[BACKEND]{Style.RESET_ALL} [{timestamp}] {color}[{category}]{Style.RESET_ALL} {message}"
    
    print(console_msg)
    _write_file(msg)

def error_log(message):
    """Logs critical errors"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    console_msg = f"{Fore.RED}[BACKEND] [ERROR] {timestamp} - {message}{Style.RESET_ALL}"
    print(console_msg)
    _write_file(f"ERROR: {message}")
=======
"""
Tooth Kingdom Adventure - Rich Terminal Logger
Colored, unicode-safe, logs to file + terminal simultaneously.
"""
import os
import sys
import traceback
from datetime import datetime

# Try colorama for Windows color support
try:
    import colorama
    colorama.init(autoreset=True)
    COLORAMA = True
except ImportError:
    COLORAMA = False

# ANSI color codes (fallback if colorama not installed)
RESET  = "\033[0m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
RED    = "\033[91m"
GREEN  = "\033[92m"
YELLOW = "\033[93m"
BLUE   = "\033[94m"
MAGENTA= "\033[95m"
CYAN   = "\033[96m"
WHITE  = "\033[97m"
GRAY   = "\033[90m"

METHOD_COLORS = {
    "GET":    CYAN,
    "POST":   GREEN,
    "PUT":    YELLOW,
    "PATCH":  YELLOW,
    "DELETE": RED,
    "HEAD":   GRAY,
    "OPTIONS":GRAY,
}

STATUS_COLORS = {
    2: GREEN,   # 2xx
    3: CYAN,    # 3xx
    4: YELLOW,  # 4xx
    5: RED,     # 5xx
}

# ── Log file setup ──────────────────────────────────────
LOG_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, f"backend_{datetime.now().strftime('%Y-%m-%d')}.log")


def _safe_str(msg) -> str:
    """Remove characters that break Windows terminal."""
    try:
        return str(msg).encode('cp1252', errors='replace').decode('cp1252')
    except Exception:
        return str(msg).encode('ascii', errors='replace').decode('ascii')


def _write_log(line: str):
    """Write a clean (no ANSI) line to the log file."""
    try:
        clean = line
        # Strip ANSI escape codes for file
        import re
        clean = re.sub(r'\033\[[0-9;]*m', '', clean)
        with open(LOG_FILE, "a", encoding="utf-8", errors="replace") as f:
            f.write(clean + "\n")
    except Exception:
        pass


def _print(msg: str, color: str = ""):
    try:
        line = f"{color}{msg}{RESET}" if color else msg
        print(line, flush=True)
        _write_log(msg)
    except UnicodeEncodeError:
        safe = _safe_str(msg)
        print(safe, flush=True)
        _write_log(safe)


# ── Public API ───────────────────────────────────────────

def banner(title: str, lines: list[str]):
    """Print a startup banner box."""
    width = max(len(title), max(len(l) for l in lines)) + 4
    bar = "=" * width
    _print(f"\n{bar}", CYAN + BOLD)
    _print(f"  {title}", CYAN + BOLD)
    _print(bar, CYAN + BOLD)
    for line in lines:
        _print(f"  {line}", WHITE)
    _print(bar + "\n", CYAN + BOLD)


def info(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    _print(f"[{ts}] [INFO]  {msg}", WHITE)


def success(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    _print(f"[{ts}] [OK]    {msg}", GREEN)


def warn(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    _print(f"[{ts}] [WARN]  {msg}", YELLOW)


def error(msg: str, exc: Exception = None):
    ts = datetime.now().strftime("%H:%M:%S")
    _print(f"[{ts}] [ERROR] {msg}", RED)
    if exc:
        tb = traceback.format_exc()
        _print(f"  {tb}", RED)
        _write_log(f"  TRACEBACK: {tb}")


def db_log(db_name: str, action: str):
    ts = datetime.now().strftime("%H:%M:%S")
    _print(f"[{ts}] [DB]    [{db_name.upper()}] {action}", MAGENTA)


def request_log(method: str, path: str, status: int, duration_ms: float, client_ip: str = ""):
    """Print a colored request log line."""
    ts = datetime.now().strftime("%H:%M:%S")
    method_color = METHOD_COLORS.get(method.upper(), WHITE)
    status_color = STATUS_COLORS.get(status // 100, WHITE)
    status_label = f"{status} OK" if status == 200 else \
                   f"{status} Created" if status == 201 else \
                   f"{status} No Content" if status == 204 else \
                   f"{status} Bad Request" if status == 400 else \
                   f"{status} Unauthorized" if status == 401 else \
                   f"{status} Not Found" if status == 404 else \
                   f"{status} Conflict" if status == 409 else \
                   f"{status} Error" if status >= 500 else str(status)

    ip_part = f" [{client_ip}]" if client_ip else ""
    line = (
        f"[{ts}] "
        f"{method_color}[{method:<7}]{RESET} "
        f"{WHITE}{path:<45}{RESET} "
        f"{status_color}-> {status_label:<20}{RESET} "
        f"{GRAY}({duration_ms:.0f}ms){ip_part}{RESET}"
    )
    try:
        print(line, flush=True)
        _write_log(f"[{ts}] [{method:<7}] {path:<45} -> {status_label:<20} ({duration_ms:.0f}ms){ip_part}")
    except UnicodeEncodeError:
        safe = _safe_str(line)
        print(safe, flush=True)
>>>>>>> 7202e6ef40987237d747d24a920e2c14e55500f8
