"use client"

import React, { useState } from 'react';

// ============================================================================
// Tech Lead Knowledge Base: Interfaces, Traits & Protocols Across Languages
// ============================================================================
// Validated against: PEP 544 (Python Protocols), Effective Go, The Rust Book,
// JEP 409 (Sealed Classes), TypeScript Handbook.
// ============================================================================

const COLORS = {
  bg: '#0f1117',
  surface: '#1a1d24',
  surfaceAlt: '#161b22',
  border: '#2d3139',
  text: '#e5e7eb',
  textDim: '#9ca3af',
  blue: '#3b82f6',
  green: '#10b981',
  amber: '#f59e0b',
  purple: '#8b5cf6',
  red: '#ef4444',
};

const LANG_COLORS = {
  Go: '#00ADD8',
  Rust: '#CE422B',
  Java: '#f89820',
  Python: '#3776AB',
  TypeScript: '#3178C6',
};

// ---------------------------------------------------------------------------
// Code samples
// ---------------------------------------------------------------------------

const goCode = `// Pattern: Interface-based abstraction (structural typing)
// Reference: Effective Go — https://go.dev/doc/effective_go#interfaces
// Production note: "Accept interfaces, return structs" — keep interfaces small
//                  and define them where they are consumed, not declared.

package payments

import (
	"context"
	"errors"
	"fmt"
)

// ---------- Domain (structs carry DATA) ----------

type Money struct {
	AmountMinor int64  // cents / smallest unit
	Currency    string // ISO-4217
}

type Payment struct {
	ID       string
	Amount   Money
	Customer string
}

// ---------- Behavior (interfaces carry WHAT, not HOW) ----------
// Note: No 'implements' keyword. Any type with these methods
// automatically satisfies the interface. This is structural typing.

type PaymentGateway interface {
	Charge(ctx context.Context, p Payment) (string, error)
}

type RefundCapable interface {
	Refund(ctx context.Context, txnID string) error
}

// Interface composition — the io.ReadWriter pattern.
type FullGateway interface {
	PaymentGateway
	RefundCapable
}

// ---------- Implementation ----------

type StripeGateway struct {
	apiKey string
}

// No 'implements StripeGateway': compiler infers satisfaction.
func (s *StripeGateway) Charge(ctx context.Context, p Payment) (string, error) {
	if p.Amount.AmountMinor <= 0 {
		return "", errors.New("amount must be positive")
	}
	// ... call Stripe API
	return fmt.Sprintf("stripe_txn_%s", p.ID), nil
}

func (s *StripeGateway) Refund(ctx context.Context, txnID string) error {
	if txnID == "" {
		return errors.New("txnID required")
	}
	return nil
}

// ---------- Compile-time satisfaction assertion (idiomatic) ----------
// Common pattern: force a compile error if StripeGateway stops satisfying
// the interface. Prevents silent breakage from method signature changes.
var _ FullGateway = (*StripeGateway)(nil)

// ---------- Usage ----------

func Process(ctx context.Context, gw PaymentGateway, p Payment) error {
	txnID, err := gw.Charge(ctx, p)
	if err != nil {
		return fmt.Errorf("charge failed: %w", err)
	}
	fmt.Printf("charged: %s\\n", txnID)
	return nil
}
`;

const rustCode = `// Pattern: Trait-based abstraction (nominal typing + ADTs)
// Reference: The Rust Book, ch. 10 — https://doc.rust-lang.org/book/ch10-02-traits.html
// Production note: Traits are explicit contracts. Use enums for closed
//                  domain variants; use traits for open-ended behavior.

use std::fmt;
use thiserror::Error;

// ---------- Domain: structs for DATA, enums for VARIANTS ----------

#[derive(Debug, Clone, PartialEq)]
pub struct Money {
    pub amount_minor: i64,
    pub currency: String,
}

#[derive(Debug, Clone)]
pub struct Payment {
    pub id: String,
    pub amount: Money,
    pub customer: String,
}

// Sealed ADT: the compiler knows these are the ONLY payment states.
// No equivalent exists in Go — this is Rust's superpower for domain modelling.
#[derive(Debug, Clone)]
pub enum PaymentState {
    Pending,
    Authorized { auth_code: String },
    Captured { txn_id: String },
    Failed { reason: String },
}

#[derive(Debug, Error)]
pub enum GatewayError {
    #[error("invalid amount: {0}")]
    InvalidAmount(i64),
    #[error("network: {0}")]
    Network(String),
    #[error("declined: {reason}")]
    Declined { reason: String },
}

// ---------- Behavior: traits define WHAT, optionally HOW (default methods) ----------

pub trait PaymentGateway {
    fn charge(&self, p: &Payment) -> Result<String, GatewayError>;

    // Default method — trait provides HOW, impl can override.
    // This is where Rust traits and Java interfaces converge.
    fn charge_with_log(&self, p: &Payment) -> Result<String, GatewayError> {
        println!("charging {} {}", p.amount.amount_minor, p.amount.currency);
        self.charge(p)
    }
}

pub trait RefundCapable {
    fn refund(&self, txn_id: &str) -> Result<(), GatewayError>;
}

// Trait bounds: compose requirements with '+'.
pub fn settle<G: PaymentGateway + RefundCapable>(
    gw: &G,
    p: &Payment,
) -> Result<String, GatewayError> {
    gw.charge(p)
}

// ---------- Implementation: explicit 'impl Trait for Type' ----------

pub struct StripeGateway {
    api_key: String,
}

impl StripeGateway {
    pub fn new(api_key: impl Into<String>) -> Self {
        Self { api_key: api_key.into() }
    }
}

impl PaymentGateway for StripeGateway {
    fn charge(&self, p: &Payment) -> Result<String, GatewayError> {
        if p.amount.amount_minor <= 0 {
            return Err(GatewayError::InvalidAmount(p.amount.amount_minor));
        }
        Ok(format!("stripe_txn_{}", p.id))
    }
}

impl RefundCapable for StripeGateway {
    fn refund(&self, txn_id: &str) -> Result<(), GatewayError> {
        if txn_id.is_empty() {
            return Err(GatewayError::Declined { reason: "empty txn".into() });
        }
        Ok(())
    }
}

// ---------- Usage with pattern matching on the ADT ----------

pub fn describe(state: &PaymentState) -> String {
    match state {
        PaymentState::Pending => "waiting".into(),
        PaymentState::Authorized { auth_code } => format!("auth:{}", auth_code),
        PaymentState::Captured { txn_id } => format!("done:{}", txn_id),
        PaymentState::Failed { reason } => format!("fail:{}", reason),
    }
}
`;

const javaCode = `// Pattern: Sealed interfaces + records (Java 21+)
// Reference: JEP 409 (Sealed Classes) — https://openjdk.org/jeps/409
//            JEP 395 (Records), JEP 441 (Pattern Matching for switch)
// Production note: Modern Java closes the ADT gap with Rust. Prefer
//                  sealed interfaces + records over enums of enums.

package payments;

import java.util.Objects;

// ---------- Domain: records for DATA, sealed interfaces for VARIANTS ----------

public record Money(long amountMinor, String currency) {
    public Money {
        Objects.requireNonNull(currency);
        if (currency.length() != 3) {
            throw new IllegalArgumentException("ISO-4217 required");
        }
    }
}

public record Payment(String id, Money amount, String customer) {}

// Sealed interface: compiler enforces exhaustive switch — Rust-style ADT.
public sealed interface PaymentState
    permits PaymentState.Pending,
            PaymentState.Authorized,
            PaymentState.Captured,
            PaymentState.Failed {

    record Pending() implements PaymentState {}
    record Authorized(String authCode) implements PaymentState {}
    record Captured(String txnId) implements PaymentState {}
    record Failed(String reason) implements PaymentState {}
}

// ---------- Behavior: interfaces define WHAT + optionally HOW ----------
// Java interfaces have had 'default' methods since Java 8 (2014),
// closing the historical gap with Rust traits.

public interface PaymentGateway {
    String charge(Payment p) throws GatewayException;

    // Default method: interface provides HOW, impl may override.
    default String chargeWithLog(Payment p) throws GatewayException {
        System.out.printf("charging %d %s%n",
            p.amount().amountMinor(), p.amount().currency());
        return charge(p);
    }
}

public interface RefundCapable {
    void refund(String txnId) throws GatewayException;
}

// ---------- Exception (checked, explicit in signature) ----------

public class GatewayException extends Exception {
    public GatewayException(String msg) { super(msg); }
}

// ---------- Implementation: explicit 'implements' keyword ----------

public final class StripeGateway implements PaymentGateway, RefundCapable {

    private final String apiKey;

    public StripeGateway(String apiKey) {
        this.apiKey = Objects.requireNonNull(apiKey);
    }

    @Override
    public String charge(Payment p) throws GatewayException {
        if (p.amount().amountMinor() <= 0) {
            throw new GatewayException("amount must be positive");
        }
        return "stripe_txn_" + p.id();
    }

    @Override
    public void refund(String txnId) throws GatewayException {
        if (txnId == null || txnId.isEmpty()) {
            throw new GatewayException("txnId required");
        }
    }
}

// ---------- Usage: pattern-matching switch (Java 21) ----------

public class PaymentDescriber {
    public static String describe(PaymentState s) {
        return switch (s) {
            case PaymentState.Pending p         -> "waiting";
            case PaymentState.Authorized a      -> "auth:" + a.authCode();
            case PaymentState.Captured c        -> "done:" + c.txnId();
            case PaymentState.Failed f          -> "fail:" + f.reason();
        };
        // No 'default' needed — sealed interface makes this exhaustive.
    }
}
`;

const pythonCode = `# Pattern: Protocol (structural) + ABC (nominal) — Python offers both
# Reference: PEP 544 — https://peps.python.org/pep-0544/
# Production note: Prefer Protocol for interfaces (duck-typing-friendly);
#                  use ABC only when you need shared implementation or
#                  runtime isinstance() enforcement on construction.

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Protocol, runtime_checkable


# ---------- Domain: frozen dataclasses for DATA ----------

@dataclass(frozen=True, slots=True)
class Money:
    amount_minor: int
    currency: str

    def __post_init__(self) -> None:
        if len(self.currency) != 3:
            raise ValueError("ISO-4217 required")


@dataclass(frozen=True, slots=True)
class Payment:
    id: str
    amount: Money
    customer: str


# ---------- Discriminated union via dataclasses (Python's ADT pattern) ----------

@dataclass(frozen=True)
class Pending: ...

@dataclass(frozen=True)
class Authorized:
    auth_code: str

@dataclass(frozen=True)
class Captured:
    txn_id: str

@dataclass(frozen=True)
class Failed:
    reason: str

PaymentState = Pending | Authorized | Captured | Failed


# ---------- Behavior: Protocol (structural — like Go) ----------
# A class satisfies PaymentGateway by having 'charge' with the right
# signature. No inheritance required. This is static duck typing.

@runtime_checkable
class PaymentGateway(Protocol):
    def charge(self, p: Payment) -> str: ...


class RefundCapable(Protocol):
    def refund(self, txn_id: str) -> None: ...


# ---------- Alternative: ABC (nominal — like Java) ----------
# Enforces implementation at instantiation time and supports shared code.

class PaymentGatewayABC(ABC):
    @abstractmethod
    def charge(self, p: Payment) -> str: ...

    # Concrete method — ABCs can ship implementation.
    def charge_with_log(self, p: Payment) -> str:
        print(f"charging {p.amount.amount_minor} {p.amount.currency}")
        return self.charge(p)


# ---------- Implementation (no 'implements' needed for Protocol) ----------

class StripeGateway:
    def __init__(self, api_key: str) -> None:
        self._api_key = api_key

    def charge(self, p: Payment) -> str:
        if p.amount.amount_minor <= 0:
            raise ValueError("amount must be positive")
        return f"stripe_txn_{p.id}"

    def refund(self, txn_id: str) -> None:
        if not txn_id:
            raise ValueError("txn_id required")


# ---------- Usage: pattern matching (Python 3.10+) ----------

def describe(state: PaymentState) -> str:
    match state:
        case Pending():
            return "waiting"
        case Authorized(auth_code=code):
            return f"auth:{code}"
        case Captured(txn_id=tid):
            return f"done:{tid}"
        case Failed(reason=r):
            return f"fail:{r}"


def process(gateway: PaymentGateway, p: Payment) -> None:
    """Accepts anything structurally matching PaymentGateway."""
    txn_id = gateway.charge(p)
    print(f"charged: {txn_id}")


if __name__ == "__main__":
    gw = StripeGateway("sk_test_...")
    # StripeGateway never declared it implements PaymentGateway —
    # it just has the right method. Structural typing wins.
    process(gw, Payment("p1", Money(1000, "USD"), "cust_1"))
`;

const tsCode = `// Pattern: Structural interfaces + discriminated unions
// Reference: TypeScript Handbook — https://www.typescriptlang.org/docs/handbook/2/objects.html
// Production note: TS interfaces are structural — like Go. Use discriminated
//                  unions ('kind' field) to model ADTs; validate at boundaries
//                  with zod to bridge the runtime/compile-time gap.

import { z } from "zod";

// ---------- Domain: types / interfaces for DATA shape ----------

export const MoneySchema = z.object({
  amountMinor: z.bigint(),
  currency: z.string().length(3),
});
export type Money = z.infer<typeof MoneySchema>;

export interface Payment {
  readonly id: string;
  readonly amount: Money;
  readonly customer: string;
}

// ---------- Discriminated union (TS's ADT) ----------

export type PaymentState =
  | { kind: "pending" }
  | { kind: "authorized"; authCode: string }
  | { kind: "captured"; txnId: string }
  | { kind: "failed"; reason: string };

// ---------- Result<T, E> pattern (explicit, no throws) ----------

export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type GatewayError =
  | { kind: "invalidAmount"; amount: bigint }
  | { kind: "network"; message: string }
  | { kind: "declined"; reason: string };

// ---------- Behavior: interfaces define WHAT (structural) ----------

export interface PaymentGateway {
  charge(p: Payment): Promise<Result<string, GatewayError>>;
}

export interface RefundCapable {
  refund(txnId: string): Promise<Result<void, GatewayError>>;
}

// Interface composition via intersection.
export type FullGateway = PaymentGateway & RefundCapable;

// ---------- Implementation: 'implements' is optional (structural) ----------

export class StripeGateway implements FullGateway {
  constructor(private readonly apiKey: string) {}

  async charge(p: Payment): Promise<Result<string, GatewayError>> {
    if (p.amount.amountMinor <= 0n) {
      return { ok: false, error: { kind: "invalidAmount", amount: p.amount.amountMinor } };
    }
    return { ok: true, value: \`stripe_txn_\${p.id}\` };
  }

  async refund(txnId: string): Promise<Result<void, GatewayError>> {
    if (!txnId) {
      return { ok: false, error: { kind: "declined", reason: "empty txn" } };
    }
    return { ok: true, value: undefined };
  }
}

// ---------- Exhaustive switch via 'never' (compile-time ADT check) ----------

export function describe(state: PaymentState): string {
  switch (state.kind) {
    case "pending":    return "waiting";
    case "authorized": return \`auth:\${state.authCode}\`;
    case "captured":   return \`done:\${state.txnId}\`;
    case "failed":     return \`fail:\${state.reason}\`;
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
`;

const CODE_MAP = {
  Go: goCode,
  Rust: rustCode,
  Java: javaCode,
  Python: pythonCode,
  TypeScript: tsCode,
};

const LANGUAGES = ['Go', 'Rust', 'Java', 'Python', 'TypeScript'];

// ---------------------------------------------------------------------------
// Concept cards
// ---------------------------------------------------------------------------

const CONCEPTS = [
  {
    term: 'Structural Typing',
    source: 'Pierce — Types and Programming Languages',
    def: 'A type satisfies an interface/protocol if it has the required shape (methods, fields), regardless of declared lineage.',
    why: 'Enables decoupling — consumers define what they need; producers never import the consumer.',
    mistake: 'Assuming "implements" appears in source. In Go and TS, it often does not.',
    where: 'Go interfaces, TypeScript interfaces, Python typing.Protocol (PEP 544).',
  },
  {
    term: 'Nominal Typing',
    source: 'Pierce — Types and Programming Languages',
    def: 'A type satisfies an interface only if it explicitly declares the relationship (implements / impl / extends).',
    why: 'Makes subtype relationships greppable and intentional; prevents accidental satisfaction.',
    mistake: 'Treating it as "verbose for no reason." The explicitness is the feature at scale.',
    where: 'Java interfaces, Rust traits, C# interfaces, Python ABC.',
  },
  {
    term: 'Algebraic Data Type (ADT)',
    source: 'Milner — ML / Wadler on sum types',
    def: 'A closed set of named variants (sum type), typically matched exhaustively. Encodes "one of these" in the type system.',
    why: 'The compiler becomes your correctness proof: adding a variant forces every consumer to handle it.',
    mistake: 'Using an open class hierarchy (or Go interfaces) to model what is really a closed set. Causes runtime-only exhaustiveness checks.',
    where: 'Rust enums, Java 21 sealed interfaces, TS discriminated unions, Python dataclass unions.',
  },
  {
    term: 'Default / Provided Method',
    source: 'Java 8 default methods (JEP 126); Rust trait default methods',
    def: 'A method body supplied by the interface/trait itself; implementors may override but are not required to.',
    why: 'Lets libraries evolve interfaces without breaking every downstream implementor.',
    mistake: 'Using them to share mutable state. Default methods should be stateless — if you need state, use composition.',
    where: 'Java interfaces (since 8), Rust traits, Python ABC concrete methods, Scala traits.',
  },
  {
    term: 'Interface Segregation',
    source: 'Robert C. Martin — SOLID (ISP)',
    def: 'Clients should not depend on methods they do not use. Prefer many small interfaces over a single fat one.',
    why: 'Reduces coupling, keeps mocks tiny, and makes intent explicit at the call site.',
    mistake: 'Defining one "Repository" interface with 30 methods. The consumer only needs FindById — give it just that.',
    where: 'Go io.Reader / io.Writer are the canonical example — single-method interfaces composed as needed.',
  },
  {
    term: 'Dispatch: Static vs Dynamic',
    source: 'The Rust Book, ch. 17; Java Language Spec §15.12',
    def: 'Static (monomorphization, generics) resolves the concrete type at compile time; dynamic (vtables, trait objects, interface types) resolves at runtime.',
    why: 'Static = zero overhead, larger binaries. Dynamic = smaller code, indirect call cost (~1–2 ns on modern CPUs).',
    mistake: 'Defaulting to dynamic dispatch in hot paths. In Rust, prefer impl Trait / generics; use dyn Trait when you truly need heterogeneous collections.',
    where: 'Rust: generics vs dyn Trait. Java: generics erase at runtime; interface calls are virtual. Go: all interface calls are dynamic.',
  },
  {
    term: 'Accept Interfaces, Return Structs',
    source: 'Jack Lindamood / idiomatic Go',
    def: 'Functions should accept the narrowest interface they need but return concrete types so callers can access the full API surface.',
    why: 'Maximizes flexibility for callers without over-abstracting producers. Aligns with ISP and structural typing.',
    mistake: 'Returning an interface when only one implementation exists. You have hidden the concrete API for no benefit.',
    where: 'Pervasive in Go stdlib; applicable to TypeScript and Python Protocols.',
  },
];

// ---------------------------------------------------------------------------
// Comparison data
// ---------------------------------------------------------------------------

const COMPARISON_ROWS = [
  { dim: 'Typing discipline',       Go: 'Structural (implicit)', Rust: 'Nominal (explicit)',    Java: 'Nominal (explicit)',    Python: 'Both: Protocol / ABC', TypeScript: 'Structural' },
  { dim: 'Declaration keyword',     Go: '— (none)',              Rust: 'impl Trait for T',      Java: 'implements',            Python: 'inherit / match shape', TypeScript: 'implements (optional)' },
  { dim: 'Default methods',         Go: 'No',                    Rust: 'Yes',                   Java: 'Yes (since 8)',         Python: 'Yes (ABC)',          TypeScript: 'No (use abstract class)' },
  { dim: 'Associated types',        Go: 'No',                    Rust: 'Yes',                   Java: 'Generics only',         Python: 'Generics only',      TypeScript: 'Generics only' },
  { dim: 'Closed variant (ADT)',    Go: 'No native',             Rust: 'enum',                  Java: 'sealed interface (21)', Python: 'union of classes',   TypeScript: 'discriminated union' },
  { dim: 'Dispatch default',        Go: 'Dynamic',               Rust: 'Static (generics)',     Java: 'Dynamic (virtual)',     Python: 'Dynamic',            TypeScript: 'Dynamic (JS)' },
  { dim: 'Exhaustiveness checked',  Go: 'No',                    Rust: 'Yes (match)',           Java: 'Yes (sealed + switch)', Python: 'Via type checker',   TypeScript: 'Via never' },
  { dim: 'Runtime isinstance',      Go: 'Type assertion',        Rust: 'No (compile-only)',     Java: 'instanceof',            Python: 'isinstance + ABC',   TypeScript: 'No (type guards)' },
];

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function TabButton({ active, onClick, children, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 18px',
        background: active ? COLORS.surface : 'transparent',
        color: active ? (accent || COLORS.text) : COLORS.textDim,
        border: 'none',
        borderBottom: `2px solid ${active ? (accent || COLORS.blue) : 'transparent'}`,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 500,
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function ConceptCard({ c }) {
  return (
    <div style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding: 18,
      marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: COLORS.text }}>{c.term}</h3>
        <span style={{ fontSize: 12, color: COLORS.textDim }}>
          as defined by: {c.source}
        </span>
      </div>
      <p style={{ margin: '6px 0', color: COLORS.text, fontSize: 14, lineHeight: 1.55 }}>{c.def}</p>
      <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6 }}>
        <div style={{ color: COLORS.textDim }}>
          <span style={{ color: COLORS.green, fontWeight: 500 }}>Why it matters: </span>{c.why}
        </div>
        <div style={{ color: COLORS.textDim, marginTop: 4 }}>
          <span style={{ color: COLORS.red, fontWeight: 500 }}>Common mistake: </span>{c.mistake}
        </div>
        <div style={{ color: COLORS.textDim, marginTop: 4 }}>
          <span style={{ color: COLORS.purple, fontWeight: 500 }}>Where you see it: </span>{c.where}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={copy}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: COLORS.border,
          color: COLORS.text,
          border: 'none',
          padding: '4px 10px',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 12,
          zIndex: 2,
        }}
      >
        {copied ? 'copied' : 'copy'}
      </button>
      <pre style={{
        background: COLORS.surfaceAlt,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: '16px 18px',
        overflow: 'auto',
        fontSize: 13,
        lineHeight: 1.55,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        color: COLORS.text,
        margin: 0,
        maxHeight: '70vh',
      }}>
        <code>{code}</code>
      </pre>
      <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 6, fontFamily: 'monospace' }}>
        {lang.toLowerCase()}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Architecture (mental model diagram)
// ---------------------------------------------------------------------------

function ArchitectureTab() {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: COLORS.text }}>
        Mental Model: Two Axes
      </h2>
      <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
        Every language in this comparison answers two independent questions. The claim that
        "Rust/Go define behavior while Java defines what + how" conflates them. The real
        distinctions are the <strong style={{ color: COLORS.text }}>typing axis</strong> (structural vs
        nominal) and the <strong style={{ color: COLORS.text }}>domain-modelling axis</strong> (open
        hierarchy vs closed ADT).
      </p>

      <div style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: 20,
        marginBottom: 24,
      }}>
        <svg viewBox="0 0 720 480" style={{ width: '100%', height: 'auto', maxHeight: 520 }}>
          {/* Axes */}
          <line x1="360" y1="40" x2="360" y2="440" stroke={COLORS.border} strokeWidth="1.5" />
          <line x1="40" y1="240" x2="680" y2="240" stroke={COLORS.border} strokeWidth="1.5" />

          {/* Axis labels */}
          <text x="360" y="28" fill={COLORS.textDim} fontSize="12" textAnchor="middle">closed (ADT / sealed)</text>
          <text x="360" y="460" fill={COLORS.textDim} fontSize="12" textAnchor="middle">open (extend anywhere)</text>
          <text x="26" y="244" fill={COLORS.textDim} fontSize="12" textAnchor="end">structural</text>
          <text x="694" y="244" fill={COLORS.textDim} fontSize="12" textAnchor="start">nominal</text>

          {/* Quadrant labels */}
          <text x="200" y="60" fill={COLORS.textDim} fontSize="11" textAnchor="middle">structural + closed</text>
          <text x="540" y="60" fill={COLORS.textDim} fontSize="11" textAnchor="middle">nominal + closed</text>
          <text x="200" y="432" fill={COLORS.textDim} fontSize="11" textAnchor="middle">structural + open</text>
          <text x="540" y="432" fill={COLORS.textDim} fontSize="11" textAnchor="middle">nominal + open</text>

          {/* Language badges */}
          {/* TypeScript: structural + closed (discriminated unions) */}
          <g>
            <circle cx="160" cy="150" r="42" fill={LANG_COLORS.TypeScript} opacity="0.2" stroke={LANG_COLORS.TypeScript} strokeWidth="2" />
            <text x="160" y="146" fill={COLORS.text} fontSize="13" fontWeight="600" textAnchor="middle">TypeScript</text>
            <text x="160" y="162" fill={COLORS.textDim} fontSize="10" textAnchor="middle">disc. unions</text>
          </g>

          {/* Rust: nominal + closed */}
          <g>
            <circle cx="560" cy="140" r="42" fill={LANG_COLORS.Rust} opacity="0.2" stroke={LANG_COLORS.Rust} strokeWidth="2" />
            <text x="560" y="136" fill={COLORS.text} fontSize="13" fontWeight="600" textAnchor="middle">Rust</text>
            <text x="560" y="152" fill={COLORS.textDim} fontSize="10" textAnchor="middle">traits + enums</text>
          </g>

          {/* Java: nominal + closed (since 17/21 sealed) */}
          <g>
            <circle cx="560" cy="240" r="42" fill={LANG_COLORS.Java} opacity="0.2" stroke={LANG_COLORS.Java} strokeWidth="2" />
            <text x="560" y="236" fill={COLORS.text} fontSize="13" fontWeight="600" textAnchor="middle">Java 21</text>
            <text x="560" y="252" fill={COLORS.textDim} fontSize="10" textAnchor="middle">sealed + records</text>
          </g>

          {/* Go: structural + open */}
          <g>
            <circle cx="160" cy="340" r="42" fill={LANG_COLORS.Go} opacity="0.2" stroke={LANG_COLORS.Go} strokeWidth="2" />
            <text x="160" y="336" fill={COLORS.text} fontSize="13" fontWeight="600" textAnchor="middle">Go</text>
            <text x="160" y="352" fill={COLORS.textDim} fontSize="10" textAnchor="middle">interfaces + structs</text>
          </g>

          {/* Python: both (straddling center) */}
          <g>
            <ellipse cx="360" cy="360" rx="70" ry="40" fill={LANG_COLORS.Python} opacity="0.2" stroke={LANG_COLORS.Python} strokeWidth="2" />
            <text x="360" y="356" fill={COLORS.text} fontSize="13" fontWeight="600" textAnchor="middle">Python</text>
            <text x="360" y="372" fill={COLORS.textDim} fontSize="10" textAnchor="middle">Protocol + ABC</text>
          </g>

          {/* Legend arrow */}
          <text x="40" y="200" fill={COLORS.textDim} fontSize="10">← no declaration</text>
          <text x="680" y="200" fill={COLORS.textDim} fontSize="10" textAnchor="end">explicit declaration →</text>
        </svg>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: COLORS.text }}>
        The Three-Part Split Every Language Makes
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${COLORS.blue}`, borderRadius: 6, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>1. Data shape</div>
          <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.5 }}>
            structs (Go/Rust), records (Java), dataclasses (Python), interfaces-as-shape (TS)
          </div>
        </div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${COLORS.purple}`, borderRadius: 6, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>2. Closed variants</div>
          <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.5 }}>
            Rust enums, Java sealed interfaces, TS discriminated unions, Python dataclass unions
          </div>
        </div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${COLORS.amber}`, borderRadius: 6, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>3. Open behavior</div>
          <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.5 }}>
            interfaces (Go/Java/TS), traits (Rust), Protocols/ABCs (Python)
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: COLORS.text }}>
        Side-by-Side Comparison
      </h3>
      <div style={{ overflowX: 'auto', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: COLORS.surfaceAlt }}>
              <th style={{ padding: 10, textAlign: 'left', color: COLORS.textDim, fontWeight: 500, borderBottom: `1px solid ${COLORS.border}` }}>Dimension</th>
              {LANGUAGES.map(l => (
                <th key={l} style={{ padding: 10, textAlign: 'left', color: LANG_COLORS[l], fontWeight: 600, borderBottom: `1px solid ${COLORS.border}` }}>{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: 10, color: COLORS.text, fontWeight: 500 }}>{row.dim}</td>
                {LANGUAGES.map(l => (
                  <td key={l} style={{ padding: 10, color: COLORS.textDim }}>{row[l]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Concepts
// ---------------------------------------------------------------------------

function ConceptsTab() {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: COLORS.text }}>
        Core Concepts
      </h2>
      {CONCEPTS.map((c, i) => <ConceptCard key={i} c={c} />)}

      <div style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderLeft: `3px solid ${COLORS.amber}`,
        borderRadius: 8,
        padding: 18,
        marginTop: 16,
      }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>
          Trade-offs: When to reach for each
        </h3>
        <div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.7 }}>
          <div><strong style={{ color: COLORS.text }}>Use structural (Go, TS, Python Protocol)</strong> when you need to decouple from libraries you do not own — consumer defines the interface it needs and anything shaped correctly fits.</div>
          <div style={{ marginTop: 8 }}><strong style={{ color: COLORS.text }}>Use nominal (Rust, Java, Python ABC)</strong> when the relationship must be intentional and auditable — financial systems, security boundaries, or APIs where "accidentally implements" would be a bug.</div>
          <div style={{ marginTop: 8 }}><strong style={{ color: COLORS.text }}>Use a closed ADT (Rust enum, Java sealed, TS union)</strong> when the set of cases is bounded and you want the compiler to force exhaustiveness. Payment states, parser tokens, protocol frames.</div>
          <div style={{ marginTop: 8 }}><strong style={{ color: COLORS.text }}>Use open interfaces/traits</strong> when you expect third parties to add implementations — plugins, drivers, strategies.</div>
        </div>
      </div>

      <div style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderLeft: `3px solid ${COLORS.green}`,
        borderRadius: 8,
        padding: 18,
        marginTop: 14,
      }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>
          Real-world examples
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: COLORS.textDim, fontSize: 13, lineHeight: 1.8 }}>
          <li><strong style={{ color: COLORS.text }}>Go io.Reader / io.Writer</strong> — single-method structural interfaces composed across the stdlib; os.File, bytes.Buffer, http.Response.Body all satisfy them without importing io.</li>
          <li><strong style={{ color: COLORS.text }}>Rust serde</strong> — the Serialize and Deserialize traits with derive macros; nominal satisfaction via #[derive(...)].</li>
          <li><strong style={{ color: COLORS.text }}>Java Optional and Stream</strong> — default methods on interfaces let the JDK evolve the API without breaking implementors.</li>
          <li><strong style={{ color: COLORS.text }}>TypeScript Promise / AsyncIterable</strong> — structural interfaces; any object with .then satisfies PromiseLike.</li>
          <li><strong style={{ color: COLORS.text }}>Python collections.abc</strong> — ABCs for Iterable, Mapping, Sized; also work as Protocols for type-checker-only constraints.</li>
        </ul>
      </div>

      <div style={{ marginTop: 14, fontSize: 11, color: COLORS.textDim }}>
        Sources: PEP 544 (peps.python.org/pep-0544), The Rust Book ch. 10 &amp; 17, JEP 409 (openjdk.org/jeps/409), Effective Go (go.dev/doc/effective_go), TypeScript Handbook.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Implementations
// ---------------------------------------------------------------------------

function ImplementationsTab() {
  const [lang, setLang] = useState('Go');
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6, color: COLORS.text }}>
        Same Domain, Five Languages
      </h2>
      <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
        A payment gateway domain modelled identically across each language. Watch how the
        typing axis and ADT axis drive the shape of the code — not the amount of it.
      </p>

      <div style={{
        display: 'flex',
        gap: 2,
        borderBottom: `1px solid ${COLORS.border}`,
        marginBottom: 14,
        flexWrap: 'wrap',
      }}>
        {LANGUAGES.map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: '8px 16px',
              background: lang === l ? COLORS.surface : 'transparent',
              color: lang === l ? LANG_COLORS[l] : COLORS.textDim,
              border: 'none',
              borderBottom: `2px solid ${lang === l ? LANG_COLORS[l] : 'transparent'}`,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <CodeBlock code={CODE_MAP[lang]} lang={lang} />

      <div style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
        fontSize: 13,
        color: COLORS.textDim,
        lineHeight: 1.65,
      }}>
        <strong style={{ color: COLORS.text }}>What to notice: </strong>
        in the Go and TypeScript samples, <code style={{ color: COLORS.amber }}>StripeGateway</code> never
        needs to name the interface it satisfies — the compiler matches by shape. In Rust and
        Java, the relationship is spelled out with <code style={{ color: COLORS.amber }}>impl ... for</code> /
        <code style={{ color: COLORS.amber }}> implements</code>. Python gives you both tools and lets you
        pick per use case. The domain type (<code style={{ color: COLORS.amber }}>PaymentState</code>)
        is where languages diverge most: Rust enums and Java sealed interfaces give the
        compiler exhaustiveness proofs that Go simply does not offer.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Leadership
// ---------------------------------------------------------------------------

function LeadershipTab() {
  const sections = [
    {
      title: 'Explain to your team (standup / RFC intro)',
      accent: COLORS.blue,
      body: `Interfaces, traits, and protocols all express the same idea — "this type can do X" — but languages differ on two axes. The typing axis decides whether the relationship is implicit (Go, TS) or declared (Rust, Java). The domain axis decides whether you can model closed variants (sealed interfaces, enums) or only open hierarchies. Picking the right tool per axis is a team-level decision, not a style preference.`,
    },
    {
      title: 'Justify the decision in architecture review',
      accent: COLORS.green,
      body: `For a closed set of states — payment lifecycle, parser tokens, request kinds — push for a sealed ADT (Rust enum, Java 21 sealed interface, TS discriminated union). The compiler becomes a teammate that blocks any PR forgetting a case. For plugin-style extension points where third parties will add implementations, use open interfaces and prefer small, composable ones (Go's io.Reader is the benchmark). Conflating these two cases is the root cause of most "we added a new state and three services silently broke" incidents.`,
    },
    {
      title: 'Failure modes & observability',
      accent: COLORS.red,
      body: `Structural typing (Go, TS) fails silently: a method signature change in an implementation can stop satisfying an interface, and only the consumer's compile error reveals it — if there is one. Guard with compile-time assertions (Go: var _ Iface = (*T)(nil); TS: class T implements Iface). Nominal systems (Rust, Java) fail loudly at the declaration site. In production, monitor: percentage of interface calls going through dynamic dispatch (JVM JIT, Go runtime), virtual-call miss rates in hot paths, and surface area of the interface (a 20-method interface is a design smell, not a bug).`,
    },
    {
      title: 'Scale implications (10x, 100x)',
      accent: COLORS.amber,
      body: `At 10x team size, structural typing's "accidental satisfaction" becomes a real hazard — someone adds a method and unintentionally starts implementing an interface defined three modules away. Mitigate with explicit compile-time checks and lint rules. At 100x codebase size, open hierarchies become unmaintainable: you cannot review every place a new subtype might land. This is when Java shops migrate to sealed interfaces and TS shops adopt strict discriminated unions. Revisit interface granularity when mocks in tests exceed ~10 methods — that is ISP telling you to split.`,
    },
    {
      title: 'Code review checklist',
      accent: COLORS.purple,
      body: `Is this interface defined where it is consumed (structural languages) or where it is most stable (nominal)? Is the method set minimal (ISP)? For closed domains, is it modelled with an ADT and matched exhaustively — no default: throw? For open domains, does each implementation have a compile-time assertion that it satisfies the contract? Are default methods stateless? Are errors modelled as data (Result, sealed error types) rather than thrown across interface boundaries in languages where that is idiomatic?`,
    },
    {
      title: 'Questions for design review',
      accent: COLORS.blue,
      body: `"Is this set of variants closed or open?" — if closed, why isn't it an ADT? "Who defines this interface — the producer or the consumer?" — in structural languages, consumer-defined interfaces are idiomatic. "What is the smallest interface the caller actually needs?" — almost always smaller than proposed. "If I add a new variant next quarter, what breaks at compile time vs runtime?" — the answer should be "compile time" for anything load-bearing.`,
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: COLORS.text }}>
        Tech Lead Angles
      </h2>
      {sections.map((s, i) => (
        <div
          key={i}
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderLeft: `3px solid ${s.accent}`,
            borderRadius: 8,
            padding: 18,
            marginBottom: 14,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>
            {s.title}
          </h3>
          <p style={{ margin: 0, color: COLORS.textDim, fontSize: 13.5, lineHeight: 1.7 }}>
            {s.body}
          </p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const TABS = [
  { id: 'arch',    label: 'Architecture' },
  { id: 'concepts',label: 'Core Concepts' },
  { id: 'impl',    label: 'Implementations' },
  { id: 'lead',    label: 'Leadership Angles' },
];

export default function InterfacesTraitsDeepDive() {
  const [tab, setTab] = useState('arch');

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 60px' }}>
        <header style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>
            Tech Lead Knowledge Base
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: COLORS.text }}>
            Interfaces, Traits &amp; Protocols
          </h1>
          <p style={{ color: COLORS.textDim, fontSize: 14, margin: '6px 0 0', lineHeight: 1.5 }}>
            A cross-language model for defining behavior and domain — Go, Rust, Java 21, Python 3.11+, TypeScript 5.
          </p>
        </header>

        <nav style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${COLORS.border}`, marginBottom: 24, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </TabButton>
          ))}
        </nav>

        <main>
          {tab === 'arch' && <ArchitectureTab />}
          {tab === 'concepts' && <ConceptsTab />}
          {tab === 'impl' && <ImplementationsTab />}
          {tab === 'lead' && <LeadershipTab />}
        </main>

        <footer style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${COLORS.border}`, fontSize: 11, color: COLORS.textDim, lineHeight: 1.6 }}>
          Validated against PEP 544, JEP 409, The Rust Book (ch. 10 &amp; 17), Effective Go, and the TypeScript Handbook. Interface segregation from Martin (SOLID). ADT terminology from Pierce (TAPL).
        </footer>
      </div>
    </div>
  );
}
