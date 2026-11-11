import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Iron Ridge | Mountain-made, independently brewed", description: "Fictional Iron Ridge brewery and taproom experience. Local demo only, for adults 21+." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
