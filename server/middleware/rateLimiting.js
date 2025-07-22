const rateLimit = require('express-rate-limit');

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Wallet operations rate limiting (more restrictive)
const rateLimitWallet = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit each IP to 10 wallet operations per 5 minutes
  message: {
    error: 'Too many wallet operations from this IP, please try again later.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Voice command rate limiting
const rateLimitVoice = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 voice commands per minute
  message: {
    error: 'Too many voice commands from this IP, please slow down.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiting (very restrictive)
const rateLimitAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per 15 minutes
  message: {
    error: 'Too many authentication attempts from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Market data rate limiting
const rateLimitMarket = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 market data requests per minute
  message: {
    error: 'Too many market data requests from this IP, please slow down.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI operations rate limiting
const rateLimitAI = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // limit each IP to 20 AI requests per 5 minutes
  message: {
    error: 'Too many AI requests from this IP, please try again later.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create custom rate limiter
function createRateLimiter(windowMs, max, message) {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: `${Math.ceil(windowMs / 60000)} minutes`
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

module.exports = {
  generalLimiter,
  rateLimitWallet,
  rateLimitVoice,
  rateLimitAuth,
  rateLimitMarket,
  rateLimitAI,
  createRateLimiter
};