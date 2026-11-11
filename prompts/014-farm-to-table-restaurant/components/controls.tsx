"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { dayOf, displayTime, farmDinner, localToday, timeSlots, validateReservation, type Category, type Reservation } from "./data";

export const categories: Category[] = ["Starters", "Mains", "Desserts"];
export function Dialog({ title, children, onClose, origin }: { title: string; children: React.ReactNode; onClose: () => void; origin: RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const trigger = origin.current;
    dialog.showModal();
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
      trigger?.focus({ preventScroll: true });
    };
  }, [origin]);
  return <dialog ref={ref} aria-labelledby="dialog-title" className="dialog" onKeyDown={e => {
    if (e.key !== "Tab") return;
    const controls = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
    const first = controls[0]; const last = controls[controls.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === e.currentTarget)) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) { const box = e.currentTarget.getBoundingClientRect(); if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) onClose(); } }}>
    <div className="dialog-header"><h2 id="dialog-title">{title}</h2><button ref={closeRef} className="icon-button" aria-label="Close dialog" onClick={onClose}><X /></button></div>{children}
  </dialog>;
}

export function ContactFields({ prefix }: { prefix: string }) {
  return <>
    <label className="form-field">Name<input id={`${prefix}-name`} name="name" required maxLength={100} autoComplete="name" placeholder="Your full name" /></label>
    <label className="form-field">Email<input id={`${prefix}-email`} name="email" type="email" required maxLength={180} autoComplete="email" placeholder="you@example.com" /></label>
    <label className="form-field">Phone<input id={`${prefix}-phone`} name="phone" type="tel" required pattern={"[0-9+\\(\\) .\\-]{7,20}"} title="Use 7–20 phone characters, including at least seven digits." autoComplete="tel" placeholder="555 123 4567" /></label>
  </>;
}
const value = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

export function ReservationForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<Reservation | null>(null);
  const success = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLInputElement>(null);
  useEffect(() => { if (confirmation) success.current?.focus(); }, [confirmation]);
  function reset() { setConfirmation(null); setDate(""); setTime(""); setError(""); window.setTimeout(() => first.current?.focus(), 0); }
  if (confirmation) return <div ref={success} tabIndex={-1} className="confirmation" role="status"><span className="success-icon"><Check /></span><p className="eyebrow">LOCAL PREVIEW · H&amp;H–014</p><h3>Your demo table is set, {confirmation.name}.</h3><p>{confirmation.date} at {displayTime(confirmation.time)} · {confirmation.guests} {confirmation.guests === 1 ? "guest" : "guests"}</p>{confirmation.requests && <p>Special requests: {confirmation.requests}</p>}<p className="notice">This is not a reservation. No details were stored or sent, no table is held, and no email will arrive.</p><button className="button" onClick={reset}>Plan another visit <ArrowRight size={16} /></button></div>;
  return <form className="reservation-form" onSubmit={e => {
    e.preventDefault(); const data = new FormData(e.currentTarget);
    const request: Reservation = { date, time, guests: Number(data.get("guests")), name: value(data, "name"), email: value(data, "email"), phone: value(data, "phone"), requests: value(data, "requests") };
    const issue = validateReservation(request);
    setError(issue ?? "");
    if (!issue) setConfirmation(request);
  }}>
    <p className="form-demo-note">Local-only preview. Choose a future service; the 7:00 PM sitting is deliberately full to let you try recovery.</p>
    <div className="form-grid">
      <label className="form-field">Date<input ref={first} name="date" type="date" min={localToday()} required value={date} onChange={e => { setDate(e.target.value); setTime(""); setError(""); }} /></label>
      <label className="form-field">Time<select name="time" required value={time} onChange={e => { setTime(e.target.value); setError(""); }}><option value="">Choose a sitting</option>{timeSlots(date).map(t => <option key={t} value={t}>{displayTime(t)}</option>)}</select></label>
      <label className="form-field">Party Size<select name="guests" required defaultValue="2">{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i === 0 ? "guest" : "guests"}</option>)}</select></label>
      <ContactFields prefix="table" />
      <label className="form-field wide">Special Requests <span>(optional)</span><textarea name="requests" maxLength={600} rows={3} placeholder="A celebration, access needs, or a dietary question…" /></label>
    </div>
    {date && dayOf(date) === 0 && <p className="notice">Sunday public service is brunch, 10:00 AM–2:00 PM. Private evening gatherings are by separate inquiry.</p>}
    {date && dayOf(date) === 1 && <p className="notice">Monday is closed. Choose Tuesday–Sunday to continue.</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button book-button" type="submit">Book Now <ArrowRight size={17} /></button>
    <p className="fine-print">Preview only · no booking, payment, email, or data retention. Dietary requests are not confirmations of safety.</p>
  </form>;
}

export function InquiryForm({ mode }: { mode: "event" | "private" }) {
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ name: string; guests: number; date: string; time: string; message: string } | null>(null);
  const success = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { if (done) success.current?.focus(); }, [done]);
  const event = mode === "event";
  if (done) return <div ref={success} tabIndex={-1} className="confirmation" role="status"><span className="success-icon"><Check /></span><h3>{event ? "Your farm dinner preview is ready." : "Your private inquiry preview is ready."}</h3><p>{done.name} · {done.guests} guests<br />{done.date}{done.time && ` at ${displayTime(done.time)}`}</p>{event ? <p>Illustrative total: ${done.guests * farmDinner.price} · no payment collected.</p> : <p>Occasion: {done.message}</p>}<p className="notice">No reservation or inquiry was sent. No seats are held, details are not stored, and no email or payment is involved.</p><button className="button" onClick={() => { setDone(null); setDate(""); setError(""); window.setTimeout(() => form.current?.querySelector<HTMLInputElement>("input")?.focus(), 0); }}>Start another {event ? "farm dinner preview" : "inquiry"}</button></div>;
  return <form ref={form} className="inquiry-form" onSubmit={e => {
    e.preventDefault(); const data = new FormData(e.currentTarget);
    const guests = Number(data.get("guests")); const name = value(data, "name");
    const email = value(data, "email"); const phone = value(data, "phone"); const message = value(data, "message"); const time = value(data, "time");
    let issue = "";
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.replace(/\D/g, "").length < 7) issue = "Check your contact details, including a complete email and phone number.";
    else if (!Number.isInteger(guests) || guests < 1 || guests > (event ? 12 : 24)) issue = `Choose 1–${event ? 12 : 24} guests.`;
    else if (event && guests > farmDinner.available) issue = "Only 8 demo places are available. Reduce your party to 8 or fewer and try again.";
    else if (!event && (!date || date < localToday())) issue = "Choose today or a future date.";
    else if (!event && dayOf(date) === 1) issue = "Private dining is Tuesday–Sunday evenings. Please choose a different date.";
    else if (!event && (!timeSlots("").includes(time) || !message)) issue = "Choose an evening time and tell us about your occasion.";
    setError(issue);
    if (!issue) setDone({ name, guests, date: event ? farmDinner.date : date, time: event ? "" : time, message });
  }}>
    <p className="notice">{event ? `${farmDinner.name} · ${farmDinner.date} · ${farmDinner.farm}. Archived event replay, not an upcoming dinner. Eight demo places available; $125 per guest, no charge.` : "A private room for up to 24 guests. Tuesday–Sunday evenings, by fictional inquiry. No venue or availability is actually booked."}</p>
    <div className="form-grid inquiry-grid">
      {!event && <><label className="form-field">Event date<input name="date" type="date" min={localToday()} required value={date} onChange={e => setDate(e.target.value)} /></label><label className="form-field">Evening time<select name="time" required defaultValue=""><option value="">Choose a time</option>{timeSlots("").map(t => <option key={t} value={t}>{displayTime(t)}</option>)}</select></label></>}
      <label className="form-field">{event ? "Dinner guests" : "Event guests"}<input name="guests" type="number" min={1} max={event ? 12 : 24} required defaultValue={event ? 2 : 16} /></label>
      <ContactFields prefix={mode} />
      {!event && <label className="form-field wide">Your occasion<textarea name="message" required maxLength={800} rows={3} placeholder="Tell us what you're celebrating and any access or menu questions." /></label>}
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button" type="submit">{event ? "Preview My Farm Dinner" : "Preview My Inquiry"} <ArrowRight size={16} /></button>
    <p className="fine-print">Local confirmation only. Please use invented contact details.</p>
  </form>;
}
