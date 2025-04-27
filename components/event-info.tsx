import { PassportEvent, PassportPartner } from "@/components/passport-map";
import L from "leaflet";
import dynamic from "next/dynamic";
import { X, LockKeyhole } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NextImage } from "@/components/next-image";

const MiniMapWithNoSSR = dynamic(() => import("@/components/mini-map"), {
  ssr: false,
});

type EventInfoProps = {
  partner: PassportPartner;
  selectedEvent: PassportEvent;
  defaultPosition: L.LatLngExpression;
  onClose: () => void;
};

export function EventInfo({
  partner,
  selectedEvent,
  defaultPosition,
  onClose,
}: EventInfoProps) {
  const selectedPosition: L.LatLngTuple = [
    selectedEvent.location.lat,
    selectedEvent.location.lng,
  ];

  return (
    <div className="relative w-full flex flex-col p-4 py-16 items-center rounded-2xl h-fit min-h-[25rem] sm:max-h-[calc(100vh-6rem)] bg-coral-blue text-white">
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full bg-white/20 cursor-pointer size-8"
        variant="ghost"
        size="icon"
      >
        <X className="h-10 w-10" />
      </Button>

      <div className="w-full h-full overflow-y-auto custom-scrollbar">
        <div className="flex flex-col px-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-full h-full mt-4">
              {selectedEvent && (
                <NextImage
                  src={selectedEvent.image_url}
                  alt={`Event ${selectedEvent.id}`}
                  width={300}
                  height={300}
                />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-left mb-4">
            {`ทางม้าลายแยกเฉลิมบุรี (${selectedEvent?.id})`}
          </h1>
          <h2 className="text-left mb-6">
            Available to collect from 4 Dec 2024 00:00 to 31 Dec 2025 23:59
          </h2>
          <Button
            className="w-full mb-6 bg-coral-pink hover:bg-coral-pink/80 rounded-full cursor-pointer"
            variant="default"
            size="lg"
          >
            Collect Now
          </Button>
          <Accordion
            type="single"
            collapsible
            defaultValue="mini-map-info"
            className="mb-4 bg-white/20 backdrop-blur-none rounded-lg"
          >
            <AccordionItem value="mini-map-info">
              <AccordionTrigger className="px-4 text-lg font-medium hover:no-underline flex items-center">
                How to collect this collectible
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="flex items-start gap-2 mb-4">
                  <div className="mt-1 bg-white/20 rounded-full p-1">
                    <LockKeyhole size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium">How to collect</h3>
                    <p className="text-sm text-slate-300">
                      Visit this location within 50 meters of the marker to
                      collect this badge.
                    </p>
                  </div>
                </div>

                <div className="h-48 w-full rounded-lg overflow-hidden">
                  <MiniMapWithNoSSR
                    defaultPosition={defaultPosition}
                    selectedPosition={selectedPosition as L.LatLngTuple}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion
            type="single"
            collapsible
            defaultValue="preview"
            className="mb-4 bg-white/20 backdrop-blur-none rounded-lg"
          >
            <AccordionItem value="preview">
              <AccordionTrigger className="px-4 text-lg font-medium hover:no-underline flex items-center">
                Collectible Preview
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 flex flex-col gap-3">
                <div className="mb-2">
                  <div className="text-base mb-2">by</div>
                  <div className="flex items-center gap-3">
                    <div className="relative rounded-full w-8 h-8 p-0.5 overflow-hidden">
                      <NextImage
                        src={partner?.profile_image || "/placeholder.jpg"}
                        alt="Coral"
                        fill
                        sizes="32px"
                      />
                    </div>
                    <span className="font-semibold text-lg">
                      {partner?.display_name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <h3 className="font-bold">Collection</h3>
                  <p className="font-medium text-sm">ฝาท่อ Chinatown เยาวราช</p>
                </div>

                <div className="flex flex-col">
                  <h3 className="font-bold">Preview Summary</h3>
                  <p className="font-medium text-sm">
                    มาอุ่นเครื่องทดลองกดเก็บของสะสมกันหน่อย
                    แค่คลิกเดียวก็เก็บของสะสมดิจิทัลได้เลย!
                    ฝาท่อนี้อยู่ก่อนถึงโรงพยาบาลเทียนฟ้ามูลนิธินิดเดียว
                    มาเริ่มเก็บกันเลย แต่ละลายนั้นมีความ
                  </p>
                  <div className="text-coral-pink text-sm font-bold mt-2 text-right cursor-pointer">
                    See more
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
