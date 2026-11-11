import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Rhythm & Flow — Find your own rhythm", description: "Fictional Austin dance studio. Five styles, every level. Local interactive demo; no real reservations." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
