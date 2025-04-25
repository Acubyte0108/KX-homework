"use client";

import { useState, useEffect } from "react";
import { DesktopPassportMap } from "./desktop-passport-map";
import { MobilePassportMap } from "./mobile-passport-map";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
});

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
  tab?: "" | "map";
};

export function PassportMap({ passport, tab }: PassportMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<PassportEvent | null>(
    null
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  // Default position for Bangkok - will be used initially
  const bangkokPosition: [number, number] = [13.7563, 100.5018];

  const [defaultPosition, setDefaultPosition] =
    useState<[number, number]>(bangkokPosition);

  const [wasDesktop, setWasDesktop] = useState(isDesktop);

  useEffect(() => {
    if (passport && passport.events.length) {
      const firstEvent = passport.events[0];
      if (
        firstEvent.location &&
        !isNaN(firstEvent.location.lat) &&
        !isNaN(firstEvent.location.lng)
      ) {
        setDefaultPosition([firstEvent.location.lat, firstEvent.location.lng]);
      }
    }
  }, [passport]);

  useEffect(() => {
    // Handle screen size transitions
    if (isDesktop !== wasDesktop) {
      if (isDesktop || (!isDesktop && tab !== "map")) {
        router.replace("/", { scroll: false });
      }
      setWasDesktop(isDesktop);
    }
    // Handle invalid state: map tab on desktop - navigate with page reload
    else if (isDesktop && tab === "map") {
      router.push("/");
    }
  }, [isDesktop, wasDesktop, router, tab]);

  return (
    <>
      {/* Conditionally render either desktop or mobile map */}
      {/* {isDesktop ? (
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
      )} */}

      <div className="flex h-screen w-full relative">
        <div
          className={cn(
            "z-0",
            isDesktop && "lg:flex-grow w-3/5",
            !isDesktop && tab === "map" && "h-full w-full"
          )}
        >
          <MapWithNoSSR
            defaultPosition={defaultPosition}
            events={passport?.events || []}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        </div>
      </div>
    </>
  );
}
