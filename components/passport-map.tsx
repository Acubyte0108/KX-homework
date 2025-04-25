"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { PassportInfo } from "@/components/passport-info";
import { EventInfo } from "@/components/event-info";
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
};

export function PassportMap({ passport }: PassportMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<PassportEvent | null>(
    null
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

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
      router.replace("/", { scroll: false });
    }
  }, [isDesktop, wasDesktop, router, tab]);

  return (
    <>
      <div className="flex flex-col h-full relative">
        <div className="absolute w-full h-full">
          {(isDesktop || (!isDesktop && tab === "map")) && (
            <MapWithNoSSR
              defaultPosition={defaultPosition}
              events={passport?.events || []}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
            />
          )}
        </div>

        <div className="z-2 flex flex-grow pointer-events-none">
          <div className="flex w-full justify-end">
            {isDesktop && selectedEvent && (
              <div className="fixed left-4 top-8 bg-coral-blue shadow-lg rounded-lg p-4 max-w-[420px] z-10 h-[calc(100vh-4rem)] overflow-auto text-white pointer-events-auto">
                <EventInfo
                  selectedEvent={selectedEvent}
                  defaultPosition={defaultPosition}
                  onClose={() => setSelectedEvent(null)}
                />
              </div>
            )}
            <div
              className={cn(
                "bg-coral-blue text-white p-4 pt-20 pointer-events-auto",
                isDesktop && "lg:w-[450px] overflow-auto flex flex-col gap-10",
                !isDesktop && tab === "map"
                  ? "absolute top-0 left-0 right-0 pb-10 rounded-b-lg z-10 bg-coral-gradient"
                  : "w-full h-full flex flex-col gap-10"
              )}
            >
              <PassportInfo
                tab={tab}
                passport={passport}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
