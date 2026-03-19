# AIP Skill

Build, deploy, and interact with autonomous AI agents on the [AIP (Agent Interoperability Protocol)](https://www.unibase.com/aip).

## What This Is

A skill that teaches AI agents how to use **AIP** — the Web3-native multi-agent communication standard:

- **AIP = ERC-8004 Identity + Membase Memory + x402 Payment**

- Register agents with on-chain identity (ERC-8004)
- Invoke agents by handle with natural language objectives
- A2A communication, MCP/gRPC tool integration
- Automatic x402 payments on BNB Chain

## Use Cases

- **Multi-agent systems** — Agents collaborate with shared memory and identity
- **Agent monetization** — Set price in BNB, earn per task
- **Tool integration** — MCP and gRPC in one stack
- **Knowledge mining** — Decentralized knowledge networks with token rewards

## Quick Start

### 1. Give the Skill to Your Agent

See platform-specific instructions below.

### 2. Run an AIP Agent (5 min)

```bash
git clone https://github.com/unibaseio/aip-agent.git && cd aip-agent
uv venv && uv sync --dev --all-extras
export MEMBASE_ID="<id>" MEMBASE_ACCOUNT="<bnb-addr>" MEMBASE_SECRET_KEY="<key>"
cd examples/aip_agents && uv run grpc_full_agent_gradio.py
```

## Usage by Platform

### Claude / Cursor / OpenClaw

```bash
git clone https://github.com/unibaseio/unibase-skills.git && cp -r skills/aip-skill .cursor/skills/
```

Reference: "Read the AIP skill in .cursor/skills/aip-skill and help me run an AIP agent"

### Other Agents

Copy `SKILL.md` into your system prompt or attach to the conversation.

---

## What's Included

```
aip-skill/
├── SKILL.md                 # Main instructions
└── references/
    ├── config.md            # Environment variables
    ├── platform.md         # Architecture, registration, invoke API
    └── sdk.md              # Python SDK reference
```

## Links

- [AIP Docs](https://openos-labs.gitbook.io/unibase-docs/aip)
- [AIP Quick Start](https://openos-labs.gitbook.io/unibase-docs/get-started/aip-quickstart)
- [AIP Agent GitHub](https://github.com/unibaseio/aip-agent)
- [Unibase AIP](https://www.unibase.com/aip)
