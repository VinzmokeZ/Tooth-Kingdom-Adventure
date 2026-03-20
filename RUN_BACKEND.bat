@echo off
title [BACKEND] TOOTH KINGDOM
echo [1/2] Clearing ghost servers and bridging USB...

:: Kill ghost on 8010
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8010') do taskkill /f /pid %%a >nul 2>&1

:: Bridge USB
set ADB_PATH="%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"
%ADB_PATH% reverse tcp:8010 tcp:8010 >nul 2>&1

echo [2/2] Starting Python Backend...
cd backend\python
python -u main.py
pause
