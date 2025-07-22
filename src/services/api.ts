import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nebula_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('nebula_token');
      localStorage.removeItem('nebula_session');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Wallet API
export const walletAPI = {
  connect: async (address: string, signature: string) => {
    const response = await api.post('/wallet/connect', { address, signature });
    return response.data;
  },

  getBalance: async (sessionId: string) => {
    const response = await api.get(`/wallet/balance/${sessionId}`);
    return response.data;
  },

  sendTransaction: async (sessionId: string, to: string, amount: number, gasPrice?: string) => {
    const response = await api.post('/wallet/send', { sessionId, to, amount, gasPrice });
    return response.data;
  },

  getTransactions: async (sessionId: string) => {
    const response = await api.get(`/wallet/transactions/${sessionId}`);
    return response.data;
  },

  disconnect: async (sessionId: string) => {
    const response = await api.post('/wallet/disconnect', { sessionId });
    return response.data;
  },
};

// Voice API
export const voiceAPI = {
  processCommand: async (transcript: string, language: string, sessionId?: string) => {
    const response = await api.post('/voice/process', { transcript, language, sessionId });
    return response.data;
  },

  getLanguages: async () => {
    const response = await api.get('/voice/languages');
    return response.data;
  },

  getAnalytics: async (sessionId: string) => {
    const response = await api.get(`/voice/analytics/${sessionId}`);
    return response.data;
  },

  textToSpeech: async (text: string, language?: string, voice?: string) => {
    const response = await api.post('/voice/tts', { text, language, voice });
    return response.data;
  },
};

// Market API
export const marketAPI = {
  getPrices: async () => {
    const response = await api.get('/market/prices');
    return response.data;
  },

  getCoinData: async (symbol: string, timeframe?: string) => {
    const response = await api.get(`/market/coin/${symbol}`, { params: { timeframe } });
    return response.data;
  },

  getOverview: async () => {
    const response = await api.get('/market/overview');
    return response.data;
  },

  getTrending: async () => {
    const response = await api.get('/market/trending');
    return response.data;
  },

  getWebSocketUrl: async () => {
    const response = await api.get('/market/ws');
    return response.data;
  },
};

// AI API
export const aiAPI = {
  getInsights: async () => {
    const response = await api.get('/ai/insights');
    return response.data;
  },

  getTradingSignals: async (symbol?: string, timeframe?: string) => {
    const response = await api.get('/ai/signals', { params: { symbol, timeframe } });
    return response.data;
  },

  analyzePortfolio: async (holdings: any[], riskTolerance?: string) => {
    const response = await api.post('/ai/portfolio/analyze', { holdings, riskTolerance });
    return response.data;
  },

  assessRisk: async (portfolio: any, marketConditions?: any) => {
    const response = await api.post('/ai/risk/assess', { portfolio, marketConditions });
    return response.data;
  },

  chat: async (message: string, context?: any, sessionId?: string) => {
    const response = await api.post('/ai/chat', { message, context, sessionId });
    return response.data;
  },

  analyzeSentiment: async (text: string, source?: string) => {
    const response = await api.post('/ai/sentiment', { text, source });
    return response.data;
  },
};

// Auth API
export const authAPI = {
  register: async (email: string, password: string, walletAddress?: string) => {
    const response = await api.post('/auth/register', { email, password, walletAddress });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async (sessionId?: string) => {
    const response = await api.post('/auth/logout', { sessionId });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updatePreferences: async (preferences: any) => {
    const response = await api.put('/auth/preferences', preferences);
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// WebSocket connection for real-time data
export class MarketDataWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private onMessage: (data: any) => void, private onError?: (error: any) => void) {}

  connect() {
    try {
      this.ws = new WebSocket('ws://localhost:5000/market-data');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (this.onError) {
          this.onError(error);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribe(symbols: string[]) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        symbols
      }));
    }
  }

  unsubscribe(symbols: string[]) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        symbols
      }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default api;