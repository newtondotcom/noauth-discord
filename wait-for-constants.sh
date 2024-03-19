#!/bin/sh
sleep 2

node scripts/generateConstants.js

# Wait for the generateConstants.js script to finish (e.g., until a specific file exists)
while [ ! -f constants.js ]; do
  sleep 1
done

node deploy-commands.js
sleep 2

# Start the main application (index.js)
bun dev