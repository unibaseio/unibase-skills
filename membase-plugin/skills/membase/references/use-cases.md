# Use cases

Four shapes that come up, each on the user's own memory. In every one the credential is the
user's — a developer key they minted, or the consent they gave an app — never an
application-wide key.

## 1. A coding assistant that knows the project

Claude Code, Cursor or Codex connected over MCP (consent) to a *container* the user keeps for
the project: the design notes folder, decision logs, meeting transcripts.

- On a question about past decisions the model calls `search_memories` with the question and
  cites the container it drew on.
- When the user says "remember that we settled on Postgres" the model calls `add_memory` — only
  if the connection is a developer key at Read & write; a consent-minted connection cannot
  write, and the model should say so and point at the app.

## 2. A personal assistant with a profile

A server-side assistant the user runs (Telegram bot, a web app) with a **Read & write** key
and the profile tick.

```
start of a conversation:   get_profile()                       → system prompt: static + dynamic
each user turn:            search_memories(q)                  → context passages
end of a conversation:     add_memory(fact, static=…) per fact the user stated
                           add_document(container, transcript, custom_id=conversation_id)
```

`static=true` is reserved for standing facts about the user (name, role, lasting preferences);
everything else is a note in a container. The transcript is one document; the container's next
learning turn extracts what is durable.

## 3. A research pipeline that feeds a container

A cron job with a **Read & write** key over one container, *Reading notes*:

```bash
for url in $(cat today.txt); do
  curl -s "$BASE/v1/documents" -H "Authorization: Bearer $MEMBASE_API_KEY" \
    -H 'content-type: application/json' \
    -d "{\"container\":\"$CONTAINER\",\"url\":\"$url\",\"custom_id\":\"$(echo -n "$url" | sha1sum | cut -c1-16)\"}"
done
```

`url` is fetched by the platform as raw bytes and landed in the container's upload folder; the
`custom_id` makes a rerun a no-op. The user sees the pages under the Memory's sources and the
learned facts on its page.

## 4. Support on the user's own history

A support agent the user talks to, holding a **Read** key over the *Orders* container and the
profile tick: `get_profile(q=ticket_subject)` at the start gives who they are and the relevant
passages in one call; `search_memories` answers follow-ups; nothing is written back — the user
decides what their memory keeps.

## Anti-patterns

- **One key for all your users.** A key is one person's; a container is a topic, not a tenant.
- **Deleting on the model's judgement.** `delete_document` / `forget_memory` without the person's
  confirmation — not granted to consent-minted clients at all, and a developer key should
  pass `confirm=true` only after asking.
- **Storing the model's own conclusions as facts.** `add_memory` takes what the user said.
- **Filtering server-side.** There are no metadata filters on search; ask a better question, or
  narrow to a container.
