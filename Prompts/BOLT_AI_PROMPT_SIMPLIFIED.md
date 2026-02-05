# 🎮 Simplified Bolt AI Prompt - Tooth Kingdom Adventure

## Quick Context
I have a React + TypeScript + Vite dental health game with 5 working fantasy games and complete UI screens (auth, dashboard, profile, learning academy, etc.). Everything is built with Tailwind CSS, Shadcn UI, and Framer Motion.

## What I Need

### 1. Fix Chapter-to-Game Integration
**Problem**: Games exist but don't launch properly from the chapter screen.

**Solution Needed**:
- Make each of the 5 games (`EnamelCastleSiege.tsx`, `SugarBugInvasion.tsx`, `RoyalRopeRescue.tsx`, `KingsBanquet.tsx`, `WiseKnightsTrial.tsx`) launch in **fullscreen mobile mode** when their chapter is selected
- Add a small exit button (top-left corner) to return to chapter screen
- Save score and stars to Firebase after game completion
- Unlock next chapter based on completion

### 2. Create Dynamic Kingdom-Themed Chapters
Each chapter should have:
- Unique kingdom name and theme
- Learning objectives display
- Progress tracking (locked/unlocked/completed)
- Star rating (0-3 stars based on score)
- Smooth animations and transitions

### 3. Dual Build Support
- **Mobile**: Optimize for phone screens (375-414px width), use Capacitor for Android
- **Web**: Browser testing version with phone frame simulator, deploy to Netlify
- Both versions should have ALL features working (except native-only features like biometric on web)

### 4. CRITICAL: Preserve Everything
**DO NOT BREAK OR DELETE**:
- Sign in / OTP verification
- Dashboard, Profile, Settings screens
- Learning Academy (AI Tutor, PDFs, Videos)
- Progress tracking, Achievements, Calendar
- All existing UI components
- Firebase integration
- Any existing functionality

## Key Requirements

✅ Fullscreen mobile game experience (no app chrome during gameplay)
✅ Touch-optimized controls
✅ Progress saves to Firebase + local state
✅ Chapter unlocking system (complete Chapter 1 to unlock Chapter 2, etc.)
✅ All 5 games work perfectly
✅ Web version for testing before Android deployment
✅ No console errors
✅ Fast performance (60fps gameplay)

## Implementation Order

1. Enhance `GameEngine.tsx` with fullscreen wrapper
2. Update `ChaptersScreen.tsx` with proper game navigation
3. Create chapter configuration with kingdom themes
4. Test each game individually
5. Implement progress saving
6. Verify all existing features still work

## Success = 
- Click chapter → Game launches fullscreen → Play game → Exit returns to chapters → Progress saved → Next chapter unlocked → All existing features still work perfectly

---

**Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, Framer Motion, Firebase, Capacitor

**DO NOT**: Delete code, break existing features, change tech stack
**DO**: Enhance integration, add fullscreen support, preserve all functionality
