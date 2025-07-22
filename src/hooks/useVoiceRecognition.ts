import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface VoiceCommand {
  type: 'balance' | 'send' | 'connect' | 'disconnect' | 'account' | 'unknown';
  amount?: number;
  address?: string;
  originalText: string;
  confidence?: number;
}

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [error, setError] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);
  const isRestartingRef = useRef(false);
  const lastProcessedRef = useRef<string>('');
  const commandTimeoutRef = useRef<number | null>(null);

  // Enhanced multilingual command parsing
  const parseVoiceCommand = useCallback((text: string): VoiceCommand => {
    const lowerText = text.toLowerCase().trim();
    
    // Skip if same as last processed command
    if (lastProcessedRef.current === lowerText) {
      return { type: 'unknown', originalText: text };
    }
    
    // Connect wallet commands (multilingual)
    const connectPatterns = [
      // English
      'connect wallet', 'connect my wallet', 'wallet connect', 'connect',
      // Spanish
      'conectar billetera', 'conectar cartera', 'conectar',
      // German
      'wallet verbinden', 'verbinden', 'geldbörse verbinden',
      // Portuguese
      'conectar carteira', 'conectar', 'ligar carteira',
      // French
      'connecter portefeuille', 'connecter', 'lier portefeuille',
      // Italian
      'connetti portafoglio', 'connetti', 'collegare portafoglio',
      // Hindi
      'वॉलेट कनेक्ट', 'कनेक्ट करो', 'कनेक्ट',
      // Japanese
      'ウォレット接続', '接続', 'つなぐ',
      // Korean
      '지갑 연결', '연결', '지갑연결'
    ];
    
    if (connectPatterns.some(pattern => lowerText.includes(pattern))) {
      return { type: 'connect', originalText: text };
    }
    
    // Disconnect wallet commands (multilingual)
    const disconnectPatterns = [
      // English
      'disconnect wallet', 'disconnect', 'logout', 'log out',
      // Spanish
      'desconectar billetera', 'desconectar', 'cerrar sesión',
      // German
      'wallet trennen', 'trennen', 'abmelden',
      // Portuguese
      'desconectar carteira', 'desconectar', 'sair',
      // French
      'déconnecter portefeuille', 'déconnecter', 'se déconnecter',
      // Italian
      'disconnetti portafoglio', 'disconnetti', 'esci',
      // Hindi
      'वॉलेट डिस्कनेक्ट', 'डिस्कनेक्ट', 'लॉगआउट',
      // Japanese
      'ウォレット切断', '切断', 'ログアウト',
      // Korean
      '지갑 연결해제', '연결해제', '로그아웃'
    ];
    
    if (disconnectPatterns.some(pattern => lowerText.includes(pattern))) {
      return { type: 'disconnect', originalText: text };
    }
    
    // Balance check commands (multilingual)
    const balancePatterns = [
      // English
      'check balance', 'show balance', 'my balance', 'balance',
      // Spanish
      'verificar saldo', 'mostrar saldo', 'mi saldo', 'saldo',
      // German
      'guthaben prüfen', 'saldo anzeigen', 'mein guthaben', 'guthaben',
      // Portuguese
      'verificar saldo', 'mostrar saldo', 'meu saldo', 'saldo',
      // French
      'vérifier solde', 'afficher solde', 'mon solde', 'solde',
      // Italian
      'controlla saldo', 'mostra saldo', 'il mio saldo', 'saldo',
      // Hindi
      'बैलेंस चेक', 'मेरा बैलेंस', 'बैलेंस दिखाओ', 'बैलेंस',
      // Japanese
      '残高確認', '残高表示', '私の残高', '残高',
      // Korean
      '잔액 확인', '잔액 보기', '내 잔액', '잔액'
    ];
    
    if (balancePatterns.some(pattern => lowerText.includes(pattern))) {
      return { type: 'balance', originalText: text };
    }
    
    // Account/address commands (multilingual)
    const accountPatterns = [
      // English
      'show account', 'my account', 'wallet address', 'show address', 'account',
      // Spanish
      'mostrar cuenta', 'mi cuenta', 'dirección de billetera', 'cuenta',
      // German
      'konto anzeigen', 'mein konto', 'wallet-adresse', 'konto',
      // Portuguese
      'mostrar conta', 'minha conta', 'endereço da carteira', 'conta',
      // French
      'afficher compte', 'mon compte', 'adresse portefeuille', 'compte',
      // Italian
      'mostra account', 'il mio account', 'indirizzo portafoglio', 'account',
      // Hindi
      'मेरा अकाउंट', 'अकाउंट दिखाओ', 'वॉलेट पता', 'अकाउंट',
      // Japanese
      'アカウント表示', '私のアカウント', 'ウォレットアドレス', 'アカウント',
      // Korean
      '계정 보기', '내 계정', '지갑 주소', '계정'
    ];
    
    if (accountPatterns.some(pattern => lowerText.includes(pattern))) {
      return { type: 'account', originalText: text };
    }
    
    // Send ETH commands (multilingual with enhanced parsing)
    const sendPatterns = [
      // English
      'send', 'transfer', 'pay',
      // Spanish
      'enviar', 'transferir', 'pagar',
      // German
      'senden', 'überweisen', 'bezahlen',
      // Portuguese
      'enviar', 'transferir', 'pagar',
      // French
      'envoyer', 'transférer', 'payer',
      // Italian
      'invia', 'trasferisci', 'paga',
      // Hindi
      'भेजो', 'ट्रांसफर', 'पेमेंट',
      // Japanese
      '送信', '転送', '支払い',
      // Korean
      '보내기', '전송', '지불'
    ];
    
    if (sendPatterns.some(pattern => lowerText.includes(pattern))) {
      // Enhanced amount extraction with multilingual support
      const amountPatterns = [
        /([0-9]+\.?[0-9]*)\s*(eth|ether|ईटीएच|イーサ|이더)/i,
        /([0-9]+\.?[0-9]*)\s*(?=\s*(to|a|para|an|à|verso|को|に|에게)\s*0x)/i,
        /([0-9]+\.?[0-9]*)\s*(?=.*0x)/i,
        /(send|enviar|senden|envoyer|invia|भेजो|送信|보내기)\s*([0-9]+\.?[0-9]*)/i,
        /([0-9]+\.?[0-9]*)/i
      ];
      
      let amount: number | undefined;
      for (const pattern of amountPatterns) {
        const match = lowerText.match(pattern) || text.match(pattern);
        if (match) {
          const amountStr = match[2] || match[1];
          amount = parseFloat(amountStr);
          if (!isNaN(amount)) break;
        }
      }
      
      // Enhanced address extraction
      const addressPatterns = [
        /0x[a-fA-F0-9]{40,42}/,
        /(to|a|para|an|à|verso|को|に|에게)\s*(0x[a-fA-F0-9]{40,42})/i,
        /(0x[a-fA-F0-9]{40})/i
      ];
      
      let address: string | undefined;
      for (const pattern of addressPatterns) {
        const match = text.match(pattern);
        if (match) {
          address = match[0].startsWith('0x') ? match[0] : match[2];
          break;
        }
      }
      
      if (amount) {
        return { 
          type: 'send', 
          amount, 
          address,
          originalText: text 
        };
      }
    }
    
    return { type: 'unknown', originalText: text };
  }, []);

  // Auto-restart function
  const restartRecognition = useCallback(() => {
    if (isRestartingRef.current || !recognitionRef.current) return;
    
    isRestartingRef.current = true;
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    
    restartTimeoutRef.current = setTimeout(() => {
      try {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.start();
        }
      } catch (e) {
        setError('Voice recognition failed to restart');
      } finally {
        isRestartingRef.current = false;
      }
    }, 300);
  }, [isListening]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = currentLanguage;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      isRestartingRef.current = false;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      
      if (finalTranscript.trim()) {
        const spokenText = finalTranscript.trim();
        setTranscript(spokenText);
        
        if (commandTimeoutRef.current) {
          clearTimeout(commandTimeoutRef.current);
        }
        
        commandTimeoutRef.current = setTimeout(() => {
          const command = parseVoiceCommand(spokenText);
          if (command.type !== 'unknown') {
            lastProcessedRef.current = spokenText.toLowerCase().trim();
            setLastCommand(command);
            
            setTimeout(() => {
              lastProcessedRef.current = '';
            }, 2000);
          }
        }, 100);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      switch (event.error) {
        case 'no-speech':
          restartRecognition();
          break;
        case 'audio-capture':
          setError('Microphone not available');
          setIsListening(false);
          break;
        case 'not-allowed':
          setError('Microphone permission denied');
          setIsListening(false);
          break;
        case 'network':
          restartRecognition();
          break;
        case 'aborted':
          break;
        default:
          restartRecognition();
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (!isRestartingRef.current) {
        restartRecognition();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage, restartRecognition, parseVoiceCommand]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      setError('Speech recognition not available');
      return;
    }

    try {
      recognitionRef.current.lang = currentLanguage;
      recognitionRef.current.start();
      setError('');
    } catch (e) {
      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (retryError) {
            setError('Failed to start voice recognition');
          }
        }
      }, 500);
    }
  }, [currentLanguage, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setLastCommand(null);
    setError('');
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    currentLanguage,
    lastCommand,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setCurrentLanguage
  };
};