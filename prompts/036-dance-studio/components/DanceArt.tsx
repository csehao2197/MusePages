export default function DanceArt({ pose = 0, color = "#cbbcff", title = "Original illustration of dancers in motion", hero = false }: { pose?: number; color?: string; title?: string; hero?: boolean }) {
  const figures = [
    "M125 105 Q143 118 147 155 L170 199 M144 135 L106 159 L76 136 M143 133 L182 98 L193 64 M149 158 L113 207 L92 246 M152 160 L200 182 L216 220",
    "M127 105 Q143 133 148 161 M138 132 L93 97 L63 106 M140 129 L180 91 L205 49 M149 162 L117 214 L69 233 M151 160 L199 159 L237 180",
    "M137 103 L141 157 M139 124 L108 90 L123 54 M142 123 L173 91 L158 53 M141 157 L117 221 L121 251 M144 156 L179 199 L222 185",
    "M130 103 L146 161 M140 129 L97 145 L66 118 M143 130 L181 122 L205 148 M146 161 L121 200 L86 222 M148 161 L174 212 L204 235",
    "M137 157 L174 189 M151 169 L115 196 L115 241 M151 168 L186 143 L204 107 M174 189 L214 169 L247 172 M174 190 L191 226 L232 231"
  ];
  return <svg viewBox={hero ? "0 0 1000 600" : "0 0 300 300"} role="img" aria-label={title} preserveAspectRatio="xMidYMid slice">
    <title>{title}</title>
    <rect width="1000" height="600" fill={hero ? "#baaea0" : color}/>
    {hero ? <>
      <path d="M0 0H1000V400H0Z" fill="#ddd4c2"/><path d="M100 0V400M340 0V400M580 0V400M820 0V400" stroke="#8a7d73" strokeWidth="8"/>
      <path d="M0 390H1000L1000 600H0Z" fill="#a37860"/><path d="M0 450H1000M0 530H1000M500 390L130 600M500 390L870 600" stroke="#c89a7d" strokeWidth="3"/>
      <path d="M60 0L500 390H700L390 0Z" fill="#fff3c3" opacity=".5"/>
      {[0, 1, 3].map((p, i) => <g key={p} transform={`translate(${170 + i * 235} 130) scale(1.5)`}><circle cx="132" cy="82" r="19" fill={["#4e302e", "#6d432e", "#432526"][i]}/><path d={figures[p]} fill="none" stroke={["#e11d48", "#252639", "#f9df97"][i]} strokeWidth="27" strokeLinecap="round" strokeLinejoin="round"/><path d="M116 114L148 109L163 155L133 172Z" fill={["#f85f7b", "#7165a4", "#f4c671"][i]}/></g>)}
      <path d="M0 555Q230 450 500 560T1000 520" fill="none" stroke="#fbcdda" strokeWidth="3" opacity=".6"/>
    </> : <>
      <circle cx="245" cy="65" r="93" fill="white" opacity=".25"/><path d="M-20 270Q70 190 170 250T330 210" fill="none" stroke="#fff" strokeWidth="3" opacity=".6"/>
      <ellipse cx="156" cy="266" rx="85" ry="9" fill="#1e1e2e" opacity=".13"/>
      <g transform={pose === 4 ? "translate(0 -5)" : ""}><circle cx={pose === 4 ? 122 : 131} cy={pose === 4 ? 144 : 82} r="18" fill="#57392f"/><path d={figures[pose % 5]} stroke="#272436" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d={pose === 4 ? "M137 151L167 167L183 187L167 201L141 181Z" : "M117 111L143 108L159 159L130 172Z"} fill="#e11d48"/></g>
      <path d="M37 58Q82 22 121 40M213 220Q239 245 269 228" fill="none" stroke="#e11d48" strokeWidth="3"/>
    </>}
  </svg>;
}
