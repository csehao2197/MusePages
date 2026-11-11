"use client";
import { useState } from "react";
import { classes, clock, DanceClass, StudioEvent, styles } from "./data";
export type ReservationChoice = { kind: "trial" } | { kind: "class"; item: DanceClass } | { kind: "event"; item: StudioEvent } | { kind: "pack" };
export default function Reservation({ choice, initialStyle = "Not Sure Yet" }: { choice: ReservationChoice; initialStyle?: string }) {
  const [style, setStyle] = useState(initialStyle);
  const [session, setSession] = useState("");
  const [count, setCount] = useState(1);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const selected = choice.kind === "class" || choice.kind === "event" ? choice.item : classes.find(c => c.id === session);
  const options = classes.filter(c => c.spots > 0 && (style === "Not Sure Yet" || c.style === style));
  const cost = choice.kind === "trial" ? 0 : choice.kind === "pack" ? 180 : choice.item.price * count;
  const reset = () => { setConfirmed(""); setSession(""); setCount(1); setStyle(initialStyle); setError(""); };
  if (confirmed) return <div className="confirmation" role="status"><span className="eyebrow">LOCAL DEMO ONLY</span><h3>You’re on the list. Sort of.</h3><p>{confirmed}</p><p>No booking, payment or email was sent. Nothing is saved after reload.</p><button className="button" onClick={reset}>Make another selection</button></div>;
  return <form onReset={reset} onSubmit={e => {
    e.preventDefault(); setError("");
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email"));
    if (!email.endsWith("@example.test")) { setError("Use a fictional email ending in @example.test. No real contact details."); return; }
    if (choice.kind !== "pack" && (!selected || data.get("date") !== selected.date || data.get("time") !== selected.time)) { setError("Choose the date and time shown for your selected session."); return; }
    if (selected && (count < 1 || count > Math.min(4, selected.spots))) { setError("That quantity exceeds this fictional session’s capacity. Select another session."); return; }
    setConfirmed(`${String(data.get("alias"))}: ${choice.kind === "pack" ? "10-class pack" : selected?.title} ${selected ? `· ${selected.date} · ${clock(selected.time)}` : ""} · ${choice.kind === "pack" ? "1 pack" : `${count} adult ${choice.kind === "event" ? "ticket(s)" : "place(s)"}`} · $${cost}${choice.kind === "trial" ? " free trial" : " demo total"}.`);
  }}>
    <p className="form-note">Adults 18+ only. Use invented aliases and an @example.test email. No children’s details, health information or real contact data.</p>
    <div className="form-grid"><label>Demo alias<input name="alias" required minLength={2} maxLength={40} placeholder="River Demo" autoComplete="off"/></label><label>Fictional email<input name="email" type="email" required placeholder="river@example.test" autoComplete="off" /></label></div>
    <label>Adult age category<select name="age" required defaultValue=""><option value="" disabled>Select an adult category</option>{["18–24", "25–34", "35–45", "46+"].map(age => <option key={age}>{age}</option>)}</select></label>
    {choice.kind === "trial" && <>
      <label>Which style interests you?<select value={style} onChange={e => { setStyle(e.target.value); setSession(""); }}><option>Not Sure Yet</option>{styles.map(s => <option key={s.name}>{s.name}</option>)}</select></label>
      <fieldset><legend>Experience level?</legend>{["Never Danced", "Some Experience", "Experienced Dancer"].map(v => <label className="radio" key={v}><input type="radio" required name="experience" value={v}/>{v}</label>)}</fieldset>
      <label>Trial session<select required value={session} onChange={e => setSession(e.target.value)}><option value="">Choose a fictional session</option>{options.map(c => <option value={c.id} key={c.id}>{c.title} · {c.date} · {clock(c.time)} · {c.level}</option>)}</select></label>
      <p className="form-note">Contemporary is intermediate+. Choose Hip-Hop Foundations or Ballet Basics if you are new. Experience selection does not imply medical suitability.</p>
    </>}
    {choice.kind !== "pack" && <><div className="form-grid"><label>Session date<input key={selected?.id || "date"} aria-label="Session date" name="date" type="date" required min={selected?.date || "2026-11-02"} max={selected?.date || "2026-11-28"} defaultValue={selected?.date || ""}/></label><label>Session time<select key={selected?.id || "time"} name="time" required defaultValue={selected?.time || ""}><option value="">Select time</option>{selected && <option value={selected.time}>{clock(selected.time)}</option>}</select></label></div><label>{choice.kind === "event" ? "Adult tickets" : "Adult places"}<input name="quantity" type="number" required min={1} max={Math.min(4, selected?.spots ?? 1)} value={count} onChange={e => setCount(Number(e.target.value))}/></label><p className="form-note">{selected ? `${selected.spots} fictional places available; maximum ${Math.min(4, selected.spots)} per demo selection.` : "Select a session to see date, time and capacity."}</p></>}
    <div className="total"><span>{choice.kind === "trial" ? "Your first class" : "Demo total"}</span><strong>${cost}{choice.kind === "pack" && " / 10 classes"}</strong></div>
    {choice.kind === "pack" && <p>Illustrative pack expires after 3 months; no purchase or redemption is created.</p>}
    {error && <p role="alert" className="error">{error}</p>}
    <button className="button wide" type="submit">{choice.kind === "trial" ? "Reserve My Free Class" : choice.kind === "event" ? "Confirm Demo Tickets" : choice.kind === "pack" ? "Confirm Demo Pack" : "Confirm Demo Class"}</button>
    <button type="reset" className="text-button">Reset form</button><p className="form-note">No credit card. No account. No real reservation.</p>
  </form>;
}
