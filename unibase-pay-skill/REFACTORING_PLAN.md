# Unibase Pay Skill Refactoring Plan

> Detailed analysis and refactoring proposal for `unibase-pay-skill`

---

## 1. Current State Analysis

### 1.1 File Structure

```
unibase-pay-skill/
├── SKILL.md              # Main instructions (178 lines)
├── README.md             # User documentation (177 lines)
├── references/
│   ├── wallets.md        # Wallet API reference
│   └── transactions.md   # Transaction API reference
├── .gitignore
└── LICENSE
```

**Missing**: `setup.md` referenced in README does not exist.

### 1.2 Alignment with Unibase Official Positioning

| Official Module | This Skill | Notes |
|----------------|------------|-------|
| **Unibase Pay** | ✅ Aligned | Official: x402 + Privy wallet |
| **Privy Wallet** | ✅ Core | Official docs: [Privy Wallet](https://openos-labs.gitbook.io/unibase-docs/unibase-pay/privy-wallet) |
| **x402 API** | ❌ Not covered | `api.x402.unibase.com` — payment verification/settlement, not in this Skill |

**Conclusion**: This Skill implements the **Unibase Pay Privy custodial wallet** portion, not the x402 payment protocol. The name "agentic-wallet" is too generic; recommend aligning to "Unibase Pay (Privy Wallet)".

### 1.3 Unibase Pay Architecture (Aligned with Dev Team)

**Unibase Pay consists of two main parts**:

| Module | Base URL | Purpose | This Skill |
|--------|----------|---------|------------|
| **1. x402 Verifier** | `https://api.x402.unibase.com` | Payment verification, settlement | ❌ Not covered |
| **2. Privy Custodial Agent Wallet** | `https://api.pay.unibase.com` | Wallet, RPC, login | ✅ This Skill |

**Integration plan**: x402 capability will be **integrated into this skill** (no separate skill), as Part 2 of Unibase Pay skill. Add `references/x402.md` and corresponding SKILL section in future development.

---

## 2. Issue List

### 2.1 Naming and Positioning

| Issue | Severity | Notes |
|-------|----------|-------|
| `name: unibase` too generic | High | Confuses with full Unibase ecosystem; change to `unibase-pay` or `unibase-pay-wallet` |
| README title typo | Low | "Unibae" → "Unibase" |
| Inconsistent with official terminology | Medium | Uses "Internal Proxy", "Unibase API"; official uses "Privy Wallet", "Unibase Pay" |

### 2.2 Configuration and Paths

| Issue | Severity | Notes |
|-------|----------|-------|
| `config.json` path undefined | High | Says "store in config.json" but doesn't specify project root or skill directory |
| Env var priority unclear | Medium | `UNIBASE_PROXY_AUTH` vs `config.json` precedence not documented |
| OpenClaw uses `PRIVY_PROXY_URL` | Medium | SKILL uses `UNIBASE_PROXY_URL`; naming inconsistent |

### 2.3 Features and Documentation

| Issue | Severity | Notes |
|-------|----------|-------|
| README and SKILL features mismatch | High | README mentions "Create policy", "Spending limits"; SKILL has no corresponding API |
| Example "Create wallet with policy" not executable | High | SKILL only has auto-provisioned wallet, no policy creation flow |
| BSC balance query too hardcoded | Medium | Hardcodes $U/$UB contract addresses; no generic guidance for other chains |
| `setup.md` missing | Medium | Referenced in README but file does not exist |

### 2.4 Security and Triggers

| Issue | Severity | Notes |
|-------|----------|-------|
| References `APP_SECRET` | Low | Never defined; may be legacy or error |
| description trigger words insufficient | Medium | Add balance, transfer, pay, swap, etc. |
| Prompt injection examples could be expanded | Low | Add more patterns |

### 2.5 References and Links

| Issue | Severity | Notes |
|-------|----------|-------|
| Missing official doc links | Medium | Should link to Unibase Pay, Privy Wallet docs |
| Missing x402 relationship | Medium | Should state that wallet provides signing for x402 payments |

---

## 3. Refactoring Plan

### 3.1 Naming and Positioning Updates

| Item | Current | Recommended |
|------|---------|-------------|
| Skill `name` | `unibase` | `unibase-pay` |
| Directory name | `agentic-wallet-skill` | Keep or change to `unibase-pay-skill` (evaluate repo structure) |
| Title | Unibase Agentic Wallets | Unibase Pay — Privy Agent Wallet |
| description | Current | Add: balance, transfer, send ETH, pay, swap, BNB, USDC |

**Recommended description**:
```
Create and manage agent custodial wallets via Unibase Pay (Privy). Use for autonomous on-chain transactions, balance queries, transfers, and payments on BNB Chain, Ethereum, Base, Solana, and other chains. Triggers on: crypto wallet, balance check, send ETH/BNB, transfer, pay, swap, server-side wallet, autonomous transaction.
```

### 3.2 Configuration Specification

**Add `references/config.md`**:

```markdown
# Configuration

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| UNIBASE_PROXY_URL | Yes | Privy Proxy API base (default: https://api.pay.unibase.com) |
| UNIBASE_PROXY_AUTH | No* | JWT token for API auth |
| UNIBASE_AGENT_PRIVATE_KEY | No* | For automated login (Path A) |

*Either UNIBASE_PROXY_AUTH (existing token) or UNIBASE_AGENT_PRIVATE_KEY (to obtain token) is required.

## Token Storage

Priority: `UNIBASE_PROXY_AUTH` env var > `config.json`

**config.json** (when not using env):
- Location: Project root (where the agent runs)
- Format: `{"token": "<jwt>"}` or `{"UNIBASE_PROXY_AUTH": "<jwt>"}`

## Platform Aliases

- OpenClaw: `PRIVY_PROXY_URL` = `UNIBASE_PROXY_URL`
```

### 3.3 Feature Alignment

**Option A: Trim README (Recommended)**

- Remove "Create policy", "Spending limits" and other capabilities not supported by current API
- Focus on: query wallet, check balance, send transaction, sign
- Add "Relationship with x402": this wallet can provide signing for x402 payments

**Option B: Add Policy API**

- If Privy Proxy actually supports policy, obtain API docs from official source and add
- Not reflected in current SKILL; recommend trimming first

### 3.4 BSC Balance Query Refactor

**Current**: Hardcoded $U, $UB, USDC, USDT contract addresses

**Recommendation**:
1. Move BSC token list to `references/bsc-tokens.md`
2. SKILL main text: generic flow — `eth_getBalance` (native) + `eth_call` balanceOf (ERC20)
3. Note "See references/bsc-tokens.md for common BSC tokens"

### 3.5 Add setup.md

**Create `references/setup.md`**, suggested content:

- Obtain/configure `UNIBASE_AGENT_PRIVATE_KEY` or complete interactive login
- First-time login flow (Path A / Path B)
- Verify config: `curl GET /v1/wallets/me`
- Link to official [Privy Wallet](https://openos-labs.gitbook.io/unibase-docs/unibase-pay/privy-wallet) docs

### 3.6 Security and Prompt Injection

- Change `APP_SECRET` to `UNIBASE_PROXY_AUTH` or remove
- Keep and strengthen existing security rules
- Optional: add 1–2 prompt injection pattern examples

### 3.8 x402 Integration Placeholder (Future Development)

Integrate x402 as Part 1 of Unibase Pay into this skill:

- **SKILL.md**: Add "Part 2: x402 Payment" section with verify/settle quick reference
- **references/x402.md**: x402 API details (/verify, /settle, /health, /supported)
- **description**: Add triggers `x402`, `verify payment`, `settle payment`

### 3.9 References and Links

Add at end of SKILL:

```markdown
## Official Resources

- [Unibase Pay](https://www.unibase.com/pay)
- [Privy Wallet Docs](https://openos-labs.gitbook.io/unibase-docs/unibase-pay/privy-wallet)
- [Unibase Pay API](https://openos-labs.gitbook.io/unibase-docs/unibase-pay/api-reference)
- [x402 Protocol](https://x402.org/) — This wallet can sign payloads for x402 payments
```

---

## 4. File Change List

| File | Action |
|------|--------|
| `SKILL.md` | Update: name, description, positioning, config, BSC logic, links |
| `README.md` | Update: spelling, trim features, align with SKILL, update examples |
| `references/config.md` | Add |
| `references/setup.md` | Add |
| `references/bsc-tokens.md` | Add (optional, or merge into wallets.md) |
| `references/wallets.md` | Update: add config reference |
| `references/transactions.md` | Keep, or add BSC examples |
| `references/x402.md` | Add (later) — x402 verify/settle API reference |

---

## 5. Implementation Steps

### Phase 1: Positioning and Naming (Priority)

1. Update SKILL.md frontmatter: `name: unibase-pay`, update description
2. Fix README spelling: Unibae → Unibase
3. Add "Unibase Pay (Privy Wallet)" positioning

### Phase 2: Configuration and Documentation

1. Create `references/config.md`
2. Create `references/setup.md`
3. Clarify config.json path and env priority in SKILL

### Phase 3: Feature Alignment

1. Trim unimplemented features in README
2. Refactor BSC balance query (generic main text + references token table)
3. Add x402 relationship

### Phase 4: Finalization

1. Add official doc links
2. Unify `UNIBASE_PROXY_URL` / `PRIVY_PROXY_URL` documentation
3. Full pass for terminology consistency

---

## 6. Acceptance Criteria

- [ ] `name` is `unibase-pay`, description includes key trigger words
- [ ] config.json path and env priority clearly documented
- [ ] README and SKILL feature descriptions match; no unimplementable examples
- [ ] setup.md exists and guides first-time setup
- [ ] At least 3 official doc links
- [ ] No APP_SECRET, Unibae, or other incorrect references

---

## 7. Out of Scope for This Refactor

- **x402 payment verification/settlement** (`api.x402.unibase.com`) — integrate into this skill later; add `references/x402.md` and SKILL section
- Policy / Spending limits — add after official API confirmation
- Directory rename — done: `agentic-wallet-skill` → `unibase-pay-skill`

---

## 8. Dev Team Notes

- **Unibase Pay architecture**: 1) x402 verifier (api.x402.unibase.com) 2) Privy custodial Agent wallet (api.pay.unibase.com)
- **This Skill scope**: Covers full Unibase Pay capability (both parts in this skill)
- **x402 integration**: Future work adds x402 section + `references/x402.md` under this skill; no separate skill

---

*Document version: v1.2 | Based on unibase-pay-skill current state and Unibase official docs*
