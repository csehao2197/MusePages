import { useId } from "react";
type Props = { kind?: string; color?: string; title: string; className?: string };
export default function Art({ kind = "nigiri", color = "#dd8d85", title, className = "" }: Props) {
  const id = useId().replace(/:/g, "");
  const scene = ["hero", "chef", "room", "entrance"].includes(kind);
  return <svg className={`art ${className}`} viewBox={scene ? "0 0 1200 760" : "0 0 600 420"} role="img" aria-label={`${title} — original illustration`} preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`${id}bg`} x2="1" y2="1"><stop stopColor={scene ? "#171f25" : "#263034"} /><stop offset="1" stopColor="#070c11" /></linearGradient>
      <linearGradient id={`${id}wood`} x2="0" y2="1"><stop stopColor="#d6af74" /><stop offset=".5" stopColor="#997043" /><stop offset="1" stopColor="#493325" /></linearGradient>
      <linearGradient id={`${id}fish`} x2=".3" y2="1"><stop stopColor="#ffe4ca" /><stop offset=".25" stopColor={color} /><stop offset="1" stopColor={color} stopOpacity=".65" /></linearGradient>
      <radialGradient id={`${id}light`}><stop stopColor="#f7c078" stopOpacity=".6" /><stop offset="1" stopColor="#e79f4c" stopOpacity="0" /></radialGradient>
      <pattern id={`${id}grain`} width="80" height="19" patternUnits="userSpaceOnUse"><path d="M0 3Q30 9 80 2M0 16Q40 8 80 16" fill="none" stroke="#e8c892" strokeOpacity=".13" /></pattern>
    </defs>
    <rect width="1200" height="760" fill={`url(#${id}bg)`} />
    {scene ? <>
      {[130, 580, 1030].map(x => <g key={x}><path d={`M${x} 0v155`} stroke="#524438" strokeWidth="4" /><ellipse cx={x} cy="220" rx="170" ry="180" fill={`url(#${id}light)`} /><path d={`M${x - 44} 150h88l30 45h-148z`} fill="#b6a07b" /><ellipse cx={x} cy="195" rx="70" ry="9" fill="#f7cf94" /></g>)}
      <path d="M0 420L1200 360V760H0Z" fill={`url(#${id}wood)`} />
      <path d="M0 420L1200 360V760H0Z" fill={`url(#${id}grain)`} />
      {[455, 510, 590, 675].map(y => <path key={y} d={`M0 ${y}L1200 ${y - 60}`} stroke="#291e17" strokeOpacity=".5" />)}
      {kind === "entrance" ? <><rect x="360" y="60" width="480" height="650" fill="#161d20" stroke="#8a7353" strokeWidth="20" /><path d="M380 85h440v275H380z" fill="#354451" /><path d="M600 85v275" stroke="#151c22" strokeWidth="8" /><text x="600" y="270" textAnchor="middle" fill="#e7d0a0" fontSize="100">光</text><rect x="550" y="500" width="100" height="150" rx="45" fill="#e8b76c" /></> : <>
      {kind !== "room" && <g>
        <path d="M685 230Q795 140 905 250L980 440 642 455Z" fill="#d6d5ca" />
        <path d="M780 249l27 175m-44-158-18 132" stroke="#a8aba3" strokeWidth="3" />
        <path d="M779 120q-28 65 20 107 37 5 62-58l-11-73z" fill="#c39370" />
        <path d="M768 105q22-60 92-6l-8 33q-38-27-85 11z" fill="#151718" />
        <path d="M683 278q-49 33-76 172l-117 77 25 33 145-68 62-159" fill="#d4d5cb" />
        <path d="M514 521l-58 26q-28 15-10 24l39-5 49-23" fill="#cda17b" />
        <path d="M892 290l-25 131-94 52 15 33 126-41 29-135" fill="#ece9db" />
        <path d="M785 475l-49 5-50 34 20 10 73-23" fill="#cda17b" />
      </g>}
      <ellipse cx="365" cy="608" rx="200" ry="47" fill="#101b21" stroke="#5d6968" strokeWidth="3" />
      {[245, 347, 449].map((x, i) => <g key={x} transform={`translate(${x} 570) rotate(-8)`}><rect width="79" height="36" rx="19" fill="#e4d7b9" /><path d="M-5 8Q3-18 49-13L85-2 81 19Q42 27-5 8" fill={["#d89083", "#e6a745", "#e6b5a0"][i]} /><path d="M15-5l17 22m10-22 17 21" stroke="#fff0d3" strokeOpacity=".65" strokeWidth="4" /></g>)}
      <path d="M1000 507l-140 84m144-70-140 85" stroke="#35251d" strokeWidth="6" />
      <ellipse cx="940" cy="637" rx="50" ry="23" fill="#182329" /><ellipse cx="940" cy="630" rx="42" ry="15" fill="#394443" />
      </>}
    </> : kind === "sake" ? <>
      <ellipse cx="300" cy="345" rx="230" ry="33" fill="#080e12" />
      <path d="M265 90h65l-4 90q75 30 68 130-20 52-123 17-48-40-2-133z" fill="#c7c4ad" /><path d="M278 115h38m-39 12h38" stroke="#95937e" strokeWidth="5" />
      {[160, 430].map(x => <g key={x}><path d={`M${x - 40} 275l8 64q35 27 68 0l8-64z`} fill="#7e9391" /><ellipse cx={x} cy="275" rx="40" ry="13" fill="#d8d3b8" /><ellipse cx={x} cy="276" rx="29" ry="7" fill="#515b4f" /></g>)}
    </> : <>
      <ellipse cx="300" cy="284" rx="244" ry="88" fill="#0c151b" stroke="#455553" strokeWidth="3" />
      <ellipse cx="300" cy="277" rx="215" ry="66" fill="none" stroke="#273936" strokeWidth="2" />
      {(kind === "platter" ? [140, 255, 370] : [220, 340]).map((x, i) => <g key={x} transform={`translate(${x} ${kind === "platter" ? 204 + i * 10 : 205}) rotate(-12)`}>
        <rect x="-40" y="21" width="128" height="63" rx="30" fill="#e6dec8" />
        {Array.from({ length: 16 }, (_, j) => <ellipse key={j} cx={-23 + (j % 8) * 13} cy={48 + Math.floor(j / 8) * 18} rx="6" ry="3" fill="#fff7e5" transform={`rotate(${j * 4})`} />)}
        <path d="M-51 31Q-51-5-13-11L56-12Q94-5 99 21L89 55Q28 69-51 31Z" fill={`url(#${id}fish)`} />
        {Array.from({ length: 6 }, (_, j) => <path key={j} d={`M${-33 + j * 22} -4q-3 24 24 56`} fill="none" stroke="#fff3dc" strokeOpacity=".5" strokeWidth="3" />)}
        <path d="M64 7q16-25 31-12l-15 27z" fill="#74965e" />
      </g>)}
      <path d="M465 172q-35 4-36 45 30 8 47-18-9 41 14 39 19-41-9-58" fill="#779359" />
      <circle cx="110" cy="288" r="4" fill="#e6b851" /><circle cx="126" cy="293" r="3" fill="#e6b851" />
    </>}
  </svg>;
}
