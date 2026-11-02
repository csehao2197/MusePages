import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Keystone • Home value, made clear",
  description: "An explicitly fictional, local-only home valuation experience. No real property data or appraisal.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
