@echo off
TITLE Tooth Kingdom - LIVE DEV (Online Backend Mode)
COLOR 0B

REM ================================================================
REM  TOOTH KINGDOM ADVENTURE - LIVE DEV WITH WORKING BACKEND
REM  Runs: Vite frontend + Python FastAPI backend together
REM  LIVE_DEV.bat = offline mockup | This file = real backend + DB
REM ================================================================

set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"
set "BACKEND=%ROOT%\backend\python"

echo.
echo ================================================================
echo   TOOTH KINGDOM ADVENTURE - ONLINE BACKEND MODE
echo ================================================================
echo.

REM ── Step 1: Check Python ─────────────────────────────────────────
echo [1/6] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Python not found! Download from: https://python.org
    pause & exit /b 1
)
python --version
echo.

REM ── Step 2: Check Node ───────────────────────────────────────────
echo [2/6] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Node.js not found! Download from: https://nodejs.org
    pause & exit /b 1
)
node --version
echo.

REM ── Step 3: Install Python deps ──────────────────────────────────
echo [3/6] Checking Python dependencies...
python -m pip install -r "%BACKEND%\requirements.txt" -q --disable-pip-version-check 2>nul
python -m pip install colorama fastapi uvicorn pydantic bcrypt PyJWT python-dotenv requests -q --disable-pip-version-check 2>nul
echo   Dependencies ready.
echo.

REM ── Step 4: ADB USB Phone Detection + Auto-Launch ──────────────
echo [4/6] Checking for USB-connected Android phone...

set "PHONE_CONNECTED=0"
set "APP_ID=com.toothkingdom.adventure"

REM Check if adb exists
adb version >nul 2>&1
if errorlevel 1 (
    echo   [INFO] ADB not found. Phone auto-launch skipped.
    echo   To enable: install Android Studio or Platform Tools from:
    echo   https://developer.android.com/studio/releases/platform-tools
    echo.
    goto :skip_adb
)

REM Check for connected device
set "ADB_DEVICE="
for /f "skip=1 tokens=1" %%d in ('adb devices 2^>nul') do (
    if not "%%d"=="" (
        set "ADB_DEVICE=%%d"
        goto :adb_found
    )
)

:adb_found
if "%ADB_DEVICE%"=="" (
    echo   [INFO] No phone detected via USB.
    echo   To auto-launch the app on your phone:
    echo     1. Settings ^> Developer Options ^> USB Debugging ON
    echo     2. Plug in USB-C cable and accept the popup on your phone
    echo     3. Re-run this batch file
    echo.
    goto :skip_adb
)

echo   [OK] Phone connected: %ADB_DEVICE%

REM Set up port tunnel (phone localhost = PC)
adb reverse tcp:8010 tcp:8010 >nul 2>&1
adb reverse tcp:5173 tcp:5173 >nul 2>&1
echo   [OK] USB port tunnel ready (no WiFi needed)

REM Try launching the installed Tooth Kingdom app first
adb shell pm list packages 2>nul | findstr /i "%APP_ID%" >nul 2>&1
if errorlevel 1 (
    echo   [INFO] App not installed on phone yet.
    echo          Will auto-open browser after server starts.
    set "PHONE_CONNECTED=2"
) else (
    echo   [OK] Tooth Kingdom app found on phone!
    echo        Will auto-launch it after server starts.
    set "PHONE_CONNECTED=1"
)
echo.

:skip_adb

REM ── Step 5: Get LAN IP (fallback / WiFi mode) ────────────────────
echo [5/6] Getting LAN IP (for WiFi / browser access)...
set LAN_IP=127.0.0.1
for /f "tokens=*" %%I in ('python -c "import socket; s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM); s.connect((\"8.8.8.8\",80)); print(s.getsockname()[0]); s.close()" 2^>nul') do set LAN_IP=%%I
echo   LAN IP: %LAN_IP%
echo.

REM ── Step 6: Show URLs and launch ─────────────────────────────────
echo [6/6] Starting Vite frontend + Python backend...
echo.
echo ================================================================
echo   BROWSER (this PC) : http://localhost:5173
echo   PHONE via USB     : auto-launched on your phone!
echo   PHONE via WiFi    : http://%LAN_IP%:5173
echo.
echo   BACKEND API       : http://127.0.0.1:8010
echo   SWAGGER UI        : http://127.0.0.1:8010/docs
echo   ALL ROUTES        : http://127.0.0.1:8010/debug/routes
echo.
echo   LOGS SAVED        : logs\backend_[date].log
echo ================================================================
echo.
echo   All requests appear below in real-time. Press CTRL+C to stop.
echo ================================================================
echo.

REM Auto-launch phone app or browser 12 seconds after start (server needs time to boot)
if "%PHONE_CONNECTED%"=="1" (
    REM Launch installed Tooth Kingdom app on phone
    start "Phone Launcher" cmd /c "timeout /t 12 /nobreak >nul && adb shell monkey -p %APP_ID% -c android.intent.category.LAUNCHER 1 >nul 2>&1 && echo [PHONE] Tooth Kingdom app launched on your phone!"
)
if "%PHONE_CONNECTED%"=="2" (
    REM App not installed - open localhost:5173 in phone's Chrome
    start "Phone Launcher" cmd /c "timeout /t 12 /nobreak >nul && adb shell am start -a android.intent.action.VIEW -d http://localhost:5173 >nul 2>&1 && echo [PHONE] Opened browser on your phone!"
)

REM ── DB Viewer: launches in its own window (waits 8s inside DB_VIEWER.bat) ───
start "Tooth Kingdom - Live DB Viewer" "%ROOT%\DB_VIEWER.bat"

REM Launch Vite + Python together (single terminal, single browser tab)
cd /d "%ROOT%"
set PYTHONUNBUFFERED=1
npx concurrently -n "VITE,BACKEND" -c "cyan,green" "npm run dev -- --host --open" "cd /d \"%BACKEND%\" && python -u main.py"

REM ── Only reaches here when both stop ─────────────────────────────
echo.
echo ================================================================
echo   Server stopped.
echo   USB tunnel (if active) stays until you unplug the cable.
echo   Logs saved to the logs\ folder.
echo ================================================================
echo.
pause
