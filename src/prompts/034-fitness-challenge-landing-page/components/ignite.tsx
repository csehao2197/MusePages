"use client";

import { Activity, ArrowDown, ArrowRight, Check, ChevronRight, Clock3, Dumbbell, Flame, Heart, LockKeyhole, Menu, Play, RotateCcw, ShieldCheck, Sparkles, Trophy, Users, Utensils, X, Zap } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { faqs, leaderboard, plans, weeks, type Level, type Plan, type Workout } from "./data";

type Enrollment = { alias: string; plan: Plan };
type Panel = { kind: "enroll"; plan: Plan } | { kind: "workout"; workout: Workout } | { kind: "info"; title: string; text: string } | { kind: "reset" } | null;
const nav = [["The Challenge", "challenge"], ["Workouts", "workouts"], ["Stories", "results"], ["Pricing", "pricing"], ["FAQ", "faq"]];
const features = [
  { icon: Dumbbell, title: "Your daily dose of movement", text: "Short, varied workouts. Beginner, intermediate, and advanced previews — with lower-impact alternatives.", label: "01 / DAILY WORKOUTS" },
  { icon: Play, title: "Never guess the next move", text: "Explore exercise lists and plain-language form cues before you start. Text previews replace HD video in this demo.", label: "02 / MOVEMENT LIBRARY" },
  { icon: Utensils, title: "Fuel life. Not rules.", text: "A flexible food framework built around variety and enjoyment. No strict diets, calorie targets, or tracking.", label: "03 / NUTRITION FRAMEWORK" },
  { icon: Activity, title: "Small wins, made visible", text: "Check off practice days and see your consistency grow. No measurements, photos, or health data needed.", label: "04 / PROGRESS TRACKER" },
  { icon: Users, title: "Better with your people", text: "Imagine daily check-ins, shared encouragement, and coach conversations. A community concept, not a live group.", label: "05 / COMMUNITY CONCEPT" },
  { icon: Trophy, title: "Showing up is the win", text: "Explore a fictional leaderboard that celebrates consistency. No real competition, prizes, or cash rewards.", label: "06 / GOOD ENERGY" },
];

function Countdown() {
  return <div className="countdown-wrap">
    <div className="countdown-caption"><span className="status-dot" /> APRIL 2026 COHORT · ARCHIVED</div>
    <div className="countdown" aria-label="Archived countdown: 0 days, 0 hours, 0 minutes, 0 seconds">
      {["Days", "Hours", "Mins", "Secs"].map(unit => <div className="time-unit" key={unit}><strong>00</strong><span>{unit}</span></div>)}
    </div>
    <p className="archive-note">April 1–30, 2026 has ended. Practice demo is open.</p>
  </div>;
}

function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); previous?.focus(); };
  }, []);
  useEffect(() => { heading.current?.focus(); }, [title]);
  return <dialog ref={ref} className="modal" aria-labelledby="modal-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => {
    if (event.key !== "Tab") return;
    const focusable = ref.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]");
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }}>
    <div className="modal-top"><span className="eyebrow"><Flame size={15} /> PULSEUP / PRACTICE SPACE</span><button type="button" className="icon-button" aria-label="Close dialog" onClick={close}><X /></button></div>
    <h2 ref={heading} id="modal-title" tabIndex={-1}>{title}</h2>{children}
  </dialog>;
}

export default function Ignite() {
  const [menu, setMenu] = useState(false);
  const [week, setWeek] = useState(1);
  const [filter, setFilter] = useState<Level | "All workouts">("All workouts");
  const [panel, setPanel] = useState<Panel>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [faq, setFaq] = useState<number | null>(null);
  const [infoPoints, setInfoPoints] = useState(false);
  const weekData = weeks.find(item => item.id === week)!;
  const days = weekData.days.filter(day => filter === "All workouts" || day.level === filter);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  function enroll(plan: Plan = "Free") { setFormError(""); setPanel({ kind: "enroll", plan }); }
  function showInfo(title: string, text: string) { setPanel({ kind: "info", title, text }); }
  function openWorkout(workout: Workout) {
    if (workout.level === "Advanced" && enrollment?.plan !== "Pro") { enroll("Pro"); return; }
    if (workout.day > 3 && !enrollment) { enroll(); return; }
    setPanel({ kind: "workout", workout });
  }
  function toggleComplete(day: number) {
    setCompleted(current => current.includes(day) ? current.filter(item => item !== day) : [...current, day]);
  }
  const joinLabel = enrollment ? "My practice pass" : "Join IGNITE 30";
  function join() {
    if (enrollment) showInfo("Your practice pass", `${enrollment.alias}, your ${enrollment.plan} practice plan is active in this tab. ${completed.length}/30 practice days selected. No payment, email, account, or real enrollment exists. Use Reset demo to clear your selections.`);
    else enroll();
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="demo-strip">A FICTIONAL FITNESS EXPERIENCE <span>•</span> LOCAL DEMO. REAL GOOD ENERGY. <span>•</span> NO REAL ENROLLMENT OR PAYMENTS</div>
    <header className="header" onKeyDown={event => { if (menu && event.key === "Escape") { setMenu(false); mobileToggle.current?.focus(); } }}>
      <a className="logo" href="#" aria-label="PulseUp home"><Activity aria-hidden="true" /><span>Pulse<span className="orange">Up</span><small>FITNESS COMMUNITY</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(([title, id]) => <a key={id} href={`#${id}`}>{title}</a>)}</nav>
      <div className="nav-actions"><button className="button small" onClick={join}><span className="desktop-join">{joinLabel}</span><span className="mobile-join">Join</span><ArrowRight size={16} /></button><button ref={mobileToggle} className="icon-button menu-button" aria-expanded={menu} aria-controls="mobile-nav" aria-label={menu ? "Close navigation" : "Open navigation"} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div>
      {menu && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{nav.map(([title, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{title}<ArrowRight size={16} /></a>)}</nav>}
    </header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-art" src="/ignite-athlete.svg" alt="Original illustration of an athlete holding a kettlebell in an orange-lit gym" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow"><span className="little-line" /> THE 30-DAY MOVEMENT CHALLENGE</div>
          <div className="ignite-wordmark" aria-label="Ignite 30">IGNITE<span>30<span className="wordmark-dot" aria-hidden="true">✦</span></span></div>
          <h1 id="hero-title">30 DAYS.<br />YOUR PACE.<br /><span className="orange">ALL HEART.</span></h1>
          <p className="hero-description">Less overthinking. More showing up.<br />Daily movement, flexible nutrition, and a community<br className="wide-only" /> mindset — find a rhythm that feels like you.</p>
          <button className="button hero-button" onClick={() => enroll()}>Explore my free spot <ArrowRight size={20} /></button>
          <div className="hero-fine"><ShieldCheck size={14} /> No card. No pressure. Just a local demo.</div>
          <div className="hero-social"><div className="avatars" aria-hidden="true">{["J", "M", "P", "S", "D"].map((letter, i) => <span key={letter} style={{ "--i": i } as React.CSSProperties}>{letter}</span>)}</div><div><strong>Good energy is contagious.</strong><small>Fictional community. Everyone belongs.</small></div></div>
        </div>
        <div className="hero-side"><span className="vertical-label">FIND YOUR FIRE / PULSEUP FITNESS</span><div className="hero-mini"><Flame size={25} /><div><strong>PROGRESS &gt; PERFECTION</strong><span>One day at a time.</span></div></div></div>
        <div className="hero-bottom"><Countdown /><a className="scroll-cue" href="#challenge">MEET YOUR NEXT 30 DAYS <ArrowDown size={18} /></a><span className="art-credit">ORIGINAL ART / NO RESULT PROMISES</span></div>
      </section>
      <div className="ticker" aria-hidden="true"><span>SHOW UP FOR YOU</span><Sparkles /><span>MOVE AT YOUR PACE</span><Sparkles /><span>BUILD YOUR RHYTHM</span><Sparkles /><span>SHOW UP FOR YOU</span></div>

      <section className="section" id="challenge">
        <div className="section-heading"><div><p className="eyebrow">01 / THE CHALLENGE</p><h2>NOT ANOTHER APP.<br /><span className="muted-heading">A REASON TO SHOW UP.</span></h2></div><p className="section-intro">Everything you need for 30 days of progress.<br />Less noise. More movement. A little encouragement<br className="wide-only" /> along the way.</p></div>
        <div className="features">{features.map(feature => <article className="feature" key={feature.title}><div className="feature-top"><feature.icon size={25} /><span>{feature.label}</span></div><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
        <div className="safety"><Heart size={20} /><p><strong>Your body. Your call.</strong> Rest counts. These fictional previews are not personal training or medical advice. Stop if anything hurts or you feel dizzy. Seek qualified guidance for your circumstances.</p></div>
      </section>

      <section className="workout-section section" id="workouts">
        <div className="section-heading"><div><p className="eyebrow">02 / THE GAME PLAN</p><h2>A LITTLE SWEAT.<br /><span className="orange">A LOT OF POSSIBILITY.</span></h2></div><div><p className="section-intro">Your first week, unlocked for a sneak peek.<br />20–32 minutes. No gym required. Always your pace.</p><span className="tiny-note">Text previews only · no videos or live workout drops</span></div></div>
        <div className="schedule-tools"><div className="week-tabs" role="group" aria-label="Choose program week">{weeks.map(item => <button key={item.id} aria-pressed={week === item.id} onClick={() => setWeek(item.id)}>{item.id === 5 ? "Finish" : `Week ${item.id}`}<span>{item.id === 5 ? "29–30" : `${(item.id - 1) * 7 + 1}–${item.id * 7}`}</span></button>)}</div><label className="level-select">LEVEL<select aria-label="Workout level" value={filter} onChange={event => setFilter(event.target.value as typeof filter)}>{["All workouts", "Beginner", "Intermediate", "Advanced", "All levels"].map(level => <option key={level}>{level}</option>)}</select></label></div>
        <div className="week-description"><h3>{weekData.title}</h3><p>{weekData.theme}</p><span className="tiny-note">SWIPE TO EXPLORE <ArrowRight size={13} /></span></div>
        <div className="workout-rail" aria-label={`Week ${week} workout schedule`} tabIndex={0}>
          {days.map(workout => {
            const locked = (workout.day > 3 && !enrollment) || (workout.level === "Advanced" && enrollment?.plan !== "Pro");
            return <article key={workout.day} className={`workout-card ${workout.level === "Beginner" || workout.level === "All levels" ? "easy" : workout.level === "Advanced" ? "advanced" : "medium"}`}>
              <div className="day-top"><span>DAY <strong>{String(workout.day).padStart(2, "0")}</strong></span>{completed.includes(workout.day) ? <Check aria-label="Selected complete" size={20} /> : <Dumbbell size={20} />}</div>
              <span className="difficulty"><i />{workout.level}</span><h4>{workout.title}</h4><p className="duration"><Clock3 size={14} /> {workout.minutes} min <span>•</span> At your pace</p>
              <ul>{workout.exercises.slice(0, 3).map(exercise => <li key={exercise.name}>{exercise.name}</li>)}{workout.exercises.length > 3 && <li className="more-exercises">+ {workout.exercises.length - 3} more movements</li>}</ul>
              <button className={`preview-button ${locked ? "locked" : ""}`} onClick={() => openWorkout(workout)} aria-label={`${locked ? "Unlock" : "Preview"} day ${workout.day}: ${workout.title}`}>{locked ? <LockKeyhole size={15} /> : <Play size={15} />}{locked ? workout.level === "Advanced" ? "Explore Pro to unlock" : "Join free to unlock" : "Preview workout"}<ArrowRight size={15} /></button>
            </article>;
          })}
          {days.length === 0 && <div className="empty-state"><Dumbbell /><h3>No matching workouts in this week.</h3><p>Try another level or return to the full schedule.</p><button className="button secondary" onClick={() => setFilter("All workouts")}>Show all workouts</button></div>}
        </div>
        <div className="tracker"><div><span className="tracker-icon"><Activity /></span><div><h3>{enrollment ? `${enrollment.alias}'s practice progress` : "Make showing up your new favorite habit."}</h3><p>{enrollment ? `${completed.length} of 30 days selected · ${enrollment.plan} practice plan · tab-only, no streak pressure` : "Join the local demo to unlock previews and try the completion tracker."}</p></div></div><div className="progress-area"><label htmlFor="practice-progress">{completed.length}/30 DAYS</label><progress id="practice-progress" max="30" value={completed.length} /></div><button className="text-button" onClick={() => setPanel({ kind: "reset" })}><RotateCcw size={15} /> Reset demo</button></div>
      </section>

      <section className="section" id="results">
        <div className="section-heading"><div><p className="eyebrow">03 / PEOPLE, NOT BEFORE-AND-AFTERS</p><h2>SMALL WINS.<br /><span className="muted-heading">BIG GOOD ENERGY.</span></h2></div><p className="section-intro">A little inspiration from our imagined community.<br />Illustrative stories, not real testimonials or results.<br /><strong className="tiny-note">NO BODY COMPARISONS. NO GUARANTEES.</strong></p></div>
        <div className="stories">{[
          { initial: "M", name: "Marcus T.", label: "FOUND A ROUTINE", quote: "I stopped trying to be perfect and started making room for a little movement. Showing up became the part I looked forward to.", art: "01", color: "orange" },
          { initial: "P", name: "Priya K.", label: "MADE IT HER OWN", quote: "The idea that I could choose a gentler option changed the whole experience. I didn't have to keep up with anyone but myself.", art: "02", color: "green" },
          { initial: "D+S", name: "Derek & Sam W.", label: "BETTER TOGETHER", quote: "We made it a little ritual. A check-in, some movement, and a chance to cheer each other on. That was our favorite kind of progress.", art: "03", color: "purple" },
        ].map(story => <article className={`story ${story.color}`} key={story.name}><div className="story-art" aria-hidden="true"><span>{story.art}</span><Activity /><strong>{story.label.replaceAll(" ", "\n")}</strong></div><div className="story-content"><p className="story-type">FICTIONAL COMMUNITY STORY</p><blockquote>“{story.quote}”</blockquote><div className="story-person"><span>{story.initial}</span><div><strong>{story.name}</strong><small>Illustrative participant</small></div><Heart size={19} /></div></div></article>)}</div>
        <div className="center-link"><button className="text-button" onClick={() => showInfo("More than a before-and-after", "These three fictional stories celebrate routines, choice, and connection. They are not verified reviews. No participant photographs, ratings, weight-loss metrics, or transformation claims are used. Your experience may be different.")}>Our approach to progress <ArrowRight size={17} /></button></div>
      </section>

      <section className="how-section section" id="how">
        <p className="eyebrow">04 / LESS COMPLICATED. MORE POSSIBLE.</p><h2>YOUR NEXT CHAPTER,<br />IN FOUR SIMPLE STEPS.</h2>
        <div className="steps">{[
          ["Pick your pass", "Choose Free or explore Pro. Practice enrollment stays in this browser tab."],
          ["Find your starting point", "Explore the prep notes. Pick a comfortable level. No measurements needed."],
          ["Move. Rest. Repeat.", "Browse each week, explore the cues, and mark days at your own pace."],
          ["Celebrate showing up", "Notice your routine. Keep what works. Your next chapter is yours to choose."],
        ].map(([title, text], index) => <article key={title}><span className="step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="coach"><span className="coach-avatar" aria-hidden="true">M<span>✦</span></span><div><p className="eyebrow">MEET YOUR FICTIONAL GUIDE</p><h3>Good form. Better energy. Coach Maya.</h3><p>An imagined PulseUp coach for this demo — no real trainer identity, credentials, endorsements, or coaching service.</p></div><button className="button secondary" onClick={() => showInfo("A note from Coach Maya", "Fictional coach note: start with curiosity, not comparison. Preview movements before deciding what fits. Take breaks and use comfortable alternatives. This is general demonstration content, not a qualified trainer's assessment or individualized exercise advice.")}>Read the coach note <ArrowRight size={16} /></button></div>
      </section>

      <section className="section leaderboard-section" id="leaderboard">
        <div className="section-heading"><div><p className="eyebrow">05 / CONSISTENCY IS THE REAL FLEX</p><h2>THE SHOW-UP CLUB.</h2><p className="section-intro">A fictional January 2026 leaderboard. Encouragement, not pressure.</p></div><div className="points-wrap"><button className="button secondary" aria-expanded={infoPoints} aria-controls="points-info" onClick={() => setInfoPoints(!infoPoints)}><Trophy size={17} /> How points work</button>{infoPoints && <p id="points-info" className="points-info">Illustrative totals only: 10/workout, 5/check-in, 15/streak bonus. Legacy totals include fictional community bonuses; they are not calculated from this local tracker. No photo points, real rankings, or prizes.</p>}</div></div>
        <div className="leaderboard"><div className="leaderboard-head"><span>RANK / CHALLENGER</span><span>WORKOUTS</span><span>POINTS</span><span>STREAK</span></div>{leaderboard.map((row, i) => <div className="leaderboard-row" key={row.name}><div><span className={`rank rank-${i + 1}`}>{i < 3 ? <Trophy size={17} /> : `0${i + 1}`}</span><strong>{row.name}</strong></div><span className="leader-workouts"><span className="mobile-field">Workouts </span>{row.workouts}<small>/30</small><span className="mini-progress"><i style={{ width: `${row.workouts / 30 * 100}%` }} /></span></span><strong>{row.points}<span className="mobile-field"> pts</span></strong><span className="streak"><Flame size={15} />{row.streak}-day <span className="streak-word">streak</span></span></div>)}<div className="your-row"><Users size={20} /><span>Your next small win belongs here.</span><button className="text-button" onClick={join}>{enrollment ? "View practice pass" : "Join the local demo"} <ArrowRight size={16} /></button></div></div>
      </section>

      <section className="section pricing-section" id="pricing">
        <div className="center-heading"><p className="eyebrow">06 / YOUR CHALLENGE. YOUR CHOICE.</p><h2>FIND YOUR FIRE.<br /><span className="orange">PICK YOUR PASS.</span></h2><p>Start free. Explore a little more. Both are entirely simulated.</p></div>
        <div className="pricing-grid">{(["Free", "Pro"] as Plan[]).map(plan => <article key={plan} className={`price-card ${plan.toLowerCase()}`}>{plan === "Pro" && <div className="popular"><Zap size={14} /> THE EXTRA-SPARK OPTION</div>}<div className="price-title"><span>{plan === "Pro" ? <Flame /> : <Activity />}</span><h3>IGNITE {plan.toUpperCase()}</h3></div><p>{plan === "Free" ? "Everything you need to get a feel for it." : "A deeper look at the challenge concept."}</p><div className="price"><strong>${plans[plan].price}</strong><div><span>USD / one-time</span><small>{plan === "Free" ? "Always $0 in this demo" : "Sample price · no payment"}</small></div></div><div className="price-divider" /><ul>{plans[plan].features.map(feature => <li key={feature}><Check size={17} />{feature}</li>)}</ul><button className={`button ${plan === "Free" ? "secondary" : ""}`} onClick={() => enroll(plan)}>{plan === "Free" ? "Join Free" : "Explore Pro — $29"}<ArrowRight size={18} /></button><span className="price-foot">{plan === "Free" ? "No card. No account. No catch." : "No checkout. Nothing is charged."}</span></article>)}</div>
        <p className="pricing-note"><ShieldCheck size={17} /> Practice prices only. No live discount, limited capacity, refund promise, or paid service.</p>
      </section>

      <section className="section faq-section" id="faq"><div><p className="eyebrow">07 / A FEW THINGS TO KNOW</p><h2>GOOD QUESTIONS.<br /><span className="muted-heading">STRAIGHT ANSWERS.</span></h2><p>Still curious? This demo keeps things simple.</p><button className="text-button" onClick={() => showInfo("About this practice space", "PulseUp Fitness and IGNITE 30 are fictional brands in a local interface demo. There is no support inbox, account, payment provider, live community, or external API. All interaction state lives in memory and disappears on refresh. Use a made-up alias, not personal information.")}>About the demo <ArrowRight size={17} /></button></div><div className="faqs">{faqs.map(([question, answer], index) => <article key={question} className={faq === index ? "is-open" : ""}><h3><button aria-expanded={faq === index} aria-controls={`faq-${index}`} onClick={() => setFaq(faq === index ? null : index)}>{question}<span aria-hidden="true">{faq === index ? "−" : "+"}</span></button></h3><div id={`faq-${index}`} hidden={faq !== index}><p>{answer}</p></div></article>)}</div></section>

      <section className="final-cta"><div className="final-grid" aria-hidden="true" /><p className="eyebrow"><Flame size={17} /> YOUR NEXT SMALL WIN STARTS HERE</p><h2>YOU DON&apos;T NEED PERFECT.<br />YOU JUST NEED <span>A START.</span></h2><p>Thirty days of possibility. One choice that&apos;s yours.</p><button className="button" onClick={() => enroll()}>Join IGNITE 30 — it&apos;s free <ArrowRight size={20} /></button><span className="tiny-note">NO CARD REQUIRED · NO REAL ENROLLMENT · NO PRESSURE</span><Countdown /></section>
    </main>
    <footer className="footer"><div className="footer-top"><div className="footer-brand"><a className="logo" href="#"><Activity /><span>Pulse<span className="orange">Up</span></span></a><p>More movement. More connection.<br />More you.</p><span className="tiny-note">FICTIONAL BRAND / LOCAL DEMO</span></div><div><h3>The challenge</h3>{[["Workouts", "workouts"], ["The program", "how"], ["Leaderboard", "leaderboard"], ["Community stories", "results"]].map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div><div><h3>PulseUp</h3><button onClick={() => showInfo("About PulseUp", "A fictional fitness community, created for this interface demo. No real company, location, employment opportunity, or social media account is represented.")}>About the community</button><a href="#how">Meet Coach Maya</a><a href="#pricing">Explore the passes</a><button onClick={() => showInfo("Nutrition, without rules", "This demo offers general food ideas only: enjoy variety, eat regularly in ways that suit you, and make room for foods you like. There are no macro calculations, restrictions, meal prescriptions, or medical claims.")}>Nutrition philosophy</button></div><div><h3>The important stuff</h3><a href="#faq">FAQs</a><button onClick={() => showInfo("Community guidelines", "In this fictional community: respect boundaries, celebrate effort, welcome rest, and avoid body comparisons. No harassment, unsafe advice, or unsolicited health commentary. No real community or moderation service is connected.")}>Community guidelines</button><button onClick={() => showInfo("Privacy & demo terms", "No data is submitted, stored, or sent to a service. A made-up alias, practice plan, and completion selections stay in memory in this tab. Refresh or Reset demo clears them. No health data, photos, measurements, payment details, email addresses, or account credentials are requested. This is demonstration content, not a real service or professional advice.")}>Privacy & demo terms</button><button onClick={() => setPanel({ kind: "reset" })}>Reset this demo</button></div></div><div className="footer-bottom"><span>© 2026 PulseUp Fitness · Fictional demo</span><span>Made with <Flame size={13} /> and good intentions.</span><a href="#main">BACK TO TOP ↑</a></div></footer>
    <div className="mobile-sticky"><div><strong>IGNITE 30</strong><span>Move at your pace.</span></div><button className="button small" onClick={join}>{enrollment ? "My pass" : "Join free"}<ArrowRight size={16} /></button></div>
    <div className="sr-only" role="status">{notice}</div>

    {panel && <Modal title={panel.kind === "enroll" ? `Your ${panel.plan} practice pass` : panel.kind === "workout" ? panel.workout.title : panel.kind === "reset" ? "Start fresh?" : panel.title} close={() => setPanel(null)}>
      {panel.kind === "enroll" && <form onSubmit={event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const alias = String(data.get("alias") ?? "").trim();
        if (alias.length < 2) { setFormError("Use a made-up alias with at least 2 non-space characters."); return; }
        setEnrollment({ alias, plan: panel.plan }); setPanel({ kind: "info", title: "You're in. Your pace, your way.", text: `${alias}, your ${panel.plan} practice pass is ready. Sample total: $${plans[panel.plan].price} USD one-time. Charged today: $0. No payment or enrollment was sent. Browse the weeks and mark practice days. Prep note: choose comfortable movement, make room for rest, and avoid comparing your body with others.` }); setFormError(""); setNotice(`${panel.plan} practice pass activated.`);
      }}>
        <p className="modal-description">A simulated enrollment, not a real challenge reservation. Use a made-up alias. Nothing leaves this page.</p>
        <div className="plan-picker" role="group" aria-label="Practice plan">{(["Free", "Pro"] as Plan[]).map(plan => <button type="button" key={plan} aria-pressed={panel.plan === plan} onClick={() => setPanel({ kind: "enroll", plan })}><strong>{plan}</strong><span>${plans[plan].price} USD</span></button>)}</div>
        <div className="order-summary"><span>Sample one-time total</span><strong>${plans[panel.plan].price} USD</strong><span>Charged today / actual charge</span><strong>$0 USD</strong></div>
        <label className="field-label" htmlFor="alias">Made-up alias</label><input id="alias" name="alias" placeholder="e.g. MoveWithMango" required minLength={2} maxLength={24} autoComplete="off" aria-describedby={formError ? "alias-help alias-error" : "alias-help"} aria-invalid={formError ? true : undefined} onChange={() => setFormError("")} /><p id="alias-help" className="tiny-note">2–24 characters. No real name, email, or health information.</p>
        {formError && <p id="alias-error" className="form-error" role="alert">{formError}</p>}
        <label className="check-label"><input type="checkbox" required name="demoConsent" /> <span>I understand this is a fictional local demo, not professional guidance or a real purchase.</span></label>
        <button className="button full" type="submit">Activate {panel.plan} practice pass <ArrowRight size={17} /></button><p className="tiny-note centered">Tab-only state · Reset or refresh to clear</p>
      </form>}
      {panel.kind === "workout" && <><p className="eyebrow modal-workout-meta">DAY {panel.workout.day} · {panel.workout.minutes} MIN · {panel.workout.level.toUpperCase()}</p><p className="modal-description">An exercise-list preview, not a follow-along session or prescribed routine. No timed rounds or intensity targets. Pick comfortable alternatives, rest freely, and stop for pain or dizziness.</p><ol className="exercise-list">{panel.workout.exercises.map(exercise => <li key={exercise.name}><strong>{exercise.name}</strong><p>{exercise.cue}</p></li>)}</ol><p className="tiny-note">There is no video, camera, or health tracking.</p>{enrollment ? <button className="button full" onClick={() => toggleComplete(panel.workout.day)}>{completed.includes(panel.workout.day) ? <><RotateCcw size={17} /> Undo day {panel.workout.day} selection</> : <><Check size={17} /> Mark day {panel.workout.day} complete (demo)</>}</button> : <button className="button full" onClick={() => enroll()}>Try the free progress tracker <ArrowRight size={17} /></button>}<p role="status" className="tiny-note centered">{completed.includes(panel.workout.day) ? "Selected complete. You can undo this any time." : "Preview at your own pace. No completion is required."}</p></>}
      {panel.kind === "info" && <><p className="modal-description info-text">{panel.text}</p><button className="button full" onClick={() => setPanel(null)}>Got it <Check size={17} /></button></>}
      {panel.kind === "reset" && <><p className="modal-description">Clear your practice pass, alias, completion selections, week, and level filter. This cannot be undone. No server data exists.</p><div className="reset-actions"><button className="button secondary" onClick={() => setPanel(null)}>Keep my selections</button><button className="button" onClick={() => { setEnrollment(null); setCompleted([]); setWeek(1); setFilter("All workouts"); setFaq(null); setInfoPoints(false); setFormError(""); setNotice("Demo reset. All local selections cleared."); setPanel(null); }}>Reset all selections</button></div></>}
    </Modal>}
  </>;
}
