import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { siteUrl } from "@/lib/data";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mara Vale — Independent graphic designer / Concept portfolio",
  description: "An original fictional portfolio of thoughtful identities, campaigns, packaging, and editorial design. Explore six concept case studies and a local-only inquiry demo.",
  alternates: { canonical: "/" },
  openGraph: { title: "Mara Vale — Thoughtful by design", description: "Independent graphic design. Original concept work, clearly labeled.", images: [{ url: "/share.svg", width: 1200, height: 630, alt: "Mara Vale — Thoughtful by design, a fictional graphic design portfolio" }] },
  robots: { index: false, follow: false }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body id="top"><a className="skip-link" href="#main">Skip to content</a><div className="demo-banner">FICTIONAL DESIGNER / ORIGINAL CONCEPT WORK / LOCAL DEMO</div><Header /><main id="main">{children}</main><Footer /></body></html>;
}
