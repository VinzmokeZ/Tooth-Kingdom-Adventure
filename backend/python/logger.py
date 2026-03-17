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
