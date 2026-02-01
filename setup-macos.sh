#!/bin/bash

# BankNifty Trading Agent - Auto Setup Script for macOS
# Run this script to automatically create all files and start the app

set -e

echo "================================================"
echo "BankNifty Trading Agent - Auto Setup"
echo "================================================"

# Create project directory
PROJECT_DIR="$HOME/Desktop/banknifty-trading"
mkdir -p "$PROJECT_DIR/src/app/trading"
mkdir -p "$PROJECT_DIR/src/lib/trading"

echo "Creating project files..."

# Create package.json
cat > "$PROJECT_DIR/package.json" << 'EOF'
{
  "name": "banknifty-trading",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
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
EOF

# Create tsconfig.json
cat > "$PROJECT_DIR/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# Create next.config.ts
cat > "$PROJECT_DIR/next.config.ts" << 'EOF'
import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
EOF

# Create postcss.config.mjs
cat > "$PROJECT_DIR/postcss.config.mjs" << 'EOF'
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
EOF

# Create .gitignore
cat > "$PROJECT_DIR/.gitignore" << 'EOF'
node_modules
.next
.env
.env.local
*.log
.DS_Store
EOF

# Create src/app/layout.tsx
cat > "$PROJECT_DIR/src/app/layout.tsx" << 'EOF'
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "BankNifty Trading Agent" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
EOF

# Create src/app/globals.css
cat > "$PROJECT_DIR/src/app/globals.css" << 'EOF'
@import "tailwindcss";
:root { --background: #111827; --foreground: #f9fafb; }
body { background-color: var(--background); color: var(--foreground); }
EOF

# Create src/app/page.tsx
cat > "$PROJECT_DIR/src/app/page.tsx" << 'EOF'
import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 text-center">
      <h1 className="text-4xl font-bold text-emerald-400 mb-4">BankNifty Trading Agent</h1>
      <p className="text-xl text-gray-400 mb-8">Automated trading with multi-strategy analysis</p>
      <Link href="/trading" className="inline-block px-8 py-4 bg-emerald-600 rounded-lg font-bold">
        Open Trading Dashboard →
      </Link>
    </div>
  );
}
EOF

# Create src/app/trading/page.tsx
cat > "$PROJECT_DIR/src/app/trading/page.tsx" << 'EOF'
"use client";
import { useState, useEffect } from "react";

function getBankNiftyQuote() {
  const price = 52000 + (Math.random() - 0.5) * 1000;
  return {
    symbol: "BANKNIFTY",
    lastPrice: price,
    changePercent: ((price - 52000) / 52000) * 100,
  };
}

export default function TradingDashboard() {
  const [quote, setQuote] = useState<any>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [orderQuantity, setOrderQuantity] = useState(25);

  useEffect(() => {
    const update = () => {
      const q = getBankNiftyQuote();
      setQuote(q);
      setPriceHistory(prev => [...prev.slice(-50), q.lastPrice]);
    };
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePlaceOrder = () => {
    alert(`Order: ${orderType} ${orderQuantity} lots @ ₹${quote?.lastPrice.toFixed(2)}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-400">🇮🇳 BankNifty Trading Agent</h1>
        <p className="text-gray-400 mt-2">Automated trading - Demo Mode</p>
      </header>
      
      {quote && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">BankNifty</div>
            <div className="text-xl font-bold">₹{quote.lastPrice.toFixed(2)}</div>
            <div className={`text-sm ${quote.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}>
              {quote.changePercent >= 0 ? "▲" : "▼"} {Math.abs(quote.changePercent).toFixed(2)}%
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Portfolio Value</div>
            <div className="text-xl font-bold">₹100,000</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Cash Balance</div>
            <div className="text-xl font-bold">₹100,000</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Positions</div>
            <div className="text-xl font-bold">0</div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Trade</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button onClick={() => setOrderType("BUY")} className={`py-3 rounded-lg font-bold ${orderType === "BUY" ? "bg-green-600" : "bg-gray-700"}`}>BUY</button>
            <button onClick={() => setOrderType("SELL")} className={`py-3 rounded-lg font-bold ${orderType === "SELL" ? "bg-red-600" : "bg-gray-700"}`}>SELL</button>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Quantity (lots)</label>
            <input type="number" value={orderQuantity} onChange={(e) => setOrderQuantity(Number(e.target.value))} className="w-full bg-gray-700 rounded-lg px-4 py-3" />
          </div>
          <button onClick={handlePlaceOrder} className="w-full py-4 bg-emerald-600 rounded-lg font-bold">Place {orderType} Order</button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Price Chart</h3>
          <div className="h-64 bg-gray-900 rounded-lg flex items-end justify-between p-4 gap-1">
            {priceHistory.map((price, i) => {
              const min = Math.min(...priceHistory);
              const max = Math.max(...priceHistory);
              const h = ((price - min) / (max - min)) * 100;
              return <div key={i} className="flex-1 bg-emerald-500 rounded-t" style={{ height: `${Math.max(h, 5)}%` }} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo "Files created successfully!"
echo ""
echo "================================================"
echo "Installing Bun..."
echo "================================================"

# Install Bun
if ! command -v bun &> /dev/null; then
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
else
    echo "Bun is already installed"
fi

echo ""
echo "================================================"
echo "Installing dependencies..."
echo "================================================"

cd "$PROJECT_DIR"
bun install

echo ""
echo "================================================"
echo "Starting development server..."
echo "================================================"
echo ""
echo "Please open your browser to: http://localhost:3000/trading"
echo ""
echo "To stop the server, press Ctrl+C"
echo ""

bun dev
