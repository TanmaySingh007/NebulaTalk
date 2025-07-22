const express = require('express');
const router = express.Router();
const { validateWalletAddress, validateAmount } = require('../middleware/validation');
const { rateLimitWallet } = require('../middleware/rateLimiting');

// Mock wallet data (in production, this would connect to actual blockchain)
let walletSessions = new Map();

// Connect wallet
router.post('/connect', rateLimitWallet, async (req, res) => {
  try {
    const { address, signature } = req.body;
    
    if (!validateWalletAddress(address)) {
      return res.status(400).json({
        error: 'Invalid wallet address format'
      });
    }

    // Simulate wallet connection
    const sessionId = generateSessionId();
    const walletData = {
      address,
      balance: (Math.random() * 10).toFixed(4), // Mock balance
      connected: true,
      connectedAt: new Date().toISOString(),
      network: 'ethereum',
      chainId: 1
    };

    walletSessions.set(sessionId, walletData);

    res.json({
      success: true,
      sessionId,
      wallet: walletData,
      message: 'Wallet connected successfully'
    });
  } catch (error) {
    console.error('Wallet connection error:', error);
    res.status(500).json({
      error: 'Failed to connect wallet',
      message: error.message
    });
  }
});

// Get wallet balance
router.get('/balance/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const wallet = walletSessions.get(sessionId);

    if (!wallet) {
      return res.status(404).json({
        error: 'Wallet session not found'
      });
    }

    // Simulate balance update
    wallet.balance = (Math.random() * 10).toFixed(4);
    wallet.lastUpdated = new Date().toISOString();

    res.json({
      success: true,
      balance: wallet.balance,
      address: wallet.address,
      network: wallet.network,
      lastUpdated: wallet.lastUpdated
    });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch balance',
      message: error.message
    });
  }
});

// Send transaction
router.post('/send', rateLimitWallet, async (req, res) => {
  try {
    const { sessionId, to, amount, gasPrice } = req.body;
    const wallet = walletSessions.get(sessionId);

    if (!wallet) {
      return res.status(404).json({
        error: 'Wallet session not found'
      });
    }

    if (!validateWalletAddress(to)) {
      return res.status(400).json({
        error: 'Invalid recipient address'
      });
    }

    if (!validateAmount(amount)) {
      return res.status(400).json({
        error: 'Invalid amount'
      });
    }

    const currentBalance = parseFloat(wallet.balance);
    if (amount > currentBalance) {
      return res.status(400).json({
        error: 'Insufficient balance',
        available: currentBalance,
        requested: amount
      });
    }

    // Simulate transaction
    const txHash = generateTxHash();
    const transaction = {
      hash: txHash,
      from: wallet.address,
      to,
      amount,
      gasPrice: gasPrice || '20',
      status: 'pending',
      timestamp: new Date().toISOString(),
      blockNumber: null,
      confirmations: 0
    };

    // Update wallet balance
    wallet.balance = (currentBalance - amount - 0.001).toFixed(4); // Subtract gas fee

    // Simulate transaction confirmation after 3 seconds
    setTimeout(() => {
      transaction.status = 'confirmed';
      transaction.blockNumber = Math.floor(Math.random() * 1000000) + 18000000;
      transaction.confirmations = 1;
    }, 3000);

    res.json({
      success: true,
      transaction,
      newBalance: wallet.balance,
      message: 'Transaction submitted successfully'
    });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({
      error: 'Transaction failed',
      message: error.message
    });
  }
});

// Get transaction history
router.get('/transactions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const wallet = walletSessions.get(sessionId);

    if (!wallet) {
      return res.status(404).json({
        error: 'Wallet session not found'
      });
    }

    // Mock transaction history
    const transactions = [
      {
        hash: '0x1234567890abcdef1234567890abcdef12345678',
        from: wallet.address,
        to: '0x742d35Cc6634C0532925a3b8D0C9e3e0C8b0e4c2',
        amount: '0.1',
        status: 'confirmed',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        type: 'send'
      },
      {
        hash: '0xabcdef1234567890abcdef1234567890abcdef12',
        from: '0x742d35Cc6634C0532925a3b8D0C9e3e0C8b0e4c2',
        to: wallet.address,
        amount: '0.5',
        status: 'confirmed',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        type: 'receive'
      }
    ];

    res.json({
      success: true,
      transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({
      error: 'Failed to fetch transaction history',
      message: error.message
    });
  }
});

// Disconnect wallet
router.post('/disconnect', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (walletSessions.has(sessionId)) {
      walletSessions.delete(sessionId);
    }

    res.json({
      success: true,
      message: 'Wallet disconnected successfully'
    });
  } catch (error) {
    console.error('Wallet disconnect error:', error);
    res.status(500).json({
      error: 'Failed to disconnect wallet',
      message: error.message
    });
  }
});

// Utility functions
function generateSessionId() {
  return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function generateTxHash() {
  return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

module.exports = router;