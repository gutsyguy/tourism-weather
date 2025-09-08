// Map.tsx
"use client";

import { useMap } from "@/context/MapContext";
import { useStations } from "@/context/StationsContext";
import { Station, Stations } from "@/types/station";
import { useEffect, useState, useRef, useMemo } from "react";
import Modal from "./Modal";
import { LoadingSpinner } from "./LoadingSpinner";

export const Map = () => {
  const { map, isLoaded, error } = useMap();
  const { stations, loading, retryCount } = useStations();
  const [isClient, setIsClient] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getStationsInViewport = (
    stations: Stations["data"],
    map: google.maps.Map,
    maxPerCell = 3,
    gridSize = 15
  ): Station[] => {
    if (!map) return [];

    const bounds = map.getBounds();
    if (!bounds) return [];

    const grid: Record<string, Station[]> = {};

    stations.forEach((s) => {
      const { latitude, longitude } = s;
      if (typeof latitude !== "number" || typeof longitude !== "number") return;

      const latLng = new google.maps.LatLng(latitude, longitude);
      if (!bounds.contains(latLng)) return;

      const key = `${Math.floor(latitude / gridSize)}_${Math.floor(
        longitude / gridSize
      )}`;
      if (!grid[key]) grid[key] = [];
      if (grid[key].length < maxPerCell) grid[key].push(s);
    });

    return Object.values(grid).flat();
  };

  const visibleStations = useMemo(() => {
    if (!map || !stations?.data?.length) return [];
    return getStationsInViewport(stations.data, map, 4);
  }, [stations?.data, map]);

  useEffect(() => {
    if (!isClient || !map || !isLoaded || loading || !stations?.data.length)
      return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const newMarkers = visibleStations.map((station) => {
      const marker = new google.maps.Marker({
        position: { lat: station.latitude, lng: station.longitude },
        map,
        title: station.station_name || "Station",
      });

      marker.addListener("click", () => setSelectedStation(station));

      return marker;
    });

    markersRef.current = newMarkers;

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, isLoaded, isClient, stations, loading, visibleStations]);

  useEffect(() => {
    const reverseGeoCoding = async (station: Station) => {
      const lat = station.latitude;
      const lng = station.longitude;

      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();

        if (data.status === "OK" && data.results.length > 0) {
          const components = data.results[0].address_components;

          const city = components.find(
            (c: { long_name: string; short_name: string; types: string[] }) =>
              c.types.includes("locality")
          )?.long_name;

          const state = components.find(
            (c: { long_name: string; short_name: string; types: string[] }) =>
              c.types.includes("administrative_area_level_1")
          )?.long_name;

          const country = components.find(
            (c: { long_name: string; short_name: string; types: string[] }) =>
              c.types.includes("country")
          )?.long_name;

          setCity(city || "");
          setState(state || "");
          setCountry(country || "");
        }
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      }
    };

    if (selectedStation) {
      reverseGeoCoding(selectedStation);
    }
  }, [selectedStation]);

  if (!isClient)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        Loading map...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col">
        Map Error: {error}
      </div>
    );

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        Loading Google Maps...
      </div>
    );

  // Show loading spinner when stations are being fetched
  if (loading && !stations)
    return (
      <LoadingSpinner 
        message="Loading weather stations..." 
        retryCount={retryCount}
        maxRetries={5}
      />
    );

  return (
    <>
      {selectedStation && (
        <Modal
          station={selectedStation}
          setStation={setSelectedStation}
          city={city}
          state={state}
          country={country}
        />
      )}
    </>
  );
};
