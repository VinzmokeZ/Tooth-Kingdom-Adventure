# 📖 Tooth Kingdom: Language & Keyword Guide

This guide explains the "Vocabulary" of your project. It covers the most important keywords used in the different languages that make your app run.

---

## ⚛️ 1. TypeScript & React (Frontend)
*Used for: The app interface, buttons, screens, and logic.*

| Keyword | What it does |
| :--- | :--- |
| **`interface`** / **`type`** | Defines the "shape" of data. For example, `interface UserData` tells the code exactly what information a user must have (name, XP, etc.). |
| **`useState`** | Creates a "memory" for a component. Example: `const [score, setScore] = useState(0)` remembers the player's score. |
| **`useEffect`** | Runs code "on the side" or when something changes. Used for saving data to the server or starting a timer. |
| **`useContext`** | Allows data to "teleport" across many files without passing it manually. (e.g., `AuthContext` makes user login data available everywhere). |
| **`props`** | Short for "properties." These are inputs passed from a parent component to a child component. |
| **`async` / `await`** | Tells the code to "wait" for something to finish (like fetching data from the server) before moving to the next line. |
| **`export` / `import`** | Used to share code between different files. |

---

## 🐍 2. Python & FastAPI (Backend)
*Used for: The server, database management, and AI.*

| Keyword | What it does |
| :--- | :--- |
| **`@app.get` / `@app.post`** | Defines a "Route" or "Endpoint." It tells the server what to do when the frontend asks for data (`GET`) or sends data (`POST`). |
| **`Depends`** | Used to inject "dependencies," like making sure a database connection is ready before running a function. |
| **`BaseModel`** | (from Pydantic) Automatically checks that the data coming from the frontend is correct and formatted properly. |
| **`HTTPException`** | Sends an error message back to the frontend (e.g., "404 Not Found" or "401 Unauthorized"). |
| **`uvicorn`** | The "engine" that actually runs the Python server. |

---

## 🎮 3. Game Logic (C# & GML)
*Used for: The mini-games (Unity or GameMaker style).*

### C# (Unity Style)
| Keyword | What it does |
| :--- | :--- |
| **`MonoBehaviour`** | The base class for all Unity scripts. It allows the script to be attached to a game object. |
| **`Update()`** | A function that runs **every single frame** (usually 60 times a second). Used for movement and timers. |
| **`Start()`** | Runs once at the very beginning when the game starts. |
| **`gameObject`** | Refers to the "thing" the script is attached to (like a player or a toothbrush). |
| **`Debug.Log`** | Prints a message to the console to help the developer see what's happening. |

### GML (GameMaker Style)
| Keyword | What it does |
| :--- | :--- |
| **`room_speed`** | The frame rate of the game. `45 * room_speed` means 45 seconds worth of frames. |
| **`instance_destroy()`** | Removes an object from the game (e.g., when a "Grime Monster" is defeated). |
| **`draw_text()`** | Draws words directly onto the screen during the game. |
| **`vk_left` / `vk_right`** | Virtual Key codes for the keyboard arrows. |

---

## 🗄️ 4. SQL (Database)
*Used for: Storing your data permanently in `database.db`.*

| Keyword | What it does |
| :--- | :--- |
| **`CREATE TABLE`** | Sets up a new folder inside the database (like "users" or "achievements"). |
| **`SELECT`** | Asks the database for specific information (e.g., "Give me the XP for User 123"). |
| **`INSERT`** | Adds a brand new record to the database. |
| **`UPDATE`** | Changes info that is already there (e.g., "Change the level from 5 to 6"). |
| **`PRIMARY KEY`** | A unique ID that ensures no two users or items are confused with each other. |

---

## 💡 How it all connects
1. **Navigate**: React uses `navigateTo` to swap screens.
2. **Store**: Browsers use `localStorage`, and the server uses `SQLite (SQL)`.
3. **Update**: `GameContext` notices a change -> Saves to `localStorage` -> Sends a `POST` request to Python -> Python runs an `UPDATE` SQL command.
