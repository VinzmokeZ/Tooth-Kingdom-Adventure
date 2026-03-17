# language_guide.md: Important Keywords

### ⚛️ TypeScript / React
- **`useState`**: Used to remember values on the screen (like your current score).
- **`useEffect`**: Used to start timers or load data from the database.
- **`useContext`**: Used to share your User Data across every screen in the app.
- **`interface`**: Defines the "Shape" of a data object (e.g., what fields a `Chapter` must have).

### 🐍 Python / FastAPI
- **`@app.get` / `@app.post`**: Defines a web address (API Route) that the app can call.
- **`BaseModel`**: A Pydantic tool used to validate that data coming from the app is correct.
- **`Depends`**: Used to set up database connections for a specific task.

### 🎮 Game Blueprints (C# / GML)
- **`Update()`**: A function that runs Every Frame (60 times a second) to move objects.
- **`MonoBehaviour`**: The base class for all Unity-style game logic.
- **`ds_list`**: A GameMaker collection used to track many enemies at once.
- **`room_speed`**: Controls how fast a GameMaker stage progresses.

### 🗄️ SQL (Database)
- **`SELECT`**: Read data from the database.
- **`UPDATE`**: Save new progress.
- **`INSERT`**: Add a new user or log entry.
- **`WHERE`**: Filter data so you only get your own stats (using your `uid`).
