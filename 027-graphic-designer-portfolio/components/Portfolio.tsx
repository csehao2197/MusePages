"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Search } from "lucide-react";
import { categories, projects, type Category, type Project } from "@/lib/data";
import { Artwork } from "./Artwork";
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article className="project-card">
    <Link href={`/work/${project.slug}`} aria-label={`View ${project.name} case study`}>
      <div className="project-art"><Artwork project={project} /><span className="view-project">Explore project <ArrowUpRight size={18} /></span></div>
      <div className="project-heading"><h3>{project.name}</h3><span>{project.category} <span aria-hidden="true">/</span> {project.year}</span></div>
      <p>{project.summary}</p><small>{String(index + 1).padStart(2, "0")} — {project.client} · Concept work</small>
    </Link>
  </article>;
}
export function ProjectFilter({ active, onChange }: { active: Category; onChange: (value: Category) => void }) {
  return <div className="filters" role="group" aria-label="Filter work by discipline">{categories.map(category => <button key={category} aria-pressed={active === category} onClick={() => onChange(category)}>{category}{category === "All work" && <sup>06</sup>}</button>)}</div>;
}
export function SelectedWork() {
  const [active, setActive] = useState<Category>("All work");
  const [query, setQuery] = useState("");
  const shown = projects.filter(p => (active === "All work" || p.category === active) && `${p.name} ${p.summary}`.toLowerCase().includes(query.toLowerCase()));
  return <section id="work" className="section work-section">
    <div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Different briefs.<br /><em>Same curiosity.</em></h2></div><p>A selection of identities, objects, and experiences.<br />Built with intention, from the first sketch to the last detail.<br /><span className="muted">All six projects are fictional, self-initiated concepts.</span></p></div>
    <div className="filter-row"><ProjectFilter active={active} onChange={setActive} /><label className="search"><Search size={16} /><span className="sr-only">Search projects</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a project" type="search" /></label></div>
    <p className="result-count" role="status">{shown.length} {shown.length === 1 ? "project" : "projects"} / {active}</p>
    {shown.length ? <div className="project-grid">{shown.map(p => <ProjectCard key={p.slug} project={p} index={projects.indexOf(p)} />)}</div> : <div className="empty"><h3>No projects in this selection.</h3><p>Try a different title or explore every discipline.</p><button className="button" onClick={() => { setActive("All work"); setQuery(""); }}>Reset filters <ArrowDown size={16} /></button></div>}
  </section>;
}
