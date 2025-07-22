import React from 'react';
import { Activity, Zap, Brain, Mic } from 'lucide-react';

interface HeroProps {
  status: string;
}

const Hero: React.FC<HeroProps> = ({ status }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20 p-8 mb-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 mb-8 lg:mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
                <Brain className="w-8 h-8 text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <Mic className="w-8 h-8 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                <span className="text-green-400 text-sm font-medium">AI ACTIVE</span>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Voice-Powered
              </span>
              <br />
              <span className="text-white">Crypto Trading</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-6 max-w-2xl">
              Experience the future of cryptocurrency trading with advanced AI voice commands, 
              real-time market analysis, and seamless Web3 integration.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-xl border border-gray-700">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Multi-Language Support</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-xl border border-gray-700">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">AI-Powered Insights</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-xl border border-gray-700">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-300">Instant Execution</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative">
              {/* Status display */}
              <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 min-w-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">System Status</h3>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Neural Network</span>
                    <span className="text-green-400 text-sm">ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Voice Recognition</span>
                    <span className="text-green-400 text-sm">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Blockchain</span>
                    <span className="text-green-400 text-sm">CONNECTED</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 text-sm font-medium">Current Status</span>
                  </div>
                  <p className="text-white text-sm">{status}</p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400/30 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;