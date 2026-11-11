export default function Architecture({ variant = 0, color = "#c8ac83", hero = false }: { variant?: number; color?: string; hero?: boolean }) {
  const style = variant % 10;
  return <svg className={hero ? "neighborhood" : "property-art"} viewBox="0 0 1200 650" role="img" aria-label={hero ? "Original illustration of a quiet Austin-inspired neighborhood at golden hour" : "Illustrated sample home, not a photograph of an actual property"} preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`sky-${variant}`} x2="0" y2="1"><stop stopColor="#b5c8cb"/><stop offset="1" stopColor="#f5dcad"/></linearGradient>
      <linearGradient id={`wall-${variant}`}><stop stopColor={color}/><stop offset="1" stopColor="#e9ddc9"/></linearGradient>
    </defs>
    <path fill={`url(#sky-${variant})`} d="M0 0h1200v650H0z"/>
    <circle cx="943" cy="142" r="67" fill="#ffe5ae" opacity=".8"/>
    <path d="M0 370Q230 280 450 346T1200 320V650H0" fill="#889778"/>
    <path d="M0 522L600 421 1200 510V650H0" fill="#b9b6a2"/>
    <path d="M360 650L600 424 715 424 1020 650" fill="#d7ccba"/>
    {style === 4 ? <g>
      <path d="M265 68h408v461H265z" fill={`url(#wall-${variant})`}/>
      <path d="M673 68l94 43v387l-94 31z" fill="#546d7b"/>
      <path d="M248 60h444v25H248z" fill="#3c545e"/>
      {[0, 1, 2, 3, 4].map(row => <g key={row}>{[0, 1, 2, 3].map(col => <g key={col}><path d={`M${295 + col * 91} ${105 + row * 73}h57v47h-57z`} fill={row % 2 ? "#c9cebf" : "#4f727e"}/><path d={`M${282 + col * 91} ${159 + row * 73}h83`} stroke="#e0ded1" strokeWidth="7"/></g>)}</g>)}
      <path d="M428 465h85v64h-85z" fill="#344e5b"/><path d="M470 468v59" stroke="#b3c2c1" strokeWidth="4"/>
    </g> : style === 5 || style === 6 || style === 2 ? <g>
      <path d={style === 2 ? "M130 320L440 157 850 320V519H130Z" : "M130 195h720v324H130Z"} fill={`url(#wall-${variant})`}/>
      <path d={style === 2 ? "M110 330L440 141 870 320 859 345 440 178 125 354Z" : "M112 175h758v30H112z"} fill="#3e514d"/>
      <path d="M850 195l110 38v254l-110 32z" fill="#a1907b"/>
      {[0, 1, 2, 3].map(col => <g key={col}>
        <path d={`M${160 + col * 173} 265h102v89H${160 + col * 173}z`} fill="#527674"/>
        <path d={`M${160 + col * 173} 393h65v126H${160 + col * 173}z`} fill="#425e58"/>
        <path d={`M${238 + col * 173} 403h39v65h-39z`} fill="#688581"/>
        <path d={`M${211 + col * 173} 267v85`} stroke="#d7d1bb" strokeWidth="6"/>
      </g>)}
      {style !== 2 && <path d="M120 374h745" stroke="#e2d9bf" strokeWidth="13"/>}
    </g> : <g transform={variant % 2 ? "translate(30 -15)" : ""}>
      <path d="M134 287L410 152 728 275 464 399Z" fill="#424c4a"/>
      <path d="M158 291L414 190 693 291V481L440 551 158 467Z" fill={`url(#wall-${variant})`}/>
      <path d="M440 327L693 291V481L440 551Z" fill="#ad9c84"/>
      <path d="M104 299L410 151 759 277 748 301 410 181 116 323Z" fill="#333f3c"/>
      <path d="M183 329h218v149H183z" fill="#a5a08c"/>
      <path d="M194 340h194v127H194z" fill="#ddd4c1"/>
      {[0, 1, 2, 3].map(n => <path key={n} d={`M194 ${362 + n * 27}h194`} stroke="#b9b19f" strokeWidth="3"/>)}
      <path d="M481 347l68-10v150l-68 20z" fill="#4a5955"/>
      <path d="M576 332l78-11v84l-78 16z" fill="#466669"/>
      <path d="M615 326v86m-39-38 78-14" stroke="#ded4bc" strokeWidth="6"/>
      <path d="M221 269l77-34v63l-77 31z" fill="#58777b"/>
      <path d="M259 252v61" stroke="#ddd3ba" strokeWidth="6"/>
      <path d="M155 471l287 84 250-72" fill="none" stroke="#c3b9a2" strokeWidth="9"/>
    </g>}
    <g transform="translate(740 175) scale(.53)">
      <path d="M0 280L270 90 600 270V550H0Z" fill="#d6c5a5"/>
      <path d="M-25 291L270 73 627 266 612 293 270 113 0 316Z" fill="#515953"/>
      <path d="M54 337h146v115H54zm287-5h133v119H341z" fill="#58767a"/>
      <path d="M251 357h64v193h-64z" fill="#5b655b"/>
    </g>
    <g fill="#4d6651"><ellipse cx="70" cy="320" rx="76" ry="127"/><ellipse cx="1125" cy="309" rx="108" ry="156"/><ellipse cx="1052" cy="376" rx="78" ry="89"/></g>
    <g stroke="#6b7054" strokeWidth="16"><path d="M70 364v220m1054-209v150m74-139v204"/></g>
    <g fill="#71805d"><ellipse cx="361" cy="506" rx="63" ry="27"/><ellipse cx="124" cy="489" rx="65" ry="30"/><ellipse cx="749" cy="484" rx="53" ry="28"/></g>
    <path d="M0 608Q240 556 378 590L461 650H0Z" fill="#8f9b72"/>
    <path d="M1200 550Q1100 562 1017 592L1085 650h115Z" fill="#7f8e68"/>
    <g fill="#e2c986"><circle cx="336" cy="506" r="5"/><circle cx="363" cy="495" r="5"/><circle cx="389" cy="510" r="5"/></g>
  </svg>;
}
