# framework_overview.md: The Tooth Kingdom Engine

### 📱 1. Mobile Framework: Capacitor
Your app is a **Hybrid App**. The code is web-based but runs natively on mobile using the Capacitor Bridge.
- **`capacitor.config.ts`**: The ID is `com.toothkingdom.adventure`.
- **`dist/`**: This is where your compiled React code is stored before it's sent to the phone.

### ⚡ 2. Backend Framework: FastAPI
The backend uses **Python FastAPI** for high speed.
- It automatically creates user profiles if they don't exist yet.
- It connects to Google Gemini for real-time AI dental tips.

### 🗄️ 3. Database: SQLite
The app's "Permanent Memory" is stored in `backend/python/database.db`.
- **`users`**: Logs your identity.
- **`character_stats`**: Stores your XP, Gold, and Level.
- **`chapter_progress`**: Stores stars earned in chapters 01-06.

### 🔄 4. The Syncing Cycle
1. **Action**: User finishes a game.
2. **Local**: Game saves to `localStorage` immediately.
3. **API**: Game sends a signal to the FastAPI backend.
4. **Database**: SQLite performs an `UPDATE` to save your new score.
