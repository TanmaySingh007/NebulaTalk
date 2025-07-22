const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock user database (in production, use real database)
const users = new Map();
const sessions = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'nebula-talk-secret-key-2024';
const JWT_EXPIRES_IN = '24h';

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, walletAddress } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(409).json({
        error: 'User already exists with this email'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = {
      id: generateUserId(),
      email,
      password: hashedPassword,
      walletAddress: walletAddress || null,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      preferences: {
        language: 'en-US',
        theme: 'dark',
        voiceEnabled: true,
        notifications: true
      },
      verified: false
    };

    users.set(email, user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create session
    const sessionId = generateSessionId();
    sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        preferences: user.preferences,
        verified: user.verified
      },
      token,
      sessionId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Failed to register user',
      message: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create session
    const sessionId = generateSessionId();
    sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        preferences: user.preferences,
        lastLogin: user.lastLogin,
        verified: user.verified
      },
      token,
      sessionId
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Failed to login',
      message: error.message
    });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (sessionId && sessions.has(sessionId)) {
      sessions.delete(sessionId);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Failed to logout',
      message: error.message
    });
  }
});

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = users.get(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
});

// Update user preferences
router.put('/preferences', authenticateToken, (req, res) => {
  try {
    const { language, theme, voiceEnabled, notifications } = req.body;
    const user = users.get(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Update preferences
    if (language) user.preferences.language = language;
    if (theme) user.preferences.theme = theme;
    if (typeof voiceEnabled === 'boolean') user.preferences.voiceEnabled = voiceEnabled;
    if (typeof notifications === 'boolean') user.preferences.notifications = notifications;

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({
      error: 'Failed to update preferences',
      message: error.message
    });
  }
});

// Verify token endpoint
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      userId: req.user.userId,
      email: req.user.email
    }
  });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
}

// Utility functions
function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function generateSessionId() {
  return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

module.exports = router;