import { PassportEvent } from "@/components/passport-map";
import L from "leaflet";
import dynamic from "next/dynamic";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dynamically import MiniMap with no SSR
const MiniMapWithNoSSR = dynamic(() => import("@/components/mini-map"), {
  ssr: false,
});

type DesktopEventInfoProps = {
  selectedEvent: PassportEvent;
  defaultPosition: L.LatLngExpression;
  onClose: () => void;
};

export function DesktopEventInfo({
  selectedEvent,
  defaultPosition,
  onClose,
}: DesktopEventInfoProps) {
  // Prepare the selected position for the mini map
  const selectedPosition: L.LatLngTuple = [
    selectedEvent.location.lat,
    selectedEvent.location.lng,
  ];

  return (
    <div className="fixed left-8 top-8 bg-coral-blue shadow-lg rounded-lg p-4 max-w-sm z-10 w-[400px] h-[calc(100vh-4rem)] overflow-auto text-white">
      <div className="relative p-4">
        {/* X button in top right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/20 backdrop-blur-none cursor-pointer"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Badge Image */}
        <div className="flex items-center justify-center mb-6">
          <div className="rounded-full bg-slate-800 p-2 mt-4">
            <Image
              src={selectedEvent.image_url}
              alt={`Event ${selectedEvent.id}`}
              width={250}
              height={250}
              className="rounded-full"
              onError={(e) => {
                // Replace with a fallback on error
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/250x250?text=Event+${selectedEvent.id}`;
              }}
            />
          </div>
        </div>

        {/* Title */}
        {/* <h1 className="text-2xl font-bold text-center mb-4">
          {selectedEvent.title || `ทางม้าลายแยกเฉลิมบุรี (${selectedEvent.id})`}
        </h1> */}
        <h1 className="text-2xl font-bold text-center mb-4">
          {`ทางม้าลายแยกเฉลิมบุรี (${selectedEvent.id})`}
        </h1>

        {/* Availability info */}
        {/* <div className="text-sm text-center mb-6">
          Available to collect from {format(new Date(), "d MMM yyyy HH:mm")} to 
          <br />
          {format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "d MMM yyyy HH:mm")}
        </div> */}

        {/* Collect Now button */}
        <button className="w-full mb-4 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-full">
          Collect Now
        </button>

        {/* How to collect accordion */}
        <Accordion
          type="single"
          collapsible
          className="mb-4 bg-white/20 backdrop-blur-none rounded-lg"
        >
          <AccordionItem value="collect-info">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium">
              How to collect this collectible
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="flex items-start gap-2 mb-4">
                <div className="mt-1 bg-slate-700 rounded-full p-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">How to collect</h3>
                  <p className="text-sm text-slate-300">
                    Visit this location within 50 meters of the marker to
                    collect this badge.
                  </p>
                </div>
              </div>

              {/* Mini Map inside accordion */}
              <div className="h-48 w-full rounded-lg overflow-hidden">
                <MiniMapWithNoSSR
                  defaultPosition={defaultPosition}
                  selectedPosition={selectedPosition}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Collectible Preview accordion */}
        {/* <Accordion type="single" collapsible>
          <AccordionItem value="preview" className="border rounded-lg bg-slate-800 border-slate-700">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium">
              Collectible Preview
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="mb-4">
                <div className="text-sm text-slate-400 mb-1">by</div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/default-avatar.png" />
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">Coral</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-slate-400 mb-1">Collection</div>
                <div className="font-medium">ผ่าตัด Chinatown เขาวราย</div>
              </div>
              
              <div>
                <div className="text-sm text-slate-400 mb-1">Preview Summary</div>
                <div className="text-sm">
                  {selectedEvent.description || "Collect this unique badge from Chinatown area."}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}
      </div>
    </div>
  );
}
