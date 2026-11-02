"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function Inquiry({ initial = "General question" }: { initial?: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [failure, setFailure] = useState(false);
  if (done) return <div className="confirmation" role="status"><CheckCircle2 size={44}/><h3>Your demo inquiry is ready.</h3><p>Nothing was sent or stored on a server. This local preview does not contact a festival, vendor or sponsor.</p><button className="button rose" onClick={() => { setDone(false); setFailure(false); }}>Create another inquiry</button></div>;
  return <form onSubmit={event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (String(form.get("name")).trim().length < 2 || String(form.get("message")).trim().length < 10) { setError("Use at least 2 non-space characters for your name and 10 for your message."); return; }
    if (failure) { setError("Simulated service unavailable. Uncheck the demo failure and retry; your draft is still here."); return; }
    setError(""); setDone(true);
  }} onReset={() => { setError(""); setFailure(false); }}>
    <p className="notice">Try the local form with fictional details. No email, application or sponsorship is submitted.</p>
    <label>Inquiry topic<select name="topic" defaultValue={initial}>{["General question", "Vendor application", "Sponsor interest", "Volunteer", "Accessibility", "Press kit"].map(topic => <option key={topic}>{topic}</option>)}</select></label>
    <div className="form-grid"><label>Your name<input name="name" minLength={2} maxLength={80} required autoComplete="off"/></label><label>Your email<input name="email" type="email" required maxLength={120} autoComplete="off"/></label></div>
    <label>Your message<textarea name="message" minLength={10} maxLength={1000} rows={4} required placeholder="Tell the imaginary festival team what you have in mind."/></label>
    <label className="check-row"><input type="checkbox" required/> I understand that nothing will be sent.</label>
    <label className="check-row"><input type="checkbox" checked={failure} onChange={e => { setFailure(e.target.checked); setError(""); }}/> Simulate a submission error</label>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="button-row"><button className="button rose" type="submit">Preview local inquiry</button><button className="button outline-dark" type="reset">Reset form</button></div>
  </form>;
}
