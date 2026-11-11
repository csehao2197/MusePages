export type Scene = "plate" | "rows" | "cows" | "pasture" | "chef" | "room" | "patio" | "produce" | "wine";

export function Artwork({ scene, className = "" }: { scene: Scene; className?: string }) {
  return <svg viewBox="0 0 900 650" preserveAspectRatio="xMidYMid slice" className={`artwork ${className}`} aria-hidden="true" focusable="false">
    <rect width="900" height="650" fill={scene === "patio" ? "#34433b" : "#d9c6a6"} />
    {scene === "plate" ? <>
      <rect width="900" height="650" fill="#584033" />
      {Array.from({ length: 9 }, (_, i) => <g key={i}><path d={`M${i * 110} 0v650`} stroke="#2d241d" strokeWidth="5" /><path d={`M${i * 110 + 20} 0q45 140 8 310t18 340`} stroke="#81604a" fill="none" strokeWidth="2" /></g>)}
      <path d="M35 600L135 48 305 76 232 633Z" fill="#bbaa87" opacity=".8" />
      <ellipse cx="565" cy="348" rx="271" ry="261" fill="#211d15" opacity=".3" />
      <circle cx="544" cy="314" r="253" fill="#e8dfca" /><circle cx="544" cy="314" r="216" fill="#f6f0e3" stroke="#d5cbb7" strokeWidth="3" />
      <path d="M394 359C334 238 438 169 533 210S728 228 672 375 441 434 394 359" fill="#b98848" />
      <path d="M410 311q59-139 177-38t-31 119q-109 23-146-81" fill="#dda76a" />
      {[0, 1, 2, 3, 4, 5].map(i => <g key={i} transform={`translate(${414 + i * 40},${260 + (i % 2) * 102}) rotate(${i * 32})`}><ellipse rx="42" ry="15" fill="#52713b" /><path d="M-38 0h75" stroke="#a1b26b" /></g>)}
      {[0, 1, 2, 3].map(i => <g key={i} transform={`translate(${438 + i * 58},${224 + (i % 2) * 176})`}><circle r="15" fill="#af7591" /><circle cx="-10" cy="-6" r="10" fill="#dcb6c9" /><circle cx="10" cy="-6" r="10" fill="#dcb6c9" /><circle r="5" fill="#d6a449" /></g>)}
      <path d="M797 65l-35 249m-10-250-10 97m23-95-10 97m-30-99-10 97" stroke="#b5ac93" strokeWidth="9" strokeLinecap="round" />
      <circle cx="134" cy="148" r="66" fill="#e0d8c4" /><circle cx="134" cy="148" r="47" fill="#6c452e" /><ellipse cx="116" cy="131" rx="12" ry="7" fill="#bd9469" />
    </> : ["rows", "cows", "pasture"].includes(scene) ? <>
      <rect width="900" height="380" fill="#e9d8ac" /><circle cx="695" cy="147" r="67" fill="#e9b764" />
      <path d="M0 294Q220 116 445 288T900 250v400H0Z" fill="#89976b" /><path d="M0 397Q260 237 494 365T900 310v340H0Z" fill="#5e774d" />
      {scene === "rows" ? <>{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${410 + i * 14} 340L${-180 + i * 190} 650`} stroke={i % 2 ? "#9aa06a" : "#554f36"} strokeWidth="52" />)}<rect x="130" y="215" width="170" height="118" fill="#bfaa7d" /><path d="M106 220l108-88 112 88" fill="#8d5b40" /></> :
        <>{[0, 1, 2].map(i => <g key={i} transform={`translate(${190 + i * 228},${415 + (i % 2) * 50}) scale(${1 - i * .1})`}><ellipse rx="71" ry="38" fill={scene === "cows" ? "#ece8d6" : "#aa7c54"} /><path d="M-43 22v67m69-65v65" stroke="#423e2e" strokeWidth="15" /><ellipse cx="64" cy="-15" rx="24" ry="30" fill="#eee7d0" /><path d="M-25-33q-24 45 9 57t19-52" fill="#625c45" /></g>)}</>}
      <path d="M0 540l900 22M30 500v138m220-133v136m210-130v134m220-128v132m170-127v132" stroke="#bdb491" strokeWidth="9" />
    </> : scene === "chef" ? <>
      <rect width="900" height="650" fill="#b7b7a1" /><rect x="50" y="48" width="370" height="360" fill="#e4dfc9" /><path d="M237 48v360M50 228h370" stroke="#847f67" strokeWidth="17" />
      <path d="M380 650l25-263q94-70 204 0l108 263" fill="#eae6d9" /><ellipse cx="507" cy="256" rx="73" ry="98" fill="#b37c59" /><path d="M430 257q-36-158 116-134 62 19 42 117l-30-56q-71 38-126 18Z" fill="#44352a" />
      <path d="M440 382l68 50 80-55m-79 55v209" stroke="#bbb5a4" fill="none" strokeWidth="8" /><path d="M387 464l-140 123 58 36 137-101m180-59 104 115-60 31-100-88" fill="#b37c59" />
      <rect y="600" width="900" height="50" fill="#634b36" /><ellipse cx="478" cy="603" rx="177" ry="31" fill="#eee9d9" /><path d="M410 591q75-51 142 4" stroke="#658146" strokeWidth="23" />
      <path d="M700 150h142m-130 42h130m-130 40h100" stroke="#878c76" strokeWidth="18" />
    </> : scene === "produce" ? <>
      <rect width="900" height="650" fill="#817353" /><path d="M105 225h690l-55 365H170Z" fill="#b78a54" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${163 + i * 86} 230v350M120 ${270 + i * 44}h650`} stroke="#775e3b" strokeWidth="9" />)}
      {[0, 1, 2, 3, 4].map(i => <g key={i} transform={`translate(${230 + i * 96},${260 + (i % 2) * 115})`}><circle r="59" fill={i % 2 ? "#dca35b" : "#b35d3c"} /><path d="M-30-42l27 9 18-38 4 42 30-7-29 27" fill="#577343" /></g>)}
      <path d="M294 219q-116-192-150-73t121 100m269-37q97-218 136-104t-99 138" fill="#668148" /><path d="M452 241l64-154 31 173" fill="#769551" />
    </> : scene === "wine" ? <>
      <rect width="900" height="650" fill="#574637" /><path d="M0 393h900v257H0Z" fill="#b7a589" /><ellipse cx="332" cy="491" rx="197" ry="76" fill="#e7dfcc" /><ellipse cx="332" cy="491" rx="147" ry="49" fill="none" stroke="#b9ae96" strokeWidth="3" />
      <path d="M581 196h147l-13 168q-14 76-61 70t-58-70Z" fill="#d9d9ca" opacity=".75" /><path d="M594 307h124l-8 57q-21 90-68 48t-45-67" fill="#7c3c37" /><path d="M653 434v111m-60 8h121" stroke="#e0dacc" strokeWidth="8" />
      <path d="M835 33l-39 142 50 71-69 24-14-91 27-164" fill="#33432d" transform="rotate(-27 800 140)" /><path d="M766 232q-87 34-107 82" stroke="#984e3c" strokeWidth="9" fill="none" />
      <rect x="130" y="155" width="32" height="179" rx="8" fill="#e6c480" /><path d="M146 159q-25-33 0-65 23 29 0 65" fill="#e6a444" />
    </> : <>
      {scene === "room" ? <><rect width="900" height="420" fill="#796a51" /><path d="M0 53h900M90 0v430m270-430v430m270-430v430" stroke="#473f31" strokeWidth="28" /><rect x="122" y="101" width="181" height="273" fill="#b9bb96" /><rect x="390" y="101" width="181" height="273" fill="#b9bb96" /><path d="M210 101v273m269-273v273" stroke="#4e503c" strokeWidth="12" /></> : <><path d="M0 0q450 265 900 0m-900 140q450 275 900 0" fill="none" stroke="#bbaa7b" strokeWidth="4" />{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={i * 83} cy={65 + Math.sin(i / 11 * Math.PI) * 95} r="10" fill="#f4d492" />)}<path d="M80 650V230m-40 100q40-200 82 0m610 320V170m-47 88q49-168 101 0" stroke="#72845c" strokeWidth="30" /></>}
      <path d="M0 435h900v215H0Z" fill="#93826a" />
      {[0, 1, 2].map(i => <g key={i} transform={`translate(${160 + i * 287},${437 + (i % 2) * 71})`}><path d="M-111 39v114m225-114v114" stroke="#463a2e" strokeWidth="12" /><ellipse rx="124" ry="49" fill="#e5dbc4" /><ellipse cx="-52" rx="37" ry="16" fill="#f7f0de" /><ellipse cx="56" rx="37" ry="16" fill="#f7f0de" /><rect x="-4" y="-47" width="9" height="44" fill="#e5bb66" /><path d="M0-49q-10-18 0-28 10 14 0 28" fill="#f5d598" /></g>)}
    </>}
    <rect width="900" height="650" fill="#b89562" opacity=".06" />
  </svg>;
}

export function Wheat({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 90 130" aria-hidden="true" fill="none" focusable="false">
    <path d="M44 126Q51 85 45 13M46 37Q20 40 24 16q23 5 22 21Zm0 20Q15 59 20 36q23 5 26 21Zm2 20Q19 79 21 57q21 3 27 20Zm0 19Q20 99 25 79q22 1 23 17ZM46 37q27-4 20-26-23 7-20 26Zm1 19q31-2 27-26-26 7-27 26Zm1 20q29 0 28-23-24 4-28 23Zm0 20q29 1 27-20-22 1-27 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>;
}
