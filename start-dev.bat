@echo off
echo ====================================
echo   Starting Luminex Trading App
echo ====================================
echo.
echo Starting Backend Server...
start "Luminex Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server...
start "Luminex Frontend" cmd /k "pnpm dev"
echo.
echo ====================================
echo   Both servers are starting...
echo ====================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause >nul
taskkill /FI "WINDOWTITLE eq Luminex Backend" /T /F
taskkill /FI "WINDOWTITLE eq Luminex Frontend" /T /F
