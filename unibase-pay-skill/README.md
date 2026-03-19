# Unibase Pay Skill

Create and manage agent custodial wallets with [Unibase Pay](https://www.unibase.com/pay) — AI agents can control wallets autonomously for on-chain transactions.

## What This Is

A skill that teaches AI agents how to use the **Unibase Pay Privy Proxy** (Part 2 of Unibase Pay) to:

- Query wallet addresses (auto-provisioned on first login)
- Check balances (native + ERC20) on BNB Chain, Ethereum, Base, Solana, and more
- Execute transactions and sign messages
- Use the wallet to sign payloads for x402 payments (Part 1 of Unibase Pay, coming soon)

Unibase Pay = **x402 verifier** (api.x402.unibase.com) + **Privy Agent wallet** (api.pay.unibase.com). This skill covers the wallet part.

## Use Cases

**Trading & DeFi**
- Execute swaps on DEXs
- Rebalance portfolios
- Claim yield farming rewards

**Payments & Commerce**
- Pay for API calls and services
- Tip creators or contributors
- Split payments across recipients

**On-chain Automation**
- Governance votes
- Smart contract interactions
- Cross-chain operations

**Agent-to-Agent**
- Pay other agents for tasks
- Escrow for multi-agent workflows

## Quick Start

### 1. Give the Skill to Your Agent

See platform-specific instructions below.

---

## Usage by Platform

### Claude (Claude Desktop)

```bash
git clone https://github.com/unibaseio/unibase-skills.git && cp -r skills/unibase-pay-skill ./skills/
```

Reference in conversation: "Read the Unibase Pay skill in ./skills/unibase-pay-skill/SKILL.md and help me check my wallet balance"

### Cursor

```bash
git clone https://github.com/unibaseio/unibase-skills.git && cp -r skills/unibase-pay-skill .cursor/skills/
```

Ask: "Read the Unibase Pay skill in .cursor/skills/unibase-pay-skill and help me send 0.01 BNB"

### OpenClaw

```bash
git clone https://github.com/unibaseio/unibase-skills.git && cp -r skills/unibase-pay-skill ~/.openclaw/workspace/skills/
```

Add to `~/.openclaw/openclaw.json`:

```json
{
  "env": {
    "vars": {
      "UNIBASE_PROXY_URL": "https://api.pay.unibase.com"
    }
  }
}
```

(OpenClaw may also use `PRIVY_PROXY_URL` as alias.)

### Windsurf / Codeium

```bash
git clone https://github.com/unibaseio/unibase-skills.git && cp -r skills/unibase-pay-skill .windsurf/skills/
```

### Other Agents (GPT, Gemini, etc.)

Copy `SKILL.md` into your system prompt or attach to the conversation.

---

## What's Included

```
unibase-pay-skill/
├── SKILL.md                 # Main instructions
└── references/
    ├── config.md            # Environment variables and token storage
    ├── setup.md             # First-time setup and login flow
    ├── wallets.md           # Wallet API reference
    ├── bsc-tokens.md        # BSC token addresses for balance queries
    └── transactions.md     # Transaction examples (EVM + Solana)
```

## Chains Supported

| Chain | CAIP-2 |
|-------|--------|
| Ethereum | `eip155:1` |
| BNB Chain | `eip155:56` |
| Base | `eip155:8453` |
| Polygon | `eip155:137` |
| Arbitrum | `eip155:42161` |
| Optimism | `eip155:10` |
| Solana | `solana:mainnet` |

Also: Cosmos, Stellar, Sui, Aptos, Tron, Bitcoin (SegWit), NEAR, TON, Starknet

## Example

Ask your agent:

> "Check my BSC wallet balance"

The agent will use the skill to query native BNB and common tokens ($U, $UB, USDC, USDT) via the Privy Proxy.

## Why Unibase Pay?

- **Server-side control** — No user signatures required, agents transact autonomously
- **Privy custodial wallet** — Managed by Unibase Pay infrastructure
- **Multi-chain** — One API for Ethereum, Solana, BNB Chain, and more
- **x402 ready** — Wallet can sign payloads for x402 payments

## Links

- [Unibase Pay](https://www.unibase.com/pay)
- [Privy Wallet Docs](https://openos-labs.gitbook.io/unibase-docs/unibase-pay/privy-wallet)
- [Unibase Docs](https://openos-labs.gitbook.io/unibase-docs/)

## License

MIT
