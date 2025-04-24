"use client";

import dynamic from "next/dynamic";
import { PassportData, PassportEvent } from "@/components/passport-map";
import { ChevronsUpDown, ChevronsDownUp, Grid, MapPin } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useState } from "react";

const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
});

type MobilePassportMapProps = {
  defaultPosition: L.LatLngExpression;
  passport: PassportData | null;
  selectedEvent: PassportEvent | null;
  setSelectedEvent: (event: PassportEvent | null) => void;
};

export function MobilePassportMap({
  defaultPosition,
  passport,
  selectedEvent,
  setSelectedEvent,
}: MobilePassportMapProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex h-screen w-full relative">
      <MapWithNoSSR
        defaultPosition={defaultPosition}
        events={passport?.events || []}
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        className="w-full h-full absolute top-0 left-0 z-0"
      />

      <div className="absolute top-0 left-0 right-0 rounded-b-lg text-white z-10 p-4 pt-20 pb-10 bg-coral-gradient backdrop-blur-none transition-all duration-300 ease-in-out">
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
          <div className="flex mt-4 border-t border-white/20 w-full">
            <button className="flex-1 py-3 flex items-center justify-center">
              <Grid size={16} className="mr-2" />
              <span>Grid View</span>
            </button>
            <button className="flex-1 py-3 flex items-center justify-center bg-white/10 font-medium">
              <MapPin size={16} className="mr-2" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
