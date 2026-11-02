import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurelian — A study in season",
  description: "An illustrative modern European dining experience. Local demo only.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
