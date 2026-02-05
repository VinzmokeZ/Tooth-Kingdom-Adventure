# 👑 Tooth Kingdom Adventure: Master Replica Prompt

**GOAL**: Build a complete, production-ready Full Stack Mobile Game App called "Tooth Kingdom Adventure".
**CONTEXT**: This is a direct replica of an existing high-fidelity prototype, but with freedom to innovate on the specific mini-games.

## 🛠 Tech Stack (Strict)
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (v4), Framer Motion, Lucide React icons
- **UI Components**: Shadcn UI / Radix UI (accessible, high-quality)
- **Backend Service**: Firebase (Authentication + Firestore Database)
- **Mobile Runtime**: Capacitor (Android/iOS)
- **State Management**: React Context (`GameContext`, `AuthContext`)

## 🎨 Design System & UI/UX
The app must have a **premium, magical, kid-friendly fantasy aesthetic**.
- **Color Palette**: Use these specific OKLCH gradients:
  - *Primary*: Purple/Indigo gradients (`from-purple-600 to-indigo-600`)
  - *Accent*: Pink/Rose (`from-pink-500 to-rose-500`) for buttons/highlights
  - *Success*: Emerald/Green (`from-emerald-400 to-green-600`)
  - *Warning*: Amber/Orange (`from-amber-400 to-orange-600`)
  - *Backgrounds*: Deep, rich gradients (e.g., `bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100`)
- **Typography**: Rounded, friendly sans-serif fonts (System UI is fine, but styled playfully).
- **Layout**: 
  - **Mobile-First**: All screens optimized for 375px+ width.
  - **Phone Frame**: Wrap the app in a realistic phone frame component when view on Desktop (for dev/presentation).

## 📱 Core Features & User Flows

### 1. Authentication & Onboarding
- **Screen**: `SignInScreen.tsx`
  - Clean UI with "Enter Phone/Email".
  - **OTP Verification** (`OTPVerificationScreen.tsx`): 4-digit input, countdown timer.
- **Onboarding**:
  - `SplashScreen.tsx`: Animated logo entry.
  - `CharacterSelectScreen.tsx`: Choose a detailed avatar (Knight, Wizard, Archer, Healer) - *Use emojis or placeholders if assets missing*.

### 2. The Dashboard (Hub)
- **Screen**: `DashboardScreen.tsx`
- **Header**: User stats (Level, Total Stars ⭐️, Day Streak 🔥).
- **Main Hero**: "Daily Quest" card with progress bar.
- **Quick Actions**: 3 massive, colorful cards:
  1. **"Adventure Map"** (Go to Chapters)
  2. **"Learning Academy"** (AI Tutor)
  3. **"Brush Timer"** (Utility tool)

### 3. The Adventure Map (Dynamic Chapter System)
- **Screen**: `ChaptersScreen.tsx` - A vertical scrolling map of Kingdoms.
- **Requirement**: Display 5 distinctive "Chapters" or "Kingdoms".
- **Status States**:
  - 🔒 **Locked**: Greyed out, padlock icon.
  - 🔓 **Unlocked**: Vibrating/Glowing, "Play" button.
  - ✅ **Completed**: Gold border, stars earned displayed.
- **Kingdom Themes** (You have creative freedom here, but stick to these core concepts):
  1. **The Enamel Castle** (Theme: Brushing Basics)
  2. **Sugar Bug Swamp** (Theme: Bacteria/Plaque)
  3. **The Royal Floss Bridge** (Theme: Flossing)
  4. **The King's Banquet Hall** (Theme: Nutrition/Sugar)
  5. **The Wise Knight's Tower** (Theme: Mastery/Knowledge)

### 4. 🎮 THE GAMES (Creative Freedom Section)
**CRITICAL**: You must implement 5 **brand new, high-quality mini-games**, one for each chapter.
- **Constraint**: Games must be **fullscreen**, run at **60fps** using `requestAnimationFrame` or simple Framer Motion loops.
- **Input**: Touch/Tap optimized.
- **Mechanics**:
  - **Game 1 (Brushing)**: Action/Clicker - "Scrub away monsters".
  - **Game 2 (Bacteria)**: Whack-a-Mole style - "Tap sugar bugs".
  - **Game 3 (Floss)**: Precision/Maze - "Guide the hero through gaps".
  - **Game 4 (Nutrition)**: Sorting - "Swipe Left (Bad Food) / Right (Good Food)".
  - **Game 5 (Mastery)**: RPG Trivia Battle - "Answer correctly to attack".
- **Integration**:
  - All games MUST return `onComplete(score, stars)` callback.
  - **Win Condition**: Unlock next chapter defined in `GameContext`.

### 5. Learning Academy & AI Tutor
- **Screen**: `LearningAcademyScreen.tsx`
- **Features**:
  - **Tabbed Navigation**: "Courses", "PDFs", "My Learning", "AI Tutor".
  - **Search & Filter**: Filter content by "Kids", "Parents", "Teachers".
  - **Course List**: Display rich cards with thumbnails, progress bars, and "AI Recommended" tags.
  - **Offline Mode**: "Download" button for PDFs and videos (mock functionality ok).
  - **AI Chat Interface**: "Ask the Tooth Fairy" - Simple chat UI with typing indicators and pre-set prompts.
- **Content Data**:
  - Pre-populate with dummy courses: "Complete Dental Hygiene", "Nutrition for Teeth", etc.
  - Mock PDF resources: "Brushing Basics Guide", "Coloring Book", etc.

### 6. Utilities & Profile
- **ProfileScreen**: Edit avatar, view total XP.
- **StatsScreen**: Bar charts of brushing consistency (use pure CSS or Recharts).
- **CalendarScreen**: Month view showing "Brushed" status ticks.
- **Achievements**: Grid of badges (Locked/Unlocked style).

## 💾 Data Architecture (Firebase + Context)

**Interface `UserData`**:
```typescript
interface UserData {
  uid: string;
  displayName: string;
  selectedCharacter: number; // Index 0-3
  currentStreak: number;
  totalStars: number;
  completedChapters: number[]; // Array of Chapter IDs
  brushedDays: Record<string, boolean>; // "YYYY-MM-DD": true
  achievements: string[]; // ID strings
}
```

**Context Logic**:
- `GameProvider`:
  - Syncs `UserData` with Firestore `users/{uid}`.
  - Provides `unlockChapter(id)`, `addStars(n)`, `updateStreak()`.
  - Fallback to `localStorage` if offline/no-auth.

## 🚀 Execution Instructions for AI
1.  **Initialize Project**: Setup Vite + React + TS + Tailwind.
2.  **Scaffold Structure**: 
    - `src/components/screens/` (All screens detailed above)
    - `src/components/games/` (The 5 new games)
    - `src/context/`
3.  **Build Core UI**: Implement the Shadcn/Tailwind design system first.
4.  **Implement Logic**: Connect Screens -> Context -> Firebase.
5.  **Build Games**: Create the fun, interactive parts last.

**IMPORTANT**:
- Do **NOT** use placeholders for the main UI. It must be polished and beautiful.
- **DO** use creative freedom for the Game implementations (visuals, specific mechanics) as long as they fit the theme.
- Ensure the app is **Mobile-Responsive** (looks native on phone).

Start by setting up the project structure...
