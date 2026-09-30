---
name: membase
description: Membase is the long-term memory between a person and every AI they use. Use this skill when an application or an agent needs to read a user's memory (search, profile), save to it (facts, documents) or when a user wants their own Claude Code, Claude, ChatGPT, Cursor or another MCP client connected to their Membase memory. It covers the agent protocol — one set of nine tools served over MCP and REST — the developer key, the consent model, and the SDK shape.
---

## Install me

*If you are an AI assistant installing Membase for the user, start here. A person can read it too.*

Membase is the user's long-term memory. There are two ways to connect to it, and this page is
one of them:

- **MCP** — for an AI app (Claude, ChatGPT, Cursor, Codex…): the user pastes
  `https://api.app.membase.io/mcp-http` into the app and approves in the browser. Not this page.
- **This skill** — for you, an AI that reads pages and runs commands: you install this folder and
  call Membase's REST API yourself with a developer key the user gives you.

If Membase tools are already in your tool list (the user connected you over MCP), use them and
keep this skill only for its rules; do not call the API a second way.

**1. Install the skill folder.** It is a folder, not this file alone. Fetch every file below and
keep the paths (`SKILL.md` at the root, the rest under `references/`):

- https://www.app.membase.io/plugin/skills/membase/SKILL.md
- https://www.app.membase.io/plugin/skills/membase/references/quickstart.md
- https://www.app.membase.io/plugin/skills/membase/references/mcp-setup.md
- https://www.app.membase.io/plugin/skills/membase/references/sdk-guide.md
- https://www.app.membase.io/plugin/skills/membase/references/api-reference.md
- https://www.app.membase.io/plugin/skills/membase/references/use-cases.md

Or, with a shell, the whole folder at once: `curl -L https://www.app.membase.io/plugin/membase-skill.zip -o membase-skill.zip && unzip membase-skill.zip`.

Put it where your client reads skills: Claude Code `~/.claude/skills/membase/`; Codex beside
`AGENTS.md`, pointed to from there; Cursor and Windsurf in the project, pointed to from the rules
file; any other agent keeps this file as its instructions.

**2. The key.** Nothing works without one; it is the user's developer key, and it is your only
credential.

- If the user's message read "Install Membase from … using key mbk_…", that key is it. Store it
  where your shell will find it in later sessions — Claude Code: the `env` block of
  `~/.claude/settings.json` as `MEMBASE_API_KEY`; Codex: `env` in its `config.toml`; any other
  agent: the environment it runs in. That takes effect from the next session; for the rest of
  this one, `export MEMBASE_API_KEY=mbk_…` in the shell you use. Do not ask anything else.
- If there was no key in the message, finish step 1, then ask the user for one: they create it
  under **Connect › Developer keys** in the Membase app (choosing what you may do and which
  memories you reach) and paste the `mbk_…` token to you. Do not try any other route.

**3. Check.** `curl -s https://api.app.membase.io/v1/containers -H "Authorization: Bearer $MEMBASE_API_KEY"`
and tell the user what came back. A non-empty list means you are set: name the memories you can
use and stop. An empty list means the user has not switched any memory on for you yet; you
cannot do that yourself — ask them to open the memory in Membase and switch you on under
**Use in**. An error: `401`/`403` means the key is wrong, expired or revoked — do not retry
with it, ask the user for a fresh one from **Connect › Developer keys**; a `5xx` or a timeout
means the service is busy — wait a minute and try once more, then tell the user. Every call
after this is the same: the REST API under `https://api.app.membase.io/v1`, this header, the
tools below.

# Use the user's memory

A **container** is a Memory in the app; a **memory** is a learned fact; a **document** is
source material. Each key belongs to one account and reaches only the memories granted to it.

## Core rules

- If Membase MCP tools are already available, use them. Do not add another connection.
- Read `get_profile` near the start of a conversation when profile access is granted.
- Use `search_memories` before answering questions about the user's past work, decisions or
  preferences. Ask in natural language; omit `container` to search everything in reach.
  Cite the returned `container_name` when using a result.
- Use `add_memory` for a fact the user asks to remember, and `add_document` for source text or
  a URL. Store only what the user supplied. Pass `custom_id` for retry-safe document imports.
- Respect the key's access level. Delete or forget only after the user agrees, with
  `confirm=true`; these operations require Full access. OAuth MCP connections are read-only.
- A first search can take up to a minute while memory wakes. Check the response for containers
  that could not answer yet.

## Read only what you need

- [Quickstart](references/quickstart.md): create a key, make the first read or save, troubleshoot access.
- [API reference](references/api-reference.md): tool endpoints, parameters and response shapes.
  Read this before constructing REST calls beyond the installation check.
- [MCP setup](references/mcp-setup.md): connect an app when the user asks for MCP.
- [SDK guide](references/sdk-guide.md): integrate from code and handle errors.
- [Use cases](references/use-cases.md): workflows for assistants and applications.
