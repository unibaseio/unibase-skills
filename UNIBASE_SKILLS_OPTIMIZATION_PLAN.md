# Unibase Skills Optimization and Refactoring Plan

> Expert-level plan based on Unibase official positioning ([unibase.com](https://www.unibase.com/) | [docs](https://openos-labs.gitbook.io/unibase-docs/)) and Agent Skills best practices

---

## 1. Strategic Alignment

### 1.1 Unibase Modules and Skills Mapping

| Unibase Module | Current Skill | Mapping | Status |
|----------------|---------------|---------|--------|
| **Unibase Pay** | unibase-pay-skill | Full coverage: 1) x402 verifier 2) Privy wallet; x402 to be integrated | ✅ Aligned |
| **Membase** | membase-skill | Memory backup/restore (Skill form) | ✅ Aligned |
| **BitAgent** | bitagent-skill | Agent token bonding curve | ✅ Aligned |
| **AIP Protocol** | aip-skill | Agent interoperability, ERC-8004, x402 | ✅ Optimized |
| **Unibase DA** | — | No corresponding skill | Optional extension |

### 1.2 Core Principles

1. **Open Agent Internet** — Skills should reflect "memory + identity + payment" as one stack
2. **BNB Chain First** — Official mainnet is on BNB; docs and examples should default to it
3. **MCP/Skill Dual Track** — Align with official "MCP + Skill" integration strategy
4. **x402 Throughout** — Payment capabilities should explicitly reference x402 protocol

---

## 2. Naming and Terminology

### 2.1 Skill Naming Convention

| Current | Suggested | Reason |
|---------|-----------|--------|
| `name: unibase` | `name: unibase-pay` | Match Unibase Pay module, avoid over-generalization |
| `name: Unibase AIP Skill` | `name: aip` | Standalone module, consistent with membase |

### 2.2 Terminology Table (Cross-Skill)

| Concept | Unified Term | Avoid |
|---------|--------------|-------|
| Wallet service | Unibase Pay / Privy Proxy | Mixing Internal Proxy, Pay API |
| Payment protocol | x402 | X402, X-402 |
| On-chain identity | ERC-8004 | 8004, on-chain identity mixed |
| Memory layer | Membase | membase, Memory mixed |
| API base URL | Clearly distinguish Pay / x402 / AIP | Mixed usage |

### 2.3 Unibase Pay Architecture (Dev Team Alignment)

**Unibase Pay consists of two parts:**

| Module | Base URL | Purpose | Corresponding Skill |
|--------|----------|---------|---------------------|
| **1. x402 Verifier** | `https://api.x402.unibase.com` | Payment verification, settlement | Reserved, to be added |
| **2. Privy Custodial Agent Wallet** | `https://api.pay.unibase.com` | Custodial wallet, RPC proxy | unibase-pay-skill |

- **AIP Platform**: `https://api.aip.unibase.com` — Agent registration, invocation

unibase-pay-skill covers full Unibase Pay capabilities. x402 will be integrated into this skill (references/x402.md + SKILL section), not as a separate skill.

---

## 3. Per-Skill Optimization Plan

### 3.1 unibase-pay-skill (Rename completed)

**Goal**: Align with Unibase Pay product positioning, strengthen "Agent autonomous payment" narrative

| Item | Priority | Details |
|------|----------|---------|
| Rename | P1 | `unibase` → `unibase-pay`, match product line |
| Positioning | P1 | Add "Unibase Pay Privy custodial wallet for Agent autonomous payment" |
| Config path | P1 | Clarify `config.json` location: project root or `$UNIBASE_PROXY_AUTH` env |
| BSC logic | P2 | Use BSC balance query as example, add generic EVM query notes |
| Trigger words | P2 | Add to description: `balance`, `transfer`, `send ETH`, `swap`, `pay` |
| x402 relation | P2 | Explain wallet as x402 payment signer |
| Links | P3 | Add [Unibase Pay](https://www.unibase.com/pay) doc link |

### 3.2 membase-skill

**Goal**: Keep full functionality, fix execution path and verbosity

| Item | Priority | Details |
|------|----------|---------|
| Execution | P1 | Use `npx tsx membase.ts` or `bun run membase.ts`, remove `node membase.ts` |
| Path | P1 | Add "run from skill install directory", give Cursor / OpenClaw paths |
| Progressive disclosure | P2 | Move Error Handling, Troubleshooting, some Examples to `references/` |
| Metadata | P2 | Add `allowed-tools: [bash, node]` |
| Official alignment | P2 | Add [Membase Hub](https://hub.membase.unibase.com/) and [Quick Start](https://openos-labs.gitbook.io/unibase-docs/get-started/membase-quickstart) links |
| Line count | P3 | Keep main SKILL.md under 500 lines |

### 3.3 bitagent-skill

**Goal**: Add practical details and security notes

| Item | Priority | Details |
|------|----------|---------|
| Metadata | P1 | Add `license`, `version`, `tags: [bitagent, bsc, bonding-curve, token]` |
| Buy/Sell semantics | P1 | Clarify `buy --amount` = reserve token (BNB/UB/USD1), not agent token count |
| Security | P1 | PRIVATE_KEY: never commit or log, use env or key manager |
| Error handling | P2 | Add common errors: `PRIVATE_KEY not set`, `Insufficient balance`, `Invalid token` |
| Examples | P2 | Full conversation: create token, buy, sell |
| Cross-skill | P2 | Note "Use unibase-pay-skill to check BNB balance" — Done |
| Official links | P3 | Add [BitAgent](https://www.bitagent.io/) site |

### 3.4 aip-skill

**Goal**: Upgrade from "concept description" to "executable flow"

| Item | Priority | Details |
|------|----------|---------|
| Executable flow | P1 | Add "Register Agent 5 steps", "Call Agent 5 steps" with curl/SDK examples |
| Invoke example | P1 | Add `POST /invoke` request body in SKILL or references |
| Multi-language | P2 | Note Python SDK primary; JS/TS or REST direct usage |
| Membase integration | P2 | Explain AIP Agent config for `MEMBASE_ACCOUNT`, `MEMBASE_SECRET_KEY` |
| Official alignment | P2 | Link [AIP docs](https://openos-labs.gitbook.io/unibase-docs/aip), [quick start](https://openos-labs.gitbook.io/unibase-docs/get-started/aip-quickstart) |
| Naming | P2 | `name: Unibase AIP Skill` → `name: aip` |
| Env vars | P2 | Add `MEMBASE_ID` (official docs) vs `MEMBASE_ACCOUNT` relation |

---

## 4. Cross-Skill Architecture

### 4.1 Shared Config Layer

**Issue**: Config scattered across skills (env, config.json, platform config)

**Solution**: Add `docs/CONFIG.md` at repo root

```markdown
# Unibase Skills Unified Config Guide

| Variable/Config | Purpose | Skills |
|------------------|---------|--------|
| UNIBASE_PROXY_URL | Privy wallet API | unibase-pay |
| UNIBASE_PROXY_AUTH | JWT token | unibase-pay |
| MEMBASE_ACCOUNT | BNB address | membase, aip |
| MEMBASE_SECRET_KEY | Signing key | membase, aip |
| MEMBASE_ID | Unique ID | membase |
| PRIVATE_KEY | Wallet private key | bitagent |
| AIP_ENDPOINT | AIP platform URL | aip |
```

### 4.2 Cross-Skill References

| Scenario | Reference |
|----------|-----------|
| Check BNB balance before BitAgent trade | unibase-pay → bitagent |
| AIP Agent needs persistent memory | aip → membase |
| x402 payment tasks | aip ↔ unibase-pay |

### 4.3 Root README Upgrade

- Add "Unibase ecosystem overview" diagram
- Group Skills by "memory / identity / payment / token"
- Add "typical workflow" e.g. "backup memory → check balance → trade BitAgent"

---

## 5. Optional New Skills

### 5.1 x402 Integration (inside unibase-pay-skill, not separate)

**Purpose**: Unibase Pay Part 1 — x402 verification/settlement, **integrated into unibase-pay-skill**

- **API**: `https://api.x402.unibase.com` (/verify, /settle, /health, /supported)
- **Integration**: Add `references/x402.md` + SKILL section in unibase-pay-skill
- **Benefit**: One skill covers full Unibase Pay (wallet + x402), single install

### 5.2 unibase-overview-skill (Optional)

**Purpose**: Lightweight "Unibase intro" skill

- Content: Five modules overview, quick links, doc links
- Use: New users/agents quickly build mental model

---

## 6. Implementation Phases

### Phase 1: Base Alignment (1–2 weeks)

1. Unify naming: `unibase` → `unibase-pay`, `Unibase AIP Skill` → `aip`
2. Add official doc links (site, docs, each module Quick Start)
3. Clarify API endpoints: Pay vs x402 vs AIP

### Phase 2: Core Optimization (2–3 weeks)

1. **aip-skill**: Add executable flow, Invoke examples
2. **membase-skill**: Unify execution, path notes
3. **bitagent-skill**: Buy/Sell semantics, security, examples
4. **unibase-pay-skill**: Config path, BSC positioning

### Phase 3: Architecture Enhancement (2–3 weeks)

1. Create `docs/CONFIG.md` for unified config
2. Root README: ecosystem overview and workflows
3. Cross-skill references and "which skill when" decision tree

### Phase 4: Optional Extensions (as needed)

1. unibase-x402-skill (if direct x402 usage needed)
2. unibase-overview-skill (if intro onboarding needed)
3. Unibase DA skill (if official DA integration released)

---

## 7. Acceptance Criteria

- [ ] All skills have `name` and `description` per Agent Skills spec
- [ ] Each skill has at least 1 full executable example
- [ ] Config (env/config) is documented
- [ ] Root README clearly shows Unibase ↔ Skills mapping
- [ ] No non-runnable commands (e.g. `node membase.ts`)
- [ ] Official doc links are valid and version-appropriate

---

## 8. References

- [Unibase Website](https://www.unibase.com/)
- [Unibase Docs](https://openos-labs.gitbook.io/unibase-docs/)
- [Agent Skills Spec](https://agentskills.io/)
- [Create Skill Best Practices](~/.cursor/skills-cursor/create-skill/SKILL.md)
- [x402 Protocol](https://x402.org/) — Payment protocol spec

---

*Document version: v1.0 | Created: 2025-03*
