import { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import MapMarkerIcon from "./map-marker-icon";
import { PassportEvent } from "./passport-context";

type MapProps = {
  position: [number, number];
  events?: PassportEvent[];
};

// Extended marker interface
type MapMarker = {
  id: string;
  position: L.LatLngExpression;
  name: string;
  event?: PassportEvent;
};

export default function Map({ position, events = [] }: MapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  // Initial zoom level and zoomed-in level
  const initialZoom = 14;
  const zoomedInLevel = initialZoom + 3; // 17
  // Current zoom level state
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  // Reference to the map
  const mapRef = useRef<L.Map | null>(null);

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
      iconAnchor: [size / 2, size],
    });
  };

  // Memoize icons to avoid recreating them on every render
  const defaultIcon = useMemo(() => createCustomIcon("#000000", 40), []); // Black color for all markers
  const selectedIcon = useMemo(() => createCustomIcon("#FF1493", 60), []); // Pink color for selected markers

  // Define our marker locations - combine default position with events
  const markers = useMemo(() => {
    const defaultMarkers: MapMarker[] = [
      { id: "main", position, name: "Main location" }
    ];
    
    // Add markers from events if available
    const eventMarkers: MapMarker[] = events.map(event => ({
      id: event.id,
      position: [event.location.lat, event.location.lng],
      name: `Event ${event.id}`,
      event
    }));
    
    return [...defaultMarkers, ...eventMarkers];
  }, [position, events]);

  // Handle marker selection and zoom
  const handleMarkerClick = (marker: MapMarker) => {
    // If this is first selection or changing from no selection, zoom in
    if (selectedMarker === null) {
      setCurrentZoom(zoomedInLevel);
    }
    // Update selected marker
    setSelectedMarker(marker);
  };

  // Reset zoom when deselecting
  useEffect(() => {
    if (selectedMarker === null) {
      setCurrentZoom(initialZoom);
    }
  }, [selectedMarker, initialZoom]);

  // Center map on selected marker
  useEffect(() => {
    if (selectedMarker && mapRef.current) {
      const map = mapRef.current;
      map.flyTo(selectedMarker.position, currentZoom, {
        animate: true,
        duration: 1,
      });
    }
  }, [selectedMarker, currentZoom]);

  return (
    <MapContainer
      center={position}
      zoom={initialZoom}
      scrollWheelZoom={false}
      style={{ height: "100vh", width: "100%" }}
      ref={mapRef}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render all markers */}
      {markers.map((marker) => {
        const isSelected = selectedMarker && marker.id === selectedMarker.id;

        return (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={isSelected ? selectedIcon : defaultIcon}
            eventHandlers={{
              click: () => {
                handleMarkerClick(marker);
              },
            }}
          ></Marker>
        );
      })}
    </MapContainer>
  );
}
