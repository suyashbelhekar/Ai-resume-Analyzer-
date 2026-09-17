@echo off
echo ========================================================
echo   AI Resume Skill Gap Analyzer - Fullstack Launcher
echo ========================================================
echo.
echo Starting Backend in a new window (http://localhost:8000)...
start "AI Resume Backend (FastAPI)" cmd /k "cd /d %~dp0backend && python main.py"

echo Starting Frontend in a new window (http://localhost:5173)...
start "AI Resume Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are launching!
echo App will be available at: http://localhost:5173
echo API & Docs at:           http://localhost:8000/docs
echo ========================================================
