"use client";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { X } from "lucide-react";
export default function Modal({ title, children, close }: { title: string; children: React.ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const prior = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); if (prior?.isConnected) prior.focus(); };
  }, []);
  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [tabindex="0"]',
    )).filter(element => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  return <dialog ref={ref} aria-labelledby="modal-title" onKeyDown={trapFocus} onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="dialog-head"><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={close}><X size={22}/></button></div>
    {children}
  </dialog>;
}
