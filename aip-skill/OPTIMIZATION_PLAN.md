# Unibase AIP Skill Optimization Strategy

> Based on Unibase official AIP documentation and Agent Skills best practices

---

## 1. Current State Analysis

### 1.1 File Structure

```
aip-skill/
├── SKILL.md              # Main instructions (~42 lines)
└── references/
    ├── platform.md       # Platform architecture and API
    └── sdk.md            # Python SDK reference
```

**Missing**: README.md, setup.md, executable examples, Invoke request body

### 1.2 Alignment with Official AIP

| Official Content | This Skill | Gap |
|------------------|------------|-----|
| **AIP Formula** | Not explicitly written | Official: AIP = ERC-8004 + Membase + x402 |
| **30-second example** | None | Official has `git clone → uv sync → run` full commands |
| **Environment variables** | Partial | Missing `MEMBASE_ID`; inconsistent with official Quick Start |
| **Invoke API** | Concept only | No `POST /invoke` request body example |
| **MCP/gRPC** | Not mentioned | Official emphasizes MCP + gRPC dual protocol |
| **Hubs** | None | Link Hub, Memory Hub not mentioned |
| **Examples** | None | Official has chess, trader, personal agents, etc. |

### 1.3 Core Issues

1. **Too conceptual** — Tells Agent "what it can do" but lacks "how to do it" steps
2. **No executable flow** — Register Agent, invoke Agent both lack curl/SDK full examples
3. **References too deep** — Direct links to references sub-sections; Agent may only read part
4. **Improper naming** — `name: Unibase AIP Skill` should be `name: aip` (standalone module, aligned with membase)
5. **Doc links broken** — `docs.unibase.com` should be `openos-labs.gitbook.io/unibase-docs`

---

## 2. Optimization Strategy

### 2.1 Naming and Metadata (P1)

| Item | Current | Recommended |
|------|---------|-------------|
| `name` | `Unibase AIP Skill` | `aip` |
| description | Current | Add triggers: `register agent`, `invoke agent`, `call agent`, `A2A`, `ERC-8004`, `MCP`, `gRPC` |

**Recommended description**:
```
Build, deploy, and interact with autonomous AI agents on the Unibase Agent Interoperability Protocol (AIP). Use when: registering agents with ERC-8004 identity, invoking agents by handle, A2A communication, MCP/gRPC tool integration, x402 payments, or multi-agent orchestration.
```

### 2.2 Executable Flow (P1)

**Add "Quick Start" section to SKILL.md** with 5 copy-paste commands:

```markdown
## Quick Start (5 Minutes)

### Run an AIP Agent

1. Clone: `git clone https://github.com/unibaseio/aip-agent.git && cd aip-agent`
2. Install: `uv venv && uv sync --dev --all-extras`
3. Set env: `export MEMBASE_ID="<id>" MEMBASE_ACCOUNT="<bnb-addr>" MEMBASE_SECRET_KEY="<key>"`
4. Run: `cd examples/aip_agents && uv run grpc_full_agent_gradio.py`
5. Open Gradio UI in browser
```

**Add "Call an Agent" flow** (for callers, not developers):

```markdown
## Call an Agent (Client)

Use AIP SDK or REST:

\`\`\`python
from aip_sdk import AsyncAIPClient
async with AsyncAIPClient(base_url="https://api.aip.unibase.com") as client:
    result = await client.run(objective="What is 2+2?", agent="calculator.handle", user_id="user:0x...")
    print(result.output)
\`\`\`
```

### 2.3 Invoke API Example (P1)

**Add `references/invoke.md`** or expand `platform.md`:

```markdown
# Invoke API

## Call by Handle

POST https://api.aip.unibase.com/invoke
Content-Type: application/json

{
  "objective": "What is the weather in Tokyo?",
  "agent": "weather.handle",
  "user_id": "user:0x..."
}

## Call by Agent ID

POST https://api.aip.unibase.com/invoke/{agent_id}
(same body)
```

### 2.4 Environment Variable Unification (P2)

**Add `references/config.md`**:

| Variable | Purpose | Source |
|----------|---------|--------|
| `MEMBASE_ID` | Unique identifier | Official Quick Start |
| `MEMBASE_ACCOUNT` | BNB address (identity) | Requires BNB Testnet |
| `MEMBASE_SECRET_KEY` | Signing key | Shared with membase-skill |
| `AIP_ENDPOINT` | Platform URL | Default api.aip.unibase.com |
| `GATEWAY_URL` | Gateway URL | Default gateway.aip.unibase.com |

Note: AIP reuses Membase account system; config aligned with membase-skill.

### 2.5 Membase Integration Notes (P2)

Clarify in SKILL or references:

- AIP Agent uses `MEMBASE_ACCOUNT` + `MEMBASE_SECRET_KEY` as on-chain identity
- Conversation memory persisted to Membase; can use membase-skill for backup/restore
- Need BNB address before configuring AIP (can obtain from unibase-pay-skill)

### 2.6 Official Alignment (P2)

- **AIP formula**: Write at SKILL start: `AIP = ERC-8004 Identity + Membase Memory + x402 Payment`
- **MCP vs A2A vs AIP**: Add comparison table (can copy from official)
- **Architecture diagram**: `LLM <-> AIP Agent <-> Tools (MCP/gRPC)`
- **Hubs**: Brief notes on Link Hub, Memory Hub
- **Doc links**: Standardize to `openos-labs.gitbook.io/unibase-docs`

### 2.7 Multi-language and REST (P2)

- Note: Official SDK is **Python** primary
- If JS/TS SDK exists, add notes; if not, note REST API can be used directly
- platform.md already has Invoke endpoint; add full request body

### 2.8 Cross-Skill References (P3)

- Payment before invoking Agent → use unibase-pay-skill Privy wallet
- Persistent memory → use membase-skill
- Get BNB address → unibase-pay-skill or BitAgent

### 2.9 Add README.md (P2)

User-facing (not Agent) install and usage, structure similar to unibase-pay-skill:

- What This Is
- Use Cases
- Quick Start
- Usage by Platform (Claude, Cursor, OpenClaw)
- What's Included
- Links

---

## 3. File Change List

| File | Action |
|------|--------|
| `SKILL.md` | Update: name, description, Quick Start, Call Agent flow, AIP formula, links |
| `README.md` | Add |
| `references/config.md` | Add |
| `references/invoke.md` | Add (or merge into platform.md) |
| `references/platform.md` | Expand: Invoke request body, full base URL |
| `references/sdk.md` | Add: MEMBASE_ID, official example links |

---

## 4. Implementation Priority

| Phase | Content | Estimate |
|-------|---------|----------|
| **1** | Naming, Quick Start, Invoke example, doc link fixes | Core |
| **2** | config.md, Membase integration notes, README | Polish |
| **3** | Cross-skill references, Hubs notes | Enhance |

---

## 5. Acceptance Criteria

- [ ] `name` is `aip`, description includes key trigger words
- [ ] At least 1 "5-minute runnable" Quick Start
- [ ] Invoke has full request body example (curl or SDK)
- [ ] Env vars match official Quick Start (including MEMBASE_ID)
- [ ] Doc links valid (gitbook)
- [ ] AIP formula and MCP/A2A comparison table visible

---

## 6. Reference Resources

- [AIP Docs](https://openos-labs.gitbook.io/unibase-docs/aip)
- [AIP Quick Start](https://openos-labs.gitbook.io/unibase-docs/get-started/aip-quickstart)
- [AIP Agent GitHub](https://github.com/unibaseio/aip-agent)
- [Unibase AIP Official Site](https://www.unibase.com/aip)

---

*Document version: v1.1 | Based on aip-skill current state and Unibase official docs*
