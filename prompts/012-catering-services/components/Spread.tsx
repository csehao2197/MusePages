export default function Spread({ color = "#72816b", variant = 0, label = "Original illustration of an elegantly plated catering table" }: { color?: string; variant?: number; label?: string }) {
  return <svg viewBox="0 0 1000 650" role="img" aria-label={label} className="spread">
    <defs>
      <linearGradient id={`table${variant}`} x2="1" y2="1"><stop stopColor={color}/><stop offset="1" stopColor="#272b25"/></linearGradient>
      <radialGradient id={`plate${variant}`}><stop stopColor="#fff9eb"/><stop offset=".82" stopColor="#eee3ce"/><stop offset="1" stopColor="#bca884"/></radialGradient>
      <filter id={`shadow${variant}`}><feDropShadow dx="4" dy="12" stdDeviation="9" floodOpacity=".3"/></filter>
    </defs>
    <rect width="1000" height="650" fill={`url(#table${variant})`}/>
    <path d="M680 -40 L880 -40 510 700 310 700Z" fill="#ded3bd" opacity=".9"/>
    <g filter={`url(#shadow${variant})`}>
      <ellipse cx="565" cy="342" rx="256" ry="188" fill={`url(#plate${variant})`} transform="rotate(-19 565 342)"/>
      <ellipse cx="565" cy="342" rx="211" ry="147" fill="none" stroke="#c9a84c" strokeWidth="2" transform="rotate(-19 565 342)"/>
      {variant < 6 && variant % 3 === 0 ? <g>{[0,1,2,3,4,5].map(i => <g key={i} transform={`translate(${470+(i%3)*65} ${290+Math.floor(i/3)*64})`}><rect x="-22" y="-17" width="45" height="38" rx="9" fill="#c89457"/><circle r="15" fill="#f2e0b8"/><ellipse cy="-7" rx="16" ry="6" fill="#596c40"/><circle cx="6" cy="2" r="6" fill="#b34536"/></g>)}</g> : variant < 6 && variant % 3 === 2 ? <g><ellipse cx="556" cy="330" rx="116" ry="65" fill="#809155"/>{[0,1,2,3,4,5,6,7].map(i => <g key={i} transform={`translate(${555+Math.cos(i)*75} ${325+Math.sin(i)*38})`}><circle r="20" fill={i%2 ? "#eee3c2" : "#b55537"}/><ellipse cy="-12" rx="18" ry="7" fill="#3c5b3c"/></g>)}</g> : <><path d="M432 289 Q490 235 622 273 L694 331 Q615 407 461 367Z" fill="#b56b3c"/><path d="M447 306 L644 293 M461 331 L666 319 M482 355 L638 343" stroke="#f0b579" strokeWidth="9" opacity=".7"/></>}
      {[0,1,2,3,4,5].map(i => <g key={i} transform={`translate(${415+i*45} ${390+Math.sin(i)*27}) rotate(${i*32})`}><ellipse rx="29" ry="12" fill="#52704b"/><ellipse cx="12" cy="-10" rx="22" ry="9" fill="#899d56"/></g>)}
      <circle cx="660" cy="247" r="31" fill="#ead48a"/><circle cx="660" cy="247" r="23" fill="#f8e9a5"/><path d="M660 224V270 M637 247H683" stroke="#fff6d7" strokeWidth="3"/>
      <circle cx="147" cy="157" r="112" fill={`url(#plate${variant})`}/>
      {[0,1,2,3,4,5,6].map(i => <g key={i} transform={`translate(${125+Math.cos(i)*50} ${157+Math.sin(i)*50})`}><ellipse rx="33" ry="19" fill="#5e7842" transform={`rotate(${i*35})`}/><circle cx="6" cy="3" r="13" fill="#be5c3e"/><circle cx="-9" cy="-8" r="10" fill="#ede2bb"/></g>)}
      <ellipse cx="874" cy="527" rx="140" ry="95" fill={`url(#plate${variant})`}/>
      {[0,1,2].map(i => <path key={i} d={`M${778+i*57} 521 q20 -85 43 -12 l-4 55 h-41Z`} fill="#b58248" stroke="#ddb47e" strokeWidth="5"/>)}
    </g>
    <g stroke="#d3b86c" fill="none" strokeWidth="6"><path d="M248 322L156 582 M266 328L174 588 M274 304L252 367 M256 298L234 361 M238 292L216 355"/><path d="M779 110L724 243 Q712 269 702 246L742 105Z"/></g>
    <g fill="none" stroke="#eddabd"><ellipse cx="899" cy="119" rx="49" ry="60" strokeWidth="4"/><path d="M899 179V260 M866 260H932" strokeWidth="5"/><ellipse cx="899" cy="131" rx="38" ry="35" fill="#ae8149" opacity=".6"/></g>
    <g fill="#82936c"><path d="M15 510Q140 430 280 650Q85 641 15 510Z"/><path d="M915 0Q805 87 989 241Q1020 98 915 0Z"/></g>
    {variant < 6 && <g>
      {(variant === 1 || variant === 4) && <g>{[0,1,2,3,4].map(i => <g key={i} transform={`translate(${320+i*70} ${75+Math.sin(i)*20})`}><ellipse rx="43" ry="12" fill="#84906a" transform={`rotate(${i*25})`}/><circle r="20" fill={variant===1 ? "#ebcebd" : "#e9cf82"}/><circle cx="10" cy="-8" r="15" fill="#fff1d6"/><circle r="7" fill="#b6974c"/></g>)}<rect x="70" y="375" width="42" height="85" rx="7" fill="#ead9b5"/><path d="M91 366q-14-28 0-41q14 19 0 41Z" fill="#f2c06c"/></g>}
      {(variant === 0 || variant === 3) && <g transform={variant===3 ? "translate(70 0)" : ""}><rect x="265" y="69" width="170" height="95" rx="6" fill="#fff4dc" transform="rotate(-12 265 69)"/><text x="279" y="97" fontSize="15" fill="#71633e" transform="rotate(-12 265 69)">A PLACE FOR IDEAS</text><path d="M281 110L398 86 M284 123L365 106" stroke="#c9a84c" strokeWidth="3"/></g>}
      {(variant === 2 || variant === 5) && <g><path d="M0 45Q500 195 1000 45" fill="none" stroke="#d2bb7b" strokeWidth="3"/>{[0,1,2,3,4,5,6,7].map(i => <circle key={i} cx={80+i*120} cy={55+Math.sin((80+i*120)/1000*Math.PI)*74} r="9" fill={variant===2 ? "#edd9a5" : "#d1a57d"}/>)}<path d="M750 385l-25 45 40 5Z M285 470l40 10 -16 27Z" fill="#d2ac61"/></g>}
    </g>}
    <text x="28" y="622" fill="#fff8f0" opacity=".7" fontSize="13" letterSpacing="3">SAVORY AFFAIRS · ORIGINAL TABLE STUDY {variant+1}</text>
  </svg>;
}
