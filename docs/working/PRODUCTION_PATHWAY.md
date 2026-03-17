# Production Pathway: Build Guide

1. **Step 1: The Engine**
    - Connect `AuthContext` to your production database.
    - Set `API_URL` to your live server URL (not localhost).

2. **Step 2: The Build**
    - Run `npm run build` to compile the React code.
    - Run `npx cap copy` to move files to Android/iOS.

3. **Step 3: The Native Adjustments**
    - Update `AndroidManifest.xml` with your app icons.
    - Set permissions for Camera (if needed) and Notifications.

4. **Step 4: Verification**
    - Run the app on a physical device.
    - Check that the offline sync works (turn off Wi-Fi and save).

5. **Step 5: Submission**
    - Export a signed bundle.
    - Upload to App Store Connect or Google Play Console.
