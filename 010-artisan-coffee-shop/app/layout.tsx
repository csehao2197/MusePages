import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Ember & Bloom — Roasted with intention",
  description: "An illustrative Portland small-batch coffee shop. Explore coffee, origins, and local demo ordering."
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
