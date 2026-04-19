"use client"

import { useState } from "react";

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:      "#0f1117",
  surface: "#1a1d24",
  border:  "#2d3139",
  text:    "#e5e7eb",
  muted:   "#9ca3af",
  blue:    "#3b82f6",
  green:   "#10b981",
  amber:   "#f59e0b",
  purple:  "#8b5cf6",
  red:     "#ef4444",
  cyan:    "#06b6d4",
};

// ── Shared atoms ──────────────────────────────────────────────────────────────
function Badge({ color, label }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}55`,
      borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 600,
      letterSpacing: "0.04em", whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1800); }}
      style={{
        position: "absolute", top: 10, right: 10,
        background: ok ? C.green + "33" : "#252b35",
        color: ok ? C.green : C.muted,
        border: `1px solid ${ok ? C.green + "66" : C.border}`,
        borderRadius: 5, padding: "3px 11px", fontSize: 11, cursor: "pointer",
        transition: "all .2s",
      }}>{ok ? "✓ Copied" : "Copy"}</button>
  );
}

function CodeBlock({ code, filename }) {
  return (
    <div style={{ position: "relative", marginBottom: 20 }}>
      {filename && (
        <div style={{
          background: "#161b22", borderRadius: "6px 6px 0 0",
          padding: "5px 14px", fontSize: 11, color: C.muted,
          borderBottom: `1px solid ${C.border}`, fontFamily: "monospace",
        }}>{filename}</div>
      )}
      <div style={{
        background: "#161b22",
        borderRadius: filename ? "0 0 6px 6px" : 6,
        padding: "16px 14px", overflow: "auto", position: "relative",
      }}>
        <CopyBtn text={code} />
        <pre style={{
          margin: 0,
          fontFamily: "'JetBrains Mono','Cascadia Code','Fira Code',monospace",
          fontSize: 12.5, lineHeight: 1.72, color: "#c9d1d9", whiteSpace: "pre",
        }}>{code}</pre>
      </div>
    </div>
  );
}

function SL({ text }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 700, color: C.muted,
      letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14,
    }}>{text}</div>
  );
}

// ── Tab 1 — Architecture ──────────────────────────────────────────────────────
function ArchTab() {
  return (
    <div>
      <p style={{ color: C.muted, lineHeight: 1.75, marginBottom: 24 }}>
        These four concepts occupy <strong style={{ color: C.blue }}>two orthogonal axes</strong>: <em>structure</em> (how work is decomposed and expressed in code) vs <em>execution</em> (how work physically runs on hardware). Concurrency and async sit on the structure axis; parallelism and threads sit on the execution axis. They are independent — single-threaded event loops are concurrent but not parallel; data-parallel GPU kernels are parallel but synchronous.
      </p>

      {/* Relationship map */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, marginBottom: 20 }}>
        <SL text="Conceptual Relationship Map" />
        <svg viewBox="0 0 860 358" style={{ width: "100%" }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            {[["ar",C.muted],["ab",C.blue],["ag",C.green],["aa",C.amber],["ap",C.purple]].map(([id,col])=>(
              <marker key={id} id={id} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill={col}/>
              </marker>
            ))}
          </defs>
          {/* axis banners */}
          <rect x="10"  y="8" width="490" height="22" rx="4" fill={C.blue+"18"} stroke={C.blue+"44"}/>
          <text x="255" y="23" fill={C.blue} fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="1">STRUCTURE AXIS</text>
          <rect x="518" y="8" width="334" height="22" rx="4" fill={C.green+"18"} stroke={C.green+"44"}/>
          <text x="685" y="23" fill={C.green} fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="1">EXECUTION AXIS</text>

          {/* CONCURRENCY */}
          <rect x="10" y="42" width="230" height="300" rx="8" fill={C.blue+"0d"} stroke={C.blue} strokeWidth="1.5"/>
          <text x="125" y="65" fill={C.blue} fontSize="14" fontWeight="700" textAnchor="middle">CONCURRENCY</text>
          <text x="125" y="81" fill={C.muted} fontSize="10" textAnchor="middle">Rob Pike: "dealing with lots</text>
          <text x="125" y="95" fill={C.muted} fontSize="10" textAnchor="middle">of things at once" (2012)</text>
          {[
            ["Single-core interleaving","CPU context-switches every ~10ms",110],
            ["Event-loop (single thread)","Node.js / nginx / libuv model",160],
            ["Goroutines / green threads","M tasks on N OS threads (M:N)",210],
            ["Structured concurrency","async/await, TaskGroup, Loom",260],
          ].map(([t,s,y])=>(
            <g key={t}>
              <rect x="24" y={y} width="202" height="42" rx="5" fill={C.surface} stroke={C.border}/>
              <text x="125" y={y+16} fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">{t}</text>
              <text x="125" y={y+31} fill={C.muted} fontSize="10" textAnchor="middle">{s}</text>
            </g>
          ))}

          {/* ASYNC */}
          <rect x="264" y="42" width="232" height="300" rx="8" fill={C.amber+"0d"} stroke={C.amber} strokeWidth="1.5"/>
          <text x="380" y="65" fill={C.amber} fontSize="14" fontWeight="700" textAnchor="middle">ASYNC / AWAIT</text>
          <text x="380" y="81" fill={C.muted} fontSize="10" textAnchor="middle">Programming model for</text>
          <text x="380" y="95" fill={C.muted} fontSize="10" textAnchor="middle">non-blocking I/O</text>
          {[
            ["Suspend at await point","Release thread; resume on waker",110],
            ["epoll / kqueue / IOCP","OS readiness notification layer",160],
            ["Poll / Future / Promise","Rust Future, JS Promise, py coro",210],
            ["I/O-bound workloads","Network, disk, timers, databases",260],
          ].map(([t,s,y])=>(
            <g key={t}>
              <rect x="278" y={y} width="204" height="42" rx="5" fill={C.surface} stroke={C.border}/>
              <text x="380" y={y+16} fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">{t}</text>
              <text x="380" y={y+31} fill={C.muted} fontSize="10" textAnchor="middle">{s}</text>
            </g>
          ))}

          {/* PARALLELISM */}
          <rect x="520" y="42" width="155" height="300" rx="8" fill={C.green+"0d"} stroke={C.green} strokeWidth="1.5"/>
          <text x="597" y="65" fill={C.green} fontSize="14" fontWeight="700" textAnchor="middle">PARALLELISM</text>
          <text x="597" y="81" fill={C.muted} fontSize="10" textAnchor="middle">"doing lots at once"</text>
          <text x="597" y="95" fill={C.muted} fontSize="10" textAnchor="middle">requires multiple cores</text>
          {[
            ["CPU-bound tasks","rayon, Parallel.ForEach",110],
            ["SIMD / vectorized","instruction-level data par.",160],
            ["GPU compute","CUDA, wgpu, OpenCL",210],
            ["Fork/join patterns","Java ForkJoinPool, Go GOMAXPROCS",260],
          ].map(([t,s,y])=>(
            <g key={t}>
              <rect x="532" y={y} width="131" height="42" rx="5" fill={C.surface} stroke={C.border}/>
              <text x="597" y={y+16} fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">{t}</text>
              <text x="597" y={y+31} fill={C.muted} fontSize="10" textAnchor="middle">{s}</text>
            </g>
          ))}

          {/* THREADS */}
          <rect x="694" y="42" width="158" height="300" rx="8" fill={C.purple+"0d"} stroke={C.purple} strokeWidth="1.5"/>
          <text x="773" y="65" fill={C.purple} fontSize="14" fontWeight="700" textAnchor="middle">THREADS</text>
          <text x="773" y="81" fill={C.muted} fontSize="10" textAnchor="middle">OS execution unit</text>
          <text x="773" y="95" fill={C.muted} fontSize="10" textAnchor="middle">~1–8 MB stack</text>
          {[
            ["OS thread (1:1)","pthreads, std::thread",110],
            ["Green thread (M:N)","Goroutines ~2KB, Loom ~1KB",160],
            ["Thread pool","Tokio, rayon, ForkJoinPool",210],
            ["Context switch","~1–10 μs per switch (kernel)",260],
          ].map(([t,s,y])=>(
            <g key={t}>
              <rect x="706" y={y} width="134" height="42" rx="5" fill={C.surface} stroke={C.border}/>
              <text x="773" y={y+16} fill={C.text} fontSize="11" fontWeight="600" textAnchor="middle">{t}</text>
              <text x="773" y={y+31} fill={C.muted} fontSize="10" textAnchor="middle">{s}</text>
            </g>
          ))}

          {/* arrows */}
          <line x1="240" y1="152" x2="518" y2="152" stroke={C.green} strokeWidth="1.4" markerEnd="url(#ag)" strokeDasharray="5,3"/>
          <text x="379" y="146" fill={C.green} fontSize="10" textAnchor="middle">concurrency enables parallelism</text>
          <line x1="496" y1="212" x2="692" y2="212" stroke={C.purple} strokeWidth="1.4" markerEnd="url(#ap)" strokeDasharray="5,3"/>
          <text x="594" y="206" fill={C.purple} fontSize="10" textAnchor="middle">uses (via runtime)</text>
          <line x1="694" y1="256" x2="496" y2="256" stroke={C.amber} strokeWidth="1.4" markerEnd="url(#aa)" strokeDasharray="5,3"/>
          <text x="595" y="250" fill={C.amber} fontSize="10" textAnchor="middle">threads implement concurrency</text>
        </svg>
      </div>

      {/* Execution timeline diagrams */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {[
          { title:"Synchronous — Blocking", color:C.red, sub:"One thread; tasks execute strictly in sequence",
            rows:[{label:"Thread", segs:[{w:22,c:C.blue,t:"Task A"},{w:18,c:C.red+"99",t:"I/O wait"},{w:20,c:C.blue,t:"Task A"},{w:24,c:C.green,t:"Task B"}]}] },
          { title:"Async / Event Loop", color:C.amber, sub:"Single thread; suspend on I/O; interleave tasks",
            rows:[{label:"Thread", segs:[{w:14,c:C.blue,t:"Task A"},{w:13,c:C.green,t:"Task B"},{w:12,c:C.cyan,t:"Task C"},{w:14,c:C.blue,t:"Task A"},{w:12,c:C.green,t:"Task B"}]}] },
          { title:"Multithreaded — Concurrent", color:C.purple, sub:"Multiple OS threads; interleaved on 1 core",
            rows:[
              {label:"Thread 1", segs:[{w:20,c:C.blue,t:"Task A"},{w:5,c:"#2d3139",t:""},{w:20,c:C.blue,t:"Task A"},{w:5,c:"#2d3139",t:""},{w:14,c:C.blue,t:"Task A"}]},
              {label:"Thread 2", segs:[{w:5,c:"#2d3139",t:""},{w:20,c:C.green,t:"Task B"},{w:5,c:"#2d3139",t:""},{w:20,c:C.green,t:"Task B"},{w:14,c:C.green,t:"Task B"}]},
            ] },
          { title:"Parallel — True Simultaneity", color:C.green, sub:"Two cores; tasks run physically at the same time",
            rows:[
              {label:"Core 1", segs:[{w:64,c:C.blue,t:"Task A — entire duration"}]},
              {label:"Core 2", segs:[{w:64,c:C.green,t:"Task B — entire duration"}]},
            ] },
        ].map(({ title, color, sub, rows }) => (
          <div key={title} style={{ background: C.surface, border: `1px solid ${color}44`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color, marginBottom: 2 }}>{title}</div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>{sub}</div>
            {rows.map(({ label, segs }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 60, fontSize: 10, color: C.muted, textAlign: "right", flexShrink: 0 }}>{label}</div>
                <div style={{ display: "flex", flex: 1, height: 26, borderRadius: 4, overflow: "hidden", gap: 1 }}>
                  {segs.map((s, i) => (
                    <div key={i} style={{
                      flex: s.w,
                      background: s.c === "#2d3139" ? "#2d313944" : s.c + "bb",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, color: "#fff", fontWeight: 600,
                      overflow: "hidden", whiteSpace: "nowrap",
                    }}>{s.w > 11 ? s.t : ""}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Threading models */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, marginBottom: 20 }}>
        <SL text="Threading Models Compared" />
        <svg viewBox="0 0 860 212" style={{ width: "100%" }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="sm" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
              <polygon points="0 0,7 2.5,0 5" fill={C.muted}/>
            </marker>
          </defs>
          {/* 1:1 */}
          <text x="130" y="18" fill={C.purple} fontSize="12" fontWeight="700" textAnchor="middle">1:1 OS Threads</text>
          <text x="130" y="32" fill={C.muted} fontSize="10" textAnchor="middle">pthreads · std::thread · Java (pre-Loom)</text>
          {[0,1,2].map(i=>(
            <g key={i}>
              <rect x={30+i*80} y="44" width="58" height="22" rx="4" fill={C.purple+"33"} stroke={C.purple} strokeWidth="1.2"/>
              <text x={59+i*80} y="59" fill={C.purple} fontSize="10" fontWeight="600" textAnchor="middle">Task {i+1}</text>
              <line x1={59+i*80} y1="66" x2={59+i*80} y2="84" stroke={C.muted} strokeWidth="1.3" markerEnd="url(#sm)"/>
              <rect x={30+i*80} y="86" width="58" height="22" rx="4" fill={C.surface} stroke={C.border}/>
              <text x={59+i*80} y="101" fill={C.muted} fontSize="9" textAnchor="middle">OS Thread</text>
              <line x1={59+i*80} y1="108" x2={59+i*80} y2="126" stroke={C.muted} strokeWidth="1.3" markerEnd="url(#sm)"/>
              <rect x={30+i*80} y="128" width="58" height="22" rx="4" fill={C.surface} stroke={C.border}/>
              <text x={59+i*80} y="143" fill={C.muted} fontSize="9" textAnchor="middle">CPU Core</text>
            </g>
          ))}
          <text x="130" y="172" fill={C.muted} fontSize="10" textAnchor="middle">~1–8 MB stack · OS preempts</text>
          <text x="130" y="186" fill={C.muted} fontSize="10" textAnchor="middle">context switch ~1–10 μs</text>

          {/* M:N */}
          <text x="450" y="18" fill={C.blue} fontSize="12" fontWeight="700" textAnchor="middle">M:N Green Threads</text>
          <text x="450" y="32" fill={C.muted} fontSize="10" textAnchor="middle">Go goroutines · Tokio tasks · Java Virtual Threads</text>
          {[0,1,2,3,4].map(i=>(
            <g key={i}>
              <rect x={295+i*62} y="44" width="50" height="22" rx="4" fill={C.blue+"33"} stroke={C.blue} strokeWidth="1.2"/>
              <text x={320+i*62} y="59" fill={C.blue} fontSize="10" fontWeight="600" textAnchor="middle">G{i+1}</text>
            </g>
          ))}
          <text x="450" y="84" fill={C.muted} fontSize="10" textAnchor="middle">▼ runtime scheduler (work-stealing)</text>
          {[0,1,2].map(i=>(
            <g key={i}>
              <rect x={310+i*98} y="94" width="72" height="22" rx="4" fill={C.surface} stroke={C.border}/>
              <text x={346+i*98} y="109" fill={C.muted} fontSize="9" textAnchor="middle">OS Thread {i+1}</text>
              <line x1={346+i*98} y1="116" x2={346+i*98} y2="134" stroke={C.muted} strokeWidth="1.3" markerEnd="url(#sm)"/>
              <rect x={316+i*98} y="136" width="60" height="22" rx="4" fill={C.surface} stroke={C.border}/>
              <text x={346+i*98} y="151" fill={C.muted} fontSize="9" textAnchor="middle">CPU Core</text>
            </g>
          ))}
          <text x="450" y="175" fill={C.muted} fontSize="10" textAnchor="middle">~2 KB stack (goroutine) · ~1 KB (Loom vthread)</text>
          <text x="450" y="189" fill={C.muted} fontSize="10" textAnchor="middle">millions of tasks on a handful of OS threads</text>

          {/* Event Loop */}
          <text x="755" y="18" fill={C.amber} fontSize="12" fontWeight="700" textAnchor="middle">Event Loop</text>
          <text x="755" y="32" fill={C.muted} fontSize="10" textAnchor="middle">Node.js (libuv) · nginx</text>
          <rect x="700" y="44" width="110" height="60" rx="6" fill={C.amber+"22"} stroke={C.amber} strokeWidth="1.5"/>
          <text x="755" y="64" fill={C.amber} fontSize="11" fontWeight="700" textAnchor="middle">Event Queue</text>
          <text x="755" y="79" fill={C.muted} fontSize="9" textAnchor="middle">cb₁ → cb₂ → cb₃</text>
          <text x="755" y="95" fill={C.muted} fontSize="9" textAnchor="middle">single thread executes all</text>
          <line x1="755" y1="104" x2="755" y2="122" stroke={C.muted} strokeWidth="1.3" markerEnd="url(#sm)"/>
          <rect x="707" y="124" width="96" height="22" rx="4" fill={C.surface} stroke={C.border}/>
          <text x="755" y="139" fill={C.muted} fontSize="9" textAnchor="middle">1 OS Thread / Core</text>
          <rect x="688" y="150" width="134" height="22" rx="4" fill={C.amber+"18"} stroke={C.amber+"66"}/>
          <text x="755" y="165" fill={C.amber} fontSize="9" textAnchor="middle">Thread pool for blocking I/O</text>
          <text x="755" y="186" fill={C.muted} fontSize="10" textAnchor="middle">epoll · kqueue · IOCP — via libuv</text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <SL text="Legend" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {[[C.blue,"Concurrency / structure axis"],[C.green,"Parallelism / simultaneous execution"],[C.amber,"Async / event-driven model"],[C.purple,"Threads / OS primitives"],[C.red,"Blocking / synchronous wait"],[C.cyan,"Additional concurrent task"]].map(([col,label])=>(
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 11, height: 11, borderRadius: 2, background: col+"aa", border: `1px solid ${col}` }}/>
              <span style={{ fontSize: 11, color: C.muted }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab 2 — Core Concepts ─────────────────────────────────────────────────────
function ConceptsTab() {
  const concepts = [
    { term:"Concurrency", color:C.blue,
      attr:"Rob Pike, 'Concurrency is Not Parallelism' (go.dev/blog, 2013); C.A.R. Hoare, CSP (CACM 1978)",
      def:"The composition of independently executing processes — a structural property of program design, not a hardware property. Concurrency is possible on a single core via context-switching or cooperative yielding.",
      why:"Allows a system to manage many in-flight tasks simultaneously (connections, timers, events) without requiring physical parallelism. Enables responsiveness at scale.",
      mistake:"Equating concurrency with parallelism. Rob Pike's canonical framing: concurrency is about structure; parallelism is about execution. A single-threaded event loop handling 10 000 connections is concurrent but not parallel.",
      real:"Node.js manages tens of thousands of concurrent HTTP connections on a single event-loop thread. Go programs routinely sustain hundreds of thousands of goroutines on a handful of OS threads.",
    },
    { term:"Parallelism", color:C.green,
      attr:"Rob Pike (2013); Amdahl's Law — Gene Amdahl (1967); 'Designing Data-Intensive Applications' — Kleppmann (O'Reilly)",
      def:"The simultaneous physical execution of multiple computations on different processor cores. Requires multi-core hardware — a strictly runtime/hardware property, not a code-design property.",
      why:"Reduces wall-clock time for CPU-bound workloads by utilizing all available cores. Rayon (Rust), OpenMP, and Java's ForkJoinPool exist specifically for this.",
      mistake:"Assuming that adding threads creates parallelism. Under CPython's GIL, threads interleave but never run simultaneously. Amdahl's Law caps maximum speedup based on the irreducibly serial fraction of the work.",
      real:"Rayon's parallel iterators power Firefox's style engine. GPU compute (CUDA, wgpu) applies data parallelism across millions of shader invocations simultaneously.",
    },
    { term:"Async / Await", color:C.amber,
      attr:"C# 5.0 (2012); Python PEP 492 (2015); Rust RFC 2394 (2019); JS ES2017; Tokio documentation",
      def:"A syntactic model that suspends execution at an await point, freeing the current thread to handle other work until the OS signals I/O readiness (epoll/kqueue/IOCP), at which point the suspended task resumes.",
      why:"Avoids the thread-per-connection model that fails at scale (C10K problem). One thread can drive thousands of I/O-bound tasks with negligible switching overhead.",
      mistake:"Running CPU-bound work inline in an async function. This stalls the executor — all other async tasks on that thread experience latency spikes. Offload via tokio::spawn_blocking, asyncio.run_in_executor, or a dedicated thread pool.",
      real:"Tokio (Rust) powers Discord's message storage layer. libuv (C) underpins Node.js — both rely on kernel-level I/O readiness notifications to avoid thread-per-connection overhead.",
    },
    { term:"OS Thread", color:C.purple,
      attr:"POSIX pthreads standard; Tanenbaum, 'Modern Operating Systems' (4th ed.); Linux kernel CFS scheduler",
      def:"The smallest unit of CPU scheduling managed and preemptively scheduled by the OS kernel. Each thread has its own stack (1–8 MB by default), register file, and program counter, but shares the process heap.",
      why:"The foundational abstraction for multi-core utilization. All higher-level models — goroutines, async tasks, virtual threads — ultimately multiplex onto OS threads.",
      mistake:"Creating one OS thread per request. At 10 000 concurrent requests: 10 000 × 2 MB stacks ≈ 20 GB RAM, plus constant kernel context-switch overhead (~1–10 μs each). Use a pool or async model.",
      real:"Java's Virtual Threads (Project Loom, JDK 21 — JEP 444) mount lightweight virtual threads onto a small OS carrier-thread pool, applying the same M:N insight Go introduced in 2009.",
    },
    { term:"Green Threads / Goroutines", color:C.cyan,
      attr:"Go specification; 'The Go Programming Language' — Donovan & Kernighan; original: Sun Microsystems JVM (Java 1.0)",
      def:"User-space threads managed by a language runtime rather than the OS. Go goroutines start at ~2 KB of stack and are multiplexed onto a configurable pool of OS threads (GOMAXPROCS) by the Go scheduler using work-stealing.",
      why:"Starting a goroutine is roughly 1 000× cheaper than an OS thread. A Go program can sustain millions of goroutines without exhausting RAM, enabling massive I/O concurrency.",
      mistake:"Confusing goroutines with coroutines. Goroutines can run truly in parallel across multiple OS threads. Python asyncio coroutines are cooperative and strictly single-threaded. Rust async tasks are stackless state machines, not green threads.",
      real:"Go's runtime scheduler uses work-stealing: each P (logical processor) maintains a local run queue; idle Ps steal from others. Tokio's multi-thread scheduler applies an identical algorithm.",
    },
    { term:"Context Switch", color:C.red,
      attr:"Linux kernel source; Tanenbaum 'Modern Operating Systems'; CFS scheduler documentation",
      def:"The kernel's act of saving a running thread's CPU state (registers, stack pointer, program counter) and restoring another's, enabling time-sharing of a single core among multiple threads.",
      why:"The mechanism that makes concurrent execution possible on a single core, but each switch costs ~1–10 μs in kernel overhead plus TLB and L1-cache invalidation.",
      mistake:"Underestimating context-switch cost at scale. With 10 000+ OS threads, the kernel may spend more CPU time switching than executing user code. Async event loops eliminate this: threads never yield to the OS while waiting on I/O.",
      real:"Linux's CFS targets a default 6 ms scheduling latency period. On a server with 1 000 threads, each gets ~6 μs of CPU per scheduling epoch before being preempted.",
    },
    { term:"Event Loop", color:C.amber,
      attr:"libuv design overview (docs.libuv.org); Node.js internals documentation; nginx architecture",
      def:"A single-threaded execution model: poll OS I/O readiness (epoll/kqueue/IOCP), run all ready callbacks to completion, then poll again. Network I/O runs on the loop thread; file I/O uses a background thread pool since POSIX lacks async file primitives.",
      why:"Avoids OS thread overhead while handling massive I/O concurrency. Nginx serves millions of connections with worker processes each running a single event loop.",
      mistake:"Blocking the event-loop thread with synchronous CPU work. Any operation taking >~10 ms (image resizing, large regex, JSON parsing of huge payloads) prevents all other callbacks from running during that interval.",
      real:"libuv maintains a default thread pool of size 4 (UV_THREADPOOL_SIZE) for blocking file I/O. On Linux it uses epoll; on macOS/BSD, kqueue; on Windows, IOCP — abstracted uniformly across platforms.",
    },
  ];

  return (
    <div>
      <p style={{ color: C.muted, lineHeight: 1.75, marginBottom: 24 }}>
        Definitions below match their authoritative sources. The most common failure in system design discussions is conflating these concepts — especially concurrency vs. parallelism, and async vs. multithreading.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {concepts.map(({ term, attr, color, def, why, mistake, real }) => (
          <div key={term} style={{ background: C.surface, border: `1px solid ${color}44`, borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 3, height: 44, background: color, borderRadius: 2, flexShrink: 0, marginTop: 2 }}/>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color }}>{term}</div>
                <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>as defined by: {attr}</div>
              </div>
            </div>
            <p style={{ color: C.text, fontSize: 13.5, lineHeight: 1.75, margin: "0 0 14px 0" }}>{def}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[["Why it matters",C.green,why],["Common mistake",C.red,mistake],["Real-world",C.amber,real]].map(([label,col,body])=>(
                <div key={label} style={{ background: "#161b22", borderRadius: 6, padding: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: col, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.65 }}>{body}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, marginTop: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 16 }}>When to Use Which Model</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr>{["Workload","Recommended model","Rationale","Avoid"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"8px 12px", borderBottom:`1px solid ${C.border}`, color:C.muted, fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.04em" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {[
                ["High-concurrency I/O (web server, proxy, gateway)",<Badge color={C.green} label="Async + green threads"/>,"Thousands of connections mostly waiting. No thread-per-conn overhead.","One OS thread per request — OOM at ≥10k connections"],
                ["CPU-bound computation (encoding, ML inference)",<Badge color={C.blue} label="Parallelism — thread pool / rayon"/>,"Work must physically execute simultaneously on multiple cores. Amdahl's Law limits gains.","Async (blocks executor); single-threaded loop (no speedup)"],
                ["Mixed I/O + CPU (read → transcode → upload)",<Badge color={C.cyan} label="Async + spawn_blocking hybrid"/>,"Keep async runtime responsive; offload CPU-heavy steps to thread pool.","Blocking CPU work directly inside async function"],
                ["Background jobs / data pipelines",<Badge color={C.amber} label="Thread pool + multiprocessing"/>,"Python: multiprocessing bypasses GIL. Rust: rayon iterators. Go: goroutine fan-out.","Python threads (GIL), serial iteration over large datasets"],
                ["Hard real-time / low-latency audio/video",<Badge color={C.purple} label="Pinned OS threads + lock-free"/>,"Avoid GC pauses, runtime jitter. Predictable preemption windows.","Async runtimes (scheduler jitter); GC languages without tuning"],
              ].map(([w,m,r,a],i)=>(
                <tr key={i} style={{ background: i%2===0?"transparent":C.bg+"55" }}>
                  <td style={{ padding:"10px 12px", color:C.text, borderBottom:`1px solid ${C.border}33` }}>{w}</td>
                  <td style={{ padding:"10px 12px", borderBottom:`1px solid ${C.border}33` }}>{m}</td>
                  <td style={{ padding:"10px 12px", color:C.muted, borderBottom:`1px solid ${C.border}33`, fontSize:12 }}>{r}</td>
                  <td style={{ padding:"10px 12px", color:C.red, borderBottom:`1px solid ${C.border}33`, fontSize:11.5 }}>{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab 3 — Implementations ───────────────────────────────────────────────────
const CODES = {
go: `// Pattern: Bounded Async Worker Pool
// Reference: "Concurrency in Go" — Katherine Cox-Buday (O'Reilly, 2017)
// Production note: Always thread context.Context; cancel on shutdown to drain goroutines cleanly.

package main

import (
    "context"
    "errors"
    "fmt"
    "sync"
    "time"
)

type Job[T any] struct {
    ID      int
    Payload T
}

type Result[R any] struct {
    JobID int
    Value R
    Err   error
}

type Pool[T, R any] struct {
    workers  int
    jobCh    chan Job[T]
    resultCh chan Result[R]
    process  func(ctx context.Context, j Job[T]) (R, error)
    wg       sync.WaitGroup
}

func NewPool[T, R any](workers, buf int, fn func(context.Context, Job[T]) (R, error)) *Pool[T, R] {
    return &Pool[T, R]{
        workers:  workers,
        jobCh:    make(chan Job[T], buf),
        resultCh: make(chan Result[R], buf),
        process:  fn,
    }
}

// Start launches all worker goroutines. Each exits when jobCh is closed or ctx is cancelled.
func (p *Pool[T, R]) Start(ctx context.Context) {
    for i := 0; i < p.workers; i++ {
        p.wg.Add(1)
        go func() {
            defer p.wg.Done()
            for {
                select {
                case job, ok := <-p.jobCh:
                    if !ok {
                        return // channel closed — all jobs consumed
                    }
                    val, err := p.process(ctx, job)
                    p.resultCh <- Result[R]{JobID: job.ID, Value: val, Err: err}
                case <-ctx.Done():
                    return
                }
            }
        }()
    }
    go func() {
        p.wg.Wait()
        close(p.resultCh)
    }()
}

var ErrPoolFull = errors.New("pool: job buffer full")

// Submit enqueues a job without blocking. Returns ErrPoolFull if buffer is saturated.
func (p *Pool[T, R]) Submit(j Job[T]) error {
    select {
    case p.jobCh <- j:
        return nil
    default:
        return ErrPoolFull
    }
}

// Drain closes the job channel and returns the result channel to range over.
func (p *Pool[T, R]) Drain() <-chan Result[R] {
    close(p.jobCh)
    return p.resultCh
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    pool := NewPool[int, int](4, 32, func(ctx context.Context, j Job[int]) (int, error) {
        select {
        case <-time.After(20 * time.Millisecond): // simulate I/O
        case <-ctx.Done():
            return 0, ctx.Err()
        }
        return j.Payload * j.Payload, nil
    })
    pool.Start(ctx)

    for i := 1; i <= 12; i++ {
        if err := pool.Submit(Job[int]{ID: i, Payload: i}); err != nil {
            fmt.Printf("submit %d: %v\\n", i, err)
        }
    }

    for res := range pool.Drain() {
        if res.Err != nil {
            fmt.Printf("job %d error: %v\\n", res.JobID, res.Err)
            continue
        }
        fmt.Printf("job %d → %d\\n", res.JobID, res.Value)
    }
}`,

python: `# Pattern: Bounded Async Worker Pool — Structured Concurrency
# Reference: PEP 492 (async/await); Python 3.11 asyncio docs; "Fluent Python" — Ramalho (O'Reilly)
# Production note: TaskGroup (3.11+) cancels all sibling tasks on first unhandled exception.
#                  CPU-bound work must be offloaded via loop.run_in_executor — never inline in async.

from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass, field
from typing import Callable, Generic, TypeVar

T = TypeVar("T")
R = TypeVar("R")


@dataclass(frozen=True)
class Job(Generic[T]):
    id:      int
    payload: T


@dataclass
class JobResult(Generic[R]):
    job_id: int
    value:  R | None         = None
    error:  Exception | None = None

    @property
    def ok(self) -> bool:
        return self.error is None


@dataclass
class WorkerPool(Generic[T, R]):
    """Bounded concurrency via asyncio.Semaphore. Accepts sync or async processor functions."""
    max_concurrency: int
    process:         Callable[[Job[T]], R]
    _sem:            asyncio.Semaphore = field(init=False, repr=False)

    def __post_init__(self) -> None:
        self._sem = asyncio.Semaphore(self.max_concurrency)

    async def _run_one(self, job: Job[T]) -> JobResult[R]:
        async with self._sem:
            try:
                if asyncio.iscoroutinefunction(self.process):
                    value = await self.process(job)                          # type: ignore[arg-type]
                else:
                    loop  = asyncio.get_running_loop()
                    value = await loop.run_in_executor(None, self.process, job)
                return JobResult(job_id=job.id, value=value)
            except Exception as exc:
                return JobResult(job_id=job.id, error=exc)

    async def run_all(self, jobs: list[Job[T]]) -> list[JobResult[R]]:
        """Run all jobs with bounded concurrency. Cancels all on first unhandled exception."""
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(self._run_one(job)) for job in jobs]
        return [t.result() for t in tasks]


async def fetch_user(job: Job[int]) -> dict[str, object]:
    """Simulates an async I/O call (DB / HTTP)."""
    await asyncio.sleep(0.02)
    return {"id": job.payload, "name": f"user_{job.payload}"}


async def main() -> None:
    jobs: list[Job[int]] = [Job(id=i, payload=i * 10) for i in range(1, 16)]
    pool: WorkerPool[int, dict[str, object]] = WorkerPool(
        max_concurrency=5,
        process=fetch_user,
    )

    t0 = time.perf_counter()
    results = await pool.run_all(jobs)
    elapsed = time.perf_counter() - t0

    ok_results  = [r for r in results if r.ok]
    err_results = [r for r in results if not r.ok]
    print(f"Completed {len(ok_results)}/{len(jobs)} in {elapsed:.3f}s  failures={len(err_results)}")
    for r in ok_results[:4]:
        print(f"  job {r.job_id} → {r.value}")


asyncio.run(main())`,

typescript: `// Pattern: Bounded Async Worker Pool
// Reference: MDN Promise docs; TypeScript 5.0 strict mode; fp-ts Result pattern
// Production note: Never use Promise.all with unbounded arrays in prod — use a semaphore.
//                  Discriminated union Result<T,E> avoids throw-based error propagation.

// ── Types ─────────────────────────────────────────────────────────────────────

type Ok<T>  = { readonly ok: true;  readonly value: T };
type Err<E> = { readonly ok: false; readonly error: E };
type Result<T, E> = Ok<T> | Err<E>;

const ok  = <T>(value: T): Ok<T>  => ({ ok: true,  value });
const err = <E>(e: E):    Err<E>  => ({ ok: false, error: e });

interface Job<T> {
  readonly id:      number;
  readonly payload: T;
}

interface JobResult<T, R> {
  readonly jobId:  number;
  readonly result: Result<R, Error>;
}

// ── Semaphore — bounded concurrency without a dedicated library ───────────────

class Semaphore {
  private queue:  Array<() => void> = [];
  private active = 0;

  constructor(private readonly limit: number) {}

  async acquire(): Promise<void> {
    if (this.active < this.limit) { this.active++; return; }
    await new Promise<void>(resolve => this.queue.push(resolve));
    this.active++;
  }

  release(): void {
    this.active--;
    this.queue.shift()?.();
  }
}

// ── Worker pool ───────────────────────────────────────────────────────────────

type Processor<T, R> = (job: Job<T>) => Promise<R>;

async function runPool<T, R>(
  jobs:    readonly Job<T>[],
  process: Processor<T, R>,
  maxConc: number,
): Promise<JobResult<T, R>[]> {
  const sem = new Semaphore(maxConc);

  const tasks = jobs.map(async (job): Promise<JobResult<T, R>> => {
    await sem.acquire();
    try {
      const value = await process(job);
      return { jobId: job.id, result: ok(value) };
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      return { jobId: job.id, result: err(error) };
    } finally {
      sem.release();
    }
  });

  // Promise.allSettled never rejects — all errors are captured in Result wrappers.
  const settled = await Promise.allSettled(tasks);
  return settled
    .filter((s): s is PromiseFulfilledResult<JobResult<T, R>> => s.status === "fulfilled")
    .map(s => s.value);
}

// ── Usage ─────────────────────────────────────────────────────────────────────

interface User { id: number; name: string; }

async function fetchUser(job: Job<number>): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 20)); // 20 ms I/O simulation
  if (job.payload === 7) throw new Error("user 7 not found");
  return { id: job.payload, name: \`user_\${job.payload}\` };
}

(async () => {
  const jobs: Job<number>[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1, payload: i + 1,
  }));

  const t0 = performance.now();
  const results = await runPool(jobs, fetchUser, /* maxConcurrency */ 4);
  const elapsed = (performance.now() - t0).toFixed(0);

  console.log(\`Completed \${results.length} jobs in \${elapsed}ms\`);

  for (const r of results.sort((a, b) => a.jobId - b.jobId)) {
    if (r.result.ok) {
      console.log(\`  job \${r.jobId} → \${JSON.stringify(r.result.value)}\`);
    } else {
      console.error(\`  job \${r.jobId} ✗ \${r.result.error.message}\`);
    }
  }
})();`,

rust: `// Pattern: Bounded Async Worker Pool — Tokio + JoinSet
// Reference: Tokio docs (docs.rs/tokio); "Programming Rust" — Blandy & Orendorff (O'Reilly)
// Production note: spawn_blocking is mandatory for CPU-bound work in async context —
//                  blocking inside .await starves all other tasks on that executor thread.

use std::sync::Arc;
use thiserror::Error;
use tokio::{sync::Semaphore, task::JoinSet};

#[derive(Debug, Clone)]
pub struct Job<T> {
    pub id:      usize,
    pub payload: T,
}

#[derive(Debug)]
pub struct JobResult<R> {
    pub job_id: usize,
    pub value:  Result<R, WorkerError>,
}

#[derive(Debug, Error)]
pub enum WorkerError {
    #[error("job {0} processing failed: {1}")]
    Processing(usize, String),
    #[error("task panicked")]
    Panic,
}

pub struct WorkerPool {
    semaphore: Arc<Semaphore>,
}

impl WorkerPool {
    pub fn new(max_concurrency: usize) -> Self {
        Self { semaphore: Arc::new(Semaphore::new(max_concurrency)) }
    }

    /// Runs all jobs concurrently, bounded by the semaphore. Results arrive in completion order.
    pub async fn run_all<T, R, F, Fut>(
        &self,
        jobs:    Vec<Job<T>>,
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
            let sem = Arc::clone(&self.semaphore);
            let f   = process.clone();
            let id  = job.id;

            set.spawn(async move {
                // Permit released automatically when dropped at task completion.
                let _permit = sem.acquire_owned().await.expect("semaphore closed");
                let value   = f(job).await;
                JobResult { job_id: id, value }
            });
        }

        let mut results = Vec::new();
        while let Some(outcome) = set.join_next().await {
            match outcome {
                Ok(r)  => results.push(r),
                Err(_) => results.push(JobResult { job_id: 0, value: Err(WorkerError::Panic) }),
            }
        }
        results
    }
}

#[tokio::main]
async fn main() {
    let pool = WorkerPool::new(4);
    let jobs: Vec<Job<u64>> = (1..=12).map(|i| Job { id: i, payload: i as u64 }).collect();

    let mut results = pool
        .run_all(jobs, |job| async move {
            tokio::time::sleep(tokio::time::Duration::from_millis(20)).await;
            // CPU-bound step offloaded to blocking thread pool — never block inside async directly.
            let squared = tokio::task::spawn_blocking(move || job.payload * job.payload)
                .await
                .map_err(|e| WorkerError::Processing(job.id, e.to_string()))?;
            Ok::<u64, WorkerError>(squared)
        })
        .await;

    results.sort_by_key(|r| r.job_id);
    for r in &results {
        match &r.value {
            Ok(v)  => println!("job {} → {}", r.job_id, v),
            Err(e) => eprintln!("job {} error: {}", r.job_id, e),
        }
    }
}`,

java: `// Pattern: Bounded Async Worker Pool — Virtual Threads + Structured Concurrency
// Reference: JEP 444 (Virtual Threads, JDK 21); JEP 453 (Structured Concurrency, JDK 21 preview)
// Production note: Virtual threads unmount from their OS carrier thread during blocking I/O —
//                  no OS thread is held idle while the virtual thread waits on a DB or HTTP call.

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.*;

public class WorkerPoolDemo {

    record Job<T>(int id, T payload) {}

    sealed interface JobResult<R>
        permits JobResult.Success, JobResult.Failure {
        record Success<R>(int jobId, R value)         implements JobResult<R> {}
        record Failure<R>(int jobId, Throwable cause) implements JobResult<R> {}
    }

    @FunctionalInterface
    interface Processor<T, R> {
        R process(Job<T> job) throws Exception;
    }

    static <T, R> List<JobResult<R>> runAll(
        List<Job<T>> jobs,
        Processor<T, R> processor,
        int maxConcurrency
    ) throws InterruptedException {

        var sem = new Semaphore(maxConcurrency);

        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            List<StructuredTaskScope.Subtask<JobResult<R>>> subtasks =
                jobs.stream()
                    .map(job -> scope.fork(() -> {
                        sem.acquire();
                        try {
                            R value = processor.process(job);
                            return (JobResult<R>) new JobResult.Success<>(job.id(), value);
                        } catch (Exception e) {
                            return new JobResult.Failure<>(job.id(), e);
                        } finally {
                            sem.release();
                        }
                    }))
                    .toList();

            scope.join().throwIfFailed();

            return subtasks.stream()
                .map(StructuredTaskScope.Subtask::get)
                .filter(Objects::nonNull)
                .toList();
        }
    }

    public static void main(String[] args) throws Exception {
        var jobs = List.of(
            new Job<>(1, "https://api.example.com/users/1"),
            new Job<>(2, "https://api.example.com/users/2"),
            new Job<>(3, "https://api.example.com/users/3"),
            new Job<>(4, "https://api.example.com/orders/99"),
            new Job<>(5, "https://api.example.com/orders/100")
        );

        // Virtual-thread executor — each task runs on its own virtual thread.
        // Thread.sleep here simulates a blocking I/O call (JDBC, HTTP).
        // The virtual thread unmounts from its OS carrier — no OS thread wasted while sleeping.
        try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
            exec.submit(() -> {
                try {
                    List<JobResult<String>> results = runAll(
                        jobs,
                        job -> {
                            Thread.sleep(20);
                            return "response_for_" + job.payload();
                        },
                        3
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
                                System.err.printf("job %d ✗ %s%n", f.jobId(), f.cause().getMessage());
                        });
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }).get();
        }
    }
}`,
};

function ImplTab() {
  const [lang, setLang] = useState("go");
  const langs = [
    { id:"go",         label:"Go 1.21+"    },
    { id:"python",     label:"Python 3.11+"},
    { id:"typescript", label:"TypeScript 5"},
    { id:"rust",       label:"Rust stable" },
    { id:"java",       label:"Java 21"     },
  ];
  const filenames = {
    go:         "implementations/core/worker_pool.go",
    python:     "implementations/core/worker_pool.py",
    typescript: "implementations/core/workerPool.ts",
    rust:       "implementations/core/worker_pool.rs",
    java:       "implementations/core/WorkerPoolDemo.java",
  };
  const notes = {
    go:         ["Goroutines + channels","Generic pool (Go 1.21 type params). Context propagated to every goroutine. sync.WaitGroup drain. ErrPoolFull back-pressure."],
    python:     ["asyncio.TaskGroup","Structured concurrency (3.11+) cancels all siblings on first exception. run_in_executor offloads sync/CPU work off the event loop."],
    typescript: ["Promise + Semaphore","Discriminated-union Result<T,E> — no throw. Promise.allSettled captures all errors. Custom Semaphore for bounded concurrency."],
    rust:       ["Tokio JoinSet","Arc<Semaphore> for bounded concurrency. spawn_blocking for CPU work. JoinSet collects results as they complete."],
    java:       ["Virtual Threads + Loom","JEP 444 virtual threads unmount from OS carrier on I/O block. ShutdownOnFailure cancels siblings on first failure."],
  };

  return (
    <div>
      <p style={{ color: C.muted, lineHeight: 1.75, marginBottom: 20 }}>
        Pure language implementations — no cloud dependencies. Topic classification: OS internals / concurrency algorithm → <strong style={{ color: C.blue }}>core implementations only</strong> (no cloud tabs per the decision guide). Each demonstrates the bounded async worker pool: the pattern that simultaneously exercises concurrency, back-pressure, error isolation, and CPU offload.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 22 }}>
        {langs.map(({ id, label }) => {
          const [tag, note] = notes[id];
          const active = lang === id;
          return (
            <div key={id} onClick={() => setLang(id)} style={{
              background: active ? C.blue+"1a" : C.surface,
              border: `1px solid ${active ? C.blue : C.border}`,
              borderRadius: 8, padding: "12px 10px", cursor: "pointer", transition: "all .15s",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: active ? C.blue : C.text, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{tag}</div>
              <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.5 }}>{note}</div>
            </div>
          );
        })}
      </div>

      <CodeBlock code={CODES[lang]} filename={filenames[lang]} />

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>Patterns Demonstrated Across All Implementations</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            [C.blue,  "Back-pressure",   "Semaphore or channel buffer prevents unbounded goroutine/task creation under load."],
            [C.green, "Error isolation",  "One job failure does not cancel others (except Java's ShutdownOnFailure, which is deliberate)."],
            [C.amber, "Cancellation",     "context.Context (Go), TaskGroup cancel (Python), AbortSignal (TS), JoinSet abort (Rust), Thread.interrupt (Java)."],
            [C.purple,"Drain / cleanup",  "All pools wait for in-flight jobs before exiting — avoids goroutine and task leaks."],
            [C.cyan,  "CPU offload",      "Heavy computation deferred to thread pool (run_in_executor, spawn_blocking) — never inline in async."],
            [C.red,   "Result ordering",  "Results arrive in completion order. Sort by ID if submission order is required."],
          ].map(([col,title,desc])=>(
            <div key={title} style={{ background:"#161b22", borderRadius:6, padding:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:col, marginBottom:4 }}>{title}</div>
              <div style={{ fontSize:11.5, color:C.muted, lineHeight:1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab 4 — Leadership ────────────────────────────────────────────────────────
function LeadershipTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div style={{ background: C.surface, border: `1px solid ${C.blue}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.blue, marginBottom: 12 }}>🗣 Explain to Your Team (Standup / RFC Intro)</div>
        <div style={{ background: "#161b22", borderRadius: 8, padding: 16, fontSize: 13.5, color: C.text, lineHeight: 1.8, fontStyle: "italic" }}>
          "Concurrency is how we <em>design</em> a program to juggle many tasks — like a chef managing ten dishes by switching attention between them. Parallelism is when two chefs physically cook simultaneously on separate burners. Async is the chef putting a pot on to boil and walking away to prep vegetables instead of staring at it. Threads are the actual chefs. We're switching to async I/O here because our bottleneck is waiting on database responses, not CPU — adding more OS threads won't help, we need to stop blocking the ones we have."
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.green}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.green, marginBottom: 14 }}>📋 Justify in Architecture Review</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { d:"Choose async over thread-per-request", r:"Thread-per-request breaks at ~10 000 concurrent connections (C10K). Each OS thread consumes 1–8 MB of stack plus ~1–10 μs per context switch. Async tasks are sub-KB and yield cooperatively with no kernel involvement. libuv (Node.js) and Tokio (Rust) both demonstrate this at production scale." },
            { d:"Choose Go goroutines over OS threads for service concurrency", r:"Goroutines start at ~2 KB vs 1–8 MB for OS threads. Go's runtime scheduler (GOMAXPROCS) multiplexes M goroutines onto N OS threads with work-stealing. A single service can sustain millions of in-flight goroutines without exhausting RAM." },
            { d:"Choose Java Virtual Threads (Loom) over reactive frameworks for new JVM services", r:"Reactive (WebFlux, RxJava) imposes callback-style code throughout the entire call stack. Virtual threads (JEP 444, JDK 21) block on I/O without holding an OS carrier thread — identical concurrency benefit with synchronous-looking code. Spring Boot 3.2+ enables Virtual Threads transparently." },
            { d:"Choose Tokio over std::thread for Rust network services", r:"std::thread is 1:1 OS threads — appropriate for CPU-bound parallelism. Tokio's multi-thread scheduler runs one OS thread per core with work-stealing, delivering M:N task scheduling. Discord attributed significant latency improvements to their Rust/Tokio migration (Discord Engineering Blog)." },
          ].map(({ d, r }) => (
            <div key={d} style={{ background: "#161b22", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.green, marginBottom: 5 }}>{d}</div>
              <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.72 }}>{r}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.red}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.red, marginBottom: 14 }}>🚨 Failure Modes & Observability</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>{["Failure","Symptom","Root Cause","Alert / Detection"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"8px 12px", borderBottom:`1px solid ${C.border}`, color:C.muted, fontWeight:600, fontSize:10.5, textTransform:"uppercase", letterSpacing:"0.04em" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {[
                ["Goroutine / task leak","Memory grows indefinitely; goroutine count climbs without bound","Goroutines spawned but never given a stop signal or context cancellation","Alert on goroutine count > threshold; pprof goroutine dump; runtime.NumGoroutine() metric"],
                ["Event loop starvation","P99 latency spikes; health checks time out; async tasks queue deeply","CPU-bound work running synchronously on the async executor thread","tokio_task_poll_duration metric; Node.js event loop lag > 50 ms alert"],
                ["Thread pool exhaustion","Requests queue up; connection timeouts; all threads in BLOCKED state","Pool threads blocked on slow I/O with no timeout configured","Monitor active_threads == pool_size for >5s; queue depth metric"],
                ["Race condition","Intermittent wrong results; occasional panics or memory corruption","Shared mutable state accessed without synchronization","go test -race; Rust prevents at compile time; ThreadSanitizer for C/C++"],
                ["Deadlock","All goroutines/threads permanently blocked; service unresponsive","Circular mutex acquisition; async Mutex held across await; send on full channel","goroutine dump shows all in 'chan receive'; pprof block profile"],
                ["Context switch thrashing","High kernel CPU%; low application throughput; elevated iowait","Too many OS threads competing for cores; scheduler overhead dominates","context_switches/sec; kernel% vs user% ratio; reduce OS thread count"],
              ].map(([f,s,r,a],i)=>(
                <tr key={i} style={{ background: i%2===0?"transparent":C.bg+"55" }}>
                  <td style={{ padding:"10px 12px", color:C.red, fontWeight:600, borderBottom:`1px solid ${C.border}33`, fontSize:11.5 }}>{f}</td>
                  <td style={{ padding:"10px 12px", color:C.text, borderBottom:`1px solid ${C.border}33`, fontSize:11.5 }}>{s}</td>
                  <td style={{ padding:"10px 12px", color:C.muted, borderBottom:`1px solid ${C.border}33`, fontSize:11.5 }}>{r}</td>
                  <td style={{ padding:"10px 12px", color:C.amber, borderBottom:`1px solid ${C.border}33`, fontSize:11.5 }}>{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.amber}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.amber, marginBottom: 14 }}>📈 Scale Implications</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            ["10x traffic", C.green, "Async I/O scales well — same thread count handles 10x more concurrent I/O-bound requests. Thread/goroutine pool sizing needs modest adjustment (+25%). Monitor goroutine count and queue depth."],
            ["100x traffic", C.amber, "Vertical scaling hits OS thread limits (~10 000 threads). Consider connection pooling, read replicas, and queue-based async offloading. Goroutine count may legitimately reach millions — watch GC pressure."],
            ["When to revisit", C.red, "If >50% of goroutines/tasks are CPU-bound → switch to explicit parallelism (pool_size = GOMAXPROCS). If P99 degrades but P50 is stable → lock contention. If memory grows with concurrency → goroutine leak."],
          ].map(([title,col,desc])=>(
            <div key={title} style={{ background:"#161b22", borderRadius:8, padding:14 }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:col, marginBottom:6 }}>{title}</div>
              <div style={{ fontSize:12.5, color:C.muted, lineHeight:1.72 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.purple}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, marginBottom: 14 }}>✅ Code Review Checklist</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            "Every goroutine / task has a defined exit condition — context cancellation, channel close, or explicit return",
            "No goroutines spawned inside a loop without a mechanism to bound the total count",
            "context.Context passed as the first parameter to every async entry point",
            "No sync Mutex held across an await point — causes deadlock or priority inversion",
            "CPU-heavy work offloaded via spawn_blocking or run_in_executor — never inline in async function",
            "Errors from every goroutine or task are collected — no silent discard into _",
            "Shared state protected by Mutex, RWMutex, or atomic — not by naming convention alone",
            "Thread / worker count is configurable, not hard-coded to a magic number",
            "Timeouts set on every I/O operation — no unbounded context.Background() for external calls",
            "Tests include concurrent execution: go test -race; -count=100 -parallel=10",
          ].map((item,i)=>(
            <div key={i} style={{ display:"flex", gap:10, background:"#161b22", borderRadius:6, padding:10 }}>
              <div style={{ color:C.purple, fontWeight:700, fontSize:13, flexShrink:0 }}>□</div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.65 }}>{item}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.cyan}44`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.cyan, marginBottom: 14 }}>❓ Questions for Design Review</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["Workload classification",     "Is the bottleneck I/O-bound or CPU-bound? Async helps I/O; parallelism helps CPU. Using async for CPU-bound work actively hurts — it starves the event loop."],
            ["Concurrency model selection", "Why this model over alternatives? Goroutines vs OS threads vs async/await vs virtual threads each has a different cost model and failure mode."],
            ["Back-pressure strategy",      "What happens when producers outpace consumers? Is there a buffer limit? What is the rejection policy — drop, block, or queue with overflow?"],
            ["Cancellation and cleanup",    "How does the system drain in-flight work on shutdown? Can a downstream failure propagate a cancellation upstream through the call graph?"],
            ["Shared-state inventory",      "What state is shared across goroutines/tasks? What synchronization primitive protects it? Is there a lock acquisition order to prevent deadlock?"],
            ["Observability plan",          "How will you detect goroutine leaks in production? What metric signals event-loop starvation? What is the alerting threshold for thread pool exhaustion?"],
            ["GIL / runtime constraints",   "If using Python, does the GIL limit CPU-bound parallelism? Would multiprocessing, Cython, or a compiled extension be more appropriate?"],
          ].map(([cat,q])=>(
            <div key={cat} style={{ background:"#161b22", borderRadius:8, padding:14, display:"flex", gap:14 }}>
              <div style={{ color:C.cyan, fontWeight:700, fontSize:12, flexShrink:0, minWidth:158, paddingTop:1 }}>{cat}</div>
              <div style={{ fontSize:12.5, color:C.muted, lineHeight:1.72 }}>{q}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function AsyncConcurrency() {
  const [tab, setTab] = useState(0);
  const tabs = [
    { label:"Architecture",    icon:"⬡" },
    { label:"Core Concepts",   icon:"◈" },
    { label:"Implementations", icon:"</>" },
    { label:"Leadership",      icon:"◎" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'IBM Plex Sans','Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "20px 32px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>
              Async · Concurrency · Parallelism · Threads
            </h1>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge color={C.blue}   label="Rob Pike / CSP" />
              <Badge color={C.amber}  label="Tokio / libuv" />
              <Badge color={C.purple} label="JDK 21 Loom" />
              <Badge color={C.green}  label="Go runtime" />
            </div>
          </div>
          <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 13 }}>
            Authoritative definitions · Execution models · Go / Python / TypeScript / Rust / Java 21 · Tech lead reference
          </p>
          <div style={{ display: "flex", gap: 2 }}>
            {tabs.map(({ label, icon }, i) => (
              <button key={i} onClick={() => setTab(i)} style={{
                padding: "9px 22px", borderRadius: "6px 6px 0 0",
                fontSize: 13, fontWeight: tab === i ? 600 : 400,
                cursor: "pointer", border: "none",
                background: tab === i ? C.bg : "transparent",
                color: tab === i ? C.text : C.muted,
                borderTop: `2px solid ${tab === i ? C.blue : "transparent"}`,
                transition: "all .15s",
              }}>
                <span style={{ marginRight: 6, opacity: 0.65 }}>{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 48px" }}>
        {tab === 0 && <ArchTab />}
        {tab === 1 && <ConceptsTab />}
        {tab === 2 && <ImplTab />}
        {tab === 3 && <LeadershipTab />}
      </div>
    </div>
  );
}
