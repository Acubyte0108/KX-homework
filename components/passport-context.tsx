"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

export type PassportData = {
  name: string;
  description: string;
  events: PassportEvent[];
  partner: PassportPartner;
};

export type { PassportEvent };

interface PassportContextType {
  passport: PassportData | null;
  loading: boolean;
  error: string | null;
  selectedEvent: PassportEvent | null;
  setSelectedEvent: (event: PassportEvent | null) => void;
}

const PassportContext = createContext<PassportContextType | undefined>(undefined);

export function PassportProvider({ children }: { children: ReactNode }) {
  const [passport, setPassport] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<PassportEvent | null>(null);

  // Load passport data when component mounts
  useEffect(() => {
    const fetchPassport = async () => {
      try {
        const response = await fetch("/passport.json");
        if (!response.ok) {
          throw new Error("Failed to fetch passport data");
        }
        const data = await response.json();
        setPassport(data.passport);
      } catch (error) {
        console.error("Failed to fetch passport data:", error);
        setError("Failed to load passport data");
      } finally {
        setLoading(false);
      }
    };

    fetchPassport();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <PassportContext.Provider
      value={{
        passport,
        loading,
        error,
        selectedEvent,
        setSelectedEvent,
      }}
    >
      {children}
    </PassportContext.Provider>
  );
}

export function usePassport() {
  const context = useContext(PassportContext);
  if (context === undefined) {
    throw new Error("usePassport must be used within a PassportProvider");
  }
  return context;
} 