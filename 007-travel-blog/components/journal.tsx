"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, Bookmark, Check, Compass, Menu, Search, X } from "lucide-react";
import { archiveCounts, authors, categories, dateLabel, stories, type Story } from "./stories";

const information: Record<string, string> = {
  "Our Story": "Wanderlust Chronicles is a fictional multi-author magazine exploring a slower, more curious way to travel. Every story and illustration in this demo is original. The named writers are fictional personas, not real travelers or endorsements.",
  "Write for Us": "Our imagined editorial brief: pitch one place, one perspective and a clear reason to care. Include how you would report responsibly and compensate local contributors. This demo does not accept submissions or collect personal information.",
  "Editorial Guidelines": "Stories should respect residents, identify uncertainty and distinguish firsthand reporting from imagined scenes. This demo uses fictional dispatches; practical notes are general starting points, not verified 2026 prices, entry rules, medical advice or safety guarantees.",
  "Press Kit": "Demo identity: Wanderlust Chronicles. Palette: deep teal, warm amber and slate. Original vector landscapes and fictional writer profiles make up this sample magazine. There are no real media partnerships; the source's publisher logos and endorsement claims are intentionally not displayed.",
  "Advertise": "This sample has no ad inventory, sponsored placements or payment flow. The editorial concept would label paid work distinctly and preserve independent selection. No ad inquiry is transmitted.",
  "Packing Lists": "A thoughtful starting list: appropriate footwear, weather layers, refillable water bottle, medication, copies of key documents, a charger and offline emergency contacts. Adapt it to your destination, mobility and activities; check airline luggage restrictions.",
  "Budget Calculators": "Try the planning method: accommodation + food + local transport + entry fees + a contingency, then add flights, insurance and equipment separately. The Patagonia story includes a clearly labeled $50 illustrative breakdown. No live exchange rates or interactive calculator are provided.",
  "Travel Insurance Guide": "Compare exclusions, emergency medical coverage, evacuation, cancellation, activity limits and deductibles. Ask a licensed provider about your specific needs. This demo neither sells insurance nor recommends a policy.",
  "Visa Information": "Use the destination government's official immigration website for your nationality, passport validity, transit rules and intended activities. Recheck close to departure. There is no live visa database in this demo.",
  "Flight Deals": "There is no live deal feed here. Read Marcus's business-class story for a cautious comparison of total costs, award availability and fare conditions. No tickets, credit cards or purchases are offered.",
  "Instagram": "This is a local illustrated photo-journal concept, not a connected social account. Explore the six location studies below; their captions link to original sample stories. No social login or follow request is sent.",
  "YouTube": "A future film notebook could pair quiet location footage with interviews and accessible captions. No channel, videos or external account are connected to this demo.",
  "Twitter/X": "Our imagined short dispatches would share reporting notes rather than live alerts. No social account or posting service is connected.",
  "Pinterest": "Save a story to your local reading list to revisit its illustration and ideas. No external boards or Pinterest integration are connected.",
  "RSS Feed": "The current sample is a client-local reading experience. No published RSS endpoint exists; use the Recent filter to browse the supplied editorial collection.",
  "Privacy Policy": "Searches and reading stay in your browser. Saved story IDs, a demo newsletter confirmation flag and your cookie preference may be stored locally. The email address is never stored or sent. There are no analytics, tracking cookies or external service calls. Clear saved reading using its dedicated button.",
  "Terms": "This is a fictional educational demo, not a travel agency or live publication. Stories, bylines, dates, popularity and archive totals are sample data. Verify current conditions and official guidance independently before traveling.",
};
function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  const author = authors.find(a => a.name === name);
  return <span className={`avatar ${large ? "large" : ""}`} style={{ backgroundColor: author?.color || "#c3a6be" }} aria-hidden="true">{name.split(" ").map(n => n[0]).join("")}</span>;
}
function Cover({ story, className = "" }: { story: Story; className?: string }) {
  return <img className={className} src={`/${story.image}.svg`} alt={`Original illustrated landscape of ${story.location}`} width="1200" height="750" loading="lazy" />;
}
export default function Journal() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Recent");
  const [limit, setLimit] = useState(9);
  const [authorFilter, setAuthorFilter] = useState("");
  const [portugal, setPortugal] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [modal, setModal] = useState<{ kind: "article"; story: Story } | { kind: "info"; title: string } | { kind: "menu" } | null>(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [cookiePreference, setCookiePreference] = useState("essential");
  const [cookieMessage, setCookieMessage] = useState("");
  const [showTop, setShowTop] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const consentInput = useRef<HTMLInputElement>(null);
  const hero = stories[0];
  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem("wc-saved") || "[]");
      if (Array.isArray(parsed)) setSaved(parsed.filter((id): id is string => typeof id === "string" && stories.some(s => s.id === id)));
      setSubscribed(localStorage.getItem("wc-newsletter") === "confirmed");
      setCookiePreference(localStorage.getItem("wc-cookie") === "remember" ? "remember" : "essential");
    } catch { setStorageWarning("Browser storage is unavailable. Changes will last for this visit only."); }
    setReady(true);
    const scroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("wc-saved", JSON.stringify(saved)); }
    catch { setStorageWarning("Browser storage is unavailable. Changes will last for this visit only."); }
  }, [saved, ready]);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (modal && !el.open) el.showModal();
    else if (!modal && el.open) el.close();
    if (modal) el.scrollTop = 0;
    const old = document.body.style.overflow;
    if (modal) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = old; };
  }, [modal]);
  useEffect(() => { if (searchOpen) searchInput.current?.focus(); }, [searchOpen]);
  function toggleSave(id: string) { setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]); }
  function browse(next = "All") {
    setCategory(next); setAuthorFilter(""); setPortugal(false); setSavedOnly(false); setQuery(""); setLimit(9); setModal(null);
    requestAnimationFrame(() => document.getElementById("stories")?.scrollIntoView({ behavior: "instant" }));
  }
  function reset() { browse(); }
  function subscribeJump() {
    setModal(null);
    requestAnimationFrame(() => { document.getElementById("newsletter")?.scrollIntoView({ behavior: "instant" }); emailInput.current?.focus({ preventScroll: true }); });
  }
  function subscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.trim().length > 254) {
      setEmailError("Enter a valid email address, such as reader@example.com."); emailInput.current?.focus(); return;
    }
    if (!consent) { setEmailError("Please acknowledge that this is a local demo signup."); consentInput.current?.focus(); return; }
    setEmailError(""); setSubscribed(true); setEmail("");
    try { localStorage.setItem("wc-newsletter", "confirmed"); } catch { setStorageWarning("Browser storage is unavailable. Changes will last for this visit only."); }
  }
  const filtered = stories.filter(s => (category === "All" || s.category === category) && (!authorFilter || s.author === authorFilter) && (!portugal || s.location.includes("Portugal")) && (!savedOnly || saved.includes(s.id)) && (`${s.title} ${s.excerpt} ${s.location} ${s.author} ${s.category}`.toLowerCase().includes(query.trim().toLowerCase())))
    .sort((a, b) => sort === "Most Popular" ? b.reads - a.reads : b.date.localeCompare(a.date));
  const isFiltered = category !== "All" || !!query || !!authorFilter || portugal || savedOnly;
  const visible = (isFiltered ? filtered : filtered.filter(s => s.id !== "santorini")).slice(0, limit);
  const availableCount = isFiltered ? filtered.length : filtered.length - 1;
  const openStory = (story: Story) => setModal({ kind: "article", story });
  const info = (title: string) => setModal({ kind: "info", title });
  return <>
    <a className="skip-link" href="#stories">Skip to stories</a>
    <header className="masthead">
      <a className="brand" href="#" aria-label="Wanderlust Chronicles home"><Compass size={30} strokeWidth={1.2} /><span>Wanderlust<span className="brand-second">Chronicles</span></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{categories.map(c => <button key={c} onClick={() => browse(c)}>{c === "Travel Tips" ? "Tips" : c}</button>)}</nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Search stories" aria-expanded={searchOpen} onClick={() => { setSearchOpen(!searchOpen); document.getElementById("stories")?.scrollIntoView({ behavior: "instant" }); }}><Search size={21} /></button>
        <button className="reading-button" aria-label={`Saved reading (${saved.length})`} onClick={() => { browse(); setSavedOnly(true); }}><Bookmark size={19} /><span>{saved.length}</span></button>
        <button className="button primary subscribe-header" onClick={subscribeJump}>Subscribe <ArrowRight size={15} /></button>
        <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setModal({ kind: "menu" })}><Menu /></button>
      </div>
    </header>
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-art" src="/santorini.svg" alt="Original golden-hour illustration of Santorini's blue domes, white rooftops and caldera" width="1200" height="750" fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-eyebrow"><span className="badge">Destinations</span><span>THE LONG WAY HOME · VOL. 03</span></div>
          <h1 id="hero-title">48 Hours in Santorini:<br /><em>Beyond the<br className="desktop-break" /> Instagram Spots</em></h1>
          <p className="hero-excerpt">{hero.excerpt}</p>
          <div className="byline hero-byline"><Avatar name={hero.author} /><span>By {hero.author}<small>March 8, 2026 <span>·</span> 12 min read</small></span></div>
          <button className="read-link" onClick={() => openStory(hero)}>Read Article <ArrowRight size={19} /></button>
        </div>
        <div className="hero-note">An illustrated escape.<br />A different point of view.</div>
        <a className="scroll-cue" href="#stories" aria-label="Scroll to latest stories"><span>KEEP WANDERING</span><ArrowDown size={21} /></a>
        <span className="art-credit">ORIGINAL ILLUSTRATION · FICTIONAL DISPATCH</span>
      </section>
      <nav className="category-bar" aria-label="Story categories"><div className="category-inner">
        <button className={category === "All" && !savedOnly ? "pill active" : "pill"} onClick={() => browse()}>All stories</button>
        {categories.map((c, i) => <button key={c} className={category === c ? "pill active" : "pill"} onClick={() => browse(c)}>{c} <span>{archiveCounts[i]}</span></button>)}
      </div></nav>
      <div className="demo-line"><span className="tiny-compass">✦</span> A fictional travel journal, made for the curious. <span>Original illustrations · Sample archive & read counts · No live travel services</span></div>
      <section className="stories-section section-wrap" id="stories" aria-labelledby="stories-heading">
        <div className="section-top"><div><p className="eyebrow">FIELD NOTES & FARAWAY PLACES</p><h2 id="stories-heading">{savedOnly ? "Your Reading List" : authorFilter ? `Stories by ${authorFilter}` : portugal ? "The Portugal Collection" : "Latest Stories"}</h2></div>
          <div className="sort-control" aria-label="Story order">{["Recent", "Most Popular"].map(s => <button key={s} aria-pressed={sort === s} className={sort === s ? "selected" : ""} onClick={() => setSort(s)}>{s}</button>)}</div>
        </div>
        <div className="discovery-row">
          <label className={`search-field ${searchOpen ? "search-expanded" : ""}`}><Search size={18} /><span className="sr-only">Search the journal</span><input ref={searchInput} type="search" maxLength={120} placeholder="Find a place, story or writer…" value={query} onChange={e => { setQuery(e.target.value); setLimit(9); }} /></label>
          <span className="results-label" role="status">{availableCount} {availableCount === 1 ? "story" : "stories"}{isFiltered ? " found" : " to explore"}</span>
          {isFiltered && <button className="text-button" onClick={reset}>Clear filters <X size={14} /></button>}
          {savedOnly && saved.length > 0 && <button className="text-button" onClick={() => setSaved([])}>Clear saved reading</button>}
        </div>
        {storageWarning && <p role="status" className="notice">{storageWarning}</p>}
        <div className="editorial-layout"><div>
          <div className="story-grid">
            {visible.map(story => <article key={story.id} className="story-card">
              <div className="card-image"><button className="image-link" onClick={() => openStory(story)} aria-label={`Read ${story.title}`}><Cover story={story} /></button>
                <button className={`save-button ${saved.includes(story.id) ? "is-saved" : ""}`} aria-label={`${saved.includes(story.id) ? "Unsave" : "Save"} ${story.title}`} aria-pressed={saved.includes(story.id)} onClick={() => toggleSave(story.id)}><Bookmark size={18} fill={saved.includes(story.id) ? "currentColor" : "none"} /></button>
                {story.badge && <span className={`card-ribbon ${story.badge === "Popular" ? "teal" : ""}`}>{story.badge === "Editor's Pick" && <span>✦ </span>}{story.badge}</span>}
              </div>
              <div className="card-content"><button className="category-text" onClick={() => browse(story.category)}>{story.category}</button><h3><button onClick={() => openStory(story)}>{story.title}</button></h3><p className="card-excerpt">{story.excerpt}</p>
                <div className="byline card-byline"><Avatar name={story.author} /><span>{story.author}<small>{dateLabel(story.date).replace(", 2026", "")} <span>·</span> {story.minutes} min read</small></span></div>
              </div>
            </article>)}
          </div>
          {visible.length === 0 && <div className="empty-state"><Compass size={40} strokeWidth={1} /><h3>{savedOnly && saved.length === 0 ? "A little inspiration for later" : "No stories on this route"}</h3><p>{savedOnly && saved.length === 0 ? "Tap the bookmark on any story to keep it in this browser." : "Try another place, writer or category. Search works across all 13 sample stories."}</p><button className="button outline" onClick={reset}>Explore all stories <ArrowRight size={17} /></button></div>}
          {availableCount > visible.length && <button className="button outline load-more" onClick={() => setLimit(l => l + 3)}>Load More Stories <ArrowDown size={17} /></button>}
          {visible.length > 0 && availableCount <= visible.length && <p className="endnote">You’ve reached the end of this sample collection. Take the scenic route back.</p>}
        </div>
          <aside className="trending" aria-labelledby="trending-heading"><p className="eyebrow">THE CONVERSATION</p><h2 id="trending-heading">Trending<br />This Week</h2><p className="trending-note">What our imagined readers are loving.</p>
            <ol>{[...stories].sort((a,b) => b.reads-a.reads).slice(0,5).map((story,i) => <li key={story.id}><span className="rank">0{i+1}</span><div><button onClick={() => openStory(story)}>{story.title}</button><p>{story.author}<br /><span>{story.reads/1000}K sample reads</span></p></div></li>)}</ol>
            <div className="sidebar-note"><Compass size={31} strokeWidth={1} /><h3>Less scrolling.<br />More discovering.</h3><p>One thoughtful letter.<br />Every Thursday, in our imagined world.</p><button className="text-button" onClick={subscribeJump}>Join the journal <ArrowRight size={15} /></button></div>
          </aside>
        </div>
      </section>
      <section className="destination" aria-labelledby="destination-heading"><div className="section-wrap">
        <div className="section-top"><div><p className="eyebrow">ONE PLACE. A THOUSAND STORIES.</p><h2 id="destination-heading">Destination Deep Dive</h2></div><span className="month-label">THIS MONTH: <strong>PORTUGAL</strong></span></div>
        <div className="destination-layout"><button className="destination-image" onClick={() => openStory(stories.find(s => s.id === "lisbon")!)} aria-label="Read Lisbon's Hidden Miradores"><Cover story={stories.find(s => s.id === "lisbon")!} /><span>38°43′N 9°08′W <small>ALFAMA, LISBON · ILLUSTRATED</small></span></button>
          <div className="destination-copy"><p className="eyebrow">A LOVE LETTER TO THE ATLANTIC</p><h3>Why Portugal,<br /><em>Why Now</em></h3><p>Some places ask you to slow down. Portugal insists. Follow the tram tracks through Lisbon, the river into the Douro, and the scent of wood-fired clay into the Alentejo. Our March 2026 fictional issue is about looking closer, not checking more boxes.</p>
            <div className="related-list">{["lisbon", "douro", "algarve", "ceramics"].map(id => { const s = stories.find(st => st.id === id)!; return <button key={id} onClick={() => openStory(s)}><Cover story={s} /><span>{s.title}</span><ArrowRight size={16} /></button>; })}</div>
            <button className="text-button" onClick={() => { browse(); setPortugal(true); }}>Explore All Portugal Posts <ArrowRight size={17} /></button>
          </div>
        </div>
      </div></section>
      <section className="writers section-wrap" aria-labelledby="writers-heading"><div className="section-top"><div><p className="eyebrow">GOOD STORIES START WITH GOOD PEOPLE</p><h2 id="writers-heading">Meet the Writers</h2></div><p className="subtle-note">Fictional voices. A world of perspectives.</p></div>
        <div className="writer-grid">{authors.map(a => <article className="writer-card" key={a.name}><Avatar name={a.name} large /><h3>{a.name}</h3><p className="writer-role">{a.role} <span>· {a.count} sample articles</span></p><p>{a.bio}</p><button className="text-button" onClick={() => { browse(); setAuthorFilter(a.name); }}>View All Posts <ArrowRight size={15} /></button></article>)}</div>
      </section>
      <section className="newsletter" id="newsletter" aria-labelledby="newsletter-heading"><div className="newsletter-inner"><div><p className="eyebrow">A POSTCARD FOR YOUR INBOX</p><h2 id="newsletter-heading">Get Stories<br /><em>Worth Reading.</em></h2><p>Every Thursday — one destination deep-dive, one travel hack, and one story that’ll make you take the long way home. No spam, no fluff.</p><span className="newsletter-small">A local signup demo. No email is sent or stored.</span></div>
        <div className="newsletter-form">{subscribed ? <div className="success" role="status"><Check size={32} /><h3>You’re on the demo list.</h3><p>Thanks for reading along. This confirmation stays in your browser; no newsletter or email will be sent.</p><button className="button amber" onClick={() => { setSubscribed(false); setConsent(false); try { localStorage.removeItem("wc-newsletter"); } catch {} }}>Reset demo signup</button></div> : <form onSubmit={subscribe} noValidate><label htmlFor="newsletter-email">Your next chapter starts here.</label><div className="signup-row"><input id="newsletter-email" ref={emailInput} type="email" autoComplete="email" placeholder="Your email address" value={email} maxLength={254} aria-invalid={!!emailError} aria-describedby="signup-help signup-error" onChange={e => setEmail(e.target.value)} /><button className="button amber" type="submit">Subscribe <ArrowRight size={18} /></button></div><label className="consent"><input ref={consentInput} type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />I understand this is a local demo, not an email subscription.</label><p id="signup-error" className="form-error" role="alert">{emailError}</p><p id="signup-help" className="newsletter-small">Unsubscribe? Just reset the demo confirmation.<br />28,000 readers & 120 countries are source-concept counts, not real subscribers.</p></form>}</div>
      </div><div className="newsletter-bottom">INDEPENDENT SPIRIT. THOUGHTFUL TRAVEL. <span>No publisher affiliations or endorsements are claimed.</span></div></section>
      <section className="photo-journal section-wrap" aria-labelledby="photo-heading"><div className="section-top"><div><p className="eyebrow">THE PLACES THAT STAY WITH US</p><h2 id="photo-heading">@WanderlustChron</h2><p className="subtle-note">Follow the Journey — an original illustrated travel notebook.</p></div><button className="text-button" onClick={() => info("Instagram")}>About the Instagram concept <ArrowRight size={17} /></button></div>
        <div className="photo-grid">{["japan-rail","marrakech","sri-lanka","lisbon","oaxaca","jordan"].map(id => { const s=stories.find(st=>st.id===id)!; return <button key={id} onClick={() => openStory(s)} aria-label={`Explore ${s.location}`}><Cover story={s} /><span>{s.location} <ArrowRight size={17} /></span></button>; })}</div>
      </section>
    </main>
    <footer><div className="footer-inner section-wrap"><div className="footer-intro"><a className="brand" href="#"><Compass size={32} strokeWidth={1.2} /><span>Wanderlust<span className="brand-second">Chronicles</span></span></a><p>For the journeys that change<br />the way we see the world.</p></div><div className="footer-columns">
      {[
        { title: "Explore", links: [...categories] },
        { title: "About", links: ["Our Story", "Write for Us", "Editorial Guidelines", "Press Kit", "Advertise"] },
        { title: "Resources", links: ["Packing Lists", "Budget Calculators", "Travel Insurance Guide", "Visa Information", "Flight Deals"] },
        { title: "Connect", links: ["Newsletter", "Instagram", "YouTube", "Twitter/X", "Pinterest", "RSS Feed"] }
      ].map(col=><div key={col.title}><h3>{col.title}</h3>{col.links.map(link=><button key={link} onClick={() => categories.some(c=>c===link) ? browse(link) : link==="Newsletter" ? subscribeJump() : info(link)}>{link}</button>)}</div>)}
    </div></div><div className="footer-bottom section-wrap"><p>© 2026 Wanderlust Chronicles. Fictional editorial demo.</p><div>{["Privacy Policy","Terms","Cookie Settings"].map(title=><button key={title} onClick={()=>info(title)}>{title}</button>)}</div><p className="disclosure">We independently select everything we recommend. This demo has no affiliate links or commissions. Original illustrations replace photography; no real author portraits or publisher endorsements are used.</p></div></footer>
    {showTop && <button className="back-top" aria-label="Back to top" onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); document.querySelector<HTMLAnchorElement>(".brand")?.focus({ preventScroll: true }); }}><ArrowUp size={20} /></button>}
    <dialog ref={dialog} className={`reader-dialog ${modal?.kind === "menu" ? "menu-dialog" : ""}`} onCancel={() => setModal(null)} onClose={() => setModal(null)} aria-labelledby="dialog-title">
      <button autoFocus className="dialog-close icon-button" aria-label="Close dialog" onClick={() => setModal(null)}><X /></button>
      {modal?.kind === "menu" && <div className="mobile-navigation"><p className="eyebrow">TAKE THE SCENIC ROUTE</p><h2 id="dialog-title">Where to next?</h2><nav aria-label="Mobile categories">{categories.map((c,i)=><button key={c} onClick={()=>browse(c)}>{c}<span>{archiveCounts[i]} <small>sample</small></span><ArrowRight size={20} /></button>)}</nav><button className="button primary" onClick={subscribeJump}>Subscribe to the journal <ArrowRight size={18} /></button><p className="subtle-note">A fictional journal. Archive badges are sample counts.</p></div>}
      {modal?.kind === "article" && <article className="reader">
        <Cover story={modal.story} className="reader-image" /><div className="reader-body"><p className="eyebrow">{modal.story.category} · {modal.story.location}</p><h2 id="dialog-title">{modal.story.title}</h2><div className="reader-meta"><div className="byline"><Avatar name={modal.story.author} /><span>{modal.story.author}<small>{dateLabel(modal.story.date)} · {modal.story.minutes} min read (sample)</small></span></div><button className="button outline" aria-pressed={saved.includes(modal.story.id)} onClick={()=>toggleSave(modal.story.id)}><Bookmark size={17} fill={saved.includes(modal.story.id) ? "currentColor" : "none"} />{saved.includes(modal.story.id) ? "Saved" : "Save story"}</button></div>
        <p className="reader-demo">Original fictional dispatch · Short-form demo edition. Bylines, archive totals and reading estimates are illustrative. Not live travel guidance.</p>
        <p className="reader-lede">{modal.story.excerpt}</p>
        {modal.story.sections.map(section=><section key={section.heading}><h3>{section.heading}</h3><p>{section.text}</p></section>)}
        <div className="reader-next"><p className="eyebrow">KEEP WANDERING</p><h3>Another story, another perspective.</h3>{stories.filter(s=>s.category===modal.story.category && s.id!==modal.story.id).slice(0,2).map(s=><button className="text-button" key={s.id} onClick={()=>openStory(s)}>{s.title}<ArrowRight size={18} /></button>)}<button className="button outline" onClick={()=>setModal(null)}>Back to the journal</button></div>
        </div></article>}
      {modal?.kind === "info" && <div className="info-panel"><Compass size={35} strokeWidth={1} /><p className="eyebrow">THE JOURNAL · DEMO NOTES</p><h2 id="dialog-title">{modal.title}</h2>{modal.title === "Cookie Settings" ? <><p>No analytics or tracking cookies are used. Saved reading and demo signup use browser storage independently of this preference.</p><fieldset><legend>Optional demo preference</legend><label><input type="radio" name="cookies" value="essential" checked={cookiePreference==="essential"} onChange={()=>setCookiePreference("essential")} /> Essential only (no optional services)</label><label><input type="radio" name="cookies" value="remember" checked={cookiePreference==="remember"} onChange={()=>setCookiePreference("remember")} /> Remember this demo preference locally</label></fieldset><button className="button primary" onClick={()=>{ try { if(cookiePreference==="remember") localStorage.setItem("wc-cookie", "remember"); else localStorage.removeItem("wc-cookie"); setCookieMessage("Preference saved. No trackers are enabled."); } catch { setCookieMessage("Preference applied for this visit. Browser storage is unavailable."); } }}>Save preference <Check size={17} /></button><p role="status">{cookieMessage}</p></> : <><p>{information[modal.title]}</p>{modal.title==="Flight Deals" && <button className="button outline" onClick={()=>openStory(stories.find(s=>s.id==="business-class")!)}>Read the travel-hacking guide <ArrowRight size={17} /></button>}</>}</div>}
    </dialog>
  </>;
}
