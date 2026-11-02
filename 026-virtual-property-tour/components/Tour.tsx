"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, AudioLines, BedDouble,
  Bath, Check, ChevronLeft, ChevronRight, Compass, Copy, Expand, ExternalLink,
  Eye, Grid2X2, Heart, House, Info, Layers, Maximize, Menu, MessageCircle,
  Minus, Move, Pause, Play, Plus, RotateCcw, Share2, ShieldCheck, SlidersHorizontal,
  Square, Volume2, VolumeX, X,
} from "lucide-react";
import Scene from "./Scene";
import { property, rooms, type Hotspot, type RoomId } from "./data";

type Modal = "floorplan" | "gallery" | "property" | "schedule" | "inquiry" | "share" | "access" | "measure" | "compare" | "video" | "neighborhood" | "vr" | "exit" | null;
type Point = { x: number; y: number };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function Floorplan({ current, onSelect, small = false }: { current: RoomId; onSelect: (id: RoomId) => void; small?: boolean }) {
  return <div className={`plan ${small ? "mini-plan" : ""}`}>
    <div className="plan-heading"><span><Compass size={13} /> N ↑</span><span>{small ? "ROOM MAP" : "Schematic room navigator"}</span></div>
    <div className="plan-grid">
      {rooms.map(room => <button key={room.id} className={`plan-room ${room.id} ${current === room.id ? "current" : ""}`} onClick={() => onSelect(room.id)} aria-label={`Floor plan: ${room.name}`} aria-pressed={current === room.id}>
        {current === room.id && <span className="position"><span /></span>}
        <span>{room.name}</span>{!small && <small>{room.dimensions}</small>}
      </button>)}
      <div className="plan-hall">HALL / CONCEPTUAL CONNECTIONS</div>
    </div>
    {!small && <><div className="plan-legend"><span>● Current room</span><span>□ Interior</span><span>▧ Outdoor</span></div><p className="fine">Selected rooms only; floors combined for navigation. Not a complete floor plan. Schematic, not surveyed or suitable for construction.</p></>}
  </div>;
}

function RequestForm({ inquiry }: { inquiry: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [fail, setFail] = useState(false);
  const [error, setError] = useState(false);
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  if (submitted) return <div className="confirmation" role="status"><span className="success-icon"><Check /></span><h3>{inquiry ? "Your demo inquiry is ready." : "Your demo viewing is requested."}</h3><p>{inquiry ? "The local form has been completed." : `${date} · Your selected time is a preference, not a confirmed appointment.`}</p><p>No message was sent. No information is stored or shared with an agent.</p><button className="primary" onClick={() => { setSubmitted(false); setDate(""); setFail(false); setError(false); }}>Start a new request <ArrowRight size={16} /></button></div>;
  return <form className="request-form" onSubmit={event => {
    event.preventDefault();
    if (!inquiry && date < localToday) { setDateError("Choose today or a future date."); return; }
    if (fail) { setError(true); return; }
    setError(false); setSubmitted(true);
  }}>
    <p>A home worth seeing, at your own pace. Try this local form with fictional contact details.</p>
    {!inquiry && <div className="form-row"><label>Preferred date<input type="date" name="date" min={localToday} required value={date} onChange={event => { setDate(event.target.value); setDateError(""); }} /></label><label>Preferred time<select aria-label="Preferred time" name="time" required defaultValue=""><option value="" disabled>Select a time</option><option>10:00 AM</option><option>1:00 PM</option><option>4:00 PM</option></select></label></div>}
    {dateError && <p role="alert" className="error">{dateError}</p>}
    <label>Your name<input name="name" autoComplete="name" required maxLength={80} placeholder="Alex Morgan" pattern=".*\S.*" /></label>
    <div className="form-row"><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={120} placeholder="alex@example.com" /></label><label>Phone (optional)<input name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="Your phone number" /></label></div>
    <label>{inquiry ? "What would you like to know?" : "Anything we should know? (optional)"}<textarea name="message" rows={3} maxLength={1000} required={inquiry} placeholder="Tell us what caught your eye…" /></label>
    <label className="check-label"><input type="checkbox" required /> I understand this is a fictional property and a local demo, not a real booking or inquiry.</label>
    <details className="demo-options"><summary>Demo testing options</summary><label className="check-label"><input type="checkbox" checked={fail} onChange={e => setFail(e.target.checked)} /> Simulate request failure</label></details>
    {error && <div className="error" role="alert">Demo request could not be completed. Your entries are retained. Turn off “Simulate request failure” and try again.</div>}
    <div className="form-actions"><button type="submit" className="primary">{inquiry ? "Complete demo inquiry" : "Request demo viewing"} <ArrowUpRight size={16} /></button><button type="reset" className="text-button" onClick={() => { setDate(""); setDateError(""); setError(false); setFail(false); }}>Reset form</button></div>
    <p className="fine"><ShieldCheck size={14} /> Local only. No account, payment, email delivery, or real appointment.</p>
  </form>;
}

function Measurement({ roomId }: { roomId: RoomId }) {
  const room = rooms.find(r => r.id === roomId)!;
  const [points, setPoints] = useState<Point[]>([]);
  const [width, setWidth] = useState("84");
  const [result, setResult] = useState("");
  const [furniture, setFurniture] = useState(false);
  const distance = points.length === 2 ? Math.hypot((points[1].x - points[0].x) / 100 * room.width, (points[1].y - points[0].y) / 100 * room.depth).toFixed(1) : null;
  const addPoint = (event: React.MouseEvent<HTMLButtonElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const p = event.detail === 0 ? (points.length !== 1 ? { x: 25, y: 50 } : { x: 75, y: 50 }) : { x: clamp((event.clientX - box.left) / box.width * 100, 0, 100), y: clamp((event.clientY - box.top) / box.height * 100, 0, 100) };
    setPoints(old => old.length >= 2 ? [p] : [...old, p]);
  };
  return <div className="measurement">
    <p>{room.name} · illustrative dimensions <strong>{room.dimensions}</strong>. Select two points below to estimate the distance.</p>
    <button className="measure-board" onClick={addPoint} aria-label="Measurement canvas: select two points; Enter selects preset points">
      <span className="measure-room-label">{room.name}</span>
      {points.map((p, i) => <span key={i} className="measure-point" style={{ left: `${p.x}%`, top: `${p.y}%` }}>{i + 1}</span>)}
      {points.length === 2 && <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke="currentColor" strokeWidth=".7" strokeDasharray="2 1" /></svg>}
      {furniture && <span className="furniture" style={{ width: `${clamp(Number(width) / 12 / room.width * 100, 5, 95)}%` }}>Couch concept</span>}
    </button>
    <div className="measure-result" role="status">{distance ? `Illustrative distance: ${distance} ft` : `${points.length}/2 points selected`}</div>
    <button className="secondary" onClick={() => setPoints([])}>Clear measurement</button>
    <p className="fine">Keyboard: focus the canvas and press Enter twice for preset quarter/three-quarter points. Distances use a flat schematic, not the perspective illustration.</p>
    <form className="couch-form" onSubmit={e => { e.preventDefault(); setFurniture(true); setResult(Number(width) / 12 + 3 <= room.width ? "Fits the conceptual wall with a 3 ft allowance. Doorways and access are not assessed." : "Too wide for this conceptual wall with a 3 ft allowance. Try a smaller width."); }}>
      <label>Will my couch fit? Width in inches<input type="number" min="24" max="300" step="1" required value={width} onChange={e => { setWidth(e.target.value); setResult(""); setFurniture(false); }} /></label><button className="primary">Check fit</button>
    </form>
    {result && <p role="status">{result}</p>}<p className="fine">Concept only. Not a measurement service or a guarantee of furniture fit. Verify on site.</p>
  </div>;
}

function FriendDraft({ roomName, url }: { roomName: string; url: string }) {
  const [draft, setDraft] = useState("");
  return <form className="friend-draft" onSubmit={event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setDraft(`To: ${String(data.get("recipient"))}\nSubject: A space to imagine — 18 Juniper Lane\n\nTake a look at the ${roomName} in this fictional illustrated tour:\n${url}\n\nLocal demo only; this link is not a public listing.`);
  }} onReset={() => setDraft("")}>
    <h3>Email a friend · local draft</h3>
    <label>Recipient email<input name="recipient" type="email" placeholder="friend@example.com" required maxLength={120} /></label>
    <div className="form-actions"><button className="secondary">Create local email draft</button><button type="reset" className="text-button">Reset draft</button></div>
    {draft && <><p role="status">Draft ready. No email was sent or saved.</p><textarea aria-label="Local email draft" readOnly rows={7} value={draft} onFocus={e => e.target.select()} /></>}
  </form>;
}

export default function Tour() {
  const [roomId, setRoomId] = useState<RoomId>("living");
  const roomIndex = rooms.findIndex(r => r.id === roomId);
  const room = rooms[roomIndex];
  const [modal, setModal] = useState<Modal>(null);
  const [hotspot, setHotspot] = useState<Hotspot | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [rotate, setRotate] = useState(false);
  const [guided, setGuided] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(false);
  const [transcript, setTranscript] = useState(false);
  const [miniMap, setMiniMap] = useState(true);
  const [full, setFull] = useState(false);
  const [saved, setSaved] = useState(false);
  const [menu, setMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [highContrast, setHighContrast] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [systemReduce, setSystemReduce] = useState(false);
  const [gyro, setGyro] = useState(false);
  const [ambient, setAmbient] = useState(false);
  const [compareValue, setCompareValue] = useState(100);
  const [comparison, setComparison] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [mediaPlaying, setMediaPlaying] = useState(false);
  const [tourExited, setTourExited] = useState(false);
  const [shareResult, setShareResult] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const viewer = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const drag = useRef<{ start: Point; pan: Point; type: string; moved: boolean } | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const hotspotTrigger = useRef<HTMLButtonElement | null>(null);
  const reduced = reduce || systemReduce;
  const panLimit = () => ({
    x: Math.min(70, (viewer.current?.clientWidth ?? 0) * (zoom * 1.12 - 1) / 2),
    y: Math.min(35, (viewer.current?.clientHeight ?? 0) * (zoom * 1.12 - 1) / 2),
  });
  const boundPan = (point: Point) => {
    const limit = panLimit();
    return { x: clamp(point.x, -limit.x, limit.x), y: clamp(point.y, -limit.y, limit.y) };
  };

  const changeRoom = (id: RoomId) => {
    setRoomId(id); setPan({ x: 0, y: 0 }); setZoom(1); setHotspot(null); setCompareValue(100);
  };
  const step = (direction: number) => changeRoom(rooms[(roomIndex + direction + rooms.length) % rooms.length].id);
  const open = (value: Modal) => { setModal(value); setMenu(false); setHotspot(null); setShareResult(""); };
  const close = () => { setModal(null); setMediaPlaying(false); };
  const closeHotspot = () => { setHotspot(null); hotspotTrigger.current?.focus(); };
  const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }); setRotate(false); setGyro(false); };
  const adjustZoom = (value: number) => setZoom(old => Number(clamp(old + value, 1, 1.8).toFixed(2)));
  const move = (x: number, y: number) => setPan(old => boundPan({ x: old.x + x, y: old.y + y }));

  useEffect(() => {
    const observer = new ResizeObserver(() => setPan(old => boundPan(old)));
    if (viewer.current) observer.observe(viewer.current);
    setPan(old => boundPan(old));
    return () => observer.disconnect();
  }, [zoom, full, tourExited]);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduce(media.matches);
    const listener = () => setSystemReduce(media.matches);
    media.addEventListener("change", listener);
    try { setSaved(localStorage.getItem("fieldnote-026-saved") === "yes"); } catch { /* Saving remains usable for this visit. */ }
    return () => media.removeEventListener("change", listener);
  }, []);

  const isOpen = modal !== null;
  useEffect(() => {
    if (isOpen) {
      trigger.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
      trigger.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (modal) dialog.current?.querySelector<HTMLButtonElement>(".modal-top button")?.focus();
  }, [modal]);

  useEffect(() => {
    if (!full && !isOpen) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = old; };
  }, [full, isOpen]);

  useEffect(() => {
    if (!full) return;
    const surroundings = document.querySelectorAll<HTMLElement>(".header,.tour-nav,.tour-topline,.room-info,.guided-panel,.room-strip,.property-summary,footer,.mobile-bottom,.demo-ribbon");
    surroundings.forEach(element => { element.inert = true; });
    const key = (e: KeyboardEvent) => {
      if (dialog.current?.open) return;
      if (e.key === "Escape") { setFull(false); viewer.current?.focus(); }
      if (e.key === "Tab") {
        const nodes = viewer.current?.querySelectorAll<HTMLElement>('button:not(:disabled),[tabindex="0"],input');
        if (!nodes?.length) return;
        const first = viewer.current!, last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      surroundings.forEach(element => { element.inert = false; });
      document.removeEventListener("keydown", key);
    };
  }, [full]);

  useEffect(() => {
    if (!hotspot) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setHotspot(null); hotspotTrigger.current?.focus(); } };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [hotspot]);

  useEffect(() => {
    const target = viewer.current;
    if (!target) return;
    const wheel = (event: WheelEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest("button, .hotspot-card, .mini-map")) return;
      event.preventDefault(); setZoom(old => Number(clamp(old + (event.deltaY < 0 ? .08 : -.08), 1, 1.8).toFixed(2)));
    };
    target.addEventListener("wheel", wheel, { passive: false });
    return () => target.removeEventListener("wheel", wheel);
  }, [tourExited]);

  useEffect(() => {
    if (!rotate || reduced || isOpen) return;
    const timer = setInterval(() => setPan(old => ({ ...old, x: old.x >= panLimit().x ? -panLimit().x : Math.min(old.x + 1, panLimit().x) })), 120);
    return () => clearInterval(timer);
  }, [rotate, reduced, isOpen, zoom]);

  useEffect(() => {
    if (!guided || !playing || isOpen) return;
    const timer = setTimeout(() => {
      if (roomIndex === rooms.length - 1) { setPlaying(false); setNotice("Guided tour complete. Explore freely or request a demo viewing."); }
      else changeRoom(rooms[roomIndex + 1].id);
    }, 10000);
    return () => clearTimeout(timer);
  }, [guided, playing, roomIndex, isOpen]);

  useEffect(() => {
    if (!audio || !playing || !guided || isOpen || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(room.narration);
    utterance.rate = .9;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [audio, playing, guided, room.narration, isOpen]);

  useEffect(() => {
    if (!gyro) return;
    let received = false;
    const orient = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return;
      received = true;
      setPan(boundPan({ x: event.gamma * 2, y: (event.beta - 45) * .8 }));
    };
    window.addEventListener("deviceorientation", orient);
    const timer = setTimeout(() => { if (!received) { setGyro(false); setNotice("No orientation sensor data. Use drag, arrow keys, or the direction controls instead."); } }, 2500);
    return () => { window.removeEventListener("deviceorientation", orient); clearTimeout(timer); };
  }, [gyro, zoom]);

  useEffect(() => {
    if (!ambient) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine"; oscillator.frequency.value = 130.81; gain.gain.value = .025;
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start();
    void context.resume().catch(() => { setAmbient(false); setNotice("Ambient sound is unavailable in this browser."); });
    return () => { oscillator.stop(); void context.close(); };
  }, [ambient]);

  useEffect(() => {
    if (!mediaPlaying || modal !== "video") return;
    const timer = setInterval(() => setGalleryIndex(old => (old + 1) % rooms.length), 2500);
    return () => clearInterval(timer);
  }, [mediaPlaying, modal]);

  async function enableGyro() {
    if (gyro) { setGyro(false); return; }
    const orientation = window.DeviceOrientationEvent as (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> }) | undefined;
    if (!orientation) { setNotice("Orientation is unavailable. Use drag or the direction controls."); return; }
    try {
      if (orientation.requestPermission && await orientation.requestPermission() !== "granted") { setNotice("Orientation permission was not granted. Manual controls remain available."); return; }
      setGyro(true); setNotice("Waiting for orientation data. Manual controls are always available.");
    } catch { setNotice("Orientation is unavailable in this browser. Use manual controls."); }
  }
  const save = () => {
    const value = !saved; setSaved(value);
    try { localStorage.setItem("fieldnote-026-saved", value ? "yes" : "no"); setNotice(value ? "Saved on this browser. No account or real listing service." : "Removed from your saved homes."); }
    catch { setNotice("Saved for this visit only; browser storage is unavailable."); }
  };
  const share = async (embed = false) => {
    const url = `${location.origin}/?room=${roomId}`;
    const value = embed ? `<iframe src="${url}" title="Fieldnote illustrated demo tour"></iframe>` : url;
    try { await navigator.clipboard.writeText(value); setShareResult(embed ? "Embed code copied." : "Local demo link copied."); }
    catch { setShareResult("Clipboard unavailable. Select and copy the text below."); }
  };
  useEffect(() => {
    const value = new URLSearchParams(location.search).get("room");
    if (rooms.some(r => r.id === value)) setRoomId(value as RoomId);
  }, []);

  const pointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, input, .hotspot-card, .mini-map")) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
    setRotate(false);
    if (pointers.current.size === 1) drag.current = { start: { x: e.clientX, y: e.clientY }, pan, type: e.pointerType, moved: false };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom };
    }
  };
  const pointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      setZoom(Number(clamp(pinch.current.zoom * Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, pinch.current.distance), 1, 1.8).toFixed(2)));
    } else if (drag.current && !pinch.current) {
      const dx = e.clientX - drag.current.start.x, dy = e.clientY - drag.current.start.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) drag.current.moved = true;
      setPan(boundPan({ x: drag.current.pan.x + dx * .35, y: drag.current.pan.y + dy * .25 }));
    }
  };
  const pointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current && !pinch.current && drag.current.type === "touch" && zoom === 1) {
      const dx = e.clientX - drag.current.start.x;
      if (Math.abs(dx) > 110 && Math.abs(e.clientY - drag.current.start.y) < 70) step(dx < 0 ? 1 : -1);
    }
    if (drag.current && !drag.current.moved) setHotspot(null);
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) { drag.current = null; pinch.current = null; }
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const modalTitles: Record<NonNullable<Modal>, string> = {
    floorplan: "Find your way home.", gallery: "A closer look.", property: "The details, considered.",
    schedule: "Come and feel the space.", inquiry: "Let’s talk about the details.", share: "A home worth sharing.",
    access: "Make yourself comfortable.", measure: "Make room for your life.", compare: "Two ways to see the space.",
    video: "A slower look around.", neighborhood: "Around the neighborhood.", vr: "About this illustrated viewer.", exit: "Take the feeling with you.",
  };

  return <div className={`site ${highContrast ? "high-contrast" : ""} ${reduced ? "reduce-motion" : ""}`}>
    <a className="skip" href="#tour-viewer">Skip to interactive tour</a>
    <div className="demo-ribbon">AN ORIGINAL ILLUSTRATED TOUR <span>·</span> Fictional property. Real room to imagine.</div>
    <header className="header">
      <a className="brand" href="#" onClick={e => { e.preventDefault(); setTourExited(false); }} aria-label="Fieldnote home"><House size={27} strokeWidth={1.3} /><span>fieldnote<small>HOMES WITH FEELING</small></span></a>
      <div className="address"><h1>{property.address}</h1><p>Mosswood, California <span>· Fictional listing</span></p></div>
      <div className="header-price"><strong>{property.price}</strong><span>Illustrative asking price</span></div>
      <div className="header-actions">
        <button className={`icon-button save ${saved ? "saved" : ""}`} aria-label={saved ? "Unsave property" : "Save property"} aria-pressed={saved} onClick={save}><Heart size={20} fill={saved ? "currentColor" : "none"} /></button>
        <button className="icon-button share" aria-label="Share tour" onClick={() => open("share")}><Share2 size={19} /></button>
        <button className="primary schedule-top" onClick={() => open("schedule")}>Schedule a tour <ArrowUpRight size={16} /></button>
        <button className="icon-button mobile-menu" aria-label={menu ? "Close navigation" : "Open navigation"} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      </div>
    </header>
    <main>
      <div className="tour-topline"><span><span className="live-dot" /> PRIVATE TOUR <span className="slash">/</span> 18 JUNIPER LANE</span><button className="text-button" onClick={() => open("exit")}>Exit tour <ArrowUpRight size={13} /></button></div>
      <nav className={`tour-nav ${menu ? "nav-open" : ""}`} aria-label="Tour navigation">
        <div className="mode-toggle"><button className={!guided ? "active" : ""} aria-pressed={!guided} onClick={() => { setGuided(false); setPlaying(false); }}> <Move size={14} /> Self-guided</button><button className={guided ? "active" : ""} aria-pressed={guided} onClick={() => { setGuided(true); setPlaying(false); setTranscript(true); }}> <Play size={13} /> Guided tour</button></div>
        <div className="nav-tools"><button onClick={() => open("floorplan")}><Layers size={16} /> Floor plan</button><button onClick={() => { setGalleryIndex(roomIndex); open("gallery"); }}><Grid2X2 size={16} /> Gallery</button><button onClick={() => open("property")}><Info size={16} /> Property details</button><button className="mobile-share" aria-label="Share tour" onClick={() => open("share")}><Share2 size={16} /> Share</button><button onClick={() => open("access")} aria-label="Accessibility and preferences"><SlidersHorizontal size={17} /></button></div>
      </nav>
      {tourExited ? <section className="exit-state"><House size={42} strokeWidth={1} /><p className="eyebrow">FIELDNOTE / 18 JUNIPER LANE</p><h2>A place to picture<br />your next chapter.</h2><p>You have left the interactive tour. This fictional home is always here to explore.</p><div className="form-actions"><button className="primary" onClick={() => setTourExited(false)}>Return to tour <ArrowRight size={16} /></button><button className="secondary" onClick={() => open("schedule")}>Request a demo viewing</button></div></section> :
      <>
        <div className="tour-layout">
          <div className={`viewer-wrap ${full ? "expanded" : ""}`}>
            <div id="tour-viewer" ref={viewer} className="viewer" tabIndex={0} role="region" aria-label={`${room.name} interactive illustrated viewer. Arrow keys pan, plus and minus zoom, Home resets, Page Down or Page Up changes rooms.`}
              data-pan-x={Math.round(pan.x)} data-pan-y={Math.round(pan.y)} data-zoom={zoom}
              onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd}
              onPointerCancel={e => { pointers.current.delete(e.pointerId); drag.current = null; pinch.current = null; }}
              onKeyDown={e => {
                if (e.target !== e.currentTarget) return;
                if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "Home", "PageDown", "PageUp", "Escape"].includes(e.key)) e.preventDefault();
                if (e.key === "ArrowLeft") move(-10, 0); if (e.key === "ArrowRight") move(10, 0);
                if (e.key === "ArrowUp") move(0, -5); if (e.key === "ArrowDown") move(0, 5);
                if (e.key === "+" || e.key === "=") adjustZoom(.1); if (e.key === "-") adjustZoom(-.1);
                if (e.key === "Home") reset(); if (e.key === "PageDown") step(1); if (e.key === "PageUp") step(-1);
                if (e.key === "Escape") { if (hotspot) closeHotspot(); else setFull(false); }
              }}>
              <div key={roomId} className="scene-canvas" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.12})` }}>
                <Scene room={roomId} empty={comparison} />
                {comparison && <div className="staged-layer" style={{ clipPath: `inset(0 ${100 - compareValue}% 0 0)` }}><Scene room={roomId} /></div>}
                {!comparison && room.hotspots.map(item => <button key={item.id} className={`hotspot ${item.type}`} aria-label={`Hotspot: ${item.title}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} onPointerDown={e => e.stopPropagation()} onClick={e => {
                  hotspotTrigger.current = e.currentTarget;
                  if (item.type === "navigation" && item.destination) changeRoom(item.destination);
                  else if (item.type === "video") { setGalleryIndex(roomIndex); open("video"); }
                  else if (item.type === "link") open("neighborhood");
                  else setHotspot(hotspot?.id === item.id ? null : item);
                }}>{item.type === "navigation" ? <ArrowUpRight size={19} /> : item.type === "video" ? <Play size={14} fill="currentColor" /> : item.type === "link" ? <ExternalLink size={16} /> : <Plus size={18} />}</button>)}
              </div>
              <div className="viewer-shade" />
              <div className="room-heading"><span className="room-number">0{roomIndex + 1}<span> / 04</span></span><h2>{room.name}</h2><p><Square size={12} /> {room.dimensions} <span>·</span> {room.area} <span>concept</span></p></div>
              <div className="illustration-badge"><span /> ILLUSTRATED VIEW · NOT 360°</div>
              <div className="viewer-right-controls">
                <button aria-label={full ? "Exit full view" : "Enter full view"} onClick={() => { setFull(!full); setTimeout(() => viewer.current?.focus(), 0); }} title="Full view">{full ? <X size={18} /> : <Expand size={18} />}</button>
                <span className="control-divider" />
                <button aria-label="Zoom in" disabled={zoom >= 1.8} onClick={() => adjustZoom(.1)}><Plus size={19} /></button>
                <output aria-label="Zoom level">{Math.round(zoom * 100)}%</output>
                <button aria-label="Zoom out" disabled={zoom <= 1} onClick={() => adjustZoom(-.1)}><Minus size={19} /></button>
                <span className="control-divider" />
                <button aria-label="Reset view" onClick={reset}><RotateCcw size={17} /></button>
              </div>
              {hotspot && <div className="hotspot-card" role="region" aria-label={hotspot.title}><button className="card-close" aria-label="Close hotspot" onClick={closeHotspot}><X size={17} /></button><span className="eyebrow">THE CONSIDERED DETAILS</span><h3>{hotspot.title}</h3><p>{hotspot.description}</p></div>}
              {miniMap && <div className="mini-map"><Floorplan current={roomId} onSelect={changeRoom} small /></div>}
              <div className="viewer-center-hint"><Move size={17} /><span>Drag to look around<span className="hint-desktop"> · Scroll to zoom</span></span></div>
              <div className="view-bottom-controls">
                <button aria-label="Pan left" onClick={() => move(-10, 0)}><ArrowLeft size={17} /></button>
                <button aria-label="Pan up" onClick={() => move(0, -5)}><ArrowUp size={17} /></button>
                <button aria-label="Pan down" onClick={() => move(0, 5)}><ArrowDown size={17} /></button>
                <button aria-label="Pan right" onClick={() => move(10, 0)}><ArrowRight size={17} /></button>
                <span />
                <button aria-label="Auto-pan illustrated scene" aria-pressed={rotate && !reduced} disabled={reduced} onClick={() => setRotate(!rotate)}><RotateCcw size={16} /></button>
                <button aria-label={miniMap ? "Hide mini map" : "Show mini map"} aria-pressed={miniMap} onClick={() => setMiniMap(!miniMap)}><Layers size={16} /></button>
              </div>
              {full && <div className="full-room-nav"><button onClick={() => step(-1)} aria-label="Previous room in full view"><ChevronLeft size={18} /></button><span>{room.name}</span><button onClick={() => step(1)} aria-label="Next room in full view"><ChevronRight size={18} /></button></div>}
            </div>
          </div>
          <aside className="room-info" aria-label="Room information">
            <div className="room-info-top"><span className="eyebrow">THE SPACE</span><span>0{roomIndex + 1} — 04</span></div>
            <h2>{room.subtitle}</h2><p className="room-description">{room.note}</p>
            <div className="dimensions"><span>ROOM DIMENSIONS</span><strong>{room.dimensions}</strong><small>Illustrative · {room.area}</small></div>
            <ul className="features">{room.features.map(feature => <li key={feature}><Check size={13} />{feature}</li>)}</ul>
            <button className="room-gallery" onClick={() => { setGalleryIndex(roomIndex); open("gallery"); }}><Grid2X2 size={15} /> Room gallery <ArrowUpRight size={15} /></button>
            <div className="room-tools"><button onClick={() => open("measure")}><Maximize size={15} /> Measure & furnish</button><button onClick={() => setComparison(!comparison)} aria-pressed={comparison}><Layers size={15} /> {comparison ? "Close staging comparison" : "Staged / empty"}</button></div>
            {comparison && <label className="comparison-slider">Staged {compareValue}% / empty {100 - compareValue}%<input aria-label="Staged versus empty comparison" type="range" min="0" max="100" value={compareValue} onChange={e => setCompareValue(Number(e.target.value))} /></label>}
            <div className="agent-note"><span className="agent-avatar">AM</span><p><strong>Avery Morgan</strong><small>Your fictional Fieldnote host</small></p><button aria-label="Contact Avery, fictional host" onClick={() => open("inquiry")}><MessageCircle size={17} /></button></div>
          </aside>
        </div>
        {guided && <section className="guided-panel" aria-label="Guided tour controls"><div className="guided-main"><span className="eyebrow"><AudioLines size={16} /> THE GUIDED EXPERIENCE</span><button aria-label="Previous guided room" onClick={() => step(-1)}><ChevronLeft size={18} /></button><button className="primary" aria-label={playing ? "Pause guided tour" : "Play guided tour"} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? "Pause" : "Play"}</button><button aria-label="Next guided room" onClick={() => step(1)}><ChevronRight size={18} /></button><button aria-label={audio ? "Turn narration off" : "Turn narration on"} aria-pressed={audio} onClick={() => { if (!("speechSynthesis" in window)) setNotice("Device narration unavailable. Read the transcript instead."); else setAudio(!audio); }}>{audio ? <Volume2 size={17} /> : <VolumeX size={17} />}</button><button className="text-button" aria-expanded={transcript} onClick={() => setTranscript(!transcript)}>Transcript</button></div>{transcript && <p className="transcript">{room.narration}<small>10 seconds per room · Device-generated narration optional · Audio off by default</small></p>}</section>}
        <section className="room-strip" aria-label="Choose a room"><div className="strip-intro"><span className="eyebrow">WALK THROUGH</span><strong>Every room,<br />a new perspective.</strong><span>4 illustrated spaces <ArrowRight size={14} /></span></div><div className="room-thumbnails">{rooms.map((item, index) => <button key={item.id} className={`room-thumb ${roomId === item.id ? "selected" : ""}`} aria-label={`View ${item.name}`} aria-pressed={roomId === item.id} onClick={() => changeRoom(item.id)}><div className="thumb-image"><Scene room={item.id} label={false} /><span>0{index + 1}</span>{roomId === item.id && <span className="viewing"><Eye size={11} /> VIEWING</span>}</div><span className="thumb-name">{item.name}<ArrowUpRight size={13} /></span></button>)}</div></section>
      </>}
      <section className="property-summary"><div className="summary-intro"><span className="eyebrow">AN INVITATION TO IMAGINE</span><h2>More than a place.<br />A way of living.</h2><p>Thoughtful spaces. Natural textures. A home that feels like an exhale.</p></div><div className="property-stats"><div><BedDouble size={22} strokeWidth={1.3} /><strong>4 <span>bedrooms</span></strong></div><div><Bath size={22} strokeWidth={1.3} /><strong>3.5 <span>bathrooms</span></strong></div><div><Square size={21} strokeWidth={1.3} /><strong>3,200 <span>sq ft · concept</span></strong></div><button className="text-button" onClick={() => open("property")}>Explore property details <ArrowUpRight size={15} /></button></div><div className="viewing-cta"><span className="eyebrow">LOVE WHAT YOU SEE?</span><h3>Let’s open the door.</h3><p>Make a local demo viewing request.</p><button className="primary" onClick={() => open("schedule")}>Schedule an in-person tour <ArrowUpRight size={16} /></button><button className="text-button" onClick={() => open("inquiry")}>Or, request more information</button></div></section>
    </main>
    <footer><span className="footer-brand">fieldnote<span>Thoughtfully seen. Personally felt.</span></span><p>Fictional home, price, host & location. Original illustrated artwork; no photography, real 360°, video, or live services.</p><button className="text-button" onClick={() => open("access")}>Accessibility & tour notes <ArrowUpRight size={13} /></button></footer>
    <nav className="mobile-bottom" aria-label="Mobile tour actions"><button onClick={() => open("floorplan")}><Layers size={18} />Rooms</button><button onClick={() => { setGalleryIndex(roomIndex); open("gallery"); }}><Grid2X2 size={18} />Gallery</button><button onClick={() => open("property")}><Info size={18} />Details</button><button className="mobile-book" onClick={() => open("schedule")}><ArrowUpRight size={18} />Book a demo</button></nav>
    <div className="status-toast" role="status" aria-live="polite">{notice && <><span>{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={15} /></button></>}</div>
    <span className="sr-only" aria-live="polite">{room.name} loaded. Original illustration, {room.dimensions} conceptual dimensions.</span>

    <dialog ref={dialog} className={`modal ${modal === "gallery" || modal === "compare" || modal === "video" ? "wide-modal" : ""}`} aria-labelledby="modal-title" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }} onKeyDown={e => {
      if (e.key !== "Tab") return;
      const nodes = [...e.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary,a[href]")].filter(element => element.getClientRects().length > 0);
      if (!nodes.length) return;
      if (e.shiftKey && document.activeElement === nodes[0]) { e.preventDefault(); nodes[nodes.length - 1].focus(); }
      if (!e.shiftKey && document.activeElement === nodes[nodes.length - 1]) { e.preventDefault(); nodes[0].focus(); }
    }}>
      <div className="modal-top"><span className="eyebrow">FIELDNOTE / PRIVATE VIEWING</span><button className="icon-button" aria-label="Close dialog" onClick={close}><X size={21} /></button></div>
      <h2 id="modal-title">{modal ? modalTitles[modal] : ""}</h2>
      {modal === "floorplan" && <><p>Choose a room to move through the illustrated home.</p><Floorplan current={roomId} onSelect={id => { changeRoom(id); close(); }} /></>}
      {(modal === "schedule" || modal === "inquiry") && <RequestForm key={modal} inquiry={modal === "inquiry"} />}
      {modal === "measure" && <Measurement key={roomId} roomId={roomId} />}
      {modal === "property" && <div className="details-content"><div className="property-card"><House size={24} /><div><h3>{property.address}</h3><p>{property.location}</p></div><strong>{property.price}<small>fictional asking price</small></strong></div><p>A contemporary garden home concept with 4 bedrooms, 3.5 bathrooms, and 3,200 illustrative square feet. Four selected spaces are available in this tour; the other rooms are not modeled.</p><h3>Designed around daily life</h3><ul>{property.amenities.map(a => <li key={a}>{a}</li>)}</ul><dl className="property-facts"><div><dt>School district</dt><dd>Mosswood District (fictional). No real school or rating claim.</dd></div><div><dt>Property tax</dt><dd>Not estimated. No financial or tax advice.</dd></div><div><dt>HOA</dt><dd>Not modeled. No verified fee or governing documents.</dd></div><div><dt>Availability</dt><dd>Demo only. Not for sale; no live listing or brokerage.</dd></div><div><dt>Renovation</dt><dd>Concept finishes. HVAC (2023) is a fictional specification.</dd></div></dl><button className="secondary" onClick={() => setModal("compare")}>Open layout comparison <Layers size={15} /></button><button className="primary" onClick={() => setModal("inquiry")}>Ask a question <ArrowRight size={15} /></button></div>}
      {modal === "gallery" && <div className="gallery"><div className="gallery-hero"><Scene room={rooms[galleryIndex].id} /><span className="gallery-label">ORIGINAL VECTOR STUDY · {galleryIndex + 1} / 4</span></div><div className="gallery-heading"><button aria-label="Previous gallery image" onClick={() => setGalleryIndex((galleryIndex + 3) % 4)}><ChevronLeft /></button><h3>{rooms[galleryIndex].name}</h3><button aria-label="Next gallery image" onClick={() => setGalleryIndex((galleryIndex + 1) % 4)}><ChevronRight /></button></div><div className="gallery-thumbs">{rooms.map((r, i) => <button key={r.id} aria-label={`Gallery: ${r.name}`} aria-pressed={galleryIndex === i} className={galleryIndex === i ? "active" : ""} onClick={() => setGalleryIndex(i)}><Scene room={r.id} label={false} /><span>{r.name}</span></button>)}</div><p className="fine">Original scalable illustrations replace high-resolution photos. There is no drone, neighborhood footage, or photographic media in this local demo.</p><button className="secondary" onClick={() => { setMediaPlaying(false); setModal("video"); }}>Watch illustrated sequence <Play size={15} /></button><button className="text-button" onClick={() => setModal("neighborhood")}>Read neighborhood concept <ArrowUpRight size={14} /></button></div>}
      {modal === "video" && <div className="gallery"><div className="gallery-hero"><Scene room={rooms[galleryIndex].id} /><span className="gallery-label">ILLUSTRATED SEQUENCE · NOT VIDEO FOOTAGE</span></div><div className="gallery-heading"><button aria-label="Previous sequence scene" onClick={() => setGalleryIndex((galleryIndex + 3) % 4)}><ChevronLeft /></button><h3>{rooms[galleryIndex].name}</h3><button aria-label="Next sequence scene" onClick={() => setGalleryIndex((galleryIndex + 1) % 4)}><ChevronRight /></button></div><button className="primary" aria-label={mediaPlaying ? "Pause illustrated sequence" : "Play illustrated sequence"} onClick={() => setMediaPlaying(!mediaPlaying)}>{mediaPlaying ? <Pause size={15} /> : <Play size={15} />}{mediaPlaying ? "Pause sequence" : "Play sequence"}</button><p>{rooms[galleryIndex].narration}</p><p className="fine">A local four-scene slideshow, not a recorded walkthrough. No drone or real neighborhood video is available.</p></div>}
      {modal === "share" && <div className="share-content"><p>Share a room in this local demo. Links only work while this app is running and accessible; they are not public listing links.</p><label>Local room link<input readOnly aria-label="Local room link" value={typeof location !== "undefined" ? `${location.origin}/?room=${roomId}` : ""} onFocus={e => e.target.select()} /></label><button className="primary" onClick={() => void share()}><Copy size={15} /> Copy room link</button><h3>Embed preview code</h3><textarea readOnly aria-label="Embed preview code" value={typeof location !== "undefined" ? `<iframe src="${location.origin}/?room=${roomId}" title="Fieldnote illustrated demo tour"></iframe>` : ""} onFocus={e => e.target.select()} /><button className="secondary" onClick={() => void share(true)}>Copy embed code</button><p role="status">{shareResult}</p><FriendDraft roomName={room.name} url={typeof location !== "undefined" ? `${location.origin}/?room=${roomId}` : ""} /><p className="fine">No email is sent. Mobile QR sharing is omitted because a localhost address is not accessible from another device. No external QR service is contacted.</p></div>}
      {modal === "access" && <div className="preferences"><p>Explore your way. All viewer actions have button and keyboard alternatives.</p><label className="check-label"><input type="checkbox" checked={highContrast} onChange={e => setHighContrast(e.target.checked)} /> High contrast interface</label><label className="check-label"><input type="checkbox" checked={reduce} onChange={e => { setReduce(e.target.checked); if (e.target.checked) { setRotate(false); setMediaPlaying(false); } }} /> Reduce motion {systemReduce ? "(system preference also active)" : ""}</label><label className="check-label"><input type="checkbox" checked={ambient} onChange={e => { if ("AudioContext" in window) setAmbient(e.target.checked); else setNotice("Ambient audio is unsupported in this browser."); }} /> Ambient tone (original synthesized sound, off by default)</label><button className="secondary" onClick={() => void enableGyro()} aria-pressed={gyro}><Compass size={16} />{gyro ? "Disable device orientation" : "Try device orientation"}</button><button className="secondary" onClick={() => setModal("vr")}>VR & viewer limitations</button><h3>Keyboard guide</h3><dl className="key-guide"><div><dt>Arrow keys</dt><dd>Pan within the focused viewer</dd></div><div><dt>+ / −</dt><dd>Zoom in / out, from 100% to 180%</dd></div><div><dt>Home</dt><dd>Reset view</dd></div><div><dt>Page Up / Down</dt><dd>Previous / next room</dd></div><div><dt>Escape</dt><dd>Close dialog, hotspot, or full view</dd></div></dl><p className="fine">Touch: drag to pan, pinch to zoom, or swipe horizontally over 110 px at 100% zoom to change room. Buttons offer the same actions. The mini map is hidden on small screens; use Rooms instead. Illustrations are bundled locally: no panorama downloads or bandwidth detection are needed.</p></div>}
      {modal === "vr" && <><p>This is an original, bounded 2D illustrated tour, not a 360° panorama, 3D scan, or real walkthrough. Pan and zoom move the drawing; they do not reveal unseen viewpoints.</p><p>VR headset mode is not available. Device orientation, if supported and permitted, pans the same illustration. No device compatibility is claimed.</p><p>Photos, videos, drone footage, and live maps have been replaced with original vector illustrations, a narrated text sequence, and a fictional neighborhood guide. All plans and measurements are schematic.</p><button className="secondary" onClick={() => setModal("access")}>Back to preferences</button></>}
      {modal === "compare" && <><p>Compare the current room’s staged and empty layout side by side. There is no second real listing or market comparison.</p><label>Compare room<select aria-label="Compare room" value={roomId} onChange={e => changeRoom(e.target.value as RoomId)}>{rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label><div className="split-comparison"><div><Scene room={roomId} /><strong>{room.name} · Staged</strong></div><div><Scene room={roomId} empty /><strong>{room.name} · Empty concept</strong></div></div><p className="fine">Original illustrative adaptations, not before/after renovation photographs.</p></>}
      {modal === "neighborhood" && <><div className="neighborhood-art"><span>JUNIPER LANE</span><House size={60} strokeWidth={1} /><span>GARDEN DISTRICT CONCEPT</span></div><p>Mosswood is an imagined setting for this demo. Picture leafy lanes, a community garden, and a small neighborhood café.</p><p>No real location, travel time, school quality, safety, amenities, or market performance is represented. This is not a map; no mapping provider or external resource is contacted.</p><button className="secondary" onClick={() => setModal("property")}>View fictional property details</button></>}
      {modal === "exit" && <><p>Leave the interactive view and return to the property overview. Your saved preference stays in this browser.</p><div className="form-actions"><button className="primary" onClick={() => { setTourExited(true); setPlaying(false); setRotate(false); setAmbient(false); setGyro(false); setFull(false); close(); }}>Exit to overview <ArrowRight size={16} /></button><button className="secondary" onClick={close}>Keep exploring</button></div></>}
    </dialog>
  </div>;
}
