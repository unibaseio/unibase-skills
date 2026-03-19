---
name: bitagent
description: Launch, buy, and sell tokens on BitAgent bonding curves via CLI. Use when: creating agent tokens, trading on bonding curves, buy/sell BitAgent tokens (BSC Mainnet/Testnet).
license: MIT
metadata:
  author: Unibase
  version: "1.0.0"
  tags: [bitagent, bsc, bonding-curve, token, agent-token]
---

# BitAgent Skill

Interact with BitAgent bonding curves on BSC via CLI. Run from **skill root** with env set. Execute commands and return stdout to the user.

## Config (required)

- `PRIVATE_KEY` — Wallet private key (0x...). Set via env or OpenClaw `skills.entries.bitagent-skill.env`

**Security**: Never commit or log `PRIVATE_KEY`. Use env vars or platform config only.

Run `npm install` at skill root before first use.

## Commands

| Tool | Command | Result |
|------|---------|--------|
| **launch** | `npx tsx scripts/index.ts launch --network <bsc\|bscTestnet> --name "<name>" --symbol "<symbol>" --reserve-symbol "<UB\|WBNB\|USD1>"` | Deploys agent token. Returns Contract Address and URL. |
| **buy** | `npx tsx scripts/index.ts buy --network <bsc\|bscTestnet> --token "<tokenAddress>" --amount "<amount>"` | Buys tokens. Returns Tx Hash. |
| **sell** | `npx tsx scripts/index.ts sell --network <bsc\|bscTestnet> --token "<tokenAddress>" --amount "<amount>"` | Sells tokens. Returns Tx Hash. |

### Amount semantics

- **buy** — `--amount` = **reserve token to spend** (e.g. `0.1` = 0.1 BNB if reserve is WBNB)
- **sell** — `--amount` = **agent tokens to sell** (e.g. `1000` = 1000 tokens)

## Flow

1. **Launch**: Ask for Name, Symbol, Reserve (UB/WBNB/USD1) if not provided.
2. **Buy/Sell**: Require Token Address and Amount. Remember: buy = reserve amount, sell = token amount.

## Example

**User:** "Create agent token MyAgent (MAG) with WBNB reserve"

```bash
npx tsx scripts/index.ts launch --network bsc --name "MyAgent" --symbol "MAG" --reserve-symbol "WBNB"
```

**User:** "Buy 0.1 BNB worth of that token" (token 0x...)

```bash
npx tsx scripts/index.ts buy --network bsc --token "0x..." --amount "0.1"
```

**User:** "Sell 500 of my MAG tokens"

```bash
npx tsx scripts/index.ts sell --network bsc --token "0x..." --amount "500"
```

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| `PRIVATE_KEY environment variable is not set` | Not configured | Set env or OpenClaw config |
| `Insufficient balance` | Low BNB/UB/USD1 | Use unibase-pay-skill to check balance; get BNB from [Faucet](https://www.bitagent.io/testnet-faucet) |
| `Could not find creator for token` | Invalid token or network | Verify token address and --network |
| `Unsupported network` | Wrong --network | Use `bsc` or `bscTestnet` |

## Cross-Skill

- **Check BNB balance**: Use unibase-pay-skill
- **Get testnet BNB**: [BitAgent Faucet](https://www.bitagent.io/testnet-faucet)

## Links

- [BitAgent](https://www.bitagent.io/)
- [BitAgent Docs](https://openos-labs.gitbook.io/bitagent-docs/)
- [Testnet Faucet](https://www.bitagent.io/testnet-faucet)
