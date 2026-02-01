# BankNifty Trading Agent - Local Setup Guide

## Problem
The cloud sandbox environment cannot access Angel One API due to network restrictions. You need to run this on your local machine.

## Solution - Option 1: Automated Script (Recommended)

### For Windows (PowerShell):
1. Copy the `run-locally.sh` file to your computer
2. Install WSL (Windows Subsystem for Linux) or Git Bash
3. Run: `bash run-locally.sh`

### For macOS/Linux:
1. Open Terminal
2. Run: `bash run-locally.sh`

## Solution - Option 2: Manual Setup

### Step 1: Install Bun
Visit https://bun.sh and follow the installation instructions, or run:
```bash
curl -fsSL https://bun.sh/install | bash
```

### Step 2: Download the Code
```bash
git clone <your-repository-url>
cd <repository-folder>
```

### Step 3: Install Dependencies
```bash
bun install
```

### Step 4: Start the Server
```bash
bun dev
```

### Step 5: Open in Browser
Navigate to: http://localhost:3000/trading

## How to Connect Angel One

1. **Set up TOTP**:
   - Open Angel One App
   - Go to SmartAPI section
   - Generate TOTP QR code
   - Scan with Google Authenticator on your phone

2. **In the trading dashboard**:
   - Look for the TOTP input box in the top-right
   - Enter the 6-digit code from Google Authenticator
   - Click "Connect"
   - Status should change to "🟢 Live - Angel One Connected"

## Your Saved Credentials
- API Key: `Wb15v0Wq`
- Client ID: `A490107`
- Password: `1714`

## Troubleshooting

### "Could not resolve host" error
This means your computer can't reach Angel One's servers. Check your internet connection.

### "Invalid TOTP" error
The TOTP code expires every 30 seconds. Make sure you're using the current code.

### Port 3000 already in use
Run: `bun dev --port 3001`

## Features Working (Demo Mode)
Even without Angel One connection, the dashboard works with simulated data:
- ✅ Real-time price updates (simulated)
- ✅ Technical analysis strategies
- ✅ Order management (local only)
- ✅ Portfolio tracking (local only)
- ✅ Option chain view (simulated)

## For Live Trading
You need:
1. Active Angel One Demat account
2. SmartAPI access enabled
3. Google Authenticator linked
4. Running locally (not in sandbox)
