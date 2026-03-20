@echo off
title TK Online - Build and Sync to Android
color 0A
echo ===========================================
echo  TOOTH KINGDOM ONLINE - BUILD AND SYNC
echo ===========================================
echo.

:: Step 1: Sync latest src from Frontend - Backup
echo [1/4] Syncing latest src from Frontend - Backup...
robocopy "..\Frontend - Backup\src" "src" /E /NFL /NDL /NJH /NJS /nc /ns /np
echo      Done!
echo.

:: Step 2: Install dependencies if node_modules missing
if not exist "node_modules" (
    echo [2/4] Installing dependencies...
    call npm install
) else (
    echo [2/4] Dependencies already installed. Skipping.
)
echo.

:: Step 3: Build the project
echo [3/4] Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo      Build complete!
echo.

:: Step 4: Copy to Android
echo [4/4] Syncing to Android...
call npx cap copy android
echo      Android assets updated!
echo.

echo ===========================================
echo  SUCCESS! Now open Android Studio and run.
echo ===========================================
echo.
echo NEXT STEP - Connect phone to backend via USB:
echo   1. Run: BRIDGE_USB.bat (Connects your phone to the PC)
echo   2. Run: START_BACKEND.bat (Starts the server)
echo   3. Run app from Android Studio
echo.
echo NOTE: Ensure "USB Debugging" is ON in your phone settings!
echo ===========================================
pause
