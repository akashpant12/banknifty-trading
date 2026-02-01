// BankNifty Trading Agent - Order Management System

import { Trade, Position, PortfolioSummary } from './types';

export class OrderManager {
  private trades: Trade[] = [];
  private positions: Map<string, Position> = new Map();
  private cashBalance: number = 100000; // Starting capital
  private orders: Trade[] = [];

  constructor(initialCapital: number = 100000) {
    this.cashBalance = initialCapital;
  }

  placeOrder(
    symbol: string,
    type: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    strategy?: string
  ): Trade {
    const order: Trade = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      type,
      quantity,
      price,
      timestamp: new Date(),
      status: 'PENDING',
      strategy,
    };

    this.orders.push(order);
    return order;
  }

  executeOrder(orderId: string): boolean {
    const orderIndex = this.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return false;

    const order = this.orders[orderIndex];
    const orderCost = order.price * order.quantity;

    if (order.type === 'BUY') {
      if (orderCost > this.cashBalance) {
        order.status = 'FAILED';
        return false;
      }
      this.cashBalance -= orderCost;

      // Update or create position
      const existingPosition = this.positions.get(order.symbol);
      if (existingPosition) {
        const totalQty = existingPosition.quantity + order.quantity;
        const avgPrice = (existingPosition.averagePrice * existingPosition.quantity + order.price * order.quantity) / totalQty;
        existingPosition.quantity = totalQty;
        existingPosition.averagePrice = avgPrice;
      } else {
        this.positions.set(order.symbol, {
          symbol: order.symbol,
          quantity: order.quantity,
          averagePrice: order.price,
          currentPrice: order.price,
          type: 'LONG',
          unrealizedPL: 0,
          realizedPL: 0,
        });
      }
    } else {
      // SELL order
      const position = this.positions.get(order.symbol);
      if (!position || position.quantity < order.quantity) {
        order.status = 'FAILED';
        return false;
      }

      const profit = (order.price - position.averagePrice) * order.quantity;
      position.realizedPL += profit;
      this.cashBalance += orderCost;
      position.quantity -= order.quantity;

      if (position.quantity === 0) {
        this.positions.delete(order.symbol);
      }
    }

    order.status = 'EXECUTED';
    this.trades.push({ ...order });
    return true;
  }

  cancelOrder(orderId: string): boolean {
    const order = this.orders.find(o => o.id === orderId);
    if (!order || order.status !== 'PENDING') return false;

    order.status = 'CANCELLED';
    return true;
  }

  updatePositions(currentPrice: number): void {
    this.positions.forEach((position, symbol) => {
      if (symbol === 'BANKNIFTY') {
        position.currentPrice = currentPrice;
        position.unrealizedPL = (currentPrice - position.averagePrice) * position.quantity;
      }
    });
  }

  getPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  getTrades(): Trade[] {
    return this.trades;
  }

  getPendingOrders(): Trade[] {
    return this.orders.filter(o => o.status === 'PENDING');
  }

  getPortfolioSummary(currentPrice: number): PortfolioSummary {
    this.updatePositions(currentPrice);
    const positions = this.getPositions();
    const totalUnrealizedPL = positions.reduce((sum, p) => sum + p.unrealizedPL, 0);
    const totalRealizedPL = positions.reduce((sum, p) => sum + p.realizedPL, 0);
    const positionsValue = positions.reduce((sum, p) => sum + p.quantity * p.currentPrice, 0);

    return {
      totalValue: this.cashBalance + positionsValue,
      cashBalance: this.cashBalance,
      unrealizedPL: totalUnrealizedPL,
      realizedPL: totalRealizedPL,
      dayPL: totalUnrealizedPL + totalRealizedPL,
      marginAvailable: this.cashBalance * 5, // 5x margin for BankNifty
    };
  }

  reset(): void {
    this.trades = [];
    this.positions.clear();
    this.orders = [];
    this.cashBalance = 100000;
  }
}

export const orderManager = new OrderManager();
