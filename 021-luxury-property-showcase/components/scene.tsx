import { useId } from "react";

/** Original architectural concept artwork, deliberately not property photography. */
export default function Scene({ variant = 0, label, className = "" }: { variant?: number; label: string; className?: string }) {
  const id = useId().replaceAll(":", "");
  const night = variant % 3 === 0;
  const bedroom = [3, 5, 6, 7].includes(variant);
  const outdoor = [10, 11, 13].includes(variant);
  return <svg className={`scene ${className}`} viewBox="0 0 1200 800" role="img" aria-label={`${label} — original architectural illustration`} preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`${id}sky`} x2="0" y2="1"><stop stopColor={night ? "#334655" : "#a3bdc3"}/><stop offset=".65" stopColor={night ? "#af8479" : "#d6c6ac"}/><stop offset="1" stopColor="#ead4b4"/></linearGradient>
      <linearGradient id={`${id}floor`} x2=".2" y2="1"><stop stopColor="#837865"/><stop offset="1" stopColor="#c3b397"/></linearGradient>
      <linearGradient id={`${id}wall`}><stop stopColor="#746b5b"/><stop offset="1" stopColor="#b9ab90"/></linearGradient>
      <linearGradient id={`${id}sofa`} x2="0" y2="1"><stop stopColor="#e5dfcf"/><stop offset="1" stopColor="#b3ab96"/></linearGradient>
    </defs>
    <rect width="1200" height="800" fill={`url(#${id}wall)`}/>
    <rect x="160" y="60" width="1040" height="515" fill={`url(#${id}sky)`}/>
    <path d="M160 390 Q400 370 700 410 T1200 380 V575 H160Z" fill="#8d9fa0"/>
    {Array.from({ length: 22 }, (_, i) => {
      const h = 85 + ((i * 73 + variant * 29) % 170), x = 160 + i * 49;
      return <g key={i}><rect x={x} y={540-h} width="38" height={h} fill={i%2 ? "#526168" : "#697578"}/>
        {Array.from({ length: 5 }, (_, j) => <path key={j} d={`M${x+7} ${550-h+j*28}h5 m8 0h5`} stroke={night ? "#ddbd7f" : "#a8b1ad"} strokeWidth="3"/>)}</g>;
    })}
    <path d="M0 0H1200V60H160V575H0Z" fill="#514e44"/>
    <path d="M160 60H1200 M160 570H1200" stroke="#272f2d" strokeWidth="15"/>
    {[165, 430, 695, 960, 1195].map(x => <path key={x} d={`M${x} 60V575`} stroke="#323a36" strokeWidth="12"/>)}
    <path d="M0 575H1200V800H0Z" fill={`url(#${id}floor)`}/>
    {[0, 180, 380, 580, 780, 980, 1180].map(x => <path key={x} d={`M600 575L${x} 800`} stroke="#796f5f" opacity=".45"/>)}
    <path d="M0 60H130V600H0" fill="#645d50"/><path d="M30 80V590M55 80V590M80 80V590M105 80V590" stroke="#94846b" strokeWidth="6"/>
    <ellipse cx="658" cy="700" rx="400" ry="70" fill="#282e2a" opacity=".18"/>
    {outdoor ? <><path d="M210 660L1030 620L1170 800H100Z" fill="#477a83"/><path d="M210 660L1030 620" stroke="#e0d0ad" strokeWidth="13"/><path d="M810 593H1050L1120 648H830Z" fill="#d2c8b1"/><path d="M160 530H1200" stroke="#ded5be" strokeWidth="7"/></>
      : variant === 2 ? <><path d="M240 576H900L1010 655H280Z" fill="#ede6d8"/><path d="M280 655H1010V752H280Z" fill="#b4a895"/><path d="M302 674H980M302 700H980" stroke="#81735e"/><ellipse cx="950" cy="568" rx="90" ry="20" fill="#3e443b"/><path d="M950 580V730" stroke="#363b32" strokeWidth="10"/></>
      : variant === 4 ? <><path d="M350 610Q400 570 790 586Q930 605 850 710Q650 770 400 700Z" fill="#eee9dc"/><ellipse cx="610" cy="618" rx="224" ry="34" fill="#a9b9b5"/><path d="M895 535V625H840" fill="none" stroke="#b5a16e" strokeWidth="10"/></>
      : bedroom ? <><path d="M310 550H890V655H310Z" fill="#736754"/><path d="M260 619H900L1070 749H180Z" fill="#e4ded0"/><path d="M180 749H1070V780H180Z" fill="#9b8e77"/><path d="M360 630H525L550 675H355ZM580 630H755L800 675H595Z" fill="#fff6e4"/><path d="M235 706H1010L1070 749H180Z" fill={variant === 3 ? "#a8987d" : variant === 5 ? "#7a8a84" : "#aaa7b2"}/></>
      : variant === 8 ? <><path d="M280 588H860L960 660H320Z" fill="#705b40"/><path d="M340 659V760M899 659V740" stroke="#3a3b32" strokeWidth="15"/><path d="M535 482H730V600H535Z" fill="#293c40" stroke="#b9b29c" strokeWidth="8"/><path d="M632 600V632H700" fill="none" stroke="#343c34" strokeWidth="8"/><path d="M425 684H605V773H410Z" fill="#515f58"/><path d="M459 773V800M572 773V800" stroke="#393c32" strokeWidth="9"/><path d="M825 603H875V625H825Z" fill="#bba47c"/></>
      : variant === 9 ? <><rect x="190" y="140" width="850" height="475" fill="#4a4437"/>{Array.from({length:6},(_,row) => <g key={row}><path d={`M190 ${180+row*75}H1040`} stroke="#ab9370" strokeWidth="7"/>{Array.from({length:11},(_,col) => <g key={col}><circle cx={227+col*76} cy={216+row*75} r="17" fill={col%3 ? "#6e7653" : "#95734e"}/><circle cx={227+col*76} cy={216+row*75} r="6" fill="#c0a575"/></g>)}</g>)}<path d="M410 665H790L850 715H375Z" fill="#b6a68b"/><path d="M430 715V790M780 715V790" stroke="#66563d" strokeWidth="13"/></>
      : variant === 12 ? <><path d="M160 70H600V580H160Z" fill="#e0d9c5"/><path d="M180 90L430 560M310 80L580 410" stroke="#aaa68f" strokeWidth="2"/><path d="M340 580H810L925 654H390Z" fill="#d5cbb6"/><path d="M390 654H925V750H390Z" fill="#aba38f"/><path d="M445 682L855 735M700 655L920 724" stroke="#d9d1bd" strokeWidth="2"/><text x="635" y="390" fontFamily="Georgia, serif" fontSize="44" letterSpacing="10" fill="#b5a274">M</text><path d="M1010 180V600" stroke="#c1ad7e" strokeWidth="5"/><circle cx="1010" cy="190" r="35" fill="#ead7ae"/></>
      : variant === 14 ? <>{[280,610,920].map(x => <g key={x}><path d={`M${x} 660H${x+165}L${x+210} 750H${x-30}Z`} fill="#454d46"/><path d={`M${x+145} 682V510L${x+90} 475`} fill="none" stroke="#b3b2a3" strokeWidth="14"/><path d={`M${x+45} 470H${x+125}V525H${x+45}Z`} fill="#263e42"/><path d={`M${x+10} 686H${x+150}`} stroke="#858c81" strokeWidth="10"/></g>)}</>
      : variant === 15 ? <><ellipse cx="635" cy="670" rx="170" ry="40" fill="#5d4d3a"/><path d="M635 684V770" stroke="#493e2f" strokeWidth="16"/>{[260,860].map(x => <g key={x}><path d={`M${x} 610H${x+150}L${x+180} 735H${x-10}Z`} fill="#8b9280"/><path d={`M${x+10} 735V785M${x+150} 735V785`} stroke="#433f33" strokeWidth="12"/></g>)}<path d="M560 654H590V620H560ZM700 650H730V615H700Z" fill="#c8bca0"/></>
      : <><path d="M235 610Q240 590 275 590H770Q805 590 810 630L840 718H230Z" fill={`url(#${id}sofa)`}/><path d="M230 675H832V735H230Z" fill="#c9bfa9"/><path d="M265 611H490V670H265ZM510 611H746V670H510Z" fill="#d9d1bd"/><path d="M746 610L796 644L772 680L728 645Z" fill="#6e7568"/><path d="M894 610H1070L1110 710H880Z" fill="#a6997c"/><path d="M500 724L760 711L835 760L547 782Z" fill="#594a39"/><path d="M547 782V800M807 764V794" stroke="#3d3a30" strokeWidth="8"/></>}
    <path d="M110 170H330" stroke="#b8a275" strokeWidth="5"/><path d="M240 0V170" stroke="#b8a275" strokeWidth="3"/><ellipse cx="330" cy="174" rx="38" ry="10" fill="#f0d7a4"/>
    <rect x="1090" y="555" width="53" height="90" fill="#766852"/>
    <path d="M1115 562V435M1115 505Q1025 462 1060 430Q1105 425 1115 505M1115 485Q1190 435 1160 412Q1120 427 1115 485" fill="#435440" stroke="#435440" strokeWidth="8"/>
  </svg>;
}
