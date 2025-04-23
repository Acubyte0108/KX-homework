import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type MiniMapProps = {
  position?: L.LatLngExpression; // Optional as it might be null initially
};

export default function MiniMap({ position }: MiniMapProps) {
  const defaultZoom = 18;
  const mapRef = useRef<L.Map | null>(null);
  const [isFirstPosition, setIsFirstPosition] = useState(true);

  useEffect(() => {
    // Set up default icon
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  // Handle position changes
  useEffect(() => {
    if (position && mapRef.current) {
      const map = mapRef.current;

      // If this is the first position, use the default zoom
      // Otherwise maintain the current zoom level
      const zoom = isFirstPosition ? defaultZoom : map.getZoom();

      map.flyTo(position, zoom, {
        animate: true,
        duration: 1,
      });

      // After first position is set, mark that we've had a position
      if (isFirstPosition) {
        setIsFirstPosition(false);
      }
    }
  }, [position, isFirstPosition, defaultZoom]);

  // Circle overlay style
  const circleStyle = {
    fillColor: "#FF1493",
    fillOpacity: 0.2,
    color: "#FF1493",
    weight: 1,
  };

  return (
    <MapContainer
      center={position || [51.505, -0.09]} // Default position if none provided
      zoom={defaultZoom}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marker and circle */}
      {position && (
        <>
          <Marker position={position} />
          <Circle center={position} radius={50} pathOptions={circleStyle} />
        </>
      )}
    </MapContainer>
  );
}
