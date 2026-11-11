import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";
import { services } from "@/lib/data";
export const metadata: Metadata = { title: "Start a project — Mara Vale / Local demo", description: "Try a local-only graphic design project inquiry. No information is sent or saved.", alternates: { canonical: "/inquiry" } };
export default async function Inquiry({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const initial = services.some(s => s.name === service) ? service : "";
  return <section className="section standalone-inquiry"><Link className="inline-link" href="/#services">← Back to services</Link><p className="eyebrow">A GOOD PLACE TO START / LOCAL DEMO</p><h1>Let’s make<br /><em>something matter.</em></h1><p>No project is sent, saved, or booked. Budgets inform scope; they are not published prices.</p><InquiryForm initialService={initial} /></section>;
}
