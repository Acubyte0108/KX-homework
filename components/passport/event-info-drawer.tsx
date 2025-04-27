import { PassportEvent } from "@/components/passport/passport-content";
import { Drawer, DrawerTitle } from "@/components/ui/drawer";
import { DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { NextImage } from "@/components/next-image";
import { getThemeGradient } from "@/lib/utils";

type EventInfoDrawerProps = {
  open: boolean;
  selectedEvent: PassportEvent | null;
  onClose: () => void;
  gridItemDimensions?: { width: number; height: number } | null;
};

export function EventInfoDrawer({
  open,
  selectedEvent,
  onClose,
  gridItemDimensions,
}: EventInfoDrawerProps) {
  const imageStyle = gridItemDimensions 
    ? { 
        width: gridItemDimensions.width, 
        height: gridItemDimensions.height 
      } 
    : undefined;

  return (
    <Drawer open={open} shouldScaleBackground={false} modal={false}>
      <DrawerContent
        overlayClassName="bg-transparent"
        showDragIcon={false}
        className="bg-transparent backdrop-blur-[30px] flex flex-col"
        style={{ backgroundImage: getThemeGradient("#00294D", "top") }}
      >
        <DrawerTitle className="hidden"></DrawerTitle>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-center items-center gap-6">
            <div className="flex items-center justify-center">
              <div 
                className="relative"
                style={imageStyle ? { width: imageStyle.width, height: imageStyle.height } : { width: '5rem', height: '5rem' }}
              >
                {selectedEvent && (
                  <NextImage
                    src={selectedEvent.image_url}
                    alt={`Event ${selectedEvent.id}`}
                    fill
                    sizes={gridItemDimensions ? `${gridItemDimensions.width}px` : "96px"}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-white">
              <h2 className="text-left font-bold">
                {`ทางม้าลายแยกเฉลิมบุรี (${selectedEvent?.id})`}
              </h2>
              <p className="text-left text-xs">
                Available to collect from 4 Dec 2024 00:00 to 31 Dec 2025 23:59
              </p>
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
