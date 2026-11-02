import { useId } from "react";
import type { Truck } from "./data";

export function FoodArt({ kind, color, className = "" }: { kind: Truck["art"]; color: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return <svg viewBox="0 0 360 240" className={className} aria-hidden="true">
    <defs><pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 0h24v24H0z" fill={color}/><path d="M0 12h24M12 0v24" stroke="#fff" opacity=".16"/></pattern></defs>
    <path d="M0 0h360v240H0z" fill={`url(#${id})`}/>
    <ellipse cx="182" cy="140" rx="131" ry="74" fill="#30271f" opacity=".14"/>
    <ellipse cx="175" cy="124" rx="132" ry="76" fill="#fff9e7" stroke="#f2e4c7" strokeWidth="7"/>
    {kind === "tacos" ? <g stroke="#a4621e" strokeWidth="3">
      {[0, 1, 2].map((n) => <g key={n} transform={`translate(${77 + n * 66} ${83 + n * 11}) rotate(-15)`}>
        <path d="M0 33Q30-35 65 28L58 63Q28 73 3 53Z" fill="#f5ba47"/>
        <path d="M7 32Q30 3 58 28L51 46 10 47Z" fill="#873d27"/>
        <path d="m12 28 10-8 9 9 12-8 10 13" fill="none" stroke="#6a9e37" strokeWidth="9"/>
        <path d="m20 25 4 10m20-8 3 11" stroke="#f5e9be" strokeWidth="5"/>
      </g>)}</g> : kind === "bao" ? <g>{[0, 1, 2].map(n => <g key={n} transform={`translate(${65 + n * 73} ${77 + (n % 2) * 18})`}>
        <path d="M0 37Q2-14 35-5Q66-4 64 48L3 53Z" fill="#fff4df" stroke="#dfd0b2" strokeWidth="3"/>
        <path d="M10 34Q35 12 55 34L48 45 11 46" fill="#925134"/>
        <path d="m13 29 15-7 9 8 12-6" stroke="#63a373" strokeWidth="8" fill="none"/>
      </g>)}</g> : kind === "icecream" ? <g>
        <path d="m105 119 13 73h120l13-73Z" fill="#e44d7e" stroke="#903857" strokeWidth="3"/>
        {[0, 1, 2, 3, 4].map(n => <g key={n} transform={`translate(${115 + n * 24} 92)`}><path d="M0 33V0Q12-24 22 0v33" fill="#ffe4ea" stroke="#ca7b99" strokeWidth="3"/><ellipse cx="11" cy="0" rx="9" ry="12" fill="#fcb4ca"/><path d="M11-8q-9 6 0 15q9-5 0-11" fill="none" stroke="#d46587" strokeWidth="2"/></g>)}
        <path d="m225 59 10-38 7 2-11 52" fill="#733827"/><circle cx="159" cy="77" r="12" fill="#e73d46"/><path d="m159 65 7-14" stroke="#5d8743" strokeWidth="4"/>
      </g> : kind === "wrap" || kind === "lobster" ? <g transform="rotate(-15 175 125)">
        <path d="M73 92q105-48 202 0l-12 62q-88 44-176 0Z" fill="#e2ac5a" stroke="#a66931" strokeWidth="4"/>
        <path d="M88 98q88-34 169 0l-8 31q-80 33-150 0Z" fill={kind === "lobster" ? "#f3b8a1" : "#82683d"}/>
        <path d="m100 104 22-12 20 10 25-10 22 12 27-9 24 13" stroke="#6e9b4b" strokeWidth="9" fill="none"/>
        <path d="m105 119 13 6m33-14 12 8m38-9 12 9m25-9 9 5" stroke={kind === "lobster" ? "#ec7d6b" : "#e2d1a4"} strokeWidth="9"/>
      </g> : kind === "bbq" ? <g>
        <path d="m87 87 100-16 51 58-103 28Z" fill="#713e2d" stroke="#452a22" strokeWidth="4"/>
        {[0, 1, 2, 3, 4].map(n => <path key={n} d={`m${95 + n * 18} ${86 - n * 2} 37 60`} stroke="#b76742" strokeWidth="6"/>)}
        <path d="m217 71 53 18-8 42-48-17Z" fill="#e8b653" stroke="#b48431" strokeWidth="3"/>
        <ellipse cx="219" cy="163" rx="39" ry="19" fill="#d99636"/><path d="m194 162 10-6 10 10 10-10 10 8" fill="none" stroke="#ffdc83" strokeWidth="6"/>
      </g> : <g>
        <path d="M90 115q3-58 86-58t90 58Z" fill={kind === "slider" ? "#eab161" : "#e2b75e"} stroke="#ae792f" strokeWidth="4"/>
        <path d="m100 124 16-9 20 11 20-13 20 10 20-12 20 12 23-9 19 10" fill="none" stroke="#6c9f40" strokeWidth="13"/>
        <path d="M98 133h160v23H98Z" fill="#814832"/><path d="m101 131 75 18 72-18" fill="#f1be4a"/>
        <path d="M92 165h174q-7 26-86 26t-88-26Z" fill="#e4a14b" stroke="#ad7536" strokeWidth="3"/>
        <path d="m136 78 3 6m37-12 4 5m28 6 5-4m-53 13 6 3" stroke="#fff1c4" strokeWidth="4"/>
      </g>}
    <path d="m32 35 5-10 5 10 11 3-10 6-3 11-6-10-11-4Zm279 159 5-9 5 9 10 3-9 5-3 10-6-9-10-4Z" fill="#fff6cf"/>
    <path d="m23 199 23-7m258-156 20 7" stroke="#fff6cf" strokeWidth="4" strokeLinecap="round"/>
  </svg>;
}

export function TacoMark() {
  return <svg viewBox="0 0 48 40" aria-hidden="true"><path d="M3 22Q24-10 45 22L40 34H8Z" fill="#f5b842" stroke="currentColor" strokeWidth="2"/><path d="m8 20 9-7 8 8 8-7 8 6" fill="none" stroke="#51995a" strokeWidth="5"/><path d="M9 24q15 10 30 0" fill="none" stroke="#e11d48" strokeWidth="4"/><path d="m17 26 1 4m12-4 2 4" stroke="#fff4d8" strokeWidth="3"/></svg>;
}
