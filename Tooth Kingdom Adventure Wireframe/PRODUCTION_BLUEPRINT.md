# Technical Blueprint: Tooth Kingdom Adventure (Full App Build)

This document is the master developer reference for transforming the current wireframe into a globally available, real-time mobile application.

---

## 🏗️ 1. Core Architecture
-   **Frontend**: React 18 + Vite (Current)
-   **Mobile SDK**: **Capacitor 6.x** (Native Bridge)
-   **Runtime**: Node.js 20+
-   **Build Tool**: Vite (Web), Android Studio (Mobile), Xcode (Mobile)

---

## ☁️ 2. Backend & Database (Real-Time Infrastructure)
**Platform Choice: Firebase (Google Cloud)**

### A. Authentication System
| Method | Implementation |
| :--- | :--- |
| **Email/Pass** | Firebase Auth with SMTP |
| **Biometric** | `capacitor-native-biometric` bridged to Firebase Custom Tokens |
| **Social** | Google & Apple Sign-In plugins |
| **2FA** | Firebase Phone Auth (SMS) |

### B. Database Schema (Cloud Firestore)
-   **`users/{uid}`**: Profile, hero selection, total stars, parent settings.
-   **`streaks/{uid}`**: Daily logs, timestamps, current streak counter.
-   **`achievements/{uid}`**: List of unlocked IDs and unlock timestamps.
-   **`sessions/{uid}`**: Tracking game session durations for analytics.

---

## 🏗️ 3. Modular Game Architecture
### A. Future-Proofing Game Slots
The `ChaptersScreen` is designed with **Expansion Slots** in mind.
- **Implementation**: A flex-grid container is ready to receive dynamic `CustomGame` components.
- **Developer Workflow**: Simply drop new game components into the `src/components/games` folder and link them to these slots in `ChaptersScreen.tsx`.

---

## 🎮 4. Game Engine & State Management
### A. Progression Syncing
The current local `userData` in `App.tsx` must be migrated to a global store.
- **Tool**: **TanStack Query (React Query)** for caching.
- **Workflow**:
    1.  Game ends -> Call `updateUserStats()` Mutation.
    2.  Update Firestore.
    3.  Invalidate local cache -> Refresh Dashboard.

### B. Offline Policy (Children's App)
-   Use `Workbox` (Service Workers) to cache all game assets (images, sounds).
-   Enable Firestore Offline Persistence so progress saves even in the car/airplane.

---

## 📱 5. Native Mobile Integration

### A. Capacitor Bridge Configuration
-   `capacitor.config.ts`: Define `appId: "com.toothkingdom.adventure"`.
-   **Permissions (Android)**:
    -   `USE_BIOMETRIC` & `USE_FINGERPRINT`
    -   `POST_NOTIFICATIONS` (for brushing reminders)
    -   `INTERNET`

### B. High-Fidelity UI Features
-   **Haptics**: `CapacitorHaptics` plugin for physical vibrations when catching fruit or hitting germs.
-   **Animations**: Keep GSAP/CSS animations but ensure `hardware acceleration` is on in CSS.

---

## 🚀 6. Deployment & CI/CD Pipeline

### A. Preparation
1.  **Iconography**: Generate 1024x1024, 512x512, 192x192 assets.
2.  **Keystore**: Generate a secure `release-key.keystore` for Android signing.

### B. Automated Pipeline (GitHub Actions)
-   `Push to Main` -> `Build Web` -> `Capacitor Sync` -> `Fastlane` -> `Play Store Internal Track`.

---

## 📋 7. Developer Checklist (Phase-by-Phase)
- [ ] Initialize Capacitor and Android platforms.
- [ ] Set up Firebase Project and SDK.
- [ ] Connect `SignInScreen` to Firebase Auth.
- [ ] Migrate `App.tsx` state to Firestore listeners.
- [ ] Test Biometric login on a physical device.
- [ ] Build for Production (`.aab`) and sign.
