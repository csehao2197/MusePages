"use client";
import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { days, tiers, type Tier } from "./data";

const money = (value: number) => `$${value.toFixed(2)}`;
export default function Checkout({ initial }: { initial: Tier }) {
  const [type, setType] = useState<Tier>(initial);
  const [date, setDate] = useState<string>(days[0].value);
  const [quantity, setQuantity] = useState(1);
  const [kids, setKids] = useState(0);
  const [code, setCode] = useState("");
  const [age, setAge] = useState(18);
  const [addon, setAddon] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ name: string; total: number; type: string; date: string; quantity: number; kids: number; addon: boolean } | null>(null);
  const tier = tiers.find(t => t.id === type)!;
  const validQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= 12;
  const discount = code.trim().toUpperCase() === "CREW20" && validQuantity && quantity >= 8 ? .2 : 0;
  const subtotal = validQuantity ? tier.price * quantity : 0;
  const total = subtotal * (1 - discount) + (addon ? 15 : 0);
  const classAvailable = type !== "day" || date === days[1].value;
  function reset() {
    setReceipt(null); setType(initial); setDate(days[0].value); setQuantity(1); setKids(0); setCode(""); setAge(18); setAddon(false); setError("");
  }
  if (receipt) return <div className="confirmation" role="status">
    <CheckCircle2 size={48}/><p className="eyebrow">LOCAL DEMO CONFIRMATION</p><h3>You’re on the imaginary guest list, {receipt.name}.</h3>
    <p>{receipt.quantity} × {receipt.type} · {receipt.date}<br/>{receipt.kids} children under 10 · {receipt.addon ? "One 21+ cocktail class add-on" : "No class add-on"}</p>
    <p className="receipt-total">{money(receipt.total)}</p><p>No money charged. No ticket issued. No email sent. This summary exists only in this browser session.</p>
    <button className="button rose" onClick={reset}><RotateCcw size={17}/> Start a new demo order</button>
  </div>;
  return <form onReset={reset} onSubmit={event => {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (name.length < 2) { setError("Enter a name with at least two non-space characters."); return; }
    if (!tiers.some(t => t.id === type) || !validQuantity || !Number.isInteger(kids) || kids < 0 || kids > 6) { setError("Choose 1–12 paid passes and 0–6 children under 10."); return; }
    if (!days.some(d => d.value === date)) { setError("Choose a listed festival date."); return; }
    if (!Number.isInteger(age) || age < 18 || age > 120) { setError("The demo purchaser must be aged 18–120."); return; }
    if (code.trim() && code.trim().toUpperCase() !== "CREW20") { setError("Unknown demo code. Use CREW20 for 8+ paid passes, or clear the code."); return; }
    if (code.trim() && quantity < 8) { setError("CREW20 needs at least 8 paid passes. Add passes or clear the code."); return; }
    if (addon && (!classAvailable || age < 21)) { setError("The class requires a July 26 entry and a purchaser aged 21+. Uncheck the add-on or update your selection."); return; }
    setReceipt({ name, total, type: tier.name, date: type === "day" ? days.find(d => d.value === date)!.label : "July 25–27, 2026", quantity, kids, addon });
  }}>
    <p className="notice">Historical, fictional event dates. This is a local calculator, not a reservation. Food purchases are separate. No fees or tax are simulated.</p>
    <div className="form-grid">
      <label>Ticket type<select value={type} onChange={e => { setType(e.target.value as Tier); setError(""); }}><option value="day">Day Pass — $15</option><option value="weekend">Weekend Pass — $35</option><option value="vip">VIP Experience — $89</option></select></label>
      <label>Visit date<select value={date} disabled={type !== "day"} onChange={e => { setDate(e.target.value); setError(""); }}>{days.map(d => <option value={d.value} key={d.value}>{d.label}</option>)}</select><small>{type !== "day" ? "All three dates included." : "One selected day only."}</small></label>
      <label>Paid passes (ages 10+)<input type="number" min="1" max="12" step="1" required value={Number.isFinite(quantity) ? quantity : ""} onChange={e => { setQuantity(e.target.valueAsNumber); setError(""); }}/></label>
      <label>Children under 10<input type="number" min="0" max="6" step="1" required value={Number.isFinite(kids) ? kids : ""} onChange={e => setKids(e.target.valueAsNumber)}/><small>Free with a paid adult; supervised by an adult.</small></label>
      <label>Purchaser name<input name="name" autoComplete="off" placeholder="Use a fictional name" minLength={2} maxLength={80} required/></label>
      <label>Email (demo only)<input name="email" type="email" autoComplete="off" placeholder="you@example.com" maxLength={120} required/></label>
      <label>Purchaser age<input type="number" min="18" max="120" step="1" required value={Number.isFinite(age) ? age : ""} onChange={e => { setAge(e.target.valueAsNumber); setError(""); }}/></label>
      <label>Group code<input value={code} placeholder="CREW20 for 8+ paid passes" maxLength={20} onChange={e => { setCode(e.target.value); setError(""); }}/></label>
    </div>
    <label className="check-row"><input type="checkbox" checked={addon} onChange={e => { setAddon(e.target.checked); setError(""); }}/> One cocktail masterclass seat (+$15), Jul 26 · 21+</label>
    <small>One seat per order. {classAvailable ? "Included visit dates cover the class." : "Select July 26 or an all-days pass to attend the class."}</small>
    <div className="order-total" aria-live="polite"><span>Pass subtotal <b>{money(subtotal)}</b></span><span>CREW20 discount <b>−{money(subtotal * discount)}</b></span><span>Class add-on <b>{money(addon ? 15 : 0)}</b></span><span className="total">Demo total <b data-testid="ticket-total">{money(total)}</b></span></div>
    <label className="check-row"><input name="consent" type="checkbox" required/> I understand this is a fictional demo, not a real ticket or payment.</label>
    {error && <p className="error" role="alert">{error}</p>}
    <button className="button rose full" type="submit">Confirm local demo order</button>
    <button className="text-button reset" type="reset">Reset selections</button>
  </form>;
}
