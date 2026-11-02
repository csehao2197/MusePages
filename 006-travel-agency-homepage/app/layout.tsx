import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: "../public/fonts/DMSerifDisplay-Regular.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "400",
});
const body = localFont({
  src: "../public/fonts/Inter-Variable.ttf",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wanderly — A little further. A little more you.",
  description: "An illustrated local travel demo: discover curated journeys, save favorites, and sketch your dream itinerary. No real bookings.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>;
}
