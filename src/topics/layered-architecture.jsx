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
  cyan: "#06b6d4",
};

const CodeBlock = ({ code, language = "go", filename }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ background: "#161b22", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${colors.border}` }}>
        <span style={{ color: colors.muted, fontFamily: "monospace", fontSize: 12 }}>{filename}</span>
        <button onClick={copy} style={{ background: copied ? colors.green : colors.surface, color: copied ? "#fff" : colors.muted, border: `1px solid ${colors.border}`, borderRadius: 4, padding: "2px 10px", fontSize: 11, cursor: "pointer" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre style={{ background: "#161b22", padding: 16, margin: 0, overflowX: "auto", fontSize: 12, lineHeight: 1.6, color: "#cdd9e5", fontFamily: "monospace" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

const ConceptCard = ({ term, source, definition, why, mistake, extra }) => (
  <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 20, marginBottom: 12 }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
      <span style={{ color: colors.blue, fontWeight: 600, fontSize: 15 }}>{term}</span>
      {source && <span style={{ color: colors.muted, fontSize: 11, fontStyle: "italic" }}>as defined by: {source}</span>}
    </div>
    <p style={{ color: colors.text, fontSize: 13, margin: "0 0 8px 0", lineHeight: 1.6 }}>{definition}</p>
    <div style={{ borderLeft: `3px solid ${colors.green}`, paddingLeft: 10, marginBottom: 8 }}>
      <span style={{ color: colors.green, fontSize: 11, fontWeight: 600 }}>WHY IT MATTERS  </span>
      <span style={{ color: colors.muted, fontSize: 12 }}>{why}</span>
    </div>
    <div style={{ borderLeft: `3px solid ${colors.red}`, paddingLeft: 10 }}>
      <span style={{ color: colors.red, fontSize: 11, fontWeight: 600 }}>COMMON MISTAKE  </span>
      <span style={{ color: colors.muted, fontSize: 12 }}>{mistake}</span>
    </div>
    {extra && <div style={{ marginTop: 8, borderLeft: `3px solid ${colors.amber}`, paddingLeft: 10 }}>
      <span style={{ color: colors.amber, fontSize: 11, fontWeight: 600 }}>NOTE  </span>
      <span style={{ color: colors.muted, fontSize: 12 }}>{extra}</span>
    </div>}
  </div>
);

// ── ARCHITECTURE DIAGRAM ─────────────────────────────────────────────────────

const ArchDiagram = () => (
  <div>
    <h3 style={{ color: colors.text, fontSize: 14, marginBottom: 16, fontWeight: 600 }}>Request/Response (HTTP API) — Classic Layered Flow</h3>
    <svg viewBox="0 0 800 420" style={{ width: "100%", borderRadius: 8, border: `1px solid ${colors.border}` }}>
      <rect width="800" height="420" fill="#0f1117" />

      {/* Legend */}
      {[
        { x: 30, color: colors.blue, label: "Command / Input" },
        { x: 175, color: colors.green, label: "Query / Output" },
        { x: 315, color: colors.amber, label: "Event / Async" },
        { x: 455, color: colors.purple, label: "Storage" },
      ].map(({ x, color, label }) => (
        <g key={label}>
          <rect x={x} y={14} width={12} height={12} rx={2} fill={color} opacity={0.85} />
          <text x={x + 17} y={24} fill={colors.muted} fontSize={11}>{label}</text>
        </g>
      ))}

      {/* Layers */}
      {[
        { y: 60, label: "Transport / Delivery Layer", sub: "HTTP Handler · gRPC · CLI · WebSocket", color: colors.blue, desc: "entry point" },
        { y: 155, label: "Service Layer", sub: "Business Logic · Use Cases · Orchestration", color: colors.green, desc: "core" },
        { y: 250, label: "Repository / Port Layer", sub: "Interface contracts — no implementation details", color: colors.purple, desc: "abstraction" },
        { y: 320, label: "Infrastructure Layer", sub: "PostgreSQL · Redis · Kafka · HTTP clients · S3", color: "#4b5563", desc: "I/O" },
      ].map(({ y, label, sub, color, desc }) => (
        <g key={label}>
          <rect x={60} y={y} width={680} height={60} rx={6} fill={color} fillOpacity={0.1} stroke={color} strokeOpacity={0.5} strokeWidth={1} />
          <text x={80} y={y + 26} fill={color} fontSize={13} fontWeight="600">{label}</text>
          <text x={80} y={y + 44} fill={colors.muted} fontSize={11}>{sub}</text>
          <rect x={690} y={y + 10} width={40} height={18} rx={3} fill={color} fillOpacity={0.25} />
          <text x={710} y={y + 23} fill={color} fontSize={9} textAnchor="middle">{desc}</text>
        </g>
      ))}

      {/* Down arrows — request */}
      {[115, 210].map(y => (
        <g key={`d${y}`}>
          <line x1={200} y1={y} x2={200} y2={y + 30} stroke={colors.blue} strokeWidth={1.5} markerEnd="url(#arrowBlue)" />
          <rect x={207} y={y + 8} width={90} height={14} rx={3} fill={colors.blue} fillOpacity={0.12} />
          <text x={252} y={y + 19} fill={colors.blue} fontSize={10} textAnchor="middle">cmd / request</text>
        </g>
      ))}
      <g>
        <line x1={200} y1={305} x2={200} y2={335} stroke={colors.purple} strokeWidth={1.5} markerEnd="url(#arrowPurple)" />
        <rect x={207} y={313} width={90} height={14} rx={3} fill={colors.purple} fillOpacity={0.12} />
        <text x={252} y={324} fill={colors.purple} fontSize={10} textAnchor="middle">interface call</text>
      </g>

      {/* Up arrows — response */}
      {[305, 210, 115].map((y, i) => (
        <g key={`u${y}`}>
          <line x1={580} y1={y + 35} x2={580} y2={y + 5} stroke={colors.green} strokeWidth={1.5} markerEnd="url(#arrowGreen)" />
          <rect x={517} y={y + 12} width={58} height={14} rx={3} fill={colors.green} fillOpacity={0.12} />
          <text x={546} y={y + 23} fill={colors.green} fontSize={10} textAnchor="middle">result/data</text>
        </g>
      ))}

      {/* Dependency rule annotation */}
      <text x={400} y={405} fill={colors.amber} fontSize={11} textAnchor="middle" fontStyle="italic">
        ↑ Dependency Rule: outer layers depend on inner — never the reverse
      </text>

      <defs>
        <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={colors.blue} />
        </marker>
        <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={colors.green} />
        </marker>
        <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={colors.purple} />
        </marker>
        <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={colors.amber} />
        </marker>
      </defs>
    </svg>

    <div style={{ height: 32 }} />
    <h3 style={{ color: colors.text, fontSize: 14, marginBottom: 16, fontWeight: 600 }}>Event-Driven Application — How Layers Map</h3>
    <svg viewBox="0 0 800 480" style={{ width: "100%", borderRadius: 8, border: `1px solid ${colors.border}` }}>
      <rect width="800" height="480" fill="#0f1117" />

      {/* Producer side */}
      <text x={165} y={30} fill={colors.muted} fontSize={11} textAnchor="middle">PRODUCER SERVICE</text>
      <rect x={30} y={50} width={260} height={55} rx={6} fill={colors.blue} fillOpacity={0.1} stroke={colors.blue} strokeOpacity={0.4} strokeWidth={1} />
      <text x={160} y={74} fill={colors.blue} fontSize={12} fontWeight="600" textAnchor="middle">Transport Layer</text>
      <text x={160} y={91} fill={colors.muted} fontSize={10} textAnchor="middle">Consumer/Worker · Kafka Consumer · SQS Poller</text>

      <rect x={30} y={130} width={260} height={55} rx={6} fill={colors.green} fillOpacity={0.1} stroke={colors.green} strokeOpacity={0.4} strokeWidth={1} />
      <text x={160} y={154} fill={colors.green} fontSize={12} fontWeight="600" textAnchor="middle">Service / Handler Layer</text>
      <text x={160} y={171} fill={colors.muted} fontSize={10} textAnchor="middle">Event handler · domain logic · side effects</text>

      <rect x={30} y={210} width={260} height={55} rx={6} fill={colors.purple} fillOpacity={0.1} stroke={colors.purple} strokeOpacity={0.4} strokeWidth={1} />
      <text x={160} y={234} fill={colors.purple} fontSize={12} fontWeight="600" textAnchor="middle">Repository + Publisher Port</text>
      <text x={160} y={251} fill={colors.muted} fontSize={10} textAnchor="middle">Persist state · publish outbound event</text>

      <rect x={30} y={290} width={260} height={55} rx={6} fill="#4b5563" fillOpacity={0.15} stroke="#4b5563" strokeOpacity={0.5} strokeWidth={1} />
      <text x={160} y={314} fill={colors.muted} fontSize={12} fontWeight="600" textAnchor="middle">Infrastructure</text>
      <text x={160} y={331} fill={colors.muted} fontSize={10} textAnchor="middle">DB driver · Kafka producer · HTTP client</text>

      {/* Down arrows left side */}
      {[105, 185, 265].map(y => (
        <line key={y} x1={160} y1={y} x2={160} y2={y + 22} stroke={colors.amber} strokeWidth={1.5} markerEnd="url(#arrowA2)" strokeDasharray="4 2" />
      ))}

      {/* Broker */}
      <rect x={320} y={160} width={160} height={160} rx={8} fill={colors.amber} fillOpacity={0.08} stroke={colors.amber} strokeOpacity={0.5} strokeWidth={1.5} />
      <text x={400} y={225} fill={colors.amber} fontSize={13} fontWeight="600" textAnchor="middle">Message</text>
      <text x={400} y={243} fill={colors.amber} fontSize={13} fontWeight="600" textAnchor="middle">Broker</text>
      <text x={400} y={265} fill={colors.muted} fontSize={10} textAnchor="middle">Kafka / SQS / RabbitMQ</text>
      <text x={400} y={280} fill={colors.muted} fontSize={10} textAnchor="middle">NATS / Pub/Sub</text>

      {/* Publish arrow */}
      <line x1={290} y1={318} x2={322} y2={280} stroke={colors.amber} strokeWidth={1.5} markerEnd="url(#arrowA2)" />
      <text x={296} y={309} fill={colors.amber} fontSize={9}>publish</text>

      {/* Subscribe arrow */}
      <line x1={480} y1={250} x2={512} y2={200} stroke={colors.amber} strokeWidth={1.5} markerEnd="url(#arrowA2)" />
      <text x={485} y={240} fill={colors.amber} fontSize={9}>subscribe</text>

      {/* Consumer side */}
      <text x={635} y={30} fill={colors.muted} fontSize={11} textAnchor="middle">CONSUMER SERVICE</text>
      <rect x={510} y={50} width={260} height={55} rx={6} fill={colors.blue} fillOpacity={0.1} stroke={colors.blue} strokeOpacity={0.4} strokeWidth={1} />
      <text x={640} y={74} fill={colors.blue} fontSize={12} fontWeight="600" textAnchor="middle">Transport Layer (Consumer)</text>
      <text x={640} y={91} fill={colors.muted} fontSize={10} textAnchor="middle">Poll / push handler · deserialize envelope</text>

      <rect x={510} y={130} width={260} height={55} rx={6} fill={colors.green} fillOpacity={0.1} stroke={colors.green} strokeOpacity={0.4} strokeWidth={1} />
      <text x={640} y={154} fill={colors.green} fontSize={12} fontWeight="600" textAnchor="middle">Service / Handler Layer</text>
      <text x={640} y={171} fill={colors.muted} fontSize={10} textAnchor="middle">Validate · apply domain logic · project state</text>

      <rect x={510} y={210} width={260} height={55} rx={6} fill={colors.purple} fillOpacity={0.1} stroke={colors.purple} strokeOpacity={0.4} strokeWidth={1} />
      <text x={640} y={234} fill={colors.purple} fontSize={12} fontWeight="600" textAnchor="middle">Repository Port</text>
      <text x={640} y={251} fill={colors.muted} fontSize={10} textAnchor="middle">Persist projection / read model</text>

      <rect x={510} y={290} width={260} height={55} rx={6} fill="#4b5563" fillOpacity={0.15} stroke="#4b5563" strokeOpacity={0.5} strokeWidth={1} />
      <text x={640} y={314} fill={colors.muted} fontSize={12} fontWeight="600" textAnchor="middle">Infrastructure</text>
      <text x={640} y={331} fill={colors.muted} fontSize={10} textAnchor="middle">DB driver · cache · downstream HTTP</text>

      {/* Down arrows right side */}
      {[105, 185, 265].map(y => (
        <line key={`r${y}`} x1={640} y1={y} x2={640} y2={y + 22} stroke={colors.green} strokeWidth={1.5} markerEnd="url(#arrowG2)" />
      ))}

      {/* DLQ / retry note */}
      <rect x={30} y={370} width={260} height={40} rx={4} fill={colors.red} fillOpacity={0.08} stroke={colors.red} strokeOpacity={0.3} strokeWidth={1} />
      <text x={160} y={387} fill={colors.red} fontSize={10} textAnchor="middle">On failure → retry / DLQ</text>
      <text x={160} y={402} fill={colors.muted} fontSize={9} textAnchor="middle">Transport layer owns ack/nack lifecycle</text>
      <line x1={160} y1={345} x2={160} y2={370} stroke={colors.red} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#arrowR2)" />

      {/* Idempotency note */}
      <rect x={510} y={370} width={260} height={40} rx={4} fill={colors.purple} fillOpacity={0.08} stroke={colors.purple} strokeOpacity={0.3} strokeWidth={1} />
      <text x={640} y={387} fill={colors.purple} fontSize={10} textAnchor="middle">Idempotency check in Service Layer</text>
      <text x={640} y={402} fill={colors.muted} fontSize={9} textAnchor="middle">dedup key → skip if already processed</text>
      <line x1={640} y1={345} x2={640} y2={370} stroke={colors.purple} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#arrowP2)" />

      <text x={400} y={460} fill={colors.muted} fontSize={10} textAnchor="middle" fontStyle="italic">
        Key insight: layers are identical — only the Transport layer changes (HTTP → broker consumer)
      </text>

      <defs>
        <marker id="arrowA2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={colors.amber} />
        </marker>
        <marker id="arrowG2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={colors.green} />
        </marker>
        <marker id="arrowR2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={colors.red} />
        </marker>
        <marker id="arrowP2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={colors.purple} />
        </marker>
      </defs>
    </svg>

    {/* Cloud table */}
    <div style={{ marginTop: 32 }}>
      <h3 style={{ color: colors.text, fontSize: 14, marginBottom: 12, fontWeight: 600 }}>Cloud Provider Mapping</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#161b22" }}>
              {["Layer / Concern", "AWS", "Azure", "GCP"].map((h, i) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: i === 1 ? "#ff9900" : i === 2 ? "#0078d4" : i === 3 ? "#4285f4" : colors.muted, borderBottom: `1px solid ${colors.border}`, fontWeight: 600, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Transport (HTTP)", "API Gateway + Lambda / ALB + ECS", "APIM + App Service / AKS", "Cloud Endpoints + Cloud Run"],
              ["Transport (Consumer)", "SQS Consumer (ECS/Lambda) / Kinesis", "Service Bus Consumer / Event Hubs", "Pub/Sub Push + Cloud Run / pull"],
              ["Service Layer runtime", "ECS Fargate, EKS, Lambda", "AKS, Container Apps, Functions", "Cloud Run, GKE, Cloud Functions"],
              ["Repository (SQL)", "RDS Aurora", "Azure Database (Postgres/MySQL)", "Cloud SQL / AlloyDB"],
              ["Repository (NoSQL)", "DynamoDB", "Cosmos DB", "Firestore / Bigtable"],
              ["Message Broker", "SQS + SNS, Kinesis, MSK (Kafka)", "Service Bus, Event Hubs", "Pub/Sub, Eventarc"],
              ["Cache", "ElastiCache (Redis)", "Azure Cache for Redis", "Memorystore (Redis)"],
              ["Observability", "CloudWatch + X-Ray", "Azure Monitor + App Insights", "Cloud Monitoring + Cloud Trace"],
            ].map(([layer, aws, azure, gcp], i) => (
              <tr key={layer} style={{ background: i % 2 === 0 ? colors.surface : "#161b22" }}>
                <td style={{ padding: "9px 14px", color: colors.text, borderBottom: `1px solid ${colors.border}` }}>{layer}</td>
                <td style={{ padding: "9px 14px", color: "#ff9900", borderBottom: `1px solid ${colors.border}` }}>{aws}</td>
                <td style={{ padding: "9px 14px", color: "#4da6ff", borderBottom: `1px solid ${colors.border}` }}>{azure}</td>
                <td style={{ padding: "9px 14px", color: "#4ade80", borderBottom: `1px solid ${colors.border}` }}>{gcp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ── CONCEPTS TAB ─────────────────────────────────────────────────────────────

const ConceptsTab = () => (
  <div>
    <ConceptCard
      term="Layered Architecture (n-tier)"
      source="Fowler, Patterns of Enterprise Application Architecture, 2002"
      definition="An architectural style that organises code into horizontal strata, each with a single responsibility. Each layer communicates only with its immediate neighbour — higher layers call lower layers, never the reverse."
      why="Separation of concerns: you can swap your PostgreSQL repository for DynamoDB without touching service logic. Testing becomes surgical — unit-test services with a fake repo, integration-test repos against a real DB."
      mistake="Treating layers as folders rather than boundaries. Putting SQL queries in an HTTP handler because 'it's just one call' is a layer violation — it couples your transport to your persistence and kills testability."
    />
    <ConceptCard
      term="Dependency Rule"
      source="Robert C. Martin, Clean Architecture, 2017"
      definition="Source code dependencies must point inward — toward higher-level policy. The service layer must not know that it is called via HTTP; the repository interface must not know it is backed by Postgres."
      why="Enables independent testability and replaceability. Your core domain survives framework upgrades, cloud migrations, and protocol changes."
      mistake="Importing an HTTP framework (e.g. net/http) or a Kafka SDK directly inside service-layer code. Those are infrastructure concerns and belong in the outermost layer."
    />
    <ConceptCard
      term="Transport Layer (Delivery Mechanism)"
      source="Fowler / Clean Architecture"
      definition="The layer responsible for receiving external stimuli — HTTP requests, gRPC calls, message-broker events, CLI commands — and translating them into calls on the service layer. It is the only layer that knows about the protocol."
      why="When you add a Kafka consumer, you add a new Transport adapter. Zero changes to service logic. This is the core value proposition of the layered model in event-driven systems."
      mistake="Placing validation or business logic in the handler. Validation of domain invariants belongs in the service layer. HTTP handlers should only parse, validate shape (field types/presence), and delegate."
      extra="In event-driven apps this layer is a consumer loop: poll → deserialize → call service → ack/nack. The ack/nack lifecycle (retry, DLQ) is entirely a transport concern."
    />
    <ConceptCard
      term="Service Layer"
      source="Fowler, PoEAA — Service Layer pattern"
      definition="Defines the application's boundary and the set of available operations. Orchestrates domain logic, coordinates repository calls, and publishes outbound events. It is the layer that makes things happen."
      why="A service method like CreateOrder(ctx, cmd) is the single authoritative description of what 'creating an order' means. It does not change when you switch from REST to gRPC or from synchronous to event-driven."
      mistake="Making service methods that mirror CRUD (CreateUser / UpdateUser). Service methods should express intent and business operations (RegisterUser, SuspendAccount), not database actions."
    />
    <ConceptCard
      term="Repository Pattern"
      source="Evans, Domain-Driven Design, 2003; Fowler, PoEAA"
      definition="An abstraction that mediates between the domain layer and the data mapping layer. From the domain's perspective, it provides a collection-like interface for accessing domain objects. The interface is defined inside the domain/service layer; its implementation lives in infrastructure."
      why="Repositories are the seam that lets you swap PostgreSQL for DynamoDB in tests and production without touching domain logic. In Go this means an interface defined alongside services, implemented in an /infrastructure or /adapters package."
      mistake="Defining the repository interface in the infrastructure package (e.g. postgres/repo.go). The interface must be defined where it is consumed — in the service layer — not where it is implemented."
    />
    <ConceptCard
      term="Event-Driven Layering vs. Request/Response Layering"
      source="Enterprise Integration Patterns — Hohpe & Woolf; Kleppmann, DDIA"
      definition="In request/response the transport layer is an HTTP handler that blocks waiting for a response. In event-driven, the transport layer is a consumer loop: it polls a broker, deserialises the envelope, calls the same service layer, then acks or nacks. The inner layers are structurally identical."
      why="The same service and repository layers work for both delivery mechanisms. A single AddOrderService can be called by an HTTP handler for synchronous creation and by a Kafka consumer for event-driven replay — no changes required."
      mistake="Building a separate 'event handling' codebase that duplicates domain logic from the HTTP codebase. The transport layer should differ; domain logic should not."
      extra="Idempotency must be handled in the service layer — not the transport. The transport does not know if a message is a retry; the service layer checks a deduplication key before executing side effects."
    />
    <ConceptCard
      term="Outbox Pattern (Transactional Outbox)"
      source="Kleppmann, Designing Data-Intensive Applications; microservices.io"
      definition="A technique to safely publish events in an event-driven system. Instead of writing to the DB and publishing to the broker in two separate operations (dual-write problem), you write the event to an outbox table in the same DB transaction, then a separate relay process reads and publishes it."
      why="Eliminates the dual-write race condition: 'committed to DB but broker down → event lost'. Guarantees at-least-once delivery. Used by Debezium (CDC) and in-process relay loops."
      mistake="Publishing directly to Kafka inside the service method after the DB write. If the broker is unavailable between those two lines, you get a committed DB record with no corresponding event — silent data inconsistency."
    />

    {/* Trade-offs */}
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 20, marginBottom: 12 }}>
      <h3 style={{ color: colors.amber, fontSize: 14, marginBottom: 14, fontWeight: 600 }}>Trade-offs</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ color: colors.green, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>✓ When to Use</div>
          {[
            "Any application that needs to be tested at unit, integration, and e2e levels independently",
            "Teams larger than 2–3 engineers — clear seams reduce coordination overhead",
            "Services that will grow: starting with clean layers costs 20% more up front, saves 200% later",
            "Polyglot persistence — when you may need to swap DB or add a cache layer",
            "Adding event-driven delivery alongside existing HTTP — Transport swaps, nothing else changes",
          ].map(t => <div key={t} style={{ color: colors.muted, fontSize: 12, marginBottom: 6, paddingLeft: 8, borderLeft: `2px solid ${colors.green}` }}>{t}</div>)}
        </div>
        <div>
          <div style={{ color: colors.red, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>✗ When to Reconsider</div>
          {[
            "Throwaway scripts or single-purpose CLIs — the overhead is not justified",
            "Performance-critical hot paths where layer call overhead matters (rare; profile first)",
            "Deeply event-sourced systems where aggregates own all state transitions — consider DDD tactical patterns instead of service-per-use-case",
            "Strict layering can become bureaucratic in very small codebases; pragmatic grouping may suffice",
          ].map(t => <div key={t} style={{ color: colors.muted, fontSize: 12, marginBottom: 6, paddingLeft: 8, borderLeft: `2px solid ${colors.red}` }}>{t}</div>)}
        </div>
      </div>
    </div>

    {/* Real world */}
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 20 }}>
      <h3 style={{ color: colors.purple, fontSize: 14, marginBottom: 12, fontWeight: 600 }}>Real-World Examples</h3>
      {[
        { who: "Stripe", what: "Uses a service-layer pattern internally where each API resource maps to a service object that coordinates idempotency, state machines, and event publishing — decoupled from HTTP handlers." },
        { who: "Uber", what: "Go microservices with transport/handler, service, and storage layers. Adding gRPC without rewriting business logic was a key architectural benefit (Uber Engineering blog, 2016–2018 migration)." },
        { who: "Netflix", what: "Event-driven consumers (Kafka) where each consumer is a thin transport adapter that calls the same domain services used by synchronous API endpoints." },
        { who: "Standard Go community", what: "The 'Standard Package Layout' (Ben Johnson, 2016) and 'go-kit' both advocate domain types at the core, transport adapters at the edge — a direct expression of layered architecture." },
      ].map(({ who, what }) => (
        <div key={who} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${colors.border}` }}>
          <span style={{ color: colors.purple, fontWeight: 600, fontSize: 12 }}>{who}  </span>
          <span style={{ color: colors.muted, fontSize: 12 }}>{what}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── IMPLEMENTATIONS TAB ──────────────────────────────────────────────────────

const goCode = `// Pattern: Layered Architecture
// Reference: Fowler, PoEAA; Clean Architecture (Martin)
// Production note: Interfaces defined alongside consumers (service pkg), implemented in adapters pkg

package main

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"
)

// ─── Domain Types ────────────────────────────────────────────────────────────

type OrderID string
type UserID string

type OrderStatus string

const (
	StatusPending   OrderStatus = "pending"
	StatusConfirmed OrderStatus = "confirmed"
	StatusCancelled OrderStatus = "cancelled"
)

type Order struct {
	ID        OrderID
	UserID    UserID
	Items     []OrderItem
	Status    OrderStatus
	CreatedAt time.Time
}

type OrderItem struct {
	ProductID string
	Quantity  int
	PriceCents int64
}

type CreateOrderCommand struct {
	UserID    UserID
	Items     []OrderItem
	IdempotencyKey string // critical for event-driven callers
}

var (
	ErrOrderNotFound      = errors.New("order not found")
	ErrDuplicateOperation = errors.New("duplicate operation: idempotency key already processed")
	ErrInvalidOrder       = errors.New("invalid order: no items")
)

// ─── Repository Interface (defined here, in the service package) ─────────────
// The interface lives next to the consumer (service), NOT in the infrastructure pkg.

type OrderRepository interface {
	Save(ctx context.Context, order *Order) error
	FindByID(ctx context.Context, id OrderID) (*Order, error)
	FindByIdempotencyKey(ctx context.Context, key string) (*Order, error)
}

type EventPublisher interface {
	Publish(ctx context.Context, event OrderEvent) error
}

// ─── Domain Events ───────────────────────────────────────────────────────────

type OrderEvent struct {
	Type      string
	OrderID   OrderID
	UserID    UserID
	OccurredAt time.Time
}

// ─── Service Layer ───────────────────────────────────────────────────────────

type OrderService struct {
	repo      OrderRepository
	publisher EventPublisher
}

func NewOrderService(repo OrderRepository, pub EventPublisher) *OrderService {
	return &OrderService{repo: repo, publisher: pub}
}

// CreateOrder is a use-case method. It is protocol-agnostic:
// the same method is called by the HTTP handler AND the Kafka consumer.
func (s *OrderService) CreateOrder(ctx context.Context, cmd CreateOrderCommand) (*Order, error) {
	if len(cmd.Items) == 0 {
		return nil, ErrInvalidOrder
	}

	// Idempotency check — critical for at-least-once event delivery
	if cmd.IdempotencyKey != "" {
		if existing, err := s.repo.FindByIdempotencyKey(ctx, cmd.IdempotencyKey); err == nil {
			return existing, nil // already processed, return safely
		}
	}

	order := &Order{
		ID:        OrderID(fmt.Sprintf("ord_%d", time.Now().UnixNano())),
		UserID:    cmd.UserID,
		Items:     cmd.Items,
		Status:    StatusPending,
		CreatedAt: time.Now(),
	}

	if err := s.repo.Save(ctx, order); err != nil {
		return nil, fmt.Errorf("persisting order: %w", err)
	}

	// Publish event — in production use Outbox pattern to avoid dual-write
	event := OrderEvent{
		Type:       "OrderCreated",
		OrderID:    order.ID,
		UserID:     order.UserID,
		OccurredAt: time.Now(),
	}
	if err := s.publisher.Publish(ctx, event); err != nil {
		// Log and continue — Outbox relay will handle retry
		fmt.Printf("warn: event publish failed, outbox will retry: %v\n", err)
	}

	return order, nil
}

func (s *OrderService) GetOrder(ctx context.Context, id OrderID) (*Order, error) {
	order, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("fetching order %s: %w", id, ErrOrderNotFound)
	}
	return order, nil
}

// ─── Infrastructure: In-Memory Repository ───────────────────────────────────

type InMemoryOrderRepository struct {
	mu             sync.RWMutex
	orders         map[OrderID]*Order
	idempotencyIdx map[string]*Order
}

func NewInMemoryOrderRepository() *InMemoryOrderRepository {
	return &InMemoryOrderRepository{
		orders:         make(map[OrderID]*Order),
		idempotencyIdx: make(map[string]*Order),
	}
}

func (r *InMemoryOrderRepository) Save(ctx context.Context, order *Order) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.orders[order.ID] = order
	return nil
}

func (r *InMemoryOrderRepository) FindByID(ctx context.Context, id OrderID) (*Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	o, ok := r.orders[id]
	if !ok {
		return nil, ErrOrderNotFound
	}
	return o, nil
}

func (r *InMemoryOrderRepository) FindByIdempotencyKey(ctx context.Context, key string) (*Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	o, ok := r.idempotencyIdx[key]
	if !ok {
		return nil, ErrOrderNotFound
	}
	return o, nil
}

// ─── Infrastructure: No-Op Event Publisher ──────────────────────────────────

type LogEventPublisher struct{}

func (p *LogEventPublisher) Publish(ctx context.Context, event OrderEvent) error {
	fmt.Printf("[event] %s: order=%s user=%s at=%s\n",
		event.Type, event.OrderID, event.UserID, event.OccurredAt.Format(time.RFC3339))
	return nil
}

// ─── Transport Layer: HTTP Handler ───────────────────────────────────────────
// In a real app this uses net/http or a router. Shown inline for clarity.

type HTTPTransport struct {
	svc *OrderService
}

func (t *HTTPTransport) handleCreateOrder(ctx context.Context, userID string, idempKey string) {
	cmd := CreateOrderCommand{
		UserID: UserID(userID),
		Items: []OrderItem{
			{ProductID: "prod_1", Quantity: 2, PriceCents: 1999},
		},
		IdempotencyKey: idempKey,
	}
	order, err := t.svc.CreateOrder(ctx, cmd)
	if err != nil {
		fmt.Printf("[http] 422 %v\n", err)
		return
	}
	fmt.Printf("[http] 201 created order %s\n", order.ID)
}

// ─── Transport Layer: Event/Message Consumer ─────────────────────────────────
// Different transport, same service. Nothing else changes.

type MessageEvent struct {
	UserID         string
	IdempotencyKey string
	Items          []OrderItem
}

type KafkaTransport struct {
	svc *OrderService
}

func (t *KafkaTransport) handleMessage(ctx context.Context, msg MessageEvent) {
	cmd := CreateOrderCommand{
		UserID:         UserID(msg.UserID),
		Items:          msg.Items,
		IdempotencyKey: msg.IdempotencyKey,
	}
	order, err := t.svc.CreateOrder(ctx, cmd)
	if err != nil {
		fmt.Printf("[kafka] nack — requeue: %v\n", err)
		return // in production: nack → DLQ after N retries
	}
	fmt.Printf("[kafka] ack — processed order %s\n", order.ID)
}

// ─── Main ────────────────────────────────────────────────────────────────────

func main() {
	repo := NewInMemoryOrderRepository()
	pub := &LogEventPublisher{}
	svc := NewOrderService(repo, pub)

	ctx := context.Background()

	fmt.Println("=== HTTP Transport ===")
	httpT := &HTTPTransport{svc: svc}
	httpT.handleCreateOrder(ctx, "user_42", "idemp_abc123")
	httpT.handleCreateOrder(ctx, "user_42", "idemp_abc123") // duplicate → idempotent

	fmt.Println("\n=== Kafka Consumer Transport ===")
	kafkaT := &KafkaTransport{svc: svc}
	kafkaT.handleMessage(ctx, MessageEvent{
		UserID:         "user_99",
		IdempotencyKey: "kafka_msg_7f3a",
		Items:          []OrderItem{{ProductID: "prod_5", Quantity: 1, PriceCents: 4999}},
	})
	kafkaT.handleMessage(ctx, MessageEvent{
		UserID:         "user_99",
		IdempotencyKey: "kafka_msg_7f3a", // redelivered message → safe
		Items:          []OrderItem{{ProductID: "prod_5", Quantity: 1, PriceCents: 4999}},
	})
}`;

const pythonCode = `# Pattern: Layered Architecture
# Reference: Fowler PoEAA; Clean Architecture (Martin)
# Production note: Protocol (interface) defined in service package, implemented in adapters

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Protocol, runtime_checkable
from uuid import uuid4
import threading


# ─── Domain Types ────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class OrderItem:
    product_id: str
    quantity: int
    price_cents: int


@dataclass
class Order:
    id: str
    user_id: str
    items: list[OrderItem]
    status: str
    created_at: datetime
    idempotency_key: str | None = None


@dataclass(frozen=True)
class CreateOrderCommand:
    user_id: str
    items: list[OrderItem]
    idempotency_key: str | None = None


@dataclass(frozen=True)
class OrderEvent:
    type: str
    order_id: str
    user_id: str
    occurred_at: datetime


class OrderNotFoundError(Exception): ...
class InvalidOrderError(Exception): ...


# ─── Repository + Publisher Ports (Protocols = structural typing) ─────────────

@runtime_checkable
class OrderRepository(Protocol):
    def save(self, order: Order) -> None: ...
    def find_by_id(self, order_id: str) -> Order: ...
    def find_by_idempotency_key(self, key: str) -> Order | None: ...


@runtime_checkable
class EventPublisher(Protocol):
    def publish(self, event: OrderEvent) -> None: ...


# ─── Service Layer ───────────────────────────────────────────────────────────

class OrderService:
    def __init__(self, repo: OrderRepository, publisher: EventPublisher) -> None:
        self._repo = repo
        self._publisher = publisher

    def create_order(self, cmd: CreateOrderCommand) -> Order:
        if not cmd.items:
            raise InvalidOrderError("Order must have at least one item")

        # Idempotency check — same code path for HTTP and event-driven callers
        if cmd.idempotency_key:
            existing = self._repo.find_by_idempotency_key(cmd.idempotency_key)
            if existing is not None:
                return existing

        order = Order(
            id=f"ord_{uuid4().hex[:8]}",
            user_id=cmd.user_id,
            items=list(cmd.items),
            status="pending",
            created_at=datetime.now(timezone.utc),
            idempotency_key=cmd.idempotency_key,
        )
        self._repo.save(order)

        # In production: write event to outbox table in same transaction
        event = OrderEvent(
            type="OrderCreated",
            order_id=order.id,
            user_id=order.user_id,
            occurred_at=datetime.now(timezone.utc),
        )
        try:
            self._publisher.publish(event)
        except Exception as exc:
            # Non-fatal: outbox relay will retry
            print(f"[warn] event publish failed, outbox will retry: {exc}")

        return order

    def get_order(self, order_id: str) -> Order:
        try:
            return self._repo.find_by_id(order_id)
        except KeyError as exc:
            raise OrderNotFoundError(order_id) from exc


# ─── Infrastructure: In-Memory Repository ───────────────────────────────────

class InMemoryOrderRepository:
    def __init__(self) -> None:
        self._orders: dict[str, Order] = {}
        self._idempotency_idx: dict[str, Order] = {}
        self._lock = threading.RLock()

    def save(self, order: Order) -> None:
        with self._lock:
            self._orders[order.id] = order
            if order.idempotency_key:
                self._idempotency_idx[order.idempotency_key] = order

    def find_by_id(self, order_id: str) -> Order:
        with self._lock:
            if order_id not in self._orders:
                raise KeyError(order_id)
            return self._orders[order_id]

    def find_by_idempotency_key(self, key: str) -> Order | None:
        with self._lock:
            return self._idempotency_idx.get(key)


class LogEventPublisher:
    def publish(self, event: OrderEvent) -> None:
        print(f"[event] {event.type}: order={event.order_id} "
              f"user={event.user_id} at={event.occurred_at.isoformat()}")


# ─── Transport: HTTP Handler ─────────────────────────────────────────────────

class HTTPTransport:
    def __init__(self, svc: OrderService) -> None:
        self._svc = svc

    def handle_create_order(self, user_id: str, idempotency_key: str | None = None) -> None:
        try:
            cmd = CreateOrderCommand(
                user_id=user_id,
                items=[OrderItem("prod_1", 2, 1999)],
                idempotency_key=idempotency_key,
            )
            order = self._svc.create_order(cmd)
            print(f"[http] 201 created order {order.id}")
        except InvalidOrderError as exc:
            print(f"[http] 422 {exc}")


# ─── Transport: Message Consumer ─────────────────────────────────────────────

@dataclass(frozen=True)
class MessagePayload:
    user_id: str
    items: list[OrderItem]
    idempotency_key: str


class KafkaConsumerTransport:
    def __init__(self, svc: OrderService) -> None:
        self._svc = svc

    def handle_message(self, payload: MessagePayload) -> None:
        try:
            cmd = CreateOrderCommand(
                user_id=payload.user_id,
                items=payload.items,
                idempotency_key=payload.idempotency_key,
            )
            order = self._svc.create_order(cmd)
            print(f"[kafka] ack — order {order.id}")
        except Exception as exc:
            print(f"[kafka] nack — requeue: {exc}")


# ─── Main ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    repo = InMemoryOrderRepository()
    pub = LogEventPublisher()
    svc = OrderService(repo, pub)

    print("=== HTTP Transport ===")
    http_t = HTTPTransport(svc)
    http_t.handle_create_order("user_42", "idemp_abc123")
    http_t.handle_create_order("user_42", "idemp_abc123")  # duplicate — idempotent

    print("\n=== Kafka Consumer Transport ===")
    kafka_t = KafkaConsumerTransport(svc)
    msg = MessagePayload(
        user_id="user_99",
        items=[OrderItem("prod_5", 1, 4999)],
        idempotency_key="kafka_msg_7f3a",
    )
    kafka_t.handle_message(msg)
    kafka_t.handle_message(msg)  # redelivered — safe`;

const javaCode = `// Pattern: Layered Architecture
// Reference: Fowler PoEAA; Clean Architecture (Martin); DDD (Evans)
// Production note: ports (interfaces) in domain package, adapters in infrastructure

package com.example.orders;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

// ─── Domain Types ────────────────────────────────────────────────────────────

record OrderItem(String productId, int quantity, long priceCents) {}

record OrderId(String value) {
    static OrderId generate() { return new OrderId("ord_" + UUID.randomUUID().toString().replace("-","").substring(0,8)); }
}

record Order(
    OrderId id,
    String userId,
    List<OrderItem> items,
    String status,
    Instant createdAt,
    Optional<String> idempotencyKey
) {}

record CreateOrderCommand(
    String userId,
    List<OrderItem> items,
    Optional<String> idempotencyKey
) {}

record OrderEvent(String type, OrderId orderId, String userId, Instant occurredAt) {}

sealed interface ServiceError permits ServiceError.NotFound, ServiceError.InvalidInput, ServiceError.Duplicate {
    record NotFound(String id) implements ServiceError {}
    record InvalidInput(String reason) implements ServiceError {}
    record Duplicate(Order existing) implements ServiceError {}
}

// ─── Ports (Repository + Publisher interfaces) ───────────────────────────────
// Defined in the domain/service package — NOT in the infrastructure package.

interface OrderRepository {
    void save(Order order);
    Optional<Order> findById(OrderId id);
    Optional<Order> findByIdempotencyKey(String key);
}

interface EventPublisher {
    void publish(OrderEvent event);
}

// ─── Service Layer ───────────────────────────────────────────────────────────

class OrderService {
    private final OrderRepository repo;
    private final EventPublisher publisher;

    OrderService(OrderRepository repo, EventPublisher publisher) {
        this.repo = repo;
        this.publisher = publisher;
    }

    // Returns Result<Order, ServiceError> — no exceptions for domain errors
    sealed interface CreateResult permits CreateResult.Success, CreateResult.Failure {
        record Success(Order order) implements CreateResult {}
        record Failure(ServiceError error) implements CreateResult {}
    }

    CreateResult createOrder(CreateOrderCommand cmd) {
        if (cmd.items().isEmpty()) {
            return new CreateResult.Failure(new ServiceError.InvalidInput("Order must have at least one item"));
        }

        // Idempotency — identical for HTTP and event-driven callers
        if (cmd.idempotencyKey().isPresent()) {
            Optional<Order> existing = repo.findByIdempotencyKey(cmd.idempotencyKey().get());
            if (existing.isPresent()) {
                return new CreateResult.Success(existing.get());
            }
        }

        var order = new Order(
            OrderId.generate(),
            cmd.userId(),
            List.copyOf(cmd.items()),
            "pending",
            Instant.now(),
            cmd.idempotencyKey()
        );

        repo.save(order);

        // In production: write to outbox table in same transaction
        try {
            publisher.publish(new OrderEvent("OrderCreated", order.id(), order.userId(), Instant.now()));
        } catch (Exception e) {
            System.out.printf("[warn] event publish failed, outbox will retry: %s%n", e.getMessage());
        }

        return new CreateResult.Success(order);
    }

    Optional<Order> getOrder(OrderId id) {
        return repo.findById(id);
    }
}

// ─── Infrastructure: In-Memory Repository ───────────────────────────────────

class InMemoryOrderRepository implements OrderRepository {
    private final Map<OrderId, Order> orders = new ConcurrentHashMap<>();
    private final Map<String, Order> idempotencyIndex = new ConcurrentHashMap<>();

    @Override
    public void save(Order order) {
        orders.put(order.id(), order);
        order.idempotencyKey().ifPresent(k -> idempotencyIndex.put(k, order));
    }

    @Override
    public Optional<Order> findById(OrderId id) { return Optional.ofNullable(orders.get(id)); }

    @Override
    public Optional<Order> findByIdempotencyKey(String key) { return Optional.ofNullable(idempotencyIndex.get(key)); }
}

class LogEventPublisher implements EventPublisher {
    @Override
    public void publish(OrderEvent event) {
        System.out.printf("[event] %s: order=%s user=%s at=%s%n",
            event.type(), event.orderId().value(), event.userId(), event.occurredAt());
    }
}

// ─── Transport Layer: HTTP Handler ───────────────────────────────────────────

class HttpTransport {
    private final OrderService svc;
    HttpTransport(OrderService svc) { this.svc = svc; }

    void handleCreateOrder(String userId, String idempotencyKey) {
        var cmd = new CreateOrderCommand(
            userId,
            List.of(new OrderItem("prod_1", 2, 1999L)),
            Optional.ofNullable(idempotencyKey)
        );
        switch (svc.createOrder(cmd)) {
            case OrderService.CreateResult.Success s -> System.out.printf("[http] 201 created %s%n", s.order().id().value());
            case OrderService.CreateResult.Failure f -> System.out.printf("[http] 422 %s%n", f.error());
        }
    }
}

// ─── Transport Layer: Message Consumer ───────────────────────────────────────

record MessagePayload(String userId, List<OrderItem> items, String idempotencyKey) {}

class KafkaConsumerTransport {
    private final OrderService svc;
    KafkaConsumerTransport(OrderService svc) { this.svc = svc; }

    void handleMessage(MessagePayload payload) {
        var cmd = new CreateOrderCommand(payload.userId(), payload.items(), Optional.of(payload.idempotencyKey()));
        switch (svc.createOrder(cmd)) {
            case OrderService.CreateResult.Success s -> System.out.printf("[kafka] ack — order %s%n", s.order().id().value());
            case OrderService.CreateResult.Failure f -> System.out.printf("[kafka] nack — requeue: %s%n", f.error());
        }
    }
}

// ─── Main ────────────────────────────────────────────────────────────────────

class Main {
    public static void main(String[] args) {
        var repo = new InMemoryOrderRepository();
        var pub = new LogEventPublisher();
        var svc = new OrderService(repo, pub);

        System.out.println("=== HTTP Transport ===");
        var httpT = new HttpTransport(svc);
        httpT.handleCreateOrder("user_42", "idemp_abc123");
        httpT.handleCreateOrder("user_42", "idemp_abc123"); // duplicate — idempotent

        System.out.println("\n=== Kafka Consumer Transport ===");
        var kafkaT = new KafkaConsumerTransport(svc);
        var msg = new MessagePayload("user_99", List.of(new OrderItem("prod_5", 1, 4999L)), "kafka_msg_7f3a");
        kafkaT.handleMessage(msg);
        kafkaT.handleMessage(msg); // redelivered — safe
    }
}`;

const awsCdkCode = `// File: infrastructure/cdk/order-service-stack.ts
// IaC: AWS CDK (TypeScript)
// Pattern: Layered service running on ECS Fargate + SQS event transport

import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class OrderServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'OrderVpc', { maxAzs: 2 });

    // ── Infrastructure Layer: Postgres (Repository impl) ────────────────────
    const dbSecret = new secretsmanager.Secret(this, 'DbSecret', {
      generateSecretString: { secretStringTemplate: JSON.stringify({ username: 'orders' }), generateStringKey: 'password' },
    });

    const db = new rds.DatabaseInstance(this, 'OrdersDb', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15 }),
      vpc,
      credentials: rds.Credentials.fromSecret(dbSecret),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
      multiAz: true,  // production: always true
    });

    // ── Transport Layer (async): SQS Queue ────────────────────────────────
    const orderEventsDlq = new sqs.Queue(this, 'OrderEventsDlq', {
      retentionPeriod: cdk.Duration.days(14),
    });

    const orderEventsQueue = new sqs.Queue(this, 'OrderEventsQueue', {
      visibilityTimeout: cdk.Duration.seconds(30),
      deadLetterQueue: { queue: orderEventsDlq, maxReceiveCount: 3 },
    });

    // ── Service Layer: ECS Fargate Task (HTTP + SQS consumer in same binary) ─
    const cluster = new ecs.Cluster(this, 'OrderCluster', { vpc });

    const taskDef = new ecs.FargateTaskDefinition(this, 'OrderTaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    // IAM: least-privilege for SQS consumer transport
    taskDef.addToTaskRolePolicy(new iam.PolicyStatement({
      actions: ['sqs:ReceiveMessage', 'sqs:DeleteMessage', 'sqs:GetQueueAttributes'],
      resources: [orderEventsQueue.queueArn],
    }));

    taskDef.addContainer('OrderService', {
      image: ecs.ContainerImage.fromRegistry('your-ecr-repo/order-service:latest'),
      environment: {
        SQS_QUEUE_URL: orderEventsQueue.queueUrl,
        // Service layer is identical for HTTP and SQS transports:
        // the binary starts both an HTTP server and an SQS polling loop
      },
      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password'),
      },
      portMappings: [{ containerPort: 8080 }],
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'order-service' }),
    });

    new ecs.FargateService(this, 'OrderService', {
      cluster,
      taskDefinition: taskDef,
      desiredCount: 2, // scale independently from event producers
    });
  }
}`;

const azureBicepCode = `// File: infrastructure/bicep/order-service.bicep
// IaC: Azure Bicep
// Pattern: Layered service on Container Apps + Service Bus consumer transport

param location string = resourceGroup().location
param serviceBusNamespaceName string = 'orders-sb-\${uniqueString(resourceGroup().id)}'

// ── Transport (async): Service Bus ──────────────────────────────────────────
resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2022-10-01-preview' = {
  name: serviceBusNamespaceName
  location: location
  sku: { name: 'Standard' }
}

resource orderEventsQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
  parent: serviceBusNamespace
  name: 'order-events'
  properties: {
    maxDeliveryCount: 3              // after 3 failures → dead-letter queue
    deadLetteringOnMessageExpiration: true
    lockDuration: 'PT30S'
  }
}

// ── Infrastructure (Repository): Azure Database for PostgreSQL ───────────────
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: 'orders-db-\${uniqueString(resourceGroup().id)}'
  location: location
  sku: { name: 'Standard_B1ms', tier: 'Burstable' }
  properties: {
    administratorLogin: 'ordersadmin'
    administratorLoginPassword: 'REPLACE_WITH_KEY_VAULT_REF'
    version: '15'
    highAvailability: { mode: 'ZoneRedundant' }
  }
}

// ── Service Layer: Container Apps (HTTP + Service Bus consumer) ───────────
resource containerAppEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: 'orders-env'
  location: location
  properties: {}
}

resource orderServiceApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'order-service'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      // KEDA scale rule: scale consumer workers based on queue depth
      // This is the Transport layer scaling independently of HTTP layer
    }
    template: {
      containers: [{
        name: 'order-service'
        image: 'your-acr.azurecr.io/order-service:latest'
        env: [
          { name: 'SERVICE_BUS_CONNECTION', value: serviceBusNamespace.listKeys().primaryConnectionString }
          { name: 'SERVICE_BUS_QUEUE', value: 'order-events' }
        ]
        resources: { cpu: '0.25', memory: '0.5Gi' }
      }]
      scale: {
        minReplicas: 1
        maxReplicas: 10
        rules: [{
          name: 'queue-depth-rule'
          custom: {
            type: 'azure-servicebus'
            metadata: { queueName: 'order-events', messageCount: '5' }
          }
        }]
      }
    }
  }
}`;

const gcpTerraformCode = `# File: infrastructure/terraform/order-service/main.tf
# IaC: Terraform (GCP)
# Pattern: Layered service on Cloud Run + Pub/Sub consumer transport

terraform {
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

variable "project_id" { type = string }
variable "region"     { type = string, default = "us-central1" }

# ── Transport (async): Pub/Sub Topic + Subscription ─────────────────────────
resource "google_pubsub_topic" "order_events" {
  name    = "order-events"
  project = var.project_id
}

resource "google_pubsub_subscription" "order_events_sub" {
  name    = "order-events-sub"
  topic   = google_pubsub_topic.order_events.name
  project = var.project_id

  # Dead-letter policy: after 3 delivery attempts → dead letter topic
  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.order_events_dlq.id
    max_delivery_attempts = 3
  }

  ack_deadline_seconds = 30
}

resource "google_pubsub_topic" "order_events_dlq" {
  name    = "order-events-dlq"
  project = var.project_id
}

# ── Infrastructure (Repository): Cloud SQL (PostgreSQL) ─────────────────────
resource "google_sql_database_instance" "orders_db" {
  name             = "orders-db"
  database_version = "POSTGRES_15"
  project          = var.project_id
  region           = var.region

  settings {
    tier = "db-f1-micro"
    availability_type = "REGIONAL"  # multi-zone HA
    backup_configuration { enabled = true }
  }
}

# ── Service Layer: Cloud Run (HTTP) ─────────────────────────────────────────
resource "google_cloud_run_v2_service" "order_service_http" {
  name     = "order-service-http"
  location = var.region
  project  = var.project_id

  template {
    containers {
      image = "gcr.io/\${var.project_id}/order-service:latest"
      env { name = "TRANSPORT_MODE", value = "http" }
      resources { limits = { cpu = "1", memory = "512Mi" } }
    }
    scaling { min_instance_count = 1, max_instance_count = 10 }
  }
}

# ── Transport Layer: Cloud Run (Pub/Sub push consumer) ──────────────────────
# Same container image — different TRANSPORT_MODE env var.
# Service layer code is identical; only the transport differs.
resource "google_cloud_run_v2_service" "order_service_consumer" {
  name     = "order-service-consumer"
  location = var.region
  project  = var.project_id

  template {
    containers {
      image = "gcr.io/\${var.project_id}/order-service:latest"
      env { name = "TRANSPORT_MODE", value = "pubsub" }  # activates Pub/Sub consumer loop
      resources { limits = { cpu = "1", memory = "512Mi" } }
    }
    scaling {
      min_instance_count = 0
      max_instance_count = 20  # scale consumer instances by queue depth
    }
  }
}`;

const ImplTab = () => {
  const [lang, setLang] = useState("go");
  const [cloudTab, setCloudTab] = useState("aws");

  const langs = ["go", "python", "java"];
  const clouds = ["aws", "azure", "gcp"];

  const codeMap = { go: goCode, python: pythonCode, java: javaCode };
  const fileMap = { go: "order-service/main.go", python: "order_service/main.py", java: "orders/Main.java" };

  const cloudCodeMap = { aws: awsCdkCode, azure: azureBicepCode, gcp: gcpTerraformCode };
  const cloudFileMap = { aws: "infrastructure/cdk/order-service-stack.ts", azure: "infrastructure/bicep/order-service.bicep", gcp: "infrastructure/terraform/order-service/main.tf" };

  return (
    <div>
      <h3 style={{ color: colors.text, fontSize: 14, marginBottom: 12, fontWeight: 600 }}>3a — Core Implementation (no cloud dependencies)</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {langs.map(l => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "6px 16px", borderRadius: 6, border: `1px solid ${lang === l ? colors.blue : colors.border}`, background: lang === l ? `${colors.blue}22` : colors.surface, color: lang === l ? colors.blue : colors.muted, cursor: "pointer", fontSize: 12, fontWeight: lang === l ? 600 : 400 }}>{l.charAt(0).toUpperCase() + l.slice(1)}</button>
        ))}
      </div>
      <CodeBlock code={codeMap[lang]} filename={fileMap[lang]} />

      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: colors.text, fontSize: 14, marginBottom: 12, fontWeight: 600 }}>3b/c/d — Cloud IaC Reference</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {clouds.map(c => {
            const brandColor = c === "aws" ? "#ff9900" : c === "azure" ? "#0078d4" : "#4285f4";
            return (
              <button key={c} onClick={() => setCloudTab(c)} style={{ padding: "6px 16px", borderRadius: 6, border: `1px solid ${cloudTab === c ? brandColor : colors.border}`, background: cloudTab === c ? `${brandColor}22` : colors.surface, color: cloudTab === c ? brandColor : colors.muted, cursor: "pointer", fontSize: 12, fontWeight: cloudTab === c ? 600 : 400, textTransform: "uppercase" }}>{c}</button>
            );
          })}
        </div>
        <div style={{ background: `${colors.amber}11`, border: `1px solid ${colors.amber}44`, borderRadius: 6, padding: "8px 14px", marginBottom: 12, fontSize: 11, color: colors.amber }}>
          Reference code only — copy into your IDE. Not executable in this sandbox.
        </div>
        <CodeBlock code={cloudCodeMap[cloudTab]} filename={cloudFileMap[cloudTab]} />
      </div>
    </div>
  );
};

// ── LEADERSHIP TAB ───────────────────────────────────────────────────────────

const LeadershipTab = () => (
  <div>
    {[
      {
        title: "Explain to your team",
        color: colors.blue,
        content: "Layered architecture divides code into strata where each layer has one job: the transport layer handles protocols, the service layer handles business logic, and the repository layer handles data access. Dependencies only flow inward — outer layers know about inner layers, never the reverse. The payoff is surgical testability and the ability to add new delivery mechanisms (gRPC, Kafka, CLI) without touching domain logic."
      },
      {
        title: "Justify in architecture review",
        color: colors.green,
        content: "The dependency rule is the strongest argument: by keeping infrastructure concerns at the edges, we can test the entire domain model with zero external dependencies, which gives us fast CI and high confidence. The transport-agnostic service layer directly addresses our requirement to support both synchronous REST and asynchronous event consumption without code duplication — a significant maintainability win as the system grows."
      },
      {
        title: "Failure modes & observability",
        color: colors.red,
        items: [
          "Layer bleeding: SQL in handlers or HTTP calls in services. Detect via code review + static analysis (grep for DB imports in handler files).",
          "Fat service layer: service methods that are pure pass-throughs with no logic. Symptom: 1:1 mapping between service methods and repository methods. Revisit domain modelling.",
          "Missing idempotency: event consumers that don't dedup → duplicate state. Alert: duplicate primary key errors in DB metrics.",
          "Dual-write failure: event published but DB write failed (or vice versa). Use Outbox pattern. Alert: divergence between DB record count and event count.",
          "DLQ growth: consumers failing silently. Alert: DLQ depth > 0 for > 5 min → PagerDuty.",
        ]
      },
      {
        title: "Scale implications",
        color: colors.amber,
        items: [
          "At 10x: the layered model scales naturally — deploy more service instances. Each layer is stateless (state in DB/cache), so horizontal scale is straightforward.",
          "At 100x: the single service layer becomes a bottleneck if all use-cases share one process. Consider splitting by domain or introducing CQRS to separately scale read and write paths.",
          "When to revisit: if repository layer calls dominate latency (> 50% of request time), add a caching layer between service and repository (still within the layered model).",
          "Event consumer lag: if your Kafka consumer group lag grows, scale the Transport layer (add consumer instances) independently — service and repo layers don't change.",
        ]
      },
      {
        title: "Code review checklist",
        color: colors.purple,
        items: [
          "Does the HTTP handler contain any business logic (conditionals, domain rules)? Move to service layer.",
          "Does the service layer import net/http, kafka-go, or any transport package? Dependency violation — reject.",
          "Is the repository interface defined in the service/domain package, not the infrastructure package?",
          "Do service methods express intent (CreateOrder, SuspendAccount) or CRUD (InsertOrder, UpdateUser)?",
          "Is there idempotency handling for every service method that will be called by an event consumer?",
          "Are error types defined at the domain level and translated to HTTP status codes only in the transport layer?",
          "Does the event publisher use the Outbox pattern, or is there a bare dual-write?",
        ]
      },
      {
        title: "Questions for design review",
        color: colors.cyan,
        items: [
          "Where is the repository interface defined — service package or infrastructure package? (Should be service.)",
          "If we add a gRPC transport next quarter, which files change? (Answer should be: only transport layer.)",
          "How does the Kafka consumer handle a redelivered message? Show me the idempotency check.",
          "What happens if the DB write succeeds but the event publish fails? Is there an Outbox?",
          "Are service methods named after domain operations or database operations?",
          "How do we test the service layer without a running database? (Should be: inject a mock/in-memory repo.)",
        ]
      }
    ].map(({ title, color, content, items }) => (
      <div key={title} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 20, marginBottom: 12 }}>
        <h3 style={{ color, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
        {content && <p style={{ color: colors.muted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{content}</p>}
        {items && <ul style={{ margin: 0, paddingLeft: 20 }}>
          {items.map(item => <li key={item} style={{ color: colors.muted, fontSize: 12, lineHeight: 1.7, marginBottom: 4 }}>{item}</li>)}
        </ul>}
      </div>
    ))}
  </div>
);

// ── ROOT COMPONENT ───────────────────────────────────────────────────────────

const TABS = ["Architecture", "Core Concepts", "Implementations", "Leadership"];

export default function LayeredArchitecture() {
  const [tab, setTab] = useState(0);

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", color: colors.text, fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, padding: "20px 32px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: colors.text }}>Layered Architecture</h1>
            <span style={{ color: colors.muted, fontSize: 12 }}>Fowler, PoEAA · Martin, Clean Architecture</span>
          </div>
          <p style={{ color: colors.muted, fontSize: 13, margin: "0 0 16px 0" }}>
            Transport → Service → Repository — and how it adapts from request/response to event-driven systems
          </p>
          <div style={{ display: "flex", gap: 0 }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} style={{ padding: "10px 20px", background: "none", border: "none", borderBottom: `2px solid ${tab === i ? colors.blue : "transparent"}`, color: tab === i ? colors.blue : colors.muted, cursor: "pointer", fontSize: 13, fontWeight: tab === i ? 600 : 400, transition: "all 0.15s" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 32px" }}>
        {tab === 0 && <ArchDiagram />}
        {tab === 1 && <ConceptsTab />}
        {tab === 2 && <ImplTab />}
        {tab === 3 && <LeadershipTab />}
      </div>
    </div>
  );
}
