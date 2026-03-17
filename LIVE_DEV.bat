@echo off
TITLE Tooth Kingdom - Unified Live Dev
COLOR 0B

echo ======================================================
echo   🛡️ TOOTH KINGDOM ADVENTURE - UNIFIED LIVE DEV
echo ======================================================
echo [INFO] Cleaning up previous sessions...
:: Kill any hanging process on port 8010 (Backend) and 3000 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8010 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo [INFO] Starting Backend Engine... (Port 8010)
:: Open in a new window and KEEP it open if it crashes (/k)
start "TK-Backend (Logs)" cmd /k "cd backend/python && python main.py"

echo [INFO] Starting Frontend Interface... (Port 3000)
:: Open in a new window and KEEP it open if it crashes (/k)
start "TK-Frontend (Logs)" cmd /k "npm run dev"

echo.
echo [INFO] Waiting 5 seconds for kingdoms to align...
timeout /t 5 /nobreak > nul

echo [SUCCESS] Browser Launching...
start http://localhost:3000

echo.
echo ======================================================
echo   [OK] Two separate log windows are now open.
echo   [OK] If one window closes, look for the ERROR in that window.
echo   [OK] You can close THIS window now.
echo ======================================================
pause
