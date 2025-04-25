import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { PassportData, PassportEvent } from "./passport-map";
import Image from "next/image";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type DesktopPassportInfoProps = {
  passport: PassportData;
  selectedEvent: PassportEvent | null;
  onSelectEvent: (event: PassportEvent) => void;
};

export function DesktopPassportInfo({
  passport,
  selectedEvent,
  onSelectEvent,
}: DesktopPassportInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col bg-coral-blue h-full overflow-auto w-full text-white p-4 gap-8">
      <div className="flex flex-col justify-center items-center bg-white/20 backdrop-blur-none rounded-lg text-white w-full mt-20">
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full overflow-hidden relative">
                  {passport?.partner.profile_image && (
                    <Image
                      src={passport?.partner.profile_image}
                      alt={passport?.partner.display_name}
                      fill
                      sizes="32px"
                      className="object-cover"
                      onError={(e) => {
                        // Replace with a fallback on error
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://placehold.co/200x200?text=Partner";
                      }}
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
              {!isOpen && <div className="text-lg text-emerald-400">0/18</div>}
            </div>
          </div>

          <CollapsibleContent>
            <div className="p-4 pt-0">
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
      </div>

      <div className="grid grid-cols-4 gap-2">
        {passport?.events.map((event) => {
          const isSelected = selectedEvent && event.id === selectedEvent.id;
          return (
            <div
              key={event.id}
              className={`relative aspect-square bg-coral-blue rounded-md cursor-pointer hover:opacity-90 ${
                isSelected ? "ring-2 ring-white" : ""
              }`}
              onClick={() => onSelectEvent(event)}
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
    </div>
  );
}
