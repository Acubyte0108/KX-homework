"use client";

import { useState, useEffect } from "react";
import { DesktopPassportMap } from "./desktop-passport-map";
import { MobilePassportMap } from "./mobile-passport-map";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

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
  tab?: "grid" | "map";
};

export function PassportMap({ passport, tab }: PassportMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<PassportEvent | null>(
    null
  );
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Default position for Bangkok - will be used initially
  const bangkokPosition: [number, number] = [13.7563, 100.5018];

  const [defaultPosition, setDefaultPosition] =
    useState<[number, number]>(bangkokPosition);

  // Set map position based on first available event
  useEffect(() => {
    if (passport && passport.events.length) {
      const firstEvent = passport.events[0];
      // Check if the coordinates are valid before setting them
      if (
        firstEvent.location &&
        !isNaN(firstEvent.location.lat) &&
        !isNaN(firstEvent.location.lng)
      ) {
        setDefaultPosition([firstEvent.location.lat, firstEvent.location.lng]);
      }
    }
  }, [passport]);

  return (
    <>
      {/* Conditionally render either desktop or mobile map */}
      {isDesktop ? (
        <DesktopPassportMap
          defaultPosition={defaultPosition}
          passport={passport}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      ) : (
        <MobilePassportMap
          defaultPosition={defaultPosition}
          tab={tab}
          passport={passport}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      )}
    </>
  );
}
