import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Savory Affairs | A gathering worth savoring", description: "A fictional catering portfolio and local event-planning demo.", icons: { icon: "/brand-mark.svg" } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
