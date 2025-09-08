"use client";

import { useMap } from "@/context/MapContext";
import { useStations } from "@/context/StationsContext";
import { Station, StationData, Stations } from "@/types/station";
import { useEffect, useState, useRef, useMemo } from "react";
import Modal from "./Modal";

export const Map = () => {
  const { map, isLoaded, error } = useMap();
  const { stations, loading } = useStations();
  const [isClient, setIsClient] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null); // <-- Selected station
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [data, setData] = useState<StationData | null>(null);

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

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const newMarkers = visibleStations.map((station) => {
      const marker = new google.maps.Marker({
        position: { lat: station.latitude, lng: station.longitude },
        map,
        title: station.station_name || "Station",
      });

      // Open React modal instead of InfoWindow
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
          )?.short_name; // or long_name if you prefer full state name

          const country = components.find(
            (c: { long_name: string; short_name: string; types: string[] }) =>
              c.types.includes("country")
          )?.long_name;

          console.log("City:", city);
          console.log("State:", state);
          console.log("Country:", country);

          setCity(city);
          setState(state);
          setCountry(country);
        }
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      }
    };

    if (selectedStation) {
      reverseGeoCoding(selectedStation);
    }
  }, [selectedStation]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) return;
    if (!selectedStation) return;
    const fetchStationData = async () => {
      try {
        const res = await fetch(
          `${url}/api/stations/${selectedStation.station_id}/weather`
        );
        if (!res.ok) throw new Error(`Response status: ${res.status}`);
        const result = await res.json();
        console.log(result);
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStationData();
  }, [selectedStation]);

  if (!isClient)
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading map...
      </div>
    );
  if (error)
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        Map Error: {error}
      </div>
    );
  if (!isLoaded)
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading Google Maps...
      </div>
    );

  return (
    <>
      {selectedStation && setSelectedStation && data && (
        <Modal
          stationData={data}
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
