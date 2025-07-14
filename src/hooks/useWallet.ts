import { useState, useCallback, useRef } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0.0');
  const [address, setAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  // Cache balance to avoid repeated API calls
  const balanceCache = useRef<{ balance: string; timestamp: number } | null>(null);
  const CACHE_DURATION = 10000; // 10 seconds cache

  const checkBalance = useCallback(async () => {
    if (!isConnected || !address || !window.ethereum) {
      setBalance('0.0000');
      return;
    }

    // Check cache first for instant response
    const now = Date.now();
    if (balanceCache.current && (now - balanceCache.current.timestamp) < CACHE_DURATION) {
      setBalance(balanceCache.current.balance);
      return;
    }

    try {
      setError(''); // Clear any previous errors
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      const formattedBalance = parseFloat(balanceEth).toFixed(4);
      
      // Update cache
      balanceCache.current = {
        balance: formattedBalance,
        timestamp: now
      };
      
      setBalance(formattedBalance);
    } catch (err: any) {
      console.error('Error checking balance:', err);
      setBalance('0.0000');
      setError('Failed to check balance');
    }
  }, [address, isConnected]);

  const disconnect = useCallback(() => {
    // Instant disconnect - no async operations
    setIsConnected(false);
    setAddress('');
    setBalance('0.0');
    setError('');
    
    // Clear cache
    balanceCache.current = null;
    
    // Remove event listeners
    if (window.ethereum) {
      try {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      } catch (e) {
        // Ignore errors during cleanup
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      setIsConnecting(true);
      setError('');

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        setError('No accounts found. Please make sure MetaMask is unlocked.');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      
      // Get balance
      const balanceWei = await provider.getBalance(userAddress);
      const balanceEth = ethers.formatEther(balanceWei);
      const formattedBalance = parseFloat(balanceEth).toFixed(4);

      setAddress(userAddress);
      setBalance(formattedBalance);
      setIsConnected(true);
      
      // Cache the balance
      balanceCache.current = {
        balance: formattedBalance,
        timestamp: Date.now()
      };

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
          checkBalance();
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

    } catch (err: any) {
      console.error('Error connecting to MetaMask:', err);
      if (err.code === 4001) {
        setError('❌ Connection rejected by user.');
      } else {
        setError('❌ Failed to connect to MetaMask. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [checkBalance, disconnect]);

  const sendETH = useCallback(async (amount: number) => {
    if (!isConnected || !window.ethereum) {
      setError('❌ Wallet not connected');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // For demo purposes, we'll send to a burn address
      // In production, this would use the recipient address from voice command
      const tx = await signer.sendTransaction({
        to: '0x0000000000000000000000000000000000000000', // Burn address for demo
        value: ethers.parseEther(amount.toString()),
      });

      // Wait for transaction to be mined
      await tx.wait();
      
      // Refresh balance after transaction
      await checkBalance();
      
    } catch (err: any) {
      console.error('Error sending ETH:', err);
      if (err.code === 4001) {
        setError('❌ Transaction rejected by user.');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        setError('❌ Insufficient funds for transaction.');
      } else {
        setError('❌ Failed to send ETH. Please try again.');
      }
    }
  }, [isConnected, checkBalance]);

  const sendETHToAddress = useCallback(async (amount: number, recipient: string) => {
    if (!isConnected || !window.ethereum) {
      setError('Wallet not connected');
      return;
    }

    // Validate Ethereum address
    if (!ethers.isAddress(recipient)) {
      setError('Invalid recipient address');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount.toString()),
      });

      // Wait for transaction to be mined
      await tx.wait();
      
      // Refresh balance after transaction
      await checkBalance();
      
      return tx.hash;
      
    } catch (err: any) {
      console.error('Error sending ETH:', err);
      if (err.code === 4001) {
        setError('❌ Transaction rejected by user.');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        setError('❌ Insufficient funds for transaction.');
      } else {
        setError('❌ Failed to send ETH. Please try again.');
      }
      throw err;
    }
  }, [isConnected, checkBalance]);

  return {
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
  };
};