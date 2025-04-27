import { PassportData, PassportEvent } from "@/components/passport/passport-content";
import { Drawer, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { DrawerContent } from "@/components/ui/drawer";
import { NextImage } from "@/components/next-image";

type EventSelecterDrawerProps = {
  open: boolean;
  passport: PassportData | null;
  setSelectedEvent: (event: PassportEvent | null) => void;
};

export function EventSelecterDrawer({
  open,
  passport,
  setSelectedEvent,
}: EventSelecterDrawerProps) {
  return (
    <Drawer open={open} shouldScaleBackground={false} modal={false}>
      <DrawerContent
        overlayClassName="bg-transparent"
        showDragIcon={false}
        className="bg-gray-900/20 backdrop-blur-lg flex flex-col"
      >
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-white">
            Tab the slot or location pin to information
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex gap-4 w-full justify-center items-center mb-4">
          {passport?.events.map((event) => (
            <div
              key={event.id}
              className="w-16 h-16 bg-transparent relative"
              onClick={() => setSelectedEvent(event)}
            >
              <NextImage
                src={event.image_url}
                alt={`Event ${event.id}`}
                fill
                sizes="64px"
              />
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
