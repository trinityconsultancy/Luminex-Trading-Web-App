#!/bin/bash

echo "===================================="
echo "  Starting Luminex Trading App"
echo "===================================="
echo ""
echo "Starting Backend Server..."

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

echo ""
echo "Starting Frontend Server..."

# Go back to root and start frontend
cd ..
pnpm dev &
FRONTEND_PID=$!

echo ""
echo "===================================="
echo "  Both servers are running!"
echo "===================================="
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "All servers stopped."
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT TERM

# Wait for processes
wait
