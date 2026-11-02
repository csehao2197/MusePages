export function Portrait({ index, color, name, decorative = false }: { index: number; color: string; name: string; decorative?: boolean }) {
  const skin = ["#a85e3e", "#d5966b", "#f0bc91", "#754732", "#c08057"][index % 5];
  const hair = ["#30231e", "#45362c", "#8d4932", "#292b29"][index % 4];
  return <svg viewBox="0 0 240 250" role={decorative ? undefined : "img"} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : `Original illustrated portrait of fictional ${name}`}>
    <path fill={color} d="M0 0h240v250H0z" />
    <circle cx={index % 2 ? 200 : 32} cy="45" r="52" fill="#fff" opacity=".2" />
    <path d="M25 250q6-77 95-77t95 77" fill={["#595e3c", "#6a4987", "#d65e38", "#394f60"][index % 4]} />
    <path d="M101 163v27q19 17 38 0v-27" fill={skin} />
    <ellipse cx="120" cy="111" rx="57" ry="70" fill={hair} />
    {index % 3 === 0 && <path d="M63 101q-25 39-12 94h136q10-70-17-96" fill={hair} />}
    <ellipse cx="120" cy="119" rx="43" ry="56" fill={skin} />
    <circle cx="77" cy="122" r="9" fill={skin} /><circle cx="163" cy="122" r="9" fill={skin} />
    <path d={index % 2 ? "M76 104Q65 39 125 43q57 0 43 66-29-3-49-33-10 23-43 28" : "M74 98Q65 44 119 42q58 3 48 62-52-39-93-6"} fill={hair} />
    <path d="M96 115h6m35 0h6" stroke="#30231e" strokeWidth="4" strokeLinecap="round" />
    <path d="m122 122-4 14h7" fill="none" stroke="#674333" strokeWidth="2" />
    <path d="M106 149q14 12 28-1" fill="#fff7eb" stroke="#674333" strokeWidth="2" strokeLinecap="round" />
    {index % 4 === 1 && <g stroke="#30231e" strokeWidth="3" fill="none"><rect x="85" y="106" width="27" height="22" rx="7" /><rect x="129" y="106" width="27" height="22" rx="7" /><path d="M112 114h17" /></g>}
    {index % 4 === 2 && <g fill="#e7ba49"><circle cx="75" cy="138" r="5" /><circle cx="165" cy="138" r="5" /></g>}
    <path d="m92 192 28 26 29-26" fill="none" stroke="#fff" opacity=".4" strokeWidth="3" />
  </svg>;
}
export function Scene({ kind, label }: { kind: string; label: string }) {
  const outdoor = kind === "retreat" || kind === "group";
  return <svg viewBox="0 0 900 390" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${label}. Original fictional studio illustration, not a photograph.`}>
    <path fill={outdoor ? "#d9dfc5" : "#edd2b0"} d="M0 0h900v390H0z" />
    {outdoor ? <><circle cx="728" cy="78" r="46" fill="#fff3ca" /><path d="M0 220 140 70l153 160L479 60l213 170L815 130l85 92v168H0" fill="#98ad8f" /><path d="m0 275 260-93 222 94 230-99 188 85v128H0" fill="#69876a" /></> : <><path d="M55 35h220v170H55z" fill="#fdf4d7" /><path d="M165 35v170M55 120h220" stroke="#b09b7e" strokeWidth="6" /><path d="M620 40h220v150H620z" fill={kind === "workshop" ? "#fbf5e5" : "#b6c1a8"} /><path d="m650 70 35 15m30-10 45 30m-110 35 70-12m35 17 42-38" stroke="#d39164" strokeWidth="12" /><path d="M0 300h900v90H0z" fill="#be9a77" /></>}
    {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => <g key={n} transform={`translate(${48 + n * 103},${n % 2 ? 120 : 150}) rotate(${n % 2 ? 5 : -5} 40 100)`}>
      <path d="M-5 235v-70q0-60 45-60t45 60v70" fill={["#cf683f", "#ead59b", "#6b6589", "#345d54"][n % 4]} />
      <ellipse cx="40" cy="71" rx="32" ry="40" fill={["#b56e47", "#efb78e", "#865239"][n % 3]} />
      <path d="M8 65q-8-50 32-48t33 50L48 39Z" fill="#392f29" />
      <path d="M26 70h4m21 0h4m-23 18q10 10 20-1" stroke="#3b2e26" fill="none" strokeWidth="3" strokeLinecap="round" />
      <path d="m0 145-18 50m95-49 14 49" stroke={["#b56e47", "#efb78e", "#865239"][n % 3]} strokeWidth="15" strokeLinecap="round" />
    </g>)}
    {kind === "dinner" && <><path d="M0 310h900v80H0z" fill="#875c42" />{[90, 250, 410, 570, 730].map(x => <ellipse key={x} cx={x} cy="327" rx="45" ry="12" fill="#f4e8cf" />)}</>}
    {kind === "group" && <><path d="m32 40 70 16-12 54-70-16z" fill="#f8e696" /><text x="35" y="74" fontSize="18" fill="#534933" transform="rotate(12 35 74)">hello!</text></>}
  </svg>;
}
