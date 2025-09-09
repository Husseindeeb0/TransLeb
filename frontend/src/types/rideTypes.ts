export interface LocationMarkerProps {
  handleSetLocation: (lat?: number, lng?: number) => void;
}

// Props type for Recenter component
export interface RecenterProps {
  lat: number | null;
  lng: number | null;
}
