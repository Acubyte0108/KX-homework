import { PassportData, PassportEvent } from "./passport-map";
import { Drawer, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { DrawerContent } from "./ui/drawer";
import { NextImage } from "./next-image";

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
              className="w-16 h-16 bg-transparent rounded-full relative"
              onClick={() => setSelectedEvent(event)}
            >
              <NextImage
                src={event.image_url}
                alt={`Event ${event.id}`}
                fill
                sizes="64px"
                className="object-cover w-full h-full rounded-full"
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' xmlns:v='https://vecta.io/nano'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23FF6B6B'/%3E%3C/svg%3E"
              />
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
