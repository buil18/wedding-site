@echo off
chcp 65001 >nul
cd /d "%~dp0.."
if not exist node_modules (
  echo Cai thu vien lan dau, doi mot chut...
  call npm install
)
node tools\optimize-images.js %*
echo.
pause
