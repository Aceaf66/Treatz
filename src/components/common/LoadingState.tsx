import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  id?: string;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  id = 'loading-state', 
  message = 'Fetching fresh nutrition for your pets...' 
}) => {
  return (
    <div id={id} className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-purple-100 border-t-[#4A154B] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm">🐾</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mt-4 animate-pulse">{message}</p>
    </div>
  );
};
