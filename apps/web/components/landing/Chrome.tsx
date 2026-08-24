import Link from "next/link";

export function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <Link href="/" className="wordmark" aria-label="Perch, home">
      <img src="/logo.webp" alt="" width={size} height={size} />
      <span>Perch</span>
    </Link>
  );
}

export function Tick() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Bookmark() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 2.5h8v11l-4-3-4 3v-11z" strokeLinejoin="round" />
    </svg>
  );
}

export function Play() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M5 3.2v9.6l8-4.8z" />
    </svg>
  );
}

export function Nav() {
  return (
    <header className="nav-shell">
      <nav className="nav-island" aria-label="Primary">
        <Wordmark />
        <div className="nav-links">
          <a className="link" href="#how">How it works</a>
          <a className="link" href="#kinds">What counts</a>
          <a className="link" href="#trails">For hikers</a>
          <a className="link" href="#pricing">Pricing</a>
        </div>
        <div className="nav-cta row gap-xs">
          <Link className="btn btn--primary btn--sm" href="/map">Open the map</Link>
        </div>
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
            <p className="body-muted" style={{ maxWidth: "36ch" }}>
              A shared map of places worth stopping. Marked by the people who
              found them.
            </p>
          </div>
          <div className="footer__cols">
            <div className="stack gap-xs">
              <span className="meta">Product</span>
              <a className="link" href="#how">How it works</a>
              <a className="link" href="#kinds">What counts</a>
              <a className="link" href="#trails">For hikers</a>
              <Link className="link" href="/map">The map</Link>
            </div>
            <div className="stack gap-xs">
              <span className="meta">Project</span>
              <a className="link" href="#pricing">Pricing</a>
              <a className="link" href="#join">Join</a>
              <a className="link" href="https://github.com/">Repository</a>
            </div>
          </div>
        </div>
        <hr className="rule mt-xl" />
        <div className="footer__bottom">
          <span className="meta">
            Base map data &copy; OpenStreetMap contributors, ODbL
          </span>
          <span className="meta">{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
