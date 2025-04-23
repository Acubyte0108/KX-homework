import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type MiniMapProps = {
  defaultPosition: L.LatLngExpression;
  selectedPosition?: L.LatLngExpression; // Optional selected position
};

export default function MiniMap({
  defaultPosition,
  selectedPosition,
}: MiniMapProps) {
  const defaultZoomLevel = 14;
  const maxZoomLevel = 18;
  const mapRef = useRef<L.Map | null>(null);
  const [hasSelectedBefore, setHasSelectedBefore] = useState(false);

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
    if (!mapRef.current) return;

    const map = mapRef.current;

    if (selectedPosition) {
      // Zoom to selected position with max zoom level
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
      map.flyTo(defaultPosition, defaultZoomLevel, {
        animate: true,
        duration: 1,
      });
    }
  }, [selectedPosition, defaultPosition, hasSelectedBefore]);

  // Circle overlay style
  const circleStyle = {
    fillColor: "#FF1493",
    fillOpacity: 0.2,
    color: "#FF1493",
    weight: 1,
  };

  return (
    <MapContainer
      center={selectedPosition || defaultPosition}
      zoom={selectedPosition ? maxZoomLevel : defaultZoomLevel}
      zoomControl={false}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%" }}
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
