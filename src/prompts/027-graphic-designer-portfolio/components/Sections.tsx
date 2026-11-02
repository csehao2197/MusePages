import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { services, testimonials } from "@/lib/data";
export function ServicesGrid() {
  return <section id="services" className="section services-section"><div className="section-heading"><div><p className="eyebrow">03 / HOW I CAN HELP</p><h2>Good design.<br /><em>From the ground up.</em></h2></div><p>One considered system, not a collection of loose ends.<br />Every engagement starts with a conversation.<br />Timings below are illustrative, not availability claims.</p></div><div className="services-grid">{services.map((s, i) => <article key={s.name}><span className="eyebrow">0{i + 1}</span><h3>{s.name}</h3><p>{s.fit}</p><p><strong>What we make</strong><br />{s.deliverables}</p><p className="muted">{s.shape}</p><Link className="inline-link" href={`/inquiry?service=${encodeURIComponent(s.name)}`}>Let’s talk {s.name.toLowerCase()} <ArrowUpRight size={17} /></Link></article>)}</div></section>;
}
export function Testimonial({ index = 0 }: { index?: number }) {
  const item = testimonials[index];
  return <aside className="testimonial"><p className="eyebrow">AWAITING VERIFIED CONTENT / PLACEHOLDER</p><h3>{item.title}</h3><p>{item.text}</p></aside>;
}
export function About() {
  return <section id="about" className="section about-section"><div className="studio-art" role="img" aria-label="Original abstract studio illustration: paper cutouts, a pencil, a type specimen, and a green circular form on a warm desk"><span className="studio-paper">Aa<br /><small>FORM / FEELING / FUNCTION</small></span><span className="studio-circle" /><span className="studio-pencil" /><span className="studio-caption">A studio imagined, not a photograph.</span></div><div><p className="eyebrow">02 / A LITTLE ABOUT ME</p><h2>A small studio.<br /><em>A wide-open mind.</em></h2><p className="lead">I’m Mara, an independent graphic designer working at the intersection of clear thinking and a little unexpected feeling.</p><p>My concept practice explores identities for cultural organizations, independent founders, and people building something with care. I’m interested in the useful detail: the poster you can read from the bus, the label you want to keep, the grid that helps a small team do more.</p><p>I work collaboratively, from a shared brief through honest critique to a tidy handoff. Print production, vector systems, and responsive design all have a place at the table.</p><p className="muted">Mara Vale is a fictional designer. This biography, studio, and location are demo storytelling. No real clients, employment, awards, exhibitions, or affiliations are claimed.</p><a className="inline-link" href="/mara-vale-capabilities.txt" download>Download the concept capabilities deck <ArrowDown size={17} /></a></div></section>;
}
export function Process() {
  const stages = [
    ["Discover", "First, the right questions.", "We align on your audience, brief, references, constraints, and decision-makers. A single client lead gathers feedback."],
    ["Define", "A direction worth following.", "We agree on creative territories and useful success criteria before making polished assets. Written approval keeps the scope clear."],
    ["Design", "Explore. Refine. Make it work.", "Two concept directions lead to one system, with two consolidated revision rounds. New deliverables are scoped together, never slipped in."],
    ["Deliver", "Ready for the real world.", "After approval: organized source and export files, usage guidance, printer or developer handoff, and an agreed launch-support window."]
  ];
  return <section id="process" className="section"><div className="section-heading"><div><p className="eyebrow">04 / THE PROCESS</p><h2>No mystery.<br /><em>Just good collaboration.</em></h2></div><p>A clear path from “what if” to “here it is.”<br />An illustrative process, tailored to each brief.</p></div><div className="process-grid">{stages.map(([title, sub, text], i) => <article key={title}><span className="process-number">0{i + 1}</span><h3>{title}</h3><strong>{sub}</strong><p>{text}</p></article>)}</div></section>;
}
export function Footer() {
  return <footer><Link className="wordmark" href="/">mara vale<span>®</span></Link><p>Independent by design.<br /><small>Fictional portfolio · Original concept work · © 2026</small></p><a href="#top">Back to top ↑</a><p className="footer-note">The ® is a visual concept device, not a registration claim.</p></footer>;
}
