"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Dialog({ title, children, onClose, wide = false, className = "" }: {
  title: string; children: React.ReactNode; onClose: () => void; wide?: boolean; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      dialog?.close();
      previous?.focus();
    };
  }, []);
  return <dialog ref={ref} className={`dialog ${wide ? "wide" : ""} ${className}`} aria-label={title}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header className="dialog-heading"><h2>{title}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={22}/></button></header>
    {children}
  </dialog>;
}
