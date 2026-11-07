import { useEffect, useState } from "react";

const steps = [
  { id: "git", tool: "git", ok: "8f3c1a  future", bad: "8f3c1a  future" },
  { id: "jenkins", tool: "jenkins", ok: "kaniko  image pushed", bad: "kaniko  image pushed" },
  { id: "sonar", tool: "sonarqube", ok: "quality gate  passed", bad: "quality gate  passed" },
  { id: "secrets", tool: "secrets", ok: "diff  clean", bad: "key found in the diff" },
  { id: "trivy", tool: "trivy", ok: "0 critical", bad: "critical CVE  image held" },
  { id: "sign", tool: "cosign", ok: "image signed", bad: "not signed" },
  { id: "argo", tool: "argocd", ok: "synced  production", bad: "sync held" },
];

function failIndex(mode) {
  if (mode === "secret") return 3;
  if (mode === "cve") return 4;
  return -1;
}

export default function Stage() {
  const [mode, setMode] = useState("success");
  const [runId, setRunId] = useState(1);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stop = failIndex(mode);
    const last = stop === -1 ? steps.length - 1 : stop;
    if (reduce) {
      setStep(last);
      setDone(true);
      return;
    }
    setStep(-1);
    setDone(false);
    const timers = [];
    for (let i = 0; i <= last; i += 1) {
      timers.push(setTimeout(() => setStep(i), 360 + i * 480));
    }
    timers.push(setTimeout(() => setDone(true), 360 + (last + 1) * 480 + 80));
    return () => timers.forEach(clearTimeout);
  }, [mode, runId]);

  const stop = failIndex(mode);
  const failed = done && stop !== -1;
  const success = done && stop === -1;
  const build = 1830 + runId;

  function statusFor(index) {
    if (step < index) return "wait";
    if (stop !== -1 && index > stop && (done || step >= stop)) return "skip";
    if (stop !== -1 && index === stop && (done || step > stop)) return "fail";
    if (index === step && !done) return "run";
    return "pass";
  }

  const visible = steps
    .map((item, index) => ({ ...item, index, status: statusFor(index) }))
    .filter((item) => item.status !== "wait" && item.status !== "skip");

  const progress = success ? 100 : Math.max(0, Math.round(((step + (done ? 1 : 0)) / steps.length) * 100));

  return (
    <section className="stage" id="stage" aria-label="Live release">
      <div className="stage-top">
        <div>
          <p className="eyebrow light">Build #{build} · the real gate, played back</p>
          <h1>
            <span>It goes green,</span>
            <span className="it">or it does not ship.</span>
          </h1>
        </div>
        <div className={`ball ${success ? "success" : failed ? "failure" : "run"}`} aria-live="polite">
          <strong>{success ? "SUCCESS" : failed ? "FAILURE" : "RUNNING"}</strong>
          <em>{progress}%</em>
        </div>
      </div>

      <ol className="rail">
        {steps.map((item, index) => (
          <li key={item.id} data-status={statusFor(index)}>
            <i />
            <span>{item.tool}</span>
          </li>
        ))}
      </ol>

      <div className="term" role="log" aria-live="polite">
        <p className="term-bar">
          <span>jenkins</span>
          <span>prod</span>
        </p>
        <p>
          <b>pipeline</b> start
        </p>
        {visible.map((item) => (
          <p key={item.id} className={item.status}>
            <b>{item.tool}</b> {item.status === "fail" ? item.bad : item.ok}
          </p>
        ))}
        {done && (
          <p className={failed ? "fail" : "pass"}>
            <b>result</b> {failed ? "FAILURE  release stopped" : "SUCCESS  deployed"}
          </p>
        )}
      </div>

      <div className="stage-actions">
        <button
          type="button"
          className="lime"
          onClick={() => {
            setMode("success");
            setRunId((value) => value + 1);
          }}
        >
          Run it again
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("secret");
            setRunId((value) => value + 1);
          }}
        >
          Leak a secret
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("cve");
            setRunId((value) => value + 1);
          }}
        >
          Ship a critical CVE
        </button>
      </div>
    </section>
  );
}
