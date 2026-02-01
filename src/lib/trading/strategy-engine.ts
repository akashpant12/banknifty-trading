// BankNifty Trading Strategy Engine

import { BankNiftyQuote, TradingSignal } from './types';
import { calculateMovingAverage, calculateRSI, calculateBollingerBands, calculateMACD } from './banknifty-data';

export class StrategyEngine {
  private priceHistory: number[] = [];
  private signals: TradingSignal[] = [];

  addPrice(price: number): void {
    this.priceHistory.push(price);
    if (this.priceHistory.length > 200) {
      this.priceHistory.shift();
    }
  }

  getSignals(): TradingSignal[] {
    return this.signals.slice(-50);
  }

  // Moving Average Crossover Strategy
  analyzeMAcrossover(quote: BankNiftyQuote, shortPeriod: number = 5, longPeriod: number = 20): TradingSignal | null {
    this.addPrice(quote.lastPrice);

    if (this.priceHistory.length < longPeriod) {
      return null;
    }

    const shortMA = calculateMovingAverage(this.priceHistory, shortPeriod);
    const longMA = calculateMovingAverage(this.priceHistory, longPeriod);

    const prevShortMA = calculateMovingAverage(this.priceHistory.slice(0, -1), shortPeriod);
    const prevLongMA = calculateMovingAverage(this.priceHistory.slice(0, -1), longPeriod);

    const goldenCross = prevShortMA <= prevLongMA && shortMA > longMA;
    const deathCross = prevShortMA >= prevLongMA && shortMA < longMA;

    if (goldenCross) {
      return this.createSignal('MA Crossover', 'BUY', 0.75, shortMA * 0.98, shortMA * 1.02);
    }

    if (deathCross) {
      return this.createSignal('MA Crossover', 'SELL', 0.75, shortMA * 1.02, shortMA * 0.98);
    }

    return null;
  }

  // RSI Strategy
  analyzeRSI(quote: BankNiftyQuote, period: number = 14, oversold: number = 30, overbought: number = 70): TradingSignal | null {
    this.addPrice(quote.lastPrice);

    if (this.priceHistory.length < period + 1) {
      return null;
    }

    const rsi = calculateRSI(this.priceHistory, period);

    if (rsi <= oversold) {
      return this.createSignal('RSI Oversold', 'BUY', (30 - rsi) / 30, quote.lastPrice * 0.98, quote.lastPrice * 1.03);
    }

    if (rsi >= overbought) {
      return this.createSignal('RSI Overbought', 'SELL', (rsi - 70) / 30, quote.lastPrice * 1.02, quote.lastPrice * 0.97);
    }

    return null;
  }

  // Bollinger Band Strategy
  analyzeBollingerBands(quote: BankNiftyQuote, period: number = 20): TradingSignal | null {
    this.addPrice(quote.lastPrice);

    if (this.priceHistory.length < period) {
      return null;
    }

    const bands = calculateBollingerBands(this.priceHistory, period);

    if (quote.lastPrice <= bands.lower * 1.005) {
      return this.createSignal('Bollinger Bounce', 'BUY', 0.7, bands.middle, bands.upper);
    }

    if (quote.lastPrice >= bands.upper * 0.995) {
      return this.createSignal('Bollinger Bounce', 'SELL', 0.7, bands.middle, bands.lower);
    }

    return null;
  }

  // MACD Strategy
  analyzeMACD(quote: BankNiftyQuote): TradingSignal | null {
    this.addPrice(quote.lastPrice);

    if (this.priceHistory.length < 35) {
      return null;
    }

    const { macd, signal } = calculateMACD(this.priceHistory);

    const prevMacd = calculateMACD(this.priceHistory.slice(0, -1)).macd;
    const prevSignal = calculateMACD(this.priceHistory.slice(0, -1)).signal;

    const bullishCrossover = prevMacd <= prevSignal && macd > signal;
    const bearishCrossover = prevMacd >= prevSignal && macd < signal;

    if (bullishCrossover) {
      return this.createSignal('MACD Bullish', 'BUY', 0.65, signal, signal * 1.02);
    }

    if (bearishCrossover) {
      return this.createSignal('MACD Bearish', 'SELL', 0.65, signal, signal * 0.98);
    }

    return null;
  }

  // Combined Strategy - Multiple indicators
  analyzeCombined(quote: BankNiftyQuote): TradingSignal | null {
    const signals: TradingSignal[] = [];

    const maSignal = this.analyzeMAcrossover(quote);
    const rsiSignal = this.analyzeRSI(quote);
    const bbSignal = this.analyzeBollingerBands(quote);
    const macdSignal = this.analyzeMACD(quote);

    if (maSignal) signals.push(maSignal);
    if (rsiSignal) signals.push(rsiSignal);
    if (bbSignal) signals.push(bbSignal);
    if (macdSignal) signals.push(macdSignal);

    // Count buy and sell signals
    const buySignals = signals.filter(s => s.action === 'BUY');
    const sellSignals = signals.filter(s => s.action === 'SELL');

    // Require at least 2 agreeing signals
    if (buySignals.length >= 2) {
      const avgConfidence = buySignals.reduce((sum, s) => sum + s.confidence, 0) / buySignals.length;
      return this.createSignal('Combined (Multi)', 'BUY', avgConfidence, quote.lastPrice * 0.98, quote.lastPrice * 1.04);
    }

    if (sellSignals.length >= 2) {
      const avgConfidence = sellSignals.reduce((sum, s) => sum + s.confidence, 0) / sellSignals.length;
      return this.createSignal('Combined (Multi)', 'SELL', avgConfidence, quote.lastPrice * 1.02, quote.lastPrice * 0.96);
    }

    return null;
  }

  // Intraday Scalping Strategy
  analyzeScalping(quote: BankNiftyQuote): TradingSignal | null {
    this.addPrice(quote.lastPrice);

    if (this.priceHistory.length < 10) {
      return null;
    }

    const shortMA = calculateMovingAverage(this.priceHistory, 5);
    const priceChange = (quote.lastPrice - quote.open) / quote.open;

    // Scalping during high volatility
    if (Math.abs(priceChange) > 0.002) {
      if (priceChange > 0 && quote.lastPrice > shortMA) {
        return this.createSignal('Scalping', 'BUY', 0.55, quote.lastPrice, quote.lastPrice + 20);
      }
      if (priceChange < 0 && quote.lastPrice < shortMA) {
        return this.createSignal('Scalping', 'SELL', 0.55, quote.lastPrice, quote.lastPrice - 20);
      }
    }

    return null;
  }

  private createSignal(
    strategy: string,
    action: 'BUY' | 'SELL' | 'HOLD',
    confidence: number,
    stopLoss?: number,
    target?: number
  ): TradingSignal {
    const signal: TradingSignal = {
      strategy,
      action,
      confidence: Math.min(confidence, 1),
      timestamp: new Date(),
    };

    if (stopLoss) signal.stopLoss = stopLoss;
    if (target) signal.target = target;

    this.signals.push(signal);
    return signal;
  }
}

export const strategyEngine = new StrategyEngine();
