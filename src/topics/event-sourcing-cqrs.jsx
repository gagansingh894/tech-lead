"use client"

import React, { useState } from 'react';

const EventSourcingCQRS = () => {
  const [activeTab, setActiveTab] = useState('architecture');
  const [activeImplTab, setActiveImplTab] = useState('core');
  const [activeCoreLang, setActiveCoreLang] = useState('go');
  const [activeAwsSubTab, setActiveAwsSubTab] = useState('iac');
  const [activeAwsIac, setActiveAwsIac] = useState('cdk-ts');
  const [activeAwsSdk, setActiveAwsSdk] = useState('go');
  const [activeAzureIac, setActiveAzureIac] = useState('bicep');
  const [activeGcpIac, setActiveGcpIac] = useState('pulumi');

  const tabs = [
    { id: 'architecture', label: 'Architecture' },
    { id: 'concepts', label: 'Core Concepts' },
    { id: 'implementations', label: 'Implementations' },
    { id: 'leadership', label: 'Leadership Angles' }
  ];

  const CodeBlock = ({ code, filename }) => (
    <div className="rounded-lg overflow-hidden border border-gray-700/50">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80 border-b border-gray-700/50">
        <span className="text-xs text-gray-400 font-mono">{filename}</span>
        <button
          onClick={() => navigator.clipboard?.writeText(code)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Copy
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm bg-[#161b22]">
        <code className="text-gray-300 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );

  const ArchitectureTab = () => (
    <div className="space-y-8">
      <div className="bg-[#1a1d24] rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">Event Sourcing + CQRS Architecture</h3>
        <svg viewBox="0 0 900 520" className="w-full" style={{ maxHeight: '520px' }}>
          <defs>
            <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
            <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
            </marker>
            <marker id="arrowOrange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
            </marker>
            <marker id="arrowPurple" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
            </marker>
          </defs>
          
          <rect x="20" y="120" width="280" height="280" rx="8" fill="#1e293b" opacity="0.3" />
          <text x="30" y="145" fill="#64748b" fontSize="11" fontWeight="500">WRITE SIDE (Command)</text>
          
          <rect x="600" y="120" width="280" height="280" rx="8" fill="#1e293b" opacity="0.3" />
          <text x="610" y="145" fill="#64748b" fontSize="11" fontWeight="500">READ SIDE (Query)</text>
          
          <rect x="380" y="20" width="140" height="50" rx="6" fill="#374151" stroke="#4b5563" strokeWidth="1.5" />
          <text x="450" y="50" textAnchor="middle" fill="#e5e7eb" fontSize="13" fontWeight="500">Client / UI</text>
          
          <path d="M 400 70 L 160 150" stroke="#3b82f6" strokeWidth="2" fill="none" markerEnd="url(#arrowBlue)" />
          <text x="250" y="100" fill="#3b82f6" fontSize="10" fontWeight="500">Commands</text>
          
          <path d="M 500 70 L 740 150" stroke="#10b981" strokeWidth="2" fill="none" markerEnd="url(#arrowGreen)" />
          <text x="630" y="100" fill="#10b981" fontSize="10" fontWeight="500">Queries</text>
          
          <rect x="40" y="160" width="240" height="55" rx="6" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="160" y="185" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="500">Command Handler</text>
          <text x="160" y="202" textAnchor="middle" fill="#64748b" fontSize="10">Validates &amp; processes commands</text>
          
          <rect x="40" y="230" width="240" height="55" rx="6" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="160" y="255" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="500">Aggregate Root</text>
          <text x="160" y="272" textAnchor="middle" fill="#64748b" fontSize="10">Domain logic, emits events</text>
          
          <rect x="320" y="320" width="260" height="70" rx="6" fill="#3b1d59" stroke="#8b5cf6" strokeWidth="2" />
          <text x="450" y="350" textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="600">Event Store</text>
          <text x="450" y="370" textAnchor="middle" fill="#a78bfa" fontSize="10">Append-only, immutable log</text>
          
          <path d="M 160 285 L 160 340 L 320 340" stroke="#8b5cf6" strokeWidth="2" fill="none" markerEnd="url(#arrowPurple)" />
          <text x="180" y="330" fill="#8b5cf6" fontSize="9" fontWeight="500">Append Events</text>
          
          <rect x="360" y="430" width="180" height="50" rx="6" fill="#422006" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="450" y="455" textAnchor="middle" fill="#fcd34d" fontSize="12" fontWeight="500">Event Publisher</text>
          <text x="450" y="470" textAnchor="middle" fill="#fbbf24" fontSize="9">Async projection trigger</text>
          
          <path d="M 450 390 L 450 430" stroke="#f59e0b" strokeWidth="2" fill="none" markerEnd="url(#arrowOrange)" />
          <text x="460" y="415" fill="#f59e0b" fontSize="9" fontWeight="500">Stream</text>
          
          <rect x="620" y="160" width="240" height="55" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
          <text x="740" y="185" textAnchor="middle" fill="#6ee7b7" fontSize="12" fontWeight="500">Query Handler</text>
          <text x="740" y="202" textAnchor="middle" fill="#64748b" fontSize="10">Reads from projections</text>
          
          <rect x="620" y="230" width="240" height="55" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
          <text x="740" y="255" textAnchor="middle" fill="#6ee7b7" fontSize="12" fontWeight="500">Read Models / Projections</text>
          <text x="740" y="272" textAnchor="middle" fill="#64748b" fontSize="10">Optimized for queries</text>
          
          <rect x="620" y="320" width="240" height="55" rx="6" fill="#422006" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="740" y="345" textAnchor="middle" fill="#fcd34d" fontSize="12" fontWeight="500">Projector / Denormalizer</text>
          <text x="740" y="362" textAnchor="middle" fill="#fbbf24" fontSize="9">Updates read models from events</text>
          
          <path d="M 540 455 L 620 455 L 620 375" stroke="#f59e0b" strokeWidth="2" fill="none" markerEnd="url(#arrowOrange)" />
          <text x="560" y="445" fill="#f59e0b" fontSize="9" fontWeight="500">Events</text>
          
          <path d="M 740 320 L 740 285" stroke="#10b981" strokeWidth="2" fill="none" markerEnd="url(#arrowGreen)" />
          <text x="750" y="305" fill="#10b981" fontSize="9" fontWeight="500">Update</text>
          
          <path d="M 580 340 L 620 340" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4,3" fill="none" markerEnd="url(#arrowPurple)" />
          <text x="585" y="332" fill="#8b5cf6" fontSize="8">Replay</text>
          
          <rect x="20" y="430" width="280" height="80" rx="6" fill="#1a1d24" stroke="#2d3139" strokeWidth="1" />
          <text x="35" y="450" fill="#9ca3af" fontSize="10" fontWeight="600">LEGEND</text>
          <rect x="35" y="460" width="12" height="12" rx="2" fill="#3b82f6" />
          <text x="55" y="470" fill="#9ca3af" fontSize="9">Commands / Write Path</text>
          <rect x="150" y="460" width="12" height="12" rx="2" fill="#10b981" />
          <text x="170" y="470" fill="#9ca3af" fontSize="9">Queries / Read Path</text>
          <rect x="35" y="480" width="12" height="12" rx="2" fill="#8b5cf6" />
          <text x="55" y="490" fill="#9ca3af" fontSize="9">Event Storage</text>
          <rect x="150" y="480" width="12" height="12" rx="2" fill="#f59e0b" />
          <text x="170" y="490" fill="#9ca3af" fontSize="9">Async Event Flow</text>
        </svg>
      </div>
      
      <div className="bg-[#1a1d24] rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Cloud Provider Mapping</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Component</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#ff9900' }}>AWS</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#0078d4' }}>Azure</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#4285f4' }}>GCP</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-400">Event Store</td>
                <td className="py-3 px-4">DynamoDB + Streams</td>
                <td className="py-3 px-4">Cosmos DB + Change Feed</td>
                <td className="py-3 px-4">Firestore + Pub/Sub</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-400">Event Bus</td>
                <td className="py-3 px-4">EventBridge / Kinesis</td>
                <td className="py-3 px-4">Event Grid / Event Hubs</td>
                <td className="py-3 px-4">Pub/Sub / Eventarc</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-400">Projector Runtime</td>
                <td className="py-3 px-4">Lambda (DDB Streams)</td>
                <td className="py-3 px-4">Functions (Change Feed)</td>
                <td className="py-3 px-4">Cloud Functions</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-400">Read Model Store</td>
                <td className="py-3 px-4">DynamoDB / ElastiCache</td>
                <td className="py-3 px-4">Cosmos DB / Redis</td>
                <td className="py-3 px-4">Firestore / Memorystore</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-400">Dedicated Store</td>
                <td className="py-3 px-4 text-gray-500" colSpan="3">EventStoreDB (self-hosted) — purpose-built with native projections</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ConceptsTab = () => (
    <div className="space-y-6">
      {[
        {
          term: "Event Sourcing",
          definition: "A persistence pattern where all changes to application state are stored as an immutable, append-only sequence of domain events.",
          source: "Martin Fowler (2005), Greg Young",
          whyMatters: "Provides complete audit trail, enables temporal queries, supports debugging by replaying history.",
          commonMistake: "Storing CRUD operations instead of domain events. Events should capture business intent ('OrderPlaced') not data changes."
        },
        {
          term: "CQRS",
          definition: "An architectural pattern using separate models for reading and writing data — commands mutate state, queries return data without side effects.",
          source: "Greg Young (from Bertrand Meyer's CQS)",
          whyMatters: "Allows independent optimization and scaling of read/write workloads. Enables different storage technologies per side.",
          commonMistake: "Conflating CQRS with Event Sourcing. CQRS is about model separation; Event Sourcing is about persistence strategy."
        },
        {
          term: "Projection / Read Model",
          definition: "A denormalized view of data optimized for specific query patterns, built by processing events from the event store.",
          source: "Domain-Driven Design community",
          whyMatters: "Enables query-optimized data shapes without compromising write-side integrity.",
          commonMistake: "Building projections that mirror aggregate structure. Shape by query needs, not domain model."
        },
        {
          term: "Aggregate (DDD)",
          definition: "A cluster of domain objects treated as a single unit for data changes, with one entity as the aggregate root enforcing invariants.",
          source: "Eric Evans, Domain-Driven Design (2003)",
          whyMatters: "Provides transaction boundary for event sourcing. Each aggregate maintains its own event stream.",
          commonMistake: "Making aggregates too large. Cross-aggregate transactions require sagas — keep boundaries tight."
        },
        {
          term: "Eventual Consistency",
          definition: "A consistency model where the system guarantees all replicas will eventually converge to the same state given no new updates.",
          source: "Werner Vogels (Amazon CTO)",
          whyMatters: "The read side in CQRS is typically eventually consistent. Understanding this shapes UX decisions.",
          commonMistake: "Treating eventual consistency as a bug to fix rather than a characteristic to design for."
        },
        {
          term: "Snapshot",
          definition: "A periodic materialized state of an aggregate, stored alongside events to avoid replaying entire history during rehydration.",
          source: "Event Sourcing implementation pattern",
          whyMatters: "Critical for performance as event streams grow. Trades storage for read performance.",
          commonMistake: "Snapshotting too frequently (overhead) or too rarely (slow loads). Heuristic: every 100-500 events."
        }
      ].map((concept, i) => (
        <div key={i} className="bg-[#1a1d24] rounded-xl p-6 border border-gray-700/30">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-100">{concept.term}</h3>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{concept.source}</span>
          </div>
          <p className="text-gray-300 mb-4">{concept.definition}</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-sm font-medium whitespace-nowrap">Why it matters:</span>
              <span className="text-gray-400 text-sm">{concept.whyMatters}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-sm font-medium whitespace-nowrap">Common mistake:</span>
              <span className="text-gray-400 text-sm">{concept.commonMistake}</span>
            </div>
          </div>
        </div>
      ))}
      
      <div className="bg-[#1a1d24] rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Trade-offs: When to Use / Avoid</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-green-400 font-medium mb-3">When to Use</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>✓ Audit requirements (finance, healthcare, compliance)</li>
              <li>✓ Complex domain with rich business rules</li>
              <li>✓ Need for temporal queries ("state at time T")</li>
              <li>✓ High read/write ratio disparity (&gt;10:1)</li>
              <li>✓ Multiple bounded contexts needing same events</li>
            </ul>
          </div>
          <div>
            <h4 className="text-red-400 font-medium mb-3">When to Avoid</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>✗ Simple CRUD with no complex domain logic</li>
              <li>✗ Team unfamiliar with DDD/event thinking</li>
              <li>✗ Strong consistency requirements across aggregates</li>
              <li>✗ Frequent ad-hoc queries against current state</li>
              <li>✗ GDPR "right to erasure" without crypto-shredding plan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const coreCode = {
    go: `// Pattern: Event Sourcing + CQRS
// Reference: Greg Young, Martin Fowler
// Production note: Add optimistic concurrency via version checks

package eventsourcing

import (
    "context"
    "errors"
    "sync"
    "time"
)

// Domain Events - past tense, immutable facts
type Event interface {
    EventType() string
    AggregateID() string
}

type AccountOpened struct {
    ID             string    \`json:"id"\`
    AggregateID    string    \`json:"aggregate_id"\`
    Version        int       \`json:"version"\`
    Timestamp      time.Time \`json:"timestamp"\`
    OwnerName      string    \`json:"owner_name"\`
    InitialBalance int64     \`json:"initial_balance"\`
}

func (e AccountOpened) EventType() string   { return "AccountOpened" }
func (e AccountOpened) AggregateID() string { return e.AggregateID }

type MoneyDeposited struct {
    ID          string    \`json:"id"\`
    AggregateID string    \`json:"aggregate_id"\`
    Version     int       \`json:"version"\`
    Timestamp   time.Time \`json:"timestamp"\`
    Amount      int64     \`json:"amount"\`
}

func (e MoneyDeposited) EventType() string   { return "MoneyDeposited" }
func (e MoneyDeposited) AggregateID() string { return e.AggregateID }

// Commands
type OpenAccount struct {
    AccountID      string
    OwnerName      string
    InitialBalance int64
}

type DepositMoney struct {
    AccountID string
    Amount    int64
}

// Aggregate - enforces invariants, emits events
type BankAccount struct {
    id          string
    balance     int64
    version     int
    uncommitted []Event
}

func (a *BankAccount) Open(cmd OpenAccount) error {
    if cmd.InitialBalance < 0 {
        return errors.New("initial balance cannot be negative")
    }
    a.emit(AccountOpened{
        AggregateID:    cmd.AccountID,
        Version:        a.version + 1,
        Timestamp:      time.Now().UTC(),
        OwnerName:      cmd.OwnerName,
        InitialBalance: cmd.InitialBalance,
    })
    return nil
}

func (a *BankAccount) Deposit(cmd DepositMoney) error {
    if cmd.Amount <= 0 {
        return errors.New("deposit amount must be positive")
    }
    a.emit(MoneyDeposited{
        AggregateID: cmd.AccountID,
        Version:     a.version + 1,
        Timestamp:   time.Now().UTC(),
        Amount:      cmd.Amount,
    })
    return nil
}

func (a *BankAccount) Apply(event Event) {
    switch e := event.(type) {
    case AccountOpened:
        a.id = e.AggregateID
        a.balance = e.InitialBalance
    case MoneyDeposited:
        a.balance += e.Amount
    }
    a.version++
}

func (a *BankAccount) emit(event Event) {
    a.Apply(event)
    a.uncommitted = append(a.uncommitted, event)
}

// Event Store - append-only
type EventStore interface {
    Append(ctx context.Context, streamID string, expectedVersion int, events []Event) error
    Load(ctx context.Context, streamID string) ([]Event, error)
}

type InMemoryEventStore struct {
    mu      sync.RWMutex
    streams map[string][]Event
}

func NewInMemoryEventStore() *InMemoryEventStore {
    return &InMemoryEventStore{streams: make(map[string][]Event)}
}

func (s *InMemoryEventStore) Append(ctx context.Context, streamID string, expectedVersion int, events []Event) error {
    s.mu.Lock()
    defer s.mu.Unlock()

    stream := s.streams[streamID]
    if len(stream) != expectedVersion {
        return errors.New("optimistic concurrency conflict")
    }
    s.streams[streamID] = append(stream, events...)
    return nil
}

func (s *InMemoryEventStore) Load(ctx context.Context, streamID string) ([]Event, error) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    return s.streams[streamID], nil
}

// Read Model (CQRS query side)
type AccountSummary struct {
    ID      string \`json:"id"\`
    Balance int64  \`json:"balance"\`
    Version int    \`json:"version"\`
}

type AccountReadModel struct {
    mu       sync.RWMutex
    accounts map[string]AccountSummary
}

func (rm *AccountReadModel) HandleEvent(event Event) {
    rm.mu.Lock()
    defer rm.mu.Unlock()

    switch e := event.(type) {
    case AccountOpened:
        rm.accounts[e.AggregateID] = AccountSummary{
            ID: e.AggregateID, Balance: e.InitialBalance, Version: e.Version,
        }
    case MoneyDeposited:
        if acc, ok := rm.accounts[e.AggregateID]; ok {
            acc.Balance += e.Amount
            acc.Version = e.Version
            rm.accounts[e.AggregateID] = acc
        }
    }
}`,
    python: `"""
Pattern: Event Sourcing + CQRS
Reference: Greg Young, Martin Fowler
"""
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Protocol
from uuid import uuid4
import threading

@dataclass(frozen=True)
class AccountOpened:
    aggregate_id: str
    version: int
    occurred_at: datetime
    owner_name: str
    initial_balance: int

@dataclass(frozen=True)
class MoneyDeposited:
    aggregate_id: str
    version: int
    occurred_at: datetime
    amount: int

@dataclass(frozen=True)
class OpenAccount:
    account_id: str
    owner_name: str
    initial_balance: int = 0

@dataclass(frozen=True)
class DepositMoney:
    account_id: str
    amount: int

class BankAccount:
    def __init__(self) -> None:
        self._id: str = ""
        self._balance: int = 0
        self._version: int = 0
        self._uncommitted: list = []

    def open(self, cmd: OpenAccount) -> None:
        if cmd.initial_balance < 0:
            raise ValueError("Initial balance cannot be negative")
        self._emit(AccountOpened(
            aggregate_id=cmd.account_id,
            version=self._version + 1,
            occurred_at=datetime.now(timezone.utc),
            owner_name=cmd.owner_name,
            initial_balance=cmd.initial_balance,
        ))

    def deposit(self, cmd: DepositMoney) -> None:
        if cmd.amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self._emit(MoneyDeposited(
            aggregate_id=cmd.account_id,
            version=self._version + 1,
            occurred_at=datetime.now(timezone.utc),
            amount=cmd.amount,
        ))

    def apply(self, event) -> None:
        match event:
            case AccountOpened():
                self._id = event.aggregate_id
                self._balance = event.initial_balance
            case MoneyDeposited():
                self._balance += event.amount
        self._version = event.version

    def _emit(self, event) -> None:
        self.apply(event)
        self._uncommitted.append(event)

class InMemoryEventStore:
    def __init__(self) -> None:
        self._streams: dict[str, list] = {}
        self._lock = threading.RLock()

    def append(self, stream_id: str, expected_version: int, events: list) -> None:
        with self._lock:
            stream = self._streams.get(stream_id, [])
            if len(stream) != expected_version:
                raise Exception("Concurrency conflict")
            self._streams[stream_id] = stream + events

    def load(self, stream_id: str) -> list:
        with self._lock:
            return self._streams.get(stream_id, []).copy()

@dataclass
class AccountSummary:
    id: str
    balance: int
    version: int

class AccountReadModel:
    def __init__(self) -> None:
        self._accounts: dict[str, AccountSummary] = {}

    def handle_event(self, event) -> None:
        match event:
            case AccountOpened():
                self._accounts[event.aggregate_id] = AccountSummary(
                    id=event.aggregate_id,
                    balance=event.initial_balance,
                    version=event.version
                )
            case MoneyDeposited():
                if event.aggregate_id in self._accounts:
                    acc = self._accounts[event.aggregate_id]
                    self._accounts[event.aggregate_id] = AccountSummary(
                        id=acc.id,
                        balance=acc.balance + event.amount,
                        version=event.version
                    )`,
    rust: `//! Pattern: Event Sourcing + CQRS
//! Reference: Greg Young, Martin Fowler

use chrono::{DateTime, Utc};
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use thiserror::Error;

#[derive(Debug, Clone)]
pub enum BankAccountEvent {
    AccountOpened {
        aggregate_id: String,
        version: u64,
        occurred_at: DateTime<Utc>,
        owner_name: String,
        initial_balance: i64,
    },
    MoneyDeposited {
        aggregate_id: String,
        version: u64,
        occurred_at: DateTime<Utc>,
        amount: i64,
    },
}

pub struct OpenAccount {
    pub account_id: String,
    pub owner_name: String,
    pub initial_balance: i64,
}

pub struct DepositMoney {
    pub account_id: String,
    pub amount: i64,
}

#[derive(Debug, Error)]
pub enum DomainError {
    #[error("Initial balance cannot be negative")]
    NegativeInitialBalance,
    #[error("Amount must be positive")]
    NonPositiveAmount,
}

#[derive(Default)]
pub struct BankAccount {
    id: String,
    balance: i64,
    version: u64,
    uncommitted: Vec<BankAccountEvent>,
}

impl BankAccount {
    pub fn open(&mut self, cmd: OpenAccount) -> Result<(), DomainError> {
        if cmd.initial_balance < 0 {
            return Err(DomainError::NegativeInitialBalance);
        }
        self.emit(BankAccountEvent::AccountOpened {
            aggregate_id: cmd.account_id,
            version: self.version + 1,
            occurred_at: Utc::now(),
            owner_name: cmd.owner_name,
            initial_balance: cmd.initial_balance,
        });
        Ok(())
    }

    pub fn deposit(&mut self, cmd: DepositMoney) -> Result<(), DomainError> {
        if cmd.amount <= 0 {
            return Err(DomainError::NonPositiveAmount);
        }
        self.emit(BankAccountEvent::MoneyDeposited {
            aggregate_id: cmd.account_id,
            version: self.version + 1,
            occurred_at: Utc::now(),
            amount: cmd.amount,
        });
        Ok(())
    }

    pub fn apply(&mut self, event: &BankAccountEvent) {
        match event {
            BankAccountEvent::AccountOpened { aggregate_id, initial_balance, version, .. } => {
                self.id = aggregate_id.clone();
                self.balance = *initial_balance;
                self.version = *version;
            }
            BankAccountEvent::MoneyDeposited { amount, version, .. } => {
                self.balance += amount;
                self.version = *version;
            }
        }
    }

    fn emit(&mut self, event: BankAccountEvent) {
        self.apply(&event);
        self.uncommitted.push(event);
    }
}

pub struct InMemoryEventStore {
    streams: RwLock<HashMap<String, Vec<BankAccountEvent>>>,
}

impl InMemoryEventStore {
    pub fn new() -> Self {
        Self { streams: RwLock::new(HashMap::new()) }
    }

    pub fn append(&self, stream_id: &str, expected: u64, events: Vec<BankAccountEvent>) -> Result<(), &'static str> {
        let mut streams = self.streams.write().unwrap();
        let stream = streams.entry(stream_id.to_string()).or_default();
        if stream.len() as u64 != expected {
            return Err("Concurrency conflict");
        }
        stream.extend(events);
        Ok(())
    }

    pub fn load(&self, stream_id: &str) -> Vec<BankAccountEvent> {
        self.streams.read().unwrap().get(stream_id).cloned().unwrap_or_default()
    }
}`,
    java: `// Pattern: Event Sourcing + CQRS
// Reference: Greg Young, Martin Fowler

package com.example.eventsourcing;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public sealed interface BankAccountEvent permits AccountOpened, MoneyDeposited {
    String aggregateId();
    int version();
}

public record AccountOpened(
    String aggregateId, int version, Instant occurredAt,
    String ownerName, long initialBalance
) implements BankAccountEvent {}

public record MoneyDeposited(
    String aggregateId, int version, Instant occurredAt, long amount
) implements BankAccountEvent {}

public record OpenAccount(String accountId, String ownerName, long initialBalance) {}
public record DepositMoney(String accountId, long amount) {}

public class BankAccount {
    private String id = "";
    private long balance = 0;
    private int version = 0;
    private final List<BankAccountEvent> uncommitted = new ArrayList<>();

    public void open(OpenAccount cmd) {
        if (cmd.initialBalance() < 0) {
            throw new IllegalArgumentException("Initial balance cannot be negative");
        }
        emit(new AccountOpened(
            cmd.accountId(), version + 1, Instant.now(),
            cmd.ownerName(), cmd.initialBalance()
        ));
    }

    public void deposit(DepositMoney cmd) {
        if (cmd.amount() <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        emit(new MoneyDeposited(cmd.accountId(), version + 1, Instant.now(), cmd.amount()));
    }

    public void apply(BankAccountEvent event) {
        switch (event) {
            case AccountOpened e -> {
                this.id = e.aggregateId();
                this.balance = e.initialBalance();
            }
            case MoneyDeposited e -> this.balance += e.amount();
        }
        this.version = event.version();
    }

    private void emit(BankAccountEvent event) {
        apply(event);
        uncommitted.add(event);
    }
}

public class InMemoryEventStore {
    private final Map<String, List<BankAccountEvent>> streams = new ConcurrentHashMap<>();

    public void append(String streamId, int expectedVersion, List<BankAccountEvent> events) {
        var stream = streams.computeIfAbsent(streamId, k -> new ArrayList<>());
        synchronized (stream) {
            if (stream.size() != expectedVersion) {
                throw new RuntimeException("Concurrency conflict");
            }
            stream.addAll(events);
        }
    }

    public List<BankAccountEvent> load(String streamId) {
        return List.copyOf(streams.getOrDefault(streamId, List.of()));
    }
}

public record AccountSummary(String id, long balance, int version) {}

public class AccountReadModel {
    private final Map<String, AccountSummary> accounts = new ConcurrentHashMap<>();

    public void handleEvent(BankAccountEvent event) {
        switch (event) {
            case AccountOpened e -> accounts.put(e.aggregateId(),
                new AccountSummary(e.aggregateId(), e.initialBalance(), e.version()));
            case MoneyDeposited e -> accounts.computeIfPresent(e.aggregateId(), (id, acc) ->
                new AccountSummary(acc.id(), acc.balance() + e.amount(), e.version()));
        }
    }
}`
  };

  const awsCdkCode = `// AWS CDK (TypeScript) - Event Store + Projections
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';

export class EventSourcingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Event Store - append-only with streams
    const eventStore = new dynamodb.Table(this, 'EventStore', {
      tableName: 'event-store',
      partitionKey: { name: 'streamId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'version', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_IMAGE,
      pointInTimeRecovery: true,
    });

    // Read Model Store
    const readModelStore = new dynamodb.Table(this, 'ReadModelStore', {
      tableName: 'account-read-model',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Projector Lambda - processes events, updates read model
    const projector = new lambda.Function(this, 'Projector', {
      functionName: 'event-projector',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'projector.handler',
      code: lambda.Code.fromAsset('lambda/projector'),
      environment: { READ_MODEL_TABLE: readModelStore.tableName },
    });

    readModelStore.grantWriteData(projector);

    // DynamoDB Streams trigger
    projector.addEventSource(new lambdaEventSources.DynamoEventSource(eventStore, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      batchSize: 100,
      retryAttempts: 3,
    }));
  }
}`;

  const azureBicepCode = `// Azure Bicep - Event Sourcing Infrastructure
param location string = resourceGroup().location

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: 'cosmos-eventsourcing-\${uniqueString(resourceGroup().id)}'
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: { defaultConsistencyLevel: 'Session' }
    locations: [{ locationName: location, failoverPriority: 0 }]
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  parent: cosmosAccount
  name: 'EventSourcingDB'
  properties: { resource: { id: 'EventSourcingDB' } }
}

resource eventStoreContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: database
  name: 'EventStore'
  properties: {
    resource: {
      id: 'EventStore'
      partitionKey: { paths: ['/streamId'], kind: 'Hash' }
      changeFeedPolicy: { retentionDuration: 10080 }
    }
    options: { throughput: 400 }
  }
}`;

  const gcpPulumiCode = `// Pulumi (TypeScript) - GCP Event Sourcing
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const config = new pulumi.Config();
const region = config.get("region") || "us-central1";

// Firestore Database - Event Store
const firestoreDb = new gcp.firestore.Database("event-sourcing-db", {
  locationId: region,
  type: "FIRESTORE_NATIVE",
  concurrencyMode: "OPTIMISTIC",
  pointInTimeRecoveryEnablement: "POINT_IN_TIME_RECOVERY_ENABLED",
});

// Pub/Sub Topic for Event Publishing
const eventsTopic = new gcp.pubsub.Topic("domain-events", {
  name: "domain-events",
  messageRetentionDuration: "604800s",
});

// Projector Subscription
const projectorSub = new gcp.pubsub.Subscription("projector-sub", {
  name: "projector-subscription",
  topic: eventsTopic.name,
  ackDeadlineSeconds: 60,
  enableExactlyOnceDelivery: true,
  retryPolicy: { minimumBackoff: "10s", maximumBackoff: "600s" },
});

export const firestoreDatabase = firestoreDb.name;
export const eventTopicName = eventsTopic.name;`;

  const ImplementationsTab = () => (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-700 pb-2">
        {[
          { id: 'core', label: 'Core', color: '#3b82f6' },
          { id: 'aws', label: 'AWS', color: '#ff9900' },
          { id: 'azure', label: 'Azure', color: '#0078d4' },
          { id: 'gcp', label: 'GCP', color: '#4285f4' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveImplTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeImplTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
            style={{ backgroundColor: activeImplTab === tab.id ? tab.color : 'transparent' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeImplTab === 'core' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {['go', 'python', 'rust', 'java'].map(lang => (
              <button
                key={lang}
                onClick={() => setActiveCoreLang(lang)}
                className={`px-3 py-1.5 rounded text-sm font-medium ${
                  activeCoreLang === lang ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>
          <CodeBlock code={coreCode[activeCoreLang]} filename={`implementations/core/${activeCoreLang}/event_sourcing.${activeCoreLang === 'go' ? 'go' : activeCoreLang === 'python' ? 'py' : activeCoreLang === 'rust' ? 'rs' : 'java'}`} />
        </div>
      )}

      {activeImplTab === 'aws' && (
        <CodeBlock code={awsCdkCode} filename="infrastructure/aws/cdk-ts/event-store-stack.ts" />
      )}

      {activeImplTab === 'azure' && (
        <CodeBlock code={azureBicepCode} filename="infrastructure/azure/bicep/main.bicep" />
      )}

      {activeImplTab === 'gcp' && (
        <CodeBlock code={gcpPulumiCode} filename="infrastructure/gcp/pulumi-ts/index.ts" />
      )}
    </div>
  );

  const LeadershipTab = () => (
    <div className="space-y-6">
      <div className="bg-[#1a1d24] rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Explain to Your Team</h3>
        <p className="text-gray-300 leading-relaxed">
          Event Sourcing stores every state change as an immutable event in sequence — instead of overwriting 
          data, we append facts about what happened. CQRS separates the models we use for writing (commands) 
          from reading (queries), letting us optimize each independently. Together, they give us a complete 
          audit trail, the ability to rebuild any past state, and freedom to create read models optimized 
          for each query pattern without touching the write side.
        </p>
      </div>

      <div className="bg-[#1a1d24] rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Justify the Decision</h3>
        <div className="space-y-3 text-gray-400 text-sm">
          <p><span className="text-green-400 font-medium">Audit requirements:</span> "We need to prove exactly what happened and when for compliance. Event sourcing gives us an immutable, append-only log."</p>
          <p><span className="text-green-400 font-medium">Temporal queries:</span> "The business needs 'what was the state at time T?' questions. We replay events to that point."</p>
          <p><span className="text-green-400 font-medium">Read/write disparity:</span> "We have 100x more reads than writes. CQRS lets us scale and optimize each independently."</p>
        </div>
      </div>

      <div className="bg-[#1a1d24] rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Failure Modes & Observability</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-red-400 font-medium mb-2">What Breaks</h4>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li>• Projection lag during high write load</li>
              <li>• Version conflicts on concurrent writes</li>
              <li>• Projection corruption from projector bugs</li>
              <li>• Old events unprocessable after schema changes</li>
            </ul>
          </div>
          <div>
            <h4 className="text-green-400 font-medium mb-2">Key Alerts</h4>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li>• projection_lag_seconds &gt; 30s</li>
              <li>• concurrency_conflict_rate &gt; 5%</li>
              <li>• event_processing_errors &gt; 0</li>
              <li>• event_store_append_latency_p99 &gt; 100ms</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1d24] rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Code Review Checklist</h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>□ Events named in past tense capturing business intent</li>
          <li>□ Commands validate invariants before emitting events</li>
          <li>□ Projectors are idempotent</li>
          <li>□ Optimistic concurrency check on writes</li>
          <li>□ Events include all data needed for replay</li>
          <li>□ Event schema changes are backward compatible</li>
        </ul>
      </div>

      <div className="bg-[#1a1d24] rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Design Review Questions</h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>? Expected event volume per aggregate? Need snapshotting from day one?</li>
          <li>? How will you handle GDPR deletion with append-only store?</li>
          <li>? Acceptable projection lag for UX? How communicate staleness?</li>
          <li>? How will you version events when schema needs to change?</li>
          <li>? Can you rebuild read models from events if projector has a bug?</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Event Sourcing + CQRS</h1>
          <p className="text-gray-400">Technical deep-dive for architecture decisions, team teaching, and production implementation</p>
        </header>

        <nav className="flex gap-2 mb-6 border-b border-gray-700 pb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main>
          {activeTab === 'architecture' && <ArchitectureTab />}
          {activeTab === 'concepts' && <ConceptsTab />}
          {activeTab === 'implementations' && <ImplementationsTab />}
          {activeTab === 'leadership' && <LeadershipTab />}
        </main>

        <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          Sources: Martin Fowler (Event Sourcing, CQRS), Greg Young (CQRS Documents), Microsoft Azure Architecture Center
        </footer>
      </div>
    </div>
  );
};

export default EventSourcingCQRS;
