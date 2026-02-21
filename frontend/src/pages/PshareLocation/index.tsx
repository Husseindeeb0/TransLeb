import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import {
  MapPin,
  Navigation,
  Clock,
  ArrowRight,
  Crosshair,
  Info,
  User,
  ChevronLeft,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  useEditCoordinateMutation,
  useDeleteCoordinateMutation,
  useGetCoordinatesQuery,
} from '../../state/services/coordinates/coordinatesAPI';
import { connectSocket, socket } from '../../socketio/socket';
import { useGetUserDetailsQuery } from '../../state/services/user/userAPI';
import { useAuth } from '../../hooks/useAuth';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
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

const PshareLocation: React.FC = () => {
  const { t } = useTranslation();
  const { dayCardId } = useParams<{ dayCardId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?._id;

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [editCoordinate, editStatus] = useEditCoordinateMutation();
  const [deleteCoordinate] = useDeleteCoordinateMutation();
  
  const { data: existingCoordinates, isSuccess: isCoordsLoaded } = useGetCoordinatesQuery(undefined, {
    skip: !userId
  });
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const [driverId, setDriverId] = useState<string | null>(null);

  const { data: driverDetails } = useGetUserDetailsQuery(driverId!, {
      skip: !driverId,
    });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (isCoordsLoaded && existingCoordinates?.data) {
      console.log('Found saved coordinates:', existingCoordinates.data);
      setUserLocation({
        lat: existingCoordinates.data.lat,
        lng: existingCoordinates.data.lng,
      });

      if (existingCoordinates.data.markedBy) {
        setDriverId(existingCoordinates.data.markedBy);
      }

      if (userId) {
        connectSocket(userId);
      }
    }
  }, [isCoordsLoaded, existingCoordinates, userId]);

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
      toast(t('pshareLocation.toast.timerEnded'), { icon: '⌛' });
    });

    socket.on('driverMarked', (data: { driverId: string }) => {
      toast.success(t('pshareLocation.toast.driverMarked'));
      if (data?.driverId) {
        setDriverId(data.driverId);
      }
    });

    socket.on('driverUnmarked', () => {
      toast.error(t('pshareLocation.toast.driverUnmarked'), {
        icon: '⚠️',
      });
      setDriverId(null);
    });

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

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setUserLocation({
        lat: Number(e.latLng.lat().toFixed(5)),
        lng: Number(e.latLng.lng().toFixed(5)),
      });
    }
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = {
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
          };
          setUserLocation(newLoc);
          setIsLocating(false);
          mapRef.current?.panTo(newLoc);
          mapRef.current?.setZoom(16);
        },
        () => {
          toast.error(t('pshareLocation.toast.locationFailed'));
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error(t('pshareLocation.toast.geoNotSupported'));
      setIsLocating(false);
    }
  };

  const handleShareLocation = async () => {
    if (!userLocation) {
      toast.error(t('pshareLocation.toast.locationNotSet'));
      return;
    }

    if (!userId) {
      toast.error(t('pshareLocation.toast.sessionNotFound'));
      return;
    }

    try {
      await editCoordinate({
        lat: userLocation.lat,
        lng: userLocation.lng,
        userId,
        dayCardId: dayCardId,
      }).unwrap();

      console.log('Connecting socket for user:', userId);
      connectSocket(userId);
      toast.success(t('pshareLocation.toast.sharedSuccess', 'Your location is shared with the driver'));
    } catch (err) {
      console.error('Failed to share location:', err);
      toast.error(t('pshareLocation.toast.sharedError', 'Sharing location failed'));
    }
  };

  const handleDeleteLocation = async () => {
    if (!userId) {
      setUserLocation(null);
      return;
    }
    try {
      await deleteCoordinate().unwrap();
      setUserLocation(null);
      toast.success(t('pshareLocation.toast.deleteSuccess'));
    } catch (err) {
      toast.error(t('pshareLocation.toast.deleteError'));
    }
  };

  if (loadError) return <div className="p-10 text-red-600 font-bold">{t('pshareLocation.errorLoadingMaps')}</div>;
  if (!isLoaded) return <div className="flex items-center justify-center h-screen font-bold text-gray-400">{t('pshareLocation.loadingMap')}</div>;

  return (
    <div className="bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 md:px-8 flex items-center justify-between sticky top-0 z-50 flex-none">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 rounded-xl">
              <MapPin className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">
                {t('pshareLocation.title', 'Share Your Location')}
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-1">
                {t('pshareLocation.subtitle', 'Let the driver know where to pick you up')}
              </p>
            </div>
          </div>
        </div>

        {/* User Badge if marked */}
        {driverId && (
          <div className="hidden md:flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
              {driverDetails?.name?.[0] || 'D'}
            </div>
            <div>
              <p className="text-xs text-green-700 font-bold uppercase tracking-wider">{t('pshareLocation.driverAssigned')}</p>
              <p className="text-sm font-bold text-gray-900">{driverDetails?.name || t('pshareLocation.loading')}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Left Sidebar - Controls */}
        <div className="w-full lg:w-96 p-4 md:p-6 bg-white border-r border-gray-100 z-20 shadow-xl lg:shadow-none">
          <div className="space-y-6">
            {/* Steps Guide */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center space-x-2">
                <Info className="h-4 w-4 text-red-600" />
                <span>{t('pshareLocation.guide.title')}</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <p className="text-sm text-gray-600 font-medium">{t('pshareLocation.guide.step1')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <p className="text-sm text-gray-600 font-medium">{t('pshareLocation.guide.step2')}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                  <p className="text-sm text-gray-600 font-medium">{t('pshareLocation.guide.step3')}</p>
                </div>
              </div>
            </div>

            {/* Location Status */}
            <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${userLocation ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-transparent'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t('pshareLocation.currentState')}</h3>
                  <p className={`text-lg font-black ${userLocation ? 'text-green-700' : 'text-gray-400'}`}>
                    {userLocation ? t('pshareLocation.locationReady') : t('pshareLocation.awaitingSelection')}
                  </p>
                </div>
                {userLocation && <div className="p-1 px-3 bg-green-600 text-white text-[10px] font-black uppercase rounded-full animate-pulse">{t('pshareLocation.live')}</div>}
              </div>

              {userLocation && (
                <div className="space-y-1 mb-6">
                  <div className="flex items-center text-sm font-bold text-gray-700">
                    <Navigation className="h-3 w-3 mr-2 text-gray-400" />
                    {userLocation.lat}, {userLocation.lng}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                   onClick={handleLocateMe}
                  disabled={isLocating}
                  className="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-red-600/30 hover:bg-red-50/10 transition-all group disabled:opacity-50"
                >
                  <Crosshair className={`h-5 w-5 mb-2 transition-colors ${isLocating ? 'animate-spin text-red-600' : 'text-gray-400 group-hover:text-red-600'}`} />
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">{t('pshareLocation.autoLocate')}</span>
                </button>
                <button
                  onClick={handleShareLocation}
                  disabled={!userLocation || editStatus.isLoading}
                  className="flex flex-col items-center justify-center p-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 disabled:bg-gray-200"
                >
                  <Navigation className={`h-5 w-5 mb-2 ${userLocation ? 'animate-bounce' : ''}`} />
                  <span className="text-[10px] font-black uppercase tracking-wider">{t('pshareLocation.shareLive')}</span>
                </button>
              </div>
            </div>

            {/* Timer / Driver Info */}
            {remainingTime !== null && (
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-xl shadow-red-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="h-4 w-4 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-red-100">{t('pshareLocation.expiry')}</span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black">{remainingTime}</span>
                    <span className="text-sm font-bold text-red-100 uppercase">{t('pshareLocation.minutesLeft')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Assigned Driver Card */}
            {driverId && (
              <div className="bg-white rounded-2xl p-6 border-2 border-green-500 shadow-xl shadow-green-50 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-3">
                  <div className="p-1 px-2 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-lg">{t('pshareLocation.onTheWay')}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden border-4 border-white">
                    {driverDetails?.profileImage ? (
                      <img src={driverDetails.profileImage} alt={driverDetails.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg leading-tight">{driverDetails?.name || t('pshareLocation.yourDriver')}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{t('pshareLocation.lovesTraveling')}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center space-x-3">
                  <a
                    href={`tel:${driverDetails?.phoneNumber}`}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl text-center text-sm font-black uppercase tracking-widest hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                  >
                    {t('pshareLocation.callDriver')}
                  </a>
                </div>
              </div>
            )}

             {/* Delete Location Section */}
            {userLocation && isCoordsLoaded && existingCoordinates?.data && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full -mr-10 -mt-10 opacity-50" />
                <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4">{t('pshareLocation.dangerZone')}</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={handleDeleteLocation}
                    className="w-full px-5 py-3 text-xs font-bold text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin size={14} />
                    {t('pshareLocation.deleteLocation', 'Remove from Map')}
                  </button>
                </div>
              </div>
            )}

            {/* Next Step */}
            <div className="bg-gradient-to-r from-red-700 to-green-600 rounded-2xl shadow-lg p-6 text-white animate-in slide-in-from-bottom duration-500">
              <h3 className="text-lg font-semibold mb-2">{t('pshareLocation.readyToGo')}</h3>
              <p className="text-sm text-white/90 mb-4">
                {t('pshareLocation.readySubtitle')}
              </p>

              <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-white/20 hover:transform hover:-translate-y-1">
                <span>{t('pshareLocation.findDrivers')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Instructions */}
            <div className="flex items-center justify-center py-4 text-gray-400">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t('common.safeTravels', 'Travel Safe with TransLeb')}</span>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 lg:h-[calc(100vh-73px)] lg:sticky lg:top-[73px] relative min-h-[500px]">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation || center}
            zoom={userLocation ? 16 : 12}
            options={mapOptions}
            onClick={onMapClick}
            onLoad={onMapLoad}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                draggable={true}
                onDragEnd={(e) => {
                  if (e.latLng) {
                    setUserLocation({
                      lat: Number(e.latLng.lat().toFixed(5)),
                      lng: Number(e.latLng.lng().toFixed(5)),
                    });
                  }
                }}
              />
            )}
          </GoogleMap>

          {/* Simple Map Overlay Buttons */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 pointer-events-none">
            {!userLocation && (
              <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-3xl shadow-2xl border border-white/20 flex items-center space-x-3 animate-bounce">
                <div className="p-2 bg-red-600 rounded-full">
                  <Navigation className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{t('pshareLocation.clickMapPin')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PshareLocation;
