# ⚡ 03: Backend Deep-Dive & SQLite Architecture

This document explains the "Engine" and "Memory" of the app.

---

## 🏗️ 3.1 Backend Framework (FastAPI)
The backend is a Python **FastAPI** server (`backend/python/main.py`).

- **Architecture**: Modular routing. Logic is split into `routers/users.py` and `routers/game.py`.
- **Auto-Sync**: When a user logs in, the backend sends a "Snapshot" of their entire career to the frontend.
- **AI Integration**: The `/ai/process` endpoint pipes user questions directly to **Google Gemini** for dental advice.

---

## 🗄️ 3.2 Database Schema (SQLite)
The data is stored permanently in `database.db`.

| Table Name | Description | Key Fields |
| :--- | :--- | :--- |
| **`users`** | Identity | `uid`, `email`, `role`, `provider` |
| **`character_stats`**| RPG Data | `xp`, `level`, `gold`, `enamel_health` |
| **`brushing_logs`** | History | `session_date`, `duration`, `quality` |
| **`chapter_progress`**| Levels | `chapter_id`, `stars`, `score` |
| **`achievements`** | Badges | `achievement_id`, `unlocked_at` |

---

## 🗣️ 3.3 AI & Voice (ElevenLabs)
Your app can **speak** to the user.
- **Workflow**: 
    1. User asks a question to the Chibi Guide.
    2. FastAPI sends text to **Gemini**.
    3. Gemini's response is sent to **ElevenLabs**.
    4. An MP3 audio stream is returned to the frontend and played instantly.

---

## 🔄 3.4 Data Integrity
The backend uses **`INSERT OR IGNORE`** and **`UPDATE`** patterns. This ensures that even if the internet flickers, the app always tries to reconcile the latest progress from the frontend with the database.
