import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import MapMarkerIcon from "@/components/map-marker-icon";
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
  const mapRef = useRef<L.Map | null>(null);
  const prevSelectedEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

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

  const defaultIcon = useMemo(() => createCustomIcon("#000000", 40), []);
  const selectedIcon = useMemo(() => createCustomIcon("#FF1493", 60), []);

  const handleMarkerClick = (event: PassportEvent) => {
    if (onSelectEvent) {
      onSelectEvent(event);
    }
  };

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

        prevSelectedEventIdRef.current = currentSelectedId;
      }
    } else if (!selectedEvent && prevSelectedEventIdRef.current !== null) {
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
