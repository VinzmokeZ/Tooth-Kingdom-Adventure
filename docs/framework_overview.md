# 🏗️ Tooth Kingdom: Framework & Database Overview

This document provides a deep dive into the technical "Engine" of the project, including the mobile bridge, the API framework, and the SQLite database structure.

---

## 📱 1. Mobile Framework: Capacitor
Your app is built using a **"Hybrid" architecture**. This means the code is written in web technologies (React/TS) but runs as a native app on Android and iOS.

- **`capacitor.config.ts`**: The configuration file that tells Capacitor how to package your app.
    - **App ID**: `com.toothkingdom.adventure`
    - **Web Dir**: `dist` (This is where your compiled React code goes).
- **Bridge Logic**: The `isNative` keyword in the code checks if the **Capacitor Bridge** is active, allowing the app to use phone features (like the camera or local files) that a normal website can't.

---

## ⚡ 2. Backend Framework: FastAPI
The backend uses **FastAPI**, a modern, high-performance Python framework.

- **Asynchronous Logic**: It handles multiple requests at once without slowing down.
- **Routers**: The logic is split into "Routers" for organization:
    - `users.py`: Handles profiles, settings, and automatic user creation.
    - `game.py`: Handles the "math" of the game (XP calculations, level thresholds, and progress).
- **Auto-Provisioning**: If a user logs in via a "New" device or offline mode, the framework **automatically creates** their database entries so the app never crashes with a "User Not Found" error.

---

## 🗄️ 3. Database Architecture: SQLite
The "New SQLite DB" is the permanent memory of your project. It is stored in `backend/python/database.db`.

### 📊 The Schema (Tables)
| Table Name | What it stores | Key Fields |
| :--- | :--- | :--- |
| **`users`** | Identity & Security | `uid`, `name`, `email`, `password_hash`, `role`, `provider` (google/local) |
| **`character_stats`** | Core Progress (The "Stats") | `xp`, `level`, `gold`, `enamel_health`, `current_streak`, `total_stars` |
| **`brushing_logs`** | History | `session_date`, `duration_seconds`, `quality_score` |
| **`chapter_progress`**| Game Levels | `chapter_id`, `stars_earned`, `score`, `attempts` |
| **`quest_progress`** | RPG Elements | `quest_id`, `progress`, `completed` |
| **`achievements`** | Badges | `achievement_id`, `unlocked_at` |
| **`chat_history`** | AI Memory | `role` (user/bot), `content`, `timestamp` |

### 🔗 Relational Logic
Every table uses the **`uid`** (Unique Identifier) as the "Glue." 
- When the frontend asks for `userData`, the backend queries ALL these tables at once using the `uid` and merges them into one big JSON object to send back to React.

---

## 🔄 4. The Syncing "Framework"
The most important part of your framework is how it handles **Offline vs Online** states:

1.  **Frontend First**: React always updates the screen immediately (for speed).
2.  **Shadow Sync**: The app saves to **`localStorage`** first so progress isn't lost if the internet drops.
3.  **Background POST**: The `GameProvider` sends a "Sync Signal" to the FastAPI backend.
4.  **Database Commit**: SQLite performs an **`INSERT OR IGNORE`** or **`UPDATE`** to make sure the data is saved forever.

---

## 🛠️ Summary of Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons.
- **Mobile**: Capacitor (Native Bridge).
- **Backend API**: FastAPI (Python).
- **Database**: SQLite3.
- **AI/Voice**: Google Gemini + ElevenLabs.
