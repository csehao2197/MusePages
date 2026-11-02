import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Austin commercial properties | Vanguard Commercial — Demo",
  description: "A fictional commercial property discovery experience. Local demonstration only.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
