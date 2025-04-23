"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import PassportCard from "@/components/PassportCard";

interface DesktopPassportLayoutProps {
  position: [number, number];
  children?: ReactNode;
}

export default function DesktopPassportLayout({ 
  position,
  children
}: DesktopPassportLayoutProps) {
  // Import Map with no SSR
  const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
    ssr: false,
  });

  return (
    <div className="flex h-screen w-full">
      {/* Left side: Map (4/5 of screen) */}
      <div className="w-4/5 h-screen">
        <MapWithNoSSR position={position} />
      </div>

      {/* Right side: Passport (1/5 of screen) */}
      <div className="w-1/5 h-screen border-l border-sidebar-border bg-sidebar overflow-auto">
        <PassportCard />
      </div>

      {/* Additional content if needed */}
      {children && <div className="absolute">{children}</div>}
    </div>
  );
}
