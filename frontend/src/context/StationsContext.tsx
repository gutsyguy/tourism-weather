// context/StationsContext.tsx
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
    if (stations) return; // already fetched
    const fetchStations = async () => {
      try {
        const res = await fetch(
          "https://tourism-weather-production.up.railway.app/api/station"
        );
        if (!res.ok) throw new Error(`Response status: ${res.status}`);
        const result = await res.json();
        setStations(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
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
