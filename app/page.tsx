"use client";

import dynamic from "next/dynamic";

export default function Home() {
  const position: [number, number] = [13.7407531, 100.5246708];
  
  const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
    ssr: false,
  });

  return (
    <div className="max-w-7xl">
      <MapWithNoSSR position={position} />
    </div>
  );
}
