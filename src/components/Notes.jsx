import { useEffect, useState } from "react";
import { posts } from "../posts.js";

export function noteFromHash() {
  const match = window.location.hash.match(/^#notes\/([a-z0-9-]+)$/);
  return match ? posts.find((post) => post.slug === match[1]) || null : null;
}

export default function Notes() {
  const lead = posts[0];
  const rest = posts.slice(1);

  return (
    <section className="notes" id="notes">
      <div className="notes-band">
        <div className="notes-inner">
          <div className="section-head">
            <p className="eyebrow light">Field notes</p>
            <h2>
              Written from the work.
              <span className="it">Not from a template.</span>
            </h2>
          </div>
          <a className="cover" href={`#notes/${lead.slug}`}>
            <div>
              <p className="kicker">
                {lead.index} · {lead.tag} · {lead.date}
              </p>
              <h3>
                {lead.title} <em>{lead.italic}</em>
              </h3>
              <p>{lead.dek}</p>
              <span className="read">Read the note</span>
            </div>
            <div className="manuscript" aria-hidden="true">
              {lead.lines.map(([key, value]) => (
                <p key={key}>
                  <b>{key}</b>
                  {value}
                </p>
              ))}
            </div>
          </a>
        </div>
      </div>
      <div className="notes-inner paper-index">
        <ol className="index">
          {rest.map((post) => (
            <li key={post.slug}>
              <a href={`#notes/${post.slug}`}>
                <span className="num">{post.index}</span>
                <span>
                  <strong>
                    {post.title} <em>{post.italic}</em>
                  </strong>
                  <small>
                    {post.tag} · {post.date}
                  </small>
                </span>
                <span className="go">Read</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="colophon">
          Five notes from work at Brightchamps. A stage measurement stays a stage measurement. A planned test stays a plan.
        </p>
      </div>
    </section>
  );
}

export function Article({ post }) {
  const [progress, setProgress] = useState(0);
  const index = posts.findIndex((item) => item.slug === post.slug);
  const next = posts[(index + 1) % posts.length];

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
    function onScroll() {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(1, window.scrollY / height) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    function onKey(event) {
      if (event.key === "Escape") window.location.hash = "notes";
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [post.slug]);

  return (
    <article className="essay">
      <div className="readbar" style={{ transform: `scaleX(${progress})` }} />
      <div className="essay-inner">
        <a className="back" href="#notes">
          All notes
        </a>
        <p className="eyebrow">
          {post.index} · {post.tag} · {post.date} · {post.minutes} min read
        </p>
        <h1>
          {post.title}
          <span className="it">{post.italic}</span>
        </h1>
        <p className="dek">{post.dek}</p>
        <div className="essay-grid">
          <div>
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
          <aside>
            <p className="kicker">Status</p>
            <strong>{post.status}</strong>
            <ol>
              {post.lines.map(([key, value]) => (
                <li key={key}>
                  <b>{key}</b>
                  {value}
                </li>
              ))}
            </ol>
          </aside>
        </div>
        <a className="next" href={`#notes/${next.slug}`}>
          <span>Next note</span>
          <strong>
            {next.title} <em>{next.italic}</em>
          </strong>
        </a>
      </div>
    </article>
  );
}
