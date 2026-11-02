"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current!;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className="modal" aria-labelledby="dialog-title" onKeyDown={(event) => {
    if (event.key !== "Tab") return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }} onCancel={(e) => { e.preventDefault(); close.current(); }} onClick={(e) => { if (e.target === e.currentTarget) close.current(); }}>
    <header className="modal-head"><div><span className="eyebrow">YOUR ADVENTURE, YOUR WAY</span><h2 id="dialog-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={22} /></button></header>
    {children}
  </dialog>;
}
