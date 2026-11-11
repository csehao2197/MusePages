"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <section className="section"><h1>A little interruption.</h1><p>The page could not be displayed. Try loading it again; no inquiry data has been sent.</p><button className="button dark" onClick={reset}>Try again</button><a className="inline-link" href="/">Return home</a></section>; }
