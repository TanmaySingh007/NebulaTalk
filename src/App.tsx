import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WalletDashboard from './components/WalletDashboard';
import VoiceAssistant from './components/VoiceAssistant';
import TradingView from './components/TradingView';
import AIInsights from './components/AIInsights';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { useWallet } from './hooks/useWallet';
import { useSoundEffects } from './hooks/useSoundEffects';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  
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

  const { playStartupSound, playCommandSound, playSuccessSound, playErrorSound } = useSoundEffects();

  const [status, setStatus] = useState('Initializing Nebula AI...');

  // Loading sequence with Jarvis-like startup
  useEffect(() => {
    const loadingSequence = async () => {
      setStatus('Initializing Nebula AI...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('Loading neural networks...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStatus('Calibrating voice recognition...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStatus('Connecting to blockchain...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStatus('System ready. Welcome to Nebula Talk.');
      playStartupSound();
      
      setTimeout(() => {
        setIsLoading(false);
        startListening();
      }, 1000);
    };

    loadingSequence();
  }, [playStartupSound, startListening]);

  // Voice command processing
  useEffect(() => {
    if (!lastCommand || lastCommand.type === 'unknown') {
      if (lastCommand?.originalText && lastCommand.originalText.length > 3) {
        setStatus(`Command not recognized: "${lastCommand.originalText}"`);
        playErrorSound();
      }
      return;
    }

    playCommandSound();
    const { type, amount, address, originalText } = lastCommand;
    
    switch (type) {
      case 'connect':
        if (!isConnecting && !isConnected) {
          connect();
          setStatus('Connecting to MetaMask wallet...');
        } else if (isConnected) {
          setStatus('Wallet already connected');
          playSuccessSound();
        }
        break;
        
      case 'balance':
        if (isConnected) {
          setStatus(`Current balance: ${balance} ETH`);
          checkBalance();
          playSuccessSound();
        } else {
          setStatus('Please connect wallet first');
          playErrorSound();
        }
        break;
        
      case 'send':
        if (isConnected && amount) {
          const balanceNum = parseFloat(balance);
          if (balanceNum === 0) {
            setStatus('Insufficient balance');
            playErrorSound();
            break;
          }
          if (amount > balanceNum) {
            setStatus(`Insufficient balance. Available: ${balance} ETH`);
            playErrorSound();
            break;
          }
          
          if (address) {
            setStatus(`Sending ${amount} ETH to ${address.slice(0, 10)}...`);
            sendETHToAddress(amount, address)
              .then((txHash) => {
                setStatus(`Transaction successful! Hash: ${txHash?.slice(0, 10)}...`);
                playSuccessSound();
              })
              .catch(() => {
                setStatus('Transaction failed');
                playErrorSound();
              });
          } else {
            setStatus(`Sending ${amount} ETH...`);
            sendETH(amount);
          }
        } else if (!isConnected) {
          setStatus('Please connect wallet first');
          playErrorSound();
        }
        break;
        
      case 'disconnect':
        if (isConnected) {
          disconnect();
          setStatus('Wallet disconnected');
          playSuccessSound();
        } else {
          setStatus('No wallet connected');
        }
        break;
        
      case 'account':
        if (isConnected && address) {
          setStatus(`Address: ${address.slice(0, 10)}...${address.slice(-6)}`);
          navigator.clipboard.writeText(address);
          playSuccessSound();
        } else {
          setStatus('Please connect wallet first');
          playErrorSound();
        }
        break;
    }
  }, [lastCommand, connect, checkBalance, sendETH, sendETHToAddress, disconnect, isConnecting, isConnected, address, balance, playCommandSound, playSuccessSound, playErrorSound]);

  if (isLoading) {
    return <LoadingScreen status={status} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300D4FF%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 animate-gradient-x"></div>
      </div>
      
      <div className="relative z-10">
        <Header 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          isConnected={isConnected}
          address={address}
        />
        
        <main className="container mx-auto px-4 py-8">
          {activeSection === 'dashboard' && (
            <>
              <Hero status={status} />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-12">
                <div className="xl:col-span-2 space-y-8">
                  <WalletDashboard
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
                  <TradingView />
                </div>
                <div className="space-y-8">
                  <VoiceAssistant
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
                  <AIInsights />
                </div>
              </div>
            </>
          )}
          
          {activeSection === 'trading' && <TradingView />}
          {activeSection === 'ai' && <AIInsights />}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;