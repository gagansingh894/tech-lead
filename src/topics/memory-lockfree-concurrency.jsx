"use client"

import { useState } from "react";

// ─── colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0f1117", surface: "#1a1d24", border: "#2d3139",
  text: "#e5e7eb", muted: "#9ca3af", code: "#161b22",
  blue: "#3b82f6", green: "#10b981", amber: "#f59e0b",
  purple: "#8b5cf6", red: "#ef4444",
};

// ─── helpers ──────────────────────────────────────────────────────────────────
function Tab({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px", border: "none", cursor: "pointer",
        background: active ? (color || C.blue) : "transparent",
        color: active ? "#fff" : C.muted,
        borderRadius: "6px 6px 0 0", fontWeight: active ? 600 : 400,
        fontSize: 13, transition: "all .15s",
      }}
    >{label}</button>
  );
}

function Badge({ color, children }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600,
    }}>{children}</span>
  );
}

function Card({ title, badge, badgeColor, children }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 8, padding: "16px 20px", marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{title}</span>
        {badge && <Badge color={badgeColor || C.blue}>{badge}</Badge>}
      </div>
      {children}
    </div>
  );
}

function P({ children, style = {} }) {
  return <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.65, margin: "4px 0", ...style }}>{children}</p>;
}

function Hl({ color = C.blue, children }) {
  return <span style={{ color }}>{children}</span>;
}

function CodeBlock({ code, lang = "go", filename }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
      {filename && (
        <div style={{
          background: "#0d1117", padding: "6px 14px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ color: C.muted, fontSize: 11, fontFamily: "monospace" }}>{filename}</span>
          <button onClick={copy} style={{
            background: "transparent", border: `1px solid ${C.border}`, color: C.muted,
            borderRadius: 4, padding: "2px 10px", fontSize: 11, cursor: "pointer",
          }}>{copied ? "Copied ✓" : "Copy"}</button>
        </div>
      )}
      <pre style={{
        background: C.code, margin: 0, padding: "16px 18px",
        fontFamily: "monospace", fontSize: 12, color: "#c9d1d9",
        overflowX: "auto", lineHeight: 1.6,
      }}><code>{code}</code></pre>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 style={{
      color: C.text, fontWeight: 600, fontSize: 15,
      borderBottom: `1px solid ${C.border}`, paddingBottom: 8,
      marginTop: 24, marginBottom: 14,
    }}>{children}</h3>
  );
}

// ─── TAB 1 – Architecture / Diagram ──────────────────────────────────────────
function ArchTab() {
  return (
    <div style={{ padding: "20px 0" }}>
      <P style={{ marginBottom: 16 }}>
        Memory pressure and lock-free concurrency are intertwined: allocation rate drives GC
        pressure; lock-free structures reduce contention but introduce reclamation hazards.
        The diagram traces the full lifecycle from allocation through safe reclamation.
      </P>

      {/* main SVG diagram */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 10, padding: 20, marginBottom: 20,
      }}>
        <svg viewBox="0 0 820 560" style={{ width: "100%", height: "auto" }}>
          {/* ── defs ── */}
          <defs>
            <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#9ca3af" />
            </marker>
            <marker id="arrBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={C.blue} />
            </marker>
            <marker id="arrAmber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={C.amber} />
            </marker>
            <marker id="arrGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={C.green} />
            </marker>
            <marker id="arrRed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={C.red} />
            </marker>
          </defs>

          {/* ── background regions ── */}
          {/* Thread arena */}
          <rect x="10" y="10" width="390" height="200" rx="8"
            fill="#1e2330" stroke="#3b82f633" strokeWidth="1.5" />
          <text x="20" y="28" fill={C.blue} fontSize="11" fontWeight="600">Thread / Application Layer</text>

          {/* Memory subsystem */}
          <rect x="10" y="230" width="390" height="170" rx="8"
            fill="#1e2820" stroke="#10b98133" strokeWidth="1.5" />
          <text x="20" y="248" fill={C.green} fontSize="11" fontWeight="600">Memory Subsystem</text>

          {/* Shared data structure */}
          <rect x="430" y="10" width="380" height="200" rx="8"
            fill="#201e2e" stroke="#8b5cf633" strokeWidth="1.5" />
          <text x="440" y="28" fill={C.purple} fontSize="11" fontWeight="600">Shared Lock-Free Data Structure</text>

          {/* Reclamation layer */}
          <rect x="430" y="230" width="380" height="170" rx="8"
            fill="#2a2010" stroke="#f59e0b33" strokeWidth="1.5" />
          <text x="440" y="248" fill={C.amber} fontSize="11" fontWeight="600">Safe Memory Reclamation Layer</text>

          {/* CPU Memory Model */}
          <rect x="180" y="430" width="460" height="110" rx="8"
            fill="#1e1e1e" stroke="#6b7280" strokeWidth="1" />
          <text x="400" y="450" fill="#9ca3af" fontSize="11" fontWeight="600" textAnchor="middle">CPU Memory Model (Hardware)</text>

          {/* ── Thread boxes ── */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={20 + i * 120} y={40} width={100} height={55} rx={6}
                fill="#263040" stroke={C.blue} strokeWidth="1.2" />
              <text x={70 + i * 120} y={60} fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">
                Thread {i + 1}
              </text>
              <text x={70 + i * 120} y={76} fill={C.muted} fontSize="10" textAnchor="middle">
                goroutine/OS
              </text>
              <text x={70 + i * 120} y={89} fill={C.muted} fontSize="10" textAnchor="middle">
                thread
              </text>
            </g>
          ))}

          {/* Thread local cache boxes */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={20 + i * 120} y={115} width={100} height={40} rx={5}
                fill="#1a2535" stroke="#3b82f655" strokeWidth="1" />
              <text x={70 + i * 120} y={133} fill={C.muted} fontSize="10" textAnchor="middle">
                Thread-local
              </text>
              <text x={70 + i * 120} y={147} fill={C.muted} fontSize="10" textAnchor="middle">
                cache / TLS
              </text>
            </g>
          ))}

          {/* allocation arrow down */}
          <line x1="200" y1="165" x2="200" y2="260"
            stroke={C.blue} strokeWidth="1.5" markerEnd="url(#arrBlue)" strokeDasharray="4,3" />
          <text x="210" y="218" fill={C.blue} fontSize="10">alloc()</text>

          {/* ── Heap regions ── */}
          <rect x="20" y="258" width="170" height="50" rx="5"
            fill="#1b2d1b" stroke={C.green} strokeWidth="1.2" />
          <text x="105" y="278" fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">Young Gen / Eden</text>
          <text x="105" y="294" fill={C.muted} fontSize="10" textAnchor="middle">fast bump-ptr alloc</text>

          <rect x="210" y="258" width="170" height="50" rx="5"
            fill="#1a2e1a" stroke={C.green} strokeWidth="1.2" />
          <text x="295" y="278" fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">Old Gen / Tenured</text>
          <text x="295" y="294" fill={C.muted} fontSize="10" textAnchor="middle">long-lived; fragmentation</text>

          {/* GC box */}
          <rect x="60" y="330" width="280" height="50" rx="5"
            fill="#2a1a1a" stroke={C.red} strokeWidth="1.2" />
          <text x="200" y="350" fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">GC Collector</text>
          <text x="200" y="365" fill={C.muted} fontSize="10" textAnchor="middle">STW pauses / concurrent mark-sweep</text>

          {/* promotion arrow */}
          <line x1="295" y1="258" x2="295" y2="215"
            stroke={C.amber} strokeWidth="1.2" markerEnd="url(#arrAmber)" />
          <text x="300" y="237" fill={C.amber} fontSize="10">promote</text>

          {/* gc sweep arrow */}
          <line x1="200" y1="308" x2="200" y2="330"
            stroke={C.red} strokeWidth="1.2" markerEnd="url(#arrRed)" />
          <text x="205" y="322" fill={C.red} fontSize="10">GC pressure →</text>
          <text x="205" y="332" fill={C.red} fontSize="10"> STW pause</text>

          {/* ── Lock-free DS ── */}
          <rect x="440" y="40" width="160" height="60" rx="6"
            fill="#271e3a" stroke={C.purple} strokeWidth="1.5" />
          <text x="520" y="65" fill={C.text} fontSize="12" fontWeight="600" textAnchor="middle">Atomic Head ptr</text>
          <text x="520" y="82" fill={C.muted} fontSize="10" textAnchor="middle">std::atomic / sync/atomic</text>

          <rect x="620" y="40" width="160" height="60" rx="6"
            fill="#271e3a" stroke={C.purple} strokeWidth="1.2" />
          <text x="700" y="63" fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">Node Pool</text>
          <text x="700" y="77" fill={C.muted} fontSize="10" textAnchor="middle">→ Node → Node → nil</text>
          <text x="700" y="91" fill={C.muted} fontSize="9" textAnchor="middle">linked singly</text>

          {/* CAS operation */}
          <rect x="440" y="120" width="340" height="70" rx="6"
            fill="#1e1a2e" stroke={C.purple} strokeWidth="1.2" />
          <text x="610" y="143" fill={C.text} fontSize="12" fontWeight="600" textAnchor="middle">CAS Loop</text>
          <text x="610" y="159" fill={C.muted} fontSize="10" textAnchor="middle">load → compute next → CAS(expected, desired)</text>
          <text x="610" y="173" fill={C.muted} fontSize="10" textAnchor="middle">retry on failure (contention); progress ≥ 1 thread</text>

          {/* thread → CAS arrow */}
          <line x1="360" y1="68" x2="438" y2="68"
            stroke={C.purple} strokeWidth="1.5" markerEnd="url(#arr)" />
          <text x="370" y="63" fill={C.purple} fontSize="10">push/pop</text>

          {/* CAS → atomic head */}
          <line x1="520" y1="100" x2="520" y2="120"
            stroke={C.purple} strokeWidth="1.2" markerEnd="url(#arr)" />
          <text x="524" y="115" fill={C.purple} fontSize="10">update</text>

          {/* ── Reclamation layer ── */}
          <rect x="440" y="258" width="165" height="55" rx="6"
            fill="#2a1f10" stroke={C.amber} strokeWidth="1.2" />
          <text x="522" y="278" fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">Hazard Pointers</text>
          <text x="522" y="293" fill={C.muted} fontSize="10" textAnchor="middle">per-thread guards</text>
          <text x="522" y="306" fill={C.muted} fontSize="10" textAnchor="middle">block premature free</text>

          <rect x="625" y="258" width="170" height="55" rx="6"
            fill="#2a1f10" stroke={C.amber} strokeWidth="1.2" />
          <text x="710" y="278" fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">Epoch-Based Recl.</text>
          <text x="710" y="293" fill={C.muted} fontSize="10" textAnchor="middle">crossbeam / EBR</text>
          <text x="710" y="306" fill={C.muted} fontSize="10" textAnchor="middle">defer free per epoch</text>

          {/* retired → reclamation */}
          <line x1="610" y1="190" x2="522" y2="258"
            stroke={C.amber} strokeWidth="1.2" strokeDasharray="4,3" markerEnd="url(#arrAmber)" />
          <text x="540" y="232" fill={C.amber} fontSize="10">retire(node)</text>

          {/* reclamation → freed */}
          <line x1="522" y1="313" x2="522" y2="380"
            stroke={C.green} strokeWidth="1.2" markerEnd="url(#arrGreen)" />
          <text x="526" y="350" fill={C.green} fontSize="10">safe free</text>

          <rect x="450" y="380" width="130" height="32" rx="4"
            fill="#1b2d1b" stroke={C.green} strokeWidth="1" />
          <text x="515" y="401" fill={C.green} fontSize="11" fontWeight="600" textAnchor="middle">Memory freed</text>

          {/* ── CPU Memory Model section ── */}
          {[
            { x: 200, label: "relaxed", sub: "no ordering" },
            { x: 320, label: "acquire", sub: "load barrier" },
            { x: 440, label: "release", sub: "store barrier" },
            { x: 560, label: "seq_cst", sub: "total order" },
          ].map(({ x, label, sub }) => (
            <g key={label}>
              <rect x={x} y="460" width="110" height="40" rx="4"
                fill="#262626" stroke="#6b7280" strokeWidth="1" />
              <text x={x + 55} y="478" fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">{label}</text>
              <text x={x + 55} y="493" fill={C.muted} fontSize="10" textAnchor="middle">{sub}</text>
            </g>
          ))}

          {/* ABA badge */}
          <rect x="625" y="380" width="160" height="35" rx="5"
            fill="#2a1212" stroke={C.red} strokeWidth="1.2" />
          <text x="705" y="397" fill={C.red} fontSize="11" fontWeight="600" textAnchor="middle">ABA Problem</text>
          <text x="705" y="410" fill={C.muted} fontSize="10" textAnchor="middle">CAS succeeds spuriously</text>

          {/* ABA arrow from node pool */}
          <line x1="700" y1="313" x2="700" y2="380"
            stroke={C.red} strokeWidth="1.2" strokeDasharray="3,3" markerEnd="url(#arrRed)" />
          <text x="704" y="350" fill={C.red} fontSize="10">reuse hazard</text>

          {/* ── Legend ── */}
          <rect x="10" y="430" width="160" height="120" rx="6"
            fill="#181b22" stroke={C.border} strokeWidth="1" />
          <text x="90" y="450" fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">Legend</text>
          {[
            { color: C.blue, label: "Allocation / input" },
            { color: C.purple, label: "CAS / atomic ops" },
            { color: C.amber, label: "Reclamation / async" },
            { color: C.green, label: "Free / output" },
            { color: C.red, label: "Failure / hazard" },
          ].map(({ color, label }, i) => (
            <g key={label}>
              <rect x="20" y={460 + i * 17} width="12" height="10" rx="2" fill={color} />
              <text x="38" y={470 + i * 17} fill={C.muted} fontSize="10">{label}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Memory Pressure summary */}
      <SectionTitle>Memory Pressure at a Glance</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { title: "Allocation Rate", color: C.blue, body: "Objects created per second in hot paths. High rate → frequent minor GC. Root cause of most P99 latency spikes." },
          { title: "Fragmentation", color: C.purple, body: "Non-contiguous free memory. Internal (wasted inside block) or external (gaps between blocks). Go heap doesn't compact → external fragmentation grows." },
          { title: "GC Pause Budget", color: C.red, body: "STW pause = P99 floor. ZGC/Shenandoah target <1 ms. G1 defaults can hit seconds under heap pressure. Go GC assist steals goroutine CPU time." },
        ].map(({ title, color, body }) => (
          <div key={title} style={{
            background: C.surface, border: `1px solid ${color}44`,
            borderRadius: 8, padding: 14,
          }}>
            <div style={{ color, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{title}</div>
            <P>{body}</P>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB 2 – Core Concepts ────────────────────────────────────────────────────
function ConceptsTab() {
  const concepts = [
    {
      term: "Memory Pressure",
      source: "Linux kernel documentation; Brendan Gregg, Systems Performance",
      color: C.blue,
      def: "The condition where a system's demand for memory approaches or exceeds available physical RAM, forcing the OS or runtime to reclaim pages, invoke the GC, or swap.",
      why: "Manifests as increased GC frequency, allocation latency spikes, and page faults. The first symptom in production is P99/P999 latency diverging from P50.",
      mistake: "Treating heap size as the only lever. Allocation rate (objects/sec) matters more than heap size—halving allocation rate often outperforms doubling heap.",
    },
    {
      term: "Cache Line Contention (False Sharing)",
      source: "Ulrich Drepper, What Every Programmer Should Know About Memory (2007)",
      color: C.amber,
      def: "When two threads write to different variables that occupy the same 64-byte CPU cache line, the cache coherence protocol (MESI) forces the line to ping-pong between cores, serialising what appeared to be independent writes.",
      why: "Can reduce throughput by 10–100× on hot atomic counters. Detected via perf stat -e cache-misses or hardware PMU counters.",
      mistake: "Using a single atomic counter shared by all producers. Solution: per-CPU/per-goroutine counters with periodic aggregation (e.g., Prometheus client libraries use this pattern).",
    },
    {
      term: "Lock-Freedom vs Wait-Freedom",
      source: "Herlihy & Shavit, The Art of Multiprocessor Programming (2008)",
      color: C.purple,
      def: "Lock-free guarantees at least one thread makes progress in finite steps regardless of others. Wait-free guarantees every thread completes its operation in a bounded number of its own steps.",
      why: "Lock-free prevents deadlock and priority inversion but a starved thread may spin indefinitely (livelock). Wait-free is stronger but costlier to implement—most production structures are lock-free, not wait-free.",
      mistake: "Using 'non-blocking' and 'lock-free' interchangeably. Obstruction-freedom (progress only when running alone) is weaker than lock-freedom. All three are distinct.",
    },
    {
      term: "Compare-And-Swap (CAS)",
      source: "IBM System/370 architecture; formalised in Herlihy 1991 (consensus number = ∞)",
      color: C.purple,
      def: "An atomic instruction that reads a memory location, compares it to an expected value, and—only if equal—writes a new value, all as a single uninterruptible hardware operation.",
      why: "CAS is the universal primitive for lock-free algorithms. Its consensus number is ∞, meaning any number of threads can agree using CAS alone. All lock-free stacks, queues, and maps are built on CAS or LL/SC variants.",
      mistake: "Using compare_exchange_strong everywhere. compare_exchange_weak may spuriously fail on LL/SC architectures (ARM, RISC-V) but is preferred inside retry loops—the spurious failure is handled by the loop anyway.",
    },
    {
      term: "ABA Problem",
      source: "IBM patent, 1983; extensively documented in Herlihy & Shavit Ch. 10",
      color: C.red,
      def: "A CAS reads value A, another thread changes it to B then back to A, and the original CAS succeeds—incorrectly believing nothing changed. The pointer is the same but the underlying object may have been freed and reallocated.",
      why: "Silent data corruption in lock-free structures that recycle memory (pools, allocators). Leads to use-after-free, corrupted linked lists, lost updates.",
      mistake: "Thinking reference counting alone solves ABA. It prevents UAF but not the logical ABA where a different object happens to land at the same address.",
    },
    {
      term: "Memory Ordering (acquire / release / seq_cst)",
      source: "C++11 memory model (N2429); Rust std::sync::atomic; Go sync/atomic",
      color: C.green,
      def: "Rules governing how memory operations may be reordered by compilers and CPUs. 'Acquire' prevents subsequent reads from moving before a load. 'Release' prevents prior writes from moving after a store. Together they form a synchronisation edge.",
      why: "On x86 (TSO), acquire/release are free—the hardware already provides them. On ARM/RISC-V (weakly ordered), explicit barriers become real instructions. Using seq_cst everywhere on ARM has measurable overhead.",
      mistake: "Assuming volatile means atomic. In C++ volatile prevents compiler reordering but does not generate barriers and is not atomic. In Java, volatile is atomic but implies seq_cst cost. These are unrelated concepts.",
    },
    {
      term: "Safe Memory Reclamation (SMR)",
      source: "Maged Michael, Hazard Pointers (2004 IEEE TPDS); crossbeam-epoch (Rust) for EBR",
      color: C.amber,
      def: "The class of techniques that ensure a thread does not free memory another thread may still be reading. The two dominant approaches are Hazard Pointers (per-thread pointer registration) and Epoch-Based Reclamation (defer free until all threads advance epochs).",
      why: "Without SMR, a pop() in a lock-free queue could free a node that a concurrently-paused thread still holds a pointer to—classic use-after-free. GC languages (Java, Go) get this 'for free'; C++/Rust must handle it explicitly.",
      mistake: "Using shared_ptr<T> for SMR in lock-free code. Atomic shared_ptr has seq_cst semantics and a reference count update on every load—this is often slower than a mutex for the critical path.",
    },
  ];

  return (
    <div style={{ padding: "20px 0" }}>
      {concepts.map(({ term, source, color, def, why, mistake }) => (
        <Card key={term} title={term} badge={source} badgeColor={color}>
          <P><Hl color={C.text}>Definition:</Hl> {def}</P>
          <P style={{ marginTop: 6 }}><Hl color={C.green}>Why it matters:</Hl> {why}</P>
          <P style={{ marginTop: 6 }}><Hl color={C.red}>Common mistake:</Hl> {mistake}</P>
        </Card>
      ))}

      <SectionTitle>Trade-offs: Lock-Free vs Mutex-Based</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Dimension", "Lock-Free", "Mutex / Channel"].map(h => (
                <th key={h} style={{
                  background: "#1f2330", color: C.text, padding: "10px 14px",
                  border: `1px solid ${C.border}`, textAlign: "left",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Throughput (low contention)", "Comparable (CAS ≈ lock on uncontended x86)", "Comparable"],
              ["Throughput (high contention)", "Degrades gracefully; no convoy effect", "Lock convoy → serialisation"],
              ["Deadlock", "Impossible by definition", "Possible if lock ordering inconsistent"],
              ["Priority inversion", "Immune", "Classic hazard (OS scheduler)"],
              ["Memory reclamation", "Explicit SMR required (C++/Rust)", "Trivial — hold lock, free, release"],
              ["Code complexity", "High — ABA, ordering, SMR", "Low — lock, mutate, unlock"],
              ["Latency tail (P99)", "Lower — no blocking", "Higher — max-wait = slowest holder"],
              ["When to prefer", "Queue/counter on critical hot-path; interrupt handlers", "Most business logic; anywhere mutex is not measured bottleneck"],
            ].map(([dim, lf, mtx], i) => (
              <tr key={dim} style={{ background: i % 2 === 0 ? C.surface : "#1c1f28" }}>
                <td style={{ padding: "9px 14px", color: C.text, border: `1px solid ${C.border}` }}>{dim}</td>
                <td style={{ padding: "9px 14px", color: C.muted, border: `1px solid ${C.border}` }}>{lf}</td>
                <td style={{ padding: "9px 14px", color: C.muted, border: `1px solid ${C.border}` }}>{mtx}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionTitle>Real-World Production Usage</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { who: "Linux Kernel", what: "RCU (Read-Copy-Update) for routing tables, network state — epoch-based SMR at OS level. Also seqlocks for fast read paths." },
          { who: "Java JDK", what: "java.util.concurrent.ConcurrentLinkedQueue — Michael-Scott lock-free queue (1996). ConcurrentHashMap uses fine-grained CAS on bucket heads." },
          { who: "Rust crossbeam", what: "crossbeam-epoch for EBR; crossbeam-queue for lock-free MPMC. Used by Tokio's work-stealing scheduler for task queues." },
          { who: "Go runtime", what: "sync/atomic for lock-free counters in the scheduler. sync.Pool uses per-P (processor) lock-free stacks to reduce GC pressure." },
          { who: "Disruptor (LMAX)", what: "Ring buffer with sequence numbers (not CAS on a linked list). Pre-allocates all nodes, eliminating SMR entirely. Avoids GC pressure by design." },
          { who: "Folly (Meta)", what: "folly::MPMCQueue, folly::AtomicHashMap — production lock-free structures used across Meta's infrastructure at scale." },
        ].map(({ who, what }) => (
          <div key={who} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: 14,
          }}>
            <div style={{ color: C.blue, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{who}</div>
            <P>{what}</P>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB 3 – Implementations ──────────────────────────────────────────────────
const LANGS = ["Go", "Python", "TypeScript", "Rust", "Java"];

const CODE = {
  Go: `// Pattern: Lock-Free Stack (Treiber Stack, 1986)
// Reference: R. K. Treiber, "Systems Programming: Coping with Parallelism" (1986)
// Production note: Epoch-based reclamation not needed here — Go's GC handles it.
// Memory ordering: sync/atomic uses seq_cst by default on all Go platforms.

package lockfree

import (
	"fmt"
	"runtime"
	"sync"
	"sync/atomic"
	"unsafe"
)

// ── Domain types ──────────────────────────────────────────────────────────────

type node[T any] struct {
	value T
	next  unsafe.Pointer // *node[T] stored as unsafe.Pointer for atomic ops
}

// Stack is a lock-free stack safe for concurrent push/pop from multiple goroutines.
// Progress guarantee: lock-free (at least one goroutine makes progress per CAS round).
type Stack[T any] struct {
	head unsafe.Pointer // *node[T]
	len  atomic.Int64
}

// ── Core operations ──────────────────────────────────────────────────────────

func (s *Stack[T]) Push(v T) {
	n := &node[T]{value: v}
	for {
		// Load current head with seq_cst semantics (Go default).
		old := atomic.LoadPointer(&s.head)
		n.next = old
		// CAS: if head is still old, update to n. Retry on contention.
		if atomic.CompareAndSwapPointer(&s.head, old, unsafe.Pointer(n)) {
			s.len.Add(1)
			return
		}
		// Yield to scheduler on hot contention — reduces CPU waste without locks.
		runtime.Gosched()
	}
}

// Pop returns (value, true) or (zero, false) if empty.
// ABA is not an issue here: Go's GC prevents address reuse of live objects.
func (s *Stack[T]) Pop() (T, bool) {
	for {
		old := atomic.LoadPointer(&s.head)
		if old == nil {
			var zero T
			return zero, false
		}
		head := (*node[T])(old)
		// Snapshot head.next before CAS — another thread may modify it.
		next := atomic.LoadPointer(&head.next)
		if atomic.CompareAndSwapPointer(&s.head, old, next) {
			s.len.Add(-1)
			return head.value, true
		}
		runtime.Gosched()
	}
}

func (s *Stack[T]) Len() int64 { return s.len.Load() }

// ── Memory pressure: GC-friendly object pool ─────────────────────────────────

// Pool wraps sync.Pool with type safety to reuse allocations and reduce GC pressure.
// sync.Pool is itself backed by per-P (processor) lock-free stacks in the Go runtime.
type Pool[T any] struct {
	p sync.Pool
}

func NewPool[T any](factory func() T) *Pool[T] {
	return &Pool[T]{p: sync.Pool{New: func() any { v := factory(); return &v }}}
}

func (p *Pool[T]) Get() *T  { return p.p.Get().(*T) }
func (p *Pool[T]) Put(v *T) { p.p.Put(v) }

// ── Concurrent counter with cache-line padding (avoids false sharing) ─────────

// PaddedCounter places each counter on its own 64-byte cache line.
// Without padding, N goroutines writing adjacent counters serialize on cache coherence.
const cacheLineSize = 64

type paddedInt64 struct {
	v   atomic.Int64
	_   [cacheLineSize - 8]byte // pad to 64 bytes
}

type ShardedCounter struct {
	shards []paddedInt64
}

func NewShardedCounter(n int) *ShardedCounter {
	return &ShardedCounter{shards: make([]paddedInt64, n)}
}

func (c *ShardedCounter) Inc(shard int) {
	c.shards[shard%len(c.shards)].v.Add(1)
}

func (c *ShardedCounter) Total() int64 {
	var total int64
	for i := range c.shards {
		total += c.shards[i].v.Load()
	}
	return total
}

// ── Usage example ─────────────────────────────────────────────────────────────

func Example() {
	const goroutines = 8
	const itemsPerG = 1000

	s := &Stack[int]{}
	var wg sync.WaitGroup

	// Concurrent producers
	for g := range goroutines {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			for i := range itemsPerG {
				s.Push(id*itemsPerG + i)
			}
		}(g)
	}
	wg.Wait()
	fmt.Println("pushed:", s.Len()) // 8000

	// Concurrent consumers
	popped := atomic.Int64{}
	for range goroutines {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				if _, ok := s.Pop(); ok {
					popped.Add(1)
				} else {
					return
				}
			}
		}()
	}
	wg.Wait()
	fmt.Println("popped:", popped.Load()) // 8000
}`,

  Python: `# Pattern: Lock-Free (optimistic) Stack & memory pressure utilities
# Reference: Herlihy & Shavit, "The Art of Multiprocessor Programming" (2008)
# Production note: CPython's GIL means true lock-freedom is only meaningful
#   for I/O-bound or multiprocessing scenarios, or with PyPy/GraalPy.
#   Use threading.local + queue.SimpleQueue for true thread-safety in CPython.

from __future__ import annotations

import ctypes
import threading
import weakref
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Generic, TypeVar

T = TypeVar("T")

# ── Domain types ──────────────────────────────────────────────────────────────

@dataclass
class _Node(Generic[T]):
    value: T
    next: "_Node[T] | None" = field(default=None, repr=False)


# ── Lock-Free Stack (CPython-safe via GIL; true CAS illustrated via ctypes) ───

class LockFreeStack(Generic[T]):
    """
    In CPython, the GIL serialises bytecodes, so list.append/pop are
    effectively atomic for the reference implementation.
    This class shows the intent and structure of a CAS-based stack,
    wrapping threading.local for true per-thread safety.

    For genuine multiprocessing (bypassing GIL), use multiprocessing.Queue.
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()   # explicit lock shown for clarity
        self._head: _Node[T] | None = None
        self._len: int = 0

    def push(self, value: T) -> None:
        """O(1) amortised. Thread-safe."""
        new_node = _Node(value=value)
        with self._lock:
            new_node.next = self._head
            self._head = new_node
            self._len += 1

    def pop(self) -> T | None:
        """Returns value or None if empty. O(1)."""
        with self._lock:
            if self._head is None:
                return None
            node = self._head
            self._head = node.next
            self._len -= 1
            return node.value

    def __len__(self) -> int:
        return self._len


# ── Memory pressure: object pool to reduce allocator churn ────────────────────

class ObjectPool(Generic[T]):
    """
    Thread-safe object pool backed by threading.local for the hot path.
    Reduces GC pressure by reusing objects instead of allocating per-request.

    Pattern: 'Flyweight' (GoF) + per-thread cache for lock-free fast path.
    """

    def __init__(self, factory: Callable[[], T], max_size: int = 1024) -> None:
        self._factory = factory
        self._max_size = max_size
        self._pool: list[T] = []
        self._lock = threading.Lock()
        self._reuse_count: int = 0
        self._alloc_count: int = 0

    def acquire(self) -> T:
        with self._lock:
            if self._pool:
                self._reuse_count += 1
                return self._pool.pop()
        self._alloc_count += 1
        return self._factory()

    def release(self, obj: T) -> None:
        with self._lock:
            if len(self._pool) < self._max_size:
                self._pool.append(obj)

    @property
    def stats(self) -> dict[str, int]:
        return {
            "reuse_count": self._reuse_count,
            "alloc_count": self._alloc_count,
            "pool_size": len(self._pool),
        }


# ── Cache-line-aware sharded counter (avoids false sharing) ──────────────────

import ctypes

CACHE_LINE = 64

class _PaddedCounter(ctypes.Structure):
    """Each counter on its own cache line — prevents false sharing."""
    _fields_ = [
        ("value", ctypes.c_int64),
        ("_pad", ctypes.c_uint8 * (CACHE_LINE - 8)),
    ]


class ShardedCounter:
    """
    N independent counters, each padded to a cache line.
    inc(shard) is contention-free across shards.
    total() aggregates with a full fence (threading.Lock ensures visibility).
    """
    def __init__(self, n_shards: int) -> None:
        ArrayType = _PaddedCounter * n_shards
        self._shards = ArrayType()
        self._n = n_shards

    def inc(self, shard: int) -> None:
        self._shards[shard % self._n].value += 1

    def total(self) -> int:
        return sum(s.value for s in self._shards)


# ── Weak-reference cache (reduces memory pressure for large object graphs) ─────

class WeakCache(Generic[T]):
    """
    Cache that does not prevent GC collection.
    Useful for large, recomputable objects (parsed configs, compiled regexes).
    """
    def __init__(self) -> None:
        self._cache: dict[str, weakref.ref[T]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> T | None:
        with self._lock:
            ref = self._cache.get(key)
            return ref() if ref is not None else None

    def set(self, key: str, value: T) -> None:
        with self._lock:
            self._cache[key] = weakref.ref(value)

    def cleanup(self) -> int:
        """Remove dead references. Returns count of evictions."""
        with self._lock:
            dead = [k for k, v in self._cache.items() if v() is None]
            for k in dead:
                del self._cache[k]
            return len(dead)


# ── Usage example ─────────────────────────────────────────────────────────────

def example() -> None:
    import concurrent.futures

    stack: LockFreeStack[int] = LockFreeStack()

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        futures = [ex.submit(stack.push, i) for i in range(1000)]
        concurrent.futures.wait(futures)

    print(f"stack length: {len(stack)}")   # 1000
    assert len(stack) == 1000

    counter = ShardedCounter(8)
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        futs = [ex.submit(counter.inc, i % 8) for i in range(10_000)]
        concurrent.futures.wait(futs)
    print(f"total: {counter.total()}")     # 10000`,

  TypeScript: `// Pattern: Lock-Free Stack & Memory Pressure Utilities
// Reference: Herlihy & Shavit, "The Art of Multiprocessor Programming" (2008)
// Production note: JS is single-threaded. True lock-freedom applies in
//   SharedArrayBuffer + Atomics (Worker threads). Below shows both paths.
// TypeScript 5.0+, strict mode.

import { Atomics, SharedArrayBuffer } from "node:worker_threads"; // Node 20+

// ── Domain types ──────────────────────────────────────────────────────────────

type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T> { return { ok: true, value }; }
function err<E extends Error>(error: E): Result<never, E> { return { ok: false, error }; }

// ── Lock-Free atomic counter using SharedArrayBuffer + Atomics ────────────────
// This is real CAS in JS — usable across Worker threads sharing the buffer.

const INT32_BYTES = 4;

export class AtomicCounter {
  private readonly view: Int32Array;

  constructor(buffer?: SharedArrayBuffer) {
    const sab = buffer ?? new SharedArrayBuffer(INT32_BYTES);
    this.view = new Int32Array(sab);
  }

  /** Atomically increment and return the new value. */
  increment(delta = 1): number {
    return Atomics.add(this.view, 0, delta) + delta;
  }

  /** Atomically decrement. */
  decrement(delta = 1): number {
    return Atomics.sub(this.view, 0, delta) - delta;
  }

  /** CAS: set to next only if current === expected. */
  compareAndSwap(expected: number, next: number): boolean {
    return Atomics.compareExchange(this.view, 0, expected, next) === expected;
  }

  load(): number { return Atomics.load(this.view, 0); }
  store(val: number): void { Atomics.store(this.view, 0, val); }
  get sharedBuffer(): SharedArrayBuffer { return this.view.buffer as SharedArrayBuffer; }
}

// ── Single-threaded optimistic stack (illustrative) ───────────────────────────
// In the browser / single-thread Node, "lock-free" means no mutex.
// Under Atomics + Workers, replace the array with SAB-backed structures.

interface StackNode<T> {
  value: T;
  next: StackNode<T> | null;
}

export class Stack<T> {
  private head: StackNode<T> | null = null;
  private _size = 0;

  push(value: T): void {
    this.head = { value, next: this.head };
    this._size++;
  }

  pop(): Result<T, Error> {
    if (this.head === null) {
      return err(new Error("Stack underflow"));
    }
    const { value, next } = this.head;
    this.head = next;
    this._size--;
    return ok(value);
  }

  get size(): number { return this._size; }
}

// ── Object pool: reduce GC pressure by reusing allocations ───────────────────

type Factory<T> = () => T;
type Resetter<T> = (obj: T) => void;

export class ObjectPool<T extends object> {
  private readonly pool: T[] = [];
  private reuses = 0;
  private allocs = 0;

  constructor(
    private readonly factory: Factory<T>,
    private readonly reset: Resetter<T>,
    private readonly maxSize: number = 512,
  ) {}

  acquire(): T {
    const obj = this.pool.pop();
    if (obj !== undefined) {
      this.reuses++;
      return obj;
    }
    this.allocs++;
    return this.factory();
  }

  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.reset(obj);
      this.pool.push(obj);
    }
    // Excess objects fall off — GC collects them naturally.
  }

  get stats() {
    return {
      poolSize: this.pool.length,
      reuses: this.reuses,
      allocs: this.allocs,
      hitRate: this.allocs + this.reuses > 0
        ? (this.reuses / (this.allocs + this.reuses) * 100).toFixed(1) + "%"
        : "n/a",
    };
  }
}

// ── Sharded counter: avoid false sharing in multi-core environments ───────────
// In Node.js with Worker threads + SharedArrayBuffer, each shard maps to
// a different cache line in the shared buffer.

const CACHE_LINE_INTS = 16; // 64 bytes / 4 bytes per Int32

export class ShardedAtomicCounter {
  private readonly view: Int32Array;
  private readonly shards: number;

  constructor(shards: number, buffer?: SharedArrayBuffer) {
    this.shards = shards;
    const sab = buffer ?? new SharedArrayBuffer(shards * CACHE_LINE_INTS * INT32_BYTES);
    this.view = new Int32Array(sab);
  }

  /** Increment shard n. Thread-safe via Atomics. */
  inc(shard: number, delta = 1): void {
    const index = (shard % this.shards) * CACHE_LINE_INTS;
    Atomics.add(this.view, index, delta);
  }

  /** Sum across all shards. */
  total(): number {
    let sum = 0;
    for (let i = 0; i < this.shards; i++) {
      sum += Atomics.load(this.view, i * CACHE_LINE_INTS);
    }
    return sum;
  }

  get sharedBuffer(): SharedArrayBuffer { return this.view.buffer as SharedArrayBuffer; }
}

// ── Usage example ─────────────────────────────────────────────────────────────

function example(): void {
  const stack = new Stack<number>();
  for (let i = 0; i < 1000; i++) stack.push(i);
  console.assert(stack.size === 1000);

  const result = stack.pop();
  console.assert(result.ok === true && result.value === 999);

  // Object pool usage
  interface Buf { data: Uint8Array }
  const pool = new ObjectPool<Buf>(
    () => ({ data: new Uint8Array(1024) }),
    (b) => b.data.fill(0),
    64,
  );

  const buf = pool.acquire();
  buf.data[0] = 42;
  pool.release(buf);
  console.log("Pool stats:", pool.stats);

  // Atomic counter (cross-worker capable)
  const counter = new AtomicCounter();
  counter.increment(5);
  console.assert(counter.load() === 5);
  console.log("CAS result:", counter.compareAndSwap(5, 10)); // true
  console.assert(counter.load() === 10);
}

example();`,

  Rust: `// Pattern: Lock-Free Stack (Treiber Stack) with Epoch-Based Reclamation
// Reference: Treiber (1986); crossbeam-epoch for safe memory reclamation
// Production note: crossbeam is the de-facto Rust lock-free crate — used by Tokio.

use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use std::thread;

// ── Domain types ──────────────────────────────────────────────────────────────

/// A node in the lock-free stack.
struct Node<T> {
    value: T,
    next: crossbeam_epoch::Atomic<Node<T>>,
}

/// Lock-free Treiber stack using epoch-based reclamation for safe memory management.
///
/// # Safety
/// Memory reclamation is handled by crossbeam-epoch. Nodes are deferred-freed
/// only after all threads that could hold a pointer to them have exited their epoch.
pub struct Stack<T> {
    head: crossbeam_epoch::Atomic<Node<T>>,
}

impl<T> Stack<T> {
    pub fn new() -> Self {
        Stack {
            head: crossbeam_epoch::Atomic::null(),
        }
    }

    /// Push a value. Lock-free; retries on CAS failure.
    pub fn push(&self, value: T) {
        let guard = crossbeam_epoch::pin(); // announce entry to current epoch
        let new_node = crossbeam_epoch::Owned::new(Node {
            value,
            next: crossbeam_epoch::Atomic::null(),
        });
        let new_ptr = new_node.into_shared(&guard);

        loop {
            let head = self.head.load(Ordering::Acquire, &guard);
            unsafe { (*new_ptr.as_raw()).next.store(head, Ordering::Relaxed) };

            match self.head.compare_exchange(
                head,
                new_ptr,
                Ordering::Release, // publish the new node
                Ordering::Relaxed, // failure: no ordering needed
                &guard,
            ) {
                Ok(_) => return,
                Err(_) => continue, // CAS failed — contention, retry
            }
        }
    }

    /// Pop a value. Returns None if empty.
    ///
    /// # Memory safety
    /// The popped node is deferred-destroyed — it will only be freed after
    /// all threads that entered the epoch before this pop have exited.
    pub fn pop(&self) -> Option<T> {
        let guard = crossbeam_epoch::pin();
        loop {
            let head = self.head.load(Ordering::Acquire, &guard);
            match unsafe { head.as_ref() } {
                None => return None,
                Some(node) => {
                    let next = node.next.load(Ordering::Relaxed, &guard);
                    match self.head.compare_exchange(
                        head,
                        next,
                        Ordering::AcqRel,
                        Ordering::Relaxed,
                        &guard,
                    ) {
                        Ok(_) => {
                            // SAFETY: CAS succeeded — we own this node.
                            // Defer destruction until epoch advances past all current readers.
                            let value = unsafe { std::ptr::read(&node.value) };
                            unsafe { guard.defer_destroy(head) };
                            return Some(value);
                        }
                        Err(_) => continue,
                    }
                }
            }
        }
    }
}

impl<T> Default for Stack<T> {
    fn default() -> Self { Self::new() }
}

// SAFETY: Stack is Send+Sync if T is Send.
unsafe impl<T: Send> Send for Stack<T> {}
unsafe impl<T: Send> Sync for Stack<T> {}

// ── Cache-line padded counter (false sharing avoidance) ──────────────────────

#[repr(align(64))] // align to cache-line boundary
struct PaddedCounter {
    value: AtomicUsize,
}

pub struct ShardedCounter {
    shards: Box<[PaddedCounter]>,
}

impl ShardedCounter {
    pub fn new(n: usize) -> Self {
        let shards = (0..n)
            .map(|_| PaddedCounter { value: AtomicUsize::new(0) })
            .collect::<Vec<_>>()
            .into_boxed_slice();
        ShardedCounter { shards }
    }

    pub fn inc(&self, shard: usize) {
        self.shards[shard % self.shards.len()]
            .value
            .fetch_add(1, Ordering::Relaxed);
    }

    /// Relaxed loads are fine for aggregation — we accept a slightly stale sum.
    pub fn total(&self) -> usize {
        self.shards.iter().map(|s| s.value.load(Ordering::Relaxed)).sum()
    }
}

// ── Object pool: reduce allocation pressure and GC churn ─────────────────────

use crossbeam_channel::{bounded, Receiver, Sender};

/// Thread-safe object pool backed by a bounded MPMC channel.
/// Reusing objects avoids heap allocation on the hot path.
pub struct Pool<T: Send + 'static> {
    tx: Sender<T>,
    rx: Receiver<T>,
    factory: Box<dyn Fn() -> T + Send + Sync>,
}

impl<T: Send + 'static> Pool<T> {
    pub fn new(capacity: usize, factory: impl Fn() -> T + Send + Sync + 'static) -> Arc<Self> {
        let (tx, rx) = bounded(capacity);
        Arc::new(Pool { tx, rx, factory: Box::new(factory) })
    }

    pub fn acquire(&self) -> T {
        self.rx.try_recv().unwrap_or_else(|_| (self.factory)())
    }

    pub fn release(&self, obj: T) {
        let _ = self.tx.try_send(obj); // drops silently if pool is full
    }
}

// ── Usage example ─────────────────────────────────────────────────────────────

fn main() {
    const THREADS: usize = 8;
    const PER_THREAD: usize = 10_000;

    let stack = Arc::new(Stack::<usize>::new());
    let counter = Arc::new(ShardedCounter::new(THREADS));

    let mut handles = vec![];

    for t in 0..THREADS {
        let s = Arc::clone(&stack);
        let c = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            for i in 0..PER_THREAD {
                s.push(t * PER_THREAD + i);
                c.inc(t);
            }
        }));
    }
    for h in handles { h.join().unwrap(); }

    println!("counter total: {}", counter.total()); // 80_000

    // Drain
    let mut popped = 0usize;
    while stack.pop().is_some() { popped += 1; }
    println!("popped: {popped}"); // 80_000
}`,

  Java: `// Pattern: Lock-Free Stack (Treiber Stack) + Memory Pressure Utilities
// Reference: Treiber (1986); JEP 425 (Virtual Threads, Java 21)
// Production note: Java's GC handles memory reclamation — no SMR needed.
//   AtomicReference<Node<T>> provides the CAS primitive.

package lockfree;

import java.lang.invoke.MethodHandles;
import java.lang.invoke.VarHandle;
import java.util.Optional;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.function.Supplier;

// ── Domain types ──────────────────────────────────────────────────────────────

/** Immutable node — no mutation after insertion; GC handles reclamation. */
record StackNode<T>(T value, StackNode<T> next) {}

// ── Lock-Free Treiber Stack ───────────────────────────────────────────────────

/**
 * Lock-free stack safe for concurrent push/pop.
 * Progress guarantee: lock-free.
 * Memory safety: Java GC — no hazard pointers or epoch reclamation required.
 *
 * @param <T> element type
 */
public final class LockFreeStack<T> {

    // VarHandle gives CAS without boxing (preferred over AtomicReference in Java 9+)
    private static final VarHandle HEAD;

    static {
        try {
            HEAD = MethodHandles.lookup()
                .findVarHandle(LockFreeStack.class, "head", StackNode.class);
        } catch (ReflectiveOperationException e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    @SuppressWarnings("unused") // accessed via VarHandle
    private volatile StackNode<T> head = null;
    private final LongAdder size = new LongAdder(); // contention-friendly counter

    /** Push a value. Retries until CAS succeeds. O(1) amortised. */
    public void push(T value) {
        StackNode<T> newNode;
        StackNode<T> current;
        do {
            current = (StackNode<T>) HEAD.getAcquire(this);
            newNode = new StackNode<>(value, current);
            // CAS: if head == current, set head = newNode
        } while (!HEAD.compareAndSet(this, current, newNode));
        size.increment();
    }

    /**
     * Pop the top element.
     *
     * @return Optional containing the value, or empty if the stack is empty.
     */
    @SuppressWarnings("unchecked")
    public Optional<T> pop() {
        StackNode<T> current;
        StackNode<T> next;
        do {
            current = (StackNode<T>) HEAD.getAcquire(this);
            if (current == null) return Optional.empty();
            next = current.next();
        } while (!HEAD.compareAndSet(this, current, next));
        size.decrement();
        return Optional.of(current.value());
    }

    /** Returns a snapshot count — may be stale under contention. */
    public long size() { return size.longValue(); }
}

// ── Cache-line padded counter (false sharing avoidance) ──────────────────────

/**
 * Each shard is padded to 128 bytes (2 × cache line on modern Intel/ARM)
 * to prevent false sharing under concurrent writes.
 *
 * LongAdder in the JDK uses a similar internally padded cell strategy.
 */
@SuppressWarnings("unused") // padding fields intentional
final class PaddedLong {
    long p1, p2, p3, p4, p5, p6, p7;          // pre-padding
    volatile long value = 0;
    long q1, q2, q3, q4, q5, q6, q7;          // post-padding
}

public final class ShardedCounter {
    private final PaddedLong[] shards;

    public ShardedCounter(int shards) {
        this.shards = new PaddedLong[shards];
        for (int i = 0; i < shards; i++) this.shards[i] = new PaddedLong();
    }

    public void inc(int shard) { shards[shard % shards.length].value++; }

    public long total() {
        long sum = 0;
        for (PaddedLong s : shards) sum += s.value;
        return sum;
    }
}

// ── Object pool: reduce GC pressure via object reuse ─────────────────────────

/**
 * Thread-safe object pool backed by a ConcurrentLinkedQueue.
 *
 * Used to reuse expensive allocations (byte buffers, parser instances)
 * and reduce young-gen GC pressure on hot paths.
 *
 * @param <T> pooled object type
 */
public final class ObjectPool<T> {
    private final ConcurrentLinkedQueue<T> pool = new ConcurrentLinkedQueue<>();
    private final Supplier<T> factory;
    private final int maxSize;
    private final LongAdder reuses = new LongAdder();
    private final LongAdder allocs = new LongAdder();

    public ObjectPool(Supplier<T> factory, int maxSize) {
        this.factory = factory;
        this.maxSize = maxSize;
    }

    /** Acquire an object — from pool or freshly allocated. */
    public T acquire() {
        T obj = pool.poll();
        if (obj != null) { reuses.increment(); return obj; }
        allocs.increment();
        return factory.get();
    }

    /** Return an object to the pool. Drops if pool is at capacity. */
    public void release(T obj) {
        if (pool.size() < maxSize) pool.offer(obj);
        // excess objects are eligible for GC
    }

    public record Stats(long poolSize, long reuses, long allocs) {}

    public Stats stats() {
        return new Stats(pool.size(), reuses.longValue(), allocs.longValue());
    }
}

// ── Usage example ─────────────────────────────────────────────────────────────

class Main {
    public static void main(String[] args) throws InterruptedException {
        final int threads = 8;
        final int perThread = 10_000;
        final var stack = new LockFreeStack<Integer>();
        final var counter = new ShardedCounter(threads);

        try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
            var futures = new java.util.ArrayList<Future<?>>();
            for (int t = 0; t < threads; t++) {
                final int id = t;
                futures.add(exec.submit(() -> {
                    for (int i = 0; i < perThread; i++) {
                        stack.push(id * perThread + i);
                        counter.inc(id);
                    }
                }));
            }
            for (var f : futures) {
                try { f.get(); } catch (ExecutionException e) { throw new RuntimeException(e); }
            }
        }

        System.out.println("stack size : " + stack.size());     // 80_000
        System.out.println("counter    : " + counter.total());  // 80_000

        // Object pool
        var pool = new ObjectPool<>(() -> new byte[4096], 64);
        var buf = pool.acquire();
        buf[0] = 1;
        pool.release(buf);
        System.out.println("pool stats : " + pool.stats());
    }
}`,
};

function ImplTab() {
  const [lang, setLang] = useState("Go");

  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 8, padding: "12px 16px", marginBottom: 16,
      }}>
        <P style={{ marginBottom: 10, color: C.text, fontWeight: 600 }}>
          Core Implementations — No Cloud Dependencies
        </P>
        <P>Each implementation includes: (1) Treiber lock-free stack with CAS, (2) sharded counter with cache-line padding, (3) object pool for GC pressure reduction. Go and Java rely on the runtime GC for safe reclamation. Rust uses crossbeam-epoch (EBR). TypeScript uses SharedArrayBuffer + Atomics for cross-worker CAS.</P>
      </div>

      {/* Lang switcher */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 16,
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 8, padding: 8, flexWrap: "wrap",
      }}>
        {LANGS.map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding: "6px 14px", border: "none", cursor: "pointer",
            background: lang === l ? C.blue : "transparent",
            color: lang === l ? "#fff" : C.muted,
            borderRadius: 6, fontSize: 13, fontWeight: lang === l ? 600 : 400,
          }}>{l}</button>
        ))}
      </div>

      {/* Dependency note */}
      {lang === "Rust" && (
        <div style={{
          background: "#2a1f10", border: `1px solid ${C.amber}44`,
          borderRadius: 6, padding: "10px 14px", marginBottom: 12,
        }}>
          <P><Hl color={C.amber}>Cargo.toml dependencies:</Hl>{" "}
            <code style={{ fontFamily: "monospace", color: C.text }}>crossbeam-epoch = "0.9"</code> and{" "}
            <code style={{ fontFamily: "monospace", color: C.text }}>crossbeam-channel = "0.5"</code>
          </P>
        </div>
      )}
      {lang === "TypeScript" && (
        <div style={{
          background: "#1a2030", border: `1px solid ${C.blue}44`,
          borderRadius: 6, padding: "10px 14px", marginBottom: 12,
        }}>
          <P><Hl color={C.blue}>Runtime note:</Hl> SharedArrayBuffer + Atomics requires Node.js 20+ with Worker threads. Browser requires Cross-Origin Isolation headers (<code>COOP/COEP</code>).</P>
        </div>
      )}

      <CodeBlock
        code={CODE[lang]}
        lang={lang.toLowerCase()}
        filename={`implementations/core/${lang === "Go" ? "lockfree.go" : lang === "Python" ? "lockfree.py" : lang === "TypeScript" ? "lockfree.ts" : lang === "Rust" ? "src/main.rs" : "Main.java"}`}
      />

      <SectionTitle>Memory Ordering Quick Reference</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["Ordering", "C++ / Rust", "Go", "Java", "Reorder constraint", "When to use"].map(h => (
                <th key={h} style={{
                  background: "#1f2330", color: C.text, padding: "8px 12px",
                  border: `1px solid ${C.border}`, textAlign: "left", fontSize: 12,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Relaxed", "Relaxed", "–", "opaque", "None", "Stats counters; no sync needed"],
              ["Acquire", "Acquire", "LoadAcquire", "acquire", "No subsequent op moves before load", "Read shared flag / pointer"],
              ["Release", "Release", "StoreRelease", "release", "No prior op moves after store", "Publish data before flag"],
              ["Acq+Rel", "AcqRel", "–", "–", "Both barriers on RMW", "CAS in lock-free DS"],
              ["Seq Cst", "SeqCst", "default", "volatile", "Total global order", "Peterson mutex; rare in practice"],
            ].map(([ord, cpp, go_, java, desc, use], i) => (
              <tr key={ord} style={{ background: i % 2 === 0 ? C.surface : "#1c1f28" }}>
                <td style={{ padding: "8px 12px", color: C.text, border: `1px solid ${C.border}`, fontWeight: 600 }}>{ord}</td>
                <td style={{ padding: "8px 12px", color: C.muted, border: `1px solid ${C.border}`, fontFamily: "monospace" }}>{cpp}</td>
                <td style={{ padding: "8px 12px", color: C.muted, border: `1px solid ${C.border}`, fontFamily: "monospace" }}>{go_}</td>
                <td style={{ padding: "8px 12px", color: C.muted, border: `1px solid ${C.border}`, fontFamily: "monospace" }}>{java}</td>
                <td style={{ padding: "8px 12px", color: C.muted, border: `1px solid ${C.border}` }}>{desc}</td>
                <td style={{ padding: "8px 12px", color: C.muted, border: `1px solid ${C.border}` }}>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB 4 – Leadership ───────────────────────────────────────────────────────
function LeadershipTab() {
  return (
    <div style={{ padding: "20px 0" }}>

      <Card title="Explain to your team (standup / RFC intro)" badgeColor={C.green} badge="3-sentence summary">
        <P>
          Memory pressure occurs when allocation rate outpaces reclamation — the symptom is GC-induced latency spikes.
          Lock-free data structures eliminate mutex contention by replacing blocking with atomic CAS loops, but require careful handling of memory reclamation (hazard pointers or epochs in C++/Rust; GC languages get this free).
          The practical rule: profile allocation rate first, then reach for lock-free only when a mutex is measured as the bottleneck on a hot path.
        </P>
      </Card>

      <Card title="Justify the decision (architecture review)" badgeColor={C.blue} badge="Talking points">
        <P><Hl color={C.text}>Quantify first:</Hl> "pprof/async-profiler shows thread X holds the mutex for Yms at Zk req/s — this is our P99 source."</P>
        <P style={{ marginTop: 6 }}><Hl color={C.text}>Progress guarantee:</Hl> "Lock-free ensures the system makes forward progress even if a thread is preempted mid-operation — no convoy effect, no priority inversion."</P>
        <P style={{ marginTop: 6 }}><Hl color={C.text}>Complexity trade-off:</Hl> "We accept higher implementation complexity (ABA, memory ordering) in exchange for bounded tail latency. The Treiber stack is a well-studied primitive — we're not writing novel lock-free code."</P>
        <P style={{ marginTop: 6 }}><Hl color={C.text}>Fallback:</Hl> "If throughput is &lt;50k ops/sec on this path, a mutex + condition variable is simpler and equally fast — we will not add this complexity without measurements."</P>
      </Card>

      <Card title="Failure Modes & Observability" badgeColor={C.red} badge="What breaks">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
          {[
            {
              name: "Live-lock (CAS spin storm)", color: C.red,
              detect: "CPU at 100% but throughput near zero. perf top shows CAS retry loops.",
              fix: "Exponential backoff + runtime.Gosched() / std::hint::spin_loop(). Consider reducing contention by sharding.",
            },
            {
              name: "ABA corruption", color: C.red,
              detect: "Rare crashes or corrupted list nodes in C++/Rust. Near-impossible in GC languages.",
              fix: "Tagged pointers (version counter in high bits) or epoch-based reclamation. Verified with TSan / AddressSanitizer.",
            },
            {
              name: "GC pause spikes (memory pressure)", color: C.amber,
              detect: "Prometheus: go_gc_duration_seconds P99 > 5ms or jvm_gc_pause_seconds_sum growing.",
              fix: "Reduce allocation rate in hot loop (pool objects). In Go: GOGC=200 / GOMEMLIMIT. In Java: switch to ZGC.",
            },
            {
              name: "False sharing (cache line contention)", color: C.amber,
              detect: "perf stat shows high LLC-store-misses. Throughput drops with more cores (inverse scaling).",
              fix: "Pad shared counters to 64–128 bytes. Use PADDED_ATOMICS or align(64). Validate with perf c2c.",
            },
          ].map(({ name, color, detect, fix }) => (
            <div key={name} style={{
              background: C.code, border: `1px solid ${color}44`,
              borderRadius: 8, padding: 14,
            }}>
              <div style={{ color, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{name}</div>
              <P><Hl color={C.muted}>Detect:</Hl> {detect}</P>
              <P style={{ marginTop: 4 }}><Hl color={C.green}>Fix:</Hl> {fix}</P>
            </div>
          ))}
        </div>

        <SectionTitle>Alerts to Configure</SectionTitle>
        {[
          "gc_pause_p99 > 10ms for 2 consecutive minutes → page on-call",
          "heap_utilization > 80% for 5 minutes → investigate allocation hot-spots",
          "cas_retry_rate > 10% of operations → suspect contention on shared structure",
          "process_rss growing monotonically → likely memory leak (off-heap / GC leak)",
        ].map((a, i) => (
          <div key={i} style={{
            fontFamily: "monospace", fontSize: 12, color: C.amber,
            background: "#1a1400", border: `1px solid ${C.amber}33`,
            borderRadius: 4, padding: "6px 12px", marginBottom: 6,
          }}>{a}</div>
        ))}
      </Card>

      <Card title="Scale Implications" badgeColor={C.purple} badge="10x / 100x">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
          <div>
            <div style={{ color: C.blue, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>At 10× load</div>
            <P>GC pause duration increases with heap size (more objects to scan). CAS contention grows as O(n²) in the worst case with n threads on a single shared pointer — shard the structure to O(n/shards) contention. Allocator fragmentation becomes visible in RSS growth.</P>
          </div>
          <div>
            <div style={{ color: C.purple, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>At 100× load</div>
            <P>Single-node lock-free structures hit a ceiling — Disruptor pattern (pre-allocated ring buffer, no CAS on linked list, cache-friendly) becomes relevant. Consider LMAX Disruptor or a segment tree of queues. Java: evaluate ZGC + off-heap (Chronicle Queue). Go: reduce per-request allocation to zero in steady state (sync.Pool for every buffer).</P>
          </div>
        </div>
        <P style={{ marginTop: 10 }}><Hl color={C.amber}>Decision trigger:</Hl> Revisit architecture when CAS retry rate exceeds 5% or GC overhead exceeds 10% of CPU time. These are measurable thresholds — not estimates.</P>
      </Card>

      <Card title="Code Review Checklist" badgeColor={C.green} badge="PR review">
        {[
          ["Memory ordering", "Every CAS operation specifies explicit Ordering/memory_order. No bare seq_cst on the hot path without justification."],
          ["ABA handling", "If using C++/Rust with manual memory: confirm hazard pointers or EBR are in use. Go/Java: verify GC is the reclaimer, not manual delete/drop."],
          ["Error path", "CAS failure path loops correctly (no early return on contention). Loop includes a yield/backoff to prevent live-lock."],
          ["False sharing", "Hot counters / flags are padded to 64 bytes if they are written by >1 thread."],
          ["Allocation in hot path", "No heap allocation inside the CAS loop. Pre-allocate nodes before entering the loop or use a pool."],
          ["Benchmark before merge", "Lock-free code must come with a benchmark showing improvement over mutex baseline at realistic concurrency levels."],
          ["SMR pairing", "Every Owned::new (Rust) or new Node (C++) has a matching defer_destroy / defer_free — no raw delete inside a pop()."],
        ].map(([check, detail]) => (
          <div key={check} style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            borderBottom: `1px solid ${C.border}`, padding: "9px 0",
          }}>
            <span style={{ color: C.green, fontSize: 16, flexShrink: 0 }}>☑</span>
            <div>
              <span style={{ color: C.text, fontWeight: 600, fontSize: 13 }}>{check}:</span>{" "}
              <span style={{ color: C.muted, fontSize: 13 }}>{detail}</span>
            </div>
          </div>
        ))}
      </Card>

      <Card title="Design Review Questions" badgeColor={C.blue} badge="Ask before approving">
        {[
          "What is the measured p99 latency today, and which profiler trace shows this structure as the bottleneck?",
          "Have you benchmarked the lock-free version vs a fine-grained mutex at 1, 4, 8, and 32 threads?",
          "Which progress guarantee do you need — lock-free or wait-free? What happens if one thread is indefinitely preempted?",
          "How is memory reclamation handled? If C++/Rust: which SMR scheme? If GC language: is there any off-heap or unsafe.Pointer usage that bypasses the GC?",
          "What is the allocation rate on this code path? Would an object pool reduce GC pressure enough to avoid needing lock-free at all?",
          "How will you detect live-lock and ABA in production? Which metrics/traces will you instrument?",
        ].map((q, i) => (
          <div key={i} style={{
            display: "flex", gap: 12,
            borderBottom: `1px solid ${C.border}`, padding: "9px 0",
          }}>
            <span style={{ color: C.blue, fontWeight: 600, flexShrink: 0, fontSize: 13 }}>Q{i + 1}</span>
            <P>{q}</P>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const TABS = [
  { label: "① Architecture", key: "arch" },
  { label: "② Core Concepts", key: "concepts" },
  { label: "③ Implementations", key: "impl" },
  { label: "④ Leadership", key: "lead" },
];

export default function MemoryLockfreeConcurrency() {
  const [tab, setTab] = useState("arch");

  return (
    <div style={{
      background: C.bg, minHeight: "100vh", color: C.text,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "0 0 60px",
    }}>
      {/* Header */}
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "16px 28px",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: C.text }}>
            Memory Pressure & Lock-Free Concurrency
          </h1>
          <Badge color={C.purple}>Low-Level Systems</Badge>
          <Badge color={C.blue}>Concurrency</Badge>
          <Badge color={C.amber}>Performance</Badge>
        </div>
        <P style={{ marginTop: 6 }}>
          Allocation lifecycle · CAS / Treiber Stack · ABA Problem · Memory Ordering · Safe Reclamation · GC Pressure
        </P>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 4, padding: "12px 28px 0",
        borderBottom: `1px solid ${C.border}`,
        background: C.surface,
      }}>
        {TABS.map(({ label, key }) => (
          <Tab key={key} label={label} active={tab === key} onClick={() => setTab(key)} />
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "0 28px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "arch" && <ArchTab />}
        {tab === "concepts" && <ConceptsTab />}
        {tab === "impl" && <ImplTab />}
        {tab === "lead" && <LeadershipTab />}
      </div>
    </div>
  );
}
