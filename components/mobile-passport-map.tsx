"use client";

import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PassportCard from "@/components/desktop-passport-info";
import { PassportData, PassportEvent } from "@/components/passport-map";
import PassportEventInfo from "@/components/desktop-event-info";

// Import Map with no SSR once, outside the component
const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
});

type MobilePassportMapProps = PropsWithChildren<{
  passport: PassportData | null;
  selectedEvent: PassportEvent | null;
  setSelectedEvent: (event: PassportEvent | null) => void;
}>

export function MobilePassportMap({
  children,
  passport,
  selectedEvent,
  setSelectedEvent,
}: MobilePassportMapProps) {
  // Default position for Bangkok - will be used initially
  const bangkokPosition: [number, number] = [13.7563, 100.5018];

  const [defaultPosition, setDefaultPosition] =
    useState<[number, number]>(bangkokPosition);

  // Set map position based on first available event
  useEffect(() => {
    if (passport && passport.events.length) {
      const firstEvent = passport.events[0];
      setDefaultPosition([firstEvent.location.lat, firstEvent.location.lng]);
    }
  }, [passport]);

  return (
    <div className="flex h-screen w-full relative">
      {/* Left side: Map (4/5 of screen) */}
      <div className="w-4/5 h-full">
        <MapWithNoSSR
          defaultPosition={defaultPosition}
          events={passport?.events || []}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
      </div>

      {/* Right side: Passport (1/5 of screen) */}
      <div className="md:w-[500px] w-1/5 h-screen border-l border-sidebar-border bg-sidebar overflow-auto">
        {passport && (
          <PassportCard
            passportData={passport}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        )}
      </div>

      {/* Floating event info that appears when an event is selected */}
      {selectedEvent && (
        <PassportEventInfo
          selectedEvent={selectedEvent}
          defaultPosition={defaultPosition}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Additional content if needed */}
      {children && <div className="absolute">{children}</div>}
    </div>
  );
}
