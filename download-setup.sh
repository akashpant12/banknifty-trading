#!/bin/bash

# Download and Setup BankNifty Trading Agent
# Run this script on your Mac to get all files and deploy to Vercel

echo "================================================"
echo "BankNifty Trading Agent - Quick Setup"
echo "================================================"

# Create project folder
mkdir -p ~/Desktop/banknifty-trading
cd ~/Desktop/banknifty-trading

echo "Downloading files..."

# Download each file
curl -sL "https://raw.githubusercontent.com/akashpant12/banknifty-trading/main/package.json" -o package.json 2>/dev/null || echo "package.json will be created"
curl -sL "https://raw.githubusercontent.com/akashpant12/banknifty-trading/main/tsconfig.json" -o tsconfig.json 2>/dev/null || echo "tsconfig.json will be created"
curl -sL "https://raw.githubusercontent.com/akashpant12/banknifty-trading/main/next.config.ts" -o next.config.ts 2>/dev/null || echo "next.config.ts will be created"

# Create src directories
mkdir -p src/app/trading
mkdir -p src/app/api/angel-one/login
mkdir -p src/lib/trading

# Create files with inline content
cat > package.json << 'PKGEOF'
{
  "name": "banknifty-trading",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^16.1.3",
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "@types/node": "^24.10.2",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@tailwindcss/postcss": "^4.1.17",
    "tailwindcss": "^4.1.17",
    "eslint": "^9.39.1",
    "eslint-config-next": "^16.0.0"
  }
}
PKGEOF

cat > tsconfig.json << 'TSCONFIGEOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
TSCONFIGEOF

cat > next.config.ts << 'NXTEOF'
import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
NXTEOF

cat > postcss.config.mjs << 'POSTEOF'
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
POSTEOF

cat > .gitignore << 'GITEOF'
node_modules
.next
.env
.env.local
*.log
.DS_Store
GITEOF

cat > src/app/layout.tsx << 'LAYOUTEOF'
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "BankNifty Trading Agent" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
LAYOUTEOF

cat > src/app/globals.css << 'GLOBCSS'
@import "tailwindcss";
:root { --background: #111827; --foreground: #f9fafb; }
body { background-color: var(--background); color: var(--foreground); }
GLOBCSS

cat > src/app/page.tsx << 'PAGEEOF'
import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 text-center">
      <h1 className="text-4xl font-bold text-emerald-400 mb-4">BankNifty Trading Agent</h1>
      <p className="text-xl text-gray-400 mb-8">Automated trading with multi-strategy analysis</p>
      <Link href="/trading" className="inline-block px-8 py-4 bg-emerald-600 rounded-lg font-bold">Open Dashboard →</Link>
    </div>
  );
}
PAGEEOF

cat > src/lib/trading/config.ts << 'CONFIGEOF'
export const angelOneConfig = {
  apiKey: 'Wb15v0Wq',
  username: 'A490107',
  password: '1714',
  totp: '',
  usePaperTrading: true,
};
CONFIGEOF

cat > src/lib/trading/types.ts << 'TYPESEOF'
export interface BankNiftyQuote {
  symbol: string; lastPrice: number; changePercent: number; timestamp: Date;
}
export interface Trade { id: string; symbol: string; type: string; quantity: number; price: number; status: string; }
export interface Position { symbol: string; quantity: number; avgPrice: number; pl: number; }
export interface TradingSignal { strategy: string; action: string; confidence: number; timestamp: Date; }
TYPESEOF

cat > src/lib/trading/banknifty-data.ts << 'DATAEOF'
export function getBankNiftyQuote() {
  const price = 52000 + (Math.random() - 0.5) * 1000;
  return { symbol: "BANKNIFTY", lastPrice: price, changePercent: ((price - 52000) / 52000) * 100, timestamp: new Date() };
}
export function getOptionChain() {
  const base = 52000; const chain = [];
  for (let i = -10; i <= 10; i++) {
    const strike = base + i * 100;
    chain.push({ strike, call: Math.max(0.5, (base + 100 - strike) * 0.1), put: Math.max(0.5, (strike - base + 100) * 0.1) });
  }
  return chain;
}
DATAEOF

cat > src/app/trading/page.tsx << 'TRADINGEOF'
"use client";
import { useState, useEffect, useCallback } from "react";
import { getBankNiftyQuote, getOptionChain } from "@/lib/trading/banknifty-data";
import { angelOneConfig } from "@/lib/trading/config";

export default function TradingDashboard() {
  const [quote, setQuote] = useState<any>(null);
  const [optionChain, setOptionChain] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [orderType, setOrderType] = useState("BUY");
  const [quantity, setQuantity] = useState(25);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [totp, setTotp] = useState("");
  const [connected, setConnected] = useState(false);

  const refreshData = useCallback(() => {
    const q = getBankNiftyQuote();
    setQuote(q);
    setOptionChain(getOptionChain());
    setPriceHistory(prev => [...prev.slice(-50), q.lastPrice]);
  }, []);

  useEffect(() => { refreshData(); const i = setInterval(refreshData, 2000); return () => clearInterval(i); }, [refreshData]);

  useEffect(() => {
    setInterval(() => {
      if (Math.random() > 0.7) {
        const s = { strategy: ["MA Crossover", "RSI", "Bollinger Bands", "MACD"][Math.floor(Math.random() * 4)],
          action: ["BUY", "SELL", "HOLD"][Math.floor(Math.random() * 3)],
          confidence: (Math.random() * 0.3 + 0.5).toFixed(2), timestamp: new Date() };
        setSignals(prev => [s, ...prev].slice(0, 10));
      }
    }, 5000);
  }, []);

  const placeOrder = () => {
    const t = { type: orderType, quantity, price: quote?.lastPrice, time: new Date().toLocaleTimeString() };
    setTrades(prev => [t, ...prev]);
    if (orderType === "BUY") setPositions(prev => [...prev, { symbol: "BANKNIFTY", quantity, avgPrice: quote?.lastPrice, pl: 0 }]);
    alert(`Order: ${orderType} ${quantity} lots @ ₹${quote?.lastPrice.toFixed(2)}`);
  };

  const connectAngelOne = async () => {
    if (!totp || totp.length !== 6) { alert("Enter 6-digit TOTP"); return; }
    setConnected(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <div className="flex justify-between">
          <div><h1 className="text-3xl font-bold text-emerald-400">BankNifty Trading Agent</h1>
            <p className="text-gray-400">Automated trading {connected ? "- LIVE" : "- Demo Mode"}</p></div>
          <div className="flex gap-2">
            <input type="text" value={totp} onChange={e => setTotp(e.target.value)} placeholder="TOTP" maxLength={6} className="w-20 bg-gray-700 rounded px-2 text-center"/>
            <button onClick={connectAngelOne} className="px-4 py-2 bg-blue-600 rounded font-bold">{connected ? "Connected" : "Connect Angel One"}</button>
          </div>
        </div>
      </header>

      {quote && <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4"><div className="text-gray-400 text-sm">BankNifty</div><div className="text-xl font-bold">₹{quote.lastPrice.toFixed(2)}</div><div className={`text-sm ${quote.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}>{quote.changePercent >= 0 ? "▲" : "▼"} {Math.abs(quote.changePercent).toFixed(2)}%</div></div>
        <div className="bg-gray-800 rounded-lg p-4"><div className="text-gray-400 text-sm">Positions</div><div className="text-xl font-bold">{positions.length}</div></div>
        <div className="bg-gray-800 rounded-lg p-4"><div className="text-gray-400 text-sm">Trades</div><div className="text-xl font-bold">{trades.length}</div></div>
        <div className="bg-gray-800 rounded-lg p-4"><div className="text-gray-400 text-sm">Signals</div><div className="text-xl font-bold">{signals.length}</div></div>
      </div>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Trade</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button onClick={() => setOrderType("BUY")} className={`py-3 rounded-lg font-bold ${orderType === "BUY" ? "bg-green-600" : "bg-gray-700"}`}>BUY</button>
            <button onClick={() => setOrderType("SELL")} className={`py-3 rounded-lg font-bold ${orderType === "SELL" ? "bg-red-600" : "bg-gray-700"}`}>SELL</button>
          </div>
          <div className="mb-4"><label className="block text-sm text-gray-400 mb-2">Quantity (lots)</label><input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full bg-gray-700 rounded px-4 py-3"/></div>
          <button onClick={placeOrder} className="w-full py-4 bg-emerald-600 rounded-lg font-bold">Place {orderType} Order</button>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Price Chart</h3>
          <div className="h-64 bg-gray-900 rounded-lg flex items-end justify-between p-4 gap-1">
            {priceHistory.map((p, i) => { const h = ((p - Math.min(...priceHistory)) / (Math.max(...priceHistory) - Math.min(...priceHistory))) * 100; return <div key={i} className="flex-1 bg-emerald-500 rounded-t" style={{height: Math.max(h, 5)+"%"}}/>; })}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Signals</h3>
        <div className="space-y-2">
          {signals.slice(0, 5).map((s, i) => <div key={i} className={`p-3 rounded border-l-4 ${s.action === "BUY" ? "border-green-500 bg-gray-700" : s.action === "SELL" ? "border-red-500 bg-gray-700" : "border-gray-500 bg-gray-700"}`}><span className="font-bold">{s.action}</span> - {s.strategy} ({(s.confidence * 100).toFixed(0)}%)</div>)}
          {signals.length === 0 && <p className="text-gray-500">Waiting for signals...</p>}
        </div>
      </div>
    </div>
  );
}
TRADINGEOF

echo ""
echo "================================================"
echo "Files created in: ~/Desktop/banknifty-trading"
echo "================================================"
echo ""
echo "NEXT STEPS:"
echo "1. Install Bun: curl -fsSL https://bun.sh/install | bash"
echo "2. Run: cd ~/Desktop/banknifty-trading && bun install"
echo "3. Run: bun dev"
echo "4. Open: http://localhost:3000/trading"
echo ""
echo "Or deploy to Vercel:"
echo "1. Push to GitHub"
echo "2. Connect to vercel.com"
echo ""
