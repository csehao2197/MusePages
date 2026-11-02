import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Mosaic Studio — The people behind the pixels",
  description: "A fictional creative studio, brought together by good work and good people. Local interactive demo."
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
