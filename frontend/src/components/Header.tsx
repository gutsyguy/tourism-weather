"use client";

import { useIsClient } from "@/hooks/useIsClientHook";

export const Header = () => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">
          Station Weather & Tourist Attractions
        </h1>
      </div>
    </header>
  );
};
