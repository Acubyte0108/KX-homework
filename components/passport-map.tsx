"use client";

import { useEffect, useState } from "react";
import { PassportProvider, usePassport } from "./passport-context";
import { DesktopPassportMap } from "./desktop-passport-map";

// Define main props for the wrapper
interface PassportMapProps {
  defaultPosition: [number, number];
}

// Inner component that consumes context and renders the appropriate map
function PassportMapInner({ defaultPosition }: PassportMapProps) {
  const { passport, loading, error, selectedEvent } = usePassport();
  // Current position - either from selected event or default
  const [currentPosition, setCurrentPosition] = useState<[number, number]>(defaultPosition);
  
  // Update position when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      setCurrentPosition([selectedEvent.location.lat, selectedEvent.location.lng]);
    }
  }, [selectedEvent]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading map...</div>;
  }
  
  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }
  
  return (
    <>
      {/* Desktop version - hidden on mobile, shown on md screens and up */}
      <div className="hidden md:block">
        <DesktopPassportMap 
          position={currentPosition} 
          passportData={passport}
        />
      </div>
      
      {/* Mobile version - shown on mobile, hidden on md screens and up */}
      <div className="block md:hidden">
        <div className="p-4 text-center">Mobile version coming soon</div>
      </div>
    </>
  );
}

// Main wrapper component that provides context
export function PassportMap(props: PassportMapProps) {
  return (
    <PassportProvider>
      <PassportMapInner {...props} />
    </PassportProvider>
  );
} 