import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Zap } from 'lucide-react';

const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState([
    {
      id: 1,
      type: 'bullish',
      title: 'ETH Bullish Signal Detected',
      description: 'Technical analysis shows strong support at $2,300 with potential upside to $2,500.',
      confidence: 85,
      timeframe: '24h',
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Volatility Alert',
      description: 'Market volatility increased by 23% in the last 4 hours. Consider risk management.',
      confidence: 92,
      timeframe: '4h',
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      id: 3,
      type: 'opportunity',
      title: 'DeFi Yield Opportunity',
      description: 'Liquidity pools showing 12.5% APY with low impermanent loss risk.',
      confidence: 78,
      timeframe: '1w',
      icon: Lightbulb,
      color: 'blue'
    },
    {
      id: 4,
      type: 'strategy',
      title: 'Portfolio Rebalancing',
      description: 'AI suggests reducing BTC allocation by 5% and increasing ETH exposure.',
      confidence: 71,
      timeframe: '1m',
      icon: Target,
      color: 'purple'
    }
  ]);

  const [aiStatus, setAiStatus] = useState('Analyzing market data...');

  useEffect(() => {
    const statusMessages = [
      'Analyzing market data...',
      'Processing sentiment analysis...',
      'Calculating risk metrics...',
      'Generating insights...',
      'AI analysis complete'
    ];

    let index = 0;
    const interval = setInterval(() => {
      setAiStatus(statusMessages[index]);
      index = (index + 1) % statusMessages.length;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-400';
      case 'yellow':
        return 'from-yellow-500/10 to-orange-500/10 border-yellow-500/20 text-yellow-400';
      case 'blue':
        return 'from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-400';
      case 'purple':
        return 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400';
      default:
        return 'from-gray-500/10 to-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Market Insights</h2>
            <p className="text-gray-400 text-sm">Powered by neural networks</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-purple-500/20 px-3 py-2 rounded-full border border-purple-500/30">
          <Zap className="w-3 h-3 text-purple-400 animate-pulse" />
          <span className="text-purple-400 text-sm font-medium">ACTIVE</span>
        </div>
      </div>

      {/* AI Status */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-purple-400 font-medium">{aiStatus}</span>
        </div>
      </div>

      {/* Market Sentiment */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
          <div className="text-green-400 font-bold text-lg">72%</div>
          <div className="text-gray-400 text-xs">Bullish</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center">
          <div className="text-yellow-400 font-bold text-lg">18%</div>
          <div className="text-gray-400 text-xs">Neutral</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
          <div className="text-red-400 font-bold text-lg">10%</div>
          <div className="text-gray-400 text-xs">Bearish</div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const colorClasses = getColorClasses(insight.color);
          
          return (
            <div
              key={insight.id}
              className={`bg-gradient-to-r ${colorClasses} border rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${colorClasses.includes('green') ? 'from-green-400 to-emerald-500' : 
                  colorClasses.includes('yellow') ? 'from-yellow-400 to-orange-500' :
                  colorClasses.includes('blue') ? 'from-blue-400 to-cyan-500' :
                  'from-purple-400 to-pink-500'} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{insight.title}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-400">{insight.timeframe}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        insight.confidence >= 80 ? 'bg-green-500/20 text-green-400' :
                        insight.confidence >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {insight.confidence}%
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {insight.description}
                  </p>
                  
                  {/* Confidence Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Confidence Level</span>
                      <span>{insight.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          insight.confidence >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                          insight.confidence >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          'bg-gradient-to-r from-red-400 to-red-500'
                        }`}
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Performance Metrics */}
      <div className="mt-6 bg-gray-900/50 rounded-2xl p-4 border border-gray-700/50">
        <h3 className="text-white font-semibold mb-4">AI Performance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-400 text-sm">Prediction Accuracy</div>
            <div className="text-green-400 font-bold text-lg">87.3%</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Signals Generated</div>
            <div className="text-cyan-400 font-bold text-lg">1,247</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Success Rate</div>
            <div className="text-purple-400 font-bold text-lg">82.1%</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Risk Score</div>
            <div className="text-yellow-400 font-bold text-lg">Medium</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;