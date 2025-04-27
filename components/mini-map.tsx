import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { cn } from "@/lib/utils";

type MiniMapProps = {
  defaultPosition: L.LatLngExpression;
  selectedPosition?: L.LatLngExpression;
  initialZoomLevel?: number;
  maxZoomLevel?: number;
  className?: string;
};

export default function MiniMap({
  defaultPosition,
  selectedPosition,
  initialZoomLevel = 14,
  maxZoomLevel = 18,
  className,
}: MiniMapProps) {;
  const mapRef = useRef<L.Map | null>(null);
  const [hasSelectedBefore, setHasSelectedBefore] = useState(false);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    if (selectedPosition) {
      map.flyTo(selectedPosition, maxZoomLevel, {
        animate: true,
        duration: 1,
      });

      // Track that we've had a selection before
      if (!hasSelectedBefore) {
        setHasSelectedBefore(true);
      }
    } else if (hasSelectedBefore) {
      // If we previously had a selection but now don't,
      // fly back to default position with default zoom
      map.flyTo(defaultPosition, initialZoomLevel, {
        animate: true,
        duration: 1,
      });
    }
  }, [selectedPosition, defaultPosition, hasSelectedBefore]);

  const circleStyle = {
    fillColor: "#FF1493",
    fillOpacity: 0.2,
    color: "#FF1493",
    weight: 1,
  };

  return (
    <MapContainer
      center={selectedPosition || defaultPosition}
      zoom={selectedPosition ? maxZoomLevel : initialZoomLevel}
      zoomControl={false}
      scrollWheelZoom={false}
      className={cn("w-full h-full", className)}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Only show marker and circle when selectedPosition exists */}
      {selectedPosition && (
        <>
          <Marker position={selectedPosition} />
          <Circle
            center={selectedPosition}
            radius={50}
            pathOptions={circleStyle}
          />
        </>
      )}
    </MapContainer>
  );
}
