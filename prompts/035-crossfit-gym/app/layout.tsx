import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iron Tide | Stronger Starts Here",
  description: "A fictional Pacific Beach gym concept. Explore classes, coaches and local-only intro previews. No affiliation or real enrollment.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
