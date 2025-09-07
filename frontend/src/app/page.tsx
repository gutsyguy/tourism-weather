// app/page.tsx
import { MapProvider } from "@/context/MapContext";
import { Map } from "@/components/Map";

export const Home = () => {
  return (
    <div>

    <MapProvider>
      <Map />
    </MapProvider>
    </div>
  );
};

export default Home;
