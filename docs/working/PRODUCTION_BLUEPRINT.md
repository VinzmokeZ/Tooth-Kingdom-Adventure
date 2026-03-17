# production-blueprint.md: Scaling to the Play Store

### 🏗️ 1. Architecture
- **Environment**: Capacitor 6.0 + React 18.
- **Bridge**: Using the `isNative` check to enable phone-specific hardware (Haptics, Biometrics).

### ☁️ 2. Cloud Strategy (Firebase)
- **Auth**: Firebase Authentication for managed sessions.
- **Hosting**: Firebase Hosting for the web distribution.
- **Analytics**: Firebase Analytics to track most-played chapters.

### 📱 3. Mobile Features
- **Haptic Feedback**: Vibration on game hit/success points.
- **Biometric Guard**: Optional face/fingerprint lock for Parent Dashboard.
- **Reminders**: Local notifications for Morning/Evening brushing times.

### 🚀 4. Deployment Roadmap
1. Generate unique keystore for Android signing.
2. Build production artifact (`npm run build`).
3. Sync Capacitor (`npx cap sync`).
4. Generate `.aab` (Android App Bundle).
5. Submit to Google Play Console for review.
