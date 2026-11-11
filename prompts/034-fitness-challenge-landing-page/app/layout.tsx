import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IGNITE 30 — PulseUp Fitness | Local demo",
  description: "Find your rhythm. A fictional 30-day movement challenge with local-only previews and enrollment.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
