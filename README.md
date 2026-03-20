# Tooth Kingdom Adventure 🏰✨

[![Project Status: Active](https://img.shields.io/badge/Project%20Status-Active-brightgreen.svg)]()
[![Frontend: React](https://img.shields.io/badge/Frontend-React%2018-61dafb.svg)]()
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)]()
[![AI: Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange.svg)]()

Welcome to the **Tooth Kingdom Adventure** ecosystem—a gamified oral health adventure where children become heroes, and parents/teachers become their legendary guides.

---

## 💎 Premium Features (New Update v7.0)

### 🎬 Cinematic Inline Media Player
Experience dental education like never before. The new **Premium Inline Player** is embedded directly into the Kingdom Dashboard, offering:
- **Zero-Crop Viewing**: A stacked header design ensures the video remains 100% visible.
- **Classic Framed UI**: A high-contrast, premium white border matching the Royal Kingdom aesthetic.
- **Mobile Stability+**: Engineered with "Anti-Crushing" constraints (`min-height` & `16:9` ratio) to ensure a perfect look on every device.

### 🛡️ Kingdom Dashboard
The heart of your adventure has been redesigned for maximum clarity:
- **Inline Feed**: Media plays directly between your **Kingdom Level** and the **Learning Academy**, keeping your navigation accessible at all times.
- **Dynamic AI Tutor**: A persistent learning buddy powered by Gemini AI, ready to answer any dental query in real-time.

---

## 🚀 Technical Architecture

### 📱 Mobile (Android App)
Built with **Capacitor 6**, wrapping our high-performance React frontend into a native container.
- **Location**: `/android`
- **Features**: Biometric Sync, Push Notifications, Native Resource Management.

### 🌐 Core Frontend
A state-of-the-art React application focused on micro-animations and engagement.
- **Stack**: TypeScript, Vite, Tailwind CSS, Framer Motion.
- **Highlights**: Responsive "Classic Framed" modals, high-contrast UI tokens, and dynamic RPG progress tracking.

### 🐍 AI & Reward Backend
A specialized service for habit tracking and adaptive learning.
- **Location**: `/backend/python`
- **Stack**: FastAPI, SQLite, Uvicorn.
- **Features**: Real-time XP sync, Daily Quest generation, and Enamel Health monitoring.

---

## 📂 Kingdom Structure
```
Tooth-Kingdom-Adventure/
├── android/          # Native Android Project (Capacitor)
├── backend/          # Python FastAPI & SQLite Backend
├── docs/             # Technical Reports & Presentations
├── public/           # Mini-Games (Unity / Godot / GameMaker)
├── src/              # React Source Code (The Dashboard & Academy)
├── firebase.json     # Cloud Hosting & Authentication
└── package.json      # The Royal Scroll of Dependencies
```

---

## 🛠️ Developer Scroll
1. **Summon the Frontend**: `npm install` && `npm run dev`
2. **Awaken the Spirit**: `cd backend/python` && `python main.py`
3. **Shield the Assets**: `npx cap sync android` to push to your device.

---
*Created with Royal Care for the Heroes of the Tooth Kingdom. Brushing is the ultimate quest!* 🦷✨