"use client";

import { useState, useEffect } from "react";
import { DesktopPassportMap } from "./desktop-passport-map";
import { MobilePassportMap } from "./mobile-passport-map";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import Image from "next/image";
import { ChevronsUpDown, Grid, MapPin } from "lucide-react";
import { ChevronsDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Info } from "@/components/info";
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

  const [isOpen, setIsOpen] = useState(false);

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

        <div
          className={cn(
            "z-0 bg-coral-blue text-white p-4 pt-20",
            isDesktop &&
              "lg:w-[450px] w-2/5 h-full overflow-auto flex flex-col gap-10",
            !isDesktop && tab === "map"
              ? "absolute top-0 left-0 right-0 pb-10 rounded-b-lg z-10 bg-coral-gradient"
              : "w-full h-full flex flex-col gap-10"
          )}
        >
          <Info
            tab={tab || "grid"}
            passport={passport}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        </div>
      </div>
    </>
  );
}
