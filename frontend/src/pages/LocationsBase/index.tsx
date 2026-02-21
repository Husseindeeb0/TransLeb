import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';
import {
  User, 
  ChevronLeft,
  Navigation,
  Route as RouteIcon,
  Activity,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGetAllCoordinatesQuery, useEditCoordinateMutation } from '../../state/services/coordinates/coordinatesAPI';
import { useGetPassengerFormsQuery } from '../../state/services/passengerForm/passengerFormAPI';
import { connectSocket } from '../../socketio/socket';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

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

const LocationsBase: React.FC = () => {
  const { t } = useTranslation();
  const { dayCardId } = useParams<{ dayCardId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedPassengerId, setSelectedPassengerId] = useState<string | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // useGetAllCoordinatesQuery instead of mutation
  const { data: passengersData } = useGetAllCoordinatesQuery(dayCardId!, {
    pollingInterval: 15000,
    skip: !dayCardId
  });

  const passengers = useMemo(() => passengersData?.data || [], [passengersData]);

  const [editCoordinate] = useEditCoordinateMutation();
  const { data: reservations } = useGetPassengerFormsQuery(dayCardId || '');

  const mapRef = useRef<google.maps.Map | null>(null);
  const driverIdRef = useRef<string>('');

  useEffect(() => {
    if (user?._id) {
        driverIdRef.current = user._id;
        connectSocket(user._id);
    }
  }, [user]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ['places'],
  });

  // Join passengers with reservations to get names
  const passengerData = useMemo(() => {
    return passengers.map(p => {
        const res = reservations?.data?.find(r => {
            const rUserId = typeof r.userId === 'object' && r.userId !== null ? (r.userId as any)._id : r.userId;
            return rUserId === p.userId;
        });
        return {
            ...p,
            name: res?.fullName || t('locationsBase.anonymous', 'Anonymous Passenger'),
            phone: res?.phoneNumber
        };
    });
  }, [passengers, reservations, t]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleLocateMe = useCallback(() => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setDriverLocation(newLoc);
          setIsLocating(false);
          
          if (user?._id) {
              editCoordinate({
                  lat: newLoc.lat,
                  lng: newLoc.lng,
                  userId: user._id,
                  dayCardId: dayCardId
              });
          }
          
          mapRef.current?.panTo(newLoc);
        },
        () => {
          toast.error(t('locationsBase.toast.locationFailed', 'Location failed'));
          setIsLocating(false);
        }
      );
    }
  }, [user, dayCardId, t, editCoordinate]);

  // Automatic sharing every 5 minutes
  useEffect(() => {
    if (driverLocation && user?._id && dayCardId) {
        const shareInterval = setInterval(() => {
            editCoordinate({
                lat: driverLocation.lat,
                lng: driverLocation.lng,
                userId: user._id,
                dayCardId: dayCardId
            });
            toast.success(t('locationsBase.toast.sharingAuto', 'Updated your location on map'), { duration: 2000, icon: '📍' });
        }, 5 * 60 * 1000);
        return () => clearInterval(shareInterval);
    }
  }, [driverLocation, user, dayCardId, t, editCoordinate]);

  const calculateOptimizedRoute = async () => {
    if (!driverLocation || passengerData.length === 0 || !isLoaded) return;
    
    setIsOptimizing(true);
    const directionsService = new google.maps.DirectionsService();
    
    const waypoints = passengerData.map(p => ({
        location: { lat: p.lat, lng: p.lng },
        stopover: true
    }));

    const destination = waypoints.pop()!.location;

    directionsService.route(
        {
            origin: driverLocation,
            destination: destination,
            waypoints: waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
            setIsOptimizing(false);
            if (status === 'OK' && result) {
                setDirectionsResponse(result);
                toast.success(t('locationsBase.toast.routeOptimized', 'Route optimized for shortest path!'));
            } else {
                toast.error(t('locationsBase.toast.routeFailed', 'Could not calculate optimized route'));
            }
        }
    );
  };

  const calculateRouteToPassenger = (p: Passenger) => {
      if (!driverLocation || !isLoaded) return;
      
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
          {
              origin: driverLocation,
              destination: { lat: p.lat, lng: p.lng },
              travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
              if (status === 'OK' && result) {
                  setDirectionsResponse(result);
                  setSelectedPassengerId(p.userId);
              }
          }
      );
  };

  if (loadError) return <div className="p-10 text-center text-red-600 font-bold">{t('common.mapError', 'Error loading maps')}</div>;
  if (!isLoaded) return <div className="p-10 text-center font-bold text-gray-500">{t('common.loadingMap', 'Loading Maps...')}</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400 hover:text-gray-900"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <Activity className="text-red-600" />
                {t('locationsBase.title', 'Active Drive Mode')}
              </h1>
              <p className="text-sm text-gray-400 font-medium">
                {t('locationsBase.stats', '{{count}} passengers sharing location', { count: passengerData.length })}
              </p>
            </div>
         </div>

         <div className="flex gap-4">
            <button 
              onClick={handleLocateMe}
              disabled={isLocating}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-sm hover:border-red-600/20 hover:bg-red-50/30 transition-all disabled:opacity-50"
            >
              <Navigation size={18} className={isLocating ? 'animate-pulse text-red-600' : 'text-gray-400'} />
              {isLocating ? t('locationsBase.locating', 'Locating...') : t('locationsBase.locateMe', 'My Location')}
            </button>
            <button 
              onClick={calculateOptimizedRoute}
              disabled={isOptimizing || passengerData.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              <RouteIcon size={18} className={isOptimizing ? 'animate-spin' : ''} />
              {t('locationsBase.optimize', 'Optimize Route')}
            </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-96 bg-white border-r border-gray-100 flex flex-col">
           <div className="p-6 border-b border-gray-50 overflow-y-auto">
             <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-4">
                {t('locationsBase.passengerList', 'Passengers on Route')}
             </h3>
             <div className="space-y-4">
                {passengerData.length === 0 ? (
                    <div className="text-center py-10">
                        <User className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold text-sm italic">
                            {t('locationsBase.noPassengers', 'Waiting for passengers to share location...')}
                        </p>
                    </div>
                ) : (
                    passengerData.map((p) => (
                        <div 
                          key={p.userId}
                          onClick={() => calculateRouteToPassenger(p)}
                          className={`p-4 rounded-[1.5rem] border-2 cursor-pointer transition-all ${
                            selectedPassengerId === p.userId 
                            ? 'border-red-600/30 bg-red-50/50' 
                            : 'border-gray-50 bg-gray-50/50 hover:border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <User size={20} className="text-gray-400" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="font-black text-gray-900 truncate">{p.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.phone}</p>
                             </div>
                             <ExternalLink size={14} className="text-gray-300" />
                          </div>
                        </div>
                    ))
                )}
             </div>
           </div>
           
           <div className="mt-auto p-6 bg-red-50/50">
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                    <Clock size={20} />
                 </div>
                 <div>
                    <p className="font-black text-red-900 uppercase tracking-widest text-[10px] mb-1">
                      {t('locationsBase.autoShare', 'Auto-Sharing Active')}
                    </p>
                    <p className="text-xs text-red-600/70 font-bold">
                      {t('locationsBase.autoShareDesc', 'Your location updates every 5 mins to passengers')}
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
           <GoogleMap
             mapContainerStyle={mapContainerStyle}
             center={center}
             zoom={11}
             options={mapOptions}
             onLoad={onMapLoad}
           >
             {/* Driver Marker */}
             {driverLocation && (
               <Marker
                 position={driverLocation}
                 title={t('locationsBase.you', 'You')}
                 icon={{
                   url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                   scaledSize: new window.google.maps.Size(40, 40),
                   anchor: new window.google.maps.Point(20, 20),
                 }}
               />
             )}

             {/* Passenger Markers */}
             {passengerData.map((p) => (
                <Marker
                  key={p.userId}
                  position={{ lat: p.lat, lng: p.lng }}
                  onClick={() => calculateRouteToPassenger(p)}
                  label={{
                      text: p.name,
                      className: 'marker-label',
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: '12px',
                  }}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    scaledSize: new window.google.maps.Size(32, 32),
                    anchor: new window.google.maps.Point(16, 16),
                  }}
                />
             ))}

             {directionsResponse && (
               <DirectionsRenderer
                 directions={directionsResponse}
                 options={{ 
                   suppressMarkers: true,
                   polylineOptions: {
                       strokeColor: '#dc2626',
                       strokeWeight: 6,
                       strokeOpacity: 0.8
                   }
                 }}
               />
             )}
           </GoogleMap>
        </div>
      </div>
      
      <style>{`
        .marker-label {
            background: white;
            padding: 4px 10px;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            border: 1px solid #f1f5f9;
            transform: translateY(-40px);
        }
      `}</style>
    </div>
  );
};

export default LocationsBase;
