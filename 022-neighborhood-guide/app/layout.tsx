import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "HomeScope Realty | A neighborhood, not just an address", description: "An illustrative, local-only neighborhood exploration demo." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
