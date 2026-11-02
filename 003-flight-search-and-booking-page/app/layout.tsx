import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlyFair — a little closer to Tokyo",
  description: "An interactive flight comparison demo. All fares, inventory and bookings are simulated locally.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
