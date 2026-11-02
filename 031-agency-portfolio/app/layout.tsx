import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forge & Co. — Work That Works",
  description: "An independent creative agency concept. Original fictional brands, thoughtful digital experiences, and a working local project brief.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
