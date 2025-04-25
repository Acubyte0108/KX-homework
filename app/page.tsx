import { PassportMap, PassportData } from "@/components/passport-map";
import { Suspense } from "react";
import { notFound } from "next/navigation";

// Use the URL path approach as preferred by the user
async function getPassportData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/passport.json`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch passport data: ${response.status}`);
    }

    const data = await response.json();
    return data.passport;
  } catch (err) {
    console.error("Failed to fetch passport data:", err);
    notFound(); // This will trigger the not-found page
  }
}

function LoadingPassport() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse">Loading passport data...</div>
    </div>
  );
}

export default async function Passport({ searchParams }: any) {
  const query = await searchParams;

  const passport = await getPassportData();

  return (
    // <Suspense fallback={<LoadingPassport />}>
        <PassportMap passport={passport} tab={query?.tab} />
    // </Suspense>
  );
}
