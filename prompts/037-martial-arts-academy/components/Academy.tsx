"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Clock3, Dumbbell, Handshake, MapPin, Menu, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { Audience, belts, classes, ClassType, coaches, dates, Discipline, facilities, formatTime, memberships, Plan, programs, recurringLabel, resources } from "./data";

type Modal = { kind: "coach"; index: number } | { kind: "class"; id: string } | { kind: "resource"; title: string } | { kind: "facility"; index: number } | { kind: "plan"; plan: Plan };
type Receipt = { alias: string; audience: Audience; date: string; classId: string };
const nav = [["Programs","programs"],["Schedule","schedule"],["Instructors","coaches"],["Pricing","pricing"],["About","about"],["Blog","journal"]];

function trapDialogFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(element => !element.matches(":disabled") && element.getClientRects().length > 0);
  const first = controls[0], last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}

function Brand() {
  return <span className="brand"><span className="brand-mark" aria-hidden="true">╳</span><span>IRON<span className="red">PATH</span><small>MARTIAL ARTS ACADEMY</small></span></span>;
}
function Heading({ number, eyebrow, title, light = false }: { number: string; eyebrow: string; title: string; light?: boolean }) {
  return <div className={`section-heading ${light ? "light" : ""}`}><p className="eyebrow"><span>{number}</span> / {eyebrow}</p><h2>{title}</h2></div>;
}
function Scene({ kind, label }: { kind: string; label: string }) {
  if (kind === "mat" || kind === "bag" || kind === "cage") return <div className={`scene scene-${kind}`}><img src={kind === "bag" ? "/spaces.svg" : "/academy.svg"} alt={`${label} — original schematic vector illustration, not a photograph`} /><span className="art-label">ILLUSTRATED SPACE / {kind.toUpperCase()}</span></div>;
  return <div className={`scene scene-${kind}`}><svg viewBox="0 0 960 620" role="img" aria-label={`${label} — original schematic illustration`}>
    <defs><linearGradient id={`shade-${kind}`} x2="1" y2="1"><stop stopColor="#465360" /><stop offset="1" stopColor="#111827" /></linearGradient></defs>
    <path d="M0 0H960V620H0z" fill={`url(#shade-${kind})`} /><path d="M0 445H960V620H0z" fill="#646c72" />
    <path d="M95 95H680" stroke="#e7d7b8" strokeWidth="8" /><path d="M0 580H960" stroke="#b42b2e" strokeWidth="30" />
    {kind === "strength" ? <g stroke="#aab3bc" strokeWidth="10" fill="#1c2633"><path d="M245 210V482M555 210V482M245 210H555M185 300H615" /><circle cx="220" cy="300" r="55" /><circle cx="580" cy="300" r="55" /><path d="M690 440H795V512H690z" /><path d="M680 436H805" stroke="#dc2626" /><circle cx="110" cy="450" r="27" /><path d="M92 432C73 385 146 385 129 432" /></g> : kind === "lounge" ? <g><path d="M160 328H650V495H160z" fill="#8f7561" /><path d="M146 401H665V451H146z" fill="#b1987e" /><path d="M250 328V401M430 328V401" stroke="#5d5148" strokeWidth="6" /><path d="M753 235H837V496H753z" fill="#b5c0c8" /><path d="M773 280H817V370H773z" fill="#354c61" /><path d="M708 235H739V469H708z" fill="#334c42" /></g> : <g><path d="M150 175H810V505H150z" fill="#263342" stroke="#82909b" strokeWidth="8" /><path d="M155 287H810M155 390H810M370 175V505M590 175V505" stroke="#82909b" strokeWidth="6" /><path d="M209 208H309L330 260H190zM431 208H531L554 260H410z" fill="#d3d6d3" /><path d="M211 320H305V370H211zM650 425H741V472H650z" fill="#c13839" /><path d="M638 213H743V261H638zM426 427H521V475H426z" fill="#a39a88" /></g>}
    <text x="60" y="550" fill="#f3f4f6" fontSize="19" fontFamily="Arial, sans-serif" letterSpacing="4">IRON PATH / IMAGINED {kind.toUpperCase()}</text>
  </svg><span className="art-label">ORIGINAL VECTOR STUDY</span></div>;
}
function Portrait({ index }: { index: number }) {
  const c = coaches[index];
  return <div className="portrait" style={{ "--portrait-color": c.color } as React.CSSProperties}><svg viewBox="0 0 320 340" aria-label={`Abstract fictional portrait for ${c.name}`} role="img"><path d="M0 0H320V340H0z" fill="var(--portrait-color)" /><path d="M12 0L260 340M80 0L320 290" stroke="#fff" opacity=".09" strokeWidth="40" /><ellipse cx="160" cy="335" rx="113" ry="127" fill={index === 0 || index === 3 ? "#dbdedb" : "#253343"} /><path d="M139 192H181V228L160 245L139 225z" fill={index === 1 ? "#a97960" : "#bb9276"} /><ellipse cx="160" cy="135" rx="50" ry="65" fill={index === 1 ? "#a97960" : "#bb9276"} /><path d="M109 131C101 60 210 52 211 127L194 97L146 101L120 130z" fill="#232a30" /><path d="M126 236L160 296L195 236" stroke="#868f92" strokeWidth="6" fill="none" /><path d="M64 315H254" stroke="#b8272c" strokeWidth="15" /></svg><span className="portrait-stamp">{c.initials} / FICTIONAL PERSONA</span></div>;
}

export default function Academy() {
  const [program, setProgram] = useState<Discipline>("BJJ");
  const [modal, setModal] = useState<Modal | null>(null);
  const [drawer, setDrawer] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const drawerReturn = useRef<HTMLElement | null>(null);
  const [scheduleProgram, setScheduleProgram] = useState("All disciplines");
  const [scheduleDay, setScheduleDay] = useState("All days");
  const [scheduleAudience, setScheduleAudience] = useState("All ages");
  const [search, setSearch] = useState("");
  const [belt, setBelt] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [trialProgram, setTrialProgram] = useState("Not sure");
  const [audience, setAudience] = useState<Audience>("Adults");
  const [date, setDate] = useState(dates[0].value);
  const [slot, setSlot] = useState("");
  const [alias, setAlias] = useState("");
  const [trialError, setTrialError] = useState("");
  const [simulateError, setSimulateError] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [held, setHeld] = useState<Record<string, number>>({});
  const [planDiscipline, setPlanDiscipline] = useState<Discipline>("BJJ");
  const [familySize, setFamilySize] = useState(2);
  const [coupon, setCoupon] = useState("");
  const [planError, setPlanError] = useState("");
  const [planDone, setPlanDone] = useState(false);

  const modalOpen = modal !== null;
  useEffect(() => {
    if (modalOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = "";
      returnFocus.current?.focus({ preventScroll: true });
    }
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);
  useEffect(() => {
    if (drawer) {
      drawerRef.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      drawerRef.current?.close();
      document.body.style.overflow = "";
      drawerReturn.current?.focus({ preventScroll: true });
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawer]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => { setReducedMotion(media.matches); if (media.matches) setAutoplay(false); };
    stop(); media.addEventListener("change", stop);
    if (!autoplay || media.matches) return () => media.removeEventListener("change", stop);
    const interval = window.setInterval(() => {
      if (!document.hidden && galleryRef.current && galleryRef.current.getBoundingClientRect().top < window.innerHeight && galleryRef.current.getBoundingClientRect().bottom > 0) {
        setGalleryIndex(i => (i + 1) % facilities.length);
      }
    }, 5000);
    return () => { clearInterval(interval); media.removeEventListener("change", stop); };
  }, [autoplay]);
  useEffect(() => {
    const element = galleryRef.current?.children[galleryIndex] as HTMLElement | undefined;
    if (element && galleryRef.current) galleryRef.current.scrollTo({ left: element.offsetLeft - galleryRef.current.offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [galleryIndex]);
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const sync = () => {
      const positions = Array.from(gallery.children).map(child => Math.abs((child as HTMLElement).offsetLeft - gallery.offsetLeft - gallery.scrollLeft));
      setGalleryIndex(positions.indexOf(Math.min(...positions)));
    };
    gallery.addEventListener("scrollend", sync);
    return () => gallery.removeEventListener("scrollend", sync);
  }, []);
  useEffect(() => {
    if (planDone) dialogRef.current?.querySelector<HTMLElement>(".plan-confirmation")?.focus();
  }, [planDone]);

  function openModal(m: Modal) {
    returnFocus.current = document.activeElement as HTMLElement;
    setPlanDone(false); setPlanError(""); setCoupon(""); setFamilySize(2); setPlanDiscipline(program);
    setModal(m);
  }
  function resource(title: string) { openModal({ kind: "resource", title }); }
  function resetFilters() { setScheduleProgram("All disciplines"); setScheduleDay("All days"); setScheduleAudience("All ages"); setSearch(""); }
  function resetPlan() {
    setPlanDone(false); setCoupon(""); setFamilySize(2); setPlanDiscipline(program); setPlanError("");
    window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>(".plan-form select, .plan-form input")?.focus(), 0);
  }
  function trialFor(c?: ClassType) {
    if (c) {
      const nextDate = dates.find(d => c.days.includes(d.day))!;
      setTrialProgram(c.discipline); setAudience(c.audience); setDate(nextDate.value); setSlot(c.id);
    }
    setTrialError("");
    setModal(null);
    window.setTimeout(() => { document.getElementById("trial")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); document.getElementById("trial-alias")?.focus({ preventScroll: true }); }, 50);
  }
  function resetTrial() {
    if (receipt) {
      const key = `${receipt.date}:${receipt.classId}`;
      setHeld(previous => ({ ...previous, [key]: Math.max(0, (previous[key] ?? 0) - 1) }));
    }
    setReceipt(null); setAlias(""); setSlot(""); setTrialProgram("Not sure"); setAudience("Adults"); setDate(dates[0].value); setTrialError(""); setSimulateError(false);
    window.setTimeout(() => document.getElementById("trial-alias")?.focus(), 0);
  }
  const remaining = (c: ClassType, d: string) => Math.max(0, c.capacity - (held[`${d}:${c.id}`] ?? 0));
  const day = dates.find(d => d.value === date);
  const slots = classes.filter(c => c.trial && c.audience === audience && (trialProgram === "Not sure" || c.discipline === trialProgram) && day && c.days.includes(day.day)).sort((a,b) => a.time.localeCompare(b.time));
  function submitTrial(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const chosen = slots.find(c => c.id === slot);
    if (!/^[a-zA-Z][a-zA-Z -]{1,29}$/.test(alias.trim()) || alias.includes("@")) { setTrialError("Use a fictional alias, 2–30 letters, spaces or hyphens. Do not enter personal contact details."); return; }
    if (!day) { setTrialError("Choose a date from the illustrated week: November 2–8, 2026."); return; }
    if (!chosen || remaining(chosen, date) < 1) { setSlot(""); setTrialError("Choose an available introductory session. This sample slot cannot be selected."); return; }
    if (simulateError) { setTrialError("Simulated service unavailable. Nothing was reserved. Turn off the error simulation and try again."); return; }
    setHeld(previous => ({ ...previous, [`${date}:${chosen.id}`]: (previous[`${date}:${chosen.id}`] ?? 0) + 1 }));
    setReceipt({ alias: alias.trim(), audience, date, classId: chosen.id }); setTrialError("");
    window.setTimeout(() => document.getElementById("trial-confirmation")?.focus({ preventScroll: true }), 0);
  }
  const visibleClasses = classes.filter(c => (scheduleProgram === "All disciplines" || c.discipline === scheduleProgram) && (scheduleDay === "All days" || c.days.includes(Number(scheduleDay))) && (scheduleAudience === "All ages" || c.audience === scheduleAudience) && `${c.name} ${c.discipline} ${c.level}`.toLowerCase().includes(search.toLowerCase().trim()));
  const activeProgram = programs.find(p => p.id === program)!;
  const selectedPlan = modal?.kind === "plan" ? memberships.find(p => p.name === modal.plan) : undefined;
  const monthly = selectedPlan ? selectedPlan.price + (selectedPlan.name === "Family Plan" ? (familySize - 2) * 59 : 0) : 0;
  const discounted = coupon.trim().toUpperCase() === "IRONPATH50";
  const money = (amount: number) => amount.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  const modalClass = modal?.kind === "class" ? classes.find(c => c.id === modal.id) : undefined;
  const modalTitle = modal?.kind === "coach" ? `Coach ${coaches[modal.index].name}` : modal?.kind === "resource" ? modal.title : modal?.kind === "facility" ? facilities[modal.index].title : modal?.kind === "plan" ? `${modal.plan} · membership preview` : modalClass?.name ?? "";

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="demo-banner"><span className="demo-dot" /> FICTIONAL ACADEMY / LOCAL DEMO <span className="banner-detail">Illustrative people, prices & sessions. No real booking or payment.</span></div>
    <header className="header"><div className="nav-inner"><a href="#home" aria-label="Iron Path home"><Brand /></a><nav aria-label="Main navigation" className="desktop-nav">{nav.map(([label,id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav><div className="nav-cta"><span className="phone">(704) 555-0318<small>placeholder only</small></span><a className="button red-button small" href="#trial">Try a Free Class <ArrowUpRight size={16} /></a></div><button className="menu-button icon-button" aria-label="Open navigation" aria-expanded={drawer} onClick={() => { drawerReturn.current = document.activeElement as HTMLElement; setDrawer(true); }}><Menu /></button></div></header>
    <main id="main">
      <section className="hero" id="home">
        <img className="hero-art" src="/academy.svg" alt="Cinematic original vector study of an imagined mat room, standing academy personas, and equipment. Not a training photograph." />
        <div className="hero-shade" /><div className="container hero-content">
          <p className="hero-badge"><span /> CHARLOTTE, NC / A FICTIONAL ACADEMY</p>
          <h1>FORGE YOUR<br />STRENGTH.<br /><span>FIND YOUR PATH.</span></h1>
          <p className="hero-sub">Brazilian Jiu-Jitsu · Muay Thai · MMA</p><p className="hero-copy">A focused academy. A welcoming first step.<br />Programs for adults and youth ages 5–12.</p>
          <div className="hero-actions"><a className="button red-button" href="#trial">Book Free Trial Class <ArrowUpRight size={19} /></a><a className="button outline-button" href="#programs">View Programs <ArrowRight size={19} /></a></div>
          <div className="hero-values"><span><ShieldCheck size={17} /> Beginner pathways</span><span><Users size={17} /> Youth & adults</span><span><Handshake size={17} /> Community first</span></div>
        </div>
        <div className="hero-caption">01 / THE MAT ROOM <span>Original illustration · not photography</span></div>
        <div className="hero-side" aria-hidden="true">DISCIPLINE IS A DIRECTION. NOT A DESTINATION.</div>
      </section>
      <div className="intro-strip"><div className="container"><span>THREE DISCIPLINES.<br /><strong>ONE SHARED PATH.</strong></span><p>Start curious. Stay consistent. Find a community that makes room for your first day.</p><a href="#schedule">Find your first class <ArrowRight size={20} /></a></div></div>

      <section id="programs" className="section container">
        <div className="heading-row"><Heading number="01" eyebrow="THE PROGRAMS" title="CHOOSE YOUR DISCIPLINE" /><p className="section-intro">Different paths. The same commitment to a thoughtful, welcoming academy experience.</p></div>
        <div className="program-tabs" role="tablist" aria-label="Disciplines">{programs.map((p,i) => <button key={p.id} id={`tab-${p.id}`} role="tab" aria-selected={program === p.id} aria-controls="program-panel" tabIndex={program === p.id ? 0 : -1} onClick={() => setProgram(p.id)} onKeyDown={e => { if (["ArrowRight","ArrowLeft","Home","End"].includes(e.key)) { e.preventDefault(); const next = e.key === "Home" ? 0 : e.key === "End" ? 2 : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3; setProgram(programs[next].id); document.getElementById(`tab-${programs[next].id}`)?.focus(); } }}><span>0{i+1}</span>{p.name}<ArrowUpRight size={19} /></button>)}</div>
        <label className="mobile-program">Choose a discipline<select aria-label="Choose a discipline" value={program} onChange={e => setProgram(e.target.value as Discipline)}>{programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <div className="program-panel" id="program-panel" role="tabpanel" aria-label={activeProgram.name}>
          <div className="program-visual"><Scene kind={activeProgram.art} label={activeProgram.name} /><div className="visual-number" aria-hidden="true">{program === "BJJ" ? "01" : program === "Muay Thai" ? "02" : "03"}</div><div className="visual-caption"><span>{activeProgram.name.toUpperCase()}</span><small>A path for your first day.</small></div></div>
          <div className="program-info"><p className="eyebrow red">{activeProgram.subtitle}</p><h3>{activeProgram.name}</h3><p>{activeProgram.description}</p><div className="class-grid">{classes.filter(c => c.discipline === program).map(c => <button className="class-card" key={c.id} onClick={() => openModal({ kind: "class", id: c.id })}><span className="class-title">{c.name}<ArrowUpRight size={16} /></span><small>{recurringLabel(c)}</small><span className="class-meta">{c.audience} / {c.level}</span></button>)}</div><p className="program-note"><Sparkles size={17} />{activeProgram.note}</p></div>
        </div>
      </section>

      <section id="about" className="section pale"><div className="container"><Heading number="02" eyebrow="THE IRON PATH APPROACH" title="BUILT DIFFERENT" /><div className="values-grid">{[
        { icon: ShieldCheck, title: "Coaching with intention", text: "Clear program pathways and a thoughtful introduction. Meet our fictional coaching personas below." },
        { icon: Handshake, title: "Leave your ego outside", text: "A welcoming culture is the story we are designing: curious beginners alongside experienced learners." },
        { icon: Dumbbell, title: "Room to find your rhythm", text: "Explore an imagined mat room, dedicated equipment zones, and space to connect between classes." },
        { icon: Users, title: "Progress is personal", text: "Consistency, community, and individual learning. No rankings, competitive results, or outcomes are promised." },
      ].map(v => <article className="value-card" key={v.title}><v.icon size={28} /><h3>{v.title}</h3><p>{v.text}</p></article>)}</div></div></section>

      <section id="schedule" className="section container">
        <div className="heading-row"><Heading number="03" eyebrow="MAKE ROOM FOR YOURSELF" title="YOUR WEEK ON THE MATS" /><p className="section-intro">Sample week / November 2–8, 2026<br />All times: America/New_York (EST)<br /><strong>Fictional capacity, not live availability.</strong></p></div>
        <div className="schedule-filters"><label>Discipline<select aria-label="Discipline" value={scheduleProgram} onChange={e => setScheduleProgram(e.target.value)}><option>All disciplines</option>{programs.map(p => <option key={p.id}>{p.id}</option>)}</select></label><label>Day<select aria-label="Day" value={scheduleDay} onChange={e => setScheduleDay(e.target.value)}><option>All days</option>{dates.map(d => <option key={d.value} value={d.day}>{d.label}</option>)}</select></label><label>Age group<select aria-label="Age group" value={scheduleAudience} onChange={e => setScheduleAudience(e.target.value)}><option>All ages</option><option>Adults</option><option>Youth 5–12</option></select></label><label>Find a class<input type="search" placeholder="Name or level" value={search} onChange={e => setSearch(e.target.value)} /></label><button className="text-button" onClick={resetFilters}>Reset filters</button></div>
        <p className="results-count" role="status">{visibleClasses.length} class groups found · Select a group for details</p>
        <div className="schedule-list">{visibleClasses.map(c => <article className="schedule-row" key={c.id}><span className={`discipline-tag tag-${c.discipline === "BJJ" ? "bjj" : c.discipline === "MMA" ? "mma" : "mt"}`}>{c.discipline}</span><div><h3>{c.name}</h3><p>{c.audience} · {c.level}</p></div><p className="schedule-time"><Clock3 size={16} />{recurringLabel(c)}</p><span className={c.capacity === 0 ? "slot-full" : "slot-status"}>{c.capacity === 0 ? "Sample full" : !c.trial ? "Coach approval" : `${c.capacity} sample trial spaces / session`}</span><button className="text-button" aria-label={`View ${c.name} details`} onClick={() => openModal({ kind: "class", id: c.id })}>Details <ArrowUpRight size={17} /></button></article>)}</div>
        {visibleClasses.length === 0 && <div className="empty"><h3>No class groups match.</h3><p>Try another day, discipline, age group, or search term.</p><button className="button dark-button" onClick={resetFilters}>Show all classes</button></div>}
      </section>

      <section className="section belt-section"><div className="container"><div className="heading-row"><Heading number="04" eyebrow="THE BJJ LEARNING PATH" title="YOUR JOURNEY ON THE MATS" light /><p className="section-intro">A color is a chapter. Not a deadline.<br />Illustrative pathway only; no ranks or timelines awarded.</p></div><div className="belt-track">{belts.map((b,i) => <button key={b.name} className={`belt-step ${belt === i ? "active" : ""}`} aria-pressed={belt === i} onClick={() => setBelt(i)}><span className="belt-bar" style={{ backgroundColor: b.color }} /><small>0{i+1}</small><strong>{b.name} Belt</strong><span>{i === belt ? "Currently exploring" : "Explore this chapter"}</span></button>)}</div><div className="belt-detail" role="status"><strong>{belts[belt].name.toUpperCase()} /</strong><p>{belts[belt].text}</p></div><p className="belt-foot">Your journey is your own. Progression would be discussed individually with a real instructor.</p></div></section>

      <section id="coaches" className="section container"><div className="heading-row"><Heading number="05" eyebrow="PEOPLE BEHIND THE PATH" title="MEET YOUR CORNER" /><p className="section-intro">Four fictional coaching personas.<br />No real ranks, credentials, affiliations, or competitive records.</p></div><div className="coach-grid">{coaches.map((c,i) => <article className="coach-card" key={c.name}><Portrait index={i} /><div className="coach-info"><p className="eyebrow red">{c.discipline}</p><h3>{c.name}</h3><p>{c.role}</p><button className="text-button" onClick={() => openModal({ kind: "coach", index: i })}>View bio <ArrowUpRight size={18} /><span className="sr-only"> for {c.name}</span></button></div></article>)}</div></section>

      <section id="pricing" className="section pale"><div className="container"><div className="heading-row"><Heading number="06" eyebrow="KEEP SHOWING UP" title="INVEST IN YOURSELF" /><p className="section-intro">Illustrative USD membership pricing.<br />Month-to-month concept. No contracts or purchases.</p></div><div className="pricing-grid">{memberships.map((p,i) => <article className={`price-card ${i === 1 ? "featured" : ""}`} key={p.name}><div className="plan-badge">{p.badge}</div><h3>{p.name}</h3><p className="price">${p.price}<span>/ month</span></p><p className="plan-description">{i === 0 ? "Go deep in the discipline you love." : i === 1 ? "Make the whole academy your path." : "A shared routine. Individual journeys."}</p><ul>{p.features.map(f => <li key={f}><Check size={17} />{f}</li>)}</ul><button className={`button ${i === 1 ? "red-button" : "dark-button"}`} onClick={() => openModal({ kind: "plan", plan: p.name })}>Start Training <ArrowRight size={18} /><span className="sr-only"> with {p.name}</span></button><small>Preview a local membership · no payment</small></article>)}</div><div className="offer-strip"><span><Sparkles size={23} /><strong>YOUR FIRST CHAPTER, HALF PRICE.</strong></span><p>Simulate 50% off the first month with <strong>IRONPATH50</strong>. Regular monthly pricing resumes after that.</p></div></div></section>

      <section className="section container" id="community"><div className="heading-row"><Heading number="07" eyebrow="COMMUNITY, NOT CLAIMS" title="VOICES FROM THE MATS" /><p className="section-intro">Scripted welcome vignettes, not testimonials.<br />No real members, reviews, ratings, or health outcomes.</p></div><div className="community-grid">{[
        ["THE FIRST-DAY PERSPECTIVE","“I want a place where being new is something to welcome, not something to hide.”","Fictional beginner voice"],
        ["THE GUARDIAN PERSPECTIVE","“A clear routine and a kind introduction matter more to us than a trophy.”","Fictional guardian voice"],
        ["THE RETURNING PERSPECTIVE","“Different disciplines. Familiar faces. A place to keep learning.”","Fictional returning voice"],
      ].map(([title,quote,context],i) => <article key={title} className="community-card"><span className="quote-mark" aria-hidden="true">“</span><p className="eyebrow">{title}</p><blockquote>{quote}</blockquote><p className="vignette-person"><span aria-hidden="true">0{i+1}</span>{context}</p></article>)}</div><div className="community-event"><div><p className="eyebrow red">ILLUSTRATIVE / NOV 8 · NOON–1 PM EST</p><h3>Meet the space. Meet the story.</h3><p>An imagined Sunday open house, after open mat.</p></div><button className="button outline-dark" onClick={() => resource("Community Open House")}>Explore community event <ArrowUpRight size={18} /></button></div></section>

      <section id="facility" className="section facility-section"><div className="container"><div className="heading-row"><Heading number="08" eyebrow="A SPACE TO BELONG" title="THE ACADEMY" light /><div className="gallery-controls"><button className="icon-button" aria-label="Previous facility" onClick={() => { setAutoplay(false); setGalleryIndex(i => (i + 5) % 6); }}><ChevronLeft /></button><span aria-live="polite">{galleryIndex + 1} / 6</span><button className="icon-button" aria-label="Next facility" onClick={() => { setAutoplay(false); setGalleryIndex(i => (i + 1) % 6); }}><ChevronRight /></button></div></div><p className="gallery-disclosure">Six original illustrated space studies. Simulated photography; not a real facility tour.</p><div className="gallery" ref={galleryRef} tabIndex={0} aria-label="Facility gallery, swipe or use arrow controls" onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); setAutoplay(false); setGalleryIndex(i => (i + (e.key === "ArrowRight" ? 1 : 5)) % 6); } }}>{facilities.map((f,i) => <button key={f.title} className="gallery-card" onClick={() => { setAutoplay(false); openModal({ kind: "facility", index: i }); }} aria-label={`Explore ${f.title}`}><Scene kind={f.art} label={f.title} /><span className="gallery-caption"><small>0{i+1} / SPACE STUDY</small><strong>{f.title}<ArrowUpRight size={22} /></strong></span></button>)}</div><div className="gallery-footer"><p>Swipe to explore. Select an illustration for its caption.</p><button className="text-button" aria-pressed={autoplay} disabled={reducedMotion} onClick={() => setAutoplay(a => !a)}>{autoplay ? "Pause auto-tour" : "Start auto-tour"}{reducedMotion && <span> (reduced motion)</span>}</button></div></div></section>

      <section id="journal" className="section container"><div className="heading-row"><Heading number="09" eyebrow="THE ACADEMY JOURNAL" title="NOTES FROM THE PATH" /><button className="text-button" onClick={() => resource("Academy Notes")}>Read academy notes <ArrowUpRight size={18} /></button></div><div className="journal-grid"><button onClick={() => resource("Beginner's Guide")}><span>01 / GETTING STARTED</span><h3>Your first day doesn’t have to feel like a test.</h3><p>A beginner’s welcome guide</p><ArrowUpRight /></button><button onClick={() => resource("What to Expect")}><span>02 / ACADEMY LIFE</span><h3>What to bring. What to expect. Room to ask.</h3><p>The illustrative first-visit checklist</p><ArrowUpRight /></button><button onClick={() => resource("Belt Requirements")}><span>03 / THE LONG VIEW</span><h3>Progress isn’t measured by a calendar.</h3><p>A learning pathway, not a promise</p><ArrowUpRight /></button></div></section>

      <section id="trial" className="trial-section"><div className="container trial-layout"><div className="trial-copy"><p className="eyebrow">10 / TAKE THE FIRST STEP</p><h2>YOUR FIRST<br />CLASS IS FREE.<br /><span>NO STRINGS.</span></h2><p>Show up curious. See where the path leads.<br />Explore a trial without commitment or pressure.</p><ul><li><Check size={19} />Illustrative loaner gear; bring clothes & water</li><li><Check size={19} />Adult groups and a youth 5–12 program</li><li><Check size={19} />No payment, account, email, or real reservation</li></ul><p className="trial-safety">This form is a local simulation. Use a made-up alias only. For youth, use a fictional guardian alias; never a child’s identity. Dates and capacity are fixed demo data.</p></div><div className="trial-form-card">
        {receipt ? <div className="confirmation" id="trial-confirmation" tabIndex={-1} role="status"><span className="confirmation-icon"><Check size={32} /></span><p className="eyebrow red">LOCAL SIMULATION COMPLETE</p><h3>Your first step is on the board.</h3><p>No class was booked. No message was sent.</p><dl><dt>Fictional {receipt.audience === "Adults" ? "visitor" : "guardian"}</dt><dd>{receipt.alias}</dd><dt>Session</dt><dd>{classes.find(c => c.id === receipt.classId)?.name} · {classes.find(c => c.id === receipt.classId)?.discipline}</dd><dt>Sample date & time</dt><dd>{dates.find(d => d.value === receipt.date)?.label}, 2026 · {formatTime(classes.find(c => c.id === receipt.classId)!.time)} EST</dd><dt>Group</dt><dd>{receipt.audience}</dd><dt>Trial cost</dt><dd>$0.00 · nothing charged</dd></dl><button className="button dark-button" onClick={resetTrial}>Reset local trial <ArrowRight size={18} /></button><small>Reset releases the sample capacity. Reload clears all local state.</small></div> :
        <form onSubmit={submitTrial} className="trial-form"><p className="eyebrow red">YOUR INTRODUCTION / SIMULATED</p><h3>Find your first class.</h3><p className="form-intro">Sample week: Nov 2–8, 2026 · EST<br />Fields stay in memory on this page.</p><label htmlFor="trial-alias">{audience === "Adults" ? "Fictional visitor alias" : "Fictional guardian alias"}<input id="trial-alias" autoComplete="off" value={alias} onChange={e => { setAlias(e.target.value); setTrialError(""); }} placeholder="e.g. River" minLength={2} maxLength={30} required aria-describedby="alias-hint" /></label><small id="alias-hint">Letters, spaces or hyphens only. No real personal details.</small><div className="form-grid"><label>Program interest<select value={trialProgram} onChange={e => { setTrialProgram(e.target.value); setSlot(""); setTrialError(""); }}><option>Not sure</option>{programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Age group<select value={audience} onChange={e => { setAudience(e.target.value as Audience); setSlot(""); setTrialError(""); }}><option>Adults</option><option>Youth 5–12</option></select></label></div><label>Preferred sample date<input type="date" min="2026-11-02" max="2026-11-08" value={date} onChange={e => { setDate(e.target.value); setSlot(""); setTrialError(""); }} required /></label><fieldset className="session-fieldset"><legend>Choose a sample session <span>(EST)</span></legend>{slots.length > 0 ? slots.map(c => <label key={c.id} className={`session-choice ${remaining(c,date) === 0 ? "unavailable" : ""}`}><input type="radio" name="session" value={c.id} checked={slot === c.id} onChange={() => { setSlot(c.id); setTrialError(""); }} disabled={remaining(c,date) === 0} /><span><strong>{c.name}</strong><small>{formatTime(c.time)} · {c.discipline}</small></span><span className="capacity">{remaining(c,date) === 0 ? "Sample full" : `${remaining(c,date)} sample spaces`}</span></label>) : <div className="inline-empty"><p>No introductory sessions for these choices.</p><button type="button" className="text-button" onClick={() => { setTrialProgram("Not sure"); setDate(dates[0].value); setSlot(""); setTrialError(""); }}>Show Monday options</button></div>}</fieldset><label className="checkbox-label"><input type="checkbox" checked={simulateError} onChange={e => { setSimulateError(e.target.checked); setTrialError(""); }} />Simulate a service error (demo recovery test)</label>{trialError && <p className="form-error" role="alert">{trialError}</p>}<button className="button red-button submit-button" type="submit">Book My Free Class <ArrowRight size={18} /></button><p className="form-fine">SIMULATE ONLY · No backend, contact collection, or actual booking.</p></form>}
      </div></div></section>
    </main>
    <footer><div className="container"><div className="footer-top"><div><a href="#home" aria-label="Iron Path home"><Brand /></a><p>Discipline. Community. Your path.</p><span className="footer-fiction">FICTIONAL ACADEMY / CHARLOTTE CONCEPT</span></div><button className="location-card" onClick={() => resource("Contact & Location")}><span className="schematic-map" aria-hidden="true"><i /><MapPin size={25} /></span><span>Charlotte, NC <ArrowUpRight size={17} /><small>Schematic location · not navigation</small></span></button></div><div className="footer-columns"><div><h3>Programs</h3>{programs.map(p => <a href="#programs" key={p.id} onClick={() => setProgram(p.id)}>{p.name}</a>)}<a href="#schedule" onClick={() => { resetFilters(); setScheduleAudience("Youth 5–12"); }}>Kids Program</a><a href="#schedule" onClick={() => { resetFilters(); setSearch("Cardio"); }}>Cardio Kickboxing</a><button onClick={() => resource("Private Lessons")}>Private Lessons</button></div><div><h3>Academy</h3>{[["About Us","about"],["Coaches","coaches"],["Facility","facility"],["Schedule","schedule"],["Blog","journal"]].map(([label,id]) => <a key={id} href={`#${id}`}>{label}</a>)}<button onClick={() => resource("Competition Team")}>Competition Team</button></div><div><h3>Resources</h3>{["Beginner's Guide","What to Expect","FAQ","Gear Guide","Belt Requirements"].map(title => <button key={title} onClick={() => resource(title)}>{title}</button>)}</div><div><h3>Contact concept</h3><p>1840 South Blvd<br />Charlotte, NC 28203</p><p>(704) 555-0318<br />info@ironpathacademy.com</p><small>Placeholder details. No calls or email.</small><button onClick={() => resource("Contact & Location")}>Illustrative hours & location <ArrowUpRight size={14} /></button><button onClick={() => resource("Social Channels")}>Social channel concepts <ArrowUpRight size={14} /></button></div></div><div className="footer-bottom"><p>© 2026 Iron Path Academy · Fictional design demo.</p><p>Original SVG artwork. System fonts. No real affiliations or reviews.</p><a href="#home">Back to top ↑</a></div></div></footer>
    <a className="mobile-trial button red-button" href="#trial">Your first step is free <span>Try a class <ArrowUpRight size={17} /></span></a>

    <dialog ref={drawerRef} className="nav-drawer" aria-label="Mobile navigation" onKeyDown={trapDialogFocus} onCancel={() => setDrawer(false)} onClick={e => { if (e.target === e.currentTarget) setDrawer(false); }}><div className="drawer-inner"><div className="drawer-header"><Brand /><button className="icon-button" aria-label="Close navigation" onClick={() => setDrawer(false)}><X /></button></div><p className="eyebrow">FIND YOUR PATH</p><nav aria-label="Mobile navigation links">{nav.map(([label,id],i) => <a key={id} href={`#${id}`} onClick={() => setDrawer(false)}><span>0{i+1}</span>{label}<ArrowUpRight /></a>)}</nav><a href="#trial" className="button red-button" onClick={() => setDrawer(false)}>Try a Free Class <ArrowRight size={18} /></a><p className="drawer-fine">Fictional Charlotte academy.<br />Nothing booked. No personal data collected.</p></div></dialog>
    <dialog ref={dialogRef} className="detail-dialog" aria-labelledby="modal-title" onKeyDown={trapDialogFocus} onCancel={() => setModal(null)} onClick={e => { if (e.target === e.currentTarget) setModal(null); }}><div className="modal-content"><div className="modal-top"><p className="eyebrow red">IRON PATH / FICTIONAL DEMO</p><button className="icon-button" aria-label="Close details" onClick={() => setModal(null)}><X /></button></div><h2 id="modal-title">{modalTitle}</h2>
      {modal?.kind === "coach" && <><p className="modal-sub">{coaches[modal.index].role}</p><Portrait index={modal.index} /><p>{coaches[modal.index].bio}</p><p>{coaches[modal.index].detail}</p><p className="modal-note">Fictional persona and abstract illustration. No credentials, rank, or affiliation claims.</p><button className="button dark-button" onClick={() => { setModal(null); setScheduleProgram(modal.index === 3 ? "BJJ" : coaches[modal.index].discipline); setScheduleAudience(modal.index === 3 ? "Youth 5–12" : "All ages"); setSearch(""); setScheduleDay("All days"); window.setTimeout(() => document.getElementById("schedule")?.scrollIntoView(), 50); }}>Explore this coach’s groups <ArrowRight size={17} /></button></>}
      {modalClass && <><p className="modal-sub">{modalClass.discipline} · {modalClass.audience} · {modalClass.level}</p><p>{modalClass.description}</p><dl><dt>Recurring sample times</dt><dd>{recurringLabel(modalClass)} · EST</dd><dt>Illustrative week</dt><dd>November 2–8, 2026 · America/New_York</dd><dt>Trial suitability</dt><dd>{modalClass.trial ? "Introductory visitors welcome in this demo" : "Coach approval required; not a trial group"}</dd><dt>Sample capacity</dt><dd>{modalClass.capacity} trial spaces per session before local selections</dd></dl><p className="modal-note">No real availability. This is an academy-discovery preview, not combat instruction.</p>{modalClass.trial && modalClass.capacity > 0 ? <button className="button red-button" onClick={() => trialFor(modalClass)}>Choose this trial group <ArrowRight size={18} /></button> : <><p>{modalClass.capacity === 0 ? "This sample group is full. Choose another introductory group." : "Explore a beginner group instead; experienced groups are not bookable here."}</p><button className="button dark-button" onClick={() => { setTrialProgram(modalClass.discipline); setAudience("Adults"); setDate(dates[0].value); setSlot(""); trialFor(); }}>Find an introductory class <ArrowRight size={17} /></button></>}</>}
      {modal?.kind === "resource" && <>{resources[modal.title]?.map(line => <p key={line}>{line}</p>)}<p className="modal-note">Local information panel only. No external services or messages.</p><button className="button dark-button" onClick={() => trialFor()}>Explore a free trial <ArrowRight size={17} /></button></>}
      {modal?.kind === "facility" && <><Scene kind={facilities[modal.index].art} label={facilities[modal.index].title} /><p>{facilities[modal.index].caption}</p><p className="modal-note">Original schematic artwork. No real photography, video, equipment availability, measurements, or facility certification.</p><div className="modal-gallery-controls"><button className="button outline-dark" onClick={() => setModal({ kind: "facility", index: (modal.index + 5) % 6 })}><ChevronLeft size={17} />Previous space</button><button className="button dark-button" onClick={() => setModal({ kind: "facility", index: (modal.index + 1) % 6 })}>Next space<ChevronRight size={17} /></button></div></>}
      {selectedPlan && <>{planDone ? <div className="plan-confirmation" role="status" tabIndex={-1}><Check size={34} /><h3>Membership preview saved locally.</h3><p>No enrollment, contract, or payment was created.</p><dl><dt>Plan</dt><dd>{selectedPlan.name}{selectedPlan.name === "Single Discipline" ? ` · ${planDiscipline}` : selectedPlan.name === "Family Plan" ? ` · ${familySize} members` : " · All disciplines"}</dd><dt>First month</dt><dd>{money(discounted ? monthly / 2 : monthly)}</dd><dt>Following months</dt><dd>{money(monthly)} / month</dd><dt>Due now</dt><dd>$0.00 · preview only</dd></dl><button className="button dark-button" onClick={resetPlan}>Reset membership preview</button></div> : <form className="plan-form" onSubmit={e => { e.preventDefault(); if (coupon.trim() && !discounted) { setPlanError("Unknown demo code. Use IRONPATH50 or clear the field to continue at regular pricing."); return; } setPlanError(""); setPlanDone(true); }}><p>Compare a local membership selection. No names, card details, or account information are needed.</p>{selectedPlan.name === "Single Discipline" && <label>Chosen discipline<select value={planDiscipline} onChange={e => setPlanDiscipline(e.target.value as Discipline)}>{programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}{selectedPlan.name === "Family Plan" && <label>Number of fictional family members<select value={familySize} onChange={e => setFamilySize(Number(e.target.value))}>{[2,3,4,5,6].map(n => <option value={n} key={n}>{n} members</option>)}</select></label>}<label>Demo offer code<input autoComplete="off" value={coupon} onChange={e => { setCoupon(e.target.value); setPlanError(""); }} placeholder="IRONPATH50" maxLength={24} /></label><p className="form-fine">50% applies to the total first month, including family additions. USD.</p><div className="price-summary" aria-live="polite"><p>First month<strong>{money(discounted ? monthly / 2 : monthly)}</strong></p><p>Following months<strong>{money(monthly)} / month</strong></p><small>No amount charged. Month-to-month is an illustrative concept.</small></div>{planError && <p className="form-error" role="alert">{planError}</p>}<button className="button red-button" type="submit">Confirm local membership preview <ArrowRight size={17} /></button></form>}</>}
    </div></dialog>
  </>;
}
