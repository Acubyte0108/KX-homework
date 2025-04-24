"use client";

import { useState } from "react";
import { DesktopPassportMap } from "./desktop-passport-map";

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
  const [selectedEvent, setSelectedEvent] = useState<PassportEvent | null>(null);

  return (
    <>
      {/* Desktop version - hidden on mobile, shown on md screens and up */}
      <div className="hidden md:block">
        <DesktopPassportMap
          passport={passport}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      </div>

      {/* Mobile version - shown on mobile, hidden on md screens and up */}
      <div className="block md:hidden">
        <div className="p-4 text-center">Mobile version coming soon</div>
      </div>
    </>
  );
}
