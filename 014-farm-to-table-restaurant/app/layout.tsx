import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harvest & Hearth | From Our Farms to Your Fork",
  description: "An illustrative farm-to-table restaurant experience. Seasonal plates, a farm family, and local-only reservation demos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
