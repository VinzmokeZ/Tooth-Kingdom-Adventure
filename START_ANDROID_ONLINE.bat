@echo off
setlocal
title TOOTH KINGDOM ADVENTURE - ONLINE BACKEND BOOTSTRAP (v4.0.4)

echo ============================================================
echo   TOOTH KINGDOM ADVENTURE - ONLINE ENGINE BOOTSTRAP
echo   Unified USB Bridge + Backend + Live DB
echo ============================================================
echo.

:: 0. KILL GHOST SERVERS
echo [0/3] Clearing ghost servers on port 8010...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8010') do (
    echo 🧹 Terminating ghost process: %%a
    taskkill /f /pid %%a >nul 2>&1
)
echo ✅ Port 8010: Cleared and ready.
echo.

:: 1. USB BRIDGE SETUP
echo [1/3] Activating USB Bridge (ADB Reverse)...
set ADB_PATH="%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"
if not exist %ADB_PATH% set ADB_PATH="C:\Users\Vinz\AppData\Local\Android\Sdk\platform-tools\adb.exe"

%ADB_PATH% reverse tcp:8010 tcp:8010 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ USB Bridge: Success! Phone is now bridged to Port 8010.
) else (
    echo ❌ USB Bridge: FAILED. Is your phone connected via USB?
    pause
)
echo.

:: 2. START MAIN BACKEND
echo [2/3] Starting Main Backend (Terminal 1)...
start "TK-Backend (Logs/Interactions)" cmd /k "cd backend\python && python -u main.py"
echo ✅ Backend: Launched in a new window.
echo.

:: 3. START DB VIEWER
echo [3/3] Starting Live DB Viewer (Terminal 2)...
start "TK-LiveDB (Real-time Stats)" cmd /k "cd backend\python && python -u db_viewer_v3.py"
echo ✅ Live DB: Launched in a new window.
echo.

echo ============================================================
echo   READY! All engines are running across 2 windows.
echo   - Watch 'TK-Backend' for Purple Interaction logs and OTP.
echo   - Watch 'TK-LiveDB' for real-time player updates.
echo ============================================================
echo.
pause
