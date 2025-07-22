const WebSocket = require('ws');

class MarketDataWebSocket {
  constructor(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/market-data'
    });
    
    this.clients = new Set();
    this.marketData = new Map();
    this.setupWebSocket();
    this.startMarketDataStream();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection established');
      
      this.clients.add(ws);
      
      // Send initial market data
      this.sendMarketData(ws);
      
      // Handle client messages
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleClientMessage(ws, data);
        } catch (error) {
          console.error('Invalid WebSocket message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });
      
      // Handle client disconnect
      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.clients.delete(ws);
      });
      
      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
      
      // Send ping every 30 seconds to keep connection alive
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        } else {
          clearInterval(pingInterval);
        }
      }, 30000);
    });
  }

  handleClientMessage(ws, data) {
    switch (data.type) {
      case 'subscribe':
        this.handleSubscription(ws, data.symbols);
        break;
      case 'unsubscribe':
        this.handleUnsubscription(ws, data.symbols);
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Unknown message type'
        }));
    }
  }

  handleSubscription(ws, symbols) {
    if (!ws.subscriptions) {
      ws.subscriptions = new Set();
    }
    
    symbols.forEach(symbol => {
      ws.subscriptions.add(symbol.toUpperCase());
    });
    
    ws.send(JSON.stringify({
      type: 'subscribed',
      symbols: Array.from(ws.subscriptions),
      timestamp: Date.now()
    }));
  }

  handleUnsubscription(ws, symbols) {
    if (!ws.subscriptions) return;
    
    symbols.forEach(symbol => {
      ws.subscriptions.delete(symbol.toUpperCase());
    });
    
    ws.send(JSON.stringify({
      type: 'unsubscribed',
      symbols: symbols,
      timestamp: Date.now()
    }));
  }

  sendMarketData(ws) {
    const data = {
      type: 'market_data',
      data: Array.from(this.marketData.values()),
      timestamp: Date.now()
    };
    
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  broadcastMarketData() {
    const data = {
      type: 'market_update',
      data: Array.from(this.marketData.values()),
      timestamp: Date.now()
    };
    
    this.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        // Send only subscribed symbols if client has subscriptions
        if (ws.subscriptions && ws.subscriptions.size > 0) {
          const filteredData = {
            ...data,
            data: data.data.filter(item => ws.subscriptions.has(item.symbol))
          };
          ws.send(JSON.stringify(filteredData));
        } else {
          ws.send(JSON.stringify(data));
        }
      }
    });
  }

  startMarketDataStream() {
    // Generate mock market data every 2 seconds
    setInterval(() => {
      this.generateMockMarketData();
      this.broadcastMarketData();
    }, 2000);
    
    // Generate initial data
    this.generateMockMarketData();
  }

  generateMockMarketData() {
    const symbols = ['BTC', 'ETH', 'ADA', 'SOL', 'MATIC', 'AVAX', 'DOT', 'LINK'];
    
    symbols.forEach(symbol => {
      const existing = this.marketData.get(symbol);
      const basePrice = existing ? parseFloat(existing.price) : Math.random() * 50000 + 100;
      
      // Simulate price movement (±2% change)
      const change = (Math.random() - 0.5) * 0.04;
      const newPrice = basePrice * (1 + change);
      
      const marketItem = {
        symbol,
        name: this.getCoinName(symbol),
        price: newPrice.toFixed(2),
        change24h: ((Math.random() - 0.5) * 20).toFixed(2),
        volume24h: (Math.random() * 1000000000).toFixed(0),
        marketCap: (newPrice * Math.random() * 100000000).toFixed(0),
        lastUpdated: new Date().toISOString(),
        priceChange: existing ? ((newPrice - parseFloat(existing.price)) / parseFloat(existing.price) * 100).toFixed(2) : '0.00'
      };
      
      this.marketData.set(symbol, marketItem);
    });
  }

  getCoinName(symbol) {
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

  getConnectedClients() {
    return this.clients.size;
  }

  closeAllConnections() {
    this.clients.forEach(ws => {
      ws.close();
    });
    this.clients.clear();
  }
}

module.exports = MarketDataWebSocket;