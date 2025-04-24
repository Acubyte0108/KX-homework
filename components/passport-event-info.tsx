import { PassportEvent } from "@/components/passport-map";
import L from "leaflet";
import dynamic from "next/dynamic";
import Image from "next/image";

// Dynamically import MiniMap with no SSR
const MiniMapWithNoSSR = dynamic(() => import("@/components/mini-map"), {
  ssr: false,
});

type PassportEventInfoProps = {
  selectedEvent: PassportEvent;
  defaultPosition: L.LatLngExpression;
  onClose: () => void;
}

export default function PassportEventInfo({ 
  selectedEvent, 
  defaultPosition, 
  onClose 
}: PassportEventInfoProps) {
  // Prepare the selected position for the mini map
  const selectedPosition: L.LatLngTuple = [selectedEvent.location.lat, selectedEvent.location.lng];

  return (
    <div className="fixed left-8 top-8 bg-white shadow-lg rounded-lg p-4 max-w-sm z-1000 w-[400px] h-[calc(100vh-4rem)] overflow-auto">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium">Event {selectedEvent.id}</h3>
        <button 
          className="text-gray-500 hover:text-gray-700" 
          onClick={onClose}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="mb-3">
        <div className="relative w-full h-40">
          <Image 
            src={selectedEvent.image_url} 
            alt={`Event ${selectedEvent.id}`} 
            fill
            sizes="100px"
            className="object-cover rounded-md w-full h-full"
            onError={(e) => {
              // Replace with a fallback on error
              const target = e.target as HTMLImageElement;
              target.src = `https://placehold.co/200x200?text=Event+${selectedEvent.id}`;
            }}
          />
        </div>
      </div>
      
      <div className="mb-3 text-xs text-gray-500">
        <p>Location: {selectedEvent.location.lat.toFixed(6)}, {selectedEvent.location.lng.toFixed(6)}</p>
        <p className="mt-1">ID: {selectedEvent.id}</p>
      </div>
      
      {/* Mini Map */}
      <div className="mt-4">
        <div className="text-sm font-medium mb-2">Location</div>
        <div className="h-40 w-full">
          <MiniMapWithNoSSR 
            defaultPosition={defaultPosition} 
            selectedPosition={selectedPosition} 
            className="h-[300px]"
          />
        </div>
      </div>
    </div>
  );
} 