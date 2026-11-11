import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "18 Juniper Lane | Fieldnote illustrated tour",
  description: "An original interactive, illustrated home tour. Fictional property, local demonstration only.",
  icons: { icon: "/icon.svg" },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
