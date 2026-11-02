import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Golden Crumb · A little golden, every day",
  description: "An illustrated, fictional artisan bakery. Explore the menu and try local-only pickup and catering demos.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
