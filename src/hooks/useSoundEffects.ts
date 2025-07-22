import { useCallback } from 'react';

export const useSoundEffects = () => {
  // Create audio context for better performance
  const createAudioContext = useCallback(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      return new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return null;
  }, []);

  // Generate different tones for different actions
  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const audioContext = createAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [createAudioContext]);

  // Jarvis-like startup sound
  const playStartupSound = useCallback(() => {
    try {
      // Play a sequence of tones to mimic Jarvis startup
      setTimeout(() => playTone(440, 0.2, 'sine'), 0);
      setTimeout(() => playTone(554, 0.2, 'sine'), 200);
      setTimeout(() => playTone(659, 0.3, 'sine'), 400);
      setTimeout(() => playTone(880, 0.4, 'sine'), 700);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, [playTone]);

  // Command recognition sound
  const playCommandSound = useCallback(() => {
    try {
      playTone(800, 0.1, 'square');
    } catch (error) {
      console.log('Audio not supported');
    }
  }, [playTone]);

  // Success sound
  const playSuccessSound = useCallback(() => {
    try {
      setTimeout(() => playTone(523, 0.15, 'sine'), 0);
      setTimeout(() => playTone(659, 0.15, 'sine'), 150);
      setTimeout(() => playTone(784, 0.2, 'sine'), 300);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, [playTone]);

  // Error sound
  const playErrorSound = useCallback(() => {
    try {
      setTimeout(() => playTone(300, 0.2, 'sawtooth'), 0);
      setTimeout(() => playTone(250, 0.2, 'sawtooth'), 200);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, [playTone]);

  // Notification sound
  const playNotificationSound = useCallback(() => {
    try {
      playTone(1000, 0.1, 'sine');
    } catch (error) {
      console.log('Audio not supported');
    }
  }, [playTone]);

  return {
    playStartupSound,
    playCommandSound,
    playSuccessSound,
    playErrorSound,
    playNotificationSound
  };
};