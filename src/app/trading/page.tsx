'use client';

import { useState, useEffect, useCallback } from 'react';
import { BankNiftyQuote, Trade, Position, TradingSignal, PortfolioSummary } from '@/lib/trading/types';
import { getBankNiftyQuote, getOptionChain } from '@/lib/trading/banknifty-data';
import { StrategyEngine } from '@/lib/trading/strategy-engine';
import { OrderManager } from '@/lib/trading/order-manager';

const strategyEngine = new StrategyEngine();
const orderManager = new OrderManager();

type Tab = 'overview' | 'trade' | 'positions' | 'signals' | 'options';

export default function TradingDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [quote, setQuote] = useState<BankNiftyQuote | null>(null);
  const [optionChain, setOptionChain] = useState<any[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderQuantity, setOrderQuantity] = useState(25);
  const [isAutoTrading, setIsAutoTrading] = useState(false);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  const refreshData = useCallback(() => {
    const newQuote = getBankNiftyQuote();
    setQuote(newQuote);
    setOptionChain(getOptionChain());

    // Update price history
    setPriceHistory(prev => {
      const updated = [...prev, newQuote.lastPrice];
      return updated.slice(-50);
    });

    // Update portfolio
    const summary = orderManager.getPortfolioSummary(newQuote.lastPrice);
    setPortfolio(summary);
    setPositions(orderManager.getPositions());
    setTrades(orderManager.getTrades());
    setSignals(strategyEngine.getSignals());
  }, []);

  // Initial data load - using useLayoutEffect for immediate sync update
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshData();
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Auto-trading effect
  useEffect(() => {
    if (!isAutoTrading || !quote) return;

    const signal = strategyEngine.analyzeCombined(quote);
    if (signal && signal.action !== 'HOLD' && signal.confidence > 0.6) {
      const order = orderManager.placeOrder(
        'BANKNIFTY',
        signal.action,
        orderQuantity,
        quote.lastPrice,
        signal.strategy
      );

      // Auto-execute order
      setTimeout(() => {
        orderManager.executeOrder(order.id);
        refreshData();
      }, 500);
    }
  }, [isAutoTrading, quote, orderQuantity, refreshData]);

  const handlePlaceOrder = () => {
    if (!quote) return;

    const order = orderManager.placeOrder('BANKNIFTY', orderType, orderQuantity, quote.lastPrice, 'Manual');
    orderManager.executeOrder(order.id);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-400">🇮🇳 BankNifty Trading Agent</h1>
        <p className="text-gray-400 mt-2">Automated trading with multi-strategy analysis</p>
      </header>

      {/* Quick Stats */}
      {quote && portfolio && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            label="BankNifty"
            value={quote.lastPrice.toFixed(2)}
            change={quote.changePercent}
            subValue={`Vol: ${(quote.volume / 1000000).toFixed(1)}M`}
          />
          <StatCard
            label="Portfolio Value"
            value={`₹${portfolio.totalValue.toLocaleString()}`}
            change={((portfolio.dayPL / portfolio.totalValue) * 100)}
            subValue={`P/L: ₹${portfolio.dayPL.toFixed(0)}`}
          />
          <StatCard
            label="Cash Balance"
            value={`₹${portfolio.cashBalance.toLocaleString()}`}
            subValue={`Margin: ₹${portfolio.marginAvailable.toLocaleString()}`}
          />
          <StatCard
            label="Positions"
            value={positions.length.toString()}
            subValue={`Unrealized: ₹${portfolio.unrealizedPL.toFixed(0)}`}
          />
          <StatCard
            label="Total Trades"
            value={trades.length.toString()}
            subValue={`Realized P/L: ₹${portfolio.realizedPL.toFixed(0)}`}
          />
          <StatCard
            label="Active Signals"
            value={signals.filter(s => s.action !== 'HOLD').length.toString()}
            subValue={`Auto: ${isAutoTrading ? 'ON' : 'OFF'}`}
          />
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['overview', 'trade', 'positions', 'signals', 'options'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gray-800 rounded-xl p-6 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Price Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Price Movement</h3>
              <div className="h-64 bg-gray-900 rounded-lg flex items-end justify-between p-4 gap-1">
                {priceHistory.map((price, i) => {
                  const minPrice = Math.min(...priceHistory);
                  const maxPrice = Math.max(...priceHistory);
                  const height = ((price - minPrice) / (maxPrice - minPrice)) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-emerald-500 rounded-t"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={`₹${price}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Entry</span>
                <span className="text-emerald-400">Current: ₹{quote?.lastPrice.toFixed(2)}</span>
                <span>Now</span>
              </div>
            </div>

            {/* Quick Trade Panel */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Trade</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrderType('BUY')}
                    className={`py-3 rounded-lg font-bold text-lg transition-all ${
                      orderType === 'BUY'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => setOrderType('SELL')}
                    className={`py-3 rounded-lg font-bold text-lg transition-all ${
                      orderType === 'SELL'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    SELL
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Quantity (lots)</label>
                  <input
                    type="number"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white text-lg"
                    min="1"
                    max="100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Total: ₹{(orderQuantity * 25 * (quote?.lastPrice || 0)).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-lg transition-all"
                >
                  Place {orderType} Order
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trade' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Place Order</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Order Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderType('BUY')}
                    className={`py-3 rounded-lg font-bold ${
                      orderType === 'BUY' ? 'bg-green-600' : 'bg-gray-700'
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => setOrderType('SELL')}
                    className={`py-3 rounded-lg font-bold ${
                      orderType === 'SELL' ? 'bg-red-600' : 'bg-gray-700'
                    }`}
                  >
                    SELL
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Quantity (lots)</label>
                <input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Order Value</label>
                <div className="bg-gray-700 rounded-lg px-4 py-3 text-xl font-bold text-emerald-400">
                  ₹{(orderQuantity * 25 * (quote?.lastPrice || 0)).toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-lg"
            >
              Execute {orderType} Order
            </button>

            {/* Recent Trades */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Recent Trades</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {trades.slice(-10).reverse().map((trade) => (
                  <div
                    key={trade.id}
                    className="flex justify-between items-center bg-gray-700 rounded-lg px-4 py-3"
                  >
                    <div>
                      <span className={`font-bold ${trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.type}
                      </span>
                      <span className="ml-2">{trade.quantity} lots @ ₹{trade.price.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${trade.profitLoss && trade.profitLoss > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.profitLoss ? `₹${trade.profitLoss.toFixed(0)}` : '-'}
                      </div>
                      <div className="text-xs text-gray-500">{trade.status}</div>
                    </div>
                  </div>
                ))}
                {trades.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No trades yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Open Positions</h3>
            <div className="space-y-4">
              {positions.map((pos, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg">{pos.symbol}</h4>
                      <p className="text-gray-400">
                        {pos.quantity} lots @ ₹{pos.averagePrice.toFixed(2)} | Current: ₹{pos.currentPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${pos.unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pos.unrealizedPL >= 0 ? '+' : ''}₹{pos.unrealizedPL.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-400">Unrealized P/L</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="px-4 py-1 bg-green-600 rounded text-sm">Square Off</button>
                    <button className="px-4 py-1 bg-gray-600 rounded text-sm">Add</button>
                  </div>
                </div>
              ))}
              {positions.length === 0 && (
                <p className="text-gray-500 text-center py-8">No open positions</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Trading Signals</h3>

            {/* Auto Trading Toggle */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Auto-Trading Mode</h4>
                  <p className="text-sm text-gray-400">Automatically execute trades based on signals</p>
                </div>
                <button
                  onClick={() => setIsAutoTrading(!isAutoTrading)}
                  className={`px-6 py-2 rounded-lg font-bold ${
                    isAutoTrading ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  {isAutoTrading ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>
            </div>

            {/* Signal List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {signals.slice(-20).reverse().map((signal, i) => (
                <div
                  key={i}
                  className={`bg-gray-700 rounded-lg p-4 border-l-4 ${
                    signal.action === 'BUY' ? 'border-green-500' : signal.action === 'SELL' ? 'border-red-500' : 'border-gray-500'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={`font-bold text-lg ${
                        signal.action === 'BUY' ? 'text-green-400' : signal.action === 'SELL' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {signal.action}
                      </span>
                      <span className="ml-2 text-gray-400">{signal.strategy}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Confidence: {(signal.confidence * 100).toFixed(0)}%</div>
                      <div className="text-xs text-gray-500">{signal.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                  {signal.target && signal.stopLoss && (
                    <div className="mt-2 text-sm text-gray-400">
                      Target: ₹{signal.target.toFixed(2)} | Stop Loss: ₹{signal.stopLoss.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
              {signals.length === 0 && (
                <p className="text-gray-500 text-center py-4">Waiting for trading signals...</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'options' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Option Chain</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-2 px-3 text-left">Strike</th>
                    <th className="py-2 px-3 text-right text-green-400">Call Bid</th>
                    <th className="py-2 px-3 text-right text-green-400">Call Ask</th>
                    <th className="py-2 px-3 text-right">Call OI</th>
                    <th className="py-2 px-3 text-center">-</th>
                    <th className="py-2 px-3 text-right text-red-400">Put OI</th>
                    <th className="py-2 px-3 text-right text-red-400">Put Bid</th>
                    <th className="py-2 px-3 text-right text-red-400">Put Ask</th>
                  </tr>
                </thead>
                <tbody>
                  {optionChain.map((opt, i) => {
                    const isATM = Math.abs(opt.strikePrice - (quote?.lastPrice || 0)) < 50;
                    return (
                      <tr
                        key={i}
                        className={`border-b border-gray-700 ${isATM ? 'bg-gray-700' : ''}`}
                      >
                        <td className="py-2 px-3 font-medium">{opt.strikePrice}</td>
                        <td className="py-2 px-3 text-right text-green-400">{opt.call.bid.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right text-green-400">{opt.call.ask.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right text-gray-400">{(opt.call.openInterest / 100000).toFixed(1)}L</td>
                        <td className="py-2 px-3 text-center text-gray-500">-</td>
                        <td className="py-2 px-3 text-right text-gray-400">{(opt.put.openInterest / 100000).toFixed(1)}L</td>
                        <td className="py-2 px-3 text-right text-red-400">{opt.put.bid.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right text-red-400">{opt.put.ask.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>⚠️ Trading involves risk. Use auto-trading responsibly.</p>
        <p>Data is simulated for demonstration. Connect broker API for live trading.</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, subValue }: { label: string; value: string; change?: number; subValue?: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
      {change !== undefined && (
        <div className={`text-sm mt-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </div>
      )}
      {subValue && <div className="text-xs text-gray-500 mt-1">{subValue}</div>}
    </div>
  );
}
