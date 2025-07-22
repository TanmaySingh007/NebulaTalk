import React, { useState } from 'react';
import { Wallet, Send, RefreshCw, LogOut, Zap, AlertCircle, Loader2, Copy, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';

interface WalletDashboardProps {
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

const WalletDashboard: React.FC<WalletDashboardProps> = ({
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
  const [showBalance, setShowBalance] = useState(true);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const handleSendETH = () => {
    const amount = parseFloat(sendAmount);
    if (amount > 0) {
      onSendETH(amount);
      setStatus(`Sending ${amount} ETH...`);
      setSendAmount('');
      setRecipientAddress('');
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setStatus('Address copied to clipboard');
  };

  // Mock portfolio data
  const portfolioData = [
    { symbol: 'ETH', name: 'Ethereum', balance: balance, value: (parseFloat(balance) * 2340).toFixed(2), change: '+5.2%', positive: true },
    { symbol: 'BTC', name: 'Bitcoin', balance: '0.0234', value: '1,234.56', change: '+2.1%', positive: true },
    { symbol: 'USDC', name: 'USD Coin', balance: '500.00', value: '500.00', change: '0.0%', positive: true },
  ];

  if (!isConnected) {
    return (
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-spin opacity-20"></div>
            <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Connect your MetaMask wallet to start trading with voice commands and access advanced AI features.
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}
          
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3 mx-auto"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                <span>Connect MetaMask</span>
              </>
            )}
          </button>
          
          {!window.ethereum && (
            <p className="text-gray-500 text-sm mt-6">
              Don't have MetaMask?{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Install it here
              </a>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Portfolio</h2>
              <p className="text-gray-400">Total Balance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              {showBalance ? <Eye className="w-4 h-4 text-gray-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
            </button>
            <button
              onClick={onCheckBalance}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-4xl font-bold text-white mb-2">
            {showBalance ? (
              <>
                <Zap className="inline w-8 h-8 text-yellow-400 mr-2" />
                {balance} ETH
              </>
            ) : (
              '••••••••'
            )}
          </div>
          <div className="text-gray-400">
            ≈ ${showBalance ? (parseFloat(balance) * 2340).toFixed(2) : '••••••'} USD
          </div>
        </div>

        <div className="bg-black/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Wallet Address</span>
            <button
              onClick={copyAddress}
              className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copy</span>
            </button>
          </div>
          <div className="text-white font-mono text-sm break-all">
            {address}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onDisconnect}
            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border border-red-500/30 flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>

      {/* Portfolio Assets */}
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/30">
        <h3 className="text-xl font-bold text-white mb-6">Your Assets</h3>
        <div className="space-y-4">
          {portfolioData.map((asset, index) => (
            <div key={asset.symbol} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{asset.symbol}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{asset.name}</div>
                  <div className="text-gray-400 text-sm">{asset.balance} {asset.symbol}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-semibold">${asset.value}</div>
                <div className={`text-sm flex items-center space-x-1 ${asset.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{asset.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Send */}
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/30">
        <h3 className="text-xl font-bold text-white mb-6">Quick Send</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Amount (ETH)</label>
            <input
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              placeholder="0.001"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Recipient Address</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSendETH}
            disabled={!sendAmount || parseFloat(sendAmount) <= 0}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send ETH</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;