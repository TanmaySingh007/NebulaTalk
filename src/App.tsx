import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WalletConnect from './components/WalletConnect';
import VoiceTranscript from './components/VoiceTranscript';
import StatusSection from './components/StatusSection';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { useWallet } from './hooks/useWallet';

function App() {
  const { 
    isListening, 
    transcript, 
    currentLanguage,
    lastCommand,
    error: voiceError,
    startListening, 
    stopListening,
    resetTranscript,
    setCurrentLanguage
  } = useVoiceRecognition();
  
  const { 
    isConnected, 
    balance, 
    address, 
    isConnecting,
    error,
    connect, 
    disconnect,
    sendETH,
    sendETHToAddress,
    checkBalance 
  } = useWallet();

  const [status, setStatus] = useState('Ready to connect wallet and start voice commands');

  // Voice command processing with better error handling
  useEffect(() => {
    if (!lastCommand || lastCommand.type === 'unknown') {
      if (lastCommand?.originalText && lastCommand.originalText.length > 3) {
        setStatus(`❓ Command not recognized: "${lastCommand.originalText}". Try: "connect wallet", "check balance", or "send ETH"`);
      }
      return;
    }

    const { type, amount, address, originalText } = lastCommand;
    
    switch (type) {
      case 'connect':
        if (!isConnecting && !isConnected) {
          connect();
          setStatus(`🔗 Connecting wallet...`);
        } else if (isConnected) {
          setStatus(`✅ Wallet already connected`);
        } else if (isConnecting) {
          setStatus(`⏳ Connection in progress...`);
        }
        break;
        
      case 'balance':
        if (isConnected) {
          setStatus(`💰 Balance: ${balance} ETH`);
          checkBalance();
        } else {
          setStatus(`❌ Please connect wallet first`);
        }
        break;
        
      case 'send':
        if (isConnected && amount) {
          const balanceNum = parseFloat(balance);
          if (balanceNum === 0) {
            setStatus(`❌ Insufficient balance (0 ETH)`);
            break;
          }
          if (amount > balanceNum) {
            setStatus(`❌ Insufficient balance (${balance} ETH available)`);
            break;
          }
          
          if (address) {
            // Send to the specified address from voice command
            setStatus(`💸 Sending ${amount} ETH...`);
            sendETHToAddress(amount, address)
              .then((txHash) => {
                setStatus(`✅ Sent ${amount} ETH! TX: ${txHash?.slice(0, 10)}...`);
              })
              .catch(() => {
                setStatus(`❌ Transaction failed or rejected`);
              });
          } else {
            // No address specified, use default demo behavior
            setStatus(`💸 Sending ${amount} ETH to demo address...`);
            sendETH(amount);
          }
        } else if (!isConnected) {
          setStatus(`❌ Please connect wallet first`);
        } else {
          setStatus(`❌ Invalid amount specified`);
        }
        break;
        
      case 'disconnect':
        if (isConnected) {
          disconnect();
          setStatus(`✅ Wallet disconnected`);
        } else {
          setStatus(`ℹ️ No wallet connected`);
        }
        break;
        
      case 'account':
        if (isConnected && address) {
          setStatus(`📋 Address: ${address.slice(0, 10)}...${address.slice(-6)}`);
          // Copy to clipboard
          navigator.clipboard.writeText(address).then(() => {
            setTimeout(() => {
              setStatus(`📋 Address copied to clipboard`);
            }, 1000);
          });
        } else {
          setStatus(`❌ Please connect wallet first`);
        }
        break;
    }
  }, [lastCommand, connect, checkBalance, sendETH, sendETHToAddress, disconnect, isConnecting, isConnected, address]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <WalletConnect
                isConnected={isConnected}
                balance={balance}
                address={address}
                isConnecting={isConnecting}
                error={error}
                onConnect={connect}
                onDisconnect={disconnect}
                onSendETH={sendETH}
                onCheckBalance={checkBalance}
                setStatus={setStatus}
              />
              
              <StatusSection status={status} />
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <VoiceTranscript
                isListening={isListening}
                transcript={transcript}
                currentLanguage={currentLanguage}
                lastCommand={lastCommand}
                error={voiceError}
                onStart={startListening}
                onStop={stopListening}
                onReset={resetTranscript}
                onLanguageChange={setCurrentLanguage}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;