import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from 'react-dom/server';
import MapMarkerIcon from "./MapMarkerIcon";

interface MapProps {
  position: [number, number];
}

const Map = ({ position }: MapProps) => {
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
  const createCustomIcon = (color: string) => {
    const iconMarkup = renderToStaticMarkup(
      <MapMarkerIcon color={color} size={40} />
    );
    
    return L.divIcon({
      html: iconMarkup,
      className: "custom-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  };

  const pinkIcon = createCustomIcon("#FF1493"); // Pink color
  const darkIcon = createCustomIcon("#333333"); // Dark color

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Primary marker with pink icon */}
      <Marker position={position} icon={pinkIcon}>
        <Popup>
          Main location
        </Popup>
      </Marker>
      
      {/* Additional markers with dark icons */}
      <Marker position={[position[0] - 0.01, position[1] - 0.01]} icon={darkIcon}>
        <Popup>
          Location A
        </Popup>
      </Marker>
      
      <Marker position={[position[0] - 0.005, position[1] + 0.01]} icon={darkIcon}>
        <Popup>
          Location B
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map; 