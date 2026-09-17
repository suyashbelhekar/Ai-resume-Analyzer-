#!/bin/bash
echo "Starting AI Resume Skill Gap Analyzer..."

# Start Backend
(cd backend && python main.py) &
BACKEND_PID=$!

# Start Frontend
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo "Backend running on http://localhost:8000 (PID: $BACKEND_PID)"
echo "Frontend running on http://localhost:5173 (PID: $FRONTEND_PID)"

# Trap Ctrl+C to stop both
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
wait
