"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChartNoAxesCombined, Check, ChevronDown, CircleHelp, House, MapPin, Menu, ShieldCheck, Users, X, Handshake, LockKeyhole, RotateCcw } from "lucide-react";
import { comparables, estimate, money, properties, validateDetails, type Details, type Property } from "./valuation";

const faqs = [
  ["How accurate is the online estimate?", "This toy formula has no measured accuracy. It uses invented inputs, not sales, tax records, MLS data or an AVM. Its ±7% band is a design choice, not a confidence interval. Do not use it for buying, selling, borrowing or investment decisions."],
  ["Do I have to be selling to try this?", "No. This is a local demonstration with three fictional properties, no account and no obligation. Please use the supplied synthetic details, not your own address."],
  ["What is a CMA?", "A Comparative Market Analysis generally compares similar properties and their features. A real CMA would require a qualified professional and verified local evidence. This demo does not provide one or arrange a visit."],
  ["How is this different from Zillow’s Zestimate?", "There is no provider integration or real model here. This is an independent UI exercise, with no Zillow affiliation or endorsement, and cannot be compared to a real valuation service."],
  ["Is my personal information safe?", "Please do not enter personal information. Demo entries remain only in this page’s React memory and clear on reload or reset. No property lookup, lead submission, storage, analytics or email occurs. The local server still handles ordinary page requests."],
];
const initialDetails: Details = { ...properties[0], condition: "standard" };
type Stage = "details" | "loading" | "error" | "result";
const personas = {
  alex: { name: "Alex Example", email: "alex@example.invalid", phone: "(555) 010-0020" },
  sam: { name: "Sam Sample", email: "sam@example.invalid", phone: "(555) 010-0021" },
};
function Brand() { return <span className="brand"><span className="brand-icon"><House size={24} strokeWidth={1.7} /></span><span>KEYSTONE<small>REALTY GROUP · FICTIONAL DEMO</small></span></span>; }
function TrendChart() {
  return <svg className="trend-chart" viewBox="0 0 900 135" role="img" aria-label="Illustrative upward price curve, not actual market history">
    <defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#2563eb" stopOpacity=".16"/><stop offset="1" stopColor="#2563eb" stopOpacity="0"/></linearGradient></defs>
    <path d="M0 25H900M0 65H900M0 105H900" stroke="#e5e7eb" strokeDasharray="4 6"/>
    <path d="M0 100 80 94 160 100 240 74 320 82 400 63 480 69 560 42 640 50 720 32 800 38 900 12V135H0Z" fill="url(#chart-fill)"/>
    <path d="M0 100 80 94 160 100 240 74 320 82 400 63 480 69 560 42 640 50 720 32 800 38 900 12" fill="none" stroke="#2563eb" strokeWidth="3"/>
  </svg>;
}
function Report({ property, details, sample = false }: { property: Property; details: Details; sample?: boolean }) {
  const value = estimate(details);
  return <div className="report-card">
    <div className="report-top"><span className="eyebrow"><House size={16}/> KEYSTONE HOME INSIGHTS</span><span className="badge amber">{sample ? "Sample report" : "Toy result"} · fictional</span></div>
    <div className="report-address"><span className="map-icon"><MapPin size={22}/></span><div><h3>{property.address}</h3><p>{details.type === "house" ? "Single-family home" : details.type === "condo" ? "Condominium" : "Townhome"} · {details.condition.replace("-", " ")} condition</p></div></div>
    <div className="report-value"><span>ILLUSTRATIVE VALUE RANGE</span><h4>{money(value.low)} <span>–</span> {money(value.high)}</h4><p>Model midpoint <strong>{money(value.center)}</strong><span className="badge green">Uncalibrated demo</span></p></div>
    <div className="range-bar"><span/></div><div className="range-labels"><span>Low {money(value.low)}</span><strong>Mid {money(value.center)}</strong><span>High {money(value.high)}</span></div>
    <div className="factors">{[[details.bedrooms, "Bedrooms"], [details.bathrooms, "Bathrooms"], [details.sqft.toLocaleString(), "Square feet"], [`${details.lot} acres`, "Lot size"], [details.year, "Year built"], [`${details.garage}-car`, "Garage"]].map(([v, label]) => <div key={label}><strong>{v}</strong><span>{label}</span></div>)}</div>
    <div className="report-trend"><div><span>Invented 12-month trend</span><strong>↗ 6.2%</strong></div><svg viewBox="0 0 150 42" aria-label="Fictional growth sparkline" role="img"><path d="m0 35 20-8 20 5 20-14 20 3 20-14 20 2 30-8" fill="none" stroke="#059669" strokeWidth="3"/></svg></div>
    <div className="comps"><h4>Nearby comparable sales <span>Invented examples only</span></h4>{comparables.map(c => <div key={c.address}><span><MapPin size={13}/>{c.address}</span><strong>{money(c.price)}</strong><small>{c.date}</small></div>)}</div>
    <p className="report-disclaimer">Not an appraisal, accurate AVM, verified sale, real market estimate or investment advice. Illustrative comparables do not feed the formula.</p>
  </div>;
}

function AddressForm({ id, onSelect }: { id: string; onSelect: (property: Property, opener: HTMLElement) => void }) {
  const [address, setAddress] = useState("");
  const [suggest, setSuggest] = useState(false);
  const [error, setError] = useState("");
  const matches = properties.filter(p => p.address.toLowerCase().includes(address.trim().toLowerCase()));
  return <form className="address-form" onSubmit={e => {
    e.preventDefault();
    const selected = properties.find(p => p.address.toLowerCase() === address.trim().toLowerCase());
    if (!selected) { setError("Choose one of the three fictional addresses below. Real addresses are unsupported."); setSuggest(true); return; }
    setError(""); setSuggest(false);
    onSelect(selected, e.currentTarget.querySelector("button[type=submit]") as HTMLElement);
  }}>
    <label className="sr-only" htmlFor={id}>Demo property address</label>
    <div className="address-shell"><MapPin aria-hidden="true" size={22}/><input id={id} required maxLength={100} autoComplete="off" placeholder="Enter your home address..." value={address} aria-describedby={`${id}-note`} aria-invalid={Boolean(error)} onFocus={() => setSuggest(true)} onChange={e => { setAddress(e.target.value); setSuggest(true); setError(""); }}/>
    <button type="submit" className="button">Get My Estimate <ArrowRight size={17}/></button></div>
    {suggest && <div className="suggestions" aria-label="Fictional address suggestions"><div className="suggestion-title">LOCAL DEMO ADDRESSES ONLY <button type="button" aria-label="Close address suggestions" onClick={() => setSuggest(false)}><X size={15}/></button></div>{matches.length ? matches.map(p => <button key={p.id} type="button" onClick={() => { setAddress(p.address); setSuggest(false); setError(""); onSelect(p, document.getElementById(id) as HTMLElement); }}><MapPin size={17}/><span>{p.address}<small>Fictional {p.type} · use synthetic details only</small></span><ArrowUpRight size={16}/></button>) : <div className="empty-suggestions"><p>No demo property matches. No real address lookup is available.</p><button type="button" onClick={() => setAddress("")}>Show all demo addresses</button></div>}</div>}
    <p className={error ? "form-error" : "input-note"} id={`${id}-note`}>{error || "Try “742 Evergreen” · fictional properties only, no real address lookup."}</p>
  </form>;
}

export default function HomeValuation() {
  const [menu, setMenu] = useState(false);
  const [property, setProperty] = useState(properties[0]);
  const [details, setDetails] = useState<Details>(initialDetails);
  const [stage, setStage] = useState<Stage>("details");
  const [detailError, setDetailError] = useState("");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [fullReport, setFullReport] = useState(false);
  const [faq, setFaq] = useState<number | null>(null);
  const [persona, setPersona] = useState<"" | keyof typeof personas>("");
  const [inquiryProperty, setInquiryProperty] = useState("");
  const [timeline, setTimeline] = useState("");
  const [inquiryDone, setInquiryDone] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (dialog.current?.open) stageHeading.current?.focus(); }, [stage]);
  function open(property: Property, element: HTMLElement) {
    opener.current = element;
    setProperty(property); setDetails({ ...property, condition: "standard" }); setStage("details");
    setDetailError(""); setFullReport(false); setSimulateFailure(false); setInquiryProperty(property.id);
    dialog.current?.showModal();
    stageHeading.current?.focus();
  }
  function close() {
    if (timer.current) clearTimeout(timer.current);
    dialog.current?.close();
  }
  function calculate(fail = simulateFailure) {
    const error = validateDetails(details);
    if (error) { setDetailError(error); return; }
    setDetailError(""); setStage("loading");
    timer.current = setTimeout(() => { setStage(fail ? "error" : "result"); timer.current = null; }, 1000);
  }
  function reset() {
    setDetails({ ...property, condition: "standard" }); setStage("details"); setFullReport(false); setDetailError(""); setSimulateFailure(false);
  }
  function scrollEstimate() { document.getElementById("hero-address")?.focus(); document.getElementById("estimate")?.scrollIntoView({ block: "center" }); }
  const person = persona ? personas[persona] : null;
  return <>
    <div className="demo-strip"><ShieldCheck size={14}/><span>INTERACTIVE DESIGN DEMO</span><span className="strip-divider">/</span> Fictional properties. No real valuations or lead collection.</div>
    <header className="site-header"><a href="#top" aria-label="Keystone home"><Brand/></a><nav className={menu ? "nav open" : "nav"} aria-label="Main navigation">{[["How it works", "#how-it-works"], ["Sample report", "#sample-report"], ["Market insights", "#market"], ["About Keystone", "#about"]].map(([label, link]) => <a href={link} key={link} onClick={() => setMenu(false)}>{label}</a>)}<a className="nav-cta" href="#inquiry" onClick={() => setMenu(false)}>Talk to an expert <ArrowUpRight size={15}/></a></nav><button className="menu-toggle" aria-label={menu ? "Close navigation" : "Open navigation"} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></header>
    <main id="top">
      <section className="hero section-wrap" id="estimate">
        <div className="hero-copy"><div className="eyebrow"><span className="blue-dot"/> A LITTLE CLARITY. A WORLD OF POSSIBILITY.</div><h1>What’s your<br/>home <span>worth?</span></h1><p className="hero-description">Your home holds a story.<br/>Let’s explore what its next chapter could look like.</p><p className="hero-subnote">Try a free, instant <strong>fictional estimate</strong> — no obligation,<br className="desktop-break"/> no sign-up, and no real market data.</p><AddressForm id="hero-address" onSelect={open}/><div className="trust-row"><span><Check/>100% free demo</span><span><Check/>No obligation</span><span><Check/>Synthetic data</span></div><div className="hero-footnote"><span className="mini-houses">⌂ ⌂ ⌂</span><span>A simpler way to explore home value.<br/><strong>No homeowner counts or accuracy claims.</strong></span></div></div>
        <div className="hero-art"><img src="/keystone-house.svg" width="660" height="470" alt="Original geometric illustration of a fictional two-story home surrounded by trees"/><div className="floating-value"><span className="float-icon"><ChartNoAxesCombined size={23}/></span><div><small>EXAMPLE HOME VALUE</small><strong>{money(estimate(initialDetails).center)}</strong><span><span className="green-text">↗ 6.2%</span> invented annual trend</span></div><span className="float-badge">DEMO</span></div><div className="art-note"><ShieldCheck size={16}/> A starting point for curiosity. Not an appraisal.</div></div>
      </section>
      <section className="steps-section" id="how-it-works"><div className="section-wrap"><div className="section-heading centered"><span className="eyebrow">FROM ADDRESS TO UNDERSTANDING</span><h2>Your home value in <span>3 simple steps.</span></h2><p>No guesswork about the experience. Here’s the journey.</p></div><div className="steps">{[{ icon: MapPin, title: "Enter your address", text: "Choose a fictional home. No lookup or location access required." }, { icon: ChartNoAxesCombined, title: "See your estimate", text: "Explore how property details change our transparent toy formula." }, { icon: Handshake, title: "Talk to an expert", text: "Try a simulated CMA inquiry. No agent will be contacted." }].map((s, i) => <div className="step" key={s.title}><div className="step-icon"><s.icon size={27}/><span>{i + 1}</span></div><h3>{s.title}</h3><p>{s.text}</p></div>)}</div></div></section>
      <section className="section-wrap sample-section" id="sample-report"><div className="sample-copy"><span className="eyebrow">MORE THAN JUST A NUMBER</span><h2>A clearer picture<br/>of your home’s<br/><span>possibilities.</span></h2><p>A thoughtfully organized report, with the details that make a house a home.</p><ul className="check-list"><li><Check/>A value range, not a single promise</li><li><Check/>The property details behind the number</li><li><Check/>Illustrative neighborhood comparisons</li><li><Check/>A transparent explanation of limitations</li></ul><button className="text-link" onClick={scrollEstimate}>Try your demo report <ArrowRight size={18}/></button><div className="sample-note"><CircleHelp size={20}/><p>What a report looks like, not what your home is worth. Every address, sale and trend shown here is invented.</p></div></div><Report property={properties[0]} details={initialDetails} sample/></section>
      <section className="market-section" id="market"><div className="section-wrap"><div className="market-heading"><div><span className="eyebrow">THE BIGGER PICTURE</span><h2>Local market at a glance.</h2></div><span className="badge">March 2026 · fictional snapshot</span></div><p className="section-description">A demo of the signals a real report might show. These are not local market facts.</p><div className="stats-grid">{[["Median home price", "$472,000", "↗ 5.8% YoY"], ["Average days on market", "18 days", "↘ 4 days vs. prior year"], ["Homes sold / 30 days", "342", "↗ 12% vs. prior month"], ["Price per square foot", "$228", "↗ 3.1% YoY"]].map(([label, value, trend]) => <div className="stat" key={label}><span>{label}</span><strong>{value}</strong><small>{trend} <span>· invented</span></small></div>)}</div><div className="chart-card"><div><h3>Median home price</h3><span>Illustrative 12-month movement · USD</span></div><TrendChart/><div className="chart-labels"><span>Apr ’25</span><span>Jun ’25</span><span>Aug ’25</span><span>Oct ’25</span><span>Dec ’25</span><span>Mar ’26</span></div></div><p className="data-source"><CircleHelp size={14}/> Source: hand-authored demo data. No MLS, public records, live updates or verified geography.</p></div></section>
      <section className="about-section" id="about"><div className="section-wrap about-grid"><div><span className="eyebrow">PEOPLE BEHIND THE POSSIBILITIES</span><h2>A local feeling.<br/>A human <span>approach.</span></h2><p>Meet the idea behind Keystone: clear information and a conversation on your terms. This brand and team are fictional.</p><div className="about-points">{[[House, "Neighborhood-first thinking", "An imagined local practice, not a verified operating brokerage."], [ChartNoAxesCombined, "Clarity over promises", "No claimed sales volume, history or valuation accuracy."], [Users, "People, not pressure", "No customers, reviews or satisfaction statistics are asserted."], [ShieldCheck, "Transparent by design", "Demo-only inputs. No accounts or lead transmission."]].map(([Icon, title, text]) => { const ItemIcon = Icon as typeof House; return <div key={String(title)}><ItemIcon size={23}/><div><h3>{String(title)}</h3><p>{String(text)}</p></div></div>; })}</div></div><figure><img src="/keystone-team.svg" alt="Original illustration of four fictional Keystone team members, not agents or employees" width="600" height="360"/><figcaption><span>Good guidance starts with good questions.</span><small>Original illustration replaces the requested team photography.</small></figcaption></figure></div></section>
      <section className="section-wrap stories-section"><div className="section-heading centered"><span className="eyebrow">THE HUMAN SIDE OF HOME</span><h2>Different homes. Different next chapters.</h2><p>Fictional story cards, not testimonials, endorsements or actual outcomes.</p></div><div className="stories">{[["M & S", "“We wanted to understand our options before turning the page.”", "Michael & Sarah T.", "Demo Springfield · imagined moving story"], ["J L", "“I’m just curious. It’s nice to explore without starting a sales conversation.”", "Janet L.", "Demo Riverside · imagined curiosity story"], ["R K", "“Seeing the details together helped me know which questions to ask.”", "Robert K.", "Demo Oakwood · imagined planning story"]].map(([initials, quote, name, location]) => <article key={name}><span className="story-label">ILLUSTRATIVE STORY · NOT A REVIEW</span><blockquote>{quote}</blockquote><div className="story-person"><span>{initials}</span><div><strong>{name}</strong><small>{location}</small></div></div></article>)}</div></section>
      <section className="inquiry-section" id="inquiry"><div className="section-wrap inquiry-grid"><div><span className="eyebrow">WHEN YOU’RE READY FOR MORE</span><h2>A number is a start.<br/><span>A conversation<br/>goes further.</span></h2><p>A real Comparative Market Analysis needs real evidence and a qualified professional. Explore the request experience here — no visit, report or callback will be arranged.</p><ul className="check-list"><li><Check/>Understand an in-person walkthrough</li><li><Check/>Ask about verified comparable sales</li><li><Check/>Discuss unique features and condition</li><li><Check/>No commitment — this is a simulation</li></ul><div className="support-note"><Handshake size={30}/><div><strong>Questions about the demo?</strong><p><a href="#faq">Read our clear, honest answers <ArrowUpRight size={14}/></a></p></div></div></div><div className="inquiry-card"><span className="badge amber">LOCAL SIMULATION · NOT A LEAD FORM</span><h3>Try a free CMA request</h3><p>Choose supplied synthetic details only.</p>{inquiryDone ? <div className="inquiry-success" role="status"><span className="success-icon"><Check size={26}/></span><h4>Demo request complete</h4><p>{person?.name}, your simulated request for {properties.find(p => p.id === inquiryProperty)?.address} is shown locally.</p><p><strong>No details were sent.</strong> No agent will contact you. No CMA or 24/48-hour service is promised.</p><button className="button" onClick={() => { setInquiryDone(false); setPersona(""); setInquiryProperty(""); setTimeline(""); }}>Reset demo request <RotateCcw size={16}/></button></div> : <form onSubmit={e => { e.preventDefault(); setInquiryDone(true); }}>
        <label>Full name (fictional)<select name="persona" required value={persona} onChange={e => setPersona(e.target.value as typeof persona)}><option value="">Choose a demo person</option><option value="alex">Alex Example</option><option value="sam">Sam Sample</option></select></label>
        <div className="form-two"><label>Email (read-only)<input type="email" readOnly value={person?.email || ""} placeholder="Choose a demo person" aria-label="Demo email"/></label><label>Phone (read-only)<input type="tel" readOnly value={person?.phone || ""} placeholder="Synthetic number only" aria-label="Demo phone"/></label></div>
        <label>Property address<select id="inquiry-property" required value={inquiryProperty} onChange={e => setInquiryProperty(e.target.value)}><option value="">Choose a fictional property</option>{properties.map(p => <option value={p.id} key={p.id}>{p.address}</option>)}</select></label>
        <label>When are you considering selling?<select required value={timeline} onChange={e => setTimeline(e.target.value)}><option value="">Select a demo timeline</option>{["Just curious", "0–3 months", "3–6 months", "6–12 months", "Not selling"].map(t => <option key={t}>{t}</option>)}</select></label>
        <label>Message (optional, synthetic only)<select defaultValue=""><option value="">No message</option><option>I would like to understand the demo report.</option><option>I am exploring an imagined move.</option></select></label>
        <button className="button wide" type="submit">Request Free CMA <ArrowRight size={17}/></button><p className="form-disclosure"><LockKeyhole size={14}/>Local page memory only. No email, phone call or lead collection.</p></form>}</div></div></section>
      <section className="section-wrap faq-section" id="faq"><div><span className="eyebrow">A FEW THINGS WORTH KNOWING</span><h2>Good questions.<br/><span>Clear answers.</span></h2><p>Know exactly what this demo can — and cannot — do.</p><a className="text-link" href="#inquiry">Explore the demo inquiry <ArrowRight size={17}/></a></div><div className="faq-list">{faqs.map(([q, a], i) => <div className={faq === i ? "faq-item expanded" : "faq-item"} key={q}><h3><button aria-expanded={faq === i} aria-controls={`faq-${i}`} onClick={() => setFaq(faq === i ? null : i)}>{q}<ChevronDown size={19}/></button></h3><div id={`faq-${i}`} hidden={faq !== i}><p>{a}</p></div></div>)}</div></section>
      <section className="bottom-cta"><div className="section-wrap"><span className="eyebrow">YOUR NEXT CHAPTER STARTS WITH CURIOSITY</span><h2>Home value, made a little clearer.</h2><p>Take the fictional experience for a spin. No real address needed.</p><AddressForm id="bottom-address" onSelect={open}/><p className="cta-support">No telephone service is connected. <a href="#faq">Visit demo support instead ↗</a></p></div></section>
    </main>
    <footer className="section-wrap"><div className="footer-main"><div><a href="#top"><Brand/></a><p>A thoughtful home valuation experience.<br/>A fictional brand. An honest demo.</p></div>{[["Services", ["Home valuation", "#estimate"], ["Buying & selling demo", "#inquiry"], ["Fictional team", "#about"]], ["Resources", ["Market report", "#market"], ["Sample home insights", "#sample-report"], ["Valuation methodology", "#faq"]], ["Company", ["Our story", "#about"], ["Contact simulation", "#inquiry"], ["Demo privacy & support", "#faq"]]].map(([title, ...links]) => <div className="footer-column" key={String(title)}><h3>{String(title)}</h3>{links.map(link => <a href={link[1]} key={link[0]}>{link[0]}</a>)}</div>)}</div><div className="footer-bottom"><span>© 2026 Keystone Realty Group · fictional UI exercise</span><span><House size={15}/> Equal housing opportunity is a principle, not a certification.</span></div><p className="legal">No actual brokerage, Oregon license, NMLS registration, business history, customer count or social accounts are represented. This is not an appraisal or financial advice. No external services, market feeds or endorsements.</p></footer>
    <button className="mobile-estimate button" onClick={scrollEstimate}>Get Your Estimate <ArrowRight size={17}/></button>
    <dialog ref={dialog} className="valuation-dialog" aria-labelledby="wizard-heading" onClose={() => { if (timer.current) clearTimeout(timer.current); opener.current?.focus(); }} onCancel={close} onKeyDown={e => {
      if (e.key !== "Tab") return;
      const controls = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button, input, select, a[href], [tabindex="0"]')).filter(el => el.getClientRects().length && !el.hasAttribute("disabled"));
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === stageHeading.current)) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }}>
      <button className="dialog-close" aria-label="Close estimate" onClick={close}><X size={22}/></button>
      <span className="eyebrow">FICTIONAL HOME · LOCAL-ONLY EXPERIENCE</span>
      <div className="wizard-steps" aria-label="Estimate progress"><span className="active">1 Address</span><span className="active">2 Details</span><span className={stage !== "details" ? "active" : ""}>3 Toy report</span></div>
      <h2 id="wizard-heading" ref={stageHeading} tabIndex={-1}>{stage === "details" ? "Every home has its details." : stage === "loading" ? "Putting your demo report together…" : stage === "error" ? "The demo service took a pause." : "Your home’s imagined next chapter."}</h2>
      {stage === "details" && <>
        <p className="wizard-address"><MapPin size={16}/>{property.address}</p>
        <p>Adjust synthetic details only. Unsupported types cannot be valued.</p>
        <form onSubmit={e => { e.preventDefault(); calculate(); }}>
          <div className="form-two">
            <label>Property type
              <select aria-label="Property type" value={details.type} onChange={e => setDetails({ ...details, type: e.target.value as Details["type"] })}>
                <option value="house">Single-family house</option><option value="townhome">Townhome</option><option value="condo">Condominium</option><option value="land">Land / commercial — unsupported</option>
              </select>
            </label>
            <label>Condition
              <select aria-label="Condition" value={details.condition} onChange={e => setDetails({ ...details, condition: e.target.value as Details["condition"] })}>
                <option value="standard">Standard</option><option value="updated">Updated</option><option value="needs-work">Needs work</option>
              </select>
            </label>
          </div>
          <div className="form-two">{([
            { key: "bedrooms", label: "Bedrooms", min: 1, max: 6, step: 1 },
            { key: "bathrooms", label: "Bathrooms", min: 1, max: 5, step: .5 },
            { key: "sqft", label: "Living area (sq ft)", min: 500, max: 5000, step: 1 },
            { key: "lot", label: "Lot size (acres)", min: 0, max: 2, step: .01 },
            { key: "year", label: "Year built", min: 1900, max: 2026, step: 1 },
            { key: "garage", label: "Garage spaces", min: 0, max: 3, step: 1 },
          ] as const).map(f => <label key={f.key}>{f.label}
            <input aria-label={f.label} aria-describedby={`bounds-${f.key}`} type="number" required min={f.min} max={f.max} step={f.step} value={Number.isNaN(details[f.key]) ? "" : details[f.key]} onChange={e => setDetails({ ...details, [f.key]: e.target.value === "" ? NaN : Number(e.target.value) })}/>
            <small id={`bounds-${f.key}`}>{f.min}–{f.max}{f.step !== 1 ? ` · step ${f.step}` : ""}</small>
          </label>)}</div>
          <label className="checkbox"><input type="checkbox" checked={simulateFailure} onChange={e => setSimulateFailure(e.target.checked)}/> Simulate service failure to try recovery</label>
          {detailError && <p className="form-error" role="alert">{detailError}</p>}
          <div className="dialog-actions"><button type="button" className="button secondary" onClick={close}>Change address</button><button type="submit" className="button">Calculate demo estimate <ArrowRight size={17}/></button></div>
        </form>
      </>}
      {stage === "loading" && <div role="status" className="loading-state"><span className="spinner"/><p>Applying the toy formula to your synthetic details.</p><small>No provider, AI, address lookup or market data is being contacted.</small><button className="button secondary" onClick={() => { if (timer.current) clearTimeout(timer.current); reset(); }}>Cancel calculation</button></div>}
      {stage === "error" && <div className="error-state" role="alert"><CircleHelp size={40}/><p>This was a deliberately simulated error. No real service failed and no inputs left this page.</p><div className="dialog-actions"><button className="button secondary" onClick={reset}>Edit details</button><button className="button" onClick={() => calculate(false)}>Retry demo estimate <ArrowRight size={16}/></button></div></div>}
      {stage === "result" && <>
        <Report property={property} details={details}/>
        <button className="text-link report-toggle" aria-expanded={fullReport} aria-controls="formula-report" onClick={() => setFullReport(!fullReport)}>{fullReport ? "Hide report methodology" : "View full demo report & formula"}<ChevronDown size={18}/></button>
        <div id="formula-report" hidden={!fullReport} className="methodology">
          <h3>Transparent, not predictive.</h3>
          <p>Base = area × $228/sq ft × type factor + (bedrooms − 3) × $6,000 + (bathrooms − 2) × $8,000 + garage × $4,000 + lot acres × $10,000 − age × $150.</p>
          <p>Type factors: house 1.00, townhome 0.94, condo 0.86. Condition factors: standard 1.00, updated 1.04, needs work 0.92. Age = 2026 − year built (up to 126 years). Multiply base by condition; round midpoint to $1,000 and bound to $80,000–$1,300,000. Range: midpoint ±7%, rounded outward to $1,000.</p>
          <p>The invented comparisons and +6.2% trend are decorative, not model inputs. No confidence or market accuracy is claimed.</p>
        </div>
        <div className="dialog-actions">
          <button className="button secondary" onClick={reset}><RotateCcw size={16}/>Reset & edit details</button>
          <button className="button" onClick={() => { opener.current = document.getElementById("inquiry-property"); close(); document.getElementById("inquiry")?.scrollIntoView(); }}>Try local CMA inquiry <ArrowRight size={16}/></button>
        </div>
      </>}
    </dialog>
  </>;
}
