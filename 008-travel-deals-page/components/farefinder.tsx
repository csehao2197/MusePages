"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Plane, Heart, Menu, SlidersHorizontal, MapPin, ShieldCheck, Headphones, Clock, Zap, Hotel, Ship, Palmtree, Car, Compass, X, Check, Globe2, ChevronDown } from "lucide-react";
import { deals, money, percent, type Deal, type Kind } from "./deals";
import Landscape from "./landscape";

const kinds: Kind[] = ["Flights","Hotels","Packages","Cruises","Cars","Tours"];
const categoryLabels = ["Flight Deals","Hotel Deals","Vacation Packages","Cruise Deals","Car Rental Deals","Experience & Tours"];
const icons = [Plane,Hotel,Palmtree,Ship,Car,Compass];
const fixtureCounts = [124,89,67,23,45,56];
const clock = (n: number) => `${Math.floor(n/3600).toString().padStart(2,"0")}h ${Math.floor(n%3600/60).toString().padStart(2,"0")}m ${(n%60).toString().padStart(2,"0")}s`;
type Filters = {type: string; region: string; budget: string; date: string};
const defaults: Filters = {type:"All types",region:"Anywhere",budget:"Any budget",date:"Flexible"};

export default function FareFinder() {
  const [filters,setFilters] = useState<Filters>(defaults);
  const [sort,setSort] = useState("Best Deals");
  const [query,setQuery] = useState("");
  const [from,setFrom] = useState("");
  const [draftTo,setDraftTo] = useState("");
  const [draftFrom,setDraftFrom] = useState("");
  const [draftDate,setDraftDate] = useState("Flexible");
  const [travelers,setTravelers] = useState(2);
  const [limit,setLimit] = useState(6);
  const [saved,setSaved] = useState<string[]>([]);
  const [recent,setRecent] = useState<string[]>([]);
  const [savedOnly,setSavedOnly] = useState(false);
  const [loading,setLoading] = useState(true);
  const [storageError,setStorageError] = useState("");
  const [elapsed,setElapsed] = useState(0);
  const [filterOpen,setFilterOpen] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const [detail,setDetail] = useState<Deal|null>(null);
  const [info,setInfo] = useState("");
  const [claimed,setClaimed] = useState(false);
  const [alertStatus,setAlertStatus] = useState("");
  const [alertBusy,setAlertBusy] = useState(false);
  const [newsletter,setNewsletter] = useState("");
  const [alertDestination,setAlertDestination] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement|null>(null);
  const flashRow = useRef<HTMLDivElement>(null);
  const alertTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{
    try {
      const s: unknown = JSON.parse(localStorage.getItem("farefinder-saved")||"[]");
      const r: unknown = JSON.parse(localStorage.getItem("farefinder-recent")||"[]");
      if(Array.isArray(s)) setSaved(s.filter((id): id is string=>typeof id==="string"&&deals.some(d=>d.id===id)));
      if(Array.isArray(r)) setRecent(r.filter((id): id is string=>typeof id==="string"&&deals.some(d=>d.id===id)).slice(0,4));
    } catch {setStorageError("Browser storage is unavailable. Saved deals will last only for this visit.");}
    const timer=setTimeout(()=>setLoading(false),240);
    const tick=setInterval(()=>setElapsed(e=>e+1),1000);
    const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
    const auto=setInterval(()=>{
      const row=flashRow.current;
      if(row&&!motion.matches&&window.innerWidth>900&&!row.matches(":hover")&&!row.contains(document.activeElement)){
        row.scrollTo({left:row.scrollLeft+200>=row.scrollWidth-row.clientWidth?0:row.scrollLeft+340,behavior:"smooth"});
      }
    },7000);
    return ()=>{clearTimeout(timer);clearInterval(tick);clearInterval(auto);if(alertTimer.current)clearTimeout(alertTimer.current);};
  },[]);
  function persist(key:string,value:string[]) {try{localStorage.setItem(key,JSON.stringify(value));}catch{setStorageError("Browser storage is unavailable. Changes are kept for this visit only.");}}
  function toggleSave(d:Deal) {const value=saved.includes(d.id)?saved.filter(id=>id!==d.id):[...saved,d.id];setSaved(value);persist("farefinder-saved",value);}
  function open(d:Deal) {
    previousFocus.current=document.activeElement as HTMLElement;
    setDetail(d);setInfo("");setClaimed(false);
    const value=[d.id,...recent.filter(id=>id!==d.id)].slice(0,4);setRecent(value);persist("farefinder-recent",value);
    dialog.current?.showModal();
  }
  function showInfo(title:string) {previousFocus.current=document.activeElement as HTMLElement;setDetail(null);setInfo(title);dialog.current?.showModal();}
  function close() {dialog.current?.close();}
  function change(key:keyof Filters,value:string) {setFilters(f=>({...f,[key]:value}));setLimit(6);}
  function browse(type:string,region="Anywhere") {setSavedOnly(false);setQuery("");setDraftTo("");setFrom("");setFilters({...defaults,type,region});setLimit(6);document.getElementById("deals")?.scrollIntoView({behavior:"instant"});}
  const filtered=deals.filter(d=>{
    const price=d.price;
    return (!savedOnly||saved.includes(d.id))&&(filters.type==="All types"||d.type===filters.type)
      &&(filters.region==="Anywhere"||d.region===filters.region)
      &&(filters.date==="Flexible"||d.month===filters.date)
      &&(filters.budget==="Any budget"||(filters.budget==="Under $300"?price<300:filters.budget==="$300–$700"?price>=300&&price<700:filters.budget==="$700–$1500"?price>=700&&price<1500:price>=1500))
      &&(!query||`${d.title} ${d.country} ${d.label}`.toLowerCase().includes(query.toLowerCase()))
      &&(!from||!["Flights","Packages"].includes(d.type)||d.origin.toLowerCase().includes(from.toLowerCase()));
  }).sort((a,b)=>sort==="Price Low-High"?a.price-b.price:sort==="Biggest Savings"?percent(b)-percent(a):sort==="Departing Soon"?(a.month===b.month?a.day-b.day:a.month==="This Month"?-1:1):Number(Boolean(b.flash))-Number(Boolean(a.flash))||percent(b)-percent(a));
  // The editorial default keeps the brief's destination cards first; explicit sorts use their ranking.
  const shown=sort==="Best Deals"&&!query&&!savedOnly&&Object.entries(filters).every(([k,v])=>v===defaults[k as keyof Filters])&&!from
    ? deals : filtered;
  const recommended = recent.some(id=>["santorini","athens"].includes(id))?["athens","lisbon","paris"]:recent.some(id=>["bali","phuket"].includes(id))?["srilanka","phuket","kyoto"]:["athens","srilanka","paris"];
  function card(d:Deal,compact=false) {
    return <article className={`deal-card ${compact?"compact":""}`} key={d.id} data-testid={`card-${d.id}`}>
      <div className="picture"><Landscape deal={d}/><span className="saving">Save {percent(d)}%</span>
        <button className={`save ${saved.includes(d.id)?"active":""}`} aria-label={`${saved.includes(d.id)?"Unsave":"Save"} ${d.title}`} aria-pressed={saved.includes(d.id)} onClick={()=>toggleSave(d)}><Heart size={18} fill={saved.includes(d.id)?"currentColor":"none"}/></button>
        <span className="type-badge">{d.label}</span>
      </div>
      <div className="card-body"><div className="country"><MapPin size={12}/>{d.country} <span className="rating">★ {d.rating} <small>({d.reviews.toLocaleString()})*</small></span></div>
        <h3>{d.title}</h3><p className="trip">{d.nights?`${d.nights} nights`:"Flight fare"} · {travelers} {travelers===1?"traveler":"travelers"} · {d.inclusion}</p>
        <div className="price-row"><div><s>{money(d.original)}</s><div><strong>{money(d.price)}</strong><small> /person</small></div></div><span className="savings-text">You save<br/><b>{money(d.original-d.price)}</b></span></div>
        <p className="urgency">{d.urgency||"Selling fast"} <small>· simulated</small></p>
        <button className="primary full" onClick={()=>open(d)}>View Deal <ArrowRight size={16}/></button>
      </div>
    </article>;
  }
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <div className="demo-strip">LOCAL DEMO · Fictional inventory, prices, reviews, urgency & trust claims. No bookings or payments.</div>
    <header><div className="header-inner"><a className="brand" href="#main"><span><Plane size={22}/></span>FareFinder<span className="brand-dot">.</span></a>
      <nav className={menuOpen?"nav open":"nav"} aria-label="Main"><a href="#deals" onClick={()=>setMenuOpen(false)}>Explore deals</a><a href="#categories" onClick={()=>setMenuOpen(false)}>Destinations</a><a href="#alerts" onClick={()=>setMenuOpen(false)}>Price alerts</a></nav>
      <button className="saved-link" onClick={()=>{setSavedOnly(!savedOnly);setFilters(defaults);setQuery("");setFrom("");setLimit(6);document.getElementById("deals")?.scrollIntoView();}}><Heart size={18}/> Saved <span>{saved.length}</span></button>
      <button className="mobile-menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}><Menu/></button>
    </div></header>
    <main id="main">
      <section className="hero"><div className="map-pattern" aria-hidden="true"><Globe2/></div><div className="container hero-content">
        <div className="eyebrow"><span className="pulse"/> A LITTLE LESS FARE. A LOT MORE WORLD.</div>
        <h1>Deals That <span>Won&apos;t Wait.</span></h1>
        <p>Handpicked discounts updated daily. Save up to 60% on<br className="desktop-break"/> flights, hotels, and vacation packages. <small>(Demo offers)</small></p>
        <div className="new-deals">🔥 <b>47 new deals added today</b><span>Simulated counter</span></div>
        <form className="search-bar" onSubmit={e=>{e.preventDefault();setQuery(draftTo.trim());setFrom(draftFrom.trim());setFilters(f=>({...f,date:draftDate}));setSavedOnly(false);setLimit(6);document.getElementById("deals")?.scrollIntoView({behavior:"instant"});}}>
          <label><span><Plane size={14}/> FROM</span><input aria-label="From city" placeholder="Your city" value={draftFrom} onChange={e=>setDraftFrom(e.target.value)}/></label>
          <label><span><MapPin size={14}/> TO</span><input aria-label="To destination" placeholder="Anywhere" value={draftTo} onChange={e=>setDraftTo(e.target.value)}/></label>
          <label><span><Clock size={14}/> DATES</span><select aria-label="Search dates" value={draftDate} onChange={e=>setDraftDate(e.target.value)}>{["Flexible","This Month","Next Month"].map(v=><option key={v}>{v}</option>)}</select></label>
          <label><span>TRAVELERS</span><input aria-label="Travelers" type="number" min="1" max="8" required value={travelers} onChange={e=>setTravelers(Number(e.target.value))}/></label>
          <button className="primary" type="submit">Find Deals <ArrowRight size={17}/></button>
        </form>
        <div className="trust"><button onClick={()=>showInfo("Best Price Guarantee")}><ShieldCheck size={16}/> Best Price Guarantee*</button><button onClick={()=>showInfo("Free Cancellation")}><Check size={16}/> Free Cancellation*</button><button onClick={()=>showInfo("24/7 Support")}><Headphones size={16}/> 24/7 Support*</button><span>*Illustrative, not offered</span></div>
      </div></section>
      <section className="flash-section"><div className="container"><div className="section-heading"><div><div className="eyebrow orange">GOOD PRICES. SHORT WINDOWS.</div><h2><Zap className="orange" fill="currentColor" size={23}/> Flash Deals <span>— Ending Soon</span></h2></div><span className="master-clock"><Clock size={14}/> Demo resets in <b>{clock(Math.max(0,15791-elapsed))}</b></span></div>
        <div className="flash-row" ref={flashRow} tabIndex={0} aria-label="Flash deals, scroll horizontally">
          {deals.filter(d=>d.flash).map(d=><article className="flash-card" key={d.id}>
            <div className="flash-top">{d.type==="Flights"?<Plane size={21}/>:d.type==="Cruises"?<Ship size={21}/>:<Hotel size={21}/>}<span className="saving">Save {percent(d)}%</span></div>
            <h3>{d.title}</h3><p>{d.type==="Flights"?"Round-trip from":"From"} <strong>{money(d.price)}</strong>{d.type!=="Flights"&&<small>/person</small>} <s>{money(d.original)}</s></p>
            <div className="flash-bottom"><span><Clock size={13}/> {clock(Math.max(0,d.flash!-elapsed))}<small>{d.urgency?"Almost gone! · demo":"Simulated timer"}</small></span><button onClick={()=>open(d)} className="primary">Book Now <ArrowRight size={14}/></button></div>
          </article>)}
        </div>
        <div className="flash-note">Illustrative countdowns only. Book Now opens a local preview — no reservation is made.</div>
      </div></section>
      <section className="container deals-section" id="deals">
        <div className="section-heading"><div><div className="eyebrow orange">YOUR NEXT “LET&apos;S GO” STARTS HERE</div><h2>{savedOnly?"Your saved escapes":"Big adventures. Small prices."}</h2><p>More memories. Less spending. Find the escape that feels like you.</p></div><span className="inventory-note">20 fictional offers<br/>November / December 2026</span></div>
        <div className={`filter-bar ${filterOpen?"expanded":""}`} id="filters"><button className="filter-toggle" onClick={()=>setFilterOpen(!filterOpen)} aria-expanded={filterOpen}><SlidersHorizontal size={17}/> Filter & sort <ChevronDown size={15}/></button>
          <div className="filter-controls">
            <label>Deal type<select aria-label="Deal type" value={filters.type} onChange={e=>change("type",e.target.value)}>{["All types",...kinds].map(v=><option key={v}>{v}</option>)}</select></label>
            <label>Destination<select aria-label="Destination region" value={filters.region} onChange={e=>change("region",e.target.value)}>{["Anywhere","Europe","Asia","Caribbean","Americas","Africa"].map(v=><option key={v}>{v}</option>)}</select></label>
            <label>Budget / person<select aria-label="Budget" value={filters.budget} onChange={e=>change("budget",e.target.value)}>{["Any budget","Under $300","$300–$700","$700–$1500","$1500+"].map(v=><option key={v}>{v}</option>)}</select></label>
            <label>Travel dates<select aria-label="Travel dates" value={filters.date} onChange={e=>change("date",e.target.value)}>{["Flexible","This Month","Next Month"].map(v=><option key={v}>{v}</option>)}</select></label>
            <label className="sort">Sort by<select aria-label="Sort deals" value={sort} onChange={e=>{setSort(e.target.value);setLimit(6);}}>{["Best Deals","Price Low-High","Biggest Savings","Departing Soon"].map(v=><option key={v}>{v}</option>)}</select></label>
          </div>
        </div>
        <div className="results-line"><span aria-live="polite"><b>{shown.length}</b> deals found {query&&<>for “{query}”</>} {from&&<>from {from}</>}</span><button className="text-button" onClick={()=>{setFilters(defaults);setSort("Best Deals");setQuery("");setDraftTo("");setDraftFrom("");setFrom("");setSavedOnly(false);setLimit(6);}}>Reset filters</button></div>
        {storageError&&<p role="alert" className="error">{storageError}</p>}
        {loading?<div className="grid" role="status" aria-label="Loading fictional deals">{[1,2,3].map(n=><div className="skeleton" key={n}>Loading your next escape…</div>)}</div>:shown.length?<div className="grid">{shown.slice(0,limit).map(d=>card(d))}</div>:<div className="empty"><Compass size={36}/><h3>No escapes found just yet.</h3><p>{savedOnly?"Save a deal with its heart to build your wishlist.":"Try a broader destination, a different budget, or flexible dates."}</p><button className="primary" onClick={()=>browse("All types")}>Explore all deals</button></div>}
        {shown.length>limit&&<div className="load-more"><button className="outline" onClick={()=>setLimit(l=>l+6)}>Load More Deals <ChevronDown size={17}/></button><small>Showing {Math.min(limit,shown.length)} of {shown.length} handpicked demo deals</small></div>}
        <p className="fineprint">*All ratings, review counts, scarcity and savings are fictional. Prices are USD per person for the entire listed trip, not per night. No additional real-world fees have been modeled.</p>
      </section>
      <section className="container categories" id="categories"><div className="section-heading"><h2>One world. So many ways to go.</h2><span>Browse by Type</span></div><div className="category-row">{kinds.map((k,i)=>{const Icon=icons[i];return <button key={k} onClick={()=>browse(k)}><span className={`category-icon tint-${i}`}><Icon size={27}/></span><b>{categoryLabels[i]}</b><small>{fixtureCounts[i]} deals · simulated</small></button>;})}</div></section>
      <section className="spotlight"><div className="container"><div className="section-heading"><div><div className="eyebrow orange">THE PLACE ON EVERYONE&apos;S LIST</div><h2>This Month&apos;s Top Destination: <span className="orange">Portugal</span></h2></div><span className="editor-pick">☀ The editor&apos;s pick · demo</span></div>
        <div className="portugal-layout"><div className="portugal-image"><Landscape large deal={{title:"Lisbon, Portugal",style:"city",color:"#cfa887"}}/><div><span>38°43′ N 9°08′ W</span><h3>Take the scenic route.</h3><p>Golden light. Tiled streets. A slower kind of escape.</p><button onClick={()=>{setDraftTo("Portugal");setQuery("Portugal");setFilters(defaults);setFrom("");setSavedOnly(false);setLimit(6);document.getElementById("deals")?.scrollIntoView();}}>See All Portugal Deals <ArrowRight size={17}/></button></div></div>
          <div className="portugal-deals">{deals.filter(d=>["lisbon","algarve","porto"].includes(d.id)).map(d=><button key={d.id} onClick={()=>open(d)}><div className="mini-art"><Landscape deal={d}/></div><span><b>{d.title}</b><small>{d.nights} nights · from <strong>{money(d.price)}</strong>/person</small><em>{percent(d)}% off · simulated</em></span><ArrowRight size={18}/></button>)}</div>
        </div>
      </div></section>
      <section className="alerts" id="alerts"><div className="container alert-layout"><div><span className="alert-icon"><Plane size={30}/></span><div className="eyebrow">YOUR DREAM TRIP. YOUR DREAM PRICE.</div><h2>Never Miss a Deal.</h2><p>Set a price alert and we&apos;ll email you when fares<br className="desktop-break"/> drop to your target price. <b>Demo: no email is sent.</b></p><small>Join 280,000+ deal hunters who save an average of $340 per trip.<br/>Illustrative community and savings figures, not measured.</small></div>
        <form className="alert-form" onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);setAlertBusy(true);setAlertStatus("");alertTimer.current=setTimeout(()=>{setAlertBusy(false);setAlertStatus(String(data.get("email")).endsWith("@example.invalid")?"Demo service unavailable. Use another email to retry; nothing was sent.":`Demo alert set for ${alertDestination.trim()} at ${money(Number(data.get("max")))} per person. Kept in this visit only; no email will be sent.`);},400);}}>
          <label>Where do you want to go?<input required maxLength={80} pattern={".*\\S.*"} placeholder="e.g. Lisbon, Portugal" name="destination" value={alertDestination} onChange={e=>setAlertDestination(e.target.value)}/></label>
          <div className="form-row"><label>Your max price (USD / person)<input required type="number" min="1" max="50000" step="1" name="max" placeholder="e.g. 500"/></label><label>Email address<input required type="email" name="email" placeholder="you@example.com"/></label></div>
          <button className="primary full" disabled={alertBusy}>{alertBusy?"Setting your demo alert…":"Set Alert"} <ArrowRight size={16}/></button><small>No accounts. No providers. No messages. Use @example.invalid to preview an error.</small>
          {alertStatus&&<p role={alertStatus.startsWith("Demo service")?"alert":"status"} className={alertStatus.startsWith("Demo service")?"error":"success"}>{alertStatus}</p>}
        </form>
      </div></section>
      <section className="container recent-section"><div className="section-heading"><h2>Recently Viewed Deals</h2><span>Your trail of possibility</span></div>{recent.length?<div className="recent-row">{recent.map(id=>{const d=deals.find(d=>d.id===id)!;return <button key={id} onClick={()=>open(d)}><div className="mini-art"><Landscape deal={d}/></div><span><b>{d.title}</b><small>From {money(d.price)}/person</small></span><ArrowRight size={16}/></button>;})}</div>:<div className="recent-empty"><Clock size={20}/><p>Your next adventure leaves a trail. Open any deal to see it here.</p></div>}
        <div className="section-heading recommendations-heading"><div><h2>Recommended for You</h2><p>{recent.length?"Inspired by the places you’ve explored — local rules, not tracking.":"A few places to start dreaming. Explore a deal to tailor these picks."}</p></div><Compass className="orange"/></div>
        <div className="grid">{recommended.map((id,i)=><div className="recommendation" key={id}><p>{recent.some(id=>["santorini","athens"].includes(id))?["Based on your interest in Greece","More European escapes","A flight to add to your list"][i]:recent.some(id=>["bali","phuket"].includes(id))?["Similar to your Bali interest","Another beach escape","Explore more of Asia"][i]:["Based on your interest in Greece","Similar to your Bali search","Trending in your city"][i]} <small>· demo</small></p>{card(deals.find(d=>d.id===id)!,true)}</div>)}</div>
      </section>
      <section className="newsletter"><div className="container"><div><div className="eyebrow orange">FIRST IN LINE. FIRST OUT OF OFFICE.</div><h2>Get Exclusive Deals in Your Inbox.</h2><p>Our best deals sell out fast. Subscribers get 6-hour early access.<br/><small>Illustrative benefit only. This local demo sends no email.</small></p></div><form onSubmit={e=>{e.preventDefault();setNewsletter("You’re on the demo list! No email was sent or stored.");}}><div><label className="sr-only" htmlFor="newsletter-email">Newsletter email</label><input id="newsletter-email" type="email" required placeholder="Your email address"/><button className="primary">Subscribe <ArrowRight size={16}/></button></div><small>Unsubscribe anytime. No spam. No real subscription.</small>{newsletter&&<p role="status">{newsletter}</p>}</form></div></section>
      <footer className="container"><div className="footer-top"><div><a className="brand" href="#main"><span><Plane size={22}/></span>FareFinder<span className="brand-dot">.</span></a><p>The world is calling.<br/>You don&apos;t have to pay full price.</p><span className="footer-demo">An original, local travel demo.</span></div>
        <div><h3>Deals</h3>{["Flight Deals","Hotel Deals","Package Deals","Last Minute","Weekend Getaways"].map((v,i)=><button key={v} onClick={()=>{browse(i<3?kinds[i]:"All types");if(i===3)setSort("Departing Soon");if(i===4){setDraftTo("Weekend");setQuery("Weekend");}}}>{v}</button>)}</div>
        <div><h3>Destinations</h3>{["Europe","Asia","Caribbean","Americas","Africa & Middle East"].map((v,i)=><button key={v} onClick={()=>browse("All types",i===4?"Africa":v)}>{v}</button>)}</div>
        <div><h3>Company</h3>{["About","How It Works","Press","Careers","Affiliates"].map(v=><button key={v} onClick={()=>showInfo(v)}>{v}</button>)}</div>
        <div><h3>Support</h3>{["Help Center","Price Guarantee","Cancellation Policy","Contact Us"].map(v=><button key={v} onClick={()=>showInfo(v)}>{v}</button>)}</div>
      </div><div className="footer-bottom"><span>© 2026 FareFinder. All rights reserved.</span><div className="payments" aria-label="Illustrative payment labels, payments are not accepted">{["VISA","Mastercard","AMEX","PayPal","Apple Pay"].map(v=><span key={v}>{v}</span>)}</div><span>USD · English · No payments accepted</span></div></footer>
    </main>
    <div className="mobile-bottom"><span><b>{shown.length} Deals</b><small>47 new · simulated</small></span><button className="primary" onClick={()=>{setFilterOpen(true);document.getElementById("filters")?.scrollIntoView();}}><SlidersHorizontal size={16}/> Filter</button></div>
    <dialog ref={dialog} onClose={()=>previousFocus.current?.focus()} onKeyDown={e=>{
      if(e.key!=="Tab")return;
      const controls=Array.from(e.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]"));
      const first=controls[0], last=controls[controls.length-1];
      if(!e.currentTarget.contains(document.activeElement)||(!e.shiftKey&&document.activeElement===last)){e.preventDefault();first?.focus();}
      else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
    }} aria-labelledby="dialog-title"><button className="dialog-close" aria-label="Close dialog" onClick={close}><X/></button>
      {detail?<><Landscape deal={detail}/><div className="dialog-body"><span className="eyebrow orange">FICTIONAL DEAL PREVIEW · NO RESERVATION</span><h2 id="dialog-title">{detail.title}</h2><p>{detail.label} · {detail.nights?`${detail.nights} nights`:"No accommodation"} · {detail.inclusion}</p><p>Demo departure: {detail.month==="This Month"?"November":"December"} {detail.day}, 2026{["Flights","Packages"].includes(detail.type)&&` from ${detail.origin}`}. Reviews: {detail.rating}★ ({detail.reviews}) — simulated.</p>
        <label className="traveler-label">Travelers for this trip<input aria-label="Deal travelers" type="number" min="1" max="8" required value={travelers} onChange={e=>setTravelers(Number(e.target.value))}/></label>
        {!Number.isInteger(travelers)||travelers<1||travelers>8?<p role="alert" className="error">Choose 1 to 8 travelers to calculate your preview.</p>:<div className="breakdown"><div><span>Original / person</span><s>{money(detail.original)}</s></div><div><span>Deal / person (whole trip)</span><b>{money(detail.price)}</b></div><div><span>{travelers} travelers × {money(detail.price)}</span><b>{money(detail.price*travelers)}</b></div><div className="total-saving"><span>Total savings</span><b>{money((detail.original-detail.price)*travelers)}</b></div></div>}
        <p className="fineprint">The listed nights are already included. Prices are fictional USD per person; no taxes, fees, availability or cancellation terms are verified. Car rental is modeled per traveler for consistency, not a real vehicle quote.</p>
        {claimed?<div className="success" role="status"><Check size={20}/><b>Demo deal claimed!</b><p>Your local trip preview for {travelers} {travelers===1?"traveler":"travelers"} totals {money(detail.price*travelers)}. No booking, payment, account or email was created.</p></div>:<form onSubmit={e=>{e.preventDefault();setClaimed(true);}}><label>Your email for the demo preview<input aria-label="Claim email" type="email" required placeholder="you@example.com"/></label><button className="primary full" disabled={!Number.isInteger(travelers)||travelers<1||travelers>8}>Claim demo deal <ArrowRight size={16}/></button></form>}
        <div className="dialog-actions"><button className="outline" onClick={()=>toggleSave(detail)}>{saved.includes(detail.id)?"Unsave deal":"Save deal"} <Heart size={16}/></button><button className="text-button" onClick={()=>{setAlertDestination(detail.country);close();document.getElementById("alerts")?.scrollIntoView();setTimeout(()=>document.querySelector<HTMLInputElement>('[name="destination"]')?.focus(),50);}}>Set a price alert <ArrowRight size={16}/></button></div>
      </div></>:<div className="dialog-body info-body"><span className="eyebrow orange">ABOUT THIS LOCAL DEMO</span><h2 id="dialog-title">{info}</h2><p>FareFinder is a fictional travel platform. Explore 20 typed sample offers, combine filters, save favorites in your browser, and preview a trip with transparent per-person arithmetic.</p><p>Guarantees, cancellation, support, payment brands, early access, partnerships and promotional figures are illustrative only. No commercial promise, certification, endorsement, reservation or service is offered.</p><p>Company links are informational previews: no careers, press, affiliate, account or contact service exists. All destination artwork is original SVG; no travel provider is connected.</p><button className="primary" onClick={close}>Got it <Check size={16}/></button></div>}
    </dialog>
  </>;
}
