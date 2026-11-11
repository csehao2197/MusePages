import type { Project } from "@/lib/data";

export function Artwork({ project: p, variant = 0, decorative = false }: { project: Project; variant?: number; decorative?: boolean }) {
  if (variant === 1) return <svg viewBox="0 0 800 600" role="img" aria-label={p.captions[1]} xmlns="http://www.w3.org/2000/svg">
    <title>{p.captions[1]}</title><rect width="800" height="600" fill="#eee9dc" />
    <text x="35" y="46" fontFamily="Arial,sans-serif" fontSize="12" letterSpacing="2" fill={p.ink}>01 / A WORKING VISUAL LANGUAGE</text>
    <svg x="35" y="80" width="430" height="322" aria-hidden="true"><Artwork project={p} decorative /></svg>
    <rect x="35" y="420" width="430" height="135" fill={p.ink} />
    <text x="55" y="451" fontFamily="Arial,sans-serif" fontSize="11" letterSpacing="2" fill={p.color}>{p.category.toUpperCase()} / APPLICATION STUDY</text>
    <text x="55" y="493" fontFamily="Georgia,serif" fontSize="33" fill={p.color}>{p.slug === "common-ground" ? "Make room. Make together." : p.slug === "offbeat" ? "Listen a little differently." : p.slug === "fieldwork" ? "A ritual, not a rush." : p.slug === "margin-notes" ? "Leave a little space." : p.slug === "open-index" ? "Find a different perspective." : "One chapter at a time."}</text>
    <text x="55" y="531" fontFamily="Arial,sans-serif" fontSize="10" letterSpacing="1" fill={p.color}>ORIGINAL APPLICATION COPY / NOT A LIVE PRODUCT OR EVENT</text>
    <g fill={p.ink} fontFamily="Arial,sans-serif">
      <text x="500" y="100" fontSize="10" letterSpacing="2">THE PALETTE</text>
      <rect x="500" y="120" width="110" height="75" fill={p.color} /><rect x="620" y="120" width="140" height="75" fill={p.ink} />
      <text x="500" y="216" fontSize="11">{p.color.toUpperCase()}</text><text x="620" y="216" fontSize="11">{p.ink.toUpperCase()}</text>
      <path d="M500 247h260" stroke={p.ink} strokeWidth=".7" />
      <text x="500" y="282" fontSize="10" letterSpacing="2">THE TYPOGRAPHY</text>
      <text x="500" y="350" fontFamily={p.category === "Digital" || p.category === "Campaign" ? "Arial,sans-serif" : "Georgia,serif"} fontSize="68">Aa Bb</text>
      <text x="500" y="385" fontSize="12">Clear information. Quiet detail.</text>
      <path d="M500 416h260" stroke={p.ink} strokeWidth=".7" />
      <text x="500" y="451" fontSize="10" letterSpacing="2">THE GRID / SIX COLUMNS</text>
      {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={500 + i * 44} y="470" width="35" height="85" fill={p.color} stroke={p.ink} strokeWidth=".5" />)}
      <text x="35" y="582" fontSize="9" letterSpacing="2">MARA VALE / CONCEPT SYSTEM BOARD / {p.year}</text>
    </g>
  </svg>;
  if (variant === 2) return <svg viewBox="0 0 800 600" role="img" aria-label={p.captions[2]} xmlns="http://www.w3.org/2000/svg">
    <title>{p.captions[2]}</title><rect width="800" height="600" fill="#f3efe3" />
    <g stroke="#cfc8b9" strokeWidth=".6">{Array.from({ length: 18 }, (_, i) => <path key={i} d={`M25 ${70 + i * 28}h750`} />)}</g>
    <g fill={p.ink} fontFamily="Arial,sans-serif">
      <text x="35" y="42" fontSize="12" letterSpacing="2">02 / DIRECTION BEFORE DECORATION</text>
      <text x="35" y="99" fontFamily="Georgia,serif" fontSize="36">{p.name} / exploration sheet</text>
      {[0, 1, 2].map(i => <g key={i} transform={`translate(${35 + i * 250} 145)`}>
        <rect width="230" height="220" fill={i === 2 ? p.color : "#f3efe3"} stroke={p.ink} strokeWidth=".8" />
        <g fill="none" stroke={p.ink} strokeWidth="3" strokeLinecap="round">
          {p.slug === "common-ground" ? i === 0 ? <path d="M52 135V80l60-40 60 40v75H52m43 0v-44h35v44" /> : i === 1 ? <><ellipse cx="92" cy="105" rx="45" ry="65" transform="rotate(-30 92 105)" /><ellipse cx="140" cy="105" rx="45" ry="65" transform="rotate(30 140 105)" /></> : <><path d="M45 155V95a48 48 0 0 1 96 0v60M93 155V95a48 48 0 0 1 96 0v60" strokeWidth="15" /><path d="M33 176h168" strokeDasharray="3 7" /></> :
          p.slug === "offbeat" ? i === 0 ? <path d="M25 110q15-90 30 0t30 0t30 0t30 0t30 0t30 0" /> : <>{[0, 1, 2].map(n => <circle key={n} cx={58 + n * 54} cy={i === 1 ? 110 : n % 2 ? 132 : 90} r="35" fill={i === 2 && n !== 1 ? p.ink : "none"} />)}</> :
          p.slug === "fieldwork" ? i === 0 ? <text x="70" y="141" fill={p.ink} stroke="none" fontFamily="Georgia,serif" fontSize="80">fw</text> : <>{[0, 1, 2, 3].map(n => <ellipse key={n} cx="115" cy="110" rx={20 + n * 20} ry={12 + n * 16} transform={i === 2 ? "rotate(-12 115 110)" : undefined} />)}</> :
          p.slug === "margin-notes" || p.slug === "open-index" ? <>{[0, 1, 2].map(n => <g key={n} transform={`translate(${28 + n * 60} ${i === 0 ? 45 + n * 20 : 45})`}><rect width="48" height={i === 2 ? 120 : 100} /><path d="M7 25h34m-34 12h25m-25 12h34" /></g>)}{i === 2 && <path d="M22 182h187" strokeDasharray="2 7" />}</> :
          i === 0 ? <path d="M28 66q44-15 87 10 43-25 87-10v95q-43-15-87 10-43-25-87-10zm87 10v95" /> : <><ellipse cx="115" cy="110" rx={i === 1 ? 55 : 78} ry="45" /><path d="M25 111h180" strokeWidth={i === 2 ? 7 : 2} /></>}
        </g>
        <text x="13" y="202" fontSize="9" letterSpacing="1">{i === 0 ? "A / FIRST THOUGHT" : i === 1 ? "B / ALTERNATE TERRITORY" : "C / SELECTED DIRECTION"}</text>
      </g>)}
      <text x="35" y="412" fontSize="12">A / Too literal. A familiar starting point, not the final answer.</text>
      <text x="35" y="445" fontSize="12">B / Exploring rhythm, proportion, and a different organizing idea.</text>
      <text x="35" y="478" fontSize="12">C / A simpler system with space to adapt across formats.</text>
      <text x="35" y="538" fontFamily="Georgia,serif" fontSize="22" fontStyle="italic">Simplify the form. Keep the character.</text>
      <text x="35" y="581" fontSize="9" letterSpacing="2">ORIGINAL VECTOR SKETCH STUDIES / RECONSTRUCTED CONCEPT PROCESS / NOT CLIENT APPROVALS</text>
    </g>
  </svg>;
  return <svg viewBox="0 0 800 600" role={decorative ? undefined : "img"} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : p.captions[variant]} xmlns="http://www.w3.org/2000/svg">
    {!decorative && <title>{p.captions[variant]}</title>}
    <rect width="800" height="600" fill={p.color} />
    <g fill={p.ink} transform={variant === 2 ? "translate(-150 -80) scale(1.45)" : variant === 1 ? "translate(60 20) scale(.86)" : undefined}>
      {p.slug === "common-ground" && <>
        <path d="M225 330V237a112 112 0 0 1 224 0v93h-54v-93a58 58 0 0 0-116 0v93z" />
        <path d="M352 330V237a112 112 0 0 1 224 0v93h-54v-93a58 58 0 0 0-116 0v93z" />
        <text x="400" y="425" textAnchor="middle" fontFamily="Georgia,serif" fontSize="67" letterSpacing="-3">Common Ground</text>
        <text x="400" y="469" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="13" letterSpacing="5">A SPACE BETWEEN US</text>
      </>}
      {p.slug === "offbeat" && <>
        {[0, 1, 2, 3].map(i => <circle key={i} cx={232 + i * 112} cy={i % 2 ? 245 : 210} r="96" fill={i % 2 ? p.color : p.ink} stroke={p.ink} strokeWidth="17" />)}
        <text x="66" y="445" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="126" letterSpacing="-9">offbeat.</text>
        <text x="75" y="493" fontFamily="Arial,sans-serif" fontSize="16" letterSpacing="4">A DIFFERENT KIND OF LISTENING</text>
      </>}
      {p.slug === "fieldwork" && <>
        <rect x="205" y="73" width="390" height="458" fill="#f3eddf" transform="rotate(-8 400 300)" />
        <g transform="rotate(-8 400 300)">{[0, 1, 2, 3, 4].map(i => <ellipse key={i} cx="400" cy="214" rx={50 + i * 23} ry={23 + i * 18} fill="none" stroke={p.ink} strokeWidth="2" />)}
          <text x="400" y="364" textAnchor="middle" fontFamily="Georgia,serif" fontSize="59">fieldwork</text>
          <path d="M245 397h310" stroke={p.ink} />
          <text x="400" y="435" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="13" letterSpacing="3">01 / BOTANICAL SOAP</text>
          <text x="400" y="482" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11">PACKAGING CONCEPT — NOT FOR SALE</text>
        </g>
      </>}
      {p.slug === "margin-notes" && <>
        <rect x="159" y="59" width="482" height="488" fill="#f5eee7" transform="rotate(6 400 300)" />
        <g transform="rotate(6 400 300)">
          <text x="190" y="104" fontFamily="Arial,sans-serif" fontSize="12" letterSpacing="3">A JOURNAL OF THE IN-BETWEEN</text>
          <text x="187" y="255" fontFamily="Georgia,serif" fontSize="94" letterSpacing="-6">margin</text>
          <text x="187" y="345" fontFamily="Georgia,serif" fontSize="94" fontStyle="italic" letterSpacing="-6">notes</text>
          <path d="M191 382h414" stroke={p.ink} />
          <text x="193" y="503" fontFamily="Arial,sans-serif" fontSize="100">01</text>
          <text x="378" y="485" fontFamily="Arial,sans-serif" fontSize="12">SPACE TO THINK.</text>
        </g>
      </>}
      {p.slug === "open-index" && <>
        <text x="70" y="123" fontFamily="Arial,sans-serif" fontSize="57" letterSpacing="-3">Open Index ↗</text>
        {[0, 1, 2].map(i => <g key={i} transform={`translate(${70 + i * 225} 180)`}>
          <rect width="210" height="296" fill={i === 1 ? p.ink : "#eaf0f5"} />
          <circle cx="105" cy="108" r={55 - i * 10} fill={i === 1 ? p.color : p.ink} />
          <path d="M18 224h174M18 245h110" stroke={i === 1 ? p.color : p.ink} />
          <text x="18" y="278" fontFamily="Arial,sans-serif" fontSize="13" fill={i === 1 ? p.color : p.ink}>00{i + 1} / COLLECTION</text>
        </g>)}
      </>}
      {p.slug === "slow-days" && <>
        <ellipse cx="400" cy="230" rx="157" ry="86" />
        <rect x="210" y="230" width="380" height="100" fill={p.color} />
        <path d="M125 232h550" stroke={p.ink} strokeWidth="2" />
        <text x="400" y="375" textAnchor="middle" fontFamily="Georgia,serif" fontSize="83" letterSpacing="-4">slow days</text>
        <text x="400" y="438" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="13" letterSpacing="5">READ. REST. REPEAT.</text>
      </>}
    </g>
    <text x="24" y="576" fontSize="9" fontFamily="Arial,sans-serif" fill={p.ink} letterSpacing="2">MARA VALE / ORIGINAL CONCEPT STUDY / {p.year}</text>
    <text x="776" y="576" textAnchor="end" fontSize="10" fontFamily="Arial,sans-serif" fill={p.ink}>0{variant + 1}</text>
  </svg>;
}
