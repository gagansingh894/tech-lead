"use client"

import { useState } from "react";

const colors = {
  bg: "#0f1117",
  surface: "#1a1d24",
  border: "#2d3139",
  text: "#e5e7eb",
  muted: "#9ca3af",
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  red: "#ef4444",
  aws: "#ff9900",
  azure: "#0078d4",
  gcp: "#4285f4",
};

const TAB_LABELS = ["Architecture", "Core Concepts", "Implementations", "Leadership"];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function TabBar({ tabs, active, setActive, accent }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${colors.border}`, marginBottom: 24 }}>
      {tabs.map((t, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          style={{
            padding: "10px 18px",
            background: "none",
            border: "none",
            borderBottom: active === i ? `2px solid ${accent || colors.blue}` : "2px solid transparent",
            color: active === i ? colors.text : colors.muted,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: active === i ? 600 : 400,
            whiteSpace: "nowrap",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function Badge({ children, color }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 600,
      background: color + "22",
      color,
      border: `1px solid ${color}44`,
      marginRight: 6,
    }}>
      {children}
    </span>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      padding: 20,
      marginBottom: 16,
      ...style,
    }}>
      {children}
    </div>
  );
}

function CodeBlock({ code, language, filename }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <div style={{ marginBottom: 16 }}>
      {filename && (
        <div style={{
          background: "#161b22",
          borderRadius: "6px 6px 0 0",
          padding: "6px 14px",
          fontSize: 11,
          color: colors.muted,
          borderBottom: `1px solid ${colors.border}`,
          fontFamily: "monospace",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span>{filename}</span>
          <button onClick={copy} style={{
            background: copied ? colors.green + "22" : "#2d3139",
            border: "none",
            color: copied ? colors.green : colors.muted,
            borderRadius: 4,
            padding: "2px 10px",
            cursor: "pointer",
            fontSize: 11,
            fontFamily: "inherit",
          }}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <pre style={{
        background: "#161b22",
        borderRadius: filename ? "0 0 6px 6px" : 6,
        padding: "16px 14px",
        margin: 0,
        overflowX: "auto",
        fontSize: 12,
        lineHeight: 1.65,
        color: "#e5e7eb",
        fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Tab 1: Architecture ──────────────────────────────────────────────────────

function ArchitectureTab() {
  return (
    <div>
      <h2 style={{ color: colors.text, fontWeight: 600, marginBottom: 6, fontSize: 18 }}>
        Backpressure: Data Flow & Signal Propagation
      </h2>
      <p style={{ color: colors.muted, marginBottom: 24, fontSize: 13 }}>
        Backpressure propagates <em>upstream</em> — the load signal travels opposite to the data direction, allowing the system to self-regulate rather than cascade into failure.
      </p>

      {/* Main Diagram */}
      <Card>
        <svg viewBox="0 0 820 420" style={{ width: "100%", maxWidth: 820, display: "block", margin: "0 auto" }}>
          <defs>
            <marker id="arrowData" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={colors.blue} />
            </marker>
            <marker id="arrowBP" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={colors.red} />
            </marker>
            <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={colors.green} />
            </marker>
            <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={colors.amber} />
            </marker>
          </defs>

          {/* Background */}
          <rect width="820" height="420" fill="#161b22" rx="8" />

          {/* Title */}
          <text x="410" y="28" fill={colors.muted} fontSize="12" textAnchor="middle" fontFamily="sans-serif">
            Producer → Buffer → Consumer Chain with Backpressure Propagation
          </text>

          {/* --- NODES --- */}
          {/* Producer */}
          <rect x="30" y="155" width="120" height="60" rx="8" fill="#1a1d24" stroke={colors.blue} strokeWidth="2" />
          <text x="90" y="180" fill={colors.blue} fontSize="12" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">Producer</text>
          <text x="90" y="196" fill={colors.muted} fontSize="10" textAnchor="middle" fontFamily="sans-serif">200 msg/s</text>
          <text x="90" y="208" fill={colors.muted} fontSize="10" textAnchor="middle" fontFamily="sans-serif">push/pull rate</text>

          {/* Rate Limiter */}
          <rect x="205" y="155" width="110" height="60" rx="8" fill="#1a1d24" stroke={colors.amber} strokeWidth="2" />
          <text x="260" y="178" fill={colors.amber} fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">Rate Limiter</text>
          <text x="260" y="194" fill={colors.muted} fontSize="10" textAnchor="middle" fontFamily="sans-serif">Token Bucket /</text>
          <text x="260" y="206" fill={colors.muted} fontSize="10" textAnchor="middle" fontFamily="sans-serif">Leaky Bucket</text>

          {/* Bounded Queue / Buffer */}
          <rect x="370" y="140" width="130" height="90" rx="8" fill="#1a1d24" stroke={colors.purple} strokeWidth="2" />
          <text x="435" y="165" fill={colors.purple} fontSize="12" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">Bounded Queue</text>
          <text x="435" y="181" fill={colors.muted} fontSize="10" textAnchor="middle" fontFamily="sans-serif">in-memory / Kafka</text>
          {/* Queue fill visual */}
          <rect x="382" y="192" width="96" height="10" rx="3" fill="#2d3139" />
          <rect x="382" y="192" width="72" height="10" rx="3" fill={colors.amber} opacity="0.8" />
          <text x="435" y="217" fill={colors.amber} fontSize="9" textAnchor="middle" fontFamily="sans-serif">75% full</text>

          {/* Consumer */}
          <rect x="560" y="155" width="120" height="60" rx="8" fill="#1a1d24" stroke={colors.green} strokeWidth="2" />
          <text x="620" y="180" fill={colors.green} fontSize="12" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">Consumer</text>
          <text x="620" y="196" fill={colors.muted} fontSize="10" textAnchor="middle" fontFamily="sans-serif">50 msg/s</text>
          <text x="620" y="208" fill={colors.muted} fontSize="10" textAnchor="middle" fontFamily="sans-serif">slow processor</text>

          {/* Downstream DB */}
          <rect x="730" y="155" width="70" height="60" rx="8" fill="#1a1d24" stroke={colors.purple} strokeWidth="2" />
          <text x="765" y="183" fill={colors.purple} fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">Storage</text>
          <text x="765" y="198" fill={colors.muted} fontSize="10" textAnchor="middle" fontFamily="sans-serif">DB / Sink</text>

          {/* --- DATA FLOW ARROWS (top row) --- */}
          {/* Producer → Rate Limiter */}
          <line x1="150" y1="185" x2="205" y2="185" stroke={colors.blue} strokeWidth="2" markerEnd="url(#arrowData)" />
          <text x="178" y="176" fill={colors.blue} fontSize="9" textAnchor="middle" fontFamily="sans-serif">requests</text>

          {/* Rate Limiter → Queue */}
          <line x1="315" y1="185" x2="370" y2="185" stroke={colors.blue} strokeWidth="2" markerEnd="url(#arrowData)" />
          <text x="343" y="176" fill={colors.blue} fontSize="9" textAnchor="middle" fontFamily="sans-serif">throttled</text>

          {/* Queue → Consumer */}
          <line x1="500" y1="185" x2="560" y2="185" stroke={colors.blue} strokeWidth="2" markerEnd="url(#arrowData)" />
          <text x="530" y="176" fill={colors.blue} fontSize="9" textAnchor="middle" fontFamily="sans-serif">dequeue</text>

          {/* Consumer → DB */}
          <line x1="680" y1="185" x2="730" y2="185" stroke={colors.blue} strokeWidth="2" markerEnd="url(#arrowData)" />
          <text x="705" y="176" fill={colors.blue} fontSize="9" textAnchor="middle" fontFamily="sans-serif">write</text>

          {/* --- BACKPRESSURE SIGNALS (bottom row) --- */}
          {/* DB → Consumer backpressure */}
          <path d="M730,225 L680,225" stroke={colors.red} strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arrowBP)" fill="none" />
          <text x="705" y="240" fill={colors.red} fontSize="9" textAnchor="middle" fontFamily="sans-serif">slow ack</text>

          {/* Consumer → Queue backpressure */}
          <path d="M560,225 L500,225" stroke={colors.red} strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arrowBP)" fill="none" />
          <text x="530" y="240" fill={colors.red} fontSize="9" textAnchor="middle" fontFamily="sans-serif">queue full signal</text>

          {/* Queue → Rate Limiter backpressure */}
          <path d="M370,225 L315,225" stroke={colors.red} strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arrowBP)" fill="none" />
          <text x="343" y="240" fill={colors.red} fontSize="9" textAnchor="middle" fontFamily="sans-serif">429 / pause</text>

          {/* Rate Limiter → Producer backpressure */}
          <path d="M205,225 L150,225" stroke={colors.red} strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arrowBP)" fill="none" />
          <text x="178" y="240" fill={colors.red} fontSize="9" textAnchor="middle" fontFamily="sans-serif">slow down</text>

          {/* --- STRATEGIES BOX --- */}
          {/* Load Shed box */}
          <rect x="30" y="290" width="130" height="95" rx="6" fill="#1a1d24" stroke={colors.red} strokeWidth="1.5" />
          <text x="95" y="308" fill={colors.red} fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">Load Shedding</text>
          <text x="95" y="323" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Drop low-priority</text>
          <text x="95" y="336" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">requests on overflow.</text>
          <text x="95" y="349" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Explicit degradation</text>
          <text x="95" y="362" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">over silent failure.</text>
          <text x="95" y="376" fill={colors.amber} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">HTTP 503 / 429</text>

          {/* Pull-based */}
          <rect x="175" y="290" width="130" height="95" rx="6" fill="#1a1d24" stroke={colors.blue} strokeWidth="1.5" />
          <text x="240" y="308" fill={colors.blue} fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">Pull-based Flow</text>
          <text x="240" y="323" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Consumer requests(n)</text>
          <text x="240" y="336" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">items. Producer waits</text>
          <text x="240" y="349" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">for demand signal.</text>
          <text x="240" y="362" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Kafka, Reactive</text>
          <text x="240" y="376" fill={colors.green} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Streams (JVM)</text>

          {/* Buffering */}
          <rect x="320" y="290" width="130" height="95" rx="6" fill="#1a1d24" stroke={colors.purple} strokeWidth="1.5" />
          <text x="385" y="308" fill={colors.purple} fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">Bounded Buffer</text>
          <text x="385" y="323" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Queue absorbs bursts.</text>
          <text x="385" y="336" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Must be bounded —</text>
          <text x="385" y="349" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">unbounded queues</text>
          <text x="385" y="362" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">hide failure until</text>
          <text x="385" y="376" fill={colors.red} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">OOM crash.</text>

          {/* Rate Limiting */}
          <rect x="465" y="290" width="130" height="95" rx="6" fill="#1a1d24" stroke={colors.amber} strokeWidth="1.5" />
          <text x="530" y="308" fill={colors.amber} fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">Rate Limiting</text>
          <text x="530" y="323" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Token / leaky bucket</text>
          <text x="530" y="336" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">caps producer rate.</text>
          <text x="530" y="349" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Window: fixed,</text>
          <text x="530" y="362" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">sliding, token-bucket.</text>
          <text x="530" y="376" fill={colors.green} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Retry-After header</text>

          {/* Circuit Breaker */}
          <rect x="610" y="290" width="175" height="95" rx="6" fill="#1a1d24" stroke={colors.green} strokeWidth="1.5" />
          <text x="697" y="308" fill={colors.green} fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">Circuit Breaker</text>
          <text x="697" y="323" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Stops calls to failing</text>
          <text x="697" y="336" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">downstream. Prevents</text>
          <text x="697" y="349" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">thread pool exhaustion.</text>
          <text x="697" y="362" fill={colors.muted} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">States: Closed →</text>
          <text x="697" y="376" fill={colors.amber} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">Open → Half-Open</text>

          {/* Legend */}
          <rect x="30" y="50" width="340" height="82" rx="6" fill="#161b22" stroke={colors.border} strokeWidth="1" />
          <text x="45" y="68" fill={colors.muted} fontSize="10" fontFamily="sans-serif" fontWeight="600">LEGEND</text>
          <line x1="45" y1="78" x2="85" y2="78" stroke={colors.blue} strokeWidth="2" markerEnd="url(#arrowData)" />
          <text x="92" y="82" fill={colors.blue} fontSize="10" fontFamily="sans-serif">Data flow (forward)</text>
          <line x1="170" y1="78" x2="210" y2="78" stroke={colors.red} strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arrowBP)" />
          <text x="217" y="82" fill={colors.red} fontSize="10" fontFamily="sans-serif">Backpressure signal (upstream)</text>
          <rect x="45" y="88" width="12" height="12" rx="2" fill={colors.blue + "33"} stroke={colors.blue} strokeWidth="1.5" />
          <text x="62" y="99" fill={colors.muted} fontSize="10" fontFamily="sans-serif">Producer / Input</text>
          <rect x="130" y="88" width="12" height="12" rx="2" fill={colors.green + "33"} stroke={colors.green} strokeWidth="1.5" />
          <text x="147" y="99" fill={colors.muted} fontSize="10" fontFamily="sans-serif">Consumer / Output</text>
          <rect x="235" y="88" width="12" height="12" rx="2" fill={colors.purple + "33"} stroke={colors.purple} strokeWidth="1.5" />
          <text x="252" y="99" fill={colors.muted} fontSize="10" fontFamily="sans-serif">Storage / Buffer</text>
          <rect x="45" y="108" width="12" height="12" rx="2" fill={colors.amber + "33"} stroke={colors.amber} strokeWidth="1.5" />
          <text x="62" y="119" fill={colors.muted} fontSize="10" fontFamily="sans-serif">Rate control</text>
          <rect x="130" y="108" width="12" height="12" rx="2" fill={colors.red + "33"} stroke={colors.red} strokeWidth="1.5" />
          <text x="147" y="119" fill={colors.muted} fontSize="10" fontFamily="sans-serif">Load shedding / Error</text>

          {/* Bottleneck label */}
          <text x="410" y="55" fill={colors.muted} fontSize="10" textAnchor="middle" fontFamily="sans-serif" fontStyle="italic">
            System throughput = rate of slowest component (50 msg/s bottleneck)
          </text>
        </svg>
      </Card>

      {/* Cloud Mapping Table */}
      <h3 style={{ color: colors.text, fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Cloud Provider Mapping</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#161b22" }}>
              {["Component", "AWS", "Azure", "GCP", "Notes"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: colors.muted, fontWeight: 600, borderBottom: `1px solid ${colors.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Bounded Queue / Buffer", "SQS (max depth, DLQ)", "Service Bus (max size, DLQ)", "Cloud Tasks / Pub/Sub", "SQS has per-queue depth limits; Pub/Sub has per-subscription flow control"],
              ["Rate Limiter", "API Gateway throttling, WAF rate rules", "API Management policies", "Cloud Armor, Apigee", "All support token-bucket; AWS supports per-method/stage limits"],
              ["Circuit Breaker", "App Mesh / Envoy (Resilience Hub)", "Azure API Management (circuit breaker policy)", "Traffic Director / Envoy", "Netflix Hystrix widely referenced; now superseded by Resilience4j"],
              ["Stream Backpressure", "Kinesis (GetRecords limit), MSK (Kafka)", "Event Hubs (consumer group lag)", "Pub/Sub (subscriber ack deadline)", "Kafka (MSK/Confluent) is the de-facto standard for pull-based streaming BP"],
              ["Load Shedding", "ALB / NLB connection limits, Lambda concurrency limits", "Azure Load Balancer, Function concurrency", "Cloud Load Balancing, Cloud Run max concurrency", "Configure 429/503 responses; Retry-After header critical for cooperative callers"],
              ["Observability (queue depth)", "CloudWatch: ApproximateNumberOfMessagesVisible", "Azure Monitor: ActiveMessages", "Cloud Monitoring: subscription/num_undelivered_messages", "Alert on sustained growth, not just absolute threshold"],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? colors.surface : "#161b22" }}>
                <td style={{ padding: "10px 14px", color: colors.text, fontWeight: 600, borderBottom: `1px solid ${colors.border}` }}>{row[0]}</td>
                <td style={{ padding: "10px 14px", color: colors.aws, borderBottom: `1px solid ${colors.border}` }}>{row[1]}</td>
                <td style={{ padding: "10px 14px", color: colors.azure, borderBottom: `1px solid ${colors.border}` }}>{row[2]}</td>
                <td style={{ padding: "10px 14px", color: colors.gcp, borderBottom: `1px solid ${colors.border}` }}>{row[3]}</td>
                <td style={{ padding: "10px 14px", color: colors.muted, borderBottom: `1px solid ${colors.border}`, fontSize: 11 }}>{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 2: Core Concepts ─────────────────────────────────────────────────────

function ConceptCard({ term, source, def, why, mistake, example }) {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ color: colors.text, fontWeight: 600, fontSize: 14 }}>{term}</span>
        {source && <span style={{ color: colors.muted, fontSize: 11 }}>as defined by: {source}</span>}
      </div>
      <p style={{ color: colors.text, fontSize: 13, margin: "0 0 8px 0", lineHeight: 1.6 }}>{def}</p>
      <p style={{ color: colors.green, fontSize: 12, margin: "0 0 6px 0" }}><strong>Why it matters:</strong> {why}</p>
      <p style={{ color: colors.amber, fontSize: 12, margin: "0 0 6px 0" }}><strong>Common mistake:</strong> {mistake}</p>
      {example && <p style={{ color: colors.muted, fontSize: 12, margin: 0 }}><strong>Real-world:</strong> {example}</p>}
    </Card>
  );
}

function ConceptsTab() {
  return (
    <div>
      <ConceptCard
        term="Backpressure"
        source="Reactive Manifesto, Kleppmann — DDIA Ch.11"
        def="A flow-control feedback mechanism where a slower downstream component signals upstream components to reduce their emission rate, preventing unbounded buffer growth, OOM errors, and cascading failure. The signal travels opposite to data direction."
        why="Without it, any throughput mismatch between producer and consumer accumulates as in-flight work. At sufficient scale this exhausts memory, fills thread pools, or triggers retry storms that amplify the original overload."
        mistake="Treating backpressure as optional — adding unbounded queues 'just in case'. An unbounded queue converts a resource-exhaustion failure into a delayed, harder-to-diagnose OOM crash. Every queue must have a maximum size."
        example="The Reactive Manifesto (2014) codified backpressure as a first-class concern for resilient systems. Apache Flink propagates backpressure automatically by sampling task thread stacks; when a downstream operator is busy, its input buffers fill and the upstream operator naturally stalls."
      />
      <ConceptCard
        term="Bounded Queue (The First Law of Queues)"
        source="Ted Dziuba / distributed systems lore"
        def="A queue with a hard cap on depth. When full, the system must take an explicit action: reject (return error), drop (shed load), or block the producer. The choice depends on whether the caller can handle errors cooperatively."
        why="Boundedness makes failure explicit and local. An unbounded queue causes the failure to surface far from its origin — typically as an OOM on the JVM heap hours later, during peak traffic, making root cause harder to identify."
        mistake="Defaulting to Integer.MAX_VALUE or unbounded channel sizes. Queues of size zero (direct handoff) are also valid — they effectively become load balancers and force synchronous capacity matching."
        example="Kafka topics are persistent bounded logs. Consumer lag (offset difference between latest produced and latest consumed) is the observable form of backpressure in Kafka's pull model."
      />
      <ConceptCard
        term="Load Shedding"
        source="Google SRE Book; widely used at AWS, Google, Meta"
        def="Deliberately rejecting or dropping lower-priority requests when a system is over capacity, in order to protect higher-priority work and maintain partial availability rather than total failure."
        why="Partial service is almost always preferable to total outage. Without load shedding, all requests degrade uniformly; with it, critical paths (e.g., checkout vs. recommendations) can be prioritized explicitly."
        mistake="Shedding load without informing callers. A 503 with no Retry-After header causes exponential retry storms. A 429 with Retry-After header enables cooperative back-off. Callers that don't respect headers need server-side circuit breakers."
        example="Google's Bigtable and Spanner shed load at the RPC layer. Cloudflare's CDN infrastructure applies load shedding during live event traffic spikes to protect origin servers while continuing to serve cached content."
      />
      <ConceptCard
        term="Pull-based Flow Control (Demand Signaling)"
        source="Reactive Streams Specification (JVM); Kleppmann DDIA"
        def="Consumers explicitly request(n) items from producers. The producer sends at most n items before waiting for the next demand signal. This inverts the default push model: the consumer's capacity becomes the natural rate limiter."
        why="Push-based systems require the producer to know the consumer's capacity in advance, which is fragile. Pull-based systems decouple this — the consumer requests exactly as much as it can handle, and the system self-regulates without any rate negotiation."
        mistake="Confusing Kafka's pull model with Reactive Streams demand signaling. Kafka consumers pull from brokers at their own pace (implicit backpressure via consumer lag), but there is no signal back to producers — lag grows silently until retention expires and data is lost."
        example="Project Reactor (used in Spring WebFlux) and RxJava implement the Reactive Streams specification. The subscriber.request(n) API makes demand explicit in the type system. Kafka's consumer.pause(partitions) / resume(partitions) API is a coarser-grained version of the same concept."
      />
      <ConceptCard
        term="Circuit Breaker"
        source="Michael Nygard — Release It! (2nd ed); Martin Fowler"
        def="A stateful proxy that stops forwarding requests to a failing downstream dependency after a failure threshold is crossed. States: Closed (normal), Open (failing fast), Half-Open (probing recovery). Decouples the caller's health from the dependency's health."
        why="Without a circuit breaker, a slow downstream service exhausts the caller's thread pool as requests pile up waiting for timeouts. A 30-second timeout × 100 concurrent requests = thread pool exhausted before the first timeout fires."
        mistake="Using circuit breakers as a substitute for backpressure rather than a complement. Circuit breakers handle the slow-dependency failure mode; bounded queues and rate limiting handle the overload failure mode. Both are needed."
        example="Netflix Hystrix (now in maintenance mode) popularized the pattern. Resilience4j is the current JVM standard. Envoy/Istio implement circuit breakers at the mesh layer, separating resilience concerns from application code."
      />
      <ConceptCard
        term="Cascading Failure"
        source="Patterns in distributed systems; formalized in Google SRE Book"
        def="A failure mode where overload or error in one component propagates upstream, causing healthy components to also fail as their queues fill and thread pools exhaust — eventually taking down the entire call chain."
        why="Cascading failures are the primary catastrophic failure mode in microservice architectures. A single slow database can cause every service that calls it to exhaust its thread pool, turning a slow dependency into a total outage."
        mistake="Believing that retry logic prevents cascading failures. Uncoordinated retries amplify load on an already struggling system (retry storm). Retries should only occur at system edges, with exponential backoff + jitter, and only when circuit breakers are open."
        example="A transformer outage bringing back up an entire data center can cause every service to simultaneously query its database, exhausting DB connection pools — a textbook cascading failure from burst reconnect storms."
      />
      <ConceptCard
        term="TCP Flow Control (Analogy Foundation)"
        source="RFC 793; referenced in Reactive Manifesto as foundational precedent"
        def="TCP's receiver advertises a receive window (rwnd) — the amount of unacknowledged data it can buffer. The sender limits in-flight bytes to min(cwnd, rwnd). When the window reaches zero, the sender blocks. This is hardware-level backpressure."
        why="TCP flow control is the foundational proof that backpressure works at scale. HTTP/2 (and therefore gRPC) inherits per-stream flow control windows — a slow client automatically slows a streaming server at the transport layer, without any application code."
        mistake="Assuming TCP flow control is sufficient for application-level backpressure. TCP operates on bytes; application queues operate on logical messages. A 65KB TCP window can contain thousands of small messages that all require processing resources beyond bandwidth."
        example="gRPC server-streaming RPCs: a slow client that doesn't read responses fills the HTTP/2 flow control window, which blocks the server's send side, which propagates to the handler — automatic application-level backpressure with zero extra code."
      />

      {/* Trade-offs */}
      <Card style={{ borderColor: colors.amber + "55" }}>
        <h3 style={{ color: colors.amber, fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Trade-offs: When to Use / When to Avoid</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <p style={{ color: colors.green, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Apply when:</p>
            {[
              "Producer rate can exceed consumer rate by any sustained margin",
              "Downstream dependencies have variable latency (DB, external API)",
              "System must maintain partial availability under peak load",
              "Retry storms are a risk (any system with client-side retry logic)",
              "Processing pipelines span multiple services (each hop adds risk)",
            ].map((t, i) => (
              <p key={i} style={{ color: colors.text, fontSize: 12, margin: "0 0 6px 16px", lineHeight: 1.5 }}>• {t}</p>
            ))}
          </div>
          <div>
            <p style={{ color: colors.red, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Be cautious when:</p>
            {[
              "Applying load shedding to idempotent writes without surfacing errors — silent drops are worse than explicit failures",
              "Using circuit breakers as a substitute for fixing slow dependencies",
              "Setting buffer sizes without measuring actual burst profiles",
              "Treating Kafka consumer lag as benign — lag beyond retention = permanent data loss",
              "Implementing backpressure at only one layer in a multi-hop chain",
            ].map((t, i) => (
              <p key={i} style={{ color: colors.text, fontSize: 12, margin: "0 0 6px 16px", lineHeight: 1.5 }}>• {t}</p>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Tab 3: Implementations ───────────────────────────────────────────────────

const LANGS = ["Go", "Python", "TypeScript", "Rust", "Java 21"];

const coreCode = {
  Go: `// Pattern: Backpressure via Bounded Channel + Rate Limiter + Circuit Breaker
// Reference: Kleppmann DDIA Ch.11; Release It! (Nygard)
// Production note: Replace in-memory channel with durable queue (SQS/Kafka) for crash safety.

package backpressure

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

// ─── Domain Types ────────────────────────────────────────────────────────────

type Message struct {
	ID      string
	Payload []byte
}

type ProcessResult struct {
	MessageID string
	Err       error
}

var (
	ErrQueueFull     = errors.New("queue full: backpressure applied")
	ErrCircuitOpen   = errors.New("circuit open: downstream unavailable")
	ErrRateLimited   = errors.New("rate limited: slow down producer")
)

// ─── Bounded Queue ────────────────────────────────────────────────────────────

// BoundedQueue is a fixed-capacity channel-backed queue.
// When full, Enqueue returns ErrQueueFull immediately (non-blocking).
type BoundedQueue struct {
	ch       chan Message
	capacity int
}

func NewBoundedQueue(capacity int) *BoundedQueue {
	return &BoundedQueue{ch: make(chan Message, capacity), capacity: capacity}
}

// Enqueue attempts a non-blocking send. Returns ErrQueueFull if at capacity.
func (q *BoundedQueue) Enqueue(msg Message) error {
	select {
	case q.ch <- msg:
		return nil
	default:
		return ErrQueueFull
	}
}

func (q *BoundedQueue) Dequeue() <-chan Message { return q.ch }

func (q *BoundedQueue) Depth() int { return len(q.ch) }

func (q *BoundedQueue) FillRatio() float64 {
	return float64(len(q.ch)) / float64(q.capacity)
}

// ─── Token Bucket Rate Limiter ────────────────────────────────────────────────

type TokenBucket struct {
	mu       sync.Mutex
	tokens   float64
	rate     float64 // tokens per second
	capacity float64
	lastFill time.Time
}

func NewTokenBucket(ratePerSec float64, capacity float64) *TokenBucket {
	return &TokenBucket{
		tokens:   capacity,
		rate:     ratePerSec,
		capacity: capacity,
		lastFill: time.Now(),
	}
}

// Allow consumes one token. Returns ErrRateLimited if no tokens available.
func (tb *TokenBucket) Allow() error {
	tb.mu.Lock()
	defer tb.mu.Unlock()

	now := time.Now()
	elapsed := now.Sub(tb.lastFill).Seconds()
	tb.tokens = min(tb.capacity, tb.tokens+elapsed*tb.rate)
	tb.lastFill = now

	if tb.tokens < 1 {
		return ErrRateLimited
	}
	tb.tokens--
	return nil
}

// ─── Circuit Breaker ──────────────────────────────────────────────────────────

type CBState int

const (
	CBClosed   CBState = iota // Normal: pass requests through
	CBOpen                    // Failing fast: reject all requests
	CBHalfOpen                // Probing: allow one request to test recovery
)

type CircuitBreaker struct {
	mu               sync.Mutex
	state            CBState
	failures         int
	threshold        int
	halfOpenAttempts int32
	resetTimeout     time.Duration
	openedAt         time.Time
}

func NewCircuitBreaker(failureThreshold int, resetTimeout time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		state:        CBClosed,
		threshold:    failureThreshold,
		resetTimeout: resetTimeout,
	}
}

func (cb *CircuitBreaker) Allow() error {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	switch cb.state {
	case CBOpen:
		if time.Since(cb.openedAt) > cb.resetTimeout {
			cb.state = CBHalfOpen
			cb.halfOpenAttempts = 0
			return nil // Allow one probe request
		}
		return ErrCircuitOpen
	case CBHalfOpen:
		if atomic.AddInt32(&cb.halfOpenAttempts, 1) > 1 {
			return ErrCircuitOpen // Only one concurrent probe
		}
		return nil
	default:
		return nil
	}
}

func (cb *CircuitBreaker) RecordSuccess() {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	cb.failures = 0
	cb.state = CBClosed
}

func (cb *CircuitBreaker) RecordFailure() {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	cb.failures++
	if cb.failures >= cb.threshold {
		cb.state = CBOpen
		cb.openedAt = time.Now()
	}
}

// ─── Pipeline: Producer → Queue → Consumer → Downstream ──────────────────────

type Downstream interface {
	Process(ctx context.Context, msg Message) error
}

type Pipeline struct {
	queue   *BoundedQueue
	limiter *TokenBucket
	breaker *CircuitBreaker
	down    Downstream
}

func NewPipeline(queueCap int, ratePerSec float64, cbThreshold int, down Downstream) *Pipeline {
	return &Pipeline{
		queue:   NewBoundedQueue(queueCap),
		limiter: NewTokenBucket(ratePerSec, ratePerSec*2), // burst = 2s of tokens
		breaker: NewCircuitBreaker(cbThreshold, 10*time.Second),
		down:    down,
	}
}

// Publish applies rate limiting then enqueues. Returns specific backpressure error.
func (p *Pipeline) Publish(msg Message) error {
	if err := p.limiter.Allow(); err != nil {
		return fmt.Errorf("publish rejected: %w", err)
	}
	if err := p.queue.Enqueue(msg); err != nil {
		return fmt.Errorf("publish rejected: %w (queue fill: %.0f%%)", err, p.queue.FillRatio()*100)
	}
	return nil
}

// Run starts the consumer loop. Respects context cancellation.
func (p *Pipeline) Run(ctx context.Context) <-chan ProcessResult {
	results := make(chan ProcessResult, 64)

	go func() {
		defer close(results)
		for {
			select {
			case <-ctx.Done():
				return
			case msg, ok := <-p.queue.Dequeue():
				if !ok {
					return
				}

				if err := p.breaker.Allow(); err != nil {
					results <- ProcessResult{MessageID: msg.ID, Err: err}
					continue
				}

				if err := p.down.Process(ctx, msg); err != nil {
					p.breaker.RecordFailure()
					results <- ProcessResult{MessageID: msg.ID, Err: err}
				} else {
					p.breaker.RecordSuccess()
					results <- ProcessResult{MessageID: msg.ID}
				}
			}
		}
	}()

	return results
}

func min(a, b float64) float64 {
	if a < b {
		return a
	}
	return b
}`,

  Python: `# Pattern: Backpressure via Bounded Queue + Token Bucket + Circuit Breaker
# Reference: Kleppmann DDIA Ch.11; Release It! (Nygard)
# Production note: asyncio.Queue is in-memory only; use Redis Streams or Kafka for persistence.

from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import AsyncIterator, Protocol


# ─── Domain Types ────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class Message:
    id: str
    payload: bytes


@dataclass(frozen=True)
class ProcessResult:
    message_id: str
    error: Exception | None = None

    @property
    def ok(self) -> bool:
        return self.error is None


class BackpressureError(Exception):
    """Base for all backpressure-related rejections."""


class QueueFullError(BackpressureError):
    pass


class RateLimitedError(BackpressureError):
    pass


class CircuitOpenError(BackpressureError):
    pass


# ─── Bounded Queue ────────────────────────────────────────────────────────────

class BoundedQueue:
    """asyncio.Queue wrapper with non-blocking enqueue and fill metrics."""

    def __init__(self, capacity: int) -> None:
        self._q: asyncio.Queue[Message] = asyncio.Queue(maxsize=capacity)
        self._capacity = capacity

    def enqueue(self, msg: Message) -> None:
        """Non-blocking. Raises QueueFullError if at capacity."""
        try:
            self._q.put_nowait(msg)
        except asyncio.QueueFull as exc:
            raise QueueFullError(
                f"Queue full ({self._q.qsize()}/{self._capacity})"
            ) from exc

    async def dequeue(self) -> Message:
        return await self._q.get()

    @property
    def depth(self) -> int:
        return self._q.qsize()

    @property
    def fill_ratio(self) -> float:
        return self._q.qsize() / self._capacity


# ─── Token Bucket Rate Limiter ────────────────────────────────────────────────

class TokenBucket:
    """Thread-safe token bucket. Burst capacity = 2× steady-state rate."""

    def __init__(self, rate_per_sec: float) -> None:
        self._rate = rate_per_sec
        self._capacity = rate_per_sec * 2.0
        self._tokens = self._capacity
        self._last_fill = time.monotonic()
        self._lock = asyncio.Lock()

    async def allow(self) -> None:
        """Consume one token. Raises RateLimitedError if bucket empty."""
        async with self._lock:
            now = time.monotonic()
            elapsed = now - self._last_fill
            self._tokens = min(self._capacity, self._tokens + elapsed * self._rate)
            self._last_fill = now

            if self._tokens < 1.0:
                raise RateLimitedError(
                    f"Rate limit exceeded ({self._rate:.0f} req/s)"
                )
            self._tokens -= 1.0


# ─── Circuit Breaker ──────────────────────────────────────────────────────────

class CBState(Enum):
    CLOSED = auto()
    OPEN = auto()
    HALF_OPEN = auto()


@dataclass
class CircuitBreaker:
    failure_threshold: int
    reset_timeout: float  # seconds

    _state: CBState = field(default=CBState.CLOSED, init=False)
    _failures: int = field(default=0, init=False)
    _opened_at: float = field(default=0.0, init=False)
    _half_open_probe_in_flight: bool = field(default=False, init=False)

    def allow(self) -> None:
        """Raises CircuitOpenError when open; allows one probe when half-open."""
        match self._state:
            case CBState.OPEN:
                if time.monotonic() - self._opened_at > self.reset_timeout:
                    self._state = CBState.HALF_OPEN
                    self._half_open_probe_in_flight = False
                else:
                    raise CircuitOpenError("Circuit breaker open")
            case CBState.HALF_OPEN:
                if self._half_open_probe_in_flight:
                    raise CircuitOpenError("Circuit breaker half-open: probe in flight")
                self._half_open_probe_in_flight = True
            case CBState.CLOSED:
                pass

    def record_success(self) -> None:
        self._failures = 0
        self._state = CBState.CLOSED
        self._half_open_probe_in_flight = False

    def record_failure(self) -> None:
        self._failures += 1
        if self._failures >= self.failure_threshold:
            self._state = CBState.OPEN
            self._opened_at = time.monotonic()
        self._half_open_probe_in_flight = False


# ─── Downstream Protocol ──────────────────────────────────────────────────────

class Downstream(Protocol):
    async def process(self, msg: Message) -> None: ...


# ─── Pipeline ────────────────────────────────────────────────────────────────

class Pipeline:
    """
    Producer → TokenBucket → BoundedQueue → CircuitBreaker → Downstream.
    Backpressure propagates upstream: caller of publish() receives the error.
    """

    def __init__(
        self,
        queue_capacity: int,
        rate_per_sec: float,
        cb_threshold: int,
        cb_reset_timeout: float,
        downstream: Downstream,
    ) -> None:
        self._queue = BoundedQueue(queue_capacity)
        self._limiter = TokenBucket(rate_per_sec)
        self._breaker = CircuitBreaker(cb_threshold, cb_reset_timeout)
        self._down = downstream

    async def publish(self, msg: Message) -> None:
        """Raises BackpressureError subclass on rejection."""
        await self._limiter.allow()
        self._queue.enqueue(msg)

    async def run(self) -> AsyncIterator[ProcessResult]:
        """Consume loop. Use as: async for result in pipeline.run(): ..."""
        while True:
            msg = await self._queue.dequeue()

            try:
                self._breaker.allow()
            except CircuitOpenError as exc:
                yield ProcessResult(message_id=msg.id, error=exc)
                continue

            try:
                await self._down.process(msg)
                self._breaker.record_success()
                yield ProcessResult(message_id=msg.id)
            except Exception as exc:
                self._breaker.record_failure()
                yield ProcessResult(message_id=msg.id, error=exc)


# ─── Example Usage ────────────────────────────────────────────────────────────

class SlowDatabase:
    async def process(self, msg: Message) -> None:
        await asyncio.sleep(0.02)  # 50 msg/s capacity


async def main() -> None:
    db = SlowDatabase()
    pipeline = Pipeline(
        queue_capacity=500,
        rate_per_sec=200.0,
        cb_threshold=5,
        cb_reset_timeout=10.0,
        downstream=db,
    )

    # Producer: tries to send at 250 msg/s (exceeds consumer capacity)
    async def producer() -> None:
        for i in range(100):
            msg = Message(id=f"msg-{i}", payload=b"payload")
            try:
                await pipeline.publish(msg)
            except BackpressureError as exc:
                print(f"[backpressure] {exc}")
            await asyncio.sleep(0.004)  # ~250 msg/s

    await asyncio.gather(producer())`,

  TypeScript: `// Pattern: Backpressure via Bounded Queue + Token Bucket + Circuit Breaker
// Reference: Kleppmann DDIA Ch.11; Release It! (Nygard)
// Production note: This is in-memory. For durability, replace BoundedQueue with SQS/Kafka client.

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Message {
  readonly id: string;
  readonly payload: Buffer;
}

export type ProcessResult =
  | { readonly ok: true; readonly messageId: string }
  | { readonly ok: false; readonly messageId: string; readonly error: BackpressureError | Error };

// Discriminated union for backpressure error types
export type BackpressureError =
  | { readonly kind: "QUEUE_FULL"; readonly fillRatio: number }
  | { readonly kind: "RATE_LIMITED"; readonly retryAfterMs: number }
  | { readonly kind: "CIRCUIT_OPEN"; readonly openedAt: Date };

// ─── Bounded Queue ─────────────────────────────────────────────────────────────

export class BoundedQueue<T> {
  private readonly buffer: T[] = [];

  constructor(private readonly capacity: number) {}

  enqueue(item: T): BackpressureError | null {
    if (this.buffer.length >= this.capacity) {
      return { kind: "QUEUE_FULL", fillRatio: this.fillRatio };
    }
    this.buffer.push(item);
    return null;
  }

  dequeue(): T | undefined {
    return this.buffer.shift();
  }

  get depth(): number { return this.buffer.length; }

  get fillRatio(): number { return this.buffer.length / this.capacity; }

  get isEmpty(): boolean { return this.buffer.length === 0; }
}

// ─── Token Bucket Rate Limiter ─────────────────────────────────────────────────

export class TokenBucket {
  private tokens: number;
  private lastFill: number = Date.now();
  private readonly capacity: number;

  constructor(
    private readonly ratePerSec: number,
    burstMultiplier = 2,
  ) {
    this.capacity = ratePerSec * burstMultiplier;
    this.tokens = this.capacity;
  }

  allow(): BackpressureError | null {
    const now = Date.now();
    const elapsedSec = (now - this.lastFill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.ratePerSec);
    this.lastFill = now;

    if (this.tokens < 1) {
      const retryAfterMs = Math.ceil((1 - this.tokens) / this.ratePerSec * 1000);
      return { kind: "RATE_LIMITED", retryAfterMs };
    }

    this.tokens -= 1;
    return null;
  }
}

// ─── Circuit Breaker ───────────────────────────────────────────────────────────

type CBState = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  private state: CBState = "CLOSED";
  private failures = 0;
  private openedAt: Date | null = null;
  private halfOpenProbeInFlight = false;

  constructor(
    private readonly failureThreshold: number,
    private readonly resetTimeoutMs: number,
  ) {}

  allow(): BackpressureError | null {
    switch (this.state) {
      case "CLOSED":
        return null;

      case "OPEN": {
        const elapsed = Date.now() - (this.openedAt?.getTime() ?? 0);
        if (elapsed > this.resetTimeoutMs) {
          this.state = "HALF_OPEN";
          this.halfOpenProbeInFlight = false;
          return null;
        }
        return { kind: "CIRCUIT_OPEN", openedAt: this.openedAt! };
      }

      case "HALF_OPEN":
        if (this.halfOpenProbeInFlight) {
          return { kind: "CIRCUIT_OPEN", openedAt: this.openedAt! };
        }
        this.halfOpenProbeInFlight = true;
        return null;
    }
  }

  recordSuccess(): void {
    this.failures = 0;
    this.state = "CLOSED";
    this.halfOpenProbeInFlight = false;
    this.openedAt = null;
  }

  recordFailure(): void {
    this.failures += 1;
    this.halfOpenProbeInFlight = false;
    if (this.failures >= this.failureThreshold) {
      this.state = "OPEN";
      this.openedAt = new Date();
    }
  }

  get currentState(): CBState { return this.state; }
}

// ─── Downstream Interface ──────────────────────────────────────────────────────

export interface Downstream {
  process(msg: Message): Promise<void>;
}

// ─── Pipeline ──────────────────────────────────────────────────────────────────

export class Pipeline {
  private readonly queue: BoundedQueue<Message>;
  private readonly limiter: TokenBucket;
  private readonly breaker: CircuitBreaker;
  private running = false;

  constructor(
    private readonly downstream: Downstream,
    options: {
      queueCapacity: number;
      ratePerSec: number;
      cbFailureThreshold: number;
      cbResetTimeoutMs: number;
    }
  ) {
    this.queue = new BoundedQueue(options.queueCapacity);
    this.limiter = new TokenBucket(options.ratePerSec);
    this.breaker = new CircuitBreaker(options.cbFailureThreshold, options.cbResetTimeoutMs);
  }

  /**
   * Publish applies rate limiting then enqueues.
   * Returns a BackpressureError if rejected — caller must handle or surface to user.
   */
  publish(msg: Message): BackpressureError | null {
    const rateErr = this.limiter.allow();
    if (rateErr) return rateErr;

    return this.queue.enqueue(msg);
  }

  /**
   * Start the consumer loop as an async generator.
   * Usage: for await (const result of pipeline.start()) { ... }
   */
  async *start(signal: AbortSignal): AsyncGenerator<ProcessResult> {
    this.running = true;

    while (!signal.aborted) {
      if (this.queue.isEmpty) {
        await new Promise<void>(r => setTimeout(r, 1));
        continue;
      }

      const msg = this.queue.dequeue()!;

      const cbErr = this.breaker.allow();
      if (cbErr) {
        yield { ok: false, messageId: msg.id, error: cbErr };
        continue;
      }

      try {
        await this.downstream.process(msg);
        this.breaker.recordSuccess();
        yield { ok: true, messageId: msg.id };
      } catch (err) {
        this.breaker.recordFailure();
        yield { ok: false, messageId: msg.id, error: err as Error };
      }
    }
  }

  get metrics() {
    return {
      queueDepth: this.queue.depth,
      fillRatio: this.queue.fillRatio,
      circuitState: this.breaker.currentState,
    };
  }
}`,

  Rust: `// Pattern: Backpressure via Bounded Channel + Token Bucket + Circuit Breaker
// Reference: Kleppmann DDIA Ch.11; Release It! (Nygard)
// Production note: tokio::sync::mpsc is in-memory. Replace sender with Kafka producer for durability.

use std::{
    sync::{
        atomic::{AtomicI64, AtomicU32, Ordering},
        Arc,
    },
    time::{Duration, Instant},
};

use thiserror::Error;
use tokio::sync::{mpsc, Mutex, RwLock};

// ─── Domain Types ─────────────────────────────────────────────────────────────

#[derive(Debug, Clone)]
pub struct Message {
    pub id: String,
    pub payload: Vec<u8>,
}

#[derive(Debug)]
pub struct ProcessResult {
    pub message_id: String,
    pub error: Option<BackpressureError>,
}

// ─── Error Types ──────────────────────────────────────────────────────────────

#[derive(Debug, Error, Clone)]
pub enum BackpressureError {
    #[error("queue full: backpressure applied (fill: {fill_ratio:.0}%)")]
    QueueFull { fill_ratio: f64 },

    #[error("rate limited: retry after {retry_after_ms}ms")]
    RateLimited { retry_after_ms: u64 },

    #[error("circuit open: downstream unavailable since {opened_ago_ms}ms ago")]
    CircuitOpen { opened_ago_ms: u64 },
}

// ─── Token Bucket Rate Limiter ─────────────────────────────────────────────────

pub struct TokenBucket {
    tokens: Mutex<f64>,
    last_fill: Mutex<Instant>,
    rate_per_sec: f64,
    capacity: f64,
}

impl TokenBucket {
    pub fn new(rate_per_sec: f64) -> Arc<Self> {
        Arc::new(Self {
            tokens: Mutex::new(rate_per_sec * 2.0),
            last_fill: Mutex::new(Instant::now()),
            rate_per_sec,
            capacity: rate_per_sec * 2.0,
        })
    }

    pub async fn allow(&self) -> Result<(), BackpressureError> {
        let mut tokens = self.tokens.lock().await;
        let mut last_fill = self.last_fill.lock().await;

        let elapsed = last_fill.elapsed().as_secs_f64();
        *tokens = (*tokens + elapsed * self.rate_per_sec).min(self.capacity);
        *last_fill = Instant::now();

        if *tokens < 1.0 {
            let deficit = 1.0 - *tokens;
            let retry_after_ms = ((deficit / self.rate_per_sec) * 1000.0).ceil() as u64;
            return Err(BackpressureError::RateLimited { retry_after_ms });
        }

        *tokens -= 1.0;
        Ok(())
    }
}

// ─── Circuit Breaker ───────────────────────────────────────────────────────────

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum CBState {
    Closed,
    Open,
    HalfOpen,
}

pub struct CircuitBreaker {
    state: RwLock<CBState>,
    failures: AtomicU32,
    opened_at: Mutex<Option<Instant>>,
    failure_threshold: u32,
    reset_timeout: Duration,
    probe_in_flight: AtomicI64, // 0 = none, 1 = in flight
}

impl CircuitBreaker {
    pub fn new(failure_threshold: u32, reset_timeout: Duration) -> Arc<Self> {
        Arc::new(Self {
            state: RwLock::new(CBState::Closed),
            failures: AtomicU32::new(0),
            opened_at: Mutex::new(None),
            failure_threshold,
            reset_timeout,
            probe_in_flight: AtomicI64::new(0),
        })
    }

    pub async fn allow(&self) -> Result<(), BackpressureError> {
        let state = *self.state.read().await;

        match state {
            CBState::Closed => Ok(()),

            CBState::Open => {
                let opened_at = *self.opened_at.lock().await;
                if let Some(t) = opened_at {
                    if t.elapsed() > self.reset_timeout {
                        *self.state.write().await = CBState::HalfOpen;
                        self.probe_in_flight.store(0, Ordering::SeqCst);
                        return Ok(());
                    }
                    Err(BackpressureError::CircuitOpen {
                        opened_ago_ms: t.elapsed().as_millis() as u64,
                    })
                } else {
                    Ok(())
                }
            }

            CBState::HalfOpen => {
                if self.probe_in_flight.compare_exchange(0, 1, Ordering::SeqCst, Ordering::SeqCst).is_ok() {
                    Ok(())
                } else {
                    Err(BackpressureError::CircuitOpen { opened_ago_ms: 0 })
                }
            }
        }
    }

    pub async fn record_success(&self) {
        self.failures.store(0, Ordering::SeqCst);
        *self.state.write().await = CBState::Closed;
        self.probe_in_flight.store(0, Ordering::SeqCst);
    }

    pub async fn record_failure(&self) {
        let failures = self.failures.fetch_add(1, Ordering::SeqCst) + 1;
        self.probe_in_flight.store(0, Ordering::SeqCst);
        if failures >= self.failure_threshold {
            *self.state.write().await = CBState::Open;
            *self.opened_at.lock().await = Some(Instant::now());
        }
    }
}

// ─── Downstream Trait ─────────────────────────────────────────────────────────

#[async_trait::async_trait]
pub trait Downstream: Send + Sync {
    async fn process(&self, msg: Message) -> anyhow::Result<()>;
}

// ─── Pipeline ──────────────────────────────────────────────────────────────────

pub struct Pipeline {
    sender: mpsc::Sender<Message>,
    receiver: Mutex<mpsc::Receiver<Message>>,
    capacity: usize,
    limiter: Arc<TokenBucket>,
    breaker: Arc<CircuitBreaker>,
    downstream: Arc<dyn Downstream>,
}

impl Pipeline {
    pub fn new(
        queue_capacity: usize,
        rate_per_sec: f64,
        cb_threshold: u32,
        cb_reset: Duration,
        downstream: Arc<dyn Downstream>,
    ) -> Arc<Self> {
        let (sender, receiver) = mpsc::channel(queue_capacity);
        Arc::new(Self {
            sender,
            receiver: Mutex::new(receiver),
            capacity: queue_capacity,
            limiter: TokenBucket::new(rate_per_sec),
            breaker: CircuitBreaker::new(cb_threshold, cb_reset),
            downstream,
        })
    }

    /// Publish applies rate limiting then non-blocking enqueue.
    /// Returns Err(BackpressureError) when rejected.
    pub async fn publish(&self, msg: Message) -> Result<(), BackpressureError> {
        self.limiter.allow().await?;

        self.sender.try_send(msg).map_err(|e| {
            let fill = self.sender.max_capacity().saturating_sub(self.sender.capacity());
            BackpressureError::QueueFull {
                fill_ratio: fill as f64 / self.capacity as f64 * 100.0,
            }
        })
    }

    /// Run the consumer loop until the receiver is closed.
    pub async fn run(self: Arc<Self>) -> Vec<ProcessResult> {
        let mut results = Vec::new();
        let mut rx = self.receiver.lock().await;

        while let Some(msg) = rx.recv().await {
            let id = msg.id.clone();

            match self.breaker.allow().await {
                Err(e) => {
                    results.push(ProcessResult { message_id: id, error: Some(e) });
                    continue;
                }
                Ok(_) => {}
            }

            match self.downstream.process(msg).await {
                Ok(_) => {
                    self.breaker.record_success().await;
                    results.push(ProcessResult { message_id: id, error: None });
                }
                Err(e) => {
                    self.breaker.record_failure().await;
                    results.push(ProcessResult {
                        message_id: id,
                        error: Some(BackpressureError::CircuitOpen { opened_ago_ms: 0 }),
                    });
                }
            }
        }

        results
    }
}`,

  "Java 21": `// Pattern: Backpressure via Bounded BlockingQueue + Token Bucket + Circuit Breaker
// Reference: Kleppmann DDIA Ch.11; Release It! (Nygard, 2nd ed.)
// Production note: ArrayBlockingQueue is in-memory. Replace with Kafka consumer for durability.

package io.example.backpressure;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.concurrent.locks.ReentrantLock;

// ─── Domain Records ───────────────────────────────────────────────────────────

public record Message(String id, byte[] payload) {}

public sealed interface ProcessResult permits ProcessResult.Ok, ProcessResult.Failed {
    record Ok(String messageId) implements ProcessResult {}
    record Failed(String messageId, BackpressureException error) implements ProcessResult {}
}

// ─── Sealed Exception Hierarchy ───────────────────────────────────────────────

public sealed class BackpressureException extends RuntimeException
    permits QueueFullException, RateLimitedException, CircuitOpenException {
    protected BackpressureException(String message) { super(message); }
}

public final class QueueFullException extends BackpressureException {
    private final double fillRatio;
    public QueueFullException(double fillRatio) {
        super("Queue full: backpressure applied (fill: %.0f%%)".formatted(fillRatio * 100));
        this.fillRatio = fillRatio;
    }
    public double fillRatio() { return fillRatio; }
}

public final class RateLimitedException extends BackpressureException {
    private final long retryAfterMs;
    public RateLimitedException(long retryAfterMs) {
        super("Rate limited: retry after %dms".formatted(retryAfterMs));
        this.retryAfterMs = retryAfterMs;
    }
    public long retryAfterMs() { return retryAfterMs; }
}

public final class CircuitOpenException extends BackpressureException {
    public CircuitOpenException(Instant openedAt) {
        super("Circuit open: downstream unavailable since " + openedAt);
    }
}

// ─── Token Bucket Rate Limiter ─────────────────────────────────────────────────

public class TokenBucket {
    private final double ratePerSec;
    private final double capacity;
    private double tokens;
    private Instant lastFill = Instant.now();
    private final ReentrantLock lock = new ReentrantLock();

    public TokenBucket(double ratePerSec) {
        this.ratePerSec = ratePerSec;
        this.capacity = ratePerSec * 2.0;
        this.tokens = capacity;
    }

    public void allow() throws RateLimitedException {
        lock.lock();
        try {
            Instant now = Instant.now();
            double elapsed = Duration.between(lastFill, now).toNanos() / 1e9;
            tokens = Math.min(capacity, tokens + elapsed * ratePerSec);
            lastFill = now;

            if (tokens < 1.0) {
                long retryAfterMs = (long) Math.ceil((1.0 - tokens) / ratePerSec * 1000);
                throw new RateLimitedException(retryAfterMs);
            }
            tokens -= 1.0;
        } finally {
            lock.unlock();
        }
    }
}

// ─── Circuit Breaker ───────────────────────────────────────────────────────────

public class CircuitBreaker {
    public enum State { CLOSED, OPEN, HALF_OPEN }

    private volatile State state = State.CLOSED;
    private final AtomicInteger failures = new AtomicInteger(0);
    private volatile Optional<Instant> openedAt = Optional.empty();
    private final AtomicBoolean probeInFlight = new AtomicBoolean(false);

    private final int failureThreshold;
    private final Duration resetTimeout;

    public CircuitBreaker(int failureThreshold, Duration resetTimeout) {
        this.failureThreshold = failureThreshold;
        this.resetTimeout = resetTimeout;
    }

    public void allow() throws CircuitOpenException {
        switch (state) {
            case CLOSED -> {}
            case OPEN -> {
                Instant opened = openedAt.orElseThrow();
                if (Duration.between(opened, Instant.now()).compareTo(resetTimeout) > 0) {
                    state = State.HALF_OPEN;
                    probeInFlight.set(false);
                } else {
                    throw new CircuitOpenException(opened);
                }
            }
            case HALF_OPEN -> {
                if (!probeInFlight.compareAndSet(false, true)) {
                    throw new CircuitOpenException(openedAt.orElse(Instant.now()));
                }
            }
        }
    }

    public void recordSuccess() {
        failures.set(0);
        state = State.CLOSED;
        probeInFlight.set(false);
        openedAt = Optional.empty();
    }

    public void recordFailure() {
        probeInFlight.set(false);
        if (failures.incrementAndGet() >= failureThreshold) {
            state = State.OPEN;
            openedAt = Optional.of(Instant.now());
        }
    }
}

// ─── Downstream Interface ─────────────────────────────────────────────────────

@FunctionalInterface
public interface Downstream {
    void process(Message msg) throws Exception;
}

// ─── Pipeline ──────────────────────────────────────────────────────────────────

public class Pipeline {
    private final ArrayBlockingQueue<Message> queue;
    private final int capacity;
    private final TokenBucket limiter;
    private final CircuitBreaker breaker;
    private final Downstream downstream;

    public Pipeline(
        int queueCapacity,
        double ratePerSec,
        int cbThreshold,
        Duration cbResetTimeout,
        Downstream downstream
    ) {
        this.capacity = queueCapacity;
        this.queue = new ArrayBlockingQueue<>(queueCapacity);
        this.limiter = new TokenBucket(ratePerSec);
        this.breaker = new CircuitBreaker(cbThreshold, cbResetTimeout);
        this.downstream = downstream;
    }

    /**
     * Publish applies rate limiting then non-blocking enqueue.
     * Throws BackpressureException subclass on rejection.
     * Caller MUST handle — surfacing to the user (429/503) is correct.
     */
    public void publish(Message msg) throws BackpressureException {
        limiter.allow();
        boolean offered = queue.offer(msg);
        if (!offered) {
            double fillRatio = 1.0; // queue.offer failed only when full
            throw new QueueFullException(fillRatio);
        }
    }

    /**
     * Blocking consumer loop. Run on a virtual thread (JDK 21):
     *   Thread.ofVirtual().start(() -> pipeline.run(Thread.currentThread()))
     */
    public void run(Thread callerThread) {
        while (!callerThread.isInterrupted()) {
            try {
                Message msg = queue.poll(100, TimeUnit.MILLISECONDS);
                if (msg == null) continue;

                try {
                    breaker.allow();
                } catch (CircuitOpenException e) {
                    // Log and emit metric; do not rethrow (keeps consumer loop alive)
                    System.err.println("[circuit-open] " + e.getMessage());
                    continue;
                }

                try {
                    downstream.process(msg);
                    breaker.recordSuccess();
                } catch (Exception e) {
                    breaker.recordFailure();
                    System.err.println("[downstream-error] msg=" + msg.id() + " err=" + e.getMessage());
                }

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }

    public double fillRatio() {
        return (double) queue.size() / capacity;
    }
}`,
};

const awsCdkCode = `// infrastructure/aws/cdk/backpressure-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cloudwatchActions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class BackpressureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── Dead Letter Queue (must be created before main queue) ────────────────
    const dlq = new sqs.Queue(this, 'ProcessingDLQ', {
      retentionPeriod: cdk.Duration.days(14),
      encryption: sqs.QueueEncryption.KMS_MANAGED,
    });

    // ── Bounded Main Queue ────────────────────────────────────────────────────
    // visibilityTimeout must be > Lambda timeout to prevent duplicate processing
    const processingQueue = new sqs.Queue(this, 'ProcessingQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
      retentionPeriod: cdk.Duration.days(4),
      encryption: sqs.QueueEncryption.KMS_MANAGED,
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 3,       // Retry 3x before sending to DLQ
      },
    });

    // ── Consumer Lambda ───────────────────────────────────────────────────────
    const consumerFn = new lambda.Function(this, 'ConsumerFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/consumer'),
      timeout: cdk.Duration.seconds(60),
      // reservedConcurrentExecutions IS your circuit breaker:
      // set to max sustainable throughput ÷ avg processing time
      reservedConcurrentExecutions: 10,
      environment: {
        QUEUE_URL: processingQueue.queueUrl,
      },
    });

    // batchSize and maxConcurrency together control consumer throughput.
    // maxConcurrency caps Lambda concurrency independent of the queue depth.
    consumerFn.addEventSource(
      new lambdaEventSources.SqsEventSource(processingQueue, {
        batchSize: 10,
        maxBatchingWindow: cdk.Duration.seconds(5),
        maxConcurrency: 10,        // <── backpressure lever
        reportBatchItemFailures: true, // partial failure support
      })
    );

    processingQueue.grantConsumeMessages(consumerFn);

    // ── API Gateway with Throttling (Producer-side Rate Limiter) ─────────────
    const api = new apigateway.RestApi(this, 'ProducerApi', {
      deployOptions: {
        // These are the token bucket parameters in API Gateway:
        throttlingRateLimit: 200,   // steady-state req/s (token refill rate)
        throttlingBurstLimit: 400,  // burst capacity (bucket size)
      },
    });

    const producerFn = new lambda.Function(this, 'ProducerFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/producer'),
      timeout: cdk.Duration.seconds(10),
      environment: {
        QUEUE_URL: processingQueue.queueUrl,
      },
    });

    processingQueue.grantSendMessages(producerFn);

    const resource = api.root.addResource('events');
    resource.addMethod('POST', new apigateway.LambdaIntegration(producerFn));

    // ── CloudWatch Alarms for Backpressure Observability ─────────────────────

    // Alert on SUSTAINED queue depth growth (not just instantaneous spike)
    const queueDepthAlarm = new cloudwatch.Alarm(this, 'QueueDepthAlarm', {
      metric: processingQueue.metricApproximateNumberOfMessagesVisible({
        statistic: 'Average',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 1000,
      evaluationPeriods: 3,        // 3 consecutive 5-min periods = 15 min sustained
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'Consumer is not keeping up with producer rate',
    });

    // Alert when age of oldest message exceeds SLA
    const messageAgeAlarm = new cloudwatch.Alarm(this, 'MessageAgeAlarm', {
      metric: processingQueue.metricApproximateAgeOfOldestMessage({
        statistic: 'Maximum',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 300,              // 5 minutes
      evaluationPeriods: 2,
      alarmDescription: 'Messages aging beyond SLA — consumer too slow',
    });

    // DLQ depth is a hard signal: messages are being silently dropped
    const dlqDepthAlarm = new cloudwatch.Alarm(this, 'DLQDepthAlarm', {
      metric: dlq.metricApproximateNumberOfMessagesVisible(),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: 'CRITICAL: messages failing after all retries — data loss risk',
    });

    // Outputs
    new cdk.CfnOutput(this, 'QueueUrl', { value: processingQueue.queueUrl });
    new cdk.CfnOutput(this, 'ApiEndpoint', { value: api.url });
  }
}`;

const awsSdkCode = `// lambda/producer/index.ts — SDK v3 with SQS send + backpressure response
import { SQSClient, SendMessageCommand, GetQueueAttributesCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({});
const QUEUE_URL = process.env.QUEUE_URL!;
const QUEUE_DEPTH_THRESHOLD = 5000; // reject early when queue fills

export const handler = async (event: any) => {
  // Check queue depth before enqueuing (proactive backpressure)
  const attrs = await sqs.send(new GetQueueAttributesCommand({
    QueueUrl: QUEUE_URL,
    AttributeNames: ["ApproximateNumberOfMessages"],
  }));

  const depth = parseInt(attrs.Attributes?.ApproximateNumberOfMessages ?? "0");

  if (depth > QUEUE_DEPTH_THRESHOLD) {
    // Surface backpressure to caller as HTTP 429 with Retry-After
    return {
      statusCode: 429,
      headers: {
        "Retry-After": "30",
        "X-Queue-Depth": String(depth),
      },
      body: JSON.stringify({
        error: "BACKPRESSURE",
        message: "Queue depth exceeded threshold. Retry after 30s.",
        queueDepth: depth,
      }),
    };
  }

  await sqs.send(new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(event.body),
    MessageAttributes: {
      Source: { DataType: "String", StringValue: "api" },
    },
  }));

  return { statusCode: 202, body: JSON.stringify({ accepted: true }) };
};`;

const azureBicepCode = `// infrastructure/azure/bicep/backpressure.bicep
param location string = resourceGroup().location
param maxDeliveryCount int = 3

// ── Service Bus Namespace (supports dead-lettering natively) ─────────────────
resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2022-10-01-preview' = {
  name: 'bp-demo-ns'
  location: location
  sku: { name: 'Standard', tier: 'Standard' }
}

// ── Bounded Queue with DLQ ────────────────────────────────────────────────────
resource processingQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
  parent: serviceBusNamespace
  name: 'processing-queue'
  properties: {
    maxSizeInMegabytes: 1024       // bounded buffer
    maxDeliveryCount: maxDeliveryCount  // DLQ after N failures
    defaultMessageTimeToLive: 'P1D'    // 1 day retention
    deadLetteringOnMessageExpiration: true
    enablePartitioning: false
  }
}

// ── Function App (Consumer) ───────────────────────────────────────────────────
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: 'bp-demo-plan'
  location: location
  sku: { name: 'Y1', tier: 'Dynamic' }  // Consumption plan
}

resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: 'bp-demo-consumer'
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        { name: 'ServiceBusConnection', value: serviceBusNamespace.listKeys().primaryConnectionString }
        // WEBSITE_MAX_DYNAMIC_APPLICATION_SCALE_OUT bounds concurrency — backpressure lever
        { name: 'WEBSITE_MAX_DYNAMIC_APPLICATION_SCALE_OUT', value: '10' }
      ]
    }
  }
}

// ── Monitor Alerts: Active Messages + DLQ depth ───────────────────────────────
resource queueDepthAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: 'queue-depth-alert'
  location: 'global'
  properties: {
    severity: 2
    enabled: true
    evaluationFrequency: 'PT5M'
    windowSize: 'PT15M'
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria'
      allOf: [{
        criterionType: 'StaticThresholdCriterion'
        name: 'ActiveMessages'
        metricName: 'ActiveMessages'
        operator: 'GreaterThan'
        threshold: 1000
        timeAggregation: 'Average'
      }]
    }
    scopes: [processingQueue.id]
  }
}`;

const gcpTerraformCode = `# infrastructure/gcp/terraform/backpressure.tf
# Pub/Sub with dead-letter topic + Cloud Run consumer with concurrency limits

terraform {
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

variable "project_id" { type = string }
variable "region"     { default = "us-central1" }

# ── Dead Letter Topic ─────────────────────────────────────────────────────────
resource "google_pubsub_topic" "dead_letter" {
  name    = "processing-dlq"
  project = var.project_id
}

# ── Main Topic ────────────────────────────────────────────────────────────────
resource "google_pubsub_topic" "processing" {
  name    = "processing-topic"
  project = var.project_id
}

# ── Bounded Subscription with Dead Lettering ──────────────────────────────────
resource "google_pubsub_subscription" "processing" {
  name    = "processing-sub"
  topic   = google_pubsub_topic.processing.name
  project = var.project_id

  # ack_deadline_seconds IS your bounded queue timeout.
  # Messages not acked within this window are redelivered.
  ack_deadline_seconds = 300

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.dead_letter.id
    max_delivery_attempts = 5
  }

  # Flow control: max_outstanding_messages is the backpressure lever.
  # Consumer will not receive more than this many unacked messages at once.
  # Set to: max_concurrent_requests × expected_processing_time_sec × safety_factor
  # This is enforced client-side in the Pub/Sub Go/Python/Java libraries.
  # NOTE: Terraform resource does not expose flow_control directly;
  # configure in application client as: 
  #   client.ReceiveSettings.MaxOutstandingMessages = 100
  
  expiration_policy {
    ttl = "86400s" # 1 day
  }

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "300s"
  }
}

# ── Cloud Run Consumer (concurrency = backpressure lever) ─────────────────────
resource "google_cloud_run_v2_service" "consumer" {
  name     = "bp-consumer"
  location = var.region
  project  = var.project_id

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 10   # caps total concurrent processing capacity
    }
    containers {
      image = "gcr.io/\${var.project_id}/consumer:latest"
      resources {
        limits = { cpu = "1", memory = "512Mi" }
      }
      env {
        name  = "SUBSCRIPTION"
        value = google_pubsub_subscription.processing.id
      }
    }
    # max_instance_request_concurrency = 1 means one message per container
    # instance at a time — strictest backpressure. Increase for IO-bound work.
    max_instance_request_concurrency = 5
  }
}

# ── Monitoring: Alert on undelivered message count ────────────────────────────
resource "google_monitoring_alert_policy" "queue_depth" {
  display_name = "Pub/Sub backlog alert"
  project      = var.project_id

  conditions {
    display_name = "Undelivered messages"
    condition_threshold {
      filter          = "resource.type=\\"pubsub_subscription\\" AND metric.type=\\"pubsub.googleapis.com/subscription/num_undelivered_messages\\""
      comparison      = "COMPARISON_GT"
      threshold_value = 1000
      duration        = "900s"  # 15 minutes sustained
      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  alert_strategy {
    notification_rate_limit { period = "300s" }
  }
}`;

function ImplementationsTab() {
  const [lang, setLang] = useState(0);
  const [cloudTab, setCloudTab] = useState(0);
  const [awsSubTab, setAwsSubTab] = useState(0);
  const [mainTab, setMainTab] = useState(0);

  const mainTabs = ["Core", "AWS", "Azure", "GCP"];

  return (
    <div>
      <TabBar tabs={mainTabs} active={mainTab} setActive={setMainTab} accent={
        mainTab === 1 ? colors.aws : mainTab === 2 ? colors.azure : mainTab === 3 ? colors.gcp : colors.blue
      } />

      {mainTab === 0 && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <TabBar tabs={LANGS} active={lang} setActive={setLang} accent={colors.blue} />
          </div>
          <CodeBlock
            code={coreCode[LANGS[lang]]}
            language={LANGS[lang].toLowerCase()}
            filename={`implementations/core/backpressure.${["go","py","ts","rs","java"][lang]}`}
          />
        </div>
      )}

      {mainTab === 1 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Badge color={colors.aws}>AWS</Badge>
            <span style={{ color: colors.muted, fontSize: 12 }}>SQS + Lambda + API Gateway + CloudWatch</span>
          </div>
          <TabBar tabs={["CDK (TypeScript)", "SDK (TypeScript)"]} active={awsSubTab} setActive={setAwsSubTab} accent={colors.aws} />
          {awsSubTab === 0 && (
            <CodeBlock code={awsCdkCode} language="typescript" filename="implementations/aws/iac/cdk-ts/backpressure-stack.ts" />
          )}
          {awsSubTab === 1 && (
            <CodeBlock code={awsSdkCode} language="typescript" filename="implementations/aws/sdk/ts/producer-handler.ts" />
          )}
        </div>
      )}

      {mainTab === 2 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Badge color={colors.azure}>Azure</Badge>
            <span style={{ color: colors.muted, fontSize: 12 }}>Service Bus + Azure Functions + Azure Monitor</span>
          </div>
          <CodeBlock code={azureBicepCode} language="bicep" filename="implementations/azure/iac/bicep/backpressure.bicep" />
        </div>
      )}

      {mainTab === 3 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Badge color={colors.gcp}>GCP</Badge>
            <span style={{ color: colors.muted, fontSize: 12 }}>Pub/Sub + Cloud Run + Cloud Monitoring</span>
          </div>
          <CodeBlock code={gcpTerraformCode} language="hcl" filename="implementations/gcp/iac/terraform/backpressure.tf" />
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Leadership ────────────────────────────────────────────────────────

function LeadershipTab() {
  const sections = [
    {
      title: "Explain to Your Team",
      color: colors.blue,
      content: `Backpressure is the mechanism by which a slower downstream component tells faster upstream components to slow down, rather than silently accumulating unprocessed work until the system crashes. Think of it as every component in your pipeline having a speed limit and the ability to post that limit back to its callers. Without it, any throughput mismatch — however small — compounds over time into queue overflow, OOM errors, and cascading failure across the entire call chain.`,
    },
    {
      title: "Justify the Decision in Architecture Review",
      color: colors.green,
      content: `The question isn't "should we add backpressure?" — it's "which backpressure strategy fits our SLA and failure mode?" Push-based systems with unbounded queues convert throughput mismatches into eventual OOM crashes with no prior warning. Pull-based systems (Kafka consumers, Reactive Streams) make the mismatch visible as consumer lag, which is observable and actionable. Circuit breakers handle the slow-dependency failure mode that bounded queues don't — they prevent thread pool exhaustion when a downstream service is responding slowly rather than refusing connections. A production system needs both: bounded queues for overload, circuit breakers for slow dependencies, and rate limiting to protect from retry storms. Reference: Reactive Manifesto (2014), Nygard Release It! (2nd ed.), Kleppmann DDIA Ch.11.`,
    },
    {
      title: "Failure Modes & Observability",
      color: colors.red,
      content: null,
      table: [
        ["Failure Mode", "Symptom", "Alert", "Recovery"],
        ["Queue fills faster than it drains", "Latency rising, 429s to callers", "queue_depth > threshold sustained 15 min", "Scale consumers or reduce producer rate"],
        ["Consumer slower than producer", "Consumer lag growing linearly", "consumer_lag_max trending up for 10 min", "Scale consumer replicas / optimize processing"],
        ["Downstream dependency slow", "Thread pool exhaustion, timeout spike", "p99 latency > 2× p50; error rate > 1%", "Open circuit breaker; scale or fix downstream"],
        ["Unbounded queue + OOM", "Sudden OOM kill, all in-flight messages lost", "JVM heap > 85% for 5 min; container restarts", "Set bounded queue NOW; add DLQ"],
        ["Retry storm on recovering service", "Recovering service re-overwhelmed immediately", "Error rate spike post-recovery", "Exponential backoff + jitter; circuit breaker half-open throttle"],
        ["DLQ depth > 0", "Messages failing after all retries — data loss", "Any DLQ message = immediate alert", "Investigate consumer errors; replay DLQ after fix"],
      ],
    },
    {
      title: "Scale Implications",
      color: colors.purple,
      content: `At 10× load: queue size configuration becomes critical — what was a safe buffer becomes a 10-minute backlog. Consumer autoscaling must react faster than retention windows fill. Circuit breaker thresholds tuned for low traffic may fire spuriously at scale. At 100× load: a single rate limiter instance becomes a bottleneck; distribute with Redis/token bucket per node. Consumer lag observability must be partition-level (Kafka) — aggregate lag hides hot partitions. Load shedding tiers become essential: not all traffic is equal, and accepting some 429s is correct to protect P0 flows. Network-level backpressure (TCP flow control, gRPC window) may interact with application-level backpressure in unexpected ways under saturated links.`,
    },
    {
      title: "Code Review Checklist",
      color: colors.amber,
      content: null,
      checklist: [
        "Every queue has an explicit maximum capacity — no Integer.MAX_VALUE or unbounded channel",
        "Queue full → explicit error returned to caller, NOT silent drop or unbounded wait",
        "Circuit breaker configured with failure threshold AND reset timeout — both are required",
        "Rate limiter returns 429 with Retry-After header, not 500",
        "Consumer loop handles context cancellation / interrupt cleanly",
        "DLQ configured with appropriate retention and alert",
        "Backpressure errors are logged with fill ratio / queue depth context",
        "Tests include the overload path — not just the happy path",
        "Consumer acknowledges messages AFTER processing, not before (at-least-once semantics)",
        "No retry logic inside the consumer loop without exponential backoff + jitter",
      ],
    },
    {
      title: "Questions for Design Review",
      color: colors.muted,
      content: null,
      questions: [
        "What is the maximum sustainable throughput of each component? Have you measured it under load?",
        "What happens when the queue is full? Which callers receive errors, and what is their retry behavior?",
        "Is the queue bounded? What is the maximum depth, and why was that number chosen?",
        "How will you detect sustained consumer lag before it becomes a data-loss risk?",
        "If the downstream dependency slows by 10×, what is the blast radius? Is there a circuit breaker?",
        "What is the DLQ retention period? Is it longer than the expected incident resolution time?",
        "How does the system behave during scale-out? Are new consumers rebalanced without dropping messages?",
        "Are there any retry storms possible in this design? Where does retry logic live?",
      ],
    },
  ];

  return (
    <div>
      {sections.map((s, i) => (
        <Card key={i} style={{ borderLeftColor: s.color, borderLeftWidth: 3 }}>
          <h3 style={{ color: s.color, fontWeight: 600, fontSize: 14, marginBottom: 12 }}>{s.title}</h3>
          {s.content && <p style={{ color: colors.text, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{s.content}</p>}
          {s.table && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                <thead>
                  <tr>
                    {s.table[0].map((h, j) => (
                      <th key={j} style={{ padding: "8px 12px", textAlign: "left", color: colors.muted, fontWeight: 600, borderBottom: `1px solid ${colors.border}`, background: "#161b22" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.slice(1).map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : "#161b2244" }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ padding: "8px 12px", color: ci === 0 ? colors.text : ci === 3 ? colors.green : colors.muted, borderBottom: `1px solid ${colors.border}`, verticalAlign: "top" }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {s.checklist && s.checklist.map((item, j) => (
            <div key={j} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: colors.green, fontSize: 14, lineHeight: 1.4, flexShrink: 0 }}>✓</span>
              <span style={{ color: colors.text, fontSize: 13, lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
          {s.questions && s.questions.map((q, j) => (
            <div key={j} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: colors.blue, fontSize: 14, lineHeight: 1.4, flexShrink: 0 }}>?</span>
              <span style={{ color: colors.text, fontSize: 13, lineHeight: 1.6 }}>{q}</span>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function BackpressureDeepDive() {
  const [tab, setTab] = useState(0);

  const tabContent = [
    <ArchitectureTab key="arch" />,
    <ConceptsTab key="concepts" />,
    <ImplementationsTab key="impl" />,
    <LeadershipTab key="lead" />,
  ];

  return (
    <div style={{
      background: colors.bg,
      minHeight: "100vh",
      color: colors.text,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "24px 20px",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ color: colors.amber, fontSize: 20 }}>⚡</span>
            <h1 style={{ color: colors.text, fontWeight: 600, fontSize: 22, margin: 0 }}>
              Backpressure in Distributed Systems
            </h1>
          </div>
          <p style={{ color: colors.muted, fontSize: 13, margin: 0 }}>
            Flow control · Load shedding · Circuit breakers · Bounded queues · Reactive Streams
          </p>
        </div>

        <TabBar tabs={TAB_LABELS} active={tab} setActive={setTab} accent={colors.amber} />
        {tabContent[tab]}
      </div>
    </div>
  );
}
