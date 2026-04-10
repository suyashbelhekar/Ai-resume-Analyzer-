@echo off
REM AI Resume Analyzer - Full Stack Docker Deployment Script for Windows

echo 🚀 Starting AI Resume Analyzer Full Stack Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

REM Build backend Docker image
echo 📦 Building backend Docker image...
docker build -t ai-resume-analyzer-backend ./backend

if %errorlevel% equ 0 (
    echo ✅ Backend image built successfully!
) else (
    echo ❌ Failed to build backend image
    pause
    exit /b 1
)

REM Stop existing containers
echo 🔄 Stopping existing containers...
docker stop ai-resume-analyzer-backend 2>nul
docker stop ai-resume-analyzer-frontend 2>nul
docker rm ai-resume-analyzer-backend 2>nul
docker rm ai-resume-analyzer-frontend 2>nul

REM Run backend container
echo 🚀 Starting backend container...
docker run -d --name ai-resume-analyzer-backend -p 8000:8000 --env-file .env.docker ai-resume-analyzer-backend

if %errorlevel% equ 0 (
    echo ✅ Backend started successfully!
) else (
    echo ❌ Failed to start backend container
    pause
    exit /b 1
)

REM Wait a moment for backend to start
timeout /t 5 >nul

REM Build frontend Docker image
echo 📦 Building frontend Docker image...
docker build -t ai-resume-analyzer-frontend ./frontend

if %errorlevel% equ 0 (
    echo ✅ Frontend image built successfully!
) else (
    echo ❌ Failed to build frontend image
    pause
    exit /b 1
)

REM Run frontend container
echo 🚀 Starting frontend container...
docker run -d --name ai-resume-analyzer-frontend -p 80:80 --link ai-resume-analyzer-backend:backend ai-resume-analyzer-frontend

if %errorlevel% equ 0 (
    echo.
    echo ✅ Full stack deployed successfully!
    echo.
    echo 📍 Access URLs:
    echo    Frontend: http://localhost:80
    echo    Backend:  http://localhost:8000
    echo    API Docs: http://localhost:8000/docs
    echo.
    echo 🔍 Check status: docker logs ai-resume-analyzer-backend
    echo 🛑 Stop all: docker stop ai-resume-analyzer-backend ai-resume-analyzer-frontend
) else (
    echo ❌ Failed to start frontend container
    pause
    exit /b 1
)

pause
