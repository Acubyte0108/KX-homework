"use client";

import { PassportMap } from "@/components/passport-map";

export default function Home() {
  const defaultPosition: [number, number] = [13.7407531, 100.5246708];
  
  return <PassportMap defaultPosition={defaultPosition} />;
}
