"use client";
import { useState } from "react";
import { Plane, ChevronDown, Wifi, Utensils, MonitorPlay, Plug, Check, Armchair, Luggage, Clock3 } from "lucide-react";
import { airlines, fareTypes, farePrice, durationText, timeText, dateText, type Flight, type Search } from "./flights";

export default function FlightCard({ flight: f, search: s, money, onSelect, badge }: { flight: Flight; search: Search; money: (value: number) => string; onSelect: (f: Flight, fare: number) => void; badge?: string }) {
  const [expanded, setExpanded] = useState(false);
  const airline = airlines[f.airline];
  const price = farePrice(f, s);
  const returnFrom = s.to;
  const returnTo = s.trip === "Multi-City" ? s.onward : s.from;
  const flightNumber = `${airline.code} ${f.id === 1 ? "9" : 100 + f.id}`;
  const leg = (returnLeg = false) => <div className="flight-leg">
    <span className="leg-label">{returnLeg ? s.trip === "Multi-City" ? "ONWARD" : "RETURN" : "OUTBOUND"} · {dateText(returnLeg ? s.returnDate : s.depart)}</span>
    <div className="leg-line"><div><strong>{timeText(returnLeg ? 1050 : f.departure)}</strong><span>{returnLeg ? returnFrom : s.from}</span></div><div className="route-line"><span>{durationText(returnLeg ? f.returnDuration : f.duration)}</span><div className="airline-line"><Plane size={14} /></div><small className={f.stops ? "" : "green"}>{f.stops ? `${f.stops} stop${f.stops > 1 ? "s" : ""} · ${f.via}${f.stops > 1 ? " + SFO" : ""}` : "Nonstop"}</small></div><div><strong>{timeText(returnLeg ? 975 : f.arrival)}{!returnLeg && <sup>+1</sup>}</strong><span>{returnLeg ? returnTo : s.to}</span></div></div>
    <span className="aircraft">Boeing {f.stops ? "787-9" : "777-300ER"} · {s.cabin}</span>
  </div>;
  return <article className={`flight-card ${badge === "Best Value" ? "featured" : ""}`} aria-label={`${airline.name} flight ${flightNumber}`} data-testid={`flight-${f.id}`} data-price={price} data-duration={f.duration} data-departure={f.departure}>
    {badge && <span className={`badge ${badge === "Cheapest" ? "cheap" : badge === "Fastest" ? "fast" : "value"}`}>{badge === "Best Value" && <span>✦ </span>}{badge}</span>}
    <div className="card-main"><div className="airline-info"><span className="airline-logo" style={{ "--airline": airline.color } as React.CSSProperties}>{airline.code}</span><div><strong>{airline.name}</strong><small>{flightNumber}</small></div></div>
      <div className="itinerary">{leg()}{s.trip !== "One Way" && leg(true)}</div>
      <div className="price-block"><strong>{money(price)}</strong><small>/ person</small><span>{money(price * s.adults)} total</span><button className="primary" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls={`details-${f.id}`}>Select <ChevronDown size={16} /></button><span className="green tiny">{f.seats} demo seats left</span></div>
    </div>
    <div className="card-bottom"><span><Luggage size={14} /> Personal item included <span className="dot">·</span> <span className="timezone">Times in airport local time{!f.stops && " · Tokyo JST / New York EDT"}</span></span><button className="text-button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls={`details-${f.id}`}>{expanded ? "Hide flight details" : "Flight details"}<ChevronDown size={14} className={expanded ? "rotated" : ""} /></button></div>
    {expanded && <div className="expanded" id={`details-${f.id}`}>
      <h3>Your itinerary, in detail</h3><p className="muted small">Illustrative gates, aircraft and amenities — not airline-verified. Each time is local to the listed airport.</p>
      {Array.from({ length: s.trip === "One Way" ? 1 : 2 }, (_, i) => <div className="timeline" key={i}><strong>{i === 0 ? "Outbound" : s.trip === "Multi-City" ? "Onward" : "Return"} · {dateText(i ? s.returnDate : s.depart)}</strong>
        <div className="timeline-event"><span className="timeline-dot" /><div><strong>{timeText(i ? 1050 : f.departure)} · {i ? returnFrom : s.from}</strong><p>Terminal {i ? "1" : "7"} · Gate {i ? "34" : "B22"} · {flightNumber}{i ? " (return leg)" : ""}</p><p>Boeing {f.stops ? "787-9" : "777-300ER"} · Aircraft age: {f.stops ? "5" : "8"} years (mock)</p></div></div>
        {!!f.stops && <><div className="timeline-event"><span className="timeline-dot" /><div><strong>{timeText((f.departure + 330) % 1440)} · {f.via} connection</strong><p>First segment: {i ? returnFrom : s.from} → {f.via} · 5h 30m · {airline.code} {200 + f.id}</p><div className="layover"><Clock3 size={16} /> {f.via === "ICN" ? "Seoul Incheon" : f.via === "LAX" ? "Los Angeles" : f.via === "ORD" ? "Chicago" : "San Francisco"} · 2h 10m layover · Terminal change T1 → T2</div></div></div>
          {f.stops > 1 && <div className="timeline-event"><span className="timeline-dot" /><div><strong>Second connection · SFO</strong><p>{f.via} → SFO · 3h 05m · {airline.code} {300 + f.id}</p><div className="layover">San Francisco · 1h 20m layover · Same terminal</div></div></div>}
          <div className="timeline-event"><span className="timeline-dot" /><div><strong>Final segment · {f.stops > 1 ? "SFO" : f.via} → {i ? returnTo : s.to}</strong><p>{airline.code} {400 + f.id} · Remaining airtime {durationText(Math.max(90, (i ? f.returnDuration : f.duration) - (f.stops > 1 ? 725 : 460)))}</p></div></div>
        </>}
        <div className="timeline-event"><span className="timeline-dot" /><div><strong>{timeText(i ? 975 : f.arrival)}{!i && " (+1 day)"} · {i ? returnTo : s.to}</strong><p>Terminal {i ? "7" : "1"} · Gate {i ? "B18" : "44"}</p></div></div>
      </div>)}
      <div className="amenities"><span><Wifi size={17} /> WiFi</span><span><Utensils size={17} /> Meal service</span><span><MonitorPlay size={17} /> Entertainment</span><span><Plug size={17} /> Power outlet</span><span><Armchair size={17} /> 31″ pitch · 17.2″ width</span></div>
      <h3>Find your perfect fare</h3><p className="muted small">Prices per adult, for this itinerary. All taxes included. Base search cabin: {s.cabin}; Premium adds the illustrated upgraded seat benefits.</p>
      <div className="fare-grid">{fareTypes.map((fare, i) => <section className={`fare-option ${i === 1 ? "recommended" : ""}`} key={fare.name}>{i === 1 && <span className="fare-recommendation">A LITTLE MORE FLEXIBILITY</span>}<h4>{fare.name}</h4><strong>{money(price + fare.extra)}<small> / person</small></strong><ul><li><Armchair size={16} />{fare.seat}</li><li><Luggage size={16} />{fare.baggage}</li><li><Check size={16} />{fare.changes}</li>{i === 2 && <li><Check size={16} />Priority boarding · 38″ seat pitch</li>}</ul><p className="small muted">{money((price + fare.extra) * s.adults)} total for {s.adults} adults</p><button className={i === 1 ? "primary" : "outline"} onClick={() => onSelect(f, i)}>Select {fare.name} fare</button></section>)}</div>
      <p className="small muted">Baggage weights are per traveler, per leg. Basic has no carry-on or checked bag. Demo fare conditions do not represent an airline’s actual policy.</p>
    </div>}
  </article>;
}
