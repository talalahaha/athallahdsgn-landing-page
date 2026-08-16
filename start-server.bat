@echo off
title athallahDsgn — Fullstack Server (Landing Page & Database)
echo ============================================================
echo   athallahDsgn — Studio Digital Product & UI/UX Design
echo   Starting Local Server with SQLite Database Backend...
echo ============================================================
echo.
echo   [+] URL Website: http://localhost:8000
echo   [+] URL Admin CRM: http://localhost:8000/admin.html
echo   [+] Database: database/athallahdsgn.sqlite
echo.
echo Tekan Ctrl+C di terminal ini untuk mematikan server.
echo ============================================================
echo.

start http://localhost:8000

REM Try global php first, fallback to XAMPP php if not in PATH
where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    php -S localhost:8000
) else if exist "C:\xampp\php\php.exe" (
    "C:\xampp\php\php.exe" -S localhost:8000
) else (
    echo [ERROR] PHP tidak ditemukan! Pastikan XAMPP terinstall di C:\xampp
    pause
)
