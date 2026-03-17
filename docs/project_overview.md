# 🏰 Tooth Kingdom Adventure: Project Overview & Logic Guide

Welcome to the **Tooth Kingdom Adventure** project! This document explains how the frontend and backend work together, the structure of the codebase, and the key concepts that make the app function.

---

## 🚀 1. High-Level Architecture

The project consists of a **React Frontend** (Mobile-first, but desktop-compatible) and a **FastAPI (Python) Backend**.

- **Frontend**: Handles the user interface, animations, game logic (mini-games), and local state.
- **Backend**: Manages persistent data (User profiles, XP, Stars), authentication, and AI interactions.
- **Database**: A local SQLite database is used for persistent storage on the backend.

---

## 🎨 2. Frontend Structure (`src/`)

The `src/` directory is the heart of the frontend. Here's how it's organized:

### 📥 Entry Points
- **`main.tsx`**: The main entry point. It initializes React and includes a **Desktop Scroll Helper** that allows "drag-to-scroll" behavior on non-touch devices (mirroring mobile behavior).
- **`App.tsx`**: The main application component. It wraps the app in **Providers** (`AuthProvider`, `GameProvider`, `ThemeProvider`) and manages the top-level **Screen State**.

### 🧩 Core Directories
- **`components/`**: UI components categorized by function:
    - `screens/`: Individual app pages (Dashboard, Settings, Profile, etc.).
    - `games/`: Mini-games (e.g., `DeepCleanChallenge`, `EnamelCastleSiege`).
    - `common/`: Reusable UI elements (Buttons, Cards, Modals).
- **`context/`**: Global state management (The "Stores"):
    - **`AuthContext.tsx`**: Manages user login/logout, Firebase integration, and session tokens.
    - **`GameContext.tsx`**: Manages user progress (XP, Gold, Level, Brushing Logs).
- **`lib/`**: External service configurations (e.g., `firebase.ts` for Firebase and API discovery).
- **`hooks/`**: Custom React hooks (e.g., `useSound` for audio effects, `useAuth` for quick access to user state).
- **`services/`**: API wrappers and external service logic.
- **`utils/`**: Helper functions for formatting, calculations, and data transformation.

---

## 🧭 3. Navigation & Screen Flow

Unlike traditional websites with URLs for every page, this app uses a **State-Based Navigation** system.

- **`currentScreen`**: A variable in `AppContent` (inside `App.tsx`) that tracks which screen is visible.
- **`navigateTo(screenName)`**: A function passed to all screens. When you click a button (e.g., "Settings"), it calls `navigateTo('settings')`, which updates the state and swaps the rendered component.
- **`AppScreens.tsx`**: A central "Switchboard" that looks at `currentScreen` and decides which component to render (`Switch` statement).

---

## 💾 4. State & Data Updates (The "Stores")

The app uses **React Context** to share data across all files.

### 🛡️ AuthContext
- **How it works**: It listens to Firebase Auth. When a user logs in via Google or Email, it stores the user object.
- **Local/Backend Sync**: It also attempts to sync the user with our local Python backend to ensure we have a record in our SQLite database.

### 🎮 GameContext
- **How it works**: It holds the `userData` object (the MOST important object in the app), which includes:
    - `xp`, `gold`, `level`
    - `completedChapters`
    - `brushingLogs` (Daily morning/evening checks)
- **Automatic Sync**:
    1. **Local Storage**: Every time `userData` changes, it's saved to the browser's `localStorage` so it persists even if you refresh.
    2. **Backend Sync**: It uses a "Debounced" effect (waits 1 second after you stop moving/playing) to POST the updated data to the Python backend.

---

## ⚙️ 5. Backend Logic (FastAPI)

The backend is located in `backend/python/` and is built with **FastAPI**.

- **`main.py`**: The server entry point. It sets up the API routes and initializes the database.
- **`database.db`**: An SQLite file where all user data is stored.
- **Key API Routes**:
    - `/auth/`: Handle registration, login, and Google sync.
    - `/users/{uid}`: Get or Update the full `userData` JSON object.
    - `/debug/`: Helper routes for testing and logs.

### 🤖 AI Integration (Haru/Tanu AI)
- **`/ai/process`**: This route handles the AI guide.
- **Logic**: It receives text or audio from the frontend, sends it to **Google Gemini (AI Brain)**, and then converts the response to speech using **ElevenLabs (TTS)**.
- **Mockup Path**: To ensure stability, common questions (like "How do I brush?") are fast-tracked with pre-written answers.

---

## 🔑 6. Important Keywords & Concepts

For a deep dive into the specific programming keywords used in this project (TypeScript, Python, C#, and GML), please refer to the:
- 👉 [**Language & Keyword Guide**](file:///c:/Users/Vinz/Downloads/Internship%20Project%20-%201/Product%20Design%20and%20Development/Frontend%20-%20Backup/docs/language_guide.md)
- 👉 [**Complete Source Inventory (File-by-File)**](file:///c:/Users/Vinz/Downloads/Internship%20Project%20-%201/Product%20Design%20and%20Development/Frontend%20-%20Backup/docs/src_complete_inventory.md)
- 👉 [**Detailed Games Guide (Chapters 01-06)**](file:///c:/Users/Vinz/Downloads/Internship%20Project%20-%201/Product%20Design%20and%20Development/Frontend%20-%20Backup/docs/games_detailed_01_06.md)
- 👉 [**Full Technical Lifecycle (Frontend to Backend)**](file:///c:/Users/Vinz/Downloads/Internship%20Project%20-%201/Product%20Design%20and%20Development/Frontend%20-%20Backup/docs/technical_lifecycle.md)
- 👉 [**Framework & Database Guide**](file:///c:/Users/Vinz/Downloads/Internship%20Project%20-%201/Product%20Design%20and%20Development/Frontend%20-%20Backup/docs/framework_overview.md)

### 🗺️ Individual Chapter Deep-Dives (01 - 06)
1.  [**Chapter 01 (Cavity Miner)**](file:///c:/Users/Vinz/Downloads/Internship%20Project%20-%201/Product%20Design%20and%20Development/Frontend%20-%20Backup/docs/chapters/01.md)
2.  [**Chapter 02 (Shark Dentist)**](file:///c:/Users/Vinz/Downloads/Internship%20Project%20-%201/Product%20Design%20and%20Development/Frontend%20-%20Backup/docs/chapters/02.md)
3.  [**Chapter 03 (Flossing Adventures)**](file:///c:/Users/Vinz/Downloads/Internship%20Project%20-%201/Product%20Design%20and%20Development/Frontend%20-%20Backup/docs/chapters/03.md)
4.  [**Chapter 04 (Healthy Eating)**](file:///c:/Users/Vinz/Downloads/Internship%20Project%20-%201/Product%20Design%20and%20Development/Frontend%20-%20Backup/docs/chapters/04.md)
5.  [**Chapter 05 (Wise Knight Trial)**](file:///c:/Users/Vinz/Downloads/Internship%20Project%20-%201/Product%20Design%20and%20Development/Frontend%20-%20Backup/docs/chapters/05.md)
6.  [**Chapter 06 (Battle Dentist)**](file:///c:/Users/Vinz/Downloads/Internship%20Project%20-%201/Product%20Design%20and%20Development/Frontend%20-%20Backup/docs/chapters/06.md)

| Keyword | What it means in this project |
| :--- | :--- |
| **`isNative`** | A check to see if the app is running as a physical Android/iOS app (via Capacitor). |
| **`PhoneFrame`** | A CSS wrapper that makes the app look like it's inside a mobile phone when viewed on a desktop. |
| **`LOCAL_BACKEND_URL`** | The address of your Python server (usually `http://127.0.0.1:8010`). The app "discovers" this automatically. |
| **`userData`** | The central JSON object containing ALL progress. If this is lost, the user's progress is lost. |
| **`ChibiGuide`** | The animated character that gives tips on the dashboard. |
| **`Capacitor`** | The tool that converts this web code into a native mobile app. |
| **`Debounce`** | A technique used to wait before sending data to the server (to avoid crashing the server with too many requests). |

---

## 🛠️ 7. How Data Flows (Navigation -> Store -> Update)

The app follows a very specific "Cycle" to ensure your progress is always safe:

1.  **Navigate**: When you click a button, React uses **`navigateTo`** to change the `currentScreen` state.
2.  **Interact**: As you play a game or complete a lesson, the **`updateUserData`** function is called.
3.  **Local Store**: Any change to `userData` is immediately saved to **`localStorage`** (in your browser).
4.  **Backend Update**: A "watcher" (Effect) in `GameContext` sees the change and sends it to the **Python Backend** using a `POST` request to `/users/{uid}`.
5.  **Database Save**: Python receives the data and uses a **SQL `UPDATE`** command to save it into the `database.db` file permanently.

---

## 🚀 8. Development Tips

1. **Viewing Data**: Use the `DB_VIEWER.bat` in the root folder to see what's inside the SQLite database.
2. **Logs**: Check `backend_crash.log` and `server.log` if the backend stops responding.
3. **Adding a Screen**: To add a new screen, create it in `src/components/screens/`, add it to the `AppScreens.tsx` switchboard, and give it a name to use in `navigateTo`.
