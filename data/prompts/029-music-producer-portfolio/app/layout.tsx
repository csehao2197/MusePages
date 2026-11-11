import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KVOLT — Made for the feeling.",
  description: "A fictional Atlanta producer portfolio. Explore original synthetic beat previews and local-only studio inquiries.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
