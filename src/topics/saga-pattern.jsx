"use client"

import { useState } from "react";

// ─── Shared primitives ────────────────────────────────────────────────────────
const C = {
  bg: "#0f1117", surface: "#1a1d24", border: "#2d3139",
  text: "#e5e7eb", muted: "#9ca3af", code: "#161b22",
  blue: "#3b82f6", green: "#10b981", amber: "#f59e0b",
  purple: "#8b5cf6", red: "#ef4444",
  aws: "#ff9900", azure: "#0078d4", gcp: "#4285f4",
};

const styles = {
  root: { background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'IBM Plex Mono', 'Fira Code', monospace", fontSize: 14 },
  tab: (active) => ({
    padding: "10px 20px", cursor: "pointer", border: "none", background: "none",
    color: active ? C.text : C.muted, borderBottom: active ? `2px solid ${C.blue}` : "2px solid transparent",
    fontFamily: "inherit", fontSize: 13, fontWeight: active ? 600 : 400, transition: "all .15s",
  }),
  subTab: (active, color = C.blue) => ({
    padding: "6px 14px", cursor: "pointer", border: `1px solid ${active ? color : C.border}`,
    background: active ? `${color}18` : "transparent", color: active ? color : C.muted,
    borderRadius: 6, fontFamily: "inherit", fontSize: 12, transition: "all .15s",
  }),
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 24px", marginBottom: 16 },
  codeBlock: {
    background: C.code, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: 16, overflowX: "auto", fontSize: 12, lineHeight: 1.6,
    fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
  },
  badge: (color) => ({
    display: "inline-block", padding: "2px 8px", borderRadius: 4,
    background: `${color}22`, color, fontSize: 11, fontWeight: 600, border: `1px solid ${color}44`,
  }),
  h2: { fontSize: 18, fontWeight: 600, marginBottom: 12, color: C.text },
  h3: { fontSize: 15, fontWeight: 600, marginBottom: 8, color: C.text },
  label: { fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 },
};

// ─── Copy Button ─────────────────────────────────────────────────────────────
function CopyBtn({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      style={{ padding: "4px 12px", background: copied ? `${C.green}22` : `${C.blue}18`, border: `1px solid ${copied ? C.green : C.blue}44`,
        borderRadius: 5, color: copied ? C.green : C.blue, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

function CodePanel({ code, filename, lang = "typescript" }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        {filename && <span style={{ ...styles.badge(C.muted), fontSize: 11 }}>{filename}</span>}
        <CopyBtn code={code} />
      </div>
      <pre style={styles.codeBlock}><code>{code}</code></pre>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 1 — ARCHITECTURE
// ══════════════════════════════════════════════════════════════════════════════
function ArchTab() {
  const [view, setView] = useState("choreography");
  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["choreography", "orchestration"].map(v => (
          <button key={v} onClick={() => setView(v)} style={styles.subTab(view === v)}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
      {view === "choreography" ? <ChoreographyDiagram /> : <OrchestrationDiagram />}
      <CloudTable />
    </div>
  );
}

function ChoreographyDiagram() {
  return (
    <div style={styles.card}>
      <div style={styles.h2}>Choreography-Based Saga — Order Processing</div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
        Each service reacts to domain events and publishes its own events. No central coordinator.
      </div>
      <svg viewBox="0 0 820 420" style={{ width: "100%", maxWidth: 820, display: "block" }}>
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={C.muted} />
          </marker>
          <marker id="arrG" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={C.green} />
          </marker>
          <marker id="arrR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={C.red} />
          </marker>
          <marker id="arrA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={C.amber} />
          </marker>
        </defs>

        {/* Message Bus */}
        <rect x="60" y="185" width="700" height="50" rx="8" fill={`${C.amber}18`} stroke={C.amber} strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="410" y="215" textAnchor="middle" fill={C.amber} fontSize="12" fontWeight="600">Message Bus / Event Broker (Kafka / RabbitMQ)</text>

        {/* Services */}
        {[
          { x: 60, y: 40, label: "Order\nService", color: C.blue },
          { x: 210, y: 40, label: "Payment\nService", color: C.purple },
          { x: 360, y: 40, label: "Inventory\nService", color: C.purple },
          { x: 510, y: 40, label: "Shipping\nService", color: C.purple },
          { x: 660, y: 40, label: "Notification\nService", color: C.green },
        ].map(({ x, y, label, color }) => (
          <g key={label}>
            <rect x={x} y={y} width="120" height="60" rx="8" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
            {label.split("\n").map((l, i) => (
              <text key={i} x={x + 60} y={y + 28 + i * 16} textAnchor="middle" fill={color} fontSize="12" fontWeight="600">{l}</text>
            ))}
          </g>
        ))}

        {/* Down arrows (publish) */}
        {[120, 270, 420, 570, 720].map(x => (
          <line key={x} x1={x} y1="100" x2={x} y2="183" stroke={C.amber} strokeWidth="1.5" markerEnd="url(#arrA)" strokeDasharray="4 2" />
        ))}
        {/* Up arrows (subscribe) */}
        {[120, 270, 420, 570, 720].map(x => (
          <line key={`up-${x}`} x1={x} y1="237" x2={x} y2="258" stroke={C.amber} strokeWidth="1.5" markerEnd="url(#arrA)" strokeDasharray="4 2" />
        ))}

        {/* DB icons below */}
        {[
          { x: 60, label: "orders_db", color: C.blue },
          { x: 210, label: "payments_db", color: C.purple },
          { x: 360, label: "inventory_db", color: C.purple },
          { x: 510, label: "shipments_db", color: C.purple },
          { x: 660, label: "notifications_db", color: C.green },
        ].map(({ x, label, color }) => (
          <g key={label}>
            <ellipse cx={x + 60} cy="292" rx="40" ry="12" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
            <rect x={x + 20} y="292" width="80" height="28" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
            <ellipse cx={x + 60} cy="320" rx="40" ry="12" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
            <text x={x + 60} y="345" textAnchor="middle" fill={C.muted} fontSize="10">{label}</text>
          </g>
        ))}

        {/* Happy path label */}
        <text x="410" y="385" textAnchor="middle" fill={C.green} fontSize="11">✓ Happy path: OrderCreated → PaymentProcessed → InventoryReserved → ShipmentScheduled → OrderConfirmed</text>

        {/* Compensation arrow */}
        <text x="410" y="400" textAnchor="middle" fill={C.red} fontSize="11">✗ Failure: PaymentFailed → OrderCancelled (compensating transaction)</text>

        {/* Legend */}
        <g transform="translate(60, 410)">
          <rect width="8" height="8" fill={C.amber} rx="1" />
          <text x="12" y="8" fill={C.muted} fontSize="10">Event flow</text>
          <rect x="80" width="8" height="8" fill={C.blue} rx="1" />
          <text x="92" y="8" fill={C.muted} fontSize="10">Commands/Input</text>
          <rect x="185" width="8" height="8" fill={C.purple} rx="1" />
          <text x="197" y="8" fill={C.muted} fontSize="10">Participant services</text>
        </g>
      </svg>
    </div>
  );
}

function OrchestrationDiagram() {
  return (
    <div style={styles.card}>
      <div style={styles.h2}>Orchestration-Based Saga — Order Processing</div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
        A central Saga Orchestrator (State Machine) drives the workflow, issuing commands and awaiting replies.
      </div>
      <svg viewBox="0 0 820 460" style={{ width: "100%", maxWidth: 820, display: "block" }}>
        <defs>
          <marker id="arrO" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={C.blue} />
          </marker>
          <marker id="arrOR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={C.green} />
          </marker>
          <marker id="arrORed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={C.red} />
          </marker>
        </defs>

        {/* Orchestrator */}
        <rect x="300" y="20" width="220" height="80" rx="10" fill={`${C.blue}22`} stroke={C.blue} strokeWidth="2" />
        <text x="410" y="52" textAnchor="middle" fill={C.blue} fontSize="13" fontWeight="700">Saga Orchestrator</text>
        <text x="410" y="70" textAnchor="middle" fill={C.muted} fontSize="11">(State Machine)</text>
        <text x="410" y="88" textAnchor="middle" fill={C.muted} fontSize="10">Manages saga log + compensations</text>

        {/* Saga Log DB */}
        <ellipse cx="410" cy="135" rx="45" ry="13" fill={`${C.purple}18`} stroke={C.purple} strokeWidth="1.5" />
        <rect x="365" y="135" width="90" height="26" fill={`${C.purple}18`} stroke={C.purple} strokeWidth="1.5" />
        <ellipse cx="410" cy="161" rx="45" ry="13" fill={`${C.purple}18`} stroke={C.purple} strokeWidth="1.5" />
        <text x="410" y="180" textAnchor="middle" fill={C.purple} fontSize="10">saga_log (durable)</text>
        <line x1="410" y1="100" x2="410" y2="122" stroke={C.purple} strokeWidth="1.5" markerEnd="url(#arrO)" />

        {/* Participant services */}
        {[
          { x: 40, y: 250, label: "Payment\nService", color: C.purple, step: "1. ProcessPayment" },
          { x: 220, y: 250, label: "Inventory\nService", color: C.purple, step: "2. ReserveInventory" },
          { x: 400, y: 250, label: "Shipping\nService", color: C.purple, step: "3. CreateShipment" },
          { x: 580, y: 250, label: "Notification\nService", color: C.green, step: "4. NotifyCustomer" },
        ].map(({ x, y, label, color, step }) => (
          <g key={label}>
            <rect x={x} y={y} width="140" height="60" rx="8" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
            {label.split("\n").map((l, i) => (
              <text key={i} x={x + 70} y={y + 28 + i * 16} textAnchor="middle" fill={color} fontSize="12" fontWeight="600">{l}</text>
            ))}
            <text x={x + 70} y={y - 8} textAnchor="middle" fill={C.muted} fontSize="10">{step}</text>
          </g>
        ))}

        {/* Command arrows (orchestrator → services) */}
        <line x1="330" y1="100" x2="110" y2="248" stroke={C.blue} strokeWidth="1.5" markerEnd="url(#arrO)" />
        <line x1="370" y1="100" x2="290" y2="248" stroke={C.blue} strokeWidth="1.5" markerEnd="url(#arrO)" />
        <line x1="410" y1="100" x2="470" y2="248" stroke={C.blue} strokeWidth="1.5" markerEnd="url(#arrO)" />
        <line x1="490" y1="100" x2="650" y2="248" stroke={C.blue} strokeWidth="1.5" markerEnd="url(#arrO)" />

        {/* Reply arrows (services → orchestrator) */}
        <line x1="130" y1="310" x2="340" y2="108" stroke={C.green} strokeWidth="1.2" strokeDasharray="5 3" markerEnd="url(#arrOR)" />
        <line x1="295" y1="310" x2="375" y2="108" stroke={C.green} strokeWidth="1.2" strokeDasharray="5 3" markerEnd="url(#arrOR)" />
        <line x1="465" y1="310" x2="440" y2="108" stroke={C.green} strokeWidth="1.2" strokeDasharray="5 3" markerEnd="url(#arrOR)" />
        <line x1="640" y1="310" x2="490" y2="108" stroke={C.green} strokeWidth="1.2" strokeDasharray="5 3" markerEnd="url(#arrOR)" />

        {/* Per-service DBs */}
        {[110, 290, 470, 650].map((cx, i) => {
          const colors = [C.purple, C.purple, C.purple, C.green];
          return (
            <g key={cx}>
              <ellipse cx={cx} cy="352" rx="36" ry="10" fill={`${colors[i]}18`} stroke={colors[i]} strokeWidth="1.2" />
              <rect x={cx - 36} y="352" width="72" height="22" fill={`${colors[i]}18`} stroke={colors[i]} strokeWidth="1.2" />
              <ellipse cx={cx} cy="374" rx="36" ry="10" fill={`${colors[i]}18`} stroke={colors[i]} strokeWidth="1.2" />
              <line x1={cx} y1="312" x2={cx} y2="340" stroke={colors[i]} strokeWidth="1" strokeDasharray="3 2" />
            </g>
          );
        })}

        {/* Compensation label */}
        <line x1="110" y1="340" x2="270" y2="395" stroke={C.red} strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#arrORed)" />
        <text x="100" y="425" fill={C.red} fontSize="10">Compensating txn: if Inventory fails → refund Payment</text>

        {/* Labels */}
        <text x="160" y="195" fill={C.blue} fontSize="10">Command</text>
        <text x="480" y="195" fill={C.green} fontSize="10">Reply (success/failure)</text>

        {/* Legend */}
        <g transform="translate(60, 445)">
          <line x1="0" y1="4" x2="20" y2="4" stroke={C.blue} strokeWidth="2" />
          <text x="24" y="8" fill={C.muted} fontSize="10">Command (orchestrator → service)</text>
          <line x1="220" y1="4" x2="240" y2="4" stroke={C.green} strokeWidth="2" strokeDasharray="4 2" />
          <text x="244" y="8" fill={C.muted} fontSize="10">Reply</text>
          <line x1="290" y1="4" x2="310" y2="4" stroke={C.red} strokeWidth="2" strokeDasharray="4 2" />
          <text x="314" y="8" fill={C.muted} fontSize="10">Compensation</text>
        </g>
      </svg>
    </div>
  );
}

function CloudTable() {
  const rows = [
    { component: "Saga Orchestrator", aws: "AWS Step Functions", azure: "Azure Durable Functions", gcp: "Workflows" },
    { component: "Message Bus", aws: "Amazon SQS / SNS / EventBridge", azure: "Azure Service Bus / Event Grid", gcp: "Cloud Pub/Sub" },
    { component: "Event Streaming", aws: "Amazon Kinesis", azure: "Azure Event Hubs", gcp: "Cloud Pub/Sub (streaming)" },
    { component: "Saga Log / State Store", aws: "DynamoDB", azure: "Cosmos DB", gcp: "Firestore / Cloud Spanner" },
    { component: "Compensating Fn", aws: "AWS Lambda", azure: "Azure Functions", gcp: "Cloud Functions / Cloud Run" },
    { component: "Dead Letter Queue", aws: "SQS DLQ", azure: "Service Bus DLQ", gcp: "Pub/Sub dead-letter topic" },
    { component: "Observability", aws: "CloudWatch + X-Ray", azure: "Azure Monitor + App Insights", gcp: "Cloud Trace + Cloud Logging" },
  ];

  const colStyle = (color) => ({
    padding: "10px 14px", borderBottom: `1px solid ${C.border}`,
    color: C.text, fontSize: 12,
  });

  return (
    <div style={{ ...styles.card, marginTop: 8 }}>
      <div style={styles.h3}>Cloud Provider Mapping</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}` }}>
              {["Component", "AWS", "Azure", "GCP"].map((h, i) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11,
                  color: [C.muted, C.aws, C.azure, C.gcp][i], textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : `${C.border}22` }}>
                <td style={{ ...colStyle(), color: C.muted, fontWeight: 600 }}>{r.component}</td>
                <td style={{ ...colStyle(), color: C.aws }}>{r.aws}</td>
                <td style={{ ...colStyle(), color: C.azure }}>{r.azure}</td>
                <td style={{ ...colStyle(), color: C.gcp }}>{r.gcp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: C.muted }}>
        ⚠ AWS Step Functions (Standard) supports saga-style state machines with built-in retries, catch blocks, and compensation steps natively.
        Azure Durable Functions uses the fan-out/fan-in pattern with sub-orchestrations. GCP Workflows is lower-level YAML/JSON DSL requiring more manual compensation logic.
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 2 — CORE CONCEPTS
// ══════════════════════════════════════════════════════════════════════════════
const concepts = [
  {
    term: "Saga",
    source: "Garcia-Molina & Salem, SIGMOD '87; Richardson, Microservices Patterns (2018)",
    def: "A sequence of local transactions T₁…Tₙ where each Tᵢ updates a single service's database and publishes an event or message to trigger Tᵢ₊₁. If Tᵢ fails, compensating transactions Cᵢ₋₁…C₁ are executed in reverse order.",
    why: "ACID transactions across service boundaries require 2PC, which blocks resources, creates tight coupling, and is unsupported by most NoSQL stores and message brokers (Kafka, RabbitMQ). Sagas achieve eventual consistency without distributed locking.",
    mistake: "Treating sagas as equivalent to ACID transactions. Sagas provide ACD (Atomicity via compensation, Consistency via application logic, Durability via local commits) but explicitly sacrifice Isolation — concurrent sagas can observe intermediate state.",
  },
  {
    term: "Compensating Transaction",
    source: "Garcia-Molina & Salem (1987); Azure Architecture Center",
    def: "A business-level operation that semantically undoes a previously committed local transaction. Unlike a database rollback, a compensating transaction is a new forward transaction that reverses the effect (e.g., issuing a refund rather than voiding a charge).",
    why: "Once a local transaction commits to a service's database, it cannot be rolled back externally. Compensation is the only mechanism for undoing work in a distributed system that has already progressed past a commit point.",
    mistake: "Assuming compensating transactions are always possible or idempotent by default. Some operations are inherently non-compensable (e.g., sending an email, printing a physical item). Identify these 'pivot transactions' during design.",
  },
  {
    term: "Choreography",
    source: "Richardson, Microservices Patterns (2018); Microsoft Azure Architecture Center",
    def: "A coordination style where each participant service listens for domain events and decides independently whether to react, publishing its own events in turn. There is no central coordinator — the saga flow emerges from service interactions.",
    why: "Simpler to implement for small sagas (2–3 services). No single point of failure. Services remain loosely coupled. Well-suited to event-driven architectures already using a broker.",
    mistake: "Using choreography for sagas with 4+ participants. Without a centralized view, understanding the overall flow requires reading every service. Cyclic event dependencies are common and debugging partial failures is extremely difficult.",
  },
  {
    term: "Orchestration",
    source: "Richardson, Microservices Patterns (2018); AWS Step Functions documentation",
    def: "A coordination style where a dedicated Saga Orchestrator (a state machine) explicitly commands each participant service and awaits a reply before advancing to the next step. The orchestrator owns the saga lifecycle and compensation logic.",
    why: "Preferred for complex sagas (3+ services), brownfield migrations, and workflows requiring explicit audit trails. The saga log in the orchestrator is the single source of truth for saga state, making debugging and monitoring tractable.",
    mistake: "Implementing the orchestrator as a monolithic component or colocating it inside a participant service. The orchestrator should be a separate, stateless compute unit backed by a durable state store (DynamoDB, Cosmos DB).",
  },
  {
    term: "Semantic Lock (Countermeasure)",
    source: "Richardson, Microservices Patterns ch. 4; Microsoft Azure Architecture Center",
    def: "A record-level flag (e.g., status = PENDING) set by the first saga step and cleared on completion or compensation. Concurrent requests that encounter the flag either wait, retry, or fail fast — preventing dirty reads across concurrent sagas.",
    why: "Sagas lack isolation (the 'I' in ACID). Without countermeasures, concurrent sagas can read uncommitted intermediate state — a 'dirty read'. Semantic locks are the most practical mitigation for most business domains.",
    mistake: "Forgetting to clear semantic locks in compensation paths. A failed saga that never clears its PENDING flag will permanently block subsequent operations on that record. Always include lock release in every compensating transaction.",
  },
  {
    term: "Idempotency",
    source: "Kleppmann, Designing Data-Intensive Applications (2017) ch. 11; Richardson (2018)",
    def: "The property that executing a message or command multiple times produces the same result as executing it once. Required for all saga steps because message brokers deliver at-least-once, meaning any step may be executed more than once.",
    why: "Network failures cause retries. Without idempotency, a payment step retried after a broker timeout may charge a customer twice. Every saga participant must deduplicate using a message ID or saga correlation ID.",
    mistake: "Implementing idempotency only on the happy path. Compensating transactions must also be idempotent — a compensation can be retried if the broker does not receive an acknowledgment.",
  },
  {
    term: "Pivot Transaction",
    source: "Richardson, Microservices Patterns (2018)",
    def: "The last irreversible step in a saga — the point of no return. Steps before the pivot are compensable; steps after the pivot are retryable but not compensable. Identifying the pivot transaction is a critical design activity.",
    why: "Non-compensable operations (charging a credit card, sending an email, physical fulfillment) define natural boundaries. The saga should be designed so non-compensable steps occur as late as possible, maximizing the compensable window.",
    mistake: "Placing non-compensable steps (e.g., external payment gateway charge) before compensable steps (e.g., inventory reservation). If inventory reservation fails after the charge, there is no automated compensation — requiring manual intervention.",
  },
];

const tradeoffs = {
  use: [
    "You need cross-service data consistency and cannot use a shared database",
    "2PC is unavailable (NoSQL stores, heterogeneous databases, external APIs)",
    "Business processes are long-running and should not hold database locks",
    "Services must be independently deployable and fault-isolated",
    "Traffic is moderate: at ~100+ transactions/sec, orchestration overhead becomes measurable",
  ],
  avoid: [
    "Simple 2-service transactions where a shared outbox + 2PC is viable and simpler",
    "Operations requiring strict isolation (financial double-spend prevention needs additional countermeasures)",
    "Teams without operational maturity to manage eventual consistency and partial failures",
    "Tight latency SLAs — saga round-trips add 1–3 network hops vs. a local transaction",
  ],
};

function ConceptsTab() {
  return (
    <div style={{ padding: "24px 0" }}>
      {concepts.map((c) => (
        <div key={c.term} style={{ ...styles.card }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
            <span style={{ ...styles.badge(C.blue), flexShrink: 0 }}>{c.term}</span>
            <span style={{ fontSize: 11, color: C.muted }}>as defined by: {c.source}</span>
          </div>
          <p style={{ margin: "0 0 8px 0", color: C.text, lineHeight: 1.6 }}>{c.def}</p>
          <p style={{ margin: "0 0 6px 0", fontSize: 13, color: C.muted }}>
            <span style={{ color: C.green, fontWeight: 600 }}>Why it matters: </span>{c.why}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
            <span style={{ color: C.amber, fontWeight: 600 }}>Common mistake: </span>{c.mistake}
          </p>
        </div>
      ))}

      <div style={styles.card}>
        <div style={styles.h2}>When to Use / When to Avoid</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ ...styles.label, color: C.green }}>✓ Use when</div>
            {tradeoffs.use.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: C.text }}>
                <span style={{ color: C.green, flexShrink: 0 }}>→</span>{t}
              </div>
            ))}
          </div>
          <div>
            <div style={{ ...styles.label, color: C.red }}>✗ Avoid when</div>
            {tradeoffs.avoid.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: C.text }}>
                <span style={{ color: C.red, flexShrink: 0 }}>→</span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.h2}>Real-World Examples</div>
        {[
          { who: "Uber", what: "Uses orchestration-based sagas for trip booking — coordinates driver assignment, payment authorization, and surge pricing across independent services." },
          { who: "Amazon", what: "Order fulfillment pipeline uses saga-style coordination across payment, warehouse, shipping, and notification services, with compensation for out-of-stock scenarios." },
          { who: "Temporal.io", what: "Built an entire durable execution platform (used by Netflix, Stripe, Coinbase) specifically to simplify saga implementation by persisting workflow state and handling retries transparently." },
          { who: "Netflix", what: "Uses choreography-based sagas with Apache Kafka for content ingestion pipelines, where encoding, metadata extraction, and CDN propagation are decoupled local transactions." },
        ].map(({ who, what }) => (
          <div key={who} style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: 13 }}>
            <span style={{ ...styles.badge(C.amber), flexShrink: 0 }}>{who}</span>
            <span style={{ color: C.text, lineHeight: 1.6 }}>{what}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 3 — IMPLEMENTATIONS
// ══════════════════════════════════════════════════════════════════════════════
const coreCode = {
  go: `// Pattern: Saga (Orchestration variant)
// Reference: Richardson, Microservices Patterns (2018) ch. 4
// Production note: Persist saga state to durable store before each step;
//                  this in-memory version illustrates the state machine logic.

package saga

import (
\t"context"
\t"errors"
\t"fmt"
\t"log/slog"
)

// ─── Domain types ─────────────────────────────────────────────────────────────

type SagaState string

const (
\tStatePending    SagaState = "PENDING"
\tStateCompleted  SagaState = "COMPLETED"
\tStateCompensating SagaState = "COMPENSATING"
\tStateFailed     SagaState = "FAILED"
)

type StepResult struct {
\tStepName string
\tSuccess  bool
\tErr      error
}

// ─── Step interface ───────────────────────────────────────────────────────────

type Step[T any] interface {
\tExecute(ctx context.Context, data T) error
\tCompensate(ctx context.Context, data T) error
\tName() string
}

// ─── Saga Orchestrator ────────────────────────────────────────────────────────

type Orchestrator[T any] struct {
\tsteps  []Step[T]
\tlogger *slog.Logger
}

func NewOrchestrator[T any](logger *slog.Logger, steps ...Step[T]) *Orchestrator[T] {
\treturn &Orchestrator[T]{steps: steps, logger: logger}
}

// Execute runs all steps; on failure, compensates completed steps in reverse.
// Returns a slice of StepResult for observability/audit.
func (o *Orchestrator[T]) Execute(ctx context.Context, data T) ([]StepResult, error) {
\tresults := make([]StepResult, 0, len(o.steps))
\tcompleted := make([]Step[T], 0, len(o.steps))

\tfor _, step := range o.steps {
\t\to.logger.InfoContext(ctx, "saga step executing", "step", step.Name())
\t\terr := step.Execute(ctx, data)
\t\tresult := StepResult{StepName: step.Name(), Success: err == nil, Err: err}
\t\tresults = append(results, result)

\t\tif err != nil {
\t\t\to.logger.ErrorContext(ctx, "saga step failed; starting compensation",
\t\t\t\t"step", step.Name(), "error", err)
\t\t\tcompErr := o.compensate(ctx, data, completed)
\t\t\treturn results, fmt.Errorf("step %s failed: %w (compensation error: %v)",
\t\t\t\tstep.Name(), err, compErr)
\t\t}
\t\tcompleted = append(completed, step)
\t}
\treturn results, nil
}

func (o *Orchestrator[T]) compensate(ctx context.Context, data T, completed []Step[T]) error {
\tvar errs []error
\tfor i := len(completed) - 1; i >= 0; i-- {
\t\tstep := completed[i]
\t\to.logger.WarnContext(ctx, "compensating step", "step", step.Name())
\t\tif err := step.Compensate(ctx, data); err != nil {
\t\t\t// Compensation failures must be logged and alerted — they require
\t\t\t// manual intervention. Do not silently swallow.
\t\t\to.logger.ErrorContext(ctx, "compensation FAILED — manual intervention required",
\t\t\t\t"step", step.Name(), "error", err)
\t\t\terrs = append(errs, fmt.Errorf("compensate %s: %w", step.Name(), err))
\t\t}
\t}
\treturn errors.Join(errs...)
}

// ─── Example: Order Saga ──────────────────────────────────────────────────────

type OrderData struct {
\tOrderID    string
\tCustomerID string
\tAmount     float64
\tItemSKU    string
\tPaymentID  string // filled in by payment step
}

// PaymentStep — processes charge; compensates by issuing refund
type PaymentStep struct{}

func (s *PaymentStep) Name() string { return "ProcessPayment" }
func (s *PaymentStep) Execute(ctx context.Context, d OrderData) error {
\t// In production: call payment service, store PaymentID in shared state
\tif d.Amount <= 0 {
\t\treturn fmt.Errorf("invalid amount: %.2f", d.Amount)
\t}
\tslog.InfoContext(ctx, "payment processed", "orderID", d.OrderID, "amount", d.Amount)
\treturn nil
}
func (s *PaymentStep) Compensate(ctx context.Context, d OrderData) error {
\t// Idempotent: refund is safe to call multiple times with same orderID
\tslog.WarnContext(ctx, "payment refunded", "orderID", d.OrderID)
\treturn nil
}

// InventoryStep — reserves stock; compensates by releasing reservation
type InventoryStep struct{}

func (s *InventoryStep) Name() string { return "ReserveInventory" }
func (s *InventoryStep) Execute(ctx context.Context, d OrderData) error {
\tif d.ItemSKU == "" {
\t\treturn fmt.Errorf("missing SKU")
\t}
\tslog.InfoContext(ctx, "inventory reserved", "sku", d.ItemSKU)
\treturn nil
}
func (s *InventoryStep) Compensate(ctx context.Context, d OrderData) error {
\tslog.WarnContext(ctx, "inventory reservation released", "sku", d.ItemSKU)
\treturn nil
}

// ─── Usage ────────────────────────────────────────────────────────────────────

func ExampleUsage() {
\tlogger := slog.Default()
\torchestraotr := NewOrchestrator[OrderData](
\t\tlogger,
\t\t&PaymentStep{},
\t\t&InventoryStep{},
\t)

\tdata := OrderData{
\t\tOrderID:    "ord-001",
\t\tCustomerID: "cust-123",
\t\tAmount:     49.99,
\t\tItemSKU:    "WIDGET-XL",
\t}

\tresults, err := orchestraotr.Execute(context.Background(), data)
\tfor _, r := range results {
\t\tstatus := "✓"
\t\tif !r.Success { status = "✗" }
\t\tfmt.Printf("%s %s\\n", status, r.StepName)
\t}
\tif err != nil {
\t\tfmt.Printf("Saga failed: %v\\n", err)
\t}
}`,

  python: `# Pattern: Saga (Orchestration variant)
# Reference: Richardson, Microservices Patterns (2018) ch. 4
# Production note: Replace in-memory execution with durable state (e.g., DB row
#                  per saga with step index) before deploying to production.

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Protocol, Generic, TypeVar
import logging

logger = logging.getLogger(__name__)

# ─── Domain types ─────────────────────────────────────────────────────────────

T = TypeVar("T")

@dataclass(frozen=True)
class StepResult:
    step_name: str
    success: bool
    error: Exception | None = None

class SagaError(Exception):
    def __init__(self, step: str, cause: Exception, compensation_errors: list[Exception]):
        self.step = step
        self.cause = cause
        self.compensation_errors = compensation_errors
        super().__init__(f"Saga failed at step '{step}': {cause}")

# ─── Step Protocol ────────────────────────────────────────────────────────────

class SagaStep(Protocol[T]):
    @property
    def name(self) -> str: ...
    def execute(self, data: T) -> None: ...
    def compensate(self, data: T) -> None: ...

# ─── Orchestrator ─────────────────────────────────────────────────────────────

class SagaOrchestrator(Generic[T]):
    def __init__(self, steps: list[SagaStep[T]]) -> None:
        self._steps = steps

    def execute(self, data: T) -> list[StepResult]:
        results: list[StepResult] = []
        completed: list[SagaStep[T]] = []

        for step in self._steps:
            logger.info("saga.step.execute", extra={"step": step.name})
            try:
                step.execute(data)
                results.append(StepResult(step_name=step.name, success=True))
                completed.append(step)
            except Exception as exc:
                logger.error("saga.step.failed", extra={"step": step.name, "error": str(exc)})
                results.append(StepResult(step_name=step.name, success=False, error=exc))
                comp_errors = self._compensate(data, completed)
                raise SagaError(step.name, exc, comp_errors) from exc

        return results

    def _compensate(self, data: T, completed: list[SagaStep[T]]) -> list[Exception]:
        errors: list[Exception] = []
        for step in reversed(completed):
            logger.warning("saga.step.compensate", extra={"step": step.name})
            try:
                step.compensate(data)
            except Exception as exc:
                # Compensation failures require alerting — they cannot be retried
                # automatically without risk of double compensation.
                logger.critical(
                    "saga.compensation.FAILED — manual intervention required",
                    extra={"step": step.name, "error": str(exc)},
                )
                errors.append(exc)
        return errors

# ─── Example: Order Saga ──────────────────────────────────────────────────────

@dataclass
class OrderData:
    order_id: str
    customer_id: str
    amount: float
    item_sku: str
    payment_id: str = ""  # set by payment step

@dataclass
class PaymentStep:
    name: str = "ProcessPayment"

    def execute(self, data: OrderData) -> None:
        if data.amount <= 0:
            raise ValueError(f"Invalid amount: {data.amount}")
        logger.info("payment.processed", extra={"order_id": data.order_id})
        # Store payment_id on data for downstream steps / compensation

    def compensate(self, data: OrderData) -> None:
        # Idempotent: safe to retry with same order_id
        logger.warning("payment.refunded", extra={"order_id": data.order_id})

@dataclass
class InventoryStep:
    name: str = "ReserveInventory"

    def execute(self, data: OrderData) -> None:
        if not data.item_sku:
            raise ValueError("Missing SKU")
        logger.info("inventory.reserved", extra={"sku": data.item_sku})

    def compensate(self, data: OrderData) -> None:
        logger.warning("inventory.released", extra={"sku": data.item_sku})

# ─── Usage ────────────────────────────────────────────────────────────────────

def main() -> None:
    orchestrator: SagaOrchestrator[OrderData] = SagaOrchestrator(
        steps=[PaymentStep(), InventoryStep()]
    )

    data = OrderData(
        order_id="ord-001",
        customer_id="cust-123",
        amount=49.99,
        item_sku="WIDGET-XL",
    )

    try:
        results = orchestrator.execute(data)
        for r in results:
            status = "✓" if r.success else "✗"
            print(f"{status} {r.step_name}")
    except SagaError as e:
        print(f"Saga failed at '{e.step}': {e.cause}")
        if e.compensation_errors:
            print(f"⚠ Compensation failures: {e.compensation_errors}")`,

  typescript: `// Pattern: Saga (Orchestration variant)
// Reference: Richardson, Microservices Patterns (2018) ch. 4
// Production note: Use a Result<T,E> monad and persist saga state before
//                  each network call to survive process restarts.

// ─── Types ────────────────────────────────────────────────────────────────────

type Result<T, E extends Error = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const Err = <E extends Error>(error: E): Result<never, E> => ({ ok: false, error });

interface SagaStep<T> {
  readonly name: string;
  execute(data: T): Promise<Result<void>>;
  compensate(data: T): Promise<Result<void>>;
}

interface StepResult {
  stepName: string;
  success: boolean;
  error?: Error;
}

class SagaError extends Error {
  constructor(
    public readonly failedStep: string,
    public readonly cause: Error,
    public readonly compensationErrors: Error[],
  ) {
    super(\`Saga failed at step '\${failedStep}': \${cause.message}\`);
    this.name = "SagaError";
  }
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

class SagaOrchestrator<T> {
  constructor(private readonly steps: ReadonlyArray<SagaStep<T>>) {}

  async execute(data: T): Promise<Result<StepResult[], SagaError>> {
    const results: StepResult[] = [];
    const completed: SagaStep<T>[] = [];

    for (const step of this.steps) {
      console.info(\`[saga] executing: \${step.name}\`);
      const result = await step.execute(data);

      if (!result.ok) {
        console.error(\`[saga] step failed: \${step.name}\`, result.error);
        results.push({ stepName: step.name, success: false, error: result.error });
        const compErrors = await this.compensate(data, completed);
        return Err(new SagaError(step.name, result.error, compErrors));
      }

      results.push({ stepName: step.name, success: true });
      completed.push(step);
    }

    return Ok(results);
  }

  private async compensate(data: T, completed: SagaStep<T>[]): Promise<Error[]> {
    const errors: Error[] = [];

    for (const step of [...completed].reverse()) {
      console.warn(\`[saga] compensating: \${step.name}\`);
      const result = await step.compensate(data);
      if (!result.ok) {
        // ALERT: compensation failure means the system may be inconsistent.
        // This must page on-call and be tracked in an incident dashboard.
        console.error(\`[saga] COMPENSATION FAILED — manual intervention: \${step.name}\`);
        errors.push(result.error);
      }
    }

    return errors;
  }
}

// ─── Example: Order Saga ──────────────────────────────────────────────────────

interface OrderData {
  orderId: string;
  customerId: string;
  amount: number;
  itemSku: string;
  paymentId?: string;
}

class PaymentStep implements SagaStep<OrderData> {
  readonly name = "ProcessPayment";

  async execute(data: OrderData): Promise<Result<void>> {
    if (data.amount <= 0) return Err(new Error(\`Invalid amount: \${data.amount}\`));
    console.log(\`[payment] processing \${data.orderId} — $\${data.amount}\`);
    // Persist paymentId to data.paymentId here in a real implementation
    return Ok(undefined);
  }

  async compensate(data: OrderData): Promise<Result<void>> {
    // Idempotent: deduplicate via orderId at the payment service
    console.warn(\`[payment] refunding orderId=\${data.orderId}\`);
    return Ok(undefined);
  }
}

class InventoryStep implements SagaStep<OrderData> {
  readonly name = "ReserveInventory";

  async execute(data: OrderData): Promise<Result<void>> {
    if (!data.itemSku) return Err(new Error("Missing SKU"));
    console.log(\`[inventory] reserving sku=\${data.itemSku}\`);
    return Ok(undefined);
  }

  async compensate(data: OrderData): Promise<Result<void>> {
    console.warn(\`[inventory] releasing reservation sku=\${data.itemSku}\`);
    return Ok(undefined);
  }
}

// ─── Usage ────────────────────────────────────────────────────────────────────

async function main() {
  const orchestrator = new SagaOrchestrator<OrderData>([
    new PaymentStep(),
    new InventoryStep(),
  ]);

  const result = await orchestrator.execute({
    orderId: "ord-001",
    customerId: "cust-123",
    amount: 49.99,
    itemSku: "WIDGET-XL",
  });

  if (result.ok) {
    result.value.forEach(r => console.log(\`\${r.success ? "✓" : "✗"} \${r.stepName}\`));
  } else {
    console.error(\`Saga failed: \${result.error.message}\`);
  }
}`,

  rust: `// Pattern: Saga (Orchestration variant)
// Reference: Richardson, Microservices Patterns (2018) ch. 4
// Production note: In production, use async traits (async_trait crate) and
//                  persist saga state to a durable store between steps.

use std::fmt;
use thiserror::Error;

// ─── Error types ─────────────────────────────────────────────────────────────

#[derive(Debug, Error)]
pub enum SagaStepError {
    #[error("Business rule violation: {0}")]
    BusinessRule(String),
    #[error("External service error: {0}")]
    ExternalService(String),
}

#[derive(Debug, Error)]
pub struct SagaError {
    pub failed_step: String,
    pub cause: SagaStepError,
    pub compensation_errors: Vec<String>,
}

impl fmt::Display for SagaError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Saga failed at '{}': {}", self.failed_step, self.cause)?;
        if !self.compensation_errors.is_empty() {
            write!(f, " | compensation failures: {:?}", self.compensation_errors)?;
        }
        Ok(())
    }
}

// ─── Step trait ───────────────────────────────────────────────────────────────

pub trait SagaStep<T: Clone> {
    fn name(&self) -> &str;
    fn execute(&self, data: &mut T) -> Result<(), SagaStepError>;
    fn compensate(&self, data: &T) -> Result<(), SagaStepError>;
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

pub struct SagaOrchestrator<T: Clone> {
    steps: Vec<Box<dyn SagaStep<T>>>,
}

impl<T: Clone> SagaOrchestrator<T> {
    pub fn new(steps: Vec<Box<dyn SagaStep<T>>>) -> Self {
        Self { steps }
    }

    pub fn execute(&self, data: &mut T) -> Result<Vec<String>, SagaError> {
        let mut completed: Vec<&dyn SagaStep<T>> = Vec::new();
        let mut log: Vec<String> = Vec::new();

        for step in &self.steps {
            println!("[saga] executing: {}", step.name());
            match step.execute(data) {
                Ok(()) => {
                    log.push(format!("✓ {}", step.name()));
                    completed.push(step.as_ref());
                }
                Err(err) => {
                    log.push(format!("✗ {}", step.name()));
                    eprintln!("[saga] step '{}' failed: {err}", step.name());

                    let compensation_errors = completed
                        .iter()
                        .rev()
                        .filter_map(|s| {
                            eprintln!("[saga] compensating: {}", s.name());
                            s.compensate(data).err().map(|e| {
                                // ALERT: pager-worthy event
                                eprintln!("[saga] COMPENSATION FAILED '{}': {e}", s.name());
                                e.to_string()
                            })
                        })
                        .collect();

                    return Err(SagaError {
                        failed_step: step.name().to_owned(),
                        cause: err,
                        compensation_errors,
                    });
                }
            }
        }
        Ok(log)
    }
}

// ─── Example: Order Saga ──────────────────────────────────────────────────────

#[derive(Debug, Clone)]
pub struct OrderData {
    pub order_id: String,
    pub customer_id: String,
    pub amount: f64,
    pub item_sku: String,
    pub payment_id: Option<String>,
}

pub struct PaymentStep;
impl SagaStep<OrderData> for PaymentStep {
    fn name(&self) -> &str { "ProcessPayment" }

    fn execute(&self, data: &mut OrderData) -> Result<(), SagaStepError> {
        if data.amount <= 0.0 {
            return Err(SagaStepError::BusinessRule(
                format!("Invalid amount: {}", data.amount)
            ));
        }
        println!("[payment] processing order={} amount={:.2}", data.order_id, data.amount);
        data.payment_id = Some(format!("pay-{}", data.order_id));
        Ok(())
    }

    fn compensate(&self, data: &OrderData) -> Result<(), SagaStepError> {
        // Idempotent: deduplicate at payment service by order_id
        println!("[payment] refunding order={}", data.order_id);
        Ok(())
    }
}

pub struct InventoryStep;
impl SagaStep<OrderData> for InventoryStep {
    fn name(&self) -> &str { "ReserveInventory" }

    fn execute(&self, data: &mut OrderData) -> Result<(), SagaStepError> {
        if data.item_sku.is_empty() {
            return Err(SagaStepError::BusinessRule("Missing SKU".into()));
        }
        println!("[inventory] reserving sku={}", data.item_sku);
        Ok(())
    }

    fn compensate(&self, data: &OrderData) -> Result<(), SagaStepError> {
        println!("[inventory] releasing sku={}", data.item_sku);
        Ok(())
    }
}

// ─── Usage ────────────────────────────────────────────────────────────────────

fn main() {
    let orchestrator: SagaOrchestrator<OrderData> = SagaOrchestrator::new(vec![
        Box::new(PaymentStep),
        Box::new(InventoryStep),
    ]);

    let mut data = OrderData {
        order_id: "ord-001".into(),
        customer_id: "cust-123".into(),
        amount: 49.99,
        item_sku: "WIDGET-XL".into(),
        payment_id: None,
    };

    match orchestrator.execute(&mut data) {
        Ok(log) => log.iter().for_each(|l| println!("{l}")),
        Err(e) => eprintln!("Saga failed: {e}"),
    }
}`,

  java: `// Pattern: Saga (Orchestration variant)
// Reference: Richardson, Microservices Patterns (2018) ch. 4
// Production note: Replace Optional with a proper Result type (Vavr's Either)
//                  and persist SagaContext to a database before each step.

package patterns.saga;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

// ─── Domain types ─────────────────────────────────────────────────────────────

public sealed interface StepOutcome {
    record Success(String stepName) implements StepOutcome {}
    record Failure(String stepName, Exception cause) implements StepOutcome {}
}

public class SagaException extends RuntimeException {
    private final String failedStep;
    private final List<Exception> compensationErrors;

    public SagaException(String failedStep, Exception cause, List<Exception> compensationErrors) {
        super("Saga failed at step '" + failedStep + "': " + cause.getMessage(), cause);
        this.failedStep = failedStep;
        this.compensationErrors = List.copyOf(compensationErrors);
    }

    public String failedStep() { return failedStep; }
    public List<Exception> compensationErrors() { return compensationErrors; }
}

// ─── Step interface ───────────────────────────────────────────────────────────

public interface SagaStep<T> {
    String name();
    void execute(T data) throws Exception;
    void compensate(T data) throws Exception;
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

public final class SagaOrchestrator<T> {
    private static final Logger LOG = Logger.getLogger(SagaOrchestrator.class.getName());
    private final List<SagaStep<T>> steps;

    public SagaOrchestrator(List<SagaStep<T>> steps) {
        this.steps = List.copyOf(steps);
    }

    public List<StepOutcome> execute(T data) {
        var outcomes = new ArrayList<StepOutcome>();
        var completed = new ArrayList<SagaStep<T>>();

        for (var step : steps) {
            LOG.info("saga.step.execute: " + step.name());
            try {
                step.execute(data);
                outcomes.add(new StepOutcome.Success(step.name()));
                completed.add(step);
            } catch (Exception ex) {
                LOG.log(Level.SEVERE, "saga.step.failed: " + step.name(), ex);
                outcomes.add(new StepOutcome.Failure(step.name(), ex));
                var compErrors = compensate(data, completed);
                throw new SagaException(step.name(), ex, compErrors);
            }
        }
        return Collections.unmodifiableList(outcomes);
    }

    private List<Exception> compensate(T data, List<SagaStep<T>> completed) {
        var errors = new ArrayList<Exception>();
        var reversed = new ArrayList<>(completed);
        Collections.reverse(reversed);

        for (var step : reversed) {
            LOG.warning("saga.step.compensate: " + step.name());
            try {
                step.compensate(data);
            } catch (Exception ex) {
                // Compensation failure → page on-call; do not swallow
                LOG.log(Level.SEVERE,
                    "saga.compensation.FAILED — manual intervention: " + step.name(), ex);
                errors.add(ex);
            }
        }
        return errors;
    }
}

// ─── Example: Order Saga ──────────────────────────────────────────────────────

public record OrderData(
    String orderId,
    String customerId,
    double amount,
    String itemSku,
    // Mutable ref for payment step output — use a shared context object in prod
    Optional<String> paymentId
) {
    public OrderData withPaymentId(String id) {
        return new OrderData(orderId, customerId, amount, itemSku, Optional.of(id));
    }
}

public final class PaymentStep implements SagaStep<OrderData[]> {
    public String name() { return "ProcessPayment"; }

    public void execute(OrderData[] ctx) throws Exception {
        var data = ctx[0];
        if (data.amount() <= 0) throw new IllegalArgumentException("Invalid amount: " + data.amount());
        System.out.printf("[payment] processing order=%s amount=%.2f%n", data.orderId(), data.amount());
        ctx[0] = data.withPaymentId("pay-" + data.orderId()); // update shared context
    }

    public void compensate(OrderData[] ctx) {
        // Idempotent: payment service deduplicates by orderId
        System.out.printf("[payment] refunding order=%s%n", ctx[0].orderId());
    }
}

public final class InventoryStep implements SagaStep<OrderData[]> {
    public String name() { return "ReserveInventory"; }

    public void execute(OrderData[] ctx) throws Exception {
        if (ctx[0].itemSku().isBlank()) throw new IllegalArgumentException("Missing SKU");
        System.out.printf("[inventory] reserving sku=%s%n", ctx[0].itemSku());
    }

    public void compensate(OrderData[] ctx) {
        System.out.printf("[inventory] releasing sku=%s%n", ctx[0].itemSku());
    }
}

// ─── Usage ────────────────────────────────────────────────────────────────────

public class SagaMain {
    public static void main(String[] args) {
        var orchestrator = new SagaOrchestrator<>(
            List.of(new PaymentStep(), new InventoryStep())
        );

        // Use array wrapper to allow mutation inside lambdas/step impls
        var ctx = new OrderData[]{new OrderData(
            "ord-001", "cust-123", 49.99, "WIDGET-XL", Optional.empty()
        )};

        try {
            var outcomes = orchestrator.execute(ctx);
            outcomes.forEach(o -> switch (o) {
                case StepOutcome.Success s -> System.out.println("✓ " + s.stepName());
                case StepOutcome.Failure f -> System.out.println("✗ " + f.stepName());
            });
        } catch (SagaException e) {
            System.err.println("Saga failed: " + e.getMessage());
        }
    }
}`,
};

const awsCdkCode = `// aws/iac/cdk-ts/saga-stack.ts
// Saga Orchestration via AWS Step Functions (Standard Workflow)

import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class OrderSagaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Saga log — persists state per execution for recovery
    const sagaTable = new dynamodb.Table(this, 'SagaLog', {
      tableName: 'order-saga-log',
      partitionKey: { name: 'sagaId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'step', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
    });

    // Step Functions Lambda integrations (one per saga step)
    const paymentFn = lambda.Function.fromFunctionName(this, 'PaymentFn', 'order-payment-step');
    const inventoryFn = lambda.Function.fromFunctionName(this, 'InventoryFn', 'order-inventory-step');
    const compensatePaymentFn = lambda.Function.fromFunctionName(this, 'CompensatePayment', 'order-payment-compensate');

    // ─── Steps ───────────────────────────────────────────────────────────────

    const processPayment = new tasks.LambdaInvoke(this, 'ProcessPayment', {
      lambdaFunction: paymentFn,
      resultPath: '$.paymentResult',
    }).addCatch(new tasks.LambdaInvoke(this, 'CompensatePayment', {
      lambdaFunction: compensatePaymentFn,
      resultPath: '$.compensationResult',
    }).next(new sfn.Fail(this, 'SagaFailed', {
      error: 'SagaCompensated',
      cause: 'Payment processing failed; all compensations executed',
    })), { resultPath: '$.error' });

    const reserveInventory = new tasks.LambdaInvoke(this, 'ReserveInventory', {
      lambdaFunction: inventoryFn,
      resultPath: '$.inventoryResult',
    });

    const sagaComplete = new sfn.Succeed(this, 'SagaComplete');

    // ─── State machine definition ─────────────────────────────────────────────

    const definition = processPayment
      .next(reserveInventory)
      .next(sagaComplete);

    const stateMachine = new sfn.StateMachine(this, 'OrderSaga', {
      definition,
      stateMachineType: sfn.StateMachineType.STANDARD, // use STANDARD for long-running sagas
      tracingEnabled: true, // enables X-Ray tracing
      logs: {
        destination: new cdk.aws_logs.LogGroup(this, 'SagaLogs'),
        level: sfn.LogLevel.ALL,
      },
    });

    // IAM: grant state machine permission to invoke Lambdas
    paymentFn.grantInvoke(stateMachine);
    inventoryFn.grantInvoke(stateMachine);
    compensatePaymentFn.grantInvoke(stateMachine);
  }
}`;

const awsTerraformCode = `# aws/iac/terraform/saga.tf
# Minimal Terraform for Step Functions Order Saga

resource "aws_sfn_state_machine" "order_saga" {
  name     = "order-saga"
  role_arn = aws_iam_role.sfn_role.arn
  type     = "STANDARD"  # Required for sagas > 5 minutes

  definition = jsonencode({
    Comment = "Order Saga Orchestrator",
    StartAt = "ProcessPayment",
    States = {
      ProcessPayment = {
        Type     = "Task",
        Resource = "arn:aws:states:::lambda:invoke",
        Parameters = {
          FunctionName = aws_lambda_function.payment_step.arn,
          "Payload.$"  = "$"
        },
        ResultPath = "$.paymentResult",
        Catch = [{
          ErrorEquals = ["States.ALL"],
          Next        = "CompensatePayment",
          ResultPath  = "$.error"
        }],
        Next = "ReserveInventory"
      },
      ReserveInventory = {
        Type     = "Task",
        Resource = "arn:aws:states:::lambda:invoke",
        Parameters = {
          FunctionName = aws_lambda_function.inventory_step.arn,
          "Payload.$"  = "$"
        },
        ResultPath = "$.inventoryResult",
        Catch = [{
          ErrorEquals = ["States.ALL"],
          Next        = "CompensatePayment",  # Compensate in reverse order
          ResultPath  = "$.error"
        }],
        Next = "SagaComplete"
      },
      CompensatePayment = {
        Type     = "Task",
        Resource = "arn:aws:states:::lambda:invoke",
        Parameters = {
          FunctionName = aws_lambda_function.payment_compensate.arn,
          "Payload.$"  = "$"
        },
        Next = "SagaFailed"
      },
      SagaComplete = { Type = "Succeed" },
      SagaFailed   = { Type = "Fail", Error = "SagaCompensated" }
    }
  })

  logging_configuration {
    log_destination        = "\${aws_cloudwatch_log_group.saga.arn}:*"
    include_execution_data = true
    level                  = "ALL"
  }

  tracing_configuration { enabled = true }
}

resource "aws_cloudwatch_log_group" "saga" {
  name              = "/aws/states/order-saga"
  retention_in_days = 30
}

# Cost note: Step Functions Standard charges per state transition (~$0.025/1000).
# For high-volume sagas (>1M/month), evaluate Express Workflows (at-least-once, ~$1/1M).`;

const azureCode = `// azure/iac/bicep/saga.bicep
// Saga Orchestration via Azure Durable Functions

@description('Location for all resources')
param location string = resourceGroup().location

// Storage account required by Durable Functions for state
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'sagastatestorage'
  location: location
  kind: 'StorageV2'
  sku: { name: 'Standard_LRS' }
}

resource hostingPlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: 'saga-hosting-plan'
  location: location
  sku: { name: 'Y1', tier: 'Dynamic' }  // Consumption plan
}

resource functionApp 'Microsoft.Web/sites@2023-01-01' = {
  name: 'order-saga-orchestrator'
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      appSettings: [
        { name: 'AzureWebJobsStorage', value: storageAccount.properties.primaryEndpoints.blob }
        { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' }
        { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'dotnet-isolated' }
        // Durable Functions uses Table Storage for saga state by default
        // Consider CosmosDB backend for > 10k concurrent sagas
        { name: 'DURABLE_TASK_HUB_NAME', value: 'OrderSagaHub' }
      ]
    }
  }
}

// Azure SDK: Durable Functions orchestrator function (C# reference)
// The Durable Functions SDK handles retry, state persistence, and replay.
/*
[FunctionName("OrderSagaOrchestrator")]
public static async Task RunOrchestrator(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var order = context.GetInput<OrderData>();
    var compensations = new Stack<string>();

    try
    {
        await context.CallActivityAsync("ProcessPayment", order);
        compensations.Push("CompensatePayment");

        await context.CallActivityAsync("ReserveInventory", order);
        compensations.Push("ReleaseInventory");
    }
    catch (FunctionFailedException ex)
    {
        // Execute compensations in reverse — Durable Functions guarantees
        // at-least-once execution of each activity.
        while (compensations.TryPop(out var comp))
            await context.CallActivityAsync(comp, order);
        throw;
    }
}
*/`;

const gcpCode = `# gcp/iac/terraform/saga.tf
# Saga Orchestration via GCP Workflows

resource "google_workflows_workflow" "order_saga" {
  name   = "order-saga-orchestrator"
  region = "us-central1"

  # GCP Workflows uses YAML/JSON DSL — compensation must be coded explicitly
  source_contents = yamlencode({
    main = {
      params = ["order"],
      steps = [
        {
          processPayment = {
            try = {
              call   = "http.post",
              args   = {
                url  = "\${sys.get_env(\"PAYMENT_SERVICE_URL\")}/process",
                body = "\${order}"
              },
              result = "paymentResult"
            },
            except = {
              as = "e",
              steps = [{ sagaFailed = { raise = "\${e}" } }]
            }
          }
        },
        {
          reserveInventory = {
            try = {
              call   = "http.post",
              args   = {
                url  = "\${sys.get_env(\"INVENTORY_SERVICE_URL\")}/reserve",
                body = "\${order}"
              },
              result = "inventoryResult"
            },
            except = {
              as = "e",
              steps = [
                {
                  compensatePayment = {
                    call = "http.post",
                    args = {
                      url  = "\${sys.get_env(\"PAYMENT_SERVICE_URL\")}/refund",
                      body = "\${order}"
                    }
                  }
                },
                { sagaFailed = { raise = "\${e}" } }
              ]
            }
          }
        },
        { returnSuccess = { return = "order" } }
      ]
    }
  })
}

# Note: GCP Workflows does not have a native "catch-all + compensate" construct.
# Compensation must be wired explicitly in each except block.
# For complex sagas (5+ steps), consider Temporal.io self-hosted on GKE instead.
# GCP Cloud Spanner recommended for the saga log if using Firestore at scale.`;

function ImplTab() {
  const [mainTab, setMainTab] = useState("core");
  const [lang, setLang] = useState("go");
  const [awsSubTab, setAwsSubTab] = useState("cdk-ts");
  const [azureSubTab, setAzureSubTab] = useState("bicep");
  const [gcpSubTab, setGcpSubTab] = useState("terraform");

  const langs = ["go", "python", "typescript", "rust", "java"];
  const mainTabs = [
    { id: "core", label: "Core" },
    { id: "aws", label: "AWS", color: C.aws },
    { id: "azure", label: "Azure", color: C.azure },
    { id: "gcp", label: "GCP", color: C.gcp },
  ];

  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
        {mainTabs.map(t => (
          <button key={t.id} onClick={() => setMainTab(t.id)}
            style={styles.subTab(mainTab === t.id, t.color || C.blue)}>
            {t.label}
          </button>
        ))}
      </div>

      {mainTab === "core" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {langs.map(l => (
              <button key={l} onClick={() => setLang(l)} style={styles.subTab(lang === l)}>
                {l}
              </button>
            ))}
          </div>
          <CodePanel code={coreCode[lang]} filename={`implementations/core/saga.${lang === "typescript" ? "ts" : lang === "python" ? "py" : lang === "rust" ? "rs" : lang === "java" ? "java" : "go"}`} />
        </>
      )}

      {mainTab === "aws" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ id: "cdk-ts", label: "CDK (TypeScript)" }, { id: "terraform", label: "Terraform" }].map(t => (
              <button key={t.id} onClick={() => setAwsSubTab(t.id)} style={styles.subTab(awsSubTab === t.id, C.aws)}>{t.label}</button>
            ))}
          </div>
          {awsSubTab === "cdk-ts" && <CodePanel code={awsCdkCode} filename="aws/iac/cdk-ts/saga-stack.ts" />}
          {awsSubTab === "terraform" && <CodePanel code={awsTerraformCode} filename="aws/iac/terraform/saga.tf" />}
          <div style={{ ...styles.card, fontSize: 12, color: C.muted, marginTop: 8 }}>
            <span style={{ color: C.aws, fontWeight: 600 }}>AWS Note: </span>
            Step Functions Standard is the preferred saga orchestrator. It persists execution state in S3 automatically, supports wait-for-callback patterns for async services, and integrates with CloudWatch + X-Ray for full observability.
            Express Workflows cost less but provide only at-least-once execution — unsuitable for financial sagas.
          </div>
        </>
      )}

      {mainTab === "azure" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ id: "bicep", label: "Bicep" }, { id: "terraform", label: "Terraform" }].map(t => (
              <button key={t.id} onClick={() => setAzureSubTab(t.id)} style={styles.subTab(azureSubTab === t.id, C.azure)}>{t.label}</button>
            ))}
          </div>
          <CodePanel code={azureCode} filename="azure/iac/bicep/saga.bicep" />
          <div style={{ ...styles.card, fontSize: 12, color: C.muted, marginTop: 8 }}>
            <span style={{ color: C.azure, fontWeight: 600 }}>Azure Note: </span>
            Azure Durable Functions is the closest managed equivalent to AWS Step Functions for saga orchestration.
            The Durable Task Framework handles state replay transparently — the orchestrator function re-executes on restart but side effects are replayed from the event log.
            For &gt;10k concurrent sagas, switch the Durable Functions backend from Azure Table Storage to CosmosDB.
          </div>
        </>
      )}

      {mainTab === "gcp" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button style={styles.subTab(true, C.gcp)}>Terraform</button>
          </div>
          <CodePanel code={gcpCode} filename="gcp/iac/terraform/saga.tf" />
          <div style={{ ...styles.card, fontSize: 12, color: C.muted, marginTop: 8 }}>
            <span style={{ color: C.gcp, fontWeight: 600 }}>GCP Note: </span>
            GCP Workflows is lower-level than AWS Step Functions — it requires compensation logic to be wired explicitly in each exception handler rather than using a declarative catch-all.
            For teams already on GCP with complex saga requirements (5+ steps, branching), consider Temporal.io self-hosted on GKE or Spanner-backed orchestration rather than Workflows.
          </div>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 4 — LEADERSHIP
// ══════════════════════════════════════════════════════════════════════════════
function LeadershipTab() {
  const sections = [
    {
      title: "Explain to Your Team (Standup / RFC Intro)",
      color: C.blue,
      content: `The Saga pattern replaces distributed ACID transactions with a sequence of local commits, each paired with a compensating transaction that can undo its effect. When a step fails, we run compensations in reverse — like a programmatic undo stack. We trade strict isolation for availability and independent deployability; services never hold locks across service boundaries.`,
    },
    {
      title: "Justify the Decision (Architecture Review)",
      color: C.green,
      content: `2PC (two-phase commit) blocks all participants until the slowest confirms — it degrades availability, is unsupported by Kafka/RabbitMQ and most NoSQL databases, and creates a single coordinator SPOF. The Saga pattern gives us ACD guarantees (atomicity via compensation, consistency via invariant enforcement, durability via local commits) at the cost of isolation — which we manage with semantic locks and idempotency keys. At our transaction volume (< 1000/sec), orchestration overhead via Step Functions / Durable Functions is ~2–5ms per step, acceptable for our SLA. This is the industry-standard approach used by Uber, Amazon, and Netflix for cross-service transactions.`,
    },
    {
      title: "Failure Modes & Observability",
      color: C.amber,
      content: null,
      list: [
        { label: "Compensation failure", detail: "A compensating transaction fails after forward progress was partially undone. The system is now inconsistent. Alert immediately, persist the saga state, require manual resolution. Never silently swallow compensation errors." },
        { label: "Semantic lock leak", detail: "A PENDING record is never cleared because a saga crashed without completing compensation. Use a background job to detect records stuck in PENDING for > N minutes and trigger compensation or alert." },
        { label: "Duplicate message delivery", detail: "At-least-once delivery causes a step to execute twice. Every step must be idempotent — deduplicate using the saga correlation ID at the receiver. Use the outbox pattern for reliable publish." },
        { label: "Out-of-order events (choreography)", detail: "Event B arrives before Event A due to consumer lag. Implement version counters or timestamps and discard or requeue events that arrive out of sequence." },
        { label: "Observability", detail: "Trace every saga with a correlation ID (X-Saga-ID header). Emit saga.started, saga.step.completed, saga.step.failed, saga.compensating, saga.completed, saga.failed events. Alert on: compensation rate > 1%, saga duration p99 > SLA, any compensation failure." },
      ],
    },
    {
      title: "Scale Implications",
      color: C.purple,
      content: null,
      list: [
        { label: "10x traffic", detail: "Choreography sagas: ensure your message broker can handle the fan-out. Evaluate consumer group lag. Semantic locks become a hotspot on shared records — consider row-level locking strategies." },
        { label: "100x traffic", detail: "Orchestration overhead is measurable at >10k sagas/sec. Step Functions Express (AWS) or partitioned Temporal workers become necessary. Saga log (DynamoDB/Cosmos) becomes a hot partition — shard by sagaId prefix." },
        { label: "Revisit when", detail: "Compensation rate rises above acceptable threshold, compensation failures require frequent manual intervention, or the team struggles to reason about partial failure states — these signal either implementation bugs or a fundamental mismatch between the saga model and the business domain." },
      ],
    },
    {
      title: "Code Review Checklist",
      color: C.blue,
      content: null,
      list: [
        { label: "Idempotency", detail: "Every execute() and compensate() must be safe to call more than once with the same inputs. Check for deduplication logic." },
        { label: "Compensation coverage", detail: "Every step that has a side effect must have a corresponding compensate(). Verify the compensation is meaningful — not a no-op." },
        { label: "Pivot transaction placement", detail: "Non-compensable operations (external charges, emails) must be the last step, not an intermediate one." },
        { label: "Semantic lock lifecycle", detail: "Every PENDING flag set by execute() must be cleared by either the final step (success) or compensate() (failure). Check both paths." },
        { label: "Error propagation", detail: "Compensation failures must be logged at CRITICAL level and propagated — never swallowed. Check that monitoring will fire." },
        { label: "Correlation IDs", detail: "Saga ID must flow through all downstream calls and log entries. Verify it's injected into the context / MDC." },
      ],
    },
    {
      title: "Questions for Design Review",
      color: C.amber,
      content: null,
      list: [
        { label: null, detail: "What is the pivot transaction — the last point of no return? Is it placed as late as possible?" },
        { label: null, detail: "How does each compensating transaction handle being called twice (idempotency)?" },
        { label: null, detail: "What happens if a compensation itself fails? Who gets paged? What is the recovery procedure?" },
        { label: null, detail: "How are concurrent sagas operating on the same record prevented from creating dirty reads? Which countermeasure (semantic lock, pessimistic reorder, reread values) applies here?" },
        { label: null, detail: "Is orchestration or choreography the right fit? How many services are involved? What is the expected debugging story when a saga stalls in production at 3am?" },
        { label: null, detail: "How is the saga observable? Can you query 'all sagas currently in COMPENSATING state' within 30 seconds of receiving a page?" },
      ],
    },
  ];

  return (
    <div style={{ padding: "24px 0" }}>
      {sections.map((s) => (
        <div key={s.title} style={{ ...styles.card }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 3, height: 20, background: s.color, borderRadius: 2 }} />
            <div style={{ ...styles.h3, margin: 0 }}>{s.title}</div>
          </div>
          {s.content && <p style={{ margin: 0, color: C.text, lineHeight: 1.7, fontSize: 13 }}>{s.content}</p>}
          {s.list && s.list.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13 }}>
              {item.label && <span style={{ ...styles.badge(s.color), flexShrink: 0, alignSelf: "flex-start" }}>{item.label}</span>}
              {!item.label && <span style={{ color: s.color, flexShrink: 0 }}>→</span>}
              <span style={{ color: C.text, lineHeight: 1.6 }}>{item.detail}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "arch", label: "Architecture" },
  { id: "concepts", label: "Core Concepts" },
  { id: "impl", label: "Implementations" },
  { id: "leadership", label: "Leadership" },
];

export default function SagaPattern() {
  const [tab, setTab] = useState("arch");

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ padding: "18px 0 4px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ ...styles.badge(C.amber), fontSize: 12 }}>Distributed Systems</span>
              <span style={{ ...styles.badge(C.blue), fontSize: 12 }}>Garcia-Molina & Salem, 1987</span>
              <span style={{ ...styles.badge(C.green), fontSize: 12 }}>Richardson, Microservices Patterns 2018</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginTop: 10, letterSpacing: "-0.02em" }}>
              The Saga Pattern
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 6 }}>
              Distributed transactions across microservices without 2PC — using local commits and compensating transactions
            </div>
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={styles.tab(tab === t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px 24px" }}>
        {tab === "arch" && <ArchTab />}
        {tab === "concepts" && <ConceptsTab />}
        {tab === "impl" && <ImplTab />}
        {tab === "leadership" && <LeadershipTab />}
      </div>
    </div>
  );
}
