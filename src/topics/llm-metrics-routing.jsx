"use client"

import React, { useState } from 'react';

const LLMMetricsRouting = () => {
  const [activeTab, setActiveTab] = useState('architecture');
  const [conceptSection, setConceptSection] = useState('metrics');
  const [implSection, setImplSection] = useState('core');
  const [coreLanguage, setCoreLanguage] = useState('go');

  const tabs = [
    { id: 'architecture', label: 'Architecture' },
    { id: 'concepts', label: 'Core Concepts' },
    { id: 'implementations', label: 'Implementations' },
    { id: 'leadership', label: 'Leadership Angles' }
  ];

  const conceptSections = [
    { id: 'metrics', label: 'Inference Metrics' },
    { id: 'routing', label: 'LLM Routing' }
  ];

  const implSections = [
    { id: 'core', label: 'Core (Language)' }
  ];

  const coreLanguages = [
    { id: 'go', label: 'Go' },
    { id: 'python', label: 'Python' },
    { id: 'rust', label: 'Rust' },
    { id: 'java', label: 'Java 21' }
  ];

  const CodeBlock = ({ code, filename }) => (
    <div className="rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900/80">
      {filename && (
        <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-700/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">{filename}</span>
          <button 
            onClick={() => navigator.clipboard.writeText(code)}
            className="text-xs text-slate-500 hover:text-emerald-400 transition-colors"
          >
            Copy
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-slate-300 font-mono leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </div>
  );

  const ConceptCard = ({ term, source, definition, whyMatters, commonMistake }) => (
    <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/40 hover:border-slate-600/60 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-semibold text-slate-100">{term}</h4>
        {source && <span className="text-xs text-slate-500 bg-slate-700/40 px-2 py-1 rounded">{source}</span>}
      </div>
      <p className="text-slate-300 mb-3 leading-relaxed">{definition}</p>
      <div className="space-y-2">
        <p className="text-sm"><span className="text-emerald-400 font-medium">Why it matters:</span> <span className="text-slate-400">{whyMatters}</span></p>
        <p className="text-sm"><span className="text-amber-400 font-medium">Common mistake:</span> <span className="text-slate-400">{commonMistake}</span></p>
      </div>
    </div>
  );

  const renderArchitecture = () => (
    <div className="space-y-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-100 mb-2">LLM Inference & Routing Architecture</h3>
        <p className="text-slate-400">Two interconnected systems: inference pipeline (prefill → decode) and intelligent routing layer for model selection.</p>
      </div>

      {/* Inference Pipeline Diagram */}
      <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/40">
        <h4 className="text-lg font-medium text-slate-200 mb-4">Inference Pipeline: Prefill → Decode</h4>
        <svg viewBox="0 0 900 320" className="w-full h-auto">
          <defs>
            <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
            </marker>
            <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
            </marker>
            <marker id="arrowPurple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#8b5cf6" />
            </marker>
            <linearGradient id="prefillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
            </linearGradient>
            <linearGradient id="decodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05"/>
            </linearGradient>
          </defs>

          {/* Prefill Phase Box */}
          <rect x="30" y="30" width="380" height="180" rx="12" fill="url(#prefillGrad)" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.5"/>
          <text x="50" y="60" fill="#3b82f6" fontSize="14" fontWeight="600">PREFILL PHASE</text>
          <text x="50" y="80" fill="#94a3b8" fontSize="11">Compute-bound • Parallel processing</text>

          {/* Input Tokens */}
          <rect x="50" y="100" width="100" height="50" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5"/>
          <text x="100" y="120" fill="#3b82f6" fontSize="11" textAnchor="middle" fontWeight="500">Input Tokens</text>
          <text x="100" y="138" fill="#64748b" fontSize="10" textAnchor="middle">[T₁, T₂, ..., Tₙ]</text>

          {/* Attention Computation */}
          <rect x="180" y="100" width="100" height="50" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5"/>
          <text x="230" y="120" fill="#3b82f6" fontSize="11" textAnchor="middle" fontWeight="500">Attention</text>
          <text x="230" y="138" fill="#64748b" fontSize="10" textAnchor="middle">O(n²) compute</text>

          {/* KV Cache */}
          <rect x="310" y="100" width="80" height="50" rx="6" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5"/>
          <text x="350" y="120" fill="#8b5cf6" fontSize="11" textAnchor="middle" fontWeight="500">KV Cache</text>
          <text x="350" y="138" fill="#64748b" fontSize="10" textAnchor="middle">Built</text>

          {/* Prefill arrows */}
          <line x1="150" y1="125" x2="175" y2="125" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)"/>
          <line x1="280" y1="125" x2="305" y2="125" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrowPurple)"/>

          {/* TTFT indicator */}
          <line x1="50" y1="170" x2="390" y2="170" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4"/>
          <text x="220" y="195" fill="#f59e0b" fontSize="11" textAnchor="middle" fontWeight="500">← Time to First Token (TTFT) →</text>

          {/* Decode Phase Box */}
          <rect x="440" y="30" width="430" height="180" rx="12" fill="url(#decodeGrad)" stroke="#10b981" strokeWidth="2" strokeOpacity="0.5"/>
          <text x="460" y="60" fill="#10b981" fontSize="14" fontWeight="600">DECODE PHASE</text>
          <text x="460" y="80" fill="#94a3b8" fontSize="11">Memory-bound • Autoregressive</text>

          {/* KV Cache Read */}
          <rect x="460" y="100" width="80" height="50" rx="6" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5"/>
          <text x="500" y="120" fill="#8b5cf6" fontSize="11" textAnchor="middle" fontWeight="500">KV Cache</text>
          <text x="500" y="138" fill="#64748b" fontSize="10" textAnchor="middle">Read</text>

          {/* Token Gen Loop */}
          <rect x="570" y="100" width="120" height="50" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="1.5"/>
          <text x="630" y="120" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="500">Token Generation</text>
          <text x="630" y="138" fill="#64748b" fontSize="10" textAnchor="middle">One at a time</text>

          {/* Output */}
          <rect x="720" y="100" width="100" height="50" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="1.5"/>
          <text x="770" y="120" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="500">Output Token</text>
          <text x="770" y="138" fill="#64748b" fontSize="10" textAnchor="middle">Streamed</text>

          {/* Decode arrows */}
          <line x1="540" y1="125" x2="565" y2="125" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)"/>
          <line x1="690" y1="125" x2="715" y2="125" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)"/>

          {/* Loop back arrow */}
          <path d="M 770 155 Q 770 175 690 175 Q 630 175 630 155" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3"/>
          <text x="700" y="190" fill="#64748b" fontSize="9" textAnchor="middle">append to cache</text>

          {/* ITL indicator */}
          <line x1="570" y1="170" x2="820" y2="170" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4"/>
          <text x="695" y="195" fill="#f59e0b" fontSize="11" textAnchor="middle" fontWeight="500">← Inter-Token Latency (ITL) →</text>

          {/* Connecting arrow between phases */}
          <line x1="410" y1="125" x2="435" y2="125" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowGreen)"/>
          <text x="422" y="115" fill="#64748b" fontSize="9" textAnchor="middle">First</text>
          <text x="422" y="145" fill="#64748b" fontSize="9" textAnchor="middle">token</text>

          {/* Legend */}
          <rect x="30" y="240" width="840" height="60" rx="8" fill="#1e293b" fillOpacity="0.5"/>
          <text x="50" y="265" fill="#94a3b8" fontSize="11" fontWeight="500">Legend:</text>
          <rect x="110" y="255" width="14" height="14" rx="2" fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6"/>
          <text x="130" y="266" fill="#3b82f6" fontSize="10">Input/Compute</text>
          <rect x="230" y="255" width="14" height="14" rx="2" fill="#10b981" fillOpacity="0.3" stroke="#10b981"/>
          <text x="250" y="266" fill="#10b981" fontSize="10">Output/Decode</text>
          <rect x="350" y="255" width="14" height="14" rx="2" fill="#8b5cf6" fillOpacity="0.3" stroke="#8b5cf6"/>
          <text x="370" y="266" fill="#8b5cf6" fontSize="10">Storage (KV Cache)</text>
          <line x1="470" y1="262" x2="500" y2="262" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4"/>
          <text x="510" y="266" fill="#f59e0b" fontSize="10">Latency Metric</text>
        </svg>
      </div>

      {/* Routing Architecture Diagram */}
      <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/40">
        <h4 className="text-lg font-medium text-slate-200 mb-4">LLM Routing Architecture</h4>
        <svg viewBox="0 0 900 380" className="w-full h-auto">
          <defs>
            <marker id="arrowAmber" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" />
            </marker>
            <linearGradient id="routerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.03"/>
            </linearGradient>
          </defs>

          {/* User Request */}
          <rect x="30" y="140" width="100" height="60" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2"/>
          <text x="80" y="165" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="500">User</text>
          <text x="80" y="182" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="500">Request</text>

          {/* Router Box */}
          <rect x="180" y="40" width="320" height="280" rx="12" fill="url(#routerGrad)" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.5"/>
          <text x="340" y="70" fill="#f59e0b" fontSize="14" textAnchor="middle" fontWeight="600">SEMANTIC ROUTER</text>

          {/* Signal Extraction */}
          <rect x="210" y="95" width="120" height="45" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="270" y="115" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="500">Signal Extraction</text>
          <text x="270" y="130" fill="#64748b" fontSize="9" textAnchor="middle">BERT embeddings</text>

          {/* Classifier */}
          <rect x="350" y="95" width="120" height="45" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="410" y="115" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="500">Classifier</text>
          <text x="410" y="130" fill="#64748b" fontSize="9" textAnchor="middle">Complexity scoring</text>

          {/* Semantic Cache */}
          <rect x="210" y="160" width="120" height="45" rx="6" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5"/>
          <text x="270" y="180" fill="#8b5cf6" fontSize="10" textAnchor="middle" fontWeight="500">Semantic Cache</text>
          <text x="270" y="195" fill="#64748b" fontSize="9" textAnchor="middle">HNSW similarity</text>

          {/* Policy Engine */}
          <rect x="350" y="160" width="120" height="45" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="410" y="180" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="500">Policy Engine</text>
          <text x="410" y="195" fill="#64748b" fontSize="9" textAnchor="middle">Cost/quality rules</text>

          {/* Router Decision */}
          <rect x="280" y="225" width="120" height="45" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2"/>
          <text x="340" y="245" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="600">Model Selection</text>
          <text x="340" y="260" fill="#64748b" fontSize="9" textAnchor="middle">Route decision</text>

          {/* Router internal arrows */}
          <line x1="330" y1="117" x2="345" y2="117" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowAmber)"/>
          <line x1="270" y1="140" x2="270" y2="155" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrowPurple)"/>
          <line x1="410" y1="140" x2="410" y2="155" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowAmber)"/>
          <line x1="270" y1="205" x2="270" y2="235" stroke="#f59e0b" strokeWidth="1.5"/>
          <line x1="270" y1="235" x2="275" y2="235" stroke="#f59e0b" strokeWidth="1.5"/>
          <line x1="410" y1="205" x2="410" y2="235" stroke="#f59e0b" strokeWidth="1.5"/>
          <line x1="410" y1="235" x2="405" y2="235" stroke="#f59e0b" strokeWidth="1.5"/>

          {/* Input arrow to router */}
          <line x1="130" y1="170" x2="175" y2="170" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)"/>
          <line x1="180" y1="170" x2="205" y2="117" stroke="#f59e0b" strokeWidth="1.5"/>

          {/* Model Pool */}
          <rect x="550" y="40" width="320" height="280" rx="12" fill="#1e293b" fillOpacity="0.3" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4"/>
          <text x="710" y="70" fill="#94a3b8" fontSize="14" textAnchor="middle" fontWeight="500">MODEL POOL</text>

          {/* Fast/Cheap Model */}
          <rect x="580" y="95" width="120" height="55" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="1.5"/>
          <text x="640" y="115" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="500">Fast Model</text>
          <text x="640" y="132" fill="#64748b" fontSize="9" textAnchor="middle">GPT-4o-mini, Haiku</text>
          <text x="640" y="145" fill="#64748b" fontSize="9" textAnchor="middle">$0.15/M tokens</text>

          {/* Balanced Model */}
          <rect x="720" y="95" width="120" height="55" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5"/>
          <text x="780" y="115" fill="#3b82f6" fontSize="11" textAnchor="middle" fontWeight="500">Balanced</text>
          <text x="780" y="132" fill="#64748b" fontSize="9" textAnchor="middle">Sonnet, GPT-4o</text>
          <text x="780" y="145" fill="#64748b" fontSize="9" textAnchor="middle">$3/M tokens</text>

          {/* Powerful Model */}
          <rect x="580" y="170" width="120" height="55" rx="6" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5"/>
          <text x="640" y="190" fill="#ef4444" fontSize="11" textAnchor="middle" fontWeight="500">Frontier</text>
          <text x="640" y="207" fill="#64748b" fontSize="9" textAnchor="middle">Opus, GPT-4.5</text>
          <text x="640" y="220" fill="#64748b" fontSize="9" textAnchor="middle">$15/M tokens</text>

          {/* Specialized Model */}
          <rect x="720" y="170" width="120" height="55" rx="6" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5"/>
          <text x="780" y="190" fill="#8b5cf6" fontSize="11" textAnchor="middle" fontWeight="500">Specialized</text>
          <text x="780" y="207" fill="#64748b" fontSize="9" textAnchor="middle">Code, Vision</text>
          <text x="780" y="220" fill="#64748b" fontSize="9" textAnchor="middle">Domain-tuned</text>

          {/* Router to models arrows */}
          <line x1="500" y1="200" x2="540" y2="120" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowGreen)"/>
          <text x="505" y="140" fill="#10b981" fontSize="8">Simple</text>
          <line x1="500" y1="230" x2="540" y2="195" stroke="#ef4444" strokeWidth="1.5"/>
          <text x="505" y="220" fill="#ef4444" fontSize="8">Complex</text>
          <line x1="500" y1="260" x2="540" y2="260" stroke="#8b5cf6" strokeWidth="1.5"/>

          {/* Response back */}
          <rect x="650" y="260" width="120" height="40" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="1.5"/>
          <text x="710" y="285" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="500">Response</text>

          {/* Legend */}
          <rect x="30" y="340" width="840" height="30" rx="6" fill="#1e293b" fillOpacity="0.5"/>
          <text x="50" y="360" fill="#94a3b8" fontSize="10" fontWeight="500">Routing signals:</text>
          <text x="150" y="360" fill="#64748b" fontSize="9">Query complexity • Domain classification • Cost budget • Latency SLO • Privacy constraints • Load balancing</text>
        </svg>
      </div>

      {/* Metrics Formula Reference */}
      <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40">
        <h4 className="text-lg font-medium text-slate-200 mb-4">Key Formulas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
            <p className="text-slate-400 mb-2">End-to-End Latency</p>
            <code className="text-emerald-400 font-mono">E2E = TTFT + (ITL × output_tokens)</code>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
            <p className="text-slate-400 mb-2">Throughput</p>
            <code className="text-emerald-400 font-mono">TPS = total_output_tokens / duration</code>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
            <p className="text-slate-400 mb-2">Goodput (Quality-Adjusted)</p>
            <code className="text-emerald-400 font-mono">Goodput = RPS where TTFT ≤ SLO ∧ E2E ≤ SLO</code>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
            <p className="text-slate-400 mb-2">KV Cache Memory</p>
            <code className="text-emerald-400 font-mono">Memory = 2 × layers × d_model × seq_len × batch × bytes</code>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConcepts = () => (
    <div className="space-y-6">
      <div className="flex space-x-2 mb-6">
        {conceptSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setConceptSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              conceptSection === section.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/40 text-slate-400 hover:text-slate-300 border border-slate-700/40'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {conceptSection === 'metrics' && (
        <div className="space-y-4">
          <ConceptCard
            term="Time to First Token (TTFT)"
            source="NVIDIA GenAI-Perf"
            definition="The latency from request arrival to the first output token. Includes queuing delay, prefill computation, and network latency. TTFT scales with input prompt length because the full attention computation must complete before generation begins."
            whyMatters="TTFT determines perceived responsiveness. Chatbots need TTFT < 500ms; code completion needs < 100ms. Poor TTFT makes applications feel sluggish even if total generation is fast."
            commonMistake="Conflating TTFT with prefill time. TTFT includes scheduling/queue delays—under heavy load, a request may wait in queue for seconds before prefill even starts."
          />
          <ConceptCard
            term="Inter-Token Latency (ITL) / TPOT"
            source="Anyscale, BentoML"
            definition="Time between consecutive output tokens during the decode phase. Also called Time Per Output Token (TPOT). Measures steady-state generation speed after the first token."
            whyMatters="Consistent ITL creates smooth streaming UX. Variable ITL (jitter) is more disruptive than slightly higher average ITL. ITL is memory-bandwidth-bound, not compute-bound."
            commonMistake="Averaging ITL across entire response including first token. Proper ITL excludes TTFT since it measures only the decoding phase characteristic."
          />
          <ConceptCard
            term="KV Cache"
            source="Vaswani et al., NVIDIA TensorRT-LLM"
            definition="Memory structure storing computed Key and Value tensors from attention layers. Without caching, each decode step would recompute attention over all previous tokens (O(n²)). KV cache reduces this to O(n) by storing intermediate states."
            whyMatters="For a 70B model with 200K context, KV cache alone can consume 40-80 GB GPU memory. KV cache size is the primary constraint on context length and batch size."
            commonMistake="Treating KV cache as free memory. Cache eviction policies, PagedAttention for fragmentation, and cross-request caching are critical production concerns."
          />
          <ConceptCard
            term="Prefill vs Decode Phases"
            source="Meta, Databricks"
            definition="Prefill: process all input tokens in parallel, build KV cache. Compute-bound, determines TTFT. Decode: generate tokens autoregressively, one at a time. Memory-bandwidth-bound, determines ITL."
            whyMatters="These phases have opposite bottlenecks. Prefill maxes out tensor cores; decode maxes out memory bandwidth. Mixing them on same hardware creates interference and SLO violations."
            commonMistake="Running prefill and decode on same GPU pool. Disaggregated prefill-decode (used by Meta, Moonshot) separates these to different hardware for independent optimization."
          />
          <ConceptCard
            term="Tokens Per Second (TPS)"
            source="NVIDIA, Databricks"
            definition="Throughput metric measuring total output tokens generated per second across all concurrent requests. TPS = total_output_tokens / benchmark_duration."
            whyMatters="TPS directly maps to cost efficiency and hardware utilization. Higher TPS means lower $/token. Production systems track both user-TPS (per request) and system-TPS (aggregate)."
            commonMistake="Quoting TPS without concurrency context. TPS at concurrency=1 vs concurrency=100 are incomparable. Always specify concurrent request count."
          />
          <ConceptCard
            term="Goodput"
            source="BentoML, DistServe"
            definition="Requests per second that meet defined Service Level Objectives (SLOs). Unlike raw throughput, goodput only counts requests where both TTFT and E2E latency meet targets."
            whyMatters="Raw throughput is meaningless if half your requests violate SLOs. Goodput is the production metric—it reflects actual service quality delivered to users."
            commonMistake="Optimizing for throughput without SLO constraints. You can push TPS sky-high by batching aggressively, but if P99 latency becomes 30s, goodput goes to zero."
          />
          <ConceptCard
            term="End-to-End Latency (E2E)"
            source="Anyscale, AIMultiple"
            definition="Total time from request submission to final token delivery. E2E = TTFT + (ITL × output_tokens). Represents complete user wait time for full response."
            whyMatters="E2E determines if users will wait or abandon. For batch processing, high E2E is acceptable. For interactive use, E2E > 3s causes significant abandonment."
            commonMistake="Measuring E2E without streaming. With streaming, users see partial results immediately—perceived latency is closer to TTFT, not E2E."
          />

          {/* Trade-offs Section */}
          <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40 mt-8">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">Trade-offs: When to Optimize What</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h5 className="text-emerald-400 font-medium mb-2">Optimize TTFT when:</h5>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Building chatbots, coding assistants</li>
                  <li>• Users expect immediate acknowledgment</li>
                  <li>• Streaming responses to UI</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h5 className="text-amber-400 font-medium mb-2">Optimize TPS when:</h5>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Batch processing, data pipelines</li>
                  <li>• Cost is primary constraint</li>
                  <li>• Offline report generation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {conceptSection === 'routing' && (
        <div className="space-y-4">
          <ConceptCard
            term="Semantic Routing"
            source="vLLM Semantic Router, Red Hat"
            definition="Uses embedding-based similarity matching to classify queries by meaning and intent. BERT or similar models convert prompts to vectors, compared against task category embeddings to select appropriate model."
            whyMatters="Semantic routing enables sub-10ms routing decisions without calling an LLM. This makes intelligent model selection practical at scale without adding significant latency overhead."
            commonMistake="Using semantic routing for highly nuanced distinctions. Embeddings work well for coarse categories (simple vs complex) but struggle with subtle differences requiring reasoning."
          />
          <ConceptCard
            term="Cost-Aware Routing"
            source="UC Berkeley, MindStudio"
            definition="Dynamically selects between expensive frontier models and cheaper alternatives based on predicted query difficulty. Route simple queries to GPT-4o-mini ($0.15/M), complex reasoning to Opus ($15/M)—a 100x cost difference."
            whyMatters="Research shows 85% cost reduction while maintaining 95% of GPT-4 performance. Most queries don't need frontier reasoning. 'What time does the store close?' doesn't need $15/M model."
            commonMistake="Binary routing (cheap vs expensive). Production systems use 3-5 tiers with graduated complexity thresholds, not just two buckets."
          />
          <ConceptCard
            term="Cascading Routing"
            source="AWS, Maxim.ai"
            definition="Progressive escalation through model tiers. Start with cheapest model; if confidence is low or output quality fails validation, retry with more capable model. Only pay for expensive inference when needed."
            whyMatters="Cascading captures the long tail—most requests succeed on cheap models, but complex ones automatically escalate. Combines cost efficiency with quality guarantees."
            commonMistake="No escalation budget limits. Without caps, a pathological query could cascade through every tier, costing more than just using the best model upfront."
          />
          <ConceptCard
            term="Semantic Caching"
            source="vLLM SR, Redis"
            definition="Stores responses keyed by semantic similarity rather than exact match. 'What's your refund policy?' and 'How do I get my money back?' return same cached response. Uses HNSW/vector similarity with configurable thresholds."
            whyMatters="Organizations report 30-50% cache hit rates in production. Cache hits cost zero inference—pure latency and cost savings. Especially valuable for FAQ-heavy workloads."
            commonMistake="Single global similarity threshold. Different query categories need different thresholds—factual questions can tolerate looser matching than creative requests."
          />
          <ConceptCard
            term="LLM-Assisted Routing"
            source="AWS, Anthropic Bedrock"
            definition="Uses a lightweight classifier LLM at the entry point to analyze query complexity, domain, and required capabilities, then routes to appropriate model. More sophisticated than embeddings but adds latency and cost."
            whyMatters="LLM classification catches nuances that embeddings miss. Can reason about whether a query needs code execution, vision, or multi-step reasoning—capabilities that determine model selection."
            commonMistake="Using a large model as the router. The routing model should be tiny and fast (< 50ms). Using GPT-4 to decide whether to use GPT-4 defeats the purpose."
          />
          <ConceptCard
            term="Intent-Based Routing"
            source="Maxim.ai, AWS"
            definition="Analyzes query structure, complexity signals, and domain indicators to match requests with specialized models. Goes beyond semantic similarity to consider factors like token count, code patterns, or domain terminology."
            whyMatters="Different intents have different optimal models. Code generation → Codestral. Legal analysis → fine-tuned compliance model. General chat → smallest sufficient model."
            commonMistake="Over-engineering intent categories. Start with 3-5 distinct categories. Beyond 10 categories, maintenance overhead exceeds routing benefits."
          />
          <ConceptCard
            term="Load Balancing & Failover"
            source="MindStudio, vLLM"
            definition="Distributes requests across multiple providers and API keys for reliability and throughput. Includes health checking, automatic failover on provider outages, and rate limit distribution."
            whyMatters="No single provider has 100% uptime. OpenAI outages happen. Having fallback to Anthropic or open-source models maintains availability. Also spreads rate limits across multiple keys."
            commonMistake="Failover without quality parity checks. Failing over from GPT-4 to a 7B model maintains availability but may violate quality SLOs. Match fallback models to capability requirements."
          />

          {/* Routing Patterns Summary */}
          <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40 mt-8">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">Routing Strategy Selection Guide</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 text-slate-400 font-medium">Strategy</th>
                    <th className="text-left py-2 text-slate-400 font-medium">Latency Overhead</th>
                    <th className="text-left py-2 text-slate-400 font-medium">Best For</th>
                    <th className="text-left py-2 text-slate-400 font-medium">Avoid When</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 text-emerald-400">Semantic</td>
                    <td className="py-2">&lt; 10ms</td>
                    <td className="py-2">High-volume, clear categories</td>
                    <td className="py-2">Subtle distinctions needed</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 text-blue-400">LLM-Assisted</td>
                    <td className="py-2">50-200ms</td>
                    <td className="py-2">Complex classification</td>
                    <td className="py-2">Latency-critical apps</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 text-amber-400">Cascading</td>
                    <td className="py-2">Variable</td>
                    <td className="py-2">Quality guarantees</td>
                    <td className="py-2">Predictable latency required</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-purple-400">Caching</td>
                    <td className="py-2">&lt; 5ms</td>
                    <td className="py-2">FAQ-heavy workloads</td>
                    <td className="py-2">Highly unique queries</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const coreImplementations = {
    go: `// Package metrics provides LLM inference metrics collection and routing
// Reference: NVIDIA GenAI-Perf, Anyscale metrics documentation
// Production note: Use sync.Pool for high-frequency metric recording

package metrics

import (
	"context"
	"math"
	"sync"
	"time"
)

// InferenceMetrics captures the key performance indicators for LLM inference
type InferenceMetrics struct {
	RequestID      string
	TTFT           time.Duration // Time to first token
	ITL            []time.Duration // Inter-token latencies
	E2ELatency     time.Duration // End-to-end latency
	InputTokens    int
	OutputTokens   int
	ModelID        string
	QueueTime      time.Duration
	PrefillTime    time.Duration
	StartTime      time.Time
	FirstTokenTime time.Time
	EndTime        time.Time
	mu             sync.Mutex
}

// NewInferenceMetrics creates a new metrics collector for a single request
func NewInferenceMetrics(requestID, modelID string, inputTokens int) *InferenceMetrics {
	return &InferenceMetrics{
		RequestID:   requestID,
		ModelID:     modelID,
		InputTokens: inputTokens,
		StartTime:   time.Now(),
		ITL:         make([]time.Duration, 0, 256),
	}
}

// RecordFirstToken marks the time when first token is generated
func (m *InferenceMetrics) RecordFirstToken() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.FirstTokenTime = time.Now()
	m.TTFT = m.FirstTokenTime.Sub(m.StartTime)
}

// RecordToken records an output token and calculates ITL
func (m *InferenceMetrics) RecordToken() {
	m.mu.Lock()
	defer m.mu.Unlock()
	
	now := time.Now()
	m.OutputTokens++
	
	if m.OutputTokens == 1 {
		return // First token tracked separately via TTFT
	}
	
	var lastTime time.Time
	if len(m.ITL) == 0 {
		lastTime = m.FirstTokenTime
	} else {
		// Calculate from previous token time
		lastTime = m.FirstTokenTime
		for _, d := range m.ITL {
			lastTime = lastTime.Add(d)
		}
	}
	m.ITL = append(m.ITL, now.Sub(lastTime))
}

// Finalize calculates final metrics after generation completes
func (m *InferenceMetrics) Finalize() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.EndTime = time.Now()
	m.E2ELatency = m.EndTime.Sub(m.StartTime)
}

// TPS returns tokens per second for this request
func (m *InferenceMetrics) TPS() float64 {
	if m.E2ELatency == 0 {
		return 0
	}
	return float64(m.OutputTokens) / m.E2ELatency.Seconds()
}

// MeanITL returns average inter-token latency
func (m *InferenceMetrics) MeanITL() time.Duration {
	m.mu.Lock()
	defer m.mu.Unlock()
	
	if len(m.ITL) == 0 {
		return 0
	}
	
	var total time.Duration
	for _, d := range m.ITL {
		total += d
	}
	return total / time.Duration(len(m.ITL))
}

// P99ITL returns the 99th percentile inter-token latency
func (m *InferenceMetrics) P99ITL() time.Duration {
	m.mu.Lock()
	defer m.mu.Unlock()
	
	if len(m.ITL) == 0 {
		return 0
	}
	
	// Copy and sort for percentile calculation
	sorted := make([]time.Duration, len(m.ITL))
	copy(sorted, m.ITL)
	// Simple insertion sort for small arrays
	for i := 1; i < len(sorted); i++ {
		for j := i; j > 0 && sorted[j] < sorted[j-1]; j-- {
			sorted[j], sorted[j-1] = sorted[j-1], sorted[j]
		}
	}
	
	idx := int(math.Ceil(float64(len(sorted)) * 0.99)) - 1
	if idx < 0 {
		idx = 0
	}
	return sorted[idx]
}

// SLO defines service level objectives for inference
type SLO struct {
	MaxTTFT       time.Duration
	MaxE2ELatency time.Duration
	MaxP99ITL     time.Duration
}

// MeetsSLO checks if the metrics satisfy the given SLO
func (m *InferenceMetrics) MeetsSLO(slo SLO) bool {
	if slo.MaxTTFT > 0 && m.TTFT > slo.MaxTTFT {
		return false
	}
	if slo.MaxE2ELatency > 0 && m.E2ELatency > slo.MaxE2ELatency {
		return false
	}
	if slo.MaxP99ITL > 0 && m.P99ITL() > slo.MaxP99ITL {
		return false
	}
	return true
}

// MetricsAggregator collects metrics across multiple requests
type MetricsAggregator struct {
	mu           sync.RWMutex
	metrics      []*InferenceMetrics
	windowStart  time.Time
	windowSize   time.Duration
	sloViolations int
	totalRequests int
}

// NewMetricsAggregator creates a new aggregator with the given window
func NewMetricsAggregator(windowSize time.Duration) *MetricsAggregator {
	return &MetricsAggregator{
		windowStart: time.Now(),
		windowSize:  windowSize,
		metrics:     make([]*InferenceMetrics, 0, 1000),
	}
}

// Record adds a completed request's metrics
func (a *MetricsAggregator) Record(m *InferenceMetrics, slo SLO) {
	a.mu.Lock()
	defer a.mu.Unlock()
	
	a.metrics = append(a.metrics, m)
	a.totalRequests++
	if !m.MeetsSLO(slo) {
		a.sloViolations++
	}
}

// Goodput returns requests per second that meet SLO
func (a *MetricsAggregator) Goodput() float64 {
	a.mu.RLock()
	defer a.mu.RUnlock()
	
	elapsed := time.Since(a.windowStart).Seconds()
	if elapsed == 0 {
		return 0
	}
	successful := a.totalRequests - a.sloViolations
	return float64(successful) / elapsed
}

// SystemTPS returns aggregate tokens per second
func (a *MetricsAggregator) SystemTPS() float64 {
	a.mu.RLock()
	defer a.mu.RUnlock()
	
	var totalTokens int
	for _, m := range a.metrics {
		totalTokens += m.OutputTokens
	}
	
	elapsed := time.Since(a.windowStart).Seconds()
	if elapsed == 0 {
		return 0
	}
	return float64(totalTokens) / elapsed
}`,

    python: `"""
LLM Inference Metrics Collection and Routing
Reference: NVIDIA GenAI-Perf, Anyscale metrics documentation
Production note: Use __slots__ for memory efficiency at scale
"""

from dataclasses import dataclass, field
from typing import Protocol, Sequence
from enum import Enum, auto
from datetime import datetime, timedelta
import statistics
import threading
from abc import ABC, abstractmethod


@dataclass(frozen=True, slots=True)
class SLO:
    """Service Level Objectives for inference quality"""
    max_ttft: timedelta | None = None
    max_e2e_latency: timedelta | None = None
    max_p99_itl: timedelta | None = None


@dataclass
class InferenceMetrics:
    """
    Captures key performance indicators for a single LLM inference request.
    
    Attributes:
        request_id: Unique identifier for the request
        model_id: Model used for inference
        input_tokens: Number of tokens in the prompt
    """
    request_id: str
    model_id: str
    input_tokens: int
    
    # Timing data - populated during inference
    start_time: datetime = field(default_factory=datetime.now)
    first_token_time: datetime | None = None
    end_time: datetime | None = None
    
    # Token timing - ITL for each output token after the first
    itl_samples: list[timedelta] = field(default_factory=list)
    output_tokens: int = 0
    
    # Thread safety for concurrent token recording
    _lock: threading.Lock = field(default_factory=threading.Lock, repr=False)
    _last_token_time: datetime | None = field(default=None, repr=False)
    
    def record_first_token(self) -> None:
        """Mark the generation of the first output token"""
        with self._lock:
            self.first_token_time = datetime.now()
            self._last_token_time = self.first_token_time
            self.output_tokens = 1
    
    def record_token(self) -> None:
        """Record an output token and calculate ITL from previous token"""
        with self._lock:
            now = datetime.now()
            self.output_tokens += 1
            
            if self._last_token_time is not None:
                self.itl_samples.append(now - self._last_token_time)
            self._last_token_time = now
    
    def finalize(self) -> None:
        """Mark inference as complete and calculate final metrics"""
        with self._lock:
            self.end_time = datetime.now()
    
    @property
    def ttft(self) -> timedelta | None:
        """Time to first token"""
        if self.first_token_time is None:
            return None
        return self.first_token_time - self.start_time
    
    @property
    def e2e_latency(self) -> timedelta | None:
        """End-to-end latency"""
        if self.end_time is None:
            return None
        return self.end_time - self.start_time
    
    @property
    def mean_itl(self) -> timedelta | None:
        """Average inter-token latency"""
        if not self.itl_samples:
            return None
        total_us = sum(d.total_seconds() * 1_000_000 for d in self.itl_samples)
        return timedelta(microseconds=total_us / len(self.itl_samples))
    
    @property
    def p99_itl(self) -> timedelta | None:
        """99th percentile inter-token latency"""
        if not self.itl_samples:
            return None
        sorted_samples = sorted(self.itl_samples)
        idx = int(len(sorted_samples) * 0.99)
        return sorted_samples[min(idx, len(sorted_samples) - 1)]
    
    @property
    def tps(self) -> float:
        """Tokens per second for this request"""
        if self.e2e_latency is None or self.e2e_latency.total_seconds() == 0:
            return 0.0
        return self.output_tokens / self.e2e_latency.total_seconds()
    
    def meets_slo(self, slo: SLO) -> bool:
        """Check if metrics satisfy the given SLO"""
        if slo.max_ttft and self.ttft and self.ttft > slo.max_ttft:
            return False
        if slo.max_e2e_latency and self.e2e_latency and self.e2e_latency > slo.max_e2e_latency:
            return False
        if slo.max_p99_itl and self.p99_itl and self.p99_itl > slo.max_p99_itl:
            return False
        return True


class QueryComplexity(Enum):
    """Classification levels for routing decisions"""
    SIMPLE = auto()    # Route to fast/cheap model
    MODERATE = auto()  # Route to balanced model
    COMPLEX = auto()   # Route to frontier model
    SPECIALIZED = auto()  # Route to domain-specific model


class Router(Protocol):
    """Protocol for LLM routing implementations"""
    
    def classify(self, prompt: str) -> QueryComplexity:
        """Classify query complexity for routing"""
        ...
    
    def select_model(self, prompt: str, complexity: QueryComplexity) -> str:
        """Select the appropriate model based on complexity"""
        ...


@dataclass
class ModelConfig:
    """Configuration for a model in the routing pool"""
    model_id: str
    cost_per_million_input: float
    cost_per_million_output: float
    max_complexity: QueryComplexity
    capabilities: frozenset[str] = field(default_factory=frozenset)


class CostAwareRouter:
    """
    Routes queries to models based on complexity and cost optimization.
    
    Implements the cost-aware routing pattern: simple queries go to
    cheap models, complex queries escalate to expensive models.
    Reference: UC Berkeley research, MindStudio implementation
    """
    
    def __init__(self, models: Sequence[ModelConfig]):
        # Sort by cost (cheapest first) for cascade ordering
        self.models = sorted(models, key=lambda m: m.cost_per_million_output)
        self._complexity_keywords = {
            QueryComplexity.SIMPLE: {"what is", "define", "list", "when did"},
            QueryComplexity.COMPLEX: {"analyze", "compare", "explain why", "design"},
            QueryComplexity.SPECIALIZED: {"code", "implement", "debug", "refactor"},
        }
    
    def classify(self, prompt: str) -> QueryComplexity:
        """
        Classify query complexity using keyword heuristics.
        Production systems use embedding similarity or small classifier LLM.
        """
        prompt_lower = prompt.lower()
        
        # Check for specialized first (code, etc.)
        for keyword in self._complexity_keywords[QueryComplexity.SPECIALIZED]:
            if keyword in prompt_lower:
                return QueryComplexity.SPECIALIZED
        
        # Check for complex reasoning indicators
        for keyword in self._complexity_keywords[QueryComplexity.COMPLEX]:
            if keyword in prompt_lower:
                return QueryComplexity.COMPLEX
        
        # Token count heuristic - longer prompts often need more capable models
        token_estimate = len(prompt.split())
        if token_estimate > 500:
            return QueryComplexity.MODERATE
        
        return QueryComplexity.SIMPLE
    
    def select_model(self, prompt: str, complexity: QueryComplexity | None = None) -> str:
        """Select cheapest model that can handle the complexity level"""
        if complexity is None:
            complexity = self.classify(prompt)
        
        for model in self.models:
            if model.max_complexity.value >= complexity.value:
                return model.model_id
        
        # Fallback to most capable model
        return self.models[-1].model_id
    
    def estimate_cost(self, prompt: str, expected_output_tokens: int = 500) -> float:
        """Estimate cost for a query using the selected model"""
        complexity = self.classify(prompt)
        model = next(m for m in self.models if m.model_id == self.select_model(prompt, complexity))
        
        input_tokens = len(prompt.split()) * 1.3  # Rough tokenization estimate
        input_cost = (input_tokens / 1_000_000) * model.cost_per_million_input
        output_cost = (expected_output_tokens / 1_000_000) * model.cost_per_million_output
        
        return input_cost + output_cost


class MetricsAggregator:
    """
    Aggregates metrics across multiple requests for system-level monitoring.
    Calculates goodput, system TPS, and SLO violation rates.
    """
    
    def __init__(self, window_size: timedelta = timedelta(minutes=5)):
        self._metrics: list[InferenceMetrics] = []
        self._window_start = datetime.now()
        self._window_size = window_size
        self._slo_violations = 0
        self._lock = threading.Lock()
    
    def record(self, metrics: InferenceMetrics, slo: SLO) -> None:
        """Record completed request metrics"""
        with self._lock:
            self._metrics.append(metrics)
            if not metrics.meets_slo(slo):
                self._slo_violations += 1
    
    def goodput(self) -> float:
        """Requests per second meeting SLO"""
        with self._lock:
            elapsed = (datetime.now() - self._window_start).total_seconds()
            if elapsed == 0:
                return 0.0
            successful = len(self._metrics) - self._slo_violations
            return successful / elapsed
    
    def system_tps(self) -> float:
        """Aggregate tokens per second across all requests"""
        with self._lock:
            total_tokens = sum(m.output_tokens for m in self._metrics)
            elapsed = (datetime.now() - self._window_start).total_seconds()
            if elapsed == 0:
                return 0.0
            return total_tokens / elapsed`,

    rust: `//! LLM Inference Metrics Collection and Routing
//! Reference: NVIDIA GenAI-Perf, Anyscale metrics documentation
//! Production note: Uses parking_lot for faster mutexes than std

use std::time::{Duration, Instant};
use std::sync::Arc;
use parking_lot::RwLock;
use thiserror::Error;

/// Errors that can occur during metrics collection or routing
#[derive(Error, Debug)]
pub enum MetricsError {
    #[error("Metrics not finalized: {0}")]
    NotFinalized(String),
    #[error("No tokens recorded")]
    NoTokens,
    #[error("Invalid SLO configuration: {0}")]
    InvalidSLO(String),
}

/// Service Level Objectives for inference quality
#[derive(Debug, Clone)]
pub struct SLO {
    pub max_ttft: Option<Duration>,
    pub max_e2e_latency: Option<Duration>,
    pub max_p99_itl: Option<Duration>,
}

impl Default for SLO {
    fn default() -> Self {
        Self {
            max_ttft: Some(Duration::from_millis(500)),
            max_e2e_latency: Some(Duration::from_secs(3)),
            max_p99_itl: Some(Duration::from_millis(100)),
        }
    }
}

/// Captures key performance indicators for a single LLM inference request
#[derive(Debug)]
pub struct InferenceMetrics {
    pub request_id: String,
    pub model_id: String,
    pub input_tokens: usize,
    
    start_time: Instant,
    first_token_time: Option<Instant>,
    end_time: Option<Instant>,
    last_token_time: Option<Instant>,
    
    itl_samples: Vec<Duration>,
    output_tokens: usize,
}

impl InferenceMetrics {
    pub fn new(request_id: impl Into<String>, model_id: impl Into<String>, input_tokens: usize) -> Self {
        Self {
            request_id: request_id.into(),
            model_id: model_id.into(),
            input_tokens,
            start_time: Instant::now(),
            first_token_time: None,
            end_time: None,
            last_token_time: None,
            itl_samples: Vec::with_capacity(256),
            output_tokens: 0,
        }
    }
    
    /// Record the first output token
    pub fn record_first_token(&mut self) {
        let now = Instant::now();
        self.first_token_time = Some(now);
        self.last_token_time = Some(now);
        self.output_tokens = 1;
    }
    
    /// Record subsequent output tokens
    pub fn record_token(&mut self) {
        let now = Instant::now();
        self.output_tokens += 1;
        
        if let Some(last) = self.last_token_time {
            self.itl_samples.push(now.duration_since(last));
        }
        self.last_token_time = Some(now);
    }
    
    /// Mark inference as complete
    pub fn finalize(&mut self) {
        self.end_time = Some(Instant::now());
    }
    
    /// Time to first token
    pub fn ttft(&self) -> Option<Duration> {
        self.first_token_time.map(|ft| ft.duration_since(self.start_time))
    }
    
    /// End-to-end latency
    pub fn e2e_latency(&self) -> Option<Duration> {
        self.end_time.map(|et| et.duration_since(self.start_time))
    }
    
    /// Average inter-token latency
    pub fn mean_itl(&self) -> Option<Duration> {
        if self.itl_samples.is_empty() {
            return None;
        }
        let total: Duration = self.itl_samples.iter().sum();
        Some(total / self.itl_samples.len() as u32)
    }
    
    /// 99th percentile inter-token latency
    pub fn p99_itl(&self) -> Option<Duration> {
        if self.itl_samples.is_empty() {
            return None;
        }
        let mut sorted = self.itl_samples.clone();
        sorted.sort_unstable();
        let idx = ((sorted.len() as f64) * 0.99).ceil() as usize - 1;
        Some(sorted[idx.min(sorted.len() - 1)])
    }
    
    /// Tokens per second for this request
    pub fn tps(&self) -> f64 {
        match self.e2e_latency() {
            Some(latency) if !latency.is_zero() => {
                self.output_tokens as f64 / latency.as_secs_f64()
            }
            _ => 0.0,
        }
    }
    
    /// Check if metrics satisfy the given SLO
    pub fn meets_slo(&self, slo: &SLO) -> bool {
        if let (Some(max), Some(actual)) = (slo.max_ttft, self.ttft()) {
            if actual > max { return false; }
        }
        if let (Some(max), Some(actual)) = (slo.max_e2e_latency, self.e2e_latency()) {
            if actual > max { return false; }
        }
        if let (Some(max), Some(actual)) = (slo.max_p99_itl, self.p99_itl()) {
            if actual > max { return false; }
        }
        true
    }
    
    pub fn output_tokens(&self) -> usize {
        self.output_tokens
    }
}

/// Classification levels for routing decisions
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum QueryComplexity {
    Simple,
    Moderate,
    Complex,
    Specialized,
}

/// Configuration for a model in the routing pool
#[derive(Debug, Clone)]
pub struct ModelConfig {
    pub model_id: String,
    pub cost_per_million_input: f64,
    pub cost_per_million_output: f64,
    pub max_complexity: QueryComplexity,
}

/// Routes queries to models based on complexity and cost optimization
pub struct CostAwareRouter {
    models: Vec<ModelConfig>,
}

impl CostAwareRouter {
    pub fn new(mut models: Vec<ModelConfig>) -> Self {
        // Sort by cost (cheapest first)
        models.sort_by(|a, b| {
            a.cost_per_million_output
                .partial_cmp(&b.cost_per_million_output)
                .unwrap_or(std::cmp::Ordering::Equal)
        });
        Self { models }
    }
    
    /// Classify query complexity using heuristics
    pub fn classify(&self, prompt: &str) -> QueryComplexity {
        let lower = prompt.to_lowercase();
        
        // Check for specialized indicators
        let specialized_keywords = ["code", "implement", "debug", "refactor", "function"];
        if specialized_keywords.iter().any(|k| lower.contains(k)) {
            return QueryComplexity::Specialized;
        }
        
        // Check for complex reasoning indicators
        let complex_keywords = ["analyze", "compare", "explain why", "design", "evaluate"];
        if complex_keywords.iter().any(|k| lower.contains(k)) {
            return QueryComplexity::Complex;
        }
        
        // Token count heuristic
        let word_count = prompt.split_whitespace().count();
        if word_count > 500 {
            return QueryComplexity::Moderate;
        }
        
        QueryComplexity::Simple
    }
    
    /// Select the cheapest model that can handle the complexity
    pub fn select_model(&self, prompt: &str) -> &str {
        let complexity = self.classify(prompt);
        
        self.models
            .iter()
            .find(|m| m.max_complexity >= complexity)
            .map(|m| m.model_id.as_str())
            .unwrap_or_else(|| self.models.last().map(|m| m.model_id.as_str()).unwrap_or(""))
    }
}

/// Thread-safe metrics aggregator for system-level monitoring
pub struct MetricsAggregator {
    inner: RwLock<AggregatorInner>,
}

struct AggregatorInner {
    metrics: Vec<InferenceMetrics>,
    window_start: Instant,
    slo_violations: usize,
}

impl MetricsAggregator {
    pub fn new() -> Self {
        Self {
            inner: RwLock::new(AggregatorInner {
                metrics: Vec::with_capacity(1000),
                window_start: Instant::now(),
                slo_violations: 0,
            }),
        }
    }
    
    pub fn record(&self, metrics: InferenceMetrics, slo: &SLO) {
        let mut inner = self.inner.write();
        if !metrics.meets_slo(slo) {
            inner.slo_violations += 1;
        }
        inner.metrics.push(metrics);
    }
    
    /// Requests per second meeting SLO
    pub fn goodput(&self) -> f64 {
        let inner = self.inner.read();
        let elapsed = inner.window_start.elapsed().as_secs_f64();
        if elapsed == 0.0 {
            return 0.0;
        }
        let successful = inner.metrics.len() - inner.slo_violations;
        successful as f64 / elapsed
    }
    
    /// Aggregate tokens per second
    pub fn system_tps(&self) -> f64 {
        let inner = self.inner.read();
        let total_tokens: usize = inner.metrics.iter().map(|m| m.output_tokens()).sum();
        let elapsed = inner.window_start.elapsed().as_secs_f64();
        if elapsed == 0.0 {
            return 0.0;
        }
        total_tokens as f64 / elapsed
    }
}

impl Default for MetricsAggregator {
    fn default() -> Self {
        Self::new()
    }
}`,

    java: `// LLM Inference Metrics Collection and Routing
// Reference: NVIDIA GenAI-Perf, Anyscale metrics documentation
// Production note: Uses records and sealed interfaces (Java 21+)

package ai.inference.metrics;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.stream.Collectors;

/**
 * Service Level Objectives for inference quality.
 * All fields are Optional to allow partial SLO specifications.
 */
public record SLO(
    Optional<Duration> maxTTFT,
    Optional<Duration> maxE2ELatency,
    Optional<Duration> maxP99ITL
) {
    public static SLO defaults() {
        return new SLO(
            Optional.of(Duration.ofMillis(500)),
            Optional.of(Duration.ofSeconds(3)),
            Optional.of(Duration.ofMillis(100))
        );
    }
}

/**
 * Classification levels for routing decisions.
 */
public enum QueryComplexity {
    SIMPLE,
    MODERATE,
    COMPLEX,
    SPECIALIZED
}

/**
 * Captures key performance indicators for a single LLM inference request.
 * Thread-safe for concurrent token recording during streaming.
 */
public final class InferenceMetrics {
    private final String requestId;
    private final String modelId;
    private final int inputTokens;
    
    private final Instant startTime;
    private volatile Instant firstTokenTime;
    private volatile Instant endTime;
    private volatile Instant lastTokenTime;
    
    private final List<Duration> itlSamples;
    private volatile int outputTokens;
    
    private final Object lock = new Object();
    
    public InferenceMetrics(String requestId, String modelId, int inputTokens) {
        this.requestId = Objects.requireNonNull(requestId);
        this.modelId = Objects.requireNonNull(modelId);
        this.inputTokens = inputTokens;
        this.startTime = Instant.now();
        this.itlSamples = new ArrayList<>(256);
        this.outputTokens = 0;
    }
    
    /**
     * Record the first output token.
     */
    public void recordFirstToken() {
        synchronized (lock) {
            Instant now = Instant.now();
            this.firstTokenTime = now;
            this.lastTokenTime = now;
            this.outputTokens = 1;
        }
    }
    
    /**
     * Record subsequent output tokens and calculate ITL.
     */
    public void recordToken() {
        synchronized (lock) {
            Instant now = Instant.now();
            this.outputTokens++;
            
            if (lastTokenTime != null) {
                itlSamples.add(Duration.between(lastTokenTime, now));
            }
            this.lastTokenTime = now;
        }
    }
    
    /**
     * Mark inference as complete.
     */
    public void finalize_() {
        synchronized (lock) {
            this.endTime = Instant.now();
        }
    }
    
    /**
     * Time to first token.
     */
    public Optional<Duration> ttft() {
        Instant ft = firstTokenTime;
        if (ft == null) return Optional.empty();
        return Optional.of(Duration.between(startTime, ft));
    }
    
    /**
     * End-to-end latency.
     */
    public Optional<Duration> e2eLatency() {
        Instant et = endTime;
        if (et == null) return Optional.empty();
        return Optional.of(Duration.between(startTime, et));
    }
    
    /**
     * Average inter-token latency.
     */
    public Optional<Duration> meanITL() {
        synchronized (lock) {
            if (itlSamples.isEmpty()) return Optional.empty();
            
            long totalNanos = itlSamples.stream()
                .mapToLong(Duration::toNanos)
                .sum();
            return Optional.of(Duration.ofNanos(totalNanos / itlSamples.size()));
        }
    }
    
    /**
     * 99th percentile inter-token latency.
     */
    public Optional<Duration> p99ITL() {
        synchronized (lock) {
            if (itlSamples.isEmpty()) return Optional.empty();
            
            List<Duration> sorted = itlSamples.stream()
                .sorted()
                .collect(Collectors.toList());
            
            int idx = (int) Math.ceil(sorted.size() * 0.99) - 1;
            idx = Math.max(0, Math.min(idx, sorted.size() - 1));
            return Optional.of(sorted.get(idx));
        }
    }
    
    /**
     * Tokens per second for this request.
     */
    public double tps() {
        return e2eLatency()
            .filter(d -> !d.isZero())
            .map(d -> outputTokens / (d.toNanos() / 1_000_000_000.0))
            .orElse(0.0);
    }
    
    /**
     * Check if metrics satisfy the given SLO.
     */
    public boolean meetsSLO(SLO slo) {
        if (slo.maxTTFT().isPresent() && ttft().isPresent()) {
            if (ttft().get().compareTo(slo.maxTTFT().get()) > 0) return false;
        }
        if (slo.maxE2ELatency().isPresent() && e2eLatency().isPresent()) {
            if (e2eLatency().get().compareTo(slo.maxE2ELatency().get()) > 0) return false;
        }
        if (slo.maxP99ITL().isPresent() && p99ITL().isPresent()) {
            if (p99ITL().get().compareTo(slo.maxP99ITL().get()) > 0) return false;
        }
        return true;
    }
    
    // Getters
    public String requestId() { return requestId; }
    public String modelId() { return modelId; }
    public int inputTokens() { return inputTokens; }
    public int outputTokens() { return outputTokens; }
}

/**
 * Configuration for a model in the routing pool.
 */
public record ModelConfig(
    String modelId,
    double costPerMillionInput,
    double costPerMillionOutput,
    QueryComplexity maxComplexity
) {}

/**
 * Routes queries to models based on complexity and cost optimization.
 * Implements the cost-aware routing pattern from UC Berkeley research.
 */
public final class CostAwareRouter {
    private final List<ModelConfig> models;
    
    private static final Set<String> SPECIALIZED_KEYWORDS = 
        Set.of("code", "implement", "debug", "refactor", "function");
    private static final Set<String> COMPLEX_KEYWORDS = 
        Set.of("analyze", "compare", "explain why", "design", "evaluate");
    
    public CostAwareRouter(List<ModelConfig> models) {
        // Sort by cost (cheapest first)
        this.models = models.stream()
            .sorted(Comparator.comparingDouble(ModelConfig::costPerMillionOutput))
            .toList();
    }
    
    /**
     * Classify query complexity using keyword heuristics.
     */
    public QueryComplexity classify(String prompt) {
        String lower = prompt.toLowerCase();
        
        // Check for specialized indicators
        if (SPECIALIZED_KEYWORDS.stream().anyMatch(lower::contains)) {
            return QueryComplexity.SPECIALIZED;
        }
        
        // Check for complex reasoning indicators
        if (COMPLEX_KEYWORDS.stream().anyMatch(lower::contains)) {
            return QueryComplexity.COMPLEX;
        }
        
        // Token count heuristic
        int wordCount = prompt.split("\\\\s+").length;
        if (wordCount > 500) {
            return QueryComplexity.MODERATE;
        }
        
        return QueryComplexity.SIMPLE;
    }
    
    /**
     * Select the cheapest model that can handle the complexity.
     */
    public String selectModel(String prompt) {
        QueryComplexity complexity = classify(prompt);
        
        return models.stream()
            .filter(m -> m.maxComplexity().compareTo(complexity) >= 0)
            .findFirst()
            .map(ModelConfig::modelId)
            .orElseGet(() -> models.getLast().modelId());
    }
}

/**
 * Thread-safe metrics aggregator for system-level monitoring.
 * Calculates goodput, system TPS, and SLO violation rates.
 */
public final class MetricsAggregator {
    private final List<InferenceMetrics> metrics;
    private final Instant windowStart;
    private int sloViolations;
    
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    
    public MetricsAggregator() {
        this.metrics = new ArrayList<>(1000);
        this.windowStart = Instant.now();
        this.sloViolations = 0;
    }
    
    /**
     * Record completed request metrics.
     */
    public void record(InferenceMetrics m, SLO slo) {
        lock.writeLock().lock();
        try {
            metrics.add(m);
            if (!m.meetsSLO(slo)) {
                sloViolations++;
            }
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    /**
     * Requests per second meeting SLO.
     */
    public double goodput() {
        lock.readLock().lock();
        try {
            double elapsed = Duration.between(windowStart, Instant.now()).toNanos() / 1_000_000_000.0;
            if (elapsed == 0) return 0.0;
            int successful = metrics.size() - sloViolations;
            return successful / elapsed;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    /**
     * Aggregate tokens per second across all requests.
     */
    public double systemTPS() {
        lock.readLock().lock();
        try {
            int totalTokens = metrics.stream()
                .mapToInt(InferenceMetrics::outputTokens)
                .sum();
            double elapsed = Duration.between(windowStart, Instant.now()).toNanos() / 1_000_000_000.0;
            if (elapsed == 0) return 0.0;
            return totalTokens / elapsed;
        } finally {
            lock.readLock().unlock();
        }
    }
}`
  };

  const renderImplementations = () => (
    <div className="space-y-6">
      <div className="flex space-x-2 mb-6">
        {implSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setImplSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              implSection === section.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/40 text-slate-400 hover:text-slate-300 border border-slate-700/40'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {implSection === 'core' && (
        <div className="space-y-4">
          <div className="flex space-x-2 mb-4">
            {coreLanguages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setCoreLanguage(lang.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  coreLanguage === lang.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-800/40 text-slate-500 hover:text-slate-400 border border-slate-700/40'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-slate-400 mb-4 bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
            <p className="font-medium text-slate-300 mb-1">Pattern: LLM Metrics Collection + Cost-Aware Routing</p>
            <p>Pure language implementation with no cloud dependencies. Includes InferenceMetrics for request-level tracking, MetricsAggregator for system-level monitoring, and CostAwareRouter for intelligent model selection.</p>
          </div>
          
          <CodeBlock 
            code={coreImplementations[coreLanguage]} 
            filename={
              coreLanguage === 'go' ? 'metrics/metrics.go' :
              coreLanguage === 'python' ? 'metrics/metrics.py' :
              coreLanguage === 'rust' ? 'src/metrics.rs' :
              'src/main/java/ai/inference/metrics/Metrics.java'
            }
          />
        </div>
      )}
    </div>
  );

  const renderLeadership = () => (
    <div className="space-y-6">
      {/* Explain to Team */}
      <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40">
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">Explain to Your Team (3-Sentence Summary)</h4>
        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-300 font-medium mb-2">LLM Inference Metrics:</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              "LLM inference has two phases—prefill processes your prompt in parallel (determines TTFT), decode generates tokens one-by-one (determines ITL). The KV cache stores computed attention states to avoid O(n²) recomputation on every token. We track TTFT for responsiveness, ITL for streaming smoothness, and goodput for requests actually meeting our SLOs."
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-300 font-medium mb-2">LLM Routing:</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              "Routing classifies query complexity and sends simple questions to cheap models (GPT-4o-mini at $0.15/M) while reserving expensive frontier models (Opus at $15/M) for complex reasoning—that's a 100x cost difference. Semantic caching returns cached responses for semantically similar queries, hitting 30-50% cache rates in production. Combined, these techniques typically deliver 60-85% cost reduction while maintaining quality SLOs."
            </p>
          </div>
        </div>
      </div>

      {/* Justify the Decision */}
      <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40">
        <h4 className="text-lg font-semibold text-blue-400 mb-3">Justify the Decision (Architecture Review)</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <span className="text-blue-400 font-mono">Q:</span>
            <span className="text-slate-300">"Why not just use the best model for everything?"</span>
          </div>
          <div className="flex items-start space-x-3 pl-6">
            <span className="text-emerald-400 font-mono">A:</span>
            <span className="text-slate-400">"At 10K daily requests, the difference between routing 60% to GPT-4o-mini vs sending everything to GPT-4 is $50K/year vs $500K/year. UC Berkeley research shows 85% cost reduction with 95% quality retention. The routing overhead is &lt;10ms—invisible to users."</span>
          </div>
          <div className="flex items-start space-x-3 mt-4">
            <span className="text-blue-400 font-mono">Q:</span>
            <span className="text-slate-300">"Why disaggregate prefill and decode?"</span>
          </div>
          <div className="flex items-start space-x-3 pl-6">
            <span className="text-emerald-400 font-mono">A:</span>
            <span className="text-slate-400">"Prefill is compute-bound, decode is memory-bound. Running both on the same GPU creates interference—prefill jobs block decode, causing ITL spikes. Meta and Moonshot both moved to disaggregated architectures for this reason. It lets us independently tune TTFT SLOs without affecting ITL."</span>
          </div>
        </div>
      </div>

      {/* Failure Modes */}
      <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40">
        <h4 className="text-lg font-semibold text-amber-400 mb-3">Failure Modes & Observability</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-amber-400 font-medium text-sm mb-2">What Breaks</p>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• KV cache OOM under long contexts</li>
              <li>• TTFT spikes during queue buildup</li>
              <li>• Router misclassification → wrong model</li>
              <li>• Semantic cache returning stale answers</li>
              <li>• ITL jitter from mixed prefill/decode</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-emerald-400 font-medium text-sm mb-2">Alerts to Set</p>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• P99 TTFT &gt; 500ms for 5 minutes</li>
              <li>• Goodput drops below 95% of baseline</li>
              <li>• KV cache memory &gt; 80% of HBM</li>
              <li>• Router fallback rate &gt; 10%</li>
              <li>• ITL variance coefficient &gt; 0.5</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scale Implications */}
      <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40">
        <h4 className="text-lg font-semibold text-purple-400 mb-3">Scale Implications</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 text-slate-400 font-medium">Scale</th>
                <th className="text-left py-2 text-slate-400 font-medium">What Changes</th>
                <th className="text-left py-2 text-slate-400 font-medium">Decision Point</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/50">
                <td className="py-2 text-emerald-400">10x requests</td>
                <td className="py-2">Queue delays dominate TTFT; need horizontal scaling</td>
                <td className="py-2">Add replicas, implement request prioritization</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 text-blue-400">100x requests</td>
                <td className="py-2">KV cache sharing becomes critical; single-instance limits hit</td>
                <td className="py-2">Implement distributed KV cache (LMCache, NIXL)</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 text-amber-400">100K+ context</td>
                <td className="py-2">KV cache exceeds single GPU memory (40-80GB)</td>
                <td className="py-2">Tiered caching: HBM → DRAM → NVMe → remote</td>
              </tr>
              <tr>
                <td className="py-2 text-purple-400">Multi-region</td>
                <td className="py-2">Routing latency + data locality become factors</td>
                <td className="py-2">Edge routing, regional model pools</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Review Checklist */}
      <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40">
        <h4 className="text-lg font-semibold text-red-400 mb-3">Code Review Checklist</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-300 font-medium mb-2">Metrics Implementation</p>
            <ul className="text-slate-400 space-y-1">
              <li>☐ TTFT recorded before first token emitted</li>
              <li>☐ ITL excludes first token (prefill time)</li>
              <li>☐ Thread-safe token recording for streaming</li>
              <li>☐ Percentile calculations handle empty arrays</li>
              <li>☐ SLO checks are fail-closed (missing data = violation)</li>
            </ul>
          </div>
          <div>
            <p className="text-slate-300 font-medium mb-2">Routing Implementation</p>
            <ul className="text-slate-400 space-y-1">
              <li>☐ Routing decision latency &lt; 10ms (semantic) or &lt; 100ms (LLM)</li>
              <li>☐ Fallback model defined for all classification failures</li>
              <li>☐ Cache TTL appropriate for query category</li>
              <li>☐ Escalation budget limits prevent cost explosions</li>
              <li>☐ Model configs externalized (not hardcoded)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Questions for Design Review */}
      <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40">
        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Questions for Design Review</h4>
        <p className="text-slate-400 text-sm mb-3">When someone proposes implementing LLM metrics or routing, ask:</p>
        <div className="space-y-2 text-sm">
          <div className="bg-slate-900/50 rounded-lg p-3 border-l-2 border-cyan-500">
            <p className="text-slate-300">"What are your TTFT and E2E latency SLOs? Have you validated them against user experience research?"</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border-l-2 border-cyan-500">
            <p className="text-slate-300">"How will you measure goodput vs raw throughput? What's your SLO violation budget?"</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border-l-2 border-cyan-500">
            <p className="text-slate-300">"What happens when the router misclassifies? Is there a human-in-the-loop escalation path?"</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border-l-2 border-cyan-500">
            <p className="text-slate-300">"How are you handling KV cache eviction at scale? What's your memory ceiling?"</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border-l-2 border-cyan-500">
            <p className="text-slate-300">"Have you modeled the cost savings vs routing overhead? At what request volume does this break even?"</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-100 mb-2">
            LLM Inference Metrics & Routing
          </h1>
          <p className="text-slate-400">
            Performance measurement and intelligent model selection for production LLM systems
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs border border-emerald-500/20">
              NVIDIA GenAI-Perf
            </span>
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs border border-blue-500/20">
              vLLM Semantic Router
            </span>
            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs border border-amber-500/20">
              BentoML
            </span>
            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs border border-purple-500/20">
              Anyscale
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 border-b border-slate-700/50 pb-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-800/60 text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/30">
          {activeTab === 'architecture' && renderArchitecture()}
          {activeTab === 'concepts' && renderConcepts()}
          {activeTab === 'implementations' && renderImplementations()}
          {activeTab === 'leadership' && renderLeadership()}
        </div>
      </div>
    </div>
  );
};

export default LLMMetricsRouting;
