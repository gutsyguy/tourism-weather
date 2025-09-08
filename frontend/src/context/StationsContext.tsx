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
}

const StationsContext = createContext<StationsContextType | undefined>(
  undefined
);

export const StationsProvider = ({ children }: { children: ReactNode }) => {
  const [stations, setStations] = useState<Stations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError((err as Error).message);
        retryTimeout = setTimeout(fetchStations, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (!stations) fetchStations();

    return () => clearTimeout(retryTimeout);
  }, [stations]);

  return (
    <StationsContext.Provider value={{ stations, loading, error }}>
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
