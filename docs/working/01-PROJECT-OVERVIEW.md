# 📄 01: Project Overview & Master Architecture

**Tooth Kingdom Adventure** is a premium dental-health RPG for kids, built with a mobile-first hybrid approach.

---

## 🏗️ 1.1 High-Level Architecture
- **Frontend**: React 18 + TypeScript + Vite. Uses a "Phone Frame" to ensure mobile consistency on desktop.
- **Backend**: FastAPI (Python). High-performance asynchronous API for data persistence and AI processing.
- **Database**: SQLite. Local database stored in `backend/python/database.db`.
- **Mobile Bridge**: Capacitor 6. This bridges the web code to native Android/iOS APKs.

---

## 🛠️ 1.2 The Technology Stack
| Layer | Core Tech | Key Library |
| :--- | :--- | :--- |
| **Styling** | Vanilla CSS + Tailwind | Framer Motion (Animations) |
| **Logic** | React Context API | `AuthContext`, `GameContext` |
| **Mobile** | Capacitor | `@capacitor/android`, `@capacitor/ios` |
| **Engine** | Vite | `vite-plugin-pwa` for offline support |
| **Database** | SQL (SQLite) | `sqlite3` Python module |
| **AI/Voice** | Google Gemini | ElevenLabs (Text-to-Speech) |

---

## 📂 1.3 Master Directory Structure
- `src/`: All frontend code (Screens, Context, Utility).
- `backend/python/`: The API server and SQLite database.
- `public/games/`: External game engines (Unity, Godot, GameMaker).
- `game-logic/`: The C# and GML blueprints for the 6 core games.
- `docs/working/`: Your current detailed documentation suite.

---

## 🔄 1.4 How It All Starts
1. **Boot**: `index.html` loads, rendering `main.tsx`.
2. **Setup**: `App.tsx` initializes global state (Auth & Game).
3. **Route**: `AppScreens.tsx` reads the `currentScreen` state and displays the correct UI (e.g., Dashboard).
4. **Sync**: The app automatically detects if a user is logged in and syncs their levels from the Python backend.
