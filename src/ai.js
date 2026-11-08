import { gaps, lexicon, topics } from "./content.js";

export const intro =
  "Ask about the account migration, the release gates, or the voice platform. Answers come from the same record as the rest of this page, and they stay in this browser.";

function clean(raw) {
  return String(raw || "")
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function has(text, term) {
  const escaped = term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, "i").test(` ${text} `);
}

const direct = [
  {
    test: /download.{0,24}resume|view.{0,24}resume|where.{0,24}resume|resume (link|pdf|download)|send.{0,16}resume|curriculum vitae|\bcv\b/,
    topicId: "contact",
    text: "The resume is linked on this page, in the header and again under Contact. View opens the PDF in the browser. Download PDF saves it. Email is cgcdivyanshu@gmail.com.",
    follow: ["Are you open to roles?"],
  },
  {
    test: /job description|role fit|fit this role|fit a job/,
    topicId: "ai-page",
    text: "Open the Role fit tab and paste the posting. The score uses only the work on this page, and it will mark a thin overlap instead of flattering you.",
    follow: ["Which security gates fail the build?"],
  },
  {
    test: /salary|ctc|compensation|pay package|expected pay|how much do you/,
    topicId: "contact",
    text: "Compensation is not on this page. Email cgcdivyanshu@gmail.com with the role and the range, and take it from there.",
    follow: ["Are you open to roles?"],
  },
  {
    test: /notice period|how soon can you|when can you join|joining date/,
    topicId: "open",
    text: "Notice period is not listed here. Email cgcdivyanshu@gmail.com and ask directly. He is based in India and is open to lead DevOps and DevSecOps roles.",
    follow: ["What should I look at first?"],
  },
];

export function answer(raw, previousId) {
  const q = clean(raw);
  if (!q) {
    return { text: intro, topicId: null, follow: [] };
  }

  if (/^(more|details|tell me more|expand|go on|aur batao|aur btao|aur bata)$/.test(q) && previousId) {
    const topic = topics.find((item) => item.id === previousId);
    if (topic) {
      return {
        text: topic.more || topic.answer,
        topicId: topic.id,
        follow: topic.follow,
      };
    }
  }

  for (const rule of direct) {
    if (rule.test.test(q)) {
      return { text: rule.text, topicId: rule.topicId, follow: rule.follow };
    }
  }

  const ranked = topics
    .map((topic) => ({
      topic,
      score: topic.keys.reduce((sum, key) => (q.includes(key) ? sum + Math.min(key.length, 14) : sum), 0),
    }))
    .sort((a, b) => b.score - a.score);

  if (!ranked[0] || ranked[0].score === 0) {
    return {
      text: "That is outside this record. Ask about the AWS account move, the DevSecOps gates, Dhwani, FreeSWITCH, the field notes, or how to reach him.",
      topicId: null,
      follow: [
        "What changed in the AWS migration?",
        "Which security gates fail the build?",
        "How does Dhwani place a call?",
      ],
    };
  }

  const topic = ranked[0].topic;
  return { text: topic.answer, topicId: topic.id, follow: topic.follow };
}

function dominantGroup(hits) {
  const totals = { platform: 0, devsecops: 0, ai: 0, delivery: 0 };
  hits.forEach((hit) => {
    totals[hit.group] = (totals[hit.group] || 0) + hit.weight;
  });
  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
}

function pitchFor(group, proofs) {
  const body = proofs.slice(0, 3).join(" ");
  if (group === "ai") {
    return `Lead with the voice platform. ${body} Under that, he owns the AWS platform: private EKS, Terraform, and pipelines that fail closed.`;
  }
  if (group === "devsecops") {
    return `Lead with the gates. ${body} The same person moved production to a new AWS account without downtime and runs the voice edge for the AI caller.`;
  }
  return `Lead with the platform. ${body} Security is in that path, not beside it: SonarQube, Trivy, secret scanning, and ZAP fail the release.`;
}

export function analyze(jd) {
  const text = String(jd || "").replace(/\s+/g, " ").trim();
  if (text.length < 40) {
    return { short: true };
  }
  const folded = text.toLowerCase();
  const hits = lexicon.filter((item) => item.terms.some((term) => has(folded, term)));
  const foundGaps = gaps.filter((item) => item.terms.some((term) => has(folded, term)));
  const hitWeight = hits.reduce((sum, item) => sum + item.weight, 0);
  const gapWeight = foundGaps.reduce((sum, item) => sum + item.weight, 0);

  let score = 0;
  if (hitWeight === 0) score = foundGaps.length ? 12 : 8;
  else score = Math.round((100 * hitWeight) / (hitWeight + gapWeight));

  if (hits.length === 1 && foundGaps.length === 0) score = Math.min(score, 46);
  score = Math.max(0, Math.min(96, score));

  const years = folded.match(/(\d+)\s*\+?\s*years/);
  const yearsNote =
    years && Number(years[1]) >= 6
      ? `The posting asks for ${years[1]}+ years. He has a little over 3, and he already owns lead scope on contract: the account migration, EKS, and the security gates.`
      : "";

  const group = hits.length ? dominantGroup(hits) : "platform";
  const rankedHits = [...hits].sort((a, b) => b.weight - a.weight);
  const preferred = rankedHits.filter(
    (item) => item.group === group || (group === "platform" && item.group === "delivery")
  );
  const proofs = [
    ...preferred,
    ...rankedHits.filter((item) => !preferred.includes(item)),
  ];
  const groupWeight = proofs.reduce((sum, item) => sum + item.weight, 0) || 1;
  const emphasis = ["devsecops", "ai", "platform"].map((name) => ({
    name,
    pct: Math.round(
      (proofs.filter((item) => item.group === name || (name === "platform" && item.group === "delivery")).reduce((sum, item) => sum + item.weight, 0) /
        groupWeight) *
        100
    ),
  }));

  let verdict = "Thin overlap";
  if (score >= 78) verdict = "Strong fit";
  else if (score >= 55) verdict = "Partial fit";

  return {
    short: false,
    score,
    verdict,
    pitch: hits.length
      ? pitchFor(group, proofs.map((item) => item.proof))
      : "There is not enough overlap to write a pitch. The posting is asking for a different craft.",
    hits: proofs.slice(0, 5),
    gaps: foundGaps.slice(0, 4),
    yearsNote,
    emphasis,
  };
}
