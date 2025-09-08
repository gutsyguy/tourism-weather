import { Station, StationData } from "@/types/station";
import moment from "moment-timezone";
import { useEffect } from "react";

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
  const temperature =
    stationData.points[stationData.points.length - 1].temperature;

  const tempDescription =
    temperature >= 90
      ? "Hot"
      : temperature >= 75
      ? "Warm"
      : temperature >= 60
      ? "Mild"
      : temperature >= 45
      ? "Cool"
      : "Cold";

  const timezone = stationData.points[stationData.points.length - 1].timestamp;
  const currentTime = moment().tz(timezone).format("HH:mm");

  const windX = stationData.points[stationData.points.length - 1].wind_x;
  const windY = stationData.points[stationData.points.length - 1].wind_y;

  function calcWind(windX: number, windY: number) {
    const speed = Math.round(Math.sqrt(windX * windX + windY * windY)); // mph
    const dirDeg = ((Math.atan2(windY, windX) * 180) / Math.PI + 360) % 360;

    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const dirIndex = Math.round(dirDeg / 45) % 8;

    return { speed, direction: directions[dirIndex] };
  }

  const wind = calcWind(windX, windY);

  function calcHumidity(tempF: number, dewF: number): number {
    const tempC = ((tempF - 32) * 5) / 9;
    const dewC = ((dewF - 32) * 5) / 9;
    const rh =
      100 *
      (Math.exp((17.625 * dewC) / (243.04 + dewC)) /
        Math.exp((17.625 * tempC) / (243.04 + tempC)));
    return Math.round(rh);
  }

  const dew = stationData.points[stationData.points.length - 1].dewpoint;

  const humidityLevel = calcHumidity(temperature, dew);

  //   useEffect(() => {
  //     const url = process.env.NEXT_PUBLIC_API_URL;
  //     if (!url) return;
  //     if (!selectedStation) return;
  //     const fetchStationData = async () => {
  //       try {
  //         const res = await fetch(
  //           `${url}/api/stations/${selectedStation.station_id}/weather`
  //         );
  //         if (!res.ok) throw new Error(`Response status: ${res.status}`);
  //         const result = await res.json();
  //         console.log(result);
  //         setData(result);
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     };
  //     fetchStationData();
  //   }, [selectedStation]);

  return (
    <div
      style={{
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      }}
      className=" absolute top-0 right-0 w-[25rem] h-[100vh] bg-white p-4 z-[999]"
    >
      <div className="flex flex-row justify-between">
        <div>
          <h1 className=" font-semibold text-2xl">{city}</h1>
          <h2>
            {state}, {country}
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <h1>
            {tempDescription} · {temperature}°F
          </h1>
          <h2>{currentTime}</h2>
        </div>
      </div>
      <p>Humidity: {humidityLevel}</p>
      <p>
        Wind: {wind.speed}, {wind.direction}
      </p>
      <p>Station Name: {station.station_name}</p>
      <p>Network: {station.station_network}</p>
      <p>Timezone: {station.timezone}</p>
      <h2>Tourist Acitivities</h2>
      <button onClick={() => setStation(null)}>Close</button>
    </div>
  );
};

export default Modal;
