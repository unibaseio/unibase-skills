# BitAgent Skill Optimization Strategy

> Based on BitAgent official documentation and Agent Skills best practices

---

## 1. Current State Analysis

### 1.1 File Structure

```
bitagent-skill/
├── SKILL.md           # Main instructions (~40 lines)
├── README.md          # Installation and configuration
├── scripts/
│   └── index.ts       # CLI implementation (launch, buy, sell)
├── package.json
└── tsconfig.json
```

**Characteristics**: Simple structure, CLI-driven, depends on @bitagent/sdk.

### 1.2 Alignment with Official BitAgent

| Official Content | This Skill | Gap |
|------------------|------------|-----|
| **Platform** | BSC Mainnet/Testnet ✅ | Aligned |
| **Launch** | Bonding curve ✅ | Aligned |
| **Staking / AIP** | Not covered | This skill only launch/buy/sell |
| **Docs** | No links | Official has [bitagent-docs](https://openos-labs.gitbook.io/bitagent-docs/) |
| **Faucet** | Not mentioned | Official has testnet-faucet |

### 1.3 Core Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| **Buy/Sell semantics unclear** | High | buy amount = reserve token (BNB/UB/USD1), sell amount = agent token count |
| **Security notes missing** | High | PRIVATE_KEY must not be committed or printed; needs clarification |
| **Metadata incomplete** | Medium | Missing license, version, tags |
| **Error handling missing** | Medium | No common errors or recovery notes |
| **Examples insufficient** | Medium | No full conversation example |
| **Cross-skill references** | Low | Doesn't mention unibase-pay-skill for BNB balance queries |
| **Repo reference** | Low | README says openclaw-bitagent; skills repo is bitagent-skill |

---

## 2. Buy/Sell Semantics (Code Confirmed)

**buy**:
- `--amount` = **reserve token amount** (e.g. 0.1 BNB, 10 UB, 100 USD1)
- Internally uses `binaryReverseMint` to compute agent tokens from bonding curve
- Output prints "Calculated Buy Amount (Tokens): X"

**sell**:
- `--amount` = **agent token count** (number of tokens to sell)
- Sells directly by that amount

**SKILL must clearly distinguish** to avoid user confusion.

---

## 3. Optimization Strategy

### 3.1 Buy/Sell Semantics (P1)

Add below command table in SKILL:

```markdown
**Amount semantics:**
- **launch** — N/A
- **buy** — `--amount` = reserve token to spend (e.g. `0.1` = 0.1 BNB if reserve is WBNB)
- **sell** — `--amount` = agent tokens to sell (e.g. `1000` = 1000 tokens)
```

### 3.2 Security Notes (P1)

Add to Config section:

```markdown
## Security

- **Never** commit `PRIVATE_KEY` to git or share in chat
- Use environment variables or platform config (e.g. OpenClaw `skills.entries.bitagent-skill.env`)
- Do not log or print the private key
```

### 3.3 Metadata (P1)

```yaml
---
name: bitagent
description: Launch, buy, and sell tokens on BitAgent bonding curves via CLI. Use when: creating agent tokens, trading on bonding curves, buy/sell BitAgent tokens (BSC Mainnet/Testnet).
license: MIT
metadata:
  author: Unibase
  version: "1.0.0"
  tags: [bitagent, bsc, bonding-curve, token, agent-token]
---
```

**Naming**: `bitagent-skill` → `bitagent` (aligned with aip, membase as standalone module)

### 3.4 Error Handling (P2)

Add `references/errors.md` or short section in SKILL:

| Error | Cause | Resolution |
|-------|-------|------------|
| `PRIVATE_KEY environment variable is not set` | Not configured | Set env or OpenClaw config |
| `Insufficient balance` | Insufficient balance | Top up BNB/UB/USD1; use unibase-pay-skill to check balance |
| `Could not find creator for token` | Token not registered or wrong address | Verify token address and network |
| `Unsupported network` | Wrong --network | Use `bsc` or `bscTestnet` |

### 3.5 Full Example (P2)

Add "Example conversation" to SKILL:

```markdown
## Example

**User:** "Create a new agent token called MyAgent with symbol MAG, using WBNB as reserve"

**Agent:** Run:
\`\`\`bash
npx tsx scripts/index.ts launch --network bsc --name "MyAgent" --symbol "MAG" --reserve-symbol "WBNB"
\`\`\`

**User:** "Buy 0.1 BNB worth of that token" (assuming token address 0x...)

**Agent:** Run:
\`\`\`bash
npx tsx scripts/index.ts buy --network bsc --token "0x..." --amount "0.1"
\`\`\`
(amount = 0.1 BNB to spend)

**User:** "Sell 500 of my MAG tokens"

**Agent:** Run:
\`\`\`bash
npx tsx scripts/index.ts sell --network bsc --token "0x..." --amount "500"
\`\`\`
(amount = 500 agent tokens)
```

### 3.6 Cross-Skill References (P2)

Add to Config or Tips:

- Check BNB balance: use **unibase-pay-skill**
- Get BNB: via unibase-pay-skill transfer, or [BitAgent Testnet Faucet](https://www.bitagent.io/testnet-faucet)

### 3.7 Official Links (P2)

- [BitAgent](https://www.bitagent.io/)
- [BitAgent Docs](https://openos-labs.gitbook.io/bitagent-docs/)
- [Testnet Faucet](https://www.bitagent.io/testnet-faucet)

### 3.8 Paths and Repo (P3)

- **Execution path**: Run from **skill root** (bitagent-skill/), same as "repo root"
- **README**: If in skills monorepo, change install instructions to install from `skills/bitagent-skill`

---

## 4. File Change List

| File | Action |
|------|--------|
| `SKILL.md` | Update: name, description, Buy/Sell semantics, security notes, examples, links |
| `references/errors.md` | Add (optional) |
| `README.md` | Update: install path, official links, align with skills repo |

---

## 5. Implementation Priority

| Phase | Content | Estimate |
|-------|---------|----------|
| **1** | Buy/Sell semantics, security notes, metadata | Core |
| **2** | Error handling, full example, cross-skill refs, official links | Polish |
| **3** | Path notes, README and repo alignment | Enhance |

---

## 6. Acceptance Criteria

- [ ] Buy/Sell amount semantics clearly stated in SKILL
- [ ] PRIVATE_KEY security notes present
- [ ] At least 1 full conversation example (launch + buy + sell)
- [ ] At least 2 official links (BitAgent, Docs, or Faucet)
- [x] name is `bitagent` (aligned with aip, membase)

---

## 7. Reference Resources

- [BitAgent](https://www.bitagent.io/)
- [BitAgent Docs](https://openos-labs.gitbook.io/bitagent-docs/)
- [Testnet Faucet](https://www.bitagent.io/testnet-faucet)
- [Unibase Explorer](https://www.explorer.unibase.com/)

---

*Document version: v1.1 | Optimization executed*
