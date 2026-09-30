# SDK guide

The SDKs are thin clients over the REST namespace (`api-reference.md`): one client, one
developer key, the user's memory. The reach and confirmation rules live server-side and cannot
be bypassed from code. Source: `sdk/python` and `sdk/typescript` in the product repository.

## Python — `membase-sdk`

```bash
pip install membase-sdk
export MEMBASE_API_KEY="mbk_…"        # Connect › Developer keys
```

```python
from membase import Membase

client = Membase()                                  # or Membase(api_key="mbk_…", base_url=…)

client.add(content, container="mv-…", title="", metadata=None, custom_id="")   # POST /v1/documents (202)
client.add(url="https://…", container="mv-…")                                  # a public page instead of text
client.search(q, container=None, limit=None)                                   # POST /v1/search
client.profile(q=None)                                                         # GET /v1/profile
client.ask(message, model=None)                                                # POST /v1/ask (agent exposure)
client.rules()                                                                 # GET /v1/rules

client.containers.list()                                                       # GET /v1/containers
client.documents.list(container=None) / .get(id) / .delete(id, confirm=False)  # GET/GET/DELETE /v1/documents…
client.memories.add(content, container=None, static=False, title="")           # POST /v1/memories (202)
client.memories.forget(id, container=None, confirm=False)                      # DELETE /v1/memories/{id}
```

Every method returns the route's JSON as a dict. Errors are one class per HTTP status —
`BadRequestError` (400), `AuthenticationError` (401, no bearer), `PermissionDeniedError` (403:
an unknown, expired or revoked key, a container outside reach, a verb above the level),
`NotFoundError` (404), `UnprocessableEntityError` (422, `capability_unavailable`),
`RateLimitError` (429), `InternalServerError` (5xx), `APIConnectionError` / `APITimeoutError` —
all with `.code`, `.message`, `.details`, `.retryable`, `.trace_id`. 429 and 5xx are retried
twice with backoff (`max_retries=`); the default timeout is 90 s (`timeout=`), because the first
search after a quiet spell waits for the memory to wake.

## TypeScript — `membase-sdk`

```bash
npm install membase-sdk
```

```ts
import { Membase, PermissionDeniedError } from "membase-sdk";

const client = new Membase();                       // or { apiKey, baseUrl, timeoutMs, maxRetries }

await client.add({ container: "mv-…", content, title: "", metadata: {}, customId: "" });
await client.search({ q, container, limit });
await client.profile({ q });
await client.ask({ message, model });
await client.rules();

await client.containers.list();
await client.documents.list({ container }); await client.documents.get(id); await client.documents.delete(id, { confirm: true });
await client.memories.add({ content, container, static: false, title: "" });
await client.memories.forget(id, { container, confirm: true });
```

Same error classes, with `.code`, `.traceId`; same retry and timeout defaults. Node 18+, zero
dependencies, typed responses.

## Naming

| SDK | Tool | REST |
|---|---|---|
| `add(...)` | `add_document` | `POST /v1/documents` |
| `search(q, ...)` | `search_memories` | `POST /v1/search` |
| `profile(q)` | `get_profile` | `GET /v1/profile?q=` |
| `ask(message)` | `ask_agent` | `POST /v1/ask` |
| `rules()` | `memory_rules` | `GET /v1/rules` |
| `containers.list()` | `list_containers` | `GET /v1/containers` |
| `documents.list(container)` | `list_documents` | `GET /v1/documents?container=` |
| `documents.get(id)` | — | `GET /v1/documents/{id}` |
| `documents.delete(id, confirm)` | `delete_document` | `DELETE /v1/documents/{id}?confirm=` |
| `memories.add(content, ...)` | `add_memory` | `POST /v1/memories` |
| `memories.forget(id, ...)` | `forget_memory` | `DELETE /v1/memories/{id}?container=&confirm=` |

The MCP server offers the same operations under the tool names, so a model that learned
`search_memories` over MCP is calling what code calls `search`.

## Errors

The platform's error envelope, one status per class:

| Status | Code | When |
|---|---|---|
| 400 | `validation` | a missing `q`, both `content` and `url`, an ambiguous `container` |
| 401 | `unauthenticated` | no bearer at all |
| 403 | `unauthorized` | an unknown, expired or revoked key; a container outside the credential's reach; a verb above its level |
| 404 | `not_found` | an unknown document or memory id |
| 422 | `capability_unavailable` | this deployment cannot run a turn for the account (no agent container, no model), or a static fact the profile did not end up holding |
| 429 | `rate_limited` | the account's concurrent-turn budget |

`documents.delete` / `memories.forget` do not error when they cannot execute: they answer `200`
with `status: confirmation_required` and a `how` sentence to relay.

## Rules of the road

- **Reach is account state.** The memories a key may use are switched on the Connect page; a
  key narrowed there answers `403` on its very next call with the same token.
- **Confirm means the person agreed.** From a developer key, pass `confirm=true` only after
  the user confirmed the removal; the platform trusts the key's holder to be the account.
- **Writes are raw material.** `add` hands bytes to the container's folder; the container's
  agent reads them in its next learning turn. Poll `documents.get(id)["learned"]` if you need to know.
- **Do not store to filter later.** There are no server-side metadata filters on search; put
  what matters in the content, and use `custom_id` / `metadata` for your own bookkeeping.

## Without the SDK

`docs/openapi/agent-protocol.json` (served at `https://www.app.membase.io/plugin/openapi/agent-protocol.json`)
is the public OpenAPI document; any generator makes a typed client from it:

```bash
npx openapi-typescript https://www.app.membase.io/plugin/openapi/agent-protocol.json -o membase.d.ts
```
