"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import type { Project } from "@/lib/data";
import { Artwork } from "./Artwork";
export function CaseStudyHeader({ project: p }: { project: Project }) {
  return <div className="case-header"><p className="eyebrow">{p.category.toUpperCase()} / {p.year} / FICTIONAL CONCEPT</p><h1>{p.name}<span className="accent">.</span></h1><p className="lead">{p.summary}</p><dl className="case-meta"><div><dt>Client / industry</dt><dd>{p.client}<br />{p.industry}</dd></div><div><dt>Role / collaborators</dt><dd>Concept strategy & design<br />Solo study; no collaborators</dd></div><div><dt>Deliverables</dt><dd>{p.applications.join(", ")}</dd></div></dl></div>;
}
export function ImageSequence({ project }: { project: Project }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState(0);
  function open(i: number, button: HTMLButtonElement) { trigger.current = button; setIndex(i); dialog.current?.showModal(); }
  function close() { dialog.current?.close(); }
  function move(amount: number) { setIndex(value => (value + amount + project.applications.length) % project.applications.length); }
  return <section className="image-sequence" aria-label="Project gallery"><div className="gallery-grid">{project.applications.map((label, i) => <figure key={label}><button className="gallery-trigger" onClick={e => open(i, e.currentTarget)} aria-label={`Enlarge ${label}`}><Artwork project={project} variant={i} /><span><Expand size={18} /> View study</span></button><figcaption><span>0{i + 1} / {label}</span><p>{project.captions[i]} {i === 2 && "Reconstructed concept exploration, not documentation of real client feedback."}</p></figcaption></figure>)}</div>
    <dialog ref={dialog} className="lightbox" aria-label={`${project.name} artwork gallery`} onClose={() => trigger.current?.focus()} onClick={e => { if (e.target === e.currentTarget) close(); }} onKeyDown={e => {
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "Tab") {
        const buttons = e.currentTarget.querySelectorAll<HTMLButtonElement>("button");
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }}>
      <div className="lightbox-toolbar"><p>{project.name} / Study {index + 1} of 3</p><button aria-label="Close gallery" onClick={close} autoFocus><X /></button></div>
      <Artwork project={project} variant={index} /><div className="lightbox-bottom"><button aria-label="Previous artwork" onClick={() => move(-1)}><ArrowLeft /></button><p aria-live="polite">{project.captions[index]}</p><button aria-label="Next artwork" onClick={() => move(1)}><ArrowRight /></button></div>
    </dialog>
  </section>;
}
