import { Station, StationData } from "@/types/station";

const Modal = ({
  stationData,
  station,
  setStation,
  city,
  state,
  country,
}: {
  stationData: StationData;
  station: Station;
  setStation: React.Dispatch<React.SetStateAction<Station | null>>;
  city: string;
  state: string;
  country: string;
}) => {
  return (
    <div
      style={{
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      }}
      className=" absolute top-0 right-0 w-[25rem]  bg-white p-4 z-[999]"
    >
      <div className="flex flex-row justify-between">
        <div>
          <h1 className=" font-semibold text-2xl">{city}</h1>
          <h2>
            {state}, {country}
          </h2>
        </div>
        <h1>Cloudy · {stationData.points[0].temperature}°F</h1>
      </div>
      <p>Station Name: {station.station_name}</p>
      <p>Network: {station.station_network}</p>
      <p>Timezone: {station.timezone}</p>
      <button onClick={() => setStation(null)}>Close</button>
    </div>
  );
};

export default Modal;
