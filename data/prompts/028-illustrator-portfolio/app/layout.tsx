import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Maya Torres — Illustrated worlds", description: "An original fictional illustrator portfolio. Stories rooted in nature, imagined in color." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
