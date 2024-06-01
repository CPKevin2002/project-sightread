#!/bin/bash

# Function to start the frontend
start_frontend() {
  echo "Starting frontend..."
  cd frontend/
  npm start
}

# Function to start the backend
start_backend() {
  echo "Starting backend..."
  cd backend/
  python manage.py runserver
}

# Trap Ctrl+C (SIGINT) and stop both servers
trap 'echo "Stopping servers..."; kill $(jobs -p); wait; exit 0' SIGINT

# Start the frontend in the background
start_frontend &
frontend_pid=$!

# Start the backend in the background
start_backend &
backend_pid=$!

# Wait for both processes to complete
wait $frontend_pid $backend_pid
