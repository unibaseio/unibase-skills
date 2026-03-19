# BitAgent Skill

Launch, buy, and sell tokens on [BitAgent](https://www.bitagent.io/) bonding curves on BSC Mainnet and Testnet.

## What This Is

A skill that teaches AI agents to use the BitAgent CLI for:
- **launch** — Deploy new agent tokens on bonding curves
- **buy** — Buy tokens with reserve (BNB/UB/USD1)
- **sell** — Sell agent tokens

## Installation

### From skills monorepo

```bash
git clone https://github.com/unibaseio/unibase-skills.git && cp -r skills/bitagent-skill .cursor/skills/
cd bitagent-skill && npm install
```

### Standalone

```bash
git clone https://github.com/unibaseio/openclaw-bitagent bitagent-skill
cd bitagent-skill && npm install
```

Add to OpenClaw config (`~/.openclaw/openclaw.json`):

```json
{
  "skills": {
    "load": { "extraDirs": ["/path/to/bitagent-skill"] }
  }
}
```

## Configure

Set `PRIVATE_KEY` via env or OpenClaw:

```json
{
  "skills": {
    "entries": {
      "bitagent-skill": {
        "enabled": true,
        "env": { "PRIVATE_KEY": "0x..." }
      }
    }
  }
}
```

**Security**: Never commit or log the private key.

## Amount Semantics

- **buy** — `--amount` = reserve token to spend (e.g. 0.1 BNB)
- **sell** — `--amount` = agent tokens to sell (e.g. 1000)

## Links

- [BitAgent](https://www.bitagent.io/)
- [BitAgent Docs](https://openos-labs.gitbook.io/bitagent-docs/)
- [Testnet Faucet](https://www.bitagent.io/testnet-faucet)
