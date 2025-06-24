#!/bin/bash
sh killoldports.sh
# Colors
GREEN='\033[0;32m'
NC='\033[0m'

# Start backend.py in the background using the virtual environment
echo "Starting backend..."
start_time_backend=$(date +%s%3N)
source .venv/bin/activate
python backend/backend.py &
backend_pid=$!
deactivate
end_time_backend=$(date +%s%3N)
elapsed_backend=$((end_time_backend - start_time_backend))
echo -e "${GREEN}Backend started in ${elapsed_backend} ms (PID $backend_pid)${NC}"

# Start frontend (React) in a new terminal
echo "Starting frontend in a new terminal..."

if command -v gnome-terminal >/dev/null 2>&1; then
    gnome-terminal -- bash -c "cd frontend && npm start; exec bash"
else
    echo -e "${GREEN}gnome-terminal not found. Please install it or use another terminal.${NC}"
fi
