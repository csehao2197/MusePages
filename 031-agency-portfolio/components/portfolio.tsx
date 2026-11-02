"use client";

import { useEffect, useRef, useState } from "react";
import { Anvil, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Grid2X2, List, Menu, Palette, PanelsTopLeft, TrendingUp, X } from "lucide-react";
import { Artwork } from "./artwork";
import { categories, Category, insights, projects, services, team } from "./data";

type Panel = { type: "case"; index: number } | { type: "service"; index: number } | { type: "insight"; index: number } | { type: "team"; index: number } | { type: "about" | "process" | "careers" | "brief" | "connect"; channel?: string; service?: string };
const sampleLogos = ["solaris", "bloom", "nexus", "wander.", "CREST", "PULSE", "arborist", "kindred", "VOLT", "nourish", "STUDIOX", "clarity", "COMMON", "FORM / FIELD", "OTHERLAND", "alto"];

function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const number = value.match(/\d+(?:\.\d+)?/)?.[0];
      if (!number) return;
      const precision = number.includes(".") ? 1 : 0;
      const start = performance.now();
      function tick(now: number) {
        const progress = Math.min((now - start) / 950, 1);
        const current = (Number(number) * (1 - (1 - progress) ** 3)).toFixed(precision);
        setDisplay(value.replace(number!, current));
        if (progress < 1) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    }, { threshold: .35 });
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <div ref={ref} className={`counter ${visible ? "count-visible" : ""}`}><strong aria-label={value}><span aria-hidden="true">{display}</span></strong><span>{label}</span></div>;
}

export default function Portfolio() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [panel, setPanel] = useState<Panel | null>(null);
  const [menu, setMenu] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const filtered = projects.filter(project => (category === "All" || project.categories.includes(category)) && `${project.title} ${project.client}`.toLowerCase().includes(query.toLowerCase().trim()));
  useEffect(() => { if (new URLSearchParams(window.location.search).get("brief") === "1") setPanel({ type: "brief" }); }, []);

  function open(next: Panel) {
    trigger.current = document.activeElement as HTMLElement;
    setMenu(false);
    setPanel(next);
  }
  function close() {
    dialog.current?.close();
    setPanel(null);
    requestAnimationFrame(() => {
      const fallback = window.matchMedia("(max-width: 650px)").matches ? ".menu-toggle" : ".header-cta";
      (trigger.current?.isConnected ? trigger.current : document.querySelector<HTMLElement>(fallback))?.focus();
    });
  }
  useEffect(() => {
    if (!panel) return;
    const element = dialog.current;
    if (element && !element.open) element.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    element?.scrollTo(0, 0);
    return () => { document.body.style.overflow = previous; };
  }, [panel]);

  function navigate(id: string) { setMenu(false); requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true })); }

  return <>
    <a className="skip" href="#work">Skip to selected work</a>
    <div className="concept-banner"><span className="status-dot"/> Independent by design. <span className="concept-label">A fictional agency & portfolio concept · No real client claims</span></div>
    <header className="site-header">
      <a className="wordmark" href="#" aria-label="Forge and Co home"><Anvil strokeWidth={2.2}/><span>Forge & Co<span className="wordmark-dot">.</span></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a className="active" href="#work" onClick={() => navigate("work")}>Work</a>
        <a href="#services" onClick={() => navigate("services")}>Services</a>
        <button onClick={() => open({ type: "about" })}>About</button>
        <a href="#insights" onClick={() => navigate("insights")}>Insights</a>
        <button onClick={() => open({ type: "careers" })}>Careers <span className="nav-small">↗</span></button>
      </nav>
      <button className="button dark header-cta" onClick={() => open({ type: "brief" })}>Start a project <ArrowUpRight size={16}/></button>
      <button className="menu-toggle icon-button" aria-label={menu ? "Close navigation" : "Open navigation"} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
      {menu && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" onKeyDown={e => { if (e.key === "Escape") { setMenu(false); document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus(); } }}>
        <a href="#work" onClick={() => navigate("work")}>Work</a><a href="#services" onClick={() => navigate("services")}>Services</a><button onClick={() => open({ type: "about" })}>About</button><a href="#insights" onClick={() => navigate("insights")}>Insights</a><button onClick={() => open({ type: "careers" })}>Careers</button><button onClick={() => open({ type: "brief" })}>Start a project ↗</button>
      </nav>}
    </header>
    <main>
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-eyebrow"><span className="eyebrow">INDEPENDENT CREATIVE STUDIO</span><span className="hero-location">STRATEGY. DESIGN. A LITTLE REBELLION.</span></div>
        <h1 id="hero-title">Work That <span>Works</span><span className="hero-period">.</span></h1>
        <div className="hero-bottom"><p>We build brands, websites, and digital products<br className="desktop-break"/> that move businesses forward.</p><a className="text-link" href="#work">Explore our work <ArrowDown size={18}/></a></div>
        <div className="hero-stats"><Counter value="180+" label="Projects imagined"/><Counter value="94%" label="Retention ambition"/><Counter value="12" label="Award aspirations"/><Counter value="8" label="Years in our story"/><span className="metric-disclaimer">Illustrative agency narrative. <br/>Not verified achievements.</span></div>
      </section>

      <section id="work" className="work-section wrap" tabIndex={-1} aria-labelledby="work-title">
        <div className="section-top"><div><span className="eyebrow">01 / SELECTED WORK</span><h2 id="work-title">Good work. Great company.</h2></div><p>A few different challenges.<br/>One shared belief: make it matter.</p></div>
        <div className="filter-bar">
          <div className="filters" role="group" aria-label="Filter by discipline">{categories.map(item => <button key={item} aria-pressed={category === item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="filter-tools"><label className="search-label"><span className="sr-only">Search projects</span><input type="search" placeholder="Find a project…" value={query} onChange={e => setQuery(e.target.value)}/></label><span className="result-count" role="status">Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"}</span><div className="view-switch" role="group" aria-label="Project view"><button className={view === "grid" ? "selected" : ""} aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><Grid2X2 size={17}/></button><button className={view === "list" ? "selected" : ""} aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={19}/></button></div></div>
        </div>
        {filtered.length === 0 ? <div className="empty"><h3>No projects in this mix.</h3><p>Try a different name or explore every discipline.</p><button className="button dark" onClick={() => { setCategory("All"); setQuery(""); }}>Reset filters <ArrowRight size={16}/></button></div> : <div className={`project-collection ${view}`}>
          {filtered.map((project, index) => <div key={project.slug} className={`project-slot slot-${index}`}>
            <button className="project-card" aria-label={`View case study: ${project.title}`} onClick={() => open({ type: "case", index: projects.indexOf(project) })}>
              <div className="project-image"><Artwork slug={project.slug}/><div className="project-overlay"><span>FICTIONAL CLIENT / {project.year}</span><h3>{project.title}</h3><p>{project.client}</p><div className="overlay-tags">{project.categories.map(tag => <span key={tag}>{tag}</span>)}</div><b>View case study <ArrowUpRight size={20}/></b></div></div>
              <div className="project-caption"><div><h3>{project.title}</h3><span>{project.categories.join(" / ")}</span></div><ArrowUpRight size={20}/></div>
            </button>
            {category === "All" && !query && index === 5 && <Featured open={() => open({ type: "case", index: 0 })}/>}
          </div>)}
        </div>}
        <p className="work-note"><span>12 ORIGINAL CONCEPTS. NO BORROWED PORTFOLIOS.</span><span>Every project, client and result shown is fictional.</span></p>
      </section>

      <section className="clients" aria-labelledby="clients-title"><div className="wrap"><span className="eyebrow">GOOD COMPANY</span><h2 id="clients-title">Built for forward-thinking brands.</h2><p>A fictional client roster, not endorsements.</p></div><div className="logo-window"><div className="logo-track">{[...sampleLogos, ...sampleLogos].map((logo, i) => <span key={i} aria-hidden={i >= sampleLogos.length}>{logo}</span>)}</div></div></section>

      <section id="services" tabIndex={-1} className="services-section" aria-labelledby="services-title"><div className="wrap"><div className="section-top"><div><span className="eyebrow">02 / WHAT WE DO</span><h2 id="services-title">Big thinking.<br/>Considered execution.</h2></div><p>From the first “what if”<br/>to the last pixel. We connect the dots.</p></div><div className="service-grid">{services.map((service, index) => <a key={service.slug} className="service-card" href={`/services/${service.slug}`} onClick={e => { e.preventDefault(); open({ type: "service", index }); }}>{index === 0 ? <Palette/> : index === 1 ? <PanelsTopLeft/> : <TrendingUp/>}<span className="service-number">0{index + 1}</span><h3>{service.title}</h3><p>{service.description}</p><span className="service-link">Explore the service <ArrowUpRight size={18}/></span></a>)}</div><button className="text-link process-link" onClick={() => open({ type: "process" })}>Good work starts with a good process <ArrowRight size={18}/></button></div></section>

      <section className="results-section wrap" aria-labelledby="results-title"><div className="results-intro"><span className="eyebrow">THE AMBITION, IN NUMBERS</span><h2 id="results-title">Beautiful is good.<br/>Useful is better.</h2><p>We believe design should earn its place.<br/>These are fictional targets, not delivered results.</p></div><div className="results-grid"><Counter value="$42M+" label="Illustrative client revenue"/><Counter value="3.2×" label="Hypothetical project ROI"/><Counter value="18" label="Imagined industries"/><Counter value="4.9★" label="Fictional review scenario"/></div></section>

      <section className="about-strip wrap"><div className="studio-mark"><Anvil strokeWidth={1}/><span>SMALL STUDIO.<br/>SHARED CONVICTION.</span></div><div><span className="eyebrow">THE PEOPLE BEHIND THE PIXELS</span><h2>Different minds.<br/>One good instinct.</h2><p>A fictional independent team of strategists, designers, and makers. Curious enough to ask why. Practical enough to make it happen.</p><button className="text-link" onClick={() => open({ type: "about" })}>Meet the studio <ArrowUpRight size={18}/></button></div></section>

      <section id="insights" tabIndex={-1} className="insights-section wrap" aria-labelledby="insights-title"><div className="section-top"><div><span className="eyebrow">03 / IN GOOD THOUGHT</span><h2 id="insights-title">Notes from the workshop.</h2></div><span className="muted">Original studio essays · Concept edition</span></div><div className="insight-grid">{insights.map((insight, index) => <button className={`insight-card insight-${index}`} key={insight.title} onClick={() => open({ type: "insight", index })}><div className="insight-art" aria-hidden="true">{index === 0 ? <><div className="insight-square"/><div className="insight-circle"/></> : index === 1 ? <><span>Less.<br/><i>But better.</i></span><ArrowUpRight/></> : <><div className="insight-paper">THE<br/>GOOD<br/>BRIEF.<small>NOT A CHECKLIST.<br/>A STARTING POINT.</small></div></>}</div><div className="insight-meta">{insight.category}<span>{insight.time}</span></div><h3>{insight.title}<ArrowUpRight size={19}/></h3></button>)}</div></section>

      <section className="cta-section wrap"><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Have a project<br/>in mind<span>?</span></h2><p>We’d love to hear about it. Let’s make something matter.</p><div className="cta-buttons"><button className="button dark" onClick={() => open({ type: "brief" })}>Start a project <ArrowUpRight size={18}/></button><button className="button outline" onClick={() => open({ type: "process" })}>View our process <ArrowRight size={18}/></button></div><p className="contact-note">Prefer a conversation? <button onClick={() => open({ type: "connect", channel: "Contact" })}>Open local contact preview ↗</button><span>No email sent. No real inbox connected.</span></p></section>
    </main>
    <footer><div className="footer-main wrap"><div className="footer-brand"><a className="wordmark" href="#"><Anvil/><span>Forge & Co.</span></a><p>Independent minds.<br/>Uncompromising craft.</p><span className="footer-badge">✳ TOP AGENCY 2026<br/><small>FICTIONAL BADGE · NOT A CLUTCH AWARD</small></span></div><div><h3>Work</h3>{["All projects", "Branding", "Web Design", "Product Design"].map(label => <a key={label} href="#work" onClick={() => { setCategory(label === "All projects" ? "All" : label as Category); setQuery(""); navigate("work"); }}>{label}</a>)}</div><div><h3>Services</h3>{services.map((service, index) => <a key={service.slug} href={`/services/${service.slug}`} onClick={e => { e.preventDefault(); open({ type: "service", index }); }}>{["Brand & identity", "Web & development", "Digital marketing"][index]}</a>)}<button onClick={() => open({ type: "process" })}>Our process</button></div><div><h3>Company</h3><button onClick={() => open({ type: "about" })}>About us</button><a href="#insights">Insights</a><button onClick={() => open({ type: "careers" })}>Careers</button><button onClick={() => open({ type: "connect", channel: "Contact" })}>Contact</button></div><div><h3>Connect</h3>{["LinkedIn", "Instagram", "Dribbble", "Behance", "Twitter"].map(channel => <button key={channel} onClick={() => open({ type: "connect", channel })}>{channel} ↗</button>)}</div></div><div className="footer-bottom wrap"><span>© 2026 Forge & Co. Creative Agency · Fictional concept</span><span>Designed with intent. Built with care.</span></div></footer>
    <button className="mobile-project button dark" onClick={() => open({ type: "brief" })}>Start a project <ArrowUpRight size={18}/></button>

    <dialog ref={dialog} className="detail-dialog" aria-labelledby="dialog-title" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }} onKeyDown={e => {
      if (e.key !== "Tab") return;
      const controls = [...e.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex='0']")].filter(element => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }}>
      <div className="dialog-inner"><div className="dialog-top"><span className="eyebrow">FORGE & CO. / CONCEPT STUDIO</span><button ref={closeRef} className="icon-button close-dialog" aria-label="Close detail" onClick={close}><X/></button></div>
        {panel?.type === "case" && <CaseStudy index={panel.index} change={index => setPanel({ type: "case", index })} brief={() => setPanel({ type: "brief" })}/>}
        {panel?.type === "service" && <ServiceDetail index={panel.index} brief={() => setPanel({ type: "brief", service: services[panel.index].title })}/>}
        {panel?.type === "about" && <><span className="eyebrow">INDEPENDENT. TOGETHER.</span><h2 id="dialog-title">A small studio.<br/>A wide-open mind.</h2><p className="dialog-lead">Strategy, identity, and digital craft around the same table.</p><p>Forge & Co. is a fictional agency created for this interactive portfolio. Its team, eight-year narrative, awards, clients, and availability are invented. The work is original concept exploration, not a record of commissions.</p><h3>The people in our story</h3><div className="team-grid">{team.map((person, index) => <button key={person.name} onClick={() => setPanel({ type: "team", index })}><span className={`team-avatar avatar-${index}`}>{person.initials}</span><b>{person.name} <ArrowUpRight size={16}/></b><span>{person.role}</span><small>Fictional profile</small></button>)}</div><h3>How we like to work</h3><p>Ask a better question. Make the choices visible. Leave the team with something they can actually use. No borrowed credibility, no mystery process.</p><button className="button dark" onClick={() => setPanel({ type: "process" })}>Inside our process <ArrowRight size={17}/></button></>}
        {panel?.type === "team" && <><span className="eyebrow">FICTIONAL TEAM PROFILE</span><h2 id="dialog-title">{team[panel.index].name}</h2><p className="dialog-lead">{team[panel.index].role}</p><span className={`team-avatar profile-avatar avatar-${panel.index}`}>{team[panel.index].initials}</span><p>{team[panel.index].bio}</p><p className="notice">This person and role are invented. No employment history, tenure, credentials, or availability is asserted.</p><button className="button outline" onClick={() => setPanel({ type: "about" })}><ArrowLeft size={17}/> Back to the studio</button></>}
        {panel?.type === "process" && <><span className="eyebrow">NO BLACK BOXES</span><h2 id="dialog-title">Good questions.<br/>Better outcomes.</h2><p className="dialog-lead">A proposed four-part process. Scope and timing would be agreed together, not assumed.</p><ol className="process-steps">{[
          ["Discover", "Understand the real problem.", "Align on audience, business needs, existing evidence, and constraints. The output is a shared brief and an explicit list of assumptions to validate."],
          ["Define", "Find the useful direction.", "Map the story and priority journeys. Review creative territories against the brief, then agree one direction with documented trade-offs."],
          ["Make", "Build, test, refine.", "Develop the identity or responsive prototype in short review rounds. Plan keyboard, content, and device checks; involve real participants before claiming usability results."],
          ["Launch & learn", "Leave something that lasts.", "Agree acceptance criteria, hand over the system, and establish a measurement baseline. Any performance or business claim needs real post-launch evidence."]
        ].map(([title, subtitle, text], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><b>{subtitle}</b><p>{text}</p></div></li>)}</ol><button className="button dark" onClick={() => setPanel({ type: "brief" })}>Let’s start with your brief <ArrowUpRight size={18}/></button></>}
        {panel?.type === "insight" && <article><span className="eyebrow">{insights[panel.index].category} / {insights[panel.index].time}</span><h2 id="dialog-title">{insights[panel.index].title}</h2><p className="notice">Original concept essay · Editorial opinion, not reported research.</p>{insights[panel.index].body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className="case-navigation"><button className="text-link" onClick={() => setPanel({ type: "insight", index: (panel.index + 1) % insights.length })}>Next studio note <ArrowRight size={18}/></button></div></article>}
        {panel?.type === "careers" && <><span className="eyebrow">MAKE GOOD THINGS, TOGETHER</span><h2 id="dialog-title">Curiosity looks<br/>good on you.</h2><p className="dialog-lead">A fictional studio. No actual vacancies.</p><p>Our imagined team values thoughtful critique, accessible design, and honest communication. There are currently no real jobs, hiring timelines, or application inboxes behind this demo.</p><div className="notice"><b>No open positions</b><p>Please don’t submit a CV or personal employment information here. Explore the fictional team and process instead.</p></div><button className="button dark" onClick={() => setPanel({ type: "about" })}>Meet the concept team <ArrowRight size={17}/></button></>}
        {panel?.type === "brief" && <Brief initialService={panel.service}/>}
        {panel?.type === "connect" && <><span className="eyebrow">LOCAL CONTACT PREVIEW</span><h2 id="dialog-title">{panel.channel === "Contact" ? "Let’s make a start." : `${panel.channel}, without the redirect.`}</h2><p className="dialog-lead">No real account or inbox is connected.</p><p>The source’s email address and social accounts have been replaced with this local preview to avoid sending enquiries to a real person or implying an official agency presence. No data leaves this demo.</p><button className="button dark" onClick={() => setPanel({ type: "brief" })}>Try the project brief <ArrowUpRight size={18}/></button></>}
      </div>
    </dialog>
  </>;
}

function Featured({ open }: { open: () => void }) {
  return <section className="featured" aria-labelledby="featured-title"><div className="featured-art"><Artwork slug="solaris" large/></div><div className="featured-copy"><span className="eyebrow">IN FOCUS / SOLARIS ENERGY</span><h2 id="featured-title">New energy.<br/>A brighter future.</h2><p>A complete rebrand and digital direction. From a regional installer to an imagined national clean energy leader.</p><div className="featured-metrics"><div><b>+340%</b><span>Qualified leads</span></div><div><b>+127%</b><span>Organic traffic</span></div><div><b>0.9s</b><span>Load-time target</span></div></div><small>Fictional scenario targets. Not measured results.</small><button className="button white-outline" onClick={open}>Inside the Solaris concept <ArrowUpRight size={17}/></button></div></section>;
}

function CaseStudy({ index, change, brief }: { index: number; change: (index: number) => void; brief: () => void }) {
  const project = projects[index];
  return <article className="case-detail"><div className="case-kicker"><span className="eyebrow">CONCEPT CASE STUDY / {String(index + 1).padStart(2, "0")}</span><span>{project.year}</span></div><h2 id="dialog-title">{project.title}</h2><p className="dialog-lead">{project.summary}</p><div className="case-tags">{project.categories.map(tag => <span key={tag}>{tag}</span>)}<span>Fictional client: {project.client}</span></div><Artwork slug={project.slug} large/><div className="case-text"><section><span className="eyebrow">01 / THE CHALLENGE</span><h3>A better starting point.</h3><p>{project.challenge}</p></section><section><span className="eyebrow">02 / OUR APPROACH</span><h3>Make the useful, beautiful.</h3><p>{project.approach}</p></section><section><span className="eyebrow">03 / THE KEY DECISION</span><h3>Choose with intention.</h3><p>{project.decision}</p></section><section className="notice"><span className="eyebrow">04 / CONCEPT OUTCOME & LIMITATIONS</span><h3>Direction, not evidence.</h3><p>{project.outcome}</p><p>No real commission, endorsement, user study, award, or measured commercial result is represented.</p></section></div><button className="button dark" onClick={brief}>Have a challenge like this? <ArrowUpRight size={18}/></button><div className="case-navigation"><button className="text-link" onClick={() => change((index + projects.length - 1) % projects.length)}><ArrowLeft size={18}/> Previous project</button><button className="text-link" onClick={() => change((index + 1) % projects.length)}>Next: {projects[(index + 1) % projects.length].title} <ArrowRight size={18}/></button></div></article>;
}

export function ServiceDetail({ index, brief, standalone = false }: { index: number; brief?: () => void; standalone?: boolean }) {
  const service = services[index];
  return <article><span className="eyebrow">SERVICE / 0{index + 1}</span><h2 id={standalone ? undefined : "dialog-title"}>{service.title}</h2><p className="dialog-lead">{service.description}</p><p>{service.detail}</p><h3>What we could make together</h3><ul className="deliverables">{service.deliverables.map(item => <li key={item}><Check size={18}/>{item}</li>)}</ul><p className="notice">Proposed fictional service scope. No guaranteed results, fixed pricing, real delivery capacity, or availability is promised. A real estimate would depend on discovery.</p>{brief ? <button className="button dark" onClick={brief}>Build a brief for this service <ArrowUpRight size={18}/></button> : <a className="button dark" href="/?brief=1">Explore the studio & brief <ArrowUpRight size={18}/></a>}</article>;
}

function Brief({ initialService }: { initialService?: string }) {
  const [selected, setSelected] = useState<string[]>(initialService ? [initialService] : []);
  const [status, setStatus] = useState<"editing" | "error" | "confirmed">("editing");
  const [attempts, setAttempts] = useState(0);
  const [summary, setSummary] = useState({ name: "", budget: "", date: "", services: "" });
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLHeadingElement>(null);
  const error = useRef<HTMLDivElement>(null);
  const today = new Date();
  const minimumDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  useEffect(() => { if (status === "confirmed") success.current?.focus(); if (status === "error") error.current?.focus(); }, [status]);
  function reset() { form.current?.reset(); form.current?.querySelector("textarea")?.setCustomValidity(""); setSelected(initialService ? [initialService] : []); setAttempts(0); setStatus("editing"); }
  if (status === "confirmed") return <section className="brief-success"><span className="success-icon"><Check/></span><h2 id="dialog-title" ref={success} tabIndex={-1}>A good start, {summary.name}.</h2><p className="dialog-lead">Your brief is confirmed locally.</p><p>Nothing was sent or saved. This confirmation disappears when you close the dialog or refresh.</p><dl className="brief-summary"><div><dt>Interested in</dt><dd>{summary.services}</dd></div><div><dt>Budget range</dt><dd>{summary.budget}</dd></div><div><dt>Preferred start</dt><dd>{summary.date}</dd></div></dl><p className="notice">No booking, quote, contract, email, or actual project availability is created.</p><button className="button dark" onClick={reset}>Start a fresh brief <ArrowRight size={18}/></button></section>;
  return <><span className="eyebrow">LET’S MAKE SOMETHING MATTER</span><h2 id="dialog-title">Tell us what’s next.</h2><p className="dialog-lead">A few good questions. A better starting point.</p><p className="notice">Local demo only. Use invented details, not private information. No data is sent, stored, or emailed. The “simulate error” option lets you test recovery.</p>
    <form ref={form} onSubmit={e => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      if (data.get("simulate") && attempts === 0) { setAttempts(1); setStatus("error"); return; }
      setSummary({ name: String(data.get("name")).trim(), budget: String(data.get("budget")), date: String(data.get("date")), services: selected.join(", ") });
      setStatus("confirmed");
    }}>
      <fieldset className="service-options"><legend>01 / What can we help with? <span>(choose at least one)</span></legend>{services.map((service, index) => <label key={service.slug}><input type="checkbox" name="services" value={service.title} checked={selected.includes(service.title)} required={selected.length === 0 && index === 0} onChange={() => { setSelected(previous => previous.includes(service.title) ? previous.filter(item => item !== service.title) : [...previous, service.title]); }}/><span>{service.title}<Check size={15}/></span></label>)}</fieldset>
      <fieldset><legend>02 / A little about you</legend><div className="form-grid"><label>Your name <input name="name" autoComplete="off" placeholder="e.g. Taylor Example" required minLength={2} maxLength={70} pattern=".*\S.*"/></label><label>Email <input name="email" type="email" autoComplete="off" placeholder="taylor@example.test" required maxLength={120}/></label><label>Organization <span className="optional">(optional)</span><input name="organization" placeholder="Your fictional organization" maxLength={100}/></label><label>Budget range <select aria-label="Budget range" name="budget" required defaultValue=""><option value="" disabled>Select a range</option><option>$5k–$15k</option><option>$15k–$30k</option><option>$30k–$60k</option><option>$60k+</option><option>Let’s scope it together</option></select></label><label className="date-field">Preferred start date <input aria-label="Preferred start date" type="date" name="date" min={minimumDate} max="2030-12-31" required/><small>A preference, not confirmed availability.</small></label></div></fieldset>
      <label className="project-description">03 / What are you hoping to change?<textarea name="description" rows={4} minLength={20} maxLength={2000} required onChange={event => event.currentTarget.setCustomValidity(event.currentTarget.value.trim().length < 20 ? "Describe the challenge in at least 20 non-padding characters." : "")} placeholder="The challenge, the audience, and what success could look like. At least 20 characters."/></label>
      <label className="check-label"><input type="checkbox" name="consent" required/>I understand this is a fictional, local-only brief and nothing will be sent.</label>
      <label className="check-label simulation"><input type="checkbox" name="simulate"/>Simulate a local submission error once</label>
      {status === "error" && <div ref={error} role="alert" tabIndex={-1} className="form-error"><b>The local preview couldn’t complete.</b><p>Your entries are still here. The simulated error has cleared; select “Confirm local brief” again to retry.</p></div>}
      <div className="form-actions"><button className="button dark" type="submit">Confirm local brief <ArrowUpRight size={18}/></button><button type="button" className="text-link" onClick={reset}>Reset brief</button></div><p className="form-footnote">All fields required unless marked optional. No payments, uploads, or real accounts.</p>
    </form>
  </>;
}
