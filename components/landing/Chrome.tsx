import Link from "next/link";

/** The trailing arrow that always lives inside its own circular well. */
export function Arrow() {
  return (
    <span className="btn__well" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 12L12 4M12 4H6M12 4v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** A dot resting on a bench. Three strokes, no wordmark dependency. */
export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="5.4" r="2.1" />
      <path d="M3.6 12.6h16.8" />
      <path d="M6.4 12.6v6.2M17.6 12.6v6.2" />
      <path d="M5.4 16.2h13.2" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="Perch, home">
      <Mark />
      <span>Perch</span>
    </Link>
  );
}

export function Nav() {
  return (
    <header className="nav-shell">
      <nav className="nav-island" aria-label="Primary">
        <Wordmark />
        <div className="nav-links">
          <a className="link" href="#how">How it works</a>
          <a className="link" href="#rest">The rest layer</a>
          <a className="link" href="#pricing">Pricing</a>
        </div>
        <a className="btn btn--primary btn--sm" href="#waitlist">
          Join the waitlist
          <Arrow />
        </a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div className="stack gap-sm">
            <Wordmark />
            <p className="body-muted" style={{ maxWidth: "34ch" }}>
              A map of the world&rsquo;s best places to sit down. Built in the
              open, seeded from open data.
            </p>
          </div>
          <div className="footer__cols">
            <div className="stack gap-xs">
              <span className="meta">Product</span>
              <a className="link" href="#how">How it works</a>
              <a className="link" href="#rest">The rest layer</a>
              <a className="link" href="#pricing">Pricing</a>
              <Link className="link" href="/map">Lisbon map</Link>
            </div>
            <div className="stack gap-xs">
              <span className="meta">Project</span>
              <a className="link" href="https://github.com/">Repository</a>
              <a className="link" href="#waitlist">Waitlist</a>
              <a className="link" href="#dedications">Dedications</a>
            </div>
          </div>
        </div>
        <hr className="rule mt-xl" />
        <div className="footer__bottom">
          <span className="meta">
            Bench data &copy; OpenStreetMap contributors, ODbL
          </span>
          <span className="meta">Lisbon &middot; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
