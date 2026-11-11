"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Camera, Check, ChevronLeft, ChevronRight, Clock, Menu, Moon, Newspaper, Palette, Sun, X } from "lucide-react";
import { Art } from "../components/art";
import { categories, prints, services, works, type Artwork, type Category } from "../components/data";

type Modal = { type: "work"; work: Artwork } | { type: "print"; index: number } | { type: "info"; title: string; text: string };
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const nav = ["Work", "About", "Services", "Shop", "Contact"];

export default function Home() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(6);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState<Modal | null>(null);
  const [slide, setSlide] = useState(0);
  const [format, setFormat] = useState("standard");
  const [quantity, setQuantity] = useState(1);
  const [reserved, setReserved] = useState(false);
  const [projectType, setProjectType] = useState("Editorial");
  const [license, setLicense] = useState("single");
  const [pieces, setPieces] = useState(1);
  const [sent, setSent] = useState(false);
  const [fail, setFail] = useState(false);
  const [error, setError] = useState("");
  const [paused, setPaused] = useState(false);
  const [tomorrow, setTomorrow] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const navigation = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touch = useRef<number | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const filtered = works.filter(w => (category === "All" || w.category === category) && w.title.toLowerCase().includes(query.toLowerCase().trim()));
  const service = services.find(s => s.type === projectType);
  const estimate = (service?.price ?? 600) * pieces * (license === "extended" ? 1.5 : license === "exclusive" ? 2 : 1);

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    setTomorrow(`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`);
    const scroll = () => setScrolled(window.scrollY > 40);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  useEffect(() => {
    const active = modal ? dialog.current : menu ? navigation.current : null;
    if (active && !active.open) active.showModal();
    document.body.style.overflow = modal || menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal, menu]);
  function open(value: Modal) {
    returnFocus.current = document.activeElement as HTMLElement;
    setSlide(0); setFormat("standard"); setQuantity(1); setReserved(false); setModal(value);
  }
  function close() {
    dialog.current?.close(); setModal(null);
    requestAnimationFrame(() => returnFocus.current?.focus());
  }
  function closeMenu() { navigation.current?.close(); setMenu(false); }
  function inquire(type?: string) {
    if (type) setProjectType(type);
    setSent(false); setError("");
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    requestAnimationFrame(() => document.getElementById("name")?.focus({ preventScroll: true }));
  }
  function info(title: string, text: string) { open({ type: "info", title, text }); }
  const social = (name: string) => info(`${name} · concept profile`, "Maya Torres is a fictional illustrator created for this portfolio demo. No real social profile or artist affiliation is implied. Explore the original artwork in Selected Work instead.");
  return <>
    <a className="skip" href="#work">Skip to selected work</a>
    <header className={scrolled ? "nav solid" : "nav"}>
      <a href="#" className="wordmark" aria-label="Maya Torres home">Maya Torres<span>✳</span></a>
      <nav className="desktop-links" aria-label="Main navigation">{nav.map(n => <a key={n} href={`#${n.toLowerCase()}`}>{n}</a>)}</nav>
      <div className="nav-tools"><button className="social-icon" aria-label="Instagram" onClick={() => social("Instagram")}><Camera size={19}/></button><button className="social-icon behance" aria-label="Behance" onClick={() => social("Behance")}>Bē</button><span className="separator"/><button aria-label={dark ? "Use light theme" : "Use dark theme"} onClick={() => setDark(!dark)}>{dark ? <Sun size={20}/> : <Moon size={20}/>}</button><button className="menu-toggle" aria-label="Open navigation" aria-expanded={menu} onClick={() => setMenu(true)}><Menu/></button></div>
    </header>

    <main>
      <section className="hero" aria-labelledby="hero-title">
        <Art kind={0} label="An original moonlit garden with towering leaves, peach wildflowers, a little bird, and a winding ivory path" hero/>
        <div className="hero-shade"/>
        <div className="hero-top"><span>INDEPENDENT ILLUSTRATION & ART</span><span>PORTLAND, OR · EVERYWHERE ELSE</span></div>
        <div className="hero-copy"><p className="eyebrow">A LITTLE WONDER GOES A LONG WAY</p><h1 id="hero-title">Maya Torres<span className="hero-star" aria-hidden="true">✳</span></h1><p>Illustrator & Visual Storyteller</p><div className="hero-bottom"><span>Imagined worlds. Human stories.<br/>A soft spot for the natural world.</span><a href="#work" className="light-link">Explore my work <ArrowDown size={18}/></a></div></div>
        <a href="#work" className="scroll-indicator" aria-label="Scroll to selected work"><ArrowDown size={19}/></a><span className="hero-caption">01 / THE MIDNIGHT GARDEN · ORIGINAL CONCEPT</span>
      </section>

      <div className="concept-strip"><span className="dot"/> An imagined practice, a real love of illustration.<span>Fictional portfolio · Original artwork · No sales or live inquiries</span></div>
      <section id="work" className="section work-section">
        <div className="section-heading"><div><p className="eyebrow rose">A FEW THINGS I’VE MADE</p><h2>Selected Work<span className="rose">.</span></h2></div><p>Rooted in nature.<br/>Made to tell a story.</p></div>
        <div className="gallery-toolbar"><div className="filters" aria-label="Filter work">{categories.map(c => <button key={c} className={category === c ? "active" : ""} aria-pressed={category === c} onClick={() => { setCategory(c); setLimit(6); }}>{c}{c === "All" && <sup>18</sup>}</button>)}</div><label className="search"><span className="sr-only">Search artwork</span><input aria-label="Search artwork" placeholder="Find a little wonder…" value={query} onChange={e => { setQuery(e.target.value); setLimit(6); }}/><span>⌕</span></label></div>
        <p className="sr-only" aria-live="polite">{filtered.length} artworks found</p>
        <div className="masonry">{filtered.slice(0, limit).map((w, index) => <article className={`work-card ${w.shape}`} key={w.id}>
          <button onClick={() => open({ type: "work", work: w })} aria-label={`View project: ${w.title}`}>
            <Art kind={w.art} palette={w.palette} label={w.title + " — original illustration"}/>
            <span className="art-index">{String(w.id).padStart(2, "0")} / 18</span>
            {w.category === "Motion" && <span className="motion-badge">◉ MOTION STUDY</span>}
            <span className="tile-overlay"><span>View Project <ArrowUpRight size={22}/></span></span>
          </button>
          <div className="tile-caption"><h3>{w.title}</h3><span>{w.category}</span><ArrowUpRight size={17}/></div>
          {index === 0 && <span className="sr-only">Featured artwork</span>}
        </article>)}</div>
        {filtered.length === 0 ? <div className="empty"><h3>No stories found (yet).</h3><p>Try a different title or explore the whole collection.</p><button className="button" onClick={() => { setQuery(""); setCategory("All"); setLimit(6); }}>Reset collection</button></div> : <div className="load-area"><span>Showing {Math.min(limit, filtered.length)} of {filtered.length} works</span>{limit < filtered.length && <button className="outline-button" onClick={() => setLimit(limit + 6)}>Load More <span>+</span></button>}</div>}
      </section>

      <section id="about" className="about section">
        <div className="about-copy"><p className="eyebrow rose">THE PERSON BEHIND THE PICTURES</p><h2>A curious mind.<br/>A colorful world.</h2><h3>About Maya</h3><p>I’m a freelance illustrator based in Portland, Oregon, creating work that blends the natural world with human emotion. I’m drawn to the quiet, the curious, and the extraordinary hiding in ordinary things.</p><p>In this fictional practice, eight years of exploration and an imagined Rhode Island School of Design education shape a warm, textured approach to editorial stories, books, and thoughtful brands.</p><p>The New Yorker, Bloomberg, HarperCollins, Oatly, and Wired appear as hypothetical creative briefs, not clients or endorsements. Every picture here is an original concept made for this demo.</p><a className="text-link" href="/maya-torres-concept-cv.txt" download>Download Full CV <ArrowDown size={17}/></a><div className="stats"><div><strong>8+</strong><span>Years of curiosity</span></div><div><strong>200+</strong><span>Imagined projects</span></div><div><strong>40+</strong><span>Fictional clients</span></div></div><p className="fine">Concept biography and statistics — not professional credentials.</p></div>
        <figure className="studio"><svg viewBox="0 0 500 620" role="img" aria-label="Original illustrated studio portrait, a fictional substitute for an artist photograph"><rect width="500" height="620" fill="#d6b69b"/><rect x="35" y="40" width="270" height="320" rx="130" fill="#e9ddbc"/><path d="M170 40V360M35 220H305" stroke="#996d57" strokeWidth="12"/><path d="M40 620V415H460V620" fill="#9c6450"/><path d="M320 425V210H460V425" fill="#f3e7c7"/><path d="M340 400Q330 270 430 245Q380 380 440 395" fill="#557459"/><ellipse cx="225" cy="320" rx="72" ry="92" fill="#a65b3e"/><path d="M146 330Q100 170 230 180Q335 200 300 335L265 270Q210 300 183 250L180 345" fill="#333c36"/><path d="M105 580Q100 365 215 389Q335 375 350 580" fill="#45675c"/><path d="M180 420Q235 485 335 460" stroke="#a65b3e" strokeWidth="35" fill="none"/><path d="M315 455L367 350" stroke="#333c36" strokeWidth="7"/><path d="M0 560H500V620H0" fill="#e5c597"/><rect x="330" y="530" width="110" height="18" fill="#d58260" transform="rotate(-8 330 530)"/><circle cx="80" cy="530" r="30" fill="#eee3c9"/><path d="M390 170Q340 100 380 50M410 175Q460 90 425 40" stroke="#557459" strokeWidth="18" fill="none"/></svg><figcaption>A slow morning in the studio.<span>Original illustration · not a real portrait</span></figcaption><span className="studio-note">Made with<br/>a little heart ♡</span></figure>
      </section>

      <section id="services" className="services section"><div className="section-heading"><div><p className="eyebrow rose">LET’S MAKE SOMETHING MEANINGFUL</p><h2>Services & Commissions</h2></div><span className="availability"><span className="dot"/> Concept availability</span></div><p className="section-intro">From a single image to a whole illustrated world.<br/>Thoughtful collaboration, from the first sketch to the final detail.</p><div className="service-grid">{services.map((s, i) => <article className="service-card" key={s.type}><span className="service-icon">{i === 0 ? <Newspaper/> : i === 1 ? <BookOpen/> : <Palette/>}</span><span className="service-number">0{i+1}</span><h3>{s.name}</h3><p>{s.description}</p><p className="price">From {money(s.price)}<small> / {s.unit}</small></p><span className="timing"><Clock size={14}/>{s.timing}</span><button className="text-link" onClick={() => inquire(s.type)}>Inquire <ArrowUpRight size={18}/></button></article>)}</div><p className="custom">Have something a little different in mind? <button onClick={() => inquire("Other")}>Let’s talk <ArrowUpRight size={15}/></button></p><p className="fine">Fictional starting rates and availability. Estimates are illustrative, not offers or contracts.</p></section>

      <section id="shop" className="shop section"><div className="section-heading"><div><p className="eyebrow rose">A LITTLE ART FOR YOUR EVERYDAY</p><h2>Prints & Originals</h2></div><button className="text-link" onClick={() => { document.getElementById("print-list")?.scrollIntoView({ behavior: "smooth", block: "center" }); document.getElementById("print-0")?.focus({ preventScroll: true }); }}>Browse All Prints <ArrowRight size={18}/></button></div><p className="section-intro">Imagined editions for real daydreamers. Preview the local print experience — nothing is for sale.</p><div id="print-list" className="print-list">{prints.map((p, i) => { const w = works[p.work]; return <article className="print" key={w.id}><button id={`print-${i}`} className="print-art" aria-label={`View print: ${w.title}`} onClick={() => open({ type: "print", index: i })}><Art kind={w.art} palette={w.palette} label={`${w.title} print preview`}/><span>PREVIEW EDITION <ArrowUpRight size={17}/></span></button><div className="print-meta"><span>LIMITED EDITION · {p.stock}/50 REMAINING*</span><strong>{money(p.price)}</strong></div><h3>{w.title} — Limited Print</h3><button className="text-link" onClick={() => open({ type: "print", index: i })}>View in Shop <ArrowRight size={15}/></button></article>; })}</div><p className="fine">*Fictional edition counts. No checkout, payment, shipment, or real reservation.</p></section>

      <section className="testimonials section" aria-labelledby="kind-words"><div className="section-heading"><div><p className="eyebrow rose">A NOTE ON COLLABORATION</p><h2 id="kind-words">Kind words, imagined.</h2></div><button className="outline-button" onClick={() => setPaused(!paused)}>{paused ? "Play quotes" : "Pause quotes"}</button></div><p className="fine">Fictional sample testimonials. These are not real reviews or client endorsements.</p><div className={`quote-window ${paused ? "paused" : ""}`} tabIndex={0} aria-label="Fictional testimonials; focus or hover to pause"><div className="quote-track">{["Maya’s work brought our cover story to life in ways we couldn’t have imagined.", "She understood our brand ethos immediately and delivered illustrations that feel authentically Oatly.", "Working with Maya was seamless. The final book cover exceeded our expectations."].map((quote,i) => <figure key={quote}><span className="quote-mark">“</span><blockquote>{quote}</blockquote><figcaption>{["Art Director · Bloomberg Businessweek", "Creative Director · Oatly", "Editor · HarperCollins"][i]}<span>Fictional role · hypothetical collaboration</span></figcaption></figure>)}</div></div></section>

      <section id="contact" className="contact section"><div className="contact-intro"><p className="eyebrow rose">GOOD THINGS START WITH A CONVERSATION</p><h2>Let’s work<br/>together<span className="rose">.</span></h2><p>A story to tell? A spark of an idea?<br/>I’d love to hear what you’re dreaming up.</p><button className="email text-link" onClick={() => info("Local contact demo", "The source brief uses hello@mayatorres.com. It is not a verified contact address. Please use the local inquiry form; it never sends email or stores your details.")}>hello@mayatorres.com <ArrowUpRight size={20}/></button><dl><div><dt>BASED IN</dt><dd>Portland, Oregon · available worldwide*</dd></div><div><dt>RESPONSE TIME</dt><dd>Within 48 hours*<br/><small>*Fictional concept information. No reply is sent.</small></dd></div></dl><div className="social-links">{["Instagram", "Behance", "Dribbble", "LinkedIn"].map(s => <button key={s} onClick={() => social(s)}>{s} <ArrowUpRight size={13}/></button>)}</div></div>
        <div className="form-panel">{sent ? <div className="success" role="status"><Check size={36}/><p className="eyebrow">LOCAL DEMO CONFIRMATION</p><h3>Your idea has a starting point.</h3><p>Your {projectType.toLowerCase()} inquiry was validated locally. No message was sent, no data saved, and no booking made.</p><p>Illustrative starting estimate: <strong>{money(estimate)}</strong></p><button className="button" onClick={() => { setSent(false); setProjectType("Editorial"); setLicense("single"); setPieces(1); setFail(false); setError(""); }}>Start a new inquiry <ArrowRight size={16}/></button></div> : <form ref={form} onSubmit={e => { e.preventDefault(); if (fail) { setError("Demo delivery is unavailable. Turn off “Simulate delivery failure” and try again. Your inputs are still here."); return; } setError(""); setSent(true); }} onReset={() => { setProjectType("Editorial"); setLicense("single"); setPieces(1); setError(""); setFail(false); }}>
          <p className="form-note">LOCAL INQUIRY PREVIEW <span>All fields required unless marked optional</span></p>
          <div className="form-row"><label htmlFor="name">Your name<input id="name" name="name" autoComplete="name" required maxLength={100} placeholder="Alex Rivera"/></label><label htmlFor="email">Email address<input id="email" name="email" type="email" autoComplete="email" required placeholder="alex@example.com"/></label></div>
          <div className="form-row"><label htmlFor="project-type">Project type<select id="project-type" aria-label="Project type" value={projectType} onChange={e => setProjectType(e.target.value)}>{["Editorial", "Book", "Brand", "Personal", "Other"].map(s=><option key={s}>{s}</option>)}</select></label><label htmlFor="budget">Budget range<select id="budget" name="budget" required defaultValue=""><option value="" disabled>Select a range</option>{["<$1K", "$1K–3K", "$3K–5K", "$5K+"].map(s=><option key={s}>{s}</option>)}</select></label></div>
          <div className="form-row"><label htmlFor="license">Usage license<select id="license" value={license} onChange={e => setLicense(e.target.value)}><option value="single">Single publication · base rate</option><option value="extended">Extended campaign · +50%</option><option value="exclusive">Exclusive rights · +100%</option></select></label><label htmlFor="pieces">Number of pieces<input id="pieces" type="number" min="1" max="20" required value={Number.isNaN(pieces) ? "" : pieces} onChange={e => setPieces(e.target.valueAsNumber)}/></label></div>
          <label htmlFor="deadline">Preferred delivery date<input id="deadline" name="deadline" type="date" min={tomorrow} required/></label><p className="fine">Future dates only. Service lead times are guides, not confirmed availability.</p>
          <div className="estimate"><span>Illustrative starting estimate</span><output aria-label="Commission estimate">{money(Number.isFinite(estimate) ? estimate : 0)}</output></div><p className="fine">{money(service?.price ?? 600)} × pieces × usage multiplier. Custom/Personal uses a $600 concept base. Final scope is not quoted.</p>
          <label htmlFor="message">Tell me a little about your project<textarea id="message" name="message" rows={4} minLength={20} maxLength={3000} required placeholder="The story, the audience, the feeling you’re after… (20 characters minimum)"/></label>
          <label className="checkbox"><input type="checkbox" required/>I understand this is a fictional demo. No inquiry is sent.</label><label className="checkbox subtle"><input type="checkbox" checked={fail} onChange={e => { setFail(e.target.checked); setError(""); }}/>Simulate delivery failure (demo testing)</label>
          {error && <p role="alert" className="error">{error}</p>}
          <div className="form-actions"><button className="button" type="submit">Send Inquiry <ArrowUpRight size={17}/></button><button type="reset" className="reset">Reset form</button></div><p className="fine">No accounts, email services, analytics, or payment providers. Your input stays in this page.</p>
        </form>}</div>
      </section>
    </main>
    <footer><a className="wordmark" href="#">Maya Torres<span>✳</span></a><p>© 2026 · Fictional portfolio concept<br/>Built with love and too much coffee.</p><div><button onClick={() => info("Privacy, plainly", "This demo has no backend, cookies, analytics, or persistent storage. Form entries and previews live only in browser memory and disappear on reload. Nothing is emailed, purchased, or reserved. The downloadable CV is a fictional text document.")}>Privacy Policy</button><button onClick={() => social("Instagram")}>Instagram</button><button onClick={() => social("Behance")}>Behance</button><a href="#work">Back to work ↑</a></div></footer>

    <dialog ref={navigation} className="mobile-navigation" aria-label="Mobile navigation" onCancel={() => setMenu(false)} onClose={() => setMenu(false)}><div className="mobile-nav-top"><span className="wordmark">Maya Torres ✳</span><button aria-label="Close navigation" onClick={closeMenu}><X/></button></div><nav>{nav.map((n,i)=><a key={n} href={`#${n.toLowerCase()}`} onClick={closeMenu}><small>0{i+1}</small>{n}<ArrowUpRight/></a>)}</nav><p>Original worlds. A fictional practice.</p></dialog>
    <dialog ref={dialog} className={`detail-dialog ${modal?.type === "info" ? "info-dialog" : ""}`} aria-labelledby="dialog-title" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <button className="close-dialog" aria-label="Close dialog" onClick={close}><X size={23}/></button>
      {modal?.type === "info" && <div className="info-content"><p className="eyebrow rose">TRANSPARENCY FIRST</p><h2 id="dialog-title">{modal.title}</h2><p>{modal.text}</p><button className="button" onClick={close}>Got it <Check size={17}/></button></div>}
      {modal?.type === "work" && <><div className="detail-grid"><div className="carousel"><div className="carousel-art" onTouchStart={e => { touch.current = e.changedTouches[0].clientX; }} onTouchEnd={e => { if (touch.current !== null) { const delta = e.changedTouches[0].clientX - touch.current; if (Math.abs(delta) > 40) setSlide(s => (s + (delta < 0 ? 1 : 2)) % 3); } touch.current = null; }}><Art kind={modal.work.art} palette={slide === 2 ? (modal.work.palette + 1) % 6 : modal.work.palette} phase={slide} label={`${modal.work.title}: ${["finished composition", "detail crop", "alternate color study"][slide]}`}/></div><div className="carousel-controls"><button aria-label="Previous artwork view" onClick={() => setSlide((slide+2)%3)}><ChevronLeft/></button><span aria-live="polite">{slide+1} / 3 · {["Final illustration", "A closer look", "Color exploration"][slide]}</span><button aria-label="Next artwork view" onClick={() => setSlide((slide+1)%3)}><ChevronRight/></button></div></div><div className="detail-copy"><p className="eyebrow rose">{modal.work.category} / 2025</p><h2 id="dialog-title">{modal.work.title}</h2><p>{modal.work.description}</p><dl><div><dt>CLIENT / BRIEF</dt><dd>{modal.work.client}</dd></div><div><dt>CATEGORY</dt><dd>{modal.work.category === "Editorial" ? "Editorial Illustration" : modal.work.category}</dd></div><div><dt>TOOLS / ORIGINAL CONCEPT</dt><dd>Original SVG & CSS illustration<br/>Procreate / Photoshop: imagined workflow only</dd></div></dl><p className="fine">Fictional case study. Not commissioned by, affiliated with, or endorsed by the named brand. No results or awards are claimed.</p><button className="button" onClick={() => { const type = modal.work.category === "Book Covers" ? "Book" : modal.work.category === "Branding" ? "Brand" : modal.work.category === "Editorial" ? "Editorial" : "Personal"; close(); inquire(type); }}>Create something like this <ArrowUpRight size={16}/></button></div></div><section className="process"><p className="eyebrow rose">BEHIND THE PICTURE</p><h3>From a small idea to a whole world.</h3><div className="process-grid"><div><Art kind={modal.work.art} palette={modal.work.palette} phase={1} label="Composition detail study"/><h4>01 / Find the story</h4><p>Explore the central metaphor, balance the silhouette, and leave room for the story to breathe.</p></div><div><Art kind={modal.work.art} palette={(modal.work.palette+1)%6} label="Alternate color palette study"/><h4>02 / Build the feeling</h4><p>Test an alternate palette, refine the shapes, and bring warmth to the final composition.</p></div></div></section></>}
      {modal?.type === "print" && (() => { const p = prints[modal.index], w = works[p.work], total = (p.price + (format === "large" ? 45 : 0)) * quantity; return <div className="detail-grid"><div className="print-preview"><Art kind={w.art} palette={w.palette} label={`${w.title} edition preview`}/></div><div className="detail-copy"><p className="eyebrow rose">THE IMAGINED PRINT SHOP</p><h2 id="dialog-title">{w.title}</h2><p>Archival-style art print on an imagined warm, textured stock. An original illustration for a quiet corner of your world.</p><p className="fine">{p.stock}/50 fictional editions remaining. Personal display only; no reproduction or commercial rights. No taxes or shipping: this is not a real order.</p>{reserved ? <div className="success" role="status"><Check/><h3>A little wonder, previewed.</h3><p>{quantity} × {format === "large" ? "A2" : "A3"} · {money(total)}. Local confirmation only. No edition was reserved, no payment taken.</p><button className="outline-button" onClick={() => { setReserved(false); setQuantity(1); setFormat("standard"); }}>Reset print preview</button></div> : <form onSubmit={e => { e.preventDefault(); setReserved(true); }}><label htmlFor="print-format">Print format<select id="print-format" value={format} onChange={e => setFormat(e.target.value)}><option value="standard">A3 · 297 × 420 mm · {money(p.price)}</option><option value="large">A2 · 420 × 594 mm · {money(p.price+45)}</option></select></label><label htmlFor="print-quantity">Quantity<input id="print-quantity" type="number" min="1" max={p.stock} required value={Number.isNaN(quantity) ? "" : quantity} onChange={e => setQuantity(e.target.valueAsNumber)}/></label><div className="estimate"><span>Preview total (USD)</span><output aria-label="Print total">{money(Number.isFinite(total) ? total : 0)}</output></div><button className="button" type="submit">Preview reservation <ArrowRight size={16}/></button><p className="fine">No checkout. No card details. No real purchase.</p></form>}</div></div>; })()}
    </dialog>
  </>;
}
