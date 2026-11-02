"use client";
import { useState } from "react";
import { CheckCircle2, CalendarDays, ArrowUpRight } from "lucide-react";
import { event, property } from "./fixtures";

export function downloadCalendar(time = "11:00", duration = 240) {
  const [h,m] = time.split(":").map(Number);
  const start = new Date(Date.UTC(2026,10,14,h+7,m));
  const end = new Date(start.getTime()+duration*60000);
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(".000", "");
  const content = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sample024//Fictional Open House//EN",
    "CALSCALE:GREGORIAN", "BEGIN:VEVENT", `UID:sample024-${time.replace(":","")}@example.invalid`,
    "DTSTAMP:20261031T120000Z", `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    "SUMMARY:Fictional Ridgewood Terrace open house demo",
    `LOCATION:${property.address}\\, ${property.city}`,
    "DESCRIPTION:LOCAL DEMO ONLY. No real event or reservation. Original April 4 event is archival. Arizona MST UTC-7.",
    "STATUS:TENTATIVE", "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = "ridgewood-demo.ics"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function RSVPForm({ privateViewing }: { privateViewing: () => void }) {
  const [reserved, setReserved] = useState<{name:string; guests:number; time:string; label:string} | null>(null);
  const [slot, setSlot] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const [offline, setOffline] = useState(false);
  const selected = event.slots.find(s => s.time === slot);
  if (reserved) return <div className="confirmation" role="status">
    <CheckCircle2 size={36}/><p className="eyebrow">LOCAL CONFIRMATION ONLY</p><h3>You’re on the demo guest list, {reserved.name}.</h3>
    <p>{event.label} · {reserved.label} · {reserved.guests} {reserved.guests === 1 ? "guest" : "guests"}</p><p>{event.zone}. A 30-minute guided tour. Nothing was sent, saved remotely or booked.</p>
    <div className="button-row"><button className="button" onClick={() => downloadCalendar(reserved.time,30)}><CalendarDays size={17}/> Save tour to calendar</button><button className="button outline" onClick={() => { setReserved(null); setSlot(""); setGuests(1); setError(""); setOffline(false); }}>Reset reservation</button></div>
  </div>;
  return <form className="rsvp-form" onSubmit={e => {
    e.preventDefault(); const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    if (!name) { setError("Enter your full name, not only spaces."); return; }
    if (!selected) { setError("Choose a tour time."); return; }
    if (guests > selected.capacity) { setError(selected.capacity === 0 ? "This demo tour is full. Choose another time." : `Only ${selected.capacity} demo spaces remain. Reduce your party or choose another time.`); return; }
    if (offline) { setError("The local reservation simulation is unavailable. Turn off the failure simulation and retry; your entries are retained."); return; }
    setError(""); setReserved({name,guests,time:slot,label:selected.label});
  }} onReset={() => { setSlot(""); setGuests(1); setError(""); setOffline(false); }}>
    <div className="form-grid">
      <label>Full name<input name="name" autoComplete="name" required maxLength={100} placeholder="Your full name"/></label>
      <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={160} placeholder="you@example.com"/></label>
      <label>Phone number<input name="phone" type="tel" autoComplete="tel" required pattern={"(?=(?:[^0-9]*[0-9]){7})[0-9+\\(\\) .\\-]{7,22}"} title="At least 7 digits; 7–22 total characters using digits, spaces, +, parentheses, dots or hyphens" placeholder="(480) 555-0100"/></label>
      <label>Preferred tour time<select name="slot" required value={slot} onChange={e => {setSlot(e.target.value);setError("");}}>
        <option value="">Choose a 30-minute tour</option>{event.slots.map(s => <option key={s.time} value={s.time}>{s.label} · {s.capacity ? `${s.capacity} spaces` : "full"}</option>)}
      </select></label>
      <label>Party size<input name="guests" type="number" min={1} max={6} step={1} required value={guests} onChange={e => {setGuests(Number(e.target.value));setError("");}}/></label>
      <fieldset><legend>Working with an agent?</legend><label className="inline"><input type="radio" name="agent" value="yes" required/> Yes</label><label className="inline"><input type="radio" name="agent" value="no" required/> No</label></fieldset>
    </div>
    <label>Message <span className="muted">(optional)</span><textarea name="message" rows={3} maxLength={1000} placeholder="Anything you’d like to explore during your visit?"/></label>
    <p className="capacity" aria-live="polite">{selected ? `${selected.capacity} fictional spaces remaining at ${selected.label}. Maximum party: 6.` : "Select a time to see fictional availability. Tours start every 30 minutes."}</p>
    <details className="simulation"><summary>Demo recovery controls</summary><label className="inline"><input type="checkbox" checked={offline} onChange={e => {setOffline(e.target.checked);setError("");}}/> Simulate local service failure</label><p>No network request is made.</p></details>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="button-row"><button className="button" type="submit">Reserve My Spot <ArrowUpRight size={18}/></button><button type="reset" className="text-button">Clear form</button></div>
    <p className="fine">Local demo only. Personal details stay in this page’s memory and disappear on reset or reload. No email, account or real reservation.</p>
    <button type="button" className="text-button private-link" onClick={privateViewing}>Can’t make it? Request a private showing <ArrowUpRight size={15}/></button>
  </form>;
}

export function ContactForm({ mode }: { mode: "private" | "inquiry" }) {
  const [done,setDone] = useState(false);
  const [error,setError] = useState("");
  const [failure,setFailure] = useState(false);
  const [summary,setSummary] = useState("");
  if (done) return <div className="confirmation" role="status"><CheckCircle2/><h3>{mode === "private" ? "Private viewing request recorded locally" : "Message preview received locally"}</h3><p>{summary}</p><p>No message was sent and no appointment is booked. This fictional broker will not contact you.</p><button className="button outline" onClick={() => {setDone(false);setError("");setFailure(false);setSummary("");}}>Start a new request</button></div>;
  return <form className="contact-form" onSubmit={e => {
    e.preventDefault(); const data = new FormData(e.currentTarget);
    if (!String(data.get("name")).trim() || !String(data.get("message")).trim()) {setError("Please enter a name and a meaningful message, not only spaces.");return;}
    if (mode === "private") {
      const date = String(data.get("date")); const time = String(data.get("time")); const guests = Number(data.get("party"));
      if (date < "2026-11-15" || date > "2026-12-15" || !["10:00","12:00","14:00"].includes(time) || guests < 1 || guests > 6 || !Number.isInteger(guests)) {setError("Choose November 15–December 15, a listed Arizona time and 1–6 guests.");return;}
      if (date === "2026-11-15" && time === "10:00") {setError("This fictional private-viewing time is unavailable. Choose noon, 2 PM or another date.");return;}
    }
    if (failure) {setError("Local message simulation failed. Disable the failure control and retry; your draft is retained.");return;}
    setSummary(mode === "private"
      ? `${String(data.get("name")).trim()} · ${data.get("date")} · ${String(data.get("time")) === "10:00" ? "10:00 AM" : String(data.get("time")) === "12:00" ? "12:00 PM" : "2:00 PM"} Arizona MST · ${data.get("party")} guests.`
      : `${String(data.get("name")).trim()} — ${String(data.get("message")).trim()}`);
    setDone(true);
  }}>
    <p className="fine">Fictional {mode === "private" ? "appointment request" : "broker inquiry"}. No actual contact or booking.</p>
    <label>Full name<input name="name" required autoComplete="name" maxLength={100}/></label>
    <label>Email address<input name="email" type="email" required autoComplete="email" maxLength={160}/></label>
    {mode === "private" && <div className="form-grid"><label>Preferred date<input name="date" type="date" required min="2026-11-15" max="2026-12-15"/></label><label>Arizona time<select name="time" required><option value="">Choose time</option><option value="10:00">10:00 AM</option><option value="12:00">12:00 PM</option><option value="14:00">2:00 PM</option></select></label><label>Number of guests<input name="party" type="number" defaultValue={1} min={1} max={6} step={1} required/></label><p className="fine">Demo date window: Nov 15–Dec 15, 2026. Nov 15 at 10 AM is unavailable.</p></div>}
    <label>{mode === "private" ? "Viewing interests" : "Your message"}<textarea name="message" required rows={3} maxLength={1000}/></label>
    <label className="inline"><input type="checkbox" checked={failure} onChange={e => {setFailure(e.target.checked);setError("");}}/> Simulate local message failure</label>
    {error && <p role="alert" className="error">{error}</p>}
    <div className="button-row"><button className="button">{mode === "private" ? "Request private viewing" : "Send local message"}</button><button className="text-button" type="reset" onClick={() => {setError("");setFailure(false);}}>Clear draft</button></div>
  </form>;
}

export function Calculator({ resource }: { resource: () => void }) {
  const defaults = { price:2450000,down:20,term:30,rate:6.75,tax:14280,hoa:285,insurance:3600 };
  const [values,setValues] = useState(defaults);
  const update = (key: keyof typeof defaults, value: string) => setValues(v => ({...v,[key]: value === "" ? NaN : Number(value)}));
  const valid = Object.values(values).every(Number.isFinite) && values.price >= 10000 && values.price <= 50000000 && values.down >= 5 && values.down <= 50 && values.rate >= 0 && values.rate <= 25 && values.tax >= 0 && values.tax <= 1000000 && values.hoa >= 0 && values.hoa <= 100000 && values.insurance >= 0 && values.insurance <= 1000000;
  const loan = values.price*(1-values.down/100); const rate = values.rate/1200; const months = values.term*12;
  const principal = rate === 0 ? loan/months : loan*rate/(1-(1+rate)**(-months));
  const parts = [principal,values.tax/12,values.hoa,values.insurance/12];
  const total = parts.reduce((a,b)=>a+b,0);
  const format = (n:number) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);
  const pie = valid ? `conic-gradient(#1e3a5f 0 ${parts[0]/total*100}%, #c9a96e ${parts[0]/total*100}% ${(parts[0]+parts[1])/total*100}%, #98a99c ${(parts[0]+parts[1])/total*100}% ${(total-parts[3])/total*100}%, #d9d1c4 ${(total-parts[3])/total*100}% 100%)` : "#d9d1c4";
  return <div className="calculator">
    <div className="calc-inputs">
      <label>Home price ($)<input type="number" min={10000} max={50000000} step={1000} value={Number.isNaN(values.price) ? "" : values.price} onChange={e=>update("price",e.target.value)}/></label>
      <label>Down payment · {values.down}% <strong>{valid ? format(values.price*values.down/100) : "—"}</strong><input type="range" min={5} max={50} step={1} value={values.down} onChange={e=>update("down",e.target.value)}/></label>
      <fieldset><legend>Loan term</legend><div className="term-options">{[15,20,30].map(term=><button key={term} type="button" aria-pressed={values.term===term} onClick={()=>setValues(v=>({...v,term}))}>{term} years</button>)}</div></fieldset>
      <div className="form-grid">{([["rate","Interest rate (%)",0,25,.01],["tax","Annual property tax ($)",0,1000000,1],["hoa","Monthly HOA ($)",0,100000,1],["insurance","Annual insurance ($)",0,1000000,1]] as const).map(([key,label,min,max,step])=><label key={key}>{label}<input type="number" min={min} max={max} step={step} value={Number.isNaN(values[key]) ? "" : values[key]} onChange={e=>update(key,e.target.value)}/></label>)}</div>
      <button className="text-button" onClick={()=>setValues(defaults)}>Reset estimate</button>
    </div>
    <div className="calc-output" aria-live="polite">
      <p className="eyebrow">ILLUSTRATIVE MONTHLY ESTIMATE</p><p className="payment" data-testid="payment">{valid ? format(total) : "—"}<span>/ month</span></p>
      {!valid ? <p role="alert" className="error">Enter a price of $10,000–$50,000,000, a rate of 0–25%, and nonnegative costs within each input’s limit.</p> : <><div className="donut" style={{background:pie}} aria-hidden="true"><span>{values.term}<small>year loan</small></span></div><dl className="breakdown">{["Principal & interest","Property tax","HOA","Insurance"].map((label,i)=><div key={label}><dt><i className={`key key-${i}`}/>{label}</dt><dd>{format(parts[i])}</dd></div>)}</dl></>}
      <p className="fine">Fictional inputs, not a lender quote or financial advice. Excludes closing costs, PMI and other fees. Rates and taxes are not verified. No financing guarantees.</p>
      <button className="text-button" onClick={resource}>About pre-approval <ArrowUpRight size={15}/></button>
    </div>
  </div>;
}
