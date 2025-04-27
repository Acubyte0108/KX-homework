import { PassportMap } from "@/components/passport-map";
import { notFound } from "next/navigation";

async function getPassportData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Add a fake delay
    // await new Promise((resolve) => setTimeout(resolve, 2500));

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

export default async function Passport() {
  const passport = await getPassportData();
  return <PassportMap passport={passport} />;
}
