@echo off
title Training Center - Frontend (Angular)
echo ========================================================
echo Starting Training Center Frontend (Port 4200)...
echo ========================================================

:: Ensure environment variables are loaded
set "PATH=%USERPROFILE%\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.22_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v22.23.2-win-x64;%PATH%"

cd /d "%~dp0"
npm start
pause
