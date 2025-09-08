"use client";

import { useIsClient } from "@/hooks/useIsClientHook";

interface LoadingSpinnerProps {
  message?: string;
  retryCount?: number;
  maxRetries?: number;
}

export const LoadingSpinner = ({ 
  message = "Loading stations...", 
  retryCount = 0,
  maxRetries = 5 
}: LoadingSpinnerProps) => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-50">
      <div className="relative">
        {/* Spinning circle */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-gray-700 mb-2">{message}</p>
        {retryCount > 0 && (
          <p className="text-sm text-gray-500">
            Retry attempt {retryCount} of {maxRetries}
          </p>
        )}
        {retryCount >= maxRetries && (
          <p className="text-sm text-red-500 mt-2">
            Reloading page automatically...
          </p>
        )}
      </div>
    </div>
  );
};
