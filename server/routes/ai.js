const express = require('express');
const router = express.Router();

// AI insights cache
let aiInsightsCache = {
  data: null,
  lastUpdated: null,
  ttl: 300000 // 5 minutes
};

// Get AI market insights
router.get('/insights', async (req, res) => {
  try {
    const now = Date.now();
    
    // Check cache
    if (aiInsightsCache.data && 
        aiInsightsCache.lastUpdated && 
        (now - aiInsightsCache.lastUpdated) < aiInsightsCache.ttl) {
      return res.json({
        success: true,
        data: aiInsightsCache.data,
        cached: true,
        lastUpdated: aiInsightsCache.lastUpdated
      });
    }

    // Generate AI insights
    const insights = generateAIInsights();
    
    // Update cache
    aiInsightsCache.data = insights;
    aiInsightsCache.lastUpdated = now;

    res.json({
      success: true,
      data: insights,
      cached: false,
      lastUpdated: now
    });
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({
      error: 'Failed to generate AI insights',
      message: error.message
    });
  }
});

// Get trading signals
router.get('/signals', async (req, res) => {
  try {
    const { symbol, timeframe = '1h' } = req.query;
    
    const signals = generateTradingSignals(symbol, timeframe);
    
    res.json({
      success: true,
      data: signals,
      symbol,
      timeframe,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trading signals error:', error);
    res.status(500).json({
      error: 'Failed to generate trading signals',
      message: error.message
    });
  }
});

// Portfolio analysis
router.post('/portfolio/analyze', async (req, res) => {
  try {
    const { holdings, riskTolerance = 'medium' } = req.body;
    
    if (!holdings || !Array.isArray(holdings)) {
      return res.status(400).json({
        error: 'Holdings array is required'
      });
    }

    const analysis = analyzePortfolio(holdings, riskTolerance);
    
    res.json({
      success: true,
      data: analysis,
      riskTolerance,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Portfolio analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze portfolio',
      message: error.message
    });
  }
});

// Risk assessment
router.post('/risk/assess', async (req, res) => {
  try {
    const { portfolio, marketConditions } = req.body;
    
    const riskAssessment = assessRisk(portfolio, marketConditions);
    
    res.json({
      success: true,
      data: riskAssessment,
      assessedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Risk assessment error:', error);
    res.status(500).json({
      error: 'Failed to assess risk',
      message: error.message
    });
  }
});

// AI chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }

    const response = generateAIResponse(message, context);
    
    res.json({
      success: true,
      response,
      sessionId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      error: 'Failed to generate AI response',
      message: error.message
    });
  }
});

// Sentiment analysis
router.post('/sentiment', async (req, res) => {
  try {
    const { text, source = 'user' } = req.body;
    
    const sentiment = analyzeSentiment(text);
    
    res.json({
      success: true,
      data: sentiment,
      source,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze sentiment',
      message: error.message
    });
  }
});

// Utility functions for AI processing
function generateAIInsights() {
  const insights = [
    {
      id: 1,
      type: 'bullish',
      title: 'ETH Bullish Momentum Detected',
      description: 'Technical indicators show strong upward momentum with RSI at 65 and MACD crossing bullish.',
      confidence: 87,
      timeframe: '24h',
      impact: 'high',
      category: 'technical'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Market Volatility Alert',
      description: 'VIX equivalent for crypto shows increased volatility. Consider position sizing.',
      confidence: 92,
      timeframe: '4h',
      impact: 'medium',
      category: 'risk'
    },
    {
      id: 3,
      type: 'opportunity',
      title: 'DeFi Yield Farming Opportunity',
      description: 'Uniswap V3 pools showing 15.2% APY with low impermanent loss risk.',
      confidence: 78,
      timeframe: '1w',
      impact: 'medium',
      category: 'defi'
    },
    {
      id: 4,
      type: 'strategy',
      title: 'Portfolio Rebalancing Suggestion',
      description: 'AI recommends reducing BTC allocation by 8% and increasing ETH exposure.',
      confidence: 71,
      timeframe: '1m',
      impact: 'low',
      category: 'portfolio'
    }
  ];

  return {
    insights,
    marketSentiment: {
      overall: 'bullish',
      score: 72,
      breakdown: {
        technical: 68,
        fundamental: 75,
        social: 73
      }
    },
    aiPerformance: {
      accuracy: 87.3,
      signalsGenerated: 1247,
      successRate: 82.1,
      riskScore: 'medium'
    }
  };
}

function generateTradingSignals(symbol, timeframe) {
  const signals = [
    {
      symbol: symbol || 'ETH',
      signal: 'BUY',
      strength: 'STRONG',
      confidence: 85,
      entry: '2340.50',
      target: '2500.00',
      stopLoss: '2200.00',
      timeframe,
      indicators: {
        rsi: 65,
        macd: 'bullish_crossover',
        sma20: 'above',
        volume: 'increasing'
      }
    },
    {
      symbol: 'BTC',
      signal: 'HOLD',
      strength: 'MEDIUM',
      confidence: 72,
      entry: '52840.30',
      target: '55000.00',
      stopLoss: '50000.00',
      timeframe,
      indicators: {
        rsi: 58,
        macd: 'neutral',
        sma20: 'above',
        volume: 'stable'
      }
    }
  ];

  return signals;
}

function analyzePortfolio(holdings, riskTolerance) {
  const totalValue = holdings.reduce((sum, holding) => sum + (holding.amount * holding.price), 0);
  
  const analysis = {
    totalValue: totalValue.toFixed(2),
    diversification: {
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      recommendation: 'Well diversified across major assets'
    },
    riskScore: {
      current: Math.floor(Math.random() * 30) + 40, // 40-70
      target: riskTolerance === 'low' ? 30 : riskTolerance === 'high' ? 80 : 55,
      status: 'within_range'
    },
    recommendations: [
      {
        action: 'rebalance',
        description: 'Consider reducing BTC allocation by 5%',
        priority: 'medium',
        impact: 'risk_reduction'
      },
      {
        action: 'diversify',
        description: 'Add exposure to DeFi tokens for yield opportunities',
        priority: 'low',
        impact: 'yield_enhancement'
      }
    ],
    performance: {
      return24h: ((Math.random() - 0.5) * 10).toFixed(2) + '%',
      return7d: ((Math.random() - 0.5) * 20).toFixed(2) + '%',
      return30d: ((Math.random() - 0.5) * 40).toFixed(2) + '%'
    }
  };

  return analysis;
}

function assessRisk(portfolio, marketConditions) {
  return {
    overallRisk: 'MEDIUM',
    riskScore: Math.floor(Math.random() * 30) + 40,
    factors: [
      {
        factor: 'Market Volatility',
        impact: 'HIGH',
        score: 75,
        description: 'Current market showing increased volatility'
      },
      {
        factor: 'Portfolio Concentration',
        impact: 'MEDIUM',
        score: 45,
        description: 'Portfolio well diversified across assets'
      },
      {
        factor: 'Liquidity Risk',
        impact: 'LOW',
        score: 25,
        description: 'All holdings in highly liquid assets'
      }
    ],
    recommendations: [
      'Consider hedging positions during high volatility periods',
      'Maintain emergency cash reserves',
      'Review stop-loss levels regularly'
    ]
  };
}

function generateAIResponse(message, context) {
  const responses = [
    "Based on current market analysis, I recommend monitoring ETH closely for potential breakout patterns.",
    "The AI models suggest a bullish trend continuation with 78% confidence. Consider your risk tolerance.",
    "Market sentiment analysis indicates growing institutional interest in DeFi protocols.",
    "Technical indicators show oversold conditions in several altcoins, presenting potential opportunities.",
    "Risk assessment suggests maintaining current portfolio allocation with minor rebalancing."
  ];

  return {
    message: responses[Math.floor(Math.random() * responses.length)],
    confidence: Math.floor(Math.random() * 30) + 70,
    context: context || 'general',
    suggestions: [
      'Check latest market analysis',
      'Review portfolio allocation',
      'Monitor risk metrics'
    ]
  };
}

function analyzeSentiment(text) {
  // Simple sentiment analysis (in production, use ML models)
  const positiveWords = ['bullish', 'buy', 'moon', 'pump', 'gain', 'profit', 'up'];
  const negativeWords = ['bearish', 'sell', 'dump', 'loss', 'down', 'crash', 'fear'];
  
  const words = text.toLowerCase().split(' ');
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  const totalSentimentWords = positiveCount + negativeCount;
  let sentiment = 'neutral';
  let score = 0.5;
  
  if (totalSentimentWords > 0) {
    score = positiveCount / totalSentimentWords;
    if (score > 0.6) sentiment = 'positive';
    else if (score < 0.4) sentiment = 'negative';
  }
  
  return {
    sentiment,
    score: score.toFixed(2),
    confidence: Math.min(totalSentimentWords / words.length * 2, 1).toFixed(2),
    breakdown: {
      positive: positiveCount,
      negative: negativeCount,
      neutral: words.length - totalSentimentWords
    }
  };
}

module.exports = router;