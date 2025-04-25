"use client";

import dynamic from "next/dynamic";
import { PassportData, PassportEvent } from "@/components/passport-map";
import { ChevronsUpDown, ChevronsDownUp, Grid, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
});

type MobilePassportMapProps = {
  defaultPosition: L.LatLngExpression;
  tab?: "grid" | "map";
  passport: PassportData | null;
  selectedEvent: PassportEvent | null;
  setSelectedEvent: (event: PassportEvent | null) => void;
};

export function MobilePassportMap({
  defaultPosition,
  tab = "grid",
  passport,
  selectedEvent,
  setSelectedEvent,
}: MobilePassportMapProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tabMode, setTabMode] = useState<"grid" | "map">(tab);
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full relative">
      {tabMode === "map" && (
        <MapWithNoSSR
          defaultPosition={defaultPosition}
          events={passport?.events || []}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
          className="w-full h-full absolute top-0 left-0 z-0"
        />
      )}

      <div
        className={cn(
          "text-white p-4 pt-20",
          tabMode === "map" &&
            "absolute top-0 left-0 right-0 pb-10 rounded-b-lg z-10 bg-coral-gradient backdrop-blur-none transition-all duration-300 ease-in-out",
          tabMode === "grid" && "bg-coral-blue flex flex-col w-full h-full gap-10"
        )}
      >
        <div className="flex flex-col justify-center items-center bg-white/20 backdrop-blur-none rounded-t-lg text-white w-full">
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 100 100">
                    <rect x="10" y="10" width="20" height="20" fill="#FF3D71" />
                    <rect x="35" y="10" width="20" height="20" fill="#4ecca3" />
                    <rect x="10" y="35" width="20" height="20" fill="#FFAA00" />
                    <rect x="35" y="35" width="20" height="20" fill="#3366FF" />
                  </svg>
                </div>
                <span className="text-lg font-bold">Coral</span>
              </div>
              <CollapsibleTrigger asChild>
                <button className="w-8 h-8 flex items-center justify-center">
                  {isOpen ? (
                    <ChevronsDownUp size={20} color="white" />
                  ) : (
                    <ChevronsUpDown size={20} color="white" />
                  )}
                </button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="p-4 pt-0">
                <h2 className="text-lg font-bold mb-2">
                  ฝาท่อ Chinatown เยาวราช
                </h2>

                <p className="text-sm mb-4 leading-relaxed">
                  มาสำรวจฝาท่อ Chinatown เยาวราช ดูงานศิลปะ
                  พร้อมศึกษาประวัติศาสตร์ของย่านนี้กันเถอะ
                  เริ่มต้นด้วยการเปิดการเข้าถึงโลเคชั่น
                  แล้วกดเก็บของสะสมดิจิทัลตามสายฝาท่อที่ไปถึงได้เลย ทันที
                  เก็บให้ครบทั้ง 18 ฝา และแสดงตัวเป็นสุดยอดแฟนเยาวราชกันเลย!
                </p>

                <div className="text-4xl text-emerald-400 my-2">0/18</div>
                <div className="text-sm text-gray-300">
                  Collectibles Collected
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <div className="grid grid-cols-2 mt-4 border-t border-white/20 w-full">
            <Button
              variant="ghost"
              className={cn(
                "w-full text-white  hover:text-white hover:bg-white/10 py-6 rounded-none flex items-center justify-center",
                tabMode === "grid" && "border-b-2 border-b-white"
              )}
              asChild
              onClick={(e) => {
                if (tabMode === "grid") {
                  e.preventDefault();
                  return;
                }
                setSelectedEvent(null);
                setTabMode("grid");
              }}
            >
              <Link href={pathname}>
                <Grid size={16} />
                <span>Grid View</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full text-white hover:text-white hover:bg-white/20 py-6 rounded-none flex items-center justify-center",
                tabMode === "map" && "border-b-2 border-b-white"
              )}
              asChild
              onClick={(e) => {
                if (tabMode === "map") {
                  e.preventDefault();
                  return;
                }
                setSelectedEvent(null);
                setTabMode("map");
              }}
            >
              <Link href={`${pathname}?tab=map`}>
                <MapPin size={16} />
                <span>Map View</span>
              </Link>
            </Button>
          </div>
        </div>

        {tabMode === "grid" && (
          <div className="grid grid-cols-4 gap-2">
            {passport?.events.map((event) => {
              const isSelected = selectedEvent && event.id === selectedEvent.id;
              return (
                <div
                  key={event.id}
                  className={`relative aspect-square bg-coral-blue rounded-md cursor-pointer hover:opacity-90 ${
                    isSelected ? "ring-2 ring-white" : ""
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={event.image_url}
                      alt={`Event ${event.id}`}
                      fill
                      sizes="96px"
                      className="object-cover rounded-full w-full h-full"
                      onError={(e) => {
                        // Replace with a fallback on error
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/200x200?text=Event+${event.id}`;
                      }}
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-sidebar-primary text-sidebar-primary-foreground text-xs px-1.5 py-0.5 rounded-sm z-10">
                    {event.id}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
