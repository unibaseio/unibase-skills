# Quickstart: your memory, from code, in five minutes

You need a Membase account with at least one Memory (a *container* in the API). Everything
below runs against `https://api.app.membase.io`.

## 1. Mint a developer key

In the Membase app: **Connect › Developer keys › Create key**. Pick the access level, the
memories it reaches (or every memory), whether it reads the profile, and when it expires. The
token (`mbk_…`) is shown once; the key's page keeps a hint, its usage and recent calls.

1. **Name** it after what will hold it (`nightly-notes script`).
2. **Access**: *Read* (list, search, profile), *Read & write* (…and add memories and
   documents) or *Full access* (…and delete / forget, each call still needs `confirm=true`).
3. Tick the **memories it may use**. You can change this later under **Memory access** on the
   key's page without re-minting; the change applies on the key's next call.
4. Tick **Your profile** if the key may read your profile (`get_profile`).
5. **Create key.** Copy the token now — it is shown once; afterwards only its hint (`mbk_…`) is shown. A lost key is rotated: a new one, then revoke the old.

```bash
export MEMBASE_API_KEY="mbk_…"
export MEMBASE_BASE="https://api.app.membase.io"
```

## 2. First read

```bash
# the containers this key may use
curl -s "$MEMBASE_BASE/v1/containers" -H "Authorization: Bearer $MEMBASE_API_KEY"

# who the user is (needs the profile tick)
curl -s "$MEMBASE_BASE/v1/profile" -H "Authorization: Bearer $MEMBASE_API_KEY"

# what the memory holds on a question — across every container in reach
curl -s "$MEMBASE_BASE/v1/search" \
  -H "Authorization: Bearer $MEMBASE_API_KEY" -H 'content-type: application/json' \
  -d '{"q": "what did we decide about pricing in August", "limit": 5}'
```

A search is a turn inside the user's own memory; the first one after a quiet spell can take up
to a minute while it wakes, and `containers[]` in the answer marks the ones that could not
answer yet.

## 3. First save

```bash
# one fact, as the user said it — a standing fact about the user goes to their profile
curl -s "$MEMBASE_BASE/v1/memories" \
  -H "Authorization: Bearer $MEMBASE_API_KEY" -H 'content-type: application/json' \
  -d '{"content": "The user prefers dark mode.", "static": true}'

# a whole document, into one container; learned in the background
curl -s "$MEMBASE_BASE/v1/documents" \
  -H "Authorization: Bearer $MEMBASE_API_KEY" -H 'content-type: application/json' \
  -d '{"container": "mv-…", "content": "…", "title": "Call with Acme", "custom_id": "call-2026-09-17"}'
# → 202 {"document_id": "srcitem_…", "status": "queued", "learning_run": {...}}

curl -s "$MEMBASE_BASE/v1/documents/srcitem_…" -H "Authorization: Bearer $MEMBASE_API_KEY"
# → {"…", "learned": true}
```

`add_memory` without `static` is a note in a container; with exactly one container in reach the
`container` field may be omitted.

## 4. The same key in Claude Code

```bash
claude mcp add --transport http --scope user membase "$MEMBASE_BASE/mcp-http" \
  --header "Authorization: Bearer ${MEMBASE_API_KEY}"
```

Claude Code then sees the tools of the key's access level. For the user's own Claude, ChatGPT,
Cursor and the rest, use the OAuth consent path instead — `mcp-setup.md`.

## The core loop

```
get_profile (once)  →  search_memories (per question)  →  answer, citing container_name
                     →  add_memory / add_document (what the conversation produced)
```

## Troubleshooting

| Answer | Meaning | Do |
|---|---|---|
| `403 … may not use that container` | the key does not reach it, or it does not exist | switch it on under **Memory access** on the key's page (Connect › Developer keys), or list containers first |
| `403 … not in this agent's capability profile` | the tool is not in this credential's list: above the key's access level, or a write from a consent-minted app (which holds no write tools at all) | mint a key at a higher level; the destructive verbs need Full access |
| `status: confirmation_required` | a Full access key's destructive verb without `confirm=true` | pass `confirm=true` after the person agreed |
| `422 … no agent containers` / `no model` | the account's memory cannot run a turn on this deployment | the user sets a model under AI Setup |
| `429` | the account's turn budget is spent for now | retry later |
| `document_id: null` on a 202 | the folder sync had not written the row yet | list the container's documents in a moment |
