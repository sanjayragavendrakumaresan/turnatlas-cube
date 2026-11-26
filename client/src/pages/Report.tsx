import { useMemo, useRef, useState } from "react";
import { CircleHelp, RotateCcw, Video } from "lucide-react";
import { Link } from "wouter";
import { SiteLayout } from "../components/SiteLayout";
import CubeScene from "../components/CubeScene";
import { useSolveSession } from "../contexts/SolveSessionContext";

const choices = ["?", "R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2"];
const time = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${(n % 60).toFixed(2).padStart(5, "0")}`;

export default function Report() {
  const { session, updateSession } = useSolveSession();
  const video = useRef<HTMLVideoElement>(null);
  const [now, setNow] = useState(0);
  const [view, setView] = useState<"cuber" | "orbit">("cuber");
  const ordered = useMemo(() => [...session.bursts].sort((a, b) => a.startSeconds - b.startSeconds), [session.bursts]);
  const moves = ordered.filter(item => item.move && item.move !== "?");
  const current = moves.filter(item => item.startSeconds <= now).length;
  const sequence = [session.scramble, ...moves.slice(0, current).map(item => item.move)].filter(Boolean).join(" ");

  const updateBurstTime = (id: string, field: "startSeconds" | "endSeconds", value: number) => {
    const seconds = Math.max(0, Math.min(session.durationSeconds, Number.isFinite(value) ? value : 0));
    updateSession({ bursts: session.bursts.map(item => {
      if (item.id !== id) return item;
      if (field === "startSeconds") return { ...item, startSeconds: Math.min(seconds, item.endSeconds) };
      return { ...item, endSeconds: Math.max(seconds, item.startSeconds) };
    }) });
  };

  if (!session.file || !session.videoUrl) return <SiteLayout active="report"><main className="empty-report wrap"><CircleHelp size={28}/><h1>No active scan</h1><p>Upload a clip and run a local motion scan. Session data is not saved after you leave or reload.</p><Link className="button button-primary" href="/upload">Start a scan</Link></main></SiteLayout>;

  return <SiteLayout active="report"><main className="report-page wrap">
    <div className="report-top"><div><div className="eyebrow">RECONSTRUCTION REPORT / EXPERIMENTAL</div><h1 className="page-title">Review the <em>motion.</em></h1><p>{session.file.name} · {session.sampledFrames} sampled frames · local only</p></div><Link href="/upload" className="button button-quiet"><RotateCcw size={14}/> New scan</Link></div>
    <div className="honesty-banner"><b>Not move recognition:</b> these intervals show image change only. Hand motion, shake, or lighting changes can trigger them. Label a burst manually before it enters the replay.</div>
    <div className="report-grid">
      <section className="report-video"><div className="panel-heading"><Video size={16}/> SOURCE VIDEO <span>{time(now)}</span></div><video ref={video} src={session.videoUrl} controls onTimeUpdate={event => setNow(event.currentTarget.currentTime)}/><div className="report-timeline"><span>0:00</span><div><i style={{left:`${session.durationSeconds ? now / session.durationSeconds * 100 : 0}%`}}/></div><span>{time(session.durationSeconds)}</span></div></section>
      <section className="cube-panel"><div className="panel-heading">3D CUBE REPLAY <span>{moves.length} labels</span></div><CubeScene sequence={sequence} cameraMode={view}/><div className="view-switch"><button className={view === "cuber" ? "selected" : ""} onClick={() => setView("cuber")}>Cuber’s view</button><button className={view === "orbit" ? "selected" : ""} onClick={() => setView("orbit")}>Orbit view</button></div><p className="helper">Replay reflects only manually labeled moves before the playhead. Unlabeled motion is skipped.</p></section>
    </div>
    <section className="candidate-panel"><div className="candidate-heading"><div><div className="eyebrow">CHRONOLOGICAL REVIEW</div><h2>Motion candidates <span>{ordered.length}</span></h2></div><div className="review-key"><CircleHelp size={14}/> “?” means unclassified</div></div>
      {ordered.length ? ordered.map((burst, index) => <div className="candidate-row" key={burst.id}>
        <button className="candidate-time" onClick={() => { if (video.current) video.current.currentTime = burst.startSeconds; }}>{String(index + 1).padStart(2, "0")} <b>{time(burst.startSeconds)}</b></button>
        <div className="activity-meter" aria-label={`Image activity ${Math.round(burst.activity * 100)} percent`}><i style={{width:`${Math.max(8, burst.activity * 100)}%`}}/></div><small>activity</small>
        <select aria-label={`Manual move label for candidate ${index + 1}`} value={burst.move || "?"} onChange={event => updateSession({bursts:session.bursts.map(item => item.id === burst.id ? {...item,move:event.target.value} : item)})}>{choices.map(choice => <option key={choice} value={choice}>{choice}</option>)}</select>
        <div className="candidate-time-edit"><label>Start (s)<input aria-label={`Candidate ${index + 1} start time in seconds`} type="number" min="0" max={session.durationSeconds} step="0.05" value={burst.startSeconds.toFixed(2)} onChange={event => updateBurstTime(burst.id, "startSeconds", Number(event.target.value))}/></label><label>End (s)<input aria-label={`Candidate ${index + 1} end time in seconds`} type="number" min="0" max={session.durationSeconds} step="0.05" value={burst.endSeconds.toFixed(2)} onChange={event => updateBurstTime(burst.id, "endSeconds", Number(event.target.value))}/></label></div>
      </div>) : <div className="no-candidates">No clear motion bursts were detected in this range. Try checking timing or a steadier, brighter clip.</div>}
    </section><div className="report-disclaimer"><CircleHelp size={15}/> Labels are your manual annotations, not model predictions. They have not been checked against ground-truth footage.</div>
  </main></SiteLayout>;
}
