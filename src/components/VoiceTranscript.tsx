import React from 'react';
import { Mic, MicOff, RotateCcw, Volume2, Languages } from 'lucide-react';

interface VoiceTranscriptProps {
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

const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({
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
  const getCommandTypeColor = (type: string) => {
    switch (type) {
      case 'balance': return 'text-blue-400';
      case 'send': return 'text-green-400';
      case 'connect': return 'text-purple-400';
      case 'disconnect': return 'text-red-400';
      case 'account': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-purple-800/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Volume2 className="w-6 h-6 text-cyan-400" />
          Voice Commands
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-400" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-gray-800 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:border-purple-400 focus:outline-none"
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">हिंदी (Hindi)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
          {isListening && (
            <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-400">Listening</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="bg-red-600/20 border border-red-600/30 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-sm">⚠️ {error}</span>
            </div>
          </div>
        )}
        
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 min-h-[120px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Live Transcript</span>
            {isListening && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">Listening</span>
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
                {isListening ? 'Say a command...' : 'Starting voice recognition...'}
              </p>
            )}
            
            {lastCommand && lastCommand.type !== 'unknown' && (
              <div className="mt-3 p-2 bg-gray-700/50 rounded-lg border-l-4 border-cyan-400">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">Last Command:</span>
                  <span className={`text-xs font-semibold ${getCommandTypeColor(lastCommand.type)}`}>
                    {lastCommand.type.toUpperCase()}
                  </span>
                </div>
                {lastCommand.amount && (
                  <p className="text-xs text-gray-300">Amount: {lastCommand.amount} ETH</p>
                )}
                {lastCommand.address && (
                  <p className="text-xs text-gray-300">To: {lastCommand.address.slice(0, 10)}...{lastCommand.address.slice(-6)}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={isListening ? onStop : onStart}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Listening
              </>
            )}
          </button>
          <button
            onClick={() => {
              onStop();
              setTimeout(() => onStart(), 500);
            }}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-4">
            <h3 className="text-blue-400 font-semibold mb-2">English Commands:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• "Connect" / "Connect wallet"</li>
              <li>• "Balance" / "Check balance"</li>
              <li>• "Send 0.01 ETH to 0x123..."</li>
              <li>• "Account" / "Show account"</li>
              <li>• "Disconnect"</li>
            </ul>
          </div>
          <div className="bg-green-600/10 border border-green-600/20 rounded-xl p-4">
            <h3 className="text-green-400 font-semibold mb-2">हिंदी कमांड:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• "कनेक्ट" / "कनेक्ट करो"</li>
              <li>• "बैलेंस" / "चेक करो"</li>
              <li>• "0.01 ईटीएच भेजो 0x123..."</li>
              <li>• "अकाउंट" / "अकाउंट दिखाओ"</li>
              <li>• "डिस्कनेक्ट"</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-purple-600/10 border border-purple-600/20 rounded-xl p-4">
          <h3 className="text-purple-400 font-semibold mb-2">💡 Pro Tips:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Speak clearly - single words work best</li>
            <li>• Commands are processed instantly</li>
            <li>• Balance shows 0 if insufficient funds</li>
            <li>• Disconnect is instant - no delay</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceTranscript;