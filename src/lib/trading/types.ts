// BankNifty Trading Agent - Types

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

export interface OptionChain {
  strikePrice: number;
  call: {
    bid: number;
    ask: number;
    volume: number;
    openInterest: number;
  };
  put: {
    bid: number;
    ask: number;
    volume: number;
    openInterest: number;
  };
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: Date;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'FAILED';
  strategy?: string;
  profitLoss?: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  type: 'LONG' | 'SHORT';
  unrealizedPL: number;
  realizedPL: number;
}

export interface StrategyConfig {
  name: string;
  type: 'TREND_FOLLOWING' | 'MEAN_REVERSION' | 'MOMENTUM' | 'BREAKOUT';
  parameters: Record<string, number>;
  active: boolean;
}

export interface TradingSignal {
  strategy: string;
  action: 'BUY' | 'SELL' | 'HOLD';
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
