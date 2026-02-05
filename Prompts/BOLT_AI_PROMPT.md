# 🦷 Tooth Kingdom Adventure - Complete Game Restructuring Prompt for Bolt AI

## 📋 Project Context

I have an existing **Tooth Kingdom Adventure** project that's a dental health fantasy game built with:
- **Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
- **UI Components**: Shadcn UI + Radix UI
- **Mobile**: Capacitor for Android/iOS deployment
- **Backend**: Firebase (Auth, Database, Cloud Functions)

The project currently has:
- ✅ 5 fully functional fantasy games (Enamel Castle Siege, Sugar Bug Invasion, Royal Rope Rescue, King's Banquet, Wise Knight's Trial)
- ✅ Complete UI screens (Dashboard, Profile, Learning Academy, Progress, Achievements, Calendar, etc.)
- ✅ Authentication system with OTP verification
- ✅ Progress tracking and rewards system
- ✅ AI Tutor with chat functionality
- ✅ Offline PDF resources and video content

## 🎯 What I Need You To Do

**CRITICAL: Do NOT delete or overwrite any existing code.** Instead, enhance and integrate the existing components.

### 1. **Restructure Chapter System with Dynamic Kingdom-Themed Games**

**Current State:**
- Games exist in `src/components/games/` folder
- Chapter screen (`ChaptersScreen.tsx`) displays 5 chapters but games don't launch properly
- GameEngine exists but needs better integration

**Required Changes:**

#### A. Enhanced Chapter Data Structure
Create a comprehensive chapter configuration that includes:
```typescript
interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  theme: 'brushing' | 'bacteria' | 'flossing' | 'nutrition' | 'mastery';
  kingdomName: string; // e.g., "Enamel Castle", "Sugar Bug Swamp"
  gameComponent: string; // Component name
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string; // e.g., "3-5 minutes"
  learningObjectives: string[];
  rewards: {
    coins: number;
    stars: number;
    unlockables: string[];
  };
  backgroundImage?: string;
  characterSprite?: string;
  musicTheme?: string;
}
```

#### B. Full-Screen Game Experience
Each game should:
- Launch in **true fullscreen mode** (no navigation bars, no headers during gameplay)
- Fill the entire mobile screen (optimize for 375x812px iPhone and 360x800px Android)
- Include a **minimal exit button** (top-left corner, small, semi-transparent)
- Show game UI only (no app chrome)
- Support both portrait and landscape orientations where appropriate

#### C. Chapter-to-Game Mapping
Map each chapter to its corresponding game:
1. **Chapter 1: The Enamel Castle** → `EnamelCastleSiege.tsx`
2. **Chapter 2: Sugar Bug Swamplands** → `SugarBugInvasion.tsx`
3. **Chapter 3: The Royal Floss Bridge** → `RoyalRopeRescue.tsx`
4. **Chapter 4: The King's Grand Feast** → `KingsBanquet.tsx`
5. **Chapter 5: The Wise Knight's Chamber** → `WiseKnightsTrial.tsx`

### 2. **Create Dual Build System (Mobile + Web)**

#### A. Mobile Version (Primary)
- **Target**: Android APK via Capacitor
- **Screen Size**: Optimized for mobile phones (375-414px width)
- **Features**: All features including biometric auth, native notifications
- **Layout**: Phone frame wrapper for development, full native on device
- **Entry Point**: `src/main.tsx` → `App.tsx` → `AppScreens.tsx`

#### B. Web Version (Testing & Demo)
- **Target**: Browser-based testing (Netlify deployment)
- **Screen Size**: Responsive with mobile-first design
- **Features**: All features except native-only (biometric, push notifications)
- **Layout**: Desktop view shows phone frame simulator for accurate testing
- **Entry Point**: Separate `src/web-main.tsx` or use environment detection

**Implementation Strategy:**
```typescript
// Detect environment
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isCapacitor = Capacitor.isNativePlatform();

// Conditional rendering
{isCapacitor ? <NativeFeature /> : <WebFallback />}
```

### 3. **Game Integration Requirements**

#### A. Game Component Interface
All games must follow this interface:
```typescript
interface GameProps {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}
```

#### B. Game Flow
1. User selects chapter from `ChaptersScreen`
2. App navigates to full-screen game view
3. Game renders with proper mobile layout
4. On completion: Save score, award stars, unlock next chapter
5. Return to chapter screen with updated progress

#### C. Progress Persistence
- Save game progress to Firebase Firestore
- Update local state via GameContext
- Sync across devices
- Show progress on Dashboard and Progress screens

### 4. **Preserve ALL Existing Features**

**MUST KEEP WORKING:**
- ✅ Sign In / OTP Verification flow
- ✅ Dashboard with stats and quick actions
- ✅ Learning Academy (AI Tutor, PDFs, Videos)
- ✅ Profile management with avatar selection
- ✅ Calendar with brushing reminders
- ✅ Achievements and rewards system
- ✅ Settings (notifications, theme, language)
- ✅ Progress tracking and statistics
- ✅ Streak tracking
- ✅ All existing UI components (buttons, cards, dialogs, etc.)

### 5. **Visual & UX Enhancements**

#### A. Kingdom Theme Consistency
- Each chapter should have distinct visual identity
- Use gradient backgrounds matching kingdom theme
- Animated transitions between screens
- Particle effects for game completion
- Sound effects (optional but recommended)

#### B. Mobile-First Design
- Touch-optimized controls (minimum 44x44px tap targets)
- Swipe gestures where appropriate
- Haptic feedback on game actions (mobile only)
- Loading states for all async operations
- Error boundaries for graceful failures

#### C. Performance Optimization
- Lazy load game components
- Optimize images and assets
- Minimize bundle size
- Fast initial load time (<3 seconds)

### 6. **File Structure Organization**

```
src/
├── components/
│   ├── games/
│   │   ├── EnamelCastleSiege.tsx
│   │   ├── SugarBugInvasion.tsx
│   │   ├── RoyalRopeRescue.tsx
│   │   ├── KingsBanquet.tsx
│   │   ├── WiseKnightsTrial.tsx
│   │   ├── GameEngine.tsx (enhanced)
│   │   ├── GameLayout.tsx (new - fullscreen wrapper)
│   │   └── types.ts
│   ├── screens/
│   │   ├── ChaptersScreen.tsx (enhanced)
│   │   ├── DashboardScreen.tsx (keep existing)
│   │   ├── LearningAcademyScreen.tsx (keep existing)
│   │   └── ... (all other existing screens)
│   └── ui/ (keep all existing Shadcn components)
├── context/
│   ├── GameContext.tsx (enhanced with chapter progress)
│   └── AuthContext.tsx (keep existing)
├── config/
│   └── chapters.ts (new - chapter configuration)
└── utils/
    └── gameHelpers.ts (new - game utilities)
```

### 7. **Testing Requirements**

Before considering this complete, ensure:
- [ ] All 5 games launch correctly from chapter screen
- [ ] Games display in fullscreen mobile layout
- [ ] Exit button returns to chapter screen
- [ ] Score and stars save correctly
- [ ] Next chapter unlocks after completion
- [ ] Progress shows on Dashboard
- [ ] Web version works in Chrome/Safari/Firefox
- [ ] Mobile version works on Android (test via `npm run dev`)
- [ ] No console errors
- [ ] All existing features still work

### 8. **Specific Code Changes Needed**

#### A. Update `ChaptersScreen.tsx`
- Add proper navigation to GameEngine
- Show chapter progress (locked/unlocked/completed)
- Display stars earned per chapter
- Add chapter preview modal with learning objectives

#### B. Enhance `GameEngine.tsx`
- Add fullscreen wrapper component
- Implement proper exit handling
- Add loading states
- Handle game completion with animations
- Save progress to Firebase and Context

#### C. Update `GameContext.tsx`
- Add chapter progress state
- Add methods: `unlockChapter()`, `saveGameProgress()`, `getChapterStatus()`
- Persist to Firebase Firestore

#### D. Create `GameLayout.tsx` (New Component)
```typescript
// Fullscreen wrapper for games
interface GameLayoutProps {
  children: React.ReactNode;
  onExit: () => void;
  chapterTitle: string;
}
```

### 9. **Build & Deployment**

#### Web Version:
```bash
npm run build
# Deploy to Netlify
```

#### Mobile Version:
```bash
npm run build
npx cap sync
npx cap open android
# Build APK in Android Studio
```

### 10. **Success Criteria**

✅ All games work perfectly in both web and mobile
✅ Fullscreen mobile experience with no layout issues
✅ Smooth transitions between screens
✅ Progress saves and persists
✅ All existing features remain functional
✅ No breaking changes to existing code
✅ Clean, maintainable code structure
✅ Proper TypeScript typing throughout
✅ Responsive design for all screen sizes
✅ Fast performance (<3s load, 60fps gameplay)

---

## 🚀 Implementation Approach

**Please follow this order:**

1. **First**, analyze the existing codebase structure
2. **Then**, create the chapter configuration system
3. **Next**, enhance GameEngine with fullscreen support
4. **After that**, update ChaptersScreen with proper navigation
5. **Then**, test each game individually
6. **Next**, implement progress saving to Firebase
7. **Finally**, verify all existing features still work

**REMEMBER**: 
- Do NOT delete existing code
- Do NOT break existing features
- Do NOT change the core tech stack
- DO preserve all UI components
- DO maintain TypeScript strict mode
- DO keep the existing file structure where possible

---

## 📝 Additional Notes

- The project uses **path aliases**: `@/components`, `@/utils`, etc.
- Firebase config is in environment variables
- Capacitor config is in `capacitor.config.ts`
- All games use Framer Motion for animations
- Tailwind config has custom colors and themes
- The app supports dark mode (via next-themes)

---

## ❓ Questions to Clarify Before Starting

1. Should games support both portrait and landscape modes?
2. Do you want sound effects and background music?
3. Should there be a tutorial/onboarding for each game?
4. Do you want multiplayer or just single-player?
5. Should there be a practice mode vs. challenge mode?

Please implement this carefully, test thoroughly, and let me know if you need any clarification on the existing codebase structure!
