import { useId } from "react";

export default function Artwork({ scene = "plate", className = "" }: { scene?: string; className?: string }) {
  const id = useId().replaceAll(":", "");
  return <svg className={`art ${className}`} viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Original cinematic illustration: ${scene}`}>
    <defs>
      <radialGradient id={`${id}bg`} cx="65%" cy="25%" r="85%"><stop stopColor="#66513a"/><stop offset=".55" stopColor="#252722"/><stop offset="1" stopColor="#090c0a"/></radialGradient>
      <radialGradient id={`${id}ceramic`} cx="35%" cy="30%"><stop stopColor="#e9dfca"/><stop offset=".6" stopColor="#a89b83"/><stop offset=".88" stopColor="#d1c4aa"/><stop offset="1" stopColor="#534d40"/></radialGradient>
      <linearGradient id={`${id}wine`} x2="1" y2="1"><stop stopColor="#823f27"/><stop offset="1" stopColor="#270f11"/></linearGradient>
      <filter id={`${id}shadow`}><feGaussianBlur stdDeviation="20"/></filter>
      <pattern id={`${id}grain`} width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".55" fill="#ebd4a0" opacity=".17"/></pattern>
    </defs>
    <rect width="1000" height="720" fill={`url(#${id}bg)`}/>
    <path d="M0 580L1000 280M0 620L1000 320" stroke="#b29a72" opacity=".08" strokeWidth="2"/>
    {scene === "plate" && <g>
      <ellipse cx="550" cy="459" rx="315" ry="206" fill="#000" opacity=".7" filter={`url(#${id}shadow)`}/>
      <ellipse cx="536" cy="390" rx="297" ry="206" fill={`url(#${id}ceramic)`} transform="rotate(-13 536 390)"/>
      <ellipse cx="536" cy="390" rx="233" ry="157" fill="none" stroke="#f4ecd7" opacity=".5" transform="rotate(-13 536 390)"/>
      <path d="M378 449Q500 273 680 375Q622 454 455 476Z" fill="#bd864c" opacity=".8"/>
      {[0,1,2].map(n => <g key={n} transform={`translate(${430+n*80} ${388-n*24}) rotate(-14)`}><ellipse rx="47" ry="35" fill="#64351e"/><ellipse cy="-8" rx="45" ry="32" fill="#dbc294"/><path d="M-26 -17Q0 -36 30 -14M-30 0L30 -8" stroke="#9d6d38" strokeWidth="4"/></g>)}
      {[0,1,2,3,4,5].map(n => <g key={n} transform={`translate(${375+n*50} ${320+(n%2)*130}) rotate(${n*38})`}><path d="M0 0Q-55 -40 -36 -64Q9 -60 0 0" fill={n%2?"#9f5530":"#5d742e"}/><path d="M0 0L-33 -52" stroke="#b1af6a"/></g>)}
      <path d="M430 337Q514 264 613 299M410 390Q520 270 642 330" stroke="#426133" strokeWidth="3" fill="none"/>
      {[0,1,2,3,4].map(n=><circle key={n} cx={410+n*55} cy={478-n*8} r={5+n%3} fill="#c9a84c"/>)}
    </g>}
    {(scene === "room" || scene === "table") && <g>
      {[120,350,580,810].map(x=><g key={x}><rect x={x} y="65" width="150" height="260" fill="#151d1a" stroke="#8b7654" strokeWidth="4"/><path d={`M${x+75} 65V325M${x} 210H${x+150}`} stroke="#665a42" strokeWidth="3"/></g>)}
      <path d="M170 440L780 380L1000 720H0Z" fill="#9c8f79"/><path d="M220 439L700 390L838 720H122Z" fill="#c9bca2"/>
      {[250,490,730].map((x,n)=><g key={x} transform={`translate(${x} ${495+n*25})`}><ellipse rx="70" ry="30" fill={`url(#${id}ceramic)`}/><path d="M95 -25V35M110 -25V35" stroke="#d5c9aa" strokeWidth="3"/><rect x="-3" y="-150" width="6" height="70" fill="#d6c7a5"/><ellipse cy="-153" rx="5" ry="13" fill="#ffdb87"/><circle cy="-153" r="35" fill="#f4bd62" opacity=".13"/></g>)}
    </g>}
    {scene === "chef" && <g>
      <rect x="90" y="120" width="250" height="220" fill="#262b25" stroke="#645f4c"/><path d="M90 180H340M90 260H340" stroke="#71654c"/>
      <ellipse cx="600" cy="220" rx="76" ry="94" fill="#b99a79"/><path d="M520 195Q522 91 602 125Q667 121 678 195L632 160Z" fill="#322f26"/>
      <path d="M479 317Q600 273 712 322L783 650H383Z" fill="#121715"/><path d="M600 320V660" stroke="#4e5144"/><path d="M479 352L330 492L465 555M710 350L756 490L619 565" fill="none" stroke="#222824" strokeWidth="70"/>
      <path d="M435 549L520 581M649 558L573 574" stroke="#b89a78" strokeWidth="25" strokeLinecap="round"/><path d="M50 650L950 570V720H50Z" fill="#807b69"/><ellipse cx="553" cy="625" rx="120" ry="35" fill={`url(#${id}ceramic)`}/>
      <path d="M541 608Q553 580 578 601" stroke="#6d813c" strokeWidth="6" fill="none"/>
    </g>}
    {scene === "wine" && <g>
      <path d="M372 145H637L615 333Q594 431 510 436Q419 427 399 333Z" fill="#cbb68b" opacity=".14" stroke="#d3bfa0" strokeWidth="3"/><path d="M393 290H625L612 333Q589 418 510 420Q435 415 408 334Z" fill={`url(#${id}wine)`}/>
      <path d="M510 438V618M429 636Q510 610 591 636Z" stroke="#cdb68a" strokeWidth="5" fill="none"/>
      <g transform="rotate(35 750 140)"><rect x="710" y="-80" width="65" height="230" fill="#202b20"/><path d="M710 90H775L820 300H660Z" fill="#283323"/><rect x="677" y="192" width="125" height="75" fill="#c4b48b"/></g><path d="M683 227Q581 232 539 302" stroke="#b18552" strokeWidth="6" fill="none"/>
    </g>}
    {scene === "ingredients" && <g>
      <ellipse cx="510" cy="420" rx="325" ry="190" fill="#372c20"/>
      {[0,1,2,3,4,5,6].map(n=><g key={n} transform={`translate(${300+(n%4)*125} ${320+Math.floor(n/4)*155}) rotate(${n*18})`}><path d="M-8 0L-15 70H18L10 0" fill="#baaa85"/><path d="M-66 0Q-45 -86 10 -65Q67 -55 72 0Z" fill={n%2?"#966448":"#d5bf95"}/><path d="M-50 2H55" stroke="#5c3928" strokeWidth="4"/></g>)}
      <path d="M660 540Q711 352 821 223M697 408L760 269M730 365L847 337" stroke="#6b7b37" strokeWidth="8"/>
      {[0,1,2,3].map(n=><ellipse key={n} cx={770+n*20} cy={265+n*55} rx="35" ry="14" transform={`rotate(-30 ${770+n*20} ${265+n*55})`} fill="#526534"/>)}
    </g>}
    <rect width="1000" height="720" fill={`url(#${id}grain)`}/>
  </svg>;
}
