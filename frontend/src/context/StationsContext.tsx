"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Stations } from "@/types/station";

interface StationsContextType {
  stations: Stations | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
}

const StationsContext = createContext<StationsContextType | undefined>(
  undefined
);

export const StationsProvider = ({ children }: { children: ReactNode }) => {
  const [stations, setStations] = useState<Stations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 5;

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    let retryTimeout: NodeJS.Timeout;

    const fetchStations = async () => {
      try {
        const res = await fetch(`${url}/api/station`);
        if (!res.ok) throw new Error(`Response status: ${res.status}`);

        const result: Stations = await res.json();

        if (!result || Object.keys(result).length === 0) {
          throw new Error("Stations data is empty or corrupted");
        }

        setStations(result);
        setError(null);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        setError((err as Error).message);
        
        if (newRetryCount >= MAX_RETRIES) {
          // Auto-reload the page after 5 failed attempts
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          // Continue retrying with exponential backoff
          const delay = Math.min(2000 * Math.pow(2, newRetryCount - 1), 10000);
          retryTimeout = setTimeout(fetchStations, delay);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!stations) fetchStations();

    return () => clearTimeout(retryTimeout);
  }, [stations, retryCount]);

  return (
    <StationsContext.Provider value={{ stations, loading, error, retryCount }}>
      {children}
    </StationsContext.Provider>
  );
};

export const useStations = () => {
  const context = useContext(StationsContext);
  if (!context)
    throw new Error("useStations must be used within a StationsProvider");
  return context;
};
