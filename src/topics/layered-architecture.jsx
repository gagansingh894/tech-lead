"use client"

import { useState } from "react";

const C = {
  bg: "#0f1117", surface: "#1a1d24", raised: "#20242e", border: "#2d3139",
  text: "#e5e7eb", muted: "#9ca3af", dim: "#6b7280",
  blue: "#3b82f6", green: "#10b981", amber: "#f59e0b",
  purple: "#8b5cf6", red: "#ef4444", cyan: "#06b6d4",
  aws: "#ff9900", azure: "#0078d4", gcp: "#4285f4",
};

function Badge({ color, children }) {
  return <span style={{ background: color+"22", color, border:`1px solid ${color}44`, borderRadius:4, padding:"1px 7px", fontSize:10, fontWeight:600, letterSpacing:"0.04em", textTransform:"uppercase" }}>{children}</span>;
}

function SectionLabel({ children }) {
  return <div style={{ color:C.dim, fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12, paddingBottom:6, borderBottom:`1px solid ${C.border}` }}>{children}</div>;
}

function CodeBlock({ code, filename }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden", marginBottom:16 }}>
      <div style={{ background:"#161b22", padding:"8px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}` }}>
        <span style={{ color:C.muted, fontFamily:"monospace", fontSize:11 }}>{filename}</span>
        <button onClick={copy} style={{ background:copied?C.green+"33":C.surface, color:copied?C.green:C.dim, border:`1px solid ${C.border}`, borderRadius:4, padding:"2px 10px", fontSize:11, cursor:"pointer", transition:"all .15s" }}>{copied?"✓ copied":"copy"}</button>
      </div>
      <pre style={{ background:"#161b22", padding:16, margin:0, overflowX:"auto", fontSize:11.5, lineHeight:1.65, color:"#cdd9e5", fontFamily:"'JetBrains Mono','Fira Code',monospace" }}><code>{code}</code></pre>
    </div>
  );
}

function Card({ accentColor, title, source, children }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderLeft:`3px solid ${accentColor||C.blue}`, borderRadius:8, padding:"18px 20px", marginBottom:12 }}>
      <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:10 }}>
        <span style={{ color:accentColor||C.blue, fontWeight:600, fontSize:14 }}>{title}</span>
        {source && <span style={{ color:C.dim, fontSize:11, fontStyle:"italic" }}>— {source}</span>}
      </div>
      {children}
    </div>
  );
}

function Row({ label, color, children }) {
  return (
    <div style={{ display:"flex", gap:10, marginBottom:7 }}>
      <span style={{ color:color||C.muted, fontSize:11, fontWeight:600, minWidth:110, paddingTop:1 }}>{label}</span>
      <span style={{ color:C.muted, fontSize:12, lineHeight:1.6, flex:1 }}>{children}</span>
    </div>
  );
}

function SubTabs({ options, value, onChange, brandColor }) {
  return (
    <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
      {options.map(o => {
        const active = value===o.key, col = brandColor||C.blue;
        return <button key={o.key} onClick={()=>onChange(o.key)} style={{ padding:"5px 14px", borderRadius:6, border:`1px solid ${active?col:C.border}`, background:active?col+"22":C.surface, color:active?col:C.muted, cursor:"pointer", fontSize:12, fontWeight:active?600:400, transition:"all .15s" }}>{o.label}</button>;
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB 1 — ARCHITECTURE
// ═══════════════════════════════════════════════

function ArchTab() {
  return (
    <div>
      <SectionLabel>Request / Response — Classic HTTP API Flow</SectionLabel>
      <svg viewBox="0 0 820 390" style={{ width:"100%", borderRadius:8, border:`1px solid ${C.border}`, display:"block", marginBottom:28 }}>
        <rect width="820" height="390" fill={C.bg}/>
        {[{x:28,col:C.blue,label:"Command / Input"},{x:168,col:C.green,label:"Query / Output"},{x:302,col:C.amber,label:"Event / Async"},{x:435,col:C.purple,label:"Storage"}].map(({x,col,label})=>(
          <g key={label}><rect x={x} y={12} width={11} height={11} rx={2} fill={col} opacity={0.8}/><text x={x+16} y={21} fill={C.muted} fontSize={10.5}>{label}</text></g>
        ))}
        {[
          {y:50, col:C.blue,   title:"Transport / Delivery Layer",      sub:"HTTP Handler · gRPC · CLI · WebSocket · Scheduler",     tag:"entry"},
          {y:140,col:C.green,  title:"Service Layer",                   sub:"Business Logic · Use-Case Orchestration · Validation",  tag:"core"},
          {y:230,col:C.purple, title:"Repository Port (Interface)",     sub:"Defined here, in the service package — not infrastructure", tag:"port"},
          {y:310,col:"#6b7280",title:"Infrastructure / Adapters",      sub:"PostgreSQL · Redis · Kafka producer · HTTP clients · S3",tag:"I/O"},
        ].map(({y,col,title,sub,tag})=>(
          <g key={title}>
            <rect x={50} y={y} width={660} height={62} rx={6} fill={col} fillOpacity={0.08} stroke={col} strokeOpacity={0.45} strokeWidth={1}/>
            <text x={70} y={y+24} fill={col} fontSize={12.5} fontWeight="600">{title}</text>
            <text x={70} y={y+42} fill={C.dim} fontSize={10.5}>{sub}</text>
            <rect x={670} y={y+12} width={32} height={17} rx={3} fill={col} fillOpacity={0.22}/>
            <text x={686} y={y+24} fill={col} fontSize={9} textAnchor="middle">{tag}</text>
          </g>
        ))}
        {[112,202].map(y=>(
          <g key={`d${y}`}>
            <line x1={210} y1={y} x2={210} y2={y+24} stroke={C.blue} strokeWidth={1.5} markerEnd="url(#aB)"/>
            <rect x={218} y={y+5} width={88} height={13} rx={3} fill={C.blue} fillOpacity={0.12}/>
            <text x={262} y={y+15} fill={C.blue} fontSize={9.5} textAnchor="middle">cmd / request</text>
          </g>
        ))}
        <g>
          <line x1={210} y1={292} x2={210} y2={314} stroke={C.purple} strokeWidth={1.5} markerEnd="url(#aP)"/>
          <rect x={218} y={297} width={82} height={13} rx={3} fill={C.purple} fillOpacity={0.12}/>
          <text x={259} y={307} fill={C.purple} fontSize={9.5} textAnchor="middle">interface call</text>
        </g>
        {[290,200,110].map(y=>(
          <g key={`u${y}`}>
            <line x1={590} y1={y+34} x2={590} y2={y+6} stroke={C.green} strokeWidth={1.5} markerEnd="url(#aG)"/>
            <rect x={522} y={y+12} width={62} height={13} rx={3} fill={C.green} fillOpacity={0.12}/>
            <text x={553} y={y+22} fill={C.green} fontSize={9.5} textAnchor="middle">result / data</text>
          </g>
        ))}
        <text x={380} y={380} fill={C.amber} fontSize={10.5} textAnchor="middle" fontStyle="italic">
          ↑ Dependency Rule: source-code dependencies always point inward — never outward
        </text>
        <defs>
          <marker id="aB" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3z" fill={C.blue}/></marker>
          <marker id="aG" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3z" fill={C.green}/></marker>
          <marker id="aP" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3z" fill={C.purple}/></marker>
        </defs>
      </svg>

      <SectionLabel>Event-Driven — Same Layers, Different Transport</SectionLabel>
      <svg viewBox="0 0 820 500" style={{ width:"100%", borderRadius:8, border:`1px solid ${C.border}`, display:"block", marginBottom:28 }}>
        <rect width="820" height="500" fill={C.bg}/>
        <text x={160} y={26} fill={C.muted} fontSize={10.5} textAnchor="middle" fontWeight="600">PRODUCER SERVICE</text>
        <text x={630} y={26} fill={C.muted} fontSize={10.5} textAnchor="middle" fontWeight="600">CONSUMER SERVICE</text>
        <text x={410} y={26} fill={C.amber} fontSize={10.5} textAnchor="middle" fontWeight="600">BROKER</text>
        {[
          {y:44, col:C.blue,   title:"Transport (Producer)",       sub:"HTTP Handler / gRPC / CLI"},
          {y:130,col:C.green,  title:"Service Layer",             sub:"Business logic — protocol-agnostic"},
          {y:216,col:C.purple, title:"Repository + Publisher Port",sub:"Persist state · publish outbound event"},
          {y:302,col:"#6b7280",title:"Infrastructure",            sub:"DB driver · Kafka producer"},
        ].map(({y,col,title,sub})=>(
          <g key={`P${title}`}>
            <rect x={24} y={y} width={268} height={60} rx={5} fill={col} fillOpacity={0.09} stroke={col} strokeOpacity={0.4} strokeWidth={1}/>
            <text x={44} y={y+22} fill={col} fontSize={11.5} fontWeight="600">{title}</text>
            <text x={44} y={y+39} fill={C.dim} fontSize={10}>{sub}</text>
          </g>
        ))}
        {[104,190,276].map(y=><line key={`pd${y}`} x1={158} y1={y} x2={158} y2={y+22} stroke={C.amber} strokeWidth={1.5} strokeDasharray="4 2" markerEnd="url(#aA2)"/>)}
        {[
          {y:44, col:C.blue,   title:"Transport (Consumer)",  sub:"Kafka Consumer · SQS Poller · Pub/Sub"},
          {y:130,col:C.green,  title:"Service Layer",         sub:"IDENTICAL code — idempotency check first"},
          {y:216,col:C.purple, title:"Repository Port",       sub:"Persist projection / read model"},
          {y:302,col:"#6b7280",title:"Infrastructure",        sub:"DB driver · cache · downstream HTTP"},
        ].map(({y,col,title,sub})=>(
          <g key={`C${title}`}>
            <rect x={528} y={y} width={268} height={60} rx={5} fill={col} fillOpacity={0.09} stroke={col} strokeOpacity={0.4} strokeWidth={1}/>
            <text x={548} y={y+22} fill={col} fontSize={11.5} fontWeight="600">{title}</text>
            <text x={548} y={y+39} fill={C.dim} fontSize={10}>{sub}</text>
          </g>
        ))}
        {[104,190,276].map(y=><line key={`cd${y}`} x1={662} y1={y} x2={662} y2={y+22} stroke={C.green} strokeWidth={1.5} markerEnd="url(#aG2)"/>)}
        <rect x={330} y={140} width={160} height={170} rx={8} fill={C.amber} fillOpacity={0.07} stroke={C.amber} strokeOpacity={0.5} strokeWidth={1.5}/>
        <text x={410} y={208} fill={C.amber} fontSize={13} fontWeight="600" textAnchor="middle">Message</text>
        <text x={410} y={226} fill={C.amber} fontSize={13} fontWeight="600" textAnchor="middle">Broker</text>
        <text x={410} y={249} fill={C.dim} fontSize={10} textAnchor="middle">Kafka / SQS / NATS</text>
        <text x={410} y={264} fill={C.dim} fontSize={10} textAnchor="middle">RabbitMQ / Pub/Sub</text>
        <text x={410} y={279} fill={C.dim} fontSize={10} textAnchor="middle">Service Bus</text>
        <line x1={292} y1={330} x2={332} y2={286} stroke={C.amber} strokeWidth={1.5} markerEnd="url(#aA2)"/>
        <text x={296} y={322} fill={C.amber} fontSize={9.5}>publish</text>
        <line x1={490} y1={252} x2={528} y2={208} stroke={C.amber} strokeWidth={1.5} markerEnd="url(#aA2)"/>
        <text x={494} y={244} fill={C.amber} fontSize={9.5}>consume</text>
        <rect x={24} y={390} width={268} height={44} rx={4} fill={C.red} fillOpacity={0.07} stroke={C.red} strokeOpacity={0.3} strokeWidth={1}/>
        <text x={158} y={408} fill={C.red} fontSize={10.5} textAnchor="middle" fontWeight="600">On failure → retry → DLQ</text>
        <text x={158} y={424} fill={C.dim} fontSize={9.5} textAnchor="middle">Transport owns ack / nack lifecycle</text>
        <line x1={158} y1={362} x2={158} y2={390} stroke={C.red} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#aR2)"/>
        <rect x={528} y={390} width={268} height={44} rx={4} fill={C.purple} fillOpacity={0.07} stroke={C.purple} strokeOpacity={0.3} strokeWidth={1}/>
        <text x={662} y={408} fill={C.purple} fontSize={10.5} textAnchor="middle" fontWeight="600">Idempotency check in Service Layer</text>
        <text x={662} y={424} fill={C.dim} fontSize={9.5} textAnchor="middle">dedup key → skip if already processed</text>
        <line x1={662} y1={362} x2={662} y2={390} stroke={C.purple} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#aP2)"/>
        <rect x={250} y={455} width={320} height={30} rx={5} fill={C.green} fillOpacity={0.07} stroke={C.green} strokeOpacity={0.25}/>
        <text x={410} y={474} fill={C.green} fontSize={10.5} textAnchor="middle" fontStyle="italic">Key insight: service &amp; repo layers are identical — only the Transport changes</text>
        <defs>
          <marker id="aA2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3z" fill={C.amber}/></marker>
          <marker id="aG2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3z" fill={C.green}/></marker>
          <marker id="aR2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3z" fill={C.red}/></marker>
          <marker id="aP2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3z" fill={C.purple}/></marker>
        </defs>
      </svg>

      <SectionLabel>Cloud Provider Mapping</SectionLabel>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ background:"#161b22" }}>
              {["Layer / Concern","AWS","Azure","GCP"].map((h,i)=>(
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", color:i===1?C.aws:i===2?C.azure:i===3?C.gcp:C.muted, borderBottom:`1px solid ${C.border}`, fontWeight:600, fontSize:11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Transport — HTTP",     "API Gateway + Lambda / ALB + ECS",           "APIM + App Service / AKS",             "Cloud Endpoints + Cloud Run"],
              ["Transport — Consumer", "SQS consumer (Lambda / ECS) / Kinesis",      "Service Bus consumer / Event Hubs",    "Pub/Sub push → Cloud Run / pull worker"],
              ["Service Layer",        "ECS Fargate, EKS, Lambda",                   "AKS, Container Apps, Functions",       "Cloud Run, GKE, Cloud Functions"],
              ["Repository — SQL",     "RDS Aurora (Postgres/MySQL)",                 "Azure Database for Postgres / MySQL",  "Cloud SQL / AlloyDB"],
              ["Repository — NoSQL",   "DynamoDB",                                    "Cosmos DB",                            "Firestore / Bigtable"],
              ["Message Broker",       "SQS + SNS, MSK (Kafka), Kinesis",            "Service Bus, Event Hubs",              "Pub/Sub, Eventarc"],
              ["Cache",                "ElastiCache (Redis / Memcached)",             "Azure Cache for Redis",                "Memorystore (Redis)"],
              ["Observability",        "CloudWatch + X-Ray",                          "Azure Monitor + App Insights",         "Cloud Monitoring + Cloud Trace"],
              ["Secrets / Config",     "Secrets Manager + Parameter Store",           "Key Vault + App Configuration",        "Secret Manager + Config Connector"],
            ].map(([layer,aws,azure,gcp],i)=>(
              <tr key={layer} style={{ background:i%2===0?C.surface:"#161b22" }}>
                <td style={{ padding:"9px 14px", color:C.text, borderBottom:`1px solid ${C.border}` }}>{layer}</td>
                <td style={{ padding:"9px 14px", color:C.aws, borderBottom:`1px solid ${C.border}` }}>{aws}</td>
                <td style={{ padding:"9px 14px", color:"#4da6ff", borderBottom:`1px solid ${C.border}` }}>{azure}</td>
                <td style={{ padding:"9px 14px", color:"#4ade80", borderBottom:`1px solid ${C.border}` }}>{gcp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB 2 — CORE CONCEPTS
// ═══════════════════════════════════════════════

function ConceptsTab() {
  const concepts = [
    { title:"Layered Architecture (n-tier)", source:"Fowler, Patterns of Enterprise Application Architecture, 2002", color:C.blue,
      def:"An architectural style that organises code into horizontal strata where each layer has a single responsibility. Each layer communicates only with adjacent layers — higher layers call lower ones; lower layers never reference higher ones.",
      why:"Testability at each boundary independently. The repository can be tested against a real DB without an HTTP server; the service can be tested with a fake repo in milliseconds. Swapping PostgreSQL for DynamoDB requires changes only in the infrastructure layer.",
      mistake:"Treating layers as folder names rather than enforced boundaries. Placing SQL queries in HTTP handlers is a layer violation — it tightly couples transport to persistence and makes unit testing impossible without a running database." },
    { title:"Dependency Rule", source:"Robert C. Martin, Clean Architecture, 2017", color:C.green,
      def:"Source-code dependencies must only point inward — toward higher-level policy. The service layer must not import a transport package (net/http, kafka-go); the repository interface must not import a database driver.",
      why:"Outer-layer changes — switching from REST to gRPC, from Kafka to SQS — require zero changes to the domain. The domain survives framework upgrades, cloud migrations, and protocol changes independently.",
      mistake:"Importing a Kafka SDK or HTTP framework inside a service struct. Test: 'if I delete the transport package, does the service package still compile?' It should. If not, the dependency rule is violated." },
    { title:"Transport Layer (Delivery Mechanism)", source:"Fowler, PoEAA; Martin, Clean Architecture", color:C.cyan,
      def:"The outermost layer responsible solely for receiving external stimuli — HTTP requests, message-broker events, CLI commands, scheduled ticks — and translating them into calls on the service layer. It is the only layer that knows about the protocol.",
      why:"Adding a Kafka consumer alongside an existing HTTP API requires only one new Transport adapter. Zero changes to service logic. Event-driven and request/response delivery share identical business logic.",
      mistake:"Placing business validation or domain rules in the HTTP handler. Input shape validation (field presence, type coercion) belongs in the transport layer; domain invariant validation ('an order must have at least one item') belongs in the service layer.",
      note:"In event-driven systems this layer is a consumer loop: poll → deserialise → call service → ack/nack. The ack/nack lifecycle and retry policy are entirely transport concerns. The service layer does not know it was invoked via Kafka." },
    { title:"Service Layer", source:"Fowler, PoEAA — Service Layer pattern", color:C.amber,
      def:"Defines the application's boundary and the set of available operations. Orchestrates domain logic, coordinates repository calls, enforces invariants, and publishes outbound events. It is the layer that makes things happen.",
      why:"A method like CreateOrder(ctx, cmd) is the single authoritative description of what 'creating an order' means. It does not change when you switch delivery mechanisms, databases, or cloud providers.",
      mistake:"Naming service methods after CRUD operations (CreateUser, UpdateUser). Service methods must express business intent (RegisterUser, SuspendAccount, FulfillOrder) — not database actions." },
    { title:"Repository Pattern", source:"Evans, Domain-Driven Design, 2003; Fowler, PoEAA", color:C.purple,
      def:"An abstraction that mediates between the service layer and the data source. The interface is defined inside the service/domain package; its implementation lives in the infrastructure package. From the service's perspective it is a collection of domain objects.",
      why:"The repository is the seam that makes the database invisible to the domain. In Go this is an interface defined next to the service; in Java a Port interface; in Python a Protocol. Tests inject an in-memory implementation — no database required.",
      mistake:"Defining the repository interface inside the infrastructure package (e.g. postgres/repo.go). The interface must live where it is consumed — the service package — not where it is implemented. This is the Dependency Inversion Principle applied directly." },
    { title:"Outbox Pattern (Transactional Outbox)", source:"Kleppmann, Designing Data-Intensive Applications; microservices.io", color:C.red,
      def:"A technique to safely publish events in event-driven systems. Instead of writing to the database and publishing to the broker in two separate operations (the dual-write problem), you write the event to an outbox table in the same DB transaction, then a relay process reads and publishes it.",
      why:"Eliminates the race condition where a DB write succeeds but the broker is unavailable — leaving a committed record with no corresponding event. Guarantees at-least-once delivery. Implemented by tools like Debezium (CDC) or an in-process relay loop.",
      mistake:"Publishing directly to Kafka inside the service method after the DB commit. If the broker is down between those two lines, you have a committed DB record and a missing event — silent data inconsistency that is extremely difficult to recover from." },
    { title:"Idempotency in Event-Driven Systems", source:"Kleppmann, DDIA; Hohpe & Woolf, Enterprise Integration Patterns", color:C.green,
      def:"The property that processing the same message multiple times produces the same result as processing it once. Required in any system with at-least-once delivery — Kafka, SQS, Pub/Sub — because messages are redelivered on consumer failure or rebalance.",
      why:"Without idempotency, a redelivered 'OrderCreated' message creates a duplicate order. The service layer checks a deduplication key before executing side effects. This lives in the service layer — not the transport — because the transport cannot know if a message is a retry.",
      mistake:"Assuming the transport layer will prevent duplicates. It cannot — at-least-once delivery guarantees you will receive duplicates. Idempotency is a domain/business logic concern and belongs in the service layer as a first-class, mandatory check." },
  ];

  return (
    <div>
      {concepts.map(c=>(
        <Card key={c.title} accentColor={c.color} title={c.title} source={c.source}>
          <Row label="Definition">{c.def}</Row>
          <Row label="Why it matters" color={C.green}>{c.why}</Row>
          <Row label="Common mistake" color={C.red}>{c.mistake}</Row>
          {c.note && <Row label="Note" color={C.amber}>{c.note}</Row>}
        </Card>
      ))}

      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:20, marginBottom:12 }}>
        <div style={{ color:C.amber, fontWeight:600, fontSize:13, marginBottom:14 }}>Trade-offs</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <div>
            <div style={{ color:C.green, fontSize:11, fontWeight:700, marginBottom:8, letterSpacing:"0.06em" }}>WHEN TO USE</div>
            {["Any service needing independent unit, integration, and e2e testing","Teams ≥ 3 engineers — explicit seams reduce coordination overhead","Adding event-driven delivery alongside HTTP — only Transport layer changes","Greenfield services that will evolve their delivery mechanism or database","Services with multiple failure modes that need to be testable in isolation"].map(t=>(
              <div key={t} style={{ color:C.muted, fontSize:12, marginBottom:6, paddingLeft:8, borderLeft:`2px solid ${C.green}` }}>{t}</div>
            ))}
          </div>
          <div>
            <div style={{ color:C.red, fontSize:11, fontWeight:700, marginBottom:8, letterSpacing:"0.06em" }}>WHEN TO RECONSIDER</div>
            {["Throwaway scripts or single-purpose CLIs — overhead not justified","Hot-path code where layer call overhead matters — profile before committing","Deeply event-sourced systems where aggregates own all state transitions","Tiny services (< 500 LOC) where pragmatic flat structure is equally effective"].map(t=>(
              <div key={t} style={{ color:C.muted, fontSize:12, marginBottom:6, paddingLeft:8, borderLeft:`2px solid ${C.red}` }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      <Card accentColor={C.purple} title="Real-World Examples">
        {[
          { who:"Stripe",     what:"Service-layer pattern where each API resource maps to a service object coordinating idempotency, state machines, and event publishing — fully decoupled from HTTP handler logic." },
          { who:"Uber",       what:"Go microservices with transport → service → storage layering. Ability to add gRPC without rewriting business logic was an explicit architectural benefit cited during the 2016–2018 Go migration (Uber Engineering blog)." },
          { who:"Netflix",    what:"Kafka consumers implemented as thin Transport adapters calling the same domain services used by synchronous REST endpoints — zero duplication of business logic across delivery mechanisms." },
          { who:"Go community", what:"Ben Johnson's 'Standard Package Layout' (2016) and the go-kit framework both advocate domain types at the core, transport adapters at the edge — a direct expression of layered architecture with Dependency Inversion." },
        ].map(({who,what})=>(
          <div key={who} style={{ marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
            <span style={{ color:C.purple, fontWeight:600, fontSize:12 }}>{who}  </span>
            <span style={{ color:C.muted, fontSize:12 }}>{what}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB 3 — IMPLEMENTATIONS
// ═══════════════════════════════════════════════

const GO_CODE = `// Pattern: Layered Architecture
// Reference: Fowler, PoEAA; Martin, Clean Architecture
// Production note: Define interfaces where consumed (service pkg), implement in adapters pkg

package main

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"
)

// ─── Domain Types ─────────────────────────────────────────────────────────

type OrderID string
type UserID  string

type OrderItem struct {
	ProductID  string
	Quantity   int
	PriceCents int64
}

type Order struct {
	ID             OrderID
	UserID         UserID
	Items          []OrderItem
	Status         string
	CreatedAt      time.Time
	IdempotencyKey string
}

type CreateOrderCommand struct {
	UserID         UserID
	Items          []OrderItem
	IdempotencyKey string // required for event-driven callers
}

var (
	ErrOrderNotFound = errors.New("order not found")
	ErrInvalidOrder  = errors.New("invalid order: must have at least one item")
)

// ─── Ports — defined here, in the service package ─────────────────────────
// Dependency Inversion: the interface is owned by the consumer, not the implementor.

type OrderRepository interface {
	Save(ctx context.Context, o *Order) error
	FindByID(ctx context.Context, id OrderID) (*Order, error)
	FindByIdempotencyKey(ctx context.Context, key string) (*Order, bool, error)
}

type EventPublisher interface {
	Publish(ctx context.Context, e OrderEvent) error
}

// ─── Domain Events ────────────────────────────────────────────────────────

type OrderEvent struct {
	Type       string
	OrderID    OrderID
	UserID     UserID
	OccurredAt time.Time
}

// ─── Service Layer ────────────────────────────────────────────────────────

type OrderService struct {
	repo OrderRepository
	pub  EventPublisher
}

func NewOrderService(repo OrderRepository, pub EventPublisher) *OrderService {
	return &OrderService{repo: repo, pub: pub}
}

// CreateOrder is protocol-agnostic: called by the HTTP handler AND the Kafka
// consumer. No transport concepts (http.Request, kafka.Message) leak in here.
func (s *OrderService) CreateOrder(ctx context.Context, cmd CreateOrderCommand) (*Order, error) {
	if len(cmd.Items) == 0 {
		return nil, ErrInvalidOrder
	}

	// Idempotency check — identical code path for HTTP and event-driven callers.
	// The transport does NOT know if a message is a retry; the service must check.
	if cmd.IdempotencyKey != "" {
		if existing, found, err := s.repo.FindByIdempotencyKey(ctx, cmd.IdempotencyKey); err != nil {
			return nil, fmt.Errorf("idempotency lookup: %w", err)
		} else if found {
			return existing, nil
		}
	}

	o := &Order{
		ID:             OrderID(fmt.Sprintf("ord_%d", time.Now().UnixNano())),
		UserID:         cmd.UserID,
		Items:          cmd.Items,
		Status:         "pending",
		CreatedAt:      time.Now().UTC(),
		IdempotencyKey: cmd.IdempotencyKey,
	}

	if err := s.repo.Save(ctx, o); err != nil {
		return nil, fmt.Errorf("saving order: %w", err)
	}

	// In production: write event to outbox table in the same DB transaction.
	// A relay process (e.g. Debezium CDC) publishes it, eliminating dual-write risk.
	event := OrderEvent{
		Type:       "OrderCreated",
		OrderID:    o.ID,
		UserID:     o.UserID,
		OccurredAt: time.Now().UTC(),
	}
	if err := s.pub.Publish(ctx, event); err != nil {
		// Non-fatal here: outbox relay handles retry.
		fmt.Printf("warn: event publish failed, outbox will retry: %v\n", err)
	}

	return o, nil
}

func (s *OrderService) GetOrder(ctx context.Context, id OrderID) (*Order, error) {
	o, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("order %s: %w", id, ErrOrderNotFound)
	}
	return o, nil
}

// ─── Infrastructure: In-Memory Repository ─────────────────────────────────

type InMemoryOrderRepo struct {
	mu    sync.RWMutex
	byID  map[OrderID]*Order
	byKey map[string]*Order
}

func NewInMemoryOrderRepo() *InMemoryOrderRepo {
	return &InMemoryOrderRepo{
		byID:  make(map[OrderID]*Order),
		byKey: make(map[string]*Order),
	}
}

func (r *InMemoryOrderRepo) Save(ctx context.Context, o *Order) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.byID[o.ID] = o
	if o.IdempotencyKey != "" {
		r.byKey[o.IdempotencyKey] = o
	}
	return nil
}

func (r *InMemoryOrderRepo) FindByID(ctx context.Context, id OrderID) (*Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	o, ok := r.byID[id]
	if !ok {
		return nil, ErrOrderNotFound
	}
	return o, nil
}

func (r *InMemoryOrderRepo) FindByIdempotencyKey(ctx context.Context, key string) (*Order, bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	o, ok := r.byKey[key]
	return o, ok, nil
}

// ─── Infrastructure: Log Event Publisher ─────────────────────────────────

type LogEventPublisher struct{}

func (p *LogEventPublisher) Publish(_ context.Context, e OrderEvent) error {
	fmt.Printf("[event] type=%s order=%s user=%s at=%s\n",
		e.Type, e.OrderID, e.UserID, e.OccurredAt.Format(time.RFC3339))
	return nil
}

// ─── Transport A: HTTP Handler ────────────────────────────────────────────
// Knows about HTTP. Knows nothing about Kafka. Calls the same service.

type HTTPTransport struct{ svc *OrderService }

func (t *HTTPTransport) HandleCreate(ctx context.Context, userID, idempKey string) {
	cmd := CreateOrderCommand{
		UserID:         UserID(userID),
		Items:          []OrderItem{{ProductID: "prod_1", Quantity: 2, PriceCents: 1999}},
		IdempotencyKey: idempKey,
	}
	o, err := t.svc.CreateOrder(ctx, cmd)
	switch {
	case errors.Is(err, ErrInvalidOrder):
		fmt.Println("[http] 422 invalid order")
	case err != nil:
		fmt.Printf("[http] 500 %v\n", err)
	default:
		fmt.Printf("[http] 201 order=%s\n", o.ID)
	}
}

// ─── Transport B: Message Consumer ───────────────────────────────────────
// Knows about the broker envelope. Knows nothing about HTTP. Same service.

type MessagePayload struct {
	UserID         string
	IdempotencyKey string
	Items          []OrderItem
}

type KafkaTransport struct{ svc *OrderService }

func (t *KafkaTransport) HandleMessage(ctx context.Context, msg MessagePayload) {
	cmd := CreateOrderCommand{
		UserID:         UserID(msg.UserID),
		Items:          msg.Items,
		IdempotencyKey: msg.IdempotencyKey,
	}
	o, err := t.svc.CreateOrder(ctx, cmd)
	if err != nil {
		fmt.Printf("[kafka] nack → requeue: %v\n", err)
		return // production: increment retry counter; after N → DLQ
	}
	fmt.Printf("[kafka] ack  order=%s\n", o.ID)
}

// ─── Main ─────────────────────────────────────────────────────────────────

func main() {
	repo := NewInMemoryOrderRepo()
	pub  := &LogEventPublisher{}
	svc  := NewOrderService(repo, pub)
	ctx  := context.Background()

	fmt.Println("=== HTTP Transport ===")
	httpT := &HTTPTransport{svc: svc}
	httpT.HandleCreate(ctx, "user_42", "idemp_abc")
	httpT.HandleCreate(ctx, "user_42", "idemp_abc") // duplicate → idempotent, no double-create

	fmt.Println("\n=== Kafka Consumer Transport ===")
	kafkaT := &KafkaTransport{svc: svc}
	msg := MessagePayload{
		UserID:         "user_99",
		IdempotencyKey: "kafka_7f3a",
		Items:          []OrderItem{{ProductID: "prod_5", Quantity: 1, PriceCents: 4999}},
	}
	kafkaT.HandleMessage(ctx, msg)
	kafkaT.HandleMessage(ctx, msg) // redelivered message → safe
}`;

const PYTHON_CODE = `# Pattern: Layered Architecture
# Reference: Fowler PoEAA; Martin, Clean Architecture
# Production note: Protocol (structural typing) for ports — avoids import cycles

from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Protocol, runtime_checkable
from uuid import uuid4
import threading


# ─── Domain Types ─────────────────────────────────────────────────────────

@dataclass(frozen=True)
class OrderItem:
    product_id:  str
    quantity:    int
    price_cents: int


@dataclass
class Order:
    id:              str
    user_id:         str
    items:           list[OrderItem]
    status:          str
    created_at:      datetime
    idempotency_key: str | None = None


@dataclass(frozen=True)
class CreateOrderCommand:
    user_id:         str
    items:           list[OrderItem]
    idempotency_key: str | None = None


@dataclass(frozen=True)
class OrderEvent:
    type:        str
    order_id:    str
    user_id:     str
    occurred_at: datetime


class OrderNotFoundError(Exception): ...
class InvalidOrderError(Exception):  ...


# ─── Ports — Protocols defined here, in the service module ────────────────
# Structural typing: any class with matching methods satisfies the protocol.

@runtime_checkable
class OrderRepository(Protocol):
    def save(self, order: Order) -> None: ...
    def find_by_id(self, order_id: str) -> Order: ...            # raises OrderNotFoundError
    def find_by_idempotency_key(self, key: str) -> Order | None: ...


@runtime_checkable
class EventPublisher(Protocol):
    def publish(self, event: OrderEvent) -> None: ...


# ─── Service Layer ────────────────────────────────────────────────────────

class OrderService:
    def __init__(self, repo: OrderRepository, publisher: EventPublisher) -> None:
        self._repo      = repo
        self._publisher = publisher

    def create_order(self, cmd: CreateOrderCommand) -> Order:
        if not cmd.items:
            raise InvalidOrderError("Order must have at least one item")

        # Idempotency — same code path for HTTP and event-driven callers
        if cmd.idempotency_key:
            existing = self._repo.find_by_idempotency_key(cmd.idempotency_key)
            if existing is not None:
                return existing

        order = Order(
            id=f"ord_{uuid4().hex[:10]}",
            user_id=cmd.user_id,
            items=list(cmd.items),
            status="pending",
            created_at=datetime.now(timezone.utc),
            idempotency_key=cmd.idempotency_key,
        )
        self._repo.save(order)

        # Production: write event to outbox table in the same DB transaction
        try:
            self._publisher.publish(OrderEvent(
                type="OrderCreated",
                order_id=order.id,
                user_id=order.user_id,
                occurred_at=datetime.now(timezone.utc),
            ))
        except Exception as exc:
            print(f"[warn] event publish failed, outbox will retry: {exc}")

        return order

    def get_order(self, order_id: str) -> Order:
        return self._repo.find_by_id(order_id)


# ─── Infrastructure: In-Memory Repository ─────────────────────────────────

class InMemoryOrderRepository:
    def __init__(self) -> None:
        self._orders: dict[str, Order] = {}
        self._by_key: dict[str, Order] = {}
        self._lock = threading.RLock()

    def save(self, order: Order) -> None:
        with self._lock:
            self._orders[order.id] = order
            if order.idempotency_key:
                self._by_key[order.idempotency_key] = order

    def find_by_id(self, order_id: str) -> Order:
        with self._lock:
            if order_id not in self._orders:
                raise OrderNotFoundError(order_id)
            return self._orders[order_id]

    def find_by_idempotency_key(self, key: str) -> Order | None:
        with self._lock:
            return self._by_key.get(key)


class LogEventPublisher:
    def publish(self, event: OrderEvent) -> None:
        print(f"[event] type={event.type} order={event.order_id} "
              f"user={event.user_id} at={event.occurred_at.isoformat()}")


# ─── Transport A: HTTP Handler ────────────────────────────────────────────

class HTTPTransport:
    def __init__(self, svc: OrderService) -> None:
        self._svc = svc

    def handle_create(self, user_id: str, idempotency_key: str | None = None) -> None:
        try:
            order = self._svc.create_order(CreateOrderCommand(
                user_id=user_id,
                items=[OrderItem("prod_1", 2, 1999)],
                idempotency_key=idempotency_key,
            ))
            print(f"[http] 201 order={order.id}")
        except InvalidOrderError as exc:
            print(f"[http] 422 {exc}")


# ─── Transport B: Message Consumer ───────────────────────────────────────

@dataclass(frozen=True)
class MessagePayload:
    user_id:         str
    items:           list[OrderItem]
    idempotency_key: str


class KafkaConsumerTransport:
    def __init__(self, svc: OrderService) -> None:
        self._svc = svc

    def handle_message(self, payload: MessagePayload) -> None:
        try:
            order = self._svc.create_order(CreateOrderCommand(
                user_id=payload.user_id,
                items=payload.items,
                idempotency_key=payload.idempotency_key,
            ))
            print(f"[kafka] ack  order={order.id}")
        except Exception as exc:
            print(f"[kafka] nack → requeue: {exc}")


# ─── Main ─────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    repo  = InMemoryOrderRepository()
    pub   = LogEventPublisher()
    svc   = OrderService(repo, pub)

    print("=== HTTP Transport ===")
    http = HTTPTransport(svc)
    http.handle_create("user_42", "idemp_abc")
    http.handle_create("user_42", "idemp_abc")   # duplicate → idempotent

    print("\n=== Kafka Consumer Transport ===")
    kafka = KafkaConsumerTransport(svc)
    msg = MessagePayload("user_99", [OrderItem("prod_5", 1, 4999)], "kafka_7f3a")
    kafka.handle_message(msg)
    kafka.handle_message(msg)                     # redelivered → safe`;

const TS_CODE = `// Pattern: Layered Architecture
// Reference: Fowler PoEAA; Martin, Clean Architecture
// Production note: Result<T,E> for domain errors — never throw from service layer

// ─── Domain Types ─────────────────────────────────────────────────────────

type OrderId  = string & { readonly __brand: "OrderId" };
type UserId   = string & { readonly __brand: "UserId" };

interface OrderItem { readonly productId: string; readonly quantity: number; readonly priceCents: number; }

interface Order {
  readonly id:             OrderId;
  readonly userId:         UserId;
  readonly items:          readonly OrderItem[];
  readonly status:         "pending" | "confirmed" | "cancelled";
  readonly createdAt:      Date;
  readonly idempotencyKey: string | null;
}

interface CreateOrderCommand {
  readonly userId:         UserId;
  readonly items:          readonly OrderItem[];
  readonly idempotencyKey: string | null;
}

// Discriminated-union Result — no exceptions for domain errors
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
const ok   = <T>(value: T): Result<T, never> => ({ ok: true,  value });
const fail = <E>(error: E): Result<never, E> => ({ ok: false, error });

type ServiceError =
  | { kind: "InvalidInput"; message: string }
  | { kind: "NotFound";     id: string }
  | { kind: "Internal";     cause: unknown };

// ─── Ports ────────────────────────────────────────────────────────────────

interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | null>;
  findByIdempotencyKey(key: string): Promise<Order | null>;
}

interface EventPublisher {
  publish(event: OrderEvent): Promise<void>;
}

interface OrderEvent {
  type: "OrderCreated" | "OrderCancelled";
  orderId: OrderId; userId: UserId; occurredAt: Date;
}

// ─── Service Layer ────────────────────────────────────────────────────────

class OrderService {
  constructor(
    private readonly repo: OrderRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async createOrder(cmd: CreateOrderCommand): Promise<Result<Order, ServiceError>> {
    if (cmd.items.length === 0)
      return fail({ kind: "InvalidInput", message: "Order must have at least one item" });

    if (cmd.idempotencyKey) {
      const existing = await this.repo.findByIdempotencyKey(cmd.idempotencyKey);
      if (existing) return ok(existing);
    }

    const order: Order = {
      id:             \`ord_\${Date.now()}_\${Math.random().toString(36).slice(2,8)}\` as OrderId,
      userId:         cmd.userId,
      items:          cmd.items,
      status:         "pending",
      createdAt:      new Date(),
      idempotencyKey: cmd.idempotencyKey,
    };

    try { await this.repo.save(order); }
    catch (cause) { return fail({ kind: "Internal", cause }); }

    await this.publisher.publish({
      type: "OrderCreated", orderId: order.id,
      userId: order.userId, occurredAt: new Date(),
    }).catch(e => console.warn("[warn] event publish failed, outbox will retry:", e));

    return ok(order);
  }
}

// ─── Infrastructure ───────────────────────────────────────────────────────

class InMemoryOrderRepository implements OrderRepository {
  private readonly byId  = new Map<OrderId, Order>();
  private readonly byKey = new Map<string, Order>();

  async save(order: Order) {
    this.byId.set(order.id, order);
    if (order.idempotencyKey) this.byKey.set(order.idempotencyKey, order);
  }
  async findById(id: OrderId)             { return this.byId.get(id)   ?? null; }
  async findByIdempotencyKey(key: string) { return this.byKey.get(key) ?? null; }
}

class LogEventPublisher implements EventPublisher {
  async publish(e: OrderEvent) {
    console.log(\`[event] type=\${e.type} order=\${e.orderId} user=\${e.userId}\`);
  }
}

// ─── Transport A: HTTP Handler ────────────────────────────────────────────

class HttpTransport {
  constructor(private readonly svc: OrderService) {}

  async handleCreate(userId: UserId, idempotencyKey: string | null) {
    const result = await this.svc.createOrder({
      userId, idempotencyKey,
      items: [{ productId: "prod_1", quantity: 2, priceCents: 1999 }],
    });
    if (!result.ok) {
      const status = result.error.kind === "InvalidInput" ? 422 : 500;
      console.log(\`[http] \${status}\`, result.error);
      return;
    }
    console.log(\`[http] 201 order=\${result.value.id}\`);
  }
}

// ─── Transport B: Message Consumer ───────────────────────────────────────

interface MessagePayload { userId: UserId; items: OrderItem[]; idempotencyKey: string; }

class KafkaConsumerTransport {
  constructor(private readonly svc: OrderService) {}

  async handleMessage(payload: MessagePayload) {
    const result = await this.svc.createOrder({
      userId: payload.userId, items: payload.items,
      idempotencyKey: payload.idempotencyKey,
    });
    if (!result.ok) { console.log("[kafka] nack → requeue:", result.error); return; }
    console.log(\`[kafka] ack  order=\${result.value.id}\`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const svc = new OrderService(new InMemoryOrderRepository(), new LogEventPublisher());

  console.log("=== HTTP Transport ===");
  const http = new HttpTransport(svc);
  await http.handleCreate("user_42" as UserId, "idemp_abc");
  await http.handleCreate("user_42" as UserId, "idemp_abc"); // duplicate → idempotent

  console.log("\n=== Kafka Consumer Transport ===");
  const kafka = new KafkaConsumerTransport(svc);
  const msg: MessagePayload = {
    userId: "user_99" as UserId,
    items:  [{ productId: "prod_5", quantity: 1, priceCents: 4999 }],
    idempotencyKey: "kafka_7f3a",
  };
  await kafka.handleMessage(msg);
  await kafka.handleMessage(msg); // redelivered → safe
}

main().catch(console.error);`;

const JAVA_CODE = `// Pattern: Layered Architecture
// Reference: Fowler PoEAA; Martin, Clean Architecture; Evans DDD
// Production note: Sealed interfaces + records + pattern-match switch (Java 21+)

package com.example.orders;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

// ─── Domain Types ─────────────────────────────────────────────────────────

record OrderItem(String productId, int quantity, long priceCents) {}

record OrderId(String value) {
    static OrderId generate() {
        return new OrderId("ord_" + UUID.randomUUID().toString().replace("-","").substring(0,10));
    }
}

record Order(OrderId id, String userId, List<OrderItem> items,
             String status, Instant createdAt, Optional<String> idempotencyKey) {}

record CreateOrderCommand(String userId, List<OrderItem> items, Optional<String> idempotencyKey) {}

record OrderEvent(String type, OrderId orderId, String userId, Instant occurredAt) {}

sealed interface ServiceError
    permits ServiceError.InvalidInput, ServiceError.NotFound, ServiceError.Internal {
    record InvalidInput(String reason) implements ServiceError {}
    record NotFound(String id)         implements ServiceError {}
    record Internal(Throwable cause)   implements ServiceError {}
}

// ─── Ports — defined in service package ────────────────────────────────────

interface OrderRepository {
    void save(Order order);
    Optional<Order> findById(OrderId id);
    Optional<Order> findByIdempotencyKey(String key);
}

interface EventPublisher { void publish(OrderEvent event); }

// ─── Service Layer ────────────────────────────────────────────────────────

class OrderService {
    private final OrderRepository repo;
    private final EventPublisher  publisher;

    OrderService(OrderRepository repo, EventPublisher publisher) {
        this.repo = repo; this.publisher = publisher;
    }

    sealed interface CreateResult permits CreateResult.Success, CreateResult.Failure {
        record Success(Order order)       implements CreateResult {}
        record Failure(ServiceError error) implements CreateResult {}
    }

    CreateResult createOrder(CreateOrderCommand cmd) {
        if (cmd.items().isEmpty())
            return new CreateResult.Failure(new ServiceError.InvalidInput("Order must have at least one item"));

        if (cmd.idempotencyKey().isPresent()) {
            var existing = repo.findByIdempotencyKey(cmd.idempotencyKey().get());
            if (existing.isPresent()) return new CreateResult.Success(existing.get());
        }

        var order = new Order(
            OrderId.generate(), cmd.userId(), List.copyOf(cmd.items()),
            "pending", Instant.now(), cmd.idempotencyKey()
        );

        try { repo.save(order); }
        catch (Exception e) { return new CreateResult.Failure(new ServiceError.Internal(e)); }

        // Production: use Outbox pattern — write event in same DB transaction
        try {
            publisher.publish(new OrderEvent("OrderCreated", order.id(), order.userId(), Instant.now()));
        } catch (Exception e) {
            System.err.printf("[warn] event publish failed, outbox will retry: %s%n", e.getMessage());
        }

        return new CreateResult.Success(order);
    }
}

// ─── Infrastructure ───────────────────────────────────────────────────────

class InMemoryOrderRepository implements OrderRepository {
    private final Map<OrderId, Order> byId  = new ConcurrentHashMap<>();
    private final Map<String, Order>  byKey = new ConcurrentHashMap<>();

    @Override public void save(Order o) {
        byId.put(o.id(), o);
        o.idempotencyKey().ifPresent(k -> byKey.put(k, o));
    }
    @Override public Optional<Order> findById(OrderId id)       { return Optional.ofNullable(byId.get(id)); }
    @Override public Optional<Order> findByIdempotencyKey(String k) { return Optional.ofNullable(byKey.get(k)); }
}

class LogEventPublisher implements EventPublisher {
    @Override public void publish(OrderEvent e) {
        System.out.printf("[event] type=%s order=%s user=%s at=%s%n",
            e.type(), e.orderId().value(), e.userId(), e.occurredAt());
    }
}

// ─── Transport A: HTTP Handler ────────────────────────────────────────────

class HttpTransport {
    private final OrderService svc;
    HttpTransport(OrderService svc) { this.svc = svc; }

    void handleCreate(String userId, String idempotencyKey) {
        var cmd = new CreateOrderCommand(userId,
            List.of(new OrderItem("prod_1", 2, 1999L)),
            Optional.ofNullable(idempotencyKey));
        switch (svc.createOrder(cmd)) {
            case OrderService.CreateResult.Success s ->
                System.out.printf("[http] 201 order=%s%n", s.order().id().value());
            case OrderService.CreateResult.Failure f ->
                System.out.printf("[http] %s %s%n",
                    f.error() instanceof ServiceError.InvalidInput ? "422" : "500", f.error());
        }
    }
}

// ─── Transport B: Message Consumer ───────────────────────────────────────

record MessagePayload(String userId, List<OrderItem> items, String idempotencyKey) {}

class KafkaConsumerTransport {
    private final OrderService svc;
    KafkaConsumerTransport(OrderService svc) { this.svc = svc; }

    void handleMessage(MessagePayload payload) {
        var cmd = new CreateOrderCommand(payload.userId(), payload.items(),
            Optional.of(payload.idempotencyKey()));
        switch (svc.createOrder(cmd)) {
            case OrderService.CreateResult.Success s ->
                System.out.printf("[kafka] ack  order=%s%n", s.order().id().value());
            case OrderService.CreateResult.Failure f ->
                System.out.printf("[kafka] nack → requeue: %s%n", f.error());
        }
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────

class Main {
    public static void main(String[] args) {
        var svc = new OrderService(new InMemoryOrderRepository(), new LogEventPublisher());

        System.out.println("=== HTTP Transport ===");
        var http = new HttpTransport(svc);
        http.handleCreate("user_42", "idemp_abc");
        http.handleCreate("user_42", "idemp_abc"); // duplicate → idempotent

        System.out.println("\n=== Kafka Consumer Transport ===");
        var kafka = new KafkaConsumerTransport(svc);
        var msg = new MessagePayload("user_99",
            List.of(new OrderItem("prod_5", 1, 4999L)), "kafka_7f3a");
        kafka.handleMessage(msg);
        kafka.handleMessage(msg); // redelivered → safe
    }
}`;

const AWS_CDK_CODE = `// File: infrastructure/cdk/order-service-stack.ts
// IaC: AWS CDK (TypeScript)
// Pattern: ECS Fargate (HTTP transport) + SQS (async transport) — same container image

import * as cdk  from 'aws-cdk-lib';
import * as ecs  from 'aws-cdk-lib/aws-ecs';
import * as ec2  from 'aws-cdk-lib/aws-ec2';
import * as sqs  from 'aws-cdk-lib/aws-sqs';
import * as rds  from 'aws-cdk-lib/aws-rds';
import * as iam  from 'aws-cdk-lib/aws-iam';
import * as sm   from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class OrderServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });

    // ── Infrastructure layer: PostgreSQL (Repository implementation) ───────
    const dbSecret = new sm.Secret(this, 'DbSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'orders' }),
        generateStringKey: 'password',
      },
    });

    new rds.DatabaseInstance(this, 'OrdersDb', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16 }),
      vpc,
      credentials: rds.Credentials.fromSecret(dbSecret),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
      multiAz: true,
    });

    // ── Transport layer (async): SQS Queue with DLQ ──────────────────────
    const dlq = new sqs.Queue(this, 'Dlq', {
      retentionPeriod: cdk.Duration.days(14),
    });

    const queue = new sqs.Queue(this, 'OrderEventsQueue', {
      visibilityTimeout: cdk.Duration.seconds(30),
      deadLetterQueue: { queue: dlq, maxReceiveCount: 3 },
    });

    // ── Service layer: ECS Fargate ────────────────────────────────────────
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 512, cpu: 256,
    });

    // IAM: least-privilege — consumer transport only needs these SQS actions
    taskDef.addToTaskRolePolicy(new iam.PolicyStatement({
      actions: ['sqs:ReceiveMessage', 'sqs:DeleteMessage', 'sqs:GetQueueAttributes'],
      resources: [queue.queueArn],
    }));

    taskDef.addContainer('OrderService', {
      image: ecs.ContainerImage.fromRegistry('your-ecr/order-service:latest'),
      environment: {
        SQS_QUEUE_URL: queue.queueUrl,
        // TRANSPORT_MODE=dual starts both HTTP server and SQS polling loop.
        // Service layer and repository are shared — zero code duplication.
        TRANSPORT_MODE: 'dual',
      },
      secrets: { DB_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password') },
      portMappings: [{ containerPort: 8080 }],
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'order-service' }),
    });

    new ecs.FargateService(this, 'Service', {
      cluster, taskDefinition: taskDef, desiredCount: 2,
    });
  }
}`;

const AWS_SDK_CODE = `// File: adapters/sqs/consumer.go
// SDK: aws-sdk-go-v2
// Pattern: SQS as Transport layer — polls queue, calls identical service layer

package sqstransport

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
	"github.com/aws/aws-sdk-go-v2/service/sqs/types"
)

type MessageEnvelope struct {
	UserID         string \`json:"user_id"\`
	Items          []Item \`json:"items"\`
	IdempotencyKey string \`json:"idempotency_key"\`
}

type Item struct {
	ProductID  string \`json:"product_id"\`
	Quantity   int    \`json:"quantity"\`
	PriceCents int64  \`json:"price_cents"\`
}

// OrderServicePort — the interface this Transport calls into the service layer.
// Note: this is defined in the service package and imported here, not the reverse.
type OrderServicePort interface {
	CreateOrder(ctx context.Context, cmd CreateOrderCommand) (*Order, error)
}

type SQSConsumer struct {
	client   *sqs.Client
	queueURL string
	svc      OrderServicePort
}

func NewSQSConsumer(queueURL string, svc OrderServicePort) (*SQSConsumer, error) {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		return nil, fmt.Errorf("loading aws config: %w", err)
	}
	return &SQSConsumer{client: sqs.NewFromConfig(cfg), queueURL: queueURL, svc: svc}, nil
}

func (c *SQSConsumer) Run(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}

		out, err := c.client.ReceiveMessage(ctx, &sqs.ReceiveMessageInput{
			QueueUrl:            aws.String(c.queueURL),
			MaxNumberOfMessages: 10,
			WaitTimeSeconds:     20, // long-polling
		})
		if err != nil {
			log.Printf("sqs receive error: %v", err)
			continue
		}

		for _, msg := range out.Messages {
			if err := c.process(ctx, msg); err != nil {
				log.Printf("nack — message will re-appear after visibilityTimeout: %v", err)
				continue // do NOT delete — SQS retries; after maxReceiveCount → DLQ
			}
			c.client.DeleteMessage(ctx, &sqs.DeleteMessageInput{
				QueueUrl:      aws.String(c.queueURL),
				ReceiptHandle: msg.ReceiptHandle,
			})
		}
	}
}

func (c *SQSConsumer) process(ctx context.Context, msg types.Message) error {
	var env MessageEnvelope
	if err := json.Unmarshal([]byte(aws.ToString(msg.Body)), &env); err != nil {
		return fmt.Errorf("deserialise: %w", err)
	}
	// Call the SAME service layer as the HTTP handler — zero business logic duplication
	_, err := c.svc.CreateOrder(ctx, CreateOrderCommand{
		UserID:         env.UserID,
		IdempotencyKey: env.IdempotencyKey,
		// map env.Items → domain OrderItems
	})
	return err
}`;

const AZURE_CODE = `// File: infrastructure/bicep/order-service.bicep
// IaC: Azure Bicep
// Pattern: Container Apps + Service Bus consumer (KEDA scale rule on queue depth)

param location string = resourceGroup().location
param suffix string = uniqueString(resourceGroup().id)

// ── Transport (async): Service Bus Queue with dead-letter ─────────────────
resource sbNs 'Microsoft.ServiceBus/namespaces@2022-10-01-preview' = {
  name: 'orders-sb-\${suffix}'
  location: location
  sku: { name: 'Standard' }
}

resource orderQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
  parent: sbNs
  name: 'order-events'
  properties: {
    maxDeliveryCount: 3          // → dead-letter after 3 failed deliveries
    deadLetteringOnMessageExpiration: true
    lockDuration: 'PT30S'
  }
}

// ── Infrastructure (Repository): PostgreSQL Flexible Server ──────────────
resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: 'orders-db-\${suffix}'
  location: location
  sku: { name: 'Standard_B2ms', tier: 'Burstable' }
  properties: {
    version: '16'
    highAvailability: { mode: 'ZoneRedundant' }
  }
}

// ── Service Layer: Container App with KEDA scale rule ─────────────────────
// Same image as HTTP service — TRANSPORT_MODE activates the consumer loop.
resource env 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: 'orders-env'
  location: location
  properties: {}
}

resource consumerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'order-consumer'
  location: location
  properties: {
    managedEnvironmentId: env.id
    template: {
      containers: [{
        name: 'order-service'
        image: 'your-acr.azurecr.io/order-service:latest'
        env: [
          { name: 'TRANSPORT_MODE',         value: 'servicebus' }
          { name: 'SERVICE_BUS_QUEUE_NAME', value: 'order-events' }
        ]
        resources: { cpu: '0.5', memory: '1Gi' }
      }]
      scale: {
        minReplicas: 0
        maxReplicas: 20
        rules: [{
          name: 'sb-queue-depth'
          custom: {
            type: 'azure-servicebus'
            // Scale one consumer replica per 5 messages in the queue
            metadata: { queueName: 'order-events', messageCount: '5' }
          }
        }]
      }
    }
  }
}`;

const GCP_CODE = `# File: infrastructure/terraform/order-service/main.tf
# IaC: Terraform (GCP)
# Pattern: Cloud Run (HTTP) + Cloud Run (Pub/Sub push consumer) — same image

terraform {
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

variable "project_id" { type = string }
variable "region"     { type = string; default = "us-central1" }

# ── Transport (async): Pub/Sub + dead-letter ─────────────────────────────
resource "google_pubsub_topic" "order_events"     { name = "order-events";     project = var.project_id }
resource "google_pubsub_topic" "order_events_dlq" { name = "order-events-dlq"; project = var.project_id }

resource "google_pubsub_subscription" "order_events_sub" {
  name    = "order-events-sub"
  topic   = google_pubsub_topic.order_events.name
  project = var.project_id

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.order_events_dlq.id
    max_delivery_attempts = 3
  }

  push_config {
    # Pub/Sub pushes directly to the consumer Cloud Run service
    push_endpoint = google_cloud_run_v2_service.order_consumer.uri
  }

  ack_deadline_seconds = 30
}

# ── Infrastructure (Repository): Cloud SQL PostgreSQL ───────────────────
resource "google_sql_database_instance" "orders_db" {
  name             = "orders-db"
  database_version = "POSTGRES_16"
  project          = var.project_id
  region           = var.region
  settings {
    tier              = "db-f1-micro"
    availability_type = "REGIONAL"
    backup_configuration { enabled = true }
  }
}

# ── Service Layer: Cloud Run HTTP transport ───────────────────────────────
resource "google_cloud_run_v2_service" "order_http" {
  name     = "order-service-http"
  location = var.region
  project  = var.project_id
  template {
    containers {
      image = "gcr.io/\${var.project_id}/order-service:latest"
      env { name = "TRANSPORT_MODE"; value = "http" }
      resources { limits = { cpu = "1", memory = "512Mi" } }
    }
    scaling { min_instance_count = 1; max_instance_count = 10 }
  }
}

# ── Service Layer: Cloud Run Pub/Sub consumer transport ───────────────────
# Identical image — only TRANSPORT_MODE differs. Service + repo layers unchanged.
resource "google_cloud_run_v2_service" "order_consumer" {
  name     = "order-service-consumer"
  location = var.region
  project  = var.project_id
  template {
    containers {
      image = "gcr.io/\${var.project_id}/order-service:latest"
      env { name = "TRANSPORT_MODE"; value = "pubsub" }
      resources { limits = { cpu = "1", memory = "512Mi" } }
    }
    scaling { min_instance_count = 0; max_instance_count = 50 }
  }
}`;

const RUST_CODE = `// Pattern: Layered Architecture
// Reference: Fowler PoEAA; Martin, Clean Architecture
// Production note: Arc<RwLock<>> for shared state; thiserror for typed errors; trait objects for ports

use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use std::fmt;
use thiserror::Error;

// ─── Domain Types ─────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct OrderId(pub String);

impl OrderId {
    pub fn generate() -> Self {
        // In production: use uuid crate — uuid::Uuid::new_v4().to_string()
        Self(format!("ord_{}", std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .subsec_nanos()))
    }
}

impl fmt::Display for OrderId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result { write!(f, "{}", self.0) }
}

#[derive(Debug, Clone)]
pub struct OrderItem {
    pub product_id:  String,
    pub quantity:    u32,
    pub price_cents: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum OrderStatus { Pending, Confirmed, Cancelled }

#[derive(Debug, Clone)]
pub struct Order {
    pub id:              OrderId,
    pub user_id:         String,
    pub items:           Vec<OrderItem>,
    pub status:          OrderStatus,
    pub idempotency_key: Option<String>,
}

#[derive(Debug, Clone)]
pub struct CreateOrderCommand {
    pub user_id:         String,
    pub items:           Vec<OrderItem>,
    pub idempotency_key: Option<String>,
}

#[derive(Debug, Clone)]
pub struct OrderEvent {
    pub event_type: String,
    pub order_id:   OrderId,
    pub user_id:    String,
}

// ─── Domain Errors ────────────────────────────────────────────────────────

#[derive(Debug, Error)]
pub enum ServiceError {
    #[error("invalid order: {0}")]
    InvalidInput(String),
    #[error("order not found: {0}")]
    NotFound(String),
    #[error("repository error: {0}")]
    Repository(String),
    #[error("duplicate operation — idempotency key already processed")]
    Duplicate,
}

// ─── Ports — traits defined here, in the service module ──────────────────
// Implementations live in the infrastructure module and depend on this module.
// The trait objects (dyn) allow injection of in-memory or real implementations.

pub trait OrderRepository: Send + Sync {
    fn save(&self, order: &Order) -> Result<(), ServiceError>;
    fn find_by_id(&self, id: &OrderId) -> Result<Order, ServiceError>;
    fn find_by_idempotency_key(&self, key: &str) -> Result<Option<Order>, ServiceError>;
}

pub trait EventPublisher: Send + Sync {
    fn publish(&self, event: &OrderEvent) -> Result<(), ServiceError>;
}

// ─── Service Layer ────────────────────────────────────────────────────────

pub struct OrderService {
    repo:      Arc<dyn OrderRepository>,
    publisher: Arc<dyn EventPublisher>,
}

impl OrderService {
    pub fn new(repo: Arc<dyn OrderRepository>, publisher: Arc<dyn EventPublisher>) -> Self {
        Self { repo, publisher }
    }

    /// Protocol-agnostic: called by the HTTP handler AND the Kafka consumer.
    /// No transport types (Request, Message) leak into this method.
    pub fn create_order(&self, cmd: CreateOrderCommand) -> Result<Order, ServiceError> {
        if cmd.items.is_empty() {
            return Err(ServiceError::InvalidInput("order must have at least one item".into()));
        }

        // Idempotency — identical code path for HTTP and event-driven callers.
        if let Some(ref key) = cmd.idempotency_key {
            if let Some(existing) = self.repo.find_by_idempotency_key(key)? {
                return Ok(existing);
            }
        }

        let order = Order {
            id:              OrderId::generate(),
            user_id:         cmd.user_id.clone(),
            items:           cmd.items,
            status:          OrderStatus::Pending,
            idempotency_key: cmd.idempotency_key,
        };

        self.repo.save(&order)?;

        // In production: write event to outbox table in the same DB transaction.
        let event = OrderEvent {
            event_type: "OrderCreated".into(),
            order_id:   order.id.clone(),
            user_id:    order.user_id.clone(),
        };
        if let Err(e) = self.publisher.publish(&event) {
            // Non-fatal: outbox relay handles retry
            eprintln!("warn: event publish failed, outbox will retry: {}", e);
        }

        Ok(order)
    }

    pub fn get_order(&self, id: &OrderId) -> Result<Order, ServiceError> {
        self.repo.find_by_id(id)
    }
}

// ─── Infrastructure: In-Memory Repository ─────────────────────────────────

#[derive(Default)]
pub struct InMemoryOrderRepository {
    by_id:  RwLock<HashMap<String, Order>>,
    by_key: RwLock<HashMap<String, Order>>,
}

impl OrderRepository for InMemoryOrderRepository {
    fn save(&self, order: &Order) -> Result<(), ServiceError> {
        let mut by_id = self.by_id.write()
            .map_err(|e| ServiceError::Repository(e.to_string()))?;
        by_id.insert(order.id.0.clone(), order.clone());

        if let Some(ref key) = order.idempotency_key {
            let mut by_key = self.by_key.write()
                .map_err(|e| ServiceError::Repository(e.to_string()))?;
            by_key.insert(key.clone(), order.clone());
        }
        Ok(())
    }

    fn find_by_id(&self, id: &OrderId) -> Result<Order, ServiceError> {
        let by_id = self.by_id.read()
            .map_err(|e| ServiceError::Repository(e.to_string()))?;
        by_id.get(&id.0)
            .cloned()
            .ok_or_else(|| ServiceError::NotFound(id.0.clone()))
    }

    fn find_by_idempotency_key(&self, key: &str) -> Result<Option<Order>, ServiceError> {
        let by_key = self.by_key.read()
            .map_err(|e| ServiceError::Repository(e.to_string()))?;
        Ok(by_key.get(key).cloned())
    }
}

// ─── Infrastructure: Log Event Publisher ─────────────────────────────────

pub struct LogEventPublisher;

impl EventPublisher for LogEventPublisher {
    fn publish(&self, event: &OrderEvent) -> Result<(), ServiceError> {
        println!("[event] type={} order={} user={}",
            event.event_type, event.order_id, event.user_id);
        Ok(())
    }
}

// ─── Transport A: HTTP Handler ────────────────────────────────────────────
// Knows about HTTP. Knows nothing about message brokers. Calls the same service.

pub struct HttpTransport {
    svc: Arc<OrderService>,
}

impl HttpTransport {
    pub fn new(svc: Arc<OrderService>) -> Self { Self { svc } }

    pub fn handle_create(&self, user_id: &str, idempotency_key: Option<&str>) {
        let cmd = CreateOrderCommand {
            user_id:         user_id.to_string(),
            items:           vec![OrderItem { product_id: "prod_1".into(), quantity: 2, price_cents: 1999 }],
            idempotency_key: idempotency_key.map(str::to_string),
        };
        match self.svc.create_order(cmd) {
            Ok(order)  => println!("[http] 201 order={}", order.id),
            Err(ServiceError::InvalidInput(msg)) => println!("[http] 422 {}", msg),
            Err(e)     => println!("[http] 500 {}", e),
        }
    }
}

// ─── Transport B: Message Consumer ───────────────────────────────────────
// Knows about the broker envelope. Knows nothing about HTTP. Same service.

pub struct MessagePayload {
    pub user_id:         String,
    pub items:           Vec<OrderItem>,
    pub idempotency_key: String,
}

pub struct KafkaTransport {
    svc: Arc<OrderService>,
}

impl KafkaTransport {
    pub fn new(svc: Arc<OrderService>) -> Self { Self { svc } }

    pub fn handle_message(&self, payload: MessagePayload) {
        let cmd = CreateOrderCommand {
            user_id:         payload.user_id,
            items:           payload.items,
            idempotency_key: Some(payload.idempotency_key),
        };
        match self.svc.create_order(cmd) {
            Ok(order) => println!("[kafka] ack  order={}", order.id),
            Err(e)    => println!("[kafka] nack → requeue: {}", e),
        }
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────

fn main() {
    let repo      = Arc::new(InMemoryOrderRepository::default());
    let publisher = Arc::new(LogEventPublisher);
    let svc       = Arc::new(OrderService::new(repo, publisher));

    println!("=== HTTP Transport ===");
    let http = HttpTransport::new(Arc::clone(&svc));
    http.handle_create("user_42", Some("idemp_abc"));
    http.handle_create("user_42", Some("idemp_abc")); // duplicate → idempotent

    println!("\n=== Kafka Consumer Transport ===");
    let kafka = KafkaTransport::new(Arc::clone(&svc));
    let msg = MessagePayload {
        user_id:         "user_99".into(),
        items:           vec![OrderItem { product_id: "prod_5".into(), quantity: 1, price_cents: 4999 }],
        idempotency_key: "kafka_7f3a".into(),
    };
    kafka.handle_message(msg);
    // Simulate redelivery — idempotency key prevents double-processing
    let msg2 = MessagePayload {
        user_id:         "user_99".into(),
        items:           vec![OrderItem { product_id: "prod_5".into(), quantity: 1, price_cents: 4999 }],
        idempotency_key: "kafka_7f3a".into(),
    };
    kafka.handle_message(msg2); // redelivered → safe
}

// Cargo.toml dependencies:
// thiserror = "1"
// (uuid = { version = "1", features = ["v4"] } — for production OrderId::generate)`;

const CORE_LANGS = [
  { key:"go",   label:"Go",        code:GO_CODE,     file:"internal/service/orders.go" },
  { key:"py",   label:"Python",    code:PYTHON_CODE, file:"orders/service.py" },
  { key:"ts",   label:"TypeScript",code:TS_CODE,     file:"src/orders/service.ts" },
  { key:"rust", label:"Rust",      code:RUST_CODE,   file:"src/main.rs" },
  { key:"java", label:"Java 21",   code:JAVA_CODE,   file:"src/main/java/.../Main.java" },
];

const AWS_SUBTABS  = [
  { key:"cdk",    label:"CDK (TS)", code:AWS_CDK_CODE, file:"infrastructure/cdk/order-service-stack.ts" },
  { key:"sdk-go", label:"SDK (Go)", code:AWS_SDK_CODE, file:"adapters/sqs/consumer.go" },
];
const AZURE_SUBTABS = [{ key:"bicep", label:"Bicep", code:AZURE_CODE, file:"infrastructure/bicep/order-service.bicep" }];
const GCP_SUBTABS   = [{ key:"tf",    label:"Terraform", code:GCP_CODE, file:"infrastructure/terraform/order-service/main.tf" }];

function ImplTab() {
  const [coreLang, setCoreLang] = useState("go");
  const [cloud,    setCloud]    = useState("aws");
  const [awsSub,   setAwsSub]   = useState("cdk");
  const [azureSub, setAzureSub] = useState("bicep");
  const [gcpSub,   setGcpSub]   = useState("tf");

  const coreItem  = CORE_LANGS.find(l=>l.key===coreLang);
  const awsItem   = AWS_SUBTABS.find(t=>t.key===awsSub);
  const azureItem = AZURE_SUBTABS.find(t=>t.key===azureSub);
  const gcpItem   = GCP_SUBTABS.find(t=>t.key===gcpSub);

  return (
    <div>
      <SectionLabel>3a — Core (No Cloud Dependencies)</SectionLabel>
      <SubTabs options={CORE_LANGS.map(l=>({key:l.key,label:l.label}))} value={coreLang} onChange={setCoreLang}/>
      <CodeBlock code={coreItem.code} filename={coreItem.file}/>

      <div style={{ marginTop:32 }}>
        <SectionLabel>3b / 3c / 3d — Cloud IaC + SDK Reference</SectionLabel>
        <div style={{ background:`${C.amber}10`, border:`1px solid ${C.amber}33`, borderRadius:6, padding:"8px 14px", marginBottom:16, fontSize:11, color:C.amber }}>
          Reference code only — copy into your IDE / terminal. Not executable in this sandbox.
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[{key:"aws",color:C.aws},{key:"azure",color:C.azure},{key:"gcp",color:C.gcp}].map(({key,color})=>(
            <button key={key} onClick={()=>setCloud(key)} style={{ padding:"6px 18px", borderRadius:6, border:`1px solid ${cloud===key?color:C.border}`, background:cloud===key?color+"22":C.surface, color:cloud===key?color:C.muted, cursor:"pointer", fontSize:12, fontWeight:cloud===key?700:400, letterSpacing:"0.04em", textTransform:"uppercase", transition:"all .15s" }}>{key}</button>
          ))}
        </div>
        {cloud==="aws" && (
          <>
            <SubTabs options={AWS_SUBTABS.map(t=>({key:t.key,label:t.label}))} value={awsSub} onChange={setAwsSub} brandColor={C.aws}/>
            <CodeBlock code={awsItem.code} filename={awsItem.file}/>
          </>
        )}
        {cloud==="azure" && (
          <>
            <SubTabs options={AZURE_SUBTABS.map(t=>({key:t.key,label:t.label}))} value={azureSub} onChange={setAzureSub} brandColor={C.azure}/>
            <CodeBlock code={azureItem.code} filename={azureItem.file}/>
          </>
        )}
        {cloud==="gcp" && (
          <>
            <SubTabs options={GCP_SUBTABS.map(t=>({key:t.key,label:t.label}))} value={gcpSub} onChange={setGcpSub} brandColor={C.gcp}/>
            <CodeBlock code={gcpItem.code} filename={gcpItem.file}/>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB 4 — LEADERSHIP
// ═══════════════════════════════════════════════

function LeadershipTab() {
  const sections = [
    { title:"Explain to your team", color:C.blue,
      prose:"Layered architecture divides code into strata — Transport, Service, Repository — where each layer has one job and dependencies only flow inward. The Transport layer is the only layer that knows about HTTP or Kafka; the Service layer holds all business logic and never imports a protocol package; the Repository layer abstracts data storage behind an interface the service layer owns. The payoff is surgical testability and the ability to add event-driven delivery alongside your existing HTTP API without touching a single line of domain logic." },
    { title:"Justify in architecture review", color:C.green,
      prose:"The Dependency Rule is the strongest argument: by keeping infrastructure concerns at the edges, we can test the entire domain model with zero external dependencies — no database, no broker, no HTTP server — which gives us fast CI and high confidence. The transport-agnostic service layer directly satisfies the requirement to support both synchronous REST and asynchronous event consumption without duplicating business logic, a significant maintainability advantage as we add more delivery mechanisms over time." },
    { title:"Failure modes & observability", color:C.red, items:[
      "Layer bleeding — SQL in handlers, or HTTP calls in service structs. Detect with static analysis: lint for DB driver imports in non-infrastructure packages. Enforce with Go module boundaries or Java module-info.",
      "Anemic service layer — service methods that are pure pass-throughs with no logic (CreateUser → repo.Create). Symptom: 1:1 mapping between service and repository methods. Signals missing domain modelling.",
      "Missing idempotency on event consumers — duplicate state on message redelivery. Alert: unexpected duplicate key errors in DB; set alert on duplicate-key error rate > 0.",
      "Dual-write race — event published but DB write fails (or vice versa). Use Outbox pattern. Alert: divergence between DB record count and published event count over a 5-minute window.",
      "DLQ growth — silent consumer failures. Alert: DLQ message count > 0 for > 5 min → P2. DLQ count > 100 → P1.",
      "Visibility timeout too short — consumer processing time exceeds SQS/Service Bus lock duration; message becomes visible again and is processed twice. Set visibilityTimeout to 6× average processing time.",
    ]},
    { title:"Scale implications", color:C.amber, items:[
      "At 10x: layered model scales naturally — add service instances. Each layer is stateless (state in DB/cache), horizontal scaling requires no architectural change.",
      "At 100x: if the service layer becomes a bottleneck across all use-cases in a single process, consider splitting by domain subdomain, or introduce CQRS to separately scale read and write paths.",
      "Event consumer lag: if Kafka/SQS consumer group lag grows, scale the Transport layer (add consumer instances) independently — service and repository layers require no change.",
      "Repository latency dominates: if DB calls consume > 50% of request time, introduce a caching layer between service and repository — still within the layered model.",
      "When to revisit: if you have > 5 distinct delivery mechanisms for the same service, consider Hexagonal Architecture (Ports & Adapters) as a more explicit formalisation of the same principles.",
    ]},
    { title:"Code review checklist", color:C.purple, items:[
      "Does the HTTP handler contain any business conditionals or domain rules? → Move to service layer.",
      "Does the service layer import net/http, kafka-go, grpc, or any transport package? → Dependency violation, reject.",
      "Is the repository interface defined in the service/domain package, not the infrastructure package?",
      "Do service methods express business intent (RegisterUser, FulfillOrder) rather than CRUD (InsertUser, UpdateOrder)?",
      "Is there an idempotency check in every service method that will be called by an event consumer?",
      "Are domain errors returned as typed values? Are HTTP status codes mapped only in the transport layer?",
      "Does event publishing use the Outbox pattern, or is there a bare dual-write?",
      "Can the service layer be instantiated in a unit test with an in-memory repository and no external dependencies?",
    ]},
    { title:"Questions for design review", color:C.cyan, items:[
      "Where is the repository interface defined — service package or infrastructure package? (Must be: service package.)",
      "If we add gRPC next quarter, which files change? (Correct answer: only the transport layer.)",
      "If we add a Kafka consumer alongside the existing HTTP API, which files change? (Correct answer: one new Transport adapter, nothing else.)",
      "How does the Kafka consumer handle a redelivered message? Show me the idempotency check in the service layer.",
      "What happens if the DB write succeeds but the broker publish fails? Is there an Outbox, or a bare dual-write?",
      "How do we unit-test the service layer without a running database? (Answer: inject an in-memory repository.)",
      "Are there any domain types defined inside the transport or infrastructure package? (There should not be.)",
    ]},
  ];

  return (
    <div>
      {sections.map(({title,color,prose,items})=>(
        <Card key={title} accentColor={color} title={title}>
          {prose && <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, margin:0 }}>{prose}</p>}
          {items && <ul style={{ margin:0, paddingLeft:18 }}>{items.map(item=>(
            <li key={item} style={{ color:C.muted, fontSize:12, lineHeight:1.7, marginBottom:5 }}>{item}</li>
          ))}</ul>}
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════

const TABS = [
  { id:"arch",    label:"Architecture" },
  { id:"concepts",label:"Core Concepts" },
  { id:"impl",    label:"Implementations" },
  { id:"lead",    label:"Leadership" },
];

export default function LayeredArchitecture() {
  const [tab, setTab] = useState("arch");
  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.text, fontFamily:"'IBM Plex Sans','Segoe UI',ui-sans-serif,system-ui,sans-serif" }}>
      <div style={{ borderBottom:`1px solid ${C.border}`, padding:"22px 32px 0" }}>
        <div style={{ maxWidth:980, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
            <h1 style={{ margin:0, fontSize:22, fontWeight:600, color:C.text, letterSpacing:"-0.01em" }}>Layered Architecture</h1>
            <Badge color={C.blue}>Infrastructure Pattern</Badge>
          </div>
          <p style={{ color:C.muted, fontSize:13, margin:"0 0 0 0", lineHeight:1.5 }}>
            Transport → Service → Repository · request/response and event-driven · Fowler, PoEAA · Martin, Clean Architecture
          </p>
          <div style={{ display:"flex", gap:0, marginTop:16 }}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"10px 22px", background:"none", border:"none", borderBottom:`2px solid ${tab===t.id?C.blue:"transparent"}`, color:tab===t.id?C.blue:C.muted, cursor:"pointer", fontSize:13, fontWeight:tab===t.id?600:400, transition:"all .15s" }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:980, margin:"0 auto", padding:"28px 32px 48px" }}>
        {tab==="arch"     && <ArchTab/>}
        {tab==="concepts" && <ConceptsTab/>}
        {tab==="impl"     && <ImplTab/>}
        {tab==="lead"     && <LeadershipTab/>}
      </div>
    </div>
  );
}
