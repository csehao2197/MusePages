"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Globe2, Users, Puzzle, CreditCard, Mountain, Menu, X, MapPin, CalendarDays, Star, Link2, Vote, MessageCircle, Bell, ShieldCheck, Leaf, Coffee, Building2, Compass, Plus, Minus, CheckCircle2, Send, Mail, Heart, Sparkles } from "lucide-react";
import Modal from "./modal";
import { categories, destinations, earliestDeparture, estimate, faqs, money, trips, type Category, type Destination, type Tier, type Trip } from "./data";

type QuoteSeed = { destination: string; size: number; days: number; tier: Tier; trip?: Trip; corporate?: boolean };
type Overlay = { type: "quote"; seed: QuoteSeed } | { type: "trip"; trip: Trip } | { type: "planner" } | { type: "info"; title: string; text: string } | null;
const defaultSeed: QuoteSeed = { destination: "Bali", size: 12, days: 7, tier: "Mid-Range" };
const memberNames = ["Alex", "Maya", "Sam", "Noor", "Leo", "Jess", "Kai", "Rae"];

function Brand() {
  return <span className="brand"><span className="brand-mark"><Mountain size={27} strokeWidth={2.3} /><Users size={14} /></span>Trek<span>Tribe</span><span className="brand-dot">.</span></span>;
}

function QuoteForm({ seed, compact = false }: { seed: QuoteSeed; compact?: boolean }) {
  const [destination, setDestination] = useState(seed.destination);
  const [size, setSize] = useState(String(seed.size));
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (sent) successRef.current?.focus(); }, [sent]);
  const minimum = seed.corporate ? 10 : seed.trip?.min ?? 6;
  const maximum = seed.trip?.max ?? 50;
  function submit(event: FormEvent) {
    event.preventDefault();
    const issues: Record<string, string> = {};
    if (!destination.trim()) issues.destination = "Tell us your dream destination.";
    if (!Number.isInteger(Number(size)) || Number(size) < minimum || Number(size) > maximum) issues.size = `Choose ${minimum}–${maximum} travelers${seed.trip ? ` for ${seed.trip.name}` : ""}.`;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < earliestDeparture()) issues.date = "Choose a departure date from tomorrow onward.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) issues.email = "Enter a valid example email, such as you@example.com.";
    setErrors(issues);
    if (Object.keys(issues).length) {
      formRef.current?.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${Object.keys(issues)[0]}"]`)?.focus();
      return;
    }
    setSent(true);
  }
  if (sent) {
    const knownDestination = destinations.find((d) => d.toLowerCase() === destination.trim().toLowerCase());
    const price = seed.trip ? seed.trip.price : knownDestination ? estimate(knownDestination, Number(size), seed.days, seed.tier).perPerson : null;
    const departure = new Date(`${date}T12:00:00`);
    const end = new Date(departure); end.setDate(end.getDate() + seed.days - 1);
    return <div className="quote-success" role="status"><CheckCircle2 size={42} /><h3 ref={successRef} tabIndex={-1}>Your demo trip brief is ready!</h3><p>{destination} · {size} travelers · {seed.days} days</p><p>{departure.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} – {end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
      {price ? <div className="summary-price">{money(price)} <small>/ person · {money(price * Number(size))} group estimate</small></div> : <p>A custom destination needs a tailored estimate; no automatic price is available.</p>}
      <p>This inquiry exists only on this page. No email was sent, availability checked, or booking created. Prices exclude flights, insurance, and extras.</p>
      <button className="button light" onClick={() => { setSent(false); setEmail(""); requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input[name="destination"]')?.focus()); }}>Edit demo inquiry</button>
    </div>;
  }
  return <form ref={formRef} className={`quote-form ${compact ? "compact" : ""}`} onSubmit={submit} noValidate>
    {!compact && <p className="muted">A little inspiration, a few details. Build a fictional quote—not a reservation. Please use an example email, not personal information.</p>}
    <div className="form-grid">
      <label>Dream destination<input name="destination" value={destination} onChange={(e) => setDestination(e.target.value)} list={`${formId}-destinations`} placeholder="Where shall we go?" maxLength={80} aria-invalid={!!errors.destination} aria-describedby={errors.destination ? `${formId}-destination-error` : undefined} /><datalist id={`${formId}-destinations`}>{destinations.map((d) => <option key={d} value={d} />)}</datalist>{errors.destination && <span className="field-error" id={`${formId}-destination-error`}>{errors.destination}</span>}</label>
      <label>Group size<select name="size" value={size} onChange={(e) => setSize(e.target.value)} aria-invalid={!!errors.size} aria-describedby={errors.size ? `${formId}-size-error` : undefined}>{Array.from({ length: maximum - minimum + 1 }, (_, i) => minimum + i).map((n) => <option key={n} value={n}>{n} travelers</option>)}</select>{errors.size && <span className="field-error" id={`${formId}-size-error`}>{errors.size}</span>}</label>
      <label>Departure date<input name="date" type="date" min={earliestDeparture()} value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? `${formId}-date-error` : undefined} />{errors.date && <span className="field-error" id={`${formId}-date-error`}>{errors.date}</span>}</label>
      <label>Example email<input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" maxLength={120} autoComplete="off" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${formId}-email-error` : undefined} />{errors.email && <span className="field-error" id={`${formId}-email-error`}>{errors.email}</span>}</label>
    </div>
    <button type="submit" className={`button ${compact ? "navy" : "primary"}`}>Get Free Demo Quote <ArrowRight size={18} /></button>
    <p className="form-note">No commitment. No account. No real email or booking.</p>
  </form>;
}

function Planner({ expanded = false, votes, setVotes }: { expanded?: boolean; votes: boolean[]; setVotes: (votes: boolean[]) => void }) {
  const [tab, setTab] = useState("Itinerary");
  const [day, setDay] = useState(1);
  const [copied, setCopied] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [reminded, setReminded] = useState(false);
  const [draft, setDraft] = useState("");
  const [chatError, setChatError] = useState("");
  const [messages, setMessages] = useState(["Maya · Sunrise hike, anyone?", "Alex · Count me in! Let's vote on it."]);
  const chatInput = useRef<HTMLInputElement>(null);
  const chatId = useId();
  const options = ["Sunrise at Mount Batur", "Balinese cooking class", "Nusa Penida boat day"];
  const days = ["Ubud arrival & welcome dinner", "Rice terraces & a local food walk", "Choose your adventure"];
  async function copyLink() {
    try { await navigator.clipboard.writeText(`${window.location.origin}/#planning`); setCopied("Demo page link copied. It does not share your changes."); }
    catch { setCopied(`Copy this demo page link manually: ${window.location.origin}/#planning. Changes are not shared.`); }
  }
  return <div className={`planner ${expanded ? "expanded" : ""}`}>
    <div className="browser-bar"><i /><i /><i /><span>trektribe.demo / our-bali-adventure</span><ShieldCheck size={14} /></div>
    <div className="planner-content">
      <div className="planner-title"><div><span className="eyebrow">OUR NEXT CHAPTER</span><h3>The Bali crew <span>🌴</span></h3><p>7 days · 12 friends · fictional shared space</p></div><div className="avatar-stack">{["A", "M", "S", "N"].map((n, i) => <span key={n} style={{ background: ["#e9b393", "#a9c3ba", "#d4c0df", "#edcf8c"][i] }}>{n}</span>)}<span>+8</span></div></div>
      <div className="planner-tabs" role="group" aria-label="Planning views">{["Itinerary", "Group chat", "Members"].map((t) => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>)}</div>
      {tab === "Itinerary" && <>
        <div className="day-picker">{[1, 2, 3].map((n) => <button key={n} aria-pressed={day === n} onClick={() => setDay(n)}>Day {n}</button>)}</div>
        <div className="itinerary-event"><span className="event-icon"><CalendarDays size={18} /></span><div><small>{day === 1 ? "16:00" : day === 2 ? "09:00" : "YOU DECIDE"}</small><strong>{days[day - 1]}</strong><span>{day === 1 ? "Settle in, meet your guide & share a table" : day === 2 ? "A gentle start to our adventure together" : "The most-loved activities shape our plan"}</span></div><CheckCircle2 size={17} /></div>
        <div className="vote-heading"><strong>What should we do together?</strong><span><Vote size={14} /> Group vote</span></div>
        {options.map((option, i) => <button key={option} className="vote-row" aria-pressed={votes[i]} onClick={() => setVotes(votes.map((v, index) => index === i ? !v : v))}><span className="vote-check">{votes[i] ? <Check size={14} /> : <Plus size={14} />}</span><span>{option}<span className="vote-track"><span style={{ width: `${([6, 4, 8][i] + Number(votes[i])) / 12 * 100}%` }} /></span></span><strong>{[6, 4, 8][i] + Number(votes[i])}<small>/12</small></strong></button>)}
        <p className="tiny" role="status">{votes.some(Boolean) ? `Your local votes: ${options.filter((_, i) => votes[i]).join(", ")}.` : "Tap an activity to add your vote. Tap again to remove it."}</p>
      </>}
      {tab === "Group chat" && <div className="chat-view"><p className="tiny">Local pretend chat. Avoid personal information.</p><div className="messages" aria-live="polite">{messages.map((message, i) => <p key={i}>{message}</p>)}</div><form onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) { setChatError("Write a sample message first."); chatInput.current?.focus(); return; } setMessages([...messages, `You · ${draft.trim()}`]); setDraft(""); setChatError(""); chatInput.current?.focus(); }}><label className="sr-only" htmlFor={`${chatId}-input`}>Sample message</label><input ref={chatInput} id={`${chatId}-input`} placeholder="Add a sample message…" value={draft} maxLength={200} onChange={(e) => setDraft(e.target.value)} aria-invalid={!!chatError} aria-describedby={chatError ? `${chatId}-error` : undefined} /><button className="icon-button" aria-label="Send sample message"><Send size={19} /></button></form>{chatError && <p id={`${chatId}-error`} className="field-error" role="alert">{chatError}</p>}</div>}
      {tab === "Members" && <div className="members-view"><div className="confirmation"><Users size={20} /><strong>{confirmed ? 10 : 9} confirmed</strong><span>{confirmed ? 2 : 3} pending</span></div>{["Alex · organizer", "Maya · confirmed", `Taylor · ${confirmed ? "confirmed" : "pending"}`].map((person) => <p key={person}><span className="avatar">{person[0]}</span>{person}</p>)}<button className="button light small" onClick={() => setConfirmed(!confirmed)}>{confirmed ? "Reset Taylor to pending" : "Simulate Taylor confirming"}</button></div>}
      <div className="planner-footer"><span><span className="status-dot" /> Local demo · not synced</span><button onClick={copyLink}><Link2 size={15} /> Share demo</button></div>
      {copied && <p className="tiny" role="status">{copied}</p>}
      {expanded && <div className="reminders"><Bell size={19} /><div><strong>Stay a step ahead</strong><p>Passports · packing · payments</p></div><button className="button light small" onClick={() => setReminded(true)}>Preview reminders</button>{reminded && <p role="status">Demo reminder: check passport validity, pack a refillable bottle, and review your payment schedule. No notification was sent.</p>}</div>}
    </div>
  </div>;
}

function Payments() {
  const [member, setMember] = useState(0);
  const [plan, setPlan] = useState("installments");
  const [paid, setPaid] = useState<number[]>(Array(8).fill(0) as number[]);
  const [departure, setDeparture] = useState("90");
  const [message, setMessage] = useState("Choose a sample traveler to try a payment plan.");
  const amount = plan === "full" ? 1500 - paid[member] : Math.min(500, 1500 - paid[member]);
  const totalPaid = paid.reduce((sum, n) => sum + n, 0);
  const scheduleDays = [0, Math.floor(Number(departure) / 3), Math.floor(Number(departure) * 2 / 3)];
  return <div className="payment-preview">
    <div className="payment-top"><span className="eyebrow">SPLIT, NOT COMPLICATED</span><span className="demo-pill">Simulation only</span></div>
    <div className="split-total"><strong>$12,000</strong><span>÷ 8 friends = <b>$1,500 each</b></span></div>
    <div className="payment-avatars">{memberNames.map((name, i) => <button key={name} aria-label={`Select ${name}, ${money(paid[i])} simulated paid`} aria-pressed={member === i} onClick={() => { setMember(i); setMessage(`${name}'s sample payment plan selected.`); }}><span className={`avatar tone-${i % 4}`}>{name[0]}{paid[i] === 1500 && <Check size={12} />}</span><strong>{name}</strong><small>{paid[i] === 1500 ? "Paid" : paid[i] > 0 ? "Partial" : "Pending"}</small></button>)}</div>
    <div className="payment-controls">
      <label>Payment plan<select value={plan} onChange={(e) => setPlan(e.target.value)}><option value="installments">3 installments · $500 each</option><option value="full">Pay in full · $1,500</option></select></label>
      <label>Departure in<select value={departure} onChange={(e) => setDeparture(e.target.value)}><option value="90">90 days</option><option value="30">30 days</option><option value="20">20 days</option></select></label>
    </div>
    <div className="schedule" aria-label={`${memberNames[member]}'s payment schedule`}>
      {(plan === "full" ? ["Today"] : scheduleDays.map((day) => day === 0 ? "Today" : `In ${day} days`)).map((label, i) => <div key={label}><span>{label}</span><strong>{plan === "full" ? "$1,500" : "$500"}</strong><small>{paid[member] >= (plan === "full" ? 1500 : (i + 1) * 500) ? "Simulated paid" : "Scheduled"}</small></div>)}
    </div>
    <div className="payment-action"><button className="button primary small" disabled={amount === 0} onClick={() => { setPaid(paid.map((n, i) => i === member ? n + amount : n)); setMessage(`${memberNames[member]}: ${money(amount)} simulated payment recorded. No money moved.`); }}>{amount ? `Simulate ${money(amount)} payment` : "Fully simulated paid"} <CreditCard size={15} /></button><button className="text-button" onClick={() => { if (paid[member] === 0) { setMessage("No simulated payment to refund for this traveler."); return; } if (Number(departure) < 30) { setMessage("Full refund unavailable within 30 days. In a real service, contact a coordinator. No cancellation made."); return; } setMessage(`${memberNames[member]}: ${money(paid[member])} simulated refund recorded. No money moved.`); setPaid(paid.map((n, i) => i === member ? 0 : n)); }}>Preview cancellation</button></div>
    <p className="payment-message" role="status">{message}</p>
    <div className="payment-progress"><div><span style={{ width: `${totalPaid / 12000 * 100}%` }} /></div><span>{money(totalPaid)} of $12,000 simulated paid · {paid.filter((n) => n === 1500).length}/8 settled</span></div>
  </div>;
}

function Testimonials() {
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const stories = [
    { quote: "We took 14 friends to Costa Rica and TrekTribe handled everything. The group voting feature was a game-changer.", name: "Marcus & friends", detail: "14 travelers · Costa Rica", type: "THE FRIEND TRIP", initial: "M" },
    { quote: "Our company retreat in Portugal was the best team event we've ever done. Worth every penny.", name: "Sarah K.", detail: "VP People · 28 travelers · Portugal", type: "THE TEAM RETREAT", initial: "S" },
    { quote: "Planning a bachelorette for 12 girls used to be a nightmare. This made it fun.", name: "Jess T.", detail: "12 travelers · Bali", type: "THE CELEBRATION", initial: "J" },
    { quote: "Three generations, one unforgettable Japan adventure. Everyone found their favorite moment.", name: "The Rivera family", detail: "10 travelers · Japan", type: "THE FAMILY ESCAPE", initial: "R" },
  ];
  function advance(delta: number) { setIndex((index + delta + stories.length) % stories.length); }
  return <section className="section testimonials" aria-labelledby="stories-heading"><div className="container"><div className="section-heading"><div><span className="eyebrow">GOOD TRIPS. GREAT PEOPLE.</span><h2 id="stories-heading">The best souvenir? <span>The stories.</span></h2><p>Illustrative stories and ratings—not real customer endorsements.</p></div><div className="carousel-controls"><button className="icon-button" aria-label="Previous stories" onClick={() => advance(-1)}><ChevronLeft /></button><button className="icon-button" aria-label="Next stories" onClick={() => advance(1)}><ChevronRight /></button></div></div>
      <div className="story-grid" role="group" aria-label="Traveler stories" aria-roledescription="carousel" tabIndex={0} onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); advance(e.key === "ArrowRight" ? 1 : -1); } }} onTouchStart={(e) => { startX.current = e.touches[0].clientX; }} onTouchEnd={(e) => { const delta = e.changedTouches[0].clientX - startX.current; if (Math.abs(delta) > 50) advance(delta < 0 ? 1 : -1); }}>
        {[0, 1, 2].map((offset) => { const story = stories[(index + offset) % stories.length]; return <article className={`story story-${offset}`} key={offset}><div className="stars" aria-label="Fictional five-star rating">★★★★★</div><span className="quote-mark">“</span><blockquote>{story.quote}</blockquote><div className="story-person"><span className="avatar">{story.initial}</span><div><strong>{story.name}</strong><span>{story.detail}</span></div></div><span className="story-type">{story.type}</span></article>; })}
      </div><p className="tiny carousel-position" aria-live="polite">Story {index + 1} of {stories.length} · swipe or use arrow keys</p>
    </div></section>;
}

export default function TrekTribe() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState(12);
  const [destination, setDestination] = useState<Destination>("Bali");
  const [length, setLength] = useState("7");
  const [customDays, setCustomDays] = useState("12");
  const [tier, setTier] = useState<Tier>("Mid-Range");
  const [filter, setFilter] = useState<Category>("All");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [votes, setVotes] = useState([false, false, false]);
  const days = length === "custom" ? Number(customDays) : Number(length);
  const daysValid = Number.isInteger(days) && days >= 3 && days <= 30;
  const price = daysValid ? estimate(destination, size, days, tier) : null;
  const seed = { destination, size, days: daysValid ? days : 7, tier };
  const filtered = trips.filter((trip) => filter === "All" || trip.categories.includes(filter));
  const openQuote = (quoteSeed: QuoteSeed = seed) => { setMenuOpen(false); setOverlay({ type: "quote", seed: quoteSeed }); };
  function info(title: string, text: string) { setOverlay({ type: "info", title, text }); }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="demo-banner"><Sparkles size={13} /><span>Fictional travel demo · no real bookings, payments, or live collaboration</span></div>
    <header className="site-header"><div className="nav-inner"><a href="#" aria-label="TrekTribe home"><Brand /></a><nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
      <a href="#packages" onClick={() => setMenuOpen(false)}>Destinations</a><a className="active" aria-current="page" href="#packages" onClick={() => setMenuOpen(false)}>Group Trips</a><a href="#corporate" onClick={() => setMenuOpen(false)}>Corporate Retreats</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>About</a><button onClick={() => { setMenuOpen(false); info("Field notes: a better group trip", "Start with everyone's budget, then agree on one must-do activity each. Keep a little unplanned time, choose a group-size-friendly route, and confirm cancellation terms before paying. This is a sample travel journal, not professional travel advice."); }}>Blog</button>
    </nav><button className="button primary nav-cta" onClick={() => openQuote()}>Start a Group Trip <ArrowUpRight size={16} /></button><button className="menu-toggle icon-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div></header>
    <main id="main">
      <section className="hero">
        <img className="hero-art" src="/art/hero.svg" alt="Original illustration of six friends hiking above a layered mountain vista" fetchPriority="high" />
        <div className="hero-overlay" /><div className="hero-topline container"><span><Compass size={15} /> LESS PLANNING. MORE LIVING.</span><span>BE HERE. TOGETHER.</span></div>
        <div className="container hero-content"><div className="hero-label"><span /> FIND YOUR PEOPLE. FIND YOUR ADVENTURE.</div><h1>Adventure is<br />better <em>together.</em></h1><p>Plan group trips for 6–50 people with shared itineraries,<br className="desktop-break" /> split payments, and zero hassle. Just bring your tribe.</p><div className="hero-buttons"><a className="button primary" href="#packages">Browse Group Packages <ArrowRight size={18} /></a><button className="button ghost" onClick={() => openQuote()}>Build Custom Trip <ArrowUpRight size={18} /></button></div>
          <div className="hero-proof"><div className="avatar-stack"><span>A</span><span>M</span><span>J</span><span>S</span></div><div><span className="stars">★★★★★</span><p><b>12,400+</b> groups served <i /> <b>4.9★</b> average <i /> <b>98%</b> would book again</p><small>Illustrative demo statistics</small></div></div>
        </div><div className="hero-bottom container"><span><MapPin size={14} /> Somewhere unforgettable, with everyone you love.</span><a href="#how-it-works">THE JOURNEY STARTS HERE <span>↓</span></a></div>
      </section>
      <section id="how-it-works" className="section how-section"><div className="container"><div className="center-heading"><span className="eyebrow">YOUR GROUP TRIP, SIMPLIFIED</span><h2>Four steps. <span>A thousand memories.</span></h2><p>From “we should go somewhere” to “remember that time…”</p></div><div className="steps">{[
        { Icon: Globe2, title: "Choose a Destination", text: "Pick from 80+ curated group destinations" },
        { Icon: Users, title: "Set Your Group Size", text: "6 to 50 travelers. We handle the logistics." },
        { Icon: Puzzle, title: "Customize Together", text: "Share a planning link. Everyone votes on activities." },
        { Icon: CreditCard, title: "Book & Split", text: "Each member pays their share directly." },
      ].map(({ Icon, title, text }, i) => <article className="step" key={title}><div className="step-icon"><Icon size={27} /><span>0{i + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div><p className="tiny centered">A preview of the fictional service. This demo includes eight destinations and six packages.</p></div></section>
      <section id="calculator" className="section warm calculator-section"><div className="container calculator-layout"><div className="calculator-intro"><span className="eyebrow">BIG ADVENTURES. SMALLER PRICE TAGS.</span><h2>More friends.<br /><span>More savings.</span></h2><p>Estimate your group trip cost before the group chat gets carried away.</p><div className="benefit"><CheckCircle2 size={19} /><span>Transparent per-person pricing</span></div><div className="benefit"><CheckCircle2 size={19} /><span>Group discounts built right in</span></div><div className="benefit"><CheckCircle2 size={19} /><span>No commitment, just possibilities</span></div><div className="scribble">Good things come in groups <ArrowUpRight size={30} /></div></div>
        <div className="calculator-card"><div className="calculator-title"><h3>Estimate Your Group Trip Cost</h3><span className="demo-pill">USD · demo estimate</span></div><div className="size-heading"><label htmlFor="group-size">How many in your tribe?</label><div className="stepper"><button aria-label="Decrease group size" disabled={size === 6} onClick={() => setSize(size - 1)}><Minus size={16} /></button><output htmlFor="group-size" data-testid="group-size">{size}<small> people</small></output><button aria-label="Increase group size" disabled={size === 50} onClick={() => setSize(size + 1)}><Plus size={16} /></button></div></div>
          <input className="size-slider" id="group-size" type="range" min={6} max={50} value={size} style={{ "--range-percent": `${(size - 6) / 44 * 100}%` } as React.CSSProperties} onChange={(e) => setSize(Number(e.target.value))} /><div className="range-labels"><span>6 people</span><span>50 people</span></div>
          <div className="calculator-fields"><label>Destination<select value={destination} onChange={(e) => setDestination(e.target.value as Destination)}>{destinations.map((d) => <option key={d}>{d}</option>)}</select></label><label>Trip length<select value={length} onChange={(e) => setLength(e.target.value)}><option value="5">5 days</option><option value="7">7 days</option><option value="10">10 days</option><option value="custom">Custom</option></select></label>
            {length === "custom" && <label>Custom days (3–30)<input type="number" min={3} max={30} value={customDays} onChange={(e) => setCustomDays(e.target.value)} aria-invalid={!daysValid} aria-describedby={!daysValid ? "days-error" : undefined} />{!daysValid && <span className="field-error" id="days-error">Enter a whole number from 3 to 30 days.</span>}</label>}
          </div><fieldset className="tier-picker"><legend>Accommodation style</legend>{(["Budget", "Mid-Range", "Premium"] as Tier[]).map((t) => <label key={t} className={tier === t ? "selected" : ""}><input type="radio" name="tier" value={t} checked={tier === t} onChange={() => setTier(t)} />{t}{tier === t && <Check size={14} />}</label>)}</fieldset>
          <div className="estimate-output" aria-live="polite" aria-atomic="true">{price ? <><div><span>Per person</span><strong data-testid="per-person">{money(price.perPerson)}<small>/ person</small></strong></div><div className="group-total"><span>Total group cost</span><strong data-testid="group-total">{money(price.total)}</strong><small>{size} people · {days} days</small></div><div className="savings"><Leaf size={17} /><span>You save <b data-testid="savings">{money(price.savings)}</b> vs booking individually</span><span>{Math.round(price.discount * 100)}% off</span></div></> : <p>Choose a valid trip length to see your estimate.</p>}</div>
          <button className="button primary full" disabled={!daysValid} onClick={() => openQuote()}>Get Detailed Quote <ArrowRight size={18} /></button><p className="tiny centered">Estimates only. Flights, insurance & optional extras excluded.<br />Package starting rates below use separate curated itineraries.</p>
        </div></div></section>
      <section id="packages" className="section packages-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">CURATED FOR YOUR CREW</span><h2>Most popular <span>group trips.</span></h2><p>Different places. Same feeling: “I'm so glad we did this.”</p></div><a className="text-link" href="#package-grid" onClick={() => setFilter("All")}>Explore all 6 demo trips <ArrowUpRight size={18} /></a></div><div className="filter-tabs" aria-label="Filter packages">{categories.map((c) => <button key={c} aria-pressed={filter === c} onClick={() => setFilter(c)}>{c === "All" && <Globe2 size={15} />}{c}</button>)}</div><p className="sr-only" role="status">{filtered.length} packages for {filter}</p>
        <div className="package-grid" id="package-grid">{filtered.map((trip, i) => <article className="trip-card" key={trip.id}><div className="trip-image"><img src={`/art/${trip.art}.svg`} alt={`${trip.destination}: ${trip.id === "bali" ? "lush rice terraces" : trip.id === "iceland" ? "northern lights over mountains" : trip.id === "costa" ? "zip-lining in a cloud forest" : trip.id === "morocco" ? "a lantern-lit desert camp" : trip.id === "portugal" ? "a cliffside beach" : "Fushimi Inari torii gates"} in original illustrated travel art`} loading="lazy" /><span className="duration"><CalendarDays size={14} /> {trip.days} days</span>{i === 0 && filter === "All" && <span className="popular">TRIBE FAVORITE</span>}<button className="trip-open" aria-label={`View ${trip.name} trip`} onClick={() => setOverlay({ type: "trip", trip })}><ArrowUpRight size={21} /></button></div><div className="trip-body"><div className="trip-tags">{trip.tags.map((t) => <span key={t}>{t}</span>)}<span className="rating"><Star size={13} fill="currentColor" />{trip.rating} <small>({trip.reviews})</small></span></div><h3>{trip.name}</h3><p className="trip-route"><MapPin size={14} />{trip.route}</p><div className="trip-size"><Users size={15} /> {trip.min}–{trip.max} travelers <span>·</span> Fictional package</div><div className="trip-bottom"><div><small>FROM</small><strong>{money(trip.price)}<span>/ person</span></strong></div><button className="text-link" onClick={() => setOverlay({ type: "trip", trip })}>View Trip <ArrowRight size={17} /></button></div></div></article>)}</div>
        {!filtered.length && <div className="empty-state"><Building2 size={38} /><h3>No off-the-shelf corporate packages</h3><p>Your team's retreat should be as unique as your team. Build a custom plan for 10–50 people.</p><button className="button primary" onClick={() => openQuote({ ...seed, size: Math.max(10, size), corporate: true })}>Plan a Corporate Retreat <ArrowRight size={18} /></button><button className="text-button" onClick={() => setFilter("All")}>Show all group packages</button></div>}
        <div className="package-note"><Compass size={19} /><p>Dreaming of somewhere else? The fictional service would offer 40+ packages.<br /><b>This demo has six. Let's imagine your own.</b></p><button className="button light small" onClick={() => openQuote()}>Build a Custom Trip <ArrowUpRight size={16} /></button></div>
      </div></section>
      <section id="planning" className="section warm planning-section"><div className="container planning-layout"><div className="device-scene"><div className="laptop"><Planner votes={votes} setVotes={setVotes} /></div><div className="laptop-base" /><div className="floating-note"><span><Check size={16} /></span><div><strong>Your tribe, on the same page.</strong><small>Less “wait, what's the plan?”</small></div></div></div><div className="planning-copy"><span className="eyebrow">BYE, ENDLESS GROUP CHATS.</span><h2>One plan.<br /><span>Everyone in on it.</span></h2><p>All the good ideas. None of the scattered spreadsheets. Give your whole crew a seat at the planning table.</p><ul className="feature-list">{[
        { Icon: Link2, text: "Share a planning link—no app download needed" }, { Icon: Vote, text: "Vote on activities, restaurants, and excursions" }, { Icon: CalendarDays, text: "A shared itinerary, ready for every device" }, { Icon: MessageCircle, text: "Keep trip discussions in one group chat" }, { Icon: Users, text: "See who's confirmed and who's still pending" }, { Icon: Bell, text: "Preview payment, passport, and packing reminders" },
      ].map(({ Icon, text }) => <li key={text}><Icon size={18} /><span>{text}</span></li>)}</ul><button className="button outline" onClick={() => setOverlay({ type: "planner" })}>Try the Planning Tool <ArrowUpRight size={17} /></button><p className="tiny">Interactive local preview. No accounts, syncing, or notifications.</p></div></div></section>
      <section id="payments" className="section payment-section"><div className="container payment-layout"><div className="payment-copy"><span className="eyebrow">FRIENDS, NOT COLLECTION AGENTS.</span><h2>Everyone pays<br /><span>their own way.</span></h2><p>Great memories shouldn't come with awkward money conversations. Keep the split simple.</p><ul className="feature-list"><li><CheckCircle2 size={18} />Individual payment links for each member*</li><li><CheckCircle2 size={18} />Three installments or pay in full</li><li><CheckCircle2 size={18} />Track who's paid and who's still pending</li><li><CheckCircle2 size={18} />Preview the 30-day full refund policy</li></ul><div className="trust-badges"><span><ShieldCheck size={17} /> Stripe secured*</span><span><ShieldCheck size={17} /> 256-bit encryption*</span><span><Heart size={17} /> Refund guarantee*</span></div><p className="tiny">*Fictional service claims, not integrations or security guarantees.<br />No real payment links, card details, transactions, or refunds.</p></div><Payments /></div></section>
      <section id="corporate" className="section corporate-section"><div className="container"><div className="corporate-top"><div><span className="eyebrow">OUT OF OFFICE. INTO POSSIBILITY.</span><h2>Team retreats that<br /><span>actually build teams.</span></h2><p>Offsite planning for companies of 10–50 people.<br />Make room for fresh ideas, real connections, and a little adventure.</p></div><button className="button primary" onClick={() => openQuote({ ...seed, size: Math.max(10, size), corporate: true })}>Plan a Corporate Retreat <ArrowUpRight size={18} /></button></div><div className="corporate-grid">{[
        { Icon: Coffee, title: "Team Building Activities", text: "From cooking classes to adventure sports, curated experiences that turn colleagues into a crew." },
        { Icon: Building2, title: "Meeting Spaces Included", text: "Room for the big ideas. Conference spaces and reliable WiFi planned into every destination." },
        { Icon: Compass, title: "Dedicated Trip Coordinator", text: "One planner, every detail. You focus on your team; your coordinator handles the rest." },
      ].map(({ Icon, title, text }) => <article key={title}><Icon size={28} /><h3>{title}</h3><p>{text}</p></article>)}</div><div className="company-strip"><p>“Trusted by teams from 200+ companies”<small>Fictional sample claim · illustrative company names below</small></p><div><span>northstar</span><span className="company-serif">goodfolk.</span><span>◈ FIELDWORK</span><span className="company-serif">orbit</span><span>WAYPOINT</span></div></div></div></section>
      <Testimonials />
      <section id="faq" className="section warm faq-section"><div className="container faq-layout"><div><span className="eyebrow">GOOD QUESTIONS. STRAIGHT ANSWERS.</span><h2>A little clarity<br /><span>before you go.</span></h2><p>Still wondering about something?<br />Our fictional travel specialists would help.</p><button className="text-link" onClick={() => info("Meet your demo travel specialist", "This is a fictional support desk. No messages or calls are sent. Try the quote form to assemble a local trip brief, or explore the FAQs for sample service policies. The sample phone number (555) 234-5678 is not a working travel support line.")}><MessageCircle size={18} /> Talk to our team <ArrowUpRight size={16} /></button></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={19} /></summary><p>{answer}</p></details>)}</div></div></section>
      <section id="quote" className="section final-cta"><div className="container"><span className="eyebrow">STOP SAYING “SOMEDAY.”</span><h2>Your next group adventure<br />starts <em>here.</em></h2><p>Tell us your dream destination and group size. We'll imagine the rest.</p><QuoteForm seed={defaultSeed} compact /><div className="call-line"><MessageCircle size={17} /> Or explore our fictional specialist line: (555) 234-5678 <span>7 days a week · demo only</span></div></div></section>
    </main>
    <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><a href="#" aria-label="TrekTribe home"><Brand /></a><p>Go further. Grow closer.<br />Travel with your tribe.</p><div className="eco-badges"><span><Leaf size={16} /> B Corp Certified*</span><span><Globe2 size={16} /> Carbon Neutral Trips*</span></div><small>*Fictional badges. No certification claimed.</small></div>{[
      { title: "Destinations", links: ["Bali", "Costa Rica", "Iceland", "Japan", "All destinations"] },
      { title: "Trip Types", links: ["Friend getaways", "Family adventures", "Corporate retreats", "Celebrations"] },
      { title: "Company", links: ["Our story", "Travel journal", "Responsible travel"] },
      { title: "Support", links: ["FAQs", "Contact us", "Planning tool"] },
      { title: "Legal", links: ["Privacy", "Terms", "Cancellation policy"] },
    ].map((column) => <div className="footer-column" key={column.title}><h3>{column.title}</h3>{column.links.map((link) => <button key={link} onClick={() => {
      const trip = trips.find((t) => t.destination === link);
      if (trip) setOverlay({ type: "trip", trip });
      else if (link === "Corporate retreats") document.getElementById("corporate")?.scrollIntoView();
      else if (link === "All destinations" || column.title === "Trip Types") { setFilter("All"); document.getElementById("packages")?.scrollIntoView(); }
      else if (link === "FAQs") document.getElementById("faq")?.scrollIntoView();
      else if (link === "Planning tool") setOverlay({ type: "planner" });
      else info(link, link === "Privacy" ? "This demo has no analytics, accounts, cookies, or backend. Interactions are stored only in page memory and disappear on reload. Do not enter personal information. Clipboard copying is optional and copies only the public page URL." : link === "Cancellation policy" ? "Fictional policy: a full refund is available at least 30 days before departure. The local payment preview illustrates eligibility and never moves money or cancels a booking." : link === "Responsible travel" ? "Bring a refillable bottle, respect local communities, and choose thoughtful operators. Certification and carbon-neutral badges here are fictional design examples, not audited claims." : "TrekTribe Adventures is a fictional travel brand created for this local demo. Packages, reviews, company logos, quotes, and policies are illustrative; no travel services or legal agreement are offered.");
    }}>{link}</button>)}</div>)}</div><div className="footer-bottom"><span>© 2026 TrekTribe Adventures · A fictional demo</span><div className="social-links">{["Instagram", "Facebook", "TikTok", "YouTube", "Pinterest"].map((social) => <button key={social} onClick={() => info(`${social} · demo only`, "No real TrekTribe social account is connected. This preview stays on this page and does not open external profiles.")}>{social}</button>)}</div></div><p className="asset-note">Original SVG travel illustrations · Sora & Inter fonts, SIL Open Font License · All prices & reviews are fictional.</p></div></footer>
    <div className="mobile-bottom"><span>Find your next <b>together.</b></span><button className="button primary small" onClick={() => openQuote()}>Get Quote <ArrowRight size={16} /></button></div>
    {overlay && <Modal title={overlay.type === "trip" ? overlay.trip.name : overlay.type === "quote" ? overlay.seed.corporate ? "Plan a Corporate Retreat" : overlay.seed.trip ? `${overlay.seed.trip.name} · demo inquiry` : "Build your group adventure" : overlay.type === "planner" ? "Your shared planning playground" : overlay.title} onClose={() => setOverlay(null)}>
      {overlay.type === "quote" && <QuoteForm seed={overlay.seed} />}
      {overlay.type === "trip" && <div className="trip-detail"><img src={`/art/${overlay.trip.art}.svg`} alt={`${overlay.trip.destination} original destination illustration`} /><p className="detail-meta"><CalendarDays size={16} /> {overlay.trip.days} days <Users size={16} /> {overlay.trip.min}–{overlay.trip.max} travelers <Star size={15} /> {overlay.trip.rating} fictional rating</p><p>{overlay.trip.description}</p><h3>Your sample itinerary</h3><ol>{overlay.trip.itinerary.map((day) => <li key={day}><MapPin size={16} />{day}</li>)}</ol><div className="included"><CheckCircle2 size={17} /><p>Includes shared accommodation, local transfers, a local guide, and listed core experiences. Excludes flights, insurance, and optional extras. No availability is checked.</p></div><div className="detail-book"><div><strong>{money(overlay.trip.price)}<small>/ person, starting rate</small></strong><p>{Math.min(overlay.trip.max, Math.max(overlay.trip.min, size))} travelers · {money(overlay.trip.price * Math.min(overlay.trip.max, Math.max(overlay.trip.min, size)))} estimated total</p><small>Group size adjusted to this package's {overlay.trip.min}–{overlay.trip.max} range.</small></div><button className="button primary" onClick={() => openQuote({ destination: overlay.trip.destination, size: Math.min(overlay.trip.max, Math.max(overlay.trip.min, size)), days: overlay.trip.days, tier, trip: overlay.trip })}>Plan This Trip <ArrowRight size={17} /></button></div><p className="tiny">No real booking or payment. All prices and reviews are fictional.</p></div>}
      {overlay.type === "planner" && <Planner expanded votes={votes} setVotes={setVotes} />}
      {overlay.type === "info" && <div className="info-content"><Compass size={36} /><p>{overlay.text}</p><button className="button primary" onClick={() => setOverlay(null)}>Got it <Check size={17} /></button></div>}
    </Modal>}
  </>;
}
