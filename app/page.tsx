import { PassportMap } from "@/components/passport-map";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function getPassportData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    // Add a fake delay of 0.5 seconds
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await fetch(`${baseUrl}/passport.json`, {
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch passport data: ${response.status}`);
    }

    const data = await response.json();
    return data.passport;
  } catch (err) {
    console.error("Failed to fetch passport data:", err);
    notFound();
  }
}

function PassportMapLoading() {
  return (
    <div className="flex flex-col h-full bg-coral-blue text-white p-4 pt-20">
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-300/20" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-300/20" />
            <Skeleton className="h-4 w-[200px] bg-gray-300/20" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-lg bg-gray-300/20" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full bg-gray-300/20" />
          <Skeleton className="h-4 w-full bg-gray-300/20" />
          <Skeleton className="h-4 w-3/4 bg-gray-300/20" />
        </div>
        <div className="flex gap-4 mt-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-16 rounded-full bg-gray-300/20" />
          ))}
        </div>
      </div>
    </div>
  );
}

// This component fetches the data and will trigger the suspense boundary
async function PassportContent() {
  const passport = await getPassportData();
  return <PassportMap passport={passport} />;
}

export default function Passport() {
  return (
    <div className="flex flex-col overflow-hidden h-screen">
      <Suspense fallback={<PassportMapLoading />}>
        <PassportContent />
      </Suspense>
    </div>
  );
}
