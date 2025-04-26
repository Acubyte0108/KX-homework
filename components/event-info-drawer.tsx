import { PassportEvent } from "./passport-map";
import { Drawer, DrawerTitle } from "./ui/drawer";
import { DrawerContent } from "./ui/drawer";
import { Button } from "./ui/button";
import Image from "next/image";
import { X } from "lucide-react";

type EventInfoDrawerProps = {
  open: boolean;
  selectedEvent: PassportEvent | null;
  onClose: () => void;
};

export function EventInfoDrawer({
  open,
  selectedEvent,
  onClose,
}: EventInfoDrawerProps) {
  return (
    <Drawer open={open} shouldScaleBackground={false} modal={false}>
      <DrawerContent
        overlayClassName="bg-transparent"
        showDragIcon={false}
        className="bg-gray-900/20 backdrop-blur-lg flex flex-col"
      >
        <DrawerTitle className="hidden"></DrawerTitle>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-center items-center gap-6">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-slate-800 p-2 mt-4">
                {selectedEvent && (
                  <Image
                    src={selectedEvent.image_url}
                    alt={`Event ${selectedEvent.id}`}
                    width={128}
                    height={128}
                    className="rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.jpg";
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-white">
              <h1 className="text-lg text-left font-semibold">
                {`ทางม้าลายแยกเฉลิมบุรี (${selectedEvent?.id})`}
              </h1>
              <div className="text-left text-sm">
                Available to collect from 4 Dec 2024 00:00 to 31 Dec 2025 23:59
              </div>
            </div>
            <Button
              onClick={onClose}
              className="rounded-full bg-white/20 cursor-pointer text-white size-6 self-start"
              variant="ghost"
              size="icon"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <Button
            className="w-full mb-2 bg-coral-pink hover:bg-coral-pink/80 rounded-full cursor-pointer"
            variant="default"
            size="lg"
          >
            Collect Now
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
