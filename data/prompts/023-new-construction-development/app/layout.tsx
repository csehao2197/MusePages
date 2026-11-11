import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ridgeline at Cedar Creek | Crestwood Homes · Concept demo",
  description: "An illustrative new-home community. Explore schematic plans, fictional homesites and local-only tour previews.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
