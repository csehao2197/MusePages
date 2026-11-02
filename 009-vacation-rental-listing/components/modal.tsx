"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ title, onClose, children, wide = false, onKeyDown }: {
  title: string; onClose: () => void; children: React.ReactNode; wide?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDialogElement>) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  return <dialog ref={ref} className={`modal ${wide ? "wide" : ""}`} aria-labelledby="modal-title"
    onKeyDown={onKeyDown}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onKeyDownCapture={event => {
      if (event.key === "Escape") {
        event.preventDefault(); event.stopPropagation(); onClose(); return;
      }
      if (event.key !== "Tab") return;
      const targets = [...ref.current!.querySelectorAll<HTMLElement>("button:not(:disabled), input, select, textarea, a[href]")].filter(element => element.getClientRects().length);
      const first = targets[0]; const last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="modal-head"><h2 id="modal-title">{title}</h2><button autoFocus className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={22} /></button></div>
    <div className="modal-body">{children}</div>
  </dialog>;
}
