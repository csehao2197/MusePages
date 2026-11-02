import Link from "next/link";
import { ArrowDown, ArrowUpRight, Asterisk } from "lucide-react";
import { Artwork } from "@/components/Artwork";
import { SelectedWork } from "@/components/Portfolio";
import { About, Process, ServicesGrid, Testimonial } from "@/components/Sections";
import { InquiryForm } from "@/components/InquiryForm";
import { projects, siteUrl } from "@/lib/data";
export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: "Mara Vale (fictional demo persona)", jobTitle: "Graphic designer — concept portfolio", url: siteUrl, description: "Fictional designer; no real client or professional claims." }) }} />
    <section className="hero">
      <div className="hero-top"><p className="eyebrow"><span className="status-dot" /> INDEPENDENT GRAPHIC DESIGNER</p><span className="hero-location">Imagined in Portland, OR · Pacific time<br />Availability is a demo placeholder</span></div>
      <h1>Thoughtful<br /><em>by design.</em><Asterisk className="hero-star" strokeWidth={1.4} aria-hidden="true" /></h1>
      <div className="hero-bottom"><p>I build distinctive identities and visual stories<br className="desktop-break" /> for cultural spaces and independent minds.<br className="desktop-break" /> Clear in purpose. Full of character.</p><div className="hero-actions"><a className="button dark" href="#work">View selected work <ArrowDown size={18} /></a><a className="inline-link" href="#contact">Start a project <ArrowUpRight size={17} /></a></div><span className="hero-index">SCROLL TO EXPLORE<br />↓ 01—06</span></div>
      <Link href="/work/common-ground" className="hero-feature" aria-label="Explore featured project Common Ground"><Artwork project={projects[0]} /><div><span>FEATURED / COMMON GROUND</span><span>A shared space. A common language. <ArrowUpRight size={20} /></span></div></Link>
    </section>
    <div className="practice-strip"><span>IDENTITY WITH INTENTION</span><Asterisk size={21} /><span>PRINT WITH PRESENCE</span><Asterisk size={21} /><span>DIGITAL WITH PERSONALITY</span><Asterisk size={21} /><span>INDEPENDENT BY DESIGN</span></div>
    <SelectedWork /><About /><ServicesGrid /><div className="section proof-grid"><Testimonial /><Testimonial index={1} /></div><Process />
    <section id="contact" className="section contact-section"><div><p className="eyebrow">05 / YOUR NEXT CHAPTER</p><h2>Have something<br /><em>in mind?</em><span className="accent">↗</span></h2><p className="lead">Tell me what you’re thinking.<br />We’ll take it from there.</p><p>This local demo does not send emails. A real practice would aim to reply within two business days.</p><a className="inline-link" href="mailto:hello@mara-vale.example">hello@mara-vale.example <ArrowUpRight size={18} /></a><p className="fine-print">Reserved .example address; illustrative email alternative only, not a monitored inbox. Use the local form to try the full flow without sending anything.</p></div><InquiryForm /></section>
  </>;
}
