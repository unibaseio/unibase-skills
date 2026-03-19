# Configuration

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MEMBASE_ID` | Yes | Unique identifier for the agent |
| `MEMBASE_ACCOUNT` | Yes | BNB address for on-chain identity |
| `MEMBASE_SECRET_KEY` | Yes | Private key for signing |
| `AIP_ENDPOINT` | No | Platform URL (default: `https://api.aip.unibase.com`) |
| `GATEWAY_URL` | No | Gateway URL (default: `https://gateway.aip.unibase.com`) |

## Setup

1. Get BNB on [BNBChain Testnet](https://www.bnbchain.org/en/testnet-faucet) for `MEMBASE_ACCOUNT`
2. Set all three `MEMBASE_*` variables before running agents
3. AIP reuses the Membase account system — same config as membase-skill

## Shared with Other Skills

- **membase-skill**: Uses same `MEMBASE_ACCOUNT`, `MEMBASE_SECRET_KEY`
- **unibase-pay-skill**: Can provide wallet address for BNB; use for payments when invoking agents
