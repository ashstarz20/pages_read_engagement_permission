// src/components/LocationTargetingMap.tsx
import React, { useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";

export type LocationTarget = {
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
  exclude?: boolean;
};

interface Props {
  apiKey: string;
  onChange: (locations: LocationTarget[]) => void;
}

export const LocationTargetingMap: React.FC<Props> = ({ apiKey, onChange }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [locations, setLocations] = useState<LocationTarget[]>([]);
  const [modeExclude, setModeExclude] = useState(false);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const newLoc: LocationTarget = {
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
      radius: 5, // default 5km
      exclude: modeExclude,
    };
    const updated = [...locations, newLoc];
    setLocations(updated);
    onChange(updated);
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <div className="controls mb-2">
        <button
          onClick={() => setModeExclude(false)}
          className={!modeExclude ? "font-bold" : ""}
        >
          Include
        </button>
        <button
          onClick={() => setModeExclude(true)}
          className={modeExclude ? "font-bold" : ""}
        >
          Exclude
        </button>
      </div>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={{ lat: 21.0, lng: 78.0 }}
        zoom={5}
        onLoad={(map) => (mapRef.current = map)}
        onClick={handleMapClick}
      >
        {locations.map((loc, idx) => (
          <React.Fragment key={idx}>
            <Marker
              position={{ lat: loc.latitude, lng: loc.longitude }}
              icon={
                loc.exclude
                  ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  : undefined
              }
            />
            <Circle
              center={{ lat: loc.latitude, lng: loc.longitude }}
              radius={loc.radius * 1000}
              options={{
                strokeColor: loc.exclude ? "#f00" : "#00f",
                fillOpacity: 0.2,
              }}
            />
          </React.Fragment>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};
