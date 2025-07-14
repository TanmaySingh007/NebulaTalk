import React from 'react';
import { Wallet, Send, RefreshCw, LogOut, Zap, AlertCircle, Loader2 } from 'lucide-react';

interface WalletConnectProps {
  isConnected: boolean;
  balance: string;
  address: string;
  isConnecting: boolean;
  error: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onSendETH: (amount: number) => void;
  onCheckBalance: () => void;
  setStatus: (status: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  isConnected,
  balance,
  address,
  isConnecting,
  error,
  onConnect,
  onDisconnect,
  onSendETH,
  onCheckBalance,
  setStatus
}) => {
  const handleSendETH = () => {
    onSendETH(0.001); // Reduced amount for testing
    setStatus('Sending 0.001 ETH...');
  };

  const handleCheckBalance = () => {
    onCheckBalance();
    setStatus('Checking balance...');
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-purple-800/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-6 h-6 text-purple-400" />
          MetaMask Wallet
        </h2>
        {isConnected && (
          <div className="flex items-center gap-2 bg-green-600/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Connected</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {!isConnected ? (
        <div className="text-center py-8">
          <Wallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">
            Connect your MetaMask wallet to get started
          </p>
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                Connect MetaMask
              </>
            )}
          </button>
          {!window.ethereum && (
            <p className="text-gray-500 text-sm mt-4">
              Don't have MetaMask?{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Install it here
              </a>
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Balance</span>
              <button
                onClick={handleCheckBalance}
                className="text-purple-400 hover:text-purple-300 p-1 rounded-lg hover:bg-purple-400/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              {balance} ETH
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <span className="text-gray-400">Address</span>
            <div className="text-sm text-white font-mono mt-1 flex items-center justify-between">
              <span>{formatAddress(address)}</span>
              <button
                onClick={() => navigator.clipboard.writeText(address)}
                className="text-purple-400 hover:text-purple-300 text-xs px-2 py-1 rounded hover:bg-purple-400/10 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSendETH}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send 0.001 ETH
            </button>
            <button
              onClick={onDisconnect}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-3 rounded-xl font-semibold transition-all duration-200 border border-red-600/30 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-xl p-3">
            <p className="text-yellow-400 text-xs">
              <strong>💡 Voice Commands:</strong> Say "Connect wallet", "Check balance", "Send 0.01 ETH to 0x123...", or "Show my account" for hands-free control!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;