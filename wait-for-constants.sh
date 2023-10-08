#!/bin/sh

node generateConstants.js

# Wait for the generateConstants.js script to finish (e.g., until a specific file exists)
while [ ! -f constants.js ]; do
  sleep 1
done

# Start the main application (index.js)
node index.js
