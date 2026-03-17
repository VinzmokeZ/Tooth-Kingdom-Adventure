import sqlite3
import os

db_path = 'backend/python/database.db'
if not os.path.exists(db_path):
    print("Database not found!")
    exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT uid, name, email FROM users")
rows = cursor.fetchall()
print("\n--- ALL REGISTERED USERS ---")
for r in rows:
    print(f"UID: {r[0]} | Name: {r[1]} | Email: {r[2]}")
print("----------------------------\n")
conn.close()
