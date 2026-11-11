import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";
import { CaseStudyHeader, ImageSequence } from "@/components/CaseStudy";
import { Testimonial } from "@/components/Sections";
export function generateStaticParams() { return projects.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find(p => p.slug === slug);
  if (!p) return { title: "Project not found — Mara Vale" };
  return { title: `${p.name} — ${p.category} concept / Mara Vale`, description: `${p.summary} A fictional ${p.industry.toLowerCase()} case study, from brief to design system.`, alternates: { canonical: `/work/${p.slug}` }, openGraph: { title: `${p.name} / Mara Vale`, description: p.summary, images: ["/share.svg"] } };
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find(p => p.slug === slug);
  if (!p) notFound();
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  const service = p.category === "Campaign" ? "Campaign art direction" : p.category === "Digital" ? "Digital design" : p.category === "Editorial" || p.category === "Packaging" ? "Packaging & editorial" : "Brand identity";
  return <div className="case-page section"><Link href="/#work" className="inline-link"><ArrowLeft size={17} /> Back to selected work</Link><CaseStudyHeader project={p} /><ImageSequence project={p} />
    <div className="case-story">{[["01 / THE BRIEF", "A problem worth solving.", `${p.challenge} ${p.audience}`], ["02 / THE DIRECTION", "An idea with a point of view.", p.direction], ["03 / THE SYSTEM", "From a mark to a language.", p.system], ["04 / THE EXPLORATION", "The decisions behind the details.", p.process], ["05 / THE HANDOFF", "What exists. What doesn’t.", p.delivery]].map(([label, heading, text]) => <section key={label}><p className="eyebrow">{label}</p><h2>{heading}</h2><p>{text}</p></section>)}</div>
    <Testimonial /><div className="case-cta"><div><p className="eyebrow">HAVE A RELATED CHALLENGE?</p><h2>Let’s find your direction.</h2><Link className="button dark" href={`/inquiry?service=${encodeURIComponent(service)}`}>Discuss a {p.category.toLowerCase()} project <ArrowUpRight size={18} /></Link></div><Link className="next-project" href={`/work/${next.slug}`}><span className="eyebrow">NEXT PROJECT</span><strong>{next.name} ↗</strong><span>{next.category}</span></Link></div>
  </div>;
}
