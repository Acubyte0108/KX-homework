"use client";

import dynamic from "next/dynamic";
import { DesktopPassportInfo } from "@/components/desktop-passport-info";
import { PassportData, PassportEvent } from "@/components/passport-map";
import { DesktopEventInfo } from "@/components/desktop-event-info";

const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
});

type DesktopPassportMapProps = {
  defaultPosition: L.LatLngExpression;
  passport: PassportData | null;
  selectedEvent: PassportEvent | null;
  setSelectedEvent: (event: PassportEvent | null) => void;
};

export function DesktopPassportMap({
  defaultPosition,
  passport,
  selectedEvent,
  setSelectedEvent,
}: DesktopPassportMapProps) {
  return (
    <div className="flex h-screen w-full relative">
      <div className="lg:flex-grow w-3/5 z-0">
        <MapWithNoSSR
          defaultPosition={defaultPosition}
          events={passport?.events || []}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
      </div>
      <div className="lg:w-[450px] w-2/5 h-full overflow-auto z-0">
        {passport && (
          <DesktopPassportInfo
            passportData={passport}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        )}
      </div>
      {selectedEvent && (
        <DesktopEventInfo
          selectedEvent={selectedEvent}
          defaultPosition={defaultPosition}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
