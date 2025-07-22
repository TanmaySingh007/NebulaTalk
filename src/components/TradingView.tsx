import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Zap, DollarSign } from 'lucide-react';

const TradingView: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [marketData, setMarketData] = useState([
    { symbol: 'ETH/USD', price: '2,340.50', change: '+5.2%', positive: true, volume: '1.2B' },
    { symbol: 'BTC/USD', price: '52,840.30', change: '+2.1%', positive: true, volume: '890M' },
    { symbol: 'ADA/USD', price: '0.4521', change: '-1.8%', positive: false, volume: '234M' },
    { symbol: 'SOL/USD', price: '98.76', change: '+8.4%', positive: true, volume: '456M' },
    { symbol: 'MATIC/USD', price: '0.8234', change: '+3.7%', positive: true, volume: '123M' },
    { symbol: 'AVAX/USD', price: '34.21', change: '-2.3%', positive: false, volume: '89M' },
  ]);

  const timeframes = ['1H', '4H', '1D', '1W', '1M'];

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(item => ({
        ...item,
        price: (parseFloat(item.price.replace(',', '')) * (0.995 + Math.random() * 0.01)).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: item.symbol.includes('USD') && !item.symbol.includes('BTC') ? 4 : 2
        })
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Live Market Data</h2>
            <p className="text-gray-400 text-sm">Real-time cryptocurrency prices</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-full border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">LIVE</span>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex space-x-2 mb-6">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setSelectedTimeframe(timeframe)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              selectedTimeframe === timeframe
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Market Cap</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">$2.1T</div>
          <div className="text-green-400 text-sm">+4.2% (24h)</div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">24h Volume</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">$89.4B</div>
          <div className="text-blue-400 text-sm">+12.8% (24h)</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">BTC Dominance</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">52.3%</div>
          <div className="text-purple-400 text-sm">-0.8% (24h)</div>
        </div>
      </div>

      {/* Price Table */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="p-4 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold text-white">Top Cryptocurrencies</h3>
        </div>
        
        <div className="divide-y divide-gray-700/50">
          {marketData.map((coin, index) => (
            <div key={coin.symbol} className="p-4 hover:bg-gray-800/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {coin.symbol.split('/')[0].slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{coin.symbol}</div>
                    <div className="text-gray-400 text-sm">Vol: {coin.volume}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-semibold text-lg">
                    ${coin.price}
                  </div>
                  <div className={`text-sm flex items-center space-x-1 justify-end ${
                    coin.positive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {coin.positive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{coin.change}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="mt-6 bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">ETH/USD Chart</h3>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">+5.2% (24h)</span>
          </div>
        </div>
        
        {/* Simulated Chart */}
        <div className="h-64 bg-gradient-to-t from-cyan-500/5 to-purple-500/5 rounded-xl flex items-end justify-center space-x-1 p-4">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-cyan-400 to-purple-500 rounded-t opacity-70"
              style={{
                height: `${20 + Math.random() * 80}%`,
                width: '3px',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingView;