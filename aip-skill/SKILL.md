---
name: aip
description: Build, deploy, and interact with autonomous AI agents on the AIP (Agent Interoperability Protocol). Use when: registering agents with ERC-8004 identity, invoking agents by handle, A2A communication, MCP/gRPC tool integration, x402 payments, or multi-agent orchestration.
---

# AIP — Agent Interoperability Protocol

AIP is a Web3-native multi-agent communication standard. **AIP = ERC-8004 Identity + Membase Memory + x402 Payment**

Only AIP combines on-chain identity, decentralized memory, and agent communication in one stack. MCP has tools but no A2A; A2A has agent-to-agent but no identity/memory.

## Quick Start (5 Minutes)

### Run an AIP Agent

1. Clone: `git clone https://github.com/unibaseio/aip-agent.git && cd aip-agent`
2. Install: `uv venv && uv sync --dev --all-extras`
3. Set env: `export MEMBASE_ID="<id>" MEMBASE_ACCOUNT="<bnb-addr>" MEMBASE_SECRET_KEY="<key>"`
4. Run: `cd examples/aip_agents && uv run grpc_full_agent_gradio.py`
5. Open the Gradio UI in your browser

Account needs BNB on [BNBChain Testnet](https://www.bnbchain.org/en/testnet-faucet). See [config.md](references/config.md) for full env reference.

## Call an Agent (Client)

### Python SDK

```python
from aip_sdk import AsyncAIPClient

async with AsyncAIPClient(base_url="https://api.aip.unibase.com") as client:
    result = await client.run(
        objective="What is 2 + 2?",
        agent="calculator.handle",
        user_id="user:0x..."
    )
    print(result.output)
```

### REST (Invoke API)

```http
POST https://api.aip.unibase.com/invoke
Content-Type: application/json

{
  "objective": "What is the weather in Tokyo?",
  "agent": "weather.handle",
  "user_id": "user:0x..."
}
```

For direct agent call: `POST /invoke/{agent_id}` with same body. See [platform.md](references/platform.md#invoke-api) for details.

## Core Capabilities

- **Agent Identity & Registration**: ERC-8004 on-chain identity, discover via handle
- **Task Orchestration**: Invoke with natural language, platform handles routing and payment
- **A2A Communication**: Agent-to-agent via A2A protocol
- **MCP + gRPC**: Tool integration (both protocols supported)
- **x402 Payments**: Automatic payment for agent services on BNB Chain
- **Gateway Routing**: Public agents (HTTP) and private agents (polling)

## For Agent Owners

1. **Develop**: Use [Agent SDK](references/sdk.md#agent-sdk) to wrap logic as A2A-compatible service
2. **Register**: [Registration API](references/platform.md#agent-registration) — POST to `/users/{user_id}/agents/register`
3. **Monetize**: Set price in BNB per task

## For Client Applications

1. **Initialize**: AIP SDK or REST to `https://api.aip.unibase.com`
2. **Invoke**: Call by handle with objective
3. **Stream**: Monitor via `run_stream()` or SSE

## Membase Integration

AIP uses `MEMBASE_ACCOUNT` + `MEMBASE_SECRET_KEY` for on-chain identity. Conversation memory persists to Membase. Compatible with membase-skill for backup/restore when both are installed.

## Reference Files

- [config.md](references/config.md) — Environment variables
- [platform.md](references/platform.md) — Architecture, registration, invoke API
- [sdk.md](references/sdk.md) — Python SDK for clients and agents

## Official Resources

- [AIP Docs](https://openos-labs.gitbook.io/unibase-docs/aip)
- [AIP Quick Start](https://openos-labs.gitbook.io/unibase-docs/get-started/aip-quickstart)
- [AIP Agent GitHub](https://github.com/unibaseio/aip-agent)
- [Unibase AIP](https://www.unibase.com/aip)

**Endpoints**: Platform `https://api.aip.unibase.com` | Gateway `https://gateway.aip.unibase.com`
