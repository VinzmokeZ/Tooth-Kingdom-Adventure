import sqlite3
import os
import time

DB_PATH = "backend/python/database.db"

def seed():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Create a Teacher
    teacher_uid = "teacher_seed_1"
    cursor.execute("INSERT OR IGNORE INTO users (uid, name, email, role) VALUES (?,?,?,?)",
                   (teacher_uid, "Professor Wisdom", "teacher@toothkingdom.com", "teacher"))
    
    # 2. Create a Parent
    parent_uid = "parent_seed_1"
    cursor.execute("INSERT OR IGNORE INTO users (uid, name, email, role) VALUES (?,?,?,?)",
                   (parent_uid, "Guardian Grace", "parent@toothkingdom.com", "parent"))
    
    # 3. Create some Heroes (Students/Children)
    heroes = [
        ("hero_1", "Alex Archer", 5, 2500, 15, "1"),
        ("hero_2", "Luna Light", 3, 1200, 7, "2"),
        ("hero_3", "Leo Lion", 8, 4000, 22, "3"),
        ("hero_4", "Mia Storm", 2, 500, 3, "1"),
        ("hero_5", "Kai Blaze", 6, 3100, 12, "2"),
    ]
    
    for uid, name, level, stars, streak, char_id in heroes:
        cursor.execute("INSERT OR IGNORE INTO users (uid, name, role) VALUES (?,?,?)", (uid, name, "hero"))
        cursor.execute("INSERT OR REPLACE INTO game_stats (uid, level, gold, current_streak, selected_character) VALUES (?,?,?,?,?)",
                       (uid, level, stars, streak, char_id))
        
    # 2. Add More Students (to reach 24 total)
    # teacher_uid is already defined as "teacher_seed_1"
    student_data = []
    relations = []
    
    # Existing heroes (some) - link them to the teacher
    relations.append((teacher_uid, "hero_1", "teacher_student"))
    relations.append((teacher_uid, "hero_2", "teacher_student"))
    relations.append((teacher_uid, "hero_3", "teacher_student"))
    relations.append((teacher_uid, "hero_4", "teacher_student"))
    relations.append((teacher_uid, "hero_5", "teacher_student"))
    
    # Generate 19 more students (5 existing + 19 new = 24 total)
    for i in range(6, 25): # Start from 6 since hero_1 to hero_5 already exist
        sid = f"hero_{i}" # Changed from student_{i} to hero_{i} for consistency
        name = f"Hero Student {i}"
        # The original heroes list didn't have email/phone, but the new insert does.
        # For consistency, I'll add dummy email/phone for generated students.
        student_data.append((sid, name, f"student{i}@kingdom.com", f"9000000{i:02d}", "hero"))
        relations.append((teacher_uid, sid, "teacher_student"))
        
    cursor.executemany("INSERT OR IGNORE INTO users (uid, name, email, phone, role) VALUES (?,?,?,?,?)", student_data)
    # The original game_stats insert used (level, gold, current_streak, selected_character)
    # The new one uses (level, xp, gold, enamel_health). I'll use the new one for consistency with the requested change.
    # Assuming default values for new students: level 1, 0 xp, 0 gold, 90 enamel_health
    cursor.executemany("INSERT OR IGNORE INTO game_stats (uid, level, xp, gold, enamel_health) VALUES (?,?,?,?,?)", 
                       [(s[0], 1, 0, 0, 90) for s in student_data])
    cursor.executemany("INSERT OR IGNORE INTO user_relations (parent_uid, child_uid, relation_type) VALUES (?,?,?)", relations)
    
    # Parent-Child link
    # parent_uid is already defined as "parent_seed_1"
    cursor.execute("INSERT OR IGNORE INTO user_relations (parent_uid, child_uid, relation_type) VALUES (?,?,?)",
                   (parent_uid, "hero_2", "parent_child"))
    
    # 3. Add some real "Mock" Quests
    quests = [
        ('daily_brush_morning', 'Morning Guardian', 'Brush your teeth in the morning to protect the kingdom.', 1, 50, 10),
        ('daily_brush_night', 'Night Watchman', 'Brush before bed to defeat the midnight sugar bugs.', 1, 50, 10),
    ]
    cursor.executemany("INSERT OR IGNORE INTO daily_quests (quest_id, title, description, requirement, reward_xp, reward_gold) VALUES (?,?,?,?,?,?)", quests)

    # 4. Add some real "Mock" Logs
    logs = [
        ('hero_1', '2026-03-17 08:30:00', 120, 95, 50, 10),
        ('hero_2', '2026-03-17 08:45:00', 115, 88, 45, 8),
    ]
    cursor.executemany("INSERT OR IGNORE INTO brushing_logs (uid, session_date, duration_seconds, quality_score, xp_earned, gold_earned) VALUES (?,?,?,?,?,?)", logs)

    conn.commit()
    conn.close()
    print("Database seeded with relationships, quests, and logs!")

if __name__ == "__main__":
    seed()
