"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check, Clock3, Eye, Globe2, Heart, House, Laptop, Menu, Paintbrush, Search, Sparkles, Sun, TrendingUp, Users, X } from "lucide-react";
import { people, jobs, scenes, type Department, type Person, type Job } from "./data";
import { Portrait, Scene } from "../components/art";

type Modal = { type: "person"; person: Person } | { type: "gallery"; index: number } | { type: "job"; job: Job } | { type: "form"; purpose: string } | { type: "work" } | { type: "social"; person: Person; platform: string };
const departments: ("All" | Department)[] = ["All", "Design", "Engineering", "Strategy", "Operations"];
const values = [
  { icon: Paintbrush, title: "Craft Over Speed", text: "We’d rather ship something excellent in 6 weeks than something mediocre in 2. Quality is non-negotiable." },
  { icon: Eye, title: "Radical Transparency", text: "Open salaries, shared P&L, and honest client conversations. No surprises, ever." },
  { icon: House, title: "Remote-First, Human-Always", text: "Work from anywhere. Come together quarterly for creative retreats, big ideas, and very good dinners." }
];
const benefits = [
  { icon: CalendarDays, title: "4-Day Work Week", text: "Fridays are yours. A little more life outside the screen." },
  { icon: BookOpen, title: "Learning Budget", text: "$2,500 a year for books, courses, and new rabbit holes." },
  { icon: TrendingUp, title: "Equity for All", text: "Shared ownership. Stock options after your first year." },
  { icon: Heart, title: "Health & Wellness", text: "Medical, dental, vision, plus a $500 wellness stipend." },
  { icon: Sun, title: "Creative Sabbatical", text: "Four paid weeks every three years. Go find your spark." },
  { icon: Laptop, title: "Gear Allowance", text: "A great laptop, a monitor, and $1,000 for your workspace." }
];
export default function Home() {
  const [department, setDepartment] = useState<"All" | Department>("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [modal, setModal] = useState<Modal | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const open = (next: Modal) => {
    if (!modal) opener.current = document.activeElement as HTMLElement;
    setSubmitted(false); setFailed(false); setModal(next);
  };
  const close = () => { dialog.current?.close(); setModal(null); requestAnimationFrame(() => opener.current?.focus()); };
  useEffect(() => {
    if (modal) {
      dialog.current?.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previous; };
    }
  }, [modal]);
  const filtered = people.filter(p => (department === "All" || p.department === department) && `${p.name} ${p.role} ${p.fact}`.toLowerCase().includes(query.trim().toLowerCase()));
  const visible = expanded || department !== "All" || query ? filtered : filtered.slice(4, 12);
  const modalTitle = !modal ? "" : modal.type === "person" ? modal.person.name : modal.type === "gallery" ? scenes[modal.index].title : modal.type === "job" ? modal.job.title : modal.type === "form" ? modal.purpose : modal.type === "work" ? "Small experiments. Big possibilities." : `${modal.person.name} on ${modal.platform}`;
  const resetDiscovery = () => { setQuery(""); setDepartment("All"); setExpanded(false); };
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <div className="demo-bar">AN IMAGINED STUDIO, A REAL LOVE OF CRAFT. <span>Fictional people, claims & roles · local demo only</span></div>
    <header className="header wrap">
      <a href="#" className="brand" aria-label="Mosaic Studio home"><span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>mosaic<span className="brand-sub">STUDIO</span></a>
      <button className="menu-toggle icon-button" aria-label={navOpen ? "Close navigation" : "Open navigation"} aria-expanded={navOpen} aria-controls="navigation" onClick={() => setNavOpen(!navOpen)}>{navOpen ? <X /> : <Menu />}</button>
      <nav id="navigation" className={navOpen ? "nav open" : "nav"} aria-label="Main navigation">
        <button onClick={() => { open({ type: "work" }); setNavOpen(false); }}>Our work</button>
        <a href="#crew" onClick={() => setNavOpen(false)} className="active">Our people</a>
        <a href="#culture" onClick={() => setNavOpen(false)}>Studio life</a>
        <a href="#careers" onClick={() => setNavOpen(false)}>Careers <span className="nav-count">4</span></a>
        <button className="button small dark" onClick={() => { open({ type: "form", purpose: "Start a project" }); setNavOpen(false); }}>Let’s talk <ArrowUpRight size={16} /></button>
      </nav>
    </header>
    <main id="main">
      <section className="hero">
        <div className="wrap">
          <div className="eyebrow"><span className="tiny-sun">✳</span> DIFFERENT MINDS. SHARED SPARK.</div>
          <h1 aria-label="The people behind the pixels.">The people behind<br />the <span className="pixels">pixels<span className="drawn-star" aria-hidden="true">✳</span></span><span className="orange">.</span></h1>
          <div className="hero-intro"><p>32 creatives, engineers, and strategists.<br />Building digital experiences that matter, together.</p><a href="#crew" className="text-link">Find your people <ArrowDown size={18} /></a></div>
          <div className="hero-art"><Scene kind="group" label="The imagined Mosaic crew together in the hills" /><span className="art-note">32 personalities. One very big table.</span><span className="stamp" aria-hidden="true">GOOD PEOPLE<br />GREAT THINGS<br />↗ MOSAIC STUDIO</span></div>
          <div className="hero-stats"><div><Globe2 /><strong>8</strong><span>countries, one studio</span></div><div><Users /><strong>32</strong><span>uniquely creative humans</span></div><div><Clock3 /><strong>6 yrs</strong><span>average time together</span></div></div>
          <p className="caption">An original illustrated team moment, not a photograph. All people, biographies, experience, culture, benefits, statistics, awards, reviews, jobs and availability on this page are fictional demo content. No real employer endorsement or hiring.</p>
        </div>
      </section>
      <section className="section wrap" id="leadership">
        <div className="section-heading"><div><div className="eyebrow">01 / GUIDING THE WAY</div><h2>A little vision.<br />A lot of heart.</h2></div><p>Meet our leadership. Still hands-on.<br />Still asking “what if?”<br /><span className="caption">Leadership · fictional profiles</span></p></div>
        <div className="leaders">{people.slice(0, 4).map(p => <article className="leader" key={p.name}><button className="portrait-circle" onClick={() => open({ type: "person", person: p })} aria-label={`Read ${p.name}’s biography`}><Portrait {...p} decorative /></button><h3>{p.name}</h3><span className="role">{p.role}</span><p>{p.fact}.</p><div className="socials">{p.social.map(s => <button key={s} onClick={() => open({ type: "social", person: p, platform: s })} aria-label={`${p.name} ${s} demo profile`}>{s} <ArrowUpRight size={12} /></button>)}</div></article>)}</div>
      </section>
      <section className="section wrap crew" id="crew">
        <div className="section-heading"><div><div className="eyebrow">02 / OUR KIND OF PEOPLE</div><h2>Meet the crew<span className="orange">.</span></h2></div><p>Many disciplines. Endless curiosity.<br />And a few wonderfully niche hobbies.</p></div>
        <div className="discovery"><div className="filters" role="group" aria-label="Filter by department">{departments.map(d => <button key={d} aria-pressed={department === d} onClick={() => { setDepartment(d); setExpanded(true); }}>{d} <span>{d === "All" ? 32 : people.filter(p => p.department === d).length}</span></button>)}</div><label className="search"><Search size={17} /><span className="sr-only">Search the team</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a name, role, or hobby" type="search" /></label></div>
        <p className="result-count" role="status">{visible.length} of {filtered.length} people{department !== "All" ? ` in ${department}` : ""}{query ? ` matching “${query}”` : ""}</p>
        {visible.length ? <div className="team-grid">{visible.map(p => <article className="person" key={p.name}><button className="person-image" onClick={() => open({ type: "person", person: p })} aria-label={`Meet ${p.name}`}><Portrait {...p} decorative /><span className="profile-link">A little more about me <ArrowUpRight size={17} /></span></button><div className="person-copy"><h3><button onClick={() => open({ type: "person", person: p })}>{p.name}</button></h3><p className="role">{p.role}</p><p className="fun-fact">“{p.fact}”</p></div></article>)}</div> : <div className="empty"><Search /><h3>No matching humans (yet).</h3><p>Try a different name, hobby, or department.</p><button className="button dark" onClick={resetDiscovery}>Reset team filters</button></div>}
        {!query && department === "All" && <button className="button expand" onClick={() => setExpanded(!expanded)}>{expanded ? "Show a smaller crew" : "View all 32 team members"} {expanded ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}</button>}
      </section>
      <section className="culture section" id="culture"><div className="wrap">
        <div className="section-heading"><div><div className="eyebrow">03 / NOT JUST A PLACE TO WORK</div><h2>Good work starts<br />with how we work.</h2></div><span className="handwritten">Leave your ego.<br />Bring your whole self. ↙</span></div>
        <div className="values">{values.map(({ icon: Icon, title, text }) => <article key={title}><span className="value-icon"><Icon /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="gallery">{scenes.map((scene, index) => <button key={scene.kind} onClick={() => open({ type: "gallery", index })} className={`scene scene-${index}`} style={{ backgroundColor: scene.color }} aria-label={`Explore ${scene.tag.toLowerCase()} gallery`}><Scene kind={scene.kind} label={scene.title} /><span className="scene-label">{scene.tag} <ArrowUpRight size={17} /></span></button>)}</div>
        <p className="caption">An illustrated window into an imagined culture. Original artwork replaces the brief’s candid photography.</p>
      </div></section>
      <section className="section wrap" id="benefits"><div className="section-heading"><div><div className="eyebrow">04 / ROOM TO DO YOUR BEST WORK</div><h2>Why people stay.</h2></div><p>Work is part of a good life.<br />It shouldn’t be the whole thing.</p></div><div className="benefits">{benefits.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={23} /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div><p className="caption">Illustrative benefits only. None are offered by an actual employer.</p></section>
      <section className="quote-section wrap"><span className="quote-mark" aria-hidden="true">“</span><blockquote>I’ve worked at agencies, startups, and big tech. Mosaic is the first place where I feel like my craft is genuinely valued and I have real ownership over the work.</blockquote><div className="quote-person"><div><Portrait {...people[4]} decorative /></div><p><strong>Sofia Reyes</strong><br />Senior Designer · 4 imagined years at Mosaic</p></div><p className="caption">Fictional team testimonial, not a real review or employment history.</p><span className="quote-flower" aria-hidden="true">✳</span></section>
      <section className="section wrap careers" id="careers"><div className="section-heading"><div><div className="eyebrow">05 / THERE’S ROOM AT THE TABLE</div><h2>Your next chapter?<br />Make it Mosaic.</h2></div><p>We’re always looking for people<br />who care deeply about craft.<br /><span className="caption">Join the Studio · 4 illustrative roles · no actual hiring</span></p></div>
        <div className="jobs">{jobs.map(job => <button key={job.title} className="job" onClick={() => open({ type: "job", job })}><span className="job-title">{job.title}{job.type === "Internship" && <small>ARCHIVAL DEMO</small>}</span><span className={`department dept-${job.department.toLowerCase()}`}>{job.department}</span><span className="job-location">{job.location}<small>{job.type}</small></span><ArrowUpRight size={22} /></button>)}</div>
        <div className="open-application"><div><h3>Don’t see your role?</h3><p>Tell us what lights you up. There’s always room for a new perspective.</p></div><button className="text-link" onClick={() => open({ type: "form", purpose: "Open application" })}>Send open application <ArrowUpRight size={18} /></button></div>
      </section>
      <section className="numbers section"><div className="wrap"><div className="eyebrow">LITTLE STUDIO. A LOT OF POSSIBILITY.</div><h2>Mosaic by the numbers.</h2><div className="stats-grid">{[["120+", "Projects delivered", "↗"], ["4.9/5", "Average client rating", "☆"], ["98%", "Client retention", "↻"], ["15", "Industry awards", "♧"], ["8", "Countries represented", "◎"], ["6 yrs", "Average team tenure", "◷"]].map(([n, label, icon]) => <div key={label}><span aria-hidden="true">{icon}</span><strong>{n}</strong><p>{label}</p></div>)}</div><p className="caption">Concept numbers only. No verified projects, clients, awards, reviews, or tenure are represented.</p></div></section>
      <section className="section wrap tools"><div className="section-heading"><div><div className="eyebrow">THE EVERYDAY TOOLKIT</div><h2>Different tools.<br />Same creative energy.</h2></div><p>What we work with.<br />Whatever helps the idea come alive.</p></div><div className="tool-grid">{[["Design", "Figma", "Adobe Creative Suite", "Framer", "Spline", "Rive"], ["Development", "Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js"], ["Collaboration", "Linear", "Notion", "Slack", "Loom", "GitHub"]].map(([category, ...tools]) => <div key={category}><h3>{category}</h3><div className="chips">{tools.map(t => <span key={t}>{t}</span>)}</div></div>)}</div><p className="caption">Tool names describe a fictional workflow; no affiliation or endorsement.</p></section>
      <footer><div className="wrap"><span className="footer-flower" aria-hidden="true">✳</span><div className="eyebrow">GOOD THINGS START WITH A CONVERSATION.</div><h2>Let’s build something<br /><em>together.</em></h2><div className="footer-buttons"><button className="button outline" onClick={() => open({ type: "work" })}>View our work <ArrowUpRight size={18} /></button><button className="button orange-button" onClick={() => open({ type: "form", purpose: "Start a project" })}>Start a project <ArrowUpRight size={18} /></button></div><div className="footer-bottom"><a className="footer-logo" href="#">mosaic<span> STUDIO</span></a><p>A fictional independent studio. An entirely local demo.<br />Nothing is sent, saved, or submitted to an employer.</p><a href="#main">Back to top ↑</a></div></div></footer>
    </main>
    <dialog ref={dialog} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }} onKeyDown={e => {
      if (e.key !== "Tab") return;
      const controls = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("button, input, textarea, a[href], [tabindex='0']")).filter(el => !el.hasAttribute("disabled") && el.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }} aria-labelledby="modal-title">
      {modal && <div className="modal-content"><button className="close icon-button" aria-label="Close dialog" onClick={close} autoFocus><X /></button><div className="eyebrow">MOSAIC / FICTIONAL DEMO</div><h2 id="modal-title">{modalTitle}</h2>
        {modal.type === "person" && <><div className="bio-portrait"><Portrait {...modal.person} /></div><p className="role">{modal.person.role} · {modal.person.department}</p><p>{modal.person.bio}</p><div className="bio-fact"><Sparkles size={20} />{modal.person.fact}</div><p className="caption">Invented person, biography and experience. No real professional or employer association.</p><div className="socials">{modal.person.social.map(s => <button key={s} onClick={() => open({ type: "social", person: modal.person, platform: s })}>{s} demo <ArrowUpRight size={13} /></button>)}</div></>}
        {modal.type === "social" && <><p>This is an invented profile. We don’t link to real accounts or imply that a real person endorses Mosaic.</p><button className="button dark" onClick={() => open({ type: "person", person: modal.person })}>Back to biography <ArrowLeft size={16} /></button></>}
        {modal.type === "gallery" && <><div className="modal-art"><Scene kind={scenes[modal.index].kind} label={scenes[modal.index].title} /></div><p>{["Time away from the screen, room for new perspectives. An imagined retreat in the hills.", "A sunny corner, a shared sketchbook, and the freedom to try something new.", "Different minds around one idea. An imagined collaborative workshop.", "Good food and stories that have nothing to do with work."][modal.index]}</p><p className="caption">Original illustration · fictional culture moment · {modal.index + 1} of 4</p><div className="gallery-controls"><button className="button" aria-label="Previous culture image" onClick={() => setModal({ type: "gallery", index: (modal.index + 3) % 4 })}><ArrowLeft size={17} /> Previous</button><button className="button dark" aria-label="Next culture image" onClick={() => setModal({ type: "gallery", index: (modal.index + 1) % 4 })}>Next <ArrowRight size={17} /></button></div></>}
        {modal.type === "job" && <><span className="department">{modal.job.department}</span><p>{modal.job.location} · {modal.job.type}</p><p>{modal.job.detail}</p><h3>A little about the imagined role</h3><ul><li>Collaborate openly across disciplines.</li><li>Care about accessible, thoughtful digital experiences.</li><li>Share your ideas, your questions, and your craft.</li></ul><p className="notice">Not an actual vacancy. Summer 2026 is an archival concept; all other roles are also fictional. No application is collected.</p><button className="button dark" onClick={() => open({ type: "form", purpose: `Explore: ${modal.job.title}` })}>Try the demo application <ArrowRight size={16} /></button></>}
        {modal.type === "work" && <><p>Three imagined studio explorations. These are concepts, not delivered client work.</p><div className="work-concepts">{[["01", "Common Ground", "A warmer way to discover community gardens.", "Brand + digital"], ["02", "Soft Signal", "A playful listening space for independent sound.", "Product + motion"], ["03", "Open Shelf", "A curious new chapter for a neighborhood library.", "Strategy + experience"]].map(([n, title, text, tag]) => <article key={n}><span>{n} / {tag}</span><h3>{title}</h3><p>{text}</p></article>)}</div><button className="button dark" onClick={() => open({ type: "form", purpose: "Start a project" })}>Imagine something with us <ArrowRight size={16} /></button></>}
        {modal.type === "form" && (submitted ? <div className="success" role="status"><Check size={38} /><h3>A little spark, received locally.</h3><p>Demo confirmation only. Nothing was sent or saved. No one will contact you, and no application was made.</p><button className="button dark" onClick={() => { setSubmitted(false); setFailed(false); }}>Start a fresh demo</button></div> : <><p className="notice">Use invented details only. Do not enter real contact information, employment history, identity or health data. No uploads, accounts, or network submission.</p><form ref={form} onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); if (data.get("simulate")) { setFailed(true); return; } e.currentTarget.reset(); setFailed(false); setSubmitted(true); }}>
          <label>Creative alias<input name="alias" required maxLength={60} placeholder="e.g. Studio Fox (invented)" autoComplete="off" /></label>
          <label>Fictional email<input name="email" type="email" required placeholder="fox@example.com" autoComplete="off" /><small>Use an invented example.com address; never a real inbox.</small></label>
          <label>Concept portfolio URL (optional)<input name="portfolio" type="url" placeholder="https://portfolio.example" autoComplete="off" /></label>
          {modal.purpose === "Start a project" && <label>Imagined kickoff date<input name="date" type="date" required min={new Date().toLocaleDateString("en-CA")} /></label>}
          <label>{modal.purpose === "Start a project" ? "What could we make together?" : "What lights you up?"}<textarea name="note" required minLength={10} maxLength={600} placeholder="A fictional idea, not personal history (10+ characters)" rows={3} /></label>
          <label className="check-label"><input type="checkbox" name="simulate" /> Simulate a local submission error</label>
          {failed && <div className="form-error" role="alert">Demo error: nothing was sent. Uncheck “Simulate a local submission error” and try again. Your invented inputs are still here.</div>}
          <div className="form-actions"><button className="button dark" type="submit">Confirm locally <ArrowRight size={16} /></button><button type="reset" className="text-link" onClick={() => setFailed(false)}>Reset fields</button></div>
        </form></>)}
      </div>}
    </dialog>
  </>;
}
