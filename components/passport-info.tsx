"use client";

import { PassportData, PassportEvent } from "@/components/passport-map";
import { ChevronsUpDown, ChevronsDownUp, Grid, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NextImage } from "@/components/next-image";

type PassportInfoProps = {
  tab?: string | null;
  passport: PassportData | null;
  selectedEvent: PassportEvent | null;
  setSelectedEvent: (event: PassportEvent | null) => void;
};

export function PassportInfo({
  tab,
  passport,
  selectedEvent,
  setSelectedEvent,
}: PassportInfoProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (isFirstLoad && tab === "map") {
      setIsOpen(false);
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, tab]);

  const activeEventCount = `0/${passport?.events.length}`;

  return (
    <>
      <div className="flex flex-col justify-center items-center bg-white/20 backdrop-blur-none rounded-t-lg text-white w-full md:rounded-lg">
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full overflow-hidden relative">
                  {passport?.partner.profile_image && (
                    <NextImage
                      src={passport?.partner.profile_image}
                      alt={passport?.partner.display_name}
                      fill
                      sizes="32px"
                    />
                  )}
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
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">ฝาท่อ Chinatown เยาวราช</h2>
              {!isOpen && (
                <div className="text-lg text-emerald-400">
                  {activeEventCount}
                </div>
              )}
            </div>
          </div>

          <CollapsibleContent>
            <div className="p-4 pt-0">
              <p className="text-sm mb-4 leading-relaxed">
                มาสำรวจฝาท่อ Chinatown เยาวราช ดูงานศิลปะ
                พร้อมศึกษาประวัติศาสตร์ของย่านนี้กันเถอะ
                เริ่มต้นด้วยการเปิดการเข้าถึงโลเคชั่น
                แล้วกดเก็บของสะสมดิจิทัลตามสายฝาท่อที่ไปถึงได้เลย ทันที
                เก็บให้ครบทั้ง <span>{passport?.events.length}</span> ฝา และแสดงตัวเป็นสุดยอดแฟนเยาวราชกันเลย!
              </p>

              <div className="text-4xl text-emerald-400 my-2">
                {activeEventCount}
              </div>
              <div className="text-sm text-gray-300">
                Collectibles Collected
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <div className="grid grid-cols-2 mt-4 border-t border-white/20 w-full md:hidden">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-white  hover:text-white hover:bg-white/10 py-6 rounded-none flex items-center justify-center",
              !tab && "border-b-2 border-b-white"
            )}
            asChild
            onClick={(e) => {
              if (!tab) {
                e.preventDefault();
                return;
              }
              setSelectedEvent(null);
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
              tab === "map" && "border-b-2 border-b-white"
            )}
            asChild
            onClick={(e) => {
              if (tab === "map") {
                e.preventDefault();
                return;
              }
              setSelectedEvent(null);
            }}
          >
            <Link href={`${pathname}?tab=map`}>
              <MapPin size={16} />
              <span>Map View</span>
            </Link>
          </Button>
        </div>
      </div>

      {!tab && (
        <div className="grid grid-cols-4 gap-2">
          {passport?.events.map((event) => {
            const isSelected = selectedEvent && event.id === selectedEvent.id;
            return (
              <div
                key={event.id}
                className={cn(
                  "aspect-square bg-coral-blue rounded-md cursor-pointer hover:opacity-90",
                  isSelected && "ring-2 ring-white"
                )}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="relative w-full h-full rounded-full">
                  <NextImage
                    src={event.image_url}
                    alt={`Event ${event.id}`}
                    fill
                    sizes="96px"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
