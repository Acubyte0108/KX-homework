"use client";

import dynamic from "next/dynamic";

export default function Home() {
  const position: [number, number] = [13.7407531, 100.5246708];
  
  const DesktopPassportLayoutWithNoSSR = dynamic(
    () => import("@/components/DesktopPassportLayout"),
    { ssr: false }
  );

  return <DesktopPassportLayoutWithNoSSR position={position} />;
}
