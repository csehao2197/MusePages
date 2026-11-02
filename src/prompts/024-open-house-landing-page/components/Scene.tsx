import { useId } from "react";
import type { SceneKind } from "./fixtures";

export function Scene({ kind, title }: { kind: SceneKind; title: string }) {
  const id = useId().replaceAll(":", "");
  const outside = ["exterior", "pool", "casita", "outdoor"].includes(kind);
  return <svg className={`scene scene-${kind}`} viewBox="0 0 960 620" role="img" aria-label={`${title} — original architectural illustration`} preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`${id}sky`} x2="0" y2="1"><stop stopColor="#3e5674"/><stop offset=".62" stopColor="#c99883"/><stop offset="1" stopColor="#e7c8a1"/></linearGradient>
      <linearGradient id={`${id}floor`} x2="1" y2="1"><stop stopColor="#e2d6bd"/><stop offset="1" stopColor="#a89c87"/></linearGradient>
      <linearGradient id={`${id}glass`} x2="0" y2="1"><stop stopColor="#e8c798"/><stop offset="1" stopColor="#98724b"/></linearGradient>
      <linearGradient id={`${id}water`} x2="1" y2="1"><stop stopColor="#8baaa9"/><stop offset="1" stopColor="#1c4c5b"/></linearGradient>
    </defs>
    {outside ? <>
      <rect width="960" height="620" fill={`url(#${id}sky)`}/>
      <path d="M0 265 126 170 239 254 368 198 512 270 665 173 808 256 960 193V620H0Z" fill="#59606a" opacity=".65"/>
      <path d="M0 322 175 240 360 321 550 265 710 332 960 265V620H0Z" fill="#756e6c"/>
      <rect y="426" width="960" height="194" fill="#8d816e"/>
      <rect x="104" y={kind === "casita" ? 282 : 223} width="682" height="235" fill="#d0bfa4"/>
      <path d="M84 221H804V246H84Z" fill="#eee1c9"/>
      <rect x="135" y="260" width="279" height="161" fill={`url(#${id}glass)`}/>
      <rect x="432" y="260" width="183" height="161" fill={`url(#${id}glass)`}/>
      <rect x="635" y="254" width="110" height="204" fill="#b3a58d"/>
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M640 ${270 + i * 25}h101`} stroke="#918776" strokeWidth="2"/>)}
      <path d="M225 260V421M322 260V421M521 260V421" stroke="#364449" strokeWidth="7"/>
      <rect x="153" y="347" width="178" height="39" rx="7" fill="#ebd5b6"/>
      <path d="M158 384H336M265 292V341M244 296H290" stroke="#645d51" strokeWidth="5"/>
      <path d="M489 372h90l-12-12h-68Z" fill="#4d5556"/>
      <rect x="478" y="300" width="63" height="6" fill="#f7dfa6"/>
      <path d="M0 517 393 444 822 462 960 580V620H0Z" fill="#b6a48b"/>
      <path d="M210 514 621 468 873 522 427 594Z" fill={`url(#${id}water)`}/>
      <path d="m238 520 389-38 211 43M292 542l387-35M350 567l389-40" stroke="#c4d9cc" opacity=".6" strokeWidth="3"/>
      <path d="M53 455V291q0-17 15-17t15 17v69h21v-47q0-14 12-14t12 14v56q0 12-12 12H83v74M874 445V246q0-17 14-17t14 17v89h20v-45q0-13 12-13t12 13v57q0 11-12 11h-32v87" fill="none" stroke="#343f38" strokeWidth="15" strokeLinecap="round"/>
      {kind === "pool" && <><ellipse cx="255" cy="467" rx="28" ry="13" fill="#313c3e"/><path d="m245 464 9-36 12 36" fill="#f3bd71"/><ellipse cx="777" cy="478" rx="28" ry="13" fill="#313c3e"/><path d="m767 475 9-36 12 36" fill="#f3bd71"/></>}
      {kind === "outdoor" && <><path d="M488 183H834V205H488ZM509 201V445M813 201V445" stroke="#4a4942" strokeWidth="12"/><rect x="529" y="359" width="257" height="96" fill="#a89b82"/><rect x="552" y="342" width="92" height="19" fill="#374145"/><path d="M531 189V207M569 189V207M608 189V207M647 189V207M686 189V207M725 189V207M764 189V207" stroke="#776a55" strokeWidth="10"/></>}
    </> : <>
      <rect width="960" height="620" fill="#eae2d4"/>
      <path d="M0 0H960V490L694 373H214L0 470Z" fill="#eee8dc"/>
      <path d="M0 470 214 373H694L960 490V620H0Z" fill={`url(#${id}floor)`}/>
      <path d="M0 620 280 374M170 620 380 374M550 620 560 374M910 620 679 374M0 530H960M0 579H960" stroke="#9a8a73" opacity=".25"/>
      <rect x="468" y="55" width="330" height="318" fill="#7e9295"/>
      <path d="M476 248 541 189 630 246 718 173 794 230V369H476Z" fill="#b5a48b"/>
      <path d="M471 275 614 224 794 279V369H471Z" fill="#cab493"/>
      <path d="M578 55V374M687 55V374M468 248H798" stroke="#464e4e" strokeWidth="8"/>
      <rect x="85" y="85" width="234" height="198" fill="#c3b69e"/>
      <path d="M123 242 181 153 233 210 278 131" stroke="#eee5ce" strokeWidth="5" fill="none"/>
      <rect x="62" y="364" width="35" height="72" fill="#7a7b62"/><path d="M80 372V278m0 45-31-22m31 10 25-34m-25 53 31-16" stroke="#6b775e" strokeWidth="9" strokeLinecap="round"/>
      {(kind === "kitchen" || kind === "detail") && <>
        <rect x="117" y="296" width="283" height="98" fill="#9f8a6a"/>
        <path d="M110 288H405V307H110Z" fill="#f6f1e6"/><rect x="132" y="307" width="64" height="82" fill="#414b4e"/>
        <path d="M211 312V381M295 312V381M379 312V381" stroke="#76644c" strokeWidth="2"/>
        <path d="M212 323h26M295 323h26M352 323h26" stroke="#d1b273" strokeWidth="4"/>
        <path d="m251 425 330-25 181 56-328 42Z" fill="#faf7ed"/>
        <path d="m251 425 183 73v90l-183-64Z" fill="#e7e0d0"/><path d="m434 498 328-42v90l-328 42Z" fill="#9e886a"/>
        <path d="M441 29V183M612 29V183" stroke="#6d6250" strokeWidth="4"/><ellipse cx="441" cy="187" rx="31" ry="17" fill="#c9a96e"/><ellipse cx="612" cy="187" rx="31" ry="17" fill="#c9a96e"/>
      </>}
      {kind === "living" && <>
        <rect x="102" y="285" width="250" height="51" fill="#777060"/><rect x="112" y="296" width="230" height="23" fill="#303b3e"/><path d="m132 313 9-13 11 13 14-14 13 14 9-12 10 12" fill="#e3af73"/>
        <rect x="166" y="385" width="369" height="105" rx="19" fill="#d5c4a8"/><rect x="166" y="372" width="369" height="47" rx="12" fill="#e5d8c1"/>
        <rect x="197" y="382" width="72" height="51" rx="5" fill="#ad9c80"/><rect x="422" y="382" width="72" height="51" rx="5" fill="#ad9c80"/>
        <ellipse cx="575" cy="485" rx="128" ry="43" fill="#5a5b52"/><path d="M508 498V540M645 498V540" stroke="#454d47" strokeWidth="10"/>
      </>}
      {kind === "bedroom" && <>
        <rect x="149" y="286" width="295" height="143" rx="8" fill="#a09078"/>
        <path d="m149 378 295-4 174 131H98Z" fill="#f8f3e8"/><path d="M98 505H618V557H98Z" fill="#d4c5ad"/>
        <path d="m148 385 296 1 88 75H119Z" fill="#e4dbcb"/><rect x="171" y="358" width="101" height="43" rx="9" fill="#faf7ee"/><rect x="289" y="358" width="101" height="43" rx="9" fill="#faf7ee"/>
        <path d="M98 481H599V508H98Z" fill="#9caa9c"/>
      </>}
      {kind === "bathroom" && <>
        <path d="M93 420Q86 518 275 518T451 420Z" fill="#f9f7ef"/><ellipse cx="272" cy="420" rx="178" ry="45" fill="#d2d1c6"/><ellipse cx="272" cy="420" rx="148" ry="26" fill="#f4f2e8"/>
        <path d="M133 415V351q0-25 25-25h24" fill="none" stroke="#b59661" strokeWidth="7"/>
        <rect x="614" y="46" width="262" height="478" fill="#e3e6df" opacity=".5" stroke="#848b86" strokeWidth="5"/><path d="M762 80V168H718M737 174h-35" stroke="#b29565" strokeWidth="6"/>
      </>}
      {kind === "office" && <>
        <rect x="110" y="80" width="244" height="267" fill="#8f7d61"/>
        <path d="M116 145H348M116 215H348M116 285H348M200 82V343M276 82V343" stroke="#d0bea1" strokeWidth="8"/>
        <path d="M133 137V103M148 137V110M163 137V94M222 204V164M237 204V160M252 204V172" stroke="#455754" strokeWidth="12"/>
        <path d="m218 419 331-14 106 35-330 29Z" fill="#9f8765"/><path d="M257 429V553M603 440V553" stroke="#676454" strokeWidth="10"/>
        <rect x="407" y="326" width="111" height="74" rx="5" fill="#364950"/><path d="M461 400V417" stroke="#364950" strokeWidth="7"/><rect x="379" y="467" width="113" height="80" rx="23" fill="#697768"/>
      </>}
      {kind === "dining" && <>
        <ellipse cx="484" cy="443" rx="282" ry="70" fill="#967c58"/><path d="M310 464V555M657 464V555" stroke="#635d4d" strokeWidth="16"/>
        {[225, 345, 465, 585, 705].map(x => <g key={x}><rect x={x} y="362" width="62" height="60" rx="18" fill="#c4b599"/><rect x={x} y="478" width="62" height="78" rx="18" fill="#c4b599"/></g>)}
        <path d="M484 0V133M344 138H624" stroke="#aa8b55" strokeWidth="8"/>{[344, 414, 484, 554, 624].map(x => <g key={x}><path d={`M${x} 133V196`} stroke="#aa8b55" strokeWidth="4"/><circle cx={x} cy="204" r="14" fill="#fff0ce"/></g>)}
      </>}
      {kind === "garage" && <>
        {[110, 360, 610].map(x => <g key={x}><rect x={x} y="100" width="210" height="284" fill="#9d9d91"/>{[135, 185, 235, 285, 335].map(y => <path key={y} d={`M${x} ${y}h210`} stroke="#777d73" strokeWidth="3"/>)}<rect x={x + 16} y="268" width="33" height="52" rx="5" fill="#344a4a"/><path d={`M${x + 39} 320q35 30 8 46`} fill="none" stroke="#344a4a" strokeWidth="5"/></g>)}
        <path d="m322 434 48-44h180l56 44 21 62H300Z" fill="#dedbd1"/><path d="m366 400 24-35h134l34 35Z" fill="#52696d"/><rect x="315" y="488" width="46" height="43" rx="10" fill="#374145"/><rect x="568" y="488" width="46" height="43" rx="10" fill="#374145"/>
      </>}
    </>}
    <rect x="18" y="18" width="924" height="584" fill="none" stroke="#fff" opacity=".12"/>
  </svg>;
}

export function FloorPlan() {
  const rooms = [
    [55, 55, 195, 130, "Primary suite"], [250, 55, 140, 130, "Primary bath"],
    [390, 55, 135, 130, "Bedroom 2"], [525, 55, 135, 130, "Bedroom 3"],
    [55, 185, 190, 170, "Great room"], [245, 185, 200, 170, "Kitchen / dining"],
    [445, 185, 110, 170, "Office"], [555, 185, 105, 170, "Bedroom 4"],
    [55, 355, 190, 130, "3-car garage"], [245, 355, 200, 130, "Entry / laundry"],
    [445, 355, 215, 130, "Bedroom 5 / bath"],
  ] as const;
  return <svg className="floorplan" viewBox="0 0 740 650" role="img" aria-label="Illustrative floor plan, not to scale. Five bedrooms, three-car garage and detached guest casita.">
    <rect width="740" height="650" fill="#f6f3eb"/>
    {rooms.map(([x,y,w,h,label]) => <g key={label}><rect x={x} y={y} width={w} height={h} fill={label.includes("Kitchen") ? "#e7dbc3" : "#eee9dd"} stroke="#556668" strokeWidth="3"/><text x={x+w/2} y={y+h/2} textAnchor="middle" fill="#35474e" fontSize="14">{label}</text></g>)}
    <path d="M80 30H640M30 75V470" stroke="#b39d75" strokeDasharray="5 5"/>
    <rect x="55" y="520" width="340" height="80" rx="2" fill="#bdcfcd"/><text x="225" y="565" textAnchor="middle" fontSize="16" fill="#35474e">Pool & covered terrace</text>
    <rect x="445" y="520" width="215" height="80" fill="#e7dbc3" stroke="#556668" strokeWidth="3"/><text x="550" y="565" textAnchor="middle" fontSize="15" fill="#35474e">Guest casita · 450 sq ft</text>
    <text x="55" y="635" fill="#6b756f" fontSize="12">CONCEPT ONLY · NOT TO SCALE · ROOM POSITIONS NOT VERIFIED</text>
  </svg>;
}
