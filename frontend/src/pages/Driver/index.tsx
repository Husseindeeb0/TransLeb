import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { v4 as uuidv4 } from 'uuid';
import { Navigation, User, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetAllCoordinatesMutation } from '../../state/services/coordinates/coordinatesAPI';
import { connectSocket, socket } from '../../socketio/socket';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 33.5938,
  lng: 35.5018,
};

const mapOptions = {
  restriction: {
    latLngBounds: {
      north: 34.7,
      south: 33.0,
      west: 34.8,
      east: 36.7,
    },
    strictBounds: true,
  },
  minZoom: 9,
  maxZoom: 18,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

interface Passenger {
  userId: string;
  lat: number;
  lng: number;
  markedBy?: string | null;
  startTimer?: string;
  duration?: number;
}

const Drive: React.FC = () => {
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [markedPassengerId, setMarkedPassengerId] = useState<string | null>(
    null
  );
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const [getAllCoordinates] = useGetAllCoordinatesMutation();

  const mapRef = useRef<google.maps.Map | null>(null);
  const driverIdRef = useRef<string>('');

  // Initialize Driver ID
  useEffect(() => {
    let storedId = localStorage.getItem('driverId');
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem('driverId', storedId);
    }
    driverIdRef.current = storedId;
    connectSocket(storedId); // Connect as "user" but we use this socket for driver events too
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ['places'],
  });

  // Fetch Passengers
  const fetchPassengers = async () => {
    try {
      const result = await getAllCoordinates().unwrap();
      if (result.data) {
        setPassengers(result.data);
        // Check if we already marked someone
        const myMark = result.data.find(
          (p) => p.markedBy === driverIdRef.current
        );
        if (myMark) {
          setMarkedPassengerId(myMark.userId);
        }
      }
    } catch (err) {
      console.error('Failed to fetch passengers', err);
    }
  };

  useEffect(() => {
    fetchPassengers();

    // Auto refresh every 30s? Or rely on sockets?
    const interval = setInterval(fetchPassengers, 30000);
    return () => clearInterval(interval);
  }, []);

  // Socket Listeners
  useEffect(() => {
    socket.on(
      'passengerMarked',
      (data: { passengerId: string; driverId: string }) => {
        setPassengers((prev) =>
          prev.map((p) =>
            p.userId === data.passengerId
              ? { ...p, markedBy: data.driverId }
              : p
          )
        );
      }
    );

    socket.on('passengerUnmarked', (data: { passengerId: string }) => {
      setPassengers((prev) =>
        prev.map((p) =>
          p.userId === data.passengerId ? { ...p, markedBy: null } : p
        )
      );
    });

    socket.on('timerEnded', () => {
      // Ideally we receive userId. If current user is passenger, it handles it.
      // As driver, we should listen to 'coordinateDeleted' or similar?
      // passengerTimer emits 'timerEnded' to the passenger room.
      // We need a global event for drivers.
      // For now, poll or rely on next fetch.
      fetchPassengers();
    });

    return () => {
      socket.off('passengerMarked');
      socket.off('passengerUnmarked');
      socket.off('timerEnded');
    };
  }, []);

  // Calculate Route
  useEffect(() => {
    if (markedPassengerId && driverLocation && isLoaded) {
      const passenger = passengers.find((p) => p.userId === markedPassengerId);
      if (passenger) {
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: driverLocation,
            destination: { lat: passenger.lat, lng: passenger.lng },
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK' && result) {
              setDirectionsResponse(result);
            } else {
              console.error('Directions request failed due to ' + status);
            }
          }
        );
      }
    } else {
      setDirectionsResponse(null);
    }
  }, [markedPassengerId, driverLocation, passengers, isLoaded]);

  useEffect(() => {
    if (markedPassengerId && driverLocation) {
      const interval = setInterval(() => {
        socket.emit('driverLocationUpdate', {
          driverId: driverIdRef.current,
          passengerId: markedPassengerId,
          lat: driverLocation.lat,
          lng: driverLocation.lng,
        });
      }, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [markedPassengerId, driverLocation]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDriverLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsLocating(false);
          mapRef.current?.panTo({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          mapRef.current?.setZoom(14);
        },
        () => {
          toast.error('Location failed');
          setIsLocating(false);
        }
      );
    }
  };

  const handleMark = (passengerId: string) => {
    socket.emit('markPassenger', {
      passengerId,
      driverId: driverIdRef.current,
    });
    setMarkedPassengerId(passengerId);
    // Optimistic update
    setPassengers((prev) =>
      prev.map((p) =>
        p.userId === passengerId ? { ...p, markedBy: driverIdRef.current } : p
      )
    );
    toast.success('Passenger Marked! Go pick them up.');
  };

  const handleUnmark = (passengerId: string) => {
    socket.emit('unmarkPassenger', {
      passengerId,
      driverId: driverIdRef.current,
    });
    setMarkedPassengerId(null);
    setDirectionsResponse(null);
    setPassengers((prev) =>
      prev.map((p) => (p.userId === passengerId ? { ...p, markedBy: null } : p))
    );
    toast('Mark removed');
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6 h-[85vh]">
        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Navigation className="text-blue-600" /> Driver Mode
            </h2>
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="w-full bg-blue-600 text-white py-2 rounded-xl mt-2 hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              {isLocating ? 'Locating...' : 'Locate Me'}
            </button>
          </div>

          {markedPassengerId && (
            <div className="bg-green-50 p-4 rounded-2xl shadow-md border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">
                Current Passenger
              </h3>
              <p className="text-sm text-green-700 mb-4">
                You have marked a passenger. Follow the path!
              </p>
              <button
                onClick={() => handleUnmark(markedPassengerId)}
                className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
              >
                Cancel / Unmark
              </button>
            </div>
          )}

          <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 flex-1 overflow-y-auto">
            <h3 className="font-semibold mb-3">Nearby Passengers</h3>
            <div className="space-y-3">
              {passengers.filter(
                (p) => !p.markedBy || p.userId === markedPassengerId
              ).length === 0 && (
                <p className="text-gray-500 text-sm">No passengers found.</p>
              )}
              {passengers
                .filter((p) => !p.markedBy || p.userId === markedPassengerId)
                .map((p) => (
                  <div
                    key={p.userId}
                    className={`p-3 rounded-xl border ${p.userId === markedPassengerId ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-blue-300'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">Passenger</span>
                      </div>
                      {p.startTimer && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>

                    {p.userId !== markedPassengerId ? (
                      <button
                        onClick={() => handleMark(p.userId)}
                        className="mt-3 w-full bg-black text-white text-xs py-2 rounded-lg hover:bg-gray-800"
                      >
                        Mark Passenger
                      </button>
                    ) : (
                      <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Marked by you
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3 h-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            options={mapOptions}
            onLoad={onMapLoad}
          >
            {/* Driver Marker */}
            {driverLocation && (
              <Marker
                position={driverLocation}
                title="You"
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                }}
              />
            )}

            {/* Passenger Markers */}
            {passengers.map((p) => {
              // If marked by someone else, don't show (or show gray?)
              if (p.markedBy && p.markedBy !== driverIdRef.current) return null;

              const isMarkedByMe = p.userId === markedPassengerId;

              return (
                <Marker
                  key={p.userId}
                  position={{ lat: p.lat, lng: p.lng }}
                  onClick={() => !isMarkedByMe && handleMark(p.userId)}
                  icon={{
                    url: isMarkedByMe
                      ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                      : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  }}
                />
              );
            })}

            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{ suppressMarkers: true }}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default Drive;
