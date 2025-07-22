const Joi = require('joi');

// Wallet address validation
function validateWalletAddress(address) {
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  // Ethereum address validation
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
}

// Amount validation
function validateAmount(amount) {
  if (typeof amount !== 'number' || amount <= 0 || amount > 1000000) {
    return false;
  }
  return true;
}

// Voice command validation schema
const voiceCommandSchema = Joi.object({
  transcript: Joi.string().min(1).max(500).required(),
  language: Joi.string().pattern(/^[a-z]{2}-[A-Z]{2}$/).default('en-US'),
  sessionId: Joi.string().optional(),
  confidence: Joi.number().min(0).max(1).optional()
});

// Validate voice command
function validateVoiceCommand(req, res, next) {
  const { error, value } = voiceCommandSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.body = value;
  next();
}

// Portfolio validation schema
const portfolioSchema = Joi.object({
  holdings: Joi.array().items(
    Joi.object({
      symbol: Joi.string().min(2).max(10).required(),
      amount: Joi.number().positive().required(),
      price: Joi.number().positive().required()
    })
  ).min(1).required(),
  riskTolerance: Joi.string().valid('low', 'medium', 'high').default('medium')
});

// Validate portfolio
function validatePortfolio(req, res, next) {
  const { error, value } = portfolioSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Portfolio validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.body = value;
  next();
}

// Transaction validation schema
const transactionSchema = Joi.object({
  sessionId: Joi.string().required(),
  to: Joi.string().custom((value, helpers) => {
    if (!validateWalletAddress(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required(),
  amount: Joi.number().positive().max(1000).required(),
  gasPrice: Joi.string().optional()
});

// Validate transaction
function validateTransaction(req, res, next) {
  const { error, value } = transactionSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Transaction validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.body = value;
  next();
}

// User registration validation schema
const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  walletAddress: Joi.string().custom((value, helpers) => {
    if (value && !validateWalletAddress(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).optional()
});

// Validate user registration
function validateRegistration(req, res, next) {
  const { error, value } = registrationSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Registration validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.body = value;
  next();
}

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required()
});

// Validate login
function validateLogin(req, res, next) {
  const { error, value } = loginSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Login validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.body = value;
  next();
}

module.exports = {
  validateWalletAddress,
  validateAmount,
  validateVoiceCommand,
  validatePortfolio,
  validateTransaction,
  validateRegistration,
  validateLogin
};