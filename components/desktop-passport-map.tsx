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
      {/* <div className="w-4/5 h-full"> */}
        <MapWithNoSSR
          defaultPosition={defaultPosition}
          events={passport?.events || []}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
          className="z-0 w-4/5 h-full"
        />
      {/* </div> */}

      {/* Right side: Passport (1/5 of screen) */}
      <div className="md:w-[500px] w-1/5 h-screen border-l border-sidebar-border bg-sidebar overflow-auto z-0">
        {passport && (
          <DesktopPassportInfo
            passportData={passport}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        )}
      </div>

      {/* Floating event info that appears when an event is selected */}
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
