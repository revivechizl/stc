@echo off
title REVIVECHIZL Local API Server

echo ==========================================
echo   REVIVECHIZL - LOCAL API SERVER
echo ==========================================
echo.

where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed.
    pause
    exit /b
)

IF NOT EXIST node_modules (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting Node server at http://localhost:3000
echo API endpoint: http://localhost:3000/api/latest-video
echo Press CTRL+C to stop the server.
echo.

start http://localhost:3000
node server.js

echo.
echo Server stopped.
pause
