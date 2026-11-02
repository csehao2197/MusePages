import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ava Chen — Thoughtful digital experiences",
  description: "A fictional product designer portfolio. Original SaaS and mobile design concepts, process stories, and local interactive prototypes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
