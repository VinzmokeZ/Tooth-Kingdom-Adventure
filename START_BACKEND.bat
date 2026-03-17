@echo off
TITLE Tooth Kingdom - Backend Safe Launch
COLOR 0B

echo ======================================================
echo   TOOTH KINGDOM BACKEND - SAFE LAUNCH
echo ======================================================

echo [1/3] Clearing Port 8010 (Removing Ghost Processes)...
:: Check if anything is on port 8010 and kill it
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8010 ^| findstr LISTENING') do (
    echo Found ghost process PID %%a. Killing...
    taskkill /f /pid %%a >nul 2>&1
)

echo [2/3] Checking Virtual Environment...
if exist ".venv" goto :venv_found
echo [ERROR] Virtual environment (.venv) not found!
echo Please ensure you are running this from the project root.
pause
exit /b

:venv_found
echo [3/3] Starting Backend Engine...
cd backend/python
:: Use a temporary variable to capture exit code
..\..\.venv\Scripts\python.exe -u main.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ [CRITICAL ERROR] The Backend has crashed! 
    echo Please take a screenshot of the error above and tell me.
)

echo.
echo [Process ended or interrupted]
pause
