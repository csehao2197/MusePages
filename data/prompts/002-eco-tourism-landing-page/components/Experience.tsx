"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Check, ChevronLeft, ChevronRight, Cloud, Compass, Handshake, Heart, Leaf, MapPin, Menu, Minus, Plus, ShieldCheck, Sprout, Star, TreePine, X } from "lucide-react";
import { catalog, cities, estimate, lodges, trips, type Trip } from "./data";
import Scene from "./Scene";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
function SocialIcon({ channel }: { channel: string }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    {channel === "Instagram" ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1" fill="currentColor" /></>
      : channel === "YouTube" ? <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 6 3-6 3Z" /></>
      : channel === "LinkedIn" ? <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7m0-11v1m5 10v-7m0 3q5-6 5 0v4" /></>
      : <path d="M14 3v13a4 4 0 1 1-4-4m4-9q0 6 6 6" />}
  </svg>;
}
const stories = [
  { quote: "This wasn't just a vacation — it was the most meaningful week of my life. Watching baby turtles reach the ocean knowing our trip funded their protection was unforgettable.", name: "Emma & Jake", city: "Portland", trip: "Costa Rica Retreat", initials: "EJ", color: "#b8cfb0" },
  { quote: "I've traveled to 40+ countries, and Verdant Journeys is the only company that makes sustainability feel effortless, not like a compromise.", name: "Akira Tanaka", city: "Tokyo", trip: "Norway Fjords", initials: "AT", color: "#bbcdd2" },
  { quote: "The impact report at the end blew me away. 14 trees planted, 2.4 tons offset, and a school in Kenya that our trip directly funded.", name: "Sarah Mitchell", city: "London", trip: "Kenya Safari", initials: "SM", color: "#ddc8af" },
];
const infoText: Record<string, string> = {
  "Our sustainability standards": "This is a fictional travel-company demo. Carbon Neutral, B Corp, 1% for the Planet, GSTC, Rainforest Alliance and WWF names are reference labels, not verified certifications or partnerships. Eco Certified badges, ratings, reviews, tree planting, renewable energy and impact totals are illustrative. A real operator would publish current certificates, methodology, verified project IDs and independent audit reports before making these claims. No offsets are purchased here.",
  About: "Verdant Journeys is a fictional slow-travel studio built around nature, community-led guiding and smaller groups. Every itinerary on this page is demonstration data, not a bookable product.",
  Careers: "Our imaginary team includes naturalists, trip designers and community liaisons. No real vacancies or applications are offered in this local demo.",
  Press: "This prototype has no real press coverage. All company names, traveler stories and statistics are illustrative.",
  FAQ: "Prices are illustrative per person in USD, excluding international flights. Suggested itineraries include accommodation, guides and local transport. Dates, access needs and availability would be confirmed by a real operator; nothing on this site reserves a place.",
  Contact: "Choose a trip and use its inquiry form to try a local request. No email or network request is sent, and we do not operate a real travel support line.",
  "Travel Insurance": "No insurance is sold here. In a real trip, travelers should compare independent cover for medical care, evacuation, cancellation and adventure activities with a licensed provider.",
  "Cancellation Policy": "No payment or reservation occurs in this demo, so there is nothing to cancel. A real operator would supply detailed terms and refund deadlines before any purchase.",
  Privacy: "Inquiry and newsletter details remain only in this page's memory, disappear on reload and are not sent to any service. Avoid entering sensitive or real personal information.",
  Terms: "This is a local design demonstration, not an offer of travel services. All prices, availability, ratings and claims are fictional.",
  Accessibility: "Use keyboard navigation, visible focus rings, native form controls, Escape to close dialogs, reduced-motion preferences and labeled carousel controls. All illustrations have text alternatives.",
};

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [number, setNumber] = useState(value);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1200, 1);
        setNumber(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: .5 });
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={ref} aria-label={`${value.toLocaleString("en-US")}${suffix}`}><span aria-hidden="true">{number.toLocaleString("en-US")}{suffix}</span></span>;
}

export default function Experience() {
  const [menu, setMenu] = useState(false);
  const [all, setAll] = useState(false);
  const [destination, setDestination] = useState("");
  const [activity, setActivity] = useState("");
  const [impact, setImpact] = useState("");
  const [selected, setSelected] = useState<Trip | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [receipt, setReceipt] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const [departure, setDeparture] = useState("London");
  const [arrival, setArrival] = useState("Costa Rica");
  const [travelers, setTravelers] = useState(1);
  const [result, setResult] = useState<ReturnType<typeof estimate>>(null);
  const [calcError, setCalcError] = useState("");
  const [story, setStory] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [lodge, setLodge] = useState(0);
  const lodgeRail = useRef<HTMLDivElement>(null);
  const lodgeTarget = useRef<{ index: number; left: number } | null>(null);
  const touchStart = useRef<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const activeDialog = Boolean(selected || info);
  useEffect(() => {
    if (activeDialog) { dialog.current?.showModal(); document.body.style.overflow = "hidden"; }
    else { dialog.current?.close(); document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [activeDialog]);
  useEffect(() => {
    if (receipt) dialog.current?.querySelector<HTMLButtonElement>(".success button")?.focus();
  }, [receipt]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPaused(true); return; }
    const update = () => setScrollY(Math.min(window.scrollY, 900));
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (paused || hovered) return;
    const timer = setInterval(() => { if (!document.hidden) setStory(s => (s + 1) % stories.length); }, 6000);
    return () => clearInterval(timer);
  }, [paused, hovered]);
  const close = () => { setSelected(null); setInfo(null); setReceipt(""); };
  const filtered = (all ? catalog : trips).filter(t => (!destination || t.destination === destination) && (!activity || t.activity === activity) && (!impact || t.impact === impact));
  const reset = () => { setDestination(""); setActivity(""); setImpact(""); };
  const openTrip = (trip: Trip) => { setReceipt(""); setSelected(trip); };
  const clearCalc = () => { setResult(null); setCalcError(""); };
  const goLodge = (index: number) => {
    const rail = lodgeRail.current;
    const card = rail?.children[index] as HTMLElement | undefined;
    const left = rail && card ? Math.min(card.offsetLeft - rail.offsetLeft, rail.scrollWidth - rail.clientWidth) : 0;
    lodgeTarget.current = { index, left };
    rail?.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    setLodge(index);
  };
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <div className="demo-banner">A fictional travel studio · local demo · impact & certifications are illustrative <button onClick={() => setInfo("Our sustainability standards")}>Read our demo standards <ArrowUpRight size={12} /></button></div>
    <header className="header">
      <a href="#" className="brand" aria-label="Verdant Journeys home"><span className="brand-icon"><Leaf size={24} /></span><span>verdant<span className="brand-small">J O U R N E Y S</span></span></a>
      <button className="menu-toggle icon-button" aria-label="Toggle navigation" aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      <nav id="navigation" className={menu ? "navigation open" : "navigation"} aria-label="Main navigation">
        {[["Our trips", "#trips"], ["Our impact", "#impact"], ["Eco-lodges", "#lodges"], ["Travel stories", "#stories"]].map(([name, href]) => <a key={name} href={href} onClick={() => setMenu(false)}>{name}</a>)}
        <a href="#trips" className="button small" onClick={() => setMenu(false)}>Find your journey <ArrowUpRight size={16} /></a>
      </nav>
    </header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-art" role="img" aria-label="Illustrated lush tropical rainforest canopy in morning mist" />
        <div className="hero-shade" />
        <Leaf className="floating-leaf leaf-one" style={{ transform: `translateY(${scrollY * .18}px) rotate(${scrollY * .04}deg)` }} aria-hidden="true" />
        <Leaf className="floating-leaf leaf-two" style={{ transform: `translateY(${scrollY * .12}px) rotate(-25deg)` }} aria-hidden="true" />
        <div className="hero-content wrap">
          <p className="eyebrow"><span /> SMALL FOOTPRINT. EXTRAORDINARY WORLD.</p>
          <h1 id="hero-heading">Travel the World.<br />Leave Only <em>Footprints.</em></h1>
          <p className="hero-description">Handpicked eco-lodges, carbon-neutral trips, and wildlife experiences that fund conservation.</p>
          <div className="hero-actions"><a className="button" href="#trips">Explore Trips <ArrowUpRight size={19} /></a><a className="button outline" href="#impact">Our Impact <Leaf size={18} /></a></div>
          <div className="hero-bottom"><span><MapPin size={15} /> Monteverde Cloud Forest, Costa Rica · illustrated</span><a href="#impact">A little further, a little greener <ArrowDown size={16} /></a></div>
        </div>
      </section>
      <div className="trust" aria-label="Illustrative certification labels"><span><ShieldCheck /> Carbon Neutral Certified</span><span><Sprout /> 1% for the Planet Member</span><span><span className="b-logo">B</span> B Corp Certified</span><small>Demo claims — not verified affiliations</small></div>
      <section id="impact" className="impact">
        <div className="wrap"><div className="impact-intro"><p className="eyebrow">GOOD JOURNEYS. GROWING IMPACT.</p><span>Our imagined journey so far · unaudited demo totals</span></div>
          <div className="stats">{[[12400, "Trees Planted", TreePine, "+"], [340, "Tons of CO₂ Offset", Cloud, ""], [28, "Conservation Partners", Handshake, ""], [8500, "Happy Eco-Travelers", Heart, "+"]].map(([value, label, Icon, suffix]) => {
            const StatIcon = Icon as typeof TreePine;
            return <div className="stat" key={String(label)}><StatIcon size={25} /><strong><Counter value={Number(value)} suffix={String(suffix)} /></strong><span>{String(label)}</span></div>;
          })}</div>
        </div>
      </section>
      <section id="trips" className="section wrap">
        <div className="section-heading"><div><p className="eyebrow">GO SOMEWHERE. GIVE SOMETHING BACK.</p><h2>Sustainable Adventures Await</h2><p>Every trip funds local conservation and community projects.</p></div><span className="section-aside"><Compass size={22} /> Thoughtfully curated.<br /> Never mass-produced.</span></div>
        <div className="filters" aria-label="Filter adventures">
          <label>Destination<select aria-label="Destination" value={destination} onChange={e => setDestination(e.target.value)}><option value="">All destinations</option>{trips.map(t => <option key={t.id}>{t.destination}</option>)}</select></label>
          <label>Activity<select aria-label="Activity" value={activity} onChange={e => setActivity(e.target.value)}><option value="">All activities</option>{["Wildlife", "Adventure", "Marine"].map(t => <option key={t}>{t}</option>)}</select></label>
          <label>Impact type<select aria-label="Impact type" value={impact} onChange={e => setImpact(e.target.value)}><option value="">Every kind of impact</option>{["Reforestation", "Clean energy", "Conservation", "Community"].map(t => <option key={t}>{t}</option>)}</select></label>
          <button className="text-button" onClick={reset}>Reset filters</button><span role="status" className="result-count">{filtered.length} {all ? "of 24" : "featured"} trips</span>
        </div>
        <div className="trip-grid">{filtered.map(trip => <article className="trip-card" key={trip.id}>
          <div className="trip-image"><Scene kind={trip.scene} label={trip.name} /><span className="eco-badge"><Leaf size={12} /> Eco Certified*</span><span className="location"><MapPin size={12} /> {trip.destination}</span></div>
          <div className="trip-body"><div className="card-meta"><span>{trip.days} DAYS · SMALL GROUP</span><span className="rating"><Star size={13} fill="currentColor" /> {trip.rating} <small>({trip.reviews})</small></span></div>
            <h3>{trip.name}</h3><div className="tags">{trip.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            <p className="trip-impact"><Sprout size={15} /> {trip.highlight}</p><div className="card-bottom"><span><small>from </small><strong>{money(trip.price)}</strong><small> / person</small></span><button aria-label={`View ${trip.name}`} onClick={() => openTrip(trip)}>View Trip <ArrowRight size={17} /></button></div>
          </div>
        </article>)}</div>
        {filtered.length === 0 && <div className="empty"><Compass /><h3>No journeys match this combination.</h3><p>Try another activity or explore every destination.</p><button className="button" onClick={reset}>Clear filters</button></div>}
        <div className="catalog-bottom"><button className="button pale" onClick={() => { setAll(!all); reset(); }}>{all ? "Show 6 featured trips" : "View All 24 Trips"} <ArrowRight size={17} /></button><small>*Illustrative eco labels and fictional traveler reviews. All imagery is original illustrated art.</small></div>
      </section>
      <section className="how section">
        <div className="wrap"><div className="center-heading"><p className="eyebrow">LESS PLANNING. MORE PURPOSE.</p><h2>Green Travel, Simplified</h2><p>A better way to get away, from the first click to the last footprint.</p></div>
          <div className="steps">{[
            [Compass, "Choose Your Adventure", "Browse our curated eco-trips filtered by destination, activity, and impact type"],
            [Leaf, "We Offset Everything", "Flights, transport, accommodation — we calculate and offset 200% of your carbon footprint"],
            [MapPin, "Travel with Purpose", "Stay at certified eco-lodges, eat local, and participate in conservation activities"],
            [BarChart3, "See Your Impact", "Get a personalized impact report showing trees planted, CO₂ saved, and communities supported"],
          ].map(([Icon, title, text], index) => { const StepIcon = Icon as typeof Leaf; return <article key={String(title)}><div className="step-number">{index + 1}</div><StepIcon size={30} /><h3>{String(title)}</h3><p>{String(text)}</p></article>; })}</div>
          <p className="disclaimer">Our intended travel model, illustrated only. This demo does not buy offsets, fund projects or issue audited impact reports.</p>
        </div>
      </section>
      <section id="lodges" className="section wrap">
        <div className="section-heading"><div><p className="eyebrow">WAKE UP SOMEWHERE WONDERFUL.</p><h2>Where You&apos;ll Stay</h2><p>Handpicked accommodations that prove luxury and sustainability aren&apos;t mutually exclusive.</p></div><div className="rail-controls"><button className="icon-button" aria-label="Previous lodge" disabled={lodge === 0} onClick={() => goLodge(lodge - 1)}><ChevronLeft /></button><button className="icon-button" aria-label="Next lodge" disabled={lodge === 3} onClick={() => goLodge(lodge + 1)}><ChevronRight /></button></div></div>
        <div className="lodge-rail" ref={lodgeRail} onPointerDown={() => { lodgeTarget.current = null; }} onWheel={() => { lodgeTarget.current = null; }} onScroll={() => { const rail = lodgeRail.current; if (rail) { if (lodgeTarget.current) { setLodge(lodgeTarget.current.index); return; } const cards = Array.from(rail.children) as HTMLElement[]; const nearest = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - rail.offsetLeft - rail.scrollLeft) < Math.abs(cards[best].offsetLeft - rail.offsetLeft - rail.scrollLeft) ? index : best, 0); setLodge(nearest); } }}>
          {lodges.map(l => <article className="lodge-card" key={l.name}><div className="lodge-image"><Scene kind={l.scene} label={l.name} /><span className="location"><MapPin size={12} /> {l.place}</span></div><div className="lodge-body"><span className="rating"><Star size={13} fill="currentColor" /> {l.rating}</span><h3>{l.name}</h3><p>{l.text}</p><div className="tags">{l.badges.map(b => <span key={b}><Check size={11} />{b}</span>)}</div><div className="card-bottom"><span><strong>{money(l.price)}</strong><small> / night · demo</small></span><button aria-label={`Learn about ${l.name}`} onClick={() => setInfo(l.name)}>Explore stay <ArrowUpRight size={16} /></button></div></div></article>)}
        </div><div className="dots" aria-label="Choose lodge">{lodges.map((l, i) => <button key={l.name} aria-label={`Show ${l.name}`} aria-pressed={lodge === i} onClick={() => goLodge(i)} />)}</div>
      </section>
      <section id="calculator" className="calculator-section section">
        <div className="wrap calculator-layout"><div className="calculator-copy"><p className="eyebrow">KNOW YOUR FOOTPRINT. MAKE IT LIGHTER.</p><h2>Your Trip&apos;s<br /> <em>Carbon Footprint</em></h2><p>The world is worth exploring. And protecting.<br />See what your journey could mean for the planet.</p><div className="offset-callout"><ShieldCheck /><span>We offset <strong>200%</strong> —<br />at no extra cost to you<small>Illustrative promise, not a real offset purchase.</small></span></div><a className="text-link" href="#standards">How we think about sustainability <ArrowRight size={16} /></a></div>
          <div className="calculator-card"><div className="calculator-title"><Leaf /><h3>A little clarity before you go</h3><span>DEMO ESTIMATE</span></div>
            <form onSubmit={e => { e.preventDefault(); const found = cities.find(c => c.toLowerCase() === departure.trim().toLowerCase()); const calculated = estimate(found || "", arrival, travelers); setResult(calculated); setCalcError(calculated ? "" : "Choose a supported departure city from the suggestions."); }}>
              <div className="calculator-fields"><label>Departure city<input list="departure-cities" value={departure} required onChange={e => { setDeparture(e.target.value); clearCalc(); }} autoComplete="off" aria-describedby="city-help" /></label><datalist id="departure-cities">{cities.map(c => <option key={c} value={c} />)}</datalist><label>Trip destination<select value={arrival} onChange={e => { setArrival(e.target.value); clearCalc(); }}>{trips.map(t => <option key={t.id}>{t.destination}</option>)}</select></label></div>
              <small id="city-help">Supported cities: London, New York, Portland, Tokyo, Sydney, Paris.</small>
              <div className="calculator-submit"><div><label id="travelers-label">Number of travelers</label><div className="stepper" role="group" aria-labelledby="travelers-label"><button type="button" aria-label="Fewer travelers" disabled={travelers === 1} onClick={() => { setTravelers(t => t - 1); clearCalc(); }}><Minus size={16} /></button><output aria-label="Traveler count">{travelers}</output><button type="button" aria-label="More travelers" disabled={travelers === 8} onClick={() => { setTravelers(t => t + 1); clearCalc(); }}><Plus size={16} /></button></div></div><button className="button" type="submit">Calculate <ArrowRight size={17} /></button></div>
            </form>
            {calcError && <p role="alert" className="error">{calcError}</p>}
            <div className="calculator-result" aria-live="polite" aria-atomic="true">{result ? <><div><strong data-testid="co2">{result.kg.toLocaleString("en-US")} kg</strong><span>estimated CO₂</span></div><div><strong data-testid="trees">{result.trees}</strong><span>trees equivalent*</span></div><div><strong data-testid="offset-cost">{money(result.cost)}</strong><span>base offset value*</span></div><p><Check size={15} /> Simulated 200% coverage: {(result.offset).toLocaleString("en-US")} kg · {money(result.cost * 2)} value. Your added cost: $0.</p></> : <p className="calculator-placeholder"><Sprout /> Choose your route to see a simulated estimate.</p>}</div>
            <details><summary>Estimate methodology & limitations</summary><p>Round-trip route distance × 0.115 kg CO₂/km, plus 100 kg per traveler for transport and stays, multiplied by group size and rounded to whole kg. Trees = rounded up kg ÷ 22 (illustrative annual absorption). Base offset value = kg × $0.02. No radiative forcing, cabin class or verified lifecycle data; trees are not an immediate substitute for reducing emissions. Not an audited estimate or actual offset.</p></details>
          </div>
        </div>
      </section>
      <section id="stories" className="section wrap stories">
        <div className="center-heading"><p className="eyebrow">THE BEST SOUVENIRS ARE STORIES.</p><h2>Stories from the Trail</h2><p>Different journeys. A shared love for our planet.</p></div>
        <div className="story-carousel" role="region" aria-label="Fictional traveler stories" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setHovered(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false); }} onTouchStart={e => { touchStart.current = e.touches[0].clientX; }} onTouchEnd={e => { if (touchStart.current !== null) { const delta = e.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 50) { setPaused(true); setStory(s => (s + (delta < 0 ? 1 : 2)) % 3); } touchStart.current = null; } }}>
          <div className="story-track" style={{ transform: `translateX(-${story * 100}%)` }}>{stories.map((s, i) => <article className="story-card" aria-hidden={i !== story} key={s.name}><div className="stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, n) => <Star key={n} size={15} fill="currentColor" />)}</div><blockquote>&ldquo;{s.quote}&rdquo;</blockquote><div className="story-person"><svg viewBox="0 0 60 60" role="img" aria-label={`Illustrated portrait placeholder for ${s.name}`}><circle cx="30" cy="30" r="30" fill={s.color} /><circle cx="30" cy="23" r="11" fill="#4a6751" /><path d="M10 58q0-28 20-28t20 28" fill="#4a6751" /></svg><span><strong>{s.name}</strong><small>{s.city} · {s.trip}</small></span><span className="verified"><Check size={13} /> Fictional traveler</span></div></article>)}</div>
        </div>
        <div className="story-controls"><button className="icon-button" aria-label="Previous story" onClick={() => { setPaused(true); setStory((story + 2) % 3); }}><ChevronLeft /></button><div className="dots">{stories.map((s, i) => <button key={s.name} aria-label={`Read story by ${s.name}`} aria-pressed={story === i} onClick={() => { setPaused(true); setStory(i); }} />)}</div><button className="icon-button" aria-label="Next story" onClick={() => { setPaused(true); setStory((story + 1) % 3); }}><ChevronRight /></button><button className="text-button" onClick={() => setPaused(!paused)}>{paused ? "Play stories" : "Pause stories"}</button></div>
      </section>
      <section id="standards" className="partners section">
        <div className="wrap"><p className="eyebrow">INSPIRED BY A HIGHER STANDARD</p><div className="partner-row">{["1% for the Planet", "B Corp", "Global Sustainable Tourism Council", "Rainforest Alliance", "World Wildlife Fund"].map((name, index) => <button key={name} onClick={() => setInfo("Our sustainability standards")}><span className="partner-mark">{index === 1 ? <span className="b-logo">B</span> : index === 0 ? <strong>1%</strong> : index === 2 ? <Compass /> : index === 3 ? <TreePine /> : <Heart />}</span><span>{name}</span></button>)}</div><p className="disclaimer">Text-only reference marks, not official logos or actual partnerships.</p><button className="text-link" onClick={() => setInfo("Our sustainability standards")}>Learn about our sustainability standards <ArrowRight size={16} /></button></div>
      </section>
      <section className="newsletter section" aria-labelledby="newsletter-title"><div className="newsletter-card"><span className="newsletter-icon"><Sprout size={28} /></span><p className="eyebrow">A LITTLE WILD IN YOUR INBOX.</p><h2 id="newsletter-title">Join 12,000+<br />Conscious Travelers</h2><p>Get monthly trip inspiration, conservation updates, and early access to new destinations.</p>{subscribed ? <div className="success" role="status"><Check /><strong>You&apos;re on the local demo list.</strong><p>No email was sent and no tree was planted. This confirmation lasts until you reload.</p><button className="text-button" onClick={() => setSubscribed(false)}>Try another email</button></div> : <form onSubmit={e => { e.preventDefault(); setSubscribed(true); }}><label className="sr-only" htmlFor="newsletter-email">Newsletter email</label><div className="subscribe-row"><input id="newsletter-email" name="email" type="email" placeholder="Your email address" required maxLength={254} /><button className="button" type="submit">Subscribe <ArrowRight size={16} /></button></div></form>}<span className="tree-promise"><Sprout size={16} /> We plant a tree for every subscriber*</span><small>No spam, ever. Unsubscribe anytime.<br />*Fictional promise. Local demo only; no signup or planting service.</small></div></section>
    </main>
    <footer className="footer"><div className="wrap"><div className="footer-top"><div><a href="#" className="brand"><span className="brand-icon"><Leaf /></span><span>verdant<span className="brand-small">J O U R N E Y S</span></span></a><p>For the places we love.<br />For the world we share.</p><div className="socials">{["Instagram", "YouTube", "LinkedIn", "TikTok"].map(name => <button key={name} aria-label={name} onClick={() => setInfo(name)}><SocialIcon channel={name} /></button>)}</div></div>
      <div className="footer-columns"><div><h3>Destinations</h3>{trips.map(t => <a key={t.id} href="#trips" onClick={() => { setDestination(t.destination); setActivity(""); setImpact(""); }}>{t.destination}</a>)}</div><div><h3>Company</h3>{["About", "Impact", "Careers", "Press"].map(n => n === "Impact" ? <a key={n} href="#impact">{n}</a> : <button key={n} onClick={() => setInfo(n)}>{n}</button>)}</div><div><h3>Support</h3>{["FAQ", "Contact", "Travel Insurance", "Cancellation Policy"].map(n => <button key={n} onClick={() => setInfo(n)}>{n}</button>)}</div><div><h3>Legal</h3>{["Privacy", "Terms", "Accessibility"].map(n => <button key={n} onClick={() => setInfo(n)}>{n}</button>)}<button className="footer-cert" onClick={() => setInfo("Our sustainability standards")}><span className="b-logo">B</span> B Corp Certified*<small>*Demo reference</small></button></div></div></div>
      <div className="footer-bottom"><span>© 2026 Verdant Journeys · Fictional local demo</span><span><Leaf size={15} /> Climate Positive Since 2021*</span><small>*Illustrative claim, not audited</small><a href="#">Back to top ↑</a></div></div></footer>
    <div className="mobile-bottom"><span>Go further. Tread lighter.</span><a className="button small" href="#trips">Explore Trips <ArrowUpRight size={16} /></a></div>
    <dialog ref={dialog} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }} onKeyDown={e => {
      if (e.key !== "Tab") return;
      const controls = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]'));
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !e.currentTarget.contains(document.activeElement))) { e.preventDefault(); first?.focus(); }
    }} aria-labelledby="dialog-title">
      <button className="dialog-close icon-button" aria-label="Close dialog" onClick={close}><X /></button>
      {selected ? <div className="trip-detail"><div className="detail-image"><Scene kind={selected.scene} label={selected.name} /></div><div className="dialog-body"><p className="eyebrow">{selected.destination} · {selected.days} DAYS · FICTIONAL ITINERARY</p><h2 id="dialog-title">{selected.name}</h2><p className="trip-impact"><Sprout size={18} /> {selected.highlight} · demo claim</p><p>From <strong>{money(selected.price)} per person</strong>. Accommodation, local guides and ground transport included in this imagined package; international flights excluded. No live availability.</p><h3>Your journey, at a glance</h3><ol className="itinerary">{selected.itinerary.map(item => <li key={item}>{item}</li>)}</ol>
        {receipt ? <div className="success" role="status"><Check /><h3>Local inquiry created</h3><p>{receipt}</p><p>No reservation, payment or email was made. Your request exists only in this page until reload.</p><button className="button" onClick={close}>Keep exploring</button></div> : <form className="inquiry" onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); const guests = Number(data.get("guests")); const date = String(data.get("date")); if (guests < 1 || guests > 8 || date < new Date().toLocaleDateString("en-CA")) return; setReceipt(`${guests} traveler${guests > 1 ? "s" : ""} · ${selected.name} · preferred departure ${date}. Illustrative package total: ${money(selected.price * guests)}.`); }}>
          <h3>Start a thoughtful journey</h3><p>Try a local inquiry — not a real booking. Use fictional details.</p><div className="form-grid"><label>Your name<input name="name" required minLength={2} maxLength={80} autoComplete="name" pattern={".*\\S.*"} /></label><label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" /></label><label>Preferred departure<input name="date" type="date" min={new Date().toLocaleDateString("en-CA")} required /></label><label>Travelers<select aria-label="Travelers" name="guests" defaultValue={travelers}>{Array.from({ length: 8 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label></div><label>Interests or accessibility needs (optional)<textarea name="message" maxLength={1000} rows={3} placeholder="For this demo, please do not include sensitive information." /></label><label className="consent"><input name="consent" type="checkbox" required /> I understand this is a local demo, not a reservation.</label><button className="button" type="submit">Create local inquiry <ArrowRight size={17} /></button>
        </form>}</div></div> : <div className="dialog-body info-dialog"><p className="eyebrow">VERDANT JOURNEYS · DEMO GUIDE</p><h2 id="dialog-title">{info}</h2><p>{info ? infoText[info] || (lodges.some(l => l.name === info) ? `${lodges.find(l => l.name === info)?.text}. This fictional lodge uses illustrative sustainability badges and nightly pricing. No real rooms, certification or availability are represented. Choose an adventure to try a local trip inquiry; we cannot book accommodation.` : `${info} is a demonstration social channel. No external account is connected or opened.`) : ""}</p>{lodges.some(l => l.name === info) && <button className="button" onClick={() => { close(); window.location.hash = "trips"; }}>Find an adventure <ArrowRight size={17} /></button>}<button className="text-button" onClick={close}>Got it</button></div>}
    </dialog>
  </>;
}
