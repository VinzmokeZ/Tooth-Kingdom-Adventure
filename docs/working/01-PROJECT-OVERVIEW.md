# Chapter 1: Project Overview & Architecture

## 1.1 What Is Tooth Kingdom Adventure?

**Tooth Kingdom Adventure** is a gamified dental-health education app designed for children. It combines an RPG (Role-Playing Game) progression system with interactive mini-games and educational content to teach kids about brushing, flossing, nutrition, and oral hygiene in a fun, engaging way.

The app is built as a **Progressive Web App (PWA)** using modern web technologies and can also be packaged as a **native Android APK** using Capacitor.

---

## 1.2 High-Level Architecture

The project follows a **client-server architecture** with two main layers:

```
┌──────────────────────────────────────────────────────────────────┐
│                      USER'S DEVICE (Browser / Android)           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │   FRONTEND (React + TypeScript + Vite)                     │  │
│  │   - Phone Frame UI wrapper                                 │  │
│  │   - 22 Screen Components (Dashboard, Chapters, Games...)   │  │
│  │   - 6 Mini-Game Chapters (React + iframe external games)   │  │
│  │   - RPG system (XP, Gold, Health, Quests, Achievements)    │  │
│  │   - Firebase Auth (Google Sign-In)                         │  │
│  │   - Live2D VTuber Character (PixiJS)                       │  │
│  │   - Chibi Guide dialogue system                            │  │
│  │   - Sound effects (Mixkit CDN)                             │  │
│  └────────────────────────┬───────────────────────────────────┘  │
│                           │ HTTP REST API (JSON)                  │
│  ┌────────────────────────▼───────────────────────────────────┐  │
│  │   BACKEND (Python FastAPI + Uvicorn)                       │  │
│  │   - User auth (register, login, Google, phone/OTP)         │  │
│  │   - SQLite database (user profiles, game data)             │  │
│  │   - AI chatbot (Google Gemini API)                         │  │
│  │   - Text-to-Speech (ElevenLabs API)                        │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      CLOUD SERVICES                              │
│  - Firebase Hosting (production web deployment)                  │
│  - Firebase Auth (Google OAuth provider)                         │
│  - Firebase Firestore & Storage (available but unused locally)   │
│  - Google Gemini API (AI chatbot brain)                          │
│  - ElevenLabs API (voice synthesis for AI guide)                 │
│  - Mixkit CDN (sound effect MP3s)                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 1.3 Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3.1 | UI component library |
| **TypeScript** | 5.9.3 | Type-safe JavaScript |
| **Vite** | 6.0.0 | Build tool & dev server (HMR) |
| **Tailwind CSS** | Latest | Utility-first CSS styling |
| **Framer Motion** | 12.30.0 | Animations & transitions |
| **Radix UI** | Various | Accessible headless UI components |
| **Lucide React** | 0.487.0 | Icon library |
| **PixiJS** | 7.4.2 | 2D WebGL renderer (for Live2D) |
| **pixi-live2d-display** | 0.4.0 | Live2D character rendering |
| **Recharts** | 2.15.2 | Data visualization charts |
| **Firebase SDK** | 12.8.0 | Authentication & cloud services |
| **Capacitor** | 8.0.2 | Native Android bridge |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.x | Server runtime |
| **FastAPI** | ≥0.100.0 | REST API framework |
| **Uvicorn** | ≥0.22.0 | ASGI web server |
| **SQLite** | Built-in | Local database |
| **PyJWT** | ≥2.8.0 | JSON Web Token auth |
| **Passlib + bcrypt** | Latest | Password hashing |
| **Pydantic** | ≥2.0.0 | Data validation models |
| **google-generativeai** | ≥0.8.3 | Gemini AI integration |
| **elevenlabs** | ≥1.0.0 | Text-to-Speech |
| **python-dotenv** | ≥1.0.1 | Environment variable loading |

---

## 1.4 Project Directory Structure

```
Tooth Kingdom Adventure Wireframe/        ← ROOT
├── .env                                   ← API keys & backend config
├── capacitor.config.ts                    ← Android packaging config
├── firebase.json                          ← Firebase Hosting config
├── index.html                             ← HTML entry point
├── package.json                           ← Node.js dependencies & scripts
├── vite.config.ts                         ← Vite build configuration
├── icon.png                               ← App icon (1024x1024)
│
├── src/                                   ← FRONTEND SOURCE CODE
│   ├── main.tsx                           ← React entry point + Error Boundary
│   ├── App.tsx                            ← Root component + global state
│   ├── index.css                          ← Global styles (85KB)
│   ├── pixi-utils-polyfill.js             ← PixiJS v7→v6 compatibility bridge
│   ├── custom.d.ts                        ← TypeScript declarations
│   ├── vite-env.d.ts                      ← Vite environment types
│   │
│   ├── components/                        ← UI COMPONENTS
│   │   ├── AppScreens.tsx                 ← Screen router (22 screens)
│   │   ├── PhoneFrame.tsx                 ← Mobile phone frame wrapper
│   │   ├── AnimatedBackground.tsx         ← Background animations
│   │   ├── auth/                          ← Authentication components
│   │   ├── common/                        ← Shared components (ChibiGuide)
│   │   ├── figma/                         ← Figma-imported components
│   │   ├── games/                         ← Game components (6 chapters)
│   │   ├── screens/                       ← 27 screen files
│   │   └── ui/                            ← 48 reusable UI primitives
│   │
│   ├── context/                           ← REACT CONTEXT PROVIDERS
│   │   ├── AuthContext.tsx                ← Authentication state
│   │   └── GameContext.tsx                ← Game/user data state
│   │
│   ├── data/                              ← STATIC DATA
│   │   ├── chapters.ts                    ← 6 game chapter definitions
│   │   ├── characters.ts                  ← 5 Chibi hero characters
│   │   ├── achievements.ts               ← 8 achievement definitions
│   │   └── learningContent.ts            ← Learning resources catalog
│   │
│   ├── hooks/                             ← CUSTOM REACT HOOKS
│   │   └── useSound.ts                   ← Sound effect system
│   │
│   ├── services/                          ← BUSINESS LOGIC SERVICES
│   │   ├── rpgService.ts                  ← RPG mechanics logic
│   │   └── api/                           ← API service layer
│   │
│   ├── lib/                               ← LIBRARY CONFIGS
│   │   ├── firebase.ts                    ← Firebase + backend URL config
│   │   └── utils.ts                       ← Utility functions (cn)
│   │
│   ├── utils/                             ← UTILITY MODULES
│   │   ├── aiMockService.ts              ← AI mock/fallback responses
│   │   └── passwordValidation.ts         ← Password strength checker
│   │
│   ├── assets/                            ← BUNDLED ASSETS (imported in code)
│   │   ├── *.png                          ← Chapter illustrations, UI images
│   │   ├── CHIBI *.svg                    ← Character SVG art
│   │   ├── food/                          ← Food item images (Chapter 4)
│   │   ├── quiz/                          ← Quiz images (Chapter 5)
│   │   └── thumbnails/                    ← Thumbnail variants
│   │
│   ├── imports/                           ← Figma import helpers
│   ├── styles/                            ← Additional style modules
│   └── guidelines/                        ← Design guidelines
│
├── public/                                ← STATIC PUBLIC ASSETS
│   ├── games/                             ← EXTERNAL GAME ENGINES
│   │   ├── cavity-miner/                  ← Chapter 1 (Unity WebGL)
│   │   ├── shark-dentist/                 ← Chapter 2 (Godot WASM)
│   │   ├── plaque-pluck/                  ← Chapter 5 game
│   │   └── beatrix-dentist/              ← Chapter 6 (HTML5 GameMaker)
│   │
│   ├── characters/                        ← Character SVGs (5 chibis)
│   ├── thumbnails/                        ← Achievement medallion PNGs
│   ├── models/hiyori/                     ← Live2D model files
│   └── [90+ asset PNGs]                   ← UI icons, rewards, banners
│
├── backend/                               ← BACKEND SOURCE
│   ├── python/                            ← Python FastAPI server
│   │   ├── main.py                        ← Server entry point & API routes
│   │   ├── requirements.txt              ← Python dependencies
│   │   ├── database.db                    ← SQLite database file
│   │   └── [logs & test files]
│   └── php/                               ← PHP alternative backend
│
├── android/                               ← ANDROID NATIVE (Capacitor)
├── build/                                 ← Production build output
├── *.bat                                  ← Windows automation scripts
└── Mark Down Files/                       ← Existing documentation
```

---

## 1.5 How the App Starts (Boot Sequence)

1. **`index.html`** — The browser loads this file. It contains a `<div id="root">` and a `<script>` tag pointing to Vite's module loader.

2. **`src/main.tsx`** — Vite's entry point. It:
   - Imports `App.tsx` and `index.css`
   - Creates an **ErrorBoundary** class component that catches runtime crashes and displays them in a red debug panel (instead of a white screen)
   - Calls `createRoot(document.getElementById("root")).render(<App />)` to mount React

3. **`src/App.tsx`** — The root application component. It:
   - Wraps everything in `<ThemeProvider>` → `<AuthProvider>` → `<GameProvider>` → `<PhoneFrame>`
   - Renders `<AppContent>` which manages screen navigation state
   - Sets up global reward animation listeners (XP, Gold, Health, Achievements)
   - Syncs user data with the backend on login
   - Shows the Chibi Guide dialogue on the dashboard

4. **`src/components/AppScreens.tsx`** — A `switch` statement router that maps `currentScreen` strings (like `'dashboard'`, `'chapters'`, `'signin'`) to the corresponding screen components.

5. **Screen Components** — Each screen (e.g., `DashboardScreen.tsx`) receives `navigateTo`, `userData`, and `updateUserData` as props to enable navigation and data updates.

---

## 1.6 How Navigation Works

The app uses a **simple string-based state machine** instead of a URL router:

```typescript
const [currentScreen, setCurrentScreen] = useState<string>('splash');

const navigateTo = (screen: string) => {
    playSound('click');
    setCurrentScreen(screen);
};
```

- There's no URL routing (no React Router) — navigation is purely in-memory
- This keeps the app simple and works identically in browser and Capacitor (Android)
- The `AppScreens` component maps strings to React components via a `switch`
- Auth-guarded routing: unauthenticated users are redirected to `'signin'`
- Role-based routing: parents → `'parent-dashboard'`, teachers → `'teacher-dashboard'`
