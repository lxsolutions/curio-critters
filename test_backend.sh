

#!/bin/bash

# Test backend server
cd /workspace/curio-critters/src/backend

# Kill any existing node processes
pkill -9 node || true

# Start the server in the background
PORT=56458 npm start > backend.log 2>&1 &

# Wait a moment for the server to start
sleep 3

# Check if the server is running
if curl --silent http://localhost:56458/api/health | grep -q '"status":"ok"'; then
  echo "✅ Backend server is running on port 56458"
  echo "Health check response:"
  curl http://localhost:56458/api/health

  # Test a few endpoints
  echo ""
  echo "Testing /api endpoint:"
  curl http://localhost:56458/api

else
  echo "❌ Backend server failed to start"
  echo "Last 10 lines of backend.log:"
  tail -n 10 backend.log
fi

# Clean up
pkill -9 node || true

