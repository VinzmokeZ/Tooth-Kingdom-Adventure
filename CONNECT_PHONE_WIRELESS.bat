@echo off
TITLE Tooth Kingdom - Wireless Link Utility
COLOR 0A

set "ROOT=%~dp0"
set "ADB_PATH=C:\Users\Vinz\AppData\Local\Android\Sdk\platform-tools\adb.exe"
set "IP_CACHE=%ROOT%.phone_ip_cache"

echo.
echo ========================================================
echo    TOOTH KINGDOM - WIRELESS PHONE LINK (v1.0)
echo ========================================================
echo.

:: Step 1: Get PC LAN IP
echo [1/4] Detecting PC LAN IP...
for /f "tokens=*" %%i in ('python "%ROOT%scripts\get_lan_ip.py"') do set PC_IP=%%i
echo   PC IP: %PC_IP%
echo.

:: Step 2: Get Phone IP
if exist "%IP_CACHE%" (
    set /p PHONE_IP=<"%IP_CACHE%"
)

if "%PHONE_IP%"=="" (
    echo [2/4] First time setup: Please enter your phone's IP address.
    echo   (Find this in: Settings ^> Wi-Fi ^> [Your Network] ^> IP Address)
    set /p PHONE_IP="  Phone IP: "
) else (
    echo [2/4] Using saved Phone IP: %PHONE_IP%
    echo   (To change, delete the file .phone_ip_cache)
)
echo %PHONE_IP%> "%IP_CACHE%"
echo.

:: Step 3: Connect via ADB
echo [3/4] Connecting to Phone wirelessly...
"%ADB_PATH%" disconnect >nul 2>&1
"%ADB_PATH%" connect %PHONE_IP%

:: Check if connection succeeded
"%ADB_PATH%" devices | findstr /i "%PHONE_IP%" >nul
if errorlevel 1 (
    echo.
    echo ❌ [ERROR] Could not connect to %PHONE_IP%.
    echo   Please ensure:
    echo   1. Your phone and PC are on the SAME Wi-Fi.
    echo   2. Wireless Debugging is ENABLED in Developer Options.
    echo   3. If this is the first time, you might need to connect via USB once
    echo      and run: adb tcpip 5555
    echo.
    pause
    exit /b
)
echo   [OK] Connected successfully!
echo.

:: Step 4: Sync IP with App
echo [4/4] Syncing Backend IP with Tooth Kingdom App...
echo   Sending: toothkingdom://set-ip?ip=%PC_IP%
"%ADB_PATH%" shell am start -a android.intent.action.VIEW -d "toothkingdom://set-ip?ip=%PC_IP%" >nul 2>&1

echo.
echo ========================================================
echo    ✨ SUCCESS! Wireless Link Active.
echo    Your phone app is now pointing to: %PC_IP%:8010
echo ========================================================
echo.
echo [Tip] You can now start the backend normally.
echo.
pause
