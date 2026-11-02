import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "FareFinder — A little less fare. A lot more world.",
  description: "Explore fictional travel deals in the FareFinder local interactive demo."
};
export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
