@echo off
title Tooth Kingdom USB Bridge
color 0B

echo ======================================================
echo    TOOTH KINGDOM - USB PHONE BRIDGE (ADB)
echo ======================================================
echo.

:: 1. Try to find ADB in the standard Windows location
set "ADB_PATH=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"

if not exist "%ADB_PATH%" (
    echo [ERROR] Could not find Android SDK at: 
    echo %ADB_PATH%
    echo.
    echo Please make sure Android Studio is installed.
    pause
    exit /b
)

echo [1/2] Checking for connected devices...
"%ADB_PATH%" devices

echo.
echo [2/2] Setting up port bridge (8010 -> 8010)...
"%ADB_PATH%" reverse tcp:8010 tcp:8010

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [FAILED] Could not establish bridge. 
    echo - Is your phone connected via USB?
    echo - Is "USB Debugging" enabled in Developer Options?
) else (
    echo.
    echo [SUCCESS] USB Bridge is ACTIVE!
    echo Your phone can now talk to the backend on this PC.
    echo.
    echo IMPORTANT: Keep this window open or run it again if you 
    echo unplug the cable.
)

echo.
echo Press any key to exit.
pause > nul
