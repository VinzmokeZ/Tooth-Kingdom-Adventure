@echo off
TITLE Tooth Kingdom - Live DB Viewer
COLOR 0A
set PYTHONUNBUFFERED=1
echo Waiting 8 seconds for backend to start...
timeout /t 8 /nobreak >nul
echo Starting Live Database Viewer...
cd /d "%~dp0backend\python"
python -u db_viewer.py
echo.
echo DB Viewer stopped.
pause
