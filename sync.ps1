# GitHub Sync Script
# This script stages all changes (including deletions), commits them, and pushes to GitHub.

$message = "Auto-sync: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Write-Host "Staging changes..." -ForegroundColor Cyan
git add -A

Write-Host "Checking for changes to commit..." -ForegroundColor Cyan
$status = git status --porcelain
if ($status) {
    Write-Host "Committing changes..." -ForegroundColor Cyan
    git commit -m $message
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push origin master
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Push failed. You may need to enable force pushes on GitHub or pull changes first." -ForegroundColor Red
    } else {
        Write-Host "Sync successful!" -ForegroundColor Green
    }
} else {
    Write-Host "No changes to sync." -ForegroundColor Yellow
}
