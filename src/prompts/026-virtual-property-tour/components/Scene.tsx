import { useId } from "react";
import type { RoomId } from "./data";

// Original vector interiors: deliberately illustrated, not photographic panoramas.
export default function Scene({ room, empty = false, label = true }: { room: RoomId; empty?: boolean; label?: boolean }) {
  const instance = useId();
  const drawingId = `${room}-${instance.replace(/[^a-zA-Z0-9]/g, "")}`;
  const terrace = room === "terrace";
  return <svg viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice" role={label ? "img" : undefined} aria-hidden={!label} aria-label={`Original ${room === "bedroom" ? "primary bedroom" : room} illustration, with warm wood, sculptural furnishings and garden light`}>
    <defs>
      <linearGradient id={`wall-${drawingId}`} x2="0.8" y2="1"><stop stopColor="#e9e4d6" /><stop offset="1" stopColor="#c9c4b5" /></linearGradient>
      <linearGradient id={`floor-${drawingId}`} x2="0.3" y2="1"><stop stopColor="#ad8e6e" /><stop offset="1" stopColor="#d0b694" /></linearGradient>
      <linearGradient id={`glass-${drawingId}`} x2=".8" y2="1"><stop stopColor="#d5ddcf" /><stop offset="1" stopColor="#91a58a" /></linearGradient>
      <linearGradient id={`sofa-${drawingId}`} x2="0.5" y2="1"><stop stopColor="#eddfc7" /><stop offset="1" stopColor="#c5b49b" /></linearGradient>
      <radialGradient id={`light-${drawingId}`}><stop stopColor="#fffbe9" stopOpacity=".5" /><stop offset="1" stopColor="#fffbe9" stopOpacity="0" /></radialGradient>
      <filter id={`shadow-${drawingId}`} x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur stdDeviation="13" /></filter>
      <pattern id={`grain-${drawingId}`} width="64" height="70" patternUnits="userSpaceOnUse" patternTransform="skewX(-28)"><path d="M0 0V70 M2 0V70" stroke="#766044" strokeOpacity=".15" /><path d="M12 2q20 25 0 65 M44 0q-20 35 0 70" fill="none" stroke="#f1dfbf" strokeOpacity=".15" /></pattern>
    </defs>
    <rect width="1200" height="760" fill={`url(#wall-${drawingId})`} />
    <path d="M0 0H1200L1000 135H215Z" fill="#eee9dc" />
    <path d="M0 0L215 135V470L0 650Z" fill="#c8c0af" />
    <path d="M1000 135L1200 0V650L1000 470Z" fill="#b3aa99" />
    <path d="M0 650L215 470H1000L1200 650V760H0Z" fill={`url(#floor-${drawingId})`} />
    <path d="M0 650L215 470H1000L1200 650V760H0Z" fill={`url(#grain-${drawingId})`} />
    <path d="M210 470H1008" stroke="#766a54" strokeWidth="7" />
    {terrace ? <>
      <rect x="0" y="0" width="1200" height="520" fill="#b5c5b2" />
      <path d="M0 320Q180 140 350 280Q500 90 700 260Q1000 70 1200 250V530H0Z" fill="#73886a" />
      <path d="M0 400Q180 290 310 370Q500 220 680 350Q920 210 1200 340V540H0Z" fill="#4d674e" />
      <path d="M0 520L1200 480V760H0Z" fill="#b2a28a" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 160 - 100} 760L${i * 120} 510`} stroke="#766b59" strokeWidth="2" opacity=".45" />)}
      <rect x="95" y="30" width="23" height="580" fill="#6a5a43" /><rect x="1045" y="30" width="23" height="580" fill="#6a5a43" />
      <path d="M0 68L1200 8 M0 138L1200 78 M0 208L1200 148" stroke="#776348" strokeWidth="26" />
      <path d="M0 88L1200 28 M0 158L1200 98 M0 228L1200 168" stroke="#c6ac80" strokeWidth="4" />
      <rect y="492" width="1200" height="15" fill="#5c634c" />
      {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${i * 100} 492V585`} stroke="#666d53" strokeWidth="5" />)}
    </> : <>
      <rect x="248" y="156" width={room === "kitchen" ? 280 : 460} height="302" fill="#525b4b" />
      <rect x="258" y="166" width={room === "kitchen" ? 260 : 440} height="282" fill={`url(#glass-${drawingId})`} />
      <path d="M260 370Q320 220 380 345Q460 180 560 335Q610 220 700 300V445H260Z" fill="#809476" />
      <path d="M260 395Q350 310 420 385Q520 270 700 370V445H260Z" fill="#526c50" />
      <path d="M257 448H704 M407 164V451 M555 164V451" stroke="#535a4e" strokeWidth="8" />
      <path d="M258 175L698 175" stroke="#f5f0dc" strokeWidth="3" />
      <path d="M248 175L183 692H307L407 175 M556 175L390 705H540L700 175" fill="#fbf4d0" opacity=".13" />
      <rect x="225" y="145" width="19" height="331" fill="#ddd3bd" /><rect x={room === "kitchen" ? 533 : 710} y="145" width="25" height="331" fill="#e1d7bf" />
    </>}
    {room === "living" && <>
      <rect x="798" y="174" width="200" height="306" fill="#8d765b" />
      <rect x="809" y="185" width="178" height="283" fill="#6e614e" />
      {[253, 330, 405].map(y => <g key={y}><path d={`M807 ${y}H990`} stroke="#b09b7d" strokeWidth="8" /><path d={`M825 ${y - 7}v-44h9v44m5 0v-52h12v52m5 0v-39h8v39`} stroke="#d7ccb2" strokeWidth="6" /><ellipse cx="948" cy={y - 9} rx="19" ry="7" fill="#b8aa8a" /><path d={`M938 ${y - 11}q-18 -38 7 -39q25 4 14 39Z`} fill="#b6ae95" /></g>)}
      <path d="M755 478V202" stroke="#5d5948" strokeWidth="5" /><path d="M720 225L741 166H777L799 225Z" fill="#e7dac0" /><ellipse cx="760" cy="484" rx="35" ry="7" fill="#6f6856" />
      {!empty && <>
        <ellipse cx="579" cy="638" rx="316" ry="66" fill="#544f40" opacity=".25" filter={`url(#shadow-${drawingId})`} />
        <path d="M245 548L731 490L1000 654L444 741Z" fill="#d7d0bc" /><path d="M265 551L730 502L977 653L444 727Z" fill="none" stroke="#b5b29f" strokeWidth="3" />
        <path d="M167 491Q159 460 194 455L407 445Q444 441 452 474L475 566Q473 597 439 608L216 622Q184 620 180 591Z" fill={`url(#sofa-${drawingId})`} />
        <path d="M177 480Q173 463 203 462L400 454Q422 452 427 477L441 531L198 551Z" fill="#e6d9c3" />
        <path d="M202 557L441 535L455 578L211 602Z" fill="#eee1c8" />
        <path d="M196 549L212 609 M426 478L444 575" stroke="#bcad96" strokeWidth="3" />
        <path d="M221 612L223 645 M441 598L448 623" stroke="#716149" strokeWidth="8" />
        <path d="M348 479L388 470L410 517L366 525Z" fill="#837e5f" />
        <ellipse cx="609" cy="593" rx="135" ry="50" fill="#8b7557" /><path d="M474 590V610Q611 675 744 608V591Q610 646 474 590Z" fill="#68563f" />
        <path d="M527 623L518 684 M691 623L705 675" stroke="#66563e" strokeWidth="11" />
        <ellipse cx="607" cy="586" rx="36" ry="12" fill="#d4c8ad" /><path d="M585 579Q580 543 600 542Q623 545 625 579Z" fill="#bbb18e" />
        <path d="M593 549Q572 517 561 525M605 548Q628 510 640 521" stroke="#5f7050" strokeWidth="4" fill="none" />
        <path d="M809 475Q857 440 897 475L921 563Q888 600 823 575Z" fill="#9a9277" /><path d="M819 539Q862 518 909 541L918 569Q871 599 826 572Z" fill="#c1bba4" /><path d="M833 576L828 630 M905 573L921 616" stroke="#625c44" strokeWidth="8" />
      </>}
    </>}
    {room === "kitchen" && <>
      <rect x="571" y="175" width="416" height="278" fill="#b29876" />
      {[574, 650, 726, 802, 878, 954].map(x => <g key={x}><path d={`M${x} 182V450`} stroke="#8f7759" strokeWidth="2" /><path d={`M${x + 10} 302V345`} stroke="#544b3d" strokeWidth="3" /></g>)}
      <rect x="730" y="206" width="92" height="123" rx="2" fill="#323830" /><rect x="739" y="219" width="74" height="75" fill="#4f554a" /><path d="M742 310H808" stroke="#a49e88" strokeWidth="4" />
      <path d="M213 451H580L521 479H166Z" fill="#e0dacb" /><path d="M167 480H521V570H167Z" fill="#9b8668" /><path d="M198 487V565M276 487V565M359 487V565M442 487V565" stroke="#766248" strokeWidth="2" />
      <path d="M342 438v-41q0-30 20-30q20 0 20 24" fill="none" stroke="#66695b" strokeWidth="7" />
      <path d="M357 524L723 478L938 578L522 642Z" fill="#e7e1d4" /><path d="M357 524V550L522 669L938 603V578L522 642Z" fill="#c4bdae" />
      <path d="M392 575L520 664L893 605V706L521 760L392 651Z" fill="#ae9470" /><path d="M522 665V755M588 656V748M654 645V738M720 635V726M786 625V717M851 615V708" stroke="#7f6e54" strokeWidth="2" />
      <path d="M481 530L605 515L664 543L538 562Z" fill="#4e5348" />
      <ellipse cx="739" cy="553" rx="43" ry="16" fill="#9a9b75" /><circle cx="723" cy="546" r="13" fill="#d0b269" /><circle cx="747" cy="546" r="15" fill="#c3a76a" />
      {[450, 677].map(x => <g key={x}><path d={`M${x} 30V224`} stroke="#574f3e" strokeWidth="3" /><ellipse cx={x} cy="247" rx="61" ry="31" fill="#a28d67" /><path d={`M${x - 61} 247Q${x - 50} 190 ${x} 194Q${x + 50} 190 ${x + 61} 247Z`} fill="#b5a17c" /><ellipse cx={x} cy="250" rx="50" ry="13" fill="#ead8a8" /></g>)}
      {!empty && [636, 784, 930].map((x, i) => <g key={x}><ellipse cx={x} cy={671 - i * 19} rx="39" ry="16" fill="#504e3e" /><path d={`M${x - 28} ${675 - i * 19}l-9 85M${x + 28} ${675 - i * 19}l13 85`} stroke="#63563f" strokeWidth="8" /></g>)}
    </>}
    {room === "bedroom" && <>
      <rect x="762" y="180" width="180" height="171" fill="#a19c84" /><rect x="775" y="193" width="154" height="145" fill="#d8d0b9" /><circle cx="854" cy="256" r="45" fill="#b2ad8f" /><path d="M794 308L843 252L902 309Z" fill="#7c846a" />
      {!empty && <>
        <ellipse cx="620" cy="648" rx="298" ry="70" fill="#595343" opacity=".22" filter={`url(#shadow-${drawingId})`} />
        <path d="M281 556L705 506L1000 683L477 760Z" fill="#cec9b5" />
        <path d="M486 374Q485 350 514 350H810Q835 350 835 375V526H486Z" fill="#a6a18a" />
        <path d="M480 490L822 484L946 650L493 706L362 574Z" fill="#9c8b70" />
        <path d="M481 466L817 467L936 635L495 689L367 560Z" fill="#e2dbca" />
        <path d="M452 481L590 477L622 527L476 541Z M633 477L776 477L815 523L661 530Z" fill="#f3eddf" />
        <path d="M392 569L858 534L937 636L497 689Z" fill="#a3a68e" /><path d="M412 579L866 547M426 591L876 559" stroke="#d3d1bb" strokeWidth="3" opacity=".6" />
        <path d="M496 698V733M918 650V682" stroke="#6c5e47" strokeWidth="10" />
      </>}
      <path d="M855 488L929 476L989 505L911 522Z" fill="#8c7758" /><path d="M866 508V556M975 512V553" stroke="#68583f" strokeWidth="7" />
      <path d="M918 476V422" stroke="#655d45" strokeWidth="5" /><path d="M888 429L900 385H936L949 429Z" fill="#e4d7b8" />
    </>}
    {terrace && !empty && <>
      <ellipse cx="586" cy="648" rx="351" ry="60" fill="#3c4c39" opacity=".25" filter={`url(#shadow-${drawingId})`} />
      <path d="M251 531L651 506L794 589L368 628Z" fill="#8e8165" /><path d="M256 524L650 499L792 580L367 619Z" fill="#ded9c6" />
      <path d="M251 490Q250 461 280 459L614 449Q640 450 651 477L679 533L292 561Z" fill="#d7d1bb" />
      <path d="M285 532L310 570M620 511L647 550" stroke="#7c7458" strokeWidth="3" />
      <path d="M290 561V625M755 591V650" stroke="#635b42" strokeWidth="10" />
      <path d="M342 485L407 473L429 521L360 532Z" fill="#748265" /><path d="M522 478L575 466L603 516L545 521Z" fill="#b1a380" />
      <ellipse cx="672" cy="639" rx="120" ry="42" fill="#a5936f" /><path d="M562 642L575 710M772 644L789 708" stroke="#5c624c" strokeWidth="9" />
      <path d="M893 505Q928 483 970 509L1000 588L913 618Z" fill="#b9b19a" /><path d="M916 616L904 670M988 598L1008 648" stroke="#5b634b" strokeWidth="8" />
      <ellipse cx="668" cy="631" rx="29" ry="9" fill="#d7d1b4" />
    </>}
    <g>
      <path d={terrace ? "M110 568L135 670H200L225 568Z" : "M1048 481L1064 574H1129L1150 481Z"} fill="#9c8b6a" />
      <ellipse cx={terrace ? 168 : 1099} cy={terrace ? 568 : 481} rx="51" ry="15" fill="#6d6a4e" />
      {(terrace ? [0, 1, 2, 3, 4] : [0, 1, 2, 3]).map(i => <g key={i} transform={`translate(${terrace ? 166 : 1098} ${terrace ? 564 : 480}) rotate(${i * 32 - 60})`}><path d="M0 0Q-25-100 0-168" stroke="#69784f" strokeWidth="5" fill="none" /><path d="M0-120Q-63-153-33-182Q0-182 0-120M-4-76Q46-130 50-98Q46-64-4-76" fill={i % 2 ? "#526847" : "#6e8057"} /></g>)}
    </g>
    <ellipse cx="479" cy="270" rx="480" ry="390" fill={`url(#light-${drawingId})`} />
    <rect width="1200" height="760" fill="#564c33" opacity=".025" />
  </svg>;
}
