# 🎮 04: Game Chapters & Logic Blueprints

A detailed breakdown of the 6 core adventures (Chapters 01 - 06).

---

## 🗺️ Chapter Mapping
Every level in the Kingdom has a **React UI** for the browser and a **Logic Blueprint** for the underlying game engine.

| Chapter | Title | Component | Logic Blueprint |
| :--- | :--- | :--- | :--- |
| **01** | Cavity Miner | `EnamelCastleSiege.tsx` | `CavityMinerLogic.cs` |
| **02** | Shark Dentist | `ExternalGameWrapper.tsx`| `SharkDentistLogic.gd` |
| **03** | Flossing Resuce| `RoyalRopeRescue.tsx` | `RoyalRopeResuceLogic.cs`|
| **04** | Healthy Eating | `KingsBanquet.tsx` | `KingsBanquetLogic.cs` |
| **05** | Master Challenge| `WiseKnightsTrial.tsx` | `WiseKnightsTrialLogic.cs`|
| **06** | Battle Dentist | `ExternalGameWrapper.tsx`| `BattleDentistLogic.gml` |

---

## ⚙️ How Games Run
1. **The GameEngine**: `src/components/games/GameEngine.tsx` acts as the master switch. It detects the `chapterId` and loads the correct game component.
2. **External Integration**: Chapters 2, 5, and 6 are loaded via `ExternalGameWrapper`. This allows Unity, Godot, and GameMaker games to run inside your React app via an `<iframe>`.
3. **Completion Loop**: When a game ends, it sends a `score` and `stars` count back to the `ChaptersScreen`.

---

## 📈 Reward Logic (01 - 06)
- **Star Thresholds**: 
    - 0-249 points: 1 Star ⭐
    - 250-399 points: 2 Stars ⭐⭐
    - 400+ points: 3 Stars ⭐⭐⭐
- **XP Scaling**: Completing any chapter grants **75 base XP**, which is doubled if it's the user's first time clearing the level.
- **Database Entry**: Results are committed to the `chapter_progress` table immediately.
