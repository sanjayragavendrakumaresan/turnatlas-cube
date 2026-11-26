import { ArrowUpRight, Github, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark ${small ? "brand-mark--small" : ""}`} aria-label="TurnAtlas">
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <path d="M18 2.8 31.1 10.4v15.2L18 33.2 4.9 25.6V10.4L18 2.8Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M18 2.8v15.1m13.1-7.5L18 17.9 4.9 10.4m13.1 7.5v15.3" fill="none" stroke="currentColor" strokeWidth="1.1" opacity=".72" />
        <circle cx="18" cy="2.8" r="2.2" fill="currentColor" />
        <circle cx="31.1" cy="10.4" r="2.2" fill="#c7f36b" />
        <circle cx="18" cy="17.9" r="2.2" fill="currentColor" />
      </svg>
      <span>TurnAtlas</span>
    </span>
  );
}

export function SiteLayout({ children, active = "home" }: { children: React.ReactNode; active?: "home" | "upload" | "report" | "privacy" }) {
  return (
    <div className="site-frame">
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand-link" aria-label="TurnAtlas home"><BrandMark /></Link>
          <nav className="main-nav" aria-label="Main navigation">
            <Link href="/" className={active === "home" ? "nav-link is-active" : "nav-link"}>Overview</Link>
            <Link href="/privacy" className={active === "privacy" ? "nav-link is-active" : "nav-link"}>Privacy</Link>
            <a className="nav-link nav-github" href="https://github.com/sanjayragavendrakumaresan/turnatlas-cube" target="_blank" rel="noreferrer"><Github size={15} /> Source <ArrowUpRight size={13} /></a>
          </nav>
          <Link href="/upload" className="header-cta"><span>New reconstruction</span><ArrowUpRight size={15} /></Link>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="footer-inner">
          <Link href="/" className="footer-brand"><BrandMark small /></Link>
          <span className="footer-note"><ShieldCheck size={14} /> Local-first research preview. Clips stay in your browser.</span>
          <div className="footer-links"><Link href="/privacy">Privacy</Link><a href="https://github.com/sanjayragavendrakumaresan/turnatlas-cube" target="_blank" rel="noreferrer">Open source <ArrowUpRight size={12} /></a></div>
        </div>
      </footer>
    </div>
  );
}
