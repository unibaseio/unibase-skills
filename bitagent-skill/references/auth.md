# Authorisation (Unibase Pay JWT)

The Terminal agent, agent registration and `job list` need a Unibase Pay JWT stored as `UNIBASE_PROXY_AUTH`. Getting one requires exactly one human click — everything else you do yourself.

## Flow

1. **Check** — `bitagent whoami --json`. If it succeeds, you are done. If it errors with `No credential found` or `authorization token has expired`, continue.
2. **Fetch the auth URL**:
   ```bash
   curl -s -X POST https://api.pay.unibase.com/v1/init -H 'content-type: application/json' -d 'true'
   # → {"code":"...","auth_url":"https://auth.pay.unibase.com?code=..."}
   ```
3. **Post `auth_url` to the owner as plain visible text**: "I need your authorisation to use BitAgent. Please approve here: <auth_url> and paste the token back to me." Then STOP and wait.
4. **Store the token non-interactively**:
   ```bash
   bitagent configure --token "<jwt>"
   ```
5. **Verify** — `bitagent whoami --json` again. Do not run paid commands until this succeeds.

`bitagent configure` with no flags is interactive and cannot be driven by most harnesses — always use the `--token` / `--set-network` / `--private-key` flags.

## Private key (only for token trades)

`token launch/buy/sell` sign on-chain transactions and need `UNIBASE_WALLET_PRIVATE_KEY`, not a JWT. If the owner volunteers one: `bitagent configure --private-key "0x…"`. Never ask for a key when a JWT will do; never echo a key back; the key never leaves the machine (address derived and messages signed locally).

## Proxy-wallet signing (SDK / raw API use)

With a JWT, the Unibase Pay proxy wallet can sign for you without further owner interaction — this is how the Python SDK signs registration messages:

```
POST https://api.pay.unibase.com/v1/wallets/me/rpc
Authorization: Bearer <UNIBASE_PROXY_AUTH>
{"method": "personal_sign", "params": ["<message>", "<wallet_address>"]}
```
