# 🦷 Dental Kingdom Adventures - Integration Guide

## 📁 Files to Copy to Your Project

Copy these files from `src/components/games/` to your project:

```
src/components/games/
├── types.ts              # Shared TypeScript interfaces
├── Hero.tsx              # Animated tooth hero component
├── StarRating.tsx        # 3-star rating display
├── EnamelCastleSiege.tsx # Brushing game
├── SugarBugInvasion.tsx  # Bacteria tapping game
├── RoyalRopeRescue.tsx   # Flossing navigation game
├── KingsBanquet.tsx      # Nutrition sorting game
├── WiseKnightsTrial.tsx  # Trivia quiz game
└── GameEngine.tsx        # Main game manager (optional)
```

---

## 🔧 Required Dependencies

Make sure these packages are installed in your project:

```bash
npm install framer-motion lucide-react tailwind-merge clsx
```

---

## 🎮 Using Individual Games in Your Chapters

Each game accepts an `onComplete(score, stars)` callback. Here's how to use them:

### Basic Usage

```tsx
import { EnamelCastleSiege } from '@/components/games/EnamelCastleSiege';
import { SugarBugInvasion } from '@/components/games/SugarBugInvasion';
import { RoyalRopeRescue } from '@/components/games/RoyalRopeRescue';
import { KingsBanquet } from '@/components/games/KingsBanquet';
import { WiseKnightsTrial } from '@/components/games/WiseKnightsTrial';

// In your chapter component:
function ChapterScreen({ chapterId, onChapterComplete }) {
  const handleGameComplete = (score: number, stars: number) => {
    console.log(`Game completed! Score: ${score}, Stars: ${stars}`);
    
    // Save progress to your backend/state
    onChapterComplete({ chapterId, score, stars });
  };

  // Render the appropriate game based on chapter
  switch (chapterId) {
    case 'brushing':
      return <EnamelCastleSiege onComplete={handleGameComplete} />;
    case 'bacteria':
      return <SugarBugInvasion onComplete={handleGameComplete} />;
    case 'flossing':
      return <RoyalRopeRescue onComplete={handleGameComplete} />;
    case 'nutrition':
      return <KingsBanquet onComplete={handleGameComplete} />;
    case 'mastery':
      return <WiseKnightsTrial onComplete={handleGameComplete} />;
    default:
      return null;
  }
}
```

---

## 🗺️ Example: Integration with Your Chapter System

```tsx
// YourChapterPage.tsx
import { useState } from 'react';
import { EnamelCastleSiege } from '@/components/games/EnamelCastleSiege';

interface ChapterProps {
  chapterId: string;
  onComplete: (score: number, stars: number) => void;
  onBack: () => void;
}

export function ChapterGamePage({ chapterId, onComplete, onBack }: ChapterProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const handleGameComplete = (score: number, stars: number) => {
    // This is called when the player finishes the game
    setIsPlaying(false);
    
    // Save to your app's state/API
    saveProgress(chapterId, score, stars);
    
    // Call parent callback
    onComplete(score, stars);
  };

  if (!isPlaying) {
    return (
      <div>
        <h2>Chapter Complete!</h2>
        <button onClick={onBack}>Back to Map</button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <button onClick={onBack}>← Back</button>
      <EnamelCastleSiege onComplete={handleGameComplete} />
    </div>
  );
}
```

---

## 📊 Game Props Interface

All games use this interface:

```typescript
interface GameProps {
  onComplete: (score: number, stars: number) => void;
}
```

- `score`: The player's final score (number)
- `stars`: 0-3 stars based on performance

### Star Thresholds by Game:

| Game | ⭐ 1 Star | ⭐⭐ 2 Stars | ⭐⭐⭐ 3 Stars |
|------|---------|------------|-------------|
| Enamel Castle Siege | 100+ | 300+ | 500+ |
| Sugar Bug Invasion | 200+ | 500+ | 800+ |
| Royal Rope Rescue | 100+ | 250+ | 400+ |
| King's Banquet | 200+ | 400+ | 600+ |
| Wise Knight's Trial | 200+ | 400+ | 700+ |

---

## 🎨 Customizing Styles

The games use Tailwind CSS. Key color classes you can customize:

```css
/* Main gradient backgrounds */
.from-pink-500 .via-purple-500 .to-indigo-500

/* Button styles */
.bg-gradient-to-r .from-green-400 .to-cyan-400

/* Border colors */
.border-pink-400 .border-yellow-400
```

---

## 📱 Mobile Support

All games include:
- Touch controls (tap, drag)
- On-screen buttons for navigation games
- Responsive layouts

---

## 🔊 Adding Sound Effects

Games have hook points for adding sounds. Look for:

```tsx
// In handleAttack, handleZap, handleAnswer, etc.
// Add your sound library calls:
playSound('attack');
playSound('correct');
playSound('wrong');
```

---

## 🖼️ Adding Custom Images

### Option 1: Replace emoji with images

```tsx
// Before
<span className="text-4xl">🦷</span>

// After
<img src="/images/tooth-hero.png" alt="Hero" className="w-12 h-12" />
```

### Option 2: Add background images

```tsx
// In game component
<div 
  className="absolute inset-0 bg-cover bg-center"
  style={{ backgroundImage: 'url(/images/castle-bg.png)' }}
/>
```

### Option 3: Modify Hero component

Edit `Hero.tsx` to use your custom character sprites:

```tsx
// Replace the SVG/emoji tooth with your image
<motion.img
  src="/images/my-hero.png"
  alt="Hero"
  className="w-16 h-20"
  animate={{ ... }}
/>
```

---

## 🔗 Full Integration Example

```tsx
// App.tsx or your main game router
import { useState } from 'react';
import { ChapterMap } from './ChapterMap'; // Your chapter selection
import { EnamelCastleSiege } from '@/components/games/EnamelCastleSiege';
import { SugarBugInvasion } from '@/components/games/SugarBugInvasion';
// ... import other games

type GameId = 'brushing' | 'bacteria' | 'flossing' | 'nutrition' | 'mastery' | null;

export function GameApp() {
  const [currentGame, setCurrentGame] = useState<GameId>(null);
  const [progress, setProgress] = useState<Record<string, { score: number; stars: number }>>({});

  const handleGameComplete = (gameId: string, score: number, stars: number) => {
    // Update progress
    setProgress(prev => ({
      ...prev,
      [gameId]: { score, stars }
    }));
    
    // Return to chapter map
    setCurrentGame(null);
    
    // Optional: Save to backend
    // saveToAPI(gameId, score, stars);
  };

  const GAMES = {
    brushing: EnamelCastleSiege,
    bacteria: SugarBugInvasion,
    flossing: RoyalRopeRescue,
    nutrition: KingsBanquet,
    mastery: WiseKnightsTrial,
  };

  if (currentGame && GAMES[currentGame]) {
    const GameComponent = GAMES[currentGame];
    return (
      <div>
        <button onClick={() => setCurrentGame(null)}>← Back</button>
        <GameComponent 
          onComplete={(score, stars) => handleGameComplete(currentGame, score, stars)} 
        />
      </div>
    );
  }

  return (
    <ChapterMap 
      progress={progress}
      onSelectChapter={(chapterId) => setCurrentGame(chapterId as GameId)}
    />
  );
}
```

---

## ❓ Need Help?

The `GameEngine.tsx` file shows a complete working example of:
- Chapter selection UI
- Progress tracking
- Unlocking system
- Star collection

You can use it as-is or as a reference for your own implementation!
