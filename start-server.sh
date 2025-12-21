#!/bin/bash

# Start local development server for FinceLearn app
echo "🚀 Starting FinceLearn development server..."
echo "📍 Server will run at: http://localhost:8000"
echo "🌐 Open http://localhost:8000 in your browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Python HTTP server
python3 -m http.server 8000
