import { useId } from "react";

export type SceneKind = "skyline" | "temple" | "crossing" | "market" | "forest" | "lights" | "electric" | "street";

/** Original vector scenes: intentionally illustrative, not documentary photography. */
export default function Scene({ kind = "skyline", label, className = "" }: { kind?: SceneKind; label: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const night = ["skyline", "crossing", "electric", "lights"].includes(kind);
  return (
    <svg className={`scene ${className}`} viewBox="0 0 900 600" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}sky`} x2="0" y2="1">
          <stop stopColor={night ? "#263658" : "#d9e9df"} />
          <stop offset=".55" stopColor={night ? "#cb9294" : "#f8dbc0"} />
          <stop offset="1" stopColor={night ? "#384563" : "#8cae94"} />
        </linearGradient>
        <linearGradient id={`${id}road`} x2="0" y2="1"><stop stopColor="#344755" /><stop offset="1" stopColor="#142937" /></linearGradient>
      </defs>
      <rect width="900" height="600" fill={`url(#${id}sky)`} />
      <circle cx={night ? 710 : 740} cy="116" r={night ? 37 : 58} fill={night ? "#f7dcc8" : "#fff0cc"} opacity=".75" />
      {kind === "skyline" && <>
        <path d="M190 360 421 127 641 360" fill="#727b91" /><path d="m353 197 68-70 66 69-30-7-32 19-33-18Z" fill="#f4e9e8" />
        <path d="M0 335Q180 268 316 340T650 317T900 345V600H0" fill="#45576e" />
      </>}
      {["skyline", "crossing", "electric", "street"].includes(kind) && <>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((b) => {
          const h = [220, 280, 180, 340, 245, 175, 305, 210, 260, 320, 195][b];
          return <g key={b}><rect x={b * 87 - 15} y={580 - h} width="78" height={h} fill={b % 2 ? "#243a4e" : "#30465b"} />
            {[0, 1, 2, 3, 4, 5].map(w => <g key={w}><rect x={b * 87 + 2} y={600 - h + w * 33} width="12" height="14" fill={w % 3 ? "#f2c99a" : "#567680"} opacity=".8" /><rect x={b * 87 + 29} y={600 - h + w * 33} width="18" height="14" fill="#e8c69c" opacity=".6" /></g>)}
            {b % 2 === 0 && <><rect x={b * 87 + 42} y={600 - h} width="24" height="105" rx="2" fill={b % 4 ? "#e6a957" : "#dd748e"} /><text x={b * 87 + 54} y={625 - h} fill="#fff6e9" fontSize="14" textAnchor="middle" writingMode="vertical-rl">東京 · 光</text></>}
          </g>;
        })}
        {kind === "skyline" && <g stroke="#f5aa83" fill="none" strokeWidth="6"><path d="m653 558 44-278 44 278M666 470h62M677 398h39M686 339h23M697 280v-59" /><path d="M671 461h54" strokeWidth="15" /></g>}
        <path d="M290 600 441 414 482 414 677 600" fill={`url(#${id}road)`} />
        {[0, 1, 2, 3, 4].map(n => <path key={n} d={`M${308 + n * 29} 580l115-142h10L${341 + n * 29} 580Z`} fill="#dce2df" opacity={kind === "crossing" ? ".8" : ".12"} />)}
        {kind === "crossing" && [0, 1, 2, 3, 4, 5, 6].map(n => <g key={n} transform={`translate(${345 + n * 37},${492 + n % 3 * 25})`}><circle cy="-15" r="6" fill="#eed2b9" /><path d="M0-9v22m0-13-9 12m9-12 8 12m-8 1-6 16m6-16 7 16" stroke={n % 2 ? "#d7b7a0" : "#839caa"} strokeWidth="5" /></g>)}
      </>}
      {["temple", "forest", "street"].includes(kind) && <>
        {[65, 160, 770, 845].map((x, i) => <g key={x}><path d={`M${x} 170v410`} stroke="#4f6550" strokeWidth="22" /><ellipse cx={x} cy={220 + i % 2 * 40} rx="95" ry="145" fill={kind === "forest" ? "#346052" : "#dbaeb1"} /><ellipse cx={x - 30} cy="210" rx="65" ry="110" fill={kind === "forest" ? "#467c62" : "#edc7c2"} /></g>)}
        <path d="M240 600 395 390h110l175 210" fill="#c1bda8" />
        <rect x="277" y="320" width="349" height="181" fill="#a64e3f" />
        <rect x="320" y="354" width="265" height="147" fill="#652f2c" />
        <path d="M209 326q110-18 242-105 135 88 244 105Z" fill="#364c4b" /><path d="M235 320h433" stroke="#be6a51" strokeWidth="15" />
        <path d="M283 266q84-14 168-72 87 58 170 72Z" fill="#364c4b" />
        {[337, 430, 550].map(x => <rect key={x} x={x} y="341" width="18" height="162" fill="#cb6a52" />)}
        <ellipse cx="456" cy="404" rx="28" ry="42" fill="#e4ab78" /><path d="M443 383h26m-25 10h24m-12-18v53" stroke="#924c38" strokeWidth="4" />
      </>}
      {kind === "market" && <>
        <path d="M180 600 407 300h80l257 300" fill="#a39d89" />
        {[0, 1, 2].map(n => <g key={n} transform={`translate(${n * 55},${n * -48})`}><path d="M0 330h290v270H0" fill="#a28f76" /><path d="M0 320h292l42 67H0Z" fill={n % 2 ? "#ede2bf" : "#ae5140"} /><path d="M23 402h245v160H23Z" fill="#544e41" /><path d="M10 560h289v40H10" fill="#aa7955" />{[70, 140, 210].map(x => <g key={x}><ellipse cx={x} cy="430" rx="16" ry="25" fill="#efc078" /><ellipse cx={x} cy="568" rx="26" ry="9" fill="#dfcab0" /></g>)}</g>)}
        <path d="M620 210h280v390H620Z" fill="#717c74" /><path d="m590 260 310-30v90H615Z" fill="#e4b868" /><text x="725" y="300" fill="#4b594e" fontSize="31">築地 市場</text>
      </>}
      {kind === "lights" && <>
        <rect y="260" width="900" height="340" fill="#142f39" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => <g key={n}><path d={`M${n * 113} 0v${220 + n % 3 * 70}`} stroke="#baccc6" opacity=".5" /><ellipse cx={n * 113} cy={240 + n % 3 * 70} rx="70" ry="102" fill={["#d69fd3", "#7ac6ce", "#edbf83"][n % 3]} opacity=".72" /><ellipse cx={n * 113} cy={525 + n % 3 * 20} rx="62" ry="21" fill={["#d69fd3", "#7ac6ce", "#edbf83"][n % 3]} opacity=".18" /></g>)}
        <path d="M445 545v-86" stroke="#19232b" strokeWidth="26" /><circle cx="445" cy="435" r="18" fill="#19232b" />
      </>}
      <rect width="900" height="600" fill="#152a37" opacity=".06" />
    </svg>
  );
}
