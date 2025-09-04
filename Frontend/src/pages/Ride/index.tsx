import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Default icon fix (Leaflet markers won’t show without this)
import "leaflet/dist/leaflet.css";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Props type for Recenter component
interface RecenterProps {
  lat: number | null;
  lng: number | null;
}

// Helper to move map view when user location is set
function Recenter({ lat, lng }: RecenterProps): null {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
}

const Ride: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get location only when user clicks button
  const handleSetLocation = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error(err);
        },
        { enableHighAccuracy: true } // <-- this
      );
    } else {
      alert("Geolocation not supported by this browser.");
    }
  };

  return (
    <div className="w-full h-screen flex gap-24">
      {/* Map */}
      <MapContainer
        center={[33.8938, 35.5018]}
        zoom={13}
        className="w-3xl h-full"
      >
        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User marker */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>You are here</Popup>
            </Marker>
            <Recenter lat={userLocation.lat} lng={userLocation.lng} />
          </>
        )}
      </MapContainer>

      {/* Button */}
      <button
        onClick={handleSetLocation}
        className="-translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md max-h-20 cursor-pointer"
      >
        Point My Location
      </button>
    </div>
  );
};

export default Ride;
