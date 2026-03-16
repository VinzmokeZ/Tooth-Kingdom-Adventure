# Chapter 5: Assets, Resources & Sound

## 5.1 Overview

The app uses hundreds of visual and audio assets. These are split between two locations:
- **`src/assets/`** — Assets imported directly into React components (bundled by Vite)
- **`public/`** — Static assets served as-is by the web server (not processed by Vite)

---

## 5.2 How Assets Are Loaded

### Bundled Assets (`src/assets/`)
When you `import image from '../assets/chapter5.png'`, Vite:
1. Hashes the filename (e.g., `chapter5-abc123.png`)
2. Copies it to the build output
3. Returns the final URL as a string variable
4. This enables cache-busting (changed files get new hashes)

**Advantage**: Guaranteed loading, tree-shaking (unused imports are excluded), and cache efficiency.

### Static Assets (`public/`)
Files in `public/` are served at their exact path. `public/characters/CHIBI 1.svg` becomes available at `/characters/CHIBI 1.svg` in the browser.

**Advantage**: Large files (game engines, models) don't slow down the build process.

---

## 5.3 Image Assets Breakdown

### Chibi Character Art (SVG)
- **Location**: `src/assets/CHIBI 1-5.svg` AND `public/characters/CHIBI 1-5.svg`
- **Format**: SVG (Scalable Vector Graphics) — renders crisp at any size
- **Origin**: Custom-designed character illustrations
- **Characters**: Luna, Max, Mia, Zara, Kai — each ~430-750KB
- **Used in**: Character selection, Chibi Guide, dashboard avatar

### Hero Portrait PNGs
- **Files**: `hero-kai.png`, `hero-luna.png`, `hero-max.png`, `hero-mia.png`, `hero-zara.png`
- **Size**: ~30-43KB each (small, optimized)
- **Used in**: Dashboard hero display, profile cards

### Chapter Illustration Thumbnails
- **Files**: `brushing_basics.png`, `sugar_monsters.png`, `coloring_book.png`, `nutrition_guide.png`, `chapter5.png`, `chapter6.png`
- **Size**: ~1.5-2.6MB each (high-quality)
- **Origin**: AI-generated (image generation tools) in Disney/cartoon style
- **Used in**: Chapter selection cards, learning resources

### UI Icons (AI-Generated)
- **Files**: `ui_ai_bot.png`, `ui_alert_bell.png`, `ui_award_ribbon.png`, `ui_calendar.png`, `ui_clock.png`, `ui_dark_mode.png`, `ui_health_shield.png`, `ui_home.png`, `ui_nav_chapters.png`, `ui_nav_profile.png`, `ui_nav_progress.png`, `ui_streak_flame.png`, `ui_target.png`, `ui_trend_up.png`, `ui_volume.png`, `ui_xp_star.png`, `ui_xp_zap.png`
- **Size**: ~500KB-1.5MB each
- **Origin**: AI-generated premium cartoon-style icons
- **Used in**: Dashboard stat cards, navigation bar, settings

### Reward Items
- **Files**: `reward_dragon_shield.png`, `reward_fire_wings.png`, `reward_golden_crown.png`, `reward_hero_cape.png`, `reward_magical_brush.png`, `reward_mystic_orb.png`, `reward_royal_scepter.png`, `reward_star_wand.png`, `reward_trophy_cup.png`, `reward_unicorn_horn.png`
- **Size**: ~800KB-1.3MB each
- **Origin**: AI-generated fantasy item art
- **Used in**: Rewards screen, reward unlock animations

### Achievement Medallions
- **Files**: `medallion_*.png` (16 variants including `_v2` versions)
- **Size**: ~49-110KB each (optimized)
- **Origin**: AI-generated 3D-style medallion renders
- **Used in**: Achievements screen, notification popups

### Kingdom Bazaar Items
- **Files**: `item_berry_buff.png`, `item_crystal_shield.png`, `item_golden_toothbrush.png`, `item_minty_elixir.png`, `item_sparkle_cape.png`
- **Size**: ~480-995KB each
- **Used in**: Kingdom Bazaar shop screen

### Onboarding Images
- **Files**: `onboarding_brush.png`, `onboarding_shield.png`, `onboarding_treasure.png`
- **Size**: ~466-590KB each
- **Used in**: First-time user onboarding slides

### Brushing Step Images
- **Files**: `brush_step_1.png` through `brush_step_4.png`
- **Size**: ~1.2-1.5MB each
- **Used in**: Brushing lesson interactive tutorial

### Background & Banner Images
- **Files**: `dashboard_hero_castle.png`, `vibrant_kingdom_lore_bg.png`, `tooth_kingdom_bg.png`, `streak_galaxy_bg.png`, `rpg_hub_hero.png`, `banner_academy.png`, `banner_achievements.png`, `banner_chapters.png`, `banner_profile.png`
- **Used in**: Screen backgrounds, section headers

### Food Images (Chapter 4 - King's Banquet)
- **Location**: `src/assets/food/`
- **Origin**: AI-generated Disney-style cartoon food items
- **Used in**: The food sorting game

### Quiz Images (Chapter 5 - Wise Knight's Trial)
- **Location**: `src/assets/quiz/`
- **Origin**: AI-generated Disney-style cartoon images for each quiz question
- **Used in**: Quiz question backgrounds

---

## 5.4 Sound Assets

### Sound Effect System (`src/hooks/useSound.ts`)
The app uses **4 sound effects** sourced from **Mixkit** (a free sound effects CDN):

| Sound | URL | Trigger |
|---|---|---|
| `click` | `mixkit.co/sfx/2568` | Button taps, navigation |
| `success` | `mixkit.co/sfx/2020` | XP gain, gold earned |
| `achievement` | `mixkit.co/sfx/2019` | Achievement unlocked |
| `levelUp` | `mixkit.co/sfx/2018` | Level up event |

**How sounds are loaded**: On component mount, all 4 MP3 files are pre-loaded via `new Audio(url)` with `preload: 'auto'`. This ensures zero latency when playing.

**Mute control**: Respects `userData.settings.sound` — users can toggle sound on/off in Settings.

### Chibi Guide "Blip" Sound
The Chibi Guide dialogue uses a **procedurally generated** blip sound via the **Web Audio API**:
- Creates an `AudioContext` and `OscillatorNode`
- Type: square wave
- Frequency: 400Hz ± random variation
- Duration: 50ms
- Volume: very low (0.05 gain)
- Plays every 2nd character as text types out

### Game-Embedded Sounds
External games (Chapters 1, 2, 5-alt, 6) have their own sound assets bundled within their game engine files (inside `public/games/`). These are managed by the respective game engines (Unity, Godot, GameMaker) and are not controlled by the React app's sound setting.

### AI Voice (ElevenLabs TTS)
The backend can generate spoken audio via ElevenLabs API:
- Returns base64-encoded audio data in the AI response
- Frontend would decode and play via `new Audio('data:audio/mpeg;base64,...')`

---

## 5.5 Live2D Model Assets (`public/models/hiyori/`)

A **Live2D Cubism** model (anime-style 2D character with real-time animation):
- **Model**: "Hiyori" — a preset Live2D character
- **Files**: Model JSON, textures, motion files, physics settings
- **Renderer**: PixiJS v7 + `pixi-live2d-display` library
- **Used in**: VTuber Brushing Quest feature (`VTuberBrushingQuest.tsx`)

### PixiJS Compatibility Bridge (`src/pixi-utils-polyfill.js`)
The `pixi-live2d-display` library was built for PixiJS v6, but the project uses PixiJS v7. This polyfill:
1. Uses JavaScript `Proxy` objects to intercept all property accesses on the PIXI namespace
2. Provides v6-compatible shims (`ObservablePoint`, `BaseTexture`, `EventEmitter`, `url`, `utils`)
3. Routes all requests through to `window.PIXI` (CDN-loaded PixiJS)
4. Includes telemetry logging for debugging bridge issues

---

## 5.6 How Assets Were Obtained

| Asset Category | Source Method |
|---|---|
| Chibi Characters (SVG) | Custom designed / AI-assisted illustration |
| Chapter Thumbnails | AI image generation (Disney cartoon style) |
| UI Icons | AI image generation (premium cartoon style) |
| Reward Items | AI image generation (fantasy RPG style) |
| Achievement Medallions | AI image generation (3D metallic style) |
| Food Items (Ch4) | AI image generation (Disney cartoon style) |
| Quiz Images (Ch5) | AI image generation (Disney cartoon style) |
| Sound Effects | Mixkit.co free sound library (CDN-hosted) |
| Chibi Blip Sound | Procedurally generated via Web Audio API |
| Live2D Model | Open-source Live2D sample model ("Hiyori") |
| Game Engines | Pre-built games from game development tools |
| Lucide Icons | Open-source icon library (npm package) |
| Unsplash Photos | Free stock photos (used in learning resources) |
