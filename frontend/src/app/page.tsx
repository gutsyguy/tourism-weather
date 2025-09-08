"use client";

import { MapProviderDynamic } from "@/context/MapContext";
import { Map } from "@/components/Map";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <MapProviderDynamic>
        <Map />
      </MapProviderDynamic>
    </div>
  );
}
