"use client";

import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PassportData, PassportEvent } from "@/components/passport-map";

// Import Map with no SSR once, outside the component
const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
});

type MobilePassportMapProps = {
  defaultPosition: L.LatLngExpression;
  passport: PassportData | null;
  selectedEvent: PassportEvent | null;
  setSelectedEvent: (event: PassportEvent | null) => void;
};

export function MobilePassportMap({
  defaultPosition,
  passport,
  selectedEvent,
  setSelectedEvent,
}: MobilePassportMapProps) {
  return (
    <div className="flex h-screen w-full relative">
      <MapWithNoSSR
        defaultPosition={defaultPosition}
        events={passport?.events || []}
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        className="w-full h-full"
      />
    </div>
  );
}
