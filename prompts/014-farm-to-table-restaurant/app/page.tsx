"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronRight, Leaf, MapPin, Menu, MoveUpRight, Sprout, X } from "lucide-react";
import { Artwork, Wheat } from "../components/artwork";
import { categories, Dialog, InquiryForm, ReservationForm } from "../components/controls";
import { dishes, farms, gallery, reviews, farmDinner, type Category, type Diet, type Dish, type Farm, type Season } from "../components/data";

type Overlay = { kind: "dish"; dish: Dish } | { kind: "farm"; farm: Farm } |
  { kind: "gallery"; index: number } | { kind: "event" } | { kind: "private" } | { kind: "contact"; channel?: string };
const links = [["Menu", "menu"], ["Our farms", "farms"], ["Our story", "story"], ["Gatherings", "gatherings"]] as const;

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [category, setCategory] = useState<Category>("Starters");
  const [season, setSeason] = useState<Season>("Spring 2026");
  const [diet, setDiet] = useState<Diet>("All dishes");
  const [full, setFull] = useState(false);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const origin = useRef<HTMLElement | null>(null);
  const navButton = useRef<HTMLButtonElement>(null);
  const [review, setReview] = useState(0);
  const [reviewPaused, setReviewPaused] = useState(false);
  const [reviewHover, setReviewHover] = useState(false);
  const [reviewFocus, setReviewFocus] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  function open(value: Overlay) {
    if (!overlay) origin.current = document.activeElement as HTMLElement;
    setOverlay(value);
  }
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || reviewPaused || reviewHover || reviewFocus) return;
    const timer = window.setInterval(() => setReview(i => (i + 1) % reviews.length), 6000);
    const stop = () => { if (media.matches) window.clearInterval(timer); };
    media.addEventListener("change", stop);
    return () => { window.clearInterval(timer); media.removeEventListener("change", stop); };
  }, [reviewPaused, reviewHover, reviewFocus]);
  const visible = dishes.filter(d => d.season === season && (full || d.category === category) && (diet === "All dishes" || d.diet === diet));
  function resetMenu() { setDiet("All dishes"); setCategory("Starters"); setFull(false); }

  return <>
    <a className="skip" href="#main">Skip to content</a>
    <div className="demo-bar">A fictional restaurant, a real taste of the seasons. <span>Local demo only · no live bookings</span></div>
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Harvest and Hearth home"><Wheat /><span>Harvest <i>&</i> Hearth<small>ASHFORD VALLEY · EST. 2018</small></span></a>
      <button ref={navButton} className="nav-toggle icon-button" aria-label={navOpen ? "Close navigation" : "Open navigation"} aria-expanded={navOpen} aria-controls="main-navigation" onClick={() => setNavOpen(!navOpen)}>{navOpen ? <X /> : <Menu />}</button>
      <nav id="main-navigation" className={navOpen ? "navigation is-open" : "navigation"} aria-label="Main navigation" onKeyDown={e => { if (e.key === "Escape") { setNavOpen(false); navButton.current?.focus(); } }}>
        {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setNavOpen(false)}>{label}</a>)}
        <a className="button small" href="#reservations" onClick={() => setNavOpen(false)}>Reserve a table <MoveUpRight size={15} /></a>
      </nav>
    </header>
    <main id="main">
      <section className="hero" id="home" aria-labelledby="hero-title">
        <Artwork scene="plate" className="hero-art" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow light"><span /> GOOD FOOD. GOOD ROOTS. <span /></div>
          <h1 id="hero-title">Harvest <em>&</em><br />Hearth</h1>
          <p className="hero-tagline">From Our Farms to Your Fork</p>
          <p className="hero-copy">A gathering place for the season&apos;s best.<br />Honest ingredients. Thoughtful plates. A warm welcome.</p>
          <div className="hero-actions"><a className="button amber" href="#menu">View Today&apos;s Menu <ArrowRight size={17} /></a><a className="button outline-light" href="#reservations">Reserve a Table</a></div>
        </div>
        <Wheat className="hero-wheat" />
        <div className="hero-note">Seasonal plate illustration<br /><span>Inspired by the spring harvest</span></div>
        <a className="scroll-cue" href="#philosophy"><ArrowDown size={18} /><span>A LITTLE CLOSER TO THE LAND</span></a>
      </section>
      <section className="philosophy section" id="philosophy" aria-labelledby="philosophy-title">
        <Wheat className="botanical left" /><Wheat className="botanical right" />
        <p className="eyebrow">THE WAY WE COOK</p>
        <h2 id="philosophy-title">Rooted in the Land,<br /><em>Served with Love</em></h2>
        <p className="philosophy-copy">Every dish at Harvest &amp; Hearth begins with a conversation — with the soil, the season, and the farmers who nurture our ingredients. We source 90% of our produce from farms within 30 miles, ensuring peak freshness and supporting our local food community. Our chefs craft each plate to honor the ingredient first, letting nature lead the way.</p>
        <div className="leaf-divider"><span /><Leaf size={22} /><span /></div>
        <p className="fine-print">An illustrative philosophy: sourcing percentages, distances, and practices are fictional, not verified operational claims.</p>
      </section>
      <section className="menu-section section" id="menu" aria-labelledby="menu-title">
        <div className="section-top"><div><p className="eyebrow">FRESH FROM THE FIELDS</p><h2 id="menu-title">What&apos;s Growing Now</h2><p className="subtitle">{season} Menu <span className="dot">·</span> A seasonal snapshot, not a live menu</p></div><div className="season-control"><Leaf size={18} /><label htmlFor="season">Explore a season</label><select id="season" value={season} onChange={e => { setSeason(e.target.value as Season); resetMenu(); }}><option>Spring 2026</option><option>Summer 2026</option></select></div></div>
        <div className="menu-layout">
          <div className="menu-illustration"><Artwork scene="produce" /><div><span className="eyebrow light">THE SEASON SETS THE TABLE</span><p>Picked with care.<br /><em>Plated with purpose.</em></p></div></div>
          <div className="menu-board">
            <div className="menu-tools">
              <div className="menu-tabs" role="tablist" aria-label="Menu course">{categories.map((c, index) => <button key={c} id={`tab-${c}`} role="tab" aria-controls="menu-panel" aria-selected={category === c} tabIndex={category === c ? 0 : -1} onClick={() => { setCategory(c); setFull(false); }} onKeyDown={e => {
                if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
                  e.preventDefault(); const next = e.key === "Home" ? 0 : e.key === "End" ? 2 : (index + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                  setCategory(categories[next]); setFull(false); document.getElementById(`tab-${categories[next]}`)?.focus();
                }
              }}>{c}</button>)}</div>
              <label className="mobile-course">Course<select aria-label="Menu course" value={category} onChange={e => { setCategory(e.target.value as Category); setFull(false); }}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
              <label className="diet-label">Preference<select aria-label="Dietary preference" value={diet} onChange={e => setDiet(e.target.value as Diet)}><option>All dishes</option><option>Vegetarian</option><option>Plant-based</option></select></label>
            </div>
            <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${category}`} tabIndex={0}>
              {full && <p className="full-label">Full {season.toLowerCase()} menu · all courses</p>}
              {visible.length ? visible.map(d => <button className="dish-row" key={d.id} onClick={() => open({ kind: "dish", dish: d })}><span>{full && <small className="course-tag">{d.category}</small>}<strong>{d.name}</strong><small>{d.description}</small></span><span className="price">${d.price}<ChevronRight size={15} /></span></button>) :
                <div className="empty-state" role="status"><Sprout /><h3>No dishes in this patch.</h3><p>There are no {diet.toLowerCase()} {category.toLowerCase()} in this seasonal snapshot.</p><button className="text-button" onClick={resetMenu}>Reset menu filters <ArrowRight size={16} /></button></div>}
            </div>
            <div className="menu-bottom"><button className="text-button" onClick={() => { setFull(!full); setDiet("All dishes"); }}>{full ? "Back to course menu" : "View Full Menu"} <ArrowRight size={17} /></button><span>Click a dish for its farm story</span></div>
          </div>
        </div>
        <p className="fine-print menu-disclaimer">Prices, dietary labels, ingredients, and allergens are illustrative. Cross-contact is possible; this demo cannot confirm dietary safety or take food orders. Spring&apos;s tomato and stone-fruit pairings follow the brief rather than a verified local harvest calendar.</p>
      </section>
      <section className="farms-section section" id="farms" aria-labelledby="farms-title">
        <div className="center-heading"><p className="eyebrow">NEIGHBORS. GROWERS. FRIENDS.</p><h2 id="farms-title">Our Farm Family</h2><p>We&apos;re proud to work with these local growers and producers.</p><small>Fictional partnerships; “organic” and animal-welfare terms are not certifications.</small></div>
        <div className="farm-grid">{farms.map(f => <article className="farm-card" key={f.name}><div className="farm-image"><Artwork scene={f.scene} /><span className="distance"><MapPin size={13} /> {f.distance} miles away*</span></div><div className="farm-body"><h3>{f.name}</h3><p>{f.products}</p><button className="text-button" onClick={() => open({ kind: "farm", farm: f })}>Learn More <MoveUpRight size={16} /></button></div></article>)}</div>
        <div className="sustainability"><Leaf /><p><strong>A lighter footprint, a fuller table.</strong> Seasonal planning, reusable crates, and thoughtful use of every ingredient — ideas for our fictional kitchen, not audited sustainability results.</p><span>*Illustrative distances</span></div>
      </section>
      <section className="chef-section" id="story" aria-labelledby="chef-title">
        <div className="chef-image"><Artwork scene="chef" /><span>AN ILLUSTRATED PORTRAIT OF OUR FICTIONAL CHEF</span></div>
        <div className="chef-copy"><p className="eyebrow">THE HANDS BEHIND THE HARVEST</p><h2 id="chef-title">Meet Chef<br /><em>Elara Voss</em></h2><p>With 15 years of experience in kitchens from Lyon to Portland, Chef Elara brings a deep respect for seasonal cooking and traditional techniques. She joined Harvest &amp; Hearth in 2022 with a mission: let the ingredients speak for themselves. Her menus change weekly based on what arrives from the farms — no two visits are ever quite the same.</p><blockquote>“I don&apos;t write menus.<br />The farms write them for me.”</blockquote><div className="credentials"><span>James Beard Semifinalist 2025*</span><span>Farm-to-Table Chef of the Year*</span></div><small>*Fictional credentials from the creative brief; no real award, affiliation, or endorsement is asserted.</small></div>
      </section>
      <section className="gallery-section section" id="gallery" aria-labelledby="gallery-title">
        <div className="section-top"><div><p className="eyebrow">MOMENTS AROUND OUR TABLE</p><h2 id="gallery-title">A feast for the senses</h2></div><p className="gallery-note">An illustrated glimpse of life here.<br />Tap to linger a little longer.</p></div>
        <div className="gallery-grid">{gallery.map((g, i) => <button className={`gallery-item gallery-${i}`} key={g.title} aria-label={`Open gallery: ${g.title}`} onClick={() => open({ kind: "gallery", index: i })}><Artwork scene={g.scene} /><span>{g.title} <MoveUpRight size={17} /></span></button>)}</div>
        <p className="fine-print">Six original SVG scenes stand in for photography. Swipe the gallery on mobile, or open any image to browse with arrow keys.</p>
      </section>
      <section className="gatherings section" id="gatherings" aria-labelledby="gatherings-title">
        <div className="center-heading"><p className="eyebrow">MAKE ROOM FOR SOMETHING SPECIAL</p><h2 id="gatherings-title">Gather, share, celebrate.</h2></div>
        <div className="event-grid"><article className="farm-dinner"><span className="eyebrow">UNDER THE STARS</span><h3>Farm Dinners</h3><p>Join us for monthly farm dinners at our partner farms. A 5-course meal served under the stars, featuring ingredients harvested that afternoon.</p><div className="event-date"><span>APR<big>18</big></span><div><strong>{farmDinner.name}</strong><p>{farmDinner.date} · {farmDinner.farm}</p><small>Archived spring event · local replay only</small></div></div><p className="event-price">$125 <span>per person · wine pairing included*</span></p><button className="button" onClick={() => open({ kind: "event" })}>Reserve Your Spot <ArrowRight size={17} /></button><small className="event-footnote">*Illustrative menu and price. No alcohol service or payment. Eight demo places available per request.</small></article>
          <article className="private-dining"><span className="eyebrow">YOUR PEOPLE. OUR TABLE.</span><h3>Private Dining</h3><p>Host your next celebration in our private dining room, seating up to 24 guests. Custom menus crafted by Chef Elara for your event.</p><ul><li><Check size={16} /> Up to 24 guests, one beautiful table</li><li><Check size={16} /> A menu shaped around your celebration</li><li><Check size={16} /> Tuesday–Sunday evenings, by inquiry*</li></ul><button className="button outline" onClick={() => open({ kind: "private" })}>Inquire Now <ArrowRight size={17} /></button><small className="event-footnote">*Illustrative private-evening service, separate from Sunday&apos;s public brunch. Inquiries are local previews, not accepted events.</small></article></div>
      </section>
      <section className="reviews section" aria-label="Illustrative guest stories" onMouseEnter={() => setReviewHover(true)} onMouseLeave={() => setReviewHover(false)} onFocusCapture={() => setReviewFocus(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setReviewFocus(false); }}>
        <div className="quote-mark">“</div><p className="eyebrow">WORDS FROM AN IMAGINED TABLE</p><div className="stars" aria-label="Five illustrative stars">★★★★★</div><blockquote>{reviews[review].quote}</blockquote><p className="review-by">{reviews[review].name} <span>· {reviews[review].platform} (fictional attribution)</span></p>
        <div className="review-controls">{reviews.map((_, i) => <button key={i} className={review === i ? "review-dot active" : "review-dot"} aria-label={`Show guest story ${i + 1}`} aria-pressed={review === i} onClick={() => { setReview(i); setReviewPaused(true); }} />)}<button className="text-button pause-button" onClick={() => setReviewPaused(!reviewPaused)}>{reviewPaused ? "Resume rotation" : "Pause rotation"}</button></div><p className="fine-print">Creative-brief testimonials, not genuine reviews or platform endorsements. Rotation pauses on focus/hover and respects reduced motion.</p>
      </section>
      <section className="reservation-section section" id="reservations" aria-labelledby="reserve-title"><div className="center-heading"><p className="eyebrow">THERE&apos;S A PLACE FOR YOU HERE</p><h2 id="reserve-title">Reserve Your Table</h2><p>Good company deserves a good table.</p></div><ReservationForm /><p className="reservation-note">For parties larger than 12, <button className="inline-link" onClick={() => open({ kind: "private" })}>inquire about private dining</button>.<br />Or view our illustrative contact: <button className="inline-link" onClick={() => open({ kind: "contact" })}>(555) 482-7700</button></p></section>
      <section className="visit-section section" id="contact" aria-labelledby="visit-title">
        <div className="illustrative-map" role="img" aria-label="Illustrative valley diagram, not a real map or directions"><div className="map-field field-one" /><div className="map-field field-two" /><div className="map-river" /><div className="map-road" /><div className="map-marker"><Wheat /><strong>Harvest &amp; Hearth</strong><span>412 Elm Street</span></div><span className="map-label">ASHFORD VALLEY</span><span className="map-warning">Illustrative location · not for navigation</span></div>
        <div className="visit-copy"><p className="eyebrow">FIND YOUR WAY TO OUR TABLE</p><h2 id="visit-title">Visit Us</h2><p>412 Elm Street, Ashford Valley,<br />OR 97520 <span className="fine-print">(fictional address)</span></p><dl className="hours"><div><dt>Tuesday – Thursday</dt><dd>5:00 PM – 9:30 PM</dd></div><div><dt>Friday – Saturday</dt><dd>5:00 PM – 10:30 PM</dd></div><div><dt>Sunday Brunch</dt><dd>10:00 AM – 2:00 PM</dd></div><div><dt>Monday</dt><dd>Closed</dd></div></dl><button className="text-button" onClick={() => open({ kind: "contact" })}>hello@harvestandhearth.com <MoveUpRight size={15} /></button><p className="fine-print">Fictional phone: (555) 482-7700<br />Illustrative parking: free lot behind the building, street parking available. Address, hours, contact, and parking are not real operational information.</p></div>
      </section>
      <section className="newsletter section" aria-labelledby="newsletter-title"><Wheat /><div><p className="eyebrow light">A NOTE FROM THE FARMHOUSE</p><h2 id="newsletter-title">Stay in Season</h2><p>Weekly menu updates, farm dinner invitations,<br />and seasonal recipes from Chef Elara.</p></div>
        <div className="newsletter-form">{newsletter ? <div className="newsletter-success" role="status"><Check /><strong>You&apos;re on the demo list.</strong><p>No email was sent or stored.</p><button className="text-button" onClick={() => setNewsletter(false)}>Try another email</button></div> : <form onSubmit={e => { e.preventDefault(); const email = String(new FormData(e.currentTarget).get("newsletter")); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setNewsletterError("Enter a complete email address, such as you@example.com."); return; } setNewsletterError(""); setNewsletter(true); }}>
          <label htmlFor="newsletter-email">Your email address</label><div className="newsletter-input"><input id="newsletter-email" name="newsletter" type="email" required placeholder="you@example.com" autoComplete="email" /><button className="button amber" type="submit">Subscribe <ArrowRight size={16} /></button></div>{newsletterError && <p role="alert">{newsletterError}</p>}<small>Illustrative: one email per week, unsubscribe anytime.<br />This local demo does not send or save email.</small>
        </form>}</div></section>
    </main>
    <footer><div className="footer-top"><a className="brand" href="#home"><Wheat /><span>Harvest <i>&</i> Hearth<small>FROM OUR FARMS TO YOUR FORK</small></span></a><div className="footer-links"><a href="#menu">Menu</a><a href="#reservations">Reservations</a><button onClick={() => open({ kind: "private" })}>Private Dining</button><a href="#farms">Farm Partners</a><a href="#story">About</a><a href="#contact">Contact</a></div><div className="socials">{["Instagram", "Facebook", "Yelp"].map(s => <button key={s} aria-label={`Preview ${s} information`} onClick={() => open({ kind: "contact", channel: s })}>{s}</button>)}</div></div><div className="footer-bottom"><span>© 2026 Harvest &amp; Hearth. All rights reserved.</span><span>Proudly serving Ashford Valley since 2018. <i>Fictional brand story.</i></span></div><p className="fine-print">An original local demo. All restaurant, farm, chef, review, dietary, and operational claims are illustrative. No reservations, orders, payments, accounts, maps, or third-party services are connected.</p></footer>
    <a className="mobile-reserve button" href="#reservations">Reserve a Table <MoveUpRight size={16} /></a>
    {overlay && <Dialog title={overlay.kind === "dish" ? overlay.dish.name : overlay.kind === "farm" ? overlay.farm.name : overlay.kind === "gallery" ? gallery[overlay.index].title : overlay.kind === "event" ? "Reserve a Farm Dinner Spot" : overlay.kind === "private" ? "Plan Your Private Gathering" : "Illustrative contact information"} onClose={() => setOverlay(null)} origin={origin}>
      {overlay.kind === "dish" && <div className="dish-detail"><p className="eyebrow">{overlay.dish.season} · {overlay.dish.category}</p><p className="detail-price">${overlay.dish.price}</p><p>{overlay.dish.description}</p><blockquote>{overlay.dish.note}</blockquote><h3>From our farm family</h3><p>{overlay.dish.farm} — fictional sourcing.</p><h3>Dietary notes</h3><p>{overlay.dish.diet} (illustrative). Listed allergens: {overlay.dish.allergens}.</p><p className="notice">Not dietary or allergen advice. Recipes and cross-contact would require confirmation with a real kitchen. No food orders can be placed here.</p><button className="button" onClick={() => { setOverlay(null); window.setTimeout(() => document.getElementById("reservations")?.scrollIntoView(), 0); }}>Plan a table visit <ArrowRight size={16} /></button></div>}
      {overlay.kind === "farm" && <div className="farm-detail"><Artwork scene={overlay.farm.scene} /><p>{overlay.farm.story}</p><h3>What comes to the kitchen</h3><p>{overlay.farm.products}</p><h3>Practices we imagine</h3><ul>{overlay.farm.practices.map(p => <li key={p}>{p}</li>)}</ul><p className="notice">A fictional farm profile, {overlay.farm.distance} illustrative miles away. No organic, sourcing, animal-welfare, or sustainability certification is verified.</p></div>}
      {overlay.kind === "gallery" && <div className="lightbox" onKeyDown={e => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); setOverlay({ kind: "gallery", index: (overlay.index + (e.key === "ArrowRight" ? 1 : 5)) % 6 }); } }}><Artwork scene={gallery[overlay.index].scene} /><p>{gallery[overlay.index].caption}</p><div className="lightbox-controls"><button className="icon-button" aria-label="Previous image" onClick={() => setOverlay({ kind: "gallery", index: (overlay.index + 5) % 6 })}><ArrowLeft /></button><span aria-live="polite">{overlay.index + 1} / 6 · Original illustration</span><button className="icon-button" aria-label="Next image" onClick={() => setOverlay({ kind: "gallery", index: (overlay.index + 1) % 6 })}><ArrowRight /></button></div></div>}
      {overlay.kind === "event" && <InquiryForm mode="event" />}
      {overlay.kind === "private" && <InquiryForm mode="private" />}
      {overlay.kind === "contact" && <div className="contact-detail"><MapPin /><p>{overlay.channel ? `${overlay.channel} is an illustrative social channel only. There is no connected profile or review provider.` : "This is a fictional restaurant. The address, phone, and email are display-only and should not be used to contact a business."}</p><p>412 Elm Street, Ashford Valley, OR 97520<br />(555) 482-7700<br />hello@harvestandhearth.com</p><p className="notice">No calls, emails, external maps, or provider requests are made. To explore the local experience, try the reservation or private-dining form.</p><button className="button" onClick={() => setOverlay({ kind: "private" })}>Preview a private inquiry <ArrowRight size={16} /></button></div>}
    </Dialog>}
  </>;
}
