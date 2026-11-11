"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowDown, ArrowRight, AudioLines, Camera, Check, ChevronLeft, ChevronRight, Disc3, Headphones, Menu, Mic2, Music2, Pause, Play, Radio, SlidersHorizontal, Video, Volume2, X } from "lucide-react";
import { credits, services, tiers, tracks, type Genre, type Service, type Track } from "./data";

function Cover({ art, title, small = false }: { art: string; title: string; small?: boolean }) {
  return <div className={`cover art-${art} ${small ? "cover-small" : ""}`} role="img" aria-label={`${title} original abstract cover`}>
    <div className="art-orbit" /><div className="art-core" /><div className="art-grid" />
    {!small && <><span className="cover-imprint">KV / SOUND STUDIES</span><span className="cover-caption">{title}</span><span className="cover-code">KVT—026 / ORIGINAL</span></>}
  </div>;
}

function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} className="modal" aria-labelledby="modal-title" onCancel={close} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
    <button className="icon-button modal-close" aria-label="Close dialog" onClick={close}><X size={22} /></button>
    <p className="eyebrow">KVOLT / DEMO NOTES</p><h2 id="modal-title">{title}</h2>{children}
  </dialog>;
}

const formatTime = (time: number) => `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, "0")}`;

export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [genre, setGenre] = useState<"All" | Genre>("All");
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.65);
  const [audioError, setAudioError] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const playIntent = useRef(false);
  const [details, setDetails] = useState<Track | null>(null);
  const [info, setInfo] = useState<{ title: string; body: string } | null>(null);
  const [service, setService] = useState<Service>("Beat License");
  const [selection, setSelection] = useState("");
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [newsletter, setNewsletter] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const localToday = new Date();
  const minDate = `${localToday.getFullYear()}-${String(localToday.getMonth() + 1).padStart(2, "0")}-${String(localToday.getDate()).padStart(2, "0")}`;
  const filtered = tracks.filter((track) => (genre === "All" || track.genre === genre) && `${track.title} ${track.mood}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const listener = () => setScrolled(window.scrollY > 24);
    listener();
    window.addEventListener("scroll", listener, { passive: true });
    const media = audio.current;
    return () => {
      window.removeEventListener("scroll", listener);
      if (timer.current) clearTimeout(timer.current);
      media?.pause(); media?.removeAttribute("src"); media?.load();
    };
  }, []);
  useEffect(() => {
    if (menu) { menuRef.current?.showModal(); document.body.style.overflow = "hidden"; }
    else { menuRef.current?.close(); document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [menu]);
  useEffect(() => {
    if (!current || !audio.current) return;
    const media = audio.current;
    let cancelled = false;
    media.src = `/audio/${current.id}.wav`;
    media.load();
    if (playIntent.current) media.play().catch((error: Error) => {
      if (!cancelled && error.name !== "AbortError") { setAudioError(true); setPlaying(false); }
    });
    return () => { cancelled = true; };
  }, [current]);
  useEffect(() => { if (audio.current) audio.current.volume = volume; }, [volume]);
  useEffect(() => {
    if (formState === "success") confirmationRef.current?.focus();
    if (formState === "error") formErrorRef.current?.focus();
  }, [formState]);

  function choose(track: Track) {
    setAudioError(false);
    if (current?.id === track.id) {
      if (audio.current?.paused) audio.current.play().catch(() => setAudioError(true));
      else audio.current?.pause();
    } else {
      playIntent.current = true;
      setPlaying(false); setTime(0); setDuration(0); setCurrent(track);
    }
  }
  function next(offset: number) {
    if (!current) return;
    const index = tracks.findIndex((track) => track.id === current.id);
    choose(tracks[(index + offset + tracks.length) % tracks.length]);
  }
  function inquire(type: Service, choice = "") {
    if (timer.current) clearTimeout(timer.current);
    setService(type); setSelection(choice); setFormState("idle");
    setDetails(null);
    document.getElementById("contact")?.scrollIntoView({ behavior: "instant" });
    window.setTimeout(() => nameRef.current?.focus(), 0);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setFormState("sending");
    timer.current = setTimeout(() => {
      timer.current = null;
      setFormState(data.get("fail") ? "error" : "success");
    }, 350);
  }
  function resetForm() {
    setSelection(""); setService("Beat License"); setFormState("idle");
    window.setTimeout(() => nameRef.current?.focus(), 0);
  }
  function social(name: string) {
    setInfo({ title: `${name} / demo channel`, body: "This fictional portfolio is not connected to social or streaming accounts. No artist endorsement or external music destination is implied. Listen to the original synthetic previews in the beat library instead." });
  }
  const nav = [["Beats", "#beats"], ["Discography", "#discography"], ["About", "#about"], ["Clients", "#clients"], ["Contact", "#contact"]];
  const socials = <><button className="icon-button" aria-label="Instagram demo channel" onClick={() => social("Instagram")}><Camera size={18} /></button><button className="icon-button" aria-label="YouTube demo channel" onClick={() => social("YouTube")}><Video size={20} /></button><button className="icon-button" aria-label="SoundCloud demo channel" onClick={() => social("SoundCloud")}><AudioLines size={20} /></button><button className="icon-button" aria-label="Spotify demo channel" onClick={() => social("Spotify")}><Radio size={19} /></button></>;

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={scrolled ? "header scrolled" : "header"}>
      <a className="wordmark" href="#home" aria-label="KVOLT home">K<span>V</span>OLT<i>®</i></a>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <div className="nav-actions"><div className="socials">{socials}</div><a className="button small" href="#licenses">License a Beat <ArrowRight size={14} /></a></div>
      <button ref={menuButton} className="icon-button menu-button" aria-label="Open navigation" aria-expanded={menu} onClick={() => setMenu(true)}><Menu /></button>
    </header>
    <dialog ref={menuRef} className="mobile-menu" aria-label="Mobile navigation" onCancel={() => setMenu(false)}>
      <div className="mobile-menu-top"><span className="wordmark">KVOLT</span><button className="icon-button" aria-label="Close navigation" onClick={() => { setMenu(false); menuButton.current?.focus(); }}><X /></button></div>
      <nav>{nav.map(([label, href], index) => <a key={href} href={href} onClick={() => setMenu(false)}><small>0{index + 1}</small>{label}<ArrowRight /></a>)}</nav>
      <a className="button" href="#licenses" onClick={() => setMenu(false)}>License a Beat</a>
      <div className="socials">{socials}</div><p className="micro">FICTIONAL PRODUCER / LOCAL DEMO</p>
    </dialog>

    <main id="main">
      <section id="home" className="hero">
        <div className="hero-image" /><div className="hero-shade" />
        <div className="hero-side"><span>ATLANTA, GA</span><i /><span>33.7490° N / 84.3880° W</span></div>
        <div className="hero-content">
          <div className="hero-status"><span /> INDEPENDENT SOUND. UNLIMITED POSSIBILITIES.</div>
          <p className="eyebrow">PRODUCER · SONGWRITER · ENGINEER</p>
          <h1>KVOLT<span>®</span></h1>
          <p className="hero-tagline">Crafting hits from Atlanta to the world.</p>
          <p className="hero-sub">Heavy lows. Honest melodies. A sound that stays with you.</p>
          <div className="hero-buttons"><a className="button" href="#beats"><Play size={16} fill="currentColor" /> Browse Beats</a><button className="button outline" onClick={() => inquire("Studio Session")}>Book a Session <ArrowRight size={16} /></button></div>
          <div className="hero-stats"><span><strong>50M+</strong> streams</span><i /><span><strong>200+</strong> placements</span><i /><span><strong>12</strong> years in the game</span></div>
          <p className="fiction-note">A fictional artist universe. All statistics, credits, and availability are demo concepts.</p>
        </div>
        <div className="hero-bottom"><span>TURN IT UP. FIND YOUR SOUND.</span><a href="#beats" aria-label="Scroll to latest beats"><ArrowDown size={18} /></a><span>VOL. 029 — 2026</span></div>
        <div className="hero-wave" aria-hidden="true">{Array.from({ length: 83 }, (_, index) => <i key={index} style={{ height: `${8 + ((index * 17 + 13) % 70)}px`, animationDelay: `${index * -.09}s` }} />)}</div>
      </section>

      <div className="demo-strip"><span className="live-dot" /> ORIGINAL SYNTH PREVIEWS <span>NO SAMPLES. NO COPIED RECORDINGS.</span><span>LOCAL DEMO / NO PURCHASES OR REAL BOOKINGS</span></div>

      <section id="beats" className="section beats-section">
        <div className="section-heading"><div><p className="eyebrow">01 / THE BEAT LIBRARY</p><h2>Latest Beats<span className="purple">.</span></h2></div><a className="text-link" href="#beat-filters" onClick={() => { setGenre("All"); setQuery(""); }}>View All <ArrowRight size={16} /></a></div>
        <div id="beat-filters" className="beat-toolbar"><div className="filters" aria-label="Filter beats by genre">{(["All", "Trap", "R&B", "Cinematic"] as const).map((value) => <button key={value} aria-pressed={genre === value} onClick={() => setGenre(value)}>{value === "All" ? "All Beats" : value}</button>)}</div><label className="search"><SlidersHorizontal size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find your sound…" aria-label="Search beats" /></label></div>
        <p className="results micro" role="status">{filtered.length} ORIGINAL DEMO {filtered.length === 1 ? "PREVIEW" : "PREVIEWS"} · 14 SECONDS EACH</p>
        <div className="beat-grid">{filtered.map((track, index) => <article key={track.id} className={current?.id === track.id ? "beat-card selected" : "beat-card"}>
          <div className="beat-art"><Cover art={track.art} title={track.title} /><span className="beat-number">0{tracks.indexOf(track) + 1}</span><button className="play-orb" aria-label={`${playing && current?.id === track.id ? "Pause" : "Play"} ${track.title}`} onClick={() => choose(track)}>{playing && current?.id === track.id ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}</button></div>
          <div className="beat-meta"><span className="genre-pill">{track.mood}</span><span className="micro">WAV / MP3</span></div>
          <button className="track-title" aria-label={`Details for ${track.title}`} onClick={() => setDetails(track)}>{track.title}<ArrowRight size={17} /></button>
          <div className="track-bottom"><p>{track.bpm} BPM <span>·</span> {track.key}</p><button aria-label={`License ${track.title}`} onClick={() => inquire("Beat License", `${track.title} · Basic · $29.99`)}>From <strong>$29.99</strong></button></div>
          {current?.id === track.id && <div className={`track-wave ${playing ? "active" : ""}`} aria-label={playing ? "Playing preview" : "Preview paused"}>{Array.from({ length: 48 }, (_, bar) => <i key={bar} style={{ height: `${5 + Math.abs(Math.sin(bar * 1.7 + time)) * 19}px`, opacity: bar / 48 <= time / (duration || 14) ? 1 : .25, animationDelay: `${bar * -.04}s` }} />)}</div>}
          <span className="sr-only">Preview {index + 1} of {filtered.length}. Fictional track.</span>
        </article>)}</div>
        {filtered.length === 0 && <div className="empty"><AudioLines size={34} /><h3>No beats in this mix.</h3><p>Try a different title or open up the genre filter.</p><button className="button" onClick={() => { setQuery(""); setGenre("All"); }}>Reset filters</button></div>}
        <div className="library-note"><Headphones size={17} /><p>Find your pocket. Every preview is an original, short synthesized sketch — not a finished production.</p></div>
      </section>

      <section id="licenses" className="section license-section">
        <div className="section-heading"><div><p className="eyebrow">02 / MAKE IT YOURS</p><h2>One beat. Your story.</h2><p>Choose a license that fits your project. All beats are exclusive-ready in this demo concept.</p></div><span className="section-tag">LICENSE A BEAT</span></div>
        <p className="notice">Illustrative license terms only. Selecting a tier starts a local inquiry, not a purchase or rights transfer.</p>
        <div className="license-grid">{tiers.map((tier) => <article key={tier.name} className={`license-card ${tier.name === "Premium" ? "popular" : ""}`}>
          <div className="tier-header"><h3>{tier.name}</h3>{tier.name === "Premium" ? <span className="genre-pill">MOST POPULAR</span> : tier.name === "Exclusive" ? <span className="micro">FULL OWNERSHIP*</span> : <Disc3 size={22} />}</div>
          <p className="tier-price">{tier.price}<span> / license</span></p><p>{tier.note}</p>
          <ul>{tier.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul>
          <button className={`button ${tier.name === "Premium" ? "" : "outline"}`} onClick={() => inquire("Beat License", `${current?.title || "Beat to be selected"} · ${tier.name} · ${tier.price}`)}>Select {tier.name}<ArrowRight size={16} /></button>
        </article>)}</div>
        <p className="center-note">Something a little different? <button onClick={() => inquire("Other")}>Let&apos;s talk about a custom deal <ArrowRight size={14} /></button></p>
      </section>

      <section id="discography" className="section discography-section">
        <div className="section-heading"><div><p className="eyebrow">03 / IN GOOD COMPANY</p><h2>Discography & Placements<span className="purple">.</span></h2></div><span className="section-tag">SELECTED WORK / 2023—2025</span></div>
        <p className="notice">Fictional artists, releases, credits, and stream counts. No real artist or label affiliations.</p>
        <div className="credits-row" aria-label="Fictional discography" tabIndex={0}>{credits.map((credit) => <button className="credit" key={credit.artist} onClick={() => setInfo({ title: `${credit.artist} — ${credit.title}`, body: `${credit.role} · ${credit.year}. ${credit.streams} imagined streams. This is a fictional placement with original abstract cover art, not a released recording. No streaming provider is connected.` })}>
          <Cover art={credit.art} title={credit.title} /><span className="credit-year">{credit.year} / FICTIONAL</span><h3>{credit.artist}</h3><p>{credit.title}</p><span className="micro">{credit.streams} imagined streams <ArrowRight size={14} /></span>
        </button>)}</div>
        <div className="discography-bottom"><p>A world built on sound. <span>200+ imagined placements.</span></p><button className="text-link" onClick={() => setInfo({ title: "The complete demo discography", body: credits.map((credit) => `${credit.year} — ${credit.artist}, “${credit.title}” (${credit.role}).`).join(" ") + " These six fictional releases represent a concept portfolio; 200+ is an illustrative brand statistic, not a real catalog." })}>View all credits <ArrowRight size={16} /></button></div>
      </section>

      <section id="about" className="section about-section">
        <div className="studio-portrait" role="img" aria-label="Original illustration of KVOLT's imagined purple-lit studio"><div className="studio-label"><span className="live-dot" /> THE PROCESS IS PERSONAL.</div><div className="portrait-caption"><span>KV / ATLANTA</span><strong>Where the<br />feeling takes shape.</strong><span>ORIGINAL STUDIO ILLUSTRATION</span></div></div>
        <div className="about-copy"><p className="eyebrow">04 / BEHIND THE SOUND</p><h2>More than a beat.<br />A point of view.</h2><p className="about-intro">I&apos;m Kevin Volt. Atlanta raised me.<br />The music did the rest.</p>
          <p>In this fictional story, a fourteen-year-old with a bedroom setup becomes KVOLT: twelve years of late nights, 500 original ideas, and an obsession with making the next one feel different.</p>
          <p>My sound lives between trap, R&B, and cinematic production. Heavy 808s. Melodic layers. Enough space for an artist to tell the truth. From an imagined Midtown studio to your headphones, the feeling comes first.</p>
          <p>One beat or a whole album — I bring the same energy and attention to every detail.</p>
          <div className="credentials"><span><Music2 />500+ imagined beats</span><span><Disc3 />3 concept award projects</span><span><Headphones />50M+ fictional streams</span><span><AudioLines />Self-taught demo persona</span></div>
          <p className="fiction-note">Biography, awards, gear, and experience are fictional. No Grammy, Berklee, or real studio affiliation is claimed.</p>
          <a className="text-link" href="#contact">Let&apos;s make something that matters <ArrowRight size={16} /></a>
        </div>
      </section>

      <section id="clients" className="section clients-section"><p className="eyebrow center">TRUSTED BY / FICTIONAL COLLABORATORS</p><div className="client-logos"><span>HALO<span className="logo-sub">SOUND COLLECTIVE</span></span><span className="client-serif">eastside.</span><span>NOCTURNE®</span><span className="client-outline">WAV / CO</span><span className="client-serif">Meridian</span><span>BLKROOM<span className="logo-sub">INDEPENDENT RECORDS</span></span></div><p className="center-note">An imagined network of labels and 30+ independent artists worldwide. No real endorsements.</p></section>

      <section className="section testimonials"><div className="section-heading"><div><p className="eyebrow">05 / WORD ON THE SOUND</p><h2>What artists say.</h2></div><span className="section-tag">FICTIONAL REVIEWS</span></div><div className="testimonial-grid">{[
        ["NR", "“KVOLT understands the vibe before you even explain it. We knocked out six ideas in one session.”", "Nova Reign", "HIP-HOP ARTIST"],
        ["ES", "“The mix feels intentional from the first bounce. There’s always room for my voice to be my voice.”", "Eli Sol", "R&B ARTIST"],
        ["MV", "“I came for one beat. Four songs later, we had the sound of the entire project. That’s the difference.”", "Mira V", "INDEPENDENT ARTIST"],
      ].map(([initials, quote, name, role]) => <figure key={name}><span className="quote-mark">“</span><blockquote>{quote}</blockquote><figcaption><span className="avatar">{initials}</span><span><strong>{name}</strong><small>{role} · DEMO REVIEW</small></span></figcaption></figure>)}</div></section>

      <section id="studio" className="section services-section"><div className="section-heading"><div><p className="eyebrow">06 / FROM IDEA TO IMPACT</p><h2>Let&apos;s build your sound.</h2><p>One collaborator. Every stage of the process.</p></div><span className="section-tag">STUDIO & SERVICES</span></div><div className="service-grid">{services.map((item, index) => { const Icon = [Music2, Mic2, SlidersHorizontal, Radio][index]; return <button className="service-card" key={item.title} onClick={() => inquire(item.type)}><Icon size={28} /><span className="micro">{item.label}</span><h3>{item.title}<ArrowRight size={21} /></h3><p>{item.description}</p><span className="service-action">Start a conversation <ArrowRight size={14} /></span></button>; })}</div></section>

      <section id="contact" className="section contact-section">
        <div className="contact-copy"><p className="eyebrow">07 / THE NEXT GREAT THING</p><h2>Let&apos;s<br />work<span className="purple">.</span></h2><p>Whether it&apos;s a beat license, custom production, or a studio session — let&apos;s make something great.</p><div className="contact-status"><span className="live-dot" /> OPEN TO IDEAS / DEMO AVAILABILITY</div><p className="micro">ILLUSTRATIVE RESPONSE TIME: UNDER 4 HOURS</p><button className="contact-email" onClick={() => setInfo({ title: "Local inquiries only", body: "hello@kvolt.example and +1 (404) 555-0129 are fictional contact details. No email or phone service is connected. Use the local inquiry form to preview the experience without transmitting data." })}>hello@kvolt.example <ArrowRight size={17} /></button><p className="micro">+1 (404) 555-0129 · FICTIONAL CONTACT</p><div className="socials">{socials}<button className="icon-button" aria-label="Twitter demo channel" onClick={() => social("Twitter")}><span>𝕏</span></button></div></div>
        <div className="contact-panel">
          {formState === "success" ? <div ref={confirmationRef} tabIndex={-1} className="success-panel" role="status"><span className="success-icon"><Check size={30} /></span><p className="eyebrow">LOCAL PREVIEW COMPLETE</p><h3>Your next chapter starts here.</h3><p>Your {service.toLowerCase()} inquiry was simulated successfully. Nothing was sent, booked, paid, or saved to a server.</p>{selection && <p className="selection-summary">{selection}</p>}<button className="button" onClick={resetForm}>Start a new inquiry <ArrowRight size={16} /></button></div> :
          <form onSubmit={submit}><fieldset disabled={formState === "sending"}>
            <p className="form-note">LOCAL INQUIRY DEMO <span>NO DATA LEAVES THIS PAGE</span></p>
            {selection && <div className="selection-summary">Interested in: {selection}<button type="button" aria-label="Clear beat selection" onClick={() => setSelection("")}><X size={16} /></button></div>}
            <div className="form-row"><label>Your name<input ref={nameRef} name="name" autoComplete="name" placeholder="How should I call you?" required maxLength={100} /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@yourworld.com" required maxLength={180} /></label></div>
            <div className="form-row"><label>What do you need?<select name="service" value={service} onChange={(event) => setService(event.target.value as Service)}>{(["Beat License", "Custom Production", "Studio Session", "Mixing & Mastering", "Sync Licensing", "Other"] as Service[]).map((item) => <option key={item}>{item}</option>)}</select></label><label>Your budget<select name="budget" defaultValue="" required><option value="" disabled>Select a range</option>{["Under $500", "$500–$1,000", "$1,000–$5,000", "$5,000+", "Let's Discuss"].map((item) => <option key={item}>{item}</option>)}</select></label></div>
            {service === "Studio Session" && <label>Preferred session date<input name="date" type="date" min={minDate} required /><small>A preferred date only. No studio availability is connected.</small></label>}
            <label>Tell me about your project<textarea name="description" rows={4} required minLength={15} maxLength={2500} placeholder="The sound, the story, the vision. I’m listening." /></label>
            <label>Reference track URL <span className="muted">(optional)</span><input name="reference" type="url" placeholder="https://…" maxLength={500} /></label>
            <label className="demo-toggle"><input name="fail" type="checkbox" /> Simulate a delivery error (demo recovery test)</label>
            {formState === "error" && <p ref={formErrorRef} tabIndex={-1} role="alert" className="form-error">Demo delivery failed. Your fields are intact. Uncheck the error simulation and send again.</p>}
            <button type="submit" className="button send-button" disabled={formState === "sending"}>{formState === "sending" ? "Simulating delivery…" : "Send Message"}<ArrowRight size={17} /></button>
            <p className="form-disclaimer">No real bookings, payments, emails, or rights transfers. Please use fictional information.</p>
          </fieldset></form>}
        </div>
      </section>
    </main>

    <footer className={current ? "footer player-space" : "footer"}>
      <div className="footer-top"><div><a className="wordmark" href="#home">KVOLT<i>®</i></a><p>Made for the feeling.<br />Atlanta to wherever you are.</p><span className="micro">FICTIONAL PRODUCER / ORIGINAL DEMO</span></div><div><h3>EXPLORE</h3>{[...nav.filter(([label]) => label !== "Clients"), ["Studio", "#studio"]].map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div><div><h3>THE DETAILS</h3>{["Terms of Service", "License Agreement", "Privacy Policy", "Refund Policy"].map((title) => <button key={title} onClick={() => setInfo({ title, body: title === "Privacy Policy" ? "This demo uses only in-memory interface state. No inquiry data, newsletter email, account, analytics, or payment information is transmitted or stored by the application. Reloading clears the local form state." : "This is a noncommercial fictional portfolio demonstration. Listed pricing, licensing rights, availability, and delivery promises are illustrative and are not an offer or contract. No purchases, bookings, downloads of licensed stems, or refunds are processed. Synthetic preview files are original demo assets; no third-party recording or endorsement is involved." })}>{title}</button>)}</div><div className="newsletter"><h3>STAY IN THE LOOP</h3><p>Free beat drops. Fresh inspiration. No noise.</p>{newsletter ? <div className="newsletter-done" role="status"><Check size={18} /><span>Demo subscribed. No email saved.</span><button onClick={() => setNewsletter(false)}>Reset</button></div> : <form onSubmit={(event) => { event.preventDefault(); setNewsletter(true); }}><label className="sr-only" htmlFor="newsletter-email">Newsletter email</label><input id="newsletter-email" type="email" placeholder="Your email address" required /><button className="icon-button" aria-label="Subscribe to demo newsletter"><ArrowRight size={18} /></button></form>}<small>Local simulation only. No mailing list.</small><div className="socials">{socials}</div></div></div>
      <div className="footer-bottom"><span>© 2026 KVOLT Productions · Fictional demo.</span><span>Original synth compositions. Illustrative prices; no real exclusivity.</span><a href="#home">BACK TO TOP ↑</a></div>
    </footer>

    <audio ref={audio} preload="metadata" onPlay={() => { setPlaying(true); setAudioError(false); }} onPause={() => setPlaying(false)} onTimeUpdate={() => setTime(audio.current?.currentTime || 0)} onLoadedMetadata={() => setDuration(audio.current?.duration || 0)} onEnded={() => next(1)} onError={() => { if (current) { setAudioError(true); setPlaying(false); } }} />
    {current && <aside className="player" aria-label="Beat player">
      <div className="player-track"><Cover art={current.art} title={current.title} small /><div><strong>{current.title}</strong><span>KVOLT · ORIGINAL DEMO</span></div></div>
      <div className="player-center"><div className="transport"><button className="icon-button" aria-label="Previous beat" onClick={() => next(-1)}><ChevronLeft size={21} /></button><button className="player-play" aria-label={playing ? "Pause preview" : "Play preview"} onClick={() => choose(current)}>{playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</button><button className="icon-button" aria-label="Next beat" onClick={() => next(1)}><ChevronRight size={21} /></button><span className="micro playlist-position">{tracks.indexOf(current) + 1} / {tracks.length}</span></div><div className="seek-row"><output aria-label="Playback position">{formatTime(time)}</output><input aria-label="Seek preview" type="range" min={0} max={duration || 14} step={0.1} value={Math.min(time, duration || 14)} onChange={(event) => { const value = Number(event.target.value); if (audio.current && duration) { audio.current.currentTime = value; setTime(value); } }} /><span>{formatTime(duration)}</span></div></div>
      <div className="player-right"><label className="volume"><Volume2 size={17} /><span className="sr-only">Volume</span><input aria-label="Volume" type="range" min={0} max={1} step={0.05} value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label><button className="button small" onClick={() => inquire("Beat License", `${current.title} · license to be selected`)}>License <span className="desktop-label">This Beat</span><ArrowRight size={15} /></button><button className="icon-button" aria-label="Close player and stop audio" onClick={() => { audio.current?.pause(); audio.current?.removeAttribute("src"); audio.current?.load(); setCurrent(null); setAudioError(false); setPlaying(false); }}><X size={18} /></button></div>
      {audioError && <div role="alert" className="audio-error">Preview unavailable. <button onClick={() => { if (audio.current) { audio.current.src = `/audio/${current.id}.wav`; audio.current.load(); audio.current.play().catch(() => setAudioError(true)); } }}>Retry preview</button><span> or choose another beat.</span></div>}
    </aside>}
    {details && <Modal title={details.title} close={() => setDetails(null)}><Cover art={details.art} title={details.title} /><p>{details.description}</p><p>{details.mood} · {details.bpm} BPM · {details.key}</p><p className="notice">Fictional track. Original 14-second synthetic preview, not a full song. Preview tempo is illustrative of the production concept.</p><div className="modal-actions"><button className="button outline" onClick={() => choose(details)}>{current?.id === details.id && playing ? "Pause" : "Play"} preview</button><button className="button" onClick={() => inquire("Beat License", `${details.title} · license to be selected`)}>Inquire about license</button></div></Modal>}
    {info && <Modal title={info.title} close={() => setInfo(null)}><p>{info.body}</p><button className="button outline" onClick={() => setInfo(null)}>Got it</button></Modal>}
  </>;
}
