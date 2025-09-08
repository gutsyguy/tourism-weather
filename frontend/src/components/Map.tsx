"use client";

import { useMap } from "@/context/MapContext";
import { useStations } from "@/context/StationsContext";
import { Station, Stations } from "@/types/station";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState, useRef, useMemo } from "react";

export const Map = () => {
  const { map, isLoaded, error } = useMap();
  const { stations, loading } = useStations();
  const [isClient, setIsClient] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);
 


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
  
      // Assign to a larger grid cell
      const key = `${Math.floor(latitude / gridSize)}_${Math.floor(longitude / gridSize)}`;
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
    if (!isClient || !map || !isLoaded || loading || !stations?.data.length) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];


    const newMarkers = visibleStations.map((station) => {
      const marker = new google.maps.Marker({
        position: { lat: station.latitude, lng: station.longitude },
        map,
        title: station.station_name || "Station",
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<h3>${station.station_name}</h3><p>${station.station_network || ""}</p>`,
      });

      marker.addListener("click", () => infoWindow.open(map, marker));
      return marker;
    });

    markersRef.current = newMarkers;

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, isLoaded, isClient, stations, loading]);
  

  if (!isClient) {
    return (
      <div 
        style={{ 
          height: "100vh", 
          width: "100%",
          position: "relative",
          zIndex: 1,
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        Loading map...
      </div>
    );
  }

  if (error) {
    return (
      <div 
        style={{ 
          height: "100vh", 
          width: "100%",
          position: "relative",
          zIndex: 1,
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#666"
        }}
      >
        <h2>Map Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div 
        style={{ 
          height: "100vh", 
          width: "100%",
          position: "relative",
          zIndex: 1,
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        Loading Google Maps...
      </div>
    );
  }

  return null;
};
