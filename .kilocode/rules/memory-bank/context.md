# Active Context: BankNifty Trading Agent

## Current State

**Project Status**: ✅ BankNifty Trading Agent Complete

A fully functional trading dashboard for BankNifty futures and options with multiple technical analysis strategies and auto-trading capability.

## Recently Completed

- [x] BankNifty trading dashboard UI with real-time data
- [x] Multi-strategy analysis engine (MA Crossover, RSI, Bollinger Bands, MACD)
- [x] Order management system with position tracking
- [x] Portfolio P&L tracking and margin calculations
- [x] Auto-trading mode with configurable signals
- [x] Option chain display with Open Interest data
- [x] Trading signals history with confidence levels

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/lib/trading/types.ts` | TypeScript interfaces | ✅ Complete |
| `src/lib/trading/banknifty-data.ts` | Market data service | ✅ Complete |
| `src/lib/trading/strategy-engine.ts` | Technical analysis | ✅ Complete |
| `src/lib/trading/order-manager.ts` | Order & position management | ✅ Complete |
| `src/app/trading/page.tsx` | Trading dashboard UI | ✅ Complete |
| `src/app/page.tsx` | Landing page | ✅ Complete |

## Trading Strategies

| Strategy | Type | Description |
|----------|------|-------------|
| MA Crossover | Trend Following | Golden cross/Death cross signals |
| RSI | Momentum | Oversold/Overbought conditions |
| Bollinger Bands | Mean Reversion | Price bounce off bands |
| MACD | Trend Following | MACD/Signal line crossover |
| Combined | Multi-Indicator | 2+ indicators must agree |
| Scalping | Intraday | Quick trades during volatility |

## Quick Start Guide

### Run the Trading Dashboard

```bash
bun dev
# Open http://localhost:3000/trading
```

### Features

1. **Real-time Data**: Prices update every 2 seconds
2. **Quick Trade**: Buy/Sell with quantity selection
3. **Auto-Trading**: Enable to automatically execute trades based on signals
4. **Option Chain**: View strikes, premiums, and OI
5. **Portfolio**: Track positions, P&L, and margin

### Configuration

- Auto-trading requires 60%+ confidence threshold
- Default quantity: 25 lots (BankNifty lot size)
- Starting capital: ₹100,000

## Next Steps

1. Integrate with broker API (Zerodha, Upstox, Angel One)
2. Add paper trading mode
3. Add strategy backtesting
4. Add risk management rules (max loss, daily limits)
5. Add notifications (Telegram, SMS)

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| Today | BankNifty Trading Agent with strategies, orders, portfolio tracking |
