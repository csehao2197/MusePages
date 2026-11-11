import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Our Process — Frameshift", description: "An illustrative, collaborative path from SaaS idea to launch. Explore the four-phase Frameshift process." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
