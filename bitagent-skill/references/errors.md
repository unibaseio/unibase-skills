# Errors and Fixes

Failures exit non-zero and print `✖ <message>` plus an optional hint to stderr. `BITAGENT_DEBUG=1` adds a stack trace.

## CLI

| Message | Cause | Fix |
| --- | --- | --- |
| `No credential found.` | Nothing in env or config | [auth.md](auth.md) flow |
| `Your Unibase Pay authorization token has expired.` | JWT `exp` passed | Re-authorise; relay a fresh `auth_url` |
| `This command signs on-chain transactions and needs a wallet private key.` | JWT-only credential on a `token` write | Ask the owner for a key, or stop |
| `The Terminal agent needs a Unibase Pay JWT — a private key alone is not enough.` | key-only credential on `terminal` | Authorise with a JWT |
| `No Terminal agent on <network>.` | Not activated on this chain | `bitagent terminal activate --json` |
| `The bonding-curve launchpad is not available on <network>.` | `token` command off BSC | `-n bscTestnet` or `-n bsc` |
| `Could not find the creator for token 0x…` | Wrong network for that token | Correct `-n` |
| `Cannot reach <url>` | Egress blocked | Allowlist hosts in [config.md](config.md) |
| `EEXIST: file already exists` on install | Old unscoped `bitagent-cli` pre-release owns the binary | `npm uninstall -g bitagent-cli` then reinstall |
| `bitagent: command not found` after `npm install -g github:…` | npm git-dep preparation bug | Install `@unibaseio/bitagent-cli` from npm instead |

## Provider bidding (HTTP status)

| Status | Meaning |
| --- | --- |
| `401` | Signature doesn't match `provider_addr` |
| `400` | Bid over `max_budget` or malformed amount |
| `410` | Bidding deadline passed |
| `409` | Round not open |
| revert `Unauthorized` | You are not the assigned provider for `core.submit` |
| revert `WrongStatus` | Job not funded yet — wait for `status == "funded"` |

## Self-run agents (Python SDK)

| Symptom | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` at registration | Invalid/expired `UNIBASE_PROXY_AUTH` | Re-run [auth.md](auth.md) |
| `409 Conflict` at registration | Handle owned by another wallet | Pick a new handle |
| Registered but never polls | Missing `via_gateway=True` / `job_offerings`, or no credential resolved | Check `expose_as_a2a()` args; see [scaffold-agent.md](scaffold-agent.md) |
| `ValueError: Invalid JSON-RPC version` / `ValidationError: messageId|parts required` | Hand-built A2A request | [stability.md](stability.md) §1 |
| `TypeError: 'coroutine' object …` | Unawaited call in handler | Fix the await |
