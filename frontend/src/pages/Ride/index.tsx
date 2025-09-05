import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";
import type { LocationMarkerProps } from "../../types/rideTypes";
import { Recenter } from "../../helpers";
import {
  MapPin,
  Navigation,
  Clock,
  Users,
  ArrowRight,
  Crosshair,
  Share2,
} from "lucide-react";

const personIcon = L.icon({
  iconUrl: "/person_locator.webp",
  iconSize: [40, 40],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to handle manual clicks on map
function LocationMarker({ setUserLocation }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      setUserLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
}

const Ride: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "locating" | "success" | "error"
  >("idle");

  // Get user location when user clicks button
  const handleSetLocation = (): void => {
    setIsLocating(true);
    setLocationStatus("locating");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsLocating(false);
          setLocationStatus("success");
          setTimeout(() => setLocationStatus("idle"), 3000);
        },
        (err) => {
          console.error(err);
          setIsLocating(false);
          setLocationStatus("error");
          setTimeout(() => setLocationStatus("idle"), 3000);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation not supported by this browser.");
      setIsLocating(false);
      setLocationStatus("error");
      setTimeout(() => setLocationStatus("idle"), 3000);
    }
  };

  const handleShareLocation = (): void => {
    if (userLocation) {
      const locationUrl = `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
      navigator.clipboard
        .writeText(locationUrl)
        .then(() => {
          setLocationStatus("success");
          setTimeout(() => setLocationStatus("idle"), 2000);
        })
        .catch(() => {
          alert("Failed to copy location to clipboard");
        });
    } else {
      alert("Please set your location first");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-red-700 to-green-600 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Find Your Ride
                </h1>
                <p className="text-gray-600">
                  Set your pickup location to get started
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              {locationStatus === "success" && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200 animate-in fade-in duration-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Location Set</span>
                </div>
              )}
              {locationStatus === "error" && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200 animate-in fade-in duration-300">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Location Error</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Interactive Map
                </h2>
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Real-time</span>
                </div>
              </div>

              <div className="relative h-96 lg:h-[500px]">
                <MapContainer
                  center={[33.5938, 35.5018]}
                  zoom={10}
                  minZoom={9}
                  className="w-full h-full rounded-xl shadow-lg z-0"
                  maxBounds={[
                    [33.0, 34.8],
                    [34.7, 36.7],
                  ]}
                  maxBoundsViscosity={1.0}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <LocationMarker setUserLocation={setUserLocation} />

                  {userLocation && (
                    <>
                      <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={personIcon}
                      >
                        <Popup>You are here</Popup>
                      </Marker>
                      <Recenter lat={userLocation.lat} lng={userLocation.lng} />
                    </>
                  )}
                </MapContainer>

                {/* Map Overlay - Location Info */}
                {userLocation && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 animate-in slide-in-from-top duration-500">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Navigation className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Current Location</p>
                        <p className="text-xs text-gray-600">
                          {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading Overlay */}
                {isLocating && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-50">
                    <div className="text-center">
                      <div className="animate-spin rounded-full  border-4 w-12 h-12 border-red-700 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-gray-700 font-medium">Finding your location...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location Actions
              </h3>

              <div className="space-y-4">
                {/* Auto Location Button */}
                <button
                  onClick={handleSetLocation}
                  disabled={isLocating}
                  className={`w-full relative overflow-hidden group flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                    isLocating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-700 to-green-600 hover:shadow-xl transform hover:-translate-y-1"
                  } text-white`}
                >
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:w-full transition-all duration-700 ease-out"></div>
                  {isLocating ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span className="relative z-10">Locating...</span>
                    </div>
                  ) : (
                    <>
                      <Crosshair className="h-5 w-5 relative z-10" />
                      <span className="relative z-10">Auto Locate Me</span>
                    </>
                  )}
                </button>

                {/* Share Location Button */}
                <button
                  onClick={handleShareLocation}
                  className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 border-2 ${
                    userLocation
                      ? "border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transform hover:-translate-y-1"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!userLocation}
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share Location</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Available Drivers
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-green-600">
                    24
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Avg. Wait Time
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-blue-600">
                    3 min
                  </span>
                </div>
              </div>
            </div> */}

            {/* Next Step */}
            <div className="bg-gradient-to-r from-red-700 to-green-600 rounded-2xl shadow-lg p-6 text-white animate-in slide-in-from-bottom duration-500">
              <h3 className="text-lg font-semibold mb-2">Ready to Go!</h3>
              <p className="text-sm text-white/90 mb-4">
                Ready to find nearby drivers?
              </p>

              <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-white/20 hover:transform hover:-translate-y-1">
                <span>Find Drivers</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                How to use:
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Click "Auto Locate Me" for GPS location</li>
                <li>• Or manually locate yourself by clicking anywhere on the map</li>
                <li>• Share your location so drivers could see your location now</li>
                <li>• Or find nearby available drivers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ride;
