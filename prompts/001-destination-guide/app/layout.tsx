import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tokyo, Japan — A city of beautiful contrasts | Wanderly",
  description: "An illustrated Tokyo destination guide with local tips, seasonal planning and customizable itineraries. A fictional Wanderly travel demo.",
  icons: { icon: "/compass.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
