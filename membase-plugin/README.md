# Membase plugin

> Published copy of `plugin/` in the Membase platform repository, which also serves these files
> at `https://www.app.membase.io/plugin/`. Change it there first, then copy it here.

One package that gives any AI client the Membase **agent protocol** — a person's memory,
searched and written through nine plain tools (`docs/contract/agent-protocol.md`). It is not
tied to one client: the server is a standard remote MCP server, the skill is plain Markdown in
the open Agent Skills layout, and each client gets a thin adapter file.

```
plugin/
├── mcp.json                  # the server, in the `mcpServers` shape most clients read (Cursor, Windsurf, Claude Desktop, Claude Code)
├── server.json               # the MCP registry manifest (registry.modelcontextprotocol.io)
├── skills/membase/           # the skill: SKILL.md + references/ (api-reference.md is generated)
├── clients/
│   ├── vscode.mcp.json       # VS Code's `servers` shape
│   └── codex.toml            # Codex's config.toml snippet
└── .claude-plugin/plugin.json  # Claude Code's adapter (skill + server in one install)
```

The server is `https://api.app.membase.io/mcp-http`, Streamable HTTP. It authorizes with OAuth
on first use (the user approves on Membase's consent screen), or with a developer key in the
`Authorization` header. Per-client steps: `skills/membase/references/mcp-setup.md`.

## Install

Two ways in. **MCP**, for an AI app: paste `https://api.app.membase.io/mcp-http` into the app and
approve in the browser (the table below). **The skill**, for an AI that reads pages and runs
commands: tell it **"Install Membase from https://www.app.membase.io/skill using key mbk_…"** (the
key from Connect › Developer keys — Connect's "with a key" writes the sentence for you). That
address is this skill's SKILL.md with an install preamble; the AI fetches the folder, keeps the key
as `MEMBASE_API_KEY` and calls the REST API with it. Everything below is also served by the app:
`https://www.app.membase.io/plugin/…` (`mcp.json`, `membase-skill.zip`, `clients/…`,
`openapi/agent-protocol.json`) — staged from this folder at build time, never edited there.

| Client | How |
|---|---|
| Cursor, Windsurf, Claude Desktop | merge `mcp.json` into the client's MCP config |
| VS Code | merge `clients/vscode.mcp.json` into `.vscode/mcp.json` |
| Codex | `codex mcp add membase --url https://api.app.membase.io/mcp-http`, or `clients/codex.toml` |
| Claude Code | over MCP: `claude mcp add --transport http --scope user membase https://api.app.membase.io/mcp-http` (the `.claude-plugin/` adapter is for a plugin marketplace once `plugin/` has a public mirror) |
| Claude, ChatGPT | paste the URL as a custom connector / plugin (`mcp-setup.md`) |
| Any agent framework | give it `skills/membase/SKILL.md` as instructions and the REST API (`docs/openapi/agent-protocol.json`) |

The skill folder works on its own wherever Agent Skills are read (`.claude/skills/`,
`~/.claude/skills/`, a Claude.ai upload) and as plain reading for any other agent.

## Keeping it true

`skills/membase/references/api-reference.md` is generated: `python3 scripts/gen_openapi.py &&
python3 scripts/gen_skill_reference.py`. `tests/test_skill_contract.py` fails when a file here
names a tool the contract does not, when the reference is stale, or when any adapter points at
a different server than the skill's setup steps.
