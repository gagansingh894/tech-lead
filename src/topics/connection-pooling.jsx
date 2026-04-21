"use client"

import { useState } from "react";

const theme = {
  bg: "#0f1117",
  surface: "#1a1d24",
  surfaceHover: "#1e2129",
  border: "#2d3139",
  text: "#e5e7eb",
  textMuted: "#9ca3af",
  textDim: "#6b7280",
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  red: "#ef4444",
  aws: "#ff9900",
  azure: "#0078d4",
  gcp: "#4285f4",
};

const CopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      style={{
        background: copied ? "#10b98122" : "#2d313944",
        border: `1px solid ${copied ? "#10b981" : "#2d3139"}`,
        color: copied ? "#10b981" : "#9ca3af",
        padding: "3px 10px",
        borderRadius: 4,
        fontSize: 11,
        fontFamily: "monospace",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
};

const CodeBlock = ({ code, language = "go", filename }) => (
  <div style={{ marginBottom: 20 }}>
    {filename && (
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#161b22", borderRadius: "6px 6px 0 0",
        padding: "6px 14px", borderBottom: "1px solid #2d3139",
      }}>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: "#9ca3af" }}>{filename}</span>
        <CopyButton code={code} />
      </div>
    )}
    <pre style={{
      background: "#161b22",
      color: "#e5e7eb",
      padding: "16px",
      borderRadius: filename ? "0 0 6px 6px" : 6,
      overflowX: "auto",
      fontSize: 12,
      lineHeight: 1.65,
      margin: 0,
      border: "1px solid #2d3139",
      borderTop: filename ? "none" : "1px solid #2d3139",
    }}>
      <code>{code}</code>
    </pre>
    {!filename && (
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
        <CopyButton code={code} />
      </div>
    )}
  </div>
);

// ─── TAB 1: ARCHITECTURE ────────────────────────────────────────────────────

const ArchitectureTab = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ color: theme.text, fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
        Connection Pooling — Architecture
      </h2>
      <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.6 }}>
        A pool manager sits between the application layer and the database, maintaining a bounded set of
        pre-authenticated connections. Requests borrow connections, execute, and return — eliminating the
        TCP + TLS + auth handshake on every query.
      </p>
    </div>

    {/* Main Diagram */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 8, padding: 24, marginBottom: 24,
    }}>
      <svg width="100%" viewBox="0 0 820 420" style={{ maxWidth: 820, display: "block", margin: "0 auto" }}>
        {/* Defs */}
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
          </marker>
          <marker id="arr-blue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
          </marker>
          <marker id="arr-green" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
          </marker>
          <marker id="arr-amber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
          </marker>
          <marker id="arr-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
          </marker>
        </defs>

        {/* APPLICATION LAYER */}
        <rect x="10" y="30" width="140" height="360" rx="8" fill="#1e2840" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="80" y="22" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="600">APPLICATION LAYER</text>
        {["Thread 1", "Thread 2", "Thread 3", "Thread 4", "Thread 5"].map((t, i) => (
          <g key={t}>
            <rect x="22" y={48 + i * 66} width="116" height="52" rx="5"
              fill="#1a2035" stroke="#3b82f633" strokeWidth="1" />
            <text x="80" y={77 + i * 66} textAnchor="middle" fill="#93c5fd" fontSize="11">{t}</text>
            <text x="80" y={92 + i * 66} textAnchor="middle" fill="#6b7280" fontSize="9">worker goroutine</text>
          </g>
        ))}

        {/* REQUEST arrows */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1="138" y1={74 + i * 66} x2="200" y2={74 + i * 66}
            stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arr-blue)" strokeDasharray={i > 2 ? "4,3" : ""} />
        ))}

        {/* POOL MANAGER BOX */}
        <rect x="200" y="10" width="200" height="400" rx="8" fill="#1e1e2a" stroke="#8b5cf6" strokeWidth="2" />
        <text x="300" y="28" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="700" letterSpacing="0.5">POOL MANAGER</text>

        {/* Pool slots */}
        {["conn-01 ●", "conn-02 ●", "conn-03 ○", "conn-04 ○", "conn-05 ●"].map((c, i) => {
          const inUse = c.includes("○");
          return (
            <g key={c}>
              <rect x="215" y={42 + i * 62} width="170" height="48" rx="5"
                fill={inUse ? "#1c2620" : "#1e1a2a"}
                stroke={inUse ? "#10b981" : "#8b5cf644"}
                strokeWidth="1.5" />
              <text x="290" y={67 + i * 62} textAnchor="middle"
                fill={inUse ? "#10b981" : "#8b5cf6"} fontSize="11" fontFamily="monospace">
                {c.replace("●", "IN USE").replace("○", "IDLE")}
              </text>
              <text x="290" y={82 + i * 62} textAnchor="middle" fill="#4b5563" fontSize="9">
                {inUse ? "serving query" : "awaiting request"}
              </text>
            </g>
          );
        })}

        {/* Overflow/wait queue */}
        <rect x="215" y="358" width="170" height="38" rx="5"
          fill="#2a1a1a" stroke="#ef444444" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="300" y="378" textAnchor="middle" fill="#ef4444" fontSize="10">
          WAIT QUEUE (if pool exhausted)
        </text>
        <text x="300" y="391" textAnchor="middle" fill="#6b7280" fontSize="9">blocked up to connectionTimeout</text>

        {/* RESPONSE arrows from pool back */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1="200" y1={82 + i * 66} x2="138" y2={84 + i * 66}
            stroke="#10b981" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#arr-green)" />
        ))}

        {/* Pool → DB arrows */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1="400" y1={66 + i * 62} x2="462" y2={66 + i * 62}
            stroke={i % 2 === 0 ? "#8b5cf6" : "#8b5cf655"}
            strokeWidth={i % 2 === 0 ? 1.5 : 1}
            markerEnd="url(#arr)" strokeDasharray={i % 2 !== 0 ? "3,3" : ""} />
        ))}

        {/* DATABASE SERVER */}
        <rect x="462" y="10" width="165" height="400" rx="8" fill="#1a1e1a" stroke="#10b981" strokeWidth="1.5" />
        <text x="544" y="28" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="700" letterSpacing="0.5">DATABASE SERVER</text>

        {[
          { label: "Process 1", sub: "executing query" },
          { label: "Process 2", sub: "idle" },
          { label: "Process 3", sub: "executing query" },
          { label: "Process 4", sub: "idle" },
          { label: "Process 5", sub: "executing query" },
        ].map((p, i) => (
          <g key={p.label}>
            <rect x="476" y={42 + i * 62} width="137" height="48" rx="5"
              fill="#1a221a" stroke="#10b98133" strokeWidth="1" />
            <text x="544" y={67 + i * 62} textAnchor="middle" fill="#6ee7b7" fontSize="11">{p.label}</text>
            <text x="544" y={82 + i * 62} textAnchor="middle" fill="#4b5563" fontSize="9">{p.sub}</text>
          </g>
        ))}

        {/* Disk / Storage */}
        <ellipse cx="544" cy="370" rx="60" ry="20" fill="#1a1e2a" stroke="#8b5cf6" strokeWidth="1.5" />
        <ellipse cx="544" cy="360" rx="60" ry="20" fill="#1a1e2a" stroke="#8b5cf6" strokeWidth="1.5" />
        <text x="544" y="356" textAnchor="middle" fill="#a78bfa" fontSize="10" fontWeight="600">STORAGE</text>
        <text x="544" y="371" textAnchor="middle" fill="#6b7280" fontSize="9">WAL + data files</text>

        {/* Vertical line db processes → storage */}
        <line x1="544" y1="352" x2="544" y2="340" stroke="#8b5cf655" strokeWidth="1" strokeDasharray="3,3" />

        {/* Sidecar: Stats panel */}
        <rect x="652" y="10" width="158" height="400" rx="8" fill="#1e1e1a" stroke="#f59e0b" strokeWidth="1" />
        <text x="731" y="28" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700">POOL METRICS</text>

        {[
          { k: "active", v: "3 / 5", c: "#10b981" },
          { k: "idle", v: "2 / 5", c: "#3b82f6" },
          { k: "wait queue", v: "0", c: "#9ca3af" },
          { k: "acquisitions/s", v: "842", c: "#f59e0b" },
          { k: "avg wait ms", v: "0.8", c: "#f59e0b" },
          { k: "p99 wait ms", v: "4.1", c: "#f59e0b" },
        ].map((m, i) => (
          <g key={m.k}>
            <text x="667" y={58 + i * 54} fill={theme.textDim} fontSize="10">{m.k}</text>
            <text x="797" y={58 + i * 54} textAnchor="end" fill={m.c} fontSize="14" fontWeight="700">{m.v}</text>
            <line x1="667" y1={64 + i * 54} x2="797" y2={64 + i * 54} stroke="#2d3139" strokeWidth="1" />
          </g>
        ))}

        {/* Label: borrow */}
        <text x="169" y="55" textAnchor="middle" fill="#3b82f6" fontSize="9">borrow</text>
        {/* Label: return */}
        <text x="169" y="108" textAnchor="middle" fill="#10b981" fontSize="9">return</text>
        {/* Label: physical conn */}
        <text x="430" y="52" textAnchor="middle" fill="#8b5cf6" fontSize="9">physical</text>
        <text x="430" y="62" textAnchor="middle" fill="#8b5cf6" fontSize="9">conn</text>
      </svg>
    </div>

    {/* Connection Lifecycle */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 8, padding: 20, marginBottom: 20,
    }}>
      <h3 style={{ color: theme.text, fontWeight: 600, fontSize: 14, marginBottom: 14 }}>
        Connection Lifecycle — State Machine
      </h3>
      <svg width="100%" viewBox="0 0 720 90" style={{ maxWidth: 720 }}>
        <defs>
          <marker id="sm-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" fill="#9ca3af" />
          </marker>
        </defs>
        {[
          { label: "INIT", x: 30, color: "#3b82f6" },
          { label: "IDLE", x: 170, color: "#8b5cf6" },
          { label: "IN USE", x: 310, color: "#10b981" },
          { label: "VALIDATE", x: 460, color: "#f59e0b" },
          { label: "EVICTED", x: 600, color: "#ef4444" },
        ].map(s => (
          <g key={s.label}>
            <rect x={s.x} y="28" width="80" height="34" rx="6"
              fill={s.color + "22"} stroke={s.color} strokeWidth="1.5" />
            <text x={s.x + 40} y="50" textAnchor="middle"
              fill={s.color} fontSize="10" fontWeight="600">{s.label}</text>
          </g>
        ))}
        {/* arrows */}
        {[
          { x1: 110, y1: 45, x2: 170, y2: 45, label: "pool start" },
          { x1: 250, y1: 45, x2: 310, y2: 45, label: "acquire()" },
          { x1: 390, y1: 45, x2: 460, y2: 45, label: "keepalive" },
          { x1: 540, y1: 45, x2: 600, y2: 45, label: "invalid / TTL" },
        ].map((a, i) => (
          <g key={i}>
            <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              stroke="#9ca3af" strokeWidth="1.2" markerEnd="url(#sm-arr)" />
            <text x={(a.x1 + a.x2) / 2} y={a.y1 - 5} textAnchor="middle"
              fill="#6b7280" fontSize="8.5">{a.label}</text>
          </g>
        ))}
        {/* return arc */}
        <path d="M 390 62 Q 280 88 250 62" fill="none" stroke="#10b981" strokeWidth="1.2"
          strokeDasharray="3,2" markerEnd="url(#sm-arr)" />
        <text x="320" y="86" textAnchor="middle" fill="#10b981" fontSize="8.5">release()</text>
      </svg>
    </div>

    {/* Pooling Modes */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 8, padding: 20, marginBottom: 20,
    }}>
      <h3 style={{ color: theme.text, fontWeight: 600, fontSize: 14, marginBottom: 14 }}>
        pgBouncer Pooling Modes — Trade-off Spectrum
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          {
            name: "Session Pooling", color: "#3b82f6",
            desc: "One server connection per client session. Released when client disconnects.",
            pros: "Full session semantics (prepared statements, SET vars, advisory locks).",
            cons: "Minimal reuse — effectively just proxying. Little resource saving.",
            use: "Legacy apps that rely on session state.",
          },
          {
            name: "Transaction Pooling", color: "#10b981",
            desc: "Server connection held only for the duration of a transaction block.",
            pros: "High multiplexing — 1000 client connections → ~20 DB connections.",
            cons: "Prepared statements, SET, LISTEN/NOTIFY require workarounds.",
            use: "OLTP workloads, most web apps. Recommended default.",
          },
          {
            name: "Statement Pooling", color: "#f59e0b",
            desc: "Server connection released after each individual statement.",
            pros: "Maximum reuse, lowest DB connection count.",
            cons: "Multi-statement transactions broken — auto-commit only.",
            use: "Read-only analytics, simple SELECT-only workloads.",
          },
        ].map(m => (
          <div key={m.name} style={{
            background: "#0f1117", borderRadius: 6,
            border: `1px solid ${m.color}44`, padding: 14,
          }}>
            <div style={{ color: m.color, fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{m.name}</div>
            <p style={{ color: theme.textMuted, fontSize: 12, lineHeight: 1.55, marginBottom: 8 }}>{m.desc}</p>
            <div style={{ fontSize: 11, color: "#10b981", marginBottom: 4 }}>✓ {m.pros}</div>
            <div style={{ fontSize: 11, color: "#ef4444", marginBottom: 4 }}>✗ {m.cons}</div>
            <div style={{ fontSize: 11, color: "#f59e0b" }}>↗ {m.use}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Cloud Mapping Table */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 8, padding: 20,
    }}>
      <h3 style={{ color: theme.text, fontWeight: 600, fontSize: 14, marginBottom: 14 }}>
        Cloud Provider Mapping
      </h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
              {["Component", "AWS", "Azure", "GCP"].map((h, i) => (
                <th key={h} style={{
                  padding: "8px 12px", textAlign: "left",
                  color: i === 0 ? theme.textMuted : [theme.aws, theme.azure, theme.gcp][i - 1],
                  fontWeight: 600,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                component: "External Pooler",
                aws: "RDS Proxy (manages pgBouncer internally)",
                azure: "Azure Database for PostgreSQL — built-in PgBouncer (transaction mode)",
                gcp: "Cloud SQL Proxy + AlloyDB connection pooling",
              },
              {
                component: "Max Connections Limit",
                aws: "RDS: based on instance class (db.t3.micro ≈ 87)",
                azure: "Flexible Server: based on vCores (2 vCore ≈ 50 max)",
                gcp: "Cloud SQL: configurable; AlloyDB up to 5000 with pooler",
              },
              {
                component: "Pool-per-process (serverless)",
                aws: "RDS Proxy — critical for Lambda; Lambda = no persistent process",
                azure: "Azure Functions → Azure SQL: use SqlClient built-in pooler",
                gcp: "Cloud Run → Cloud SQL: Cloud SQL Auth Proxy sidecar",
              },
              {
                component: "In-process Pooler (app-side)",
                aws: "HikariCP (Java), pgxpool (Go), asyncpg Pool (Python)",
                azure: "Same libraries; ADO.NET has built-in pooler for .NET",
                gcp: "Same libraries; SQLAdmin socket factory for IAM auth",
              },
              {
                component: "Observability",
                aws: "RDS Proxy: CloudWatch metrics (DatabaseConnections, ClientConnections)",
                azure: "Azure Monitor metrics on Flexible Server (active_connections)",
                gcp: "Cloud Monitoring: cloudsql.googleapis.com/database/postgresql/num_backends",
              },
              {
                component: "Connection multiplexing",
                aws: "RDS Proxy: pins only when needed (prepared stmt, temp tables)",
                azure: "PgBouncer transaction mode; session mode for prepared stmts",
                gcp: "AlloyDB Omni: pgBouncer bundled; standard Cloud SQL: none built-in",
              },
            ].map((row, i) => (
              <tr key={i} style={{
                borderBottom: `1px solid ${theme.border}22`,
                background: i % 2 === 0 ? "transparent" : "#ffffff05",
              }}>
                <td style={{ padding: "10px 12px", color: theme.text, fontWeight: 500 }}>{row.component}</td>
                <td style={{ padding: "10px 12px", color: "#ffd599" }}>{row.aws}</td>
                <td style={{ padding: "10px 12px", color: "#93c6f5" }}>{row.azure}</td>
                <td style={{ padding: "10px 12px", color: "#93c6f5" }}>{row.gcp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── TAB 2: CONCEPTS ─────────────────────────────────────────────────────────

const conceptCards = [
  {
    term: "Connection Pool",
    source: "Microsoft ADO.NET docs / CockroachDB Engineering",
    def: "A bounded cache of pre-authenticated database connections managed by a pool manager. Threads borrow connections, execute statements, and return them — avoiding the TCP + TLS + authentication handshake on every query.",
    why: "A new PostgreSQL connection consumes ~1–10 MB of server memory and requires a full OS process fork; at 1000 rps without pooling, you create 1000 processes. With a pool of 20 connections, you serve the same throughput with 20 server processes.",
    mistake: "Setting pool size = thread count. More connections ≠ more throughput. Contention at the database (lock waits, I/O) means 10 connections often outperforms 100 — demonstrated in HikariCP's Oracle Real-world Performance Group benchmark (50x throughput difference).",
    color: "#3b82f6",
  },
  {
    term: "Pool Sizing Formula",
    source: "HikariCP README / Postgres wiki",
    def: "HikariCP's documented formula: connections = (core_count × 2) + effective_spindle_count. For SSDs, effective_spindle_count ≈ 1. A 4-core machine on SSD → pool_size = 9.",
    why: "Threads block on I/O, not CPU. During a blocked I/O wait, a second thread can use the CPU — hence 2× cores. Adding spindle count accounts for rotational disk I/O multiplexing. This formula is a starting point; benchmark your specific workload.",
    mistake: "Approaches vary: HikariCP recommends this formula; PlanetScale and Supabase often recommend starting even lower (5–10) and scaling up empirically. The formula assumes homogeneous queries; OLAP-heavy workloads may benefit from larger pools.",
    color: "#8b5cf6",
  },
  {
    term: "Min / Max Pool Size",
    source: "HikariCP Configuration Reference",
    def: "minimumIdle sets the floor of idle connections maintained; maximumPoolSize sets the ceiling of total (idle + active) connections. HikariCP recommends setting minimumIdle = maximumPoolSize (fixed-size pool) for predictable, spike-resilient performance.",
    why: "Dynamic pools (min < max) shrink during idle periods to save DB resources — but take time to grow when a spike hits. The connection creation lag during spikes can exceed p99 latency SLOs. Fixed-size pools pay idle connection cost in exchange for zero-lag burst handling.",
    mistake: "Setting maximumPoolSize too high to \"be safe\". Each idle connection holds a server process, open socket, and memory on both sides. PostgreSQL's default max_connections is 100 — if 10 app instances each set max=50, you exceed the DB limit immediately.",
    color: "#10b981",
  },
  {
    term: "Connection Acquisition Timeout",
    source: "HikariCP / JDBC DataSource semantics",
    def: "The maximum time a thread will wait for a connection from the pool before receiving an error. In HikariCP, configured via connectionTimeout (default 30s). If all connections are busy for longer than this, the caller gets SQLException.",
    why: "Without a timeout, threads pile up indefinitely behind a slow database, eventually exhausting thread pools and causing full application hang. A tight timeout (200–500ms) surfaces DB saturation immediately as errors rather than cascading latency.",
    mistake: "Setting connectionTimeout too high (> 5s) to avoid errors. This allows unbounded thread accumulation during DB slowdowns. Better: short timeout + circuit breaker + queue depth alert. Fast fail is safer than slow fail.",
    color: "#f59e0b",
  },
  {
    term: "Connection Validation / Keepalive",
    source: "HikariCP connectionTestQuery / keepaliveTime",
    def: "Idle connections can silently become stale — the DB or a NAT firewall closes them while the pool believes they are healthy. Validation (keepaliveTime in HikariCP, default 2 min) pings idle connections to detect and evict dead ones before they are handed to a caller.",
    why: "An application receiving a dead connection from the pool will fail the first query, which it then typically retries — adding latency and error-rate spikes. Keepalive prevents this at the cost of lightweight periodic I/O.",
    mistake: "Using SELECT 1 (connectionTestQuery) on every acquisition. This adds a round-trip before every query. Modern pools (HikariCP ≥ 3.0) use JDBC4 isValid() which validates at the driver level without a network round-trip — use that instead.",
    color: "#ef4444",
  },
  {
    term: "Serverless + Connection Pooling",
    source: "AWS RDS Proxy docs / Prisma Data Guide",
    def: "Serverless functions (Lambda, Cloud Run) are ephemeral — they start cold, hold connections briefly, then terminate. Each invocation opening its own connection bypasses pooling entirely, potentially creating thousands of DB connections under load.",
    why: "AWS Lambda at 1000 concurrent invocations each with one DB connection = 1000 connections to RDS — far exceeding most instance limits. RDS Proxy solves this by maintaining a shared pool on the AWS side; Lambda connects to Proxy, Proxy multiplexes to RDS.",
    mistake: "Embedding a traditional connection pool (HikariCP, pgxpool) inside a Lambda function. The pool is created on cold start, used for milliseconds, and destroyed — providing zero benefit while adding initialization latency. Use an external pooler for serverless.",
    color: "#3b82f6",
  },
  {
    term: "Transaction vs Session Pinning",
    source: "pgBouncer documentation / Supabase Engineering",
    def: "In transaction-mode pooling, a server connection is shared across multiple clients. Pinning occurs when a feature forces a connection to be bound to a specific client for the session duration — defeating pooling. Pinning triggers include: prepared statements, advisory locks, SET LOCAL, LISTEN/NOTIFY.",
    why: "At high concurrency, one pinned connection reduces effective pool capacity and increases wait times for other clients. RDS Proxy tracks pinning and exposes CloudWatch metric DatabaseConnectionsCurrentlySessionPinned — a value > 5% warrants investigation.",
    mistake: "Using ORM-generated prepared statements with pgBouncer in transaction mode. Most ORMs (Hibernate, SQLAlchemy) use prepared statements by default. You must either disable prepared statements at the driver level or switch to session mode (and accept lower multiplexing).",
    color: "#10b981",
  },
];

const ConceptsTab = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ color: theme.text, fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Core Concepts</h2>
      <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.6 }}>
        Seven concepts that separate engineers who configure connection pools from those who understand them.
      </p>
    </div>

    {conceptCards.map(c => (
      <div key={c.term} style={{
        background: theme.surface, border: `1px solid ${c.color}33`,
        borderLeft: `3px solid ${c.color}`,
        borderRadius: 8, padding: 20, marginBottom: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <span style={{ color: c.color, fontWeight: 600, fontSize: 15 }}>{c.term}</span>
          <span style={{ color: theme.textDim, fontSize: 11, fontStyle: "italic" }}>as defined by: {c.source}</span>
        </div>
        <p style={{ color: theme.text, fontSize: 13, lineHeight: 1.65, marginBottom: 10 }}>{c.def}</p>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: theme.textDim, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Why it matters: </span>
          <span style={{ color: theme.textMuted, fontSize: 13 }}>{c.why}</span>
        </div>
        <div>
          <span style={{ color: "#f59e0b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Common mistake: </span>
          <span style={{ color: theme.textMuted, fontSize: 13 }}>{c.mistake}</span>
        </div>
      </div>
    ))}

    {/* Trade-offs */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 8, padding: 20, marginBottom: 16,
    }}>
      <h3 style={{ color: theme.text, fontWeight: 600, fontSize: 15, marginBottom: 16 }}>When to Use / When to Avoid</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ color: "#10b981", fontWeight: 600, fontSize: 13, marginBottom: 10 }}>✓ Use Connection Pooling When</div>
          {[
            "OLTP applications with high query rate (>50 req/s per instance)",
            "Stateless services or microservices with many concurrent threads",
            "Long-running processes (servers, workers) — not scripts",
            "PostgreSQL or MySQL — stateful binary protocol connections are expensive",
            "Multiple app instances hitting the same DB — use external pooler (pgBouncer, RDS Proxy)",
          ].map((i, n) => <div key={n} style={{ color: theme.textMuted, fontSize: 13, marginBottom: 6, paddingLeft: 8, borderLeft: "2px solid #10b98133" }}>→ {i}</div>)}
        </div>
        <div>
          <div style={{ color: "#ef4444", fontWeight: 600, fontSize: 13, marginBottom: 10 }}>✗ Avoid (or be careful) When</div>
          {[
            "Serverless functions (Lambda, Cloud Run): use external pooler instead — HikariCP inside Lambda is counter-productive",
            "HTTP-based databases (DynamoDB, Cosmos DB): stateless protocol, SDK handles connection reuse internally",
            "Low-traffic apps (<10 req/s): connection overhead is negligible; pooling adds complexity for no gain",
            "Long-held transactions: a pooled connection held for 30s blocks other requests — size pool accordingly",
            "After fork() in multi-process apps: fork inherits open connections, causing corruption — acquire connections after fork",
          ].map((i, n) => <div key={n} style={{ color: theme.textMuted, fontSize: 13, marginBottom: 6, paddingLeft: 8, borderLeft: "2px solid #ef444433" }}>→ {i}</div>)}
        </div>
      </div>
    </div>

    {/* Real-world examples */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 8, padding: 20,
    }}>
      <h3 style={{ color: theme.text, fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Real-World Examples</h3>
      {[
        { who: "Shopify", what: "Uses ProxySQL in front of MySQL to multiplex tens of thousands of Rails Unicorn worker connections to a bounded DB connection pool — critical for flash sale traffic spikes." },
        { who: "GitHub", what: "Uses ProxySQL for MySQL routing and connection pooling; GitHub Engineering blog documents connection exhaustion incidents and subsequent pool-tuning decisions." },
        { who: "Supabase", what: "Ships pgBouncer in transaction mode as a first-class feature for every hosted Postgres project — recognizes that Prisma/Drizzle ORMs need external pooling because each query in a serverless context would otherwise open a raw connection." },
        { who: "AWS Lambda + RDS", what: "RDS Proxy is the canonical solution for Lambda → RDS, documented in AWS architecture whitepapers. Without it, 1000 concurrent Lambda invocations can exhaust a db.t3.medium (≈87 max connections) in milliseconds." },
        { who: "Spring Boot (Java ecosystem)", what: "HikariCP is the default connection pool since Spring Boot 2.0, chosen over c3p0 and DBCP2 for its lock-free design and measured sub-microsecond acquisition time." },
      ].map(e => (
        <div key={e.who} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${theme.border}33` }}>
          <span style={{ color: theme.blue, fontWeight: 600, fontSize: 13 }}>{e.who}: </span>
          <span style={{ color: theme.textMuted, fontSize: 13 }}>{e.what}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── TAB 3: IMPLEMENTATIONS ──────────────────────────────────────────────────

const langs = ["Go", "Python", "TypeScript", "Rust", "Java"];

const implCode = {
  Go: `// Pattern: Connection Pool (in-process, using pgxpool)
// Reference: jackc/pgx v5 — https://github.com/jackc/pgx
// Production note: pgxpool is the idiomatic Go PostgreSQL pool; wraps pgx with
//   concurrent-safe acquire/release and automatic health checks.

package pool

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// PoolConfig holds pool sizing parameters.
// Formula (HikariCP / pgx): max_conns = (cores * 2) + effective_spindle_count
// For a 4-core machine on SSD: max_conns = 9
type PoolConfig struct {
	DSN             string
	MaxConns        int32
	MinConns        int32
	MaxConnLifetime time.Duration
	MaxConnIdleTime time.Duration
	HealthCheckPeriod time.Duration
}

// DefaultPoolConfig returns production-safe defaults.
func DefaultPoolConfig(dsn string) PoolConfig {
	return PoolConfig{
		DSN:               dsn,
		MaxConns:          10,
		MinConns:          2, // warm floor — avoids cold-start on traffic spikes
		MaxConnLifetime:   30 * time.Minute, // rotate before server-side idle timeout
		MaxConnIdleTime:   5 * time.Minute,  // evict idle connections
		HealthCheckPeriod: 1 * time.Minute,
	}
}

// DB wraps pgxpool and exposes safe query helpers.
type DB struct {
	pool   *pgxpool.Pool
	logger *slog.Logger
}

// New creates and validates a connection pool.
// It pings the database before returning to surface misconfiguration early.
func New(ctx context.Context, cfg PoolConfig) (*DB, error) {
	config, err := pgxpool.ParseConfig(cfg.DSN)
	if err != nil {
		return nil, fmt.Errorf("parse dsn: %w", err)
	}

	config.MaxConns = cfg.MaxConns
	config.MinConns = cfg.MinConns
	config.MaxConnLifetime = cfg.MaxConnLifetime
	config.MaxConnIdleTime = cfg.MaxConnIdleTime
	config.HealthCheckPeriod = cfg.HealthCheckPeriod

	// BeforeAcquire: reject connections that have exceeded their useful lifetime
	// (e.g., after a DB failover, old connections point to the old primary).
	config.BeforeAcquire = func(ctx context.Context, conn *pgx.Conn) bool {
		return conn.Ping(ctx) == nil
	}

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("create pool: %w", err)
	}

	// Validate the pool can actually connect before returning it.
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("ping database: %w", err)
	}

	return &DB{pool: pool, logger: slog.Default()}, nil
}

// Stats returns current pool metrics — expose via /metrics or structured logs.
func (db *DB) Stats() pgxpool.Stat {
	return *db.pool.Stat()
}

// Acquire borrows a connection for manual control (e.g., COPY, LISTEN).
// Caller MUST call conn.Release() — consider defer.
func (db *DB) Acquire(ctx context.Context) (*pgxpool.Conn, error) {
	conn, err := db.pool.Acquire(ctx)
	if err != nil {
		return nil, fmt.Errorf("acquire connection: %w", err)
	}
	return conn, nil
}

// QueryRow executes a single-row query using a pooled connection.
// The connection is returned to the pool after the row is scanned.
func (db *DB) QueryRow(ctx context.Context, sql string, args ...any) pgx.Row {
	return db.pool.QueryRow(ctx, sql, args...)
}

// WithTx executes fn within a transaction. The connection is held for the
// duration of fn and returned on commit or rollback.
// WARNING: long-running transactions reduce pool availability.
func (db *DB) WithTx(ctx context.Context, fn func(pgx.Tx) error) error {
	conn, err := db.pool.Acquire(ctx)
	if err != nil {
		return fmt.Errorf("acquire for tx: %w", err)
	}
	defer conn.Release()

	tx, err := conn.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}

	if fnErr := fn(tx); fnErr != nil {
		if rbErr := tx.Rollback(ctx); rbErr != nil && !errors.Is(rbErr, pgx.ErrTxClosed) {
			db.logger.Error("rollback failed", "fn_err", fnErr, "rb_err", rbErr)
		}
		return fnErr
	}

	return tx.Commit(ctx)
}

// Close drains the pool gracefully. Call on application shutdown.
func (db *DB) Close() {
	db.pool.Close()
}

// --- Usage Example ---

func ExampleUsage(ctx context.Context) error {
	cfg := DefaultPoolConfig("postgres://user:pass@localhost:5432/mydb?sslmode=require")
	db, err := New(ctx, cfg)
	if err != nil {
		return fmt.Errorf("init db: %w", err)
	}
	defer db.Close()

	// Single row query — pool borrow + release handled internally
	var name string
	err = db.QueryRow(ctx, "SELECT name FROM users WHERE id = $1", 42).Scan(&name)
	if err != nil {
		return fmt.Errorf("query user: %w", err)
	}

	// Transaction — connection pinned for duration
	return db.WithTx(ctx, func(tx pgx.Tx) error {
		_, err := tx.Exec(ctx,
			"UPDATE accounts SET balance = balance - $1 WHERE id = $2", 100, 1)
		if err != nil {
			return err
		}
		_, err = tx.Exec(ctx,
			"UPDATE accounts SET balance = balance + $1 WHERE id = $2", 100, 2)
		return err
	})
}`,

  Python: `# Pattern: Connection Pool (async, using asyncpg)
# Reference: asyncpg 0.29+ — https://magicstack.github.io/asyncpg/
# Production note: asyncpg's Pool is built on asyncio and is the fastest
#   Python PostgreSQL driver; SQLAlchemy 2.0 async core wraps it for ORM use.

from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from typing import AsyncGenerator

import asyncpg
from asyncpg import Pool, Connection

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class PoolConfig:
    """Pool sizing parameters.

    Formula: max_size = (cpu_cores * 2) + 1 for SSD-backed databases.
    For a 4-core application host: max_size = 9.
    """
    dsn: str
    min_size: int = 2       # warm floor to avoid cold-start latency spikes
    max_size: int = 10      # ceiling; must fit within DB's max_connections
    max_inactive_connection_lifetime: float = 300.0  # 5 min idle eviction
    command_timeout: float = 30.0  # per-statement timeout (seconds)
    statement_cache_size: int = 100  # prepared statement cache per connection


class Database:
    """Async PostgreSQL pool wrapper with safe defaults and observability."""

    def __init__(self, config: PoolConfig) -> None:
        self._config = config
        self._pool: Pool | None = None

    async def connect(self) -> None:
        """Initialize the pool and verify connectivity."""
        self._pool = await asyncpg.create_pool(
            dsn=self._config.dsn,
            min_size=self._config.min_size,
            max_size=self._config.max_size,
            max_inactive_connection_lifetime=self._config.max_inactive_connection_lifetime,
            command_timeout=self._config.command_timeout,
            statement_cache_size=self._config.statement_cache_size,
            # init: runs after each new connection is established
            init=_setup_connection,
        )
        # Validate the pool can actually reach the server.
        async with self._pool.acquire() as conn:
            await conn.execute("SELECT 1")
        logger.info(
            "Pool ready",
            extra={"min_size": self._config.min_size, "max_size": self._config.max_size},
        )

    async def close(self) -> None:
        """Drain the pool gracefully. Call on application shutdown."""
        if self._pool:
            await self._pool.close()
            logger.info("Pool closed")

    @property
    def pool(self) -> Pool:
        if self._pool is None:
            raise RuntimeError("Database.connect() has not been called")
        return self._pool

    def stats(self) -> dict[str, int]:
        """Return pool metrics. Expose via /metrics endpoint."""
        p = self.pool
        return {
            "size": p.get_size(),
            "idle": p.get_idle_size(),
            "waiting": p.get_min_size(),  # queued waiters not directly exposed
        }

    async def fetch_one(self, query: str, *args: object) -> asyncpg.Record | None:
        """Execute a query and return at most one row."""
        async with self.pool.acquire() as conn:
            return await conn.fetchrow(query, *args)

    async def fetch_all(self, query: str, *args: object) -> list[asyncpg.Record]:
        """Execute a query and return all rows."""
        async with self.pool.acquire() as conn:
            return await conn.fetch(query, *args)

    async def execute(self, query: str, *args: object) -> str:
        """Execute a DML statement (INSERT, UPDATE, DELETE). Returns status."""
        async with self.pool.acquire() as conn:
            return await conn.execute(query, *args)

    @asynccontextmanager
    async def transaction(self) -> AsyncGenerator[Connection, None]:
        """Context manager that acquires a connection and wraps it in a transaction.

        The connection is pinned for the transaction duration and released on
        commit or rollback. Long transactions reduce pool availability.

        Usage:
            async with db.transaction() as conn:
                await conn.execute("UPDATE ...")
                await conn.execute("INSERT ...")
        """
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                yield conn


async def _setup_connection(conn: Connection) -> None:
    """Runs once per new physical connection.
    
    Set session-level settings: timezone, search_path, etc.
    Avoid expensive operations here as it runs on every new connection creation.
    """
    await conn.execute("SET TIME ZONE 'UTC'")


# --- Usage Example ---

async def example_usage() -> None:
    config = PoolConfig(
        dsn="postgresql://user:pass@localhost:5432/mydb",
        min_size=2,
        max_size=10,
    )

    db = Database(config)
    await db.connect()

    try:
        # Simple query — borrow + release is automatic
        user = await db.fetch_one("SELECT * FROM users WHERE id = $1", 42)
        if user:
            print(f"Found: {user['name']}")

        # Transaction — connection is pinned until the block exits
        async with db.transaction() as conn:
            await conn.execute(
                "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
                100, 1,
            )
            await conn.execute(
                "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
                100, 2,
            )

        print("Pool stats:", db.stats())
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(example_usage())`,

  TypeScript: `// Pattern: Connection Pool (using postgres.js — modern Node.js Postgres driver)
// Reference: porsager/postgres v3 — https://github.com/porsager/postgres
// Production note: postgres.js has built-in pooling and tagged template literals
//   that prevent SQL injection by construction. Drizzle/Kysely build on top of it.

import postgres, { type Sql, type Row } from "postgres";

// PoolConfig with discriminated union for connection string vs object config
type PoolConfig = {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly username: string;
  readonly password: string;
  /**
   * Pool ceiling. Formula: (CPU cores × 2) + 1 for SSD.
   * All postgres.js connections share a single pool per Sql instance.
   */
  readonly max: number;
  /**
   * Idle connection timeout in seconds.
   * Connections idle for this long are released back to OS.
   */
  readonly idleTimeout: number;
  /**
   * Max lifetime of a connection in seconds.
   * Rotate before server-side timeout to avoid stale connections.
   */
  readonly maxLifetimeSeconds: number;
  readonly ssl: "require" | "prefer" | false;
};

type QueryResult<T extends Row> = Promise<readonly T[]>;

// Result type for operations that can fail
type Result<T, E extends Error = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export class Database {
  readonly #sql: Sql;

  private constructor(sql: Sql) {
    this.#sql = sql;
  }

  /**
   * Creates a pool and verifies connectivity.
   * Throws if the database is unreachable — surfaces misconfiguration early.
   */
  static async create(config: PoolConfig): Promise<Database> {
    const sql = postgres({
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username,
      password: config.password,
      max: config.max,
      idle_timeout: config.idleTimeout,
      max_lifetime: config.maxLifetimeSeconds,
      ssl: config.ssl,
      // transform: map snake_case columns to camelCase automatically
      transform: postgres.camel,
      // onnotice: suppress NOTICE messages in production unless debugging
      onnotice: () => {},
    });

    // Validate before returning — fail fast on bad config
    await sql\`SELECT 1\`;
    return new Database(sql);
  }

  /**
   * Exposes the raw Sql instance for advanced use (COPY, LISTEN/NOTIFY, etc.)
   * Prefer the helper methods on this class for ordinary queries.
   */
  get sql(): Sql {
    return this.#sql;
  }

  /**
   * Execute a query with tagged template literals — SQL injection safe by construction.
   * User-supplied values are always parameterized.
   *
   * @example
   * const users = await db.query<User>\`SELECT * FROM users WHERE id = \${userId}\`
   */
  query<T extends Row>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): QueryResult<T> {
    return this.#sql<T>(strings, ...values);
  }

  /**
   * Execute a transaction. The pool connection is held until the callback resolves.
   * On error, the transaction is rolled back automatically.
   *
   * WARNING: Long transactions reduce pool availability.
   * Set statement_timeout on the connection if queries may be slow.
   */
  async transaction<T>(
    fn: (tx: Sql) => Promise<T>
  ): Promise<Result<T>> {
    try {
      const value = await this.#sql.begin(fn);
      return { ok: true, value };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      return { ok: false, error };
    }
  }

  /**
   * Close all pool connections. Call on graceful shutdown.
   * In-flight queries complete; new queries are rejected.
   */
  async end(): Promise<void> {
    await this.#sql.end({ timeout: 5 }); // 5s grace period
  }
}

// Default config for a production service
export function defaultConfig(overrides: Partial<PoolConfig> = {}): PoolConfig {
  return {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? "mydb",
    username: process.env.DB_USER ?? "app",
    password: process.env.DB_PASSWORD ?? "",
    max: 10,               // tune: (cores × 2) + 1
    idleTimeout: 300,      // 5 min
    maxLifetimeSeconds: 1800, // 30 min
    ssl: "require",
    ...overrides,
  };
}

// ─── Usage Example ───────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
}

async function main(): Promise<void> {
  const db = await Database.create(defaultConfig());

  try {
    // Tagged template — userId is always parameterized, never interpolated
    const userId = 42;
    const [user] = await db.query<User>\`
      SELECT id, name, email FROM users WHERE id = \${userId}
    \`;

    if (user) {
      console.log("Found user:", user.name);
    }

    // Transaction — connection held for both statements
    const result = await db.transaction(async (tx) => {
      await tx\`
        UPDATE accounts SET balance = balance - \${100} WHERE id = \${1}
      \`;
      await tx\`
        UPDATE accounts SET balance = balance + \${100} WHERE id = \${2}
      \`;
      return { transferred: 100 };
    });

    if (!result.ok) {
      console.error("Transfer failed:", result.error.message);
    }
  } finally {
    await db.end();
  }
}`,

  Rust: `// Pattern: Connection Pool (using deadpool-postgres)
// Reference: deadpool-postgres 0.14+ / tokio-postgres
// Production note: deadpool is the idiomatic async pool for tokio-postgres;
//   sqlx's built-in pool is an alternative with compile-time query checking.

use std::time::Duration;

use deadpool_postgres::{Config, Manager, ManagerConfig, Pool, RecyclingMethod, Runtime};
use thiserror::Error;
use tokio_postgres::{NoTls, Row};

#[derive(Debug, Error)]
pub enum DbError {
    #[error("pool build error: {0}")]
    PoolBuild(#[from] deadpool_postgres::BuildError),
    #[error("pool error: {0}")]
    Pool(#[from] deadpool_postgres::PoolError),
    #[error("postgres error: {0}")]
    Postgres(#[from] tokio_postgres::Error),
    #[error("connection acquire timeout")]
    Timeout,
}

/// Pool configuration.
/// Formula: max_size = (cpu_cores * 2) + 1 for SSD-backed databases.
#[derive(Debug, Clone)]
pub struct PoolConfig {
    pub host: String,
    pub port: u16,
    pub dbname: String,
    pub user: String,
    pub password: String,
    /// Pool ceiling. Exceeding DB max_connections causes connection errors.
    pub max_size: usize,
    /// Recycle strategy: Fast = try DISCARD ALL first, then DROP.
    /// Verified = always run a test query. Clean = just DISCARD ALL.
    pub recycling: RecyclingMethod,
    /// How long to wait for a connection before returning Timeout error.
    pub acquire_timeout: Duration,
}

impl Default for PoolConfig {
    fn default() -> Self {
        Self {
            host: "localhost".into(),
            port: 5432,
            dbname: "mydb".into(),
            user: "app".into(),
            password: String::new(),
            max_size: 10,
            recycling: RecyclingMethod::Fast,
            acquire_timeout: Duration::from_millis(500),
        }
    }
}

pub struct Database {
    pool: Pool,
}

impl Database {
    /// Build the pool and ping the database before returning.
    pub async fn new(cfg: PoolConfig) -> Result<Self, DbError> {
        let mut config = Config::new();
        config.host = Some(cfg.host);
        config.port = Some(cfg.port);
        config.dbname = Some(cfg.dbname);
        config.user = Some(cfg.user);
        config.password = Some(cfg.password);

        let manager_cfg = ManagerConfig {
            recycling_method: cfg.recycling,
        };
        let manager = Manager::from_config(
            config.get_pg_config()?,
            NoTls, // replace with TlsConnector for production TLS
            manager_cfg,
        );

        let pool = Pool::builder(manager)
            .max_size(cfg.max_size)
            .wait_timeout(Some(cfg.acquire_timeout))
            .build()?;

        // Validate connectivity before returning.
        {
            let conn = pool.get().await?;
            conn.execute("SELECT 1", &[]).await?;
        }

        Ok(Self { pool })
    }

    /// Execute a single-row query. Returns None if no row matches.
    pub async fn query_one_opt(
        &self,
        sql: &str,
        params: &[&(dyn tokio_postgres::types::ToSql + Sync)],
    ) -> Result<Option<Row>, DbError> {
        let conn = self.pool.get().await?;
        Ok(conn.query_opt(sql, params).await?)
    }

    /// Execute a multi-row query.
    pub async fn query(
        &self,
        sql: &str,
        params: &[&(dyn tokio_postgres::types::ToSql + Sync)],
    ) -> Result<Vec<Row>, DbError> {
        let conn = self.pool.get().await?;
        Ok(conn.query(sql, params).await?)
    }

    /// Execute a statement (INSERT/UPDATE/DELETE). Returns affected rows.
    pub async fn execute(
        &self,
        sql: &str,
        params: &[&(dyn tokio_postgres::types::ToSql + Sync)],
    ) -> Result<u64, DbError> {
        let conn = self.pool.get().await?;
        Ok(conn.execute(sql, params).await?)
    }

    /// Run a closure within a transaction.
    /// Connection is held until the closure completes; rolled back on error.
    ///
    /// WARNING: holds a pool connection for the entire duration.
    /// Long transactions reduce available connections for other requests.
    pub async fn with_transaction<F, T>(&self, f: F) -> Result<T, DbError>
    where
        F: for<'tx> FnOnce(
            &'tx deadpool_postgres::Object,
        ) -> std::pin::Pin<
            Box<dyn std::future::Future<Output = Result<T, DbError>> + Send + 'tx>,
        >,
    {
        let conn = self.pool.get().await?;
        let tx = conn.transaction().await?;
        match f(&conn).await {
            Ok(val) => {
                tx.commit().await?;
                Ok(val)
            }
            Err(e) => {
                // tokio-postgres rolls back on drop if not committed
                Err(e)
            }
        }
    }

    /// Pool status — expose via metrics endpoint.
    pub fn status(&self) -> deadpool::Status {
        self.pool.status()
    }
}

// --- Usage Example ---

#[tokio::main]
async fn main() -> Result<(), DbError> {
    let cfg = PoolConfig {
        host: "localhost".into(),
        dbname: "mydb".into(),
        user: "app".into(),
        password: "secret".into(),
        max_size: 10,
        ..Default::default()
    };

    let db = Database::new(cfg).await?;

    // Single-row query — pool borrow + release handled automatically
    if let Some(row) = db.query_one_opt("SELECT name FROM users WHERE id = $1", &[&42i64]).await? {
        let name: &str = row.get("name");
        println!("Found user: {name}");
    }

    // Multi-row query
    let rows = db.query("SELECT id, name FROM users LIMIT 10", &[]).await?;
    for row in &rows {
        let id: i64 = row.get("id");
        let name: &str = row.get("name");
        println!("{id}: {name}");
    }

    let status = db.status();
    println!("Pool — size: {}, available: {}", status.size, status.available);

    Ok(())
}`,

  Java: `// Pattern: Connection Pool (using HikariCP — the Spring Boot default)
// Reference: HikariCP README / brettwooldridge — https://github.com/brettwooldridge/HikariCP
// Production note: HikariCP is the default pool in Spring Boot 2.0+ and
//   outperforms c3p0/DBCP2 in lock-free design; Spring manages lifecycle.

package com.example.db;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

/**
 * Connection pool wrapper using HikariCP.
 *
 * Pool sizing formula (HikariCP README / Oracle Real-world Performance Group):
 *   maximumPoolSize = (cpu_cores * 2) + effective_spindle_count
 *   For a 4-core server on SSD: maximumPoolSize = 9
 *
 * Setting maximumPoolSize too high degrades performance: Oracle demonstrated
 * 50x throughput difference between a properly-sized vs over-sized pool.
 */
public final class Database implements AutoCloseable {

    private final HikariDataSource dataSource;

    private Database(HikariDataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Build a pool with production-safe defaults.
     *
     * @param jdbcUrl  JDBC connection URL (e.g., jdbc:postgresql://host:5432/db)
     * @param username database user
     * @param password database password
     */
    public static Database create(String jdbcUrl, String username, String password) {
        var config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);

        // Pool sizing — tune to (cores * 2) + 1 for your hardware
        config.setMaximumPoolSize(10);
        // HikariCP recommendation: set minimumIdle == maximumPoolSize for fixed-size pool
        // Fixed pools avoid resize overhead during traffic spikes
        config.setMinimumIdle(10);

        // Timeout: how long a thread waits for a connection before throwing
        // 500ms is aggressive but surfaces pool exhaustion quickly
        config.setConnectionTimeout(500);

        // Idle timeout: evict idle connections after 5 min to free DB resources
        config.setIdleTimeout(300_000L);

        // Max lifetime: rotate connections before server-side idle timeout
        // Set slightly below PostgreSQL's idle_in_transaction_session_timeout
        config.setMaxLifetime(1_800_000L); // 30 min

        // Keepalive: ping idle connections every 60s to prevent NAT/firewall eviction
        config.setKeepaliveTime(60_000L);

        // Validation query — JDBC4 drivers support isValid(); avoid SELECT 1 here
        // config.setConnectionTestQuery("SELECT 1"); // only for non-JDBC4 drivers

        // Pool name — appears in thread names and metrics (aid debugging)
        config.setPoolName("app-db-pool");

        // Metrics via Micrometer (if on classpath)
        // config.setMetricRegistry(meterRegistry); // inject your MeterRegistry

        var dataSource = new HikariDataSource(config);
        return new Database(dataSource);
    }

    /** Exposes the DataSource for frameworks (Spring, jOOQ, etc.) */
    public DataSource dataSource() {
        return dataSource;
    }

    /**
     * Execute a query and map each row to a result object.
     *
     * The connection is borrowed from the pool and returned when the
     * ResultSet is closed (via try-with-resources).
     *
     * @param sql    parameterized SQL query
     * @param setter populates PreparedStatement parameters
     * @param mapper maps each ResultSet row to type T
     */
    public <T> List<T> query(
            String sql,
            ThrowingConsumer<PreparedStatement> setter,
            Function<ResultSet, T> mapper) throws SQLException {
        try (var conn = dataSource.getConnection();
             var stmt = conn.prepareStatement(sql)) {
            setter.accept(stmt);
            try (var rs = stmt.executeQuery()) {
                var results = new ArrayList<T>();
                while (rs.next()) {
                    results.add(mapper.apply(rs));
                }
                return results;
            }
        }
    }

    /**
     * Execute a single-row query. Returns Optional.empty() if no row matches.
     */
    public <T> Optional<T> queryOne(
            String sql,
            ThrowingConsumer<PreparedStatement> setter,
            Function<ResultSet, T> mapper) throws SQLException {
        var rows = query(sql, setter, mapper);
        return rows.isEmpty() ? Optional.empty() : Optional.of(rows.getFirst());
    }

    /**
     * Execute a DML statement within a transaction.
     *
     * Obtains a single connection, disables auto-commit, runs the batch,
     * commits on success, rolls back on any exception.
     *
     * WARNING: the connection is held for the entire duration of txBlock.
     * Long-running transactions reduce available connections for other threads.
     *
     * @param txBlock receives a Connection with auto-commit disabled
     */
    public void withTransaction(ThrowingConsumer<Connection> txBlock) throws SQLException {
        try (var conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                txBlock.accept(conn);
                conn.commit();
            } catch (Exception ex) {
                conn.rollback();
                throw ex instanceof SQLException se ? se : new SQLException(ex);
            }
        }
    }

    /** Pool metrics — useful for dashboards and alerting. */
    public PoolStats stats() {
        HikariPoolMXBean mxBean = dataSource.getHikariPoolMXBean();
        return new PoolStats(
                mxBean.getActiveConnections(),
                mxBean.getIdleConnections(),
                mxBean.getThreadsAwaitingConnection(),
                mxBean.getTotalConnections()
        );
    }

    @Override
    public void close() {
        dataSource.close(); // drains pool; waits for in-flight connections
    }

    @FunctionalInterface
    public interface ThrowingConsumer<T> {
        void accept(T t) throws SQLException;
    }

    public record PoolStats(int active, int idle, int awaitingConnection, int total) {}

    // --- Usage Example ---

    public static void main(String[] args) throws Exception {
        try (var db = Database.create(
                "jdbc:postgresql://localhost:5432/mydb", "app", "secret")) {

            // Query — connection borrowed and returned automatically
            var users = db.query(
                    "SELECT id, name FROM users WHERE active = ?",
                    stmt -> stmt.setBoolean(1, true),
                    rs -> rs.getString("name")
            );
            users.forEach(name -> System.out.println("User: " + name));

            // Single row
            db.queryOne(
                    "SELECT name FROM users WHERE id = ?",
                    stmt -> stmt.setInt(1, 42),
                    rs -> rs.getString("name")
            ).ifPresent(name -> System.out.println("Found: " + name));

            // Transaction — connection pinned for both statements
            db.withTransaction(conn -> {
                try (var stmt = conn.prepareStatement(
                        "UPDATE accounts SET balance = balance - ? WHERE id = ?")) {
                    stmt.setInt(1, 100);
                    stmt.setInt(2, 1);
                    stmt.executeUpdate();
                }
                try (var stmt = conn.prepareStatement(
                        "UPDATE accounts SET balance = balance + ? WHERE id = ?")) {
                    stmt.setInt(1, 100);
                    stmt.setInt(2, 2);
                    stmt.executeUpdate();
                }
            });

            var stats = db.stats();
            System.out.printf(
                "Pool — active: %d, idle: %d, waiting: %d, total: %d%n",
                stats.active(), stats.idle(), stats.awaitingConnection(), stats.total()
            );
        }
    }
}`,
};

const awsCdkCode = `// infrastructure/cdk/rds-proxy-stack.ts
// Pattern: RDS Proxy in front of Aurora PostgreSQL
// RDS Proxy is the recommended solution for Lambda → RDS and any
// environment with highly variable concurrency (ECS, Fargate, EKS).

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface RdsProxyStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  maxConnections?: number; // per-proxy ceiling
}

export class RdsProxyStack extends cdk.Stack {
  readonly proxy: rds.DatabaseProxy;

  constructor(scope: Construct, id: string, props: RdsProxyStackProps) {
    super(scope, id, props);

    // Aurora PostgreSQL Serverless v2 — scales connections with capacity
    const cluster = new rds.DatabaseCluster(this, 'AuroraCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_16_2,
      }),
      writer: rds.ClusterInstance.serverlessV2('writer'),
      readers: [
        rds.ClusterInstance.serverlessV2('reader', { scaleWithWriter: true }),
      ],
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 16,
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      // Aurora manages max_connections automatically based on instance capacity
    });

    // RDS Proxy — maintains a persistent pool of DB connections
    // Lambda/ECS connect to the proxy, not the cluster directly.
    // IAM authentication recommended over password for production.
    this.proxy = cluster.addProxy('RdsProxy', {
      borrowTimeout: cdk.Duration.seconds(30),
      maxConnectionsPercent: 90,     // proxy uses ≤90% of DB max_connections
      maxIdleConnectionsPercent: 50, // keep 50% warm for traffic spikes
      requireTLS: true,
      iamAuth: true, // IAM token auth instead of password in secrets
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      secrets: [cluster.secret!],
    });

    // Lambda execution role — grant IAM DB auth
    const lambdaRole = new iam.Role(this, 'LambdaExecRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaVPCAccessExecutionRole'
        ),
      ],
    });
    this.proxy.grantConnect(lambdaRole, 'app_user');

    // CloudWatch alarm: pinned connections degrade pooling benefit
    // If > 5% of connections are pinned (prepared stmts, temp tables),
    // investigate ORM configuration or switch to session mode.
    new cdk.aws_cloudwatch.Alarm(this, 'ProxyPinningAlarm', {
      metric: this.proxy.metric('DatabaseConnectionsCurrentlySessionPinned'),
      threshold: props.maxConnections ? props.maxConnections * 0.05 : 5,
      evaluationPeriods: 3,
      alarmDescription: 'RDS Proxy session pinning > 5%. Check prepared statements.',
    });

    new cdk.CfnOutput(this, 'ProxyEndpoint', {
      value: this.proxy.endpoint,
      description: 'Connect Lambda/ECS to this endpoint, not the cluster directly',
    });
  }
}`;

const awsSdkCode = `// aws/sdk/go/rds-proxy-connect.go
// Go application connecting to RDS Proxy with IAM authentication.
// IAM auth generates a short-lived token (15 min) instead of a static password.
// Use aws-sdk-go-v2 to generate the token; connect normally with pgxpool.

package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/rds/auth"
	"github.com/jackc/pgx/v5/pgxpool"
)

func buildPoolWithIAMAuth(ctx context.Context) (*pgxpool.Pool, error) {
	region := "us-east-1"
	proxyEndpoint := "myapp-proxy.proxy-abc123.us-east-1.rds.amazonaws.com"
	dbUser := "app_user"
	dbName := "mydb"
	port := 5432

	// Load AWS credentials from environment / instance profile / ECS task role
	awsCfg, err := config.LoadDefaultConfig(ctx, config.WithRegion(region))
	if err != nil {
		return nil, fmt.Errorf("load aws config: %w", err)
	}

	// Generate IAM auth token — valid 15 minutes
	// Your application should refresh this token before it expires.
	// pgxpool's BeforeConnect hook is the right place to do this.
	authToken, err := auth.BuildAuthToken(
		ctx,
		fmt.Sprintf("%s:%d", proxyEndpoint, port),
		region,
		dbUser,
		awsCfg.Credentials,
	)
	if err != nil {
		return nil, fmt.Errorf("build iam auth token: %w", err)
	}

	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=require",
		proxyEndpoint, port, dbUser, authToken, dbName,
	)

	poolCfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, fmt.Errorf("parse pool config: %w", err)
	}

	// Rotate the IAM token before it expires (15 min TTL)
	poolCfg.BeforeConnect = func(ctx context.Context, cfg *pgxpool.Config) error {
		newToken, err := auth.BuildAuthToken(
			ctx,
			fmt.Sprintf("%s:%d", proxyEndpoint, port),
			region,
			dbUser,
			awsCfg.Credentials,
		)
		if err != nil {
			return fmt.Errorf("refresh iam token: %w", err)
		}
		cfg.ConnConfig.Password = newToken
		return nil
	}

	poolCfg.MaxConns = 10
	poolCfg.MinConns = 2
	poolCfg.MaxConnLifetime = 14 * time.Minute // below IAM token TTL

	return pgxpool.NewWithConfig(ctx, poolCfg)
}

func main() {
	ctx := context.Background()
	pool, err := buildPoolWithIAMAuth(ctx)
	if err != nil {
		log.Fatalf("build pool: %v", err)
	}
	defer pool.Close()

	var version string
	err = pool.QueryRow(ctx, "SELECT version()").Scan(&version)
	if err != nil {
		log.Fatalf("query: %v", err)
	}
	log.Printf("Connected: %s", version)
}`;

const azureCode = `# infrastructure/bicep/flexible-server-pgbouncer.bicep
# Azure Database for PostgreSQL Flexible Server — PgBouncer enabled
# Azure's built-in PgBouncer runs in transaction mode on port 6432.
# Connect your app to port 6432 (PgBouncer) not 5432 (direct Postgres).

param location string = resourceGroup().location
param serverName string
param adminLogin string
@secure()
param adminPassword string

// Flexible Server with PgBouncer connection pooling enabled
resource flexibleServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-06-01-preview' = {
  name: serverName
  location: location
  sku: {
    name: 'Standard_D2ds_v4'  // 2 vCores — max_connections ≈ 50 direct, ~1000 via PgBouncer
    tier: 'GeneralPurpose'
  }
  properties: {
    administratorLogin: adminLogin
    administratorLoginPassword: adminPassword
    version: '16'
    storage: { storageSizeGB: 128 }
    backup: { backupRetentionDays: 7, geoRedundantBackup: 'Enabled' }
    highAvailability: { mode: 'ZoneRedundant' }
  }
}

// Enable PgBouncer — connection pooler on port 6432
// transaction_mode is the default and recommended for most workloads
resource pgBouncerConfig 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2023-06-01-preview' = {
  name: 'pgbouncer.enabled'
  parent: flexibleServer
  properties: {
    value: 'true'
    source: 'user-override'
  }
}

// PgBouncer pool mode — transaction (recommended) vs session vs statement
resource pgBouncerMode 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2023-06-01-preview' = {
  name: 'pgbouncer.pool_mode'
  parent: flexibleServer
  dependsOn: [pgBouncerConfig]
  properties: {
    value: 'transaction'  // best multiplexing; breaks if app uses prepared stmts
    source: 'user-override'
  }
}

// Max client connections PgBouncer will accept (across all pools)
resource pgBouncerMaxClients 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2023-06-01-preview' = {
  name: 'pgbouncer.max_client_conn'
  parent: flexibleServer
  dependsOn: [pgBouncerConfig]
  properties: {
    value: '5000'
    source: 'user-override'
  }
}

output pgBouncerEndpoint string = '\${flexibleServer.properties.fullyQualifiedDomainName}:6432'
output directEndpoint string = '\${flexibleServer.properties.fullyQualifiedDomainName}:5432'`;

const gcpCode = `# infrastructure/terraform/cloud-sql-proxy.tf
# GCP Cloud SQL with Auth Proxy — recommended for connection pooling on GCP.
# The Cloud SQL Auth Proxy handles IAM auth, TLS, and acts as a local socket
# your app connects to (127.0.0.1:5432). It does NOT pool connections itself —
# pair it with pgBouncer or an in-process pool (pgxpool, asyncpg).

terraform {
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

variable "project_id" { type = string }
variable "region" { default = "us-central1" }

# Cloud SQL PostgreSQL instance
resource "google_sql_database_instance" "main" {
  name             = "app-postgres"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier = "db-perf-optimized-N-2"  # 2 vCPU, 16 GB RAM

    database_flags {
      # Set max_connections to accommodate all proxy connections + overhead
      # Cloud SQL default: 100 for db-f1-micro, up to 4000 for large instances
      name  = "max_connections"
      value = "200"
    }

    database_flags {
      # Terminate idle connections after 5 min — reclaim DB memory
      name  = "idle_in_transaction_session_timeout"
      value = "300000"  # milliseconds
    }

    ip_configuration {
      ipv4_enabled    = false   # private IP only — use Auth Proxy
      private_network = google_compute_network.vpc.id
    }

    insights_config {
      query_insights_enabled = true  # query performance observability
    }
  }

  deletion_protection = true
}

# Service account for the application — uses IAM DB auth
resource "google_service_account" "app" {
  account_id   = "app-db-sa"
  display_name = "App DB Service Account"
}

# Grant the service account Cloud SQL Client role
resource "google_project_iam_member" "app_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:\${google_service_account.app.email}"
}

# Cloud Run service with Cloud SQL Auth Proxy as sidecar
resource "google_cloud_run_v2_service" "app" {
  name     = "app-service"
  location = var.region

  template {
    containers {
      name  = "app"
      image = "gcr.io/\${var.project_id}/app:latest"

      env {
        name  = "DB_HOST"
        value = "127.0.0.1"  # proxy listens on localhost
      }
      env {
        name  = "DB_PORT"
        value = "5432"
      }
      env {
        name  = "DB_MAX_CONNS"
        value = "10"  # per-instance pool ceiling
      }
    }

    # Cloud SQL Auth Proxy sidecar
    containers {
      name  = "cloud-sql-proxy"
      image = "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.11"
      args  = [
        "--port=5432",
        "--auto-iam-authn",                                       # IAM auth
        "\${var.project_id}:\${var.region}:app-postgres",
      ]
    }

    service_account = google_service_account.app.email

    scaling {
      min_instance_count = 2
      max_instance_count = 100
      # NOTE: at 100 instances × 10 connections = 1000 total DB connections
      # Ensure Cloud SQL max_connections exceeds this.
    }
  }
}

# Cloud Monitoring alert: connection count approaching limit
resource "google_monitoring_alert_policy" "connection_saturation" {
  display_name = "Cloud SQL Connection Saturation"
  combiner     = "OR"

  conditions {
    display_name = "connections > 80% of max"
    condition_threshold {
      filter          = "resource.type = \\"cloudsql_database\\" AND metric.type = \\"cloudsql.googleapis.com/database/postgresql/num_backends\\""
      comparison      = "COMPARISON_GT"
      threshold_value = 160  # 80% of max_connections=200
      duration        = "60s"
    }
  }
}`;

const ImplementationsTab = () => {
  const [lang, setLang] = useState("Go");
  const [cloudTab, setCloudTab] = useState("aws");
  const [awsSubTab, setAwsSubTab] = useState("iac");
  const [azureSubTab, setAzureSubTab] = useState("iac");
  const [gcpSubTab, setGcpSubTab] = useState("iac");
  const [mainTab, setMainTab] = useState("core");

  const cloudTabs = ["core", "aws", "azure", "gcp"];
  const cloudColors = { aws: theme.aws, azure: theme.azure, gcp: theme.gcp };

  return (
    <div>
      {/* Main cloud/core switcher */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {cloudTabs.map(t => {
          const color = t === "core" ? theme.blue : cloudColors[t];
          return (
            <button key={t} onClick={() => setMainTab(t)} style={{
              background: mainTab === t ? `${color}22` : "transparent",
              border: `1px solid ${mainTab === t ? color : theme.border}`,
              color: mainTab === t ? color : theme.textMuted,
              padding: "6px 16px", borderRadius: 6, fontSize: 13,
              cursor: "pointer", fontWeight: mainTab === t ? 600 : 400,
              textTransform: "uppercase", letterSpacing: "0.5px",
              transition: "all 0.15s",
            }}>
              {t === "core" ? "Core (Language)" : t.toUpperCase()}
            </button>
          );
        })}
      </div>

      {mainTab === "core" && (
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {langs.map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                background: lang === l ? "#3b82f622" : "transparent",
                border: `1px solid ${lang === l ? theme.blue : theme.border}`,
                color: lang === l ? theme.blue : theme.textMuted,
                padding: "5px 14px", borderRadius: 5, fontSize: 12,
                cursor: "pointer", fontWeight: lang === l ? 600 : 400,
                transition: "all 0.15s",
              }}>{l}</button>
            ))}
          </div>
          <CodeBlock
            code={implCode[lang]}
            language={lang.toLowerCase()}
            filename={`implementations/core/${lang === "TypeScript" ? "database.ts" : lang === "Python" ? "database.py" : lang === "Rust" ? "database.rs" : lang === "Java" ? "Database.java" : "database.go"}`}
          />
        </div>
      )}

      {mainTab === "aws" && (
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {["iac", "sdk"].map(t => (
              <button key={t} onClick={() => setAwsSubTab(t)} style={{
                background: awsSubTab === t ? "#ff990022" : "transparent",
                border: `1px solid ${awsSubTab === t ? theme.aws : theme.border}`,
                color: awsSubTab === t ? theme.aws : theme.textMuted,
                padding: "5px 14px", borderRadius: 5, fontSize: 12,
                cursor: "pointer", fontWeight: awsSubTab === t ? 600 : 400,
                transition: "all 0.15s",
              }}>{t === "iac" ? "IaC (CDK TypeScript)" : "SDK (Go + aws-sdk-go-v2)"}</button>
            ))}
          </div>
          {awsSubTab === "iac" ? (
            <CodeBlock code={awsCdkCode} language="typescript" filename="implementations/aws/iac/rds-proxy-stack.ts" />
          ) : (
            <CodeBlock code={awsSdkCode} language="go" filename="implementations/aws/sdk/rds-proxy-connect.go" />
          )}
          <div style={{
            background: "#ff990011", border: "1px solid #ff990033",
            borderRadius: 6, padding: 12, marginTop: 8,
          }}>
            <span style={{ color: theme.aws, fontWeight: 600, fontSize: 12 }}>AWS Note: </span>
            <span style={{ color: theme.textMuted, fontSize: 12 }}>
              RDS Proxy pins connections for prepared statements, temporary tables, and SET statements.
              Monitor <code style={{ color: theme.aws }}>DatabaseConnectionsCurrentlySessionPinned</code> in CloudWatch.
              If pinning exceeds 5% of total connections, audit ORM prepared statement usage.
            </span>
          </div>
        </div>
      )}

      {mainTab === "azure" && (
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {["iac"].map(t => (
              <button key={t} onClick={() => setAzureSubTab(t)} style={{
                background: azureSubTab === t ? "#0078d422" : "transparent",
                border: `1px solid ${azureSubTab === t ? theme.azure : theme.border}`,
                color: azureSubTab === t ? theme.azure : theme.textMuted,
                padding: "5px 14px", borderRadius: 5, fontSize: 12,
                cursor: "pointer", fontWeight: azureSubTab === t ? 600 : 400,
                transition: "all 0.15s",
              }}>{t === "iac" ? "IaC (Bicep)" : ""}</button>
            ))}
          </div>
          <CodeBlock code={azureCode} language="bicep" filename="implementations/azure/iac/flexible-server-pgbouncer.bicep" />
          <div style={{
            background: "#0078d411", border: "1px solid #0078d433",
            borderRadius: 6, padding: 12, marginTop: 8,
          }}>
            <span style={{ color: theme.azure, fontWeight: 600, fontSize: 12 }}>Azure Note: </span>
            <span style={{ color: theme.textMuted, fontSize: 12 }}>
              Azure Flexible Server's built-in PgBouncer listens on port 6432 (transaction mode).
              Direct port 5432 bypasses pooling entirely. If your ORM uses prepared statements,
              either disable them at the driver level or switch PgBouncer to session mode
              (accepting lower multiplexing ratios).
            </span>
          </div>
        </div>
      )}

      {mainTab === "gcp" && (
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {["iac"].map(t => (
              <button key={t} onClick={() => setGcpSubTab(t)} style={{
                background: gcpSubTab === t ? "#4285f422" : "transparent",
                border: `1px solid ${gcpSubTab === t ? theme.gcp : theme.border}`,
                color: gcpSubTab === t ? theme.gcp : theme.textMuted,
                padding: "5px 14px", borderRadius: 5, fontSize: 12,
                cursor: "pointer", fontWeight: gcpSubTab === t ? 600 : 400,
                transition: "all 0.15s",
              }}>{t === "iac" ? "IaC (Terraform)" : ""}</button>
            ))}
          </div>
          <CodeBlock code={gcpCode} language="terraform" filename="implementations/gcp/iac/cloud-sql-proxy.tf" />
          <div style={{
            background: "#4285f411", border: "1px solid #4285f433",
            borderRadius: 6, padding: 12, marginTop: 8,
          }}>
            <span style={{ color: theme.gcp, fontWeight: 600, fontSize: 12 }}>GCP Note: </span>
            <span style={{ color: theme.textMuted, fontSize: 12 }}>
              Cloud SQL Auth Proxy handles IAM auth and TLS but does <em>not</em> pool connections.
              Pair it with an in-process pool (pgxpool, asyncpg, HikariCP) for connection reuse.
              AlloyDB Omni bundles pgBouncer natively — use AlloyDB if you need a managed external pooler on GCP.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── TAB 4: LEADERSHIP ───────────────────────────────────────────────────────

const LeadershipTab = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ color: theme.text, fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
        Leadership Angles
      </h2>
      <p style={{ color: theme.textMuted, fontSize: 14 }}>
        Framed for tech lead responsibilities: communicate, justify, detect failure, scale.
      </p>
    </div>

    {/* Explain to team */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.blue}44`,
      borderLeft: `3px solid ${theme.blue}`, borderRadius: 8, padding: 20, marginBottom: 16,
    }}>
      <h3 style={{ color: theme.blue, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
        🗣 Explain to Your Team
      </h3>
      <p style={{ color: theme.text, fontSize: 14, lineHeight: 1.7 }}>
        "Every database connection requires a TCP handshake, TLS negotiation, and authentication — 
        this takes 20–100ms and creates a server-side process consuming memory. Connection pooling 
        pre-creates a small set of these connections and lends them to request threads; when a thread 
        is done, the connection goes back to the pool rather than being destroyed."
      </p>
      <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>
        "The key insight: you don't need one connection per user or per thread — you need one per 
        concurrent database operation. Most threads spend &gt;95% of their time doing work that doesn't 
        require the database; 10 connections can serve 1000 concurrent users."
      </p>
    </div>

    {/* Justify the decision */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.green}44`,
      borderLeft: `3px solid ${theme.green}`, borderRadius: 8, padding: 20, marginBottom: 16,
    }}>
      <h3 style={{ color: theme.green, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
        📐 Justify in Architecture Review
      </h3>
      {[
        {
          q: "Why not just open a connection per request?",
          a: "PostgreSQL max_connections defaults to 100. At 1000 rps, you'd create and destroy 1000 server processes per second — each consuming ~5 MB of RAM and CPU time for auth. This is measured: Stack Overflow documented their PostgreSQL performance collapsing at high concurrency without pooling."
        },
        {
          q: "Why not set pool size = thread count for maximum parallelism?",
          a: "The Oracle Real-world Performance Group demonstrated 50x throughput improvement by reducing connections from 2048 to 96 on a 2-socket server. The bottleneck is row lock contention and I/O at the database, not parallelism at the application layer. HikariCP's formula: (cores × 2) + spindle_count is the proven starting point."
        },
        {
          q: "Why do we need RDS Proxy if we already have HikariCP in our service?",
          a: "HikariCP pools within a single process lifetime. Lambda functions are ephemeral — they cold-start, run for milliseconds, and terminate. At 1000 concurrent invocations, each Lambda with HikariCP opens 1 connection = 1000 DB connections. RDS Proxy maintains a persistent pool on the AWS side; Lambda connects to the proxy."
        },
        {
          q: "How do we size the pool for our service?",
          a: "Start with (vCPU count × 2) + 1, benchmark under production-like load, then tune. Monitor p99 connection acquisition time and pool wait queue depth. If p99 acquisition exceeds 50ms, increase pool size. If DB CPU exceeds 70% with low wait queue, the bottleneck is DB capacity, not pool size."
        },
      ].map((faq, i) => (
        <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < 3 ? `1px solid ${theme.border}33` : "none" }}>
          <div style={{ color: theme.text, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Q: {faq.q}</div>
          <div style={{ color: theme.textMuted, fontSize: 13, lineHeight: 1.6, paddingLeft: 12 }}>A: {faq.a}</div>
        </div>
      ))}
    </div>

    {/* Failure modes & observability */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.red}44`,
      borderLeft: `3px solid ${theme.red}`, borderRadius: 8, padding: 20, marginBottom: 16,
    }}>
      <h3 style={{ color: theme.red, fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
        🔥 Failure Modes &amp; Observability
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          {
            failure: "Pool Exhaustion",
            symptom: "Requests timeout with 'Connection timeout after 500ms'",
            cause: "Traffic spike OR long-running transactions holding connections OR pool size too small",
            detect: "pool.wait_queue_depth > 0 sustained; p99 connection acquisition > connectionTimeout",
            alert: "Alert when waiting_threads > 0 for >30s",
          },
          {
            failure: "Stale Connection (NAT timeout)",
            symptom: "First query on a returned connection fails; retry succeeds",
            cause: "NAT gateway or firewall silently dropped the TCP connection; pool didn't know",
            detect: "connection_errors_total counter spike; error logs showing 'broken pipe'",
            alert: "Alert on sustained error rate spike (>1% of queries failing with IO error)",
          },
          {
            failure: "Connection Leak",
            symptom: "Pool active_connections climbs to maxPoolSize and never decreases",
            cause: "Code path that acquires a connection and returns early (exception, early return) without releasing it",
            detect: "active_connections = maxPoolSize for >1 min; leakDetectionThreshold in HikariCP logs stack trace",
            alert: "Alert when pool utilization > 90% for >5 min",
          },
          {
            failure: "pgBouncer Session Pinning",
            symptom: "High DB connection count despite pgBouncer; latency spikes",
            cause: "ORM using prepared statements in transaction mode — forces session pinning",
            detect: "CloudWatch: DatabaseConnectionsCurrentlySessionPinned > 5% of total",
            alert: "Alert on PinnedConnections / TotalConnections > 0.05",
          },
          {
            failure: "Post-fork Connection Inheritance",
            symptom: "Random query failures, duplicate query execution, data corruption in multiprocessing apps",
            cause: "Python multiprocessing (gunicorn prefork) inherits open connections from parent process",
            detect: "\"SSL connection has been closed unexpectedly\" errors after fork",
            alert: "N/A — prevent: close all connections before fork(); re-acquire after",
          },
          {
            failure: "DB Failover — Stale Pool",
            symptom: "All queries fail after read replica becomes primary",
            cause: "Pool holds connections to old primary's IP; TCP connections are dead but pool doesn't know",
            detect: "All connections fail simultaneously; error type: 'could not connect to server'",
            alert: "Alert on DB error rate spike; implement BeforeAcquire ping (with latency cost tradeoff)",
          },
        ].map(f => (
          <div key={f.failure} style={{
            background: "#0f1117", borderRadius: 6,
            border: `1px solid ${theme.red}33`, padding: 14,
          }}>
            <div style={{ color: theme.red, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{f.failure}</div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: theme.textDim }}>Symptom: </span>
              <span style={{ color: theme.textMuted }}>{f.symptom}</span>
            </div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: theme.textDim }}>Root cause: </span>
              <span style={{ color: theme.textMuted }}>{f.cause}</span>
            </div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: theme.textDim }}>Detect: </span>
              <span style={{ color: theme.textMuted }}>{f.detect}</span>
            </div>
            <div style={{ fontSize: 12 }}>
              <span style={{ color: "#f59e0b" }}>Alert: </span>
              <span style={{ color: theme.textMuted }}>{f.alert}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Scale implications */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.amber}44`,
      borderLeft: `3px solid ${theme.amber}`, borderRadius: 8, padding: 20, marginBottom: 16,
    }}>
      <h3 style={{ color: theme.amber, fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
        📈 Scale Implications
      </h3>
      {[
        {
          scale: "At 10x traffic",
          desc: "Pool wait queue starts building during peaks. Check: is the pool correctly sized, or is the DB itself the bottleneck? Add a read replica and route SELECT queries to it. Instrument connection acquisition time as a percentile metric — not just average.",
        },
        {
          scale: "At 100x traffic (horizontal scale-out)",
          desc: "10 app instances × maxPoolSize=10 = 100 DB connections. Add an external pooler (pgBouncer, RDS Proxy) that all instances share. This decouples app scaling from DB connection limits. RDS Proxy supports IAM auth and automatic connection brokering across Lambda/ECS.",
        },
        {
          scale: "Serverless (Lambda, Cloud Run)",
          desc: "In-process pools provide zero benefit in stateless functions — the pool is created and destroyed with the invocation. External pooler is mandatory. RDS Proxy (AWS) or Cloud SQL Proxy + AlloyDB (GCP) or Azure PgBouncer handle this. Budget for proxy costs (~$0.015/hour for RDS Proxy).",
        },
        {
          scale: "When to revisit",
          desc: "Re-evaluate pool strategy when: (1) deploying to Kubernetes with HPA — pod count × pool size may exceed DB limits, (2) migrating to a serverless runtime, (3) adding a new region (each region needs its own pool — geo-distributed apps need connection routing layer), (4) DB connection count &gt; 80% of max_connections for 3+ minutes during off-peak.",
        },
      ].map((s, i) => (
        <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < 3 ? `1px solid ${theme.border}33` : "none" }}>
          <div style={{ color: theme.amber, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{s.scale}</div>
          <div style={{ color: theme.textMuted, fontSize: 13, lineHeight: 1.6 }}>{s.desc}</div>
        </div>
      ))}
    </div>

    {/* Code review checklist */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.purple}44`,
      borderLeft: `3px solid ${theme.purple}`, borderRadius: 8, padding: 20, marginBottom: 16,
    }}>
      <h3 style={{ color: theme.purple, fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
        ✅ Code Review Checklist
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          "Connection is acquired within a try/defer (Go) or try-with-resources (Java/TS) — not manually released in a finally block",
          "No connection acquired outside of a request scope (e.g., stored as a struct field shared across requests)",
          "Transaction duration bounded — no user I/O, external HTTP calls, or sleeps while a connection is held",
          "Pool size configured explicitly — not left at library default (HikariCP default = 10, which is fine; pgxpool default = 4)",
          "connectionTimeout / acquire_timeout is set — not default 30s which can cause thread pile-up",
          "maxLifetime < server idle_in_transaction_session_timeout — prevents stale connections",
          "In serverless: no in-process pool — external pooler used instead",
          "After fork() in multiprocess app: connections are re-acquired, not inherited from parent",
          "No prepared statement usage when connecting through pgBouncer transaction mode",
          "Observability: pool metrics (active, idle, waiting) are exported to metrics system",
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: 8, alignItems: "flex-start",
            padding: "8px 10px", background: "#0f1117",
            borderRadius: 5, border: `1px solid ${theme.border}33`,
          }}>
            <span style={{ color: theme.purple, fontSize: 14, flexShrink: 0 }}>□</span>
            <span style={{ color: theme.textMuted, fontSize: 12, lineHeight: 1.55 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Design review questions */}
    <div style={{
      background: theme.surface, border: `1px solid ${theme.green}44`,
      borderLeft: `3px solid ${theme.green}`, borderRadius: 8, padding: 20,
    }}>
      <h3 style={{ color: theme.green, fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
        💬 Questions for Design Review
      </h3>
      {[
        "What is the deployment model? (long-running process, serverless function, container with HPA?) — the answer determines whether in-process or external pooling is appropriate.",
        "What is the target DB's max_connections? How many app instances are expected at peak? Does (instances × pool_size) fit within that limit with headroom?",
        "Does the application use prepared statements? If yes, and you're planning to use pgBouncer transaction mode, how will you handle this — disable at driver level or use session mode?",
        "What happens when the pool is exhausted? Is there a circuit breaker? Does the caller surface an error, queue, or crash? Is the behavior tested under load?",
        "How are connection errors during DB failover handled? Does the pool detect and evict dead connections? What is the recovery time objective for connection pool recovery after failover?",
        "Are pool metrics exported? Can we page on pool exhaustion? Do we have a runbook for 'pool saturated' alerts?",
      ].map((q, i) => (
        <div key={i} style={{
          marginBottom: 10, paddingBottom: 10,
          borderBottom: i < 5 ? `1px solid ${theme.border}22` : "none",
          display: "flex", gap: 10,
        }}>
          <span style={{ color: theme.green, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>Q{i + 1}.</span>
          <span style={{ color: theme.textMuted, fontSize: 13, lineHeight: 1.6 }}>{q}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const TABS = [
  { id: "arch", label: "Architecture" },
  { id: "concepts", label: "Core Concepts" },
  { id: "impl", label: "Implementations" },
  { id: "leadership", label: "Leadership" },
];

export default function ConnectionPooling() {
  const [tab, setTab] = useState("arch");

  return (
    <div style={{
      background: theme.bg, minHeight: "100vh",
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: theme.text,
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${theme.border}`,
        background: "#0d1017",
        padding: "18px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: theme.green, boxShadow: `0 0 8px ${theme.green}`,
            }} />
            <span style={{ color: theme.textMuted, fontSize: 11, letterSpacing: "1px", textTransform: "uppercase" }}>
              Infrastructure Pattern
            </span>
          </div>
          <h1 style={{ color: theme.text, fontSize: 22, fontWeight: 700, margin: "4px 0 0", letterSpacing: "-0.5px" }}>
            Connection Pooling
          </h1>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "HikariCP", color: theme.amber },
            { label: "pgBouncer", color: theme.blue },
            { label: "pgxpool", color: theme.green },
            { label: "RDS Proxy", color: theme.aws },
          ].map(b => (
            <span key={b.label} style={{
              background: `${b.color}18`, border: `1px solid ${b.color}44`,
              color: b.color, padding: "2px 10px", borderRadius: 4,
              fontSize: 11, fontWeight: 600,
            }}>{b.label}</span>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 0, borderBottom: `1px solid ${theme.border}`,
        background: "#0d1017", paddingLeft: 16, overflowX: "auto",
      }}>
        {TABS.map((t, i) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "transparent",
            borderBottom: tab === t.id ? `2px solid ${theme.blue}` : "2px solid transparent",
            border: "none", borderTop: "none", borderLeft: "none", borderRight: "none",
            color: tab === t.id ? theme.text : theme.textMuted,
            padding: "12px 20px", fontSize: 13, cursor: "pointer",
            fontWeight: tab === t.id ? 600 : 400,
            fontFamily: "inherit",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}>
            {i + 1}. {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "28px 28px", maxWidth: 1100 }}>
        {tab === "arch" && <ArchitectureTab />}
        {tab === "concepts" && <ConceptsTab />}
        {tab === "impl" && <ImplementationsTab />}
        {tab === "leadership" && <LeadershipTab />}
      </div>
    </div>
  );
}
