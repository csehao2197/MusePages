type Props = { kind?: "bread" | "croissant" | "coffee" | "sandwich" | "cake" | "kitchen" | "interior" | "patio" | "box" | "torn" | "pour" | "display" | "rack" | "platter"; className?: string; label?: string };
export default function BakeryArt({ kind = "croissant", className = "", label }: Props) {
  return <svg className={`bakery-art ${className}`} viewBox="0 0 600 440" role="img" aria-label={label || `Original illustration of ${kind}`}>
    <defs>
      <radialGradient id={`bg-${kind}`}><stop stopColor="#f7e6bd"/><stop offset="1" stopColor="#ddbd8e"/></radialGradient>
      <linearGradient id={`crust-${kind}`} x2=".3" y2="1"><stop stopColor="#efba62"/><stop offset=".5" stopColor="#cf792e"/><stop offset="1" stopColor="#8d451e"/></linearGradient>
      <pattern id={`grain-${kind}`} width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="4" cy="8" r=".8" fill="#623d24" opacity=".14"/><circle cx="24" cy="25" r="1" fill="#fff" opacity=".45"/></pattern>
    </defs>
    <path fill={`url(#bg-${kind})`} d="M0 0h600v440H0z"/>
    <path d="M0 295 600 245v195H0z" fill="#c8a078"/>
    <path d="m0 340 600-48M0 405l600-50" stroke="#b18a66" strokeWidth="2"/>
    <ellipse cx="310" cy="337" rx="205" ry="38" fill="#66462e" opacity=".18"/>
    {kind === "rack" || kind === "display" || kind === "platter" ? <g>
      {kind === "rack" ? <><path d="M58 205h484v151H58z" fill="#69675a"/>{Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${70+i*38} 205v151`} stroke="#c8c5af" strokeWidth="3"/>)}{[225,250,275,300,325,350].map(y => <path key={y} d={`M58 ${y}h484`} stroke="#c8c5af" strokeWidth="3"/>)}</>
        : kind === "display" ? <><path d="M40 98h520v261H40z" fill="#6f6555"/><path d="M51 109h498v237H51z" fill="#ead8b5"/><path d="M51 229h498" stroke="#7b6b53" strokeWidth="8"/><path d="m70 118 70 219m80-219 70 219m80-219 70 219" stroke="#fff5dc" strokeWidth="12" opacity=".4"/></>
        : <><path d="M53 292q0-19 25-24l430-15q40 0 43 27v77q-3 18-38 19H77q-24-2-24-21z" fill="#9f7146"/><path d="M72 293h456m-456 24h456m-456 25h456" stroke="#b38a5b" strokeWidth="3"/></>}
      {[130,300,470].map((x,i) => <g key={x}>
        <path d={`M${x-61} 218q-16-59 31-83 48-23 81 12 22 28 8 65-23 24-120 6Z`} fill={`url(#crust-${kind})`} stroke="#a46933" strokeWidth="3"/>
        <path d={`m${x-24} 152 9 48m26-48 9 48`} stroke="#f4d79a" strokeWidth="9" strokeLinecap="round"/>
        {kind !== "rack" && <><path d={`M${x-52} 316v-36q52-40 103 0v36Z`} fill={i === 1 ? "#b87156" : "#d2a25c"}/><path d={`M${x-52} 279q52-38 103 0`} fill="none" stroke={i === 1 ? "#edc5a8" : "#f4dfa9"} strokeWidth="13"/><circle cx={x} cy="262" r="9" fill="#b74938"/></>}
      </g>)}
      {kind === "display" && <><path d="M40 98h520M40 357h520M40 98v259m520-259v259" stroke="#695944" strokeWidth="10"/><path d="M300 98v259" stroke="#b4a68a" strokeWidth="4"/></>}
    </g> : kind === "bread" || kind === "box" ? <g>
      {kind === "box" && <><path d="m70 233 230-83 231 86-57 162H117z" fill="#a87946"/><path d="m70 233 57-63 190 60-38 48zm247-3 174-63 40 69-220 42" fill="#d9b888"/></>}
      <path d="M125 302c-33-69 10-161 107-188 112-32 228 26 239 116 13 111-70 124-183 119-79-4-137-13-163-47Z" fill={`url(#crust-${kind})`} stroke="#9c5429" strokeWidth="3"/>
      <path d="m208 160 25 144m45-165 27 164m39-148 26 135" stroke="#f9deb0" strokeWidth="17" strokeLinecap="round"/>
      <path d="m212 156 27 147m46-165 26 164m39-150 26 135" stroke="#a5622f" strokeWidth="5"/>
      {Array.from({length: 22}, (_, i) => <circle key={i} cx={170 + (i * 43) % 260} cy={190 + (i * 31) % 114} r="2" fill="#ffeac8" opacity=".8"/>)}
    </g> : kind === "coffee" || kind === "pour" ? <g>
      <path d="M397 174c123-27 127 137-9 125" fill="none" stroke="#6a6f5a" strokeWidth="25"/>
      <path d="M171 165h240l-23 134c-13 72-176 75-195 2z" fill="#7f8970"/>
      <ellipse cx="291" cy="165" rx="120" ry="47" fill="#e9e1c8"/>
      <ellipse cx="291" cy="165" rx="101" ry="34" fill="#a2683c"/>
      <path d="M291 184c-109-39-48-59 0-17 48-42 109-22 0 17m0-9c-76-30-33-45 0-15 34-30 76-15 0 15m0-12c-46-20-20-29 0-10 20-19 46-10 0 10" fill="#fff0cc"/>
      {kind === "pour" ? <><path d="m310 28 106-3-30 82-49-6z" fill="#bbc0b2"/><path d="m415 28 37 8-24 45-34-6" fill="none" stroke="#a3aa9c" strokeWidth="13"/><path d="m341 102-44 62" stroke="#fff0cc" strokeWidth="7"/><path d="M472 0q-24 8-34 33l-23 36q-18 19-24 1 3-20 14-36L419 0" fill="#c9966f"/></> : <path d="M252 100q-25-28 0-56m50 56q-25-28 0-56" fill="none" stroke="#fff3da" strokeWidth="5" opacity=".6"/>}
      <path d="m444 337 70-23" stroke="#e0d8bf" strokeWidth="9" strokeLinecap="round"/>
    </g> : kind === "kitchen" ? <g>
      <path d="M0 0h600v205H0z" fill="#7d866b"/><path d="M49 31h153v125H49zM400 31h150v125H400z" fill="#eadbb6"/>
      {[215, 365].map((x, i) => <g key={x}><path d={`M${x-71} 335v-130q71-65 142 0v130`} fill={i ? "#d3ae77" : "#eee1c5"}/><path d={`M${x-45} 214h90v117h-90z`} fill="#8e5738"/><ellipse cx={x} cy="146" rx="43" ry="53" fill={i ? "#a96e45" : "#e3b187"}/><path d={`M${x-44} 145q-15-95 58-64 38 10 27 55l-12-32q-55 24-73 41`} fill="#51392a"/><path d={`M${x-12} 165q12 12 24 0`} fill="none" stroke="#704127" strokeWidth="3"/><path d={`m${x-17} 126 1 1m32-1 1 1`} stroke="#473122" strokeWidth="5" strokeLinecap="round"/></g>)}
      <path d="M60 336h480v28H60z" fill="#ead6ae"/><ellipse cx="300" cy="339" rx="70" ry="20" fill="#b77935"/>
    </g> : kind === "interior" || kind === "patio" ? <g>
      <path d="M0 0h600v285H0z" fill={kind === "patio" ? "#9eab88" : "#b77f5f"}/>
      {[70, 240, 410].map(x => <g key={x}><path d={`M${x} 45h120v175H${x}z`} fill="#f1d9a5"/><path d={`M${x+60} 45v175m-60-86h120`} stroke="#684c35" strokeWidth="7"/><path d={`M${x+60} 0v62`} stroke="#473524" strokeWidth="3"/><circle cx={x+60} cy="69" r="12" fill="#ffecad"/></g>)}
      {[160, 400].map(x => <g key={x}><ellipse cx={x} cy="290" rx="90" ry="25" fill="#795839"/><path d={`m${x-60} 292-20 110m140-110 20 110`} stroke="#654b33" strokeWidth="10"/><path d={`M${x-110} 262v94h50m170-94v94h-50`} stroke="#795e44" strokeWidth="9" fill="none"/></g>)}
      <path d="M490 330h68l-9 79h-48z" fill="#a46a40"/><path d="m524 339-20-92m20 80 25-92m-25 70-40-45" stroke="#607c45" strokeWidth="7"/>
      {[ [504,247], [549,235], [484,260] ].map(([x,y]) => <circle key={x} cx={x} cy={y} r="14" fill="#f0d799"/>)}
    </g> : kind === "cake" ? <g><path d="M156 214h295v119H156z" fill="#d1a069"/><path d="M156 214h295v29H156z" fill="#fff0cb"/><ellipse cx="303" cy="215" rx="147" ry="42" fill="#f6e3b8"/><path d="m278 209 40-41 18 43" fill="#e9c951"/><path d="M135 337h337" stroke="#f4e9d2" strokeWidth="15" strokeLinecap="round"/></g> : <g>
      <path d="M105 303c-40-29 6-111 83-153 56-68 172-56 219 1 88 43 133 122 83 151-54 34-84-58-114-75-54-32-107-30-154 2-38 25-62 104-117 74Z" fill={`url(#crust-${kind})`} stroke="#a25a29" strokeWidth="4"/>
      <path d="m173 168 43 77m30-117 29 84m55-88-4 84m69-55-37 80m88-51-45 70" stroke="#f5cc83" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <path d="m181 169 39 73m31-110 24 74m60-73-4 72m68-46-35 70" stroke="#b2672c" strokeWidth="3" fill="none"/>
      {kind === "sandwich" ? <path d="M155 280q136-70 290 0" stroke="#789052" strokeWidth="16" fill="none"/> : <>{[210,258,310,350,389].map((x,i) => <ellipse key={x} cx={x} cy={151 + i%2*18} rx="12" ry="5" transform={`rotate(-25 ${x} 155)`} fill="#f5e5b9"/>)}</>}
      {kind === "torn" && <><path d="m298 114-17 20 14 18-16 24 18 24-18 29 21 13 10-32-10-24 14-24-12-22 9-22z" fill="#ddbd8e"/><path d="m278 138-7 18 10 22-8 22 7 18m35-78 10 18-9 22 8 22-11 24" stroke="#f9e4b7" strokeWidth="8" fill="none"/><path d="m121 246-53 7-36 87h64l53-52m328-42 54 7 37 87h-64l-53-52" fill="#d4a77e"/><path d="m127 257-34 23m380-23 34 23" stroke="#a8714e" strokeWidth="3"/></>}
    </g>}
    <path fill={`url(#grain-${kind})`} d="M0 0h600v440H0z"/>
    <g fill="#fff4de" opacity=".7"><circle cx="90" cy="367" r="3"/><circle cx="101" cy="373" r="2"/><circle cx="475" cy="361" r="2"/><circle cx="488" cy="370" r="4"/></g>
  </svg>;
}
