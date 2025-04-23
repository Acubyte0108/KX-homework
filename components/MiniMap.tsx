import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MiniMapProps {
  position?: [number, number]; // Optional as it might be null initially
}

// Component to handle centering the map on a position
const MapCenterer = ({
  position,
  zoomLevel
}: {
  position: [number, number] | undefined;
  zoomLevel: number;
}) => {
  const map = useMap();
  const isFirstPositionRef = useRef(true);

  useEffect(() => {
    if (position) {
      // If this is the first position, use the provided zoom level
      // Otherwise maintain the current zoom level
      const zoom = isFirstPositionRef.current ? zoomLevel : map.getZoom();
      
      map.flyTo(position, zoom, {
        animate: true,
        duration: 1,
      });
      
      // After first position is set, mark that we've had a position
      if (isFirstPositionRef.current) {
        isFirstPositionRef.current = false;
      }
    }
  }, [map, position, zoomLevel]);

  return null;
};

const MiniMap = ({ position }: MiniMapProps) => {
  const defaultZoom = 15;
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Set up default icon
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

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

      {/* Center map on position */}
      {position && (
        <MapCenterer 
          position={position} 
          zoomLevel={defaultZoom}
        />
      )}

      {/* Marker and circle */}
      {position && (
        <>
          <Marker position={position} />
          <Circle
            center={position}
            radius={50}
            pathOptions={circleStyle}
          />
        </>
      )}
    </MapContainer>
  );
};

export default MiniMap; 