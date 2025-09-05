import { useEffect } from "react";
import type { RecenterProps } from "../types/rideTypes";
import { useMap } from "react-leaflet";

// Helper to move map view when user location is set
export const Recenter = ({ lat, lng }: RecenterProps): null => {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.setView([lat, lng], 18);
    }
  }, [lat, lng, map]);
  return null;
}