// Angel One API Configuration
// Add your credentials here

export const angelOneConfig = {
  // API Key from Angel One SmartAPI portal
  apiKey: 'Wb15v0Wq',
  
  // Your Angel One client ID (username)
  username: 'A490107',
  
  // Your Angel One account password
  password: 'Akash17147714

// How to get TOTP:
// 1. Install Google Authenticator app on your phone
// 2. Go to Angel One App > SmartAPI > Generate TOTP
// 3. Scan QR code with Google Authenticator
// 4. Use the 6-digit code generated

// For programmatic TOTP generation (optional):
// npm install totp-generator
// import { generateTOTP } from 'totp-generator';
// const totp = generateTOTP('YOUR_SECRET_KEY');
,
  
  // TOTP from authenticator app (Google Auth/Authy)
  totp: '452293', // Replace with your 6-digit TOTP code
  
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
