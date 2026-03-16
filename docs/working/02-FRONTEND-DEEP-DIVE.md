# Chapter 2: Frontend Deep Dive

## 2.1 Entry Point: `index.html`

A minimal HTML file with a single `<div id="root">` element. Vite injects the JavaScript bundle via `<script type="module" src="/src/main.tsx">`. This is the only HTML file—the entire app is rendered by React into `#root`.

---

## 2.2 `src/main.tsx` — React Bootstrapper

**Purpose**: Mounts the React app and catches fatal crashes.

- Creates an **ErrorBoundary** class component using React's `componentDidCatch` lifecycle
- If any component throws a runtime error, instead of showing a blank white screen, it shows a red error panel with the full stack trace — this is a developer safety net
- Calls `createRoot(document.getElementById("root")!).render(...)` to boot React 18's concurrent mode

---

## 2.3 `src/App.tsx` — Root Application Component

This is the brain of the app. It does several things:

### Provider Stack (Outermost to Innermost)
```
<ThemeProvider>          ← Theme management (forced to 'light')
  <AuthProvider>         ← Authentication state (Firebase + local)
    <GameProvider>       ← Game/RPG data state
      <PhoneFrame>       ← Visual phone mockup wrapper
        <AppContent />   ← Actual app screens
      </PhoneFrame>
    </GameProvider>
  </AuthProvider>
</ThemeProvider>
```

### Key Features in `AppContent`:
1. **Screen State**: `useState<string>('splash')` — starts on splash, navigates via `setCurrentScreen`
2. **Auth Routing**: On load, checks `currentUser` from `AuthContext`. Authenticated users go to `dashboard`; unauthenticated go to `signin` after a 2-second splash delay. Role-based: parents → `parent-dashboard`, teachers → `teacher-dashboard`
3. **Backend Sync**: On login, fetches user data from `GET /users/{uid}`. On data change, pushes updates via `POST /users/{uid}` with a 2-second debounce
4. **Global Reward Animations**: Watches `userData.xp`, `userData.gold`, `userData.enamelHealth`, and `userData.unlockedRewards` for changes. Shows a bouncing popup ("+50 XP", "+20 GOLD", etc.) with sound effects
5. **Chibi Guide**: Shows the `<ChibiGuide>` overlay on the dashboard (first visit)
6. **Capacitor Detection**: `window.Capacitor?.isNative` check — if running as an Android app, removes the phone frame border for full-screen rendering

---

## 2.4 `src/components/PhoneFrame.tsx` — Phone Mockup Wrapper

**Purpose**: Wraps the app content inside a realistic iPhone-style phone frame for browser development.

- On **browser**: Renders a black rounded rectangle (3.5rem radius) with a notch, side buttons, and a fixed `375×812px` screen area. This simulates a mobile viewport
- On **Capacitor (Android)**: Renders a plain full-screen `<div>` with no frame — the real phone IS the frame
- Supports dark mode CSS overrides (deprecated but code remains)

---

## 2.5 `src/components/AppScreens.tsx` — Screen Router

A clean `switch` statement mapping 22 screen names to React components:

| Screen Name | Component | Description |
|---|---|---|
| `splash` | `SplashScreen` | Loading animation |
| `signin` | `SignInScreen` | Login/register form |
| `otp-verification` | `OTPVerificationScreen` | Phone OTP input |
| `onboarding` | `OnboardingScreen` | First-time user tutorial |
| `character-select` | `CharacterSelectScreen` | Choose your Chibi hero |
| `dashboard` | `DashboardScreen` | Main hub with stats |
| `chapters` | `ChaptersScreen` | Chapter selection grid |
| `brushing-lesson` | `BrushingLessonScreen` | Interactive brushing tutorial |
| `lesson-complete` | `LessonCompleteScreen` | Post-lesson score screen |
| `reward-unlocked` | `RewardUnlockedScreen` | Reward animation |
| `rewards` | `RewardsScreen` | Reward collection gallery |
| `progress` | `ProgressScreen` | Progress tracking charts |
| `calendar` | `CalendarScreen` | Brushing habit calendar |
| `settings` | `SettingsScreen` | App preferences |
| `profile` | `ProfileScreen` | User profile editor |
| `achievements` | `AchievementsScreen` | Achievement medallions |
| `stats` | `StatsScreen` | Detailed statistics |
| `notifications` | `NotificationsScreen` | Notification inbox |
| `streak` | `StreakScreen` | Brushing streak tracker |
| `learning-resources` | `LearningResourcesScreen` | External resources |
| `learning-academy` | `LearningAcademyScreen` | Courses & PDFs |
| `parent-dashboard` | `ParentDashboardScreen` | Parent controls |
| `teacher-dashboard` | `TeacherDashboardScreen` | Teacher view |
| `kingdom-bazaar` | `KingdomBazaarScreen` | In-app shop |
| `rpg-hub` | `RPGKingdomHubScreen` | RPG overview |

---

## 2.6 `src/context/AuthContext.tsx` — Authentication System

**Purpose**: Manages user identity across the entire app via React Context.

### Authentication Methods:
1. **Email + Password (Local Backend)** — `POST /auth/login` and `POST /auth/register` to the Python FastAPI server. Passwords are hashed with bcrypt on the server
2. **Google Sign-In** — Uses Firebase `signInWithPopup` (browser) or `signInWithRedirect` (Capacitor/Android). After Firebase auth, syncs with the local backend via `POST /auth/google`
3. **Phone + OTP** — Generates a mock OTP (6-digit random number), stores it in `localStorage`, and verifies it locally. In production, this would use an SMS provider
4. **Offline Fallback** — If the backend is unreachable, creates an offline user with `uid: 'offline_' + Date.now()` so the app still works without internet

### Data Flow:
- On successful auth, stores the user object and token in `localStorage`
- Uses Firebase's `onAuthStateChanged` listener to detect auth state across tabs
- The `User` interface includes: `uid`, `email`, `displayName`, `phoneNumber`, `role` (child/parent/teacher)

---

## 2.7 `src/context/GameContext.tsx` — Game State Manager

**Purpose**: Central store for ALL user game data (RPG stats, progress, settings).

### Default User Data:
```typescript
{
  selectedCharacter: null,
  name: 'Champion',
  currentStreak: 7, bestStreak: 7, totalDays: 45,
  completedChapters: 2, totalStars: 127, level: 5,
  achievements: [...], unlockedRewards: [1,2,3,4,5],
  brushingLogs: { [today]: { morning: true, evening: false } },
  enamelHealth: 100, xp: 0, gold: 0,
  questProgress: { completedQuests: [], activeQuests: [] },
  inventory: [], settings: { darkMode: false, notifications: true, sound: true }
}
```

### Persistence Strategy (Triple-Redundant):
1. **localStorage** — Immediate, always available, survives page reloads
2. **Backend Sync** — Debounced (1-second delay) POST to `/users/{uid}` whenever data changes
3. **Backend Fetch** — On login, fetches from `GET /users/{uid}` to restore server-side data

### Achievement Auto-Checker:
Every time `updateUserData()` is called, the context runs `checkAchievements()` which automatically grants achievements based on thresholds:
- XP > 0 → "First Steps"
- Streak ≥ 3 → "Brush Master"
- Streak ≥ 7 → "Perfect Week"
- Stars ≥ 50 → "Star Hunter"
- Stars ≥ 250 → "Star Legend"
- Chapters ≥ 1 → "Chapter Champion"
- Chapters ≥ 3 → "Kingdom Defender"
- Level ≥ 5 → "Master Brusher"

---

## 2.8 `src/components/ui/` — 48 Reusable UI Primitives

These are **shadcn/ui** components built on top of **Radix UI** headless primitives. Each file exports a styled, accessible component:

`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `input`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toggle-group`, `toggle`, `tooltip`

Plus utilities: `use-mobile.ts` (mobile detection hook), `utils.ts` (className merger).

---

## 2.9 `src/index.css` — Global Stylesheet (85KB)

A massive Tailwind-based CSS file containing:
- Tailwind base, components, and utilities layers
- CSS custom properties for theming (HSL color values)
- Custom animations: `bounce-up`, `slide-in`, `fade-in`, `pulse-glow`, `color-cycle`, `chroma-shift`
- Game-specific styles for each chapter
- Responsive breakpoints and dark mode overrides
- Premium glass-morphism effects and gradient backgrounds

---

## 2.10 `src/lib/firebase.ts` — Firebase & Backend URL Configuration

**Purpose**: Initializes Firebase services and dynamically determines the backend API URL.

### Firebase Services Initialized:
- `auth` — Firebase Authentication (Google Sign-In)
- `db` — Firestore (available but not actively used for data storage)
- `storage` — Firebase Storage (available but not actively used)
- `analytics` — Google Analytics tracking

### Dynamic Backend URL Discovery:
```
1. Check VITE_LOCAL_BACKEND_URL env var → use if set
2. In production (PROD build) → use window.location.origin + '/api.php'
3. In dev on localhost → use 'http://127.0.0.1:8010'
4. In dev on LAN IP → use 'http://{hostname}:8010'
```

This allows the app to work across development, LAN testing, and production environments without code changes.

---

## 2.11 `src/hooks/useSound.ts` — Sound Effect System

**Purpose**: Provides a `playSound(type)` function that plays audio effects.

### Sound Types:
| Type | Source (Mixkit CDN) | Used For |
|---|---|---|
| `click` | mixkit.co/sfx/2568 | Navigation, button taps |
| `success` | mixkit.co/sfx/2020 | XP gain, gold earned |
| `achievement` | mixkit.co/sfx/2019 | Achievement unlocked |
| `levelUp` | mixkit.co/sfx/2018 | Level up event |

### How It Works:
1. On mount, preloads all 4 audio files via `new Audio(url)` with `preload: 'auto'`
2. Stores references in a `useRef` object (persists across renders)
3. `playSound()` checks `userData.settings.sound` — respects the mute toggle
4. Resets `audio.currentTime = 0` before playing to allow rapid successive plays
5. Uses `.play().catch()` to handle browser autoplay restrictions gracefully

---

## 2.12 `src/services/rpgService.ts` — RPG Mechanics Engine

**Purpose**: Calculates XP, Gold, Health, and quest rewards without touching the UI.

### Configuration:
| Constant | Value | Description |
|---|---|---|
| `XP_PER_LESSON` | 50 | XP awarded per lesson completion |
| `GOLD_PER_LESSON` | 20 | Gold awarded per lesson |
| `XP_PER_BRUSH` | 30 | XP awarded per brushing session |
| `GOLD_PER_BRUSH` | 10 | Gold per brush |
| `HEALTH_LOSS_ON_SKIP` | 10 | Enamel health penalty for missed tasks |
| `MAX_HEALTH` | 100 | Maximum enamel health |

### Level-Up System:
- XP required per level = `level × 100` (so Level 5 needs 500 XP)
- On level-up: XP resets (minus threshold), +50 bonus Gold
- Creates a notification entry for the reward

### Quest Tracking:
- Quests have `id` and `progress` (0–100)
- When progress ≥ 100, quest completes: +100 Gold bonus, moved to `completedQuests`
