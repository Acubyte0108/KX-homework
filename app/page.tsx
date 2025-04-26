import { PassportMap } from "@/components/passport-map";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function getPassportData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Add a fake delay of 0.5 seconds
    // await new Promise((resolve) => setTimeout(resolve, 500));

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
    <div className="flex justify-center items-center w-full h-full bg-navy-900 p-4 bg-coral-dark-blue">
      <div className="flex container w-full h-full gap-10 justify-center items-center">
        <Skeleton className="h-2/3 w-2/3 rounded-lg bg-coral-gray max-md:hidden" />

        <div className="md:w-1/3 md:h-2/3 w-full flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32 rounded-md bg-coral-gray" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full bg-coral-gray" />
              <Skeleton className="h-8 w-8 rounded-full bg-coral-gray" />
            </div>
          </div>

          <Skeleton className="h-40 w-full rounded-lg bg-coral-gray" />

          <div className="grid grid-cols-4 gap-4 w-full">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="aspect-square w-full">
                  <Skeleton className="h-full w-full rounded-lg bg-coral-gray" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
