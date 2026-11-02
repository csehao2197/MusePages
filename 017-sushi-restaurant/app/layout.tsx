import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Hikari · 光 — The art of sushi",
  description: "An illustrated, fictional Japanese dining experience. Local demonstration only.",
  icons: { icon: "/hikari-mark.svg" }
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
