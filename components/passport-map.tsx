"use client";

import { useState, useEffect } from "react";
import { DesktopPassportMap } from "./desktop-passport-map";
import { MobilePassportMap } from "./mobile-passport-map";

// Define the passport data types
type PassportPartner = {
  display_name: string;
  profile_image: string;
};

export type PassportEvent = {
  id: string;
  image_url: string;
  location: {
    lat: number;
    lng: number;
  };
};

export type PassportData = {
  name: string;
  description: string;
  events: PassportEvent[];
  partner: PassportPartner;
};

// Define main props for the wrapper
type PassportMapProps = {
  passport: PassportData | null;
  tab?: string;
};

export function PassportMap({ passport, tab }: PassportMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<PassportEvent | null>(
    null
  );

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
    <>
      {/* Desktop version - hidden on mobile, shown on md screens and up */}
      <div className="hidden md:block">
        <DesktopPassportMap
          defaultPosition={defaultPosition}
          passport={passport}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      </div>

      {/* Mobile version - shown on mobile, hidden on md screens and up */}
      {/* <div className="block md:hidden">
        <MobilePassportMap
          defaultPosition={defaultPosition}
          passport={passport}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      </div> */}
    </>
  );
}
