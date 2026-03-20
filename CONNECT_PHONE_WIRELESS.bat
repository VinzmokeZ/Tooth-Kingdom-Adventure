@echo off
setlocal enabledelayedexpansion
TITLE Tooth Kingdom Online - Wireless Link Utility
COLOR 0A

set "ROOT=%~dp0"
set "ADB_PATH=C:\Users\Vinz\AppData\Local\Android\Sdk\platform-tools\adb.exe"
set "IP_CACHE=%ROOT%.phone_ip_cache"

echo.
echo ========================================================
echo    TOOTH KINGDOM ONLINE - WIRELESS PHONE LINK (v1.0)
echo ========================================================
echo.

:: Step 1: Get PC LAN IP
echo [1/4] Detecting PC LAN IP...
for /f "tokens=*" %%i in ('python "%ROOT%scripts\get_lan_ip.py"') do set PC_IP=%%i
echo   PC IP: %PC_IP%
echo.

:: Step 2: Get Phone IP
set "PHONE_IP="
set "FOUND_GATEWAY="

:: 1. Try to Load from Cache
if exist "!IP_CACHE!" set /p PHONE_IP=<"!IP_CACHE!"

:: 2. If no cache or first run, try to Auto-Detect via USB (Smart Discovery)
echo [2/4] Searching for connected phone via USB...
:: Check if any device is connected via USB first
"!ADB_PATH!" devices | findstr /v "List" | findstr "device" >nul
if !errorlevel! EQU 0 (
    echo   ✨ USB Phone detected! Enabling Wireless Mode...
    "!ADB_PATH!" tcpip 5555 >nul 2>&1
    
    :: Try to get IP from ap0 (Hotspot)
    for /f "tokens=2" %%y in ('""!ADB_PATH!" shell ip -4 addr show ap0 2^>nul ^| findstr "inet""') do (
        set "VAL=%%y"
        for /f "tokens=1 delims=/" %%z in ("!VAL!") do set "PHONE_IP=%%z"
        echo     - Found Hotspot IP: !PHONE_IP!
    )

    :: If still no IP, try wlan0 (Wi-Fi)
    if "!PHONE_IP!"=="" (
        for /f "tokens=2" %%y in ('""!ADB_PATH!" shell ip -4 addr show wlan0 2^>nul ^| findstr "inet""') do (
            set "VAL=%%y"
            for /f "tokens=1 delims=/" %%z in ("!VAL!") do set "PHONE_IP=%%z"
            echo     - Found Wi-Fi IP: !PHONE_IP!
        )
    )
)

:: 3. Fallback: Try to Auto-Detect Hotspot Gateway from PC network
if "!PHONE_IP!"=="" (
    for /f "tokens=*" %%a in ('powershell -Command "(Get-NetRoute -DestinationPrefix '0.0.0.0/0' | Select-Object -ExpandProperty NextHop | Where-Object { $_ -match '^\d+\.\d+\.\d+\.\d+$' } | Select-Object -First 1)" 2^>nul') do set "FOUND_GATEWAY=%%a"
    if not "!FOUND_GATEWAY!"=="" (
        set "PHONE_IP=!FOUND_GATEWAY!"
        echo   ✨ Detected Mobile Hotspot Gateway: !PHONE_IP!
    )
)

:: 4. Final Fallback: Ask the user
if "!PHONE_IP!"=="" (
    echo [!] PC could not find your phone automatically.
    echo   Please enter your phone's IP address.
    set /p PHONE_IP="  Phone IP: "
) else (
    echo [OK] Using Phone IP: !PHONE_IP!
)

:: 5. Save to Cache for next time
echo !PHONE_IP!> "!IP_CACHE!"
echo.

:: Step 3: Connect via ADB
echo [3/4] Connecting to Phone wirelessly...
"%ADB_PATH%" disconnect >nul 2>&1
"%ADB_PATH%" connect !PHONE_IP!

:: If failed and we have a gateway that wasn't tried, try it as a fallback
"%ADB_PATH%" devices | findstr /i "!PHONE_IP!" >nul
if errorlevel 1 if not "!FOUND_GATEWAY!"=="" if not "!PHONE_IP!"=="!FOUND_GATEWAY!" (
    echo   [RETRY] !PHONE_IP! failed. Trying Hotspot Gateway: !FOUND_GATEWAY!...
    "%ADB_PATH%" connect !FOUND_GATEWAY!
    set "PHONE_IP=!FOUND_GATEWAY!"
    echo !PHONE_IP!> "!IP_CACHE!"
)

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
echo    ✨ SUCCESS! Wireless Link Active (Online Mode).
echo    Your phone app is now pointing to: %PC_IP%:8010
echo ========================================================
echo.
echo [Tip] You can now start the backend normally.
echo.
pause
