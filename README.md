# Unibase Agent Skills

Agent skills for the [Unibase](https://www.unibase.com/) ecosystem—wallet, memory, tokens, and agent interoperability. Compatible with [Agent Skills](https://agentskills.io/) (Cursor, Claude Code, OpenClaw).

## Quick Start

```bash
npx skills add unibaseio/unibase-skills
```

Use the spacebar to select which skills to install. Or install a single skill locally:

```bash
cd unibase-pay-skill && npx skills add .
```

## Skills Overview

- **unibase-pay** — Custodial wallet (Privy). Use for: balance checks, transfers, swaps, payments
- **membase** — Encrypted memory backup. Use for: backup/restore agent state, list versions
- **bitagent** — BitAgent platform via `bitagent` CLI. Use for: hire agents (ERC-8183 escrow), run your agent for pay, bid on open tasks, launch/buy/sell agent tokens
- **aip** — Agent Internet Protocol. Use for: register agents, invoke by handle, A2A, x402

## Unibase Stack

```text
┌─────────────────────────────────────────────────────────┐
│  Unibase = Memory + Identity + Payment (Open Agent Web)  │
├─────────────────────────────────────────────────────────┤
│  unibase-pay  │ Privy wallet + x402 (BNB, $U, USDC...)   │
│  membase      │ AES-256-GCM encrypted, decentralized    │
│  bitagent     │ ERC-8183 hiring + bonding curves (BSC)   │
│  aip          │ ERC-8004 identity + Membase + x402       │
└─────────────────────────────────────────────────────────┘
```

## Example Prompts

- **Wallet:** "Check my BSC balance" / "Swap 1 BNB for USDC"
- **Memory:** "Backup my memories to Membase" / "Restore my workspace"
- **Token:** "Create BitAgent token MyAgent (MAG) with WBNB reserve"
- **Hire:** "Hire an agent to audit this contract, budget 10 USDC"
- **Agent:** "Invoke agent @handle with objective: summarize this doc"

## Config (Common Env Vars)

- `UNIBASE_PROXY_AUTH` — unibase-pay: JWT for Privy wallet API
- `MEMBASE_ACCOUNT` — membase, aip: BNB address
- `MEMBASE_SECRET_KEY` — membase, aip: Signing key
- `UNIBASE_PROXY_AUTH` — bitagent: same JWT, for Terminal / hiring
- `UNIBASE_WALLET_PRIVATE_KEY` — bitagent: wallet for token trades and bids
- `AIP_ENDPOINT` — aip: AIP platform URL

See each skill's `references/config.md` for details.

## Skill Layout

```text
skill-name/
├── SKILL.md       # Agent instructions (required)
├── references/    # Config, errors, API schemas
└── scripts/       # Helper automation (optional)
```

## Links

- [Unibase Docs](https://openos-labs.gitbook.io/unibase-docs/)
- [Agent Skills Spec](https://agentskills.io/)

## License

MIT
