"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { services } from "@/lib/data";
export function InquiryForm({ initialService = "" }: { initialService?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [simulate, setSimulate] = useState(false);
  const [name, setName] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const notice = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().slice(0, 10);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setName(String(data.get("name")));
    setState("loading");
    await new Promise(resolve => setTimeout(resolve, 450));
    setState(simulate ? "error" : "success");
    if (simulate) setSimulate(false);
    requestAnimationFrame(() => notice.current?.focus());
  }
  function reset() {
    form.current?.reset();
    form.current?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input,textarea").forEach(field => field.setCustomValidity(""));
    setState("idle");
    setSimulate(false);
    requestAnimationFrame(() => form.current?.querySelector<HTMLInputElement>("[name=name]")?.focus());
  }
  return <div className="inquiry-panel">
    {state === "success" ? <div className="confirmation" ref={notice} tabIndex={-1} role="status"><Check size={42} /><h3>Brief received, {name}.</h3><p>That’s the start of something good.</p><p><strong>Demo confirmation only.</strong> Nothing was sent or saved. In a live studio, you could expect a reply within two business days.</p><button className="button" onClick={reset}>Start another inquiry <ArrowUpRight size={17} /></button></div> :
      <form ref={form} onSubmit={submit} aria-label="Project inquiry">
        <div className="form-grid">
          <label>Your name *<input name="name" autoComplete="name" required maxLength={100} placeholder="Alex Taylor" onInput={e => e.currentTarget.setCustomValidity(e.currentTarget.value.trim() ? "" : "Please enter your name, not just spaces.")} /></label>
          <label>Email address *<input name="email" type="email" autoComplete="email" required placeholder="alex@studio.com" /></label>
          <label>Company / organization<input name="company" autoComplete="organization" maxLength={140} placeholder="Your team, if applicable" /></label>
          <label>Website<input name="website" type="url" placeholder="https://" /></label>
          <label>Project type *<select name="service" required defaultValue={initialService}><option value="">Choose a service</option>{services.map(s => <option key={s.name}>{s.name}</option>)}<option>Something else / not sure</option></select></label>
          <label>Budget range *<select name="budget" required defaultValue=""><option value="">Choose a range</option><option>Under $5,000</option><option>$5,000–$10,000</option><option>$10,000–$20,000</option><option>$20,000+</option><option>Not sure yet</option></select></label>
          <label>Ideal start date *<input name="date" type="date" min={today} required /></label>
          <label>How did you find me?<select name="referral" defaultValue=""><option value="">Choose an option</option><option>Search</option><option>Referral</option><option>Social media</option><option>Other</option></select></label>
        </div>
        <label>A little about your project *<textarea name="summary" minLength={20} maxLength={3000} required rows={4} placeholder="What are you building, who is it for, and what needs to change? (20 characters minimum)" onInput={e => e.currentTarget.setCustomValidity(e.currentTarget.value.trim().length >= 20 ? "" : "Please add at least 20 characters about your project, excluding surrounding spaces.")} /></label>
        <label className="checkbox"><input type="checkbox" name="consent" required />I understand this is a local demo and consent to processing this brief for this session only. *</label>
        <details className="demo-options"><summary>Demo testing options</summary><label className="checkbox"><input type="checkbox" checked={simulate} onChange={e => setSimulate(e.target.checked)} />Simulate a delivery error on the next attempt</label><p>No network request, storage, email, or third-party service is used.</p></details>
        {state === "error" && <div ref={notice} tabIndex={-1} role="alert" className="error"><strong>The demo delivery failed.</strong> Your brief is still here. The simulated error has been cleared; please try again.</div>}
        <div className="form-bottom"><button className="button dark" type="submit" disabled={state === "loading"}>{state === "loading" ? "Preparing your brief…" : "Send project inquiry"}<ArrowUpRight size={18} /></button><button type="button" className="text-button" onClick={reset}>Reset form</button></div>
        <p className="fine-print" role="status">{state === "loading" ? "Processing locally. Please wait." : "Required fields marked *. No details leave your browser; no availability or pricing is promised."}</p>
      </form>}
  </div>;
}
