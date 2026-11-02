import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terroir & Vine · A little closer to the vineyard",
  description: "An illustrative 21+ wine-bar experience. Explore fictional wines, pairings, and local-only tasting plans.",
  icons: { icon: "/vine-mark.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
