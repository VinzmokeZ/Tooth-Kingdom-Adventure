# 🖼️ 05: Assets & Resources

This document lists the visual and audio building blocks of the Kingdom.

---

## 🎨 5.1 Character Avatars (SVGs)
The heroes of the app are stored in `src/assets/` as scalable SVG files.
- `CHIBI 1.svg`: The default hero for Chapter 1.
- `CHIBI 2-5.svg`: High-level heroes unlocked in later chapters.
- `CHIBI 6.svg`: The Battle Dentist (Chapter 6).

---

## 🍎 5.2 Game-Specific Assets
- **Food Library**: `src/assets/food/` contains PNGs of Apple, Cheese, Soda, etc., used in the King's Banquet sorting game.
- **World Map**: `src/assets/tooth_kingdom_bg.png` and `Kingdom_Map.png` provide the immersive backdrop for the adventures.
- **Models**: `public/models/hiyori/` contains the Live2D cubism files that make your AI Guide move and blink.

---

## 🔊 5.3 Audio & Sound FX
The app uses a mix of local files and Mixkit CDN links within `useSound.ts`.
- **Primary Sounds**: Click, Success, Level Up, and Timer Tick.
- **Background Music**: Each chapter has a unique looping track (e.g., `banquet_theme.mp3`).

---

## 💎 5.4 Iconography
- **Achievement Badges**: Stored in `public/thumbnails/`.
- **Navigation Icons**: Powered by **Lucide React** (Chest, Star, Heart, Sword icons).

---

## 🛠️ 5.5 How to Add New Assets
1. **Import**: Place the new PNG/SVG in `src/assets/`.
2. **Register**: Import the file in `src/data/constants.ts` or the specific Game file.
3. **Optimze**: Always use SVGs for icons and compressed PNGs for game assets to keep the APK small.
