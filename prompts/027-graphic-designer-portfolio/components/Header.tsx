"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
const links = ["Work", "About", "Services", "Process", "Contact"];
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  function close() { setOpen(false); toggle.current?.focus(); }
  return <header className="header">
    <Link className="wordmark" href="/" aria-label="Mara Vale home">mara vale<span>®</span></Link>
    <nav aria-label="Main navigation" className="desktop-nav">{links.map(link => <Link key={link} href={`/#${link.toLowerCase()}`}>{link}</Link>)}</nav>
    <Link className="header-cta" href="/#contact">Start a project <ArrowUpRight size={17} /></Link>
    <button ref={toggle} className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    {open && <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation" onKeyDown={e => { if (e.key === "Escape") close(); }}>{links.map(link => <Link key={link} href={`/#${link.toLowerCase()}`} onClick={() => setOpen(false)}>{link}<ArrowUpRight size={19} /></Link>)}</nav>}
  </header>;
}
