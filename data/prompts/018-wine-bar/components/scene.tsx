export default function Scene({ variant = "bar", className = "" }: { variant?: string; className?: string }) {
  return <svg className={`scene ${className}`} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Original illustration of a wine bar ${variant}`} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`wall-${variant}`} x2="0" y2="1"><stop stopColor="#412c2b"/><stop offset="1" stopColor="#1b1725"/></linearGradient>
      <radialGradient id={`glow-${variant}`}><stop stopColor="#e4ac67" stopOpacity=".62"/><stop offset="1" stopColor="#dda86c" stopOpacity="0"/></radialGradient>
      <linearGradient id={`wood-${variant}`} x2=".2" y2="1"><stop stopColor="#a07652"/><stop offset=".4" stopColor="#563b30"/><stop offset="1" stopColor="#211a22"/></linearGradient>
      <linearGradient id={`glass-${variant}`}><stop stopColor="#edc99a" stopOpacity=".08"/><stop offset=".5" stopColor="#f4d5ad" stopOpacity=".3"/><stop offset="1" stopColor="#d6b792" stopOpacity=".08"/></linearGradient>
      <pattern id={`brick-${variant}`} width="160" height="70" patternUnits="userSpaceOnUse"><path d="M0 0h160M0 35h160M80 0v35M0 35v35M160 35v35" fill="none" stroke="#b47655" strokeWidth="2" opacity=".16"/></pattern>
    </defs>
    <rect width="1200" height="800" fill={`url(#wall-${variant})`}/>
    <rect width="1200" height="800" fill={`url(#brick-${variant})`}/>
    {variant === "patio" ? <>
      <rect x="0" y="0" width="1200" height="400" fill="#252c37"/><path d="M0 120Q600 300 1200 90" stroke="#a68969" strokeWidth="3" fill="none"/>
      {[100,260,420,580,740,900,1060].map((x,i)=><g key={x}><circle cx={x} cy={140+Math.sin(i/2)*70} r="75" fill={`url(#glow-${variant})`}/><circle cx={x} cy={140+Math.sin(i/2)*70} r="7" fill="#f3d29c"/></g>)}
      {[100,1030].map(x=><g key={x}><rect x={x} y="390" width="80" height="260" rx="20" fill="#423c2b"/><path d={`M${x+40} 480q-110-150-30-210q80 70 30 210q100-130 85-195q-100 5-85 195`} fill="#414c36"/></g>)}
    </> : <>
      {[170,590,1010].map((x)=><g key={x}>
        <path d={`M${x-140} 510V225a140 140 0 01280 0v285Z`} fill="#100f19" stroke="#76533e" strokeWidth="13"/>
        <path d={`M${x-130} 310h260m-260 100h260`} stroke="#67503b" strokeWidth="9"/>
        {[0,1,2,3,4,5].map(i=><g key={i} transform={`translate(${x-108+i*40} ${i%2?355:255})`}><path d="M8 0h12v22l8 13v54H0V35l8-13Z" fill={i%3===0?"#7b744c":"#283b31"}/><rect x="3" y="51" width="22" height="22" fill="#baa47b" opacity=".65"/></g>)}
      </g>)}
      {[330,870].map(x=><g key={x}><ellipse cx={x} cy="220" rx="200" ry="250" fill={`url(#glow-${variant})`}/><path d={`M${x} 0v125`} stroke="#17131c" strokeWidth="7"/><path d={`M${x-45} 130h90l28 58H${x-73}Z`} fill="#b28b5f"/><ellipse cx={x} cy="190" rx="60" ry="8" fill="#f2c382"/></g>)}
    </>}
    <path d="M0 560 1200 530v270H0Z" fill={`url(#wood-${variant})`}/>
    <path d="m0 560 1200-30" stroke="#d6ad79" strokeWidth="5" opacity=".55"/>
    {[120,410,700,990].map(x=><g key={x}><ellipse cx={x} cy="739" rx="65" ry="15" fill="#0b0b14"/><path d={`M${x-52} 640h104v25H${x-52}Zm52 24v75`} fill="#251e28" stroke="#786049" strokeWidth="5"/></g>)}
    {(variant === "cheese") ? <>
      <ellipse cx="650" cy="605" rx="360" ry="95" fill="#ac8158" stroke="#d0a16a" strokeWidth="4"/>
      <path d="m425 590 120-90 160 100-90 60Z" fill="#e0c78d"/><path d="m425 590 190 70v32l-190-63Z" fill="#b69a61"/>
      <path d="m730 595 70-100 105 100-45 40Z" fill="#dac6a4"/>
      {[820,850,880,800,840,865].map((x,i)=><circle key={i} cx={x} cy={610+i%3*12} r="17" fill="#59334b"/>)}
      <path d="M340 600q20-70 90-30q-40 80-90 30" fill="#687146"/>
    </> : <>
      {[460,740].map((x,i)=><g key={x}><path d={`M${x-40} 445h80l-5 65q-35 48-70 0Z`} fill={`url(#glass-${variant})`} stroke="#cfb99a" strokeWidth="2" opacity=".8"/><path d={`M${x-35} 489h70q-2 52-35 45q-33 7-35-45`} fill={i?"#aa9b60":"#792c42"} opacity=".8"/><path d={`M${x} 538v73m-30 0h60`} stroke="#ceb698" strokeWidth="3"/><ellipse cx={x} cy="618" rx="53" ry="7" fill="#0a0b12" opacity=".5"/></g>)}
      <path d="M576 360h38v72l24 35v143h-86V467l24-35Z" fill="#24372d"/><rect x="560" y="509" width="69" height="72" fill="#dac9a6"/><path d="M572 533h45m-40 10h36m-30 22h24" stroke="#604536" strokeWidth="2"/>
      {variant === "pour" && <g transform="rotate(33 650 360)"><path d="M620 220h28v58l23 35v129h-76V313l25-35Z" fill="#384235"/><rect x="601" y="344" width="63" height="52" fill="#ccb58a"/><path d="M632 215q-13-75-100-64l-30 40q48 20 111 6" fill="#ab8066"/></g>}
    </>}
    {variant === "alcove" && <><path d="M45 700V530q0-110 150-110t150 110v170" fill="#582c3b"/><path d="M860 700V530q0-110 150-110t150 110v170" fill="#582c3b"/><ellipse cx="603" cy="660" rx="235" ry="50" fill="#876349"/></>}
    <rect width="1200" height="800" fill="#131321" opacity=".15"/>
  </svg>;
}
