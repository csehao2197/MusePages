"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function Modal({ title, children, close, wide = false }: { title: string; children: React.ReactNode; close: () => void; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => { dialog?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={ref} className={wide ? "modal wide" : "modal"} aria-labelledby="modal-title" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="modal-head"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={close} aria-label="Close dialog" autoFocus><X size={22}/></button></div>
    {children}
  </dialog>;
}
