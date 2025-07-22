const express = require('express');
const router = express.Router();
const axios = require('axios');

// Cache for market data
let marketDataCache = {
  data: null,
  lastUpdated: null,
  ttl: 30000 // 30 seconds
};

// Get live market data
router.get('/prices', async (req, res) => {
  try {
    const now = Date.now();
    
    // Check cache first
    if (marketDataCache.data && 
        marketDataCache.lastUpdated && 
        (now - marketDataCache.lastUpdated) < marketDataCache.ttl) {
      return res.json({
        success: true,
        data: marketDataCache.data,
        cached: true,
        lastUpdated: marketDataCache.lastUpdated
      });
    }

    // Mock market data (in production, use real API like CoinGecko)
    const marketData = generateMockMarketData();
    
    // Update cache
    marketDataCache.data = marketData;
    marketDataCache.lastUpdated = now;

    res.json({
      success: true,
      data: marketData,
      cached: false,
      lastUpdated: now
    });
  } catch (error) {
    console.error('Market data error:', error);
    res.status(500).json({
      error: 'Failed to fetch market data',
      message: error.message
    });
  }
});

// Get specific coin data
router.get('/coin/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '24h' } = req.query;

    // Mock coin data
    const coinData = {
      symbol: symbol.toUpperCase(),
      name: getCoinName(symbol),
      price: (Math.random() * 1000 + 100).toFixed(2),
      change24h: ((Math.random() - 0.5) * 20).toFixed(2),
      volume24h: (Math.random() * 1000000000).toFixed(0),
      marketCap: (Math.random() * 100000000000).toFixed(0),
      rank: Math.floor(Math.random() * 100) + 1,
      priceHistory: generatePriceHistory(timeframe),
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: coinData,
      timeframe
    });
  } catch (error) {
    console.error('Coin data error:', error);
    res.status(500).json({
      error: 'Failed to fetch coin data',
      message: error.message
    });
  }
});

// Get market overview
router.get('/overview', async (req, res) => {
  try {
    const overview = {
      totalMarketCap: '2.1T',
      totalVolume24h: '89.4B',
      btcDominance: '52.3%',
      ethDominance: '17.8%',
      defiTvl: '45.2B',
      activeCoins: 2847,
      markets: 8934,
      fearGreedIndex: {
        value: 72,
        classification: 'Greed',
        lastUpdated: new Date().toISOString()
      },
      topGainers: [
        { symbol: 'SOL', change: '+12.4%' },
        { symbol: 'AVAX', change: '+8.7%' },
        { symbol: 'MATIC', change: '+6.2%' }
      ],
      topLosers: [
        { symbol: 'DOGE', change: '-5.3%' },
        { symbol: 'SHIB', change: '-4.1%' },
        { symbol: 'ADA', change: '-2.8%' }
      ]
    };

    res.json({
      success: true,
      data: overview,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market overview error:', error);
    res.status(500).json({
      error: 'Failed to fetch market overview',
      message: error.message
    });
  }
});

// Get trending coins
router.get('/trending', async (req, res) => {
  try {
    const trending = [
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        price: '2340.50',
        change: '+5.2%',
        volume: '1.2B',
        rank: 2
      },
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        price: '98.76',
        change: '+8.4%',
        volume: '456M',
        rank: 5
      },
      {
        id: 'polygon',
        symbol: 'MATIC',
        name: 'Polygon',
        price: '0.8234',
        change: '+3.7%',
        volume: '123M',
        rank: 13
      }
    ];

    res.json({
      success: true,
      data: trending,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trending coins error:', error);
    res.status(500).json({
      error: 'Failed to fetch trending coins',
      message: error.message
    });
  }
});

// WebSocket endpoint for real-time data
router.get('/ws', (req, res) => {
  res.json({
    success: true,
    websocketUrl: 'ws://localhost:5000/market-data',
    protocols: ['market-data-v1'],
    message: 'Connect to WebSocket for real-time market updates'
  });
});

// Utility functions
function generateMockMarketData() {
  const coins = ['BTC', 'ETH', 'ADA', 'SOL', 'MATIC', 'AVAX', 'DOT', 'LINK'];
  
  return coins.map(symbol => ({
    symbol,
    name: getCoinName(symbol),
    price: (Math.random() * 50000 + 100).toFixed(2),
    change24h: ((Math.random() - 0.5) * 20).toFixed(2),
    volume24h: (Math.random() * 1000000000).toFixed(0),
    marketCap: (Math.random() * 100000000000).toFixed(0),
    lastUpdated: new Date().toISOString()
  }));
}

function getCoinName(symbol) {
  const names = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'ADA': 'Cardano',
    'SOL': 'Solana',
    'MATIC': 'Polygon',
    'AVAX': 'Avalanche',
    'DOT': 'Polkadot',
    'LINK': 'Chainlink'
  };
  return names[symbol] || symbol;
}

function generatePriceHistory(timeframe) {
  const points = timeframe === '1h' ? 60 : timeframe === '24h' ? 24 : 30;
  const history = [];
  let basePrice = Math.random() * 1000 + 100;
  
  for (let i = 0; i < points; i++) {
    basePrice += (Math.random() - 0.5) * basePrice * 0.02;
    history.push({
      timestamp: new Date(Date.now() - (points - i) * 3600000).toISOString(),
      price: basePrice.toFixed(2)
    });
  }
  
  return history;
}

module.exports = router;