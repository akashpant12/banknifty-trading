// Angel One API Configuration
// Add your credentials here

export const angelOneConfig = {
  // API Key from Angel One SmartAPI portal
  apiKey: 'Wb15v0Wq',
  
  // Secret key for TOTP generation (optional - for programmatic trading)
  secretKey: '085beeda-13c1-4433-bced-ba0b3db4ee32',
  
  // Your Angel One client ID (username)
  username: 'YOUR_CLIENT_ID',
  
  // Your Angel One account password
  password: 'YOUR_PASSWORD',
  
  // TOTP from authenticator app (Google Auth/Authy)
  totp: '530971', // 6-digit code from Google Authenticator
  
  // Toggle between live and paper trading
  usePaperTrading: true,
};

// How to get TOTP:
// 1. Install Google Authenticator app on your phone
// 2. Go to Angel One App > SmartAPI > Generate TOTP
// 3. Scan QR code with Google Authenticator
// 4. Use the 6-digit code generated

// For programmatic TOTP generation (optional):
// npm install totp-generator
// import { generateTOTP } from 'totp-generator';
// const totp = generateTOTP('YOUR_SECRET_KEY');
