import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-navy-900 p-4 bg-coral-dark-blue">
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
