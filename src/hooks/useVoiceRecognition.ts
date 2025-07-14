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
  const [currentLanguage, setCurrentLanguage] = useState('en-IN');
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [error, setError] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);
  const isRestartingRef = useRef(false);
  const lastProcessedRef = useRef<string>('');
  const commandTimeoutRef = useRef<number | null>(null);

  // Enhanced command parsing with better regex patterns
  const parseVoiceCommand = useCallback((text: string): VoiceCommand => {
    const lowerText = text.toLowerCase().trim();
    
    // Skip if same as last processed command (within 2 seconds)
    if (lastProcessedRef.current === lowerText) {
      return { type: 'unknown', originalText: text };
    }
    
    // Connect wallet commands
    if (
      lowerText.includes('connect wallet') ||
      lowerText.includes('connect my wallet') ||
      lowerText.includes('wallet connect') ||
      lowerText.includes('connect') ||
      lowerText.includes('वॉलेट कनेक्ट') ||
      lowerText.includes('कनेक्ट करो') ||
      lowerText.includes('कनेक्ट')
    ) {
      return { type: 'connect', originalText: text };
    }
    
    // Disconnect wallet commands
    if (
      lowerText.includes('disconnect wallet') ||
      lowerText.includes('disconnect my wallet') ||
      lowerText.includes('wallet disconnect') ||
      lowerText.includes('disconnect') ||
      lowerText.includes('वॉलेट डिस्कनेक्ट') ||
      lowerText.includes('डिस्कनेक्ट करो') ||
      lowerText.includes('डिस्कनेक्ट') ||
      lowerText.includes('logout') ||
      lowerText.includes('log out')
    ) {
      return { type: 'disconnect', originalText: text };
    }
    
    // Balance check commands
    if (
      lowerText.includes('check balance') ||
      lowerText.includes('check my balance') ||
      lowerText.includes('show balance') ||
      lowerText.includes('my balance') ||
      lowerText.includes('balance check') ||
      lowerText.includes('balance') ||
      lowerText.includes('बैलेंस चेक') ||
      lowerText.includes('मेरा बैलेंस') ||
      lowerText.includes('बैलेंस दिखाओ') ||
      lowerText.includes('बैलेंस') ||
      lowerText.includes('check') ||
      lowerText.includes('चेक')
    ) {
      return { type: 'balance', originalText: text };
    }
    
    // Account/address commands
    if (
      lowerText.includes('show my account') ||
      lowerText.includes('show account') ||
      lowerText.includes('my account') ||
      lowerText.includes('wallet address') ||
      lowerText.includes('show address') ||
      lowerText.includes('my address') ||
      lowerText.includes('account') ||
      lowerText.includes('मेरा अकाउंट') ||
      lowerText.includes('अकाउंट दिखाओ') ||
      lowerText.includes('मेरा पता') ||
      lowerText.includes('अकाउंट')
    ) {
      return { type: 'account', originalText: text };
    }
    
    // Send ETH commands - Enhanced parsing
    if (
      lowerText.includes('send') ||
      lowerText.includes('transfer') ||
      lowerText.includes('भेजो') ||
      lowerText.includes('ट्रांसफर') ||
      lowerText.includes('pay') ||
      lowerText.includes('payment')
    ) {
      // Multiple regex patterns for amount extraction
      const amountPatterns = [
        /([0-9]+\.?[0-9]*)\s*(eth|ether|ईटीएच)/i,
        /([0-9]+\.?[0-9]*)\s*(?=\s*to\s*0x)/i,
        /([0-9]+\.?[0-9]*)\s*(?=\s*भेजो)/i,
        /send\s*([0-9]+\.?[0-9]*)/i,
        /([0-9]+\.?[0-9]*)\s*(?=.*0x)/i,
        /([0-9]+\.?[0-9]*)/i // Fallback for any number
      ];
      
      let amount: number | undefined;
      for (const pattern of amountPatterns) {
        const match = lowerText.match(pattern) || text.match(pattern);
        if (match) {
          amount = parseFloat(match[1]);
          break;
        }
      }
      
      // Enhanced address extraction
      const addressPatterns = [
        /0x[a-fA-F0-9]{40,42}/,
        /to\s*(0x[a-fA-F0-9]{40,42})/i,
        /(0x[a-fA-F0-9]{40})/i
      ];
      
      let address: string | undefined;
      for (const pattern of addressPatterns) {
        const match = text.match(pattern);
        if (match) {
          address = match[0].startsWith('to') ? match[1] : match[0];
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

  // Auto-restart function with better error handling
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
    }, 300); // Faster restart
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
    
    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = false; // Disable for faster processing
    recognition.lang = currentLanguage;
    recognition.maxAlternatives = 1; // Faster processing
    
    // Add these for better performance
    if ('webkitSpeechRecognition' in window) {
      (recognition as any).webkitGrammar = '';
    }

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
      
      // Process final results
      if (finalTranscript.trim()) {
        const spokenText = finalTranscript.trim();
        setTranscript(spokenText);
        
        // Clear any existing command timeout
        if (commandTimeoutRef.current) {
          clearTimeout(commandTimeoutRef.current);
        }
        
        // Process command immediately for better UX
        commandTimeoutRef.current = setTimeout(() => {
          const command = parseVoiceCommand(spokenText);
          if (command.type !== 'unknown') {
            lastProcessedRef.current = spokenText.toLowerCase().trim();
            setLastCommand(command);
            
            // Clear the processed command after 2 seconds
            setTimeout(() => {
              lastProcessedRef.current = '';
            }, 2000);
          }
        }, 100); // Very fast processing
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      switch (event.error) {
        case 'no-speech':
          // Silent restart for no-speech
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
          // Normal abort, don't show error
          break;
        default:
          restartRecognition();
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      
      // Auto-restart if we should be listening
      if (!isRestartingRef.current) {
        restartRecognition();
      }
    };

    recognitionRef.current = recognition;

    // Auto-start after component mount
    const startTimeout = setTimeout(() => {
      startListening();
    }, 500); // Faster startup

    return () => {
      clearTimeout(startTimeout);
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
  }, [currentLanguage, restartRecognition]);

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
      // Try to restart after a delay
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