# 🎮 Tooth Kingdom Adventure - Core Game Logic

This directory contains the **Architectural Blueprints** and core source code logic for the 6 mini-games in the Tooth Kingdom Adventure. 

### 📂 Purpose
These files represent the "Brain" of each game, stripped of UI rendering and platform-specific overhead. They serve as a reference for:
- Implementing these games in other engines (Unity, GameMaker, Godot).
- Documenting scoring mechanics, physics behaviors, and win/loss conditions.
- Demonstrating the underlying "ruleset" that drives the user experience.

### 🧩 The 9 Mini-Games
1. **Sugar Bug Invasion**: Reaction-based tapping (C#).
2. **Royal Rope Rescue**: Physics-based navigation (C#).
3. **The King's Banquet**: Categorical sorting (C#).
4. **Enamel Castle Siege**: Lane defense & combat (C#).
5. **Wise Knight's Trial**: Quiz & Trivia (C#).
6. **Deep Clean Challenge**: Surface cleaning simulation (C#).
7. **Cavity Miner Adventure**: Grid-based exploration & mining (C#).
8. **Shark Dentist Challenge**: Precision extraction & cleaning (GDScript).
9. **Battle Dentist**: Retro shooter & grime blasting (GML).

---

### 💻 Language Reference
The logic is presented in **C# (Unity-Style)** but follows standard patterns applicable to **GML (GameMaker)** or **C++**. 

- **State Management**: Handling game loops (Start, Update, End).
- **Collision Logic**: Range-based and Coordinate-based hit detection.
- **Scoring Systems**: Integrated multipliers, streaks, and star-rating calculations.

---
*Note: These files are for documentation and reference only. The live game logic is currently implemented in TypeScript/React within the `/src/components/games` directory.*
