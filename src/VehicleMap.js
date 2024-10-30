import React, { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
  useMap,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Leaflet from "leaflet";

// Set up vehicle icon
const vehicleIcon = new Leaflet.icon({
  iconUrl: "./car.png",
  iconSize: [30, 30],
});

// Set up start location icon
const startIcon = new Leaflet.icon({
  iconUrl: "./start.png",
  iconSize: [30, 30],
});

// Set up end location icon
const endIcon = new Leaflet.icon({
  iconUrl: "./end.png",
  iconSize: [30, 30],
});

// Custom component to handle map centering
const CenteredMap = ({ markerPosition }) => {
  const map = useMap();
  useEffect(() => {
    if (markerPosition) {
      map.setView(
        [markerPosition.latitude, markerPosition.longitude],
        map.getZoom()
      );
    }
  }, [markerPosition, map]);

  return null;
};

const VehicleMap = ({ route, markerPosition }) => {
  return (
    <>
      <MapContainer
        center={
          markerPosition
            ? [markerPosition.latitude, markerPosition.longitude]
            : [17.385044, 78.486671]
        }
        zoom={13}
        style={{ height: "500px", width: "100%" }}
        className="fixed z-10"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Draw the route polyline */}
        {route.length > 0 && (
          <Polyline
            pathOptions={{ color: "blue" }}
            positions={route.map((item) => [item.latitude, item.longitude])}
            key={route.length}
            smoothFactor={1.0}
            draggable={false}
          />
        )}

        {/* Starting marker */}
        {route.length > 0 && (
          <Marker
            position={[route[0].latitude, route[0].longitude]}
            icon={startIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold text-gray-600 text-lg">Start Point</h3>
                <p>{route[0].location}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Ending marker */}
        {route.length > 1 && (
          <Marker
            position={[
              route[route.length - 1].latitude,
              route[route.length - 1].longitude,
            ]}
            icon={endIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold text-gray-600 text-lg">End Point</h3>
                <p>{route[route.length - 1].location}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Current marker with vehicle information popup */}
        {markerPosition && (
          <Marker
            position={[markerPosition.latitude, markerPosition.longitude]}
            icon={vehicleIcon}
          >
            <Popup className="w-auto">
              <div className=" max-h-60 overflow-auto">
                <h3 className="font-bold text-gray-600 text-lg">
                  Vehicle Information
                </h3>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {markerPosition.location}
                </p>
                <p>
                  <span className="font-semibold">Latitude:</span>{" "}
                  {markerPosition.latitude}
                </p>
                <p>
                  <span className="font-semibold">Longitude:</span>{" "}
                  {markerPosition.longitude}
                </p>
                <p>
                  <span className="font-semibold">Timestamp:</span>{" "}
                  {markerPosition?.date}
                </p>
                {markerPosition.speed_kmh && (
                  <p>
                    <span className="font-semibold">Speed:</span>{" "}
                    {markerPosition.speed_kmh} km/h
                  </p>
                )}
                {markerPosition.direction && (
                  <p>
                    <span className="font-semibold">Direction:</span>{" "}
                    {markerPosition.direction}
                  </p>
                )}
                {markerPosition.distance_km && (
                  <p>
                    <span className="font-semibold">Distance:</span>{" "}
                    {markerPosition.distance_km} km
                  </p>
                )}
                {markerPosition.vehicle?.type && (
                  <p>
                    <span className="font-semibold">Vehicle Type:</span>{" "}
                    {markerPosition.vehicle.type}
                  </p>
                )}
                {markerPosition.vehicle?.number && (
                  <p>
                    <span className="font-semibold">Vehicle Number:</span>{" "}
                    {markerPosition.vehicle.number}
                  </p>
                )}
                {markerPosition.vehicle?.driver && (
                  <p>
                    <span className="font-semibold">Vehicle Driver:</span>{" "}
                    {markerPosition.vehicle.driver}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="text-green-400">Running</span>
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* CenteredMap to keep the view centered on markerPosition */}
        <CenteredMap markerPosition={markerPosition} />
      </MapContainer>
    </>
  );
};

export default VehicleMap;
