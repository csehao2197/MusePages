import type { SceneKind } from "./data";
export default function Scene({ kind, label }: { kind: SceneKind; label: string }) {
  const water = kind === "fjord" || kind === "turtle" || kind === "spring";
  const desert = kind === "safari" || kind === "dome";
  return <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${label} — original landscape illustration`} className={`scene scene-${kind}`}>
    <rect width="600" height="400" fill={kind === "cabin" ? "#1e3d48" : desert ? "#e6b87a" : water ? "#97c9c8" : "#93b99a"} />
    <circle cx="465" cy="78" r="40" fill="#fff1bd" opacity=".8" />
    {kind === "cabin" && <path d="M0 90 Q180 -40 310 90 T600 55 L600 100 Q400 190 210 80 T0 145Z" fill="#86efac" opacity=".4" />}
    <path d="M0 235L120 65 235 214 375 80 600 255V400H0Z" fill={desert ? "#ba885f" : "#567e70"} />
    <path d="M0 290Q130 180 280 275T600 235V400H0Z" fill={desert ? "#ce9b62" : "#245b46"} />
    <path d="M0 345Q180 260 330 330T600 295V400H0Z" fill={water ? "#2a8c92" : desert ? "#a97848" : "#133f30"} />
    {water && <><path d="M0 330Q200 285 600 325V400H0Z" fill="#54b0b2" /><path d="M30 351h170m130 20h210M260 336h130" stroke="#c5e5d3" strokeWidth="3" opacity=".65" /></>}
    {["forest", "orangutan", "treehouse", "bamboo"].includes(kind) && <>{[35, 95, 500, 560].map((x, i) => <g key={x}><path d={`M${x} 400L${x + 15} ${60 + i * 16}`} stroke="#233d2b" strokeWidth="16" /><ellipse cx={x} cy={70 + i * 16} rx="85" ry="65" fill={i % 2 ? "#2e6847" : "#417b4e"} /></g>)}</>}
    {kind === "forest" && <><path d="M85 210Q285 315 520 200L520 222Q285 340 85 232Z" fill="#bfad7a" /><path d="M85 175Q285 280 520 165M85 205Q285 310 520 195" fill="none" stroke="#eadfb9" strokeWidth="3" />{[140, 220, 300, 380, 460].map(x => <path key={x} d={`M${x} 215v48`} stroke="#eadfb9" strokeWidth="3" />)}</>}
    {kind === "fjord" && <g transform="translate(250 315)"><path d="M-55 0Q0-23 75 0Q15 23-55 0" fill="#df9e49" /><circle cx="5" cy="-34" r="9" fill="#273c33" /><path d="M5-25v25m-32-28L42 8" stroke="#273c33" strokeWidth="7" /></g>}
    {kind === "orangutan" && <g fill="#b76931" stroke="#854526" strokeWidth="3"><path d="M260 210Q170 135 170 85M330 210Q420 150 415 65" fill="none" stroke="#b76931" strokeWidth="28" /><ellipse cx="295" cy="265" rx="53" ry="72" /><circle cx="295" cy="205" r="43" /><ellipse cx="295" cy="215" rx="29" ry="27" fill="#d3a06c" /><circle cx="283" cy="207" r="3" fill="#25382c" /><circle cx="307" cy="207" r="3" fill="#25382c" /></g>}
    {kind === "spring" && <><ellipse cx="300" cy="336" rx="180" ry="44" fill="#a7e6de" />{[230, 300, 370].map(x => <path key={x} d={`M${x} 320q-25-30 0-60t0-70`} stroke="#effaf0" opacity=".6" strokeWidth="14" fill="none" />)}</>}
    {kind === "safari" && <><path d="M110 325V215m-80 5q80-90 170 0Z" fill="#3c4c35" stroke="#3c4c35" strokeWidth="10" /><g fill="#666858"><ellipse cx="380" cy="310" rx="65" ry="42" /><circle cx="438" cy="294" r="32" /><ellipse cx="419" cy="294" rx="26" ry="33" fill="#818170" /><path d="M453 302v62q0 20-20 5v-13h7v-51M335 323v59h18v-55m45 0v55h18v-55" /></g></>}
    {kind === "turtle" && <g transform="translate(300 270) rotate(-18)" fill="#ced99c"><ellipse rx="71" ry="49" fill="#456c54" stroke="#d3dba4" strokeWidth="5" /><path d="M-40-32q-90-85-50 5M40-32q75-75 48 10M-45 25q-55 55-6 26M43 27q66 50 18 26" /><ellipse cx="88" rx="25" ry="20" /><path d="M-45 0h90M0-42v84m-40-65L40 25m-80 0L40-25" stroke="#8fac79" fill="none" strokeWidth="3" /><circle cx="100" cy="-6" r="3" fill="#173e35" /></g>}
    {["treehouse", "cabin", "bamboo"].includes(kind) && <g><path d="M185 315V195h230v120Z" fill="#c5af7c" /><path d="M160 200l135-100 145 100Z" fill={kind === "cabin" ? "#abd4d0" : "#4b5139"} /><path d="M205 215h70v80h-70Zm95 0h90v80h-90Z" fill="#386262" stroke="#e5d5a3" strokeWidth="5" /><path d="M200 315v85m190-85v85M165 330h270" stroke="#9d8050" strokeWidth="12" /></g>}
    {kind === "dome" && <><path d="M175 355a125 125 0 0 1 250 0Z" fill="#f1ddbd" stroke="#c5aa86" strokeWidth="3" /><path d="M175 355l65-85 60 85 60-85 65 85m-185-85h120l-60-40Z" fill="none" stroke="#b6a386" strokeWidth="3" /><path d="M275 355v-45a25 25 0 0 1 50 0v45Z" fill="#3c5553" /></>}
    <path d="M0 0h600v400H0z" fill="none" stroke="#ffffff" strokeOpacity=".1" strokeWidth="12" />
  </svg>;
}
