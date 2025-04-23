import { PassportData, PassportEvent } from "./passport-map";
import Image from "next/image";

type PassportCardProps = {
  passportData: PassportData;
  selectedEvent: PassportEvent | null;
  onSelectEvent: (event: PassportEvent) => void;
};

export default function PassportCard({ 
  passportData, 
  selectedEvent,
  onSelectEvent 
}: PassportCardProps) {

  return (
    <div className="bg-sidebar text-sidebar-foreground h-full flex flex-col overflow-auto">
      {/* Partner Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center gap-2">
        <div className="h-8 w-8 rounded-full overflow-hidden relative">
          {passportData.partner.profile_image && (
            <Image
              src={passportData.partner.profile_image}
              alt={passportData.partner.display_name}
              fill
              sizes="32px"
              className="object-cover"
              onError={(e) => {
                // Replace with a fallback on error
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/200x200?text=Partner";
              }}
            />
          )}
        </div>
        <div className="font-medium">{passportData.partner.display_name}</div>
      </div>

      {/* Passport Info */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-bold">{passportData.name}</h1>
        <p className="text-sm text-sidebar-foreground/80 mt-1">
          {passportData.description}
        </p>
      </div>

      {/* Events Grid */}
      <div className="p-4 flex-1">
        <div className="text-sm font-medium mb-2">{passportData.events.length} spots</div>
        <div className="grid grid-cols-3 gap-2">
          {passportData.events.map((event) => {
            const isSelected = selectedEvent && event.id === selectedEvent.id;
            return (
              <div 
                key={event.id} 
                className={`relative aspect-square bg-gray-100 rounded-md cursor-pointer hover:opacity-90 ${
                  isSelected ? 'ring-2 ring-pink-500' : ''
                }`}
                onClick={() => onSelectEvent(event)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={event.image_url}
                    alt={`Event ${event.id}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 100px"
                    className="object-cover rounded-md"
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
    </div>
  );
}
