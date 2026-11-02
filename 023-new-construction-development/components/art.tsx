export function HouseArt({ variant = 0, label = "Original architectural concept rendering" }: { variant?: number; label?: string }) {
  const siding = ["#ece4d5", "#faf5e8", "#c8c9c4", "#dfd4bf"][variant % 4];
  return <svg viewBox="0 0 640 400" role="img" aria-label={label}>
    <defs><linearGradient id={`sky${variant}`} x2="0" y2="1"><stop stopColor="#bed7dc"/><stop offset="1" stopColor="#f3e6c9"/></linearGradient></defs>
    <rect width="640" height="400" fill={`url(#sky${variant})`}/><circle cx="490" cy="65" r="38" fill="#fff3d4"/>
    <path d="M0 225Q70 160 150 216T360 206T640 195V400H0Z" fill="#8d9b77"/>
    {[35, 90, 557, 612].map((x, i) => <g key={x}><path d={`M${x} 335V${95 + i * 15}`} stroke="#636947" strokeWidth="10"/><ellipse cx={x} cy={130 + i * 14} rx="45" ry="90" fill={i % 2 ? "#788b60" : "#506c52"}/></g>)}
    <path d="M0 348Q320 300 640 346V400H0Z" fill="#a7af7d"/>
    <path d="M400 329L530 400H272L312 329Z" fill="#c6c4b8"/>
    <rect x="153" y="177" width="342" height="160" fill={siding}/><rect x="232" y="134" width="218" height="203" fill={siding}/>
    <path d={variant === 0 ? "M118 185L282 83L446 185Z" : "M130 185L243 94L355 185ZM277 147L382 62L485 147Z"} fill="#3c4b4a"/>
    <path d="M333 245L410 182L502 245Z" fill="#566464"/><rect x="342" y="245" width="153" height="92" fill="#c7c1b3"/>
    {[178, 245, 316, 402].map((x, i) => <g key={x}><rect x={x} y={i === 3 ? 155 : 207} width="42" height="61" fill="#354c53" stroke="#fff9ea" strokeWidth="7"/><path d={`M${x + 21} ${i === 3 ? 155 : 207}v61m-21-30h42`} stroke="#fff9ea" strokeWidth="3"/></g>)}
    <rect x="262" y="266" width="44" height="71" fill="#806442"/><rect x="352" y="270" width="118" height="67" fill="#dedbd1" stroke="#9a9d91" strokeWidth="3"/>
    <path d="M140 273H329M147 279V339M322 279V339" stroke="#fbf5e7" strokeWidth="9"/><path d="M136 276L158 254H305L336 276Z" fill="#465956"/>
    <path d="M259 337L246 400H314L306 337Z" fill="#e4dfd2"/>
    {[150, 189, 220, 492, 524].map(x => <ellipse key={x} cx={x} cy="337" rx="22" ry="13" fill="#597452"/>)}
    <text x="24" y="378" fill="#354a40" fontSize="11" letterSpacing="2">CRESTWOOD / ARTIST’S CONCEPT</text>
  </svg>;
}

export function CommunityArt() {
  return <svg viewBox="0 0 1440 750" role="img" aria-label="Original elevated community illustration: tree-lined streets, warm homes and a central green at golden hour">
    <defs><linearGradient id="goldsky" x2="0" y2="1"><stop stopColor="#dadac5"/><stop offset=".65" stopColor="#b3c2aa"/><stop offset="1" stopColor="#788b6b"/></linearGradient><linearGradient id="land" x2="0.8" y2="1"><stop stopColor="#a0ad7e"/><stop offset="1" stopColor="#5a755a"/></linearGradient></defs>
    <rect width="1440" height="750" fill="url(#goldsky)"/><circle cx="1130" cy="80" r="88" fill="#f6e7b9" opacity=".75"/>
    <path d="M0 160Q300 90 640 140T1440 135V750H0Z" fill="url(#land)"/>
    <path d="M-50 305L1130 150L1460 185L340 468Z" fill="#b6b8a5"/><path d="M340 468L1460 185L1500 310L750 750H485Z" fill="#989f93"/>
    <path d="M-20 328L1100 180M560 700L1450 235" stroke="#e2dccc" strokeWidth="4" strokeDasharray="24 25"/>
    <path d="M200 162L600 125L748 181L373 239Z" fill="#b7bf82"/><path d="M230 181Q360 129 560 154T669 184Q500 226 295 207Z" stroke="#e3d5b6" strokeWidth="13" fill="none"/>
    {Array.from({ length: 15 }, (_, i) => {
      const second = i > 7; const x = second ? 330 + (i - 8) * 133 : 40 + i * 153;
      const y = second ? 492 - (i - 8) * 27 : 245 - i * 15;
      const scale = second ? 1.3 : .85;
      return <g key={i} transform={`translate(${x} ${y}) scale(${scale})`}><path d="M0 0L70-20L108 5L38 28Z" fill="#475a54"/><path d="M0 0V50L38 76V28Z" fill="#c8c4ae"/><path d="M38 28L108 5V57L38 76Z" fill={i % 2 ? "#e1d8be" : "#eeeadb"}/><path d="M55 38L68 34V53L55 57ZM81 30L95 25V45L81 50Z" fill="#4b6368"/><path d="M7 15L23 26V46L7 35Z" fill="#546b70"/><path d="M76 62L92 57V65L76 70Z" fill="#8a7356"/><path d="M46 80L81 69L114 100L77 115Z" fill="#c1beac"/></g>;
    })}
    {Array.from({ length: 48 }, (_, i) => { const x = (i * 197 + 63) % 1440; const y = 160 + (i * 47) % 530; return <g key={i}><path d={`M${x} ${y + 45}v-45`} stroke="#4e5c42" strokeWidth="5"/><ellipse cx={x} cy={y} rx={17 + (i % 3) * 5} ry="31" fill={i % 2 ? "#526f52" : "#6e8358"}/></g>; })}
    <path d="M975 500Q1130 455 1320 523L1430 730H905Z" fill="#7d956c"/><path d="M950 583Q1100 515 1415 650" fill="none" stroke="#d0c6a6" strokeWidth="14"/>
    {[1000, 1020, 1245].map((x, i) => <g key={x}><circle cx={x} cy={557 + i * 12} r="5" fill="#dfc6a4"/><path d={`M${x} ${565 + i * 12}v17m0-5l-7 12m7-12l7 12`} stroke={i === 1 ? "#ece6d2" : "#364a54"} strokeWidth="5"/></g>)}
  </svg>;
}

export function AmenityArt({ scene = 0 }: { scene?: number }) {
  return <svg viewBox="0 0 640 400" role="img" aria-label={["Original pool and clubhouse concept illustration", "Original playground concept illustration with families", "Original wooded trail concept illustration with dog walkers"][scene]}>
    <rect width="640" height="400" fill="#dce5d7"/><path d="M0 181Q120 107 265 184T640 171V400H0Z" fill="#879b73"/>
    {[28, 90, 529, 594].map((x, i) => <g key={x}><path d={`M${x} 299V${92 + i * 10}`} stroke="#65754e" strokeWidth="7"/><ellipse cx={x} cy={117 + i * 10} rx="40" ry="80" fill={i % 2 ? "#597953" : "#73895e"}/></g>)}
    {scene === 0 ? <><rect x="185" y="125" width="287" height="125" fill="#ece5d3"/><path d="M159 134L319 49L495 134Z" fill="#4e655b"/><rect x="215" y="167" width="42" height="82" fill="#667f80"/><rect x="283" y="167" width="42" height="82" fill="#667f80"/><rect x="352" y="167" width="74" height="82" fill="#667f80"/><path d="M75 254H471L571 365H18Z" fill="#d6cdb3"/><path d="M120 268H444L517 344H72Z" fill="#85b9c0"/><path d="M134 284H425M116 304H449M95 326H484" stroke="#c7e0dc" strokeWidth="3"/><path d="M524 249V185M483 195Q525 161 567 195Z" fill="#f2ebd5" stroke="#b8a67c" strokeWidth="4"/></>
    : scene === 1 ? <><path d="M86 301Q244 232 538 300L604 378H20Z" fill="#cfbf9f"/><rect x="244" y="160" width="117" height="72" fill="#bba27a"/><path d="M221 163L302 100L383 163Z" fill="#526e61"/><path d="M259 227V318M348 227V318" stroke="#9d835f" strokeWidth="13"/><path d="M359 204Q365 270 431 308L451 308" fill="none" stroke="#d8be76" strokeWidth="18"/><path d="M112 194H220M119 194V310M213 194V309M147 194V250M185 194V250M145 254H189" fill="none" stroke="#647d68" strokeWidth="7"/><circle cx="507" cy="232" r="11" fill="#d9bc98"/><path d="M507 245v43m0-13l-16 36m16-36l18 34" stroke="#576970" strokeWidth="13"/><circle cx="475" cy="268" r="8" fill="#d9bc98"/><path d="M475 278v21m0-8l-9 23m9-23l9 23" stroke="#d4a86d" strokeWidth="10"/></>
    : <><path d="M276 176Q358 210 300 262T187 400H368Q382 321 409 267T353 176Z" fill="#d6cbae"/><circle cx="306" cy="216" r="10" fill="#d7b995"/><path d="M306 230v40m0-11l-14 32m14-32l15 32" stroke="#435e63" strokeWidth="12"/><circle cx="338" cy="224" r="10" fill="#d7b995"/><path d="M338 237v40m0-9l-14 32m14-32l15 32" stroke="#e0d2b0" strokeWidth="12"/><path d="M350 263L397 291" stroke="#81775e" strokeWidth="2"/><ellipse cx="401" cy="293" rx="17" ry="9" fill="#9b8061"/><path d="M389 299v13m21-13v13m-24-19l-13-6" stroke="#9b8061" strokeWidth="5"/></>}
    <text x="22" y="383" fill="#3c5447" fontSize="10" letterSpacing="2">AMENITY / ARTIST’S CONCEPT · UNVERIFIED</text>
  </svg>;
}

export function InteriorArt({ scene = 0 }: { scene?: number }) {
  return <svg viewBox="0 0 640 400" role="img" aria-label={`Original ${["kitchen", "primary bath", "great room", "backyard", "front porch", "home office"][scene % 6]} concept illustration, not photography`}>
    <rect width="640" height="400" fill="#e8e2d5"/><path d="M0 285H640V400H0Z" fill="#c2ad8e"/><path d="M0 0L70 55H570L640 0M70 55V285M570 55V285" fill="none" stroke="#d0c7b5" strokeWidth="3"/>
    <rect x="379" y="67" width="148" height="165" fill="#afc5bf" stroke="#f9f7ef" strokeWidth="14"/><path d="M379 199Q437 126 527 174V232H379Z" fill="#738964"/><path d="M453 68V232M379 147H527" stroke="#faf7f0" strokeWidth="7"/>
    {scene === 0 ? <><rect x="81" y="99" width="225" height="157" fill="#8d9c8b"/><path d="M81 181H306M155 100V255M231 100V255" stroke="#657867" strokeWidth="3"/><rect x="69" y="175" width="250" height="10" fill="#faf9ed"/><path d="M180 270H468L497 289H159Z" fill="#faf9ed"/><path d="M180 288H476V350H180Z" fill="#868c7a"/><path d="M225 55V118M290 55V118" stroke="#8d7446" strokeWidth="3"/><ellipse cx="225" cy="127" rx="27" ry="11" fill="#ba9a5c"/><ellipse cx="290" cy="127" rx="27" ry="11" fill="#ba9a5c"/></>
    : scene === 1 ? <><rect x="90" y="80" width="158" height="116" fill="#acbdb6" stroke="#a38a5e" strokeWidth="5"/><rect x="76" y="218" width="190" height="93" fill="#a5a491"/><ellipse cx="171" cy="217" rx="62" ry="15" fill="#fcfaf2"/><path d="M346 302Q326 237 350 237H541Q558 237 531 302Z" fill="#fcfaf2"/><path d="M359 233V205Q359 186 377 186" stroke="#9a835b" strokeWidth="6" fill="none"/></>
    : scene === 5 ? <><path d="M105 255H378M130 255V340M355 255V340" stroke="#886e4d" strokeWidth="12"/><rect x="199" y="195" width="90" height="58" fill="#415557"/><path d="M82 78H303M82 128H303M82 78V173" stroke="#9b8564" strokeWidth="6"/><rect x="94" y="83" width="51" height="40" fill="#688273"/><rect x="159" y="80" width="11" height="47" fill="#c0a780"/><ellipse cx="277" cy="296" rx="37" ry="17" fill="#596c62"/><path d="M277 302V347" stroke="#45584e" strokeWidth="7"/></>
    : scene === 3 || scene === 4 ? <><rect x="0" y="244" width="640" height="156" fill="#8da077"/><path d="M0 337L640 295V400H0Z" fill="#c3b69c"/><path d="M64 0V351M577 0V316" stroke="#faf5e5" strokeWidth="20"/><path d="M198 261H328M212 263V331M317 263V323" stroke="#816e4c" strokeWidth="9"/><ellipse cx="430" cy="252" rx="44" ry="76" fill="#607d5d"/><rect x="406" y="305" width="50" height="39" fill="#ae9678"/></>
    : <><path d="M103 232Q103 217 122 217H338Q358 217 358 237V311H103Z" fill="#aaae97"/><path d="M95 258H366V316H95Z" fill="#b8bba5"/><rect x="124" y="230" width="62" height="47" rx="7" fill="#ede7d6"/><rect x="272" y="230" width="53" height="46" rx="7" fill="#6b8373"/><ellipse cx="356" cy="334" rx="96" ry="26" fill="#9a8261"/><path d="M355 337V367" stroke="#7e694b" strokeWidth="7"/><path d="M85 286V184M85 185L59 205H112Z" fill="#e6dbc0" stroke="#a5916b" strokeWidth="4"/></>}
    <text x="24" y="378" fill="#435848" fontSize="11" letterSpacing="2">ORIGINAL INTERIOR / LANDSCAPE CONCEPT</text>
  </svg>;
}
