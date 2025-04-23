"use client";

import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PassportCard from "@/components/passport-card";
import { PassportData, PassportEvent } from "@/components/passport-map";

// Import Map with no SSR once, outside the component
const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
});

interface DesktopPassportMapProps {
  children?: ReactNode;
  passport: PassportData | null;
  loading: boolean;
  error: string | null;
  selectedEvent: PassportEvent | null;
  setSelectedEvent: (event: PassportEvent | null) => void;
}

export function DesktopPassportMap({ 
  children,
  passport,
  loading,
  error,
  selectedEvent,
  setSelectedEvent
}: DesktopPassportMapProps) {
  // Default position for Bangkok - will be used initially
  const defaultPosition: [number, number] = [13.7563, 100.5018];
  
  const [currentPosition, setCurrentPosition] = useState<[number, number]>(defaultPosition);
  
  // Set map position based on selected event or first available event
  useEffect(() => {
    if (selectedEvent) {
      setCurrentPosition([selectedEvent.location.lat, selectedEvent.location.lng]);
    } else if (passport && passport.events && passport.events.length > 0) {
      const firstEvent = passport.events[0];
      setCurrentPosition([firstEvent.location.lat, firstEvent.location.lng]);
    }
  }, [passport, selectedEvent]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading map...</div>;
  }
  
  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen w-full">
      {/* Left side: Map (4/5 of screen) */}
      <div className="w-4/5 h-screen">
        <MapWithNoSSR 
          defaultPosition={currentPosition} 
          events={passport?.events || []} 
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
      </div>

      {/* Right side: Passport (1/5 of screen) */}
      <div className="w-1/5 h-screen border-l border-sidebar-border bg-sidebar overflow-auto">
        {passport && (
          <PassportCard 
            defaultPosition={currentPosition}
            passportData={passport} 
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        )}
      </div>

      {/* Additional content if needed */}
      {children && <div className="absolute">{children}</div>}
    </div>
  );
}
