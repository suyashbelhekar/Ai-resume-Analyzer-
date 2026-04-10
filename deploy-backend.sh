#!/bin/bash

# AI Resume Analyzer - Backend Docker Deployment Script

echo "🚀 Starting AI Resume Analyzer Backend Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Build backend Docker image
echo "📦 Building backend Docker image..."
docker build -t ai-resume-analyzer-backend ./backend

if [ $? -eq 0 ]; then
    echo "✅ Backend image built successfully!"
else
    echo "❌ Failed to build backend image"
    exit 1
fi

# Stop existing container if running
echo "🔄 Stopping existing container (if any)..."
docker stop ai-resume-analyzer-backend 2>/dev/null
docker rm ai-resume-analyzer-backend 2>/dev/null

# Run backend container
echo "🚀 Starting backend container..."
docker run -d \
    --name ai-resume-analyzer-backend \
    -p 8000:8000 \
    --env-file .env.docker \
    --restart unless-stopped \
    ai-resume-analyzer-backend

if [ $? -eq 0 ]; then
    echo "✅ Backend deployed successfully!"
    echo ""
    echo "📍 Access URLs:"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs:   http://localhost:8000/docs"
    echo ""
    echo "🔍 Check status: docker logs ai-resume-analyzer-backend"
    echo "🛑 Stop: docker stop ai-resume-analyzer-backend"
else
    echo "❌ Failed to start backend container"
    exit 1
fi
