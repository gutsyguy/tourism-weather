"use client";
import { Stations } from "@/types/station";
import { useEffect, useState } from "react";
import { useStations } from "@/context/StationsContext";

export default function Home() {
  const { stations, loading, error } = useStations();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] text-black items-center bg-white min-h-screen justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <h1>Weather Tourism app</h1>

      {loading && <p>Loading stations...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {stations && <pre>{JSON.stringify(stations, null, 2)}</pre>}
    </div>
  );
}
