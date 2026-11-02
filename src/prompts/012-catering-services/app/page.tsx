"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Heart, Wine, Menu, X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Spread from "@/components/Spread";
import { estimate, faqs, gallery, menus, reviews, services, type EventType, type Tier } from "@/components/data";

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
function localToday() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`; }
export default function Home() {
  const [nav, setNav] = useState(false);
  const [tier, setTier] = useState<Tier>("Premium");
  const [event, setEvent] = useState<EventType>("Corporate");
  const [main, setMain] = useState(menus.Premium.mains[0]);
  const [dessert, setDessert] = useState(menus.Premium.desserts[0]);
  const [guests, setGuests] = useState("100");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [review, setReview] = useState(0);
  const [intent, setIntent] = useState("Custom quote");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [notice, setNotice] = useState("");
  const modal = useRef<HTMLDialogElement>(null);
  const inquiry = useRef<HTMLFormElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const numericGuests = Number(guests);
  const validGuests = Number.isInteger(numericGuests) && numericGuests >= 20 && numericGuests <= 500;
  const validBudget = budget === "" || (Number.isFinite(Number(budget)) && Number(budget) > 0);
  const quote = estimate(event, tier, validGuests ? numericGuests : 0);
  useEffect(() => {
    if (lightbox !== null) { lastFocus.current = document.activeElement as HTMLElement; modal.current?.showModal(); }
    else if (modal.current?.open) { modal.current.close(); lastFocus.current?.focus(); }
  }, [lightbox]);
  function chooseTier(value: Tier) { setTier(value); setMain(menus[value].mains[0]); setDessert(menus[value].desserts[0]); setConfirmation(null); }
  function startPlanning(kind: string) { setIntent(kind); setConfirmation(null); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); document.getElementById("full-name")?.focus({ preventScroll: true }); }
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!validGuests || !validBudget || !date || date < localToday()) { setSubmitError("Check your guest count, future event date, and positive budget."); return; }
    if (String(data.get("name")).trim().length < 2 || String(data.get("venue")).trim().length < 3 || !/^[+\d\s().-]{7,25}$/.test(String(data.get("phone"))) || String(data.get("phone")).replace(/\D/g,"").length < 7) {
      setSubmitError("Please enter your full name, a phone number with at least 7 digits, and a venue location."); return;
    }
    setSubmitError("");
    setConfirmation(`${intent} prepared for ${String(data.get("name")).trim()}: ${event}, ${numericGuests} guests on ${date} at ${String(data.get("venue")).trim()}. ${tier} package with ${main} and ${dessert}. Illustrative total ${money(quote.total)}.${intent === "Tasting request" ? ` Tasting allowance: ${numericGuests > 75 ? "complimentary" : "$100 (not included in event estimate)"}.` : ""}${String(data.get("notes")).trim() ? ` Preferences: ${String(data.get("notes")).trim()}. Dietary details require provider verification.` : ""} Nothing has been sent or booked.`);
  }
  return <>
    <div className="demo-bar">A fictional catering experience · local demo · no bookings or messages sent</div>
    <header>
      <a className="brand" href="#home" aria-label="Savory Affairs home">Savory Affairs<span>CATERING & CELEBRATIONS</span></a>
      <button className="nav-toggle icon-button" aria-expanded={nav} aria-controls="navigation" aria-label={nav ? "Close navigation" : "Open navigation"} onClick={() => setNav(!nav)}>{nav ? <X/> : <Menu/>}</button>
      <nav id="navigation" className={nav ? "open" : ""} aria-label="Main navigation">
        {[["Services","services"],["Sample Menus","menus"],["Our Process","process"],["Gallery","gallery"]].map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setNav(false)}>{label}</a>)}
        <a className="button small" href="#contact" onClick={() => setNav(false)}>Let’s plan an event <ArrowRight size={15}/></a>
      </nav>
    </header>
    <main id="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-art"><Spread variant={10}/></div>
        <div className="hero-shade"/>
        <div className="hero-content"><p className="eyebrow">GOOD FOOD. GREAT COMPANY. BEAUTIFUL MEMORIES.</p><h1 id="hero-title">Unforgettable Events<br/>Start With<br/><em>Exceptional Food</em></h1>
          <p>Corporate events, weddings, and private parties — tailored menus for 20 to 500 guests</p>
          <div className="actions"><a className="button" href="#contact">Request a Quote <ArrowRight size={18}/></a><a className="text-link" href="#menus">Browse Sample Menus <ArrowRight size={17}/></a></div>
          <div className="hero-note"><span className="gold">✦</span> Thoughtfully crafted. Beautifully served.</div>
        </div>
        <span className="art-label">Original culinary illustration · not event photography</span>
      </section>
      <div className="intro-strip"><span>FROM THE FIRST IDEA TO THE LAST TOAST</span><p>Some occasions deserve more than a meal.<br/><em>They deserve an affair to remember.</em></p><span>EST. FOR THIS DEMO · 2026</span></div>
      <section id="services" className="section">
        <div className="section-heading"><div><p className="eyebrow">A PLACE AT EVERY TABLE</p><h2>Every occasion.<br/><em>Its own flavor.</em></h2></div><p>Intimate or extraordinary, formal or full of laughter. Let’s create a gathering that feels unmistakably yours.</p></div>
        <div className="service-grid">{services.map((s,i) => { const Icon = [BriefcaseBusiness,Heart,Wine][i]; return <article className={`service-card ${event===s.type ? "selected" : ""}`} key={s.type}><Icon className="service-icon" size={32}/><span className="card-number">0{i+1}</span><h3>{s.title}</h3><p>{s.detail}</p><div className="card-bottom"><span>From <strong>${s.price}</strong> / person</span><button aria-label={`Plan ${s.title}`} onClick={() => { setEvent(s.type); setConfirmation(null); document.getElementById("menus")?.scrollIntoView({behavior:"smooth"}); }}>Plan this event <ArrowRight size={16}/></button></div></article>; })}</div>
        <p className="fine-print">Illustrative starting prices, not offers. Service minimums apply in the estimator below.</p>
      </section>
      <section id="menus" className="menu-section section">
        <div className="section-heading"><div><p className="eyebrow">INGREDIENTS FOR AN UNFORGETTABLE EVENING</p><h2>A taste of <em>what’s possible.</em></h2></div><p>Seasonal inspiration. Thoughtful pairings.<br/>A sample menu, ready to become your own.</p></div>
        <div className="tabs" role="tablist" aria-label="Sample menu packages">{(Object.keys(menus) as Tier[]).map(t => <button id={`tab-${t}`} key={t} role="tab" aria-selected={tier===t} aria-controls="menu-panel" tabIndex={tier===t ? 0 : -1} onClick={() => chooseTier(t)} onKeyDown={e => { const tiers: Tier[] = ["Classic","Premium","Luxury"]; const index = tiers.indexOf(t); let next: Tier | undefined; if(e.key==="ArrowRight") next=tiers[(index+1)%3]; if(e.key==="ArrowLeft") next=tiers[(index+2)%3]; if(e.key==="Home") next=tiers[0]; if(e.key==="End") next=tiers[2]; if(next) { e.preventDefault(); chooseTier(next); document.getElementById(`tab-${next}`)?.focus(); } }}><span>{t} Package</span><small>${menus[t].price} / person</small></button>)}</div>
        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${tier}`} className="menu-panel">
          <div className="menu-art"><Spread variant={20}/><span>A table made for sharing</span></div>
          <div className="menu-copy"><p className="eyebrow">THE {tier.toUpperCase()} COLLECTION</p><h3>{menus[tier].subtitle}</h3><ul>{menus[tier].courses.map(c => <li key={c}><Check size={15}/>{c}</li>)}</ul><div className="menu-choices"><label>Main course<select aria-label="Main course" value={main} onChange={e => { setMain(e.target.value); setConfirmation(null); }}>{menus[tier].mains.map(m => <option key={m}>{m}</option>)}</select></label><label>Dessert<select aria-label="Dessert" value={dessert} onChange={e => { setDessert(e.target.value); setConfirmation(null); }}>{menus[tier].desserts.map(d => <option key={d}>{d}</option>)}</select></label></div><a className="text-link" href="#contact">Plan with this menu <ArrowRight size={17}/></a></div>
        </div>
        <p className="diet-note">All menus fully customizable. Dietary accommodations available (vegan, gluten-free, kosher, halal). <strong>Demo preferences only:</strong> no allergen-free guarantee or certification. Ingredients, cross-contact controls and religious compliance require provider confirmation.</p>
      </section>
      <section id="process" className="section">
        <div className="center-heading"><p className="eyebrow">LESS PLANNING STRESS. MORE RAISING GLASSES.</p><h2>From your vision <em>to your table.</em></h2></div>
        <div className="timeline">{[["Tell Us About Your Event","Share your date, guest count, and preferences."],["Menu Consultation","Our fictional chef’s next step: design a custom menu around your vision."],["Tasting Session","Explore your curated menu before the big day."],["We Handle Everything","Our sample full-service offering includes setup, service, and cleanup."]].map(([title,copy],i) => <article key={title}><div className="step">{i+1}</div><h3>{title}</h3><p>{copy}</p></article>)}</div>
        <div className="center-actions"><button className="outline-button" onClick={() => startPlanning("Menu consultation")}>Explore a menu consultation</button><button className="outline-button" onClick={() => startPlanning("Tasting request")}>Request a tasting plan</button></div>
      </section>
      <section id="gallery" className="section gallery-section">
        <div className="section-heading"><div><p className="eyebrow">A LITTLE INSPIRATION</p><h2>Tables set.<br/><em>Memories made.</em></h2></div><p>Six imagined celebrations, illustrated in-house.<br/>Fictional venues and guest counts; not a real portfolio.</p></div>
        <div className="filters" aria-label="Filter event gallery">{["All","Corporate","Wedding","Private Party"].map(f => <button key={f} aria-pressed={filter===f} onClick={() => setFilter(f)}>{f==="All" ? "All occasions" : f}</button>)}</div>
        <div className="gallery-grid">{gallery.map((g,i) => (filter==="All" || filter===g.category) && <figure key={g.title}><button className="gallery-image" aria-label={`View ${g.title}`} onClick={() => setLightbox(i)}><Spread color={g.color} variant={i} label={`Illustrated ${g.category.toLowerCase()} table`}/><span className="badge">{g.category}</span><span className="expand">View gathering ↗</span></button><figcaption><h3>{g.title}</h3><p>{g.category} · {g.guests} guests · {g.venue}</p></figcaption></figure>)}</div>
      </section>
      <section className="testimonials section" aria-label="Fictional testimonials"><p className="eyebrow">WORDS AROUND THE TABLE</p><p className="stars" aria-label="5 out of 5 fictional stars">★★★★★</p><blockquote>“{reviews[review].quote}”</blockquote><p className="review-name">{reviews[review].name}</p><p>{reviews[review].event}</p><span className="review-badge"><Check size={13}/> Illustrative review · not verified</span><div className="carousel-controls"><button className="icon-button" aria-label="Previous testimonial" onClick={() => setReview((review+2)%3)}><ChevronLeft/></button><span aria-live="polite">{review+1} / 3</span><button className="icon-button" aria-label="Next testimonial" onClick={() => setReview((review+1)%3)}><ChevronRight/></button></div><p className="fine-print">Source-provided sample quotations. No real-world endorsement or verified-client claim.</p></section>
      <section id="contact" className="section contact-section">
        <div className="contact-intro"><p className="eyebrow">YOUR NEXT GREAT GATHERING</p><h2>Let’s Plan<br/><em>Your Event</em></h2><p>Tell us what you have in mind.<br/>We’ll help you imagine the rest.</p><div className="estimate-card"><p className="eyebrow">LIVE ILLUSTRATIVE ESTIMATE</p><h3 aria-live="polite">{validGuests ? money(quote.total) : "Enter 20–500 guests"}</h3><p>{event} · {tier} package</p><dl><div><dt>Menu / service minimum</dt><dd>{money(quote.perGuest)} / guest</dd></div><div><dt>Food for {validGuests ? guests : "—"} guests</dt><dd>{validGuests ? money(quote.food) : "—"}</dd></div><div><dt>18% service allowance</dt><dd>{validGuests ? money(quote.service) : "—"}</dd></div></dl><p className="fine-print">Higher of the selected package and event starting rate, plus 18% service. Taxes, venue, travel and extras excluded. Not a binding quote or availability check.</p>{budget && validBudget && validGuests && <p role="status" className="budget-status">{quote.total > Number(budget) ? `Over your budget by ${money(quote.total-Number(budget))}. Try a lower tier or guest count.` : `${money(Number(budget)-quote.total)} remains in your illustrative budget.`}</p>}</div></div>
        <div className="form-wrap">{confirmation && <div className="confirmation" role="status"><Check size={38}/><h3>Your local planning summary</h3><p>{confirmation}</p><p>Your details exist only in this page’s memory and disappear on reload. No email, appointment, booking, or order was created.</p><button className="button" onClick={() => { setConfirmation(null); requestAnimationFrame(() => document.getElementById("full-name")?.focus()); }}>Edit inquiry</button><button className="outline-button" onClick={() => { setConfirmation(null); inquiry.current?.reset(); setDate(""); setBudget(""); setGuests("100"); setIntent("Custom quote"); setSubmitError(""); }}>Start a new inquiry</button></div>}<form ref={inquiry} hidden={Boolean(confirmation)} onSubmit={submit}>
          <div className="form-top"><h3>{intent}</h3><span>LOCAL DEMO ONLY</span></div><p className="fine-print">Use fictional contact details. No data is stored or transmitted.</p>
          <div className="form-grid"><label>Full name<input id="full-name" name="name" required minLength={2} maxLength={80} autoComplete="off" placeholder="Alex Morgan"/></label><label>Email<input name="email" type="email" required maxLength={120} autoComplete="off" placeholder="alex@example.com"/></label><label>Phone<input name="phone" type="tel" required maxLength={25} placeholder="555 234 5678"/></label><label>Event type<select aria-label="Event type" value={event} onChange={e => setEvent(e.target.value as EventType)}>{["Corporate","Wedding","Private Party","Other"].map(t => <option key={t}>{t}</option>)}</select></label><label>Estimated guest count<input aria-label="Estimated guest count" type="number" min={20} max={500} step={1} required value={guests} onChange={e => setGuests(e.target.value)}/>{!validGuests && <small role="alert">Choose a whole number from 20 to 500.</small>}</label><label>Preferred date<input aria-label="Preferred date" type="date" required min={localToday()} value={date} onChange={e => setDate(e.target.value)}/>{date && date<localToday() && <small role="alert">Choose today or a future date.</small>}</label><label className="wide">Venue location<input name="venue" required minLength={3} maxLength={160} placeholder="Venue or neighborhood (fictional is fine)"/></label><label className="wide">Total event budget ($, optional)<input aria-label="Total event budget" type="number" min={1} step="any" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. 10000"/>{!validBudget && <small role="alert">Enter a positive budget or leave blank.</small>}</label><label className="wide">Additional notes<textarea name="notes" rows={3} maxLength={1500} placeholder="Your vision, dietary preferences, or special touches…"/></label></div>
          <label className="consent"><input type="checkbox" required/>I understand this is a local demo, not a booking or dietary guarantee.</label>
          {submitError && <p role="alert" className="error">{submitError}</p>}<button className="button submit" type="submit">Get Your Custom Quote <ArrowRight size={18}/></button><p className="fine-print">“We respond within 24 hours” is sample brand copy only. This demo sends nothing and no response is promised.</p>
        </form></div>
      </section>
      <section className="section faq-section" id="faq"><div><p className="eyebrow">A FEW THINGS YOU MAY BE WONDERING</p><h2>Good questions.<br/><em>Thoughtful answers.</em></h2></div><div>{faqs.map(([q,a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
    </main>
    <footer><div className="footer-top"><div><a className="brand" href="#home">Savory Affairs<span>CATERING & CELEBRATIONS</span></a><p>Gather beautifully. Eat exceptionally.</p><p className="fine-print">“Proudly serving the Greater Metro area and surrounding counties”<br/>is fictional service-area copy; no actual business or location.</p></div><div><h3>Explore</h3>{[["Services","services"],["Sample Menus","menus"],["Gallery","gallery"],["Contact","contact"]].map(([l,id]) => <a key={id} href={`#${id}`}>{l}</a>)}</div><div><h3>Say hello</h3><button onClick={() => setNotice("Fictional phone: (555) 234-5678. No call is placed; use the local inquiry form.")}>(555) 234-5678</button><button onClick={() => setNotice("events@savoryaffairs.com is source sample copy. No email is sent; use the local inquiry form.")}>events@savoryaffairs.com</button><div className="socials">{["Instagram","Facebook","Pinterest"].map(s => <button key={s} onClick={() => setNotice(`${s} is a demo placeholder, not a real Savory Affairs account.`)}>{s}</button>)}</div></div></div>{notice && <div className="footer-notice" role="status">{notice}<button aria-label="Dismiss contact notice" onClick={() => setNotice("")}><X size={18}/></button></div>}<div className="footer-bottom"><span>© 2026 Savory Affairs · Fictional demonstration</span><span>Original artwork. No external services. Made for gathering.</span></div></footer>
    <dialog ref={modal} className="lightbox" onKeyDown={e => { if(e.key==="Tab") { e.preventDefault(); modal.current?.querySelector<HTMLButtonElement>("button")?.focus(); } }} onCancel={e => { e.preventDefault(); setLightbox(null); }} onClick={e => { if(e.target===e.currentTarget) setLightbox(null); }}>{lightbox!==null && <><button autoFocus className="icon-button close-modal" aria-label="Close gallery" onClick={() => setLightbox(null)}><X/></button><Spread color={gallery[lightbox].color} variant={lightbox}/><h3>{gallery[lightbox].title}</h3><p>{gallery[lightbox].category} · {gallery[lightbox].guests} guests · {gallery[lightbox].venue}</p><p className="fine-print">Original illustration of a fictional event, not photography.</p></>}</dialog>
  </>;
}
