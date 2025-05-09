import { PassportContent } from "@/components/passport/passport-content";
import { notFound } from "next/navigation";

async function getPassportData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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
  return <PassportContent passport={passport} />;
}
