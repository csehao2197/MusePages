import type { Deal } from "./deals";
export default function Landscape({deal, large=false}: {deal: Pick<Deal,"title"|"style"|"color">;large?:boolean}) {
  return <svg className={`landscape ${large?"large":""}`} viewBox="0 0 600 360" role="img" aria-label={`Original illustrated postcard of ${deal.title}`}>
    <rect width="600" height="360" fill={deal.color}/>
    <circle cx="467" cy="74" r="39" fill="#fff0c9"/>
    <path d="M0 185Q100 120 210 170T420 148T600 160V360H0Z" fill="#ffffff" opacity=".22"/>
    {deal.style==="city"&&/Kyoto|Tokyo/.test(deal.title)?<>
      <path d="M0 260Q120 190 290 245T600 235V360H0Z" fill="#7f8e81"/>
      <path d="M0 317Q210 277 600 329V360H0Z" fill="#e7c8b3"/>
      <g fill="#734e48"><rect x="253" y="124" width="94" height="162"/><rect x="275" y="75" width="50" height="55"/></g>
      {[95,155,215,275].map((y,i)=><g key={y}><path d={`M${250-i*22} ${y}Q300 ${y-28} ${350+i*22} ${y}L${365+i*22} ${y+12}Q300 ${y+4} ${235-i*22} ${y+12}Z`} fill="#534c50"/><path d={`M${265-i*15} ${y+18}h${70+i*30}`} stroke="#ebba86" strokeWidth="4"/></g>)}
      <path d="M88 314Q103 195 65 121M86 223L33 181M89 202L137 154" stroke="#745350" strokeWidth="9" fill="none"/>
      {[[47,166],[65,121],[126,145],[30,181],[90,165]].map(([x,y])=><g key={x}><circle cx={x} cy={y} r="24" fill="#e6b6bc"/><circle cx={x+13} cy={y-9} r="18" fill="#f5d0ce"/></g>)}
    </>:deal.style==="city"?<>
      <path d="M0 295L80 243L190 257L290 222L400 270L600 228V360H0Z" fill="#466776"/>
      {[25,95,168,243,316,391,466,535].map((x,i)=><g key={x} transform={`translate(${x} ${150+(i%3)*28})`}><rect width="60" height="154" fill={["#f5dfb5","#d26e50","#fbebd1"][i%3]}/><path d="M-5 0L30-25L65 0Z" fill="#9b543e"/>{[20,55,90].map(y=><g key={y}><rect x="12" y={y} width="10" height="17" fill="#466776"/><rect x="38" y={y} width="10" height="17" fill="#466776"/></g>)}</g>)}
      <path d="M0 342Q240 290 600 345" stroke="#f5d6a5" strokeWidth="22" fill="none"/>
    </>:deal.style==="coast"?<>
      <path d="M0 250Q160 220 260 247T600 218V360H0Z" fill="#2b8ea3"/>
      <path d="M0 150L200 203L305 360H0Z" fill="#e4c4a4"/>
      {[30,95,160,225].map((x,i)=><g key={x} transform={`translate(${x} ${138+i*30})`}><rect width="80" height="77" rx="3" fill={deal.title.includes("Italy")?["#eebc8a","#f5dfb5","#dd9079"][i%3]:"#fffaf0"}/>{deal.title.includes("Italy")?<path d="M-5 0L40-20L85 0Z" fill="#af6955"/>:<path d="M10 0A30 30 0 0 1 70 0" fill="#357daa"/>}<rect x="26" y="26" width="18" height="30" rx="9" fill="#408aa8"/></g>)}
      <path d="M330 285h180m-120 27h100" stroke="#c5eff0" strokeWidth="3"/>
    </>:deal.style==="desert"?<>
      <path d="M0 247Q110 130 310 264Q455 170 600 223V360H0Z" fill="#e7ba83"/>
      <path d="M0 320Q220 203 440 315T600 298V360H0Z" fill="#c17d58"/>
      <path d="M120 290V190h48v-65h30v65h55v100Z" fill="#a36950"/><path d="M129 191h110" stroke="#f3cc94" strokeWidth="7"/>
    </>:deal.style==="snow"?<>
      <path d="M0 300L165 105L285 282L405 82L600 305V360H0Z" fill="#446278"/>
      <path d="M90 194L165 105L224 186L176 170L145 190ZM335 166L405 82L473 168L418 147L387 177Z" fill="#eff7f4"/>
      <path d="M0 320Q220 279 600 321V360H0Z" fill="#dce9eb"/>
      <path d="M30 95Q210 10 330 103T580 40" stroke="#a1e4cf" strokeWidth="24" opacity=".35" fill="none"/>
    </>:deal.title==="Maldives"?<>
      <path d="M0 194Q240 180 600 215V360H0Z" fill="#279fae"/>
      <path d="M600 290Q425 205 228 225" stroke="#e5c49b" strokeWidth="16" fill="none"/>
      {[125,255,385].map((x,i)=><g key={x} transform={`translate(${x} ${195+i*23})`}><path d="M0 50V83M75 50V83" stroke="#846c57" strokeWidth="5"/><rect width="75" height="52" fill="#d2ad86"/><path d="M-10 0L37-35L85 0Z" fill="#927356"/><rect x="20" y="14" width="32" height="24" fill="#367b86"/></g>)}
      <path d="M20 295h120m230 31h120" stroke="#bceae8" strokeWidth="3"/>
    </>:<>
      <path d="M0 218Q210 190 600 227V360H0Z" fill="#2f9faa"/><path d="M0 318Q190 249 395 290T600 309V360H0Z" fill="#f5dfb4"/>
      <path d="M440 290Q427 204 454 146" fill="none" stroke="#73584b" strokeWidth="10"/>
      <path d="M451 152Q396 110 362 153Q399 141 451 162Q484 106 531 141Q487 135 450 162Q495 150 538 183Q489 166 450 164Z" fill="#315f51"/>
      <path d="M100 290V245H205V290M88 245L151 205L218 245Z" fill="#927a60"/><path d="M235 260h100" stroke="#dcf7ef" strokeWidth="3"/>
    </>}
    <text x="25" y="335" fill="#fff" fontSize="11" letterSpacing="3" fontFamily="sans-serif">FAREFINDER · ILLUSTRATED ESCAPES</text>
  </svg>;
}
