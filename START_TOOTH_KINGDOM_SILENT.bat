@echo off
TITLE Tooth Kingdom - Silent Startup
COLOR 0A

echo.
echo ================================================================
echo   TOOTH KINGDOM ADVENTURE - BACKGROUND AUTO-START
echo ================================================================
echo.
echo [1/3] Starting Backend and Frontend in background...
echo       (No terminal windows will stay open)
echo.

wscript.exe "//nologo" "LAUNCH_SILENT.vbs"

echo [2/3] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo [3/3] Opening browser at http://localhost:5173
echo.
echo ----------------------------------------------------------------
echo   DONE! You can now close this window.
echo   The app is running in the background.
echo   To stop everything, use: KILL_ALL_PYTHON.bat
echo ----------------------------------------------------------------
echo.
pause
