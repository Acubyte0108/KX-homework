import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from 'react-dom/server';
import MapMarkerIcon from "./MapMarkerIcon";

interface MapProps {
  position: [number, number];
}

// Component to handle centering the map on a selected position
const MapCenterer = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), {
        animate: true,
        duration: 1
      });
    }
  }, [map, position]);
  
  return null;
};

const Map = ({ position }: MapProps) => {
  const [selectedMarker, setSelectedMarker] = useState<[number, number] | null>(null);
  
  useEffect(() => {
    // Set up default icon if needed as a fallback
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  // Create custom icon using our SVG component
  const createCustomIcon = (color: string, size: number = 40) => {
    const iconMarkup = renderToStaticMarkup(
      <MapMarkerIcon color={color} size={size} />
    );
    
    return L.divIcon({
      html: iconMarkup,
      className: "custom-icon",
      iconSize: [size, size],
      iconAnchor: [size/2, size],
    });
  };

  // Memoize icons to avoid recreating them on every render
  const pinkIcon = useMemo(() => createCustomIcon("#FF1493"), []);
  const darkIcon = useMemo(() => createCustomIcon("#333333"), []);
  const selectedPinkIcon = useMemo(() => createCustomIcon("#FF1493", 60), []);
  const selectedDarkIcon = useMemo(() => createCustomIcon("#333333", 60), []);

  // Define our marker locations
  const markers = useMemo(() => [
    { id: 1, position: position, name: "Main location", icon: pinkIcon, selectedIcon: selectedPinkIcon },
    { id: 2, position: [position[0] - 0.01, position[1] - 0.01] as [number, number], name: "Location A", icon: darkIcon, selectedIcon: selectedDarkIcon },
    { id: 3, position: [position[0] - 0.005, position[1] + 0.01] as [number, number], name: "Location B", icon: darkIcon, selectedIcon: selectedDarkIcon },
  ], [position, pinkIcon, darkIcon, selectedPinkIcon, selectedDarkIcon]);

  return (
    <MapContainer 
      center={position} 
      zoom={14} 
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Center map on selected marker */}
      <MapCenterer position={selectedMarker} />
      
      {/* Render all markers */}
      {markers.map((marker) => (
        <Marker 
          key={marker.id}
          position={marker.position}
          icon={selectedMarker && 
                marker.position[0] === selectedMarker[0] && 
                marker.position[1] === selectedMarker[1] 
                ? marker.selectedIcon 
                : marker.icon}
          eventHandlers={{
            click: () => {
              setSelectedMarker(marker.position);
            }
          }}
        >
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map; 