# 🎮 Integration Guide for Tooth Kingdom Adventure

## ✅ Files to Copy to Your Project

Copy the entire `src/components/games/` folder to your project:

```
src/components/games/
├── types.ts                # Game types
├── Hero.tsx                # Hero component (optional, for customization)
├── StarRating.tsx          # Star display component
├── EnamelCastleSiege.tsx   # Chapter 1 game
├── SugarBugInvasion.tsx    # Chapter 2 game
├── RoyalRopeRescue.tsx     # Chapter 3 game
├── KingsBanquet.tsx        # Chapter 4 game
├── WiseKnightsTrial.tsx    # Chapter 5 game
├── GameEngine.tsx          # Main game router (THIS IS WHAT YOU IMPORT!)
└── index.ts                # Exports
```

---

## 📦 Dependencies

Make sure these are in your `package.json`:

```bash
npm install framer-motion lucide-react
```

---

## 🔗 Your ChaptersScreen Already Works!

Your existing `ChaptersScreen.tsx` code is already set up correctly:

```tsx
import { GameEngine } from '../games/GameEngine';

// When a chapter is active:
if (activeChapterId) {
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      <GameEngine
        chapterId={activeChapterId}
        onExit={handleGameExit}
        onComplete={handleGameComplete}
      />
    </div>
  );
}
```

This is exactly what we built! Just copy the games folder and it will work.

---

## 📱 Mobile Layout (375x812)

The games use `absolute inset-0` to fill the entire container. They will perfectly fill your PhoneFrame's 375x812px screen.

**Key CSS used in each game:**
```css
.absolute.inset-0.w-full.h-full
```

This ensures games fill the parent container completely.

---

## 🎯 Chapter to Game Mapping

| Chapter ID | Game Name | Theme |
|------------|-----------|-------|
| 1 | Enamel Castle Siege | Brushing - Defend castle |
| 2 | Sugar Bug Invasion | Bacteria - Tap bugs |
| 3 | Royal Rope Rescue | Flossing - Navigate gaps |
| 4 | The King's Banquet | Nutrition - Sort foods |
| 5 | Wise Knight's Trial | Mastery - Trivia quiz |

---

## 📊 onComplete Callback

When a player finishes a game:

```tsx
onComplete(score: number, stars: number)
```

- `score`: Player's final score (number)
- `stars`: 1, 2, or 3 based on performance

### Star Thresholds:
- ⭐ 1 star: Basic completion
- ⭐⭐ 2 stars: ~50% of max score
- ⭐⭐⭐ 3 stars: ~80% of max score

---

## 🔧 Your Updated ChaptersScreen.tsx

This is exactly how to use it in your existing code:

```tsx
import React, { useState } from 'react';
import { ScreenProps } from './types';
import { ChevronLeft, Lock, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { chapters } from '../../data/chapters';
import { GameEngine } from '../games/GameEngine';  // ← Import this
import { useGame } from '../../context/GameContext';

export function ChaptersScreen({ navigateTo, userData }: ScreenProps) {
  const { updateUserData } = useGame();
  const [activeChapterId, setActiveChapterId] = useState<number | null>(null);

  const handleStartChapter = (chapterId: number) => {
    setActiveChapterId(chapterId);
  };

  const handleGameExit = () => {
    setActiveChapterId(null);
  };

  const handleGameComplete = (score: number, stars: number) => {
    // Update user progress
    const chapterIndex = chapters.findIndex(c => c.id === activeChapterId);
    
    updateUserData({
      totalStars: userData.totalStars + stars,
      completedChapters: Math.max(userData.completedChapters, (activeChapterId || 0)),
    });

    setActiveChapterId(null);
    navigateTo('reward-unlocked');
  };

  // ✅ THIS IS THE KEY PART - Full screen game overlay
  if (activeChapterId) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-hidden">
        <GameEngine
          chapterId={activeChapterId}
          onExit={handleGameExit}
          onComplete={handleGameComplete}
        />
      </div>
    );
  }

  // ... rest of your ChaptersScreen JSX
}
```

---

## 🎨 Customization

### Change Colors
Each game has its own gradient. Edit the main `div` in each game file:

```tsx
// EnamelCastleSiege.tsx
<div className="... bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 ...">

// Change to:
<div className="... bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-900 ...">
```

### Add Custom Images
Create `public/images/` folder and use:

```tsx
<img src="/images/your-hero.png" alt="Hero" className="w-16 h-16" />
```

### Add Sound Effects
Add your sound library and trigger in event handlers:

```tsx
const handleAttack = () => {
  playSound('attack'); // Your sound function
  // ... rest of attack logic
};
```

---

## 🚀 Quick Start Checklist

1. [ ] Copy `src/components/games/` folder to your project
2. [ ] Run `npm install framer-motion lucide-react`
3. [ ] Import `GameEngine` in your ChaptersScreen
4. [ ] Use the fullscreen overlay pattern shown above
5. [ ] Test each chapter (1-5)

---

## ❓ Troubleshooting

### Game doesn't fill screen
Make sure the parent container has:
```tsx
<div className="fixed inset-0 z-50 bg-white overflow-hidden">
```

### Game cut off at bottom
Check that `overflow-hidden` is on the container.

### Touch controls not working
Ensure no parent element has `pointer-events-none`.

---

## 📱 Your PhoneFrame Component (For Reference)

Your PhoneFrame already works perfectly:
```tsx
<div className="relative bg-white rounded-[3rem] overflow-hidden w-[375px] h-[812px]">
  {children}  // ← Games fill this completely
</div>
```

The games use `absolute inset-0` so they'll fill this 375x812 container exactly.

---

**Done! Your games are ready to integrate.** 🎮🦷✨
