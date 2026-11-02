import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Verdant Journeys | Leave only footprints",
  description: "A fictional sustainable travel studio. Explore thoughtfully curated adventures and try a simulated carbon calculator.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
