"use client";

import { useEffect, useRef, useState } from "react";
import Artwork from "../components/Artwork";
import { bottles, courses, gallery, localDate, nextServiceDate } from "../components/fixtures";

type Modal = { title: string; content: React.ReactNode } | null;
type Booking = { date: string; guests: number; time: string; occasion: string };
const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const links = [["Menu", "menu"], ["Wine", "wine"], ["Our Story", "story"], ["Private Dining", "private"], ["Press", "press"], ["Reservations", "reservations"]];
function trapModalTab(e: { key: string; shiftKey: boolean; currentTarget: HTMLDialogElement; preventDefault: () => void }) {
  if (e.key !== "Tab") return;
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], input:not(:disabled), select, textarea"));
  const first = items[0], last = items[items.length - 1];
  if (!first) return;
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [nav, setNav] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [pairing, setPairing] = useState("none");
  const [adult, setAdult] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const navDialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const navOpener = useRef<HTMLElement | null>(null);
  const [booking, setBooking] = useState<Booking>({ date: "", guests: 2, time: "17:30", occasion: "None" });
  const [bookingError, setBookingError] = useState("");
  const [preview, setPreview] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [inquiry, setInquiry] = useState(false);
  const [inquiryDone, setInquiryDone] = useState(false);
  const [privateGuests, setPrivateGuests] = useState(8);
  const [newsletter, setNewsletter] = useState(false);
  const perPerson = 185 + (pairing === "wine" ? 95 : pairing === "botanical" ? 45 : 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    setBooking(b => ({ ...b, date: nextServiceDate() }));
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (modal) { if (!dialog.current?.open) opener.current = document.activeElement as HTMLElement; dialog.current?.showModal(); document.body.style.overflow = "hidden"; }
    else { dialog.current?.close(); document.body.style.overflow = ""; opener.current?.focus(); }
    return () => { document.body.style.overflow = ""; };
  }, [modal]);
  useEffect(() => {
    if (nav) { navOpener.current = document.activeElement as HTMLElement; navDialog.current?.showModal(); document.body.style.overflow = "hidden"; }
    else { navDialog.current?.close(); document.body.style.overflow = ""; navOpener.current?.focus(); }
    return () => { document.body.style.overflow = ""; };
  }, [nav]);
  function invalidate() { setPreview(false); setConfirmed(false); setBookingError(""); }
  function checkAvailability(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); invalidate();
    const day = new Date(`${booking.date}T12:00:00`).getDay();
    if (!booking.date || booking.date < localDate(new Date())) return setBookingError("Choose today or a future date.");
    if (day === 1 || day === 2) return setBookingError("Our illustrative kitchen is closed Monday and Tuesday. Choose Wednesday–Sunday.");
    if (day === 0 && booking.time === "20:30") return setBookingError("No illustrative tables at 8:30 PM on Sunday. Try 5:30 PM or another day.");
    if (pairing === "wine" && !adult) return setBookingError("Wine is adult-only. Confirm all guests choosing it are 21+ or select a non-alcoholic option.");
    setPreview(true);
  }
  function showGallery(index: number) {
    const g = gallery[index];
    setModal({ title: g.title, content: <><Artwork scene={g.scene}/><p>{g.caption}</p><p className="fine">Original SVG illustration, not a photograph of a real restaurant.</p><div className="modal-actions"><button onClick={() => showGallery((index+5)%6)}>← Previous image</button><button onClick={() => showGallery((index+1)%6)}>Next image →</button></div></> });
  }
  function openInquiry() { setInquiry(true); setInquiryDone(false); }
  function information(title: string, text: string) { setModal({ title, content: <p>{text}</p> }); }

  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className={scrolled ? "scrolled" : ""}>
      <a href="#" className="wordmark" aria-label="Aurelian home">AURELIAN<span>NEW YORK · ILLUSTRATIVE</span></a>
      <nav aria-label="Main navigation">{links.map(([name,id])=><a key={id} href={`#${id}`}>{name}</a>)}</nav>
      <a className="button outline nav-reserve" href="#reservations">Reserve a Table</a>
      <button className="nav-toggle" aria-label="Open navigation" aria-haspopup="dialog" onClick={()=>setNav(true)}>☰</button>
    </header>
    <dialog ref={navDialog} className="mobile-nav" aria-label="Mobile navigation" onCancel={()=>setNav(false)} onKeyDown={trapModalTab}>
      <button className="close" onClick={()=>setNav(false)} aria-label="Close navigation">×</button>
      <span className="eyebrow">AURELIAN</span>
      {links.map(([name,id])=><a key={id} href={`#${id}`} onClick={()=>setNav(false)}>{name}</a>)}
      <p className="fine">A fictional restaurant. A real sense of occasion.</p>
    </dialog>
    <main id="main">
      <section className="hero">
        <Artwork className="hero-art"/>
        <div className="hero-shade"/>
        <div className="hero-content"><p className="eyebrow">MODERN EUROPEAN CUISINE · EST. 2019 (FICTIONAL)</p><h1>AURELIAN</h1><span className="gold-line"/><p className="hero-tagline">A celebration of season,<br/>terroir, and craft.</p><div className="hero-actions"><a className="button outline" href="#menu">View Tasting Menu</a><a className="button gold" href="#reservations">Reserve a Table</a></div></div>
        <div className="hero-bottom"><span>AN AUTUMN EXPRESSION · OCTOBER 2026</span><a href="#philosophy" aria-label="Explore our philosophy">↓</a><span>ORIGINAL ARTWORK · LOCAL DEMO</span></div>
      </section>
      <div className="demo-notice">An imagined restaurant, thoughtfully rendered. All menus, provenance, people, accolades, location and availability are illustrative. Nothing is booked or sent.</div>
      <section id="philosophy" className="philosophy section dark">
        <span className="eyebrow">01 / OUR PHILOSOPHY</span><span className="gold-line"/><h2>From Soil to Plate</h2>
        <p>At Aurelian, every dish begins with the land. We work directly with local farmers, foragers, and fishermen within a 100-mile radius. Our kitchen transforms these ingredients through technique rooted in European tradition and refined with modern precision. The result is a menu that changes with the seasons — honest, beautiful, and deeply flavorful.</p>
        <p className="signature">— Chef Marcus Aldridge</p><span className="gold-line"/><p className="fine">Fictional philosophy and sourcing story; not a verified local-sourcing claim.</p>
      </section>
      <section id="menu" className="section cream tasting">
        <span className="eyebrow">02 / THE SEASON AT OUR TABLE</span><h2>Autumn Tasting Menu</h2><p className="serif subtitle">October 2026</p>
        <div className="menu-controls"><fieldset><legend>Your tasting journey</legend><div className="segmented"><button aria-pressed={!vegetarian} onClick={()=>{setVegetarian(false);invalidate();}}>Seasonal</button><button aria-pressed={vegetarian} onClick={()=>{setVegetarian(true);invalidate();}}>Vegetarian</button></div></fieldset><label>Pairing accompaniment<select value={pairing} onChange={e=>{setPairing(e.target.value);setAdult(false);invalidate();}}><option value="none">No pairing</option><option value="wine">Sommelier wine · +$95 (21+)</option><option value="botanical">Botanical, alcohol-free · +$45</option></select></label></div>
        {pairing === "wine" && <label className="adult-check"><input type="checkbox" checked={adult} onChange={e=>{setAdult(e.target.checked);invalidate();}}/> All wine-pairing guests are adults aged 21+. Self-attestation for this demo only; no legal age verification.</label>}
        <div className="courses">{courses.map((c,i)=><article className="course" key={c.label}><span className="course-number">{String(i+1).padStart(2,"0")}</span><p className="eyebrow">{c.label}</p><h3>{vegetarian?c.vegetarian:c.dish}</h3><p>{c.note}</p>{pairing==="wine"&&c.wine&&<p className="pairing">↳ {c.wine} <span>· fictional producer</span></p>}{pairing==="botanical"&&<p className="pairing">↳ {["Garden herb infusion","Pear & thyme","Rosehip & beet","Fennel & citrus","Fig leaf tea","Yuzu & mint","Cacao husk infusion"][i]} · alcohol-free</p>}<button className="text-link" onClick={()=>setModal({title:vegetarian?c.vegetarian:c.dish,content:<><p className="eyebrow">{c.label} · {vegetarian?"Vegetarian":"Seasonal"} journey</p><p>{c.note}</p><p>Illustrative allergen notes: {vegetarian&&i===1?"Milk (mushroom substitution)":vegetarian&&i===3?"Celery (celeriac substitution)":c.allergens}.</p><p>No allergen-free guarantee. Ingredients, cross-contact and dietary suitability must be assessed by an actual restaurant. This demo cannot accommodate a medical dietary request.</p><p>{c.label==="Pre-dessert"?"Champagne granita contains alcohol; request the alcohol-free citrus adaptation.": "A small expression of the autumn season, prepared with restraint."}</p>{pairing==="wine"&&c.wine&&<p>Selected adult-only pairing: {c.wine}. Fictional producer, no inventory or biodynamic certification claimed.</p>}</>})}>Course notes +</button></article>)}</div>
        <div className="menu-price"><p className="serif">7 courses · {money(185)} per person</p><p>{pairing==="wine"?"Wine pairing +$95":pairing==="botanical"?"Alcohol-free pairing +$45":"Wine pairing available · $95"} · Vegetarian tasting available</p><p className="total">{money(perPerson)} per guest with your selection</p><a className="button gold" href="#reservations">Reserve for Tasting Menu</a><p className="fine">Illustrative prices in USD, before tax and gratuity. Vegetarian is not vegan; allergen notes are not a safety assurance.</p></div>
      </section>
      <section className="gallery" aria-label="Editorial gallery">{gallery.map((g,i)=><button key={g.title} className={`gallery-item gallery-${i}`} onClick={()=>showGallery(i)} aria-label={`Open gallery: ${g.title}`}><Artwork scene={g.scene}/><span>{g.title} <small>VIEW ILLUSTRATION ↗</small></span></button>)}</section>
      <p className="art-credit">An editorial world in original SVG. Illustrations stand in for photography; no real venue or chef is depicted.</p>
      <section id="story" className="chef dark"><div className="chef-image"><Artwork scene="chef"/><span className="image-caption">MARCUS AT THE PASS · FICTIONAL PORTRAIT</span></div><div className="chef-copy"><span className="eyebrow">03 / THE HAND BEHIND THE PLATE</span><h2>Chef Marcus<br/>Aldridge</h2><p className="role">Executive Chef & Co-Founder</p><p>With two decades of experience across Michelin-starred kitchens in Paris, Copenhagen, and New York, Marcus brings a philosophy of restraint and reverence to every plate. His approach: source the finest ingredients, apply precise technique, and let the product shine.</p><p className="credentials">Fictional biography · No real employment or award claims</p><blockquote>“The best dishes are the simplest — when you start with perfect ingredients, your job is not to interfere.”</blockquote><p className="fine">Illustrative character and quote. Ex-Noma, Ex-Le Bernardin and James Beard nominee references from the brief are not presented as real credentials.</p></div></section>
      <section id="wine" className="section cream cellar"><span className="eyebrow">04 / A CONVERSATION WITH TERROIR</span><h2>The Cellar</h2><p className="subtitle serif">350+ imagined labels · Old World focus · Natural & biodynamic inspiration</p><p className="fine">Fictional cellar concept, not stock or certified farming claims. Alcohol features for adults 21+ only.</p><div className="wine-features"><article><span>01</span><h3>By the Glass</h3><p>12 imagined rotating pours, changed weekly to complement the current menu.</p><button className="text-link" onClick={()=>information("By the Glass · 21+","Illustrative rotating pours: Loire white $16, Burgundy red $22, sparkling $24. No wine is sold or served. These are fictional listings without verified natural or biodynamic certifications.")}>Starting at $16 ↗</button></article><article><span>02</span><h3>Sommelier&apos;s Selection</h3><p>A pairing journey through the tasting menu, chosen to echo each course.</p><button className="text-link" onClick={()=>{setPairing("wine");setAdult(false);invalidate();document.getElementById("menu")?.scrollIntoView();}}>Choose pairing · $95 ↗</button></article><article><span>03</span><h3>Private Cellar</h3><p>Rare verticals and library wines, imagined for an unhurried evening.</p><button className="text-link" onClick={openInquiry}>By request ↗</button></article></div>
        <div className="bottles">{bottles.map((b,i)=><button className="bottle-card" key={b.name} onClick={()=>setModal({title:`${b.year} ${b.name}`,content:<><p>{b.producer} · fictional producer</p><p>{b.note}</p><p>{money(b.price)} per bottle · illustrative, adults 21+ only.</p><p>This is a cellar detail preview, not a purchase. No certifications, inventory, delivery or payment services.</p></>})}><svg viewBox="0 0 100 260" role="img" aria-label={`Illustrated ${b.name} bottle`}><path d="M39 14H61V72Q80 86 80 103V242H20V103Q20 86 39 72Z" fill={i===1?"#535237":"#252c24"}/><path d="M43 15V69" stroke="#bbb083" opacity=".4"/><rect x="38" y="8" width="24" height="29" fill={b.color}/><rect x="25" y="127" width="50" height="66" fill="#ede4cf"/><text x="50" y="152" textAnchor="middle" fontSize="8" fill="#584831">AURELIAN</text><path d="M39 166L50 152L61 166L50 179Z" fill="none" stroke={b.color}/><text x="50" y="187" textAnchor="middle" fontSize="7">{b.year}</text></svg><span className="eyebrow">{b.year}</span><h3>{b.name}</h3><p>{b.producer}</p><strong>{money(b.price)}</strong><span className="fine">Bottle notes ↗</span></button>)}</div><button className="text-link" onClick={()=>setModal({title:"The illustrated wine list · 21+",content:<><p>Featured cellar selection. All producers are invented; no real-world inventory or endorsement.</p><ul className="wine-list">{bottles.map(b=><li key={b.name}>{b.year} {b.name} — {b.producer}<strong>{money(b.price)}</strong></li>)}</ul><p>By-the-glass selection from $16. Full tasting pairing $95 per person. Botanical alcohol-free pairing $45. Before tax and gratuity.</p></>})}>View Full Wine List →</button>
      </section>
      <section id="private" className="private"><Artwork scene="room"/><div className="private-shade"/><div className="private-copy"><span className="eyebrow">05 / GATHER BEAUTIFULLY</span><h2>Private Dining</h2><p>Host your most memorable occasions in our private dining room, seating up to 24 guests. Custom menus crafted for your event with dedicated service.</p><p className="eyebrow events">SEATED DINNERS · CORPORATE EVENTS<br/>WINE DINNERS · CELEBRATIONS</p><div className="private-details"><span>8–24 guests</span><span>From $150 per person<br/><small>Minimum 8 guests · illustrative</small></span></div><button className="button outline" onClick={openInquiry}>Inquire About Private Dining</button></div></section>
      <section id="press" className="section recognition dark"><span className="eyebrow">06 / AN IMAGINED PRESS BOOK</span><h2>Recognition</h2><p className="fine">Design placeholders only. No actual awards, ratings, reviews or publication endorsements.</p><div className="press-items">{[["Editorial Journal","“A masterclass in seasonal restraint”"],["The Imagined Guide","☆☆ An imagined two-star moment"],["Culinary Foundation","Illustrative outstanding restaurant nomination"],["The Seasonal Review","A place among imagined new discoveries"],["Cellar Quarterly","Illustrative cellar distinction"]].map(([name,quote])=><article key={name}><h3>{name}</h3><p>{quote}</p><span className="eyebrow">FICTIONAL PRESS</span></article>)}</div></section>
      <section id="reservations" className="section cream reservations"><span className="eyebrow">07 / YOUR EVENING BEGINS HERE</span><h2>Reserve Your Table</h2><p>Wednesday–Sunday · 5:30 PM & 8:30 PM<br/><span className="fine">Sunday late seating unavailable in this fixture. All availability is simulated.</span></p>
        <form onSubmit={checkAvailability} className="reservation-form"><div className="fields"><label>Date<input type="date" required min={localDate(new Date())} value={booking.date} onChange={e=>{setBooking({...booking,date:e.target.value});invalidate();}}/></label><label>Party size<select value={booking.guests} onChange={e=>{setBooking({...booking,guests:Number(e.target.value)});invalidate();}}>{[1,2,3,4,5,6,7,8].map(n=><option value={n} key={n}>{n} {n===1?"guest":"guests"}</option>)}</select></label><label>Seating<select value={booking.time} onChange={e=>{setBooking({...booking,time:e.target.value});invalidate();}}><option value="17:30">5:30 PM</option><option value="20:30">8:30 PM</option></select></label><label>Special occasion<select value={booking.occasion} onChange={e=>{setBooking({...booking,occasion:e.target.value});invalidate();}}>{["None","Birthday","Anniversary","Business","Other"].map(o=><option key={o}>{o}</option>)}</select></label></div><p className="selection-summary">Your selection: {vegetarian?"Vegetarian":"Seasonal"} · {pairing==="wine"?"Wine pairing (21+)":pairing==="botanical"?"Botanical pairing":"No pairing"} · {money(perPerson)} / guest</p><button className="button gold" type="submit">Check Availability</button></form>
        {bookingError&&<p className="error" role="alert">{bookingError}</p>}
        {preview&&<div className="booking-preview" aria-live="polite"><span className="eyebrow">{confirmed?"LOCAL CONFIRMATION":"ILLUSTRATIVE TABLE AVAILABLE"}</span><h3>{confirmed?"Your imagined evening is noted.":"A table, just for you."}</h3><p>{booking.date} · {booking.time==="17:30"?"5:30 PM":"8:30 PM"} · {booking.guests} {booking.guests===1?"guest":"guests"}</p><p>{vegetarian?"Vegetarian":"Seasonal"} tasting {pairing!=="none"&&`with ${pairing} pairing`} · Occasion: {booking.occasion}</p><p className="serif">Estimated subtotal {money(perPerson*booking.guests)}</p><p className="fine">Before tax and gratuity. No table held, charge made or email sent.</p>{!confirmed?<button className="button gold" onClick={()=>setConfirmed(true)}>Confirm local preview</button>:<p role="status">Demo reference AUR-015. This is not a reservation.</p>}<button className="text-link" onClick={invalidate}>Start over</button></div>}
        <p className="private-referral">Parties of 8 may use either journey; 9 or more use private dining.<br/><button className="text-link" onClick={openInquiry}>Plan a private occasion →</button></p><p className="fine">Fictional contact: reservations@aurelian.com · (212) 555-0147<br/>Illustrative cancellation policy: we kindly ask for 24-hour notice.</p>
      </section>
      <section className="location cream" aria-label="Location and hours"><div className="map-art"><svg viewBox="0 0 600 500" role="img" aria-label="Schematic neighborhood illustration, not a real map"><rect width="600" height="500" fill="#dcd9ce"/>{[0,1,2,3,4,5].map(n=><g key={n}><path d={`M${n*120-100} 0L${n*120+100} 500`} stroke="#faf8f3" strokeWidth="20"/><path d={`M0 ${n*100}L600 ${n*100-90}`} stroke="#faf8f3" strokeWidth="15"/></g>)}<path d="M480 0L600 0V500H550Z" fill="#a8b5b0"/><circle cx="300" cy="250" r="24" fill="#0f0f0f"/><text x="300" y="258" textAnchor="middle" fontFamily="Georgia" fill="#c9a84c" fontSize="24">A</text><text x="270" y="340" fontSize="13" fill="#686153">CHELSEA · ILLUSTRATIVE</text></svg><span>LOCAL SCHEMATIC · NO MAP PROVIDER</span></div><div className="location-copy"><span className="eyebrow">08 / FIND YOUR WAY</span><h2>In the heart<br/>of Chelsea.</h2><p>127 West 18th Street<br/>New York, NY 10011</p><dl><div><dt>Wednesday–Thursday</dt><dd>5:30 PM – 10:00 PM</dd></div><div><dt>Friday–Saturday</dt><dd>5:30 PM – 11:00 PM</dd></div><div><dt>Sunday</dt><dd>5:00 PM – 9:30 PM</dd></div><div><dt>Monday–Tuesday</dt><dd>Closed</dd></div></dl><button className="text-link" onClick={()=>information("Illustrative directions","The brief places Aurelian at 127 West 18th Street, Chelsea, New York. This is a fictional business address and schematic, not route guidance or a verified restaurant. No location is collected and no map service is contacted.")}>Get Directions →</button><p className="fine">Illustrative valet: Thursday–Saturday ($35).<br/>Smart casual — comfortable and elegant.<br/>Address, hours and services are fictional business fixtures.</p></div></section>
    </main>
    <footer className="dark"><a href="#" className="wordmark">AURELIAN</a><p>127 West 18th Street, New York · (212) 555-0147<br/><span className="fine">Fictional location and contact; do not use for booking.</span></p><div className="social"><button aria-label="Instagram preview" onClick={()=>information("Instagram preview","A fictional social profile. No external accounts, trackers or social providers are connected.")}>◎</button><button aria-label="Facebook preview" onClick={()=>information("Facebook preview","A fictional social profile. No external accounts or social providers are connected.")}>f</button></div><form className="newsletter" onSubmit={e=>{e.preventDefault();setNewsletter(true);}}><label htmlFor="newsletter-email">Join our list for seasonal menu announcements</label><div><input id="newsletter-email" type="email" required placeholder="Your email address" aria-label="Newsletter email" disabled={newsletter}/><button className="button gold" type="submit" disabled={newsletter}>Subscribe</button></div></form>{newsletter&&<div role="status"><p>Subscribed locally for this visit. No email was stored or sent.</p><button className="text-link" onClick={()=>setNewsletter(false)}>Use another email</button></div>}<div className="footer-bottom"><span>© 2026 Aurelian · Fictional restaurant demo</span><div><button onClick={()=>information("Privacy","All interactions are in-memory local demonstrations. No accounts, cookies for marketing, analytics, email delivery or payment collection. Reloading clears confirmations. Do not enter sensitive information.")}>Privacy</button><button onClick={()=>information("Terms","This is an illustrative design demo, not an operating restaurant. Menus, prices, dietary notes, people, press, services and availability are invented. No reservations, sales or legal age verification are performed.")}>Terms</button></div></div><p className="fine safety">Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness. Illustrative allergen information is not medical advice or a guarantee.</p></footer>
    <a className="mobile-reserve button gold" href="#reservations">Reserve your evening ↗</a>
    <dialog ref={dialog} aria-labelledby="modal-title" onCancel={()=>setModal(null)} onKeyDown={trapModalTab} className="detail-dialog"><button className="close" aria-label="Close dialog" onClick={()=>setModal(null)}>×</button><p className="eyebrow">AURELIAN / LOCAL PREVIEW</p><h2 id="modal-title">{modal?.title}</h2>{modal?.content}</dialog>
    {inquiry&&<Inquiry onClose={()=>setInquiry(false)} done={inquiryDone} setDone={setInquiryDone} guests={privateGuests} setGuests={setPrivateGuests}/>}
  </>;
}

function Inquiry({onClose,done,setDone,guests,setGuests}:{onClose:()=>void;done:boolean;setDone:(d:boolean)=>void;guests:number;setGuests:(n:number)=>void}) {
  const ref=useRef<HTMLDialogElement>(null);
  const [date,setDate]=useState(nextServiceDate);
  const [event,setEvent]=useState("Celebration");
  const [error,setError]=useState("");
  useEffect(()=>{
    const opener=document.activeElement as HTMLElement;
    const element=ref.current;
    const onKey=(e:KeyboardEvent)=>{if(element)trapModalTab({key:e.key,shiftKey:e.shiftKey,currentTarget:element,preventDefault:()=>e.preventDefault()});};
    element?.showModal();element?.addEventListener("keydown",onKey);document.body.style.overflow="hidden";
    return()=>{element?.removeEventListener("keydown",onKey);document.body.style.overflow="";opener?.focus();};
  },[]);
  return <dialog ref={ref} className="detail-dialog inquiry-dialog" aria-labelledby="inquiry-title" onCancel={onClose}><button className="close" onClick={onClose} aria-label="Close inquiry">×</button><p className="eyebrow">A SPACE FOR YOUR OCCASION</p><h2 id="inquiry-title">Private Dining Inquiry</h2>{done?<div role="status"><h3>Your local inquiry is ready.</h3><p>{event} · {date} · {guests} guests</p><p>Starting estimate: {money(guests*150)} before tax, gratuity, drinks and customization.</p><p>No request has been sent; no space is held. All contact details remain only in this form.</p><button className="button gold" onClick={()=>{setDone(false);setError("");}}>Create another inquiry</button></div>:<form onSubmit={e=>{e.preventDefault();setError("");if(date<localDate(new Date()))return setError("Choose today or a future date.");if(guests<8||guests>24||!Number.isInteger(guests))return setError("Private dining accommodates 8–24 whole-number guests.");setDone(true);}}><p>8–24 guests · from $150 per guest. Local preview only.</p><div className="inquiry-fields"><label>Your name<input required name="name" maxLength={80} pattern={".*\\S.*"} title="Enter a name with at least one non-space character" autoComplete="off"/></label><label>Email<input required type="email" name="email" autoComplete="off"/></label><label>Event date<input required type="date" min={localDate(new Date())} value={date} onChange={e=>setDate(e.target.value)}/></label><label>Guests<input type="number" required min={8} max={24} step={1} value={guests} onChange={e=>setGuests(Number(e.target.value))}/></label><label>Event type<select value={event} onChange={e=>setEvent(e.target.value)}>{["Celebration","Seated dinner","Corporate event","Wine dinner (adults 21+ only)"].map(x=><option key={x}>{x}</option>)}</select></label><label>Notes (optional)<textarea maxLength={500} placeholder="Tell us about the occasion. No sensitive information."/></label></div><p className="serif" aria-live="polite">Starting estimate: {money((guests>=8&&guests<=24?guests:8)*150)}</p>{event.startsWith("Wine")&&<p className="fine">Adult-only wine event concept. No alcohol is served and no legal age verification is performed.</p>}{error&&<p role="alert" className="error">{error}</p>}<button type="submit" className="button gold">Preview local inquiry</button><p className="fine">Illustrative capacity, not live availability. Nothing is transmitted.</p></form>}</dialog>;
}
