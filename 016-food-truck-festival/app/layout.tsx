import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreetBite Fest • A little messy. A lot delicious.",
  description: "An illustrative Portland waterfront food, music and community festival. Explore fictional trucks and build a local demo plan.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
