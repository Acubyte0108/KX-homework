import { PassportMap, PassportData } from "@/components/passport-map";

// Use the URL path approach as preferred by the user
async function getPassportData() {
  try {
    // When running server-side in Next.js, to fetch local API routes or static files,
    // we need to construct an absolute URL based on the request headers or environment
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Fetch passport data from the public directory
    const response = await fetch(`${baseUrl}/passport.json`, {
      cache: 'no-store' // Or use ISR with next.revalidate: 3600
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch passport data: ${response.status}`);
    }
    
    const data = await response.json();
    return { 
      passport: data.passport,
      error: null 
    };
  } catch (err) {
    console.error("Failed to fetch passport data:", err);
    return { 
      passport: null,
      error: "Failed to load passport data" 
    };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  // Get the tab from search params
  const tab = searchParams.tab;
  
  // Fetch passport data
  const { passport, error } = await getPassportData();
  
  // In server components, loading is always false since we await the data
  const loading = false;

  return <PassportMap passport={passport} loading={loading} error={error} tab={tab} />;
}
