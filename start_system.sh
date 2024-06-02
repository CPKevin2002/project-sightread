#!/bin/bash

# Function to start the frontend
start_frontend() {
  echo "Starting frontend..."
  (cd frontend && npm start) &
  frontend_pid=$!
}

# Function to start the backend
start_backend() {
  echo "Starting backend..."
  (cd backend && python manage.py runserver) &
  backend_pid=$!
}

# Function to kill the backend running on port 8000
kill_backend() {
  echo "Stopping backend..."
  backend_pid=$(lsof -t -i tcp:8000)
  if [ -n "$backend_pid" ]; then
    kill -9 $backend_pid
    echo "Backend process $backend_pid killed."
  else
    echo "No backend process found running on port 8000."
  fi
}

# Trap Ctrl+C (SIGINT) and stop both servers
trap 'echo "Stopping servers..."; kill_backend; kill $frontend_pid; wait; exit 0' SIGINT

# Start the frontend in the background
start_frontend

# Start the backend in the background
start_backend

# Wait for both processes to complete
wait $frontend_pid $backend_pid
