import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sora = localFont({ src: "../public/fonts/Sora.ttf", variable: "--font-heading", display: "swap" });
const inter = localFont({ src: "../public/fonts/Inter.ttf", variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "TrekTribe • Adventure is better together",
  description: "A fictional group travel demo. Explore trips, plan together, and simulate split payments. No real bookings.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sora.variable} ${inter.variable}`}>{children}</body></html>;
}
