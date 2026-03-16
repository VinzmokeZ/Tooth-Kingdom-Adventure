# Tooth Kingdom Adventure 🏰✨

Welcome to the official repository for **Tooth Kingdom Adventure**, a comprehensive, gamified oral health education ecosystem designed for children, parents, and teachers.

## 🚀 Project Overview
Tooth Kingdom Adventure is a multi-platform solution that combines an engaging React-based web dashboard, high-performance mini-games built with Unity, Godot, and GameMaker, and a robust AI-driven backend.

### 📱 Mobile (Android App)
The mobile application is built using **Capacitor**, wrapping the core React logic into a native Android container.
- **Location**: `/android`
- **Engine**: Capacitor 6+
- **Features**: Native performance, push notifications, and biometric support.

### 🌐 Website (Frontend)
The primary user interface for the Kingdom Dashboard and Learning Academy.
- **Location**: `/src` & `/public`
- **Stack**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion.

### 🔥 Firebase Website (Cloud & Hosting)
The production-ready deployment on Firebase, including serverless infrastructure.
- **Location**: Root (`firebase.json`, `index.html`) & `/functions`
- **Features**: Firebase Hosting, Authentication, Firestore NoSQL Database, and Cloud Functions.

### 🐍 Backend & AI
A specialized Python backend for heavy logic and AI processing.
- **Location**: `/backend/python`
- **Stack**: FastAPI, Uvicorn, SQLite, Google Gemini AI.

### 🎨 Design & Docs
- **Figma Design**: The visual blueprints for the kingdom.
- **Documentation**: Professional presentation slides and technical reports are located in `/docs`.

---

## 📂 Repository Structure
```
Tooth-Kingdom-Adventure/
├── android/          # Native Android Project (Capacitor)
├── backend/          # Python FastAPI & SQLite Backend
├── docs/             # Technical Reports & Presentations
│   └── presentation/ # Slide-optimized graphics (Figma, Tech Stack)
├── functions/        # Firebase Cloud Functions (Node.js)
├── public/           # Static assets and external games (Unity/Godot)
├── scripts/          # Automation and build scripts
├── src/              # React Source Code
├── firebase.json     # Firebase Configuration
├── capacitor.config.ts # Capacitor Configuration
└── package.json      # Dependencies and Project Meta
```

---

## 🛠️ Getting Started
1. **Frontend**: Run `npm install` then `npm run dev`.
2. **Backend**: Navigate to `/backend/python`, install dependencies from `requirements.txt`, and run `main.py`.
3. **Android**: Use `npx cap sync android` to sync web assets to the native project.

---
*Created with Royal Care for the Children of the Tooth Kingdom.*