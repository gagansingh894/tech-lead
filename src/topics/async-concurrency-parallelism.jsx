"use client"

import { useState } from "react";

// ─── Shared primitives ────────────────────────────────────────────────────────
const colors = {
  bg: "#0f1117",
  surface: "#1a1d24",
  surfaceHover: "#1f2330",
  border: "#2d3139",
  text: "#e5e7eb",
  muted: "#9ca3af",
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  red: "#ef4444",
  cyan: "#06b6d4",
};

const tag = (color, label) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}55`,
    borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600,
    letterSpacing: "0.04em", whiteSpace: "nowrap",
  }}>{label}</span>
);

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      style={{
        position: "absolute", top: 10, right: 10, background: copied ? colors.green + "33" : "#2d3139",
        color: copied ? colors.green : colors.muted, border: `1px solid ${copied ? colors.green + "55" : colors.border}`,
        borderRadius: 5, padding: "3px 10px", fontSize: 11, cursor: "pointer", transition: "all 0.2s",
      }}
    >{copied ? "✓ Copied" : "Copy"}</button>
  );
}

function CodeBlock({ code, lang = "go", filename }) {
  return (
    <div style={{ position: "relative", marginBottom: 20 }}>
      {filename && (
        <div style={{ background: "#161b22", borderRadius: "6px 6px 0 0", padding: "6px 14px", fontSize: 11, color: colors.muted, borderBottom: `1px solid ${colors.border}`, fontFamily: "monospace" }}>
          {filename}
        </div>
      )}
      <div style={{ background: "#161b22", borderRadius: filename ? "0 0 6px 6px" : 6, padding: "16px 14px", overflow: "auto", position: "relative" }}>
        <CopyButton text={code} />
        <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace", fontSize: 12.5, lineHeight: 1.7, color: "#c9d1d9", whiteSpace: "pre" }}>{code}</pre>
      </div>
    </div>
  );
}

// ─── Tab 1: Architecture ──────────────────────────────────────────────────────
function ArchTab() {
  return (
    <div>
      <p style={{ color: colors.muted, marginBottom: 24, lineHeight: 1.7 }}>
        The four concepts exist on two axes: <strong style={{ color: colors.blue }}>structure</strong> (how work is decomposed) vs <strong style={{ color: colors.green }}>execution</strong> (how work physically runs). Understanding their orthogonality is the core insight.
      </p>

      {/* Main conceptual map */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.muted, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>Conceptual Relationship Map</div>
        <svg viewBox="0 0 820 340" style={{ width: "100%", maxWidth: 820 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill={colors.muted} />
            </marker>
            <marker id="ahb" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill={colors.blue} />
            </marker>
            <marker id="ahg" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill={colors.green} />
            </marker>
            <marker id="aha" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill={colors.amber} />
            </marker>
          </defs>

          {/* Axis labels */}
          <text x="10" y="25" fill={colors.muted} fontSize="11" fontWeight="600" letterSpacing="1">STRUCTURE AXIS</text>
          <text x="550" y="25" fill={colors.muted} fontSize="11" fontWeight="600" letterSpacing="1">EXECUTION AXIS</text>
          <line x1="10" y1="30" x2="500" y2="30" stroke={colors.border} strokeWidth="1" strokeDasharray="4,3" />
          <line x1="550" y1="30" x2="810" y2="30" stroke={colors.border} strokeWidth="1" strokeDasharray="4,3" />

          {/* CONCURRENCY box */}
          <rect x="20" y="50" width="220" height="265" rx="8" fill={colors.blue + "11"} stroke={colors.blue} strokeWidth="1.5" />
          <text x="130" y="76" fill={colors.blue} fontSize="14" fontWeight="700" textAnchor="middle">CONCURRENCY</text>
          <text x="130" y="93" fill={colors.muted} fontSize="10" textAnchor="middle">Rob Pike: "dealing with lots</text>
          <text x="130" y="107" fill={colors.muted} fontSize="10" textAnchor="middle">of things at once"</text>

          <rect x="36" y="118" width="188" height="42" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="130" y="135" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">Single-core interleaving</text>
          <text x="130" y="150" fill={colors.muted} fontSize="10" textAnchor="middle">Context switch every ~10ms</text>

          <rect x="36" y="168" width="188" height="42" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="130" y="185" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">Multi-core true overlap</text>
          <text x="130" y="200" fill={colors.muted} fontSize="10" textAnchor="middle">→ This is also parallelism</text>

          <rect x="36" y="218" width="188" height="42" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="130" y="235" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">Event-loop single thread</text>
          <text x="130" y="250" fill={colors.muted} fontSize="10" textAnchor="middle">Node.js, libuv, nginx</text>

          <rect x="36" y="268" width="188" height="36" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="130" y="281" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">Goroutines / green threads</text>
          <text x="130" y="295" fill={colors.muted} fontSize="10" textAnchor="middle">M:N multiplexing</text>

          {/* ASYNC box */}
          <rect x="265" y="50" width="210" height="265" rx="8" fill={colors.amber + "11"} stroke={colors.amber} strokeWidth="1.5" />
          <text x="370" y="76" fill={colors.amber} fontSize="14" fontWeight="700" textAnchor="middle">ASYNC / AWAIT</text>
          <text x="370" y="93" fill={colors.muted} fontSize="10" textAnchor="middle">Programming model for</text>
          <text x="370" y="107" fill={colors.muted} fontSize="10" textAnchor="middle">non-blocking I/O</text>

          <rect x="281" y="118" width="178" height="42" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="370" y="135" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">Suspend at await point</text>
          <text x="370" y="150" fill={colors.muted} fontSize="10" textAnchor="middle">Free thread for other work</text>

          <rect x="281" y="168" width="178" height="42" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="370" y="185" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">Poll / waker mechanism</text>
          <text x="370" y="200" fill={colors.muted} fontSize="10" textAnchor="middle">Rust Future, JS Promise</text>

          <rect x="281" y="218" width="178" height="42" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="370" y="235" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">I/O bound workloads</text>
          <text x="370" y="250" fill={colors.muted} fontSize="10" textAnchor="middle">Network, disk, timers</text>

          <rect x="281" y="268" width="178" height="36" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="370" y="281" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">epoll / kqueue / IOCP</text>
          <text x="370" y="295" fill={colors.muted} fontSize="10" textAnchor="middle">OS-level notification</text>

          {/* PARALLELISM box */}
          <rect x="500" y="50" width="140" height="265" rx="8" fill={colors.green + "11"} stroke={colors.green} strokeWidth="1.5" />
          <text x="570" y="76" fill={colors.green} fontSize="14" fontWeight="700" textAnchor="middle">PARALLELISM</text>
          <text x="570" y="93" fill={colors.muted} fontSize="10" textAnchor="middle">"doing lots at once"</text>
          <text x="570" y="107" fill={colors.muted} fontSize="10" textAnchor="middle">Rob Pike, 2012</text>

          <rect x="512" y="118" width="116" height="50" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="570" y="135" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">Requires multiple</text>
          <text x="570" y="149" fill={colors.text} fontSize="11" textAnchor="middle">CPU cores</text>
          <text x="570" y="163" fill={colors.muted} fontSize="10" textAnchor="middle">physically simultaneous</text>

          <rect x="512" y="178" width="116" height="50" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="570" y="195" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">CPU-bound tasks</text>
          <text x="570" y="209" fill={colors.text} fontSize="11" textAnchor="middle">rayon, Parallel.ForEach</text>
          <text x="570" y="222" fill={colors.muted} fontSize="10" textAnchor="middle">GPU compute</text>

          <rect x="512" y="238" width="116" height="66" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="570" y="254" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">SIMD / vectorized</text>
          <text x="570" y="268" fill={colors.text} fontSize="11" textAnchor="middle">instruction-level</text>
          <text x="570" y="283" fill={colors.muted} fontSize="10" textAnchor="middle">auto-vectorization</text>
          <text x="570" y="298" fill={colors.muted} fontSize="10" textAnchor="middle">data parallelism</text>

          {/* THREADS box */}
          <rect x="660" y="50" width="148" height="265" rx="8" fill={colors.purple + "11"} stroke={colors.purple} strokeWidth="1.5" />
          <text x="734" y="76" fill={colors.purple} fontSize="14" fontWeight="700" textAnchor="middle">THREADS</text>
          <text x="734" y="93" fill={colors.muted} fontSize="10" textAnchor="middle">OS execution unit</text>
          <text x="734" y="107" fill={colors.muted} fontSize="10" textAnchor="middle">~1–8 MB stack</text>

          <rect x="672" y="118" width="124" height="42" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="734" y="135" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">OS thread (1:1)</text>
          <text x="734" y="150" fill={colors.muted} fontSize="10" textAnchor="middle">pthreads, std::thread</text>

          <rect x="672" y="168" width="124" height="42" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="734" y="185" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">Green thread (M:N)</text>
          <text x="734" y="200" fill={colors.muted} fontSize="10" textAnchor="middle">Goroutines ~2KB stack</text>

          <rect x="672" y="218" width="124" height="42" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="734" y="235" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">Thread pool</text>
          <text x="734" y="250" fill={colors.muted} fontSize="10" textAnchor="middle">Tokio, rayon, ForkJoin</text>

          <rect x="672" y="268" width="124" height="36" rx="5" fill={colors.surface} stroke={colors.border} />
          <text x="734" y="281" fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle">Context switch cost</text>
          <text x="734" y="295" fill={colors.muted} fontSize="10" textAnchor="middle">~1–10 μs per switch</text>

          {/* Arrows */}
          {/* Concurrency enables Parallelism */}
          <line x1="500" y1="140" x2="495" y2="140" stroke={colors.green} strokeWidth="1.5" markerEnd="url(#ahg)" />
          <text x="485" y="132" fill={colors.green} fontSize="9" textAnchor="end">enables</text>

          {/* Async uses Threads via runtime */}
          <line x1="475" y1="200" x2="655" y2="200" stroke={colors.purple} strokeWidth="1.5" markerEnd="url(#ah)" strokeDasharray="4,3" />
          <text x="565" y="195" fill={colors.purple} fontSize="9" textAnchor="middle">uses (via runtime)</text>

          {/* Threads implement Concurrency */}
          <line x1="245" y1="175" x2="260" y2="175" stroke={colors.amber} strokeWidth="1.5" markerEnd="url(#aha)" strokeDasharray="4,3" />

        </svg>
      </div>

      {/* Timeline diagrams */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {[
          {
            title: "Synchronous (Blocking)", color: colors.red,
            subtitle: "Single thread, tasks execute sequentially",
            rows: [
              { label: "Thread 1", segments: [{ w: 22, c: colors.blue, t: "Task A" }, { w: 18, c: colors.amber, t: "I/O wait" }, { w: 20, c: colors.blue, t: "Task A" }, { w: 24, c: colors.green, t: "Task B" }] },
            ]
          },
          {
            title: "Async / Event Loop", color: colors.amber,
            subtitle: "Single thread, yield on I/O, interleave tasks",
            rows: [
              { label: "Thread 1", segments: [{ w: 16, c: colors.blue, t: "Task A" }, { w: 14, c: colors.green, t: "Task B" }, { w: 12, c: colors.cyan, t: "Task C" }, { w: 14, c: colors.blue, t: "Task A" }, { w: 12, c: colors.green, t: "Task B" }] },
            ]
          },
          {
            title: "Multithreaded (Concurrent)", color: colors.purple,
            subtitle: "Multiple OS threads, interleaved on single core",
            rows: [
              { label: "Thread 1", segments: [{ w: 20, c: colors.blue, t: "Task A" }, { w: 4, c: colors.border, t: "" }, { w: 20, c: colors.blue, t: "Task A" }, { w: 4, c: colors.border, t: "" }, { w: 20, c: colors.blue, t: "Task A" }] },
              { label: "Thread 2", segments: [{ w: 4, c: colors.border, t: "" }, { w: 20, c: colors.green, t: "Task B" }, { w: 4, c: colors.border, t: "" }, { w: 20, c: colors.green, t: "Task B" }, { w: 20, c: colors.green, t: "Task B" }] },
            ]
          },
          {
            title: "Parallel (True Parallelism)", color: colors.green,
            subtitle: "Multiple cores, tasks run simultaneously",
            rows: [
              { label: "Core 1", segments: [{ w: 68, c: colors.blue, t: "Task A — running entire time" }] },
              { label: "Core 2", segments: [{ w: 68, c: colors.green, t: "Task B — running entire time" }] },
            ]
          },
        ].map(({ title, color, subtitle, rows }) => (
          <div key={title} style={{ background: colors.surface, border: `1px solid ${color}44`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 3 }}>{title}</div>
            <div style={{ fontSize: 11, color: colors.muted, marginBottom: 12 }}>{subtitle}</div>
            {rows.map(({ label, segments }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 56, fontSize: 10, color: colors.muted, textAlign: "right", flexShrink: 0 }}>{label}</div>
                <div style={{ display: "flex", flex: 1, height: 24, borderRadius: 4, overflow: "hidden", gap: 1 }}>
                  {segments.map((s, i) => (
                    <div key={i} style={{ flex: s.w, background: s.c === colors.border ? colors.border + "44" : s.c + "aa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 600, minWidth: 0, overflow: "hidden", whiteSpace: "nowrap" }}>
                      {s.w > 10 ? s.t : ""}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Thread model comparison */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.muted, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>Threading Models</div>
        <svg viewBox="0 0 820 200" style={{ width: "100%" }} xmlns="http://www.w3.org/2000/svg">
          {/* 1:1 Model */}
          <text x="130" y="20" fill={colors.purple} fontSize="12" fontWeight="700" textAnchor="middle">1:1 OS Threads</text>
          <text x="130" y="35" fill={colors.muted} fontSize="10" textAnchor="middle">pthreads · std::thread · Java threads</text>
          {[0,1,2].map(i => (
            <g key={i}>
              <rect x={20 + i*80} y="48" width="60" height="24" rx="4" fill={colors.purple + "33"} stroke={colors.purple} strokeWidth="1" />
              <text x={50 + i*80} y="64" fill={colors.purple} fontSize="10" textAnchor="middle" fontWeight="600">Task {i+1}</text>
              <line x1={50 + i*80} y1="72" x2={50 + i*80} y2="94" stroke={colors.muted} strokeWidth="1.5" markerEnd="url(#ah)" />
              <rect x={20 + i*80} y="96" width="60" height="24" rx="4" fill={colors.surface} stroke={colors.border} />
              <text x={50 + i*80} y="112" fill={colors.muted} fontSize="9" textAnchor="middle">OS Thread</text>
              <line x1={50 + i*80} y1="120" x2={50 + i*80} y2="142" stroke={colors.muted} strokeWidth="1.5" markerEnd="url(#ah)" />
              <rect x={20 + i*80} y="144" width="60" height="24" rx="4" fill={colors.surface} stroke={colors.border} />
              <text x={50 + i*80} y="160" fill={colors.muted} fontSize="9" textAnchor="middle">CPU Core</text>
            </g>
          ))}
          <text x="130" y="190" fill={colors.muted} fontSize="10" textAnchor="middle">~1–8 MB stack · OS schedules</text>

          {/* M:N Model */}
          <text x="430" y="20" fill={colors.blue} fontSize="12" fontWeight="700" textAnchor="middle">M:N Green Threads</text>
          <text x="430" y="35" fill={colors.muted} fontSize="10" textAnchor="middle">Goroutines · Tokio tasks · Erlang processes</text>
          {[0,1,2,3,4].map(i => (
            <g key={i}>
              <rect x={280 + i*60} y="48" width="48" height="22" rx="4" fill={colors.blue + "33"} stroke={colors.blue} strokeWidth="1" />
              <text x={304 + i*60} y="63" fill={colors.blue} fontSize="9" textAnchor="middle" fontWeight="600">G{i+1}</text>
            </g>
          ))}
          <text x="430" y="84" fill={colors.muted} fontSize="10" textAnchor="middle">Runtime scheduler (M goroutines)</text>
          <line x1="304" y1="88" x2="340" y2="100" stroke={colors.muted} strokeWidth="1" markerEnd="url(#ah)" />
          <line x1="430" y1="88" x2="430" y2="100" stroke={colors.muted} strokeWidth="1" markerEnd="url(#ah)" />
          <line x1="556" y1="88" x2="520" y2="100" stroke={colors.muted} strokeWidth="1" markerEnd="url(#ah)" />
          {[0,1,2].map(i => (
            <g key={i}>
              <rect x={300 + i*90} y="100" width="70" height="22" rx="4" fill={colors.surface} stroke={colors.border} />
              <text x={335 + i*90} y="115" fill={colors.muted} fontSize="9" textAnchor="middle">OS Thread {i+1}</text>
              <line x1={335 + i*90} y1="122" x2={335 + i*90} y2="144" stroke={colors.muted} strokeWidth="1.5" markerEnd="url(#ah)" />
              <rect x={305 + i*90} y="144" width="60" height="22" rx="4" fill={colors.surface} stroke={colors.border} />
              <text x={335 + i*90} y="159" fill={colors.muted} fontSize="9" textAnchor="middle">CPU Core</text>
            </g>
          ))}
          <text x="430" y="190" fill={colors.muted} fontSize="10" textAnchor="middle">~2KB stack (Go) · Runtime schedules · N OS threads for M tasks</text>

          {/* Event Loop */}
          <text x="710" y="20" fill={colors.amber} fontSize="12" fontWeight="700" textAnchor="middle">Event Loop</text>
          <text x="710" y="35" fill={colors.muted} fontSize="10" textAnchor="middle">Node.js (libuv) · nginx</text>
          <rect x="660" y="48" width="100" height="56" rx="6" fill={colors.amber + "22"} stroke={colors.amber} strokeWidth="1.5" />
          <text x="710" y="66" fill={colors.amber} fontSize="10" textAnchor="middle" fontWeight="600">Event Queue</text>
          <text x="710" y="82" fill={colors.muted} fontSize="9" textAnchor="middle">cb1 → cb2 → cb3</text>
          <text x="710" y="96" fill={colors.muted} fontSize="9" textAnchor="middle">single thread</text>
          <line x1="710" y1="104" x2="710" y2="130" stroke={colors.muted} strokeWidth="1.5" markerEnd="url(#ah)" />
          <rect x="660" y="132" width="100" height="30" rx="4" fill={colors.surface} stroke={colors.border} />
          <text x="710" y="151" fill={colors.muted} fontSize="9" textAnchor="middle">1 OS Thread / Core</text>
          <rect x="645" y="165" width="130" height="22" rx="4" fill={colors.amber + "11"} stroke={colors.amber + "44"} />
          <text x="710" y="179" fill={colors.amber} fontSize="9" textAnchor="middle">Thread pool for blocking I/O</text>
          <text x="710" y="197" fill={colors.muted} fontSize="10" textAnchor="middle">epoll/kqueue notification</text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, marginBottom: 12, letterSpacing: "0.07em", textTransform: "uppercase" }}>Legend</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {[
            [colors.blue, "Concurrency / Structure"],
            [colors.green, "Parallelism / Simultaneous execution"],
            [colors.amber, "Async I/O / Event model"],
            [colors.purple, "Threads / OS primitives"],
            [colors.red, "Blocking / synchronous"],
            [colors.cyan, "Additional async tasks"],
          ].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: c + "aa", border: `1px solid ${c}` }} />
              <span style={{ fontSize: 11, color: colors.muted }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: Core Concepts ─────────────────────────────────────────────────────
function ConceptsTab() {
  const concepts = [
    {
      term: "Concurrency",
      attribution: "Rob Pike (Go Blog, 2013); C.A.R. Hoare CSP (CACM 1978)",
      color: colors.blue,
      def: "The composition of independently executing processes — a structural property of a program, not a runtime property. A concurrent program can run on a single core.",
      why: "Allows programs to handle multiple in-flight tasks (requests, events, timers) without requiring physical parallelism. Enables responsiveness.",
      mistake: "Equating concurrency with parallelism. A single-core event loop is concurrent but not parallel. Rob Pike's canonical statement: 'Concurrency is about structure, parallelism is about execution.'",
      real: "Node.js handles thousands of concurrent connections on one thread. Go programs routinely spawn 100k+ goroutines across a handful of OS threads.",
    },
    {
      term: "Parallelism",
      attribution: "Rob Pike; also: Amdahl's Law (Gene Amdahl, 1967)",
      color: colors.green,
      def: "The simultaneous physical execution of multiple computations on different processors or cores. Requires multi-core hardware — cannot occur on a single CPU core.",
      why: "Reduces wall-clock time for CPU-bound work by utilizing all available hardware. Rayon (Rust), OpenMP, and Java's ForkJoinPool exist for this.",
      mistake: "Assuming that adding threads automatically creates parallelism — on a single-core machine or under a GIL (CPython), threads interleave but don't run simultaneously. Amdahl's Law limits the speedup based on the serial portion.",
      real: "Rayon's parallel iterators are used in Firefox's style engine. GPU compute (CUDA, wgpu) applies data parallelism to millions of pixels or matrix rows simultaneously.",
    },
    {
      term: "Async / Await",
      attribution: "Specification varies per language — C# 5.0 (2012), Python PEP 492 (2015), Rust RFC 2394 (2019), JS ES2017",
      color: colors.amber,
      def: "A programming model that suspends execution at an await point, releasing the current thread to perform other work until the awaited I/O operation completes via OS notification (epoll/kqueue/IOCP).",
      why: "Avoids the thread-per-connection model that breaks at scale (C10K problem). A single thread can drive thousands of I/O-bound tasks with near-zero overhead between suspensions.",
      mistake: "Running CPU-bound work inside an async function without offloading it (tokio::spawn_blocking, asyncio.run_in_executor). This starves the event loop, creating latency spikes for all other async tasks on that thread.",
      real: "Tokio (Rust) powers Discord's message storage layer; libuv (C) underlies Node.js's event loop — both use kernel-level readiness notifications (epoll on Linux, IOCP on Windows).",
    },
    {
      term: "Thread (OS Thread)",
      attribution: "POSIX pthreads standard; Tanenbaum 'Modern Operating Systems'",
      color: colors.purple,
      def: "The smallest unit of CPU scheduling owned and preemptively scheduled by the OS kernel. Each thread has its own stack (~1–8 MB by default), registers, and program counter, but shares the process heap.",
      why: "The fundamental abstraction for utilizing multiple cores. All higher-level concurrency models — green threads, goroutines, async tasks — ultimately multiplex onto OS threads.",
      mistake: "Creating one OS thread per request. At 10k concurrent requests, this means 10k stacks × ~2MB = ~20 GB RAM plus constant kernel context-switch overhead (~1–10 μs each). Use a thread pool or async.",
      real: "Java's Virtual Threads (Project Loom, JDK 21) mount lightweight virtual threads onto a small OS thread pool — the same M:N insight Go applied in 2009.",
    },
    {
      term: "Green Threads / Goroutines",
      attribution: "Go spec; originally: Green threads (Sun Microsystems, Java 1.0–1.1)",
      color: colors.cyan,
      def: "User-space threads managed by a language runtime (not the OS). In Go, goroutines start at ~2 KB of stack and are multiplexed onto a small pool of OS threads via the Go scheduler (GOMAXPROCS controls OS thread count).",
      why: "Enables M:N threading: M goroutines run on N OS threads. Starting a goroutine is ~1000× cheaper than an OS thread. A Go program can sustain millions of goroutines without RAM exhaustion.",
      mistake: "Confusing green threads with coroutines. Goroutines can run truly in parallel (on multiple OS threads). Python asyncio coroutines are cooperative and single-threaded. Rust's async tasks are stackless state machines.",
      real: "Go's goroutine scheduler uses work-stealing (each P maintains a local run queue; idle Ps steal from others). Tokio uses the same work-stealing design for its async task scheduler.",
    },
    {
      term: "Context Switch",
      attribution: "OS internals; Tanenbaum; Linux kernel scheduler (CFS)",
      color: colors.red,
      def: "The OS kernel's act of saving a thread's CPU state (registers, stack pointer, program counter) and restoring another's, enabling the illusion of simultaneous execution on a single core.",
      why: "Context switches enable concurrent programs to share CPU time. But each switch costs ~1–10 μs in kernel overhead plus cache invalidation (TLB flushes, L1/L2 eviction).",
      mistake: "Underestimating context switch cost at scale. Under high contention (10k+ threads), the CPU spends more time switching than computing. Async event loops avoid this by not blocking threads during I/O waits.",
      real: "Linux's Completely Fair Scheduler (CFS) targets a default 6ms timeslice. On a 1000-thread server, each thread gets ~6μs of CPU per scheduling epoch before being preempted.",
    },
    {
      term: "Event Loop",
      attribution: "libuv docs; Node.js internals; Nginx architecture",
      color: colors.amber,
      def: "A single-threaded execution model that polls OS I/O readiness (epoll/kqueue/IOCP), runs all ready callbacks to completion, then polls again. File I/O uses a background thread pool since OS lacks async file primitives.",
      why: "Avoids OS thread overhead while handling massive I/O concurrency. Nginx serves millions of connections with worker processes that each run a single event loop. Node.js handles all JS on one thread.",
      mistake: "Blocking the event loop thread with CPU-heavy computation. Any synchronous operation that takes >10ms (compression, image resizing, regex on large strings) will prevent all other callbacks from executing during that time.",
      real: "libuv (Node.js's I/O library) uses epoll on Linux, kqueue on macOS/BSD, IOCP on Windows. It maintains a thread pool of 4 (configurable via UV_THREADPOOL_SIZE) for blocking file I/O.",
    },
  ];

  return (
    <div>
      <p style={{ color: colors.muted, marginBottom: 24, lineHeight: 1.7 }}>
        Each concept below is defined per its authoritative source. The most common failure mode in interviews and design reviews is conflating these — particularly concurrency vs. parallelism, and async vs. multithreading.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {concepts.map(({ term, attribution, color, def, why, mistake, real }) => (
          <div key={term} style={{ background: colors.surface, border: `1px solid ${color}44`, borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 3, height: 36, background: color, borderRadius: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color }}>{term}</div>
                  <div style={{ fontSize: 10, color: colors.muted, marginTop: 1 }}>as defined by: {attribution}</div>
                </div>
              </div>
            </div>
            <p style={{ color: colors.text, fontSize: 13.5, lineHeight: 1.7, margin: "0 0 12px 0" }}>{def}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ background: "#161b22", borderRadius: 6, padding: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: colors.green, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Why it matters</div>
                <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.6 }}>{why}</div>
              </div>
              <div style={{ background: "#161b22", borderRadius: 6, padding: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: colors.red, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Common mistake</div>
                <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.6 }}>{mistake}</div>
              </div>
              <div style={{ background: "#161b22", borderRadius: 6, padding: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: colors.amber, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Real-world usage</div>
                <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.6 }}>{real}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trade-offs */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 24, marginTop: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 16 }}>When to Use Which Model</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr>
                {["Workload", "Best model", "Why", "Avoid"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", borderBottom: `1px solid ${colors.border}`, color: colors.muted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["High-concurrency I/O (web server, DB proxy)", "Async + event loop / green threads", "Thousands of connections, mostly waiting. Goroutines or async tasks with no thread-per-conn overhead.", "One OS thread per connection — OOM at scale"],
                ["CPU-bound computation (encoding, ML inference)", "Parallelism — thread pool / rayon / SIMD", "Work must physically execute simultaneously. Utilize all cores.", "Async (starves event loop), single-thread (slow)"],
                ["Background jobs with I/O + compute mix", "Thread pool + async hybrid", "Offload blocking to spawn_blocking; keep I/O on async runtime.", "Pure async (CPU work starves it)"],
                ["Real-time systems / hard latency bounds", "OS threads with pinned cores + lock-free structures", "Predictable preemption, avoid GC / runtime scheduler jitter.", "Async runtimes (scheduler jitter), GC languages"],
                ["Scripting / data pipelines", "Multiprocessing (Python) or parallel iterators (Rust/Go)", "Bypasses CPython GIL; embarrassingly parallel data.", "Python threads (GIL), single-threaded iteration"],
              ].map(([workload, model, why, avoid], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : colors.bg + "66" }}>
                  <td style={{ padding: "10px 12px", color: colors.text, borderBottom: `1px solid ${colors.border}44` }}>{workload}</td>
                  <td style={{ padding: "10px 12px", borderBottom: `1px solid ${colors.border}44` }}>{tag(colors.green, model)}</td>
                  <td style={{ padding: "10px 12px", color: colors.muted, borderBottom: `1px solid ${colors.border}44` }}>{why}</td>
                  <td style={{ padding: "10px 12px", color: colors.red, borderBottom: `1px solid ${colors.border}44`, fontSize: 11.5 }}>{avoid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Implementations ───────────────────────────────────────────────────
const goCode = `// Pattern: Async Concurrency — Worker Pool with Context Cancellation
// Reference: "Concurrency in Go" — Katherine Cox-Buday (O'Reilly)
// Production note: Always pass context.Context; cancel on shutdown to drain goroutines cleanly

package main

import (
    "context"
    "errors"
    "fmt"
    "sync"
    "time"
)

// Job represents a unit of work submitted to the pool.
type Job[T any] struct {
    ID      int
    Payload T
}

// Result wraps the outcome of processing a single Job.
type Result[T, R any] struct {
    JobID  int
    Value  R
    Err    error
}

// WorkerPool orchestrates a fixed set of goroutines processing jobs.
type WorkerPool[T, R any] struct {
    workers  int
    jobCh    chan Job[T]
    resultCh chan Result[T, R]
    process  func(ctx context.Context, job Job[T]) (R, error)
    wg       sync.WaitGroup
}

func NewWorkerPool[T, R any](
    workers int,
    bufSize int,
    fn func(ctx context.Context, job Job[T]) (R, error),
) *WorkerPool[T, R] {
    return &WorkerPool[T, R]{
        workers:  workers,
        jobCh:    make(chan Job[T], bufSize),
        resultCh: make(chan Result[T, R], bufSize),
        process:  fn,
    }
}

// Start launches all worker goroutines. Each blocks on jobCh until ctx is done.
func (p *WorkerPool[T, R]) Start(ctx context.Context) {
    for i := 0; i < p.workers; i++ {
        p.wg.Add(1)
        go func(id int) {
            defer p.wg.Done()
            for {
                select {
                case job, ok := <-p.jobCh:
                    if !ok {
                        return // channel closed — drain complete
                    }
                    val, err := p.process(ctx, job)
                    p.resultCh <- Result[T, R]{JobID: job.ID, Value: val, Err: err}
                case <-ctx.Done():
                    return // cancelled
                }
            }
        }(i)
    }
    // Close resultCh once all workers exit.
    go func() {
        p.wg.Wait()
        close(p.resultCh)
    }()
}

// Submit enqueues a job. Returns ErrPoolFull if the buffer is at capacity.
var ErrPoolFull = errors.New("worker pool: job buffer full")

func (p *WorkerPool[T, R]) Submit(job Job[T]) error {
    select {
    case p.jobCh <- job:
        return nil
    default:
        return ErrPoolFull
    }
}

// Drain closes the job channel so workers finish their current jobs and exit.
func (p *WorkerPool[T, R]) Drain() <-chan Result[T, R] {
    close(p.jobCh)
    return p.resultCh
}

// ── Usage ──────────────────────────────────────────────────────────────────────

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    // Simulate a CPU+I/O mixed job: square the integer (CPU) with fake I/O latency.
    pool := NewWorkerPool[int, int](4, 16, func(ctx context.Context, job Job[int]) (int, error) {
        select {
        case <-time.After(10 * time.Millisecond): // simulate I/O
        case <-ctx.Done():
            return 0, ctx.Err()
        }
        return job.Payload * job.Payload, nil
    })
    pool.Start(ctx)

    // Submit 10 jobs concurrently.
    for i := 1; i <= 10; i++ {
        if err := pool.Submit(Job[int]{ID: i, Payload: i}); err != nil {
            fmt.Printf("submit %d: %v\\n", i, err)
        }
    }

    // Drain results — blocks until all workers exit and resultCh is closed.
    for res := range pool.Drain() {
        if res.Err != nil {
            fmt.Printf("job %d error: %v\\n", res.JobID, res.Err)
            continue
        }
        fmt.Printf("job %d → %d\\n", res.JobID, res.Value)
    }
}`;

const pythonCode = `# Pattern: Async Concurrency — Structured Concurrency with asyncio
# Reference: PEP 492 (async/await), Python docs "asyncio — Asynchronous I/O"
# Production note: Use TaskGroup (Python 3.11+) for structured cancellation;
#                  never fire-and-forget tasks without tracking them.

from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass, field
from typing import Callable, Generic, TypeVar

T = TypeVar("T")
R = TypeVar("R")


@dataclass(frozen=True)
class Job(Generic[T]):
    id: int
    payload: T


@dataclass
class Result(Generic[R]):
    job_id: int
    value: R | None = None
    error: Exception | None = None

    @property
    def ok(self) -> bool:
        return self.error is None


@dataclass
class WorkerPool(Generic[T, R]):
    """Bounded async worker pool using a semaphore for back-pressure."""
    max_concurrency: int
    process: Callable[[Job[T]], R]  # sync or async callable
    _semaphore: asyncio.Semaphore = field(init=False)

    def __post_init__(self) -> None:
        self._semaphore = asyncio.Semaphore(self.max_concurrency)

    async def _run_one(self, job: Job[T]) -> Result[R]:
        async with self._semaphore:
            try:
                # Support both sync and async process functions.
                if asyncio.iscoroutinefunction(self.process):
                    value = await self.process(job)
                else:
                    # Offload blocking work to the thread pool executor.
                    loop = asyncio.get_running_loop()
                    value = await loop.run_in_executor(None, self.process, job)
                return Result(job_id=job.id, value=value)
            except Exception as exc:  # noqa: BLE001
                return Result(job_id=job.id, error=exc)

    async def run_all(self, jobs: list[Job[T]]) -> list[Result[R]]:
        """Run all jobs with bounded concurrency. Preserves submission order."""
        async with asyncio.TaskGroup() as tg:  # Python 3.11+ — cancels all on first error
            tasks = [tg.create_task(self._run_one(job)) for job in jobs]
        return [task.result() for task in tasks]


# ── Usage ──────────────────────────────────────────────────────────────────────

async def fetch_user(job: Job[int]) -> dict[str, object]:
    """Simulate an async I/O-bound operation (e.g., DB or HTTP call)."""
    await asyncio.sleep(0.02)  # 20ms network latency
    return {"id": job.payload, "name": f"user_{job.payload}"}


async def main() -> None:
    jobs = [Job(id=i, payload=i * 10) for i in range(1, 16)]
    pool: WorkerPool[int, dict[str, object]] = WorkerPool(
        max_concurrency=5,
        process=fetch_user,
    )

    start = time.perf_counter()
    results = await pool.run_all(jobs)
    elapsed = time.perf_counter() - start

    successes = [r for r in results if r.ok]
    failures  = [r for r in results if not r.ok]

    print(f"Completed {len(successes)}/{len(jobs)} in {elapsed:.3f}s")
    print(f"Failures: {len(failures)}")
    for r in successes[:3]:
        print(f"  job {r.job_id} → {r.value}")


asyncio.run(main())`;

const rustCode = `// Pattern: Async Concurrency — Tokio worker pool with back-pressure
// Reference: Tokio docs; "Programming Rust" — Blandy & Orendorff (O'Reilly)
// Production note: Use mpsc::channel for producer/consumer back-pressure;
//                  spawn_blocking for CPU-bound work inside async contexts.

use std::sync::Arc;
use thiserror::Error;
use tokio::{
    sync::{mpsc, Semaphore},
    task::JoinSet,
};

#[derive(Debug, Clone)]
pub struct Job<T> {
    pub id: usize,
    pub payload: T,
}

#[derive(Debug)]
pub struct JobResult<R> {
    pub job_id: usize,
    pub value:  Result<R, WorkerError>,
}

#[derive(Debug, Error)]
pub enum WorkerError {
    #[error("job {0} timed out")]
    Timeout(usize),
    #[error("job {0} failed: {1}")]
    Processing(usize, String),
}

/// Bounded async worker pool with a semaphore for concurrency control.
pub struct WorkerPool {
    semaphore: Arc<Semaphore>,
}

impl WorkerPool {
    pub fn new(max_concurrency: usize) -> Self {
        Self {
            semaphore: Arc::new(Semaphore::new(max_concurrency)),
        }
    }

    /// Runs all jobs concurrently, bounded by the pool's semaphore.
    /// Returns results in completion order (not submission order).
    pub async fn run_all<T, R, F, Fut>(
        &self,
        jobs: Vec<Job<T>>,
        process: F,
    ) -> Vec<JobResult<R>>
    where
        T: Send + 'static,
        R: Send + 'static,
        F: Fn(Job<T>) -> Fut + Clone + Send + 'static,
        Fut: std::future::Future<Output = Result<R, WorkerError>> + Send,
    {
        let mut set = JoinSet::new();

        for job in jobs {
            let permit = Arc::clone(&self.semaphore)
                .acquire_owned()
                .await
                .expect("semaphore closed");
            let f = process.clone();
            let id = job.id;

            set.spawn(async move {
                let _permit = permit; // released when this task completes
                let value = f(job).await;
                JobResult { job_id: id, value }
            });
        }

        let mut results = Vec::new();
        while let Some(res) = set.join_next().await {
            match res {
                Ok(job_result) => results.push(job_result),
                Err(e) => eprintln!("task panicked: {e}"),
            }
        }
        results
    }
}

// ── Usage ──────────────────────────────────────────────────────────────────────

#[tokio::main]
async fn main() {
    let pool = WorkerPool::new(4); // max 4 concurrent jobs

    let jobs: Vec<Job<u64>> = (1..=12)
        .map(|i| Job { id: i, payload: i as u64 })
        .collect();

    let results = pool
        .run_all(jobs, |job| async move {
            // Simulate async I/O (network / DB)
            tokio::time::sleep(tokio::time::Duration::from_millis(20)).await;

            // CPU-bound section — use spawn_blocking to avoid starving the executor
            let result = tokio::task::spawn_blocking(move || job.payload * job.payload)
                .await
                .map_err(|e| WorkerError::Processing(job.id, e.to_string()))?;

            Ok::<u64, WorkerError>(result)
        })
        .await;

    let mut sorted = results;
    sorted.sort_by_key(|r| r.job_id);

    for r in &sorted {
        match &r.value {
            Ok(v)  => println!("job {} → {}", r.job_id, v),
            Err(e) => eprintln!("job {} error: {}", r.job_id, e),
        }
    }
}`;

const javaCode = `// Pattern: Async Concurrency — Virtual Threads (Project Loom) + Structured Concurrency
// Reference: JDK 21 — JEP 444 (Virtual Threads), JEP 453 (Structured Concurrency)
// Production note: Virtual threads are cheap (~1KB overhead vs ~1MB for platform threads).
//                  They block on I/O without holding a carrier thread — ideal for high-concurrency I/O.

import java.util.List;
import java.util.Objects;
import java.util.concurrent.*;
import java.util.concurrent.StructuredTaskScope.Subtask;

public class WorkerPoolDemo {

    // ── Domain types (Java 21 records) ────────────────────────────────────────

    record Job<T>(int id, T payload) {}

    sealed interface JobResult<R> permits JobResult.Success, JobResult.Failure {
        record Success<R>(int jobId, R value) implements JobResult<R> {}
        record Failure<R>(int jobId, Throwable error) implements JobResult<R> {}
    }

    // ── Processor interface ───────────────────────────────────────────────────

    @FunctionalInterface
    interface JobProcessor<T, R> {
        R process(Job<T> job) throws Exception;
    }

    // ── Worker pool via StructuredTaskScope ───────────────────────────────────

    static <T, R> List<JobResult<R>> runAll(
        List<Job<T>> jobs,
        JobProcessor<T, R> processor,
        int maxConcurrency
    ) throws InterruptedException {

        // Semaphore limits concurrency without blocking virtual-thread carriers.
        var semaphore = new Semaphore(maxConcurrency);

        // ShutdownOnFailure cancels all subtasks if any one fails.
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            List<Subtask<JobResult<R>>> subtasks = jobs.stream()
                .map(job -> scope.fork(() -> {
                    semaphore.acquire();
                    try {
                        R value = processor.process(job);
                        return (JobResult<R>) new JobResult.Success<>(job.id(), value);
                    } catch (Exception e) {
                        return new JobResult.Failure<>(job.id(), e);
                    } finally {
                        semaphore.release();
                    }
                }))
                .toList();

            scope.join()           // wait for all subtasks
                 .throwIfFailed(); // re-throw first exception if any

            return subtasks.stream()
                .map(Subtask::get)
                .filter(Objects::nonNull)
                .toList();
        }
    }

    // ── Usage ─────────────────────────────────────────────────────────────────

    public static void main(String[] args) throws Exception {
        var jobs = List.of(
            new Job<>(1, "https://api.example.com/users/1"),
            new Job<>(2, "https://api.example.com/users/2"),
            new Job<>(3, "https://api.example.com/users/3"),
            new Job<>(4, "https://api.example.com/orders/99"),
            new Job<>(5, "https://api.example.com/orders/100")
        );

        // Virtual-thread executor — JDK 21 creates one virtual thread per task.
        // I/O blocking (Thread.sleep here) unmounts the virtual thread from its
        // carrier OS thread — no OS thread is wasted while waiting.
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            executor.submit(() -> {
                try {
                    List<JobResult<String>> results = runAll(
                        jobs,
                        job -> {
                            // Simulate HTTP call (blocks virtual thread, not OS thread)
                            Thread.sleep(20);
                            return "response_for_" + job.payload();
                        },
                        /*maxConcurrency=*/ 3
                    );

                    results.stream()
                        .sorted(Comparator.comparingInt(r -> switch (r) {
                            case JobResult.Success<String> s -> s.jobId();
                            case JobResult.Failure<String> f -> f.jobId();
                        }))
                        .forEach(r -> switch (r) {
                            case JobResult.Success<String> s ->
                                System.out.printf("job %d → %s%n", s.jobId(), s.value());
                            case JobResult.Failure<String> f ->
                                System.err.printf("job %d error: %s%n", f.jobId(), f.error().getMessage());
                        });
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }).get();
        }
    }
}`;

function ImplTab() {
  const [lang, setLang] = useState("go");
  const langs = [
    { id: "go", label: "Go 1.21+" },
    { id: "python", label: "Python 3.11+" },
    { id: "rust", label: "Rust (stable)" },
    { id: "java", label: "Java 21" },
  ];
  const codeMap = { go: goCode, python: pythonCode, rust: rustCode, java: javaCode };
  const langLabels = { go: "go", python: "python", rust: "rust", java: "java" };
  const filenames = {
    go: "core/worker_pool.go",
    python: "core/worker_pool.py",
    rust: "core/worker_pool.rs",
    java: "core/WorkerPoolDemo.java",
  };

  return (
    <div>
      <p style={{ color: colors.muted, marginBottom: 20, lineHeight: 1.7 }}>
        Pure language implementations — no cloud dependencies. Each demonstrates a bounded async worker pool: the canonical pattern for concurrent I/O-bound workloads. Includes back-pressure, context/cancellation propagation, and error isolation per job.
      </p>

      {/* Notes per language */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { lang: "Go", color: colors.cyan, note: "Goroutines + channels. Generic pool via type parameters (1.21+). Context propagation through every goroutine. sync.WaitGroup for drain." },
          { lang: "Python", color: colors.blue, note: "asyncio.TaskGroup (3.11+) provides structured concurrency — all tasks cancel on first unhandled exception. run_in_executor for sync blocking work." },
          { lang: "Rust", color: colors.amber, note: "Tokio JoinSet for collecting futures. Arc<Semaphore> for bounded concurrency. spawn_blocking offloads CPU work off the async executor thread." },
          { lang: "Java 21", color: colors.purple, note: "Virtual Threads (JEP 444) + StructuredTaskScope (JEP 453). Blocking I/O unmounts virtual thread from OS carrier — zero OS thread wasted." },
        ].map(({ lang: l, color, note }) => (
          <div key={l} style={{ background: colors.surface, border: `1px solid ${color}44`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.6 }}>{note}</div>
          </div>
        ))}
      </div>

      {/* Language switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {langs.map(({ id, label }) => (
          <button key={id} onClick={() => setLang(id)} style={{
            padding: "6px 16px", borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            background: lang === id ? colors.blue + "33" : colors.surface,
            color: lang === id ? colors.blue : colors.muted,
            border: `1px solid ${lang === id ? colors.blue : colors.border}`,
            transition: "all 0.15s",
          }}>{label}</button>
        ))}
      </div>

      <CodeBlock code={codeMap[lang]} lang={langLabels[lang]} filename={filenames[lang]} />

      {/* Key patterns callout */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 20, marginTop: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Key Patterns Demonstrated Across All Implementations</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            [colors.blue, "Back-pressure", "Semaphore or channel buffer prevents unbounded goroutine/task explosion under load"],
            [colors.green, "Error isolation", "One job failure does not cancel others (except Java's ShutdownOnFailure mode, which is deliberate)"],
            [colors.amber, "Cancellation", "Context (Go), TaskGroup cancellation (Python), JoinSet abort (Rust), Thread.interrupt (Java)"],
            [colors.purple, "Drain / cleanup", "All pools wait for in-flight jobs before exiting — avoids goroutine/task leaks"],
            [colors.cyan, "CPU offload", "Heavy computation deferred to thread pool (run_in_executor, spawn_blocking) — never blocks the async executor"],
            [colors.red, "Order guarantee", "Results returned in job completion order, not submission order — sort by ID if submission order matters"],
          ].map(([c, title, desc]) => (
            <div key={title} style={{ background: "#161b22", borderRadius: 6, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: c, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 11, color: colors.muted, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 4: Leadership Angles ─────────────────────────────────────────────────
function LeadershipTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Explain to team */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.blue}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.blue, marginBottom: 12 }}>🗣 Explain to Your Team (Standup / RFC Intro)</div>
        <div style={{ background: "#161b22", borderRadius: 8, padding: 16, fontSize: 13.5, color: colors.text, lineHeight: 1.8, fontStyle: "italic" }}>
          "Concurrency is how we structure a program to deal with many things at once — like a chef managing multiple dishes. Parallelism is when two chefs cook simultaneously on separate stoves. Async is the chef putting a pot on to boil and working on something else instead of staring at it. Threads are the actual chefs. We're adding async I/O here because our bottleneck is waiting on the database — not CPU — so more threads won't help; we need to stop blocking them."
        </div>
      </div>

      {/* Justify decision */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.green}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.green, marginBottom: 12 }}>📋 Justify in Architecture Review</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["Choose async over thread-per-request", "Thread-per-request breaks at ~10k concurrent connections (C10K). Each OS thread costs 1–8MB stack + context switch overhead. Async tasks are sub-KB and switch cooperatively with no kernel involvement."],
            ["Choose Go goroutines over OS threads for services", "Goroutines start at 2KB vs 1–8MB for OS threads. The Go scheduler (GOMAXPROCS) multiplexes N goroutines onto N/CPU OS threads with work-stealing. LinkedIn's engineering blog attributes Go's goroutine model to handling their chat infrastructure scale."],
            ["Choose Java Virtual Threads (Loom) over reactive frameworks", "Reactive (WebFlux, RxJava) requires invasive callback-style code throughout the stack. Virtual threads block on I/O without holding an OS carrier thread — same concurrency benefit, synchronous-looking code. JDK 21 stable; Spring Boot 3.2+ supports it transparently."],
            ["Choose Tokio over std threads for Rust network services", "std::thread is 1:1 OS threads — fine for CPU-bound parallelism. Tokio's multi-thread scheduler uses work-stealing across one-thread-per-core, achieving M:N mapping. Discord migrated their Elixir read states service to Rust/Tokio and documented significant latency improvements."],
          ].map(([decision, rationale]) => (
            <div key={decision} style={{ background: "#161b22", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: colors.green, marginBottom: 5 }}>{decision}</div>
              <div style={{ fontSize: 12.5, color: colors.muted, lineHeight: 1.7 }}>{rationale}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Failure modes */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.red}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.red, marginBottom: 12 }}>🚨 Failure Modes & Observability</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Failure", "Symptom", "Root Cause", "Alert / Detection"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", borderBottom: `1px solid ${colors.border}`, color: colors.muted, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Goroutine / task leak", "Memory grows indefinitely; goroutine count climbs", "Goroutines spawned but never given a stop signal or context cancellation", "Alert on goroutine count > threshold; use runtime.NumGoroutine() metric; pprof goroutine dump"],
                ["Event loop starvation", "P99 latency spikes; async tasks time out; health check fails", "CPU-bound work running synchronously on async executor thread", "Measure tokio_task_poll_duration_seconds; event loop lag metric in Node.js; alert if >50ms"],
                ["Thread pool exhaustion", "Requests queue up; response times spike; connection timeouts", "All pool threads blocked on slow I/O (DB, HTTP) with no timeout", "Monitor thread pool queue depth; alert when active_threads == pool_size for >5s"],
                ["Race condition / data race", "Intermittent incorrect results; occasional panics or corruption", "Shared mutable state accessed without synchronization", "Go race detector (-race flag); Rust prevents at compile time; ThreadSanitizer for C++"],
                ["Deadlock", "Goroutines/threads permanently blocked; service unresponsive", "Circular mutex acquisition; channel sends with no receiver; async Mutex held across await", "Goroutine dump shows all goroutines in 'chan receive'; pprof block profile"],
                ["Context switch thrashing", "High CPU iowait / kernel time; low application throughput", "Too many OS threads competing for limited cores", "Monitor kernel CPU% vs user CPU%; context_switches_per_second system metric"],
              ].map(([f, s, r, a], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : colors.bg + "44" }}>
                  <td style={{ padding: "10px 12px", color: colors.red, fontWeight: 600, borderBottom: `1px solid ${colors.border}33`, fontSize: 11.5 }}>{f}</td>
                  <td style={{ padding: "10px 12px", color: colors.text, borderBottom: `1px solid ${colors.border}33`, fontSize: 11.5 }}>{s}</td>
                  <td style={{ padding: "10px 12px", color: colors.muted, borderBottom: `1px solid ${colors.border}33`, fontSize: 11.5 }}>{r}</td>
                  <td style={{ padding: "10px 12px", color: colors.amber, borderBottom: `1px solid ${colors.border}33`, fontSize: 11.5 }}>{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scale implications */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.amber}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.amber, marginBottom: 12 }}>📈 Scale Implications</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            ["10x traffic", colors.green, "Async I/O scales well — same thread count handles 10x more concurrent I/O-bound requests. Thread pools may need modest +25% sizing. Go's GOMAXPROCS auto-scales. Monitor goroutine count and queue depth."],
            ["100x traffic", colors.amber, "Vertical scaling hits OS thread limits (~10k threads). Consider: dedicated connection pools, database read replicas, queue-based async offloading. Goroutine count may legitimately hit 1M+ — watch GC pressure."],
            ["When to revisit", colors.red, "If >50% of goroutines/tasks are CPU-bound → switch to explicit parallelism (worker pool with fixed size = GOMAXPROCS). If P99 latency degrades but P50 is fine → contention on shared state. If memory grows with concurrency → goroutine leak."],
          ].map(([title, color, desc]) => (
            <div key={title} style={{ background: "#161b22", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Code review checklist */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.purple}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.purple, marginBottom: 12 }}>✅ Code Review Checklist</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            "Every goroutine/task has a defined exit condition (context cancellation, channel close, or error return)",
            "No goroutine spawned inside a loop without a mechanism to bound total count",
            "Context.Context passed as the first parameter to every goroutine entry point",
            "No sync Mutex held across an await point (async deadlock / priority inversion risk)",
            "CPU-heavy work offloaded via spawn_blocking, run_in_executor, or rayon — never inline in async task",
            "Error from every goroutine or task is collected — no silent discard",
            "Shared state protected by Mutex, RWMutex, or atomic — never by convention alone",
            "Thread/goroutine pool size is configurable, not hard-coded",
            "Timeouts set on every I/O operation — no unbounded context.Background() on external calls",
            "Tests include concurrent execution (go test -race, -count=100 -parallel=10)",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, background: "#161b22", borderRadius: 6, padding: 10 }}>
              <div style={{ color: colors.purple, fontWeight: 700, flexShrink: 0, fontSize: 13 }}>□</div>
              <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.6 }}>{item}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Design review questions */}
      <div style={{ background: colors.surface, border: `1px solid ${colors.cyan}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.cyan, marginBottom: 12 }}>❓ Questions for Design Review</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["Workload classification", "Is the bottleneck I/O-bound or CPU-bound? (async and parallelism are not interchangeable — using async for CPU work will hurt, not help)"],
            ["Concurrency model selection", "Why this model over alternatives? (goroutines vs OS threads vs async/await vs green threads — each has a different cost model)"],
            ["Back-pressure strategy", "What happens when producers outpace consumers? Is there a buffer limit? What is the rejection policy (drop, block, queue)?"],
            ["Cancellation & cleanup", "How does the system drain in-flight work on shutdown? Can a downstream failure propagate a cancellation upstream?"],
            ["Shared state inventory", "What state is shared across goroutines/tasks? What synchronization primitive protects it? Is there a lock hierarchy to prevent deadlock?"],
            ["Observability plan", "How will you know if goroutines are leaking in production? What metric indicates event loop starvation? What's the alerting threshold?"],
            ["GIL / runtime constraints", "If using Python, is the GIL limiting CPU parallelism? Would multiprocessing or a compiled extension be more appropriate?"],
          ].map(([category, question]) => (
            <div key={category} style={{ background: "#161b22", borderRadius: 8, padding: 14, display: "flex", gap: 14 }}>
              <div style={{ color: colors.cyan, fontWeight: 700, fontSize: 12, flexShrink: 0, paddingTop: 1, minWidth: 150 }}>{category}</div>
              <div style={{ fontSize: 12.5, color: colors.muted, lineHeight: 1.7 }}>{question}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function AsyncConcurrency() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: "Architecture", icon: "⬡" },
    { label: "Core Concepts", icon: "◈" },
    { label: "Implementations", icon: "</>" },
    { label: "Leadership", icon: "◎" },
  ];

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", color: colors.text, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: "20px 32px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.text }}>
              Async · Concurrency · Parallelism · Threads
            </h1>
            <div style={{ display: "flex", gap: 6 }}>
              {tag(colors.blue, "Rob Pike")}
              {tag(colors.amber, "Tokio/libuv")}
              {tag(colors.purple, "JDK 21")}
            </div>
          </div>
          <p style={{ margin: "0 0 16px", color: colors.muted, fontSize: 13 }}>
            Authoritative definitions · Execution models · Go / Python / Rust / Java 21 implementations · Tech lead reference
          </p>
          <div style={{ display: "flex", gap: 2 }}>
            {tabs.map(({ label, icon }, i) => (
              <button key={i} onClick={() => setActiveTab(i)} style={{
                padding: "9px 20px", borderRadius: "6px 6px 0 0", fontSize: 13, fontWeight: activeTab === i ? 600 : 400,
                cursor: "pointer", border: "none", background: activeTab === i ? colors.bg : "transparent",
                color: activeTab === i ? colors.text : colors.muted,
                borderTop: activeTab === i ? `2px solid ${colors.blue}` : "2px solid transparent",
                transition: "all 0.15s",
              }}>
                <span style={{ marginRight: 6, opacity: 0.7 }}>{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 32px" }}>
        {activeTab === 0 && <ArchTab />}
        {activeTab === 1 && <ConceptsTab />}
        {activeTab === 2 && <ImplTab />}
        {activeTab === 3 && <LeadershipTab />}
      </div>
    </div>
  );
}
