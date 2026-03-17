# 🔄 The Technical Lifecycle: From Pixel to Database

This document explains the "Full Journey" of a single action in the Tooth Kingdom (e.g., finishing Chapter 1).

---

## 1. The Interaction Layer (Frontend)
It all starts in **`src/components/screens/ChaptersScreen.tsx`**.
- User clicks "START" on Chapter 1.
- `handleStartChapter(1)` is triggered.
- The **`GameEngine.tsx`** loads the `EnamelCastleSiege.tsx` component.
- The user plays the game and eventually the game component calls `onComplete(score, stars)`.

---

## 2. The Logic Layer (Service)
The result moves to **`src/services/rpgService.ts`**.
- The `rewardTaskCompletion` function is called.
- **XP Calculation:** `xp += 50`.
- **Level Logic:** If XP > threshold, `level++`.
- **Gold Logic:** `gold += 20`.
- A "Reward Notification" is added to the user's state.

---

## 3. The State Layer (Context)
The update is captured by **`src/context/GameContext.tsx`**.
- `updateUserData` is called with the new XP/Gold/Stars.
- **Local Persistence:** The data is immediately saved to `window.localStorage` (Offline-first).
- **Debouncing:** To prevent spamming the server, the app waits 1-2 seconds of inactivity before "Syncing."

---

## 4. The Bridge Layer (Capacitor/API)
The app checks **`src/lib/firebase.ts`**.
- It discovers the `API_URL` (e.g., `http://localhost:8000`).
- It sends a `POST` request to `/users/{uid}/save`.

---

## 5. The Receiver Layer (FastAPI Backend)
The backend **`backend/python/main.py`** receives the JSON.
- It parses the data using **Pydantic Models**.
- It passes the data to the **`routers/game.py`** script.

---

## 6. The Persistence Layer (SQLite)
The backend executes SQL commands on **`database.db`**.
- `UPDATE character_stats SET xp = ?, level = ? WHERE uid = ?`
- `INSERT INTO chapter_progress (chapter_id, score, stars) VALUES (?, ?, ?)`
- The data is now "Safe" forever! 🏦

---

## 7. The Visual Loop (Update)
Next time the user opens the **Dashboard**, the app fetches this data, and the XP bar grows to reflect their victory.
