#!/bin/bash

echo "================================================"
echo "BankNifty Trading Agent - Local Setup Script"
echo "================================================"
echo ""

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
else
    echo "✅ Bun is installed"
fi

echo ""
echo "📦 Installing dependencies..."
bun install

echo ""
echo "🚀 Starting the trading dashboard..."
echo "   Open your browser to: http://localhost:3000/trading"
echo ""
echo "To stop the server, press Ctrl+C"
echo ""

# Start the dev server
bun dev
