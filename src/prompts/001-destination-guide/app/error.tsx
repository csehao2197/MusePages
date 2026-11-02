"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="wrap section"><div className="section-eyebrow">LET&apos;S FIND OUR WAY BACK</div><h1>We couldn&apos;t load your guide.</h1><p className="section-intro">Please try again. No inquiry or booking has been sent.</p><button className="button" style={{ marginTop: 20 }} onClick={reset}>Try again</button></main>;
}
