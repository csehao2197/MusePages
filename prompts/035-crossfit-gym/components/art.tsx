export function GymArt({ variant = "class", label = "Original illustration of a gym training space" }: { variant?: string; label?: string }) {
  return <svg className={`gym-art art-${variant}`} viewBox="0 0 600 400" role="img" aria-label={label}>
    <rect width="600" height="400" fill="#1e293b" />
    <path d="M0 0H600V210L0 300Z" fill="#27384a" />
    <path d="M80 0V245M225 0V224M380 0V205M535 0V180" stroke="#738089" strokeWidth="4" opacity=".35" />
    <path d="M0 320L600 230M0 390L600 290M120 400L600 345" stroke="#4c5865" strokeWidth="2" />
    <path d="M30 72H570M60 35V295M535 35V235" stroke="#0b1420" strokeWidth="16" />
    <path d="M28 76H572" stroke="#ef4444" strokeWidth="4" />
    <path d="M295 85V150M365 85V150" stroke="#d2d7d7" strokeWidth="3" />
    <circle cx="295" cy="163" r="14" fill="none" stroke="#d2d7d7" strokeWidth="5" /><circle cx="365" cy="163" r="14" fill="none" stroke="#d2d7d7" strokeWidth="5" />
    {variant !== "open" && <g>
      <circle cx="233" cy="150" r="22" fill="#c99775" />
      <path d="M212 179L251 179L268 246L219 254Z" fill="#ef4444" />
      <path d="M219 244L207 319M253 242L284 314" stroke="#101c2a" strokeWidth="23" strokeLinecap="round" />
      <path d="M217 190L178 213L146 197M250 189L287 215L322 196" fill="none" stroke="#c99775" strokeWidth="13" strokeLinecap="round" />
      <path d="M185 328H217M278 325H309" stroke="#e3e7e9" strokeWidth="12" strokeLinecap="round" />
      <path d="M124 194H350" stroke="#cbd5e1" strokeWidth="5" />
      <path d="M139 173V217M151 165V224M323 165V224M335 173V217" stroke="#0a121e" strokeWidth="13" />
    </g>}
    <path d="M400 255L461 237L502 260L441 280Z" fill="#c49561" /><path d="M400 255V317L441 344V280Z" fill="#8a633e" /><path d="M441 280L502 260V319L441 344Z" fill="#ac7b4b" />
    <path d="M39 329H151M55 300V356M71 295V361M119 295V361M135 300V356" stroke="#0a121e" strokeWidth="12" />
    <path d="M0 400L600 400" stroke="#ef4444" strokeWidth="10" />
    <text x="440" y="117" fill="#dbe0e4" fontFamily="Impact, sans-serif" fontSize="33" transform="rotate(-5 440 117)">IRON</text>
    <text x="447" y="150" fill="#ef4444" fontFamily="Impact, sans-serif" fontSize="33" transform="rotate(-5 447 150)">TIDE</text>
    {variant === "foundations" && <g><circle cx="367" cy="217" r="17" fill="#b77b5b" /><path d="M351 242H380L392 291H345Z" fill="#f1f5f9" /><path d="M355 289L349 350M380 287L399 347" stroke="#0b1520" strokeWidth="17" /><path d="M353 251L320 237" stroke="#b77b5b" strokeWidth="10" /></g>}
  </svg>;
}

export function Portrait({ color, index }: { color: string; index: number }) {
  return <svg viewBox="0 0 180 180" className="portrait" role="img" aria-label="Original fictional coach portrait illustration">
    <rect width="180" height="180" fill={index % 2 ? "#eaded2" : "#cdd8db"} />
    <path d="M0 140L180 10M0 175L180 45" stroke="#ef4444" strokeWidth="10" opacity=".25" />
    <path d="M28 180Q27 115 90 112Q157 113 154 180" fill="#172636" />
    <path d="M70 111V127Q90 144 110 127V111" fill={color} />
    <ellipse cx="90" cy="76" rx="35" ry="44" fill={color} />
    <path d={index % 2 ? "M52 80Q38 16 91 17Q144 16 126 97L116 43Q81 60 62 43Z" : "M55 70Q44 22 89 24Q135 22 126 68L116 45H64Z"} fill="#17212a" />
    <path d="M70 77H79M102 77H111" stroke="#17212a" strokeWidth="4" strokeLinecap="round" />
    <path d="M80 100Q90 107 101 99" stroke="#773e33" strokeWidth="3" fill="none" />
    <path d="M64 167H118" stroke="#ef4444" strokeWidth="6" />
  </svg>;
}
