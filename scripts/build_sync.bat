@echo off
echo Starting Build...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Build Failed!
  exit /b %ERRORLEVEL%
)
echo Build Successful. Starting Sync...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
  echo Sync Failed!
  exit /b %ERRORLEVEL%
)
echo Done.
