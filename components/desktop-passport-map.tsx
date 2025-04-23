"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import PassportCard from "./passport-card";
import { PassportData } from "./passport-context";

interface DesktopPassportMapProps {
  position: [number, number];
  passportData: PassportData | null;
  children?: ReactNode;
}

export function DesktopPassportMap({ 
  position,
  passportData,
  children
}: DesktopPassportMapProps) {
  // Import Map with no SSR
  const MapWithNoSSR = dynamic(() => import("./map"), {
    ssr: false,
  });

  return (
    <div className="flex h-screen w-full">
      {/* Left side: Map (4/5 of screen) */}
      <div className="w-4/5 h-screen">
        <MapWithNoSSR position={position} events={passportData?.events || []} />
      </div>

      {/* Right side: Passport (1/5 of screen) */}
      <div className="w-1/5 h-screen border-l border-sidebar-border bg-sidebar overflow-auto">
        {passportData && <PassportCard passportData={passportData} />}
      </div>

      {/* Additional content if needed */}
      {children && <div className="absolute">{children}</div>}
    </div>
  );
}
