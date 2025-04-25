"use client";

import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DesktopPassportInfo } from "@/components/desktop-passport-info";
import { PassportData, PassportEvent } from "@/components/passport-map";
import { DesktopEventInfo } from "@/components/desktop-event-info";

// Import Map with no SSR once, outside the component
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
      {/* Left side: Map (4/5 of screen) */}
        <MapWithNoSSR
          defaultPosition={defaultPosition}
          events={passport?.events || []}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
          className="z-0 lg:w-[calc(100%-450px)] w-full h-full"
        />

      <div className="lg:w-[450px] w-full h-full overflow-auto z-0">
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
