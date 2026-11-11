const palettes = [
  ["#102f33", "#2e6558", "#91ad72", "#efac86", "#f7e5b3"],
  ["#f1b6a1", "#c64843", "#3b4e60", "#f8dfa7", "#192f40"],
  ["#e8d8ae", "#45775d", "#d57846", "#f7f0db", "#243e35"],
  ["#a9c2bd", "#294f54", "#e7a46d", "#f4e3bf", "#bb5e43"],
  ["#d9b2a1", "#654d64", "#e8d6a5", "#a14f48", "#263c43"],
  ["#343f69", "#9397ba", "#dc987d", "#f2dcb2", "#495e7d"]
];
export function Art({ kind = 0, palette = 0, label, hero = false, phase = 0 }: { kind?: number; palette?: number; label: string; hero?: boolean; phase?: number }) {
  const [bg, leaf, coral, cream, ink] = palettes[palette];
  const mode = kind % 12;
  const flowers = (count: number, offset = 0) => Array.from({ length: count }, (_, i) => {
    const x = 25 + ((i * 97 + offset) % 550), y = 180 + ((i * 61) % 380);
    return <g key={i} transform={`translate(${x} ${y}) rotate(${i % 2 ? 18 : -16})`}><path d="M0 180Q-30 65 0 0" stroke={leaf} strokeWidth="5" fill="none"/><ellipse cx="-18" cy="90" rx="13" ry="38" fill={leaf} transform="rotate(-35 -18 90)"/><ellipse cx="14" cy="125" rx="13" ry="38" fill={leaf} transform="rotate(35 14 125)"/>{[0,60,120,180,240,300].map(a => <ellipse key={a} cx="0" cy="-13" rx="9" ry="19" fill={i % 3 ? coral : cream} transform={`rotate(${a})`}/>)}<circle r="8" fill={ink}/></g>;
  });
  return <svg className={`art ${hero ? "hero-art" : ""} ${mode === 5 || kind === 14 ? "moving-art" : ""}`} viewBox={hero ? "0 0 1200 800" : "0 0 600 700"} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
    <rect width="1200" height="800" fill={bg}/>
    <g transform={hero ? "translate(240 -20) scale(1.25)" : `translate(${phase === 1 ? -35 : 0} ${phase === 2 ? 15 : 0}) scale(${phase === 1 ? 1.15 : 1})`}>
    {(mode === 0 || hero) ? <>
      <circle cx="310" cy="195" r="95" fill={cream}/><path d="M0 530Q130 320 300 480T650 400V800H0" fill={leaf}/><path d="M-50 660Q170 420 340 560T650 510V800H-50" fill={ink}/>
      {flowers(19, 25)}<path d="M315 700Q370 560 302 495Q268 455 296 410" fill="none" stroke={cream} strokeWidth="25"/>
      {[40,530].map((x,i) => <g key={x} transform={`translate(${x} 60) rotate(${i ? 20 : -20})`}><path d="M0 650Q100 300 50 0" fill="none" stroke={leaf} strokeWidth="12"/>{[60,130,220,310,400].map(y => <g key={y}><ellipse cx="20" cy={y} rx="22" ry="65" fill={leaf} transform={`rotate(-40 20 ${y})`}/><ellipse cx="78" cy={y+40} rx="22" ry="65" fill={leaf} transform={`rotate(40 78 ${y+40})`}/></g>)}</g>)}
      <g transform="translate(375 345)"><path d="M0 30Q50-45 95 25Q60 90 0 30" fill={coral}/><path d="M45 25L15-20L95 20" fill={cream}/><circle cx="80" cy="20" r="4" fill={ink}/><path d="M95 23L112 30L95 35" fill={cream}/></g>
    </> : mode === 1 ? <>
      <circle cx="300" cy="320" r="200" fill={cream}/>{[0,45,90,135].map(a => <ellipse key={a} cx="300" cy="320" rx="215" ry="70" fill="none" stroke={ink} strokeWidth="4" transform={`rotate(${a} 300 320)`}/>)}<path d="M200 560V350Q200 260 290 260H360V420H280V560" fill={leaf}/><rect x="260" y="310" width="160" height="100" rx="48" fill={coral}/><circle cx="290" cy="340" r="10" fill={cream}/><circle cx="355" cy="340" r="10" fill={cream}/>{[60,480,120,500].map((x,i) => <rect key={i} x={x} y={100+i*140} width="35" height="35" fill={i%2?ink:coral} transform={`rotate(25 ${x} ${100+i*140})`}/>)}
    </> : mode === 10 ? <>
      <circle cx="300" cy="340" r="205" fill={cream}/>{[0,60,120].map((a,i)=><g key={a} transform={`rotate(${a} 300 340)`}><ellipse cx="300" cy="340" rx="220" ry="80" fill="none" stroke={ink} strokeWidth="5"/><circle cx={i%2?95:505} cy="310" r="25" fill={coral}/></g>)}<path d="M225 290L300 245L375 290V380L300 425L225 380Z" fill={leaf}/><path d="M225 290L300 335L375 290M300 335V425" fill="none" stroke={cream} strokeWidth="5"/>{[80,150,480,530].map((x,i)=><path key={x} d={`M${x} ${100+i*150}v30m-15-15h30`} stroke={coral} strokeWidth="5"/>)}
    </> : mode === 8 ? <>
      <circle cx="440" cy="150" r="85" fill={coral}/><path d="M0 400Q300 250 600 400V700H0" fill={leaf}/>{[0,1,2,3,4,5].map(i=><path key={i} d={`M${i*120-100} 700Q${i*100+100} 480 600 400`} stroke={cream} strokeWidth="5" fill="none"/>)}<path d="M185 270L230 180H350L400 270V540H185Z" fill={cream}/><path d="M185 270H400M230 180L270 270V540" stroke={ink} strokeWidth="4" fill="none"/><text x="332" y="350" fill={ink} fontFamily="Georgia" textAnchor="middle" fontSize="29">OATS</text><path d="M330 470V380" stroke={leaf} strokeWidth="4"/>{[390,415,440].map(y=><g key={y}><ellipse cx="317" cy={y} rx="17" ry="9" fill={leaf} transform={`rotate(30 317 ${y})`}/><ellipse cx="343" cy={y+8} rx="17" ry="9" fill={leaf} transform={`rotate(-30 343 ${y+8})`}/></g>)}
    </> : mode === 2 ? <>
      <path d="M0 480Q300 260 600 480V700H0" fill={leaf}/><circle cx="450" cy="140" r="70" fill={coral}/><path d="M155 255H420L395 535H180Z" fill={cream}/><path d="M420 300Q545 280 500 410Q470 455 405 430" fill="none" stroke={cream} strokeWidth="27"/><path d="M210 390Q290 280 375 390Q290 500 210 390" fill={leaf}/><path d="M245 390Q290 335 340 390Q290 445 245 390" fill={coral}/><text x="285" y="485" textAnchor="middle" fill={ink} fontFamily="Georgia" fontSize="30" letterSpacing="5">FAUNA</text><path d="M230 220Q180 160 235 95M305 220Q250 135 315 65" fill="none" stroke={leaf} strokeWidth="9"/>{[50,530].map(x => <g key={x} transform={`translate(${x} 390)`}><path d="M0 250V0" stroke={cream} strokeWidth="5"/>{[20,70,120,170].map(y => <ellipse key={y} cx="0" cy={y} rx="28" ry="12" fill={cream} transform={`rotate(-35 0 ${y})`}/>)}</g>)}
    </> : mode === 3 ? <>
      <circle cx="425" cy="190" r="115" fill={cream}/><path d="M0 550Q180 400 400 530T650 500V700H0" fill={leaf}/><path d="M0 640Q220 490 600 610V700H0" fill={ink}/>{[0,1,2,3,4,5,6].map(i => <g key={i} transform={`translate(${65+i*72} ${170+(i%3)*95}) rotate(-18)`}><path d="M-50 0Q-10-60 0 0Q40-55 65-10L10 28Z" fill={i%2?ink:coral}/><path d="M0 0L45 18L0 25" fill={cream}/></g>)}
    </> : mode === 4 ? <>
      <rect x="80" y="80" width="440" height="560" fill={ink}/><path d="M115 600V275Q115 40 300 100Q485 40 485 275V600" fill={leaf}/><circle cx="390" cy="220" r="70" fill={cream}/>{[150,230,335,420].map((x,i) => <g key={x}><rect x={x} y={320-i%2*90} width="60" height="280" fill={i%2?bg:coral}/>{[340,390,440,490].map(y=><rect key={y} x={x+16} y={y} width="14" height="22" fill={cream}/>)}</g>)}<path d="M300 100V600M115 330H485" stroke={ink} strokeWidth="14"/><path d="M40 620H560" stroke={cream} strokeWidth="30"/><path d="M195 605Q150 515 210 490Q275 500 230 605" fill={coral}/>
    </> : mode === 5 ? <>
      <circle cx="320" cy="210" r="110" fill={coral}/><circle cx="350" cy="180" r="95" fill={bg}/>{[0,1,2,3].map(i => <g key={i} transform={`translate(${30+i*140} ${340+(i%2)*100})`}><path d="M-60 0Q40-100 140 0Q50 80-60 0" fill={i%2?leaf:cream}/><path d="M0-15L20-120L70-15Z" fill={i%2?coral:ink}/><ellipse cx="40" cy="80" rx="65" ry="8" fill={leaf}/></g>)}{[40,150,470,540,230].map((x,i)=><path key={x} d={`M${x} ${80+i*35}v24m-12-12h24`} stroke={cream} strokeWidth="3"/>)}
    </> : mode === 6 ? <>
      <rect x="60" y="55" width="480" height="590" rx="180" fill={cream}/>{flowers(9,65)}<text x="300" y="140" fill={ink} textAnchor="middle" fontFamily="Georgia" fontSize="30" letterSpacing="6">HERBARIUM</text>
    </> : mode === 11 ? <>
      <circle cx="300" cy="200" r="120" fill={coral}/><ellipse cx="300" cy="585" rx="235" ry="30" fill={leaf}/>{[0,1].map(i=><g key={i} transform={`translate(${90+i*220} ${240-i*60})`}><rect x="0" y="0" width="190" height="320" rx="15" fill={i?cream:coral}/><ellipse cx="95" cy="0" rx="95" ry="17" fill={leaf}/><circle cx="95" cy="105" r="35" fill={i?coral:cream}/><path d="M95 260Q30 190 95 150Q160 190 95 260" fill={leaf}/><path d="M95 250V165" stroke={cream} strokeWidth="3"/><text x="95" y="295" fill={ink} textAnchor="middle" fontFamily="Georgia" fontSize="26" letterSpacing="5">LUNA</text></g>)}
    </> : mode === 7 ? <>
      <circle cx="300" cy="200" r="130" fill={cream}/><path d="M60 630V280H160V210H250V330H350V180H430V290H540V630Z" fill={leaf}/><path d="M200 630V440Q300 290 400 440V630" fill={ink}/><path d="M255 630V470Q300 400 345 470V630" fill={coral}/>{[80,440].map(x=><g key={x}><path d={`M${x} 700Q${x+130} 380 ${x} 150`} fill="none" stroke={ink} strokeWidth="17"/>{[230,340,450,560].map(y=><ellipse key={y} cx={x+30} cy={y} rx="60" ry="20" fill={ink} transform={`rotate(-35 ${x+30} ${y})`}/>)}</g>)}
    </> : <>
      <path d="M0 100Q130 250 0 400M600 60Q450 250 600 480" stroke={leaf} strokeWidth="90" fill="none"/>{[0,1,2,3,4].map(i=><g key={i} transform={`translate(${90+i*105} ${180+(i%2)*160})`}><path d="M-45 0Q0-80 45 0Z" fill={i%2?coral:cream}/>{[-25,0,25].map(x=><path key={x} d={`M${x} 0q-25 55 0 100t0 90`} fill="none" stroke={i%2?coral:cream} strokeWidth="4"/>)}</g>)}<circle cx="300" cy="590" r="30" fill={coral}/><path d="M280 610L245 680M315 610L345 680" stroke={cream} strokeWidth="14"/>
    </>}
    </g>
  </svg>;
}
