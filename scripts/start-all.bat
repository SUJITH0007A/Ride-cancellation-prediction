@echo off
echo Starting Flask API and React website...
start "ML API" cmd /k "cd /d %~dp0..\ml-service && python app.py"
timeout /t 2 /nobreak >nul
start "Website" cmd /k "cd /d %~dp0..\frontend && npm run dev"
echo.
echo API:     http://127.0.0.1:5000
echo Website: http://localhost:5173
