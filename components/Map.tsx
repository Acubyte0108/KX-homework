import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import MapMarkerIcon from "./MapMarkerIcon";

interface MapProps {
  position: [number, number];
}

// Component to handle centering the map on a selected position
const MapCenterer = ({
  position,
  zoomLevel,
}: {
  position: [number, number] | null;
  zoomLevel: number;
}) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, zoomLevel, {
        animate: true,
        duration: 1,
      });
    }
  }, [map, position, zoomLevel]);

  return null;
};

const Map = ({ position }: MapProps) => {
  const [selectedMarker, setSelectedMarker] = useState<[number, number] | null>(
    null
  );
  // Initial zoom level and zoomed-in level
  const initialZoom = 14;
  const zoomedInLevel = initialZoom + 3; // 17
  // Current zoom level state
  const [currentZoom, setCurrentZoom] = useState(initialZoom);

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

  // Define our marker locations
  const markers = useMemo(
    () => [
      { id: 1, position: position, name: "Main location" },
      {
        id: 2,
        position: [position[0] - 0.01, position[1] - 0.01] as [number, number],
        name: "Location A",
      },
      {
        id: 3,
        position: [position[0] - 0.005, position[1] + 0.01] as [number, number],
        name: "Location B",
      },
    ],
    [position]
  );

  // Handle marker selection and zoom
  const handleMarkerClick = (markerPosition: [number, number]) => {
    // If this is first selection or changing from no selection, zoom in
    if (selectedMarker === null) {
      setCurrentZoom(zoomedInLevel);
    }
    // Update selected marker
    setSelectedMarker(markerPosition);
  };

  // Reset zoom when deselecting
  useEffect(() => {
    if (selectedMarker === null) {
      setCurrentZoom(initialZoom);
    }
  }, [selectedMarker, initialZoom]);

  // Custom component to handle map events
  const MapEvents = () => {
    const map = useMap();

    useEffect(() => {
      // Listen for zoom end and update current zoom
      const handleZoomEnd = () => {
        console.log("Zoom changed to:", map.getZoom());
      };

      map.on("zoomend", handleZoomEnd);

      return () => {
        map.off("zoomend", handleZoomEnd);
      };
    }, [map]);

    return null;
  };

  // Circle overlay style for selected marker
  const circleStyle = {
    fillColor: "#FF1493",
    fillOpacity: 0.2,
    color: "#FF1493",
    weight: 1,
  };

  return (
    <MapContainer
      center={position}
      zoom={initialZoom}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Debug component */}
      <MapEvents />

      {/* Center map on selected marker */}
      {selectedMarker && (
        <MapCenterer position={selectedMarker} zoomLevel={currentZoom} />
      )}

      {/* Circle overlay for selected marker */}
      {selectedMarker && currentZoom > initialZoom && (
        <Circle
          center={selectedMarker}
          radius={50}
          pathOptions={circleStyle}
        />
      )}

      {/* Render all markers */}
      {markers.map((marker) => {
        const isSelected =
          selectedMarker &&
          marker.position[0] === selectedMarker[0] &&
          marker.position[1] === selectedMarker[1];

        return (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={isSelected ? selectedIcon : defaultIcon}
            eventHandlers={{
              click: () => {
                handleMarkerClick(marker.position);
              },
            }}
          ></Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
