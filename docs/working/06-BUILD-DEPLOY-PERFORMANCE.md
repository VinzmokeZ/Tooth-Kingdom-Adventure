# Chapter 6: Build, Deployment, Performance & Data

## 6.1 Vite Build System (`vite.config.ts`)

**Vite** is the build tool that compiles the React/TypeScript app into optimized production files.

### Development (`npm run dev`):
- Runs a dev server on `http://127.0.0.1:3000`
- Uses **Hot Module Replacement (HMR)** — changes appear instantly without page reload
- TypeScript is transformed on-the-fly (no compilation step)

### Production Build (`npm run build`):
- Outputs to `build/` directory
- Tree-shakes unused code, minifies JS/CSS, hashes filenames for cache-busting
- Target: `esnext` (modern browsers only)
- Result: a folder of static HTML/CSS/JS files ready for any web server

### Key Vite Config Features:
1. **PixiJS v7→v6 Compatibility Aliases**: All `@pixi/*` and `pixi.js` imports are redirected to `pixi-utils-polyfill.js`
2. **Package Version Aliases**: `lucide-react@0.487.0` → `lucide-react` (resolves Figma-generated import paths)
3. **Figma Asset Aliases**: `figma:asset/...` → actual file paths in `src/assets/`
4. **`@` path alias**: `@/components/...` → `./src/components/...` for cleaner imports
5. **Excluded from pre-bundling**: `@pixi/utils`, `pixi-live2d-display` (loaded at runtime from CDN)

### Why Vite Is Fast:
- Uses **esbuild** (written in Go) for TypeScript transpilation — 10-100x faster than Webpack
- Native ES modules in dev — no bundling needed during development
- Only bundles for production builds
- Lazy-loads changed modules via HMR instead of rebuilding everything

---

## 6.2 Firebase Hosting (`firebase.json`)

The production web version is deployed to **Firebase Hosting**:

```json
{
    "hosting": {
        "public": "build",           // Serves the built output
        "rewrites": [
            { "source": "**", "destination": "/index.html" }  // SPA fallback
        ],
        "ignore": ["*.bat", "*.exe", "*.sh", "*.bin"]  // Security: exclude scripts
    },
    "functions": [{
        "source": "functions",       // Firebase Cloud Functions (if used)
        "codebase": "default"
    }]
}
```

**SPA Rewrite Rule**: ALL requests (even `/chapters`, `/dashboard`) return `index.html`. The React app handles routing client-side.

---

## 6.3 Capacitor — Android Packaging (`capacitor.config.ts`)

**Capacitor** wraps the web app in a native Android WebView:

```typescript
{
    appId: 'Tooth.Kingdom.Adventure',
    appName: 'Tooth Kingdom Adventure',
    webDir: 'build',           // Uses the Vite production build
    bundledWebRuntime: false,  // Uses system WebView
    server: { cleartext: true } // Allows HTTP (not just HTTPS) for dev
}
```

### How It Works:
1. `npm run build` → generates `build/` folder
2. `npx cap sync` → copies `build/` into `android/app/src/main/assets/public/`
3. The Android app loads `index.html` from these assets in a WebView
4. `window.Capacitor.isNative` is `true` inside the WebView → triggers full-screen mode

### Android Directory (`android/`):
- Standard Android Studio project structure (Gradle, manifests, resources)
- The WebView loads the bundled web app from local assets (no server needed)
- Can access native APIs (camera, biometrics) through Capacitor plugins

---

## 6.4 Automation Scripts (`.bat` files)

Windows batch scripts for common development tasks:

| Script | Purpose |
|---|---|
| `START_TOOTH_KINGDOM.bat` | Starts the Vite dev server |
| `MASTER_LAUNCH.bat` | Starts BOTH frontend and backend simultaneously |
| `LIVE_DEV.bat` | Hot-reload development mode |
| `ANDROID_SYNC.bat` | Builds and syncs to Android project |
| `DEPLOY_ALL.bat` | Builds and deploys to Firebase Hosting |
| `DEPLOY_HOSTING.bat` | Deploy hosting only |
| `GENERATE_APK.bat` | Builds the Android APK |
| `LAUNCH_ANDROID_STUDIO.bat` | Opens Android Studio with the project |
| `DEBUG_BACKEND.bat` | Starts backend with debug logging |
| `CHECK_CONNECTION.bat` | Tests backend connectivity |
| `KILL_ALL_PYTHON.bat` | Force-kills all Python processes |

---

## 6.5 Performance Optimizations

### Frontend Performance:
1. **Vite HMR** — Sub-second hot reloads during development
2. **Code Splitting** — Each game component is a separate chunk
3. **Image Preloading** — Sound effects and critical images loaded on mount
4. **Debounced Backend Sync** — User data saves batched with 1-2 second delays
5. **ResizeObserver** — Efficient iframe resizing without polling
6. **localStorage Cache** — Instant data access without network calls
7. **Audio Preloading** — All 4 sound effects pre-loaded for zero-latency playback
8. **Framer Motion** — GPU-accelerated CSS transforms for animations

### Backend Performance:
1. **FastAPI + Uvicorn** — Async Python with event-loop-based request handling
2. **SQLite** — Zero-overhead local database (no network round-trips)
3. **Keyword Matching First** — AI responses use fast string matching before expensive API calls
4. **API Timeouts** — 12-second timeout for Gemini, 10-second for ElevenLabs
5. **Response Caching** — Mock responses bypass the network entirely

---

## 6.6 Data Flow Summary

```
User Action (e.g., completes a game)
    │
    ▼
Game Component calls onComplete(score, stars)
    │
    ▼
ChaptersScreen calls updateUserData({
    completedChapters: prev + 1,
    totalStars: prev + stars,
    ...rpgService.rewardTaskCompletion(userData, 'lesson')
})
    │
    ▼
GameContext.updateUserData():
    1. Merges updates into state
    2. Runs checkAchievements() → auto-grants achievements
    3. Saves to localStorage (instant)
    4. Debounced POST to /users/{uid} (1 second delay)
    │
    ▼
App.tsx reward listener detects change:
    1. Shows "+50 XP" popup animation
    2. Plays 'success' sound
    │
    ▼
Backend receives POST /users/{uid}:
    1. Saves userData JSON to SQLite database
    2. Data persists across sessions and devices
```

---

## 6.7 `src/data/` — Static Data Files

### `characters.ts` — 5 Playable Heroes
| ID | Name | Role | Description |
|---|---|---|---|
| 1 | Luna | Vanguard of Radiance | Leads the charge against decay |
| 2 | Max | Strategist of Sparkle | Designs defense systems |
| 3 | Mia | Enamel Enchanter | Weaves protection spells |
| 4 | Zara | Plaque Prowler | Swift precision fighter |
| 5 | Kai | Stalwart Sentry | Unmovable wall of resilience |

### `achievements.ts` — 8 Achievements
| ID | Title | Requirement | Category |
|---|---|---|---|
| 1 | First Steps | Complete first lesson | Lessons |
| 2 | Brush Master | 3-day streak | Streak |
| 3 | Star Hunter | 50 total stars | Stars |
| 4 | Chapter Champion | Finish Chapter 1 | Chapters |
| 5 | Star Legend | 250 total stars | Special |
| 6 | Perfect Week | 7-day streak | Streak |
| 7 | Master Brusher | Reach Level 5 | Lessons |
| 8 | Kingdom Defender | Complete 3+ chapters | Special |

### `learningContent.ts` — Educational Resources Catalog
Defines 12 learning resources, 6 academy courses, and 8 PDF resources:
- **Videos**: Links to YouTube dental education content
- **PDFs**: Links to ADA, Colgate, Crayola dental worksheets
- **Interactive**: Links to PBS Kids and other educational games
- Categories: Kids, Parents, Teachers
- Each resource has: title, description, type, thumbnail, rating, view count, URL

### `chapters.ts` — 6 Game Chapters
(Detailed in Chapter 4 of this documentation)

---

## 6.8 Chibi Guide System (`src/components/common/ChibiGuide.tsx`)

An animated character guide that greets the user on the dashboard:

1. Cycles through all 5 Chibi characters sequentially
2. Each character has 3 lore-based dialogue lines personalized with the user's name
3. Text appears with a **typewriter effect** (character by character at 10ms intervals)
4. Each character plays a procedural "blip" sound as they "speak"
5. Tapping advances dialogue; tapping during typing completes the current line instantly
6. After all 5 characters speak, the guide dismisses itself
7. Uses Framer Motion for entrance/exit animations (spring physics)
8. Positioned as an absolute overlay on top of the dashboard
