'use client'

import { MapProviderDynamic } from "@/context/MapContext";
import { Map } from "@/components/Map";
import { useStations } from "@/context/StationsContext";
import Searchbar from "@/components/Searchbar";

export default function Home() {
  const {stations} = useStations()

  return (
    <div>
      {/* <Searchbar searchList={station}/> */}
      <MapProviderDynamic>
        <Map />
      </MapProviderDynamic>
    </div>
  );
}
