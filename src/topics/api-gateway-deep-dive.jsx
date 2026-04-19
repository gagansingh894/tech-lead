"use client"

import { useState } from "react";

// ─── Shared Primitives ───────────────────────────────────────────────────────

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
  aws: "#ff9900",
  azure: "#0078d4",
  gcp: "#4285f4",
};

const badge = (label, color) => (
  <span
    style={{
      background: color + "22",
      color,
      border: `1px solid ${color}55`,
      borderRadius: 4,
      padding: "1px 7px",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.3,
    }}
  >
    {label}
  </span>
);

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      style={{
        background: copied ? colors.green + "22" : colors.border,
        color: copied ? colors.green : colors.muted,
        border: "none",
        borderRadius: 4,
        padding: "3px 10px",
        fontSize: 11,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({ language, filename, children }) {
  return (
    <div
      style={{
        background: colors.code,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "7px 14px",
          borderBottom: `1px solid ${colors.border}`,
          background: "#0d1117",
        }}
      >
        <span style={{ color: colors.muted, fontSize: 12, fontFamily: "monospace" }}>
          {filename}
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {badge(language, colors.blue)}
          <CopyButton text={children} />
        </div>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "14px 16px",
          overflowX: "auto",
          fontSize: 12.5,
          lineHeight: 1.65,
          color: "#c9d1d9",
          fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          whiteSpace: "pre",
        }}
      >
        {children}
      </pre>
    </div>
  );
}

function TabBar({ tabs, active, onSelect, colorFn }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        borderBottom: `1px solid ${colors.border}`,
        marginBottom: 20,
        flexWrap: "wrap",
      }}
    >
      {tabs.map((t) => {
        const isActive = t === active;
        const c = colorFn ? colorFn(t) : colors.blue;
        return (
          <button
            key={t}
            onClick={() => onSelect(t)}
            style={{
              background: "none",
              border: "none",
              borderBottom: isActive ? `2px solid ${c}` : "2px solid transparent",
              color: isActive ? c : colors.muted,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: isActive ? 600 : 400,
              fontSize: 13,
              fontFamily: "inherit",
              transition: "color 0.15s",
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

// ─── Tab 1: Architecture ─────────────────────────────────────────────────────

function ArchitectureTab() {
  return (
    <div>
      <p style={{ color: colors.muted, fontSize: 13, marginBottom: 20 }}>
        Request lifecycle through an API Gateway with BFF variant. Arrows show data flow direction
        and payload type.
      </p>

      {/* Main Diagram */}
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 10,
          padding: 20,
          marginBottom: 20,
          overflowX: "auto",
        }}
      >
        <svg viewBox="0 0 860 520" width="100%" style={{ display: "block" }}>
          {/* ── defs ── */}
          <defs>
            {["blue", "green", "amber", "purple", "red"].map((c) => (
              <marker
                key={c}
                id={`arrow-${c}`}
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L8,3 z" fill={colors[c]} />
              </marker>
            ))}
          </defs>

          {/* ── background regions ── */}
          <rect x="10" y="10" width="155" height="500" rx="8" fill="#ffffff08" stroke={colors.border} strokeWidth="1" strokeDasharray="4,3" />
          <text x="87" y="28" textAnchor="middle" fill={colors.muted} fontSize="10" fontWeight="600">CLIENT ZONE</text>

          <rect x="185" y="10" width="180" height="500" rx="8" fill="#3b82f608" stroke={colors.blue + "44"} strokeWidth="1" strokeDasharray="4,3" />
          <text x="275" y="28" textAnchor="middle" fill={colors.blue} fontSize="10" fontWeight="600">EDGE / GATEWAY</text>

          <rect x="385" y="10" width="460" height="500" rx="8" fill="#ffffff05" stroke={colors.border} strokeWidth="1" strokeDasharray="4,3" />
          <text x="615" y="28" textAnchor="middle" fill={colors.muted} fontSize="10" fontWeight="600">INTERNAL SERVICES</text>

          {/* ── clients ── */}
          {[
            { y: 75, label: "Web App", icon: "🌐" },
            { y: 185, label: "Mobile App", icon: "📱" },
            { y: 295, label: "3rd Party", icon: "🔗" },
            { y: 405, label: "IoT / Edge", icon: "📡" },
          ].map(({ y, label, icon }) => (
            <g key={label}>
              <rect x="20" y={y} width="135" height="48" rx="6" fill={colors.surface} stroke={colors.border} strokeWidth="1.5" />
              <text x="88" y={y + 20} textAnchor="middle" fill={colors.text} fontSize="18">{icon}</text>
              <text x="88" y={y + 38} textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="500">{label}</text>
            </g>
          ))}

          {/* ── gateway box ── */}
          <rect x="195" y="45" width="160" height="460" rx="8" fill="#3b82f610" stroke={colors.blue} strokeWidth="1.5" />
          <text x="275" y="68" textAnchor="middle" fill={colors.blue} fontSize="12" fontWeight="700">API Gateway</text>

          {/* gateway internals */}
          {[
            { y: 80, label: "Auth / AuthZ", col: colors.red },
            { y: 120, label: "Rate Limiter", col: colors.amber },
            { y: 160, label: "Request Router", col: colors.blue },
            { y: 200, label: "Aggregator", col: colors.green },
            { y: 240, label: "Protocol Xlate", col: colors.purple },
            { y: 280, label: "Cache Layer", col: colors.purple },
            { y: 320, label: "Circuit Breaker", col: colors.red },
            { y: 360, label: "TLS Termination", col: colors.muted },
            { y: 400, label: "Observability", col: colors.amber },
            { y: 440, label: "Response Xform", col: colors.green },
          ].map(({ y, label, col }) => (
            <g key={label}>
              <rect x="210" y={y} width="130" height="28" rx="4" fill={col + "18"} stroke={col + "55"} strokeWidth="1" />
              <text x="275" y={y + 18} textAnchor="middle" fill={col} fontSize="10.5" fontWeight="500">{label}</text>
            </g>
          ))}

          {/* ── microservices ── */}
          {[
            { y: 55, label: "User Service", col: colors.green },
            { y: 145, label: "Order Service", col: colors.green },
            { y: 235, label: "Product Service", col: colors.green },
            { y: 325, label: "Payment Service", col: colors.green },
            { y: 415, label: "Notification Svc", col: colors.amber },
          ].map(({ y, label, col }) => (
            <g key={label}>
              <rect x="400" y={y} width="140" height="48" rx="6" fill={colors.surface} stroke={col} strokeWidth="1.5" />
              <text x="470" y={y + 20} textAnchor="middle" fill={col} fontSize="11" fontWeight="600">{label}</text>
              <text x="470" y={y + 36} textAnchor="middle" fill={colors.muted} fontSize="9.5">REST / gRPC</text>
            </g>
          ))}

          {/* ── data stores ── */}
          {[
            { y: 60, label: "Users DB", col: colors.purple },
            { y: 150, label: "Orders DB", col: colors.purple },
            { y: 240, label: "Products DB", col: colors.purple },
            { y: 330, label: "Payments DB", col: colors.purple },
            { y: 420, label: "Message Bus", col: colors.amber },
          ].map(({ y, label, col }) => (
            <g key={label}>
              <ellipse cx="710" cy={y + 24} rx="65" ry="22" fill={col + "18"} stroke={col} strokeWidth="1.5" />
              <text x="710" y={y + 20} textAnchor="middle" fill={col} fontSize="10.5" fontWeight="500">{label}</text>
              <text x="710" y={y + 34} textAnchor="middle" fill={col + "aa"} fontSize="8.5">PostgreSQL / Redis</text>
            </g>
          ))}

          {/* ── service discovery ── */}
          <rect x="570" y="195" width="115" height="40" rx="6" fill={colors.amber + "18"} stroke={colors.amber} strokeWidth="1.5" />
          <text x="627" y="211" textAnchor="middle" fill={colors.amber} fontSize="10" fontWeight="600">Service Registry</text>
          <text x="627" y="225" textAnchor="middle" fill={colors.muted} fontSize="9">Consul / Eureka</text>

          {/* ── arrows: clients → gateway ── */}
          {[99, 209, 319, 429].map((y) => (
            <g key={y}>
              <line x1="155" y1={y} x2="195" y2={y} stroke={colors.blue} strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
              <text x="175" y={y - 4} textAnchor="middle" fill={colors.blue} fontSize="8">HTTP/S</text>
            </g>
          ))}

          {/* ── arrows: gateway → services ── */}
          {[79, 169, 259, 349, 439].map((y) => (
            <line key={y} x1="356" y1={y} x2="400" y2={y} stroke={colors.green} strokeWidth="1.5" markerEnd="url(#arrow-green)" />
          ))}
          <text x="378" y="64" textAnchor="middle" fill={colors.green} fontSize="7.5">routed req</text>

          {/* ── arrows: services → db ── */}
          {[84, 174, 264, 354, 444].map((y) => (
            <line key={y} x1="541" y1={y} x2="644" y2={y} stroke={colors.purple} strokeWidth="1.3" strokeDasharray="4,2" markerEnd="url(#arrow-purple)" />
          ))}

          {/* ── arrow: gateway → registry ── */}
          <line x1="355" y1="215" x2="570" y2="215" stroke={colors.amber} strokeWidth="1.3" strokeDasharray="4,2" markerEnd="url(#arrow-amber)" />
          <text x="463" y="209" textAnchor="middle" fill={colors.amber} fontSize="7.5">discover</text>

          {/* ── response arrow back ── */}
          <path d="M 355 460 Q 420 490 420 490" stroke={colors.green} strokeWidth="0" fill="none" />
          <line x1="195" y1="490" x2="156" y2="490" stroke={colors.green} strokeWidth="1.5" markerEnd="url(#arrow-green)" />
          <line x1="355" y1="490" x2="196" y2="490" stroke={colors.green} strokeWidth="1.5" />
          <text x="265" y="484" textAnchor="middle" fill={colors.green} fontSize="7.5">aggregated response</text>
        </svg>
      </div>

      {/* Legend */}
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          padding: "12px 16px",
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span style={{ color: colors.muted, fontSize: 11, fontWeight: 600, alignSelf: "center" }}>LEGEND</span>
        {[
          { color: colors.blue, label: "Client request (inbound)" },
          { color: colors.green, label: "Routed / aggregated response" },
          { color: colors.purple, label: "Storage I/O" },
          { color: colors.amber, label: "Async / event / discovery" },
          { color: colors.red, label: "Security / circuit breaker" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 24, height: 2, background: color, borderRadius: 2 }} />
            <span style={{ color: colors.muted, fontSize: 11 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* BFF variant diagram */}
      <h3 style={{ color: colors.text, fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
        BFF Variant — Backend for Frontend
      </h3>
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 10,
          padding: 20,
          marginBottom: 20,
          overflowX: "auto",
        }}
      >
        <svg viewBox="0 0 780 220" width="100%" style={{ display: "block" }}>
          <defs>
            {["blue","green","amber"].map((c) => (
              <marker key={c} id={`b-arrow-${c}`} markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
                <path d="M0,0 L0,5 L7,2.5 z" fill={colors[c]} />
              </marker>
            ))}
          </defs>

          {/* clients */}
          {[
            { x: 20, label: "Web", icon: "🌐" },
            { x: 110, label: "Mobile", icon: "📱" },
            { x: 200, label: "Partner", icon: "🔗" },
          ].map(({ x, label, icon }) => (
            <g key={label}>
              <rect x={x} y="80" width="80" height="50" rx="6" fill={colors.surface} stroke={colors.border} strokeWidth="1.5" />
              <text x={x + 40} y="102" textAnchor="middle" fill={colors.text} fontSize="18">{icon}</text>
              <text x={x + 40} y="118" textAnchor="middle" fill={colors.text} fontSize="10.5">{label}</text>
            </g>
          ))}

          {/* BFF gateways */}
          {[
            { x: 330, label: "Web BFF", col: colors.blue },
            { x: 430, label: "Mobile BFF", col: colors.green },
            { x: 530, label: "Partner BFF", col: colors.amber },
          ].map(({ x, label, col }) => (
            <g key={label}>
              <rect x={x} y="80" width="90" height="50" rx="6" fill={col + "18"} stroke={col} strokeWidth="1.5" />
              <text x={x + 45} y="102" textAnchor="middle" fill={col} fontSize="10.5" fontWeight="600">{label}</text>
              <text x={x + 45} y="118" textAnchor="middle" fill={colors.muted} fontSize="8.5">tailored API</text>
            </g>
          ))}

          {/* shared services */}
          <rect x="680" y="40" width="90" height="140" rx="8" fill={colors.green + "10"} stroke={colors.green} strokeWidth="1.5" />
          <text x="725" y="60" textAnchor="middle" fill={colors.green} fontSize="10" fontWeight="600">Shared</text>
          <text x="725" y="75" textAnchor="middle" fill={colors.green} fontSize="10" fontWeight="600">Services</text>
          {["User", "Order", "Product", "Payment"].map((s, i) => (
            <text key={s} x="725" y={98 + i * 18} textAnchor="middle" fill={colors.muted} fontSize="9">{s} Svc</text>
          ))}

          {/* arrows client → bff */}
          {[[60, 370], [150, 475], [240, 575]].map(([cx, bx], i) => (
            <line key={i} x1={cx} y1="105" x2={bx} y2="105" stroke={[colors.blue, colors.green, colors.amber][i]} strokeWidth="1.5" markerEnd={`url(#b-arrow-${["blue","green","amber"][i]})`} />
          ))}

          {/* arrows bff → services */}
          {[[375, colors.blue], [475, colors.green], [575, colors.amber]].map(([x, c], i) => (
            <line key={i} x1={x} y1="105" x2="680" y2="105" stroke={c} strokeWidth="1.3" strokeDasharray="4,2" markerEnd="url(#b-arrow-green)" />
          ))}

          <text x="390" y="24" textAnchor="middle" fill={colors.muted} fontSize="10" fontWeight="600">
            Each frontend gets a purpose-built gateway facade — avoids over-fetching / under-fetching
          </text>
        </svg>
      </div>

      {/* Cloud Mapping Table */}
      <h3 style={{ color: colors.text, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        Cloud Provider Mapping
      </h3>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12.5,
            color: colors.text,
          }}
        >
          <thead>
            <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
              {["Component", "AWS", "Azure", "GCP"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    color: colors.muted,
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: 0.5,
                    background: colors.surface,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                comp: "API Gateway (managed)",
                aws: "API Gateway (REST/HTTP/WS)",
                azure: "API Management (APIM)",
                gcp: "Cloud Endpoints / API Gateway",
              },
              {
                comp: "Edge / WAF",
                aws: "CloudFront + WAF",
                azure: "Front Door + WAF",
                gcp: "Cloud Armor + Cloud CDN",
              },
              {
                comp: "Service Mesh",
                aws: "App Mesh (Envoy)",
                azure: "Service Fabric / NGINX Ingress",
                gcp: "Traffic Director / Anthos",
              },
              {
                comp: "Auth / AuthZ",
                aws: "Cognito + Lambda Authorizer",
                azure: "Azure AD B2C + Policy",
                gcp: "Identity Platform + IAP",
              },
              {
                comp: "Rate Limiting",
                aws: "Usage Plans + WAF rules",
                azure: "APIM Rate-limit policy",
                gcp: "Cloud Armor rate-based rules",
              },
              {
                comp: "Observability",
                aws: "CloudWatch + X-Ray",
                azure: "Monitor + App Insights",
                gcp: "Cloud Monitoring + Trace",
              },
              {
                comp: "Service Discovery",
                aws: "Cloud Map / Route 53",
                azure: "Service Fabric DNS / AKS",
                gcp: "Cloud DNS / GKE Service",
              },
              {
                comp: "Self-hosted Option",
                aws: "Kong / Envoy on EKS",
                azure: "Kong / Nginx on AKS",
                gcp: "Kong / Envoy on GKE",
              },
            ].map((row, i) => (
              <tr
                key={row.comp}
                style={{
                  borderBottom: `1px solid ${colors.border}`,
                  background: i % 2 === 0 ? "transparent" : colors.surface + "88",
                }}
              >
                <td style={{ padding: "9px 12px", color: colors.text, fontWeight: 500 }}>{row.comp}</td>
                <td style={{ padding: "9px 12px", color: colors.aws }}>{row.aws}</td>
                <td style={{ padding: "9px 12px", color: colors.azure }}>{row.azure}</td>
                <td style={{ padding: "9px 12px", color: colors.gcp }}>{row.gcp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 2: Core Concepts ─────────────────────────────────────────────────────

function ConceptCard({ term, source, definition, why, mistake, extra }) {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        padding: "16px 18px",
        marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ color: colors.text, fontWeight: 600, fontSize: 14 }}>{term}</span>
        {source && badge(`source: ${source}`, colors.muted)}
      </div>
      <p style={{ color: colors.text, fontSize: 13, margin: "0 0 8px", lineHeight: 1.6 }}>{definition}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={{ color: colors.green, fontSize: 12 }}>
          <strong>Why it matters: </strong>{why}
        </span>
        <span style={{ color: colors.red, fontSize: 12 }}>
          <strong>Common mistake: </strong>{mistake}
        </span>
        {extra && <span style={{ color: colors.amber, fontSize: 12 }}><strong>Note: </strong>{extra}</span>}
      </div>
    </div>
  );
}

function ConceptsTab() {
  return (
    <div>
      <ConceptCard
        term="API Gateway Pattern"
        source="Richardson / microservices.io"
        definition="A single entry-point service that sits between clients and a collection of backend microservices. It is structurally analogous to the Facade pattern in OOD, but applied as a distributed reverse proxy using a synchronous communication model."
        why="Without a gateway, clients are directly coupled to internal service topology. Every refactor — renaming a service, splitting a domain, adding a new instance — forces client-side updates. The gateway provides a stable contract surface while backends evolve freely."
        mistake="Treating a gateway as a dumb router. The value comes from cross-cutting concern centralisation (auth, rate limiting, observability). Routing-only gateways miss most of the benefit."
      />
      <ConceptCard
        term="Backend for Frontend (BFF)"
        source="Sam Newman / Richardson (microservices.io)"
        definition="A specialisation of the gateway pattern where each distinct client type — web, mobile, partner API — gets its own dedicated gateway facade. Each BFF is optimised for the data shape, protocol, and performance profile of its target client."
        why="A single universal gateway accumulates conflicting requirements across clients. Mobile needs lean payloads; web needs rich aggregations; partner APIs need stable versioned contracts. BFF separates these concerns at the edge rather than burdening every downstream service."
        mistake="Building a BFF per microservice rather than per client type. BFF granularity is client-driven, not service-driven. One BFF per client form factor is the correct axis of decomposition."
        extra="Used by SoundCloud (origin of the term, coined by Phil Calçado) and Netflix for device-specific edge handling."
      />
      <ConceptCard
        term="Request Aggregation (API Composition)"
        source="Richardson (microservices.io)"
        definition="The gateway fans out a single inbound request to multiple downstream services, awaits all responses, then merges them into one payload before returning to the client. Reduces client round-trips from N to 1 for composite views."
        why="In microservices, data for a single screen is typically owned by multiple services. Without aggregation, clients must coordinate multiple sequential or parallel calls, adding latency and complexity to every frontend."
        mistake="Implementing aggregation as sequential calls. Fan-out requests must be executed in parallel (Promise.all, goroutines, async gather) to avoid additive latency. Sequential aggregation defeats the purpose."
      />
      <ConceptCard
        term="Protocol Translation"
        source="AWS Architecture Guide / Microsoft .NET Microservices Guide"
        definition="The gateway accepts one protocol from clients (typically HTTP/REST or WebSocket) and translates to a different protocol when invoking internal services (gRPC, Thrift, AMQP, GraphQL). Clients are shielded from internal protocol decisions."
        why="Internal services often use gRPC for its efficiency and strong typing. External clients typically cannot consume gRPC directly from browsers. The gateway absorbs this impedance mismatch, allowing internal optimisation without external impact."
        mistake="Doing bidirectional protocol translation through the gateway for all traffic. For high-throughput, low-latency service-to-service calls inside the cluster, services should communicate directly (via service mesh) — not route through the public gateway."
      />
      <ConceptCard
        term="Cross-Cutting Concern Centralisation"
        source="Microsoft .NET Microservices Architecture Guide"
        definition="Authentication, authorization, rate limiting, TLS termination, logging, distributed tracing, and CORS handling are implemented once in the gateway rather than duplicated across every downstream service."
        why="With 50+ microservices, implementing JWT validation in each one creates 50 surfaces for security bugs, 50 places to rotate keys, and 50 inconsistent audit logs. Centralising these concerns at the edge is operationally sound and reduces the attack surface."
        mistake="Confusing 'centralised enforcement' with 'centralised implementation'. Auth enforcement lives at the gateway; auth identity provider (Keycloak, Cognito, Azure AD) lives separately. The gateway verifies tokens — it does not issue them."
      />
      <ConceptCard
        term="Circuit Breaker at the Gateway"
        source="Netflix Hystrix (deprecated) → Resilience4j / Envoy"
        definition="The gateway tracks failure rates per downstream service. When a threshold is exceeded, it opens a circuit — immediately returning cached fallback responses or 503s — rather than allowing requests to cascade into a degraded service."
        why="Without circuit breaking at the edge, a slow downstream service can exhaust gateway thread pools, causing cascading failure that takes down unrelated services. The gateway is the optimal placement because it can isolate downstream failures before they propagate to clients."
        mistake="Relying solely on gateway-level circuit breakers. Internal service-to-service calls need their own circuit breakers (at the service mesh or library level). Gateway breakers only protect the client-to-backend path."
      />
      <ConceptCard
        term="Rate Limiting and Traffic Shaping"
        source="Cloudflare Engineering / AWS API Gateway docs"
        definition="The gateway enforces per-client, per-endpoint, or per-tier quotas on request volume. Exceeding the quota returns 429 Too Many Requests. Traffic shaping can also throttle or delay requests rather than reject them outright."
        why="Without rate limiting at the edge, a single misbehaving client (or DDoS attack) can saturate backend services. Enforcement at the gateway means backend services never need to reason about request volume — they trust the gateway has enforced the contract."
        mistake="Implementing rate limiting purely in memory on a single gateway instance. Distributed rate limiting across a gateway cluster requires a shared counter store (Redis with atomic INCR, or a gossip protocol). Single-instance counters fail when the gateway is horizontally scaled."
        extra="Netflix's Zuul implements load shedding at the edge — allocating capacity per request type and dropping overflow before it reaches the application tier."
      />

      {/* Trade-offs */}
      <div
        style={{
          background: "#f59e0b08",
          border: `1px solid ${colors.amber}44`,
          borderRadius: 8,
          padding: "16px 18px",
          marginBottom: 14,
        }}
      >
        <h3 style={{ color: colors.amber, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          Trade-offs: When to Use / When to Avoid
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            {
              title: "✅ Use When",
              color: colors.green,
              items: [
                "Multiple client types with divergent data needs (→ BFF)",
                "Cross-cutting concerns need uniform enforcement (auth, rate limiting, logging)",
                "Backend topology changes frequently and clients cannot absorb churn",
                "Protocol impedance mismatch between clients and internal services",
                "Centralised observability and distributed tracing are requirements",
                "Third-party API monetisation with usage plans",
              ],
            },
            {
              title: "❌ Avoid When / Watch Out For",
              color: colors.red,
              items: [
                "Single client type with a small, stable service count — overhead not justified",
                "Ultra-low latency paths (sub-millisecond) — every hop adds ~1–5 ms",
                "Encoding business logic in the gateway — it becomes a monolith at the edge",
                "Single gateway for all services without BFF decomposition — becomes a bottleneck",
                "Synchronous aggregation of slow services — latency = slowest call, not average",
                "Treating the gateway as a service mesh — gateways handle north-south traffic; meshes handle east-west",
              ],
            },
          ].map(({ title, color, items }) => (
            <div key={title}>
              <p style={{ color, fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{title}</p>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {items.map((item) => (
                  <li key={item} style={{ color: colors.text, fontSize: 12, marginBottom: 5, lineHeight: 1.5 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Real-world examples */}
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          padding: "14px 18px",
        }}
      >
        <h3 style={{ color: colors.text, fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
          Real-World Implementations
        </h3>
        {[
          {
            company: "Netflix",
            detail: "Uses Zuul as the front door for all external traffic. Zuul handles dynamic routing, authentication, load shedding, and multi-region failover across its streaming microservices. (Source: Netflix Tech Blog / github.com/Netflix/zuul)",
            col: colors.red,
          },
          {
            company: "Amazon",
            detail: "AWS API Gateway itself is a product born from Amazon's internal need — every Amazon service is accessed via gateway-enforced contracts. Internally, they use service-level gateways that enforce IAM-based auth and usage quotas.",
            col: colors.aws,
          },
          {
            company: "SoundCloud",
            detail: "Coined the BFF pattern when splitting their Rails monolith into microservices. Each client (web, iOS, Android) received a dedicated backend gateway to decouple frontend evolution from backend topology. (Source: Phil Calçado, SoundCloud Engineering Blog)",
            col: colors.blue,
          },
          {
            company: "Uber",
            detail: "Uses an API gateway tier (built on Envoy) to handle the North-South traffic boundary, with Jaeger integration for distributed tracing across their 1000+ microservices. (Source: Uber Engineering Blog)",
            col: colors.green,
          },
        ].map(({ company, detail, col }) => (
          <div key={company} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
            {badge(company, col)}
            <span style={{ color: colors.muted, fontSize: 12, lineHeight: 1.6 }}>{detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 3: Implementations ───────────────────────────────────────────────────

const IMPL_TABS = ["Core", "AWS", "Azure", "GCP"];
const IMPL_TAB_COLORS = { Core: colors.blue, AWS: colors.aws, Azure: colors.azure, GCP: colors.gcp };

const CORE_LANGS = ["Go", "Python", "TypeScript", "Rust", "Java"];

const coreCode = {
  Go: `// Pattern: API Gateway
// Reference: Richardson - microservices.io; Chris Richardson "Microservices Patterns" Ch.8
// Production note: Use context propagation for tracing; integrate with Prometheus for metrics

package gateway

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"
)

// ── Domain Types ──────────────────────────────────────────────────────────────

type ServiceID string

type Route struct {
	Prefix      string
	ServiceID   ServiceID
	StripPrefix bool
}

type Request struct {
	Method  string
	Path    string
	Headers map[string]string
	Body    []byte
	TraceID string
}

type Response struct {
	StatusCode int
	Headers    map[string]string
	Body       []byte
	ServiceID  ServiceID
	Latency    time.Duration
}

// ── Core Interfaces ────────────────────────────────────────────────────────────

type Authenticator interface {
	Authenticate(ctx context.Context, req *Request) (identity string, err error)
}

type RateLimiter interface {
	Allow(ctx context.Context, identity string) (allowed bool, retryAfterMs int64)
}

type ServiceRegistry interface {
	Lookup(ctx context.Context, id ServiceID) (endpoint string, err error)
}

type Transporter interface {
	Forward(ctx context.Context, endpoint string, req *Request) (*Response, error)
}

type CircuitBreaker interface {
	Allow(serviceID ServiceID) bool
	RecordSuccess(serviceID ServiceID)
	RecordFailure(serviceID ServiceID)
}

// ── In-Memory Implementations ──────────────────────────────────────────────────

// StaticRegistry holds service endpoints for local/test use
type StaticRegistry struct {
	mu        sync.RWMutex
	endpoints map[ServiceID]string
}

func NewStaticRegistry(endpoints map[ServiceID]string) *StaticRegistry {
	return &StaticRegistry{endpoints: endpoints}
}

func (r *StaticRegistry) Lookup(_ context.Context, id ServiceID) (string, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	ep, ok := r.endpoints[id]
	if !ok {
		return "", fmt.Errorf("service %q not registered", id)
	}
	return ep, nil
}

// TokenAuthenticator validates Bearer tokens (stub for demonstration)
type TokenAuthenticator struct {
	validTokens map[string]string // token → identity
}

func NewTokenAuthenticator(tokens map[string]string) *TokenAuthenticator {
	return &TokenAuthenticator{validTokens: tokens}
}

func (a *TokenAuthenticator) Authenticate(_ context.Context, req *Request) (string, error) {
	tok, ok := req.Headers["Authorization"]
	if !ok {
		return "", errors.New("missing Authorization header")
	}
	const prefix = "Bearer "
	if len(tok) <= len(prefix) {
		return "", errors.New("malformed Authorization header")
	}
	identity, valid := a.validTokens[tok[len(prefix):]]
	if !valid {
		return "", errors.New("invalid token")
	}
	return identity, nil
}

// SlidingWindowRateLimiter - per-identity token bucket (in-memory, single instance)
// Production: replace with Redis INCR + TTL for distributed deployments
type SlidingWindowRateLimiter struct {
	mu       sync.Mutex
	counters map[string]*rateBucket
	limit    int
	window   time.Duration
}

type rateBucket struct {
	count     int
	resetAt   time.Time
}

func NewSlidingWindowRateLimiter(limit int, window time.Duration) *SlidingWindowRateLimiter {
	return &SlidingWindowRateLimiter{
		counters: make(map[string]*rateBucket),
		limit:    limit,
		window:   window,
	}
}

func (l *SlidingWindowRateLimiter) Allow(_ context.Context, identity string) (bool, int64) {
	l.mu.Lock()
	defer l.mu.Unlock()
	now := time.Now()
	b, ok := l.counters[identity]
	if !ok || now.After(b.resetAt) {
		l.counters[identity] = &rateBucket{count: 1, resetAt: now.Add(l.window)}
		return true, 0
	}
	if b.count >= l.limit {
		retryAfter := b.resetAt.Sub(now).Milliseconds()
		return false, retryAfter
	}
	b.count++
	return true, 0
}

// SimpleCircuitBreaker - count-based open/close (no half-open for brevity)
type SimpleCircuitBreaker struct {
	mu          sync.RWMutex
	failures    map[ServiceID]int
	openUntil   map[ServiceID]time.Time
	threshold   int
	resetAfter  time.Duration
}

func NewCircuitBreaker(threshold int, resetAfter time.Duration) *SimpleCircuitBreaker {
	return &SimpleCircuitBreaker{
		failures:   make(map[ServiceID]int),
		openUntil:  make(map[ServiceID]time.Time),
		threshold:  threshold,
		resetAfter: resetAfter,
	}
}

func (cb *SimpleCircuitBreaker) Allow(id ServiceID) bool {
	cb.mu.RLock()
	defer cb.mu.RUnlock()
	until, open := cb.openUntil[id]
	return !open || time.Now().After(until)
}

func (cb *SimpleCircuitBreaker) RecordSuccess(id ServiceID) {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	cb.failures[id] = 0
	delete(cb.openUntil, id)
}

func (cb *SimpleCircuitBreaker) RecordFailure(id ServiceID) {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	cb.failures[id]++
	if cb.failures[id] >= cb.threshold {
		cb.openUntil[id] = time.Now().Add(cb.resetAfter)
	}
}

// HTTPTransporter forwards requests via standard net/http
type HTTPTransporter struct {
	client *http.Client
}

func NewHTTPTransporter(timeout time.Duration) *HTTPTransporter {
	return &HTTPTransporter{client: &http.Client{Timeout: timeout}}
}

func (t *HTTPTransporter) Forward(ctx context.Context, endpoint string, req *Request) (*Response, error) {
	start := time.Now()
	url := endpoint + req.Path
	httpReq, err := http.NewRequestWithContext(ctx, req.Method, url, nil)
	if err != nil {
		return nil, fmt.Errorf("building request: %w", err)
	}
	for k, v := range req.Headers {
		httpReq.Header.Set(k, v)
	}
	httpReq.Header.Set("X-Trace-Id", req.TraceID)

	resp, err := t.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("forwarding to %s: %w", endpoint, err)
	}
	defer resp.Body.Close()

	var body []byte
	// read up to 10 MB
	body = make([]byte, 0, 512)
	buf := make([]byte, 4096)
	for {
		n, readErr := resp.Body.Read(buf)
		body = append(body, buf[:n]...)
		if readErr != nil {
			break
		}
	}

	headers := make(map[string]string, len(resp.Header))
	for k := range resp.Header {
		headers[k] = resp.Header.Get(k)
	}

	return &Response{
		StatusCode: resp.StatusCode,
		Headers:    headers,
		Body:       body,
		Latency:    time.Since(start),
	}, nil
}

// ── Gateway ────────────────────────────────────────────────────────────────────

type Gateway struct {
	routes      []Route
	auth        Authenticator
	rateLimiter RateLimiter
	registry    ServiceRegistry
	transport   Transporter
	cb          CircuitBreaker
}

func New(
	routes []Route,
	auth Authenticator,
	rl RateLimiter,
	registry ServiceRegistry,
	transport Transporter,
	cb CircuitBreaker,
) *Gateway {
	return &Gateway{
		routes:      routes,
		auth:        auth,
		rateLimiter: rl,
		registry:    registry,
		transport:   transport,
		cb:          cb,
	}
}

func (g *Gateway) Handle(ctx context.Context, req *Request) (*Response, error) {
	// 1. Authenticate
	identity, err := g.auth.Authenticate(ctx, req)
	if err != nil {
		return &Response{StatusCode: http.StatusUnauthorized,
			Body: jsonError("authentication failed: " + err.Error())}, nil
	}

	// 2. Rate limit
	allowed, retryAfter := g.rateLimiter.Allow(ctx, identity)
	if !allowed {
		resp := &Response{
			StatusCode: http.StatusTooManyRequests,
			Headers:    map[string]string{"Retry-After": fmt.Sprintf("%d", retryAfter/1000)},
			Body:       jsonError("rate limit exceeded"),
		}
		return resp, nil
	}

	// 3. Route resolution
	route, ok := g.matchRoute(req.Path)
	if !ok {
		return &Response{StatusCode: http.StatusNotFound,
			Body: jsonError("no route for path: " + req.Path)}, nil
	}

	// 4. Circuit breaker check
	if !g.cb.Allow(route.ServiceID) {
		return &Response{StatusCode: http.StatusServiceUnavailable,
			Body: jsonError("service " + string(route.ServiceID) + " is temporarily unavailable")}, nil
	}

	// 5. Service discovery
	endpoint, err := g.registry.Lookup(ctx, route.ServiceID)
	if err != nil {
		return nil, fmt.Errorf("service discovery: %w", err)
	}

	// 6. Forward (strip prefix if configured)
	forwardReq := *req
	if route.StripPrefix {
		forwardReq.Path = req.Path[len(route.Prefix):]
		if forwardReq.Path == "" {
			forwardReq.Path = "/"
		}
	}

	resp, err := g.transport.Forward(ctx, endpoint, &forwardReq)
	if err != nil {
		g.cb.RecordFailure(route.ServiceID)
		return nil, fmt.Errorf("upstream request failed: %w", err)
	}

	if resp.StatusCode >= 500 {
		g.cb.RecordFailure(route.ServiceID)
	} else {
		g.cb.RecordSuccess(route.ServiceID)
	}

	resp.ServiceID = route.ServiceID
	return resp, nil
}

func (g *Gateway) matchRoute(path string) (Route, bool) {
	for _, r := range g.routes {
		if len(path) >= len(r.Prefix) && path[:len(r.Prefix)] == r.Prefix {
			return r, true
		}
	}
	return Route{}, false
}

func jsonError(msg string) []byte {
	b, _ := json.Marshal(map[string]string{"error": msg})
	return b
}

// ── Usage Example ──────────────────────────────────────────────────────────────

func Example() {
	registry := NewStaticRegistry(map[ServiceID]string{
		"user-service":    "http://user-svc:8080",
		"product-service": "http://product-svc:8081",
		"order-service":   "http://order-svc:8082",
	})

	auth := NewTokenAuthenticator(map[string]string{
		"valid-token-123": "user-alice",
	})

	rl := NewSlidingWindowRateLimiter(100, time.Minute)
	cb := NewCircuitBreaker(5, 30*time.Second)
	transport := NewHTTPTransporter(5 * time.Second)

	gw := New(
		[]Route{
			{Prefix: "/api/users", ServiceID: "user-service", StripPrefix: false},
			{Prefix: "/api/products", ServiceID: "product-service", StripPrefix: false},
			{Prefix: "/api/orders", ServiceID: "order-service", StripPrefix: false},
		},
		auth, rl, registry, transport, cb,
	)

	ctx := context.Background()
	resp, err := gw.Handle(ctx, &Request{
		Method:  "GET",
		Path:    "/api/users/42",
		Headers: map[string]string{"Authorization": "Bearer valid-token-123"},
		TraceID: "trace-abc-001",
	})
	if err != nil {
		fmt.Printf("error: %v\\n", err)
		return
	}
	fmt.Printf("Status: %d, Service: %s, Latency: %v\\n",
		resp.StatusCode, resp.ServiceID, resp.Latency)
}`,

  Python: `# Pattern: API Gateway
# Reference: Richardson - microservices.io; Sam Newman "Building Microservices" Ch.14
# Production note: Replace InMemoryRateLimiter with Redis-backed store in clustered deployments

from __future__ import annotations
import asyncio
import time
from dataclasses import dataclass, field
from typing import Protocol, runtime_checkable
from enum import Enum
import json
import httpx


# ── Domain Types ──────────────────────────────────────────────────────────────

class ServiceID(str, Enum):
    USER = "user-service"
    PRODUCT = "product-service"
    ORDER = "order-service"


@dataclass(frozen=True)
class Route:
    prefix: str
    service_id: ServiceID
    strip_prefix: bool = False


@dataclass(frozen=True)
class GatewayRequest:
    method: str
    path: str
    headers: dict[str, str]
    body: bytes = b""
    trace_id: str = ""


@dataclass
class GatewayResponse:
    status_code: int
    headers: dict[str, str] = field(default_factory=dict)
    body: bytes = b""
    service_id: ServiceID | None = None
    latency_ms: float = 0.0


# ── Protocols (structural typing) ─────────────────────────────────────────────

@runtime_checkable
class Authenticator(Protocol):
    async def authenticate(self, req: GatewayRequest) -> str:
        """Returns identity string or raises AuthError."""
        ...

@runtime_checkable
class RateLimiter(Protocol):
    def allow(self, identity: str) -> tuple[bool, int]:
        """Returns (allowed, retry_after_seconds)."""
        ...

@runtime_checkable
class ServiceRegistry(Protocol):
    async def lookup(self, service_id: ServiceID) -> str:
        """Returns base URL endpoint or raises LookupError."""
        ...


# ── Custom Exceptions ─────────────────────────────────────────────────────────

class AuthError(Exception): pass
class CircuitOpenError(Exception): pass
class RoutingError(Exception): pass


# ── In-Memory Implementations ──────────────────────────────────────────────────

class TokenAuthenticator:
    def __init__(self, valid_tokens: dict[str, str]) -> None:
        self._tokens = valid_tokens  # token → identity

    async def authenticate(self, req: GatewayRequest) -> str:
        auth_header = req.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            raise AuthError("Missing or malformed Authorization header")
        token = auth_header[len("Bearer "):]
        identity = self._tokens.get(token)
        if identity is None:
            raise AuthError("Invalid token")
        return identity


class InMemoryRateLimiter:
    """Fixed-window rate limiter. Not distributed — use Redis for multi-instance."""
    def __init__(self, limit: int, window_seconds: int) -> None:
        self._limit = limit
        self._window = window_seconds
        self._buckets: dict[str, tuple[int, float]] = {}  # identity → (count, reset_at)

    def allow(self, identity: str) -> tuple[bool, int]:
        now = time.monotonic()
        count, reset_at = self._buckets.get(identity, (0, now + self._window))
        if now > reset_at:
            count, reset_at = 0, now + self._window
        if count >= self._limit:
            return False, max(0, int(reset_at - now))
        self._buckets[identity] = (count + 1, reset_at)
        return True, 0


class StaticServiceRegistry:
    def __init__(self, endpoints: dict[ServiceID, str]) -> None:
        self._endpoints = endpoints

    async def lookup(self, service_id: ServiceID) -> str:
        endpoint = self._endpoints.get(service_id)
        if endpoint is None:
            raise LookupError(f"Service '{service_id}' not registered")
        return endpoint


class CircuitBreaker:
    """Count-based circuit breaker per service."""
    def __init__(self, threshold: int, reset_seconds: float) -> None:
        self._threshold = threshold
        self._reset = reset_seconds
        self._failures: dict[ServiceID, int] = {}
        self._open_until: dict[ServiceID, float] = {}

    def is_closed(self, service_id: ServiceID) -> bool:
        until = self._open_until.get(service_id, 0.0)
        return time.monotonic() > until

    def record_success(self, service_id: ServiceID) -> None:
        self._failures.pop(service_id, None)
        self._open_until.pop(service_id, None)

    def record_failure(self, service_id: ServiceID) -> None:
        count = self._failures.get(service_id, 0) + 1
        self._failures[service_id] = count
        if count >= self._threshold:
            self._open_until[service_id] = time.monotonic() + self._reset


# ── Gateway ────────────────────────────────────────────────────────────────────

class APIGateway:
    def __init__(
        self,
        routes: list[Route],
        auth: Authenticator,
        rate_limiter: RateLimiter,
        registry: ServiceRegistry,
        circuit_breaker: CircuitBreaker,
        timeout_seconds: float = 5.0,
    ) -> None:
        self._routes = routes
        self._auth = auth
        self._rl = rate_limiter
        self._registry = registry
        self._cb = circuit_breaker
        self._timeout = timeout_seconds

    async def handle(self, req: GatewayRequest) -> GatewayResponse:
        # 1. Authenticate
        try:
            identity = await self._auth.authenticate(req)
        except AuthError as exc:
            return GatewayResponse(
                status_code=401,
                body=_json_error(str(exc)),
            )

        # 2. Rate limit
        allowed, retry_after = self._rl.allow(identity)
        if not allowed:
            return GatewayResponse(
                status_code=429,
                headers={"Retry-After": str(retry_after)},
                body=_json_error("Rate limit exceeded"),
            )

        # 3. Route match
        route = self._match_route(req.path)
        if route is None:
            return GatewayResponse(
                status_code=404,
                body=_json_error(f"No route for path: {req.path}"),
            )

        # 4. Circuit breaker
        if not self._cb.is_closed(route.service_id):
            return GatewayResponse(
                status_code=503,
                body=_json_error(f"Service {route.service_id} is temporarily unavailable"),
            )

        # 5. Discover endpoint
        try:
            endpoint = await self._registry.lookup(route.service_id)
        except LookupError as exc:
            return GatewayResponse(status_code=503, body=_json_error(str(exc)))

        # 6. Forward
        forward_path = req.path[len(route.prefix):] or "/" if route.strip_prefix else req.path
        start = time.monotonic()

        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                upstream_resp = await client.request(
                    method=req.method,
                    url=endpoint + forward_path,
                    headers={**req.headers, "X-Trace-Id": req.trace_id},
                    content=req.body,
                )
        except httpx.TimeoutException:
            self._cb.record_failure(route.service_id)
            return GatewayResponse(
                status_code=504,
                body=_json_error("Upstream request timed out"),
            )
        except httpx.RequestError as exc:
            self._cb.record_failure(route.service_id)
            return GatewayResponse(
                status_code=502,
                body=_json_error(f"Bad gateway: {exc}"),
            )

        latency_ms = (time.monotonic() - start) * 1000
        if upstream_resp.status_code >= 500:
            self._cb.record_failure(route.service_id)
        else:
            self._cb.record_success(route.service_id)

        return GatewayResponse(
            status_code=upstream_resp.status_code,
            headers=dict(upstream_resp.headers),
            body=upstream_resp.content,
            service_id=route.service_id,
            latency_ms=latency_ms,
        )

    def _match_route(self, path: str) -> Route | None:
        for route in self._routes:
            if path.startswith(route.prefix):
                return route
        return None


# ── Helpers ───────────────────────────────────────────────────────────────────

def _json_error(msg: str) -> bytes:
    return json.dumps({"error": msg}).encode()


# ── Usage Example ──────────────────────────────────────────────────────────────

async def main() -> None:
    gw = APIGateway(
        routes=[
            Route("/api/users", ServiceID.USER),
            Route("/api/products", ServiceID.PRODUCT),
            Route("/api/orders", ServiceID.ORDER),
        ],
        auth=TokenAuthenticator({"secret-token-abc": "user-alice"}),
        rate_limiter=InMemoryRateLimiter(limit=100, window_seconds=60),
        registry=StaticServiceRegistry({
            ServiceID.USER:    "http://user-svc:8080",
            ServiceID.PRODUCT: "http://product-svc:8081",
            ServiceID.ORDER:   "http://order-svc:8082",
        }),
        circuit_breaker=CircuitBreaker(threshold=5, reset_seconds=30),
    )

    resp = await gw.handle(GatewayRequest(
        method="GET",
        path="/api/users/42",
        headers={"Authorization": "Bearer secret-token-abc"},
        trace_id="trace-001",
    ))
    print(f"Status: {resp.status_code}, Service: {resp.service_id}, Latency: {resp.latency_ms:.1f}ms")


if __name__ == "__main__":
    asyncio.run(main())`,

  TypeScript: `// Pattern: API Gateway
// Reference: Richardson - microservices.io; Microsoft .NET Microservices Guide
// Production note: Replace InMemoryRateLimiter with ioredis + Lua script for distributed deployments

import { z } from "zod";

// ── Domain Types ──────────────────────────────────────────────────────────────

const ServiceIDSchema = z.enum(["user-service", "product-service", "order-service"]);
type ServiceID = z.infer<typeof ServiceIDSchema>;

interface Route {
  readonly prefix: string;
  readonly serviceId: ServiceID;
  readonly stripPrefix?: boolean;
}

interface GatewayRequest {
  readonly method: string;
  readonly path: string;
  readonly headers: Readonly<Record<string, string>>;
  readonly body?: Uint8Array;
  readonly traceId?: string;
}

interface GatewayResponse {
  readonly statusCode: number;
  readonly headers: Record<string, string>;
  readonly body: Uint8Array;
  readonly serviceId?: ServiceID;
  readonly latencyMs: number;
}

// Discriminated union for gateway errors
type GatewayError =
  | { kind: "unauthorized"; message: string }
  | { kind: "rate_limited"; retryAfterSeconds: number }
  | { kind: "not_found"; path: string }
  | { kind: "circuit_open"; serviceId: ServiceID }
  | { kind: "upstream_error"; statusCode: number; serviceId: ServiceID }
  | { kind: "timeout"; serviceId: ServiceID };

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

// ── Interfaces ─────────────────────────────────────────────────────────────────

interface Authenticator {
  authenticate(req: GatewayRequest): Promise<Result<string, string>>;
}

interface RateLimiter {
  allow(identity: string): { allowed: boolean; retryAfterSeconds: number };
}

interface ServiceRegistry {
  lookup(serviceId: ServiceID): Promise<Result<string, string>>;
}

interface CircuitBreaker {
  isClosed(serviceId: ServiceID): boolean;
  recordSuccess(serviceId: ServiceID): void;
  recordFailure(serviceId: ServiceID): void;
}

// ── In-Memory Implementations ──────────────────────────────────────────────────

class TokenAuthenticator implements Authenticator {
  constructor(private readonly validTokens: Map<string, string>) {}

  async authenticate(req: GatewayRequest): Promise<Result<string, string>> {
    const authHeader = req.headers["authorization"] ?? req.headers["Authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return err("Missing or malformed Authorization header");
    }
    const token = authHeader.slice("Bearer ".length);
    const identity = this.validTokens.get(token);
    if (!identity) return err("Invalid token");
    return ok(identity);
  }
}

class InMemoryRateLimiter implements RateLimiter {
  // Fixed-window. Production: use Redis INCR + EXPIRE for distributed enforcement.
  private readonly buckets = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  allow(identity: string): { allowed: boolean; retryAfterSeconds: number } {
    const now = Date.now();
    const bucket = this.buckets.get(identity);
    if (!bucket || now > bucket.resetAt) {
      this.buckets.set(identity, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    if (bucket.count >= this.limit) {
      return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
    }
    bucket.count++;
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

class StaticServiceRegistry implements ServiceRegistry {
  constructor(private readonly endpoints: Map<ServiceID, string>) {}

  async lookup(serviceId: ServiceID): Promise<Result<string, string>> {
    const endpoint = this.endpoints.get(serviceId);
    if (!endpoint) return err(\`Service '\${serviceId}' not registered\`);
    return ok(endpoint);
  }
}

class CountBasedCircuitBreaker implements CircuitBreaker {
  private readonly failures = new Map<ServiceID, number>();
  private readonly openUntil = new Map<ServiceID, number>();

  constructor(
    private readonly threshold: number,
    private readonly resetMs: number,
  ) {}

  isClosed(serviceId: ServiceID): boolean {
    const until = this.openUntil.get(serviceId) ?? 0;
    return Date.now() > until;
  }

  recordSuccess(serviceId: ServiceID): void {
    this.failures.delete(serviceId);
    this.openUntil.delete(serviceId);
  }

  recordFailure(serviceId: ServiceID): void {
    const count = (this.failures.get(serviceId) ?? 0) + 1;
    this.failures.set(serviceId, count);
    if (count >= this.threshold) {
      this.openUntil.set(serviceId, Date.now() + this.resetMs);
    }
  }
}

// ── Gateway ────────────────────────────────────────────────────────────────────

class APIGateway {
  constructor(
    private readonly routes: readonly Route[],
    private readonly auth: Authenticator,
    private readonly rateLimiter: RateLimiter,
    private readonly registry: ServiceRegistry,
    private readonly cb: CircuitBreaker,
    private readonly timeoutMs: number = 5000,
  ) {}

  async handle(req: GatewayRequest): Promise<Result<GatewayResponse, GatewayError>> {
    // 1. Authenticate
    const authResult = await this.auth.authenticate(req);
    if (!authResult.ok) {
      return err({ kind: "unauthorized", message: authResult.error });
    }
    const identity = authResult.value;

    // 2. Rate limit
    const { allowed, retryAfterSeconds } = this.rateLimiter.allow(identity);
    if (!allowed) {
      return err({ kind: "rate_limited", retryAfterSeconds });
    }

    // 3. Route
    const route = this.matchRoute(req.path);
    if (!route) {
      return err({ kind: "not_found", path: req.path });
    }

    // 4. Circuit breaker
    if (!this.cb.isClosed(route.serviceId)) {
      return err({ kind: "circuit_open", serviceId: route.serviceId });
    }

    // 5. Discover
    const lookupResult = await this.registry.lookup(route.serviceId);
    if (!lookupResult.ok) {
      return err({ kind: "circuit_open", serviceId: route.serviceId }); // treat as unavailable
    }

    // 6. Forward
    const forwardPath = route.stripPrefix
      ? req.path.slice(route.prefix.length) || "/"
      : req.path;

    const url = \`\${lookupResult.value}\${forwardPath}\`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const start = Date.now();

    try {
      const response = await fetch(url, {
        method: req.method,
        headers: { ...req.headers, "x-trace-id": req.traceId ?? "" },
        body: req.body,
        signal: controller.signal,
      });

      const body = new Uint8Array(await response.arrayBuffer());
      const latencyMs = Date.now() - start;

      if (response.status >= 500) {
        this.cb.recordFailure(route.serviceId);
      } else {
        this.cb.recordSuccess(route.serviceId);
      }

      const headers: Record<string, string> = {};
      response.headers.forEach((v, k) => { headers[k] = v; });

      return ok({ statusCode: response.status, headers, body, serviceId: route.serviceId, latencyMs });
    } catch (error) {
      clearTimeout(timer);
      this.cb.recordFailure(route.serviceId);
      if (error instanceof DOMException && error.name === "AbortError") {
        return err({ kind: "timeout", serviceId: route.serviceId });
      }
      return err({ kind: "upstream_error", statusCode: 502, serviceId: route.serviceId });
    } finally {
      clearTimeout(timer);
    }
  }

  private matchRoute(path: string): Route | undefined {
    return this.routes.find((r) => path.startsWith(r.prefix));
  }
}

// ── Usage Example ──────────────────────────────────────────────────────────────

async function main() {
  const gw = new APIGateway(
    [
      { prefix: "/api/users",    serviceId: "user-service"    },
      { prefix: "/api/products", serviceId: "product-service" },
      { prefix: "/api/orders",   serviceId: "order-service"   },
    ],
    new TokenAuthenticator(new Map([["secret-token-abc", "user-alice"]])),
    new InMemoryRateLimiter(100, 60_000),
    new StaticServiceRegistry(new Map([
      ["user-service",    "http://user-svc:8080"],
      ["product-service", "http://product-svc:8081"],
      ["order-service",   "http://order-svc:8082"],
    ])),
    new CountBasedCircuitBreaker(5, 30_000),
  );

  const result = await gw.handle({
    method: "GET",
    path: "/api/users/42",
    headers: { Authorization: "Bearer secret-token-abc" },
    traceId: "trace-001",
  });

  if (result.ok) {
    const { statusCode, serviceId, latencyMs } = result.value;
    console.log(\`Status: \${statusCode} | Service: \${serviceId} | Latency: \${latencyMs}ms\`);
  } else {
    console.error("Gateway error:", result.error);
  }
}

main();`,

  Rust: `// Pattern: API Gateway
// Reference: Richardson - microservices.io; "Designing Distributed Systems" (Burns)
// Production note: Replace InMemoryRateLimiter with Redis-backed store; add OpenTelemetry spans

use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
    time::{Duration, Instant},
};

use thiserror::Error;

// ── Domain Types ──────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum ServiceId {
    UserService,
    ProductService,
    OrderService,
}

impl std::fmt::Display for ServiceId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ServiceId::UserService    => write!(f, "user-service"),
            ServiceId::ProductService => write!(f, "product-service"),
            ServiceId::OrderService   => write!(f, "order-service"),
        }
    }
}

#[derive(Debug, Clone)]
pub struct Route {
    pub prefix:       String,
    pub service_id:   ServiceId,
    pub strip_prefix: bool,
}

#[derive(Debug, Clone)]
pub struct GatewayRequest {
    pub method:   String,
    pub path:     String,
    pub headers:  HashMap<String, String>,
    pub body:     Vec<u8>,
    pub trace_id: String,
}

#[derive(Debug)]
pub struct GatewayResponse {
    pub status_code: u16,
    pub headers:     HashMap<String, String>,
    pub body:        Vec<u8>,
    pub service_id:  Option<ServiceId>,
    pub latency_ms:  u64,
}

// ── Errors ─────────────────────────────────────────────────────────────────────

#[derive(Debug, Error)]
pub enum GatewayError {
    #[error("authentication failed: {0}")]
    Unauthorized(String),

    #[error("rate limit exceeded; retry after {retry_after_secs}s")]
    RateLimited { retry_after_secs: u64 },

    #[error("no route matched path: {0}")]
    NotFound(String),

    #[error("circuit open for service {0}")]
    CircuitOpen(ServiceId),

    #[error("service discovery failed: {0}")]
    DiscoveryFailed(String),

    #[error("upstream request failed: {0}")]
    UpstreamFailed(String),

    #[error("upstream request timed out")]
    Timeout,
}

// ── Traits ─────────────────────────────────────────────────────────────────────

pub trait Authenticator: Send + Sync {
    fn authenticate(&self, req: &GatewayRequest) -> Result<String, GatewayError>;
}

pub trait RateLimiter: Send + Sync {
    fn allow(&self, identity: &str) -> Result<(), GatewayError>;
}

pub trait ServiceRegistry: Send + Sync {
    fn lookup(&self, service_id: &ServiceId) -> Result<String, GatewayError>;
}

pub trait CircuitBreaker: Send + Sync {
    fn is_closed(&self, service_id: &ServiceId) -> bool;
    fn record_success(&self, service_id: &ServiceId);
    fn record_failure(&self, service_id: &ServiceId);
}

// ── In-Memory Implementations ──────────────────────────────────────────────────

pub struct TokenAuthenticator {
    valid_tokens: HashMap<String, String>, // token → identity
}

impl TokenAuthenticator {
    pub fn new(tokens: HashMap<String, String>) -> Self {
        Self { valid_tokens: tokens }
    }
}

impl Authenticator for TokenAuthenticator {
    fn authenticate(&self, req: &GatewayRequest) -> Result<String, GatewayError> {
        let auth = req
            .headers
            .get("Authorization")
            .or_else(|| req.headers.get("authorization"))
            .ok_or_else(|| GatewayError::Unauthorized("missing Authorization header".into()))?;

        let token = auth
            .strip_prefix("Bearer ")
            .ok_or_else(|| GatewayError::Unauthorized("malformed Authorization header".into()))?;

        self.valid_tokens
            .get(token)
            .cloned()
            .ok_or_else(|| GatewayError::Unauthorized("invalid token".into()))
    }
}

struct RateBucket {
    count:    u32,
    reset_at: Instant,
}

pub struct InMemoryRateLimiter {
    buckets:        Arc<RwLock<HashMap<String, RateBucket>>>,
    limit:          u32,
    window:         Duration,
}

impl InMemoryRateLimiter {
    pub fn new(limit: u32, window: Duration) -> Self {
        Self {
            buckets: Arc::new(RwLock::new(HashMap::new())),
            limit,
            window,
        }
    }
}

impl RateLimiter for InMemoryRateLimiter {
    fn allow(&self, identity: &str) -> Result<(), GatewayError> {
        let now = Instant::now();
        let mut buckets = self.buckets.write().unwrap();
        let bucket = buckets.entry(identity.to_owned()).or_insert(RateBucket {
            count:    0,
            reset_at: now + self.window,
        });

        if now > bucket.reset_at {
            bucket.count    = 0;
            bucket.reset_at = now + self.window;
        }

        if bucket.count >= self.limit {
            let retry_after_secs = bucket.reset_at.duration_since(now).as_secs();
            return Err(GatewayError::RateLimited { retry_after_secs });
        }

        bucket.count += 1;
        Ok(())
    }
}

pub struct StaticServiceRegistry {
    endpoints: HashMap<String, String>,
}

impl StaticServiceRegistry {
    pub fn new(endpoints: HashMap<String, String>) -> Self {
        Self { endpoints }
    }
}

impl ServiceRegistry for StaticServiceRegistry {
    fn lookup(&self, service_id: &ServiceId) -> Result<String, GatewayError> {
        self.endpoints
            .get(&service_id.to_string())
            .cloned()
            .ok_or_else(|| GatewayError::DiscoveryFailed(format!("'{}' not registered", service_id)))
    }
}

struct CbState {
    failures:   HashMap<ServiceId, u32>,
    open_until: HashMap<ServiceId, Instant>,
}

pub struct CountBasedCircuitBreaker {
    state:      Arc<RwLock<CbState>>,
    threshold:  u32,
    reset_after: Duration,
}

impl CountBasedCircuitBreaker {
    pub fn new(threshold: u32, reset_after: Duration) -> Self {
        Self {
            state: Arc::new(RwLock::new(CbState {
                failures:   HashMap::new(),
                open_until: HashMap::new(),
            })),
            threshold,
            reset_after,
        }
    }
}

impl CircuitBreaker for CountBasedCircuitBreaker {
    fn is_closed(&self, service_id: &ServiceId) -> bool {
        let state = self.state.read().unwrap();
        state
            .open_until
            .get(service_id)
            .map_or(true, |until| Instant::now() > *until)
    }

    fn record_success(&self, service_id: &ServiceId) {
        let mut state = self.state.write().unwrap();
        state.failures.remove(service_id);
        state.open_until.remove(service_id);
    }

    fn record_failure(&self, service_id: &ServiceId) {
        let mut state = self.state.write().unwrap();
        let count = state.failures.entry(service_id.clone()).or_insert(0);
        *count += 1;
        if *count >= self.threshold {
            state.open_until.insert(service_id.clone(), Instant::now() + self.reset_after);
        }
    }
}

// ── Gateway ────────────────────────────────────────────────────────────────────

pub struct Gateway {
    routes:   Vec<Route>,
    auth:     Arc<dyn Authenticator>,
    rl:       Arc<dyn RateLimiter>,
    registry: Arc<dyn ServiceRegistry>,
    cb:       Arc<dyn CircuitBreaker>,
}

impl Gateway {
    pub fn new(
        routes:   Vec<Route>,
        auth:     Arc<dyn Authenticator>,
        rl:       Arc<dyn RateLimiter>,
        registry: Arc<dyn ServiceRegistry>,
        cb:       Arc<dyn CircuitBreaker>,
    ) -> Self {
        Self { routes, auth, rl, registry, cb }
    }

    pub fn handle(&self, req: &GatewayRequest) -> Result<GatewayResponse, GatewayError> {
        // 1. Authenticate
        let identity = self.auth.authenticate(req)?;

        // 2. Rate limit
        self.rl.allow(&identity)?;

        // 3. Route
        let route = self.match_route(&req.path)
            .ok_or_else(|| GatewayError::NotFound(req.path.clone()))?;

        // 4. Circuit breaker
        if !self.cb.is_closed(&route.service_id) {
            return Err(GatewayError::CircuitOpen(route.service_id.clone()));
        }

        // 5. Discover
        let endpoint = self.registry.lookup(&route.service_id)?;

        // 6. Forward (stub — real impl uses reqwest or hyper)
        let forward_path = if route.strip_prefix {
            req.path[route.prefix.len()..].to_owned()
        } else {
            req.path.clone()
        };

        let url = format!("{}{}", endpoint, forward_path);
        let start = Instant::now();

        // Simulated response for compilation — replace with reqwest::blocking::Client::new()
        let (status_code, body) = self.simulate_upstream(&url, &req.method);
        let latency_ms = start.elapsed().as_millis() as u64;

        if status_code >= 500 {
            self.cb.record_failure(&route.service_id);
        } else {
            self.cb.record_success(&route.service_id);
        }

        Ok(GatewayResponse {
            status_code,
            headers:    HashMap::new(),
            body:       body.into_bytes(),
            service_id: Some(route.service_id.clone()),
            latency_ms,
        })
    }

    fn match_route(&self, path: &str) -> Option<&Route> {
        self.routes.iter().find(|r| path.starts_with(&r.prefix))
    }

    // Placeholder: replace with reqwest call in production
    fn simulate_upstream(&self, _url: &str, _method: &str) -> (u16, String) {
        (200, r#"{"status":"ok"}"#.to_owned())
    }
}

// ── Usage Example ──────────────────────────────────────────────────────────────

fn main() {
    let gw = Gateway::new(
        vec![
            Route { prefix: "/api/users".into(),    service_id: ServiceId::UserService,    strip_prefix: false },
            Route { prefix: "/api/products".into(), service_id: ServiceId::ProductService, strip_prefix: false },
            Route { prefix: "/api/orders".into(),   service_id: ServiceId::OrderService,   strip_prefix: false },
        ],
        Arc::new(TokenAuthenticator::new(HashMap::from([
            ("secret-token-abc".to_owned(), "user-alice".to_owned()),
        ]))),
        Arc::new(InMemoryRateLimiter::new(100, Duration::from_secs(60))),
        Arc::new(StaticServiceRegistry::new(HashMap::from([
            ("user-service".into(),    "http://user-svc:8080".into()),
            ("product-service".into(), "http://product-svc:8081".into()),
            ("order-service".into(),   "http://order-svc:8082".into()),
        ]))),
        Arc::new(CountBasedCircuitBreaker::new(5, Duration::from_secs(30))),
    );

    let req = GatewayRequest {
        method:   "GET".into(),
        path:     "/api/users/42".into(),
        headers:  HashMap::from([("Authorization".into(), "Bearer secret-token-abc".into())]),
        body:     vec![],
        trace_id: "trace-001".into(),
    };

    match gw.handle(&req) {
        Ok(resp) => println!(
            "Status: {} | Service: {:?} | Latency: {}ms",
            resp.status_code, resp.service_id, resp.latency_ms
        ),
        Err(e) => eprintln!("Gateway error: {}", e),
    }
}`,

  Java: `// Pattern: API Gateway
// Reference: Richardson - microservices.io; "Microservices Patterns" (Richardson) Ch.8
// Production note: Replace in-memory rate limiter with Bucket4j + Redis in clustered deployment

package gateway;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

// ── Domain Types ──────────────────────────────────────────────────────────────

public sealed interface ServiceId permits
    ServiceId.UserService,
    ServiceId.ProductService,
    ServiceId.OrderService {

    record UserService()    implements ServiceId { public String id() { return "user-service";    } }
    record ProductService() implements ServiceId { public String id() { return "product-service"; } }
    record OrderService()   implements ServiceId { public String id() { return "order-service";   } }
}

record Route(String prefix, ServiceId serviceId, boolean stripPrefix) {}

record GatewayRequest(
    String method,
    String path,
    Map<String, String> headers,
    byte[] body,
    String traceId
) {}

record GatewayResponse(
    int statusCode,
    Map<String, String> headers,
    byte[] body,
    Optional<ServiceId> serviceId,
    long latencyMs
) {}

// ── Sealed Error Hierarchy ─────────────────────────────────────────────────────

public sealed interface GatewayError permits
    GatewayError.Unauthorized,
    GatewayError.RateLimited,
    GatewayError.NotFound,
    GatewayError.CircuitOpen,
    GatewayError.UpstreamFailed,
    GatewayError.Timeout {

    record Unauthorized(String message)                          implements GatewayError {}
    record RateLimited(long retryAfterSeconds)                   implements GatewayError {}
    record NotFound(String path)                                 implements GatewayError {}
    record CircuitOpen(ServiceId serviceId)                      implements GatewayError {}
    record UpstreamFailed(int statusCode, ServiceId serviceId)   implements GatewayError {}
    record Timeout(ServiceId serviceId)                          implements GatewayError {}
}

// ── Result Type ────────────────────────────────────────────────────────────────

sealed interface Result<T, E> permits Result.Ok, Result.Err {
    record Ok<T, E>(T value)   implements Result<T, E> {}
    record Err<T, E>(E error)  implements Result<T, E> {}

    static <T, E> Result<T, E> ok(T value)  { return new Ok<>(value);  }
    static <T, E> Result<T, E> err(E error) { return new Err<>(error); }
}

// ── Interfaces ─────────────────────────────────────────────────────────────────

interface Authenticator {
    Result<String, GatewayError> authenticate(GatewayRequest req);
}

interface RateLimiter {
    Result<Void, GatewayError> allow(String identity);
}

interface ServiceRegistry {
    Result<String, GatewayError> lookup(ServiceId serviceId);
}

interface CircuitBreaker {
    boolean isClosed(ServiceId serviceId);
    void recordSuccess(ServiceId serviceId);
    void recordFailure(ServiceId serviceId);
}

// ── In-Memory Implementations ──────────────────────────────────────────────────

class TokenAuthenticator implements Authenticator {
    private final Map<String, String> validTokens; // token → identity

    TokenAuthenticator(Map<String, String> validTokens) {
        this.validTokens = Map.copyOf(validTokens);
    }

    @Override
    public Result<String, GatewayError> authenticate(GatewayRequest req) {
        var auth = Optional.ofNullable(req.headers().get("Authorization"))
            .or(() -> Optional.ofNullable(req.headers().get("authorization")));

        if (auth.isEmpty() || !auth.get().startsWith("Bearer ")) {
            return Result.err(new GatewayError.Unauthorized("Missing or malformed Authorization header"));
        }
        var token    = auth.get().substring("Bearer ".length());
        var identity = validTokens.get(token);
        if (identity == null) {
            return Result.err(new GatewayError.Unauthorized("Invalid token"));
        }
        return Result.ok(identity);
    }
}

class InMemoryRateLimiter implements RateLimiter {
    // Production: replace with Bucket4j + Redis for distributed rate limiting
    private record Bucket(AtomicInteger count, Instant resetAt) {}
    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final int      limit;
    private final Duration window;

    InMemoryRateLimiter(int limit, Duration window) {
        this.limit  = limit;
        this.window = window;
    }

    @Override
    public Result<Void, GatewayError> allow(String identity) {
        var now    = Instant.now();
        var bucket = buckets.compute(identity, (k, b) -> {
            if (b == null || now.isAfter(b.resetAt())) {
                return new Bucket(new AtomicInteger(0), now.plus(window));
            }
            return b;
        });
        if (bucket.count().incrementAndGet() > limit) {
            long retryAfter = Duration.between(now, bucket.resetAt()).getSeconds();
            return Result.err(new GatewayError.RateLimited(retryAfter));
        }
        return Result.ok(null);
    }
}

class StaticServiceRegistry implements ServiceRegistry {
    private final Map<String, String> endpoints;

    StaticServiceRegistry(Map<String, String> endpoints) {
        this.endpoints = Map.copyOf(endpoints);
    }

    private String idOf(ServiceId id) {
        return switch (id) {
            case ServiceId.UserService    u -> u.id();
            case ServiceId.ProductService p -> p.id();
            case ServiceId.OrderService   o -> o.id();
        };
    }

    @Override
    public Result<String, GatewayError> lookup(ServiceId serviceId) {
        var ep = endpoints.get(idOf(serviceId));
        if (ep == null) {
            return Result.err(new GatewayError.CircuitOpen(serviceId));
        }
        return Result.ok(ep);
    }
}

class CountBasedCircuitBreaker implements CircuitBreaker {
    private final ConcurrentHashMap<ServiceId, Integer> failures    = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<ServiceId, Instant> openUntil   = new ConcurrentHashMap<>();
    private final int      threshold;
    private final Duration resetAfter;

    CountBasedCircuitBreaker(int threshold, Duration resetAfter) {
        this.threshold  = threshold;
        this.resetAfter = resetAfter;
    }

    @Override
    public boolean isClosed(ServiceId serviceId) {
        return Optional.ofNullable(openUntil.get(serviceId))
            .map(until -> Instant.now().isAfter(until))
            .orElse(true);
    }

    @Override
    public void recordSuccess(ServiceId serviceId) {
        failures.remove(serviceId);
        openUntil.remove(serviceId);
    }

    @Override
    public void recordFailure(ServiceId serviceId) {
        int count = failures.merge(serviceId, 1, Integer::sum);
        if (count >= threshold) {
            openUntil.put(serviceId, Instant.now().plus(resetAfter));
        }
    }
}

// ── Gateway ────────────────────────────────────────────────────────────────────

class APIGateway {
    private final List<Route>      routes;
    private final Authenticator    auth;
    private final RateLimiter      rateLimiter;
    private final ServiceRegistry  registry;
    private final CircuitBreaker   cb;
    private final HttpClient       httpClient;

    APIGateway(
        List<Route>     routes,
        Authenticator   auth,
        RateLimiter     rateLimiter,
        ServiceRegistry registry,
        CircuitBreaker  cb,
        Duration        timeout
    ) {
        this.routes      = List.copyOf(routes);
        this.auth        = auth;
        this.rateLimiter = rateLimiter;
        this.registry    = registry;
        this.cb          = cb;
        this.httpClient  = HttpClient.newBuilder().connectTimeout(timeout).build();
    }

    public Result<GatewayResponse, GatewayError> handle(GatewayRequest req) {
        // 1. Auth
        var authResult = auth.authenticate(req);
        if (authResult instanceof Result.Err<String, GatewayError> e) return Result.err(e.error());
        var identity = ((Result.Ok<String, GatewayError>) authResult).value();

        // 2. Rate limit
        var rlResult = rateLimiter.allow(identity);
        if (rlResult instanceof Result.Err<Void, GatewayError> e) return Result.err(e.error());

        // 3. Route
        var route = matchRoute(req.path());
        if (route.isEmpty()) return Result.err(new GatewayError.NotFound(req.path()));

        // 4. Circuit breaker
        if (!cb.isClosed(route.get().serviceId())) {
            return Result.err(new GatewayError.CircuitOpen(route.get().serviceId()));
        }

        // 5. Discover
        var lookupResult = registry.lookup(route.get().serviceId());
        if (lookupResult instanceof Result.Err<String, GatewayError> e) return Result.err(e.error());
        var endpoint = ((Result.Ok<String, GatewayError>) lookupResult).value();

        // 6. Forward
        var forwardPath = route.get().stripPrefix()
            ? req.path().substring(route.get().prefix().length())
            : req.path();
        var url = endpoint + (forwardPath.isEmpty() ? "/" : forwardPath);

        try {
            var builder = HttpRequest.newBuilder(URI.create(url))
                .method(req.method(), HttpRequest.BodyPublishers.ofByteArray(
                    req.body() != null ? req.body() : new byte[0]));
            req.headers().forEach(builder::header);
            builder.header("X-Trace-Id", req.traceId());

            var start    = System.currentTimeMillis();
            var response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofByteArray());
            var latency  = System.currentTimeMillis() - start;

            var serviceId = route.get().serviceId();
            if (response.statusCode() >= 500) cb.recordFailure(serviceId);
            else                               cb.recordSuccess(serviceId);

            var responseHeaders = new HashMap<String, String>();
            response.headers().map().forEach((k, vs) -> responseHeaders.put(k, vs.getFirst()));

            return Result.ok(new GatewayResponse(
                response.statusCode(),
                responseHeaders,
                response.body(),
                Optional.of(serviceId),
                latency
            ));
        } catch (java.net.http.HttpTimeoutException ex) {
            cb.recordFailure(route.get().serviceId());
            return Result.err(new GatewayError.Timeout(route.get().serviceId()));
        } catch (Exception ex) {
            cb.recordFailure(route.get().serviceId());
            return Result.err(new GatewayError.UpstreamFailed(502, route.get().serviceId()));
        }
    }

    private Optional<Route> matchRoute(String path) {
        return routes.stream().filter(r -> path.startsWith(r.prefix())).findFirst();
    }
}

// ── Usage Example ──────────────────────────────────────────────────────────────

class Main {
    public static void main(String[] args) {
        var gw = new APIGateway(
            List.of(
                new Route("/api/users",    new ServiceId.UserService(),    false),
                new Route("/api/products", new ServiceId.ProductService(), false),
                new Route("/api/orders",   new ServiceId.OrderService(),   false)
            ),
            new TokenAuthenticator(Map.of("secret-token-abc", "user-alice")),
            new InMemoryRateLimiter(100, Duration.ofMinutes(1)),
            new StaticServiceRegistry(Map.of(
                "user-service",    "http://user-svc:8080",
                "product-service", "http://product-svc:8081",
                "order-service",   "http://order-svc:8082"
            )),
            new CountBasedCircuitBreaker(5, Duration.ofSeconds(30)),
            Duration.ofSeconds(5)
        );

        var req = new GatewayRequest(
            "GET", "/api/users/42",
            Map.of("Authorization", "Bearer secret-token-abc"),
            null, "trace-001"
        );

        switch (gw.handle(req)) {
            case Result.Ok<GatewayResponse, GatewayError> ok -> System.out.printf(
                "Status: %d | Service: %s | Latency: %dms%n",
                ok.value().statusCode(), ok.value().serviceId(), ok.value().latencyMs());
            case Result.Err<GatewayResponse, GatewayError> err ->
                System.err.println("Gateway error: " + err.error());
        }
    }
}`,
};

const awsCdkCode = `// infrastructure/aws/cdk/api-gateway-stack.ts
import * as cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as waf from "aws-cdk-lib/aws-wafv2";
import { Construct } from "constructs";

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── Lambda Authorizer (JWT validation) ────────────────────────────────────
    const authorizerFn = new lambda.Function(this, "JwtAuthorizer", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("src/authorizer"),
      environment: {
        JWKS_URI: "https://auth.example.com/.well-known/jwks.json",
      },
      timeout: cdk.Duration.seconds(3),
    });

    const authorizer = new apigw.TokenAuthorizer(this, "Authorizer", {
      handler: authorizerFn,
      resultsCacheTtl: cdk.Duration.minutes(5),
    });

    // ── REST API with access logging ──────────────────────────────────────────
    const accessLogGroup = new logs.LogGroup(this, "AccessLogs", {
      retention: logs.RetentionDays.ONE_MONTH,
    });

    const api = new apigw.RestApi(this, "MicroservicesGateway", {
      restApiName: "microservices-gateway",
      deployOptions: {
        stageName: "prod",
        accessLogDestination: new apigw.LogGroupLogDestination(accessLogGroup),
        accessLogFormat: apigw.AccessLogFormat.jsonWithStandardFields(),
        tracingEnabled: true,        // AWS X-Ray
        metricsEnabled: true,
        throttlingRateLimit: 1000,   // requests/second per stage
        throttlingBurstLimit: 2000,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    });

    // ── Usage Plan + API Key (rate limiting per client) ───────────────────────
    const usagePlan = api.addUsagePlan("DefaultPlan", {
      throttle: { rateLimit: 100, burstLimit: 200 },
      quota:    { limit: 10_000, period: apigw.Period.DAY },
    });

    const apiKey = api.addApiKey("DefaultKey");
    usagePlan.addApiKey(apiKey);
    usagePlan.addApiStage({ stage: api.deploymentStage });

    // ── Service integrations (Lambda proxy) ───────────────────────────────────
    const services: { name: string; path: string }[] = [
      { name: "user-service",    path: "users"    },
      { name: "product-service", path: "products" },
      { name: "order-service",   path: "orders"   },
    ];

    for (const svc of services) {
      const fn = new lambda.Function(this, \`\${svc.name}-fn\`, {
        functionName: svc.name,
        runtime:      lambda.Runtime.NODEJS_20_X,
        handler:      "index.handler",
        code:         lambda.Code.fromAsset(\`src/\${svc.name}\`),
        tracing:      lambda.Tracing.ACTIVE,
        timeout:      cdk.Duration.seconds(10),
        environment: { SERVICE_NAME: svc.name },
      });

      const resource   = api.root.addResource(svc.path);
      const itemRes    = resource.addResource("{id}");
      const integration = new apigw.LambdaIntegration(fn, {
        proxy:              true,
        timeout:            cdk.Duration.seconds(9),
        allowTestInvoke:    false,
      });

      // GET /svc  + GET /svc/{id}  (authorizer enforced)
      resource.addMethod("GET",  integration, { authorizer, apiKeyRequired: true });
      resource.addMethod("POST", integration, { authorizer, apiKeyRequired: true });
      itemRes.addMethod("GET",   integration, { authorizer, apiKeyRequired: true });
      itemRes.addMethod("PUT",   integration, { authorizer, apiKeyRequired: true });
      itemRes.addMethod("DELETE",integration, { authorizer, apiKeyRequired: true });
    }

    // ── WAF (rate limit + SQL injection protection) ───────────────────────────
    const webAcl = new waf.CfnWebACL(this, "ApiWaf", {
      defaultAction: { allow: {} },
      scope: "REGIONAL",
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName:               "ApiGatewayWAF",
        sampledRequestsEnabled:   true,
      },
      rules: [
        {
          name:     "RateLimitRule",
          priority: 1,
          action:   { block: {} },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName:               "RateLimit",
            sampledRequestsEnabled:   true,
          },
          statement: {
            rateBasedStatement: {
              limit:            2000,
              aggregateKeyType: "IP",
            },
          },
        },
        {
          name:               "AWSManagedRulesCommonRuleSet",
          priority:           2,
          overrideAction:     { none: {} },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName:               "CommonRuleSet",
            sampledRequestsEnabled:   true,
          },
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name:       "AWSManagedRulesCommonRuleSet",
            },
          },
        },
      ],
    });

    new waf.CfnWebACLAssociation(this, "WafAssociation", {
      resourceArn: \`arn:aws:apigateway:\${this.region}::/restapis/\${api.restApiId}/stages/prod\`,
      webAclArn:   webAcl.attrArn,
    });

    // ── Outputs ───────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, "GatewayUrl", { value: api.url });
    new cdk.CfnOutput(this, "ApiKeyId",   { value: apiKey.keyId });
  }
}`;

const awsTerraformCode = `# infrastructure/aws/terraform/main.tf
# AWS API Gateway v2 (HTTP API) — lower latency, lower cost than REST API for most patterns

terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" { region = var.aws_region }

variable "aws_region"    { default = "us-east-1" }
variable "jwt_issuer"    {}
variable "jwt_audience"  {}

# ── Lambda function per service ────────────────────────────────────────────────
locals {
  services = {
    user    = { path = "users",    handler = "index.handler" }
    product = { path = "products", handler = "index.handler" }
    order   = { path = "orders",   handler = "index.handler" }
  }
}

resource "aws_lambda_function" "service" {
  for_each      = local.services
  function_name = "\${each.key}-service"
  role          = aws_iam_role.lambda.arn
  runtime       = "nodejs20.x"
  handler       = each.value.handler
  filename      = "dist/\${each.key}.zip"
  tracing_config { mode = "Active" }

  environment {
    variables = { SERVICE_NAME = "\${each.key}-service" }
  }
}

resource "aws_lambda_permission" "apigw" {
  for_each      = local.services
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.service[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "\${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# ── HTTP API (v2) ──────────────────────────────────────────────────────────────
resource "aws_apigatewayv2_api" "main" {
  name          = "microservices-gateway"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins  = ["*"]
    allow_methods  = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers  = ["Authorization", "Content-Type"]
    max_age        = 300
  }
}

# JWT Authorizer (Cognito / Auth0 / Okta compatible)
resource "aws_apigatewayv2_authorizer" "jwt" {
  api_id           = aws_apigatewayv2_api.main.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "jwt-authorizer"
  jwt_configuration {
    issuer   = var.jwt_issuer
    audience = [var.jwt_audience]
  }
}

# Integrations
resource "aws_apigatewayv2_integration" "service" {
  for_each                = local.services
  api_id                  = aws_apigatewayv2_api.main.id
  integration_type        = "AWS_PROXY"
  integration_uri         = aws_lambda_function.service[each.key].invoke_arn
  payload_format_version  = "2.0"
  timeout_milliseconds    = 9000
}

# Routes — auth enforced on all
resource "aws_apigatewayv2_route" "get" {
  for_each           = local.services
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "GET /api/\${each.value.path}/{proxy+}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
  target             = "integrations/\${aws_apigatewayv2_integration.service[each.key].id}"
}

resource "aws_apigatewayv2_route" "post" {
  for_each           = local.services
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "POST /api/\${each.value.path}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
  target             = "integrations/\${aws_apigatewayv2_integration.service[each.key].id}"
}

# Stage with access logging
resource "aws_cloudwatch_log_group" "access_logs" {
  name              = "/aws/apigateway/microservices-gateway"
  retention_in_days = 30
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "prod"
  auto_deploy = true
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.access_logs.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      responseLength = "$context.responseLength"
      integrationLatency = "$context.integrationLatency"
    })
  }
  default_route_settings {
    throttling_rate_limit  = 1000
    throttling_burst_limit = 2000
    logging_level          = "INFO"
  }
}

output "gateway_url" { value = aws_apigatewayv2_stage.prod.invoke_url }`;

const azureBicepCode = `// infrastructure/azure/bicep/api-gateway.bicep
// Azure API Management (APIM) — managed API gateway service

param location string = resourceGroup().location
param apimName string = 'microservices-gateway'
param publisherEmail string
param publisherName string

// ── API Management instance ────────────────────────────────────────────────────
resource apim 'Microsoft.ApiManagement/service@2023-05-01-preview' = {
  name: apimName
  location: location
  sku: {
    name: 'Developer'   // Use 'Standard' or 'Premium' for production
    capacity: 1
  }
  properties: {
    publisherEmail: publisherEmail
    publisherName:  publisherName
    customProperties: {
      'Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Protocols.Tls10':  'false'
      'Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Protocols.Tls11':  'false'
      'Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Tls10': 'false'
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
}

// ── Named Values (secrets from Key Vault) ─────────────────────────────────────
resource jwtIssuerValue 'Microsoft.ApiManagement/service/namedValues@2023-05-01-preview' = {
  parent: apim
  name: 'jwt-issuer'
  properties: {
    displayName: 'jwt-issuer'
    secret: true
    value: 'https://login.microsoftonline.com/TENANT_ID/v2.0'
  }
}

// ── Rate limit + JWT policy ────────────────────────────────────────────────────
resource globalPolicy 'Microsoft.ApiManagement/service/policies@2023-05-01-preview' = {
  parent: apim
  name: 'policy'
  properties: {
    format: 'rawxml'
    value: '''
<policies>
  <inbound>
    <rate-limit calls="1000" renewal-period="60" />
    <quota calls="10000" bandwidth="40000" renewal-period="86400" />
    <validate-jwt header-name="Authorization" failed-validation-httpcode="401"
                  failed-validation-error-message="Unauthorized">
      <openid-config url="https://login.microsoftonline.com/TENANT_ID/v2.0/.well-known/openid-configuration" />
      <audiences><audience>api://microservices-gateway</audience></audiences>
    </validate-jwt>
    <set-header name="X-Request-ID" exists-action="skip">
      <value>@(Guid.NewGuid().ToString())</value>
    </set-header>
    <cors allow-credentials="false">
      <allowed-origins><origin>*</origin></allowed-origins>
      <allowed-methods><method>GET</method><method>POST</method><method>PUT</method><method>DELETE</method></allowed-methods>
      <allowed-headers><header>*</header></allowed-headers>
    </cors>
  </inbound>
  <backend>
    <forward-request timeout="10" />
  </backend>
  <outbound>
    <set-header name="Strict-Transport-Security" exists-action="override">
      <value>max-age=31536000; includeSubDomains</value>
    </set-header>
  </outbound>
  <on-error>
    <return-response>
      <set-status code="@(context.Response.StatusCode)" reason="@(context.Response.StatusReason)" />
    </return-response>
  </on-error>
</policies>
'''
  }
}

// ── API definitions ────────────────────────────────────────────────────────────
var services = [
  { name: 'user-service',    path: 'users',    backendUrl: 'http://user-svc:8080'    }
  { name: 'product-service', path: 'products', backendUrl: 'http://product-svc:8081' }
  { name: 'order-service',   path: 'orders',   backendUrl: 'http://order-svc:8082'   }
]

resource apis 'Microsoft.ApiManagement/service/apis@2023-05-01-preview' = [for svc in services: {
  parent: apim
  name: svc.name
  properties: {
    displayName:            svc.name
    path:                   'api/\${svc.path}'
    protocols:              ['https']
    subscriptionRequired:   false
    serviceUrl:             svc.backendUrl
  }
}]

// ── Application Insights integration ──────────────────────────────────────────
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '\${apimName}-insights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    RetentionInDays:  30
  }
}

resource apimLogger 'Microsoft.ApiManagement/service/loggers@2023-05-01-preview' = {
  parent: apim
  name: 'app-insights-logger'
  properties: {
    loggerType: 'applicationInsights'
    credentials: {
      instrumentationKey: appInsights.properties.InstrumentationKey
    }
    isBuffered: true
  }
}

output gatewayUrl string = apim.properties.gatewayUrl`;

const gcpTerraformCode = `# infrastructure/gcp/terraform/main.tf
# GCP API Gateway — managed gateway with Cloud Run backends

terraform {
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" {}
variable "region"     { default = "us-central1" }

# ── Cloud Run services (backends) ─────────────────────────────────────────────
locals {
  services = {
    user    = { image = "gcr.io/\${var.project_id}/user-service:latest"    }
    product = { image = "gcr.io/\${var.project_id}/product-service:latest" }
    order   = { image = "gcr.io/\${var.project_id}/order-service:latest"   }
  }
}

resource "google_cloud_run_v2_service" "backend" {
  for_each = local.services
  name     = "\${each.key}-service"
  location = var.region

  template {
    containers {
      image = each.value.image
      env { name = "SERVICE_NAME", value = "\${each.key}-service" }
      resources { limits = { memory = "512Mi", cpu = "1" } }
    }
    scaling { min_instance_count = 1, max_instance_count = 10 }
  }
}

# Allow API Gateway to invoke Cloud Run (IAM)
resource "google_cloud_run_v2_service_iam_member" "invoker" {
  for_each = local.services
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.backend[each.key].name
  role     = "roles/run.invoker"
  member   = "serviceAccount:\${google_service_account.gw_sa.email}"
}

resource "google_service_account" "gw_sa" {
  account_id   = "api-gateway-sa"
  display_name = "API Gateway Service Account"
}

# ── API Gateway OpenAPI spec ───────────────────────────────────────────────────
resource "google_api_gateway_api" "main" {
  provider = google-beta
  api_id   = "microservices-gateway"
}

resource "google_api_gateway_api_config" "main" {
  provider      = google-beta
  api           = google_api_gateway_api.main.api_id
  api_config_id = "config-v1"

  openapi_documents {
    document {
      path     = "spec.yaml"
      contents = base64encode(templatefile("\${path.module}/openapi.yaml.tpl", {
        user_url    = google_cloud_run_v2_service.backend["user"].uri
        product_url = google_cloud_run_v2_service.backend["product"].uri
        order_url   = google_cloud_run_v2_service.backend["order"].uri
        sa_email    = google_service_account.gw_sa.email
      }))
    }
  }

  gateway_config {
    backend_config {
      google_service_account = google_service_account.gw_sa.email
    }
  }
}

resource "google_api_gateway_gateway" "main" {
  provider   = google-beta
  api_config = google_api_gateway_api_config.main.id
  gateway_id = "microservices-gateway"
  region     = var.region
}

# openapi.yaml.tpl — API spec with JWT validation
# x-google-backend routes each path to the correct Cloud Run service
# security: [bearerAuth] enforces JWT at the gateway level

output "gateway_url" {
  value = "https://\${google_api_gateway_gateway.main.default_hostname}"
}`;

function ImplementationsTab() {
  const [implTab, setImplTab] = useState("Core");
  const [lang, setLang] = useState("Go");
  const [awsSubTab, setAwsSubTab] = useState("CDK (TypeScript)");
  const [azureSubTab, setAzureSubTab] = useState("Bicep");
  const [gcpSubTab, setGcpSubTab] = useState("Terraform");

  return (
    <div>
      <TabBar
        tabs={IMPL_TABS}
        active={implTab}
        onSelect={setImplTab}
        colorFn={(t) => IMPL_TAB_COLORS[t]}
      />

      {implTab === "Core" && (
        <div>
          <TabBar tabs={CORE_LANGS} active={lang} onSelect={setLang} colorFn={() => colors.blue} />
          <CodeBlock language={lang} filename={`core/${lang.toLowerCase()}/gateway.${lang === "Go" ? "go" : lang === "Python" ? "py" : lang === "TypeScript" ? "ts" : lang === "Rust" ? "rs" : "java"}`}>
            {coreCode[lang]}
          </CodeBlock>
        </div>
      )}

      {implTab === "AWS" && (
        <div>
          <TabBar tabs={["CDK (TypeScript)", "Terraform"]} active={awsSubTab} onSelect={setAwsSubTab} colorFn={() => colors.aws} />
          {awsSubTab === "CDK (TypeScript)" && (
            <CodeBlock language="typescript" filename="infrastructure/aws/cdk/api-gateway-stack.ts">
              {awsCdkCode}
            </CodeBlock>
          )}
          {awsSubTab === "Terraform" && (
            <CodeBlock language="hcl" filename="infrastructure/aws/terraform/main.tf">
              {awsTerraformCode}
            </CodeBlock>
          )}
        </div>
      )}

      {implTab === "Azure" && (
        <div>
          <TabBar tabs={["Bicep"]} active={azureSubTab} onSelect={setAzureSubTab} colorFn={() => colors.azure} />
          <CodeBlock language="bicep" filename="infrastructure/azure/bicep/api-gateway.bicep">
            {azureBicepCode}
          </CodeBlock>
        </div>
      )}

      {implTab === "GCP" && (
        <div>
          <TabBar tabs={["Terraform"]} active={gcpSubTab} onSelect={setGcpSubTab} colorFn={() => colors.gcp} />
          <CodeBlock language="hcl" filename="infrastructure/gcp/terraform/main.tf">
            {gcpTerraformCode}
          </CodeBlock>
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Leadership ────────────────────────────────────────────────────────

function LeadershipTab() {
  const section = (title, color, children) => (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${color}44`,
        borderRadius: 8,
        padding: "16px 18px",
        marginBottom: 14,
      }}
    >
      <h3 style={{ color, fontSize: 14, fontWeight: 600, marginBottom: 10, margin: "0 0 10px" }}>
        {title}
      </h3>
      {children}
    </div>
  );

  const li = (text, color = colors.text) => (
    <li style={{ color, fontSize: 12.5, marginBottom: 5, lineHeight: 1.6 }}>{text}</li>
  );

  return (
    <div>
      {section("🗣 Explain to Your Team (standup / RFC intro)", colors.blue,
        <p style={{ color: colors.text, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          An API Gateway is the single stable entry point that sits between every client and all
          of our backend services. It centralises authentication, rate limiting, and routing so
          no individual service needs to implement those concerns. Think of it as the receptionist
          for our entire platform — it checks credentials, enforces quotas, and routes each visitor
          to the right room without any visitor needing to know the floor plan.
        </p>
      )}

      {section("⚖️ Justify the Decision (architecture review)", colors.green,
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {[
            "Client decoupling: backends can be renamed, split, or re-hosted without any client-side change. The gateway absorbs topology churn.",
            "Security surface reduction: auth and TLS termination happen once at the edge. Each service trusts that the gateway has validated the caller — we eliminate 50 independent JWT validation implementations.",
            "Operational leverage: one log stream at the gateway gives us 100% request visibility across all services. A single place to configure rate limits, CORS, and caching policies.",
            "BFF variant when justified: if mobile needs a 20KB payload and web needs 200KB, a BFF prevents over-fetching on mobile and under-fetching on web — without adding that logic to every downstream service.",
            "Industry validation: Netflix (Zuul), Amazon (internal service contracts), Uber (Envoy-based edge) — the pattern is proven at scales we are unlikely to reach before it makes sense.",
          ].map(li)}
        </ul>
      )}

      {section("🔥 Failure Modes & Observability", colors.red,
        <div>
          <p style={{ color: colors.muted, fontSize: 12, marginBottom: 8 }}>What breaks and how to detect it:</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                {["Failure Mode", "Symptom", "Detection", "Mitigation"].map(h => (
                  <th key={h} style={{ padding: "6px 10px", textAlign: "left", color: colors.muted, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Gateway SPOF", "Total outage — all services unreachable", "Synthetic health checks, 5xx spike alert", "Horizontal scaling, active-active multi-AZ"],
                ["Thundering herd on restart", "CPU spike, downstream 503s after deploy", "CPU + latency P99 alert post-deploy", "Gradual traffic shifting, warm-up period"],
                ["Circuit stays open (false positive)", "Healthy service returning 503", "Circuit state metric / Grafana dashboard", "Configure half-open state; validate thresholds"],
                ["Rate limiter misconfiguration", "Legitimate clients rejected at 429", "4xx rate alert above baseline", "Tiered rate limits; monitor per-identity quota usage"],
                ["Aggregation latency amplification", "P99 spikes on composite endpoints", "Per-service P99 histogram; Jaeger traces", "Fan-out parallel calls; set per-service timeouts"],
                ["Auth token cache poisoning", "Stale authorizations allowed/rejected", "Auth service error rate vs. gateway 401 rate", "Short TTL on authorizer cache (≤ 5 min); revocation endpoint"],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${colors.border}`, background: i % 2 === 0 ? "transparent" : colors.surface }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "7px 10px", color: j === 1 ? colors.red : colors.text, fontSize: 12 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 10 }}>
            <p style={{ color: colors.amber, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Key Alerts to Configure:</p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {[
                "gateway_5xx_rate > 1% over 5 min → PagerDuty",
                "gateway_latency_p99 > 500ms → warning",
                "circuit_breaker_state{service=X} == open → Slack alert",
                "rate_limiter_rejections_per_min > baseline × 5 → investigate",
                "gateway_auth_failures > 100/min → potential credential stuffing",
              ].map(a => li(a, colors.amber))}
            </ul>
          </div>
        </div>
      )}

      {section("📈 Scale Implications", colors.purple,
        <div>
          {[
            {
              scale: "Current (<100 req/s)",
              color: colors.green,
              notes: "Single gateway instance sufficient. In-memory rate limiter works. Focus on getting the routing, auth, and circuit breaker logic right before optimising.",
            },
            {
              scale: "10× (~1,000 req/s)",
              color: colors.amber,
              notes: "Horizontal scale the gateway (stateless design required). Move rate limiter to Redis (atomic INCR + TTL). Add distributed tracing. Review circuit breaker thresholds.",
            },
            {
              scale: "100× (~10,000 req/s)",
              color: colors.red,
              notes: "Consider splitting into BFF gateways per client type to prevent any one client's traffic from affecting others. Evaluate Envoy / Kong / AWS API GW as alternatives to custom implementation. Rate limiting must be distributed and partition-tolerant.",
            },
          ].map(({ scale, color, notes }) => (
            <div key={scale} style={{ marginBottom: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
              {badge(scale, color)}
              <span style={{ color: colors.text, fontSize: 12, lineHeight: 1.6 }}>{notes}</span>
            </div>
          ))}
          <p style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>
            Revisit architecture when: gateway latency exceeds 5% of end-to-end latency budget; or when a single gateway class starts accreting unrelated business logic.
          </p>
        </div>
      )}

      {section("✅ Code Review Checklist", colors.amber,
        <ul style={{ margin: 0, paddingLeft: 16, columnCount: 2, columnGap: 20 }}>
          {[
            "Auth enforced on every non-public route?",
            "Rate limiter distributed-safe (not in-memory for multi-instance)?",
            "Circuit breaker per upstream service, not one global?",
            "Parallel fan-out for aggregations (not sequential)?",
            "Timeouts set on every upstream call?",
            "Trace ID propagated to all downstream services?",
            "Errors return RFC 7807 Problem Details format?",
            "No business logic in the gateway (pure infrastructure)?",
            "Health/readiness endpoint excludes from auth?",
            "TLS 1.2+ enforced; TLS 1.0/1.1 disabled?",
            "CORS headers set at gateway, not in each service?",
            "Circuit breaker state exposed as a metric?",
          ].map(item => li(item))}
        </ul>
      )}

      {section("❓ Questions for Design Review", colors.muted,
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {[
            "Is this a single gateway for all clients, or do different client types have divergent data needs that warrant BFF decomposition?",
            "What is the plan if the gateway is unavailable — is there a degraded mode, or does the whole platform go down?",
            "Where does service discovery live — is the gateway using static config (fragile) or a service registry (Consul, Cloud Map)?",
            "How will token revocation work — authorizer cache TTL vs. real-time revocation endpoint?",
            "Are aggregation endpoints bounded in the number of upstream services they fan out to? Unbounded aggregation is a latency risk.",
            "What observability does the gateway emit — structured access logs, per-service latency histograms, circuit state metrics?",
            "At what traffic level do we revisit this architecture, and who owns that decision?",
          ].map(q => li(q, colors.muted))}
        </ul>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

const MAIN_TABS = ["Architecture", "Core Concepts", "Implementations", "Leadership"];

export default function ApiGatewayDeepDive() {
  const [tab, setTab] = useState("Architecture");

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", color: colors.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24, borderBottom: `1px solid ${colors.border}`, paddingBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1 style={{ color: colors.text, fontSize: 22, fontWeight: 600, margin: 0 }}>
              API Gateway
            </h1>
            {badge("Microservices Pattern", colors.blue)}
            {badge("Richardson / microservices.io", colors.muted)}
            {badge("Production-Validated", colors.green)}
          </div>
          <p style={{ color: colors.muted, fontSize: 13, margin: "6px 0 0" }}>
            Facade pattern applied as a distributed reverse proxy — single entry point for client-to-service communication
          </p>
        </div>

        {/* Main tabs */}
        <TabBar tabs={MAIN_TABS} active={tab} onSelect={setTab} colorFn={() => colors.blue} />

        {tab === "Architecture"     && <ArchitectureTab />}
        {tab === "Core Concepts"    && <ConceptsTab />}
        {tab === "Implementations"  && <ImplementationsTab />}
        {tab === "Leadership"       && <LeadershipTab />}
      </div>
    </div>
  );
}
