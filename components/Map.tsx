import { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import MapMarkerIcon from "./map-marker-icon";
import { PassportEvent } from "./passport-map";

type MapProps = {
  position: [number, number];
  events?: PassportEvent[];
  selectedEvent?: PassportEvent | null;
  onSelectEvent?: (event: PassportEvent) => void;
};

// Extended marker interface
type MapMarker = {
  id: string;
  position: L.LatLngExpression;
  name: string;
  event?: PassportEvent;
};

// Define the Map component
export default function Map({ 
  position, 
  events = [], 
  selectedEvent,
  onSelectEvent 
}: MapProps) {
  // Initial zoom level and zoomed-in level - exactly 17 for zoomed in
  const initialZoom = 14;
  const zoomedInLevel = 17;
  // Current zoom level state
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  // Reference to the map
  const mapRef = useRef<L.Map | null>(null);
  // Track previous selected event to avoid unnecessary flyTo
  const prevSelectedEventRef = useRef<string | null>(null);

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

  // Handle marker click - call onSelectEvent if provided
  const handleMarkerClick = (event: PassportEvent) => {
    if (onSelectEvent) {
      // Call parent's handler to update selectedEvent
      onSelectEvent(event);
    }
  };

  // Fly to the selected event position when it changes
  useEffect(() => {
    if (selectedEvent && mapRef.current) {
      const currentSelectedId = selectedEvent.id;
      const wasNothingSelected = prevSelectedEventRef.current === null;
      
      // Only fly if the selected event has changed
      if (prevSelectedEventRef.current !== currentSelectedId) {
        const map = mapRef.current;
        
        // If we're coming from no selection to having a selection,
        // always zoom to exactly level 17. Otherwise, maintain current zoom.
        const targetZoom = wasNothingSelected ? zoomedInLevel : map.getZoom();
        
        // Set the current zoom level state if we're zooming in
        if (wasNothingSelected) {
          setCurrentZoom(zoomedInLevel);
        }
        
        map.flyTo(
          [selectedEvent.location.lat, selectedEvent.location.lng],
          targetZoom,
          {
            animate: true,
            duration: 1,
          }
        );
        
        // Update the ref to track the current selectedEvent
        prevSelectedEventRef.current = currentSelectedId;
      }
    } else if (!selectedEvent) {
      // Reset when deselected
      setCurrentZoom(initialZoom);
      prevSelectedEventRef.current = null;
    }
  }, [selectedEvent, initialZoom, zoomedInLevel]);

  return (
    <MapContainer
      center={position}
      zoom={initialZoom}
      scrollWheelZoom={false}
      style={{ height: "100vh", width: "100%" }}
      ref={mapRef}
      className="w-full h-full"
      key="map-container" // Adding a stable key to help React identify this component
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render markers from events */}
      {events.map((event) => {
        const isSelected = selectedEvent && event.id === selectedEvent.id;
        
        return (
          <Marker
            key={event.id}
            position={[event.location.lat, event.location.lng]}
            icon={isSelected ? selectedIcon : defaultIcon}
            eventHandlers={{
              click: () => handleMarkerClick(event),
            }}
          />
        );
      })}
    </MapContainer>
  );
}
