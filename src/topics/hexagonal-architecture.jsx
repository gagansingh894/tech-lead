"use client"

import { useState } from "react";

const colors = {
  bg: "#0f1117",
  surface: "#1a1d24",
  surfaceHover: "#1f2330",
  border: "#2d3139",
  borderLight: "#3a3f4a",
  text: "#e5e7eb",
  textMuted: "#9ca3af",
  textDim: "#6b7280",
  blue: "#3b82f6",
  blueLight: "#60a5fa",
  green: "#10b981",
  greenLight: "#34d399",
  amber: "#f59e0b",
  amberLight: "#fbbf24",
  purple: "#8b5cf6",
  purpleLight: "#a78bfa",
  red: "#ef4444",
  aws: "#ff9900",
  azure: "#0078d4",
  gcp: "#4285f4",
};

// ─── Reusable components ─────────────────────────────────────────────────────

function Tab({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: active ? (color || colors.blue) : "transparent",
        color: active ? "#fff" : colors.textMuted,
        border: "none",
        borderBottom: active ? `2px solid ${color || colors.blue}` : `2px solid transparent`,
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: active ? "600" : "400",
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.04em",
        transition: "all 0.15s",
        borderRadius: "4px 4px 0 0",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function Badge({ children, color }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "11px",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: "600",
      background: (color || colors.blue) + "22",
      color: color || colors.blue,
      border: `1px solid ${(color || colors.blue)}44`,
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
      borderRadius: "8px",
      padding: "20px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{
        padding: "4px 12px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace",
        background: copied ? colors.green + "22" : colors.border,
        color: copied ? colors.green : colors.textMuted,
        border: `1px solid ${copied ? colors.green + "44" : colors.borderLight}`,
        borderRadius: "4px", cursor: "pointer", transition: "all 0.15s",
      }}
    >{copied ? "✓ copied" : "copy"}</button>
  );
}

function CodeBlock({ code, language, filename }) {
  const keywords = {
    go: ["package","import","func","type","interface","struct","return","var","const","if","else","for","range","error","nil","true","false","defer","go","chan","select","case","default","break","continue","string","int","bool","context","Context","error"],
    python: ["def","class","import","from","return","if","else","elif","for","in","with","as","raise","try","except","finally","None","True","False","self","async","await","yield","pass","and","or","not","is","lambda","dataclass","Protocol","Optional","List","Dict"],
    typescript: ["const","let","var","function","class","interface","type","return","if","else","for","while","import","export","default","async","await","new","this","extends","implements","readonly","string","number","boolean","void","null","undefined","Promise","throw","try","catch","finally"],
    rust: ["fn","let","mut","pub","use","mod","struct","enum","impl","trait","return","if","else","for","while","match","Some","None","Ok","Err","Result","Option","async","await","move","ref","Box","Arc","Vec","String","bool","i32","u64","usize","where","type","self","Self"],
    java: ["public","private","protected","class","interface","extends","implements","return","if","else","for","while","new","void","static","final","try","catch","throw","throws","import","package","this","super","null","true","false","String","int","boolean","List","Map","Optional","record","sealed","permits"],
  };
  const kw = keywords[language] || [];
  const lines = code.split("\n");

  const highlight = (line) => {
    const commentMatch = line.match(/^(\s*)(\/\/.*|#.*)$/);
    if (commentMatch) {
      return <><span>{commentMatch[1]}</span><span style={{ color: colors.textDim }}>{commentMatch[2]}</span></>;
    }
    const parts = line.split(/(\b\w+\b|"[^"]*"|`[^`]*`|'[^']*')/g);
    return parts.map((p, i) => {
      if (kw.includes(p)) return <span key={i} style={{ color: colors.blue }}>{p}</span>;
      if (/^["'`]/.test(p)) return <span key={i} style={{ color: colors.green }}>{p}</span>;
      if (/^\d+$/.test(p)) return <span key={i} style={{ color: colors.amber }}>{p}</span>;
      return <span key={i}>{p}</span>;
    });
  };

  return (
    <div style={{ borderRadius: "8px", border: `1px solid ${colors.border}`, overflow: "hidden" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 14px", background: "#0d1117", borderBottom: `1px solid ${colors.border}`,
      }}>
        <span style={{ fontSize: "11px", color: colors.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{filename}</span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Badge color={colors.textDim}>{language}</Badge>
          <CopyButton text={code} />
        </div>
      </div>
      <pre style={{
        margin: 0, padding: "16px", background: "#161b22",
        fontSize: "12px", lineHeight: "1.7", color: colors.text,
        fontFamily: "'JetBrains Mono', monospace", overflowX: "auto",
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex" }}>
            <span style={{ color: colors.textDim, minWidth: "32px", userSelect: "none", fontSize: "11px" }}>{i + 1}</span>
            <span>{highlight(line)}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

// ─── Tab 1: Architecture ──────────────────────────────────────────────────────

function ArchitectureTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Card>
        <h3 style={{ margin: "0 0 4px 0", color: colors.text, fontSize: "15px", fontWeight: "600" }}>Ports & Adapters Diagram</h3>
        <p style={{ margin: "0 0 16px 0", color: colors.textMuted, fontSize: "13px" }}>
          Alistair Cockburn (2005) — application isolated inside a hexagon; all I/O flows through typed ports
        </p>
        <svg viewBox="0 0 820 520" style={{ width: "100%", maxWidth: "820px", display: "block" }}>
          <defs>
            <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={colors.blue} />
            </marker>
            <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={colors.green} />
            </marker>
            <marker id="arrowAmber" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={colors.amber} />
            </marker>
            <marker id="arrowPurple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={colors.purple} />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── Background ── */}
          <rect width="820" height="520" fill={colors.surface} rx="8" />

          {/* ── Domain Core (inner hex) ── */}
          <polygon
            points="410,130 490,175 490,265 410,310 330,265 330,175"
            fill="#1e1540" stroke={colors.purple} strokeWidth="2" filter="url(#glow)"
          />
          <text x="410" y="210" textAnchor="middle" fill={colors.purpleLight} fontSize="13" fontWeight="600" fontFamily="JetBrains Mono, monospace">Domain</text>
          <text x="410" y="228" textAnchor="middle" fill={colors.purpleLight} fontSize="11" fontFamily="JetBrains Mono, monospace">Entities</text>
          <text x="410" y="244" textAnchor="middle" fill={colors.purpleLight} fontSize="11" fontFamily="JetBrains Mono, monospace">Value Objects</text>
          <text x="410" y="260" textAnchor="middle" fill={colors.purpleLight} fontSize="11" fontFamily="JetBrains Mono, monospace">Domain Events</text>

          {/* ── Application Ring (outer hex) ── */}
          <polygon
            points="410,60 550,135 550,285 410,360 270,285 270,135"
            fill="none" stroke={colors.blue} strokeWidth="1.5" strokeDasharray="6 3" opacity="0.6"
          />
          <text x="410" y="88" textAnchor="middle" fill={colors.blue} fontSize="10" fontFamily="JetBrains Mono, monospace" opacity="0.8">Application Layer (Use Cases)</text>

          {/* ── Driving side labels ── */}
          <text x="120" y="30" fill={colors.blue} fontSize="12" fontWeight="600" fontFamily="JetBrains Mono, monospace">DRIVING SIDE</text>
          <text x="120" y="46" fill={colors.textDim} fontSize="10" fontFamily="JetBrains Mono, monospace">(Primary Actors — initiate)</text>

          {/* ── Driven side labels ── */}
          <text x="590" y="30" fill={colors.green} fontSize="12" fontWeight="600" fontFamily="JetBrains Mono, monospace">DRIVEN SIDE</text>
          <text x="590" y="46" fill={colors.textDim} fontSize="10" fontFamily="JetBrains Mono, monospace">(Secondary Actors — called)</text>

          {/* ── Driving Actors ── */}
          {[
            { y: 110, label: "HTTP Client", sub: "REST / GraphQL" },
            { y: 210, label: "CLI / Batch", sub: "cron / scripts" },
            { y: 310, label: "Test Harness", sub: "unit / integration" },
          ].map(({ y, label, sub }) => (
            <g key={label}>
              <rect x="30" y={y - 20} width="120" height="44" rx="6" fill="#0f1729" stroke={colors.blue} strokeWidth="1.5" />
              <text x="90" y={y} textAnchor="middle" fill={colors.blueLight} fontSize="12" fontWeight="600" fontFamily="JetBrains Mono, monospace">{label}</text>
              <text x="90" y={y + 16} textAnchor="middle" fill={colors.textDim} fontSize="10" fontFamily="JetBrains Mono, monospace">{sub}</text>
            </g>
          ))}

          {/* ── Driving Adapters ── */}
          {[
            { y: 110, label: "HTTP Adapter" },
            { y: 210, label: "CLI Adapter" },
            { y: 310, label: "Test Adapter" },
          ].map(({ y, label }) => (
            <g key={label}>
              <rect x="175" y={y - 18} width="90" height="38" rx="4" fill="#0f1729" stroke={colors.blue} strokeWidth="1" strokeDasharray="4 2" />
              <text x="220" y={y + 3} textAnchor="middle" fill={colors.blue} fontSize="10" fontFamily="JetBrains Mono, monospace">{label}</text>
            </g>
          ))}

          {/* ── Driving Ports (on hex left face) ── */}
          {[
            { y: 130, label: "«port»\nOrderPort" },
            { y: 210, label: "«port»\nCLIPort" },
            { y: 290, label: "«port»\nTestPort" },
          ].map(({ y, label }) => (
            <g key={label}>
              <rect x="262" y={y - 14} width="76" height="30" rx="3" fill="#1a2040" stroke={colors.blue} strokeWidth="1.5" />
              {label.split("\n").map((line, i) => (
                <text key={i} x="300" y={y + (i * 13) - 3} textAnchor="middle" fill={colors.blueLight} fontSize="9.5" fontFamily="JetBrains Mono, monospace">{line}</text>
              ))}
            </g>
          ))}

          {/* ── Driven Ports (on hex right face) ── */}
          {[
            { y: 155, label: "«port»\nRepoPort" },
            { y: 220, label: "«port»\nMsgPort" },
            { y: 285, label: "«port»\nCachePort" },
          ].map(({ y, label }) => (
            <g key={label}>
              <rect x="480" y={y - 14} width="76" height="30" rx="3" fill="#1a2040" stroke={colors.green} strokeWidth="1.5" />
              {label.split("\n").map((line, i) => (
                <text key={i} x="518" y={y + (i * 13) - 3} textAnchor="middle" fill={colors.greenLight} fontSize="9.5" fontFamily="JetBrains Mono, monospace">{line}</text>
              ))}
            </g>
          ))}

          {/* ── Driven Adapters ── */}
          {[
            { y: 155, label: "SQL Adapter" },
            { y: 220, label: "Kafka Adapter" },
            { y: 285, label: "Redis Adapter" },
          ].map(({ y, label }) => (
            <g key={label}>
              <rect x="570" y={y - 18} width="96" height="38" rx="4" fill="#0a1a14" stroke={colors.green} strokeWidth="1" strokeDasharray="4 2" />
              <text x="618" y={y + 3} textAnchor="middle" fill={colors.green} fontSize="10" fontFamily="JetBrains Mono, monospace">{label}</text>
            </g>
          ))}

          {/* ── Driven Actors ── */}
          {[
            { y: 155, label: "PostgreSQL", sub: "persistence" },
            { y: 220, label: "Kafka", sub: "message bus" },
            { y: 285, label: "Redis", sub: "cache" },
          ].map(({ y, label, sub }) => (
            <g key={label}>
              <rect x="680" y={y - 22} width="110" height="44" rx="6" fill="#0a1a14" stroke={colors.green} strokeWidth="1.5" />
              <text x="735" y={y} textAnchor="middle" fill={colors.greenLight} fontSize="12" fontWeight="600" fontFamily="JetBrains Mono, monospace">{label}</text>
              <text x="735" y={y + 16} textAnchor="middle" fill={colors.textDim} fontSize="10" fontFamily="JetBrains Mono, monospace">{sub}</text>
            </g>
          ))}

          {/* ── Arrows: Actor → Driving Adapter ── */}
          {[110, 210, 310].map(y => (
            <line key={y} x1="150" y1={y + 2} x2="172" y2={y + 2} stroke={colors.blue} strokeWidth="1.5" markerEnd="url(#arrowBlue)" />
          ))}

          {/* ── Arrows: Driving Adapter → Port ── */}
          {[{ ay: 110, py: 130 }, { ay: 210, py: 210 }, { ay: 310, py: 290 }].map(({ ay, py }) => (
            <line key={ay} x1="265" y1={ay + 2} x2="264" y2={py + 2} stroke={colors.blue} strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrowBlue)" />
          ))}

          {/* ── Arrows: Driven Port → Adapter ── */}
          {[{ py: 155, ay: 155 }, { py: 220, ay: 220 }, { py: 285, ay: 285 }].map(({ py, ay }) => (
            <line key={py} x1="558" y1={py + 2} x2="568" y2={ay + 2} stroke={colors.green} strokeWidth="1.5" markerEnd="url(#arrowGreen)" />
          ))}

          {/* ── Arrows: Adapter → Driven Actor ── */}
          {[155, 220, 285].map(y => (
            <line key={y} x1="667" y1={y + 2} x2="678" y2={y + 2} stroke={colors.green} strokeWidth="1.5" markerEnd="url(#arrowGreen)" />
          ))}

          {/* ── Flow labels ── */}
          <text x="155" y={100} fill={colors.blue} fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.8">Command / Query</text>
          <text x="628" y={138} fill={colors.green} fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.8">DB Call</text>
          <text x="628" y={203} fill={colors.amber} fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.8">Event Publish</text>
          <text x="628" y={268} fill={colors.green} fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.8">Cache R/W</text>

          {/* ── Dependency rule arrow ── */}
          <text x="340" y="410" fill={colors.textDim} fontSize="10" fontFamily="JetBrains Mono, monospace">Dependencies point</text>
          <text x="340" y="425" fill={colors.textDim} fontSize="10" fontFamily="JetBrains Mono, monospace">inward only →</text>
          <line x1="330" y1="418" x2="300" y2="418" stroke={colors.textDim} strokeWidth="1" markerEnd="url(#arrowBlue)" opacity="0.5" />

          {/* ── Legend ── */}
          <rect x="20" y="420" width="260" height="85" rx="6" fill="#0d0f14" stroke={colors.border} strokeWidth="1" />
          <text x="32" y="440" fill={colors.textMuted} fontSize="11" fontWeight="600" fontFamily="JetBrains Mono, monospace">Legend</text>
          {[
            { color: colors.purple, label: "Domain / Core" },
            { color: colors.blue, label: "Driving (inbound) port/adapter" },
            { color: colors.green, label: "Driven (outbound) port/adapter" },
            { color: colors.amber, label: "Async / event flow" },
          ].map(({ color, label }, i) => (
            <g key={i}>
              <rect x="32" y={452 + i * 14} width="10" height="10" rx="2" fill={color + "33"} stroke={color} strokeWidth="1" />
              <text x="48" y={461 + i * 14} fill={colors.textMuted} fontSize="10" fontFamily="JetBrains Mono, monospace">{label}</text>
            </g>
          ))}

          {/* ── "No dep allowed" annotation ── */}
          <text x="540" y="415" fill={colors.red} fontSize="10" fontFamily="JetBrains Mono, monospace" opacity="0.7">✕ outer code must NOT import inner</text>
          <text x="540" y="430" fill={colors.red} fontSize="10" fontFamily="JetBrains Mono, monospace" opacity="0.7">  (only inner defines ports)</text>
        </svg>
      </Card>

      {/* Cloud Mapping */}
      <Card>
        <h3 style={{ margin: "0 0 16px 0", color: colors.text, fontSize: "15px", fontWeight: "600" }}>Cloud Provider Mapping</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr>
                {["Component", "AWS", "Azure", "GCP"].map((h, i) => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left", borderBottom: `1px solid ${colors.border}`,
                    color: i === 0 ? colors.textMuted : [colors.aws, colors.azure, colors.gcp][i - 1],
                    fontWeight: "600", fontSize: "11px", letterSpacing: "0.05em",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { component: "Driving Adapter (HTTP)", aws: "API Gateway + Lambda", azure: "API Management + Functions", gcp: "Cloud Endpoints + Cloud Run" },
                { component: "Driving Adapter (Async)", aws: "SQS consumer / EventBridge pipe", azure: "Service Bus trigger", gcp: "Pub/Sub push subscription" },
                { component: "Driving Adapter (Batch)", aws: "Step Functions / ECS Task", azure: "Azure Batch / Logic Apps", gcp: "Cloud Workflows / Batch" },
                { component: "Driven Port — Persistence", aws: "DynamoDB, RDS, Aurora", azure: "Cosmos DB, Azure SQL", gcp: "Firestore, Cloud Spanner, AlloyDB" },
                { component: "Driven Port — Messaging", aws: "SNS, SQS, Kinesis, EventBridge", azure: "Service Bus, Event Grid, Event Hubs", gcp: "Pub/Sub, Eventarc" },
                { component: "Driven Port — Cache", aws: "ElastiCache (Redis/Memcached)", azure: "Azure Cache for Redis", gcp: "Memorystore (Redis/Memcached)" },
                { component: "Driven Port — External API", aws: "EventBridge API Destinations", azure: "API Management outbound", gcp: "Apigee / Cloud Endpoints" },
                { component: "Configurator / DI Wiring", aws: "CDK App or Lambda init code", azure: "Function startup / Bicep", gcp: "main.go / Cloud Run entrypoint" },
                { component: "Test Adapter (in-memory)", aws: "LocalStack (community)", azure: "Azurite (local emulator)", gcp: "Firebase Emulator Suite" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : colors.surface + "88" }}>
                  <td style={{ padding: "10px 14px", color: colors.text, borderBottom: `1px solid ${colors.border}22` }}>{row.component}</td>
                  <td style={{ padding: "10px 14px", color: colors.aws, borderBottom: `1px solid ${colors.border}22` }}>{row.aws}</td>
                  <td style={{ padding: "10px 14px", color: colors.azure, borderBottom: `1px solid ${colors.border}22` }}>{row.azure}</td>
                  <td style={{ padding: "10px 14px", color: colors.gcp, borderBottom: `1px solid ${colors.border}22` }}>{row.gcp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: "12px 0 0 0", fontSize: "11px", color: colors.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
          Note: The configurator (DI wiring) has no managed-service equivalent — it is always application code that assembles ports and adapters at startup.
        </p>
      </Card>
    </div>
  );
}

// ─── Tab 2: Core Concepts ────────────────────────────────────────────────────

function ConceptCard({ term, source, definition, why, mistake, accent }) {
  return (
    <Card style={{ borderLeft: `3px solid ${accent || colors.blue}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <span style={{ color: colors.text, fontSize: "14px", fontWeight: "600" }}>{term}</span>
        {source && <Badge color={colors.textDim}>{source}</Badge>}
      </div>
      <p style={{ margin: "0 0 10px 0", color: colors.textMuted, fontSize: "13px", lineHeight: "1.6" }}>{definition}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ fontSize: "12px" }}>
          <span style={{ color: colors.green, fontWeight: "600" }}>Why it matters: </span>
          <span style={{ color: colors.textMuted }}>{why}</span>
        </div>
        <div style={{ fontSize: "12px" }}>
          <span style={{ color: colors.red, fontWeight: "600" }}>Common mistake: </span>
          <span style={{ color: colors.textMuted }}>{mistake}</span>
        </div>
      </div>
    </Card>
  );
}

function ConceptsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ConceptCard
        term="Port"
        source="Cockburn 2005"
        accent={colors.blue}
        definition="A technology-agnostic interface that defines a purposeful conversation between the application and an external actor. It is owned and defined by the application core — never by the adapter."
        why="Ports enforce the Dependency Inversion Principle at the architectural boundary. The domain dictates what it needs, not how it is implemented. Swapping from PostgreSQL to DynamoDB requires only a new adapter, not touching domain code."
        mistake="Expressing a port in infrastructure terms (e.g., an interface whose method returns sql.Row). This satisfies the structural rule but violates the intent — the core now depends implicitly on SQL semantics."
      />
      <ConceptCard
        term="Adapter"
        source="Cockburn 2005"
        accent={colors.green}
        definition="The translation layer between an external technology and a port. Adapters live outside the hexagon. A driving (primary) adapter calls into the application via a port; a driven (secondary) adapter is called by the application to fulfill a port contract."
        why="Adapters contain all infrastructure concerns: ORM mappings, serialization, HTTP parsing, SDK calls. Keeping them external means domain tests never need a running database or message broker."
        mistake="Putting business logic inside an adapter. A common example is performing validation or calculations inside a REST controller before calling the use case. That logic becomes untestable without HTTP."
      />
      <ConceptCard
        term="Driving vs. Driven"
        source="Cockburn 2005"
        accent={colors.amber}
        definition="Driving (primary) actors initiate conversations — HTTP clients, CLIs, test suites. Driven (secondary) actors are called by the application — databases, message brokers, external APIs. The distinction determines the direction of the port interface definition."
        why="Driving ports are implemented by the application; driven ports are implemented by adapters. Confusing the two leads to inside-out architectures where the domain imports infrastructure types."
        mistake="Treating the driving/driven distinction as optional. If the application directly imports a database library instead of calling through a driven port, testability collapses and the entire value proposition of the pattern is lost."
      />
      <ConceptCard
        term="Configurator"
        source="Cockburn 2005 / Garrido de Paz 2024"
        accent={colors.purple}
        definition="The component that selects and assembles concrete adapters into ports at startup. It is outside both the hexagon and all adapters. In practice this is often a DI container, main.go, or application entrypoint."
        why="The configurator is the only place that knows both the application core and the concrete technology choices. It enables switching from a real database to an in-memory mock without modifying any domain code."
        mistake="Embedding configurator logic inside the application core, or inside adapters. If an adapter directly instantiates another adapter, the wiring becomes hidden and untestable."
      />
      <ConceptCard
        term="Clean Architecture (Martin)"
        source="Robert C. Martin, 2012"
        accent={colors.purple}
        definition="A refinement of hexagonal architecture that adds explicit concentric rings: Entities → Use Cases → Interface Adapters → Frameworks & Drivers. The Dependency Rule states that source code dependencies must point only inward."
        why="Clean Architecture provides more granularity for larger systems. Use Cases become explicit objects, preventing logic from pooling in either domain entities or framework controllers."
        mistake="Treating Clean Architecture and Hexagonal Architecture as the same thing. Hexagonal defines the port/adapter boundary. Clean Architecture subdivides the interior into further concentric layers. They are compatible and often used together."
      />
      <ConceptCard
        term="Onion Architecture (Palermo)"
        source="Jeffrey Palermo, 2008"
        accent={colors.amber}
        definition="A related pattern where the domain model sits at the center, surrounded by domain services, then application services, then the infrastructure shell. Like Hexagonal, all dependencies point inward, and the infrastructure layer implements interfaces defined by inner layers."
        why="Onion Architecture emphasizes that the infrastructure layer wraps the application, rather than layering below it. This corrects the conceptual error of 'the database is at the bottom' in traditional N-tier thinking."
        mistake="Conflating Onion with layered (N-tier) architecture. In N-tier, the database layer is foundational. In Onion, the domain is foundational — infrastructure is a plugin."
      />
      <ConceptCard
        term="Dependency Inversion Principle"
        source="Robert C. Martin — SOLID"
        accent={colors.red}
        definition="High-level modules must not depend on low-level modules; both should depend on abstractions. Abstractions must not depend on details; details depend on abstractions. This is the theoretical foundation all three architectural patterns share."
        why="Without DIP, changing a database driver breaks domain code. With DIP, the domain defines an interface (port); the adapter (detail) depends on that interface. The dependency arrow is inverted at the boundary."
        mistake="Believing that using a DI framework automatically achieves DIP. A DI framework can inject dependencies, but if the interface is defined by the infrastructure module rather than the application module, the dependency direction is still wrong."
      />

      {/* Trade-offs */}
      <Card style={{ borderTop: `2px solid ${colors.border}` }}>
        <h3 style={{ margin: "0 0 16px 0", color: colors.text, fontSize: "14px", fontWeight: "600" }}>Trade-offs</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <div style={{ color: colors.green, fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>✓ Use When</div>
            {[
              "Business logic must outlive technology choices (multi-year systems)",
              "Multiple input channels: HTTP, CLI, queues, batch, tests — all need to drive the same core",
              "Domain requires high unit test coverage without infrastructure dependencies",
              "Team follows DDD: ports map naturally to domain service interfaces",
              "Planning to swap infrastructure components (e.g., Postgres → Aurora, Redis → DynamoDB TTL)",
            ].map((t, i) => <div key={i} style={{ color: colors.textMuted, fontSize: "12px", marginBottom: "6px", paddingLeft: "8px", borderLeft: `2px solid ${colors.green}33` }}>{t}</div>)}
          </div>
          <div>
            <div style={{ color: colors.red, fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>✗ Avoid When</div>
            {[
              "Simple CRUD services with no meaningful business logic — adapter overhead without benefit",
              "Short-lived prototypes or MVPs where velocity outweighs architectural purity",
              "Team unfamiliar with dependency inversion — misapplied hexagonal is worse than N-tier",
              "Performance-critical hot paths where interface dispatch overhead matters (rare but real in Go/Rust)",
              "Very small services where the number of adapters equals the number of domain files",
            ].map((t, i) => <div key={i} style={{ color: colors.textMuted, fontSize: "12px", marginBottom: "6px", paddingLeft: "8px", borderLeft: `2px solid ${colors.red}33` }}>{t}</div>)}
          </div>
        </div>
      </Card>

      {/* Real-world examples */}
      <Card>
        <h3 style={{ margin: "0 0 12px 0", color: colors.text, fontSize: "14px", fontWeight: "600" }}>Real-world Usage</h3>
        {[
          { org: "Netflix", detail: "Uses hexagonal-style boundaries to isolate streaming domain logic from infrastructure (CDN, DRM, encoding pipelines) — documented in Netflix Tech Blog series on resilience architecture.", color: colors.red },
          { org: "Amazon (AWS Prescriptive Guidance)", detail: "Officially recommends hexagonal architecture for Lambda functions requiring DynamoDB integration, citing testability and swappable adapters as primary benefits.", color: colors.aws },
          { org: "Spring Framework (Java)", detail: "The @Port / @Adapter pattern is commonly applied in Spring Boot projects; spring-modulith formalises module boundaries aligned with hexagonal principles.", color: colors.green },
          { org: "Go community", detail: "Prominent Go projects (e.g., Grafana, HashiCorp Vault) use interface-based port patterns extensively, though without always using the hexagonal nomenclature.", color: colors.blue },
        ].map(({ org, detail, color }, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", paddingBottom: "12px", borderBottom: i < 3 ? `1px solid ${colors.border}22` : "none" }}>
            <Badge color={color}>{org}</Badge>
            <span style={{ color: colors.textMuted, fontSize: "12px", lineHeight: "1.6" }}>{detail}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Tab 3: Implementations ──────────────────────────────────────────────────

const goCode = `// Pattern: Hexagonal Architecture (Ports & Adapters)
// Reference: Cockburn (2005), "Hexagonal Architecture Explained" (2024)
// Production note: Ports are interfaces defined in the domain package — never in infrastructure.

package main

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"
)

// ─── Domain ───────────────────────────────────────────────────────────────────

type OrderID string
type Money int64 // cents

type Order struct {
	ID        OrderID
	ProductID string
	Quantity  int
	Total     Money
	CreatedAt time.Time
}

var ErrOrderNotFound = errors.New("order not found")
var ErrInvalidQuantity = errors.New("quantity must be positive")

// ─── Driven Ports (defined by domain; implemented by adapters) ────────────────

type OrderRepository interface {
	Save(ctx context.Context, order Order) error
	FindByID(ctx context.Context, id OrderID) (Order, error)
}

type EventPublisher interface {
	Publish(ctx context.Context, event string, payload any) error
}

// ─── Application Use Cases (driving port) ─────────────────────────────────────

type PlaceOrderCommand struct {
	ProductID string
	Quantity  int
	UnitPrice Money
}

type OrderService struct {
	repo      OrderRepository
	publisher EventPublisher
}

func NewOrderService(repo OrderRepository, pub EventPublisher) *OrderService {
	return &OrderService{repo: repo, publisher: pub}
}

func (s *OrderService) PlaceOrder(ctx context.Context, cmd PlaceOrderCommand) (Order, error) {
	if cmd.Quantity <= 0 {
		return Order{}, ErrInvalidQuantity
	}

	order := Order{
		ID:        OrderID(fmt.Sprintf("ord-%d", time.Now().UnixNano())),
		ProductID: cmd.ProductID,
		Quantity:  cmd.Quantity,
		Total:     cmd.UnitPrice * Money(cmd.Quantity),
		CreatedAt: time.Now(),
	}

	if err := s.repo.Save(ctx, order); err != nil {
		return Order{}, fmt.Errorf("saving order: %w", err)
	}

	if err := s.publisher.Publish(ctx, "order.placed", order); err != nil {
		// Log but do not fail — publishing is best-effort in this model.
		// In production: use outbox pattern for guaranteed delivery.
		fmt.Printf("warn: failed to publish order.placed: %v\\n", err)
	}

	return order, nil
}

func (s *OrderService) GetOrder(ctx context.Context, id OrderID) (Order, error) {
	return s.repo.FindByID(ctx, id)
}

// ─── Driven Adapters (implement driven ports) ─────────────────────────────────

// InMemoryOrderRepository — used in tests and local dev.
type InMemoryOrderRepository struct {
	mu     sync.RWMutex
	orders map[OrderID]Order
}

func NewInMemoryOrderRepository() *InMemoryOrderRepository {
	return &InMemoryOrderRepository{orders: make(map[OrderID]Order)}
}

func (r *InMemoryOrderRepository) Save(_ context.Context, order Order) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.orders[order.ID] = order
	return nil
}

func (r *InMemoryOrderRepository) FindByID(_ context.Context, id OrderID) (Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	order, ok := r.orders[id]
	if !ok {
		return Order{}, ErrOrderNotFound
	}
	return order, nil
}

// NoOpEventPublisher — used in tests.
type NoOpEventPublisher struct{}

func (p *NoOpEventPublisher) Publish(_ context.Context, _ string, _ any) error { return nil }

// ─── Driving Adapter (e.g. CLI; HTTP adapter would parse r *http.Request) ─────

type CLIAdapter struct {
	service *OrderService
}

func NewCLIAdapter(svc *OrderService) *CLIAdapter {
	return &CLIAdapter{service: svc}
}

func (a *CLIAdapter) Run(ctx context.Context) {
	// Simulate a CLI invocation.
	order, err := a.service.PlaceOrder(ctx, PlaceOrderCommand{
		ProductID: "widget-42",
		Quantity:  3,
		UnitPrice: 1999,
	})
	if err != nil {
		fmt.Printf("error: %v\\n", err)
		return
	}
	fmt.Printf("Order placed: id=%s total=%d cents\\n", order.ID, order.Total)

	fetched, err := a.service.GetOrder(ctx, order.ID)
	if err != nil {
		fmt.Printf("error fetching: %v\\n", err)
		return
	}
	fmt.Printf("Fetched: %+v\\n", fetched)
}

// ─── Configurator (assembles the hexagon) ─────────────────────────────────────

func main() {
	// Swap InMemoryOrderRepository → SQLOrderRepository here without touching domain.
	repo := NewInMemoryOrderRepository()
	pub := &NoOpEventPublisher{}
	svc := NewOrderService(repo, pub)
	cli := NewCLIAdapter(svc)
	cli.Run(context.Background())
}`;

const pythonCode = `# Pattern: Hexagonal Architecture (Ports & Adapters)
# Reference: Cockburn (2005); DIP from SOLID
# Production note: Use Protocol for structural typing — no ABC inheritance required.

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime
from typing import Protocol, runtime_checkable
from decimal import Decimal


# ─── Domain ──────────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class OrderID:
    value: str

    @classmethod
    def generate(cls) -> "OrderID":
        return cls(value=str(uuid.uuid4()))


@dataclass(frozen=True)
class Money:
    cents: int

    def __add__(self, other: "Money") -> "Money":
        return Money(self.cents + other.cents)

    def __mul__(self, quantity: int) -> "Money":
        return Money(self.cents * quantity)


@dataclass(frozen=True)
class Order:
    id: OrderID
    product_id: str
    quantity: int
    total: Money
    created_at: datetime


class OrderNotFoundError(Exception):
    pass


class InvalidQuantityError(Exception):
    pass


# ─── Driven Ports (Protocols) ─────────────────────────────────────────────────

@runtime_checkable
class OrderRepository(Protocol):
    def save(self, order: Order) -> None: ...
    def find_by_id(self, order_id: OrderID) -> Order: ...  # raises OrderNotFoundError


@runtime_checkable
class EventPublisher(Protocol):
    def publish(self, event_name: str, payload: object) -> None: ...


# ─── Application Use Cases (driving port) ─────────────────────────────────────

@dataclass(frozen=True)
class PlaceOrderCommand:
    product_id: str
    quantity: int
    unit_price: Money


class OrderService:
    def __init__(self, repo: OrderRepository, publisher: EventPublisher) -> None:
        self._repo = repo
        self._publisher = publisher

    def place_order(self, cmd: PlaceOrderCommand) -> Order:
        if cmd.quantity <= 0:
            raise InvalidQuantityError(f"quantity must be positive, got {cmd.quantity}")

        order = Order(
            id=OrderID.generate(),
            product_id=cmd.product_id,
            quantity=cmd.quantity,
            total=cmd.unit_price * cmd.quantity,
            created_at=datetime.utcnow(),
        )

        self._repo.save(order)

        try:
            self._publisher.publish("order.placed", {"order_id": order.id.value})
        except Exception as exc:
            # Best-effort publish; use outbox pattern for guaranteed delivery.
            print(f"warn: failed to publish order.placed: {exc}")

        return order

    def get_order(self, order_id: OrderID) -> Order:
        return self._repo.find_by_id(order_id)


# ─── Driven Adapters ─────────────────────────────────────────────────────────

class InMemoryOrderRepository:
    """Test/dev adapter — satisfies OrderRepository protocol structurally."""

    def __init__(self) -> None:
        self._store: dict[str, Order] = {}

    def save(self, order: Order) -> None:
        self._store[order.id.value] = order

    def find_by_id(self, order_id: OrderID) -> Order:
        try:
            return self._store[order_id.value]
        except KeyError:
            raise OrderNotFoundError(f"order {order_id.value!r} not found")


class NoOpEventPublisher:
    """Null adapter — discards all events (useful in unit tests)."""

    def publish(self, event_name: str, payload: object) -> None:
        pass  # no-op


# ─── Driving Adapter (CLI) ────────────────────────────────────────────────────

class CLIAdapter:
    def __init__(self, service: OrderService) -> None:
        self._service = service

    def run(self) -> None:
        cmd = PlaceOrderCommand(
            product_id="widget-42",
            quantity=3,
            unit_price=Money(cents=1999),
        )
        order = self._service.place_order(cmd)
        print(f"Order placed: id={order.id.value}, total={order.total.cents} cents")

        fetched = self._service.get_order(order.id)
        print(f"Fetched: product={fetched.product_id}, qty={fetched.quantity}")


# ─── Configurator ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    repo = InMemoryOrderRepository()
    pub = NoOpEventPublisher()
    svc = OrderService(repo=repo, publisher=pub)
    cli = CLIAdapter(svc)
    cli.run()`;

const tsCode = `// Pattern: Hexagonal Architecture (Ports & Adapters)
// Reference: Cockburn (2005)
// Production note: Use branded types for domain IDs; never use raw string in port signatures.

// ─── Domain ───────────────────────────────────────────────────────────────────

type Brand<T, B extends string> = T & { __brand: B };
type OrderID = Brand<string, "OrderID">;
type Cents = Brand<number, "Cents">;

const OrderID = (v: string): OrderID => v as OrderID;
const Cents = (v: number): Cents => v as Cents;

interface Order {
  readonly id: OrderID;
  readonly productId: string;
  readonly quantity: number;
  readonly total: Cents;
  readonly createdAt: Date;
}

class OrderNotFoundError extends Error {
  constructor(id: OrderID) { super(\`order \${id} not found\`); this.name = "OrderNotFoundError"; }
}
class InvalidQuantityError extends Error {
  constructor(qty: number) { super(\`quantity must be positive, got \${qty}\`); this.name = "InvalidQuantityError"; }
}

// ─── Result type (no exceptions in domain boundary) ─────────────────────────

type Result<T, E extends Error = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const err = <E extends Error>(error: E): Result<never, E> => ({ ok: false, error });

// ─── Driven Ports (interfaces defined by domain) ──────────────────────────────

interface OrderRepository {
  save(order: Order): Promise<Result<void>>;
  findById(id: OrderID): Promise<Result<Order, OrderNotFoundError>>;
}

interface EventPublisher {
  publish(eventName: string, payload: unknown): Promise<void>;
}

// ─── Application Use Cases ────────────────────────────────────────────────────

interface PlaceOrderCommand {
  productId: string;
  quantity: number;
  unitPriceCents: number;
}

class OrderService {
  constructor(
    private readonly repo: OrderRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async placeOrder(
    cmd: PlaceOrderCommand
  ): Promise<Result<Order, InvalidQuantityError | Error>> {
    if (cmd.quantity <= 0) {
      return err(new InvalidQuantityError(cmd.quantity));
    }

    const order: Order = {
      id: OrderID(\`ord-\${Date.now()}-\${Math.random().toString(36).slice(2)}\`),
      productId: cmd.productId,
      quantity: cmd.quantity,
      total: Cents(cmd.unitPriceCents * cmd.quantity),
      createdAt: new Date(),
    };

    const saved = await this.repo.save(order);
    if (!saved.ok) return err(saved.error);

    // Best-effort publish — wrap in try to avoid failing the order placement.
    try {
      await this.publisher.publish("order.placed", { orderId: order.id });
    } catch (e) {
      console.warn("Failed to publish order.placed:", e);
    }

    return ok(order);
  }

  async getOrder(id: OrderID): Promise<Result<Order, OrderNotFoundError>> {
    return this.repo.findById(id);
  }
}

// ─── Driven Adapters ─────────────────────────────────────────────────────────

class InMemoryOrderRepository implements OrderRepository {
  private readonly store = new Map<OrderID, Order>();

  async save(order: Order): Promise<Result<void>> {
    this.store.set(order.id, order);
    return ok(undefined);
  }

  async findById(id: OrderID): Promise<Result<Order, OrderNotFoundError>> {
    const order = this.store.get(id);
    return order ? ok(order) : err(new OrderNotFoundError(id));
  }
}

class NoOpEventPublisher implements EventPublisher {
  async publish(_eventName: string, _payload: unknown): Promise<void> {
    // no-op
  }
}

// ─── Driving Adapter (CLI) ────────────────────────────────────────────────────

class CLIAdapter {
  constructor(private readonly service: OrderService) {}

  async run(): Promise<void> {
    const result = await this.service.placeOrder({
      productId: "widget-42",
      quantity: 3,
      unitPriceCents: 1999,
    });

    if (!result.ok) {
      console.error("Error:", result.error.message);
      return;
    }

    console.log(\`Order placed: id=\${result.value.id}, total=\${result.value.total} cents\`);

    const fetched = await this.service.getOrder(result.value.id);
    if (!fetched.ok) {
      console.error("Fetch error:", fetched.error.message);
      return;
    }
    console.log(\`Fetched: product=\${fetched.value.productId}, qty=\${fetched.value.quantity}\`);
  }
}

// ─── Configurator ─────────────────────────────────────────────────────────────

const repo = new InMemoryOrderRepository();
const pub = new NoOpEventPublisher();
const svc = new OrderService(repo, pub);
const cli = new CLIAdapter(svc);

cli.run();`;

const rustCode = `// Pattern: Hexagonal Architecture (Ports & Adapters)
// Reference: Cockburn (2005)
// Production note: async_trait required for async methods on dyn Trait in stable Rust.

use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use std::time::SystemTime;
use thiserror::Error;

// ─── Domain ───────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct OrderId(pub String);

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Cents(pub u64);

impl std::ops::Mul<u32> for Cents {
    type Output = Cents;
    fn mul(self, rhs: u32) -> Cents { Cents(self.0 * rhs as u64) }
}

#[derive(Debug, Clone)]
pub struct Order {
    pub id: OrderId,
    pub product_id: String,
    pub quantity: u32,
    pub total: Cents,
    pub created_at: SystemTime,
}

#[derive(Debug, Error)]
pub enum DomainError {
    #[error("order {0:?} not found")]
    OrderNotFound(OrderId),
    #[error("quantity must be positive, got {0}")]
    InvalidQuantity(u32),
    #[error("repository error: {0}")]
    Repository(String),
}

// ─── Driven Ports ─────────────────────────────────────────────────────────────

pub trait OrderRepository: Send + Sync {
    fn save(&self, order: &Order) -> Result<(), DomainError>;
    fn find_by_id(&self, id: &OrderId) -> Result<Order, DomainError>;
}

pub trait EventPublisher: Send + Sync {
    fn publish(&self, event_name: &str, payload: &str) -> Result<(), String>;
}

// ─── Application Use Cases ────────────────────────────────────────────────────

pub struct PlaceOrderCommand {
    pub product_id: String,
    pub quantity: u32,
    pub unit_price: Cents,
}

pub struct OrderService {
    repo: Arc<dyn OrderRepository>,
    publisher: Arc<dyn EventPublisher>,
}

impl OrderService {
    pub fn new(repo: Arc<dyn OrderRepository>, publisher: Arc<dyn EventPublisher>) -> Self {
        Self { repo, publisher }
    }

    pub fn place_order(&self, cmd: PlaceOrderCommand) -> Result<Order, DomainError> {
        if cmd.quantity == 0 {
            return Err(DomainError::InvalidQuantity(cmd.quantity));
        }

        let order = Order {
            id: OrderId(format!("ord-{:?}", SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_nanos())),
            product_id: cmd.product_id,
            quantity: cmd.quantity,
            total: cmd.unit_price * cmd.quantity,
            created_at: SystemTime::now(),
        };

        self.repo.save(&order)?;

        // Best-effort publish.
        if let Err(e) = self.publisher.publish("order.placed", &order.id.0) {
            eprintln!("warn: failed to publish order.placed: {e}");
        }

        Ok(order)
    }

    pub fn get_order(&self, id: &OrderId) -> Result<Order, DomainError> {
        self.repo.find_by_id(id)
    }
}

// ─── Driven Adapters ─────────────────────────────────────────────────────────

pub struct InMemoryOrderRepository {
    store: RwLock<HashMap<String, Order>>,
}

impl InMemoryOrderRepository {
    pub fn new() -> Self {
        Self { store: RwLock::new(HashMap::new()) }
    }
}

impl OrderRepository for InMemoryOrderRepository {
    fn save(&self, order: &Order) -> Result<(), DomainError> {
        let mut store = self.store.write().map_err(|e| DomainError::Repository(e.to_string()))?;
        store.insert(order.id.0.clone(), order.clone());
        Ok(())
    }

    fn find_by_id(&self, id: &OrderId) -> Result<Order, DomainError> {
        let store = self.store.read().map_err(|e| DomainError::Repository(e.to_string()))?;
        store.get(&id.0).cloned().ok_or_else(|| DomainError::OrderNotFound(id.clone()))
    }
}

pub struct NoOpEventPublisher;

impl EventPublisher for NoOpEventPublisher {
    fn publish(&self, _event_name: &str, _payload: &str) -> Result<(), String> {
        Ok(())
    }
}

// ─── Driving Adapter (CLI) ────────────────────────────────────────────────────

pub struct CliAdapter {
    service: OrderService,
}

impl CliAdapter {
    pub fn new(service: OrderService) -> Self { Self { service } }

    pub fn run(&self) {
        match self.service.place_order(PlaceOrderCommand {
            product_id: "widget-42".to_string(),
            quantity: 3,
            unit_price: Cents(1999),
        }) {
            Ok(order) => {
                println!("Order placed: id={}, total={} cents", order.id.0, order.total.0);
                match self.service.get_order(&order.id) {
                    Ok(o) => println!("Fetched: product={}, qty={}", o.product_id, o.quantity),
                    Err(e) => eprintln!("Fetch error: {e}"),
                }
            }
            Err(e) => eprintln!("Error: {e}"),
        }
    }
}

// ─── Configurator ─────────────────────────────────────────────────────────────

fn main() {
    let repo: Arc<dyn OrderRepository> = Arc::new(InMemoryOrderRepository::new());
    let pub_: Arc<dyn EventPublisher> = Arc::new(NoOpEventPublisher);
    let svc = OrderService::new(repo, pub_);
    let cli = CliAdapter::new(svc);
    cli.run();
}`;

const javaCode = `// Pattern: Hexagonal Architecture (Ports & Adapters)
// Reference: Cockburn (2005); Clean Architecture (Martin, 2012)
// Production note: Sealed interfaces + records enforce closed domain model in Java 21.

package com.example.orders;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

// ─── Domain ───────────────────────────────────────────────────────────────────

public class Orders {

    public record OrderId(String value) {
        public static OrderId generate() { return new OrderId(UUID.randomUUID().toString()); }
    }

    public record Cents(long value) {
        public Cents multiply(int qty) { return new Cents(value * qty); }
    }

    public record Order(
        OrderId id,
        String productId,
        int quantity,
        Cents total,
        Instant createdAt
    ) {}

    public sealed interface DomainError permits DomainError.OrderNotFound, DomainError.InvalidQuantity {
        record OrderNotFound(OrderId id) implements DomainError {}
        record InvalidQuantity(int quantity) implements DomainError {}
    }

    // ─── Driven Ports ─────────────────────────────────────────────────────────

    public interface OrderRepository {
        void save(Order order);
        Optional<Order> findById(OrderId id);
    }

    public interface EventPublisher {
        void publish(String eventName, Object payload);
    }

    // ─── Result (sealed) ───────────────────────────────────────────────────────

    public sealed interface Result<T> permits Result.Ok, Result.Fail {
        record Ok<T>(T value) implements Result<T> {}
        record Fail<T>(DomainError error) implements Result<T> {}

        static <T> Result<T> ok(T v) { return new Ok<>(v); }
        static <T> Result<T> fail(DomainError e) { return new Fail<>(e); }
    }

    // ─── Application Use Case ─────────────────────────────────────────────────

    public record PlaceOrderCommand(String productId, int quantity, Cents unitPrice) {}

    public static class OrderService {
        private final OrderRepository repo;
        private final EventPublisher publisher;

        public OrderService(OrderRepository repo, EventPublisher publisher) {
            this.repo = repo;
            this.publisher = publisher;
        }

        public Result<Order> placeOrder(PlaceOrderCommand cmd) {
            if (cmd.quantity() <= 0) {
                return Result.fail(new DomainError.InvalidQuantity(cmd.quantity()));
            }

            var order = new Order(
                OrderId.generate(),
                cmd.productId(),
                cmd.quantity(),
                cmd.unitPrice().multiply(cmd.quantity()),
                Instant.now()
            );

            repo.save(order);

            try {
                publisher.publish("order.placed", Map.of("orderId", order.id().value()));
            } catch (Exception e) {
                System.err.println("warn: failed to publish order.placed: " + e.getMessage());
            }

            return Result.ok(order);
        }

        public Result<Order> getOrder(OrderId id) {
            return repo.findById(id)
                .<Result<Order>>map(Result::ok)
                .orElseGet(() -> Result.fail(new DomainError.OrderNotFound(id)));
        }
    }

    // ─── Driven Adapters ──────────────────────────────────────────────────────

    public static class InMemoryOrderRepository implements OrderRepository {
        private final Map<String, Order> store = new ConcurrentHashMap<>();

        @Override
        public void save(Order order) { store.put(order.id().value(), order); }

        @Override
        public Optional<Order> findById(OrderId id) {
            return Optional.ofNullable(store.get(id.value()));
        }
    }

    public static class NoOpEventPublisher implements EventPublisher {
        @Override
        public void publish(String eventName, Object payload) { /* no-op */ }
    }

    // ─── Driving Adapter (CLI) ────────────────────────────────────────────────

    public static class CliAdapter {
        private final OrderService service;
        public CliAdapter(OrderService service) { this.service = service; }

        public void run() {
            var result = service.placeOrder(
                new PlaceOrderCommand("widget-42", 3, new Cents(1999))
            );

            switch (result) {
                case Result.Ok<Order> ok -> {
                    System.out.printf("Order placed: id=%s, total=%d cents%n",
                        ok.value().id().value(), ok.value().total().value());

                    switch (service.getOrder(ok.value().id())) {
                        case Result.Ok<Order> fetched ->
                            System.out.printf("Fetched: product=%s, qty=%d%n",
                                fetched.value().productId(), fetched.value().quantity());
                        case Result.Fail<Order> fail ->
                            System.err.println("Fetch error: " + fail.error());
                    }
                }
                case Result.Fail<Order> fail ->
                    System.err.println("Error: " + fail.error());
            }
        }
    }

    // ─── Configurator ─────────────────────────────────────────────────────────

    public static void main(String[] args) {
        var repo = new InMemoryOrderRepository();
        var pub = new NoOpEventPublisher();
        var svc = new OrderService(repo, pub);
        var cli = new CliAdapter(svc);
        cli.run();
    }
}`;

const awsCdkCode = `// infrastructure/cdk/hexagonal-stack.ts
// IaC: AWS CDK (TypeScript)
// Pattern: Hexagonal Architecture — Lambda with injected adapters via env vars

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class HexagonalOrderStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── Driven Adapter: DynamoDB (OrderRepository port) ──────────────────────
    const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      tableName: 'orders',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // ── Driven Adapter: SQS (EventPublisher port) ─────────────────────────────
    const orderEventsDlq = new sqs.Queue(this, 'OrderEventsDLQ', {
      retentionPeriod: cdk.Duration.days(14),
    });

    const orderEventsQueue = new sqs.Queue(this, 'OrderEventsQueue', {
      visibilityTimeout: cdk.Duration.seconds(30),
      deadLetterQueue: { queue: orderEventsDlq, maxReceiveCount: 3 },
    });

    // ── Driving Adapter: Lambda (HTTP adapter via API Gateway) ────────────────
    const placeOrderFn = new lambda.Function(this, 'PlaceOrderFn', {
      runtime: lambda.Runtime.PROVIDED_AL2,  // Go binary (arm64 for cost)
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset('dist/place-order'),
      handler: 'bootstrap',
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      environment: {
        // Configurator values — wires adapters at Lambda cold start
        ORDERS_TABLE_NAME: ordersTable.tableName,
        ORDER_EVENTS_QUEUE_URL: orderEventsQueue.queueUrl,
        ADAPTER_REPO: 'dynamodb',    // swap to 'memory' for integration tests
        ADAPTER_PUBLISHER: 'sqs',    // swap to 'noop' for unit tests
      },
    });

    // IAM: least-privilege (driven adapter permissions)
    ordersTable.grantReadWriteData(placeOrderFn);
    orderEventsQueue.grantSendMessages(placeOrderFn);

    // ── Driving Adapter: API Gateway ──────────────────────────────────────────
    const api = new apigateway.RestApi(this, 'OrdersApi', {
      restApiName: 'hexagonal-orders',
      deployOptions: { tracingEnabled: true },  // X-Ray for observability
    });

    const orders = api.root.addResource('orders');
    orders.addMethod('POST', new apigateway.LambdaIntegration(placeOrderFn));
    orders.addResource('{id}').addMethod('GET', new apigateway.LambdaIntegration(placeOrderFn));

    // ── Driven Adapter: SQS consumer Lambda (downstream processing) ───────────
    const processOrderFn = new lambda.Function(this, 'ProcessOrderFn', {
      runtime: lambda.Runtime.PROVIDED_AL2,
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset('dist/process-order'),
      handler: 'bootstrap',
      timeout: cdk.Duration.seconds(30),
    });

    processOrderFn.addEventSource(new SqsEventSource(orderEventsQueue, {
      batchSize: 10,
      reportBatchItemFailures: true,  // partial batch failure support
    }));

    // ── Outputs ───────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
    new cdk.CfnOutput(this, 'OrdersTableArn', { value: ordersTable.tableArn });
  }
}`;

const awsTerraformCode = `# infrastructure/terraform/main.tf
# IaC: Terraform — Hexagonal Architecture on AWS

terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

variable "region"    { default = "us-east-1" }
variable "app_name"  { default = "hexagonal-orders" }

# ── Driven Adapter: DynamoDB (OrderRepository port) ──────────────────────────
resource "aws_dynamodb_table" "orders" {
  name         = "orders"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute { name = "id"; type = "S" }

  point_in_time_recovery { enabled = true }

  tags = { Pattern = "hexagonal", Port = "OrderRepository" }
}

# ── Driven Adapter: SQS (EventPublisher port) ─────────────────────────────────
resource "aws_sqs_queue" "order_events_dlq" {
  name                       = "\${var.app_name}-dlq"
  message_retention_seconds  = 1209600  # 14 days
}

resource "aws_sqs_queue" "order_events" {
  name                       = "\${var.app_name}-events"
  visibility_timeout_seconds = 30

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.order_events_dlq.arn
    maxReceiveCount     = 3
  })
}

# ── Lambda execution role (least-privilege) ───────────────────────────────────
resource "aws_iam_role" "lambda_role" {
  name               = "\${var.app_name}-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals { type = "Service"; identifiers = ["lambda.amazonaws.com"] }
  }
}

resource "aws_iam_role_policy" "lambda_policy" {
  role = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Query"]
        Resource = aws_dynamodb_table.orders.arn
      },
      {
        Effect   = "Allow"
        Action   = ["sqs:SendMessage"]
        Resource = aws_sqs_queue.order_events.arn
      },
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# ── Driving Adapter: Lambda ───────────────────────────────────────────────────
resource "aws_lambda_function" "place_order" {
  function_name = "\${var.app_name}-place-order"
  role          = aws_iam_role.lambda_role.arn
  filename      = "dist/place-order.zip"
  handler       = "bootstrap"
  runtime       = "provided.al2"
  architectures = ["arm64"]
  timeout       = 10
  memory_size   = 256

  environment {
    variables = {
      ORDERS_TABLE_NAME       = aws_dynamodb_table.orders.name
      ORDER_EVENTS_QUEUE_URL  = aws_sqs_queue.order_events.url
      ADAPTER_REPO            = "dynamodb"
      ADAPTER_PUBLISHER       = "sqs"
    }
  }
}

# ── Driving Adapter: API Gateway ──────────────────────────────────────────────
resource "aws_apigatewayv2_api" "orders_api" {
  name          = "\${var.app_name}-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id             = aws_apigatewayv2_api.orders_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.place_order.invoke_arn
}

resource "aws_apigatewayv2_route" "post_order" {
  api_id    = aws_apigatewayv2_api.orders_api.id
  route_key = "POST /orders"
  target    = "integrations/\${aws_apigatewayv2_integration.lambda.id}"
}

output "api_url" { value = aws_apigatewayv2_api.orders_api.api_endpoint }`;

const azureBicepCode = `// infrastructure/azure/main.bicep
// IaC: Bicep — Hexagonal Architecture on Azure

param location string = resourceGroup().location
param appName string = 'hexagonal-orders'

// ── Driven Adapter: Cosmos DB (OrderRepository port) ─────────────────────────
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: '\${appName}-cosmos'
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: { defaultConsistencyLevel: 'Session' }
    capabilities: [{ name: 'EnableServerless' }]  // cost-optimised for dev
    locations: [{ locationName: location }]
  }
}

resource ordersDb 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  parent: cosmosAccount
  name: 'orders-db'
  properties: { resource: { id: 'orders-db' } }
}

resource ordersContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: ordersDb
  name: 'orders'
  properties: {
    resource: {
      id: 'orders'
      partitionKey: { paths: ['/id']; kind: 'Hash' }
      indexingPolicy: { indexingMode: 'consistent' }
    }
  }
}

// ── Driven Adapter: Service Bus (EventPublisher port) ─────────────────────────
resource serviceBusNs 'Microsoft.ServiceBus/namespaces@2022-10-01-preview' = {
  name: '\${appName}-sb'
  location: location
  sku: { name: 'Standard' }
}

resource orderEventsQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
  parent: serviceBusNs
  name: 'order-events'
  properties: {
    maxDeliveryCount: 3
    deadLetteringOnMessageExpiration: true
    lockDuration: 'PT30S'
  }
}

// ── Driving Adapter: Azure Functions + API Management ─────────────────────────
resource funcStorageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: '\${replace(appName, '-', '')}sa'
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

resource funcPlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: '\${appName}-plan'
  location: location
  kind: 'functionapp'
  sku: { name: 'Y1'; tier: 'Dynamic' }  // consumption plan
}

resource functionApp 'Microsoft.Web/sites@2023-01-01' = {
  name: '\${appName}-func'
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: funcPlan.id
    siteConfig: {
      appSettings: [
        { name: 'COSMOS_ENDPOINT'; value: cosmosAccount.properties.documentEndpoint }
        { name: 'COSMOS_DATABASE'; value: 'orders-db' }
        { name: 'COSMOS_CONTAINER'; value: 'orders' }
        { name: 'SERVICEBUS_CONNECTION'; value: listKeys(serviceBusNs.id, '2022-10-01-preview').primaryConnectionString }
        { name: 'ADAPTER_REPO'; value: 'cosmos' }         // configurator
        { name: 'ADAPTER_PUBLISHER'; value: 'servicebus' } // configurator
      ]
    }
  }
}

output functionAppUrl string = 'https://\${functionApp.properties.defaultHostName}'
output cosmosEndpoint string = cosmosAccount.properties.documentEndpoint`;

const gcpTerraformCode = `# infrastructure/gcp/main.tf
# IaC: Terraform — Hexagonal Architecture on GCP

terraform {
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

variable "project_id" {}
variable "region"     { default = "us-central1" }
variable "app_name"   { default = "hexagonal-orders" }

# ── Driven Adapter: Firestore (OrderRepository port) ──────────────────────────
resource "google_firestore_database" "orders" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
}

# ── Driven Adapter: Pub/Sub (EventPublisher port) ─────────────────────────────
resource "google_pubsub_topic" "order_events" {
  name    = "\${var.app_name}-events"
  project = var.project_id

  message_retention_duration = "604800s"  # 7 days
}

resource "google_pubsub_subscription" "order_events_sub" {
  name    = "\${var.app_name}-events-sub"
  topic   = google_pubsub_topic.order_events.name
  project = var.project_id

  ack_deadline_seconds = 30

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.order_events_dlq.id
    max_delivery_attempts = 5
  }
}

resource "google_pubsub_topic" "order_events_dlq" {
  name    = "\${var.app_name}-events-dlq"
  project = var.project_id
}

# ── Service Account (least-privilege) ────────────────────────────────────────
resource "google_service_account" "place_order" {
  account_id   = "place-order-sa"
  display_name = "Place Order Function SA"
  project      = var.project_id
}

resource "google_project_iam_member" "firestore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:\${google_service_account.place_order.email}"
}

resource "google_project_iam_member" "pubsub_publisher" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:\${google_service_account.place_order.email}"
}

# ── Driving Adapter: Cloud Run (HTTP) ─────────────────────────────────────────
resource "google_cloud_run_v2_service" "place_order" {
  name     = "\${var.app_name}-place-order"
  location = var.region
  project  = var.project_id

  template {
    service_account = google_service_account.place_order.email

    containers {
      image = "gcr.io/\${var.project_id}/\${var.app_name}:latest"

      env {
        name  = "FIRESTORE_PROJECT_ID"
        value = var.project_id
      }
      env {
        name  = "PUBSUB_TOPIC_ID"
        value = google_pubsub_topic.order_events.id
      }
      env { name = "ADAPTER_REPO";      value = "firestore" }  // configurator
      env { name = "ADAPTER_PUBLISHER"; value = "pubsub" }     // configurator
    }
  }
}

resource "google_cloud_run_service_iam_member" "public_access" {
  location = var.region
  project  = var.project_id
  service  = google_cloud_run_v2_service.place_order.name
  role     = "roles/run.invoker"
  member   = "allUsers"  # remove for internal-only services
}

output "cloud_run_url" { value = google_cloud_run_v2_service.place_order.uri }`;

const LANGS = ["Go", "Python", "TypeScript", "Rust", "Java"];
const LANG_MAP = { Go: [goCode, "go", "domain/orders/main.go"], Python: [pythonCode, "python", "domain/orders/main.py"], TypeScript: [tsCode, "typescript", "domain/orders/index.ts"], Rust: [rustCode, "rust", "domain/orders/main.rs"], Java: [javaCode, "java", "domain/orders/Orders.java"] };

function ImplementationsTab() {
  const [mainTab, setMainTab] = useState("core");
  const [lang, setLang] = useState("Go");
  const [awsSubTab, setAwsSubTab] = useState("cdk");
  const [azureSubTab, setAzureSubTab] = useState("bicep");
  const [gcpSubTab, setGcpSubTab] = useState("terraform");

  const [code, language, filename] = LANG_MAP[lang];

  return (
    <div>
      {/* Main tab row */}
      <div style={{ display: "flex", gap: "4px", borderBottom: `1px solid ${colors.border}`, marginBottom: "20px", flexWrap: "wrap" }}>
        {[["core", "core/", colors.blue], ["aws", "aws/", colors.aws], ["azure", "azure/", colors.azure], ["gcp", "gcp/", colors.gcp]].map(([t, label, c]) => (
          <Tab key={t} label={`implementations/${label}`} active={mainTab === t} onClick={() => setMainTab(t)} color={c} />
        ))}
      </div>

      {mainTab === "core" && (
        <div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: "6px 14px", borderRadius: "6px", border: `1px solid ${lang === l ? colors.blue : colors.border}`,
                background: lang === l ? colors.blue + "22" : "transparent", color: lang === l ? colors.blueLight : colors.textMuted,
                cursor: "pointer", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.15s",
              }}>{l}</button>
            ))}
          </div>
          <CodeBlock code={code} language={language} filename={filename} />
        </div>
      )}

      {mainTab === "aws" && (
        <div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
            {[["cdk", "CDK (TypeScript)"], ["terraform", "Terraform"]].map(([t, l]) => (
              <button key={t} onClick={() => setAwsSubTab(t)} style={{
                padding: "6px 14px", borderRadius: "6px", border: `1px solid ${awsSubTab === t ? colors.aws : colors.border}`,
                background: awsSubTab === t ? colors.aws + "22" : "transparent", color: awsSubTab === t ? colors.aws : colors.textMuted,
                cursor: "pointer", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.15s",
              }}>{l}</button>
            ))}
          </div>
          {awsSubTab === "cdk" && <CodeBlock code={awsCdkCode} language="typescript" filename="infrastructure/cdk/hexagonal-stack.ts" />}
          {awsSubTab === "terraform" && <CodeBlock code={awsTerraformCode} language="go" filename="infrastructure/terraform/main.tf" />}
        </div>
      )}

      {mainTab === "azure" && (
        <div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
            {[["bicep", "Bicep"]].map(([t, l]) => (
              <button key={t} onClick={() => setAzureSubTab(t)} style={{
                padding: "6px 14px", borderRadius: "6px", border: `1px solid ${colors.azure}`,
                background: colors.azure + "22", color: colors.azure,
                cursor: "pointer", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace",
              }}>{l}</button>
            ))}
          </div>
          <CodeBlock code={azureBicepCode} language="typescript" filename="infrastructure/azure/main.bicep" />
        </div>
      )}

      {mainTab === "gcp" && (
        <div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
            {[["terraform", "Terraform"]].map(([t, l]) => (
              <button key={t} onClick={() => setGcpSubTab(t)} style={{
                padding: "6px 14px", borderRadius: "6px", border: `1px solid ${colors.gcp}`,
                background: colors.gcp + "22", color: colors.gcp,
                cursor: "pointer", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace",
              }}>{l}</button>
            ))}
          </div>
          <CodeBlock code={gcpTerraformCode} language="go" filename="infrastructure/gcp/main.tf" />
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Leadership ───────────────────────────────────────────────────────

function LeadershipTab() {
  const sections = [
    {
      title: "Explain to Your Team",
      icon: "💬",
      accent: colors.blue,
      content: (
        <div style={{ color: colors.textMuted, fontSize: "13px", lineHeight: "1.8" }}>
          <p style={{ margin: "0 0 10px 0" }}>
            "Hexagonal architecture says our business logic should never know whether it's being called by an HTTP request, a CLI script, or a test. And it should never know whether its data goes to Postgres, DynamoDB, or an in-memory map. We express those boundaries as interfaces — ports — that the domain owns and defines. Everything outside is a plugin."
          </p>
          <p style={{ margin: "0 0 10px 0" }}>
            "In practice: if you're writing <code style={{ color: colors.green, background: "#161b22", padding: "1px 4px", borderRadius: "3px" }}>import 'database/sql'</code> inside a file that also contains business rules, that's the smell we're addressing."
          </p>
          <p style={{ margin: 0 }}>
            "The payoff: we can run the entire domain test suite in milliseconds with in-memory adapters, and when we need to swap from SQS to Kafka, we write one new adapter file and touch nothing else."
          </p>
        </div>
      )
    },
    {
      title: "Justify the Decision",
      icon: "⚖️",
      accent: colors.amber,
      content: (
        <div>
          {[
            { q: "Why not just use N-tier (layered)?", a: "N-tier layers organize code by technical concern (controller → service → repository), but they permit upward leakage. A service importing a JPA entity or an ORM annotation is a layered architecture that has failed at its own goal. Hexagonal replaces implicit layering conventions with enforced interface boundaries." },
            { q: "Why not just be disciplined without the pattern?", a: "Discipline degrades under deadline pressure. Explicit interface boundaries enforced by the type system (Go interfaces, Java sealed types, Rust traits) make violations a compile error rather than a code review comment." },
            { q: "What's the cost?", a: "Additional indirection: for a simple CRUD endpoint, you'll write a port interface, an adapter implementation, and wire them in a configurator. For a 20-line handler, that overhead isn't justified. Rule of thumb: apply it when the domain has meaningful business logic or when you expect adapter churn over the system's lifetime." },
            { q: "How do we know we're doing it right?", a: "A passing test: the full domain test suite runs with zero infrastructure dependencies (no database, no message broker, no HTTP). If it doesn't, a dependency is leaking through a port." },
          ].map(({ q, a }, i) => (
            <div key={i} style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: i < 3 ? `1px solid ${colors.border}22` : "none" }}>
              <div style={{ color: colors.text, fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Q: {q}</div>
              <div style={{ color: colors.textMuted, fontSize: "12px", lineHeight: "1.7", paddingLeft: "12px", borderLeft: `2px solid ${colors.amber}44` }}>{a}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Failure Modes & Observability",
      icon: "🔴",
      accent: colors.red,
      content: (
        <div>
          {[
            { mode: "Port Leakage", description: "Domain code imports infrastructure types (sql.Row, http.Request, kafka.Message). Symptom: domain tests require infrastructure setup.", detect: "Grep for infrastructure imports in domain packages. Add a linting rule.", alert: "CI gate: fail on forbidden imports in domain/." },
            { mode: "Adapter over-coupling", description: "An adapter calls another adapter directly, bypassing the domain. Business logic fragments across adapters.", detect: "Code review: adapters should only call domain ports, never other adapters.", alert: "Architecture fitness functions (e.g., ArchUnit for Java, depguard for Go)." },
            { mode: "Configurator scattered", description: "Port wiring happens in multiple places (constructors, middleware, global vars). Swap-out requires touching many files.", detect: "Single-file DI wiring audit. If wiring spans > 1 file without a clear dependency graph, it's fragmented.", alert: "Document the configurator location in your ADR; make it a test fixture." },
            { mode: "Anemic domain", description: "All logic lives in adapters; the domain contains only data structs. Hexagonal becomes expensive boilerplate for no benefit.", detect: "Cyclomatic complexity in domain vs. adapters. If adapters are more complex, the domain is anemic.", alert: "Architecture review trigger when domain has 0 business rule tests." },
            { mode: "Missing error translation", description: "Adapter errors (sql.ErrNoRows, not-found HTTP 404) leak into domain return values, coupling domain to infrastructure error types.", detect: "Domain error types should be defined in the domain package. Adapters translate.", alert: "Code review checklist item: does this adapter wrap errors into domain error types?" },
          ].map(({ mode, description, detect, alert }, i) => (
            <div key={i} style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: i < 4 ? `1px solid ${colors.border}22` : "none" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                <Badge color={colors.red}>{mode}</Badge>
              </div>
              <div style={{ color: colors.textMuted, fontSize: "12px", lineHeight: "1.6", marginBottom: "4px" }}>{description}</div>
              <div style={{ fontSize: "12px" }}><span style={{ color: colors.blue }}>Detect: </span><span style={{ color: colors.textMuted }}>{detect}</span></div>
              <div style={{ fontSize: "12px" }}><span style={{ color: colors.amber }}>Alert: </span><span style={{ color: colors.textMuted }}>{alert}</span></div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Scale Implications",
      icon: "📈",
      accent: colors.green,
      content: (
        <div>
          {[
            { scale: "10x traffic", implication: "No architectural change needed — the pattern is neutral to horizontal scaling. Adapters can be swapped to connection-pooled variants (e.g., pgx pool instead of single-connection). The domain remains untouched." },
            { scale: "10x team size", implication: "Hexagonal boundaries become team boundaries. Each adapter can be owned by a separate squad. Port interfaces become the API contract between teams. This is where the investment pays off most clearly." },
            { scale: "Multiple deployment modes", implication: "The same domain code can be deployed as a Lambda function (HTTP driving adapter), a Kubernetes pod (gRPC adapter), and a batch processor (cron adapter) by changing the configurator only. No domain forking." },
            { scale: "Revisit when:", implication: "Adapter logic becomes complex enough to warrant its own service (e.g., the SQL adapter grows into a full data layer team). At that point, the adapter likely deserves its own hexagonal service behind an RPC boundary. Also revisit if the domain becomes event-sourced — the repository port interface changes significantly." },
          ].map(({ scale, implication }, i) => (
            <div key={i} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: i < 3 ? `1px solid ${colors.border}22` : "none" }}>
              <Badge color={colors.green}>{scale}</Badge>
              <div style={{ color: colors.textMuted, fontSize: "12px", lineHeight: "1.7", marginTop: "6px" }}>{implication}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Code Review Checklist",
      icon: "✅",
      accent: colors.purple,
      content: (
        <div>
          {[
            ["Domain package", [
              "No imports from infrastructure packages (database drivers, HTTP libraries, cloud SDKs)",
              "Ports (interfaces) defined here, not in adapter packages",
              "Error types defined here and are domain-meaningful (not wrapped infrastructure errors)",
              "No framework annotations on domain structs (no @Entity, no json tags if avoidable)",
            ]],
            ["Adapter package", [
              "Implements exactly one port interface — no more",
              "Translates infrastructure errors into domain error types",
              "Contains no business logic — only translation and I/O",
              "Has its own unit tests using a mock of the port it interacts with",
            ]],
            ["Configurator / main", [
              "Only place where concrete adapter types are instantiated",
              "Domain service receives interfaces, not concrete types",
              "Adapter selection can be changed without modifying domain or other adapters",
            ]],
            ["Tests", [
              "Domain unit tests use in-memory adapters — no infrastructure dependencies",
              "Adapter integration tests test the adapter in isolation against real infrastructure",
              "No end-to-end tests that test domain logic — those belong at unit level",
            ]],
          ].map(([section, items], i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <div style={{ color: colors.purpleLight, fontSize: "12px", fontWeight: "600", marginBottom: "8px", fontFamily: "'JetBrains Mono', monospace" }}>{section}</div>
              {items.map((item, j) => (
                <div key={j} style={{ display: "flex", gap: "8px", marginBottom: "5px" }}>
                  <span style={{ color: colors.green, fontSize: "11px", marginTop: "2px", flexShrink: 0 }}>□</span>
                  <span style={{ color: colors.textMuted, fontSize: "12px", lineHeight: "1.5" }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Questions for Design Review",
      icon: "❓",
      accent: colors.amber,
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            "Can the full domain test suite run with zero infrastructure dependencies?",
            "Where is the configurator — who wires the concrete adapters into the ports?",
            "If we swap Postgres for DynamoDB tomorrow, which files change?",
            "How many driving actors does this application need to support? Does that justify the port interface?",
            "Are domain error types defined inside the domain package, or do infrastructure errors leak out?",
            "If a junior engineer adds a database call inside a use case method, will CI catch it?",
            "What's the in-memory adapter strategy for testing — are there any infrastructure-dependent unit tests?",
            "For the driven port interfaces: are the method signatures in domain language, or do they expose SQL/HTTP concepts?",
          ].map((q, i) => (
            <div key={i} style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: "6px", padding: "10px 12px", fontSize: "12px", color: colors.textMuted, lineHeight: "1.6" }}>
              <span style={{ color: colors.amber }}>→ </span>{q}
            </div>
          ))}
        </div>
      )
    },
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {sections.map(({ title, icon, accent, content }, i) => (
        <Card key={i} style={{ padding: 0, overflow: "hidden" }}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 20px", background: "transparent", border: "none", cursor: "pointer",
              borderLeft: `3px solid ${accent}`,
            }}
          >
            <span style={{ color: colors.text, fontSize: "14px", fontWeight: "600" }}>{icon} {title}</span>
            <span style={{ color: colors.textDim, fontSize: "16px" }}>{openIdx === i ? "−" : "+"}</span>
          </button>
          {openIdx === i && (
            <div style={{ padding: "0 20px 20px 20px" }}>{content}</div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "arch", label: "Architecture" },
  { id: "concepts", label: "Core Concepts" },
  { id: "impl", label: "Implementations" },
  { id: "lead", label: "Leadership" },
];

export default function HexagonalArchitecture() {
  const [tab, setTab] = useState("arch");

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, color: colors.text, fontFamily: "'JetBrains Mono', 'Fira Mono', monospace" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, padding: "20px 28px 0 28px" }}>
        <div style={{ marginBottom: "4px", display: "flex", gap: "8px", alignItems: "center" }}>
          <Badge color={colors.purple}>Architecture Pattern</Badge>
          <Badge color={colors.textDim}>Cockburn 2005</Badge>
          <Badge color={colors.textDim}>Martin 2012</Badge>
        </div>
        <h1 style={{ margin: "8px 0 4px 0", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.02em" }}>
          Hexagonal Architecture
          <span style={{ color: colors.textDim, fontWeight: "400", fontSize: "16px" }}> — Ports & Adapters</span>
        </h1>
        <p style={{ margin: "0 0 16px 0", color: colors.textMuted, fontSize: "13px" }}>
          Isolate business logic from infrastructure via typed port interfaces and swappable adapters
        </p>
        <div style={{ display: "flex", gap: "2px" }}>
          {TABS.map(t => <Tab key={t.id} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} />)}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 28px", maxWidth: "1100px" }}>
        {tab === "arch" && <ArchitectureTab />}
        {tab === "concepts" && <ConceptsTab />}
        {tab === "impl" && <ImplementationsTab />}
        {tab === "lead" && <LeadershipTab />}
      </div>
    </div>
  );
}
