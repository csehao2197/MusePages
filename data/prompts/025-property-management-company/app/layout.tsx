import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Keystone Property Group | A better way to own. A better place to live.",
  description: "An illustrative Austin property management experience. Explore fictional rentals, transparent management plans, and local-only owner and resident previews.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
