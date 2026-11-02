"use client";
import { useState } from "react";
import { Check, CheckCircle2, Armchair, ShieldCheck } from "lucide-react";
import Modal from "./Modal";
import { airlines, dateText, farePrice, fareTypes, type Flight, type Search } from "./flights";

type Passenger = { name: string; surname: string };
type Confirmation = { reference: string; route: string; total: string; passengers: string[]; seats: string[]; fare: string };
export type { Confirmation };
export default function Booking({ flight, fare, search, money, onClose, onConfirm }: { flight: Flight; fare: number; search: Search; money: (value: number) => string; onClose: () => void; onConfirm: (confirmation: Confirmation) => void }) {
  const [step, setStep] = useState(0);
  const [passengers, setPassengers] = useState<Passenger[]>(Array.from({ length: search.adults }, () => ({ name: "", surname: "" })));
  const [email, setEmail] = useState("");
  const [seatLeg, setSeatLeg] = useState(0);
  const legCount = search.trip === "One Way" ? 1 : 2;
  const [seats, setSeats] = useState<string[][]>(Array.from({ length: legCount }, () => []));
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [confirmed, setConfirmed] = useState<Confirmation | null>(null);
  const total = (farePrice(flight, search) + fareTypes[fare].extra) * search.adults;
  const next = () => {
    setError("");
    if (step === 0 && (passengers.some(p => p.name.trim().length < 2 || p.surname.trim().length < 2) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      setError("Enter a first and last name (at least 2 characters) for every traveler and a valid email address.");
      return;
    }
    if (step === 1 && fare > 0 && seats.some(leg => leg.length !== search.adults)) {
      setError(`Choose ${search.adults} different seats for each flight leg.`);
      return;
    }
    if (step === 2) {
      if (!consent) { setError("Please acknowledge that this is a simulation before confirming."); return; }
      const receipt = { reference: `DEMO-${String(flight.id).padStart(3, "0")}-${search.adults}`, route: `${search.from} → ${search.to}${search.trip === "Round Trip" ? ` → ${search.from}` : search.trip === "Multi-City" ? ` → ${search.onward}` : ""}`, total: money(total), passengers: passengers.map(p => `${p.name.trim()} ${p.surname.trim()}`), seats: seats.map((leg, i) => `Leg ${i + 1}: ${leg.join(", ") || "assigned at check-in"}`), fare: fareTypes[fare].name };
      setConfirmed(receipt); onConfirm(receipt); setStep(3);
      return;
    }
    setStep(step + 1);
  };
  const updatePassenger = (index: number, field: keyof Passenger, value: string) => setPassengers(passengers.map((p, i) => i === index ? { ...p, [field]: value } : p));
  const toggleSeat = (seat: string) => {
    setError("");
    const selected = seats[seatLeg];
    if (!selected.includes(seat) && selected.length >= search.adults) { setError("All travelers have a seat. Deselect one to change it."); return; }
    setSeats(seats.map((leg, i) => i === seatLeg ? selected.includes(seat) ? selected.filter(s => s !== seat) : [...selected, seat] : leg));
  };
  return <Modal title={confirmed ? "Your simulated trip is saved" : "Make it your journey"} onClose={onClose}>
    <p className="demo-note"><ShieldCheck size={18} /> Local demo only. No payment, email or ticket will be issued.</p>
    {!confirmed && <><ol className="steps" aria-label="Booking progress">{["Travelers", "Seats", "Review"].map((text, i) => <li key={text} aria-current={step === i ? "step" : undefined} className={i <= step ? "active" : ""}><span>{i < step ? <Check size={14} /> : i + 1}</span>{text}</li>)}</ol>
      <div className="booking-route"><strong>{search.from} → {search.to}</strong><span>{dateText(search.depart)}{search.trip !== "One Way" && ` · ${dateText(search.returnDate)}`} · {airlines[flight.airline].name} · {fareTypes[fare].name}</span><strong>{money(total)} <small>for {search.adults} adults</small></strong></div>
    </>}
    <div className="booking-body">
      {step === 0 && <><h3>Who’s flying?</h3><p className="muted">Use fictional details. Information stays in this page’s memory and is cleared on reload.</p>
        {passengers.map((p, i) => <fieldset className="passenger" key={i}><legend>Adult {i + 1}</legend><label>First name<input autoComplete="off" value={p.name} onChange={e => updatePassenger(i, "name", e.target.value)} aria-invalid={!!error && p.name.trim().length < 2} /></label><label>Last name<input autoComplete="off" value={p.surname} onChange={e => updatePassenger(i, "surname", e.target.value)} aria-invalid={!!error && p.surname.trim().length < 2} /></label></fieldset>)}
        <label>Demo contact email<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="traveler@example.com" autoComplete="off" /></label><p className="muted small">No email will be sent. Please don’t enter real personal information.</p>
      </>}
      {step === 1 && <><h3><Armchair size={20} /> A seat for every traveler</h3>{fare === 0 ? <div className="notice">Basic Economy includes a seat assigned at check-in. Upgrade to Economy from the fare comparison to choose seats. No additional seat charges apply in this demo.</div> : <>
        <div className="tabs seat-tabs">{Array.from({ length: legCount }, (_, i) => <button key={i} aria-pressed={seatLeg === i} onClick={() => setSeatLeg(i)}>{i === 0 ? "Outbound" : search.trip === "Multi-City" ? "Onward" : "Return"} · {seats[i].length}/{search.adults}</button>)}</div>
        <p className="muted">Select {search.adults} seats per leg. {fare === 2 ? "Premium cabin · 38″ pitch" : "Economy cabin · 31″ pitch"}. Seats are assigned to travelers in selection order.</p>
        <div className="seat-map" aria-label="Aircraft seat map"><div className="plane-nose">FRONT OF CABIN</div>{Array.from({ length: 6 }, (_, row) => <div className="seat-row" key={row}><span>{row + (fare === 2 ? 7 : 20)}</span>{["A", "B", "C", "D", "E", "F"].map((letter, col) => { const seat = `${row + (fare === 2 ? 7 : 20)}${letter}`; const unavailable = (row === 1 && col === 2) || (row === 4 && col === 4); return <button key={seat} className={`seat ${col === 3 ? "aisle" : ""}`} disabled={unavailable} aria-label={`Seat ${seat}${unavailable ? ", unavailable" : ""}`} aria-pressed={seats[seatLeg].includes(seat)} onClick={() => toggleSeat(seat)}>{letter}</button>; })}</div>)}</div>
        <p className="small">Blue = selected · Gray = unavailable · All selectable seats included</p>
      </>}</>}
      {step === 2 && <><h3>One last look</h3><dl className="review"><dt>Travelers</dt><dd>{passengers.map(p => `${p.name} ${p.surname}`).join(", ")}</dd><dt>Itinerary</dt><dd>{search.from} → {search.to}{search.trip === "Round Trip" ? ` → ${search.from}` : search.trip === "Multi-City" ? ` → ${search.onward}` : ""}</dd><dt>Seats</dt><dd>{seats.map((s, i) => <div key={i}>Leg {i + 1}: {s.join(", ") || "Assigned at check-in"}</div>)}</dd><dt>Baggage</dt><dd>{fareTypes[fare].baggage}, per traveler</dd><dt>Changes</dt><dd>{fareTypes[fare].changes}</dd><dt>Fare × {search.adults}</dt><dd>{money(farePrice(flight, search) + fareTypes[fare].extra)} × {search.adults}</dd><dt>Taxes & demo fees</dt><dd>Included · No additional charges</dd><dt>Total</dt><dd><strong>{money(total)}</strong></dd></dl>
        <div className="notice">No payment form: this demo does not collect card details. The confirmation is a local preview, not a reservation or issued ticket.</div><label className="checkbox consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /> I understand this is a simulated booking with no real ticket.</label>
      </>}
      {confirmed && <div className="confirmation"><CheckCircle2 size={52} /><h3>Tokyo, here you (virtually) come.</h3><p>Simulated confirmation <strong>{confirmed.reference}</strong></p><p>{confirmed.route} · {confirmed.total}</p><p>{confirmed.passengers.join(" & ")}</p><p>Your preview is available in My Trips until you reload this page. Nothing was charged or sent.</p><button className="primary" onClick={onClose}>Back to flights</button></div>}
      {error && <p className="error" role="alert">{error}</p>}
    </div>
    {!confirmed && <div className="booking-actions">{step > 0 && <button className="outline" onClick={() => { setError(""); setStep(step - 1); }}>Back</button>}<button className="primary" onClick={next}>{step === 2 ? "Confirm simulated booking" : step === 0 ? "Continue to seats" : "Review booking"}</button></div>}
  </Modal>;
}
