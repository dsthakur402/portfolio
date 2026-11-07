import { useEffect, useRef, useState } from "react";
import { systems } from "../systems.js";

export default function Systems({ onAsk }) {
  const [open, setOpen] = useState("move");

  return (
    <section className="systems" id="systems">
      <div className="section-head">
        <p className="eyebrow">Systems</p>
        <h2>What is actually running.</h2>
      </div>
      <div className="grid">
        {systems.map((system) => {
          const shown = open === system.id;
          return (
            <article key={system.id} className={`sys ${system.span} ${shown ? "open" : ""}`}>
              <button type="button" aria-expanded={shown} onClick={() => setOpen(shown ? "" : system.id)}>
                <span className="kicker">{system.kicker}</span>
                <strong>{system.title}</strong>
                <em>{system.line}</em>
              </button>
              <Widget name={system.widget} />
              {shown && (
                <div className="sys-detail">
                  <p>{system.detail}</p>
                  {system.ask && (
                    <button type="button" className="texty" onClick={() => onAsk(system.ask)}>
                      Ask the record
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
      <p className="now">
        In motion, not shipped: Node.js 24 across stage and production. Next.js 12 and old Chromium Lambda layers still block some apps.
      </p>
    </section>
  );
}

function Widget({ name }) {
  if (name === "cutover") return <Cutover />;
  if (name === "wave") return <Wave />;
  if (name === "sip") return <Flow labels={["softphone", "FreeSWITCH", "trunk"]} />;
  if (name === "gates") return <Flow labels={["scan", "sign", "sync"]} />;
  if (name === "nodes") return <Nodes />;
  if (name === "waf") return <Waf />;
  if (name === "spark") return <Spark />;
  if (name === "spend") return <Spend />;
  if (name === "uptime") return <Uptime />;
  if (name === "channels") return <Channels />;
  return null;
}

function Cutover() {
  return (
    <div className="cut" aria-hidden="true">
      <span>old account</span>
      <span className="track">
        <i />
      </span>
      <span>new org</span>
      <em>0 dropped</em>
    </div>
  );
}

function Wave() {
  return (
    <div className="wave" aria-hidden="true">
      {Array.from({ length: 22 }, (_, index) => (
        <i key={index} style={{ animationDelay: `${(index % 8) * 0.08}s` }} />
      ))}
    </div>
  );
}

function Flow({ labels }) {
  return (
    <div className="flow" aria-hidden="true">
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  );
}

function Nodes() {
  return (
    <div className="nodes" aria-hidden="true">
      {["a", "b", "c", "d", "e"].map((id, index) => (
        <i key={id} style={{ animationDelay: `${index * 0.35}s` }} />
      ))}
    </div>
  );
}

function Waf() {
  const [count, setCount] = useState(18420);
  useEffect(() => {
    const id = setInterval(() => setCount((value) => value + 1 + Math.floor(Math.random() * 3)), 700);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="ticker">
      {count.toLocaleString("en-US")}
      <span> requests seen · WAF in count mode</span>
    </p>
  );
}

function Spark() {
  return (
    <svg className="spark" viewBox="0 0 160 42" aria-hidden="true">
      <path d="M0 30 L16 28 L32 32 L48 18 L64 22 L80 12 L96 16 L112 8 L128 14 L144 6 L160 10" />
    </svg>
  );
}

function Spend() {
  const [value, setValue] = useState(45);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (reduce) {
        setValue(37);
        return;
      }
      let current = 45;
      timer = setInterval(() => {
        current -= 1;
        setValue(current);
        if (current <= 37) clearInterval(timer);
      }, 140);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, []);
  return (
    <p className="spend" ref={ref}>
      ${value}K<span> / month</span>
    </p>
  );
}

function Uptime() {
  return (
    <div className="uptime" aria-hidden="true">
      <span>wiki</span>
      <span>tracker</span>
      <span className="dim">stage</span>
    </div>
  );
}

function Channels() {
  return (
    <div className="channels" aria-hidden="true">
      <span>channel</span>
      <span>channel</span>
      <span className="no">DM</span>
    </div>
  );
}
