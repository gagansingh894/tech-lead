"use client"

import { useState } from "react";

const theme = {
  bg: "#0f1117", surface: "#1a1d24", border: "#2d3139",
  text: "#e5e7eb", muted: "#9ca3af", code: "#161b22",
  blue: "#3b82f6", green: "#10b981", amber: "#f59e0b",
  purple: "#8b5cf6", red: "#ef4444",
  aws: "#ff9900", azure: "#0078d4", gcp: "#4285f4",
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: copied ? theme.green : theme.border, color: theme.text, border: "none", borderRadius: 4, padding: "3px 10px", fontSize: 11, cursor: "pointer", transition: "background 0.2s" }}
    >{copied ? "Copied!" : "Copy"}</button>
  );
};

const CodeBlock = ({ code, lang = "typescript", filename }) => (
  <div style={{ background: theme.code, borderRadius: 8, overflow: "hidden", border: `1px solid ${theme.border}`, marginTop: 8 }}>
    {filename && (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 14px", borderBottom: `1px solid ${theme.border}`, background: "#0d1117" }}>
        <span style={{ color: theme.muted, fontSize: 12, fontFamily: "monospace" }}>{filename}</span>
        <CopyButton text={code} />
      </div>
    )}
    <pre style={{ margin: 0, padding: "16px", overflowX: "auto", fontSize: 12, lineHeight: 1.6, color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <code>{code}</code>
    </pre>
  </div>
);

const Badge = ({ label, color }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>{label}</span>
);

// ─── TAB 1: ARCHITECTURE ─────────────────────────────────────────────────────

const ArchDiagram = () => (
  <div>
    <svg viewBox="0 0 900 580" style={{ width: "100%", background: theme.surface, borderRadius: 10, border: `1px solid ${theme.border}` }}>
      {/* ── defs ── */}
      <defs>
        <marker id="ah" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#6b7280" /></marker>
        <marker id="ah-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={theme.blue} /></marker>
        <marker id="ah-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={theme.green} /></marker>
        <marker id="ah-amber" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={theme.amber} /></marker>
        <marker id="ah-purple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={theme.purple} /></marker>
      </defs>

      {/* ── Labels ── */}
      <text x="450" y="22" textAnchor="middle" fill={theme.muted} fontSize="12" fontFamily="monospace">KAFKA CLUSTER INTERNALS — DATA PLANE + CONTROL PLANE</text>

      {/* ── PRODUCER ── */}
      <rect x="20" y="50" width="110" height="60" rx="6" fill={theme.blue + "22"} stroke={theme.blue} strokeWidth="1.5" />
      <text x="75" y="76" textAnchor="middle" fill={theme.blue} fontSize="12" fontWeight="600">PRODUCER</text>
      <text x="75" y="94" textAnchor="middle" fill={theme.muted} fontSize="10">Partitioner</text>
      <text x="75" y="107" textAnchor="middle" fill={theme.muted} fontSize="10">RecordAccumulator</text>

      {/* ── CONSUMERS ── */}
      <rect x="760" y="50" width="120" height="60" rx="6" fill={theme.green + "22"} stroke={theme.green} strokeWidth="1.5" />
      <text x="820" y="76" textAnchor="middle" fill={theme.green} fontSize="12" fontWeight="600">CONSUMER</text>
      <text x="820" y="94" textAnchor="middle" fill={theme.muted} fontSize="10">GROUP A</text>
      <text x="820" y="107" textAnchor="middle" fill={theme.muted} fontSize="10">Offset Tracking</text>

      <rect x="760" y="130" width="120" height="50" rx="6" fill={theme.green + "11"} stroke={theme.green + "66"} strokeWidth="1.5" />
      <text x="820" y="151" textAnchor="middle" fill={theme.green + "bb"} fontSize="11" fontWeight="600">CONSUMER</text>
      <text x="820" y="169" textAnchor="middle" fill={theme.muted} fontSize="10">GROUP B</text>

      {/* ── BROKER BOX ── */}
      <rect x="155" y="35" width="580" height="390" rx="10" fill="#13161e" stroke={theme.border} strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="445" y="55" textAnchor="middle" fill={theme.muted} fontSize="11" fontFamily="monospace">BROKER (Leader for P0, P1)</text>

      {/* ── NETWORK LAYER ── */}
      <rect x="170" y="65" width="550" height="65" rx="6" fill="#1e2330" stroke={theme.border} strokeWidth="1" />
      <text x="445" y="85" textAnchor="middle" fill={theme.text} fontSize="11" fontWeight="600">Network Layer</text>
      <rect x="190" y="93" width="115" height="24" rx="4" fill={theme.border} />
      <text x="248" y="109" textAnchor="middle" fill={theme.muted} fontSize="10">Acceptor Thread</text>
      <rect x="315" y="93" width="115" height="24" rx="4" fill={theme.border} />
      <text x="373" y="109" textAnchor="middle" fill={theme.muted} fontSize="10">Network Thread ×N</text>
      <rect x="440" y="93" width="115" height="24" rx="4" fill={theme.border} />
      <text x="498" y="109" textAnchor="middle" fill={theme.muted} fontSize="10">Request Queue</text>
      <rect x="565" y="93" width="110" height="24" rx="4" fill={theme.border} />
      <text x="620" y="109" textAnchor="middle" fill={theme.muted} fontSize="10">Response Queue</text>

      {/* ── IO THREADS ── */}
      <rect x="170" y="145" width="550" height="45" rx="6" fill="#1e2330" stroke={theme.border} strokeWidth="1" />
      <text x="445" y="165" textAnchor="middle" fill={theme.text} fontSize="11" fontWeight="600">I/O Thread Pool</text>
      <text x="445" y="181" textAnchor="middle" fill={theme.muted} fontSize="10">CRC validate → append to commit log → purgatory (awaiting replication ack)</text>

      {/* ── COMMIT LOG / PARTITIONS ── */}
      <rect x="170" y="205" width="265" height="190" rx="6" fill="#1a1f2e" stroke={theme.purple} strokeWidth="1.5" />
      <text x="303" y="225" textAnchor="middle" fill={theme.purple} fontSize="11" fontWeight="600">Commit Log — Partition 0</text>

      {/* Segment files */}
      <rect x="185" y="235" width="235" height="50" rx="4" fill={theme.purple + "11"} stroke={theme.purple + "44"} strokeWidth="1" />
      <text x="303" y="253" textAnchor="middle" fill={theme.muted} fontSize="10">Segment 00000000.log  (active, ≤1GB)</text>
      <text x="303" y="268" textAnchor="middle" fill={theme.muted} fontSize="9">Append-only; offset→byte position</text>
      <text x="303" y="281" textAnchor="middle" fill={theme.muted} fontSize="9">page cache write (async fsync)</text>

      <rect x="185" y="293" width="110" height="36" rx="4" fill={theme.purple + "11"} stroke={theme.purple + "33"} strokeWidth="1" />
      <text x="240" y="311" textAnchor="middle" fill={theme.muted} fontSize="10">.index file</text>
      <text x="240" y="324" textAnchor="middle" fill={theme.muted} fontSize="9">offset→position</text>

      <rect x="305" y="293" width="110" height="36" rx="4" fill={theme.purple + "11"} stroke={theme.purple + "33"} strokeWidth="1" />
      <text x="360" y="311" textAnchor="middle" fill={theme.muted} fontSize="10">.timeindex file</text>
      <text x="360" y="324" textAnchor="middle" fill={theme.muted} fontSize="9">timestamp→offset</text>

      <rect x="185" y="338" width="235" height="42" rx="4" fill={theme.purple + "08"} stroke={theme.purple + "22"} strokeWidth="1" />
      <text x="303" y="356" textAnchor="middle" fill={theme.muted} fontSize="10">Older Segments (sealed, immutable)</text>
      <text x="303" y="371" textAnchor="middle" fill={theme.muted} fontSize="9">deleted or compacted per retention policy</text>

      {/* ── ISR REPLICATION ── */}
      <rect x="455" y="205" width="260" height="190" rx="6" fill="#1a2020" stroke={theme.amber} strokeWidth="1.5" />
      <text x="585" y="225" textAnchor="middle" fill={theme.amber} fontSize="11" fontWeight="600">Replication (ISR)</text>
      <text x="585" y="242" textAnchor="middle" fill={theme.muted} fontSize="9">Followers fetch from leader like consumers</text>

      <rect x="470" y="250" width="230" height="40" rx="4" fill={theme.amber + "11"} stroke={theme.amber + "44"} strokeWidth="1" />
      <text x="585" y="269" textAnchor="middle" fill={theme.muted} fontSize="10">Leader Partition (this broker)</text>
      <text x="585" y="283" textAnchor="middle" fill={theme.muted} fontSize="9">HW = min(LEO across ISR)</text>

      <rect x="470" y="300" width="110" height="40" rx="4" fill={theme.amber + "0a"} stroke={theme.amber + "33"} strokeWidth="1" />
      <text x="525" y="318" textAnchor="middle" fill={theme.muted} fontSize="10">Follower</text>
      <text x="525" y="332" textAnchor="middle" fill={theme.muted} fontSize="9">Broker 2</text>

      <rect x="590" y="300" width="110" height="40" rx="4" fill={theme.amber + "0a"} stroke={theme.amber + "33"} strokeWidth="1" />
      <text x="645" y="318" textAnchor="middle" fill={theme.muted} fontSize="10">Follower</text>
      <text x="645" y="332" textAnchor="middle" fill={theme.muted} fontSize="9">Broker 3</text>

      <rect x="470" y="352" width="230" height="35" rx="4" fill="#1e2430" />
      <text x="585" y="368" textAnchor="middle" fill={theme.muted} fontSize="10">ISR: {"{"}B1, B2, B3{"}"} — committed when all ack</text>
      <text x="585" y="382" textAnchor="middle" fill={theme.muted} fontSize="9">acks=all: waits for HW advance on all ISR</text>

      {/* ── KRAFT CONTROLLER ── */}
      <rect x="170" y="410" width="550" height="55" rx="6" fill="#1a1520" stroke={theme.purple + "88"} strokeWidth="1.5" />
      <text x="445" y="432" textAnchor="middle" fill={theme.purple} fontSize="11" fontWeight="600">KRaft Controller Quorum (3-node Raft, replaces ZooKeeper)</text>
      <text x="445" y="448" textAnchor="middle" fill={theme.muted} fontSize="10">Active Controller → __cluster_metadata topic (partition leadership, ISR, topic config, broker registry)</text>
      <text x="445" y="462" textAnchor="middle" fill={theme.muted} fontSize="9">Brokers send BrokerHeartbeat RPCs; MetadataLoader propagates deltas to ReplicaManager</text>

      {/* ── __consumer_offsets ── */}
      <rect x="210" y="480" width="190" height="40" rx="6" fill={theme.purple + "11"} stroke={theme.purple + "44"} strokeWidth="1" />
      <text x="305" y="498" textAnchor="middle" fill={theme.purple} fontSize="10" fontWeight="600">__consumer_offsets</text>
      <text x="305" y="514" textAnchor="middle" fill={theme.muted} fontSize="9">committed offsets per group+partition</text>

      {/* ── ZERO COPY ── */}
      <rect x="520" y="480" width="210" height="40" rx="6" fill={theme.green + "11"} stroke={theme.green + "44"} strokeWidth="1" />
      <text x="625" y="498" textAnchor="middle" fill={theme.green} fontSize="10" fontWeight="600">Zero-Copy Transfer</text>
      <text x="625" y="514" textAnchor="middle" fill={theme.muted} fontSize="9">sendfile(): page cache → socket (no userspace)</text>

      {/* ── ARROWS ── */}
      {/* Producer → Network Layer */}
      <line x1="130" y1="80" x2="168" y2="90" stroke={theme.blue} strokeWidth="1.5" markerEnd="url(#ah-blue)" />
      <text x="148" y="78" fill={theme.blue} fontSize="9" textAnchor="middle">Produce</text>
      <text x="148" y="89" fill={theme.blue} fontSize="9" textAnchor="middle">Request</text>

      {/* Network layer → I/O Threads */}
      <line x1="445" y1="130" x2="445" y2="143" stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#ah)" />

      {/* I/O Threads → Commit Log */}
      <line x1="350" y1="190" x2="303" y2="203" stroke={theme.amber} strokeWidth="1.5" markerEnd="url(#ah-amber)" />
      <text x="320" y="200" fill={theme.amber} fontSize="9">append</text>

      {/* I/O Threads → ISR */}
      <line x1="540" y1="190" x2="585" y2="203" stroke={theme.amber} strokeWidth="1.5" markerEnd="url(#ah-amber)" />
      <text x="570" y="200" fill={theme.amber} fontSize="9">replicate</text>

      {/* Followers fetch arrow */}
      <line x1="525" y1="300" x2="585" y2="288" stroke={theme.amber} strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#ah-amber)" />
      <line x1="645" y1="300" x2="585" y2="288" stroke={theme.amber} strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#ah-amber)" />

      {/* Network → Consumer (zero copy) */}
      <line x1="720" y1="108" x2="758" y2="80" stroke={theme.green} strokeWidth="1.5" markerEnd="url(#ah-green)" />
      <text x="748" y="102" fill={theme.green} fontSize="9">Fetch</text>
      <text x="748" y="113" fill={theme.green} fontSize="9">Response</text>
      <line x1="720" y1="120" x2="758" y2="155" stroke={theme.green} strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#ah-green)" />

      {/* Broker ↔ KRaft */}
      <line x1="445" y1="425" x2="445" y2="408" stroke={theme.purple + "88"} strokeWidth="1" markerEnd="url(#ah-purple)" />

      {/* ── LEGEND ── */}
      <rect x="20" y="490" width="130" height="76" rx="6" fill="#13161e" stroke={theme.border} strokeWidth="1" />
      <text x="85" y="508" textAnchor="middle" fill={theme.muted} fontSize="10" fontWeight="600">LEGEND</text>
      <line x1="30" y1="522" x2="55" y2="522" stroke={theme.blue} strokeWidth="2" />
      <text x="60" y="526" fill={theme.muted} fontSize="9">Command / Input</text>
      <line x1="30" y1="536" x2="55" y2="536" stroke={theme.green} strokeWidth="2" />
      <text x="60" y="540" fill={theme.muted} fontSize="9">Query / Output</text>
      <line x1="30" y1="550" x2="55" y2="550" stroke={theme.amber} strokeWidth="2" />
      <text x="60" y="554" fill={theme.muted} fontSize="9">Events / Async</text>
      <line x1="30" y1="562" x2="55" y2="562" stroke={theme.purple} strokeWidth="2" />
      <text x="60" y="566" fill={theme.muted} fontSize="9">Storage / Control</text>
    </svg>

    {/* Cloud mapping table */}
    <div style={{ marginTop: 24 }}>
      <h3 style={{ color: theme.text, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Cloud Provider Mapping</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: theme.surface }}>
              {["Component", "AWS", "Azure", "GCP"].map((h, i) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: [theme.muted, theme.aws, theme.azure, theme.gcp][i] || theme.muted, borderBottom: `1px solid ${theme.border}`, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Broker / Cluster", "MSK (Managed Streaming for Kafka)", "Azure Event Hubs (Kafka surface) or HDInsight Kafka", "Confluent Cloud on GCP or self-hosted GKE"],
              ["Log / Persistent Storage", "EBS (gp3) per broker + S3 (tiered storage via MSK)", "Azure Managed Disks + Blob Storage (tiered)", "Persistent Disk + GCS (tiered via Confluent)"],
              ["Topic/Metadata Store (KRaft)", "MSK manages internally; no ZooKeeper exposure since MSK 2.x", "Event Hubs uses internal metadata service", "Managed by Confluent control plane on GCP"],
              ["Consumer Offset Store (__consumer_offsets)", "Internal topic on MSK brokers", "Internal topic on Event Hubs / HDInsight", "Internal topic — same across all providers"],
              ["Schema Registry", "Glue Schema Registry (Avro/JSON/Protobuf)", "Azure Schema Registry (Event Hubs)", "Confluent Schema Registry on GCP"],
              ["Stream Processing", "Kinesis Data Analytics (Flink) or MSK + Flink on ECS", "Azure Stream Analytics or HDInsight Flink", "Dataflow (Apache Beam) or Flink on Dataproc"],
              ["Connector Framework", "MSK Connect (Kafka Connect managed)", "Azure Event Hubs Kafka Connect", "Confluent Cloud connectors or self-hosted Connect"],
              ["Monitoring / Metrics", "CloudWatch + MSK Prometheus endpoint", "Azure Monitor + Prometheus scraping", "Cloud Monitoring + Prometheus on GKE"],
            ].map(([comp, aws, azure, gcp], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? theme.surface : "transparent", borderBottom: `1px solid ${theme.border + "66"}` }}>
                <td style={{ padding: "8px 12px", color: theme.text, fontWeight: 500 }}>{comp}</td>
                <td style={{ padding: "8px 12px", color: theme.muted }}><span style={{ color: theme.aws, marginRight: 4 }}>▸</span>{aws}</td>
                <td style={{ padding: "8px 12px", color: theme.muted }}><span style={{ color: theme.azure, marginRight: 4 }}>▸</span>{azure}</td>
                <td style={{ padding: "8px 12px", color: theme.muted }}><span style={{ color: theme.gcp, marginRight: 4 }}>▸</span>{gcp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ color: theme.muted, fontSize: 11, marginTop: 8 }}>
        Note: Azure Event Hubs exposes a Kafka-compatible surface (not native Kafka), which means advanced features like log compaction, exactly-once transactions, and Kafka Streams have partial or no support. MSK and Confluent Cloud on GCP are full Kafka implementations.
      </p>
    </div>
  </div>
);

// ─── TAB 2: CONCEPTS ─────────────────────────────────────────────────────────

const concepts = [
  {
    term: "Commit Log",
    source: "Jay Kreps, 'The Log: What every software engineer should know about real-time data\\'s unifying abstraction' (2013)",
    def: "A partition is an ordered, append-only sequence of records stored on disk. Records are assigned monotonically increasing offsets and are never modified in-place.",
    why: "Sequential disk writes (append-only) are orders of magnitude faster than random writes. This is the primary reason Kafka achieves millions of messages/sec on commodity hardware.",
    mistake: "Treating Kafka as a queue where messages are deleted on consumption. Messages persist until the retention policy removes them, allowing independent consumer groups to replay at will.",
    color: theme.purple,
  },
  {
    term: "Partition & Offset",
    source: "Apache Kafka documentation — Topics and Partitions",
    def: "A topic is sharded into N partitions; each partition is an independent commit log on one broker. An offset is a 64-bit integer uniquely identifying a record's position within a partition.",
    why: "Partitions are the unit of parallelism. Adding partitions increases both write throughput (multiple leaders) and read throughput (multiple consumers in a group). Offsets enable exactly-once and at-least-once semantics.",
    mistake: "Assuming global message order across partitions. Kafka only guarantees order within a single partition. For total order, use a single partition — but this caps throughput to one consumer.",
    color: theme.blue,
  },
  {
    term: "Log Segment",
    source: "Confluent Developer — Apache Kafka Internal Architecture; Strimzi Blog — Kafka Storage Internals (2021)",
    def: "Each partition is physically split into rolling segment files on disk. Each segment consists of a .log (record data), .index (offset→byte position), and .timeindex (timestamp→offset) file.",
    why: "Segmented storage enables efficient deletion (drop whole segment files), bounded search (binary search within index), and zero-copy reads. The active segment is the only one being written; sealed segments are immutable.",
    mistake: "Assuming log.retention.ms is a hard ceiling. A segment is only deleted when the entire segment is older than the retention limit. A record just at the boundary can survive significantly longer than configured.",
    color: theme.purple,
  },
  {
    term: "In-Sync Replicas (ISR)",
    source: "Confluent Documentation — Kafka Replication; original ISR design by Jay Kreps et al.",
    def: "The ISR is the set of follower replicas that are fully caught up to the leader's log end offset (LEO) within replica.lag.time.max.ms (default 30s). A write is 'committed' only when all ISR members acknowledge it.",
    why: "The ISR model avoids the performance cost of majority quorum (like Raft/Paxos) while still providing tunable durability. With acks=all and min.insync.replicas=2, you guarantee at least one replica survives any single broker failure.",
    mistake: "Conflating ISR membership with availability. A replica removed from ISR due to lag is still alive; it rejoins after fully re-syncing. An unclean leader election (allow.auto.leader.rebalance) risks data loss by electing a non-ISR replica.",
    color: theme.amber,
  },
  {
    term: "High Watermark (HW) vs Log End Offset (LEO)",
    source: "Confluent Developer — Apache Kafka Internal Architecture (Broker module)",
    def: "LEO is the offset of the next record to be written on a given replica. HW is the highest offset that has been committed across all ISR members. Consumers can only read up to the HW, not beyond.",
    why: "HW prevents consumers from reading uncommitted data that could be rolled back if the leader fails. The gap between HW and LEO on the leader represents in-flight, not-yet-replicated writes.",
    mistake: "Expecting a consumer to immediately read a message that was just produced with acks=1. The record is written to the leader (advances LEO) but the HW only advances after all ISR replicas fetch it.",
    color: theme.amber,
  },
  {
    term: "Purgatory (Deferred Request Queue)",
    source: "Confluent Developer — Apache Kafka Internal Architecture (Broker module)",
    def: "Purgatory is an in-memory map-like structure holding produce/fetch requests that cannot be completed immediately — e.g., a produce request waiting for ISR replication, or a fetch request waiting for min.bytes to accumulate.",
    why: "Without purgatory, I/O threads would block waiting for replication, destroying throughput. Purgatory allows async completion: the I/O thread deposits the request, and a background watcher fires when the condition is met.",
    mistake: "Assuming high purgatory size is always a problem. Some is expected and healthy. Alert instead on purgatory growing unboundedly — indicating ISR followers are consistently lagging or consumers are polling too aggressively.",
    color: theme.red,
  },
  {
    term: "Zero-Copy Transfer",
    source: "Confluent Developer — Inside the Kafka Broker (Network Thread section)",
    def: "When serving fetch requests, Kafka uses the Linux sendfile() syscall to transfer bytes directly from the page cache to the network socket — bypassing userspace entirely.",
    why: "Traditional reads copy data: disk → kernel buffer → userspace buffer → socket buffer. Zero-copy eliminates the userspace copy, reducing CPU usage by ~50–70% for read-heavy workloads. LinkedIn reported this as a key factor in Kafka's throughput advantage.",
    mistake: "Expecting zero-copy to work when SSL/TLS is enabled. Encryption requires data to pass through userspace (OpenSSL), disabling zero-copy. Kafka with TLS will show higher CPU per byte consumed — factor this into capacity planning.",
    color: theme.green,
  },
  {
    term: "KRaft (Kafka Raft Metadata Mode)",
    source: "KIP-500 (Apache Kafka Improvement Proposal); Red Hat Developer — Deep dive into KRaft (2025); Confluent KRaft Overview",
    def: "KRaft replaces ZooKeeper with an internal Raft quorum of Kafka controller nodes. Metadata (topics, partition assignments, ISR, configs) is stored in a special __cluster_metadata partition, replicated via the Raft consensus protocol.",
    why: "ZooKeeper imposed a practical ceiling of ~200k partitions per cluster. KRaft enables millions of partitions, eliminates operational complexity of a second distributed system, and dramatically reduces controlled/uncontrolled shutdown recovery time.",
    mistake: "Treating KRaft controllers as just 'fancy ZooKeeper'. In KRaft, controllers are also brokers in 'combined mode' (for small clusters) or dedicated controller nodes. The active controller is the Raft leader; follower controllers are hot standbys, not passive observers.",
    color: theme.purple,
  },
];

const ConceptCard = ({ c }) => (
  <div style={{ background: theme.surface, border: `1px solid ${c.color}44`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontWeight: 700, color: c.color, fontSize: 14 }}>{c.term}</span>
      <span style={{ color: theme.muted, fontSize: 10, fontStyle: "italic" }}>as per: {c.source}</span>
    </div>
    <p style={{ color: theme.text, fontSize: 13, margin: "0 0 8px", lineHeight: 1.6 }}>{c.def}</p>
    <div style={{ background: c.color + "0d", borderLeft: `3px solid ${c.color}`, padding: "6px 10px", marginBottom: 6, borderRadius: "0 4px 4px 0" }}>
      <span style={{ color: c.color, fontSize: 11, fontWeight: 600 }}>WHY IT MATTERS · </span>
      <span style={{ color: theme.muted, fontSize: 12 }}>{c.why}</span>
    </div>
    <div style={{ background: theme.red + "0d", borderLeft: `3px solid ${theme.red}`, padding: "6px 10px", borderRadius: "0 4px 4px 0" }}>
      <span style={{ color: theme.red, fontSize: 11, fontWeight: 600 }}>COMMON MISTAKE · </span>
      <span style={{ color: theme.muted, fontSize: 12 }}>{c.mistake}</span>
    </div>
  </div>
);

const ConceptsTab = () => (
  <div>
    {concepts.map((c, i) => <ConceptCard key={i} c={c} />)}

    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 16, marginTop: 8 }}>
      <h3 style={{ color: theme.text, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>When to Use / When to Avoid</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: theme.green + "0d", border: `1px solid ${theme.green}33`, borderRadius: 6, padding: 12 }}>
          <div style={{ color: theme.green, fontWeight: 600, fontSize: 12, marginBottom: 8 }}>✓ STRONG FIT</div>
          {["High-throughput event ingestion (telemetry, logs, CDC, user activity)", "Fan-out: one producer, multiple independent consumer groups", "Event replay and audit logging requirements", "Decoupling microservices with durable, ordered messaging", "Stream processing pipelines (Kafka Streams, Flink)", "Exactly-once processing with idempotent producers + transactions"].map((t, i) => (
            <div key={i} style={{ color: theme.muted, fontSize: 12, marginBottom: 4 }}>• {t}</div>
          ))}
        </div>
        <div style={{ background: theme.red + "0d", border: `1px solid ${theme.red}33`, borderRadius: 6, padding: 12 }}>
          <div style={{ color: theme.red, fontWeight: 600, fontSize: 12, marginBottom: 8 }}>✗ POOR FIT</div>
          {["Request/reply RPC patterns (Kafka can do it, but adds latency and complexity vs. gRPC)", "Small message volumes (&lt;1k events/day) — operational overhead unjustified", "Job queues needing per-message ACK/retry with visibility timeouts (use SQS, RabbitMQ)", "Very long retention with complex query patterns (use a data warehouse)", "Global message ordering across high-cardinality keys (forces single partition)"].map((t, i) => (
            <div key={i} style={{ color: theme.muted, fontSize: 12, marginBottom: 4 }}>• {t}</div>
          ))}
        </div>
      </div>
    </div>

    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 16, marginTop: 12 }}>
      <h3 style={{ color: theme.text, fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Real-World Examples</h3>
      {[
        { who: "LinkedIn", what: "Kafka was invented at LinkedIn (Jay Kreps, Neha Narkhede, Jun Rao). They use it to process 7+ trillion messages/day across activity feeds, operational metrics, and CDC pipelines.", color: theme.blue },
        { who: "Uber", what: "uReplicator (Uber Engineering) — a Kafka MirrorMaker replacement handling cross-datacenter replication of tens of billions of messages/day with partition-level failover.", color: theme.amber },
        { who: "Netflix", what: "Kafka as the backbone for their keystone pipeline — ingesting 500B+ events/day for real-time personalization, A/B testing, and operational monitoring.", color: theme.red },
        { who: "Cloudflare", what: "Uses Kafka for streaming 13M+ HTTP events/second from edge nodes to analytics and security detection pipelines.", color: theme.amber },
        { who: "Stripe", what: "Uses Kafka for internal event bus connecting payments, fraud detection, and ledger services with exactly-once delivery guarantees.", color: theme.purple },
      ].map(({ who, what, color }, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
          <Badge label={who} color={color} />
          <span style={{ color: theme.muted, fontSize: 12, lineHeight: 1.5 }}>{what}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── TAB 3: IMPLEMENTATIONS ──────────────────────────────────────────────────

const LANGS = ["Go", "Python", "TypeScript", "Rust", "Java"];

const goCode = `// Pattern: Kafka-like Commit Log (in-memory reference implementation)
// Reference: Jay Kreps, "The Log" (2013); Apache Kafka source
// Production note: Real Kafka uses mmap'd segment files + sendfile syscall

package commitlog

import (
    "context"
    "errors"
    "fmt"
    "sync"
    "time"
)

// ── Domain Types ─────────────────────────────────────────────────────────────

type Offset int64

type Record struct {
    Key       []byte
    Value     []byte
    Timestamp time.Time
    Headers   map[string]string
}

type RecordBatch struct {
    Records   []Record
    ProducerID int64   // for idempotence tracking
    Sequence  int32
}

var (
    ErrOffsetOutOfRange = errors.New("offset out of range")
    ErrSegmentFull      = errors.New("segment is full")
    ErrPartitionClosed  = errors.New("partition is closed")
)

// ── Segment (maps to .log + .index files on disk) ────────────────────────────

type indexEntry struct {
    relativeOffset uint32
    position       uint32
}

type segment struct {
    mu          sync.RWMutex
    baseOffset  Offset
    records     []Record       // in production: mmap'd .log file
    index       []indexEntry   // in production: .index file
    sizeBytes   int64
    maxBytes    int64          // log.segment.bytes default: 1GB
    sealed      bool
    createdAt   time.Time
}

func newSegment(baseOffset Offset, maxBytes int64) *segment {
    return &segment{
        baseOffset: baseOffset,
        maxBytes:   maxBytes,
        createdAt:  time.Now(),
    }
}

func (s *segment) append(rec Record) (Offset, error) {
    s.mu.Lock()
    defer s.mu.Unlock()

    if s.sealed {
        return 0, ErrSegmentFull
    }

    relOffset := uint32(len(s.records))
    position := uint32(s.sizeBytes)

    // Sparse index: only index every ~4096 bytes (log.index.interval.bytes)
    if s.sizeBytes == 0 || s.sizeBytes%4096 == 0 {
        s.index = append(s.index, indexEntry{relOffset, position})
    }

    s.records = append(s.records, rec)
    s.sizeBytes += int64(len(rec.Key) + len(rec.Value) + 128) // approx overhead

    abs := s.baseOffset + Offset(relOffset)

    if s.sizeBytes >= s.maxBytes {
        s.sealed = true
    }

    return abs, nil
}

// Binary search on sparse index, then linear scan within index interval
func (s *segment) read(offset Offset) (Record, error) {
    s.mu.RLock()
    defer s.mu.RUnlock()

    rel := int(offset - s.baseOffset)
    if rel < 0 || rel >= len(s.records) {
        return Record{}, ErrOffsetOutOfRange
    }
    return s.records[rel], nil
}

// ── Partition ─────────────────────────────────────────────────────────────────

type Partition struct {
    mu             sync.RWMutex
    id             int
    segments       []*segment
    activeSegment  *segment
    logEndOffset   Offset       // LEO: next offset to be written
    highWatermark  Offset       // HW: highest committed offset (all ISR acked)
    segmentMaxBytes int64
    closed         bool
}

func NewPartition(id int, segmentMaxBytes int64) *Partition {
    if segmentMaxBytes <= 0 {
        segmentMaxBytes = 1 << 30 // 1GB default
    }
    first := newSegment(0, segmentMaxBytes)
    return &Partition{
        id:              id,
        segments:        []*segment{first},
        activeSegment:   first,
        segmentMaxBytes: segmentMaxBytes,
    }
}

// Append writes a batch and returns the base offset of the batch.
// In production, the I/O thread validates CRC before calling this.
func (p *Partition) Append(ctx context.Context, batch RecordBatch) (Offset, error) {
    p.mu.Lock()
    defer p.mu.Unlock()

    if p.closed {
        return 0, ErrPartitionClosed
    }

    baseOffset := p.logEndOffset

    for _, rec := range batch.Records {
        offset, err := p.activeSegment.append(rec)
        if err != nil {
            if !errors.Is(err, ErrSegmentFull) {
                return 0, fmt.Errorf("append to segment: %w", err)
            }
            // Roll to a new segment
            next := newSegment(p.logEndOffset, p.segmentMaxBytes)
            p.segments = append(p.segments, next)
            p.activeSegment = next

            offset, err = p.activeSegment.append(rec)
            if err != nil {
                return 0, fmt.Errorf("append to new segment: %w", err)
            }
        }
        _ = offset
        p.logEndOffset++
    }

    return baseOffset, nil
}

// AdvanceHighWatermark is called by the leader once all ISR replicas
// have fetched up to 'offset'. Consumers can read up to HW only.
func (p *Partition) AdvanceHighWatermark(offset Offset) {
    p.mu.Lock()
    defer p.mu.Unlock()
    if offset > p.highWatermark && offset <= p.logEndOffset {
        p.highWatermark = offset
    }
}

// Read returns records from [startOffset, min(startOffset+maxRecords, HW))
func (p *Partition) Read(ctx context.Context, startOffset Offset, maxRecords int) ([]Record, error) {
    p.mu.RLock()
    defer p.mu.RUnlock()

    if startOffset >= p.highWatermark {
        // Nothing committed beyond this point yet — consumer waits (purgatory)
        return nil, nil
    }

    var results []Record
    seg := p.findSegment(startOffset)
    if seg == nil {
        return nil, ErrOffsetOutOfRange
    }

    curr := startOffset
    for len(results) < maxRecords && curr < p.highWatermark {
        rec, err := seg.read(curr)
        if err != nil {
            break
        }
        results = append(results, rec)
        curr++
    }

    return results, nil
}

func (p *Partition) findSegment(offset Offset) *segment {
    // Binary search over segment base offsets (O(log N))
    lo, hi := 0, len(p.segments)-1
    for lo <= hi {
        mid := (lo + hi) / 2
        seg := p.segments[mid]
        if seg.baseOffset <= offset {
            if mid+1 >= len(p.segments) || p.segments[mid+1].baseOffset > offset {
                return seg
            }
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    return nil
}

func (p *Partition) LEO() Offset {
    p.mu.RLock()
    defer p.mu.RUnlock()
    return p.logEndOffset
}

func (p *Partition) HW() Offset {
    p.mu.RLock()
    defer p.mu.RUnlock()
    return p.highWatermark
}

// ── Usage Example ─────────────────────────────────────────────────────────────

func Example() {
    ctx := context.Background()
    part := NewPartition(0, 64*1024) // 64KB segments for testing

    // Producer appends a batch
    batch := RecordBatch{
        ProducerID: 42,
        Sequence:   0,
        Records: []Record{
            {Key: []byte("user-123"), Value: []byte(\`{"event":"login"}\`)},
            {Key: []byte("user-456"), Value: []byte(\`{"event":"purchase"}\`)},
        },
    }

    baseOffset, err := part.Append(ctx, batch)
    if err != nil {
        panic(err)
    }
    fmt.Printf("Batch written at offset %d, LEO=%d, HW=%d\\n",
        baseOffset, part.LEO(), part.HW())

    // Simulate ISR replication ack — leader advances HW
    part.AdvanceHighWatermark(part.LEO())
    fmt.Printf("After ISR ack: HW=%d\\n", part.HW())

    // Consumer fetches from offset 0
    records, err := part.Read(ctx, 0, 10)
    if err != nil {
        panic(err)
    }
    for i, r := range records {
        fmt.Printf("  [offset %d] key=%s value=%s\\n", i, r.Key, r.Value)
    }
}`;

const pythonCode = `# Pattern: Kafka-like Commit Log (in-memory reference implementation)
# Reference: Jay Kreps, "The Log" (2013); Apache Kafka internals
# Production note: Real Kafka uses OS page cache + sendfile; ISR tracked by controller

from __future__ import annotations
from dataclasses import dataclass, field
from threading import RLock
from typing import Protocol
import time

# ── Domain Types ──────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class Record:
    key: bytes
    value: bytes
    timestamp: float = field(default_factory=time.time)
    headers: dict[str, str] = field(default_factory=dict)

@dataclass(frozen=True)
class RecordBatch:
    records: tuple[Record, ...]
    producer_id: int = 0
    sequence: int = 0

type Offset = int

class OffsetOutOfRangeError(Exception): pass
class PartitionClosedError(Exception): pass

# ── Segment Protocol ──────────────────────────────────────────────────────────

class SegmentProtocol(Protocol):
    base_offset: Offset
    sealed: bool
    def append(self, record: Record) -> Offset: ...
    def read(self, offset: Offset) -> Record: ...

# ── Segment Implementation ────────────────────────────────────────────────────

@dataclass
class Segment:
    """Maps to .log + .index + .timeindex files on disk in real Kafka."""
    base_offset: Offset
    max_bytes: int = 1 << 30   # log.segment.bytes default 1GB
    _records: list[Record] = field(default_factory=list, repr=False)
    _index: list[tuple[int, int]] = field(default_factory=list, repr=False)  # (rel_offset, position)
    _time_index: list[tuple[float, int]] = field(default_factory=list, repr=False)  # (ts, offset)
    _size_bytes: int = 0
    sealed: bool = False
    created_at: float = field(default_factory=time.time)

    def append(self, record: Record) -> Offset:
        if self.sealed:
            raise ValueError("Segment is sealed")

        rel_offset = len(self._records)
        position = self._size_bytes

        # Sparse index entry every ~4096 bytes (log.index.interval.bytes)
        if self._size_bytes == 0 or self._size_bytes % 4096 == 0:
            self._index.append((rel_offset, position))
            self._time_index.append((record.timestamp, self.base_offset + rel_offset))

        self._records.append(record)
        self._size_bytes += len(record.key) + len(record.value) + 128  # approx

        if self._size_bytes >= self.max_bytes:
            self.sealed = True

        return self.base_offset + rel_offset

    def read(self, offset: Offset) -> Record:
        rel = offset - self.base_offset
        if rel < 0 or rel >= len(self._records):
            raise OffsetOutOfRangeError(f"Offset {offset} not in segment starting at {self.base_offset}")
        return self._records[rel]

    @property
    def log_end_offset(self) -> Offset:
        return self.base_offset + len(self._records)


# ── Partition ─────────────────────────────────────────────────────────────────

class Partition:
    """
    Represents a single Kafka partition.
    Thread-safe via RLock (matches Kafka's I/O thread pool model).
    """

    def __init__(self, partition_id: int, segment_max_bytes: int = 1 << 30) -> None:
        self._id = partition_id
        self._segment_max_bytes = segment_max_bytes
        self._lock = RLock()
        first = Segment(base_offset=0, max_bytes=segment_max_bytes)
        self._segments: list[Segment] = [first]
        self._active_segment: Segment = first
        self._leo: Offset = 0           # Log End Offset
        self._hw: Offset = 0            # High Watermark
        self._closed: bool = False

    def append(self, batch: RecordBatch) -> Offset:
        """
        Append a record batch. Returns base offset of the batch.
        In production: called by I/O thread after CRC validation.
        """
        with self._lock:
            if self._closed:
                raise PartitionClosedError(f"Partition {self._id} is closed")

            base_offset = self._leo
            for record in batch.records:
                try:
                    self._active_segment.append(record)
                except ValueError:  # segment sealed
                    next_seg = Segment(
                        base_offset=self._leo,
                        max_bytes=self._segment_max_bytes
                    )
                    self._segments.append(next_seg)
                    self._active_segment = next_seg
                    self._active_segment.append(record)
                self._leo += 1

            return base_offset

    def advance_high_watermark(self, offset: Offset) -> None:
        """
        Called by leader after all ISR replicas have fetched up to 'offset'.
        Only committed records (at or below HW) are visible to consumers.
        """
        with self._lock:
            if self._hw < offset <= self._leo:
                self._hw = offset

    def read(self, start_offset: Offset, max_records: int = 100) -> list[Record]:
        """
        Consumers only read up to HW. Requests beyond HW park in purgatory
        until enough bytes arrive or fetch.max.wait.ms expires.
        """
        with self._lock:
            if start_offset >= self._hw:
                return []  # Nothing committed yet — consumer waits

            segment = self._find_segment(start_offset)
            if segment is None:
                raise OffsetOutOfRangeError(f"No segment contains offset {start_offset}")

            results: list[Record] = []
            curr = start_offset
            while len(results) < max_records and curr < self._hw:
                try:
                    results.append(segment.read(curr))
                    curr += 1
                except OffsetOutOfRangeError:
                    break  # crossed into next segment
            return results

    def _find_segment(self, offset: Offset) -> Segment | None:
        """Binary search over segment base offsets."""
        lo, hi = 0, len(self._segments) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            seg = self._segments[mid]
            if seg.base_offset <= offset:
                if mid + 1 >= len(self._segments) or self._segments[mid + 1].base_offset > offset:
                    return seg
                lo = mid + 1
            else:
                hi = mid - 1
        return None

    @property
    def leo(self) -> Offset: return self._leo

    @property
    def hw(self) -> Offset: return self._hw


# ── Usage Example ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    part = Partition(partition_id=0, segment_max_bytes=64 * 1024)

    batch = RecordBatch(
        records=(
            Record(key=b"user-123", value=b'{"event":"login"}'),
            Record(key=b"user-456", value=b'{"event":"purchase"}'),
        ),
        producer_id=42,
        sequence=0,
    )

    base = part.append(batch)
    print(f"Batch at offset={base}, LEO={part.leo}, HW={part.hw}")

    # Simulate ISR replication acknowledgement
    part.advance_high_watermark(part.leo)
    print(f"After ISR ack: HW={part.hw}")

    records = part.read(start_offset=0, max_records=10)
    for i, r in enumerate(records):
        print(f"  [offset {i}] key={r.key!r} value={r.value!r}")`;

const tsCode = `// Pattern: Kafka-like Commit Log (in-memory reference implementation)
// Reference: Jay Kreps, "The Log" (2013); Apache Kafka internals
// Production note: Real segments use OS page cache; zero-copy via sendfile syscall

// ── Domain Types ──────────────────────────────────────────────────────────────

type Offset = number;

interface Record {
  readonly key: Uint8Array;
  readonly value: Uint8Array;
  readonly timestamp: number;
  readonly headers: ReadonlyMap<string, string>;
}

interface RecordBatch {
  readonly records: readonly Record[];
  readonly producerId: number;
  readonly sequence: number;
}

// Discriminated union for results
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

type KafkaError =
  | { type: "OFFSET_OUT_OF_RANGE"; offset: Offset; segmentBase: Offset }
  | { type: "SEGMENT_FULL" }
  | { type: "PARTITION_CLOSED"; id: number };

// ── Segment ───────────────────────────────────────────────────────────────────

interface IndexEntry {
  relativeOffset: number;
  position: number;
}

class Segment {
  private readonly records: Record[] = [];
  private readonly index: IndexEntry[] = [];       // sparse: every ~4096 bytes
  private readonly timeIndex: Array<{ ts: number; offset: Offset }> = [];
  private sizeBytes = 0;
  sealed = false;
  readonly createdAt = Date.now();

  constructor(
    readonly baseOffset: Offset,
    private readonly maxBytes: number = 1 << 30
  ) {}

  append(record: Record): Result<Offset, KafkaError> {
    if (this.sealed) return err({ type: "SEGMENT_FULL" });

    const relOffset = this.records.length;
    const position = this.sizeBytes;

    // Sparse index entry every ~4096 bytes
    if (this.sizeBytes === 0 || this.sizeBytes % 4096 === 0) {
      this.index.push({ relativeOffset: relOffset, position });
      this.timeIndex.push({ ts: record.timestamp, offset: this.baseOffset + relOffset });
    }

    this.records.push(record);
    this.sizeBytes += record.key.byteLength + record.value.byteLength + 128;

    if (this.sizeBytes >= this.maxBytes) {
      this.sealed = true;
    }

    return ok(this.baseOffset + relOffset);
  }

  read(offset: Offset): Result<Record, KafkaError> {
    const rel = offset - this.baseOffset;
    if (rel < 0 || rel >= this.records.length) {
      return err({ type: "OFFSET_OUT_OF_RANGE", offset, segmentBase: this.baseOffset });
    }
    return ok(this.records[rel]);
  }

  get logEndOffset(): Offset {
    return this.baseOffset + this.records.length;
  }
}

// ── Partition ─────────────────────────────────────────────────────────────────

class Partition {
  private segments: Segment[];
  private activeSegment: Segment;
  private leo: Offset = 0;         // Log End Offset
  private hw: Offset = 0;          // High Watermark
  private closed = false;

  constructor(
    readonly id: number,
    private readonly segmentMaxBytes: number = 1 << 30
  ) {
    const first = new Segment(0, segmentMaxBytes);
    this.segments = [first];
    this.activeSegment = first;
  }

  /**
   * Append a batch of records. Returns base offset of the batch.
   * In production: called by I/O thread after CRC validation.
   * The response is held in purgatory until ISR replication completes.
   */
  append(batch: RecordBatch): Result<Offset, KafkaError> {
    if (this.closed) return err({ type: "PARTITION_CLOSED", id: this.id });

    const baseOffset = this.leo;

    for (const record of batch.records) {
      const result = this.activeSegment.append(record);
      if (!result.ok) {
        if (result.error.type !== "SEGMENT_FULL") return result;
        // Roll segment
        const next = new Segment(this.leo, this.segmentMaxBytes);
        this.segments.push(next);
        this.activeSegment = next;
        const retry = this.activeSegment.append(record);
        if (!retry.ok) return retry;
      }
      this.leo++;
    }

    return ok(baseOffset);
  }

  /**
   * Called by the leader once all ISR replicas have fetched up to 'offset'.
   * Advances HW so consumers can read the newly committed records.
   */
  advanceHighWatermark(offset: Offset): void {
    if (offset > this.hw && offset <= this.leo) {
      this.hw = offset;
    }
  }

  /**
   * Read records starting from startOffset, up to the HW.
   * Returns empty array if startOffset >= HW (fetch parks in purgatory).
   */
  read(startOffset: Offset, maxRecords = 100): Result<Record[], KafkaError> {
    if (startOffset >= this.hw) return ok([]);  // wait in purgatory

    const segment = this.findSegment(startOffset);
    if (!segment) return err({ type: "OFFSET_OUT_OF_RANGE", offset: startOffset, segmentBase: 0 });

    const results: Record[] = [];
    let curr = startOffset;
    while (results.length < maxRecords && curr < this.hw) {
      const result = segment.read(curr);
      if (!result.ok) break;
      results.push(result.value);
      curr++;
    }

    return ok(results);
  }

  private findSegment(offset: Offset): Segment | null {
    let lo = 0, hi = this.segments.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const seg = this.segments[mid];
      if (seg.baseOffset <= offset) {
        if (mid + 1 >= this.segments.length || this.segments[mid + 1].baseOffset > offset) {
          return seg;
        }
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return null;
  }

  get logEndOffset(): Offset { return this.leo; }
  get highWatermark(): Offset { return this.hw; }
}

// ── Usage Example ─────────────────────────────────────────────────────────────

const part = new Partition(0, 64 * 1024);

const encode = (s: string) => new TextEncoder().encode(s);

const batch: RecordBatch = {
  producerId: 42,
  sequence: 0,
  records: [
    { key: encode("user-123"), value: encode('{"event":"login"}'), timestamp: Date.now(), headers: new Map() },
    { key: encode("user-456"), value: encode('{"event":"purchase"}'), timestamp: Date.now(), headers: new Map() },
  ],
};

const appendResult = part.append(batch);
if (!appendResult.ok) throw new Error(\`Append failed: \${appendResult.error.type}\`);

console.log(\`Batch at offset=\${appendResult.value}, LEO=\${part.logEndOffset}, HW=\${part.highWatermark}\`);

// Simulate ISR ack — advance HW to LEO
part.advanceHighWatermark(part.logEndOffset);
console.log(\`After ISR ack: HW=\${part.highWatermark}\`);

const readResult = part.read(0, 10);
if (!readResult.ok) throw new Error(\`Read failed: \${readResult.error.type}\`);

const dec = new TextDecoder();
readResult.value.forEach((r, i) =>
  console.log(\`  [offset \${i}] key=\${dec.decode(r.key)} value=\${dec.decode(r.value)}\`)
);`;

const rustCode = `// Pattern: Kafka-like Commit Log (in-memory reference implementation)
// Reference: Jay Kreps, "The Log" (2013); Apache Kafka internals
// Production note: Real Kafka uses mmap'd files + OS page cache + sendfile syscall

use std::sync::{Arc, RwLock};
use thiserror::Error;
use std::time::{SystemTime, UNIX_EPOCH};

// ── Domain Types ──────────────────────────────────────────────────────────────

type Offset = i64;

#[derive(Debug, Clone)]
pub struct Record {
    pub key: Vec<u8>,
    pub value: Vec<u8>,
    pub timestamp: u64,
    pub headers: Vec<(String, String)>,
}

#[derive(Debug, Clone)]
pub struct RecordBatch {
    pub records: Vec<Record>,
    pub producer_id: i64,
    pub sequence: i32,
}

#[derive(Debug, Error)]
pub enum KafkaError {
    #[error("Offset {offset} out of range for segment with base {base}")]
    OffsetOutOfRange { offset: Offset, base: Offset },
    #[error("Segment is sealed (full)")]
    SegmentSealed,
    #[error("Partition {id} is closed")]
    PartitionClosed { id: i32 },
    #[error("No segment contains offset {0}")]
    NoSegmentFound(Offset),
}

// ── Segment ───────────────────────────────────────────────────────────────────

#[derive(Debug)]
struct IndexEntry {
    relative_offset: u32,
    position: u32,
}

struct Segment {
    base_offset: Offset,
    records: Vec<Record>,
    index: Vec<IndexEntry>,       // .index file: sparse, every ~4096 bytes
    time_index: Vec<(u64, Offset)>, // .timeindex: (timestamp, offset)
    size_bytes: i64,
    max_bytes: i64,
    pub sealed: bool,
}

impl Segment {
    fn new(base_offset: Offset, max_bytes: i64) -> Self {
        Self {
            base_offset,
            records: Vec::new(),
            index: Vec::new(),
            time_index: Vec::new(),
            size_bytes: 0,
            max_bytes,
            sealed: false,
        }
    }

    fn append(&mut self, record: Record) -> Result<Offset, KafkaError> {
        if self.sealed {
            return Err(KafkaError::SegmentSealed);
        }

        let rel_offset = self.records.len() as u32;
        let position = self.size_bytes as u32;

        // Sparse index entry every ~4096 bytes (log.index.interval.bytes)
        if self.size_bytes == 0 || self.size_bytes % 4096 == 0 {
            self.index.push(IndexEntry { relative_offset: rel_offset, position });
            self.time_index.push((record.timestamp, self.base_offset + rel_offset as Offset));
        }

        self.size_bytes += (record.key.len() + record.value.len() + 128) as i64;
        self.records.push(record);

        if self.size_bytes >= self.max_bytes {
            self.sealed = true;
        }

        Ok(self.base_offset + rel_offset as Offset)
    }

    fn read(&self, offset: Offset) -> Result<&Record, KafkaError> {
        let rel = (offset - self.base_offset) as usize;
        self.records.get(rel).ok_or(KafkaError::OffsetOutOfRange {
            offset,
            base: self.base_offset,
        })
    }

    fn log_end_offset(&self) -> Offset {
        self.base_offset + self.records.len() as Offset
    }
}

// ── Partition ─────────────────────────────────────────────────────────────────

pub struct Partition {
    id: i32,
    inner: Arc<RwLock<PartitionInner>>,
}

struct PartitionInner {
    segments: Vec<Segment>,
    leo: Offset,   // Log End Offset: next offset to be written
    hw: Offset,    // High Watermark: highest committed offset (all ISR acked)
    segment_max_bytes: i64,
    closed: bool,
}

impl Partition {
    pub fn new(id: i32, segment_max_bytes: i64) -> Self {
        let max = if segment_max_bytes <= 0 { 1 << 30 } else { segment_max_bytes };
        let first = Segment::new(0, max);
        Partition {
            id,
            inner: Arc::new(RwLock::new(PartitionInner {
                segments: vec![first],
                leo: 0,
                hw: 0,
                segment_max_bytes: max,
                closed: false,
            })),
        }
    }

    /// Append a record batch. Returns base offset of the batch.
    /// In production: I/O thread validates CRC, then calls this.
    /// Response parks in purgatory until ISR replication completes.
    pub fn append(&self, batch: RecordBatch) -> Result<Offset, KafkaError> {
        let mut inner = self.inner.write().unwrap();
        if inner.closed {
            return Err(KafkaError::PartitionClosed { id: self.id });
        }

        let base_offset = inner.leo;
        let max_bytes = inner.segment_max_bytes;

        for record in batch.records {
            let active_idx = inner.segments.len() - 1;
            match inner.segments[active_idx].append(record.clone()) {
                Ok(_) => {}
                Err(KafkaError::SegmentSealed) => {
                    let next = Segment::new(inner.leo, max_bytes);
                    inner.segments.push(next);
                    let new_idx = inner.segments.len() - 1;
                    inner.segments[new_idx].append(record)?;
                }
                Err(e) => return Err(e),
            }
            inner.leo += 1;
        }

        Ok(base_offset)
    }

    /// Advance HW after all ISR replicas have fetched up to 'offset'.
    /// Only committed records (≤ HW) are visible to consumers.
    pub fn advance_high_watermark(&self, offset: Offset) {
        let mut inner = self.inner.write().unwrap();
        if offset > inner.hw && offset <= inner.leo {
            inner.hw = offset;
        }
    }

    /// Read records from startOffset up to HW.
    /// Returns empty vec if startOffset >= HW (consumer parks in purgatory).
    pub fn read(&self, start_offset: Offset, max_records: usize) -> Result<Vec<Record>, KafkaError> {
        let inner = self.inner.read().unwrap();

        if start_offset >= inner.hw {
            return Ok(vec![]); // Nothing committed yet
        }

        let seg_idx = Self::find_segment_idx(&inner.segments, start_offset)
            .ok_or(KafkaError::NoSegmentFound(start_offset))?;

        let mut results = Vec::new();
        let mut curr = start_offset;

        while results.len() < max_records && curr < inner.hw {
            match inner.segments[seg_idx].read(curr) {
                Ok(rec) => {
                    results.push(rec.clone());
                    curr += 1;
                }
                Err(_) => break,
            }
        }

        Ok(results)
    }

    fn find_segment_idx(segments: &[Segment], offset: Offset) -> Option<usize> {
        let mut lo = 0usize;
        let mut hi = segments.len().checked_sub(1)?;
        while lo <= hi {
            let mid = (lo + hi) / 2;
            if segments[mid].base_offset <= offset {
                if mid + 1 >= segments.len() || segments[mid + 1].base_offset > offset {
                    return Some(mid);
                }
                lo = mid + 1;
            } else {
                if mid == 0 { return None; }
                hi = mid - 1;
            }
        }
        None
    }

    pub fn leo(&self) -> Offset { self.inner.read().unwrap().leo }
    pub fn hw(&self) -> Offset { self.inner.read().unwrap().hw }
}

// ── Usage Example ─────────────────────────────────────────────────────────────

fn main() -> Result<(), KafkaError> {
    let part = Partition::new(0, 64 * 1024);

    let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as u64;
    let batch = RecordBatch {
        producer_id: 42,
        sequence: 0,
        records: vec![
            Record { key: b"user-123".to_vec(), value: b"{\\"event\\":\\"login\\"}".to_vec(), timestamp: now, headers: vec![] },
            Record { key: b"user-456".to_vec(), value: b"{\\"event\\":\\"purchase\\"}".to_vec(), timestamp: now, headers: vec![] },
        ],
    };

    let base = part.append(batch)?;
    println!("Batch at offset={base}, LEO={}, HW={}", part.leo(), part.hw());

    // Simulate ISR acknowledgement — advance HW
    part.advance_high_watermark(part.leo());
    println!("After ISR ack: HW={}", part.hw());

    let records = part.read(0, 10)?;
    for (i, r) in records.iter().enumerate() {
        println!("  [offset {i}] key={} value={}",
            String::from_utf8_lossy(&r.key),
            String::from_utf8_lossy(&r.value)
        );
    }

    Ok(())
}`;

const javaCode = `// Pattern: Kafka-like Commit Log (in-memory reference implementation)
// Reference: Jay Kreps, "The Log" (2013); Apache Kafka internals
// Production note: Real Kafka uses page cache + sendfile; HW tracked by ReplicaManager

package com.example.kafka;

import java.util.*;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

// ── Domain Types ──────────────────────────────────────────────────────────────

public final class CommitLog {

    record Record(byte[] key, byte[] value, long timestamp, Map<String, String> headers) {
        public static Record of(byte[] key, byte[] value) {
            return new Record(key, value, System.currentTimeMillis(), Map.of());
        }
    }

    record RecordBatch(List<Record> records, long producerId, int sequence) {}

    // Sealed interface for error hierarchy
    sealed interface KafkaError {
        record OffsetOutOfRange(long offset, long segmentBase) implements KafkaError {}
        record PartitionClosed(int id) implements KafkaError {}
        record NoSegmentFound(long offset) implements KafkaError {}
        record SegmentSealed() implements KafkaError {}
    }

    // Result monad — avoids checked exceptions in hot path
    sealed interface Result<T> {
        record Ok<T>(T value) implements Result<T> {}
        record Err<T>(KafkaError error) implements Result<T> {}

        static <T> Result<T> ok(T value) { return new Ok<>(value); }
        static <T> Result<T> err(KafkaError error) { return new Err<>(error); }
    }

    // ── Segment ───────────────────────────────────────────────────────────────

    record IndexEntry(int relativeOffset, int position) {}

    static final class Segment {
        private final long baseOffset;
        private final List<Record> records = new ArrayList<>();
        private final List<IndexEntry> index = new ArrayList<>();  // .index: sparse
        private long sizeBytes = 0;
        private final long maxBytes;
        boolean sealed = false;

        Segment(long baseOffset, long maxBytes) {
            this.baseOffset = baseOffset;
            this.maxBytes = maxBytes;
        }

        Result<Long> append(Record record) {
            if (sealed) return Result.err(new KafkaError.SegmentSealed());

            int relOffset = records.size();
            int position = (int) sizeBytes;

            // Sparse index entry every ~4096 bytes (log.index.interval.bytes)
            if (sizeBytes == 0 || sizeBytes % 4096 == 0) {
                index.add(new IndexEntry(relOffset, position));
            }

            records.add(record);
            sizeBytes += record.key().length + record.value().length + 128;

            if (sizeBytes >= maxBytes) sealed = true;

            return Result.ok(baseOffset + relOffset);
        }

        Result<Record> read(long offset) {
            int rel = (int)(offset - baseOffset);
            if (rel < 0 || rel >= records.size()) {
                return Result.err(new KafkaError.OffsetOutOfRange(offset, baseOffset));
            }
            return Result.ok(records.get(rel));
        }

        long logEndOffset() { return baseOffset + records.size(); }
        long getBaseOffset() { return baseOffset; }
    }

    // ── Partition ─────────────────────────────────────────────────────────────

    public static final class Partition {
        private final int id;
        private final List<Segment> segments = new ArrayList<>();
        private Segment activeSegment;
        private volatile long leo = 0;   // Log End Offset
        private volatile long hw = 0;    // High Watermark
        private final long segmentMaxBytes;
        private volatile boolean closed = false;
        private final ReadWriteLock lock = new ReentrantReadWriteLock();

        public Partition(int id, long segmentMaxBytes) {
            this.id = id;
            this.segmentMaxBytes = segmentMaxBytes > 0 ? segmentMaxBytes : 1L << 30;
            this.activeSegment = new Segment(0, this.segmentMaxBytes);
            this.segments.add(activeSegment);
        }

        /**
         * Append a record batch. Returns base offset of the batch.
         * In production: I/O thread validates CRC, then calls this.
         * Response parks in purgatory until all ISR replicas have fetched.
         */
        public Result<Long> append(RecordBatch batch) {
            lock.writeLock().lock();
            try {
                if (closed) return Result.err(new KafkaError.PartitionClosed(id));

                long baseOffset = leo;
                for (Record record : batch.records()) {
                    var res = activeSegment.append(record);
                    if (res instanceof Result.Err<Long> e) {
                        if (!(e.error() instanceof KafkaError.SegmentSealed)) return Result.err(e.error());
                        // Roll segment
                        Segment next = new Segment(leo, segmentMaxBytes);
                        segments.add(next);
                        activeSegment = next;
                        var retry = activeSegment.append(record);
                        if (retry instanceof Result.Err<Long> re) return Result.err(re.error());
                    }
                    leo++;
                }
                return Result.ok(baseOffset);
            } finally {
                lock.writeLock().unlock();
            }
        }

        /**
         * Advance HW after all ISR replicas have fetched up to 'offset'.
         * Only records at or below HW are visible to consumers.
         */
        public void advanceHighWatermark(long offset) {
            lock.writeLock().lock();
            try {
                if (offset > hw && offset <= leo) hw = offset;
            } finally {
                lock.writeLock().unlock();
            }
        }

        /**
         * Read records from startOffset up to HW.
         * Returns empty list if startOffset >= HW (consumer parks in purgatory).
         */
        public Result<List<Record>> read(long startOffset, int maxRecords) {
            lock.readLock().lock();
            try {
                if (startOffset >= hw) return Result.ok(List.of()); // wait in purgatory

                var segOpt = findSegment(startOffset);
                if (segOpt.isEmpty()) return Result.err(new KafkaError.NoSegmentFound(startOffset));

                var results = new ArrayList<Record>();
                long curr = startOffset;
                while (results.size() < maxRecords && curr < hw) {
                    var res = segOpt.get().read(curr);
                    if (res instanceof Result.Ok<Record> ok) {
                        results.add(ok.value());
                        curr++;
                    } else break;
                }
                return Result.ok(Collections.unmodifiableList(results));
            } finally {
                lock.readLock().unlock();
            }
        }

        private Optional<Segment> findSegment(long offset) {
            int lo = 0, hi = segments.size() - 1;
            while (lo <= hi) {
                int mid = (lo + hi) / 2;
                var seg = segments.get(mid);
                if (seg.getBaseOffset() <= offset) {
                    if (mid + 1 >= segments.size() || segments.get(mid + 1).getBaseOffset() > offset) {
                        return Optional.of(seg);
                    }
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
            return Optional.empty();
        }

        public long getLEO() { return leo; }
        public long getHW() { return hw; }
    }

    // ── Usage Example ─────────────────────────────────────────────────────────

    public static void main(String[] args) {
        var part = new Partition(0, 64 * 1024);

        var batch = new RecordBatch(
            List.of(
                Record.of("user-123".getBytes(), "{\\"event\\":\\"login\\"}".getBytes()),
                Record.of("user-456".getBytes(), "{\\"event\\":\\"purchase\\"}".getBytes())
            ),
            42L, 0
        );

        switch (part.append(batch)) {
            case Result.Ok<Long> ok ->
                System.out.printf("Batch at offset=%d, LEO=%d, HW=%d%n", ok.value(), part.getLEO(), part.getHW());
            case Result.Err<Long> e ->
                System.err.println("Append failed: " + e.error());
        }

        // Simulate ISR replication acknowledgement
        part.advanceHighWatermark(part.getLEO());
        System.out.printf("After ISR ack: HW=%d%n", part.getHW());

        switch (part.read(0, 10)) {
            case Result.Ok<List<Record>> ok -> {
                for (int i = 0; i < ok.value().size(); i++) {
                    var r = ok.value().get(i);
                    System.out.printf("  [offset %d] key=%s value=%s%n",
                        i, new String(r.key()), new String(r.value()));
                }
            }
            case Result.Err<List<Record>> e -> System.err.println("Read failed: " + e.error());
        }
    }
}`;

const codeByLang = { Go: goCode, Python: pythonCode, TypeScript: tsCode, Rust: rustCode, Java: javaCode };

// AWS Implementation
const awsCdkCode = `// infrastructure/cdk/kafka-cluster-stack.ts
// Pattern: Managed Kafka (MSK) with multi-AZ, tiered storage, KRaft mode
// Reference: AWS MSK documentation, MSK Best Practices guide

import * as cdk from 'aws-cdk-lib';
import * as msk from 'aws-cdk-lib/aws-msk';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class KafkaClusterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC with private subnets across 3 AZs (one broker per AZ)
    const vpc = new ec2.Vpc(this, 'KafkaVpc', {
      maxAzs: 3,
      subnetConfiguration: [
        { name: 'private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        { name: 'public',  subnetType: ec2.SubnetType.PUBLIC },
      ],
    });

    const brokerSg = new ec2.SecurityGroup(this, 'BrokerSG', { vpc });
    // Allow internal Kafka traffic (PLAINTEXT_TLS: 9094, inter-broker: 9092)
    brokerSg.addIngressRule(brokerSg, ec2.Port.tcpRange(9092, 9098));

    // MSK Cluster — KRaft mode (ZooKeeper-free), Kafka 3.7+
    // Cost note: kafka.m5.xlarge is the minimum for production (replication traffic)
    const cluster = new msk.CfnCluster(this, 'KafkaCluster', {
      clusterName: 'prod-events',
      kafkaVersion: '3.7.x',  // KRaft GA as of 3.3+, recommended 3.7+
      numberOfBrokerNodes: 3,  // one per AZ
      brokerNodeGroupInfo: {
        instanceType: 'kafka.m5.xlarge',
        clientSubnets: vpc.privateSubnets.map(s => s.subnetId),
        securityGroups: [brokerSg.securityGroupId],
        storageInfo: {
          ebsStorageInfo: {
            volumeSize: 1000,  // GB per broker — scale with data retention needs
            provisionedThroughput: {
              enabled: true,
              volumeThroughput: 500,  // MiB/s — important for high-throughput partitions
            },
          },
        },
      },
      encryptionInfo: {
        encryptionInTransit: { clientBroker: 'TLS', inCluster: true },
        // Note: TLS disables zero-copy transfer; CPU cost ~30% higher per broker
      },
      // KRaft: no ZooKeeper config needed for Kafka 3.4+
      configurationInfo: {
        arn: kafkaConfig.ref,
        revision: 1,
      },
      // Tiered storage (KIP-405): offload old segments to S3 for cost-effective retention
      storageMode: 'TIERED',
      // CloudWatch metrics — PER_BROKER for production alerting
      enhancedMonitoring: 'PER_BROKER',
      openMonitoring: {
        prometheus: {
          jmxExporter: { enabledInBroker: true },
          nodeExporter: { enabledInBroker: true },
        },
      },
    });

    // MSK Custom Configuration
    const kafkaConfig = new msk.CfnConfiguration(this, 'KafkaConfig', {
      name: 'prod-config',
      serverProperties: [
        'auto.create.topics.enable=false',           // explicit topic management
        'default.replication.factor=3',
        'min.insync.replicas=2',                     // acks=all safe with 1 broker failure
        'num.partitions=6',
        'log.retention.hours=168',                   // 7 days
        'log.segment.bytes=1073741824',              // 1GB segments
        'log.index.interval.bytes=4096',             // sparse index frequency
        'num.io.threads=8',                          // tune to broker vCPU count
        'num.network.threads=5',
        'replica.lag.time.max.ms=30000',             // ISR removal threshold
        'unclean.leader.election.enable=false',      // NEVER enable in production
        'compression.type=lz4',                      // good balance throughput/CPU
        'message.max.bytes=1048576',                 // 1MB max message size
      ].join('\\n'),
      kafkaVersionsList: ['3.7.x'],
    });

    // IAM role for MSK Connect (Kafka Connect managed)
    const connectRole = new iam.Role(this, 'MSKConnectRole', {
      assumedBy: new iam.ServicePrincipal('kafkaconnect.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonMSKFullAccess'),
      ],
    });

    new cdk.CfnOutput(this, 'ClusterArn', { value: cluster.ref });
    new cdk.CfnOutput(this, 'VpcId', { value: vpc.vpcId });
  }
}`;

const awsTerraformCode = `# infrastructure/terraform/msk/main.tf
# Pattern: MSK cluster with tiered storage and KRaft mode

terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

# MSK Configuration (broker-level properties)
resource "aws_msk_configuration" "kafka" {
  name              = "prod-kafka-config"
  kafka_versions    = ["3.7.x"]

  server_properties = <<PROPERTIES
auto.create.topics.enable=false
default.replication.factor=3
min.insync.replicas=2
num.partitions=6
log.retention.hours=168
log.segment.bytes=1073741824
log.index.interval.bytes=4096
num.io.threads=8
replica.lag.time.max.ms=30000
unclean.leader.election.enable=false
compression.type=lz4
PROPERTIES
}

# MSK Cluster — KRaft, multi-AZ, tiered storage
resource "aws_msk_cluster" "prod" {
  cluster_name           = "prod-events"
  kafka_version          = "3.7.x"
  number_of_broker_nodes = 3

  broker_node_group_info {
    instance_type   = "kafka.m5.xlarge"
    client_subnets  = var.private_subnet_ids  # one per AZ
    security_groups = [aws_security_group.broker.id]

    storage_info {
      ebs_storage_info {
        volume_size = 1000

        provisioned_throughput {
          enabled           = true
          volume_throughput = 500  # MiB/s — critical for high-throughput workloads
        }
      }
    }
  }

  encryption_info {
    encryption_in_transit {
      client_broker = "TLS"
      in_cluster    = true
    }
  }

  # Tiered storage: older segments offloaded to S3 automatically
  storage_mode = "TIERED"

  configuration_info {
    arn      = aws_msk_configuration.kafka.arn
    revision = aws_msk_configuration.kafka.latest_revision
  }

  enhanced_monitoring = "PER_BROKER"

  open_monitoring {
    prometheus {
      jmx_exporter  { enabled_in_broker = true }
      node_exporter { enabled_in_broker = true }
    }
  }

  tags = { Environment = "production", Service = "kafka" }
}

# CloudWatch Alarms — key Kafka operational signals
resource "aws_cloudwatch_metric_alarm" "consumer_lag" {
  alarm_name          = "kafka-consumer-lag-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "EstimatedMaxTimeLag"
  namespace           = "AWS/Kafka"
  period              = 60
  statistic           = "Maximum"
  threshold           = 60000  # 60s lag
  alarm_description   = "Consumer group is falling behind"
}

resource "aws_cloudwatch_metric_alarm" "isr_under_replicated" {
  alarm_name          = "kafka-isr-under-replicated"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "UnderReplicatedPartitions"
  namespace           = "AWS/Kafka"
  period              = 60
  statistic           = "Maximum"
  threshold           = 0  # ANY under-replicated partition is an alert
}`;

const azureBicepCode = `// infrastructure/azure/kafka.bicep
// Pattern: Azure Event Hubs (Kafka-compatible surface) — Standard/Premium tier
// Note: Event Hubs exposes Kafka protocol (port 9093) but is NOT native Kafka.
//       Kafka Streams, log compaction, and exactly-once transactions have limited/no support.
//       For full Kafka: use Confluent Cloud on Azure or self-hosted AKS + Strimzi.

param location string = resourceGroup().location
param namespaceName string = 'prod-eventhubs'
param skuName string = 'Premium'  // Required for Kafka 1.0+ protocol support

resource eventHubNamespace 'Microsoft.EventHub/namespaces@2023-01-01-preview' = {
  name: namespaceName
  location: location
  sku: {
    name: skuName
    tier: skuName
    capacity: 4  // Processing Units: 1 PU = 1MB/s ingress, 2MB/s egress
  }
  properties: {
    isAutoInflateEnabled: true     // auto-scale capacity
    maximumThroughputUnits: 20
    kafkaEnabled: true             // enables port 9093 Kafka protocol endpoint
    zoneRedundant: true            // multi-AZ for HA
    disableLocalAuth: false
    minimumTlsVersion: '1.2'
  }
}

// Equivalent to a Kafka topic (partition count maps to Event Hub partitions)
resource ordersEventHub 'Microsoft.EventHub/namespaces/eventhubs@2023-01-01-preview' = {
  parent: eventHubNamespace
  name: 'orders'
  properties: {
    partitionCount: 8            // immutable after creation — plan carefully
    messageRetentionInDays: 7    // equivalent to log.retention.hours=168
    // Note: No per-message compaction; capture to ADLS Gen2 for long-term retention
    captureDescription: {
      enabled: true
      encoding: 'Avro'
      destination: {
        name: 'EventHubArchive.AzureBlockBlob'
        properties: {
          storageAccountResourceId: storageAccount.id
          blobContainer: 'kafka-archive'
          archiveNameFormat: '{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}'
        }
      }
    }
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'kafkaarchive\${uniqueString(resourceGroup().id)}'
  location: location
  sku: { name: 'Standard_ZRS' }  // Zone-redundant storage
  kind: 'StorageV2'
}

// Consumer group (equivalent to Kafka consumer group)
resource consumerGroup 'Microsoft.EventHub/namespaces/eventhubs/consumergroups@2023-01-01-preview' = {
  parent: ordersEventHub
  name: 'fraud-detection-service'
}`;

const gcpTerraformCode = `# infrastructure/gcp/kafka/main.tf
# Pattern: Confluent Cloud on GCP (recommended for full Kafka on GCP)
# Alternative: Self-hosted Kafka on GKE using Strimzi operator
# Note: GCP does not offer a native managed Kafka service (as of April 2026).
#       Pub/Sub is GCP's native messaging, but it is NOT Kafka-compatible.

terraform {
  required_providers {
    google     = { source = "hashicorp/google",     version = "~> 5.0" }
    confluent  = { source = "confluentinc/confluent", version = "~> 1.0" }
  }
}

# ── Option A: Confluent Cloud on GCP (full Kafka, managed) ───────────────────

resource "confluent_environment" "prod" {
  display_name = "production"
}

resource "confluent_kafka_cluster" "prod" {
  display_name = "prod-events"
  availability = "MULTI_ZONE"
  cloud        = "GCP"
  region       = "us-central1"

  dedicated {
    cku = 2  # Confluent Kafka Units — each CKU ~500MB/s throughput
  }

  environment { id = confluent_environment.prod.id }
}

resource "confluent_kafka_topic" "orders" {
  kafka_cluster { id = confluent_kafka_cluster.prod.id }
  topic_name         = "orders"
  partitions_count   = 12
  rest_endpoint      = confluent_kafka_cluster.prod.rest_endpoint

  config = {
    "retention.ms"              = "604800000"  # 7 days
    "min.insync.replicas"       = "2"
    "cleanup.policy"            = "delete"
    "compression.type"          = "lz4"
    "max.message.bytes"         = "1048576"
  }

  credentials {
    key    = confluent_api_key.cluster_admin.id
    secret = confluent_api_key.cluster_admin.secret
  }
}

# ── Option B: Self-hosted Kafka on GKE using Strimzi ─────────────────────────
# No direct GCP managed equivalent — requires self-managing broker lifecycle.
# Strimzi provides Kubernetes-native Kafka operator with full feature support.

resource "google_container_cluster" "kafka" {
  name     = "kafka-cluster"
  location = "us-central1"

  node_config {
    machine_type = "n2-standard-8"  # 8 vCPU, 32GB RAM per broker node
    disk_size_gb = 1000
    disk_type    = "pd-ssd"
  }

  node_count = 3  # one broker per node (dedicated node pool recommended)
}

# After cluster creation, install Strimzi via Helm:
# helm repo add strimzi https://strimzi.io/charts/
# helm install strimzi-operator strimzi/strimzi-kafka-operator
#
# Then apply a Kafka CR:
# kubectl apply -f kafka-kraft.yaml  (KRaft cluster definition)
#
# GCS tiered storage: use Strimzi with strimzi-kafka-tiered-storage-gcs plugin`;

// ─── TAB 4: LEADERSHIP ───────────────────────────────────────────────────────

const LeadershipTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

    <div style={{ background: theme.surface, border: `1px solid ${theme.blue}44`, borderRadius: 8, padding: 16 }}>
      <h3 style={{ color: theme.blue, fontWeight: 600, fontSize: 14, marginBottom: 8 }}>📢 Explain to Your Team</h3>
      <p style={{ color: theme.text, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
        Kafka is a distributed commit log: producers append records to ordered, immutable partitions stored across brokers, and consumers read from those partitions at their own pace using numeric offsets. Every partition has a leader broker that handles all writes; follower brokers replicate the data, and only records acknowledged by all in-sync replicas (ISR) are visible to consumers. The cluster metadata — which broker leads which partition, who's in the ISR, topic configs — is managed by a KRaft quorum (Raft consensus, no ZooKeeper) so there's no external coordination system to operate.
      </p>
    </div>

    <div style={{ background: theme.surface, border: `1px solid ${theme.amber}44`, borderRadius: 8, padding: 16 }}>
      <h3 style={{ color: theme.amber, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>⚖️ Justify the Decision (Architecture Review)</h3>
      {[
        ["Why not SQS/RabbitMQ?", "Neither supports multiple independent consumer groups reading the same events at different offsets without message copying. Kafka's commit log model makes fan-out free."],
        ["Why not a database?", "Databases are optimized for random read/write with indexing. Kafka's append-only model achieves 100–1000x higher write throughput for the event ingestion use case, plus built-in replication."],
        ["Why not Pulsar?", "Pulsar separates compute (brokers) and storage (BookKeeper) for elastic scaling, but adds operational complexity. Kafka's simpler architecture is better understood operationally and has a larger ecosystem. Revisit if partition-count elasticity or geo-replication cost becomes a bottleneck."],
        ["Why KRaft over ZooKeeper?", "ZooKeeper caps practical partition count at ~200k and requires operating a second distributed system. KRaft supports millions of partitions and cuts controlled restart time from minutes to seconds."],
      ].map(([q, a], i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ color: theme.amber, fontSize: 12, fontWeight: 600, marginBottom: 3 }}>{q}</div>
          <div style={{ color: theme.muted, fontSize: 12, lineHeight: 1.6 }}>{a}</div>
        </div>
      ))}
    </div>

    <div style={{ background: theme.surface, border: `1px solid ${theme.red}44`, borderRadius: 8, padding: 16 }}>
      <h3 style={{ color: theme.red, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>🔥 Failure Modes & Observability</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["Failure Mode", "Symptom", "Detection", "Mitigation"].map(h => (
                <th key={h} style={{ padding: "6px 10px", textAlign: "left", color: theme.muted, borderBottom: `1px solid ${theme.border}`, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["ISR shrinkage", "Produce latency spikes (acks=all blocks)", "UnderReplicatedPartitions > 0 alert", "Increase replica.lag.time.max.ms; check broker GC / disk I/O"],
              ["Consumer lag growth", "Processing delay; stale data", "kafka_consumer_lag > threshold", "Add consumers (up to partition count); check processing time per record"],
              ["Log segment not rolling", "Retention not deleting old data; disk fills", "Disk usage > 80% alarm", "Check log.roll.ms; force roll via Admin API; verify retention config"],
              ["Purgatory buildup", "High RequestHandlerAvgIdlePercent drop", "PurgatorySize metric growing", "Investigate ISR lag; tune replica.fetch.wait.max.ms"],
              ["Leader imbalance", "Hot broker, uneven CPU/disk", "ActiveControllerCount != 1; leader distribution skew", "Run kafka-leader-election.sh --all-topic-partitions"],
              ["Unclean leader election", "Message loss (gaps in offsets)", "OfflinePartitionsCount > 0 after broker recovery", "Never enable unclean.leader.election.enable in production"],
              ["KRaft quorum loss", "Metadata operations freeze; cannot create topics", "ActiveControllerCount = 0 for > 60s", "Restore majority of controller nodes (3-node: survive 1 failure; 5-node: survive 2)"],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? theme.surface : "transparent", borderBottom: `1px solid ${theme.border + "44"}` }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "7px 10px", color: j === 0 ? theme.red : theme.muted, fontSize: 12 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div style={{ background: theme.surface, border: `1px solid ${theme.purple}44`, borderRadius: 8, padding: 16 }}>
      <h3 style={{ color: theme.purple, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>📈 Scale Implications</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Current → 10x messages/sec", color: theme.blue, items: ["Increase partition count (pre-partition; cannot reduce)", "Add broker nodes and trigger partition reassignment", "Tune num.io.threads and num.network.threads per broker", "Monitor disk throughput — often the first bottleneck"] },
          { label: "10x → 100x messages/sec", color: theme.amber, items: ["Broker count becomes significant cost driver", "Enable tiered storage (S3/GCS) — decouple retention from broker disk", "Consider dedicated controller nodes (not combined mode)", "Evaluate Confluent Cloud or MSK — operational cost vs. infra cost"] },
          { label: "Architectural Revisits", color: theme.red, items: ["Schema evolution: add Schema Registry before you need it", "Exactly-once: transactional producers + enable.idempotence=true", "Multi-region: MirrorMaker2 or Confluent Replicator for active-passive DR", "Consumer group lag > 60s sustained → consider stream processor parallelism (Flink)"] },
        ].map(({ label, color, items }, i) => (
          <div key={i} style={{ background: color + "0a", border: `1px solid ${color}33`, borderRadius: 6, padding: 12 }}>
            <div style={{ color, fontWeight: 600, fontSize: 11, marginBottom: 8 }}>{label}</div>
            {items.map((item, j) => <div key={j} style={{ color: theme.muted, fontSize: 11, marginBottom: 5 }}>• {item}</div>)}
          </div>
        ))}
      </div>
    </div>

    <div style={{ background: theme.surface, border: `1px solid ${theme.green}44`, borderRadius: 8, padding: 16 }}>
      <h3 style={{ color: theme.green, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>✅ Code Review Checklist</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          ["Producer Config", ["acks=all or acks=-1 for durability", "enable.idempotence=true (default Kafka 3.0+)", "retries > 0 with retry.backoff.ms", "Compression enabled (lz4 or zstd)", "No synchronous send() in hot paths — use async callbacks"]],
          ["Consumer Config", ["Auto-commit disabled if at-least-once semantics required", "Explicit commitSync() after processing batch", "max.poll.records tuned to processing capacity", "session.timeout.ms > max.poll.interval.ms gap handled", "Consumer group ID is meaningful and documented"]],
          ["Topic Design", ["Partition count accounts for max expected consumer parallelism", "Replication factor = 3 (not 1) in production", "min.insync.replicas = 2 set at topic level", "Retention policy documented and intentional", "Message key strategy defined (null key = round-robin, no ordering guarantee)"]],
          ["Error Handling", ["DLQ (Dead Letter Queue) topic for poison pills", "Deserialization errors caught and routed, not swallowed", "Circuit breaker around downstream calls inside consumer", "Offset committed only after successful processing", "Schema version compatibility validated (BACKWARD or FULL)"]],
        ].map(([section, items], i) => (
          <div key={i} style={{ background: theme.green + "0a", border: `1px solid ${theme.green}22`, borderRadius: 6, padding: 12 }}>
            <div style={{ color: theme.green, fontWeight: 600, fontSize: 12, marginBottom: 8 }}>{section}</div>
            {items.map((item, j) => <div key={j} style={{ color: theme.muted, fontSize: 11, marginBottom: 4 }}>☐ {item}</div>)}
          </div>
        ))}
      </div>
    </div>

    <div style={{ background: theme.surface, border: `1px solid ${theme.blue}44`, borderRadius: 8, padding: 16 }}>
      <h3 style={{ color: theme.blue, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>❓ Design Review Questions</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {[
          "What is the worst-case consumer lag tolerance? Does the system degrade gracefully at 60s lag?",
          "Have you pre-partitioned for the peak expected consumer concurrency, or are you planning to re-partition later?",
          "What happens when a consumer crashes mid-batch — can it re-process without side-effects?",
          "Is your message key strategy correct? Same key = same partition = ordering. No key = round-robin = no ordering.",
          "Have you defined a DLQ strategy for deserialization failures and poison pill messages?",
          "What is your schema evolution story — who owns the Schema Registry, and which compatibility mode?",
          "Are producers configured with acks=all and min.insync.replicas=2? If not, what's the durability tradeoff?",
          "Does enabling TLS affect zero-copy, and have you accounted for the CPU overhead in broker sizing?",
          "Is KRaft configured with 3 or 5 controller nodes? A 2-node controller cannot tolerate any failure.",
          "What are your retention and tiered storage settings, and have you modeled disk cost over 90/180/365 days?",
        ].map((q, i) => (
          <div key={i} style={{ background: theme.blue + "08", border: `1px solid ${theme.blue}22`, borderRadius: 4, padding: "8px 10px", color: theme.muted, fontSize: 12, lineHeight: 1.5 }}>
            {i + 1}. {q}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── CLOUD TABS ────────────────────────────────────────────────────────────────

const CloudTab = ({ provider, color, iacTabs, sdkNote }) => {
  const [sub, setSub] = useState(0);
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {iacTabs.map((t, i) => (
          <button key={i} onClick={() => setSub(i)} style={{ background: sub === i ? color + "22" : theme.surface, color: sub === i ? color : theme.muted, border: `1px solid ${sub === i ? color : theme.border}`, borderRadius: 4, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>{t.label}</button>
        ))}
      </div>
      <CodeBlock code={iacTabs[sub].code} filename={iacTabs[sub].filename} />
      {sdkNote && <p style={{ color: theme.muted, fontSize: 11, marginTop: 8 }}>{sdkNote}</p>}
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const TABS = ["Architecture", "Core Concepts", "Implementations", "Leadership"];
const IMPL_TABS = ["Core", "AWS", "Azure", "GCP"];

export default function KafkaInternals() {
  const [tab, setTab] = useState(0);
  const [lang, setLang] = useState("Go");
  const [implTab, setImplTab] = useState(0);
  const [awsSub, setAwsSub] = useState(0);

  const awsIac = [
    { label: "CDK (TypeScript)", filename: "infra/cdk/kafka-cluster-stack.ts", code: awsCdkCode },
    { label: "Terraform", filename: "infra/terraform/msk/main.tf", code: awsTerraformCode },
  ];

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.text, fontFamily: "'IBM Plex Sans', system-ui, sans-serif", padding: 0 }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${theme.border}`, padding: "16px 24px", background: theme.surface, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ background: theme.amber + "22", border: `1px solid ${theme.amber}44`, borderRadius: 6, padding: "4px 10px" }}>
          <span style={{ color: theme.amber, fontWeight: 700, fontSize: 12, fontFamily: "monospace" }}>KAFKA</span>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: theme.text }}>Apache Kafka Internals</h1>
          <p style={{ margin: 0, fontSize: 11, color: theme.muted }}>Commit Log · ISR Replication · KRaft · Zero-Copy · Purgatory — Production Reference</p>
        </div>
      </div>

      {/* Main tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${theme.border}`, background: theme.surface, paddingLeft: 24 }}>
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ background: "none", border: "none", borderBottom: tab === i ? `2px solid ${theme.amber}` : "2px solid transparent", color: tab === i ? theme.text : theme.muted, padding: "10px 18px", cursor: "pointer", fontSize: 13, fontWeight: tab === i ? 600 : 400 }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>

        {tab === 0 && <ArchDiagram />}

        {tab === 1 && <ConceptsTab />}

        {tab === 2 && (
          <div>
            {/* Impl sub-tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              {IMPL_TABS.map((t, i) => {
                const colors = [theme.blue, theme.aws, theme.azure, theme.gcp];
                return (
                  <button key={i} onClick={() => setImplTab(i)} style={{ background: implTab === i ? colors[i] + "22" : theme.surface, color: implTab === i ? colors[i] : theme.muted, border: `1px solid ${implTab === i ? colors[i] : theme.border}`, borderRadius: 6, padding: "6px 16px", fontSize: 12, fontWeight: implTab === i ? 600 : 400, cursor: "pointer" }}>{t}</button>
                );
              })}
            </div>

            {/* Core */}
            {implTab === 0 && (
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                  {LANGS.map(l => (
                    <button key={l} onClick={() => setLang(l)} style={{ background: lang === l ? theme.blue + "22" : theme.surface, color: lang === l ? theme.blue : theme.muted, border: `1px solid ${lang === l ? theme.blue : theme.border}`, borderRadius: 4, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>{l}</button>
                  ))}
                </div>
                <div style={{ background: theme.code, borderRadius: 4, padding: "4px 12px", marginBottom: 8, display: "inline-block" }}>
                  <span style={{ color: theme.muted, fontSize: 11, fontFamily: "monospace" }}>implementations/core/{lang.toLowerCase() === "typescript" ? "ts" : lang.toLowerCase()}/commit_log.{lang === "Go" ? "go" : lang === "Python" ? "py" : lang === "TypeScript" ? "ts" : lang === "Rust" ? "rs" : "java"}</span>
                </div>
                <CodeBlock code={codeByLang[lang]} />
              </div>
            )}

            {/* AWS */}
            {implTab === 1 && (
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {awsIac.map((t, i) => (
                    <button key={i} onClick={() => setAwsSub(i)} style={{ background: awsSub === i ? theme.aws + "22" : theme.surface, color: awsSub === i ? theme.aws : theme.muted, border: `1px solid ${awsSub === i ? theme.aws : theme.border}`, borderRadius: 4, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>{t.label}</button>
                  ))}
                </div>
                <CodeBlock code={awsIac[awsSub].code} filename={awsIac[awsSub].filename} />
                <p style={{ color: theme.muted, fontSize: 11, marginTop: 8 }}>MSK SDK: use <code style={{ color: theme.aws }}>aws-sdk-go-v2/service/kafka</code> (Go), <code style={{ color: theme.aws }}>boto3 kafka</code> (Python), or <code style={{ color: theme.aws }}>@aws-sdk/client-kafka</code> (TS) for cluster management. For data-plane (produce/consume), use standard Kafka client libraries (librdkafka, franz-go, confluent-kafka-python) pointed at the MSK bootstrap server.</p>
              </div>
            )}

            {/* Azure */}
            {implTab === 2 && (
              <div>
                <CodeBlock code={azureBicepCode} filename="infra/azure/eventhubs/kafka.bicep" />
                <p style={{ color: theme.muted, fontSize: 11, marginTop: 8 }}>
                  <span style={{ color: theme.amber }}>⚠ Compatibility note:</span> Azure Event Hubs exposes the Kafka protocol on port 9093, meaning standard Kafka client libraries connect without changes. However, it is not native Kafka: log compaction, exactly-once transactions, and Kafka Streams are not supported. For full Kafka on Azure, deploy Confluent Cloud (Azure Marketplace) or self-host via HDInsight / AKS + Strimzi.
                </p>
              </div>
            )}

            {/* GCP */}
            {implTab === 3 && (
              <div>
                <CodeBlock code={gcpTerraformCode} filename="infra/gcp/kafka/main.tf" />
                <p style={{ color: theme.muted, fontSize: 11, marginTop: 8 }}>
                  GCP has no native managed Kafka service. The two supported paths are: (1) <span style={{ color: theme.gcp }}>Confluent Cloud on GCP</span> — full Kafka, billed via GCP Marketplace, supports KRaft and tiered storage to GCS; (2) <span style={{ color: theme.gcp }}>Strimzi on GKE</span> — open-source Kafka operator, full feature parity, self-managed. GCP Pub/Sub is NOT Kafka-compatible and does not support offset-based consumption or consumer groups.
                </p>
              </div>
            )}
          </div>
        )}

        {tab === 3 && <LeadershipTab />}

      </div>
    </div>
  );
}
