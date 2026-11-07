import { useEffect, useState } from "react";
import Briefing from "./components/Briefing.jsx";
import Notes, { Article, noteFromHash } from "./components/Notes.jsx";
import Stage from "./components/Stage.jsx";
import Systems from "./components/Systems.jsx";
import { profile } from "./content.js";

const nav = [
  ["stage", "Release"],
  ["systems", "Systems"],
  ["notes", "Notes"],
  ["briefing", "Briefing"],
  ["contact", "Contact"],
];

export default function App() {
  const [tab, setTab] = useState("ask");
  const [seed, setSeed] = useState(null);
  const [active, setActive] = useState("stage");
  const [post, setPost] = useState(() => noteFromHash());

  useEffect(() => {
    const sync = () => setPost(noteFromHash());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (post) {
      setActive("notes");
      return undefined;
    }
    const nodes = nav.map(([id]) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [post]);

  function askAbout(text) {
    setTab("ask");
    setSeed({ n: Date.now(), text });
  }

  return (
    <>
      <a className="skip" href="#stage">
        Skip to the release
      </a>
      <header className="top">
        <a className="brand" href="#stage">
          Divyanshu Singh
        </a>
        <nav>
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <a className="resume-link" href={profile.resume.view} target="_blank" rel="noreferrer">
          Resume
        </a>
        <a className="mail" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </header>
      {post ? (
        <Article post={post} />
      ) : (
        <>
      <Stage />
      <div className="wrap">
        <Systems onAsk={askAbout} />
      </div>
      <Notes />
      <main className="wrap">
        <Briefing tab={tab} setTab={setTab} seed={seed} />
        <section className="contact" id="contact">
          <p className="eyebrow">Contact</p>
          <h2>Send the role.</h2>
          <p className="dek">Lead DevOps at Brightchamps. DevSecOps, the platform, or the voice path.</p>
          <a className="big" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <p className="phone">
            <a href={`tel:+919520641947`}>{profile.phone}</a>
            <span> · {profile.location}</span>
          </p>
          <div className="resume-actions">
            <a className="resume-view" href={profile.resume.view} target="_blank" rel="noreferrer">
              View resume
            </a>
            <a className="resume-down" href={profile.resume.download} target="_blank" rel="noreferrer">
              Download PDF
            </a>
          </div>
          <ul className="links">
            {profile.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
        </>
      )}
    </>
  );
}
