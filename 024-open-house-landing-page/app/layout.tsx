import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Ridgewood Terrace | Pinnacle Realty — fictional open house",
  description: "An illustrated desert modern retreat. Explore a fictional Scottsdale property and try local-only open house reservations.",
  icons: { icon: "/pinnacle-mark.svg" },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
