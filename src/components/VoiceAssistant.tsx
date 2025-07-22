import React from 'react';
import { Mic, MicOff, RotateCcw, Volume2, Languages, Brain, Zap } from 'lucide-react';

interface VoiceAssistantProps {
  isListening: boolean;
  transcript: string;
  currentLanguage: string;
  lastCommand: any;
  error: string;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onLanguageChange: (lang: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isListening,
  transcript,
  currentLanguage,
  lastCommand,
  error,
  onStart,
  onStop,
  onReset,
  onLanguageChange
}) => {
  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Español (Spanish)', flag: '🇪🇸' },
    { code: 'de-DE', name: 'Deutsch (German)', flag: '🇩🇪' },
    { code: 'pt-BR', name: 'Português (Portuguese)', flag: '🇧🇷' },
    { code: 'fr-FR', name: 'Français (French)', flag: '🇫🇷' },
    { code: 'it-IT', name: 'Italiano (Italian)', flag: '🇮🇹' },
    { code: 'ja-JP', name: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'ko-KR', name: '한국어 (Korean)', flag: '🇰🇷' },
  ];

  const getCommandTypeColor = (type: string) => {
    switch (type) {
      case 'balance': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'send': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'connect': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'disconnect': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'account': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Voice Assistant</h2>
            <p className="text-gray-400 text-sm">Jarvis-powered commands</p>
          </div>
        </div>
        
        {isListening && (
          <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-2 rounded-full border border-red-500/30">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-sm font-medium">LISTENING</span>
          </div>
        )}
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Languages className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm">Language</span>
        </div>
        <select
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="text-red-400 text-sm">⚠️ {error}</span>
          </div>
        </div>
      )}

      {/* Transcript Display */}
      <div className="mb-6">
        <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-700/50 min-h-[120px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Live Transcript</span>
            </div>
            {isListening && (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-6 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-7 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span className="text-green-400 text-xs">ACTIVE</span>
              </div>
            )}
            <button
              onClick={onReset}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-white">
            {transcript ? (
              <p className="leading-relaxed">{transcript}</p>
            ) : (
              <p className="text-gray-500 italic">
                {isListening ? 'Listening for your command...' : 'Click start to begin voice recognition'}
              </p>
            )}
          </div>
        </div>

        {/* Last Command Display */}
        {lastCommand && lastCommand.type !== 'unknown' && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-xl border-l-4 border-cyan-400">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Last Command Processed:</span>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getCommandTypeColor(lastCommand.type)}`}>
                {lastCommand.type.toUpperCase()}
              </div>
            </div>
            {lastCommand.amount && (
              <p className="text-xs text-gray-300 mb-1">Amount: {lastCommand.amount} ETH</p>
            )}
            {lastCommand.address && (
              <p className="text-xs text-gray-300">To: {lastCommand.address.slice(0, 10)}...{lastCommand.address.slice(-6)}</p>
            )}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={isListening ? onStop : onStart}
          className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
            isListening
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
              : 'bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5" />
              <span>Stop Listening</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span>Start Listening</span>
            </>
          )}
        </button>
        
        <button
          onClick={() => {
            onStop();
            setTimeout(() => onStart(), 500);
          }}
          className="px-4 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Command Examples */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-blue-400" />
            <h3 className="text-blue-400 font-semibold">Voice Commands</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <p className="text-gray-300">• "Connect wallet"</p>
              <p className="text-gray-300">• "Check balance"</p>
              <p className="text-gray-300">• "Show my account"</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300">• "Send 0.01 ETH to 0x..."</p>
              <p className="text-gray-300">• "Disconnect wallet"</p>
              <p className="text-gray-300">• "What's my balance?"</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-4 h-4 text-purple-400" />
            <h3 className="text-purple-400 font-semibold">AI Features</h3>
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Natural language processing</li>
            <li>• Multi-language support (10+ languages)</li>
            <li>• Context-aware responses</li>
            <li>• Real-time voice feedback</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;