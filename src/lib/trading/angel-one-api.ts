// Angel One Smart API Integration Service
// Documentation: https://smartapi.angelbroking.com/

import { BankNiftyQuote, Trade, Position, PortfolioSummary } from './types';

export interface AngelOneConfig {
  apiKey: string;
  username: string;
  password: string;
  totp: string; // TOTP from authenticator app
}

export interface AngelOneSession {
  jwtToken: string;
  refreshToken: string;
  feedToken: string;
  userProfile: any;
}

export class AngelOneAPI {
  private config: AngelOneConfig | null = null;
  private session: AngelOneSession | null = null;
  private baseUrl = 'https://apidev.angelbroking.com';
  private orderBaseUrl = 'https://api.angelbroking.com';
  
  constructor(config?: AngelOneConfig) {
    if (config) {
      this.config = config;
    }
  }

  // Configure API credentials
  configure(config: AngelOneConfig): void {
    this.config = config;
  }

  // Generate session using TOTP
  async generateSession(): Promise<AngelOneSession | null> {
    if (!this.config) {
      throw new Error('API credentials not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/gtt/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ApiKey': this.config.apiKey,
        },
        body: JSON.stringify({
          clientcode: this.config.username,
          password: this.config.password,
          totp: this.config.totp,
        }),
      });

      const data = await response.json();
      
      if (data.status === 'OK' && data.data) {
        this.session = {
          jwtToken: data.data.jwtToken,
          refreshToken: data.data.refreshToken,
          feedToken: data.data.feedToken,
          userProfile: data.data.profile,
        };
        return this.session;
      }
      
      throw new Error(data.message || 'Login failed');
    } catch (error) {
      console.error('Angel One login error:', error);
      return null;
    }
  }

  // Get API headers
  private getHeaders(): Record<string, string> {
    if (!this.session) {
      throw new Error('Not authenticated');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.session.jwtToken}`,
      'X-ApiKey': this.config!.apiKey,
      'X-ClientCode': this.config!.username,
    };
  }

  // Get live quote for BankNifty
  async getQuote(symbol: string = 'BANKNIFTY'): Promise<BankNiftyQuote | null> {
    try {
      const response = fetch(`${this.orderBaseUrl}/v1/quote`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          exchange: 'NSE',
          tradingsymbol: symbol,
          symboltoken: '9999', // BankNifty token
        }),
      });

      const data = await (await response).json();
      
      if (data.status) {
        return {
          symbol: data.data.tradingsymbol,
          lastPrice: parseFloat(data.data.ltp),
          previousClose: parseFloat(data.data.prefclose),
          open: parseFloat(data.data.open),
          high: parseFloat(data.data.high),
          low: parseFloat(data.data.low),
          volume: parseInt(data.data.volume),
          bid: parseFloat(data.data.bidprice),
          ask: parseFloat(data.data.askprice),
          timestamp: new Date(),
          change: parseFloat(data.data.change),
          changePercent: (parseFloat(data.data.change) / parseFloat(data.data.prefclose)) * 100,
        };
      }
      return null;
    } catch (error) {
      console.error('Get quote error:', error);
      return null;
    }
  }

  // Place order
  async placeOrder(
    symbol: string,
    type: 'BUY' | 'SELL',
    quantity: number,
    productType: 'DELIVERY' | 'INTRADAY' | 'MARGIN' = 'INTRADAY',
    orderType: 'MARKET' | 'LIMIT' = 'MARKET',
    price?: number
  ): Promise<Trade | null> {
    try {
      const response = await fetch(`${this.orderBaseUrl}/v1/order/place`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          exchange: 'NSE',
          tradingsymbol: symbol,
          quantity: quantity * 25, // Convert lots to shares
          producttype: productType,
          ordertype: type === 'BUY' ? 'BUY' : 'SELL',
          price: price || 0,
          variety: 'NORMAL',
          duration: 'DAY',
        }),
      });

      const data = await response.json();
      
      if (data.status) {
        return {
          id: data.data.orderid,
          symbol,
          type,
          quantity,
          price: price || 0,
          timestamp: new Date(),
          status: 'PENDING',
        };
      }
      return null;
    } catch (error) {
      console.error('Place order error:', error);
      return null;
    }
  }

  // Get positions
  async getPositions(): Promise<Position[]> {
    try {
      const response = await fetch(`${this.orderBaseUrl}/v1/position`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      
      if (data.status && data.data) {
        return data.data.map((pos: any) => ({
          symbol: pos.tradingsymbol,
          quantity: Math.abs(pos.quantity),
          averagePrice: pos.averageprice,
          currentPrice: pos.ltp,
          type: pos.quantity > 0 ? 'LONG' : 'SHORT',
          unrealizedPL: pos.unrealizedprofit,
          realizedPL: pos.realizedprofit,
        }));
      }
      return [];
    } catch (error) {
      console.error('Get positions error:', error);
      return [];
    }
  }

  // Get portfolio summary
  async getPortfolio(): Promise<PortfolioSummary | null> {
    try {
      const response = await fetch(`${this.orderBaseUrl}/v1/portfolio`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      
      if (data.status && data.data) {
        return {
          totalValue: data.data.totalvalue,
          cashBalance: data.data.netavailable,
          unrealizedPL: data.data.unrealizedpnl,
          realizedPL: data.data.realizedpnl,
          dayPL: data.data.dayspgl,
          marginAvailable: data.data.availablemargin,
        };
      }
      return null;
    } catch (error) {
      console.error('Get portfolio error:', error);
      return null;
    }
  }

  // Get option chain
  async getOptionChain(strikePrice?: number): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/optionchain`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          exchange: 'NSE',
          symboltoken: '9999',
          strikeprice: strikePrice,
        }),
      });

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Get option chain error:', error);
      return [];
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/v1/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      this.session = null;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

export const angelOneAPI = new AngelOneAPI();

// Usage Example:
// const api = new AngelOneAPI({
//   apiKey: 'YOUR_API_KEY',
//   username: 'YOUR_USERNAME',
//   password: 'YOUR_PASSWORD',
//   totp: '123456', // From authenticator app
// });
// 
// await api.generateSession();
// const quote = await api.getQuote('BANKNIFTY');
// const order = await api.placeOrder('BANKNIFTY', 'BUY', 1, 'INTRADAY', 'MARKET');
