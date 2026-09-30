# Membase skill

Teaches an AI agent the Membase **agent protocol**: how a person's own memory is read and
written by the AIs they connect — nine tools over MCP and REST, a developer key for code, OAuth
consent for apps, and the confirmation rule on anything destructive.

```
skills/membase/
├── SKILL.md                      # when to use it, the three nouns, the nine tools, quick integration
└── references/
    ├── quickstart.md             # mint a key → first read → first save → the same key in Claude Code
    ├── mcp-setup.md              # per-client OAuth steps (Claude Code, Claude, ChatGPT, Codex, Cursor, Windsurf, VS Code)
    ├── api-reference.md          # GENERATED from docs/openapi/agent-protocol.json — do not edit
    ├── sdk-guide.md              # the client method per tool, error codes
    └── use-cases.md              # four shapes on the user's own memory, and the anti-patterns
```

## Installation

This folder is the skill half of the client-agnostic `plugin/` (see `../../README.md` for the
server declaration and the per-client adapters). On its own:

- **The short way, for an AI that reads pages and runs commands:** tell it
  "Install Membase from https://www.app.membase.io/skill" — that is `SKILL.md`, served with an
  install preamble; the AI fetches this folder and adds the server itself.
- **Any client that reads Agent Skills** (Claude Code and others): copy this folder to
  `.claude/skills/membase/` (one project) or `~/.claude/skills/membase/` (everywhere), and add the
  server (`claude mcp add --transport http --scope user membase https://api.app.membase.io/mcp-http`).
- **Claude.ai:** upload https://www.app.membase.io/plugin/membase-skill.zip under Settings → Capabilities.
- **Any other agent framework:** hand it `SKILL.md` as instructions; the tools are the REST API
  in `docs/openapi/agent-protocol.json`.

## Keeping it true

`references/api-reference.md` is generated: `python3 scripts/gen_skill_reference.py` after
`python3 scripts/gen_openapi.py`. `tests/test_skill_contract.py` fails when the tool table in
`SKILL.md` names a tool the contract (`docs/contract/agent-protocol.md`,
`kernel/knowledge.py::TOOL_SPECS`) does not, or when the generated reference is stale.

The source of truth for what the skill teaches is `docs/contract/agent-protocol.md`; the
decision behind it is `docs/adr/0050-the-agent-protocol.md`.
