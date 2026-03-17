# technical_lifecycle.md: The Data Journey

1. **User Action**: User plays a game (e.g., Chapter 1).
2. **Game End**: Component calls `onComplete(score, stars)`.
3. **RPG Math**: `rpgService.ts` calculates XP and Gold.
4. **Local Save**: `GameContext.tsx` updates `localStorage` (Offline-first).
5. **Backend Sync**: App sends a JSON packet to the FastAPI server.
6. **DB Commit**: SQLite updates the `character_stats` and `chapter_progress` tables.
7. **Refresh**: The next time the Dashboard loads, it pulls the new values from the DB.
