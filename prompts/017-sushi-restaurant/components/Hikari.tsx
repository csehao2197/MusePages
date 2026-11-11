"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, ArrowLeft, X, Menu as MenuIcon, Clock3, Utensils, Wine, Minus, Plus, ShoppingBag, MapPin, Check, Sparkles } from "lucide-react";
import Art from "./Art";
import { categories, dateValue, dishes, gallery, money, pickupError, reservationError, venue, type Category, type Dish } from "./data";
type Cart = Record<string, number>;
type Modal = "dish" | "cart" | "gallery" | null;
const times = [["18:00", "6:00 PM"], ["18:30", "6:30 PM"], ["19:00", "7:00 PM"], ["19:30", "7:30 PM"], ["20:00", "8:00 PM"], ["20:30", "8:30 PM"], ["21:00", "9:00 PM"]];
export default function Hikari() {
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [category, setCategory] = useState<Category>("All");
  const [modal, setModal] = useState<Modal>(null);
  const [dish, setDish] = useState<Dish>(dishes[0]);
  const [slide, setSlide] = useState(0);
  const [cart, setCart] = useState<Cart>({});
  const [notice, setNotice] = useState("");
  const [order, setOrder] = useState("");
  const [orderError, setOrderError] = useState("");
  const [dining, setDining] = useState("counter");
  const [pairing, setPairing] = useState("none");
  const [adult, setAdult] = useState(false);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [today, setToday] = useState("");
  const [reserveError, setReserveError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const reservationForm = useRef<HTMLFormElement>(null);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = dishes.reduce((a, item) => a + item.price * (cart[item.id] || 0), 0);
  const perGuest = venue.omakase + (pairing === "sake" ? venue.sake : pairing === "tea" ? venue.tea : 0);
  useEffect(() => {
    setToday(dateValue(new Date()));
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!nav) return;
    const dismiss = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setNav(false);
        document.querySelector<HTMLButtonElement>(".nav-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [nav]);
  useEffect(() => {
    if (modal && dialog.current && !dialog.current.open) dialog.current.showModal();
    if (!modal && dialog.current?.open) dialog.current.close();
    if (modal) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previous; };
    }
  }, [modal]);
  function open(next: Modal) { trigger.current = document.activeElement as HTMLElement; setModal(next); setOrderError(""); }
  function close() { setModal(null); trigger.current?.focus(); }
  function modalKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (modal === "gallery" && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      setSlide(s => (s + (event.key === "ArrowRight" ? 1 : 5)) % 6);
    }
    if (event.key === "Tab") {
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], input, select, textarea"))
        .filter(element => element.offsetParent !== null);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }
  function add(item: Dish) {
    if ((cart[item.id] || 0) >= 8) { setNotice("Maximum 8 of each dish in this demo bag."); return; }
    setCart(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
    setOrder(""); setNotice(`${item.name} added to your takeout bag.`);
  }
  function quantity(id: string, change: number) {
    setCart(c => { const next = { ...c }; next[id] = Math.max(0, Math.min(8, (next[id] || 0) + change)); if (!next[id]) delete next[id]; return next; });
    setOrderError("");
  }
  function reserveOmakase() { setDining("counter"); setConfirmation(""); }
  function resetReservation() {
    reservationForm.current?.reset(); setConfirmation(""); setReserveError(""); setGuests(2);
    setDate(""); setTime("18:00"); setDining("counter"); setPairing("none"); setAdult(false);
  }
  const links = [["Menu", "#menu"], ["Omakase", "#omakase"], ["Our Story", "#story"], ["Gallery", "#gallery"], ["Reservations", "#reservations"]];
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className={scrolled || nav ? "header solid" : "header"}>
      <a href="#home" className="brand" aria-label="Hikari home"><span className="brand-kanji" lang="ja">光</span><span>HIKARI<small>SUSHI & OMAKASE</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <div className="header-actions"><button className="bag-button" onClick={() => { setOrder(""); open("cart"); }} aria-label={`Takeout bag, ${count} items`}><ShoppingBag size={19} /><span>{count}</span></button><a className="button small reserve-link" href="#reservations">Reserve a Table</a><button className="nav-toggle icon-button" aria-label={nav ? "Close navigation" : "Open navigation"} aria-expanded={nav} aria-controls="mobile-nav" onClick={() => setNav(!nav)}>{nav ? <X /> : <MenuIcon />}</button></div>
      {nav && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" onKeyDown={e => { if (e.key === "Escape") { setNav(false); document.querySelector<HTMLButtonElement>(".nav-toggle")?.focus(); } }}>{links.map(([label, href]) => <a key={href} href={href} onClick={() => setNav(false)}>{label}</a>)}</nav>}
    </header>
    <main id="main">
      <section id="home" className="hero">
        <Art kind="hero" title="A chef placing nigiri at a warmly lit hinoki counter" className="hero-art" />
        <div className="hero-shade" />
        <div className="hero-content"><p className="japanese" lang="ja">鮨処 光</p><p className="eyebrow">AN INTIMATE COUNTER. AN EXTRAORDINARY JOURNEY.</p><h1>The Art of Sushi,<br /><em>Perfected.</em></h1><p className="hero-copy">Fourteen seats. Eighteen moments of discovery.<br />A quiet celebration of craft, season, and connection.</p><div className="hero-buttons"><a href="#omakase" className="button">View Omakase Menu <ArrowRight size={17} /></a><a href="#reservations" className="button outline">Make a Reservation</a></div><p className="hero-note">DOWNTOWN · JAPANESE-INSPIRED DINING</p></div>
        <div className="hero-bottom"><span>一期一会 · ONE TIME, ONE MEETING</span><span className="divider-circle" /><a href="#philosophy">EXPLORE ↓</a></div>
      </section>
      <div className="demo-banner"><Sparkles size={15} /><span>A fictional Hikari experience · Original illustrations · All bookings, orders & signups stay in this page.</span></div>
      <section id="philosophy" className="philosophy section">
        <span className="vertical-japanese" lang="ja" aria-hidden="true">一期一会</span>
        <p className="eyebrow">OUR PHILOSOPHY</p><h2>Every Piece Tells a Story</h2>
        <p className="prose">Sushi is a conversation between chef and guest. A quiet rhythm of hands, rice, and the changing seasons. At Hikari, each piece is shaped with intention, and offered at the moment it is ready.</p>
        <p className="fine">Our fictional menu imagines Toyosu-inspired selections and house-aged vinegar. Origins, freshness, sourcing and preparation are illustrative, not verified claims.</p><span className="gold-rule" />
      </section>
      <section id="menu" className="section menu-section">
        <div className="section-heading"><div><p className="eyebrow">FROM THE WATER. WITH THE SEASONS.</p><h2>Seasonal Selection <span lang="ja">· 季節</span></h2></div><p className="season">Spring 2026 <span>ILLUSTRATIVE MENU</span></p></div>
        <div className="seasonal-grid">{dishes.slice(0, 3).map(item => <button className="dish-card" key={item.id} onClick={() => { setDish(item); open("dish"); }} aria-label={`Explore ${item.name}`}><div className="dish-image"><Art color={item.color} title={item.name} /><span className="badge">{item.badge}</span></div><div className="dish-info"><span className="dish-japanese" lang="ja">{item.japanese}</span><h3>{item.name} <ArrowRight size={18} /></h3><p className="origin">{item.origin}</p><p>{item.description}</p><span className="dish-price">{money(item.price)} <small>/ two pieces</small></span></div></button>)}</div>
        <div className="menu-intro"><div><h3>The à la carte menu</h3><p>Explore a little further. Build a local takeout bag, or discover a counter-only course.</p></div><a className="text-link" href="#full-menu">View Full Menu <ArrowRight size={16} /></a></div>
        <div id="full-menu" className="full-menu"><div className="filters" role="group" aria-label="Menu categories">{categories.map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="menu-list">{dishes.filter(i => category === "All" || i.category === category).map(item => <div className="menu-row" key={item.id}><div><h4>{item.name} <span lang="ja">{item.japanese}</span></h4><p>{item.category} · {item.raw ? "Raw fish / seafood" : "Cooked"} · {item.takeaway ? "Takeout available" : "Counter only"}</p></div><span>{money(item.price)}</span><button className="secondary" onClick={() => { setDish(item); open("dish"); }}>Details</button>{item.takeaway && <button className="icon-button" aria-label={`Add ${item.name} to bag`} onClick={() => add(item)}><Plus size={18} /></button>}</div>)}</div><p className="fine">Prices are fictional USD, before any real-world taxes or fees. This demo adds no fees. Dietary labels are illustrative; shared preparation means no allergen-free assurance. Raw seafood carries food-safety risks; this is not dining or medical advice.</p><p role="status" className="live-notice">{notice}</p></div>
      </section>
      <section id="omakase" className="section cream omakase-section">
        <div className="omakase-art"><Art kind="chef" title="The precision of a sushi chef" /><div className="art-pair"><Art title="Hand-shaped nigiri" color="#e8b0a0" /><Art kind="platter" title="A lacquerware course" /></div><span className="art-caption">THE COUNTER IS OUR CANVAS · ORIGINAL ART</span></div>
        <div className="omakase-copy"><p className="eyebrow">OMAKASE · <span lang="ja">おまかせ</span></p><h2>Leave It<br /><em>to the Chef.</em></h2><p className="prose">Eighteen courses. A journey through Japan’s seasons, guided by the hands of Chef Kenji Tanaka. Take your place at the hinoki counter and let the evening unfold, one remarkable bite at a time.</p><p className="fine">Chef, experience, menu and market arrivals are fictional creative storytelling.</p><div className="details-grid"><span><Utensils />18 Courses</span><span><Clock3 />90 Minutes</span><span><Sparkles />$185 per person</span><span><Wine />Sake pairing: +$65</span></div>
          <details className="course-details"><summary>Discover the 18-course journey</summary><ol><li>3 opening tastes — dashi, seasonal greens, sashimi</li><li>12 hand-shaped nigiri — chef’s seasonal selection</li><li>3 closing notes — hand roll, miso soup, sweet finish</li></ol><p>Illustrative sequence, not a guaranteed menu. Raw fish and common allergens; requests cannot guarantee substitutions.</p></details>
          <a href="#reservations" onClick={reserveOmakase} className="button">Reserve Omakase Seats <ArrowRight size={17} /></a><p className="fine">14 seats · 6:00 PM & 8:30 PM · 48 hours’ notice.<br />Optional sake pairing for self-declared adults only. No legal age verification.</p>
        </div>
      </section>
      <section id="story" className="section chef-section"><div className="chef-portrait"><Art kind="chef" title="Portrait study of fictional Chef Kenji Tanaka" /></div><p className="eyebrow">THE HANDS BEHIND HIKARI</p><h2>Chef Kenji Tanaka <span lang="ja">· 田中健二</span></h2><p className="chef-title">HEAD CHEF & OWNER · FICTIONAL PROFILE</p><p className="prose">Imagined in Osaka, shaped by Edomae tradition, and inspired by the Pacific Northwest. Kenji’s story is one of patience: learning the grain of a fish, the warmth of rice, the beauty of doing less — and doing it well.</p><p className="fine">An illustrative 25-year craft narrative, founded in 2019. No actual chef affiliation, Michelin recognition, James Beard award, certification or endorsement is claimed.</p><span className="gold-rule" /></section>
      <section id="gallery" className="section gallery-section"><div className="section-heading"><div><p className="eyebrow">A GLIMPSE INSIDE</p><h2>Stillness. In every detail.</h2></div><p className="fine">Six original illustrated moments.<br />Select an image to explore.</p></div><div className="gallery-grid">{gallery.map((image, index) => <button className={`gallery-tile tile-${index}`} key={image.title} onClick={() => { setSlide(index); open("gallery"); }} aria-label={`Open gallery: ${image.title}`}><Art kind={image.kind} title={image.title} color={index === 5 ? "#e1ad69" : "#db8e84"} /><span className="gallery-caption">{image.title}<Plus size={22} /></span></button>)}</div></section>
      <section className="section impressions"><p className="eyebrow">THE FEELING WE HOPE TO CREATE</p><h2>A seat worth remembering.</h2><p className="fine">Illustrative guest impressions — fictional writing, not reviews or press endorsements.</p><div className="review-track">{[["“Each course, a small revelation. An evening that asks you to slow down.”", "An imagined first visit"], ["“The light, the quiet, the craft. A little journey without leaving the counter.”", "An imagined anniversary"], ["“Watching the hands at work was as beautiful as the food itself.”", "An imagined counter guest"]].map(([quote, label]) => <figure key={label}><span className="quote-mark">“</span><blockquote>{quote}</blockquote><figcaption>{label} · DEMO</figcaption></figure>)}</div></section>
      <section id="reservations" className="section cream reservation-section"><div><p className="eyebrow">YOUR EVENING BEGINS HERE</p><h2>Reserve Your<br /><em>Experience.</em></h2><p className="prose">A place at the counter. A moment just for you.<br />We imagine booking a week ahead for omakase; à la carte dining is a more spontaneous affair.</p><dl className="hours" id="hours"><div><dt>Dinner</dt><dd>Tuesday–Saturday · 5:30–10:00 PM</dd></div><div><dt>Omakase</dt><dd>6:00 PM & 8:30 PM · 14 seats</dd></div><div><dt>Closed</dt><dd>Sunday & Monday</dd></div><div><dt>Private dining</dt><dd>Illustrative parties of 6–8; select the bar and add a request.</dd></div></dl><p className="fine">Demo availability: six seats remain at the early counter, fourteen at the late counter. Nothing is held or sent. Contact details from the brief are not active channels.</p><p className="contact-demo">(555) 319-8800 · fictional phone<br />reservations@hikarisushi.com · illustrative, do not contact</p></div>
        <div className="reservation-panel">{confirmation ? <div className="confirmation" role="status"><span className="success-mark"><Check /></span><p className="eyebrow">LOCAL REQUEST RECORDED</p><h3>A lovely evening, imagined.</h3><p>{confirmation}</p><p>No seats reserved, email sent or payment taken. This confirmation disappears when the page reloads.</p><button className="button" onClick={resetReservation}>Make another demo request</button></div> : <form ref={reservationForm} onSubmit={e => {
          e.preventDefault(); const error = reservationError(date, time, guests, dining);
          if (error) { setReserveError(error); return; }
          if (pairing === "sake" && !adult) { setReserveError("Please self-declare adult status or choose tea / no pairing."); return; }
          setReserveError("");
          setConfirmation(`${date} at ${times.find(t => t[0] === time)?.[1]} · ${guests} ${guests === 1 ? "guest" : "guests"} · ${dining === "counter" ? `Omakase, ${pairing === "none" ? "no pairing" : pairing + " pairing"} · ${money(perGuest * guests)} illustrative total` : "À la carte bar · priced by selection"}.`);
        }}><h3>Your place at Hikari</h3><p className="fine">Local demonstration request only.</p><div className="form-grid"><label>Date<input type="date" required min={today} value={date} onChange={e => { setDate(e.target.value); setReserveError(""); }} /></label><label>Time<select value={time} onChange={e => { setTime(e.target.value); setReserveError(""); }}>{times.filter(t => dining === "bar" || ["18:00", "20:30"].includes(t[0])).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></div><label>Party size<select value={guests} onChange={e => { setGuests(Number(e.target.value)); setReserveError(""); }}>{Array.from({ length: 8 }, (_, i) => <option value={i + 1} key={i}>{i + 1} {i === 0 ? "guest" : "guests"}</option>)}</select></label><fieldset><legend>Dining preference</legend><div className="radio-row">{[["counter", "Omakase Counter"], ["bar", "À La Carte Bar"]].map(([value, label]) => <label key={value}><input type="radio" name="dining" value={value} checked={dining === value} onChange={() => { setDining(value); setTime("18:00"); setPairing("none"); setAdult(false); setReserveError(""); }} />{label}</label>)}</div></fieldset>
          {dining === "counter" && <><label>Pairing<select value={pairing} onChange={e => { setPairing(e.target.value); setAdult(false); }}><option value="none">No pairing</option><option value="tea">Seasonal tea +$25 per guest</option><option value="sake">Sake +$65 per guest · adults only</option></select></label>{pairing === "sake" && <label className="check-label"><input type="checkbox" required checked={adult} onChange={e => setAdult(e.target.checked)} />I self-declare that all pairing guests are adults. This is not legal age verification.</label>}<div className="estimate"><span>Illustrative experience total</span><strong>{money(perGuest * guests)}</strong><small>No taxes, fees or payment in this demo.</small></div></>}
          <label>Your name<input name="name" autoComplete="off" required maxLength={80} pattern={".*\\S.*"} placeholder="For this local demo only" /></label><label>Special requests<textarea name="requests" rows={2} maxLength={500} placeholder="Occasion, accessibility or dietary considerations" /></label><p className="fine">Do not enter sensitive information. Dietary / accessibility requests are not fulfilled by this demo.</p>{reserveError && <p className="error" role="alert">{reserveError}</p>}<button className="button full" type="submit">Request Reservation <ArrowRight size={17} /></button><button type="button" className="reset-button" onClick={resetReservation}>Reset form</button><p className="fine centered">Instant local confirmation. No confirmation email.</p></form>}</div>
      </section>
      <section id="location" className="section location-section"><div className="local-map" role="img" aria-label="Fictional neighborhood diagram, not a navigable map"><div className="map-block block-one" /><div className="map-block block-two" /><div className="map-block block-three" /><span className="street pine">PINE STREET</span><span className="street central">CENTRAL AVENUE</span><span className="map-marker"><MapPin size={26} /> HIKARI · 光</span><span className="station">○ CENTRAL STATION</span><span className="map-legend">ILLUSTRATIVE DIAGRAM · NOT FOR DIRECTIONS</span></div><div><p className="eyebrow">FIND A LITTLE QUIET</p><h2>In the heart<br />of the city.</h2><p>428 Pine Street, Suite B<br />Downtown · Fictional location</p><p className="fine" id="parking">Imagined Pine Street Garage parking and Central Station (Blue Line), two blocks away. No actual parking validation, transit, venue accessibility or operating hours are verified.</p><p className="fine" id="accessibility">Demo accessibility: keyboard controls, native dialogs, large touch targets and reduced-motion support. Venue access would need confirmation with a real restaurant.</p></div></section>
    </main>
    <footer className="section"><div className="footer-top"><div><a href="#home" className="brand"><span className="brand-kanji" lang="ja">光</span><span>HIKARI<small>SUSHI & OMAKASE</small></span></a><p>A little light.<br />A lasting impression.</p></div><div><h3>Dining</h3><a href="#menu">Menu & Takeout</a><a href="#omakase">Omakase</a><a href="#reservations">Sake & Tea Pairing</a><a href="#reservations">Private Events</a></div><div><h3>Visit</h3><a href="#hours">Hours</a><a href="#location">Location</a><a href="#parking">Parking</a><a href="#accessibility">Accessibility</a></div><div className="newsletter"><h3>Stay in the season</h3><p>Join our illustrative list for seasonal menu updates.</p>{subscribed ? <div role="status"><p>Added locally. No email stored or sent; no actual subscription.</p><button className="text-link" onClick={() => setSubscribed(false)}>Reset signup</button></div> : <form onSubmit={e => { e.preventDefault(); setSubscribed(true); }}><label htmlFor="newsletter">Demo email</label><div className="newsletter-input"><input id="newsletter" type="email" required placeholder="you@example.com" autoComplete="off" /><button aria-label="Subscribe locally" type="submit"><ArrowRight /></button></div><small>Use a fictional address. No social accounts or external services connected.</small></form>}</div></div><div className="footer-bottom"><span>© 2026 Hikari Sushi · 光</span><span>FICTIONAL LOCAL DEMO · CRAFTED WITH INTENTION</span><a href="#home">Back to top ↑</a></div></footer>
    <dialog ref={dialog} onCancel={close} onClose={() => { setModal(null); trigger.current?.focus(); }} aria-labelledby="dialog-title" className={modal === "gallery" ? "gallery-dialog" : ""} onKeyDown={modalKeys}><button className="close-dialog icon-button" onClick={close} aria-label="Close dialog"><X /></button>
      {modal === "dish" && <><Art title={dish.name} color={dish.color} /><div className="dialog-content"><p className="eyebrow">{dish.category} · <span lang="ja">{dish.japanese}</span></p><h2 id="dialog-title">{dish.name}</h2><p>{dish.description}</p><p className="origin">{dish.origin}</p><p className="allergen"><strong>Illustrative allergens:</strong> {dish.allergens}. Shared preparation; no dietary or allergen-free certification.</p>{dish.raw && <p className="fine">Raw / lightly cured seafood carries food-safety risks. No freshness, sourcing or safety guarantees.</p>}<div className="dialog-bottom"><strong>{money(dish.price)}</strong>{dish.takeaway ? <button className="button" disabled={(cart[dish.id] || 0) >= 8} onClick={() => add(dish)}>{(cart[dish.id] || 0) >= 8 ? "Dish limit reached" : "Add to Takeout Bag"} <Plus size={16} /></button> : <a className="button" href="#reservations" onClick={() => { setDining("bar"); setTime("18:00"); setPairing("none"); setAdult(false); setConfirmation(""); close(); }}>Reserve the Bar</a>}</div><p className="live-notice" role="status">{notice}</p></div></>}
      {modal === "gallery" && <><Art kind={gallery[slide].kind} title={gallery[slide].title} /><div className="gallery-controls"><button className="icon-button" aria-label="Previous image" onClick={() => setSlide(s => (s + 5) % 6)}><ArrowLeft /></button><div aria-live="polite"><h2 id="dialog-title">{gallery[slide].title}</h2><p>{slide + 1} / 6 · Original illustration, not a venue photograph</p></div><button className="icon-button" aria-label="Next image" onClick={() => setSlide(s => (s + 1) % 6)}><ArrowRight /></button></div></>}
      {modal === "cart" && <div className="dialog-content cart-content"><p className="eyebrow">A LITTLE HIKARI, TO GO</p><h2 id="dialog-title">Your Takeout Bag</h2>{order ? <div role="status"><span className="success-mark"><Check /></span><h3>Local order confirmed</h3><p>{order}</p><p>No food prepared, payment taken or order sent.</p><button className="button" onClick={() => setOrder("")}>Start a new bag</button></div> : count === 0 ? <div className="empty"><ShoppingBag size={38} /><h3>A quiet bag, for now.</h3><p>Explore the seasonal menu to add a little something.</p><button className="button" onClick={close}>Return to Menu</button></div> : <><p className="fine">Local pickup simulation · Tuesday–Saturday only. Raw items and allergen labels are illustrative. No real collection.</p><div className="cart-lines">{dishes.filter(i => cart[i.id]).map(item => <div className="cart-line" key={item.id}><div><h3>{item.name}</h3><small>{money(item.price)} each</small></div><div className="quantity"><button aria-label={`Decrease ${item.name}`} onClick={() => quantity(item.id, -1)}><Minus size={15} /></button><span aria-label={`${item.name} quantity`}>{cart[item.id]}</span><button aria-label={`Increase ${item.name}`} disabled={cart[item.id] === 8} onClick={() => quantity(item.id, 1)}><Plus size={15} /></button></div><strong>{money(item.price * cart[item.id])}</strong></div>)}</div><div className="estimate"><span>Demo total · no tax or fees</span><strong>{money(subtotal)}</strong></div><form onSubmit={e => {
        e.preventDefault(); const form = new FormData(e.currentTarget);
        const error = pickupError(String(form.get("pickup-date")), String(form.get("pickup-time")));
        if (error) { setOrderError(error); return; }
        setOrder(`${count} items · ${money(subtotal)} · ${form.get("pickup-date")} at ${form.get("pickup-time")}. This order exists only in this page.`); setCart({}); setNotice(""); setOrderError("");
      }}><div className="form-grid"><label>Pickup date<input name="pickup-date" type="date" required min={today} /></label><label>Pickup time<select name="pickup-time"><option value="17:30">5:30 PM</option><option value="18:30">6:30 PM</option><option value="19:30">7:30 PM</option><option value="20:30">8:30 PM</option></select></label></div><label>Pickup name<input name="pickup-name" required maxLength={80} pattern={".*\\S.*"} placeholder="Use a fictional name" /></label>{orderError && <p role="alert" className="error">{orderError}</p>}<button type="submit" className="button full">Confirm Local Order <ArrowRight size={17} /></button></form><button className="reset-button" onClick={() => { setCart({}); setOrderError(""); setNotice("Bag cleared."); }}>Clear bag</button></>}</div>}
    </dialog>
  </>;
}
