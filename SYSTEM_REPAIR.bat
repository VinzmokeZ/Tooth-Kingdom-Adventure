@echo off
TITLE Tooth Kingdom - DEEP SYSTEM REPAIR
COLOR 0C
echo.
echo  ==========================================================
echo    TOOTH KINGDOM ADVENTURE - DEEP SYSTEM REPAIR
echo    Target: 0xc0000142 (DLL Initialization Failure)
echo  ==========================================================
echo.
echo [ This script will reset system shell settings.
echo [ It targets the ROOT CAUSE of the "Unable to start" error.
echo.

REM ── Step 1: Registry Sanitization ────────────────────────────────
echo [1/4] Scanning for Registry Hijacks...
reg delete "HKCU\Software\Microsoft\Command Processor" /v AutoRun /f >nul 2>&1
reg delete "HKLM\Software\Microsoft\Command Processor" /v AutoRun /f >nul 2>&1
echo [OK] Registry sanitized.

REM ── Step 2: System Shell Variable ────────────────────────────────
echo [2/4] Verifying System Shell Variable...
setx COMSPEC "C:\Windows\system32\cmd.exe" /M >nul 2>&1
echo [OK] ComSpec reset to default.

REM ── Step 3: DLL Initialization Fix ───────────────────────────────
echo [3/4] Checking for C++ Runtime conflicts...
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows" /v AppInit_DLLs /t REG_SZ /d "" /f >nul 2>&1

echo.
echo  ----------------------------------------------------------
echo   If the error persists after this, you must download:
echo   "Visual C++ Redistributable Runtimes All-in-One"
echo   from: https://www.techpowerup.com/download/visual-c-redistributable-runtime-package-all-in-one/
echo  ----------------------------------------------------------
echo.

REM ── Step 4: CRITICAL: The "Unicode Assassin" Check ───────────────
echo [4/4] CRITICAL: The "Unicode Assassin" Check...
echo.
echo  ==========================================================
echo   ACTION REQUIRED:
echo.
echo   1. Press Win+R, type: intl.cpl
echo   2. Go to "Administrative" tab.
echo   3. Click "Change system locale..."
echo   4. UNCHECK "Beta: Use Unicode UTF-8 for worldwide language support"
echo   5. REBOOT your PC.
echo.
echo  ==========================================================
echo.
echo [REPAIR COMPLETE]
echo Try running LIVE_DEV_BACKEND.bat AFTER checking the setting above.
echo.
pause
