"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import dynamic from "next/dynamic";
import { cn, getThemeGradient } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { PassportInfo } from "@/components/passport/passport-info";
import { EventInfo } from "@/components/passport/event-info";
import { EventInfoDrawer } from "@/components/passport/event-info-drawer";
import { EventSelecterDrawer } from "@/components/passport/event-selecter-drawer";

const MapWithNoSSR = dynamic(() => import("@/components/passport/map"), {
  ssr: false,
});

export type PassportPartner = {
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

type PassportMapProps = {
  passport: PassportData | null;
};

export function PassportContent({ passport }: PassportMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<PassportEvent | null>(
    null
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [defaultPosition, setDefaultPosition] = useState<
    [number, number] | null
  >(null);

  const [wasDesktop, setWasDesktop] = useState(isDesktop);
  const [gridItemDimensions, setGridItemDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

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
    if (isDesktop !== wasDesktop) {
      if (isDesktop || (!isDesktop && tab !== "map")) {
        router.replace("/", { scroll: false });
      }
      setWasDesktop(isDesktop);
    } else if (isDesktop && tab === "map") {
      router.replace("/");
    }
  }, [isDesktop, wasDesktop, router, tab]);

  if (passport === null) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col h-full relative">
        <div className="absolute w-full h-full">
          {(isDesktop || (!isDesktop && tab === "map")) && defaultPosition && (
            <MapWithNoSSR
              defaultPosition={defaultPosition}
              events={passport?.events || []}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
            />
          )}
        </div>

        <div className="z-2 flex flex-grow pointer-events-none">
          <div className="flex w-full justify-between">
            <div className="relative ml-0 hidden w-full h-fit pointer-events-auto self-start sm:sticky sm:block sm:ml-4 sm:max-w-[420px] sm:w-3/10 sm:pb-4 sm:pt-20">
              {isDesktop && selectedEvent && defaultPosition && (
                <EventInfo
                  partner={passport?.partner}
                  selectedEvent={selectedEvent}
                  defaultPosition={defaultPosition}
                  onClose={() => setSelectedEvent(null)}
                />
              )}
            </div>
            <div
              className={cn(
                "bg-coral-blue text-white p-4 pt-20 pointer-events-auto",
                isDesktop && "md:max-w-[450px] sm:w-3/10 overflow-auto flex flex-col gap-10",
                !isDesktop && tab === "map"
                  ? "absolute top-0 left-0 right-0 pb-10 rounded-b-lg z-10 bg-transparent"
                  : "w-full h-full flex flex-col gap-10"
              )}
              style={{ 
                backgroundImage: !isDesktop && tab === "map" 
                  ? getThemeGradient("#00294D", "bottom") 
                  : "none" 
              }}
            >
              <PassportInfo
                tab={tab}
                passport={passport}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                onGridItemResize={setGridItemDimensions}
              />
            </div>
          </div>
        </div>

        <EventInfoDrawer
          open={!isDesktop && !!selectedEvent}
          selectedEvent={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          gridItemDimensions={gridItemDimensions}
        />

        <EventSelecterDrawer
          open={!isDesktop && !selectedEvent && tab === "map"}
          passport={passport}
          setSelectedEvent={setSelectedEvent}
        />
      </div>
    </>
  );
}
