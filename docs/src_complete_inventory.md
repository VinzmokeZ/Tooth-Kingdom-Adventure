# 📂 Complete Source Inventory: `src/` Folder

This document lists every important file in your `src` directory and explains its role in the Tooth Kingdom app.

---

## 🏗️ Root Files
- **`App.tsx`**: The "Heart." Manages screen state, global providers, and backend sync loops.
- **`main.tsx`**: The "Mouth." Initializes React and adds the Desktop Scroll Helper.
- **`index.css`**: The "Style." Contains the Tooth Kingdom palette and animations.

---

## 📱 `src/components/` (The Body)

### `screens/` (Your Pages)
- **`DashboardScreen.tsx`**: The main hub with character stats and the Kingdom Map link.
- **`ChaptersScreen.tsx`**: The map of all 6 chapters.
- **`BrushingLessonScreen.tsx`**: The interactive brushing guide (Morning/Evening).
- **`SignInScreen.tsx` / `OTPVerificationScreen.tsx`**: Authentication flow logic.
- **`ParentDashboardScreen.tsx`**: Controls for parents to check progress.

### `games/` (Your Mini-Games)
- **`GameEngine.tsx`**: The switchboard that loads the correct game for each chapter.
- **`EnamelCastleSiege.tsx`**: Chapter 1 Game.
- **`KingsBanquet.tsx`**: Chapter 4 Game.
- **`ExternalGameWrapper.tsx`**: Used to load GML or Unity games via `<iframe>`.

---

## 🧠 `src/context/` (The Brain)
- **`AuthContext.tsx`**: Manages user identity, tokens, and Firebase status.
- **`GameContext.tsx`**: The most important file for progress. It holds your XP, Gold, and Sync logic.

---

## ⚙️ `src/services/` & `lib/` (The Organs)
- **`rpgService.ts`**: The math engine. Calculates XP gain, Level Ups, and Health Penalties.
- **`firebase.ts`**: Handles the connection to Google Firebase and discovers your local Python API.

---

## 🛠️ `src/hooks/` & `utils/` (The Cells)
- **`useSound.ts`**: Simple hook to play sound effects (Click, Success, Level Up).
- **`useAuth.ts`**: Shortcut to access user data in any component.
- **`constants.ts`**: Storage for all rewards, chapter data, and achievement IDs.

---

## 🖼️ `src/assets/` (The Skin)
- **`CHIBI 1-6.svg`**: Your character avatars.
- **`Kingdom_Map.png`**: The background for the chapter select.
- **`sounds/`**: All audio assets used in games and menus.
