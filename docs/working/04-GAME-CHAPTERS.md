# Chapter 4: Game Chapters — The Heart of the App

## 4.1 Overview

The app features **6 game chapters**, each teaching a different aspect of dental health. Games are divided into two categories:

1. **React-Native Games** (Chapters 3, 4, 5) — Built directly in React/TypeScript as components
2. **External/Iframe Games** (Chapters 1, 2, 5-alt, 6) — Full game engines (Unity, Godot, GameMaker) loaded in `<iframe>` elements

---

## 4.2 `src/components/games/GameEngine.tsx` — The Game Router

This component receives a `chapterId` and renders the correct game. It:
1. Looks up chapter data from `data/chapters.ts`
2. If the chapter has `gameType: 'external'` and a `gameUrl`, loads it via `<ExternalGameWrapper>`
3. Otherwise, renders the built-in React game component
4. All games are wrapped in a `<GameWrapper>` div with `absolute inset-0` positioning to fill the PhoneFrame

### Chapter → Game Mapping:
| Chapter | Title | Game Type | Component/Engine |
|---|---|---|---|
| 1 | Cavity Miner Adventure | External (iframe) | Unity WebGL (`/games/cavity-miner/`) |
| 2 | Shark Dentist Challenge | External (iframe) | Godot WASM (`/games/shark-dentist/`) |
| 3 | Flossing Adventures | React | `<RoyalRopeRescue>` |
| 4 | Healthy Eating Habits | React | `<KingsBanquet>` |
| 5 | Tooth Kingdom Master | External (iframe) | HTML5 (`/games/plaque-pluck/`) |
| 6 | Beatrix: Battle Dentist | External (iframe) | GameMaker HTML5 (`/games/beatrix-dentist/`) |

---

## 4.3 `src/components/games/ExternalGameWrapper.tsx` — Iframe Game Loader

**Purpose**: Loads external HTML5 games inside an `<iframe>` and provides touch controls.

### How It Works:
1. Creates a full-screen `<iframe>` pointing to the game's `index.html`
2. Uses `ResizeObserver` to dynamically match the iframe to the parent container size
3. Provides an overlay with mobile-friendly **D-Pad** and **Action Buttons**:
   - D-Pad: ←↑→↓ (Arrow keys)
   - Action buttons: A (Space/Z), B (X), ⏎ (Enter)
4. Touch controls dispatch `KeyboardEvent`s directly into the iframe's `contentWindow`

### Mobile Control System:
The `ControlButton` component:
- `onTouchStart` → dispatches `keydown` event to the iframe
- `onTouchEnd` → dispatches `keyup` event
- `onMouseDown/Up` → same for desktop testing
- Uses `keyCode` to simulate keyboard input that the game engines expect
- Prevents default touch behavior to avoid scrolling during gameplay

### Game Completion:
- Shows a "Complete Chapter" button overlay
- On click, calls `onComplete(score, stars)` passing back to the parent
- Score defaults to 100, stars to 3

---

## 4.4 External Game Engines in `public/games/`

### Chapter 1: `cavity-miner/` (Unity WebGL)
- **Engine**: Unity (compiled to WebGL)
- **Files**: `Build/` folder containing compressed game data, framework JS, loader, and WASM binary
- **`index.html`**: Unity WebGL template that initializes the game canvas
- **Gameplay**: Navigate through a tooth to find and remove cavities using D-pad controls

### Chapter 2: `shark-dentist/` (Godot Engine)
- **Engine**: Godot 4.x (exported to Web/WASM)
- **Files**:
  - `index.html` (5.9KB) — Godot HTML shell
  - `index.js` (285KB) — Godot runtime JavaScript
  - `index.pck` (10MB) — Packed game resources (sprites, scenes, scripts)
  - `index.wasm` (52MB) — Godot engine compiled to WebAssembly
- **Gameplay**: Help a shark keep its teeth clean; brush and extract rotten teeth

### Chapter 5 (alt): `plaque-pluck/` (HTML5)
- **Files**: `index.html` with embedded game
- **Gameplay**: Pluck plaque from teeth in a point-and-click style

### Chapter 6: `beatrix-dentist/` (GameMaker Studio)
- **Engine**: GameMaker Studio (HTML5 export)
- **Files**: `html5game/` folder with 19 files including sprites, sounds, and compiled JS
- **`index.html`**: Custom wrapper that loads `html5game/` content
- **`original_index.html`**: Original GameMaker-generated HTML (preserved for reference)
- **Gameplay**: Retro-style action game where "Beatrix" fights dental decay

---

## 4.5 React-Built Games (Chapters 3, 4, 5)

### Common Game UI (`src/components/games/common/GameUI.tsx`):
Shared components used by all React games:
- **`GameStartScreen`** — Pre-game screen with title, subtitle, instructions, hero image, and "Start Adventure" button with premium chroma-cycling glow effect
- **`GameVictoryScreen`** — Post-game screen showing score, star rating (1-3 stars), and "Continue" button with celebration animations
- **`PremiumChromaText`** — Text component with rainbow color-cycling CSS animation

### `EnamelCastleSiege.tsx` (Chapter 1 fallback)
- **Theme**: Castle defense against plaque invaders
- **Mechanics**: Tap/click to destroy enemies approaching the castle
- Built as a React component with `useState` for game state

### `SugarBugInvasion.tsx` (Chapter 2 fallback)
- **Theme**: Fight off sugar bug creatures
- **Mechanics**: Tap sugar bugs before they reach the tooth

### `RoyalRopeRescue.tsx` (Chapter 3)
- **Theme**: Flossing adventure — guide rope (floss) between teeth
- **Mechanics**: Drag/swipe controls to navigate the floss

### `KingsBanquet.tsx` (Chapter 4)
- **Theme**: Food sorting — healthy vs. unhealthy foods for teeth
- **Mechanics**: Sort food items by dragging them to the correct category
- **Assets**: AI-generated Disney-style food images in `src/assets/food/`

### `WiseKnightsTrial.tsx` (Chapter 5)
- **Theme**: Dental health quiz
- **Mechanics**: Multiple-choice questions about dental hygiene
- **Assets**: AI-generated Disney-style quiz images in `src/assets/quiz/`

### `DeepCleanChallenge.tsx` (Chapter 6 fallback)
- **Theme**: Deep cleaning simulation
- **Mechanics**: Brush specific areas of a tooth to clean them

### Star Rating System (`StarRating.tsx`):
- Score-based rating: ≥80% = 3 stars, ≥50% = 2 stars, <50% = 1 star
- Visual star display with fill animations

---

## 4.6 Game Data Types (`src/components/games/types.ts`)

```typescript
interface GameProps {
  onComplete: (score: number, stars: number) => void;
  onExit?: () => void;
}

type GameScreen = 'start' | 'playing' | 'victory';

interface Position { x: number; y: number; }
interface Enemy { id, x, y, type: 'plaque'|'candy'|'bacteria', health, maxHealth }
interface Obstacle { id, x, y, width, height, type: 'sticky-candy'|'plaque-wall' }
```

---

## 4.7 Chapter Definitions (`src/data/chapters.ts`)

Each chapter is defined with:
- `id` — Chapter number (1-6)
- `title` — Display name
- `description` — What the chapter teaches
- `lessons` — Number of lessons
- `stars` — Stars available
- `completed` / `locked` — Progression state
- `color` — Gradient class for the chapter card
- `illustration` — Imported PNG thumbnail
- `gameType` — `'external'` for iframe games, or a React game identifier
- `gameUrl` — Path to the iframe HTML file (for external games)
- `gameConfig` — Game-specific parameters (target score, time limit, etc.)
