import React, { useEffect, useState } from "react";
import VehicleMap from "./VehicleMap";
import axios from "axios";

const App = () => {
  // states
  const [date, setDate] = useState("2024-10-30");
  const [speed, setSpeed] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [route, setRoute] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null);

  // function to handle start and stop button
  const handleRun = () => {
    setIsRunning(!isRunning);
  };

  // handle retry button
  const handleRetry = () => {
    setCurrentIndex(0);
    setIsRunning(false);
    setMarkerPosition(route[0]);
  };

  // get data from api
  useEffect(() => {
    const fetchData = async () => {
      if (date) {
        try {
          const { data } = await axios.get(
            `https://map-xki3.onrender.com/api/v1/vehicle/${date}`
          );
          setRoute(data.route);
          setMarkerPosition(data.route[0]);
          setCurrentIndex(0);
          setIsRunning(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [date]);

  // update current index and live update
  useEffect(() => {
    if (isRunning && route.length > 0 && currentIndex < route.length) {
      const intervalId = setInterval(() => {
        setMarkerPosition(route[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      if (currentIndex >= route.length) {
        setIsRunning(false);
        clearInterval(intervalId);
      }

      return () => clearInterval(intervalId);
    } else {
      setIsRunning(false);
    }
  }, [route, currentIndex, speed, isRunning]);

  // function to handle progressbar
  const handleProgressClick = (e) => {
    const progressBar = e.target;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressWidth = progressBar.offsetWidth;
    const newProgress = clickPosition / progressWidth;
    const newIndex = Math.floor(newProgress * route.length);

    setCurrentIndex(newIndex);
    setMarkerPosition(route[newIndex]);
    setIsRunning(true);
  };

  return (
    <>
      <h1 className="text-2xl md:text-3xl p-3 text-center font-bold">
        Vehicle Live Tracking Map
      </h1>

      {/* Leaflet map component */}
      <VehicleMap
        date={date}
        speed={speed}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        route={route}
        setRoute={setRoute}
        markerPosition={markerPosition}
        setMarkerPosition={setMarkerPosition}
      />

      {/* Control buttons and inputs*/}
      <div className="fixed bottom-0 px-40 left-0 w-full bg-gray-100 text-gray-600 p-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 shadow-lg z-10">
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <label className="flex items-center">
            <span className="mr-2">Select Date:</span>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-100 text-gray-600 border-2 border-gray-500 rounded px-2 py-1 focus:outline-none"
            >
              <option value="2024-10-30">Today</option>
              <option value="2024-10-29">Yesterday</option>
              <option value="2024-10-28">Day before yesterday</option>
              <option value="2024-10-27">
                Day before day before yesterday
              </option>
            </select>
          </label>

          <label className="flex items-center">
            <span className="mr-2">Animation Delay (sec):</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="bg-gray-100 text-gray-600 border-2 border-gray-500 rounded px-2 py-1 focus:outline-none"
            >
              <option value="500">0.5 S</option>
              <option value="1000">1 Second</option>
              <option value="2000">2 Seconds</option>
              <option value="3000">3 Seconds</option>
            </select>
          </label>

          <div className="flex gap-5">
            <button
              onClick={handleRun}
              className="px-12 py-2 text-white rounded bg-gray-600 hover:bg-gray-700 focus:outline-none transition duration-200"
            >
              {isRunning && route?.length ? "Pause" : "Run"}
            </button>

            <button
              onClick={handleRetry}
              className="px-12 py-2 text-white rounded bg-gray-600 hover:bg-gray-700 focus:outline-none transition duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>

      {/* progress bar */}
      {route?.length > 0 && (
        <div className="fixed bottom-40 md:bottom-20 lg:bottom-16 left-0 w-full p-4 z-20 bg-gray-100">
          <div
            className="w-1/2 mx-auto md:mt-4 mb-1 bg-gray-200 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${((currentIndex + 0.1) / route.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
