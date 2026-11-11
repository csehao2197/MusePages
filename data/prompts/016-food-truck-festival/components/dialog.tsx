"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Dialog({ title, children, onClose, wide = false, navigation = false }: {
  title: string; children: React.ReactNode; onClose: () => void; wide?: boolean; navigation?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closer = useRef(onClose);
  closer.current = onClose;
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.showModal();
    return () => { document.body.style.overflow = overflow; opener?.focus(); };
  }, []);
  return <dialog ref={ref} className={`${wide ? "wide-dialog" : ""} ${navigation ? "nav-dialog" : ""}`}
    aria-labelledby="dialog-title" onCancel={() => closer.current()}
    onKeyDown={event => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
      )).filter(element => element.getClientRects().length > 0);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}
    onClick={event => { if (event.target === event.currentTarget) closer.current(); }}>
    <div className="dialog-inner">
      <div className="dialog-top"><h2 id="dialog-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={22}/></button></div>
      {children}
    </div>
  </dialog>;
}
