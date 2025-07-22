import React from 'react';
import { Zap, Brain, Cpu, Wifi } from 'lucide-react';

interface LoadingScreenProps {
  status: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ status }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-50">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2300D4FF%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center">
        {/* Main logo */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
                <Zap className="w-12 h-12 text-cyan-400 animate-pulse" />
              </div>
            </div>
            
            {/* Orbiting icons */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
              <Brain className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-6 h-6 text-purple-400" />
              <Cpu className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-6 h-6 text-blue-400" />
              <Wifi className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-6 h-6 text-green-400" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
            NEBULA TALK
          </h1>
          <p className="text-xl text-gray-300 mb-8">Advanced AI-Powered Crypto Assistant</p>
        </div>

        {/* Loading progress */}
        <div className="w-96 mx-auto mb-8">
          <div className="bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full animate-pulse" 
                 style={{ width: '100%', animation: 'loading 3s ease-in-out infinite' }}></div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <p className="text-cyan-400 text-lg font-medium animate-pulse">{status}</p>
        </div>

        {/* System info */}
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto text-sm text-gray-400">
          <div className="text-center">
            <Brain className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <p>Neural AI</p>
          </div>
          <div className="text-center">
            <Cpu className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <p>Quantum Core</p>
          </div>
          <div className="text-center">
            <Wifi className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <p>Blockchain</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;