import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casa Azul · StayDirect",
  description: "An illustrated, fictional beachfront escape in Tulum. A local-only StayDirect demonstration.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
