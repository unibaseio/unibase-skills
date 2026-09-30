# Connecting an MCP client

This page is the **MCP** way in: an app the user approves. The other way is the skill itself — an
AI that reads pages and runs commands installs the folder and calls the REST API with a developer
key ("Install Membase from https://www.app.membase.io/skill using key mbk_…"); it never needs
anything on this page.

Two ways to authenticate the same server, `https://api.app.membase.io/mcp-http` (Streamable
HTTP, plain JSON responses):

- **OAuth consent** — for the user's own AI apps. The client discovers the authorization server,
  the browser opens Membase's consent screen, the user ticks the memories the app may use and
  whether it may read their profile (**Profile access**), and the client receives a token good
  for those. The app's card on **Connect** shows it as *Authorized* (an app without a tile of its
  own is listed under **Other apps**); switches there narrow or revoke it live. Profile access is
  set on the consent screen only; changing it means disconnecting and authorizing again.
- **Developer key header** — for Claude Code and any client that can send a static header, when
  the user prefers a key they minted (`Connect › Developer keys`). No consent round-trip; the
  key's access level and memories apply.

A connected client sees only the tools its credential grants (`tools/list` is filtered per
caller), so a consent-minted connection offers `list_containers`, `search_memories` and — when
ticked — `get_profile`, and nothing that writes: a call to any other tool is refused with
`403 unauthorized`.

## Claude Code

```bash
claude mcp add --transport http --scope user membase https://api.app.membase.io/mcp-http
claude mcp login membase           # v2.1.186+; older versions authorize with /mcp in a session
```

or, with a developer key:

```bash
claude mcp add --transport http --scope user membase https://api.app.membase.io/mcp-http \
  --header "Authorization: Bearer ${MEMBASE_API_KEY}"
```

`--scope user` makes the server available in every project. Then ask: *"List my Membase
containers."* An empty list means no memory is switched on for this connection yet.

Ready-made configuration files for the clients below are served under
`https://www.app.membase.io/plugin/` (`mcp.json`, `clients/vscode.mcp.json`,
`clients/codex.toml`); none carries a header.

## Claude (claude.ai and desktop)

Customize → Connectors → **+** → *Add custom connector* → paste the URL → finish the
authorization in the browser. In a chat, **+ → Connectors** switches Membase on. Remove it on the
same Connectors page — and revoke on Membase's Connect page too, because the client does not
tell the server.

## ChatGPT

Open ChatGPT Plugins (`https://chatgpt.com/plugins`) → **+**: name, description, Connection =
the public MCP server connection, paste the complete URL including its path (a bare domain does
not initialize), Authentication = *OAuth*, leave Client ID / Secret empty (ChatGPT registers
itself), accept the trust prompt, **Create**. If ChatGPT asks you to enable **Developer mode**
(web, Pro / Plus / Business / Enterprise / Education; a workspace admin can turn it off), follow
its on-screen instructions. The browser opens Membase's consent screen. Back in ChatGPT, the
plugin's details page lists the discovered tools (**Refresh** if the list looks stale); then
start a new conversation and add Membase from the tools menu.

## Codex

```bash
codex mcp add membase --url https://api.app.membase.io/mcp-http
codex mcp login membase
codex mcp list
```

The IDE extension takes the same server under the gear menu → *MCP servers* (Streamable HTTP),
then *Restart extension* and *Authenticate*; CLI and extension share the configuration.

## Cursor

`.cursor/mcp.json` in the project, or `~/.cursor/mcp.json` globally:

```json
{ "mcpServers": { "membase": { "url": "https://api.app.membase.io/mcp-http" } } }
```

Enable it under Customize in the sidebar and complete the OAuth prompt; check *Available Tools*
in chat. With a developer key, add `"headers": { "Authorization": "Bearer …" }`.

## Windsurf / Devin

```bash
devin mcp add --scope user membase https://api.app.membase.io/mcp-http
devin mcp login membase
devin mcp list
```

Configuration lives in `~/.config/devin/mcp_config.json` (`%APPDATA%\devin\mcp_config.json` on
Windows). The older Cascade client used `~/.codeium/windsurf/mcp_config.json` with
`mcpServers.membase.serverUrl`.

## VS Code (Copilot agent mode)

Command palette → *MCP: Add Server* → *HTTP* → the URL → complete the OAuth prompt, or put the
server in `.vscode/mcp.json`:

```json
{ "servers": { "membase": { "type": "http", "url": "https://api.app.membase.io/mcp-http" } } }
```

## Any other client

Use the same URL. The server advertises OAuth discovery (RFC 9728) on a 401, accepts a bearer
developer key in `Authorization`, and speaks Streamable HTTP with or without a trailing slash.

## Verifying and revoking

The **Connect** page in Membase shows every authorized client with its last activity; the
*Uses* card on a client's page is the per-memory switch, the *Approvals* card (shown when there
is more than one) revokes one credential, **Disconnect…** revokes them all. Removing a connector inside the client does not
notify Membase — revoke there to be sure access has stopped.
