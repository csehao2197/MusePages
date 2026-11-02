"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, Check, Clock3, Coffee, Heart, Menu, Minus, Plus, ShoppingBag, Wheat, X } from "lucide-react";
import BakeryArt from "../components/BakeryArt";
import { categories, localDate, money, pickupError, products, type Category, type Product } from "../components/data";

type Line = { key: string; product: Product; option: string; unit: number; quantity: number };
type Modal = "product" | "cart" | "catering" | "subscription" | "story" | "gallery" | "social" | null;
const gallery = [
  { kind: "interior", caption: "A seat at the neighborhood table" },
  { kind: "torn", caption: "A thousand little buttery layers" },
  { kind: "pour", caption: "A little love in every pour" },
  { kind: "display", caption: "The sweetest corner of the shop" },
  { kind: "patio", caption: "Slow mornings on the patio" },
  { kind: "rack", caption: "Good things take their time" },
] as const;
const reviews = [
  ["The best sourdough in the city. We drive 30 minutes just for their bread.", "Jake & Amy R."],
  ["Their almond croissant changed my life. Not exaggerating.", "Nadia K."],
  ["Cozy atmosphere, amazing coffee, and the breakfast sandwich is perfection.", "Tom W."],
  ["We order their bread box subscription weekly. Never disappoints.", "Lisa M."],
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [nav, setNav] = useState(false);
  const [category, setCategory] = useState<Category>("Breads");
  const [fullMenu, setFullMenu] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [product, setProduct] = useState(products[0]);
  const [option, setOption] = useState("Standard");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<Line[]>([]);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [toast, setToast] = useState("");
  const [photo, setPhoto] = useState(0);
  const [social, setSocial] = useState("Instagram");
  const [review, setReview] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [newsletter, setNewsletter] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const mobileDialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const navOpener = useRef<HTMLElement | null>(null);
  const touch = useRef(0);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const total = cart.reduce((sum, line) => sum + line.unit * line.quantity, 0);
  const extra = option === "Oat milk" || option === "Gluten-free recipe" ? 75 : 0;

  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 30);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(motion.matches);
    scroll(); update();
    window.addEventListener("scroll", scroll, { passive: true });
    motion.addEventListener("change", update);
    return () => { window.removeEventListener("scroll", scroll); motion.removeEventListener("change", update); };
  }, []);
  useEffect(() => {
    if (paused || hoverPaused || focusPaused || reduceMotion) return;
    const timer = setInterval(() => setReview(value => (value + 1) % reviews.length), 5000);
    return () => clearInterval(timer);
  }, [paused, hoverPaused, focusPaused, reduceMotion]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (modal) { dialog.current?.showModal(); document.body.style.overflow = "hidden"; }
    else { dialog.current?.close(); document.body.style.overflow = ""; opener.current?.focus(); }
  }, [modal]);
  useEffect(() => {
    if (nav) { mobileDialog.current?.showModal(); document.body.style.overflow = "hidden"; }
    else { mobileDialog.current?.close(); document.body.style.overflow = ""; navOpener.current?.focus(); }
  }, [nav]);

  function open(kind: Modal) {
    opener.current = document.activeElement as HTMLElement;
    setError(""); setConfirmation(""); setModal(kind);
  }
  function choose(item: Product) {
    setProduct(item); setQuantity(1); setOption("Standard"); open("product");
  }
  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) { setError("Choose a whole quantity from 1 to 20."); return; }
    const key = `${product.id}-${option}`;
    const existing = cart.find(line => line.key === key);
    if ((existing?.quantity || 0) + quantity > 20) { setError("Maximum 20 of each item and option. Adjust your bag first."); return; }
    setCart(lines => existing ? lines.map(line => line.key === key ? { ...line, quantity: line.quantity + quantity } : line) : [...lines, { key, product, option, quantity, unit: product.cents + extra }]);
    setToast(`${quantity} × ${product.name} added to your bag.`); setModal(null);
  }
  function pickup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = String(form.get("date"));
    const invalid = pickupError(date, cart.some(line => line.product.category === "Breads" || line.product.category === "Lunch" || line.product.category === "Breakfast"));
    if (invalid) { setError(invalid); return; }
    if (!cart.length) { setError("Your bag is empty. Add something delicious first."); return; }
    setError("");
    setConfirmation(`Pickup preview saved for ${date}, ${form.get("time")}. ${count} item${count === 1 ? "" : "s"}, ${money(total)}. Nothing was ordered or charged. This preview exists only until you close it.`);
    setCart([]);
  }
  function request(event: FormEvent<HTMLFormElement>, kind: "catering" | "subscription") {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = String(form.get("date"));
    if (date < localDate()) { setError("Please choose today or a future date."); return; }
    if (kind === "subscription" && new Date(`${date}T12:00:00`).getDay() !== 6) { setError("Bread boxes arrive on Saturdays. Please choose a Saturday."); return; }
    setError("");
    setConfirmation(kind === "catering"
      ? `${form.get("occasion")} request preview for ${form.get("guests")} guests on ${date}. Your preferences are noted locally. No quote was sent; there is no guaranteed price or availability.`
      : `${form.get("gift") ? "Gift bread" : "Bread"} box preview starts ${date}: $32.00/week for 2 loaves, 1 pastry, and tasting notes. No subscription, delivery, recurring charge, or email was created.`);
    event.currentTarget.reset();
  }
  function jump(id: string) {
    setNav(false);
    window.setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" }); document.getElementById(id)?.focus({ preventScroll: true }); }, 0);
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <a href="#" className="brand" aria-label="Golden Crumb home"><Wheat size={33}/><span>Golden Crumb<small>BAKERY & CAFÉ</small></span></a>
      <nav aria-label="Main navigation" className="desktop-nav">
        <a href="#menu">Menu</a><button onClick={() => open("cart")}>Order Online</button><a href="#catering">Catering</a><a href="#story">Our Story</a><a href="#visit">Visit Us</a>
      </nav>
      <div className="header-actions"><button className="bag-button" aria-label={`Open shopping bag, ${count} items`} onClick={() => open("cart")}><ShoppingBag size={22}/><span>{count}</span></button><button className="button compact desktop-pickup" onClick={() => open("cart")}>Order Pickup <ArrowRight size={15}/></button><button className="menu-toggle" aria-label="Open mobile navigation" onClick={() => { navOpener.current = document.activeElement as HTMLElement; setNav(true); }}><Menu/></button></div>
    </header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-art"><BakeryArt kind="croissant" label="Golden almond croissant on a flour-dusted wooden bakery counter"/></div>
        <div className="hero-shade"/>
        <div className="hero-content">
          <span className="eyebrow light"><span/> YOUR NEIGHBORHOOD’S LITTLE HAPPY PLACE <span/></span>
          <p className="script">Baked Fresh Every Morning</p>
          <h1 id="hero-title">Artisan Breads,<br/>Pastries <i>&</i> Coffee</h1>
          <p className="hero-description">Made from scratch with organic flour, local butter,<br className="desktop-break"/> and a whole lot of love since 2018.</p>
          <div className="button-row"><a className="button" href="#menu">View Today&apos;s Menu <ArrowRight size={17}/></a><button className="button outline" onClick={() => open("cart")}>Order for Pickup <ShoppingBag size={17}/></button></div>
          <span className="hero-footnote">Fictional bakery · original illustrations · no real orders</span>
        </div>
        <a href="#specials" className="hero-scroll" aria-label="Discover today's specials"><ArrowDown size={20}/></a>
      </section>
      <div className="values-strip"><span><Wheat size={18}/> Slow-fermented. Made by hand.</span><span><Heart size={18}/> A little love in every layer.</span><span><Coffee size={18}/> Your morning, made golden.</span></div>

      <section id="specials" className="section" tabIndex={-1}>
        <div className="section-top"><div><p className="eyebrow">GOOD MORNING, MAPLEWOOD</p><h2>Fresh Out of the Oven</h2></div><p className="daily-note"><Clock3 size={16}/> Updated daily at 6 AM<small>Illustrative selection — not live inventory</small></p></div>
        <div className="specials-grid">{products.filter(item => ["sourdough", "almond", "lavender"].includes(item.id)).map(item => <article className="special-card" key={item.id}>
          <div className="card-art"><BakeryArt kind={item.art} label={item.name}/><span className="badge">{item.tag}</span><span className="art-label">THE BAKER&apos;S EDIT</span></div>
          <div className="card-content"><div className="title-price"><h3>{item.name}</h3><strong>{money(item.cents)}</strong></div><p>{item.description}</p><button className="add-order" onClick={() => choose(item)}>Add to Order <Plus size={17}/></button></div>
        </article>)}</div>
      </section>

      <section id="menu" className="section menu-section" tabIndex={-1}>
        <div className="center-heading"><p className="eyebrow">SOMETHING FOR EVERY KIND OF MORNING</p><h2>A good day starts here.</h2><p>Freshly baked favorites. Thoughtfully brewed comforts.</p></div>
        <div className="tabs" role="tablist" aria-label="Menu categories">{categories.map((name, index) => <button key={name} id={`tab-${index}`} role="tab" aria-selected={category === name && !fullMenu} aria-controls="menu-panel" tabIndex={category === name ? 0 : -1} onClick={() => { setCategory(name); setFullMenu(false); }} onKeyDown={event => {
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            const next = event.key === "Home" ? 0 : event.key === "End" ? categories.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + categories.length) % categories.length;
            setCategory(categories[next]); setFullMenu(false); document.getElementById(`tab-${next}`)?.focus();
          }
        }}>{name}</button>)}</div>
        <div id="menu-panel" role="tabpanel" aria-label={fullMenu ? "Full menu" : category} className="menu-grid">{products.filter(item => fullMenu || item.category === category).map(item => <article className="menu-item" key={item.id}>
          <BakeryArt kind={item.art} label={item.name}/><div><h3>{item.name}</h3><p>{item.description}</p>{item.dietary && <small>{item.dietary === "Contains nuts" ? "♧" : "❧"} {item.dietary}</small>}</div><strong>{money(item.cents)}</strong><button aria-label={`Add ${item.name}`} onClick={() => choose(item)}><Plus size={19}/></button>
        </article>)}</div>
        <p className="dietary-note">Recipe labels are fictional, not certifications. Shared preparation areas may contain wheat, milk, eggs, sesame, and nuts. No item is guaranteed allergen-free.</p>
        <div className="center"><button className="button soft" onClick={() => setFullMenu(!fullMenu)}>{fullMenu ? "Show Selected Category" : "View Full Menu"} <ArrowRight size={17}/></button></div>
      </section>

      <section id="story" className="story-section" tabIndex={-1}>
        <div className="story-art"><BakeryArt kind="kitchen" label="Illustrated fictional founders Elena and Marcus baking together"/><div className="story-stamp"><Wheat/><span>MADE WITH LOVE<br/><strong>Since 2018</strong></span></div></div>
        <div className="story-content"><p className="eyebrow">OUR HANDS. OUR HEARTS. YOUR TABLE.</p><h2>From Our Kitchen<br/>to Yours</h2><p>What started as a weekend farmers market stand in 2018 has grown into the neighborhood&apos;s favorite gathering spot.</p><p>We&apos;re Elena and Marcus, and we believe great bread takes time — our sourdough starter is older than the shop. Every loaf, pastry, and cup of coffee is made with intention.</p><p className="signature">— Elena & Marcus</p><button className="text-link" onClick={() => open("story")}>Read Our Full Story <ArrowRight size={18}/></button></div>
      </section>

      <section id="order" className="section ordering" tabIndex={-1}>
        <div className="center-heading"><p className="eyebrow">MORE SAVORING. LESS WAITING.</p><h2>Order Ahead, Skip the Line</h2></div>
        <div className="steps">{[[Menu, "Browse Our Menu", "Choose from today’s fresh selection"], [Clock3, "Pick Your Time", "Select a pickup window that works for you"], [ShoppingBag, "Grab & Go", "Your order, boxed and ready when you arrive"]].map(([Icon, title, text], index) => {
          const StepIcon = Icon as typeof Menu;
          return <div className="step" key={String(title)}><div className="step-icon"><StepIcon size={29}/><span>{index + 1}</span></div><h3>{String(title)}</h3><p>{String(text)}</p></div>;
        })}</div><div className="center"><button className="button" onClick={() => open("cart")}>Start Your Order <ArrowRight size={17}/></button><p className="small-note">Try a local pickup preview. No payment or real fulfillment.</p></div>
      </section>

      <section id="gallery" className="section gallery-section" tabIndex={-1}>
        <div className="center-heading"><p className="eyebrow">LITTLE MOMENTS, GOLDEN MEMORIES</p><h2>Life at Golden Crumb</h2></div>
        <div className="gallery-grid">{gallery.map((image, index) => <button key={image.caption} aria-label={`Open gallery: ${image.caption}`} onClick={() => { setPhoto(index); open("gallery"); }}><BakeryArt kind={image.kind} label={image.caption}/><span>{image.caption} <Plus size={20}/></span></button>)}</div>
        <p className="gallery-follow"><button className="text-link" onClick={() => { setSocial("Instagram"); open("social"); }}>@goldencrumb <ArrowRight size={15}/></button><span>Follow us for daily bake updates · fictional handle preview</span></p>
      </section>

      <section className="reviews-section" aria-label="Fictional customer review carousel" onMouseEnter={() => setHoverPaused(true)} onMouseLeave={() => setHoverPaused(false)} onFocusCapture={() => setFocusPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false); }} onTouchStart={event => { touch.current = event.touches[0].clientX; }} onTouchEnd={event => { const delta = event.changedTouches[0].clientX - touch.current; if (Math.abs(delta) > 45) setReview(value => (value + (delta < 0 ? 1 : 3)) % 4); }}>
        <p className="eyebrow">KIND WORDS, WARM HEARTS</p><span className="stars" aria-label="Fictional five-star rating">★★★★★</span>
        <blockquote key={review}>“{reviews[review][0]}”</blockquote><p className="review-author">{reviews[review][1]}</p><p className="small-note">Fictional review from the design brief. Not a Google or Yelp endorsement.</p>
        <div className="review-controls"><button aria-label="Previous review" onClick={() => setReview((review + 3) % 4)}>←</button>{reviews.map((_, index) => <button key={index} className={`dot ${review === index ? "active" : ""}`} aria-label={`Show review ${index + 1}`} aria-pressed={review === index} onClick={() => setReview(index)}/>)}<button aria-label="Next review" onClick={() => setReview((review + 1) % 4)}>→</button><button className="pause-button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Play" : "Pause"}</button></div>
      </section>

      <section id="catering" className="section catering-section" tabIndex={-1}>
        <div><p className="eyebrow">BRING SOMETHING GOOD TO THE TABLE</p><h2>Catering for<br/>Every Occasion</h2><p>From office breakfast spreads to wedding dessert tables, we craft custom menus for groups of 10 to 200.</p><ul className="check-list"><li><Check/> Pastry & bread platters for corporate meetings</li><li><Check/> Custom wedding and celebration cakes</li><li><Check/> Weekly office bread box subscriptions</li></ul><button className="button" onClick={() => open("catering")}>Request a Catering Quote <ArrowRight size={17}/></button></div>
        <div className="catering-art"><BakeryArt kind="platter" label="Illustrated bread and pastry platter on a wooden board"/><span className="hand-note">good food.<br/>great company.</span></div>
      </section>

      <section id="subscription" className="bread-box-section" tabIndex={-1}>
        <div className="box-art"><BakeryArt kind="box" label="Kraft paper bread box with a golden sourdough loaf"/></div><div><p className="eyebrow">A LITTLE TRADITION, DELIVERED</p><h2>The Weekly Bread Box</h2><p>A curated selection of our freshest breads and one surprise pastry, at your door every Saturday.</p><p className="box-price">$32<span>/week</span></p><p className="box-includes">2 loaves + 1 specialty pastry + tasting notes<br/>Free delivery within 5 miles (fictional service area)</p><button className="button" onClick={() => open("subscription")}>Subscribe Now <ArrowRight size={17}/></button><span className="gift-note">♡ Perfect gift — gift subscriptions available</span></div>
      </section>

      <section id="visit" className="section visit-section" tabIndex={-1}>
        <div className="map-art"><img src="/neighborhood.svg" alt="Illustrated fictional neighborhood map showing Golden Crumb on Elm Street"/><span>ILLUSTRATED MAP · NOT FOR NAVIGATION</span></div>
        <div><p className="eyebrow">COME ON IN. STAY A WHILE.</p><h2>Your Neighborhood<br/>Golden Crumb</h2><p className="address">247 Elm Street, Maplewood Village</p><dl className="hours"><div><dt>Tuesday – Friday</dt><dd>7:00 AM – 4:00 PM</dd></div><div><dt>Saturday</dt><dd>7:00 AM – 3:00 PM</dd></div><div><dt>Sunday</dt><dd>8:00 AM – 2:00 PM</dd></div><div><dt>Monday</dt><dd>Closed (baking day!)</dd></div></dl><p className="small-note">Sunday: pastries & coffee only.</p><p>☎ (555) 847-2200 <span className="small-note">— fictional; no call link</span></p><p className="small-note">Free street parking + lot behind the building<br/>Dog-friendly patio seating available</p><p className="mock-note">This address, business, hours, sourcing, parking, and service availability are fictional design-brief details. Do not travel here.</p></div>
      </section>

      <section className="newsletter-section"><Wheat size={43}/><div><h2>Join the Crumb Club</h2><p>Seasonal specials, baking tips, and a little something sweet.<br/>Preview a 10% welcome coupon — no real discount or email.</p></div><form onSubmit={event => { event.preventDefault(); setNewsletterDone(true); }}><label className="sr-only" htmlFor="newsletter">Email for the Crumb Club</label><div className="newsletter-input"><input id="newsletter" type="email" required maxLength={150} placeholder="Your email address" value={newsletter} onChange={event => { setNewsletter(event.target.value); setNewsletterDone(false); }}/><button type="submit">Join <ArrowRight size={17}/></button></div><p role="status">{newsletterDone ? "Welcome preview! Code CRUMB10 (fictional). No email sent or saved." : "Local-only demo. Your email stays in this page."}</p>{newsletterDone && <button type="button" className="reset-newsletter" onClick={() => { setNewsletter(""); setNewsletterDone(false); }}>Reset preview</button>}</form></section>
    </main>
    <footer><div className="footer-top"><div className="footer-brand"><a className="brand" href="#"><Wheat size={32}/><span>Golden Crumb<small>BAKERY & CAFÉ</small></span></a><p>Made with flour, butter,<br/>and a whole lot of love.</p><span className="signature">See you in the morning.</span></div><div><h3>Menu</h3><a href="#menu">Breads & Pastries</a><a href="#menu" onClick={() => { setCategory("Coffee & Drinks"); setFullMenu(false); }}>Coffee & Drinks</a><button onClick={() => open("cart")}>Order Pickup</button><a href="#subscription">Bread Box</a></div><div><h3>Company</h3><a href="#story">Our Story</a><a href="#catering">Catering & Events</a><a href="#visit">Visit Us</a><button onClick={() => open("story")}>Our baking philosophy</button></div><div><h3>Connect</h3>{["Instagram", "Facebook", "TikTok"].map(name => <button key={name} onClick={() => { setSocial(name); open("social"); }}>{name} ↗</button>)}<span className="small-note">Local previews, not external accounts.</span></div></div><div className="footer-bottom"><span>© 2026 Golden Crumb Bakery & Cafe. Fictional local demo.</span><span>Visa · Mastercard · Apple Pay · Google Pay <small>(design labels only; no payment accepted)</small></span></div></footer>
    <div className="mobile-order"><span>Something golden awaits.</span><button className="button compact" onClick={() => open("cart")}>Order Now <ShoppingBag size={16}/>{count > 0 && <span>{count}</span>}</button></div>
    <div className={`toast ${toast ? "visible" : ""}`} role="status">{toast && <><Check size={18}/>{toast}</>}</div>

    <dialog ref={mobileDialog} className="mobile-nav" aria-label="Mobile navigation" onCancel={() => setNav(false)}>
      <button className="close-button" aria-label="Close mobile navigation" onClick={() => setNav(false)}><X/></button><Wheat size={48}/><p className="script">Golden Crumb</p><nav aria-label="Mobile">{[["Menu", "menu"], ["Order Online", "order"], ["Catering", "catering"], ["Our Story", "story"], ["Visit Us", "visit"]].map(([label, id]) => <button key={id} onClick={() => jump(id)}>{label}<ArrowRight size={20}/></button>)}</nav><p className="small-note">A little golden, every day.</p>
    </dialog>
    <dialog ref={dialog} className={`modal ${modal === "gallery" ? "gallery-modal" : ""}`} aria-labelledby="modal-title" onCancel={() => setModal(null)}>
      <button className="close-button" aria-label="Close dialog" onClick={() => setModal(null)}><X/></button>
      {confirmation ? <div className="confirmation"><span className="confirm-icon"><Check size={36}/></span><p className="eyebrow">LOCAL DEMO ONLY</p><h2 id="modal-title">A little golden moment.</h2><p role="status">{confirmation}</p><button className="button" onClick={() => setModal(null)}>Done <Check size={17}/></button></div> : <>
        {modal === "product" && <><BakeryArt kind={product.art} label={product.name}/><p className="eyebrow">MADE BY HAND, CHOSEN BY YOU</p><h2 id="modal-title">{product.name}</h2><p>{product.description}</p><form onSubmit={add}><label>Preparation<select value={option} onChange={event => { setOption(event.target.value); setError(""); }}><option>Standard</option>{product.category === "Coffee & Drinks" ? <><option>Oat milk</option><option>Decaf</option></> : product.id === "lemon" ? <option>Gluten-free recipe</option> : product.category === "Breads" ? <option>Sliced</option> : <option>Warmed</option>}</select></label><p className="small-note">{extra ? "This recipe option adds $0.75 per item." : "This preparation adds no charge."} All options are fictional; allergen safety is not guaranteed.</p><label>Quantity<input aria-label="Quantity" type="number" min="1" max="20" step="1" required value={quantity || ""} onChange={event => { setQuantity(Number(event.target.value)); setError(""); }}/></label>{error && <p className="error" role="alert">{error}</p>}<button className="button wide" type="submit">Add to Bag · {money((product.cents + extra) * (Number.isInteger(quantity) && quantity > 0 ? quantity : 0))} <Plus size={18}/></button></form></>}
        {modal === "cart" && <><p className="eyebrow">YOUR MORNING, BOXED UP</p><h2 id="modal-title">Your pickup bag</h2>{!cart.length ? <div className="empty-bag"><ShoppingBag size={46}/><h3>A fresh start.</h3><p>Your bag is empty. Let&apos;s find your favorite.</p><button className="button" onClick={() => { setModal(null); window.setTimeout(() => document.getElementById("menu")?.scrollIntoView(), 0); }}>Browse the Menu <ArrowRight size={17}/></button></div> : <><div className="cart-lines">{cart.map(line => <article className="cart-line" key={line.key}><BakeryArt kind={line.product.art}/><div><h3>{line.product.name}</h3><small>{line.option} · {money(line.unit)} each</small><div className="quantity-controls"><button aria-label={`Decrease ${line.product.name}`} onClick={() => setCart(lines => lines.map(item => item.key === line.key ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0))}><Minus size={14}/></button><span aria-label={`${line.product.name} quantity`}>{line.quantity}</span><button disabled={line.quantity === 20} aria-label={`Increase ${line.product.name}`} onClick={() => setCart(lines => lines.map(item => item.key === line.key ? { ...item, quantity: item.quantity + 1 } : item))}><Plus size={14}/></button><button className="remove" aria-label={`Remove ${line.product.name}`} onClick={() => setCart(lines => lines.filter(item => item.key !== line.key))}>Remove</button></div></div><strong>{money(line.unit * line.quantity)}</strong></article>)}</div><div className="bag-total"><span>Pickup total</span><strong data-testid="cart-total">{money(total)}</strong></div><p className="small-note">No tax, fees, or payment in this preview. Prices are fictional.</p><form onSubmit={pickup}><div className="form-grid"><label>Pickup date<input name="date" type="date" min={localDate()} required onChange={() => setError("")}/></label><label>Pickup window<select name="time" required><option value="">Choose a time</option><option>9:00–9:30 AM</option><option>10:00–10:30 AM</option><option>11:00–11:30 AM</option><option>12:00–12:30 PM</option></select></label></div><p className="small-note">Tuesday–Saturday: full menu. Sunday: pastries & drinks only. Monday closed.</p><label>Your name<input name="name" required minLength={2} maxLength={80} autoComplete="name"/></label><label>Email<input name="email" type="email" required maxLength={150} autoComplete="email"/></label>{error && <p className="error" role="alert">{error}</p>}<label className="checkbox"><input type="checkbox" required/> I understand this is a local preview, not a real order.</label><button className="button wide" type="submit">Confirm Pickup Preview <ArrowRight size={17}/></button></form></>}</>}
        {modal === "catering" && <><p className="eyebrow">LET’S MAKE SOMETHING MEMORABLE</p><h2 id="modal-title">A gathering, made golden.</h2><p>Tell us about your occasion. This local form sends nothing and promises no availability.</p><form onSubmit={event => request(event, "catering")}><label>Occasion<select name="occasion" required><option>Office breakfast</option><option>Wedding dessert table</option><option>Celebration cake</option><option>Weekly office bread boxes</option></select></label><div className="form-grid"><label>Event date<input name="date" type="date" min={localDate()} required onChange={() => setError("")}/></label><label>Guests<input name="guests" type="number" min="10" max="200" step="1" defaultValue="20" required/></label></div><label>Your name<input name="name" minLength={2} maxLength={80} required/></label><label>Email<input name="email" type="email" maxLength={150} required/></label><label>Menu, cake flavor & dietary preferences<textarea name="notes" rows={3} maxLength={1000} required placeholder="For example: lemon celebration cake and pastry platters. Mention any allergies."/></label><p className="small-note">Dietary requests need real human review at a real bakery. Nothing here is guaranteed safe or certified.</p>{error && <p role="alert" className="error">{error}</p>}<label className="checkbox"><input type="checkbox" required/> I understand this request is not sent.</label><button className="button wide" type="submit">Create Quote Preview <ArrowRight size={17}/></button></form></>}
        {modal === "subscription" && <><p className="eyebrow">SATURDAYS, SORTED</p><h2 id="modal-title">Your weekly bread ritual</h2><p>2 loaves + 1 specialty pastry + tasting notes. $32.00/week. No payment or recurring billing.</p><form onSubmit={event => request(event, "subscription")}><label>First Saturday<input name="date" type="date" min={localDate()} required onChange={() => setError("")}/></label><label>Email<input name="email" type="email" maxLength={150} required/></label><label>Delivery address (fictional preview)<input name="address" minLength={5} maxLength={160} required placeholder="Use an invented address."/></label><label className="checkbox"><input type="checkbox" name="gift"/> This is a gift subscription</label><label className="checkbox"><input type="checkbox" required/> My fictional address is within 5 miles. No location lookup occurs.</label><label className="checkbox"><input type="checkbox" required/> I understand no subscription will be created.</label>{error && <p className="error" role="alert">{error}</p>}<button className="button wide" type="submit">Preview Bread Box · $32/week <ArrowRight size={17}/></button></form></>}
        {modal === "story" && <><BakeryArt kind="kitchen"/><p className="eyebrow">A FICTIONAL FOUNDERS’ STORY</p><h2 id="modal-title">Good bread. Good neighbors.</h2><p>Elena and Marcus began with a farmers market table in 2018, a lively sourdough starter, and a simple belief: the best things are worth waiting for.</p><p>In our imagined Maplewood kitchen, dough rests for 48 hours, butter is folded by hand, and the first pot of coffee goes on before sunrise. The bakery grew, but the invitation stayed the same: pull up a chair.</p><p>Organic flour and local butter are story details from the brief, not verified sourcing or certification claims. These people and this business are fictional.</p><p className="signature">— Elena & Marcus</p></>}
        {modal === "gallery" && <><BakeryArt kind={gallery[photo].kind} label={gallery[photo].caption}/><h2 id="modal-title">{gallery[photo].caption}</h2><p className="small-note">Original SVG artwork, adapting the brief&apos;s photography.</p><div className="button-row"><button className="button soft" aria-label="Previous gallery image" onClick={() => setPhoto((photo + 5) % 6)}>← Previous</button><span>{photo + 1} / 6</span><button className="button soft" aria-label="Next gallery image" onClick={() => setPhoto((photo + 1) % 6)}>Next →</button></div></>}
        {modal === "social" && <><p className="eyebrow">LOCAL SOCIAL PREVIEW</p><h2 id="modal-title">Golden Crumb on {social}</h2><BakeryArt kind="croissant"/><p>@goldencrumb · Fresh layers. Slow mornings. A little flour on everything.</p><p className="mock-note">Fictional handle and post. No external account, endorsement, follower count, or live feed is connected.</p></>}
      </>}
    </dialog>
  </>;
}
