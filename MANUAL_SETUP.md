# Manual Setup - Copy All Code

Since you can't download the code, I'll provide step-by-step instructions to create all files on your Mac.

## Step 1: Create Project Folder

1. Open **Finder**
2. Click on **Desktop**
3. Right-click > **New Folder**
4. Name it: `banknifty-trading`

## Step 2: Create Each File

### File 1: package.json
Open **TextEdit** (or any text editor) and create a file named `package.json` with this content:

```json
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
```

Save it in: `~/Desktop/banknifty-trading/package.json`

### File 2: tsconfig.json
Create `tsconfig.json`:

```json
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
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Save it in: `~/Desktop/banknifty-trading/tsconfig.json`

### File 3: next.config.ts
Create `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

Save it in: `~/Desktop/banknifty-trading/next.config.ts`

### File 4: postcss.config.mjs
Create `postcss.config.mjs`:

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

Save it in: `~/Desktop/banknifty-trading/postcss.config.mjs`

### File 5: .gitignore
Create `.gitignore`:

```
node_modules
.next
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.log
npm-debug.log*
.DS_Store
```

Save it in: `~/Desktop/banknifty-trading/.gitignore`

### File 6: src/app/layout.tsx
Create folder `src` > `app` > `layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BankNifty Trading Agent",
  description: "Automated trading for BankNifty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

### File 7: src/app/globals.css
Create `globals.css`:

```css
@import "tailwindcss";

:root {
  --background: #111827;
  --foreground: #f9fafb;
}

body {
  background-color: var(--background);
  color: var(--foreground);
}
```

### File 8: src/app/page.tsx
Create `page.tsx`:

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-emerald-400">
          BankNifty Trading Agent
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Automated trading with multi-strategy analysis
        </p>
        <Link
          href="/trading"
          className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-lg"
        >
          Open Trading Dashboard →
        </Link>
      </main>
    </div>
  );
}
```

### File 9: src/lib/trading/types.ts
Create folder `src/lib/trading` > `types.ts`:

```typescript
export interface BankNiftyQuote {
  symbol: string;
  lastPrice: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  bid: number;
  ask: number;
  timestamp: Date;
  change: number;
  changePercent: number;
}

export interface Trade {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  timestamp: Date;
  status: "PENDING" | "EXECUTED" | "CANCELLED" | "FAILED";
  strategy?: string;
  profitLoss?: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  type: "LONG" | "SHORT";
  unrealizedPL: number;
  realizedPL: number;
}

export interface TradingSignal {
  strategy: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  target?: number;
  stopLoss?: number;
  timestamp: Date;
}

export interface PortfolioSummary {
  totalValue: number;
  cashBalance: number;
  unrealizedPL: number;
  realizedPL: number;
  dayPL: number;
  marginAvailable: number;
}
```

### File 10: src/lib/trading/banknifty-data.ts
Create `banknifty-data.ts`:

```typescript
const BANK_NIFTY_BASE_PRICE = 52000;

function generateRandomPrice(base: number, volatility: number = 0.02): number {
  const change = (Math.random() - 0.5) * 2 * volatility * base;
  return Number((base + change).toFixed(2));
}

export function getBankNiftyQuote() {
  const price = generateRandomPrice(BANK_NIFTY_BASE_PRICE, 0.015);
  const prevClose = BANK_NIFTY_BASE_PRICE;
  const change = price - prevClose;
  const changePercent = (change / prevClose) * 100;

  return {
    symbol: "BANKNIFTY",
    lastPrice: price,
    previousClose: prevClose,
    open: generateRandomPrice(prevClose, 0.01),
    high: price * 1.01,
    low: price * 0.99,
    volume: Math.floor(Math.random() * 50000000) + 10000000,
    bid: price - 0.5,
    ask: price + 0.5,
    timestamp: new Date(),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
  };
}

export function getOptionChain() {
  const quote = getBankNiftyQuote();
  const basePrice = Math.round(quote.lastPrice / 100) * 100;
  const strikes = 10;
  const chain = [];

  for (let i = -strikes; i <= strikes; i++) {
    const strikePrice = basePrice + i * 100;
    const callBase = Math.max(0.5, (basePrice + 100 - strikePrice) * 0.1);
    const putBase = Math.max(0.5, (strikePrice - basePrice + 100) * 0.1);

    chain.push({
      strikePrice,
      call: {
        bid: generateRandomPrice(callBase, 0.1),
        ask: generateRandomPrice(callBase * 1.05, 0.1),
        volume: Math.floor(Math.random() * 1000000) + 100000,
        openInterest: Math.floor(Math.random() * 5000000) + 500000,
      },
      put: {
        bid: generateRandomPrice(putBase, 0.1),
        ask: generateRandomPrice(putBase * 1.05, 0.1),
        volume: Math.floor(Math.random() * 1000000) + 100000,
        openInterest: Math.floor(Math.random() * 5000000) + 500000,
      },
    });
  }
  return chain;
}
```

### File 11: src/lib/trading/config.ts
Create `config.ts`:

```typescript
export const angelOneConfig = {
  apiKey: "Wb15v0Wq",
  username: "A490107",
  password: "1714",
  totp: "", // You'll enter this in the UI
  usePaperTrading: true,
};
```

### File 12: src/app/trading/page.tsx
Create folder `src/app/trading` > `page.tsx`:

```tsx
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
  const [portfolio, setPortfolio] = useState<any>(null);
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [orderQuantity, setOrderQuantity] = useState(25);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [useLiveData, setUseLiveData] = useState(false);
  const [totpInput, setTotpInput] = useState("");

  const refreshData = useCallback(() => {
    const newQuote = getBankNiftyQuote();
    setQuote(newQuote);
    setOptionChain(getOptionChain());
    setPriceHistory((prev) => {
      const updated = [...prev, newQuote.lastPrice];
      return updated.slice(-50);
    });
    setPortfolio({
      totalValue: 100000,
      cashBalance: 100000,
      unrealizedPL: 0,
      realizedPL: 0,
      dayPL: 0,
      marginAvailable: 500000,
    });
    setPositions([]);
    setTrades([]);
    setSignals([]);
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const handlePlaceOrder = () => {
    alert(`Order placed: ${orderType} ${orderQuantity} lots at ₹${quote?.lastPrice}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">
              🇮🇳 BankNifty Trading Agent
            </h1>
            <p className="text-gray-400 mt-2">
              Automated trading with multi-strategy analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={totpInput}
              onChange={(e) => setTotpInput(e.target.value)}
              placeholder="TOTP"
              maxLength={6}
              className="w-20 bg-gray-700 rounded px-2 py-1 text-center"
            />
            <button className="px-3 py-1 bg-blue-600 rounded text-sm">
              Connect
            </button>
          </div>
        </div>
      </header>

      {quote && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">BankNifty</div>
            <div className="text-xl font-bold">{quote.lastPrice.toFixed(2)}</div>
            <div
              className={`text-sm ${
                quote.changePercent >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {quote.changePercent >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(quote.changePercent).toFixed(2)}%
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Portfolio Value</div>
            <div className="text-xl font-bold">
              ₹{portfolio?.totalValue.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Cash Balance</div>
            <div className="text-xl font-bold">
              ₹{portfolio?.cashBalance.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Positions</div>
            <div className="text-xl font-bold">{positions.length}</div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Trade</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => setOrderType("BUY")}
              className={`py-3 rounded-lg font-bold ${
                orderType === "BUY"
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              BUY
            </button>
            <button
              onClick={() => setOrderType("SELL")}
              className={`py-3 rounded-lg font-bold ${
                orderType === "SELL"
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              SELL
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Quantity (lots)
            </label>
            <input
              type="number"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(Number(e.target.value))}
              className="w-full bg-gray-700 rounded-lg px-4 py-3"
            />
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full py-4 bg-emerald-600 rounded-lg font-bold"
          >
            Place {orderType} Order
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Price Movement</h3>
          <div className="h-64 bg-gray-900 rounded-lg flex items-end justify-between p-4 gap-1">
            {priceHistory.map((price, i) => {
              const minPrice = Math.min(...priceHistory);
              const maxPrice = Math.max(...priceHistory);
              const height =
                ((price - minPrice) / (maxPrice - minPrice)) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-emerald-500 rounded-t"
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          ⚠️ Demo mode - Configure Angel One credentials for live trading
        </p>
      </div>
    </div>
  );
}
```

## Step 3: Run the Application

1. Open **Terminal**
2. Type these commands:

```bash
cd ~/Desktop/banknifty-trading
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"
bun install
bun dev
```

3. Open browser: **http://localhost:3000/trading**

---

This is a simplified version that will work with simulated data. Let me know if you need help with any step!