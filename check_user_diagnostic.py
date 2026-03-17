import sqlite3
import os

DB_PATH = "backend/python/database.db"

def check_user(email):
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT uid, name, email FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        print(f"FOUND USER: {user}")
    else:
        print(f"USER NOT FOUND: {email}")

if __name__ == "__main__":
    check_user("vinzmokez@gmail.com")
