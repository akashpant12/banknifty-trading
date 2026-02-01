import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            BankNifty Trading Agent
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Automated trading with multi-strategy analysis for BankNifty futures & options
          </p>
          <Link
            href="/trading"
            className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-lg transition-all"
          >
            Open Trading Dashboard →
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            title="📊 Real-Time Analysis"
            description="Multi-indicator technical analysis with RSI, MACD, Moving Averages, and Bollinger Bands"
          />
          <FeatureCard
            title="⚡ Auto-Trading"
            description="Enable automated trading based on strategy signals with configurable confidence thresholds"
          />
          <FeatureCard
            title="📈 Option Chain"
            description="View live option chain data with Open Interest analysis for strikes near ATM"
          />
          <FeatureCard
            title="💰 Portfolio Tracking"
            description="Track positions, P&L, margin requirements, and overall portfolio performance"
          />
          <FeatureCard
            title="🎯 Multiple Strategies"
            description="Trend following, mean reversion, momentum, and scalping strategies available"
          />
          <FeatureCard
            title="🔧 Broker Integration"
            description="Ready for integration with Indian brokers like Zerodha, Upstox, and Angel One"
          />
        </div>

        {/* Trading Strategies */}
        <div className="bg-gray-800 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Trading Strategies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <StrategyItem
              name="MA Crossover"
              type="Trend Following"
              description="Golden cross for buy signals, death cross for sell signals"
            />
            <StrategyItem
              name="RSI"
              type="Momentum"
              description="Oversold (<30) for buy, overbought (>70) for sell"
            />
            <StrategyItem
              name="Bollinger Bands"
              type="Mean Reversion"
              description="Price bounces off bands - buy at lower band, sell at upper band"
            />
            <StrategyItem
              name="MACD"
              type="Trend Following"
              description="MACD line crossing signal line for momentum shifts"
            />
            <StrategyItem
              name="Combined"
              type="Multi-Indicator"
              description="Requires 2+ indicators to agree before generating signals"
            />
            <StrategyItem
              name="Scalping"
              type="Intraday"
              description="Quick trades during high volatility periods"
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6">
          <h3 className="font-bold text-yellow-400 mb-2">⚠️ Risk Disclaimer</h3>
          <p className="text-gray-300 text-sm">
            Trading in BankNifty futures and options involves substantial risk of loss. 
            This trading agent is for educational and demonstration purposes only. 
            Always use proper risk management and never trade with money you cannot afford to lose.
            Past performance does not guarantee future results.
          </p>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StrategyItem({ name, type, description }: { name: string; type: string; description: string }) {
  return (
    <div className="border-l-4 border-emerald-500 pl-4">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-bold">{name}</h4>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded">{type}</span>
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
