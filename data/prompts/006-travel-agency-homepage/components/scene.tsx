import { useId } from "react";
import type { SceneName } from "./data";

// Original vector landscapes; no third-party photography or remote assets.
export default function Scene({ name, className = "" }: { name: SceneName; className?: string }) {
  const id = useId().replace(/:/g, "");
  const sea = `${id}-sea`, sky = `${id}-sky`, shade = `${id}-shade`;
  const isGreen = name === "jungle" || name === "kyoto" || name === "bali";
  return <svg className={`scene ${className}`} viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id={sky} x2="0" y2="1"><stop stopColor={isGreen ? "#bbd3a7" : "#b9dce6"} /><stop offset="1" stopColor="#f8ecd1" /></linearGradient>
      <linearGradient id={sea} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#176b87" /><stop offset=".48" stopColor="#229d9b" /><stop offset="1" stopColor="#82d8c9" /></linearGradient>
      <linearGradient id={shade} x2="0" y2="1"><stop stopColor="#f4eee0" /><stop offset="1" stopColor="#c7bda1" /></linearGradient>
    </defs>
    <rect width="1000" height="700" fill={`url(#${sky})`} />
    <circle cx="770" cy="122" r="65" fill="#fff9dd" opacity=".75" />
    {(name === "coast" || name === "santorini" || name === "amalfi") && <>
      <rect y="250" width="1000" height="450" fill={`url(#${sea})`} />
      {[310, 346, 400, 470, 530, 580, 635].map((y, i) => <path key={y} d={`M-30 ${y} Q 200 ${y - 18} 410 ${y} T 1040 ${y + 10}`} fill="none" stroke="#c4f4e8" strokeWidth={i % 2 ? 2 : 4} opacity=".28" />)}
    </>}
    {name === "coast" && <>
      <path d="M0 0H620C520 95 564 178 460 258S426 386 298 458 235 609 86 700H0Z" fill="#efe4c4" />
      <path d="M0 0H546C468 77 510 168 415 234S381 354 258 425 185 590 36 700H0Z" fill="#eee5cb" />
      <path d="M620 0C520 95 564 178 460 258S426 386 298 458 235 609 86 700" stroke="#fcffef" strokeWidth="23" fill="none" opacity=".65" />
      <path d="M650 0C550 95 594 178 490 258S456 386 328 458 265 609 116 700" stroke="#d8f6e9" strokeWidth="8" fill="none" opacity=".4" />
      <path d="M0 0H400Q242 57 301 154T175 337Q125 393 0 510Z" fill="#467850" />
      {[ [50, 60], [170, 84], [260, 50], [125, 196], [217, 193], [60, 299], [116, 370] ].map(([x, y]) => <g key={x + y} transform={`translate(${x} ${y}) rotate(-20)`}><path d="M0 50Q12 10 0 -20" stroke="#b39a69" strokeWidth="8" fill="none" /><path d="M0 -20Q-65 -60 -60 -6Q-38 -40 0 -20M0 -20Q65 -60 60 -6Q38 -40 0 -20M0 -20Q-20 -85 15 -80Q-8 -47 0 -20M0 -20Q45 -9 40 26Q25 -4 0 -20" fill="#285f44" /></g>)}
      <g transform="translate(720 430) rotate(28)"><ellipse cy="12" rx="17" ry="65" fill="#105b73" opacity=".25" /><path d="M0-65Q34 0 0 65Q-34 0 0-65" fill="#fff8e4" /><path d="M0-52V35L37 28Z" fill="white" /><path d="M-5-35V30H-36Z" fill="#ecd6ab" /></g>
    </>}
    {name === "santorini" && <>
      <path d="M0 350Q200 305 360 400T630 505L810 700H0" fill="#9d8e76" />
      <path d="M0 425Q240 385 395 470L590 700H0" fill="#c3af8b" />
      {[[35, 370, 180], [210, 315, 200], [450, 440, 155], [140, 510, 160], [380, 570, 180]].map(([x, y, w]) => <g key={x} transform={`translate(${x} ${y})`}><rect width={w} height="150" rx="5" fill={`url(#${shade})`} /><path d={`M-5 0L${w / 2} -25L${w + 5} 0Z`} fill="#fff9e9" /><rect x="24" y="62" width="34" height="88" rx="17" fill="#205781" /><rect x={w - 65} y="35" width="29" height="43" rx="14" fill="#3e83a5" /></g>)}
      <g transform="translate(280 315)"><rect x="-64" y="-25" width="128" height="35" fill="#fff9ef" /><path d="M-64-25A64 64 0 0 1 64-25Z" fill="#247bb5" /><path d="M-48-25A48 60 0 0 1 42-30" fill="none" stroke="#429acc" strokeWidth="5" /><path d="M0-113V-90M-9-104H9" stroke="#e4d9b8" strokeWidth="5" /></g>
      <path d="M10 665Q195 590 330 667" fill="none" stroke="#fff7e6" strokeWidth="30" />
      <g fill="#c45589"><circle cx="74" cy="600" r="28" /><circle cx="103" cy="614" r="23" /><circle cx="50" cy="626" r="22" /></g>
    </>}
    {name === "amalfi" && <>
      <path d="M0 150Q140 90 262 183T427 211L700 700H0Z" fill="#507d68" /><path d="M0 275Q185 225 325 305L592 700H0Z" fill="#927d61" />
      {Array.from({ length: 19 }, (_, i) => { const x = 40 + (i % 5) * 105 + Math.floor(i / 5) * 25, y = 260 + Math.floor(i / 5) * 96 - (i % 3) * 32; return <g key={i} transform={`translate(${x} ${y})`}><rect width="84" height="109" fill={["#efc5a1", "#f0dfb9", "#dfa28e", "#e8bc74"][i % 4]} /><path d="M-5 0L42-18L89 0Z" fill="#925c49" />{[16, 50].map(k => <g key={k}><rect x={k} y="22" width="14" height="23" fill="#456b65" /><rect x={k} y="65" width="14" height="23" fill="#456b65" /></g>)}</g>; })}
      <path d="M0 680Q320 545 595 700" fill="none" stroke="#eddec0" strokeWidth="20" /><path d="M760 410h95l-20 18h-60Z" fill="#fff9ec" />
    </>}
    {name === "kyoto" && <>
      <rect width="1000" height="700" fill="#617a44" opacity=".3" /><path d="M445 305L140 700H860L565 305Z" fill="#c7b78b" /><path d="M495 325L360 700H645L531 325Z" fill="#e0cea4" opacity=".75" />
      {Array.from({ length: 25 }, (_, i) => { const x = i < 12 ? i * 35 : 595 + (i - 12) * 37; const w = 13 + i % 4 * 5; return <g key={i}><path d={`M${x} 700Q${x + 30} 320 ${x - 15} 0`} fill="none" stroke={["#375437", "#839b53", "#5b8149"][i % 3]} strokeWidth={w} />{[80, 180, 280, 390, 530, 630].map(y => <path key={y} d={`M${x - 10 + 18} ${y}h${w}`} stroke="#b2bd76" strokeWidth="4" />)}<path d={`M${x} 180q-70 -110 -105 -85q35 75 105 85M${x} 250q90 -100 124 -80q-30 60 -124 80`} fill="#305638" opacity=".65" /></g>; })}
      <g transform="translate(490 485)"><circle cy="-24" r="10" fill="#b79e7c" /><path d="M-12-8H12L18 50H-18Z" fill="#e4e5d2" /><path d="M-8 50L-12 92M8 50L16 92" stroke="#424d42" strokeWidth="7" /></g>
    </>}
    {name === "jungle" && <>
      <path d="M0 300Q190 130 400 285T1000 190V700H0" fill="#416950" /><path d="M0 400Q230 280 490 410T1000 350V700H0" fill="#244e3f" />
      {Array.from({ length: 22 }, (_, i) => <g key={i} transform={`translate(${i * 49} ${190 + i % 4 * 95})`}><path d="M0 300V0" stroke="#4c6242" strokeWidth="14" /><ellipse cy="0" rx={75 + i % 3 * 12} ry="105" fill={["#2f6048", "#517d50", "#3d7351"][i % 3]} /><path d="M0-65v130" stroke="#81a36e" opacity=".3" strokeWidth="3" /></g>)}
      <path d="M-40 580Q500 740 1040 345" fill="none" stroke="#bdad84" strokeWidth="70" /><path d="M-40 580Q500 740 1040 345" fill="none" stroke="#655b43" strokeWidth="49" strokeDasharray="7 12" /><path d="M-40 485Q500 645 1040 250M-40 510Q500 670 1040 275" fill="none" stroke="#bdb48d" strokeWidth="5" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 80} ${548 + 76 * Math.sin(i / 3) - i * 13}v-94`} stroke="#c4bb9b" strokeWidth="4" />)}
      <path d="M0 700V480Q100 360 125 530Q48 467 0 700M1000 700V400Q870 280 850 490Q945 430 1000 700" fill="#173e32" />
    </>}
    {name === "bali" && <>
      <path d="M0 270Q180 130 360 270T710 245T1000 190V700H0Z" fill="#648757" /><path d="M0 370Q200 290 420 390T1000 310V700H0" fill="#366842" />
      {Array.from({ length: 8 }, (_, i) => <g key={i}><path d={`M-20 ${410 + i * 47}Q210 ${295 + i * 49} 485 ${420 + i * 35}T1020 ${337 + i * 43}`} fill="none" stroke={i % 2 ? "#98b666" : "#b5c978"} strokeWidth="30" /><path d={`M-20 ${428 + i * 47}Q210 ${313 + i * 49} 485 ${438 + i * 35}T1020 ${355 + i * 43}`} fill="none" stroke="#315d3b" strokeWidth="9" /></g>)}
      {[150, 800, 895].map((x, i) => <g key={x} transform={`translate(${x} ${310 - i * 35})`}><path d="M0 0L20-150" stroke="#6d7050" strokeWidth="12" /><path d="M20-150Q-90-215-110-138Q-35-183 20-150M20-150Q120-215 144-128Q84-182 20-150M20-150Q-12-245 45-243Q10-201 20-150M20-150Q95-125 88-58Q56-127 20-150" fill="#214f35" /></g>)}
      <g transform="translate(520 320)"><rect x="-40" width="80" height="50" fill="#b79965" /><path d="M-75 0L0-55L75 0ZM-58-34L0-78L58-34ZM-38-66L0-102L38-66Z" fill="#39443b" /></g>
    </>}
    {(name === "iceland" || name === "patagonia") && <>
      <path d="M0 470L150 240L245 330L420 75L525 265L680 120L1000 430V700H0" fill="#72858a" /><path d="M150 240L120 320L167 295L190 311ZM420 75L332 219L410 183L452 219L472 175ZM680 120L610 250L670 218L710 247L750 216Z" fill="#f5f2e6" />
      <path d="M0 485L220 371L395 485L680 345L1000 505V700H0" fill="#486f67" /><rect y="548" width="1000" height="152" fill="#58a3aa" /><path d="M0 550Q250 505 400 570T1000 538" fill="none" stroke="#adcbd1" strokeWidth="5" />
      {name === "iceland" && <><path d="M600 350L760 360L738 555H615Z" fill="#e3eeea" /><path d="M640 365Q625 420 648 547M688 360Q702 454 679 551M733 367Q700 460 711 550" fill="none" stroke="#8fc4c6" strokeWidth="9" /><ellipse cx="680" cy="555" rx="95" ry="20" fill="#e2eae0" opacity=".7" /></>}
      <path d="M0 700L180 580L310 700M1000 700L860 570L730 700" fill="#365c53" />
    </>}
    {name === "mexico" && <>
      <rect y="290" width="1000" height="410" fill="#dcb68b" />
      {[0, 230, 460, 730].map((x, i) => <g key={x} transform={`translate(${x} ${205 + i % 2 * 45})`}><rect width="235" height="410" fill={["#cd8066", "#ddbd73", "#62a297", "#d79778"][i]} /><path d="M-8 0H243V22H-8" fill="#f0dbc3" />{[30, 130].map(a => [50, 160, 270].map(b => <g key={`${a}-${b}`}><rect x={a} y={b} width="58" height="75" rx="27" fill="#355d56" /><path d={`M${a - 6} ${b + 77}h70`} stroke="#e8d7ad" strokeWidth="8" /></g>))}</g>)}
      <path d="M0 130Q500 310 1000 130" stroke="#595c48" strokeWidth="3" fill="none" />{Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${i * 80} ${140 + 83 * Math.sin(i / 4)}l35 60 35-50Z`} fill={["#e5b548", "#d35f7e", "#5aa795"][i % 3]} />)}
      <path d="M80 620H920L990 700H0Z" fill="#bb9171" /><g transform="translate(425 550)"><rect width="180" height="115" fill="#eed7a8" /><path d="M-15 0H195L180-55H0Z" fill="#b05043" /><circle cx="45" cy="55" r="25" fill="#f3bf59" /><circle cx="115" cy="55" r="25" fill="#87a257" /></g>
    </>}
    <rect width="1000" height="700" fill="#f2dfb4" opacity=".045" />
  </svg>;
}
