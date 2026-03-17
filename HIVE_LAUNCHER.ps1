# Tooth Kingdom Adventure - HIVE Launcher v3.0
# PowerShell replacement for unstable .bat files
# Fixes: 0xc0000142, Errno 10048, and Zombie Processes

$Host.UI.RawUI.WindowTitle = "Tooth Kingdom Adventure - HIVE TERMINAL"
Clear-Host

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   TOOTH KINGDOM ADVENTURE - HIVE LAUNCHER v3.0 (STABLE)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Port Scrubber
Write-Host "[1/3] Scrubbing Ports (8010, 5173, 3000)..." -ForegroundColor Yellow
$ports = @(8010, 5173, 3000)
foreach ($port in $ports) {
    $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
    if ($proc) {
        Write-Host "  -> Killing zombie process on port $port (PID: $proc)"
        Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "  [OK] Ports clear." -ForegroundColor Green
Write-Host ""

# 2. Environment Setup
$ROOT = Get-Location
$BACKEND = "$ROOT\backend\python"
$env:PYTHONUNBUFFERED = "1"

Write-Host "[2/3] Initializing System Engine..." -ForegroundColor Yellow
Write-Host "  Backend: $BACKEND"
Write-Host "  Frontend: $ROOT"
Write-Host ""

# 3. Dual-Service Launch
Write-Host "[3/3] Launching CORE services..." -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  BROWSER   : http://localhost:5173"
Write-Host "  BACKEND   : http://127.0.0.1:8010"
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  ALL LOGS (VITE + PYTHON) WILL APPEAR BELOW IN REAL-TIME"
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

try {
    # Start Backend and Frontend concurrently using PowerShell job control
    npx concurrently -n "VITE,BACKEND" -c "cyan,green" "npm run dev -- --host --open" "cd $BACKEND; python -u main.py"
}
catch {
    Write-Host ""
    Write-Host "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Red
    Write-Host "   CRITICAL ERROR DETECTED" -ForegroundColor Red
    Write-Host "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor White
    Write-Host ""
}
finally {
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host "   PROCESS STOPPED / WINDOW PERSISTING FOR DEBUG" -ForegroundColor Cyan
    Write-Host "   Press any key to close this terminal..." -ForegroundColor Yellow
    Write-Host "================================================================" -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
