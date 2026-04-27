@echo off
title REVIVECHIZL Local Static Server

echo ==========================================
echo   REVIVECHIZL - LOCAL STATIC SERVER
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
echo Starting site at http://localhost:3000
echo Press CTRL+C to stop the server.
echo.

start http://localhost:3000
node server.js

echo.
echo Server stopped.
pause
