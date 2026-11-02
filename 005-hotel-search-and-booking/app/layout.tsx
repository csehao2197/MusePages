import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StayFinder • Find your Tokyo",
  description: "An illustrated, fictional Tokyo hotel search and local booking demo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
