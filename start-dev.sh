#!/bin/bash

# Simple dev runner: start backend and frontend together

# Navigate to project root if needed
cd "$(dirname "$0")"

# Start server and client using tmux

# Check if tmux is installed
if ! command -v tmux &> /dev/null
then
  echo "⚠️ concurrently not found, running in separate terminals"
  echo "👉 Open two terminals:"
  echo "Terminal 1: cd server && npm run start:dev"
  echo "Terminal 2: cd client && npm run start"
fi


# Start tmux session
SESSION_NAME="dev"

tmux new-session -d -s $SESSION_NAME 'cd server && npm run start:dev'
tmux split-window -v 'cd client && npm run start'
tmux select-layout even-vertical
tmux attach -t $SESSION_NAME
