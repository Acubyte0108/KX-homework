"use client";

import { useState, useEffect } from "react";
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
interface PassportMapProps {}

export function PassportMap() {
  const [passport, setPassport] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<PassportEvent | null>(
    null
  );
  // Load passport data when component mounts
  useEffect(() => {
    const fetchPassport = async () => {
      try {
        const response = await fetch("/passport.json");
        if (!response.ok) {
          throw new Error("Failed to fetch passport data");
        }
        const data = await response.json();
        setPassport(data.passport);
      } catch (error) {
        console.error("Failed to fetch passport data:", error);
        setError("Failed to load passport data");
      } finally {
        setLoading(false);
      }
    };

    fetchPassport();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
      {/* Desktop version - hidden on mobile, shown on md screens and up */}
      <div className="hidden md:block">
        <DesktopPassportMap
          passport={passport}
          loading={loading}
          error={error}
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
