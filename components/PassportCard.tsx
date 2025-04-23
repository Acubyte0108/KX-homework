import { useEffect, useState } from "react";

// Define the passport data types
type PassportPartner = {
  display_name: string;
  profile_image: string;
};

type PassportEvent = {
  id: string;
  image_url: string;
  location: {
    lat: number;
    lng: number;
  };
};

type PassportData = {
  name: string;
  description: string;
  events: PassportEvent[];
  partner: PassportPartner;
};

export default function PassportCard() {
  const [passport, setPassport] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPassport = async () => {
      try {
        const response = await fetch("/passport.json");
        const data = await response.json();
        setPassport(data.passport);
      } catch (error) {
        console.error("Failed to fetch passport data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPassport();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading passport...</div>;
  }

  if (!passport) {
    return <div className="p-4 text-center">No passport data found</div>;
  }

  return (
    <div className="bg-sidebar text-sidebar-foreground h-full flex flex-col overflow-auto">
      {/* Partner Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center gap-2">
        <div className="h-8 w-8 rounded-full overflow-hidden">
          {passport.partner.profile_image && (
            <img
              src={passport.partner.profile_image}
              alt={passport.partner.display_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Replace with a fallback on error
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/200x200?text=Partner";
              }}
            />
          )}
        </div>
        <div className="font-medium">{passport.partner.display_name}</div>
      </div>

      {/* Passport Info */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-bold">{passport.name}</h1>
        <p className="text-sm text-sidebar-foreground/80 mt-1">
          {passport.description}
        </p>
      </div>

      {/* Events Grid */}
      <div className="p-4 flex-1">
        <div className="text-sm font-medium mb-2">{passport.events.length} spots</div>
        <div className="grid grid-cols-3 gap-2">
          {passport.events.map((event) => (
            <div key={event.id} className="relative aspect-square bg-gray-100 rounded-md">
              <img
                src={event.image_url}
                alt={`Event ${event.id}`}
                className="absolute inset-0 w-full h-full object-cover rounded-md"
                onError={(e) => {
                  // Replace with a fallback on error
                  const target = e.target as HTMLImageElement;
                  target.src = `https://placehold.co/200x200?text=Event+${event.id}`;
                }}
              />
              <div className="absolute bottom-1 right-1 bg-sidebar-primary text-sidebar-primary-foreground text-xs px-1.5 py-0.5 rounded-sm">
                {event.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
