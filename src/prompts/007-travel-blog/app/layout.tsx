import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Wanderlust Chronicles — Take the scenic route",
  description: "An illustrated travel journal. Discover thoughtful destination stories, food, culture and practical travel ideas in this fictional editorial demo."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
