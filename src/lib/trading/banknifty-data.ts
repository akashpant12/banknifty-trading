// BankNifty Data Service - Real-time market data simulation

import { BankNiftyQuote, OptionChain } from './types';

// Simulated market data for demonstration
// In production, integrate with actual broker APIs (Zerodha, Upstox, etc.)

const BANK_NIFTY_BASE_PRICE = 52000;

function generateRandomPrice(base: number, volatility: number = 0.02): number {
  const change = (Math.random() - 0.5) * 2 * volatility * base;
  return Number((base + change).toFixed(2));
}

export function getBankNiftyQuote(): BankNiftyQuote {
  const price = generateRandomPrice(BANK_NIFTY_BASE_PRICE, 0.015);
  const prevClose = BANK_NIFTY_BASE_PRICE;
  const change = price - prevClose;
  const changePercent = (change / prevClose) * 100;

  return {
    symbol: 'BANKNIFTY',
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

export function getOptionChain(atmStrike?: number): OptionChain[] {
  const quote = getBankNiftyQuote();
  const basePrice = atmStrike || Math.round(quote.lastPrice / 100) * 100;
  const strikes = 10;

  const chain: OptionChain[] = [];

  for (let i = -strikes; i <= strikes; i++) {
    const strikePrice = basePrice + i * 100;
    const moneyness = Math.abs(i) / strikes;

    // Call price decreases as strike increases
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

export function calculateMovingAverage(prices: number[], period: number): number {
  if (prices.length < period) return prices.reduce((a, b) => a + b, 0) / prices.length;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  const changes = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = changes.map(c => Math.max(0, c));
  const losses = changes.map(c => Math.max(0, -c));

  const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export function calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
  const sma = calculateMovingAverage(prices, period);
  const slice = prices.slice(-period);
  const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
  const std = Math.sqrt(variance);

  return {
    upper: sma + stdDev * std,
    middle: sma,
    lower: sma - stdDev * std,
  };
}

export function calculateMACD(prices: number[], fast: number = 12, slow: number = 26, signal: number = 9) {
  const emaFast = calculateEMA(prices, fast);
  const emaSlow = calculateEMA(prices, slow);
  const macdLine = emaFast - emaSlow;

  const macdHist = prices.slice(-signal).reduce((sum, _, i) => {
    const histValue = emaFast - emaSlow;
    return sum + histValue;
  }, 0) / signal;

  return {
    macd: macdLine,
    signal: macdLine - macdHist,
    histogram: macdHist,
  };
}

function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) {
    return calculateMovingAverage(prices, prices.length);
  }

  const k = 2 / (period + 1);
  let ema = calculateMovingAverage(prices.slice(0, period), period);

  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }

  return ema;
}
