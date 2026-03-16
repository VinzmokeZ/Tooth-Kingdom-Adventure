# Chapter 3: Backend Deep Dive

## 3.1 Overview

The backend is a **Python FastAPI** REST API server located at `backend/python/main.py`. It runs locally on `http://127.0.0.1:8010` via **Uvicorn** (an ASGI server) and handles:
- User registration and authentication
- User data persistence (SQLite)
- AI chatbot processing (Google Gemini + ElevenLabs TTS)

---

## 3.2 `backend/python/main.py` — Server Entry Point (337 lines)

### Startup Sequence:
1. Enables `faulthandler` to log hard crashes to `hard_crash.log`
2. Imports FastAPI, adds CORS middleware (allows all origins for dev)
3. Loads `.env` file for API keys (`GOOGLE_GEMINI_API_KEY`, `ELEVENLABS_API_KEY`)
4. Initializes SQLite database at `backend/python/database.db`
5. Starts Uvicorn on `127.0.0.1:8010`

### Database Schema (`users` table):
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PK | Auto-incrementing ID |
| `uid` | TEXT UNIQUE | User identifier (e.g., "local_1234") |
| `name` | TEXT | Display name |
| `email` | TEXT UNIQUE | Email address |
| `password_hash` | TEXT | bcrypt-hashed password |
| `role` | TEXT | 'child', 'parent', or 'teacher' |
| `level` | INTEGER | Current RPG level |
| `xp` | INTEGER | Experience points |
| `gold` | INTEGER | In-game currency |
| `enamel_health` | INTEGER | Health stat (0-100) |
| `total_stars` | INTEGER | Stars earned |
| `selected_character` | INTEGER | Chosen Chibi hero ID |
| `completed_chapters` | INTEGER | Chapters beaten |
| `current_streak` | INTEGER | Current brushing streak |
| `total_days` | INTEGER | Total active days |
| `phone_number` | TEXT | Phone (optional) |
| `date_of_birth` | TEXT | DOB (optional) |
| `parent_uid` | TEXT | Link to parent account |
| `userData` | TEXT | Full JSON blob of all game data |

### API Routes:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET /` | Health check | Returns `{"status": "online", "engine": "Haru-AI-v5"}` |
| `POST /debug/log` | Debug logging | Logs a message to server console |
| `POST /auth/register` | Registration | Creates user with bcrypt-hashed password |
| `POST /auth/login` | Login | Verifies password, returns JWT token (7-day expiry) |
| `POST /auth/google` | Google OAuth sync | Creates/updates user from Google profile |
| `POST /auth/phone` | Phone auth | Creates/finds user by phone number |
| `GET /users/{uid}` | Get user data | Returns user's full `userData` JSON |
| `POST /users/{uid}` | Save user data | Updates user's `userData` JSON blob |
| `POST /ai/process` | AI chatbot | Sends text to Gemini, returns response + audio |

### Password Security:
- Uses **passlib** with **bcrypt** scheme for password hashing
- Includes a compatibility fix for `passlib 1.7.4` + `bcrypt 4.0+` (patches missing `__about__` attribute)
- If bcrypt fails to import, falls back to plaintext (dev-only safety net)

### JWT Authentication:
- Secret key: `"tooth-kingdom-secret-key"` (hardcoded for development)
- Algorithm: HS256
- Token expiry: 7 days
- Generated on login, stored in frontend `localStorage`

---

## 3.3 AI Chatbot System (`/ai/process`)

The AI endpoint powers the in-app dental guide character "Tanu". It has a **three-tier response system**:

### Tier 1: Keyword Matching (Fastest, Zero Latency)
Pre-determined responses for common dental questions:
- "hello/hi/hey" → Greeting
- "brush/properly/how" → Brushing advice
- "pain/hurt/bleed" → Pain guidance
- "sugar/candy/sweet" → Sugar warnings
- "why/important/cavity" → Importance of brushing

### Tier 2: Google Gemini API (Smart Fallback)
If no keyword matches, sends the question to **Gemini 1.5 Flash** via REST API:
- System prompt: "You are Tanu, the cheerful dental guide. Answer briefly (2 sentences). Only talk about teeth, hygiene, or the Tooth Kingdom. No emojis."
- Temperature: 0.7, Max tokens: 100
- If Flash fails, automatically retries with **Gemini 1.5 Pro**
- Strips non-BMP Unicode characters (emojis) to prevent terminal crashes

### Tier 3: Static Fallback (Crash-Proof)
If all API calls fail: `"I'm having a little trouble thinking! Let's talk about brushing!"`

### Voice Synthesis (ElevenLabs):
After generating text, optionally converts it to speech:
- Voice ID: `EXAVITQu4voX998R6I7k` (a preset voice)
- Model: `eleven_monolingual_v1`
- Text capped at 250 characters for speed
- Returns base64-encoded audio in the response

---

## 3.4 `backend/python/requirements.txt` — Dependencies

```
fastapi>=0.100.0       # REST API framework
uvicorn>=0.22.0        # ASGI web server
pydantic>=2.0.0        # Request/response validation
passlib>=1.7.4         # Password hashing abstraction
bcrypt>=4.0.0          # bcrypt hash algorithm
PyJWT>=2.8.0           # JSON Web Tokens
google-generativeai    # Gemini SDK (imported but REST used instead)
elevenlabs>=1.0.0      # TTS SDK (imported but REST used instead)
python-dotenv>=1.0.1   # .env file loader
requests>=2.32.0       # HTTP client for API calls
```

---

## 3.5 `backend/python/database.db` — SQLite Database

A single-file relational database. No separate database server needed — SQLite reads/writes directly to this file. The `get_db()` function creates a new connection per request and closes it when done.

---

## 3.6 `.env` — Environment Configuration

```
VITE_USE_LOCAL_BACKEND=true          # Toggle local vs. cloud backend
VITE_LOCAL_BACKEND_URL=http://localhost:8010  # Backend address
GOOGLE_GEMINI_API_KEY=AIza...        # Google AI API key
ELEVENLABS_API_KEY=sk_...            # ElevenLabs TTS API key
```

- `VITE_` prefixed vars are exposed to the frontend by Vite
- Non-prefixed vars are only available to the Python backend (loaded via `python-dotenv`)

---

## 3.7 Error Handling & Crash Protection

The backend is designed to survive crashes without losing information:

1. **`faulthandler`** — Writes segfault stack traces to `hard_crash.log`
2. **`log_error()`** — Appends errors with timestamps to `backend_crash.log`
3. **`safe_print()`** — Encodes unicode safely to prevent terminal crashes from emoji output
4. **Try/Except everywhere** — Every route and external API call is wrapped in error handling
5. **Multiple log files**: `backend_crash.log`, `hard_crash.log`, `error_8011.log`, `server.log`, `system_test.log`
