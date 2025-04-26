import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";
import { PassportEvent } from "@/components/passport-map";
import { cn } from "@/lib/utils";

type MapProps = {
  defaultPosition: L.LatLngExpression;
  initialZoomLevel?: number;
  maxZoomLevel?: number;
  events?: PassportEvent[];
  selectedEvent?: PassportEvent | null;
  onSelectEvent?: (event: PassportEvent) => void;
  className?: string;
};

export default function Map({
  defaultPosition,
  initialZoomLevel = 14,
  maxZoomLevel = 17,
  events = [],
  selectedEvent,
  onSelectEvent,
  className,
}: MapProps) {
  // Map reference
  const mapRef = useRef<L.Map | null>(null);

  // Track previous selected event to avoid unnecessary flyTo
  const prevSelectedEventIdRef = useRef<string | null>(null);

  // Set up Leaflet default icons
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  // Create custom icon using SVG component
  const createCustomIcon = (color: string, size: number = 40) => {
    const iconMarkup = renderToStaticMarkup(
      <MapPin color="#FFFFFF" size={size} fill={color} strokeWidth={1.5}/>
    );

    return L.divIcon({
      html: iconMarkup,
      className: "custom-icon",
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
    });
  };

  // Memoize icons
  const defaultIcon = useMemo(() => createCustomIcon("#000000", 40), []);
  const selectedIcon = useMemo(() => createCustomIcon("#FF1493", 60), []);

  // Handle marker click
  const handleMarkerClick = (event: PassportEvent) => {
    if (onSelectEvent) {
      onSelectEvent(event);
    }
  };

  // Handle selected event changes
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    if (selectedEvent) {
      const currentSelectedId = selectedEvent.id;

      // Only fly if the selected event has changed
      if (prevSelectedEventIdRef.current !== currentSelectedId) {
        map.flyTo(
          [selectedEvent.location.lat, selectedEvent.location.lng],
          maxZoomLevel,
          {
            animate: true,
            duration: 1,
          }
        );

        // Update the ref to track the current selectedEvent
        prevSelectedEventIdRef.current = currentSelectedId;
      }
    } else if (!selectedEvent && prevSelectedEventIdRef.current !== null) {
      // Reset when deselected - fly back to default position and reset zoom

      map.flyTo(defaultPosition, initialZoomLevel, {
        animate: true,
        duration: 1,
      });

      prevSelectedEventIdRef.current = null;
    }
  }, [selectedEvent, defaultPosition]);

  return (
    <MapContainer
      center={defaultPosition}
      zoom={initialZoomLevel}
      zoomControl={false}
      scrollWheelZoom={true}
      ref={mapRef}
      className={cn("w-full h-full z-0", className)}
      key="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

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
