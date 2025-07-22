const express = require('express');
const router = express.Router();
const { validateVoiceCommand } = require('../middleware/validation');

// Voice command processing
router.post('/process', async (req, res) => {
  try {
    const { transcript, language, sessionId } = req.body;

    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({
        error: 'Empty transcript provided'
      });
    }

    const command = parseVoiceCommand(transcript, language);
    
    // Log voice command for analytics
    logVoiceCommand(sessionId, transcript, command, language);

    res.json({
      success: true,
      command,
      originalText: transcript,
      language,
      confidence: command.confidence || 0.8,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Voice processing error:', error);
    res.status(500).json({
      error: 'Failed to process voice command',
      message: error.message
    });
  }
});

// Get supported languages
router.get('/languages', (req, res) => {
  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸', supported: true },
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳', supported: true },
    { code: 'hi-IN', name: 'हिंदी (Hindi)', flag: '🇮🇳', supported: true },
    { code: 'es-ES', name: 'Español (Spanish)', flag: '🇪🇸', supported: true },
    { code: 'de-DE', name: 'Deutsch (German)', flag: '🇩🇪', supported: true },
    { code: 'pt-BR', name: 'Português (Portuguese)', flag: '🇧🇷', supported: true },
    { code: 'fr-FR', name: 'Français (French)', flag: '🇫🇷', supported: true },
    { code: 'it-IT', name: 'Italiano (Italian)', flag: '🇮🇹', supported: true },
    { code: 'ja-JP', name: '日本語 (Japanese)', flag: '🇯🇵', supported: true },
    { code: 'ko-KR', name: '한국어 (Korean)', flag: '🇰🇷', supported: true },
    { code: 'zh-CN', name: '中文 (Chinese)', flag: '🇨🇳', supported: true },
    { code: 'ru-RU', name: 'Русский (Russian)', flag: '🇷🇺', supported: true }
  ];

  res.json({
    success: true,
    languages,
    total: languages.length
  });
});

// Voice analytics
router.get('/analytics/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Mock analytics data
    const analytics = {
      totalCommands: Math.floor(Math.random() * 100) + 20,
      successRate: (85 + Math.random() * 10).toFixed(1),
      mostUsedCommands: [
        { command: 'balance', count: 15, percentage: 35 },
        { command: 'send', count: 8, count: 20 },
        { command: 'connect', count: 6, percentage: 15 },
        { command: 'account', count: 5, percentage: 12 },
        { command: 'disconnect', count: 3, percentage: 8 }
      ],
      languageUsage: [
        { language: 'en-US', percentage: 60 },
        { language: 'hi-IN', percentage: 25 },
        { language: 'es-ES', percentage: 15 }
      ],
      averageResponseTime: '0.8s',
      lastActive: new Date().toISOString()
    };

    res.json({
      success: true,
      analytics,
      sessionId
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// Text-to-speech endpoint
router.post('/tts', async (req, res) => {
  try {
    const { text, language, voice } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required for TTS'
      });
    }

    // Mock TTS response (in production, integrate with TTS service)
    const audioUrl = `https://api.nebula-talk.com/tts/audio/${Date.now()}.mp3`;
    
    res.json({
      success: true,
      audioUrl,
      text,
      language: language || 'en-US',
      voice: voice || 'jarvis',
      duration: Math.ceil(text.length / 10), // Estimated duration in seconds
      format: 'mp3'
    });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({
      error: 'Failed to generate speech',
      message: error.message
    });
  }
});

// Enhanced multilingual command parsing
function parseVoiceCommand(text, language = 'en-US') {
  const lowerText = text.toLowerCase().trim();
  
  // Command patterns for different languages
  const commandPatterns = {
    connect: {
      'en': ['connect', 'connect wallet', 'wallet connect', 'link wallet'],
      'es': ['conectar', 'conectar billetera', 'conectar cartera'],
      'de': ['verbinden', 'wallet verbinden', 'geldbörse verbinden'],
      'pt': ['conectar', 'conectar carteira', 'ligar carteira'],
      'fr': ['connecter', 'connecter portefeuille', 'lier portefeuille'],
      'it': ['connetti', 'connetti portafoglio', 'collegare portafoglio'],
      'hi': ['कनेक्ट', 'वॉलेट कनेक्ट', 'कनेक्ट करो'],
      'ja': ['接続', 'ウォレット接続', 'つなぐ'],
      'ko': ['연결', '지갑 연결', '지갑연결'],
      'zh': ['连接', '连接钱包', '链接钱包'],
      'ru': ['подключить', 'подключить кошелек', 'связать кошелек']
    },
    balance: {
      'en': ['balance', 'check balance', 'show balance', 'my balance'],
      'es': ['saldo', 'verificar saldo', 'mostrar saldo', 'mi saldo'],
      'de': ['guthaben', 'saldo prüfen', 'guthaben anzeigen'],
      'pt': ['saldo', 'verificar saldo', 'mostrar saldo', 'meu saldo'],
      'fr': ['solde', 'vérifier solde', 'afficher solde', 'mon solde'],
      'it': ['saldo', 'controlla saldo', 'mostra saldo', 'il mio saldo'],
      'hi': ['बैलेंस', 'बैलेंस चेक', 'मेरा बैलेंस', 'बैलेंस दिखाओ'],
      'ja': ['残高', '残高確認', '残高表示', '私の残高'],
      'ko': ['잔액', '잔액 확인', '잔액 보기', '내 잔액'],
      'zh': ['余额', '检查余额', '显示余额', '我的余额'],
      'ru': ['баланс', 'проверить баланс', 'показать баланс', 'мой баланс']
    },
    send: {
      'en': ['send', 'transfer', 'pay', 'send eth'],
      'es': ['enviar', 'transferir', 'pagar', 'enviar eth'],
      'de': ['senden', 'überweisen', 'bezahlen', 'eth senden'],
      'pt': ['enviar', 'transferir', 'pagar', 'enviar eth'],
      'fr': ['envoyer', 'transférer', 'payer', 'envoyer eth'],
      'it': ['invia', 'trasferisci', 'paga', 'invia eth'],
      'hi': ['भेजो', 'ट्रांसफर', 'पेमेंट', 'ईटीएच भेजो'],
      'ja': ['送信', '転送', '支払い', 'eth送信'],
      'ko': ['보내기', '전송', '지불', 'eth 보내기'],
      'zh': ['发送', '转账', '支付', '发送eth'],
      'ru': ['отправить', 'перевести', 'заплатить', 'отправить eth']
    }
  };

  const langCode = language.split('-')[0];
  
  // Check for each command type
  for (const [commandType, patterns] of Object.entries(commandPatterns)) {
    const langPatterns = patterns[langCode] || patterns['en'];
    if (langPatterns.some(pattern => lowerText.includes(pattern))) {
      const command = { type: commandType, originalText: text, confidence: 0.9 };
      
      // Extract amount and address for send commands
      if (commandType === 'send') {
        const amountMatch = text.match(/([0-9]+\.?[0-9]*)/);
        const addressMatch = text.match(/(0x[a-fA-F0-9]{40})/);
        
        if (amountMatch) command.amount = parseFloat(amountMatch[1]);
        if (addressMatch) command.address = addressMatch[1];
      }
      
      return command;
    }
  }
  
  return { type: 'unknown', originalText: text, confidence: 0.1 };
}

// Log voice commands for analytics
function logVoiceCommand(sessionId, transcript, command, language) {
  // In production, this would log to a database
  console.log(`Voice Command Log:`, {
    sessionId,
    transcript,
    command: command.type,
    language,
    timestamp: new Date().toISOString()
  });
}

module.exports = router;