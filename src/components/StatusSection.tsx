import React from 'react';
import { Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface StatusSectionProps {
  status: string;
}

const StatusSection: React.FC<StatusSectionProps> = ({ status }) => {
  const getStatusIcon = (statusText: string) => {
    if (statusText.includes('success') || statusText.includes('connected') || statusText.includes('completed') || statusText.includes('✅')) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else if (statusText.includes('error') || statusText.includes('failed') || statusText.includes('❌')) {
      return <AlertCircle className="w-5 h-5 text-red-400" />;
    } else if (statusText.includes('processing') || statusText.includes('sending') || statusText.includes('checking') || statusText.includes('🎤')) {
      return <Clock className="w-5 h-5 text-yellow-400 animate-spin" />;
    }
    return <Activity className="w-5 h-5 text-blue-400" />;
  };

  const getStatusColor = (statusText: string) => {
    if (statusText.includes('success') || statusText.includes('connected') || statusText.includes('completed') || statusText.includes('✅')) {
      return 'border-green-600/30 bg-green-600/10';
    } else if (statusText.includes('error') || statusText.includes('failed') || statusText.includes('❌')) {
      return 'border-red-600/30 bg-red-600/10';
    } else if (statusText.includes('processing') || statusText.includes('sending') || statusText.includes('checking') || statusText.includes('🎤')) {
      return 'border-yellow-600/30 bg-yellow-600/10';
    }
    return 'border-blue-600/30 bg-blue-600/10';
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-purple-800/30 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
        <Activity className="w-6 h-6 text-green-400" />
        Status
      </h2>
      
      <div className={`rounded-xl p-4 border ${getStatusColor(status)}`}>
        <div className="flex items-start gap-3">
          {getStatusIcon(status)}
          <div>
            <p className="text-white font-medium">{status}</p>
            <p className="text-gray-400 text-sm mt-1">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSection;