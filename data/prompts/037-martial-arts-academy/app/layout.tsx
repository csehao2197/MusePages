import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iron Path Academy | A fictional Charlotte academy",
  description: "An illustrative martial arts academy discovery demo. Explore programs and simulate a trial; no real bookings or payments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
