# 📱 02: Frontend Deep-Dive & Source Inventory

This document explains the "Body" of the Tooth Kingdom app: the `src/` directory.

---

## 🏗️ 2.1 The Core Components
- **`App.tsx`**: The root component. Manages global screen state and saves/loads user data.
- **`PhoneFrame.tsx`**: A visual wrapper that makes the app look like a smartphone on a desktop screen.

---

## 📂 2.2 Directory Breakdown (`src/`)

### 📺 `screens/` (Your 22+ Pages)
- **`DashboardScreen.tsx`**: The main hub showing Character Stats, Health, and Recent Progress.
- **`ChaptersScreen.tsx`**: The world map where you select levels 01-06.
- **`ParentDashboardScreen.tsx`**: Specialized UI for monitoring child progress and setting reminders.
- **`SignInScreen.tsx` / `OTPVerificationScreen.tsx`**: Authentication flow using local email/password or phone OTP.

### 🧠 `context/` (The Brain)
- **`AuthContext.tsx`**: Handles user login, registration, and sessions via Firebase or Local Backend.
- **`GameContext.tsx`**: The most critical file. It holds the `userData` object (XP, Gold, Stars) and handles the "Debounced Sync" to the database.

### ⚙️ `services/` (The RPG Engine)
- **`rpgService.ts`**: Contains all the game math.
    - `rewardTaskCompletion`: Calculates XP gain.
    - `applyHealthPenalty`: Deducts health if brushing is missed.
    - `trackQuestProgress`: Tracks long-term goals like "Brush for 7 Days Straight."

### 🛠️ `lib/` & `utils/`
- **`firebase.ts`**: Configures the connection to your API and determines the `API_URL`.
- **`aiMockService.ts`**: Provides fallback responses if the Gemini API is offline.

---

## 🔄 2.3 The Navigation System
Navigation is **State-Based**, not URL-based.
- `navigateTo('chapters')` changes a string in `App.tsx`.
- `AppScreens.tsx` is a giant "Switch Statement" that swaps out the entire screen instantly.
- **Benefit**: This works perfectly on Android because there are no complex URL bars to hide.
