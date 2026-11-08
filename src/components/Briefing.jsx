import { useEffect, useRef, useState } from "react";
import { analyze, answer, intro } from "../ai.js";
import { chips, sampleJobs } from "../content.js";

const gates = [
  {
    id: "source",
    name: "Branch",
    tool: "Bitbucket",
    pass: "Protected branch. The commit is on the release line.",
  },
  {
    id: "sast",
    name: "SAST",
    tool: "SonarQube",
    pass: "Quality gate clear. No new critical issue.",
  },
  {
    id: "secrets",
    name: "Secrets",
    tool: "Secret scan",
    pass: "No credential in the diff.",
    fail: "A key showed up in the diff. The pipeline stops here.",
  },
  {
    id: "trivy",
    name: "Image",
    tool: "Trivy",
    pass: "No critical CVE in the image.",
    fail: "Critical CVE in the image. It does not get published.",
  },
  {
    id: "sign",
    name: "Sign",
    tool: "Cosign",
    pass: "Image signed. Unsigned images are not deployed.",
    skip: "Nothing to sign. The image never published.",
  },
  {
    id: "gitops",
    name: "GitOps",
    tool: "ArgoCD",
    pass: "Helm sync. Deployment, Service, Ingress, HPA, PDB.",
    skip: "Sync held. Git still points at the last good release.",
  },
  {
    id: "edge",
    name: "Edge",
    tool: "WAF + EKS",
    pass: "Private cluster. WAF on the distribution. SSO on the tools.",
    skip: "Runtime unchanged.",
  },
];

function failAt(mode) {
  if (mode === "secret") return "secrets";
  if (mode === "cve") return "trivy";
  return null;
}

export default function Briefing({ tab, setTab, seed }) {
  return (
    <section className="console" id="briefing">
      <header className="console-bar">
        <div>
          <p className="eyebrow">Briefing desk</p>
          <h2>Ask the record. Score a role. Break a release.</h2>
        </div>
        <Clock />
      </header>
      <div className="tabs" role="tablist" aria-label="Briefing">
        {[
          ["ask", "Ask"],
          ["fit", "Role fit"],
          ["gate", "Release gate"],
        ].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? "tab on" : "tab"}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "ask" && <Ask seed={seed} onFit={() => setTab("fit")} />}
      {tab === "fit" && <Fit />}
      {tab === "gate" && <Gate />}
    </section>
  );
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <time className="clock" dateTime={now.toISOString()}>
      {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} local
    </time>
  );
}

function Ask({ seed, onFit }) {
  const [messages, setMessages] = useState([{ id: 0, from: "record", text: intro, follow: chips }]);
  const [topicId, setTopicId] = useState(null);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState("");
  const scroller = useRef(null);
  const box = useRef(null);
  const seen = useRef(0);

  useEffect(() => {
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, pending]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault();
        box.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit(text) {
    const clean = text.trim();
    if (!clean) return;
    const reply = answer(clean, topicId);
    if (/job description|role fit|fit this role|fit a job/.test(clean.toLowerCase())) onFit();
    setTopicId(reply.topicId);
    setMessages((current) => [
      ...current,
      { id: Date.now(), from: "you", text: clean },
      { id: Date.now() + 1, from: "record", text: reply.text, follow: reply.follow },
    ]);
    setDraft("");
    setPending(reply.text);
  }

  useEffect(() => {
    if (!seed || seed.n === seen.current) return;
    seen.current = seed.n;
    submit(seed.text);
    document.getElementById("briefing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [seed]);

  useEffect(() => {
    if (!pending) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPending("");
      return;
    }
    const timer = setTimeout(() => setPending(""), 420);
    return () => clearTimeout(timer);
  }, [pending]);

  return (
    <div className="panel">
      <div className="thread" ref={scroller} aria-live="polite">
        {messages.map((message) => (
          <article key={message.id} className={message.from === "you" ? "msg you" : "msg"}>
            <p className="who">{message.from === "you" ? "You" : "Record"}</p>
            <p className={message.text === pending ? "reveal" : ""}>{message.text}</p>
            {message.follow?.length > 0 && message.text !== pending && (
              <div className="chips">
                {message.follow.map((item) => (
                  <button key={item} type="button" onClick={() => submit(item)}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
      <form
        className="ask"
        onSubmit={(event) => {
          event.preventDefault();
          submit(draft);
        }}
      >
        <label htmlFor="ask">Ask about the work</label>
        <div className="ask-row">
          <input
            id="ask"
            ref={box}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="What failed the build, and what moved AWS accounts?"
            autoComplete="off"
          />
          <button type="submit">Ask</button>
        </div>
        <p className="hint">Press / to focus. Nothing you type leaves this browser.</p>
      </form>
    </div>
  );
}

function Fit() {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  function run(text) {
    setJd(text);
    setResult(analyze(text));
    setCopied(false);
  }

  async function copy() {
    if (!result || result.short) return;
    try {
      await navigator.clipboard.writeText(result.pitch);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="panel fit">
      <div className="fit-copy">
        <p>
          Paste a job description. The score counts tools and work that are actually on this page, then lists what the posting asks for that he has not shipped.
        </p>
        <div className="chips">
          <button type="button" onClick={() => run(sampleJobs.security)}>
            Try a DevSecOps posting
          </button>
          <button type="button" onClick={() => run(sampleJobs.voice)}>
            Try a voice-AI posting
          </button>
        </div>
      </div>
      <label htmlFor="jd">Job description</label>
      <textarea
        id="jd"
        value={jd}
        onChange={(event) => setJd(event.target.value)}
        rows={7}
        placeholder="Paste the posting. A sentence or two is not enough."
      />
      <button type="button" className="solid" onClick={() => run(jd)}>
        Score this role
      </button>
      {result?.short && <p className="hint">Paste a fuller description. Forty characters is the floor.</p>}
      {result && !result.short && (
        <div className="scorecard">
          <div className="scoreline">
            <p className="score">
              {result.score}
              <span>/100</span>
            </p>
            <p className="verdict">{result.verdict}</p>
          </div>
          <div className="bars" aria-hidden="true">
            {result.emphasis.map((item) => (
              <div key={item.name}>
                <span>{item.name}</span>
                <i style={{ width: `${item.pct}%` }} />
              </div>
            ))}
          </div>
          <p className="pitch">{result.pitch}</p>
          <button type="button" onClick={copy}>
            {copied ? "Copied" : "Copy the pitch"}
          </button>
          {result.yearsNote && <p className="note">{result.yearsNote}</p>}
          {result.hits.length > 0 && (
            <>
              <h3>On the record</h3>
              <ul>
                {result.hits.map((hit) => (
                  <li key={hit.id}>
                    <strong>{hit.label}.</strong> {hit.proof}
                  </li>
                ))}
              </ul>
            </>
          )}
          {result.gaps.length > 0 && (
            <>
              <h3>Asked, and not on this record</h3>
              <ul>
                {result.gaps.map((gap) => (
                  <li key={gap.id}>
                    <strong>{gap.label}.</strong> {gap.note}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Gate() {
  const [state, setState] = useState(() => gates.map((gate) => ({ ...gate, status: "idle" })));
  const [log, setLog] = useState("Idle. Run a clean release, or break one on purpose.");
  const [busy, setBusy] = useState(false);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run(mode) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const stop = failAt(mode);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setBusy(true);
    setState(gates.map((gate) => ({ ...gate, status: "idle" })));
    setLog(mode === "clean" ? "Clean release started." : mode === "secret" ? "A secret was planted in the diff." : "A critical CVE was planted in the image.");

    const apply = (index) => {
      const gate = gates[index];
      if (!gate) {
        setBusy(false);
        return;
      }
      setState((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, status: "run" } : item)));
      const finish = () => {
        let status = "pass";
        if (stop) {
          const stopIndex = gates.findIndex((item) => item.id === stop);
          if (index > stopIndex) status = "skip";
          if (index === stopIndex) status = "fail";
        }
        const line = status === "fail" ? gate.fail : status === "skip" ? gate.skip : gate.pass;
        setState((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, status } : item)));
        setLog(`${gate.tool}. ${line}`);
        if (status === "fail") {
          gates.slice(index + 1).forEach((_, offset) => {
            const later = index + 1 + offset;
            setState((current) => current.map((item, itemIndex) => (itemIndex === later ? { ...item, status: "skip" } : item)));
          });
          setBusy(false);
          return;
        }
        apply(index + 1);
      };
      if (reduce) finish();
      else timers.current.push(setTimeout(finish, 380));
    };
    if (reduce) apply(0);
    else timers.current.push(setTimeout(() => apply(0), 160));
  }

  const passed = state.filter((gate) => gate.status === "pass").length;

  return (
    <div className="panel">
      <p className="lede">
        Same shape as the pipelines he runs on contract: Jenkins, SonarQube, a secret scan, Trivy, Cosign, ArgoCD. This run stays in the page. Nothing is deployed.
      </p>
      <div className="gate-actions">
        <button type="button" className="solid" disabled={busy} onClick={() => run("clean")}>
          Run a clean release
        </button>
        <button type="button" disabled={busy} onClick={() => run("secret")}>
          Leak a secret
        </button>
        <button type="button" disabled={busy} onClick={() => run("cve")}>
          Ship a critical CVE
        </button>
      </div>
      <p className="count">
        {passed} of {gates.length} passed
      </p>
      <ol className="gates">
        {state.map((gate, index) => (
          <li key={gate.id} className={gate.status} data-status={gate.status}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{gate.name}</strong>
            <em>{gate.tool}</em>
          </li>
        ))}
      </ol>
      <p className="log" role="status">
        {log}
      </p>
    </div>
  );
}
