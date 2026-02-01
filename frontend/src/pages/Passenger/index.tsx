// ToDo: Add a check in mounting page that checks if the user already has a location shared and if yes to connect the socket automatically

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { v4 as uuidv4 } from 'uuid';
import {
  MapPin,
  Navigation,
  Clock,
  ArrowRight,
  Crosshair,
  Share2,
  Info,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useAddCoordinateMutation,
  useEditCoordinateMutation,
  useDeleteCoordinateMutation,
  useGetCoordinatesMutation,
} from '../../state/services/coordinates/coordinatesAPI';
import { connectSocket, socket } from '../../socketio/socket';
import { useGetUserDetailsQuery } from '../../state/services/user/userAPI';

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

const Ride: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [addCoordinate, addStatus] = useAddCoordinateMutation();
  const [editCoordinate, editStatus] = useEditCoordinateMutation();
  const [deleteCoordinate, deleteStatus] = useDeleteCoordinateMutation();
  const [getCoordinates, getStatus] = useGetCoordinatesMutation();
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const [driverId, setDriverId] = useState<string | null>(null);

  const { data: driverDetails, isSuccess: isDriverLoaded } =
    useGetUserDetailsQuery(driverId!, {
      skip: !driverId,
    });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const checkExistingLocation = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const coordinates = await getCoordinates({ userId }).unwrap();

          if (coordinates && coordinates.data) {
            console.log('Found saved coordinates:', coordinates.data);
            setUserLocation({
              lat: coordinates.data.lat,
              lng: coordinates.data.lng,
            });

            // If the user is already marked by a driver, we might need to know that.
            // But currently the API doesn't return who marked them in 'getCoordinates' explicitly unless we check 'markedBy'.
            // If coordinates.data.markedBy exists, we should set it.
            if (coordinates.data.markedBy) {
              setDriverId(coordinates.data.markedBy);
            }

            connectSocket(userId);
          }
        } catch (err) {
          console.log('No saved coordinates');
        }
      }
    };

    checkExistingLocation();
  }, []);

  // To get the remaining time from the server
  useEffect(() => {
    // Listen for remaining time updates
    socket.on('remainingTime', (data: { remainingMs: number }) => {
      console.log('Remaining time data received:', data);
      const minutes = Math.ceil(data.remainingMs / 60000);
      setRemainingTime(minutes);
    });

    // Listen for time finished
    socket.on('timerEnded', () => {
      console.log('Time finished event received');
      setRemainingTime(null);
      toast('Timer ended', { icon: '⌛' });
    });

    socket.on('driverMarked', (data: { driverId: string }) => {
      toast.success('A driver has marked your location! Timer extended.');
      if (data?.driverId) {
        setDriverId(data.driverId);
      }
      // Note: Timer update ('remainingTime') is sent separately by backend
    });

    socket.on('driverUnmarked', () => {
      toast.error('Driver cancelled picking you up!', {
        duration: 5000,
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          fontWeight: '500',
        },
      });
      setDriverId(null);
    });

    // Clean up listeners on unmount
    return () => {
      socket.off('remainingTime');
      socket.off('timerEnded');
      socket.off('driverMarked');
      socket.off('driverUnmarked');
    };
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ['places'],
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      handleSetLocation(e.latLng.lat(), e.latLng.lng());
    }
  }, []);

  // Recenter map when user location changes
  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo({ lat: userLocation.lat, lng: userLocation.lng });
      mapRef.current.setZoom(14);
    }
  }, [userLocation]);

  const handleSetLocation = (lat?: number, lng?: number): void => {
    setIsLocating(true);

    // Used for Manual locating by clicking on the map
    if (lat !== undefined && lng !== undefined) {
      setUserLocation({
        lat: Number(lat.toFixed(5)),
        lng: Number(lng.toFixed(5)),
      });
      toast.success('Location Set');
      setIsLocating(false);
      return;
    }

    // Used for auto locating user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
          });
          toast.success('Location Set');
          setIsLocating(false);
        },
        (err) => {
          console.error(err);
          toast.error('Setting location failed');
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error('Geolocation not supported by this browser');
      setIsLocating(false);
    }
  };

  const handleShareLocation = async () => {
    if (!userLocation) {
      toast.error('Location is not set yet!');
      return;
    }

    try {
      // Using uuid to know if the user have already shared a location and if yes to edit it without adding new one
      const userId = localStorage.getItem('userId');
      if (userId) {
        await editCoordinate({
          lat: userLocation.lat,
          lng: userLocation.lng,
          userId,
        }).unwrap();
      } else {
        const id = uuidv4();
        localStorage.setItem('userId', id);
        await addCoordinate({
          lat: userLocation.lat,
          lng: userLocation.lng,
          userId: id,
        }).unwrap();
      }
      console.log('Connecting socket for user:', userId);
      connectSocket(userId || localStorage.getItem('userId')!);
      toast.success('Your location is shared with drivers');
    } catch (err) {
      console.error('Failed to share location:', err);
      toast.error('Sharing location failed');
    }
  };

  const handleDeleteLocation = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setUserLocation(null);
      return;
    }
    await deleteCoordinate({ userId }).unwrap();
    setUserLocation(null);
    localStorage.removeItem('userId');
    toast.success('Your location is deleted');
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Map Loading Error</h3>
          <p className="text-red-600 text-sm">
            Failed to load Google Maps. Please check your API key and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 w-12 h-12 border-red-700 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

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
                <div className="w-full h-full rounded-xl shadow-lg overflow-hidden">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={10}
                    options={mapOptions}
                    onLoad={onMapLoad}
                    onClick={onMapClick}
                  >
                    {userLocation && (
                      <Marker
                        position={{
                          lat: userLocation.lat,
                          lng: userLocation.lng,
                        }}
                        icon={{
                          url: '/person_locator.webp',
                          scaledSize: new window.google.maps.Size(40, 40),
                          anchor: new window.google.maps.Point(20, 40),
                        }}
                        title="You are here"
                      />
                    )}
                  </GoogleMap>
                </div>

                {/* Map Overlay - Location Info */}
                {userLocation && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 animate-in slide-in-from-top duration-500">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Navigation className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Current Location
                        </p>
                        <p className="text-xs text-gray-600">
                          {userLocation.lat.toFixed(5)},{' '}
                          {userLocation.lng.toFixed(5)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading Overlay */}
                {(isLocating ||
                  addStatus.isLoading ||
                  editStatus.isLoading ||
                  deleteStatus.isLoading) && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full border-4 w-12 h-12 border-red-700 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-gray-700 font-medium">
                        {isLocating
                          ? 'Finding your location...'
                          : deleteStatus.isLoading
                            ? 'Deleting your location...'
                            : 'Sharing your location with drivers...'}
                      </p>
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
                  onClick={() => handleSetLocation()}
                  disabled={isLocating}
                  className={`w-full relative overflow-hidden group flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                    isLocating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-700 to-green-600 hover:shadow-xl transform cursor-pointer hover:-translate-y-1'
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

                {/* Share Location Button with Tooltip */}
                <div className="relative">
                  <button
                    onClick={handleShareLocation}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 border-2 ${
                      userLocation
                        ? 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transform cursor-pointer hover:-translate-y-1'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!userLocation}
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Share Location</span>
                    {userLocation && (
                      <Info className="h-4 w-4 ml-2 opacity-60" />
                    )}
                  </button>

                  {/* Tooltip */}
                  {showTooltip && userLocation && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                      <div className="bg-red-700 text-white text-sm rounded-lg px-4 py-3 shadow-xl max-w-xs w-64">
                        <div className="flex items-start space-x-2">
                          <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                          <div>
                            <p className="font-medium mb-1">
                              Make yourself visible to drivers
                            </p>
                            <p className="text-white text-xs leading-relaxed">
                              Sharing your location will make you visible to
                              nearby drivers who can offer you a ride. Please
                              confirm you're ready to be picked up.
                            </p>
                          </div>
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                          <div className="border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-700"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Delete Location Section */}
            {userLocation &&
              (addStatus.isSuccess ||
                editStatus.isSuccess ||
                getStatus.isSuccess) && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm">Delete your location from the map</p>
                  <button
                    onClick={handleDeleteLocation}
                    className="px-5 py-2 mt-5 w-full cursor-pointer text-white bg-red-700 rounded-2xl hover:bg-red-800 transition-all"
                  >
                    Delete
                  </button>
                </div>
              )}

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
                <li>
                  • Or manually locate yourself by clicking anywhere on the map
                </li>
                <li>
                  • Share your location so drivers could see your location now
                </li>
                <li>• Or find nearby available drivers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Coming Card */}
      {isDriverLoaded && driverDetails && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom duration-500 w-full max-w-md px-4 md:px-0">
          <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100/50 backdrop-blur-xl ring-1 ring-black/5">
            <div className="flex items-start gap-5">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg shadow-green-200">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl leading-tight">
                      Driver is coming!
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Your ride is on the way
                    </p>
                  </div>
                  <div className="bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                      Arriving
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-gray-700 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="font-semibold text-lg">
                      {driverDetails.name}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50/80 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <span className="text-xs font-mono font-bold text-gray-400">
                          #
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 bg-gray-50/80 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Navigation className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-200 cursor-pointer">
                    Call Driver
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 active:scale-95 transition-all cursor-pointer">
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {remainingTime !== null && (
        <div className="fixed top-20 left-4 z-[9999] pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md shadow-xl rounded-2xl p-4 w-60 border border-white/20 ring-1 ring-black/5">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                <div className="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-50 animate-pulse"></div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-800 leading-tight">
                  Location Active
                </h3>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 tracking-tighter">
                    {remainingTime}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    min left
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-400 font-medium">
                  Expires automatically
                </p>
                {remainingTime !== null && remainingTime <= 5 && (
                  <button
                    onClick={() => {
                      const userId = localStorage.getItem('userId');
                      if (userId) socket.emit('extendTimer', { userId });
                    }}
                    className="mt-3 w-full bg-blue-50 text-blue-600 text-xs font-bold py-2 rounded-lg hover:bg-blue-100 transition active:scale-95 border border-blue-100"
                  >
                    Extend (+10m)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ride;
