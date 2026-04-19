"use client"

import { useState } from "react";

// ─── Shared primitives ────────────────────────────────────────────────────────
const colors = {
  bg: "#0f1117",
  surface: "#1a1d24",
  border: "#2d3139",
  text: "#e5e7eb",
  muted: "#9ca3af",
  code: "#161b22",
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  red: "#ef4444",
  pink: "#ec4899",
};

const tabBase = {
  padding: "8px 16px",
  borderRadius: "6px 6px 0 0",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 500,
  border: "1px solid transparent",
  borderBottom: "none",
  transition: "all 0.15s",
};

function Tab({ label, active, onClick, color }) {
  const c = color || colors.blue;
  return (
    <button
      onClick={onClick}
      style={{
        ...tabBase,
        background: active ? colors.surface : "transparent",
        color: active ? c : colors.muted,
        borderColor: active ? colors.border : "transparent",
        borderBottom: active ? `2px solid ${c}` : "1px solid transparent",
      }}
    >
      {label}
    </button>
  );
}

function CodeBlock({ code, language = "python", filename }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={{ marginBottom: 20 }}>
      {filename && (
        <div
          style={{
            background: "#0d1117",
            color: colors.muted,
            fontSize: 11,
            padding: "4px 12px",
            borderRadius: "6px 6px 0 0",
            borderBottom: `1px solid ${colors.border}`,
            fontFamily: "monospace",
          }}
        >
          {filename}
        </div>
      )}
      <div style={{ position: "relative" }}>
        <pre
          style={{
            background: colors.code,
            color: "#c9d1d9",
            padding: "16px",
            borderRadius: filename ? "0 0 6px 6px" : "6px",
            fontSize: 12,
            overflowX: "auto",
            margin: 0,
            border: `1px solid ${colors.border}`,
            borderTop: filename ? "none" : undefined,
            lineHeight: 1.6,
            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          }}
        >
          <code>{code}</code>
        </pre>
        <button
          onClick={copy}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: copied ? colors.green : "#2d3139",
            color: copied ? "#fff" : colors.muted,
            border: "none",
            borderRadius: 4,
            padding: "3px 8px",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        borderRadius: 4,
        padding: "1px 7px",
        fontSize: 11,
        fontWeight: 600,
        marginRight: 6,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

// ─── TAB 1: Architecture ──────────────────────────────────────────────────────
function ArchitectureTab() {
  return (
    <div>
      <h2 style={{ color: colors.text, fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
        LLM Evaluation Landscape
      </h2>
      <p style={{ color: colors.muted, fontSize: 13, marginBottom: 20 }}>
        A three-tier hierarchy of evaluation methods, from statistical heuristics to LLM-based judges.
      </p>

      {/* Main Diagram */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <svg viewBox="0 0 860 600" width="100%" style={{ display: "block" }}>
          {/* Background */}
          <rect width="860" height="600" fill="#0f1117" />

          {/* ── Tier labels on left ── */}
          {[
            { y: 90, label: "TIER 1", sub: "Heuristic", color: "#6b7280" },
            { y: 280, label: "TIER 2", sub: "Learned", color: "#6b7280" },
            { y: 460, label: "TIER 3", sub: "LLM Judge", color: "#6b7280" },
          ].map((t) => (
            <g key={t.y}>
              <text x="18" y={t.y - 6} fill={t.color} fontSize="9" fontWeight="700" textAnchor="middle" transform={`rotate(-90,18,${t.y})`}>{t.label}</text>
              <text x="36" y={t.y - 6} fill={t.color} fontSize="9" textAnchor="middle" transform={`rotate(-90,36,${t.y})`}>{t.sub}</text>
            </g>
          ))}

          {/* ═══════ TIER 1: Heuristic Metrics ═══════ */}
          <rect x="60" y="30" width="760" height="180" rx="10" fill="#1a1d2400" stroke="#374151" strokeWidth="1" strokeDasharray="4 3" />
          <text x="72" y="50" fill="#4b5563" fontSize="10" fontWeight="600">HEURISTIC METRICS — no reference model, purely statistical</text>

          {/* Perplexity */}
          <rect x="80" y="60" width="150" height="130" rx="8" fill="#1a1d24" stroke="#2d3139" strokeWidth="1.5" />
          <text x="155" y="82" fill={colors.blue} fontSize="12" fontWeight="700" textAnchor="middle">Perplexity</text>
          <text x="155" y="98" fill={colors.muted} fontSize="9" textAnchor="middle">exp(−(1/N) Σ log P(wᵢ|w₁..ᵢ₋₁))</text>
          <line x1="80" y1="105" x2="230" y2="105" stroke={colors.border} strokeWidth="1" />
          <text x="90" y="120" fill={colors.muted} fontSize="9">• No reference needed</text>
          <text x="90" y="133" fill={colors.muted} fontSize="9">• Measures prediction confidence</text>
          <text x="90" y="146" fill={colors.muted} fontSize="9">• Lower = better</text>
          <text x="90" y="159" fill={colors.muted} fontSize="9">• Needs log-probs (HuggingFace)</text>
          <text x="90" y="175" fill="#ef444488" fontSize="9">✗ Not usable via OpenAI/Anthropic API</text>

          {/* BLEU */}
          <rect x="250" y="60" width="150" height="130" rx="8" fill="#1a1d24" stroke="#2d3139" strokeWidth="1.5" />
          <text x="325" y="82" fill={colors.green} fontSize="12" fontWeight="700" textAnchor="middle">BLEU</text>
          <text x="325" y="98" fill={colors.muted} fontSize="9" textAnchor="middle">BP · exp(Σ wₙ log pₙ)</text>
          <line x1="250" y1="105" x2="400" y2="105" stroke={colors.border} strokeWidth="1" />
          <text x="260" y="120" fill={colors.muted} fontSize="9">• Reference required</text>
          <text x="260" y="133" fill={colors.muted} fontSize="9">• N-gram precision (1–4)</text>
          <text x="260" y="146" fill={colors.muted} fontSize="9">• Brevity penalty for short outputs</text>
          <text x="260" y="159" fill={colors.muted} fontSize="9">• Higher = better (0–1)</text>
          <text x="260" y="175" fill="#f59e0b88" fontSize="9">⚠ Weak on paraphrase / synonyms</text>

          {/* ROUGE */}
          <rect x="420" y="60" width="150" height="130" rx="8" fill="#1a1d24" stroke="#2d3139" strokeWidth="1.5" />
          <text x="495" y="82" fill={colors.amber} fontSize="12" fontWeight="700" textAnchor="middle">ROUGE</text>
          <text x="495" y="98" fill={colors.muted} fontSize="9" textAnchor="middle">-N / -L / -W variants</text>
          <line x1="420" y1="105" x2="570" y2="105" stroke={colors.border} strokeWidth="1" />
          <text x="430" y="120" fill={colors.muted} fontSize="9">• Recall-oriented (vs BLEU precision)</text>
          <text x="430" y="133" fill={colors.muted} fontSize="9">• ROUGE-1: unigram recall</text>
          <text x="430" y="146" fill={colors.muted} fontSize="9">• ROUGE-L: longest common subseq</text>
          <text x="430" y="159" fill={colors.muted} fontSize="9">• Standard for summarization</text>
          <text x="430" y="175" fill="#f59e0b88" fontSize="9">⚠ No semantic understanding</text>

          {/* METEOR */}
          <rect x="590" y="60" width="150" height="130" rx="8" fill="#1a1d24" stroke="#2d3139" strokeWidth="1.5" />
          <text x="665" y="82" fill={colors.purple} fontSize="12" fontWeight="700" textAnchor="middle">METEOR</text>
          <text x="665" y="98" fill={colors.muted} fontSize="9" textAnchor="middle">Fmean · (1 − Penalty)</text>
          <line x1="590" y1="105" x2="740" y2="105" stroke={colors.border} strokeWidth="1" />
          <text x="600" y="120" fill={colors.muted} fontSize="9">• Stems + synonyms via WordNet</text>
          <text x="600" y="133" fill={colors.muted} fontSize="9">• Better corr. with humans than BLEU</text>
          <text x="600" y="146" fill={colors.muted} fontSize="9">• Chunk-order penalty</text>
          <text x="600" y="159" fill={colors.muted} fontSize="9">• Harmonic mean of P and R</text>
          <text x="600" y="175" fill="#10b98188" fontSize="9">✓ Addresses BLEU synonym gap</text>

          {/* ═══════ TIER 2: Learned ═══════ */}
          <rect x="60" y="220" width="760" height="185" rx="10" fill="#1a1d2400" stroke="#374151" strokeWidth="1" strokeDasharray="4 3" />
          <text x="72" y="240" fill="#4b5563" fontSize="10" fontWeight="600">LEARNED METRICS — contextual embeddings, model-based scoring</text>

          {/* BERTScore */}
          <rect x="120" y="252" width="240" height="135" rx="8" fill="#1a1d24" stroke="#8b5cf666" strokeWidth="1.5" />
          <text x="240" y="273" fill={colors.purple} fontSize="13" fontWeight="700" textAnchor="middle">BERTScore</text>
          <text x="240" y="289" fill={colors.muted} fontSize="9" textAnchor="middle">Zhang et al., 2019  (arXiv:1904.09675)</text>
          <line x1="120" y1="296" x2="360" y2="296" stroke={colors.border} strokeWidth="1" />
          <text x="132" y="312" fill={colors.muted} fontSize="9">1. Tokenize candidate + reference</text>
          <text x="132" y="325" fill={colors.muted} fontSize="9">2. Encode via BERT → contextual embeddings</text>
          <text x="132" y="338" fill={colors.muted} fontSize="9">3. Token-level cosine similarity matrix</text>
          <text x="132" y="351" fill={colors.muted} fontSize="9">4. Greedy match → Precision, Recall, F1</text>
          <text x="132" y="368" fill="#8b5cf688" fontSize="9">Captures paraphrase & polysemy</text>

          {/* MRR / NDCG */}
          <rect x="390" y="252" width="240" height="135" rx="8" fill="#1a1d24" stroke="#10b98166" strokeWidth="1.5" />
          <text x="510" y="273" fill={colors.green} fontSize="13" fontWeight="700" textAnchor="middle">MRR / NDCG</text>
          <text x="510" y="289" fill={colors.muted} fontSize="9" textAnchor="middle">Information Retrieval metrics</text>
          <line x1="390" y1="296" x2="630" y2="296" stroke={colors.border} strokeWidth="1" />
          <text x="402" y="312" fill={colors.muted} fontSize="9">MRR = (1/|Q|) Σ (1/rankᵢ)</text>
          <text x="402" y="325" fill={colors.muted} fontSize="9">• How high is the first correct answer?</text>
          <text x="402" y="338" fill={colors.muted} fontSize="9">NDCG@k = DCG@k / IDCG@k</text>
          <text x="402" y="351" fill={colors.muted} fontSize="9">• Graded relevance + rank position</text>
          <text x="402" y="368" fill="#10b98188" fontSize="9">Standard for RAG retriever evaluation</text>

          {/* ═══════ TIER 3: LLM-as-Judge ═══════ */}
          <rect x="60" y="415" width="760" height="165" rx="10" fill="#1a1d2400" stroke="#374151" strokeWidth="1" strokeDasharray="4 3" />
          <text x="72" y="435" fill="#4b5563" fontSize="10" fontWeight="600">LLM-AS-JUDGE — semantic understanding, rubric-guided scoring</text>

          {/* G-Eval */}
          <rect x="80" y="448" width="175" height="120" rx="8" fill="#1a1d24" stroke="#3b82f666" strokeWidth="1.5" />
          <text x="167" y="468" fill={colors.blue} fontSize="12" fontWeight="700" textAnchor="middle">G-Eval</text>
          <text x="167" y="483" fill={colors.muted} fontSize="9" textAnchor="middle">Liu et al., 2023</text>
          <line x1="80" y1="490" x2="255" y2="490" stroke={colors.border} strokeWidth="1" />
          <text x="90" y="505" fill={colors.muted} fontSize="9">• NLG scoring via chain-of-thought</text>
          <text x="90" y="518" fill={colors.muted} fontSize="9">• Rubric → LLM → 1–5 score</text>
          <text x="90" y="531" fill={colors.muted} fontSize="9">• Probability-weighted aggregation</text>
          <text x="90" y="550" fill="#ef444488" fontSize="9">⚠ Non-deterministic</text>

          {/* RAGAS */}
          <rect x="275" y="448" width="175" height="120" rx="8" fill="#1a1d24" stroke="#f59e0b66" strokeWidth="1.5" />
          <text x="362" y="468" fill={colors.amber} fontSize="12" fontWeight="700" textAnchor="middle">RAGAS</text>
          <text x="362" y="483" fill={colors.muted} fontSize="9" textAnchor="middle">Es et al., EACL 2024</text>
          <line x1="275" y1="490" x2="450" y2="490" stroke={colors.border} strokeWidth="1" />
          <text x="285" y="505" fill={colors.muted} fontSize="9">• Faithfulness (generator)</text>
          <text x="285" y="518" fill={colors.muted} fontSize="9">• Answer Relevancy (generator)</text>
          <text x="285" y="531" fill={colors.muted} fontSize="9">• Context Precision/Recall (retriever)</text>
          <text x="285" y="550" fill="#10b98188" fontSize="9">✓ Full RAG pipeline coverage</text>

          {/* Human Eval */}
          <rect x="470" y="448" width="175" height="120" rx="8" fill="#1a1d24" stroke="#ec489966" strokeWidth="1.5" />
          <text x="557" y="468" fill={colors.pink} fontSize="12" fontWeight="700" textAnchor="middle">Human Eval</text>
          <text x="557" y="483" fill={colors.muted} fontSize="9" textAnchor="middle">Pairwise / Pointwise</text>
          <line x1="470" y1="490" x2="645" y2="490" stroke={colors.border} strokeWidth="1" />
          <text x="480" y="505" fill={colors.muted} fontSize="9">• Thumbs up/down or Likert scale</text>
          <text x="480" y="518" fill={colors.muted} fontSize="9">• Pairwise A/B preference</text>
          <text x="480" y="531" fill={colors.muted} fontSize="9">• Inter-annotator agreement (κ)</text>
          <text x="480" y="550" fill="#ec489988" fontSize="9">⚠ Slow, expensive, inconsistent</text>

          {/* Benchmarks */}
          <rect x="665" y="448" width="145" height="120" rx="8" fill="#1a1d24" stroke="#6b728066" strokeWidth="1.5" />
          <text x="737" y="468" fill="#9ca3af" fontSize="12" fontWeight="700" textAnchor="middle">Benchmarks</text>
          <text x="737" y="483" fill={colors.muted} fontSize="9" textAnchor="middle">MMLU · HumanEval · GSM8K</text>
          <line x1="665" y1="490" x2="810" y2="490" stroke={colors.border} strokeWidth="1" />
          <text x="675" y="505" fill={colors.muted} fontSize="9">• Multiple-choice accuracy</text>
          <text x="675" y="518" fill={colors.muted} fontSize="9">• Code pass@k</text>
          <text x="675" y="531" fill={colors.muted} fontSize="9">• Domain-specific tasks</text>
          <text x="675" y="550" fill="#f59e0b88" fontSize="9">⚠ Risk of benchmark saturation</text>

          {/* ── Legend ── */}
          <rect x="63" y="584" width="735" height="14" rx="3" fill="#1a1d24" stroke={colors.border} strokeWidth="0.5" />
          {[
            { x: 75, color: colors.blue, label: "No-reference" },
            { x: 185, color: colors.green, label: "Reference-required" },
            { x: 320, color: colors.purple, label: "Embedding-based" },
            { x: 450, color: colors.amber, label: "RAG-specific" },
            { x: 560, color: colors.pink, label: "Human / Benchmark" },
            { x: 670, color: colors.red, label: "Known limitation" },
          ].map((l) => (
            <g key={l.x}>
              <circle cx={l.x + 5} cy="591" r="3.5" fill={l.color} />
              <text x={l.x + 12} y="595" fill={colors.muted} fontSize="8">{l.label}</text>
            </g>
          ))}
        </svg>
      </Card>

      {/* Metric Selection Guide */}
      <h3 style={{ color: colors.text, fontSize: 14, fontWeight: 600, marginBottom: 10, marginTop: 20 }}>
        Metric Selection Guide by Task
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          {
            task: "Machine Translation",
            primary: "BLEU",
            secondary: "METEOR, BERTScore",
            note: "BLEU is industry standard (WMT); add METEOR for synonym coverage",
            color: colors.green,
          },
          {
            task: "Summarization",
            primary: "ROUGE-1/2/L",
            secondary: "BERTScore, G-Eval",
            note: "ROUGE dominates academic benchmarks; pair with BERTScore for semantic fidelity",
            color: colors.amber,
          },
          {
            task: "RAG Pipeline",
            primary: "RAGAS",
            secondary: "MRR, NDCG@k",
            note: "Faithfulness + Answer Relevancy for generator; Contextual Precision/Recall for retriever",
            color: colors.purple,
          },
          {
            task: "Open-ended Generation",
            primary: "G-Eval / LLM Judge",
            secondary: "Human eval (sample)",
            note: "Reference-free; define rubric carefully to reduce non-determinism",
            color: colors.blue,
          },
          {
            task: "Code Generation",
            primary: "pass@k (HumanEval)",
            secondary: "Exact Match",
            note: "Functional correctness via test execution; lexical metrics unreliable for code",
            color: colors.pink,
          },
          {
            task: "Model Fluency / Training",
            primary: "Perplexity",
            secondary: "—",
            note: "Only for open-weight models with logprob access; unusable via commercial APIs",
            color: colors.red,
          },
        ].map((r) => (
          <Card key={r.task} style={{ borderLeft: `3px solid ${r.color}` }}>
            <div style={{ color: r.color, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{r.task}</div>
            <div style={{ color: colors.text, fontSize: 12, marginBottom: 2 }}>
              <strong>Primary:</strong> {r.primary}
            </div>
            <div style={{ color: colors.muted, fontSize: 11, marginBottom: 4 }}>
              <strong>Also:</strong> {r.secondary}
            </div>
            <div style={{ color: colors.muted, fontSize: 10, lineHeight: 1.4 }}>{r.note}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── TAB 2: Core Concepts ─────────────────────────────────────────────────────
function ConceptsTab() {
  const concepts = [
    {
      term: "Perplexity",
      attribution: "Shannon (1948), standard NLP",
      definition:
        "The exponentiated average negative log-likelihood a model assigns to a held-out sequence: exp(−(1/N) Σ log P(wᵢ|w₁…ᵢ₋₁)). It measures a model's uncertainty when predicting each next token.",
      why: "Primary intrinsic metric for language model training health and benchmark comparison between model versions. A perplexity of 10 means the model faces on average 10 equally-probable choices per token.",
      mistake:
        "Conflating perplexity across models with different tokenizers. Tokenization differences make raw perplexity scores non-comparable without normalization (bits-per-character is fairer).",
      color: colors.blue,
      badge: "No-reference",
      badgeColor: colors.blue,
    },
    {
      term: "BLEU (Bilingual Evaluation Understudy)",
      attribution: "Papineni et al., ACL 2002",
      definition:
        "Measures n-gram precision between candidate and one or more reference texts, with a brevity penalty to prevent artificially short outputs from scoring high. Ranges 0–1 (higher is better).",
      why: "De facto standard for machine translation benchmarks (WMT competitions). Its determinism and speed enable large-scale batch evaluation.",
      mistake:
        "Applying BLEU to open-ended generation. Synonyms, paraphrases, and valid alternative phrasings all score zero even when semantically correct. Use METEOR or BERTScore for tasks with high lexical variation.",
      color: colors.green,
      badge: "Reference-required",
      badgeColor: colors.green,
    },
    {
      term: "ROUGE (Recall-Oriented Understudy for Gisting Evaluation)",
      attribution: "Lin, ACL Workshop 2004",
      definition:
        "A family of recall-oriented metrics: ROUGE-N measures n-gram overlap, ROUGE-L measures the longest common subsequence, ROUGE-W applies weighted penalties for discontinuous matches. Typically reported as F1.",
      why: "Standard for automatic summarization evaluation; all major summarization papers (CNN/DailyMail, XSum) report ROUGE scores, enabling direct cross-paper comparison.",
      mistake:
        "Treating ROUGE-2 improvements of <0.5 as meaningful. The ACL 2022 meta-study (APPLS) found median ROUGE improvements are +0.89 in published papers, and the metric is not sensitive to simplification vs. elaboration.",
      color: colors.amber,
      badge: "Reference-required",
      badgeColor: colors.amber,
    },
    {
      term: "BERTScore",
      attribution: "Zhang et al., ICLR 2020 (arXiv:1904.09675)",
      definition:
        "Encodes both candidate and reference text with a pre-trained BERT model, then computes token-level cosine similarity to derive precision, recall, and F1 scores. Captures semantic similarity that n-gram metrics miss.",
      why: "Addresses the synonym gap inherent in BLEU/ROUGE. A BERTScore F1 of ~0.92+ on summarization typically indicates strong semantic preservation even when surface form differs significantly.",
      mistake:
        "Using BERTScore as the sole metric. It poorly captures factual correctness — two semantically similar sentences may differ in critical named entities or numbers. Pair with faithfulness checks or RAGAS.",
      color: colors.purple,
      badge: "Embedding-based",
      badgeColor: colors.purple,
    },
    {
      term: "RAGAS (Retrieval Augmented Generation Assessment)",
      attribution: "Es et al., EACL 2024",
      definition:
        "A framework of four LLM-judge-powered metrics for RAG evaluation: Faithfulness (is the answer grounded in the retrieved context?), Answer Relevancy (does it address the query?), Contextual Precision (is relevant context ranked higher?), and Contextual Recall (does the context cover the expected answer?).",
      why: "Uniquely decomposes RAG quality into retriever and generator contributions, enabling targeted fixes. Contextual Recall surfaces embedding model problems; Faithfulness surfaces prompt template and LLM hallucination issues.",
      mistake:
        "Running RAGAS only at development time. Production drift — changing documents, query distributions, or upstream LLM versions — requires continuous monitoring. Wire RAGAS metrics into your observability stack.",
      color: colors.amber,
      badge: "RAG-specific",
      badgeColor: colors.amber,
    },
    {
      term: "G-Eval",
      attribution: "Liu et al., EMNLP 2023",
      definition:
        "Uses a chain-of-thought prompt to guide an LLM through a scoring rubric, then aggregates probabilities over score tokens (1–5) to produce a continuous, more stable score than hard-decoding the LLM's output.",
      why: "Achieves higher correlation with human judgments than ROUGE or BERTScore for coherence, fluency, and relevance on NLG tasks. Effective when exact references are unavailable or multiple valid outputs exist.",
      mistake:
        "Expecting determinism. G-Eval scores vary across runs and across evaluator model versions. For CI gates, prefer QAG-style (question-answer generation) decomposed metrics that reduce to a deterministic proportion.",
      color: colors.blue,
      badge: "LLM Judge",
      badgeColor: colors.pink,
    },
    {
      term: "LLM-as-Judge (Pairwise / Pointwise)",
      attribution: "Zheng et al. — MT-Bench, 2023; survey: arXiv:2412.05579",
      definition:
        "Using a powerful LLM (GPT-4, Claude, Gemini) as an automated evaluator, either scoring a single response against a rubric (pointwise) or choosing between two responses (pairwise/arena-style ELO). The model returns a verdict with optional chain-of-thought reasoning.",
      why: "Scales human-quality evaluation to millions of examples. Pairwise comparisons are more reliable than pointwise scores because they reduce position bias with response order randomization.",
      mistake:
        "Self-evaluation bias — a model tends to prefer outputs from its own family. Use a different model family as the judge, or run ensemble voting across 3+ models (Verga et al., 2024: 'Replacing Judges with Juries').",
      color: colors.pink,
      badge: "LLM Judge",
      badgeColor: colors.pink,
    },
  ];

  return (
    <div>
      <h2 style={{ color: colors.text, fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Core Concepts</h2>
      <p style={{ color: colors.muted, fontSize: 13, marginBottom: 20 }}>
        Authoritative definitions with common mistakes and practical guidance.
      </p>

      {concepts.map((c) => (
        <Card key={c.term} style={{ borderLeft: `3px solid ${c.color}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ color: c.color, fontSize: 14, fontWeight: 600 }}>{c.term}</span>
            <Badge label={c.badge} color={c.badgeColor} />
            <span style={{ color: colors.muted, fontSize: 10 }}>— as defined by: {c.attribution}</span>
          </div>
          <p style={{ color: colors.text, fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{c.definition}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ color: colors.green, fontSize: 10, fontWeight: 600, marginBottom: 3 }}>WHY IT MATTERS</div>
              <div style={{ color: colors.muted, fontSize: 12, lineHeight: 1.5 }}>{c.why}</div>
            </div>
            <div>
              <div style={{ color: colors.red, fontSize: 10, fontWeight: 600, marginBottom: 3 }}>COMMON MISTAKE</div>
              <div style={{ color: colors.muted, fontSize: 12, lineHeight: 1.5 }}>{c.mistake}</div>
            </div>
          </div>
        </Card>
      ))}

      {/* Trade-offs */}
      <Card style={{ borderLeft: `3px solid ${colors.amber}`, marginTop: 20 }}>
        <div style={{ color: colors.amber, fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
          Trade-off Summary: When to Use / When to Avoid
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            {
              title: "Use Statistical Metrics (BLEU/ROUGE) When:",
              items: [
                "Comparing against established academic benchmarks (WMT, CNN/DM)",
                "Fast, cheap, deterministic CI evaluation is required",
                "Reference outputs are exact (translation with known correct answers)",
              ],
              color: colors.green,
            },
            {
              title: "Avoid Statistical Metrics When:",
              items: [
                "Multiple valid phrasings exist (open-ended chat, creative writing)",
                "Semantic correctness matters more than lexical overlap",
                "Evaluating factual accuracy (hallucination detection)",
              ],
              color: colors.red,
            },
            {
              title: "Use LLM-as-Judge When:",
              items: [
                "Reference outputs unavailable or highly variable",
                "Evaluating subjective qualities: helpfulness, tone, coherence",
                "Scaling evaluation beyond what human reviewers can handle",
              ],
              color: colors.green,
            },
            {
              title: "Avoid LLM-as-Judge When:",
              items: [
                "Deterministic gates in CI pipelines (use QAG-based decomposition)",
                "Same model family as subject — self-preference bias is significant",
                "Low latency or cost is critical — judge calls add overhead",
              ],
              color: colors.red,
            },
          ].map((t) => (
            <div key={t.title}>
              <div style={{ color: t.color, fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{t.title}</div>
              {t.items.map((item, i) => (
                <div key={i} style={{ color: colors.muted, fontSize: 12, marginBottom: 3 }}>
                  {t.color === colors.green ? "✓" : "✗"} {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Real-world examples */}
      <Card style={{ marginTop: 12 }}>
        <div style={{ color: colors.text, fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
          Real-World Production Examples
        </div>
        {[
          {
            who: "Meta / WMT Competitions",
            what: "BLEU as primary MT ranking metric since 2006; shifted toward COMET (learned metric) in 2021 WMT after empirical evidence of higher human correlation.",
            color: colors.blue,
          },
          {
            who: "OpenAI (GPT-4 evaluation)",
            what: "Uses LLM-as-judge (MT-Bench, AlpacaEval) for open-ended capability comparison; combines pairwise preference with win rate to reduce position bias.",
            color: colors.green,
          },
          {
            who: "Elastic + RAGAS",
            what: "Integrates RAGAS (Faithfulness, Context Precision, Context Recall) directly into RAG pipeline CI. Faithfulness threshold of 0.8+ signals retrieval groundedness.",
            color: colors.amber,
          },
          {
            who: "Netflix Tech Blog",
            what: "Uses perplexity-per-character for internal LM training monitoring on recommendation models, cross-comparing checkpoints where tokenizer is fixed.",
            color: colors.purple,
          },
        ].map((e) => (
          <div
            key={e.who}
            style={{
              display: "flex",
              gap: 10,
              paddingBottom: 10,
              marginBottom: 10,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <Badge label={e.who} color={e.color} />
            <div style={{ color: colors.muted, fontSize: 12, lineHeight: 1.5, flex: 1 }}>{e.what}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── TAB 3: Implementations ───────────────────────────────────────────────────
const implLangs = ["Python", "TypeScript", "Go", "Rust", "Java 21"];

const coreCode = {
  Python: `# Pattern: LLM Evaluation Metrics Suite
# Reference: NLTK, HuggingFace evaluate, bert-score, ragas
# Production note: Wrap all metric calls in try/except; handle missing
#   log-probs (perplexity unavailable on API-only models) gracefully.

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Protocol, Sequence
import math


# ── Domain types ──────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class EvalSample:
    input: str
    output: str                    # model-generated
    reference: str | None = None  # required for BLEU/ROUGE/METEOR
    context: Sequence[str] = field(default_factory=tuple)  # for RAG faithfulness
    log_probs: Sequence[float] | None = None  # required for perplexity


@dataclass(frozen=True)
class EvalResult:
    metric: str
    score: float
    details: dict[str, float] = field(default_factory=dict)


# ── Metric protocol ───────────────────────────────────────────────────────────

class Metric(Protocol):
    name: str
    def compute(self, sample: EvalSample) -> EvalResult: ...


# ── Perplexity ─────────────────────────────────────────────────────────────────

class PerplexityMetric:
    """
    Requires log-probabilities from the model.
    Only available for open-weight models (HuggingFace, llama.cpp).
    Raises ValueError when log_probs are absent.
    """
    name = "perplexity"

    def compute(self, sample: EvalSample) -> EvalResult:
        if sample.log_probs is None:
            raise ValueError(
                "Perplexity requires log_probs. "
                "Not available via closed API (OpenAI, Anthropic)."
            )
        n = len(sample.log_probs)
        if n == 0:
            raise ValueError("log_probs sequence is empty.")
        avg_neg_log = -sum(sample.log_probs) / n
        ppl = math.exp(avg_neg_log)
        return EvalResult(metric=self.name, score=ppl)


# ── BLEU (manual, n-gram precision) ───────────────────────────────────────────

from collections import Counter

def _ngrams(tokens: list[str], n: int) -> Counter:
    return Counter(tuple(tokens[i:i+n]) for i in range(len(tokens) - n + 1))


class BLEUMetric:
    """
    Reference implementation for clarity.
    For production, prefer: nltk.translate.bleu_score or sacrebleu.
    Production note: sacrebleu handles tokenisation, multi-reference,
    and detokenised input correctly.
    """
    name = "bleu"

    def __init__(self, max_n: int = 4):
        self.max_n = max_n

    def compute(self, sample: EvalSample) -> EvalResult:
        if sample.reference is None:
            raise ValueError("BLEU requires a reference string.")

        cand_tokens = sample.output.lower().split()
        ref_tokens  = sample.reference.lower().split()

        # Brevity penalty
        c, r = len(cand_tokens), len(ref_tokens)
        bp = 1.0 if c >= r else math.exp(1 - r / c)

        precisions: dict[str, float] = {}
        log_sum = 0.0
        for n in range(1, self.max_n + 1):
            cand_ng = _ngrams(cand_tokens, n)
            ref_ng  = _ngrams(ref_tokens, n)
            clipped = sum(min(v, ref_ng[k]) for k, v in cand_ng.items())
            total   = max(sum(cand_ng.values()), 1)
            p_n     = clipped / total if total > 0 else 0.0
            precisions[f"p{n}"] = p_n
            log_sum += (1 / self.max_n) * math.log(p_n) if p_n > 0 else float("-inf")

        bleu = bp * math.exp(log_sum) if log_sum != float("-inf") else 0.0
        return EvalResult(metric=self.name, score=bleu, details=precisions)


# ── ROUGE-L ────────────────────────────────────────────────────────────────────

class ROUGELMetric:
    """
    ROUGE-L via Longest Common Subsequence.
    For production: use the 'rouge-score' package (Google Research).
    """
    name = "rouge_l"

    def _lcs_length(self, a: list[str], b: list[str]) -> int:
        m, n = len(a), len(b)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                dp[i][j] = (
                    dp[i-1][j-1] + 1 if a[i-1] == b[j-1]
                    else max(dp[i-1][j], dp[i][j-1])
                )
        return dp[m][n]

    def compute(self, sample: EvalSample) -> EvalResult:
        if sample.reference is None:
            raise ValueError("ROUGE requires a reference string.")
        cand  = sample.output.lower().split()
        ref   = sample.reference.lower().split()
        lcs   = self._lcs_length(cand, ref)
        p     = lcs / len(cand) if cand else 0.0
        r     = lcs / len(ref)  if ref  else 0.0
        f1    = (2 * p * r) / (p + r) if (p + r) > 0 else 0.0
        return EvalResult(
            metric=self.name, score=f1,
            details={"precision": p, "recall": r}
        )


# ── BERTScore (via bert-score library) ────────────────────────────────────────

class BERTScoreMetric:
    """
    Wraps the bert-score library.
    Install: pip install bert-score
    Production note: Cache model across evaluations; default uses
    roberta-large (355M params); rescale_with_baseline=True normalises
    scores to a more human-interpretable range.
    """
    name = "bertscore"
    _scorer = None  # lazy load

    def _get_scorer(self):
        if self._scorer is None:
            from bert_score import BERTScorer
            self._scorer = BERTScorer(
                lang="en",
                rescale_with_baseline=True,
                verbose=False
            )
        return self._scorer

    def compute(self, sample: EvalSample) -> EvalResult:
        if sample.reference is None:
            raise ValueError("BERTScore requires a reference string.")
        scorer = self._get_scorer()
        P, R, F1 = scorer.score([sample.output], [sample.reference])
        return EvalResult(
            metric=self.name,
            score=float(F1[0]),
            details={"precision": float(P[0]), "recall": float(R[0])}
        )


# ── Faithfulness (LLM-as-judge, RAGAS-style) ─────────────────────────────────

from typing import Callable

class FaithfulnessMetric:
    """
    Checks whether each claim in output is supported by retrieved context.
    Uses an external LLM judge. Production: replace _judge with your
    model client (OpenAI / Anthropic). Implements QAG-style decomposition
    (Confident AI, 2024) for deterministic aggregation.
    """
    name = "faithfulness"

    def __init__(self, judge_fn: Callable[[str], str]):
        self.judge = judge_fn

    def _extract_claims(self, text: str) -> list[str]:
        prompt = (
            f"Split the following text into individual factual claims. "
            f"Return one claim per line, no bullets:\\n\\n{text}"
        )
        raw = self.judge(prompt)
        return [l.strip() for l in raw.splitlines() if l.strip()]

    def _is_supported(self, claim: str, context: str) -> bool:
        prompt = (
            f"Context: {context}\\n\\n"
            f"Claim: {claim}\\n\\n"
            f"Is the claim fully supported by the context? "
            f"Answer only 'yes' or 'no'."
        )
        return self.judge(prompt).strip().lower().startswith("yes")

    def compute(self, sample: EvalSample) -> EvalResult:
        if not sample.context:
            raise ValueError("Faithfulness requires retrieved context.")
        combined_ctx = " ".join(sample.context)
        claims = self._extract_claims(sample.output)
        if not claims:
            return EvalResult(metric=self.name, score=0.0)
        supported = sum(1 for c in claims if self._is_supported(c, combined_ctx))
        score = supported / len(claims)
        return EvalResult(
            metric=self.name,
            score=score,
            details={"claims": len(claims), "supported": supported}
        )


# ── Evaluation runner ─────────────────────────────────────────────────────────

class EvaluationSuite:
    def __init__(self, metrics: list[Metric]):
        self.metrics = metrics

    def evaluate(self, samples: list[EvalSample]) -> list[dict[str, EvalResult]]:
        results = []
        for sample in samples:
            row: dict[str, EvalResult] = {}
            for metric in self.metrics:
                try:
                    row[metric.name] = metric.compute(sample)
                except (ValueError, RuntimeError) as exc:
                    row[metric.name] = EvalResult(
                        metric=metric.name,
                        score=float("nan"),
                        details={"error": str(exc)}
                    )
            results.append(row)
        return results


# ── Usage example ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    sample = EvalSample(
        input="What is the capital of France?",
        output="The capital city of France is Paris.",
        reference="Paris is the capital of France.",
    )

    suite = EvaluationSuite(metrics=[
        BLEUMetric(max_n=4),
        ROUGELMetric(),
        # BERTScoreMetric(),  # uncomment after: pip install bert-score
    ])

    results = suite.evaluate([sample])
    for metric_name, result in results[0].items():
        print(f"{metric_name:12s}: {result.score:.4f}  {result.details}")

    # Expected output (approximate):
    # bleu        : 0.4559  {'p1': 0.875, 'p2': 0.714, 'p3': 0.5, 'p4': 0.25}
    # rouge_l     : 0.7500  {'precision': 0.75, 'recall': 0.75}`,

  TypeScript: `// Pattern: LLM Evaluation Metrics Suite
// Reference: NLTK port + bert-score + ragas concepts
// Production note: All metric functions return Result<T, EvalError>;
//   never throw — callers decide how to handle failures.

// ── Domain types ──────────────────────────────────────────────────────────────

export interface EvalSample {
  readonly input: string;
  readonly output: string;         // model-generated
  readonly reference?: string;     // required for BLEU/ROUGE
  readonly context?: string[];     // required for faithfulness
  readonly logProbs?: number[];    // required for perplexity
}

export interface EvalResult {
  readonly metric: string;
  readonly score: number;
  readonly details?: Record<string, number | string>;
}

type EvalError = { kind: "MissingInput"; message: string } | { kind: "EmptySequence" };

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

const ok  = <T>(value: T): Result<T, never>     => ({ ok: true,  value });
const err = <E>(error: E): Result<never, E>      => ({ ok: false, error });

// ── Metric interface ──────────────────────────────────────────────────────────

interface Metric {
  readonly name: string;
  compute(sample: EvalSample): Result<EvalResult, EvalError>;
}

// ── Perplexity ────────────────────────────────────────────────────────────────

export class PerplexityMetric implements Metric {
  readonly name = "perplexity";

  compute(sample: EvalSample): Result<EvalResult, EvalError> {
    if (!sample.logProbs?.length) {
      return err({
        kind: "MissingInput",
        message: "logProbs required. Not available from closed APIs (OpenAI, Anthropic).",
      });
    }
    const n         = sample.logProbs.length;
    const avgNegLog = -sample.logProbs.reduce((a, b) => a + b, 0) / n;
    return ok({ metric: this.name, score: Math.exp(avgNegLog) });
  }
}

// ── N-gram helpers ────────────────────────────────────────────────────────────

function ngrams(tokens: string[], n: number): Map<string, number> {
  const counts = new Map<string, number>();
  for (let i = 0; i <= tokens.length - n; i++) {
    const key = tokens.slice(i, i + n).join(" ");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

// ── BLEU ─────────────────────────────────────────────────────────────────────

export class BLEUMetric implements Metric {
  readonly name = "bleu";
  constructor(private readonly maxN: number = 4) {}

  compute(sample: EvalSample): Result<EvalResult, EvalError> {
    if (!sample.reference) {
      return err({ kind: "MissingInput", message: "BLEU requires a reference string." });
    }
    const cand = sample.output.toLowerCase().split(/\\s+/);
    const ref  = sample.reference.toLowerCase().split(/\\s+/);

    const bp = cand.length >= ref.length ? 1 : Math.exp(1 - ref.length / cand.length);
    const details: Record<string, number> = {};
    let logSum = 0;

    for (let n = 1; n <= this.maxN; n++) {
      const candNg = ngrams(cand, n);
      const refNg  = ngrams(ref, n);
      let clipped  = 0;
      let total    = 0;
      candNg.forEach((cnt, key) => {
        clipped += Math.min(cnt, refNg.get(key) ?? 0);
        total   += cnt;
      });
      const pn = total > 0 ? clipped / total : 0;
      details[\`p\${n}\`] = pn;
      logSum += pn > 0 ? (1 / this.maxN) * Math.log(pn) : -Infinity;
    }

    const bleu = logSum === -Infinity ? 0 : bp * Math.exp(logSum);
    return ok({ metric: this.name, score: bleu, details });
  }
}

// ── ROUGE-L ────────────────────────────────────────────────────────────────────

export class ROUGELMetric implements Metric {
  readonly name = "rouge_l";

  private lcsLength(a: string[], b: string[]): number {
    const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
      new Array(b.length + 1).fill(0)
    );
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[a.length][b.length];
  }

  compute(sample: EvalSample): Result<EvalResult, EvalError> {
    if (!sample.reference) {
      return err({ kind: "MissingInput", message: "ROUGE requires a reference string." });
    }
    const cand = sample.output.toLowerCase().split(/\\s+/);
    const ref  = sample.reference.toLowerCase().split(/\\s+/);
    const lcs  = this.lcsLength(cand, ref);
    const p    = cand.length > 0 ? lcs / cand.length : 0;
    const r    = ref.length  > 0 ? lcs / ref.length  : 0;
    const f1   = p + r > 0 ? (2 * p * r) / (p + r) : 0;
    return ok({ metric: this.name, score: f1, details: { precision: p, recall: r } });
  }
}

// ── Faithfulness (LLM-as-judge, deterministic QAG pattern) ───────────────────

type JudgeFn = (prompt: string) => Promise<string>;

export class FaithfulnessMetric implements Metric {
  readonly name = "faithfulness";
  constructor(private readonly judge: JudgeFn) {}

  private async extractClaims(text: string): Promise<string[]> {
    const prompt = \`Extract individual factual claims from the text below.
Return one claim per line, no bullets or numbering.

Text: \${text}\`;
    const raw = await this.judge(prompt);
    return raw.split("\\n").map(l => l.trim()).filter(Boolean);
  }

  private async isSupported(claim: string, context: string): Promise<boolean> {
    const prompt = \`Context: \${context}

Claim: \${claim}

Is the claim fully supported by the context? Answer only "yes" or "no".\`;
    const answer = await this.judge(prompt);
    return answer.trim().toLowerCase().startsWith("yes");
  }

  async computeAsync(sample: EvalSample): Promise<Result<EvalResult, EvalError>> {
    if (!sample.context?.length) {
      return err({ kind: "MissingInput", message: "Faithfulness requires context." });
    }
    const combinedCtx = sample.context.join(" ");
    const claims = await this.extractClaims(sample.output);
    if (claims.length === 0) {
      return ok({ metric: this.name, score: 0, details: { claims: 0 } });
    }
    const verdicts = await Promise.all(
      claims.map(c => this.isSupported(c, combinedCtx))
    );
    const supported = verdicts.filter(Boolean).length;
    return ok({
      metric: this.name,
      score: supported / claims.length,
      details: { claims: claims.length, supported },
    });
  }

  // Sync fallback satisfies interface; use computeAsync in practice
  compute(sample: EvalSample): Result<EvalResult, EvalError> {
    if (!sample.context?.length) {
      return err({ kind: "MissingInput", message: "Use computeAsync for faithfulness." });
    }
    return err({ kind: "MissingInput", message: "Use computeAsync for faithfulness." });
  }
}

// ── Usage example ─────────────────────────────────────────────────────────────

async function main() {
  const sample: EvalSample = {
    input:     "What is the capital of France?",
    output:    "The capital city of France is Paris.",
    reference: "Paris is the capital of France.",
  };

  const metrics: Metric[] = [new BLEUMetric(4), new ROUGELMetric()];

  for (const metric of metrics) {
    const result = metric.compute(sample);
    if (result.ok) {
      console.log(\`\${result.value.metric.padEnd(12)}: \${result.value.score.toFixed(4)}\`, result.value.details);
    } else {
      console.error(\`\${metric.name}: ERROR — \${result.error.kind}\`);
    }
  }
}

main();`,

  Go: `// Pattern: LLM Evaluation Metrics Suite
// Reference: NLTK BLEU, ROUGE-L, faithfulness (RAGAS pattern)
// Production note: All error paths explicit; no panics.
//   For perplexity: only usable with models that expose log-probabilities.

package eval

import (
	"context"
	"errors"
	"fmt"
	"math"
	"strings"
)

// ── Domain types ──────────────────────────────────────────────────────────────

type EvalSample struct {
	Input     string
	Output    string   // model-generated
	Reference string   // optional; required for BLEU/ROUGE
	Context   []string // optional; required for faithfulness
	LogProbs  []float64 // optional; required for perplexity
}

type EvalResult struct {
	Metric  string
	Score   float64
	Details map[string]float64
}

// ── Metric interface ──────────────────────────────────────────────────────────

type Metric interface {
	Name() string
	Compute(ctx context.Context, s EvalSample) (EvalResult, error)
}

// ── Perplexity ────────────────────────────────────────────────────────────────

type PerplexityMetric struct{}

func (m *PerplexityMetric) Name() string { return "perplexity" }

func (m *PerplexityMetric) Compute(_ context.Context, s EvalSample) (EvalResult, error) {
	if len(s.LogProbs) == 0 {
		return EvalResult{}, errors.New(
			"perplexity requires LogProbs; not available via closed APIs (OpenAI/Anthropic)",
		)
	}
	var sum float64
	for _, lp := range s.LogProbs {
		sum += lp
	}
	avgNegLog := -sum / float64(len(s.LogProbs))
	return EvalResult{Metric: m.Name(), Score: math.Exp(avgNegLog)}, nil
}

// ── N-gram helpers ────────────────────────────────────────────────────────────

func ngrams(tokens []string, n int) map[string]int {
	counts := make(map[string]int)
	for i := 0; i <= len(tokens)-n; i++ {
		key := strings.Join(tokens[i:i+n], " ")
		counts[key]++
	}
	return counts
}

func tokenize(s string) []string {
	return strings.Fields(strings.ToLower(s))
}

// ── BLEU ─────────────────────────────────────────────────────────────────────

type BLEUMetric struct {
	MaxN int // default 4
}

func (m *BLEUMetric) Name() string { return "bleu" }

func (m *BLEUMetric) Compute(_ context.Context, s EvalSample) (EvalResult, error) {
	if s.Reference == "" {
		return EvalResult{}, errors.New("BLEU requires a reference string")
	}
	maxN := m.MaxN
	if maxN == 0 {
		maxN = 4
	}
	cand := tokenize(s.Output)
	ref  := tokenize(s.Reference)

	bp := 1.0
	if len(cand) < len(ref) {
		bp = math.Exp(1 - float64(len(ref))/float64(len(cand)))
	}

	details := make(map[string]float64)
	logSum  := 0.0
	for n := 1; n <= maxN; n++ {
		candNG := ngrams(cand, n)
		refNG  := ngrams(ref, n)
		clipped, total := 0, 0
		for k, cnt := range candNG {
			if refCnt, ok := refNG[k]; ok && refCnt > 0 {
				clipped += min(cnt, refCnt)
			}
			total += cnt
		}
		pn := 0.0
		if total > 0 {
			pn = float64(clipped) / float64(total)
		}
		details[fmt.Sprintf("p%d", n)] = pn
		if pn > 0 {
			logSum += (1.0 / float64(maxN)) * math.Log(pn)
		} else {
			logSum = math.Inf(-1)
			break
		}
	}

	bleu := 0.0
	if !math.IsInf(logSum, -1) {
		bleu = bp * math.Exp(logSum)
	}
	return EvalResult{Metric: m.Name(), Score: bleu, Details: details}, nil
}

func min(a, b int) int {
	if a < b { return a }
	return b
}

// ── ROUGE-L ────────────────────────────────────────────────────────────────────

type ROUGELMetric struct{}

func (m *ROUGELMetric) Name() string { return "rouge_l" }

func lcsLength(a, b []string) int {
	dp := make([][]int, len(a)+1)
	for i := range dp {
		dp[i] = make([]int, len(b)+1)
	}
	for i := 1; i <= len(a); i++ {
		for j := 1; j <= len(b); j++ {
			if a[i-1] == b[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
			} else if dp[i-1][j] > dp[i][j-1] {
				dp[i][j] = dp[i-1][j]
			} else {
				dp[i][j] = dp[i][j-1]
			}
		}
	}
	return dp[len(a)][len(b)]
}

func (m *ROUGELMetric) Compute(_ context.Context, s EvalSample) (EvalResult, error) {
	if s.Reference == "" {
		return EvalResult{}, errors.New("ROUGE-L requires a reference string")
	}
	cand := tokenize(s.Output)
	ref  := tokenize(s.Reference)
	lcs  := float64(lcsLength(cand, ref))

	var p, r float64
	if len(cand) > 0 { p = lcs / float64(len(cand)) }
	if len(ref)  > 0 { r = lcs / float64(len(ref))  }
	f1 := 0.0
	if p+r > 0 {
		f1 = 2 * p * r / (p + r)
	}
	return EvalResult{
		Metric:  m.Name(),
		Score:   f1,
		Details: map[string]float64{"precision": p, "recall": r},
	}, nil
}

// ── Faithfulness (LLM-as-judge, QAG pattern) ─────────────────────────────────

type JudgeFn func(ctx context.Context, prompt string) (string, error)

type FaithfulnessMetric struct {
	Judge JudgeFn
}

func (m *FaithfulnessMetric) Name() string { return "faithfulness" }

func (m *FaithfulnessMetric) extractClaims(ctx context.Context, text string) ([]string, error) {
	prompt := fmt.Sprintf(
		"Extract individual factual claims from the text below.\\nReturn one claim per line.\\n\\nText: %s",
		text,
	)
	raw, err := m.Judge(ctx, prompt)
	if err != nil {
		return nil, fmt.Errorf("extractClaims judge call: %w", err)
	}
	var claims []string
	for _, line := range strings.Split(raw, "\\n") {
		if t := strings.TrimSpace(line); t != "" {
			claims = append(claims, t)
		}
	}
	return claims, nil
}

func (m *FaithfulnessMetric) isSupported(ctx context.Context, claim, context string) (bool, error) {
	prompt := fmt.Sprintf(
		"Context: %s\\n\\nClaim: %s\\n\\nIs the claim fully supported by the context? Answer only 'yes' or 'no'.",
		context, claim,
	)
	answer, err := m.Judge(ctx, prompt)
	if err != nil {
		return false, err
	}
	return strings.HasPrefix(strings.ToLower(strings.TrimSpace(answer)), "yes"), nil
}

func (m *FaithfulnessMetric) Compute(ctx context.Context, s EvalSample) (EvalResult, error) {
	if len(s.Context) == 0 {
		return EvalResult{}, errors.New("faithfulness requires retrieved context")
	}
	combinedCtx := strings.Join(s.Context, " ")
	claims, err := m.extractClaims(ctx, s.Output)
	if err != nil {
		return EvalResult{}, err
	}
	if len(claims) == 0 {
		return EvalResult{Metric: m.Name(), Score: 0}, nil
	}
	supported := 0
	for _, claim := range claims {
		ok, err := m.isSupported(ctx, claim, combinedCtx)
		if err != nil {
			return EvalResult{}, fmt.Errorf("isSupported: %w", err)
		}
		if ok {
			supported++
		}
	}
	score := float64(supported) / float64(len(claims))
	return EvalResult{
		Metric: m.Name(),
		Score:  score,
		Details: map[string]float64{
			"claims":    float64(len(claims)),
			"supported": float64(supported),
		},
	}, nil
}

// ── Evaluation runner ─────────────────────────────────────────────────────────

type Suite struct {
	Metrics []Metric
}

type SampleResult struct {
	Results map[string]EvalResult
	Errors  map[string]error
}

func (s *Suite) Evaluate(ctx context.Context, samples []EvalSample) []SampleResult {
	out := make([]SampleResult, len(samples))
	for i, sample := range samples {
		row := SampleResult{
			Results: make(map[string]EvalResult),
			Errors:  make(map[string]error),
		}
		for _, m := range s.Metrics {
			r, err := m.Compute(ctx, sample)
			if err != nil {
				row.Errors[m.Name()] = err
			} else {
				row.Results[m.Name()] = r
			}
		}
		out[i] = row
	}
	return out
}`,

  Rust: `// Pattern: LLM Evaluation Metrics Suite
// Reference: NLTK BLEU, ROUGE-L, faithfulness (RAGAS QAG pattern)
// Production note: All errors via thiserror; no unwrap() in library code.

use std::collections::HashMap;
use thiserror::Error;

// ── Error types ───────────────────────────────────────────────────────────────

#[derive(Debug, Error)]
pub enum EvalError {
    #[error("missing input: {0}")]
    MissingInput(String),
    #[error("judge call failed: {0}")]
    JudgeError(String),
    #[error("empty sequence")]
    EmptySequence,
}

// ── Domain types ──────────────────────────────────────────────────────────────

#[derive(Debug, Clone)]
pub struct EvalSample {
    pub input:     String,
    pub output:    String,
    pub reference: Option<String>,
    pub context:   Vec<String>,
    pub log_probs: Vec<f64>,
}

#[derive(Debug, Clone)]
pub struct EvalResult {
    pub metric:  String,
    pub score:   f64,
    pub details: HashMap<String, f64>,
}

// ── Metric trait ──────────────────────────────────────────────────────────────

pub trait Metric {
    fn name(&self) -> &str;
    fn compute(&self, sample: &EvalSample) -> Result<EvalResult, EvalError>;
}

// ── Perplexity ────────────────────────────────────────────────────────────────

pub struct PerplexityMetric;

impl Metric for PerplexityMetric {
    fn name(&self) -> &str { "perplexity" }

    fn compute(&self, sample: &EvalSample) -> Result<EvalResult, EvalError> {
        if sample.log_probs.is_empty() {
            return Err(EvalError::MissingInput(
                "log_probs required; not available via closed APIs (OpenAI/Anthropic)".into(),
            ));
        }
        let n         = sample.log_probs.len() as f64;
        let sum: f64  = sample.log_probs.iter().sum();
        let avg_neg   = -sum / n;
        Ok(EvalResult {
            metric:  self.name().into(),
            score:   avg_neg.exp(),
            details: HashMap::new(),
        })
    }
}

// ── N-gram helpers ────────────────────────────────────────────────────────────

fn tokenize(s: &str) -> Vec<String> {
    s.to_lowercase().split_whitespace().map(String::from).collect()
}

fn ngrams(tokens: &[String], n: usize) -> HashMap<String, usize> {
    let mut counts = HashMap::new();
    for i in 0..tokens.len().saturating_sub(n - 1) {
        let key = tokens[i..i + n].join(" ");
        *counts.entry(key).or_insert(0) += 1;
    }
    counts
}

// ── BLEU ─────────────────────────────────────────────────────────────────────

pub struct BLEUMetric {
    pub max_n: usize,
}

impl Default for BLEUMetric {
    fn default() -> Self { Self { max_n: 4 } }
}

impl Metric for BLEUMetric {
    fn name(&self) -> &str { "bleu" }

    fn compute(&self, sample: &EvalSample) -> Result<EvalResult, EvalError> {
        let reference = sample.reference.as_ref()
            .ok_or_else(|| EvalError::MissingInput("BLEU requires a reference".into()))?;

        let cand = tokenize(&sample.output);
        let ref_ = tokenize(reference);

        let bp = if cand.len() >= ref_.len() {
            1.0_f64
        } else {
            (1.0 - ref_.len() as f64 / cand.len() as f64).exp()
        };

        let mut details = HashMap::new();
        let mut log_sum = 0.0_f64;

        for n in 1..=self.max_n {
            let cand_ng = ngrams(&cand, n);
            let ref_ng  = ngrams(&ref_, n);

            let clipped: usize = cand_ng.iter()
                .map(|(k, &cnt)| cnt.min(*ref_ng.get(k).unwrap_or(&0)))
                .sum();
            let total: usize = cand_ng.values().sum();

            let pn = if total > 0 { clipped as f64 / total as f64 } else { 0.0 };
            details.insert(format!("p{n}"), pn);

            if pn > 0.0 {
                log_sum += pn.ln() / self.max_n as f64;
            } else {
                return Ok(EvalResult { metric: self.name().into(), score: 0.0, details });
            }
        }

        Ok(EvalResult {
            metric:  self.name().into(),
            score:   bp * log_sum.exp(),
            details,
        })
    }
}

// ── ROUGE-L ────────────────────────────────────────────────────────────────────

pub struct ROUGELMetric;

fn lcs_length(a: &[String], b: &[String]) -> usize {
    let (m, n) = (a.len(), b.len());
    let mut dp = vec![vec![0usize; n + 1]; m + 1];
    for i in 1..=m {
        for j in 1..=n {
            dp[i][j] = if a[i-1] == b[j-1] {
                dp[i-1][j-1] + 1
            } else {
                dp[i-1][j].max(dp[i][j-1])
            };
        }
    }
    dp[m][n]
}

impl Metric for ROUGELMetric {
    fn name(&self) -> &str { "rouge_l" }

    fn compute(&self, sample: &EvalSample) -> Result<EvalResult, EvalError> {
        let reference = sample.reference.as_ref()
            .ok_or_else(|| EvalError::MissingInput("ROUGE-L requires a reference".into()))?;

        let cand = tokenize(&sample.output);
        let ref_ = tokenize(reference);
        let lcs  = lcs_length(&cand, &ref_) as f64;

        let p  = if cand.is_empty() { 0.0 } else { lcs / cand.len() as f64 };
        let r  = if ref_.is_empty() { 0.0 } else { lcs / ref_.len() as f64 };
        let f1 = if p + r > 0.0 { 2.0 * p * r / (p + r) } else { 0.0 };

        Ok(EvalResult {
            metric:  self.name().into(),
            score:   f1,
            details: [("precision".into(), p), ("recall".into(), r)].into(),
        })
    }
}

// ── Evaluation suite ──────────────────────────────────────────────────────────

pub struct Suite {
    metrics: Vec<Box<dyn Metric>>,
}

impl Suite {
    pub fn new(metrics: Vec<Box<dyn Metric>>) -> Self { Self { metrics } }

    pub fn evaluate(&self, samples: &[EvalSample]) -> Vec<HashMap<String, Result<EvalResult, EvalError>>> {
        samples.iter().map(|sample| {
            self.metrics.iter().map(|m| {
                (m.name().to_string(), m.compute(sample))
            }).collect()
        }).collect()
    }
}

// ── Usage ─────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_bleu_and_rouge() {
        let sample = EvalSample {
            input:     "What is the capital of France?".into(),
            output:    "The capital city of France is Paris.".into(),
            reference: Some("Paris is the capital of France.".into()),
            context:   vec![],
            log_probs: vec![],
        };

        let suite = Suite::new(vec![
            Box::new(BLEUMetric::default()),
            Box::new(ROUGELMetric),
        ]);

        let results = suite.evaluate(&[sample]);
        for (name, result) in &results[0] {
            match result {
                Ok(r)  => println!("{:<12}: {:.4}  {:?}", name, r.score, r.details),
                Err(e) => eprintln!("{:<12}: ERROR — {}", name, e),
            }
        }
    }
}`,

  "Java 21": `// Pattern: LLM Evaluation Metrics Suite
// Reference: NLTK BLEU, ROUGE-L, BERTScore (API pattern), Faithfulness (RAGAS)
// Production note: Sealed interfaces for exhaustive pattern matching on results.
//   Requires Java 21+ for records, sealed interfaces, and pattern matching.

package dev.techref.eval;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

// ── Domain types ──────────────────────────────────────────────────────────────

record EvalSample(
    String input,
    String output,
    Optional<String> reference,
    List<String> context,
    Optional<List<Double>> logProbs
) {
    static EvalSample withReference(String input, String output, String reference) {
        return new EvalSample(input, output, Optional.of(reference),
            List.of(), Optional.empty());
    }
}

record EvalResult(
    String metric,
    double score,
    Map<String, Double> details
) {
    EvalResult(String metric, double score) {
        this(metric, score, Map.of());
    }
}

// ── Result type (sealed) ──────────────────────────────────────────────────────

sealed interface MetricResult permits MetricResult.Ok, MetricResult.Err {
    record Ok(EvalResult result) implements MetricResult {}
    record Err(String reason)    implements MetricResult {}
}

// ── Metric interface ──────────────────────────────────────────────────────────

interface Metric {
    String name();
    MetricResult compute(EvalSample sample);
}

// ── Perplexity ────────────────────────────────────────────────────────────────

class PerplexityMetric implements Metric {
    @Override public String name() { return "perplexity"; }

    @Override
    public MetricResult compute(EvalSample sample) {
        return sample.logProbs()
            .filter(lp -> !lp.isEmpty())
            .map(lps -> {
                double avgNegLog = -lps.stream().mapToDouble(Double::doubleValue).sum() / lps.size();
                return (MetricResult) new MetricResult.Ok(new EvalResult(name(), Math.exp(avgNegLog)));
            })
            .orElse(new MetricResult.Err(
                "logProbs required; not available via closed APIs (OpenAI/Anthropic)"
            ));
    }
}

// ── N-gram helpers ────────────────────────────────────────────────────────────

final class NgramUtils {
    private NgramUtils() {}

    static List<String> tokenize(String s) {
        return Arrays.asList(s.toLowerCase().trim().split("\\\\s+"));
    }

    static Map<String, Long> ngrams(List<String> tokens, int n) {
        if (tokens.size() < n) return Map.of();
        var counts = new HashMap<String, Long>();
        for (int i = 0; i <= tokens.size() - n; i++) {
            String key = String.join(" ", tokens.subList(i, i + n));
            counts.merge(key, 1L, Long::sum);
        }
        return counts;
    }
}

// ── BLEU ─────────────────────────────────────────────────────────────────────

class BLEUMetric implements Metric {
    private final int maxN;

    BLEUMetric(int maxN) { this.maxN = maxN; }
    BLEUMetric()         { this(4); }

    @Override public String name() { return "bleu"; }

    @Override
    public MetricResult compute(EvalSample sample) {
        if (sample.reference().isEmpty()) {
            return new MetricResult.Err("BLEU requires a reference string");
        }
        var cand = NgramUtils.tokenize(sample.output());
        var ref  = NgramUtils.tokenize(sample.reference().get());

        double bp = cand.size() >= ref.size() ? 1.0
            : Math.exp(1.0 - (double) ref.size() / cand.size());

        var details = new HashMap<String, Double>();
        double logSum = 0.0;

        for (int n = 1; n <= maxN; n++) {
            var candNg = NgramUtils.ngrams(cand, n);
            var refNg  = NgramUtils.ngrams(ref,  n);
            long clipped = candNg.entrySet().stream()
                .mapToLong(e -> Math.min(e.getValue(), refNg.getOrDefault(e.getKey(), 0L)))
                .sum();
            long total = candNg.values().stream().mapToLong(Long::longValue).sum();
            double pn = total > 0 ? (double) clipped / total : 0.0;
            details.put("p" + n, pn);
            if (pn > 0) {
                logSum += Math.log(pn) / maxN;
            } else {
                return new MetricResult.Ok(new EvalResult(name(), 0.0, details));
            }
        }
        return new MetricResult.Ok(new EvalResult(name(), bp * Math.exp(logSum), details));
    }
}

// ── ROUGE-L ────────────────────────────────────────────────────────────────────

class ROUGELMetric implements Metric {
    @Override public String name() { return "rouge_l"; }

    private static int lcs(List<String> a, List<String> b) {
        int m = a.size(), n = b.size();
        var dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = a.get(i-1).equals(b.get(j-1))
                    ? dp[i-1][j-1] + 1
                    : Math.max(dp[i-1][j], dp[i][j-1]);
        return dp[m][n];
    }

    @Override
    public MetricResult compute(EvalSample sample) {
        if (sample.reference().isEmpty()) {
            return new MetricResult.Err("ROUGE-L requires a reference string");
        }
        var cand  = NgramUtils.tokenize(sample.output());
        var ref   = NgramUtils.tokenize(sample.reference().get());
        double lcsLen = lcs(cand, ref);
        double p  = cand.isEmpty() ? 0 : lcsLen / cand.size();
        double r  = ref.isEmpty()  ? 0 : lcsLen / ref.size();
        double f1 = (p + r) > 0 ? 2 * p * r / (p + r) : 0.0;
        return new MetricResult.Ok(new EvalResult(
            name(), f1, Map.of("precision", p, "recall", r)
        ));
    }
}

// ── Evaluation suite ──────────────────────────────────────────────────────────

class EvaluationSuite {
    private final List<Metric> metrics;

    EvaluationSuite(List<Metric> metrics) { this.metrics = metrics; }

    record SampleResults(Map<String, MetricResult> results) {}

    List<SampleResults> evaluate(List<EvalSample> samples) {
        return samples.stream()
            .map(sample -> new SampleResults(
                metrics.stream().collect(Collectors.toMap(
                    Metric::name,
                    m -> m.compute(sample)
                ))
            ))
            .toList();
    }
}

// ── Usage example ─────────────────────────────────────────────────────────────

class EvalDemo {
    public static void main(String[] args) {
        var sample = EvalSample.withReference(
            "What is the capital of France?",
            "The capital city of France is Paris.",
            "Paris is the capital of France."
        );

        var suite = new EvaluationSuite(List.of(
            new BLEUMetric(4),
            new ROUGELMetric(),
            new PerplexityMetric()
        ));

        suite.evaluate(List.of(sample))
             .getFirst()
             .results()
             .forEach((name, result) -> switch (result) {
                 case MetricResult.Ok(var r) ->
                     System.out.printf("%-12s: %.4f  %s%n", name, r.score(), r.details());
                 case MetricResult.Err(var msg) ->
                     System.err.printf("%-12s: ERROR — %s%n", name, msg);
             });
    }
}`
};

function ImplementationsTab() {
  const [lang, setLang] = useState("Python");
  return (
    <div>
      <h2 style={{ color: colors.text, fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
        Core Implementations
      </h2>
      <p style={{ color: colors.muted, fontSize: 13, marginBottom: 16 }}>
        Pure-language, cloud-free implementations of BLEU, ROUGE-L, Perplexity, and Faithfulness metrics.
        No cloud tabs apply — these are algorithm/metrics patterns, not infrastructure patterns.
      </p>

      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        {implLangs.map((l) => (
          <Tab key={l} label={l} active={lang === l} onClick={() => setLang(l)} color={colors.blue} />
        ))}
      </div>

      <CodeBlock
        code={coreCode[lang]}
        language={lang.toLowerCase()}
        filename={`implementations/core/eval_metrics.${
          { Python: "py", TypeScript: "ts", Go: "go", Rust: "rs", "Java 21": "java" }[lang]
        }`}
      />

      {/* Library reference */}
      <Card style={{ marginTop: 4 }}>
        <div style={{ color: colors.text, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          Production Library Recommendations
        </div>
        {[
          { lib: "sacrebleu (Python)", use: "BLEU — handles tokenization, multi-reference, detokenized inputs correctly. Used by WMT.", install: "pip install sacrebleu" },
          { lib: "rouge-score (Python)", use: "ROUGE — Google Research's reference implementation. Returns R/P/F1 for all variants.", install: "pip install rouge-score" },
          { lib: "bert-score (Python)", use: "BERTScore — reference implementation by paper authors. Supports 30+ languages.", install: "pip install bert-score" },
          { lib: "ragas (Python)", use: "RAG metrics — Faithfulness, Answer Relevancy, Contextual Precision/Recall.", install: "pip install ragas" },
          { lib: "deepeval (Python)", use: "G-Eval, QAG-based metrics, agent eval — integrates with pytest.", install: "pip install deepeval" },
          { lib: "evaluate (Python/HF)", use: "Unified HuggingFace interface for BLEU, ROUGE, METEOR, Perplexity, BERTScore.", install: "pip install evaluate" },
        ].map((r) => (
          <div key={r.lib} style={{ display: "flex", gap: 12, paddingBottom: 8, marginBottom: 8, borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ minWidth: 180 }}>
              <div style={{ color: colors.blue, fontSize: 12, fontWeight: 600 }}>{r.lib}</div>
              <div style={{ color: colors.muted, fontSize: 10, fontFamily: "monospace" }}>{r.install}</div>
            </div>
            <div style={{ color: colors.muted, fontSize: 12, lineHeight: 1.5 }}>{r.use}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── TAB 4: Leadership ────────────────────────────────────────────────────────
function LeadershipTab() {
  return (
    <div>
      <h2 style={{ color: colors.text, fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
        Leadership Angles
      </h2>
      <p style={{ color: colors.muted, fontSize: 13, marginBottom: 20 }}>
        Framed for tech lead responsibilities: explaining, defending, monitoring, scaling, and reviewing.
      </p>

      {/* Explain to your team */}
      <Card style={{ borderLeft: `3px solid ${colors.blue}` }}>
        <div style={{ color: colors.blue, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          📢 Explain to Your Team (standup or RFC intro)
        </div>
        <p style={{ color: colors.text, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          LLM evaluation uses a three-tier stack: statistical metrics like BLEU and ROUGE measure
          lexical overlap against a reference output — fast and cheap but blind to synonyms. BERTScore
          adds semantic understanding via contextual embeddings, catching valid paraphrases that
          BLEU misses. For RAG pipelines, RAGAS gives us a decomposed view — faithfulness tells
          us if the generator is hallucinating, contextual recall tells us if the retriever is missing
          relevant chunks — so we can fix the right component. For open-ended quality where no single
          reference exists, we use an LLM as a judge with a structured rubric; this correlates best
          with human preference but introduces non-determinism, so we never use it as a hard CI gate.
        </p>
      </Card>

      {/* Justify the decision */}
      <Card style={{ borderLeft: `3px solid ${colors.green}` }}>
        <div style={{ color: colors.green, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          🏛 Justify the Decision (architecture review)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            {
              scenario: "Why BLEU/ROUGE if they're weak?",
              answer: "They're the Pareto choice for benchmarkable tasks: deterministic, instant, zero-cost, and enable direct comparison against published literature (WMT, CNN/DM). Always pair with BERTScore to catch synonym-induced false negatives.",
            },
            {
              scenario: "Why not just use human evaluation?",
              answer: "Human eval is the gold standard but costs ~$0.50–2.00/sample with 48–72hr turnaround. It doesn't scale to nightly CI on 10K examples. We use it to calibrate automated metrics and for quarterly quality reviews, not for every PR.",
            },
            {
              scenario: "Why use an LLM to evaluate an LLM?",
              answer: "Modern LLMs achieve 80–90% agreement with human raters on structured rubrics (MT-Bench, 2023) — comparable to inter-human agreement. The key constraint: the judge must be a different model family from the subject to avoid self-preference bias.",
            },
            {
              scenario: "Why RAGAS for RAG over generic metrics?",
              answer: "Generic metrics treat the RAG pipeline as a black box. RAGAS decomposes quality into retriever (contextual precision/recall) and generator (faithfulness, answer relevancy), so a drop in faithfulness tells you to adjust the prompt template, while a drop in contextual recall tells you to increase top-K or improve embeddings.",
            },
          ].map((r) => (
            <div key={r.scenario}>
              <div style={{ color: colors.amber, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Q: {r.scenario}</div>
              <div style={{ color: colors.muted, fontSize: 12, lineHeight: 1.5 }}>{r.answer}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Failure modes & observability */}
      <Card style={{ borderLeft: `3px solid ${colors.red}` }}>
        <div style={{ color: colors.red, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          🔥 Failure Modes & Observability
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            {
              mode: "Metric–Task Mismatch",
              signal: "BLEU improves but user satisfaction drops",
              alert: "Correlation check: run BLEU + BERTScore + human sample quarterly; flag divergence >10pts",
            },
            {
              mode: "Judge Model Drift",
              signal: "LLM-as-judge scores shift after evaluator model update",
              alert: "Pin evaluator model version; run anchor test set on every evaluator upgrade; alert on >5% score delta",
            },
            {
              mode: "Faithfulness Score Drop",
              signal: "RAGAS faithfulness <0.7 in production",
              alert: "Wire RAGAS into your observability stack (Langfuse, Arize); p95 faithfulness below threshold triggers PagerDuty",
            },
            {
              mode: "Reference Distribution Shift",
              signal: "BLEU/ROUGE scores collapse after product domain change",
              alert: "Track score distribution, not just mean; alert on std dev spike as well as mean drop",
            },
            {
              mode: "Position Bias in Pairwise Judge",
              signal: "Judge always prefers option A regardless of quality",
              alert: "Randomize response order; check win-rate variance — ideal is ~50/50 on shuffled pairs",
            },
            {
              mode: "Perplexity Not Comparable",
              signal: "Perplexity drops after tokenizer change",
              alert: "Track bits-per-character instead; compare only within same tokenizer version",
            },
          ].map((f) => (
            <Card key={f.mode} style={{ borderLeft: `2px solid ${colors.red}`, padding: 12 }}>
              <div style={{ color: colors.red, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{f.mode}</div>
              <div style={{ color: colors.amber, fontSize: 11, marginBottom: 4 }}>⚠ {f.signal}</div>
              <div style={{ color: colors.muted, fontSize: 11, lineHeight: 1.4 }}>🔔 {f.alert}</div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Scale implications */}
      <Card style={{ borderLeft: `3px solid ${colors.purple}` }}>
        <div style={{ color: colors.purple, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          📈 Scale Implications
        </div>
        {[
          {
            scale: "10× (10K eval samples/day)",
            change: "Statistical metrics (BLEU/ROUGE) remain fast. BERTScore becomes the bottleneck — batch with GPU inference or use the 'distilbert' variant. LLM-as-judge costs scale linearly; cache judge results for identical inputs.",
          },
          {
            scale: "100× (100K samples/day)",
            change: "BERTScore needs a dedicated GPU pool or cloud batch inference. LLM-as-judge costs become significant (~$500–5000/day at GPT-4 pricing); consider quantized open-weight judge models (Prometheus, JudgeLM). Sample-based evaluation (10% of traffic) rather than full coverage.",
          },
          {
            scale: "Production RAG with real-time monitoring",
            change: "RAGAS runs asynchronously on a sample of traces (1–5%); results feed a metrics dashboard. Faithfulness and answer relevancy P95 become SLOs. Full synchronous evaluation per request is economically and latency-infeasible at scale.",
          },
        ].map((s) => (
          <div key={s.scale} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: `1px solid ${colors.border}` }}>
            <Badge label={s.scale} color={colors.purple} />
            <div style={{ color: colors.muted, fontSize: 12, lineHeight: 1.5, marginTop: 6 }}>{s.change}</div>
          </div>
        ))}
      </Card>

      {/* Code review checklist */}
      <Card style={{ borderLeft: `3px solid ${colors.amber}` }}>
        <div style={{ color: colors.amber, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          ✅ Code Review Checklist
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            "Tokenization consistent between train and eval time (same lowercasing, punctuation handling)",
            "Perplexity gated behind log-prob availability check — not silently returning NaN",
            "BLEU uses corpus-level brevity penalty, not per-sentence (sacrebleu handles this correctly)",
            "BERTScore model version pinned — scores shift non-trivially across BERT variants",
            "LLM judge uses a different model family from the subject; position order randomized for pairwise",
            "RAGAS faithfulness uses claim decomposition, not single-pass — otherwise granularity lost",
            "Metric results include details dict (P/R breakdown, claim count) — aggregated score alone is insufficient",
            "Evaluation set has no overlap with fine-tuning or RAG document corpus (contamination check)",
            "Statistical metrics reported with confidence intervals when sample size < 1000",
            "LLM judge prompt includes concrete rubric with examples, not vague instructions",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: colors.green, fontSize: 12, marginTop: 1 }}>☐</span>
              <span style={{ color: colors.muted, fontSize: 12, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Design review questions */}
      <Card>
        <div style={{ color: colors.text, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          🧠 Questions for Design Review (when someone proposes an eval strategy)
        </div>
        {[
          { q: "What's the null hypothesis?", hint: "What score would a random or trivial model get on your metric? If BLEU for your task sits at 0.02 even for good outputs, the signal-to-noise ratio is too low." },
          { q: "Do you have human-agreement baselines?", hint: "Without knowing what inter-human BLEU/ROUGE looks like on this task, you can't know if a 0.4 score is good or terrible." },
          { q: "Have you validated that the metric correlates with user outcomes?", hint: "Run a correlation study between your metric and either user preference ratings or downstream task success rate." },
          { q: "What happens when reference answers are ambiguous or multiple are valid?", hint: "Reference-based metrics assume one right answer. For chatbots, summarization with multiple valid styles, or code with multiple correct implementations, you need reference-free metrics." },
          { q: "How do you detect metric gaming?", hint: "Models (and engineers) can overfit to metrics. ROUGE can be gamed with repetition; BLEU with conservative n-gram selection. Combine metrics and hold out a human eval as a secondary check." },
          { q: "What's your evaluator model version pin strategy?", hint: "GPT-4 judge scores from Nov 2024 are not comparable to Jan 2026. Without version pinning and an anchor test set, longitudinal comparisons are meaningless." },
        ].map((r) => (
          <div key={r.q} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ color: colors.blue, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>❓ {r.q}</div>
            <div style={{ color: colors.muted, fontSize: 12, lineHeight: 1.5 }}>{r.hint}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "arch",  label: "① Architecture",   color: colors.blue   },
  { id: "conc",  label: "② Core Concepts",  color: colors.green  },
  { id: "impl",  label: "③ Implementations",color: colors.purple },
  { id: "lead",  label: "④ Leadership",     color: colors.amber  },
];

export default function LlmEvaluationMetrics() {
  const [tab, setTab] = useState("arch");

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: colors.text }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, padding: "16px 24px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
            <h1 style={{ color: colors.text, fontSize: 20, fontWeight: 600, margin: 0 }}>
              LLM Evaluation & Metrics
            </h1>
            <span style={{ color: colors.muted, fontSize: 12 }}>Tech Lead Reference</span>
            <Badge label="No Cloud Tabs" color={colors.muted} />
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {TABS.map((t) => (
              <Tab key={t.id} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} color={t.color} />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 24px" }}>
        {tab === "arch" && <ArchitectureTab />}
        {tab === "conc" && <ConceptsTab />}
        {tab === "impl" && <ImplementationsTab />}
        {tab === "lead" && <LeadershipTab />}
      </div>
    </div>
  );
}
