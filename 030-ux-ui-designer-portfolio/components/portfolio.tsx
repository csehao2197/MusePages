"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, ArrowDownToLine, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, CircleCheck, Code2, Compass, Layers3, Mail, Menu, MousePointer2, PenTool, Rocket, Search, Target, X } from "lucide-react";
import { projects, type Category, type Project } from "./projects";
import { MiniFlow, ProjectArt } from "./screens";

type Modal = { type: "case"; id: string } | { type: "social"; name: string } | null;
const categories: Category[] = ["All work", "Mobile", "SaaS", "Healthcare"];
function containDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const controls = [...event.currentTarget.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, summary, [tabindex='0']")].filter(element => element.getClientRects().length > 0 && !element.hasAttribute("disabled"));
  const first = controls[0];
  const last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}
const steps = [
  { title: "Discover", icon: Search, description: "Listen first. Find the right problem.", detail: "Plan interviews, review existing journeys, and compare alternatives. In these concepts, authored scenarios stand in for participant research; hypotheses remain unvalidated." },
  { title: "Define", icon: Target, description: "Turn messy inputs into a clear direction.", detail: "Frame the job to be done, map a journey, and make constraints visible. Every concept states what would need validation before committing to a solution." },
  { title: "Design", icon: PenTool, description: "Explore, prototype, test. Then do it again.", detail: "Sketch competing flows, build a small interaction, and iterate on hierarchy. These local prototypes demonstrate design decisions, not completed usability studies." },
  { title: "Deliver", icon: Rocket, description: "Sweat the details. Build it together.", detail: "Document states, keyboard behavior, responsive rules, and handoff decisions. For real work, pair with engineers and evaluate the shipped result; no production impact is claimed here." },
];

export default function Portfolio() {
  const [category, setCategory] = useState<Category>("All work");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<Modal>(null);
  const [drawer, setDrawer] = useState(false);
  const [selectedStep, setSelectedStep] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const mobileDialog = useRef<HTMLDialogElement>(null);
  const visible = projects.filter(p => (category === "All work" || p.category === category) && `${p.title} ${p.eyebrow} ${p.description}`.toLowerCase().includes(query.toLowerCase()));
  const current = modal?.type === "case" ? projects.find(p => p.id === modal.id) : undefined;

  useEffect(() => {
    if (modal) dialog.current?.showModal();
    else dialog.current?.close();
    document.body.style.overflow = modal || drawer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal, drawer]);
  useEffect(() => {
    if (drawer) mobileDialog.current?.showModal();
    else mobileDialog.current?.close();
  }, [drawer]);

  function navigateMobile() { setDrawer(false); }

  const socialButtons = <div className="socials">{["LinkedIn", "Dribbble", "Twitter / X", "Read.cv"].map((name, i) => <button key={name} onClick={() => setModal({ type: "social", name })} aria-label={`Open ${name} concept profile`}>{["in", "◉", "𝕏", "cv"][i]}</button>)}</div>;

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="concept-bar">AN INDEPENDENT PORTFOLIO CONCEPT <span>·</span> Fictional designer. Original work. No brand affiliations.</div>
    <header className="site-header"><div className="nav-wrap"><a href="#" className="wordmark" aria-label="Ava Chen home">Ava Chen<span>.</span></a><nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#process">Process</a><a href="#contact">Contact</a></nav><a className="button outline nav-talk" href="#contact">Let&apos;s Talk <ArrowUpRight size={16}/></a><button className="mobile-menu icon-button" aria-label="Open navigation" aria-expanded={drawer} onClick={() => setDrawer(true)}><Menu/></button></div></header>
    <main id="main">
      <section className="hero"><div className="container hero-layout"><div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> UX/UI DESIGNER · SAN FRANCISCO</div><h1>I design digital<br className="wide-break"/> products that<br className="wide-break"/> people <span>enjoy</span> using<span className="headline-dot">.</span></h1><p>Turning complex workflows into intuitive,<br className="wide-break"/> thoughtful experiences. One detail at a time.</p><div className="career-note">A fictional senior product designer exploring SaaS &amp; mobile.<br/>Notion, Figma &amp; Stripe studies are independent concepts—not employment or client work.</div><div className="hero-actions"><a className="button primary" href="#work">View My Work <ArrowDown size={17}/></a><a className="text-button" href="/ava-chen-concept-resume.txt" download onClick={() => setDownloaded(true)}>Download Resume <ArrowDownToLine size={16}/></a></div>{downloaded && <p className="download-feedback" role="status">Fictional concept résumé downloaded. Not a real career record.</p>}<div className="hero-footnote"><span className="small-star">✦</span> Good design feels simple. Getting there is the work.</div></div><ProjectArt id="calendar" hero/></div><div className="container hero-bottom"><span>THOUGHTFUL BY DESIGN. HUMAN BY DEFAULT.</span><a href="#work" aria-label="Explore selected work"><ArrowDown size={16}/></a><span>SCROLL TO EXPLORE</span></div></section>

      <section id="work" className="section container work-section"><div className="section-intro"><div><div className="eyebrow">A FEW SELECTED EXPLORATIONS</div><h2>Good problems.<br/>Thoughtful solutions.</h2></div><p>A selection of product experiences,<br/>from the first “what if” to the finer details.</p></div><div className="work-toolbar"><div className="filters" aria-label="Project categories">{categories.map(c => <button key={c} aria-pressed={category === c} className={category === c ? "selected" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div><label className="work-search"><Search size={16}/><span className="sr-only">Search projects</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a project"/></label></div><div className="work-count"><span>SELECTED WORK</span><span role="status">{visible.length} {visible.length === 1 ? "project" : "projects"}</span><span className="rule"/></div>
      <div className="project-list">{visible.map(p => <article className={`project-card ${p.color}`} key={p.id}><div className="project-visual"><span className="visual-caption">INDEPENDENT CONCEPT / {p.year}</span><ProjectArt id={p.id}/></div><div className="project-copy"><div className="project-meta"><span>{p.eyebrow}</span><span>{p.number} / 04</span></div><h3>{p.title}</h3><div className="project-tags"><span>{p.category === "SaaS" ? "Web app" : p.category}</span><span>Product design</span><span>{p.year}</span></div><p>{p.description}</p><div className="metrics">{p.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><div className="metric-disclaimer">¹ Fictional targets &amp; assumptions, not measured results.</div><button className="case-button" onClick={() => setModal({ type: "case", id: p.id })} aria-label={`View ${p.eyebrow} case study`}>View Case Study <ArrowUpRight size={19}/></button></div></article>)}</div>{!visible.length && <div className="empty-state"><Search size={30}/><h3>No projects in this corner.</h3><p>Try a different search or explore all four concepts.</p><button className="button primary" onClick={() => { setCategory("All work"); setQuery(""); }}>Reset filters</button></div>}
      <div className="work-postscript"><span>Different challenges. Same north star.</span><span>Make the complex feel effortless. <MousePointer2 size={17}/></span></div></section>

      <section id="process" className="section process-section"><div className="container"><div className="centered"><div className="eyebrow">A LITTLE STRUCTURE. A LOT OF CURIOSITY.</div><h2>How I Work</h2><p>Never a straight line. Always moving toward clarity.</p></div><div className="process-grid">{steps.map((s, i) => <button className={`process-step ${selectedStep === i ? "active" : ""}`} aria-pressed={selectedStep === i} onClick={() => setSelectedStep(i)} key={s.title}><span className="step-icon"><s.icon size={23}/></span><span className="step-number">0{i + 1}</span><strong>{s.title}</strong><span>{s.description}</span></button>)}</div><div className="process-detail" aria-live="polite"><span>0{selectedStep + 1} / {steps[selectedStep].title}</span><p>{steps[selectedStep].detail}</p></div><blockquote>“Great design isn&apos;t about making things pretty.<br/>It&apos;s about making things work for real people.”<cite>AVA CHEN · FICTIONAL DESIGN PHILOSOPHY</cite></blockquote><div className="tools"><h3>Tools &amp; Skills</h3><div className="tool-row"><span className="tool-label">DESIGN</span>{["Figma", "Sketch", "Adobe XD", "Framer", "Principle", "Whimsical"].map((t, i) => <span className="tool-chip" key={t}>{i % 2 ? <PenTool size={14}/> : <Layers3 size={14}/>} {t}</span>)}</div><div className="tool-row"><span className="tool-label">RESEARCH & DEV</span>{["Maze", "Hotjar", "UserTesting", "HTML / CSS", "React basics", "Design Systems"].map(t => <span className="tool-chip" key={t}><Code2 size={14}/> {t}</span>)}</div><p className="fine-print">Fictional skill profile; no tool endorsement or research-service connection.</p></div></div></section>

      <section id="about" className="section container about-section"><div className="portrait-panel"><svg viewBox="0 0 400 450" role="img" aria-label="Original abstract line portrait representing fictional designer Ava, not a photograph"><defs><linearGradient id="portraitBg" x2="1" y2="1"><stop stopColor="#e9e7f2"/><stop offset="1" stopColor="#d8d2e6"/></linearGradient></defs><rect width="400" height="450" rx="20" fill="url(#portraitBg)"/><circle cx="200" cy="199" r="127" fill="#e1dceb"/><path d="M76 450Q91 318 198 317T332 450" fill="#55566c"/><path d="M166 292L165 330Q201 358 234 330L230 281" fill="#cca897"/><path d="M119 195Q108 73 201 78Q299 75 279 209L275 299Q230 342 213 284L149 288Q110 322 113 257Z" fill="#34333f"/><ellipse cx="198" cy="212" rx="69" ry="92" fill="#dfbca7"/><path d="M125 198Q116 105 200 102Q284 101 271 200Q235 172 219 137Q179 185 125 198" fill="#34333f"/><path d="M155 209Q165 203 174 209M221 209Q232 203 241 209" fill="none" stroke="#504348" strokeWidth="3" strokeLinecap="round"/><path d="M193 215L188 242L200 245" fill="none" stroke="#ba8f80" strokeWidth="2"/><path d="M178 262Q199 278 219 260" fill="none" stroke="#915d59" strokeWidth="3" strokeLinecap="round"/><circle cx="142" cy="236" r="5" fill="#eee2c2"/><circle cx="256" cy="236" r="5" fill="#eee2c2"/><path d="M126 369Q199 397 275 365" fill="none" stroke="#73748a" strokeWidth="2"/></svg><span className="portrait-sticker">A little curiosity<br/>goes a long way. <span>↗</span></span><small>ORIGINAL ILLUSTRATION · FICTIONAL PERSON</small></div><div className="about-copy"><div className="eyebrow">THE PERSON BEHIND THE PIXELS</div><h2>A Bit About Me</h2><p className="large-body">Equal parts systems thinker,<br/>detail enthusiast, and curious human.</p><p>I&apos;m Ava—a fictional product designer based in San Francisco. In this concept, my seven-year journey begins in graphic design, takes a turn through a UX bootcamp, and lands in the wonderfully messy world of product design.</p><p>The through line? A belief that the best interfaces get out of the way. I like asking the extra question, connecting the dots, and making space for the people behind every screen.</p><p>Off the clock, this fictional bio finds me hiking in Marin, collecting vinyl, and mentoring emerging designers.</p><div className="fun-facts"><span>☕ <b>Coffee, always</b><small>3 cups / day</small></span><span>📚 <b>On the nightstand</b><small>Thinking in Systems</small></span><span>♫ <b>In the headphones</b><small>Lo-fi on repeat</small></span></div><button className="text-button indigo" onClick={() => setModal({ type: "social", name: "LinkedIn" })}>Connect on LinkedIn <ArrowUpRight size={17}/></button></div></section>

      <section className="section testimonials"><div className="container"><div className="section-intro"><div><div className="eyebrow">GOOD WORK IS A TEAM SPORT</div><h2>Better, together.</h2></div><p>Imagined collaborator perspectives.<br/>Fictional quotes, not real testimonials.</p></div><div className="quote-grid">{[
        ["“Ava turns ambiguity into a clear direction. Every decision has a reason, and every detail has a purpose.”", "Jamie Lin", "Fictional product lead", "JL"],
        ["“The thoughtful part isn't just the screen. It's how she makes room for engineering in the design process.”", "Priya Shah", "Fictional engineering lead", "PS"],
        ["“She doesn't just think in screens—she thinks in systems. The handoff feels like a conversation, not a handover.”", "Marcus Reed", "Fictional technical partner", "MR"],
        ["“Curious, intentional, and never precious about an idea. Exactly the kind of partner you'd want in the room.”", "Elena Park", "Fictional product manager", "EP"],
      ].map(([quote, name, role, initials]) => <figure key={name}><span className="quote-mark" aria-hidden="true">“</span><blockquote>{quote}</blockquote><figcaption><span className="quote-avatar">{initials}</span><div><b>{name}</b><small>{role} · Concept quote</small></div></figcaption></figure>)}</div></div></section>

      <section id="contact" className="section container contact-section"><div className="contact-copy"><div className="eyebrow">SOMETHING GOOD STARTS WITH A HELLO</div><h2>Let&apos;s make<br/>something<br/><span>meaningful.</span></h2><p>Have a knotty product challenge?<br/>A big “what if”? I&apos;d love to hear it.</p><div className="availability"><span className="status-dot"/> Concept availability: open to possibilities</div><p className="fine-print">Fictional availability—not an offer of work. This local demo sends no email, and no response is promised.</p><button className="email-link" onClick={() => setModal({ type: "social", name: "Email" })}><Mail size={18}/> ava@avachen.design <ArrowUpRight size={16}/></button>{socialButtons}</div><ContactForm/></section>
    </main>
    <footer><div className="container footer-main"><div><a href="#" className="wordmark">Ava Chen<span>.</span></a><p>Thoughtful products. Human experiences.</p></div><div><span>Designed with intention. Built with code.</span><p>Independent local portfolio concept · No real affiliations</p>{socialButtons}</div></div><div className="container footer-bottom"><span>© 2026 Ava Chen · Fictional portfolio demo</span><a href="#">Back to top ↑</a><span>Made of pixels &amp; possibilities.</span></div></footer>

    <dialog ref={mobileDialog} className="mobile-drawer" aria-label="Mobile navigation" onKeyDown={containDialogFocus} onCancel={() => setDrawer(false)} onClose={() => setDrawer(false)}><div className="drawer-heading"><span className="wordmark">Ava Chen<span>.</span></span><button aria-label="Close navigation" className="icon-button" onClick={() => setDrawer(false)} autoFocus><X/></button></div><nav aria-label="Mobile links">{["Work", "About", "Process", "Contact"].map((n, i) => <a href={`#${n.toLowerCase()}`} key={n} onClick={navigateMobile}><span>0{i + 1}</span>{n}<ArrowUpRight/></a>)}</nav><p>Thoughtfully connected.<br/>Fictional portfolio, real attention to detail.</p><a className="button primary" href="#contact" onClick={navigateMobile}>Let&apos;s Talk <ArrowRight size={18}/></a></dialog>

    <dialog ref={dialog} className="detail-dialog" onKeyDown={containDialogFocus} aria-label={current ? `${current.eyebrow} case study` : `${modal?.type === "social" ? modal.name : ""} concept profile`} onCancel={() => setModal(null)} onClose={() => setModal(null)}>
      <div className="dialog-top"><span>AVA CHEN / INDEPENDENT CONCEPT</span><button className="icon-button" aria-label="Close dialog" autoFocus onClick={() => setModal(null)}><X/></button></div>
      {current ? <CaseStudy key={current.id} project={current} onNavigate={id => { setModal({ type: "case", id }); dialog.current?.scrollTo({ top: 0 }); }}/>: modal?.type === "social" ? <div className="social-modal"><span className="eyebrow">NO EXTERNAL CONNECTION</span><h2>{modal.name === "Email" ? "A local hello." : `A fictional ${modal.name} profile.`}</h2><p>Ava Chen is a fictional designer. There is no verified profile, inbox, or third-party account behind this demo. No real person or brand is being represented.</p><p>Use the project inquiry below to try a local-only message. Nothing leaves your browser.</p><button className="button primary" onClick={() => { setModal(null); document.getElementById("contact")?.scrollIntoView(); }}>Try the local inquiry <ArrowRight size={17}/></button></div>: null}
    </dialog>
  </>;
}

function CaseStudy({ project: p, onNavigate }: { project: Project; onNavigate: (id: string) => void }) {
  const [tab, setTab] = useState("Overview");
  const index = projects.findIndex(x => x.id === p.id);
  const sections = ["Overview", "Research", "Design", "Prototype"];
  return <div className="case-study"><div className="case-heading"><div className="eyebrow">{p.eyebrow} · {p.year}</div><h2>{p.title}</h2><p>{p.description}</p><div className="concept-notice"><Compass size={18}/><span>Independent fictional case study. No client affiliation, employment, real participants, measured impact, or production integrations.</span></div></div><div className="case-tabs" aria-label="Case study sections">{sections.map(t => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>)}</div>
      <section className="case-content" aria-label={`${tab} content`}>
      {tab === "Overview" && <><ProjectArt id={p.id}/><div className="case-facts"><span>ROLE<b>Product designer (fictional)</b></span><span>SCOPE<b>{p.category} · Interaction &amp; systems</b></span><span>EVIDENCE<b>Authored concept, not a shipped product</b></span></div><h3>The challenge</h3><p>{p.challenge}</p><h3>Constraints worth designing for</h3><p>{p.constraints}</p><h3>Targets, not trophies</h3><p>{p.outcome}</p></>}
      {tab === "Research" && <><span className="case-kicker">01 / DISCOVER & DEFINE</span><h3>Start with a better question.</h3><p>{p.research}</p><MiniFlow/><h3>A scenario, not a finding</h3><p>{p.challenge}</p><h3>What still needs to be learned</h3><p>{p.next}</p><div className="research-note"><Search size={20}/><p>No user interviews, usability sessions, surveys, or clinical studies were conducted. These are speculative design hypotheses, not participant evidence.</p></div></>}
      {tab === "Design" && <><span className="case-kicker">02 / EXPLORE & REFINE</span><h3>Small decisions. A clearer path.</h3><p>{p.decision}</p><BeforeAfter id={p.id}/><h3>What changed, and why</h3><p>{p.iteration}</p><h3>Designing beyond the happy path</h3><p>Visible labels, non-color status cues, keyboard access, and explicit confirmation keep the interaction understandable. Empty and error states explain the next action rather than leaving a dead end.</p></>}
      {tab === "Prototype" && <><span className="case-kicker">03 / A SMALL, WORKING SLICE</span><h3>Try the interaction.</h3><p>A local prototype, using fictional data. Changes reset when this case study closes. No services, accounts, installs, payments, or patient records.</p><Prototype id={p.id}/></>}
      </section>
      <div className="case-navigation"><button className="text-button" onClick={() => onNavigate(projects[(index + 3) % 4].id)}><ChevronLeft size={17}/> Previous case</button><span>{index + 1} / 4</span><button className="text-button" onClick={() => onNavigate(projects[(index + 1) % 4].id)}>Next case <ChevronRight size={17}/></button></div>
    </div>;
}

function BeforeAfter({ id }: { id: string }) {
  const [after, setAfter] = useState(true);
  const labels: Record<string, [string, string]> = {
    calendar: ["Separate workspace picker → Event form → Hidden conflict", "Unified day → Named workspace → Conflict check → Confirm"],
    analytics: ["Revenue report → Export → Refund report → Reconcile", "Shared period → Comparable summaries → Source details"],
    plugins: ["Unsorted tools → Search again → Unclear install state", "Category → Purpose → Explicit local install → Undo"],
    health: ["Results table → Find a contact → Search for booking", "Next action → Choose a date → Confirm the details"],
  };
  return <div className="comparison"><div className="comparison-controls"><button aria-pressed={!after} onClick={() => setAfter(false)}>Before / exploration A</button><button aria-pressed={after} onClick={() => setAfter(true)}>After / exploration B</button></div><div className={`comparison-flow ${after ? "after" : ""}`} aria-live="polite"><span>{after ? "B · IN-CONTEXT & EXPLICIT" : "A · FRAGMENTED & UNCLEAR"}</span><p>{labels[id][after ? 1 : 0]}</p>{after ? <CircleCheck size={29}/> : <Layers3 size={29}/>}</div><small>Authored flow comparison, not a tested performance comparison.</small></div>;
}

function Prototype({ id }: { id: string }) {
  const [period, setPeriod] = useState("month");
  const [pluginCategory, setPluginCategory] = useState("All");
  const [installed, setInstalled] = useState<string[]>([]);
  const [confirmation, setConfirmation] = useState("");
  const [notice, setNotice] = useState("");
  const [workspace, setWorkspace] = useState("Studio");
  const form = useRef<HTMLFormElement>(null);
  const today = new Date().toLocaleDateString("en-CA");
  if (id === "analytics") return <div className="prototype analytics-prototype"><label htmlFor="period">Reporting period</label><select id="period" value={period} onChange={e => setPeriod(e.target.value)}><option value="month">This month</option><option value="week">This week</option><option value="empty">No-data period</option></select>{period === "empty" ? <div className="prototype-empty"><h4>No activity in this period</h4><p>There are no fictional transactions to display.</p><button className="button outline" onClick={() => setPeriod("month")}>Show this month</button></div> : <><div className="live-stats" aria-live="polite"><div><small>Net revenue · USD</small><strong>{period === "month" ? "$48,290" : "$12,140"}</strong></div><div><small>Successful payments</small><strong>{period === "month" ? "1,842" : "462"}</strong></div><div><small>Refunds · USD</small><strong>{period === "month" ? "$890" : "$210"}</strong></div></div><table><caption>Fictional revenue composition · {period === "month" ? "This month" : "This week"}</caption><thead><tr><th>Source</th><th>Gross USD</th></tr></thead><tbody><tr><td>Subscriptions</td><td>{period === "month" ? "$32,000" : "$8,000"}</td></tr><tr><td>One-time purchases</td><td>{period === "month" ? "$17,180" : "$4,350"}</td></tr><tr><td>Refunds</td><td>{period === "month" ? "−$890" : "−$210"}</td></tr></tbody></table><button className="button outline" onClick={() => setNotice("Data refresh unavailable in this offline concept. Existing fictional data is unchanged.")}>Simulate refresh error</button>{notice && <div className="inline-error" role="alert">{notice}<button onClick={() => setNotice("")}>Dismiss error</button></div>}</>}</div>;
  if (id === "plugins") {
    const plugins = [{ name: "Palette lab", category: "Color" }, { name: "Flow lines", category: "Workflow" }, { name: "Type scale", category: "Typography" }];
    return <div className="prototype"><label htmlFor="plugin-category">Plugin category</label><select id="plugin-category" value={pluginCategory} onChange={e => setPluginCategory(e.target.value)}>{["All", "Color", "Workflow", "Typography", "Animation"].map(c => <option key={c}>{c}</option>)}</select><div className="live-plugin-list">{plugins.filter(p => pluginCategory === "All" || p.category === pluginCategory).map(p => <div key={p.name}><span><b>{p.name}</b><small>{p.category} · Original fictional plugin</small></span><button className="button outline" onClick={() => { const has = installed.includes(p.name); setInstalled(has ? installed.filter(n => n !== p.name) : [...installed, p.name]); setNotice(`${p.name} ${has ? "removed" : "installed"} in this local demo only.`); }}>{installed.includes(p.name) ? "Remove" : "Install"} {p.name}</button></div>)}</div>{pluginCategory === "Animation" && <div className="prototype-empty"><h4>No animation plugins yet.</h4><button className="button outline" onClick={() => setPluginCategory("All")}>Show all plugins</button></div>}<p role="status">{notice}</p><button className="text-button" onClick={() => { setInstalled([]); setPluginCategory("All"); setNotice("Toolkit reset. No plugins installed."); }}>Reset toolkit</button></div>;
  }
  const calendar = id === "calendar";
  return <div className="prototype">{confirmation ? <div className="prototype-confirmation" role="status"><CircleCheck size={36}/><h4>{calendar ? "A little more headspace." : "Your next step is on the calendar."}</h4><p>{confirmation}</p><small>Local-only confirmation. No event or appointment was actually booked.</small><button className="button primary" onClick={() => { setConfirmation(""); setNotice(""); setWorkspace("Studio"); }}>Try another {calendar ? "event" : "appointment"}</button></div> : <form ref={form} onSubmit={e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (calendar && data.get("time") === "11:00") { setNotice("Time conflict: Design catch-up already occupies 11:00. Choose another time; your other details are preserved."); return; }
    setNotice("");
    setConfirmation(`${calendar ? data.get("title") : "Fictional follow-up"} · ${data.get("date")} at ${data.get("time")}${calendar ? ` · ${workspace} workspace` : " · Video visit"}.`);
  }}><div className="prototype-form-grid">{calendar && <label>Event title<input name="title" required minLength={3} maxLength={70} placeholder="Make space for a new idea"/></label>}{calendar && <label>Workspace<select aria-label="Workspace" value={workspace} onChange={e => setWorkspace(e.target.value)}><option>Studio</option><option>Personal</option></select></label>}<label>{calendar ? "Event date" : "Appointment date"}<input name="date" type="date" min={today} required/></label><label>Time<select aria-label="Time" name="time" required defaultValue=""><option value="" disabled>Choose a time</option><option value="10:00">10:00 AM</option><option value="11:00">11:00 AM{calendar ? " · Existing meeting" : ""}</option><option value="14:00">2:00 PM</option></select></label></div>{!calendar && <p className="fine-print">Fictional care team · Video visit · Not medical advice. Do not enter health information.</p>}{notice && <p className="inline-error" role="alert">{notice}</p>}<div className="form-buttons"><button className="button primary" type="submit">{calendar ? "Create local event" : "Confirm local appointment"} <Check size={16}/></button><button className="text-button" type="reset" onClick={() => { setNotice(""); setWorkspace("Studio"); }}>Reset</button></div></form>}</div>;
}

function ContactForm() {
  const [state, setState] = useState<"editing" | "review" | "sent">("editing");
  const [error, setError] = useState(false);
  const [simulate, setSimulate] = useState(false);
  const [summary, setSummary] = useState<Record<string, string>>({});
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstInput = useRef<HTMLInputElement>(null);
  function reset() { form.current?.reset(); setState("editing"); setError(false); setSimulate(false); setSummary({}); requestAnimationFrame(() => firstInput.current?.focus()); }
  function changeState(next: "editing" | "review" | "sent") { setState(next); requestAnimationFrame(() => next === "editing" ? firstInput.current?.focus() : heading.current?.focus()); }
  return <div className="contact-card"><div className="contact-card-heading"><span className="contact-card-icon"><Mail size={19}/></span><span>Let&apos;s Work Together<small>A small note. A good beginning.</small></span><span>↗</span></div><div className="local-note">LOCAL DEMO · No data is sent or saved. Use fictional details.</div>
    <form ref={form} hidden={state !== "editing"} onSubmit={e => { e.preventDefault(); const f = e.currentTarget; const data = new FormData(f); const name = String(data.get("name")).trim(); const message = String(data.get("message")).trim(); if (name.length < 2 || message.length < 20) { setError(true); return; } setSummary(Object.fromEntries([...data].map(([k,v]) => [k, String(v)]))); setError(false); changeState("review"); }}>
      <div className="contact-fields"><label>Your name<input ref={firstInput} name="name" autoComplete="off" placeholder="Alex Taylor" required minLength={2} maxLength={80}/></label><label>Email address<input name="email" type="email" autoComplete="off" placeholder="alex@example.com" required maxLength={120}/></label></div>
      <label>What do you have in mind?<select name="type" required defaultValue=""><option value="" disabled>Select a project type</option>{["Product Design", "UX Audit", "Design System", "Other"].map(v => <option key={v}>{v}</option>)}</select></label>
      <div className="contact-fields"><label>Planning budget (USD)<input name="budget" type="number" min={500} max={1000000} step={100} placeholder="5000" required/></label><label>Preferred start date<input name="date" type="date" min={new Date().toLocaleDateString("en-CA")} required/></label></div>
      <label>A little about your project<textarea name="message" rows={4} minLength={20} maxLength={2000} required placeholder="The challenge, the idea, the possibility…"/></label>
      <label className="checkbox-label"><input type="checkbox" required/> I understand this is fictional and nothing will be sent.</label>
      <details className="demo-options"><summary>Demo testing options</summary><label className="checkbox-label"><input type="checkbox" checked={simulate} onChange={e => setSimulate(e.target.checked)}/> Simulate a local send failure</label></details>
      {error && <p className="inline-error" role="alert">Please enter a name with at least 2 non-space characters and a message with at least 20 non-space characters.</p>}
      <div className="form-buttons"><button className="button primary" type="submit">Review Message <ArrowUpRight size={18}/></button><button className="text-button" type="button" onClick={reset}>Reset</button></div><p className="form-footnote">No inbox. No mailing list. Just an interactive concept.</p>
    </form>
    {state === "review" && <div className="review-state"><h3 ref={heading} tabIndex={-1}>A quick check before “send”.</h3><p>Review your fictional inquiry. Confirmation only changes this page; no information is transmitted.</p><dl>{[["Name", summary.name], ["Email", summary.email], ["Project", summary.type], ["Budget", `$${summary.budget} USD`], ["Start date", summary.date], ["Message", summary.message]].map(([k,v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>{error && <div role="alert" className="inline-error">Simulated delivery error. Your draft is intact. Retry without simulation or return to edit.</div>}<div className="form-buttons"><button className="button primary" onClick={() => { if (simulate) { setError(true); setSimulate(false); } else { setError(false); changeState("sent"); } }}>{error ? "Retry local confirmation" : "Confirm Local Message"} <ArrowRight size={16}/></button><button className="text-button" onClick={() => { setError(false); changeState("editing"); }}>Edit draft</button><button className="text-button" onClick={reset}>Discard & reset</button></div></div>}
    {state === "sent" && <div className="sent-state"><CircleCheck size={43}/><h3 ref={heading} tabIndex={-1}>A thoughtful beginning.</h3><p>Local inquiry confirmed for {summary.name}. No email was sent, no data was stored, and no real response will follow.</p><button className="button primary" onClick={reset}>Start a new inquiry <ArrowRight size={17}/></button></div>}
  </div>;
}
