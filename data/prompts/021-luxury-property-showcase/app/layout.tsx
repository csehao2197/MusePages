import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "The Meridian Penthouse | Sterling — Fictional Showcase",
  description: "An illustrated, fictional luxury residence. Explore spaces and preview a private viewing locally."
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
