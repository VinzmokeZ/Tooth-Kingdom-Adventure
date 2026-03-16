@echo off
setlocal enabledelayedexpansion
title Tooth Kingdom - Main App Deploy
color 0D

echo ============================================================
echo     TOOTH KINGDOM - MAIN APP DEPLOY (MOBILE/WEB)
echo ============================================================
echo.
echo  This will:
echo    [1] Build the production web app (Vite)
echo    [2] Deploy to Firebase Hosting (Live Web)
echo    [3] Sync to Android (Pre-APK)
echo.

:: 1. BUILD
echo [STEP 1/3] Building production web app...
call npm run build
if !ERRORLEVEL! NEQ 0 (
    echo.
    echo [ERROR] Build failed! Check for TS errors.
    pause
    exit /b 1
)
echo.
echo [OK] Build complete!

:: 2. DEPLOY
echo [STEP 2/3] Deploying to Firebase Hosting...
call npx firebase-tools deploy --only hosting --non-interactive
if !ERRORLEVEL! NEQ 0 (
    echo.
    echo [WARNING] Firebase deploy may have failed.
) else (
    echo.
    echo [OK] Firebase deployed! Live at: https://tooth-kingdom-adventure.web.app
)

:: 3. SYNC
echo [STEP 3/3] Syncing to Android...
call npx cap sync android
if !ERRORLEVEL! NEQ 0 (
    echo.
    echo [WARNING] Android sync failed.
) else (
    echo.
    echo [OK] Android synced! Ready for Android Studio.
)

echo.
echo ============================================================
echo   MAIN DEPLOY COMPLETE!
echo ============================================================
pause
