import { ArrowDownRight, ArrowRight, ArrowUpRight, CirclePlay, Eye, Film, LockKeyhole, MoveRight, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import CubeScene from "../components/CubeScene";
import { SiteLayout } from "../components/SiteLayout";

const exampleMoves = "R U R' U' F2 D L' B";

export default function Home() {
  const [view, setView] = useState<"cuber" | "orbit">("cuber");
  return (
    <SiteLayout active="home">
      <main>
        <section className="hero-section wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> OPEN RESEARCH PREVIEW <span className="eyebrow-sep">/</span> 3×3 VIDEO ANALYSIS</div>
            <h1>Read the turns<br />hidden in a <em>solve.</em></h1>
            <p className="hero-lede">TurnAtlas explores how a normal phone video can become a move-by-move cube reconstruction — synced to the footage, with uncertainty in the open.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/upload">Analyse a video <ArrowUpRight size={16} /></Link>
              <a className="button button-quiet" href="#demo"><CirclePlay size={16} /> See the replay <ArrowDownRight size={15} /></a>
            </div>
            <div className="hero-footnote"><LockKeyhole size={13} /> Local video only <span>·</span> No account <span>·</span> Research build</div>
          </div>
          <div className="hero-visual" aria-label="Illustrative cube replay">
            <div className="visual-topline"><span>TURNATLAS / LAB 01</span><span className="live-indicator"><i /> REPLAY UI DEMO</span></div>
            <div className="hero-cube-wrap">
              <div className="cube-orbit orbit-a" /><div className="cube-orbit orbit-b" />
              <CubeScene sequence={exampleMoves} cameraMode={view} />
              <div className="cube-callout callout-left"><span>01</span><b>Move sequence</b><small>Illustrative only</small></div>
              <div className="cube-callout callout-right"><span>02</span><b>Video sync</b><small>Recognition not trained yet</small></div>
            </div>
            <div className="visual-controls">
              <div className="view-switch" aria-label="Cube camera view">
                <button className={view === "cuber" ? "selected" : ""} onClick={() => setView("cuber")}>Cuber’s view</button>
                <button className={view === "orbit" ? "selected" : ""} onClick={() => setView("orbit")}>Orbit view</button>
              </div>
              <div className="demo-scrub"><span>00:04.20</span><div className="scrub-track"><i /></div><span>00:08.40</span></div>
            </div>
          </div>
        </section>

        <section className="signal-strip wrap" aria-label="Prototype status">
          <div className="signal-item"><span className="signal-index">A</span><div><b>Motion candidates</b><small>Detected on-device</small></div></div>
          <MoveRight className="signal-arrow" size={18} />
          <div className="signal-item"><span className="signal-index signal-index--dim">B</span><div><b>Move recognition</b><small>Needs labeled video data</small></div></div>
          <MoveRight className="signal-arrow" size={18} />
          <div className="signal-item"><span className="signal-index signal-index--dim">C</span><div><b>3D replay</b><small>Sequence viewer ready</small></div></div>
          <span className="signal-caption">NO GUESSED MOVES</span>
        </section>

        <section className="demo-section wrap" id="demo">
          <div className="section-heading">
            <div><div className="eyebrow">A REPLAY, NOT A CLAIM</div><h2>See how a solve <em>could</em> unfold.</h2></div>
            <p>This is a synthetic move sequence to demonstrate cube playback. It is not reconstructed from video and does not represent measured recognition accuracy.</p>
          </div>
          <div className="demo-panel">
            <div className="demo-panel-main">
              <div className="panel-label"><span className="panel-dot" /> SYNTHETIC SEQUENCE</div>
              <div className="move-pills">{exampleMoves.split(" ").map((move, index) => <span key={`${move}-${index}`} className={index === 2 ? "move-pill is-current" : "move-pill"}>{move}</span>)}</div>
              <div className="panel-timebar"><span>00:00</span><div className="timebar"><i /></div><span>00:08</span></div>
            </div>
            <div className="demo-panel-aside"><div className="aside-icon"><ScanSearch size={17} /></div><div><b>Move recognition is the hard part.</b><p>The prototype can locate image-change bursts. A labeled dataset and a trained classifier are still needed before it can name turns reliably.</p></div><Link href="/upload">Try a local scan <ArrowRight size={14} /></Link></div>
          </div>
        </section>

        <section className="process-section wrap">
          <div className="section-heading section-heading--compact"><div><div className="eyebrow">THE WORKFLOW</div><h2>Three steps from clip to <em>review.</em></h2></div><span className="section-mark">/ 01—03</span></div>
          <div className="process-grid">
            <article className="process-card"><div className="process-number">01 <Film size={17} /></div><h3>Choose a clear solve video</h3><p>Use a short clip with one 3×3 cube in frame. The current scanner samples frames locally and highlights visual motion bursts.</p><span className="process-state">AVAILABLE NOW</span></article>
            <article className="process-card"><div className="process-number process-number--muted">02 <Eye size={17} /></div><h3>Review what the camera saw</h3><p>Motion is not a move. Each burst stays unclassified until there is a verified recognition model; you can label candidates manually.</p><span className="process-state process-state--muted">EARLY RESEARCH</span></article>
            <article className="process-card"><div className="process-number process-number--muted">03 <Sparkles size={17} /></div><h3>Replay a checked sequence</h3><p>Once moves are reviewed, step through the cube state and video together. The sequence engine validates notation and applies turns.</p><span className="process-state">VIEWER READY</span></article>
          </div>
        </section>

        <section className="privacy-band wrap">
          <div className="privacy-icon"><ShieldCheck size={20} /></div>
          <div><div className="eyebrow">PRIVATE BY DEFAULT</div><h2>Your clip stays on this device.</h2><p>Video analysis runs in your browser. Nothing is uploaded or kept by TurnAtlas, and footage is not used for training.</p></div>
          <Link href="/privacy" className="text-link">Read the privacy notes <ArrowUpRight size={14} /></Link>
        </section>
      </main>
    </SiteLayout>
  );
}
