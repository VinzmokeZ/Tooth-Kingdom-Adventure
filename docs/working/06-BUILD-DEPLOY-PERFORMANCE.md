# 🚀 06: Build, Deploy & Performance

Detailed instructions on how to package and optimize the Tooth Kingdom app.

---

## 📱 6.1 Building for Mobile (Android)
Your app uses **Capacitor** to bridge React to Android Studio.

1. **Build Web**: Run `npm run build`. This generates the `dist/` folder.
2. **Sync native**: Run `npx cap sync`. This copies the web code into the `android/` folder.
3. **Launch Studio**: Open Android Studio and build the **APK** or **AAB** for the Play Store.

---

## 🖥️ 6.2 Automation Scripts (.bat)
You have several batch files to speed up development:
- `LIVE_DEV.bat`: Starts the React dev server and Backend simultaneously.
- `GENERATE_APK.bat`: Automates the build and sync process for mobile.
- `DB_VIEWER.bat`: Opens a tool to inspect your SQLite database.

---

## ⚡ 6.3 Performance Optimization
1. **Hardware Acceleration**: Ensure all CSS animations use `transform: translateZ(0)` for 60fps movement on older phones.
2. **Debounced Sync**: The app doesn't save to the DB every second; it waits for the user to stop typing/playing to avoid lag.
3. **Asset Lazy-Loading**: Game assets for Chapter 6 aren't loaded until the user actually enters Chapter 6.

---

## ☁️ 6.4 Deployment (Web)
- **Netlify**: The `Netlify-Web-Version` folder contains the specific config (`netlify.toml`) to host the app as a standard website.
- **Firebase Hosting**: Run `firebase deploy` to push the production build to your Google Cloud URL.
