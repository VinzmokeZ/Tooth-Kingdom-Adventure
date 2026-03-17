# 🎮 Detailed Game Guide: Chapters 01 - 06

This document provides a technical and mechanical breakdown of the six core adventures in the Tooth Kingdom.

---

## 💎 Chapter 1: Cavity Miner Adventure
**Game Component:** `EnamelCastleSiege.tsx`  
**Logic Blueprint:** `CavityMinerLogic.cs`

- **Objective:** Defend the Enamel Castle from invading sugar bugs.
- **Mechanics:**
    - **Movement:** Hero moves Up/Down using a D-Pad or Arrow Keys.
    - **Attack:** Click or tap the "Sword" button to blast enemies in front of you.
    - **Enemy Types:** 🍬 Candy, 🦠 Bacteria, and 🦷 Plaque (each with different visuals).
    - **Win Condition:** Survive the 45-second timer with at least 1% Castle Health remaining.
- **Rewards:** 
    - ⭐ 1-3 Stars based on score (250 for 2, 400 for 3).
    - 💰 20 Gold per Star.
    - 📈 75 XP + RPG Bonus.

---

## 🦈 Chapter 2: Shark Dentist Challenge
**Game Component:** `ExternalGameWrapper.tsx` (External) / `SugarBugInvasion.tsx` (Local)  
**Logic Blueprint:** `SharkDentistLogic.gd`

- **Objective:** Help the Royal Shark clean his teeth before the timer runs out.
- **Mechanics:**
    - **External Integration:** This game is loaded as an `<iframe>`, communicating results back to the main app via messages.
    - **Logic:** Precision clicking to extract rotted teeth or brush away "Sugar Bugs."
- **Rewards:** Same as Chapter 1, scaled based on Shark Health preserved.

---

## 🧶 Chapter 3: Flossing Adventures
**Game Component:** `RoyalRopeRescue.tsx`  
**Logic Blueprint:** `RoyalRopeRescueLogic.cs`

- **Objective:** Use the "Royal Floss" (Rope) to rescue falling citizens of the kingdom.
- **Mechanics:**
    - **Physics-Based:** Timing-based clicks to launch the floss line.
    - **Passages:** Mastering the flossing rhythm unlocks "secret passages" (visual progress).
- **Rewards:** 
    - ⭐ 15 Stars total.
    - 📈 High XP for precision rescues.

---

## 🍗 Chapter 4: Healthy Eating Habits
**Game Component:** `KingsBanquet.tsx`  
**Logic Blueprint:** `KingsBanquetLogic.cs`

- **Objective:** Sort food at the King's table into "Healthy" or "Sugary."
- **Mechanics:**
    - **Sorting:** Swipe Left for Sugary, Right for Healthy.
    - **Combo System:** Fast correct answers build a "Combo Fire" that boosts score.
    - **Educational:** Highlights 🥛 Milk, 🥦 Broccoli, and 🧀 Cheese as dental power-ups.
- **Rewards:** 
    - 💰 High Gold reward for a 15-food streak.

---

## ⚔️ Chapter 5: Tooth Kingdom Master
**Game Component:** `WiseKnightsTrial.tsx`  
**Logic Blueprint:** `WiseKnightsTrialLogic.cs`

- **Objective:** A final test of everything learned across the kingdom.
- **Mechanics:**
    - **Hybrid Challenge:** Combines sorting, cleaning, and timing tasks.
    - **Boss Fight:** Face the "Lord of Decay" in a pattern-memory challenge.
- **Rewards:** 
    - 👑 Unlocks the "Master Champion" Badge.
    - 🏆 Max Stars (24).

---

## 🧨 Chapter 6: Battle Dentist
**Game Component:** `ExternalGameWrapper.tsx` (`/games/beatrix-dentist/`)  
**Logic Blueprint:** `BattleDentistLogic.gml`

- **Objective:** Retro-style top-down combat defending the kingdom from grime monsters.
- **Mechanics:**
    - **Combat:** Move the Battle Dentist in 8 directions.
    - **Tools:** Use the "Cleaning Blast" to dissolve grime monsters.
- **Rewards:** 
    - ⭐ 12 Stars.
    - 📈 75 XP.

---

## 🛠️ The Connection Logic
All games use the **`GameEngine.tsx`** as a central manager. When a game ends:
1. It calls `onComplete(score, stars)`.
2. This triggers the **`rpgService`** to calculate XP/Gold.
3. The **`GameContext`** then pushes this update to your **Python Backend**.
