export interface LocationMarkerProps {
  setUserLocation: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
}

// Props type for Recenter component
export interface RecenterProps {
  lat: number | null;
  lng: number | null;
}