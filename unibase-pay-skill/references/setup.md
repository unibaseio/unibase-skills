# Setup Guide

First-time configuration for Unibase Pay (Privy Agent Wallet).

## Prerequisites

- `UNIBASE_PROXY_URL` set (default: `https://api.pay.unibase.com`)
- Either a private key for automated login, or access to complete interactive login

## Path A: Automated Login (Private Key Available)

1. Set `UNIBASE_AGENT_PRIVATE_KEY` in your environment
2. Sign the message `"Login to Privy Proxy"` with EIP-191 Personal Sign
3. POST to `$UNIBASE_PROXY_URL/v1/login`:
   ```json
   {"address": "<your_public_address>", "signature": "<signature>", "message": "Login to Privy Proxy"}
   ```
4. Save the returned JWT to `config.json` at project root, or set `UNIBASE_PROXY_AUTH`

## Path B: Interactive Login (No Private Key)

1. Run: `curl -X POST "$UNIBASE_PROXY_URL/v1/init" --json "true"`
2. Share the `authUrl` with the user
3. User opens link, completes login, copies "Authorized Token"
4. User pastes token in chat — save to `config.json` or `UNIBASE_PROXY_AUTH`

## Verify Configuration

```bash
curl -X GET "$UNIBASE_PROXY_URL/v1/wallets/me" \
  -H "Authorization: Bearer $UNIBASE_PROXY_AUTH"
```

Expected: `{"ethereum": "0x...", "solana": "..."}`

## Resources

- [Privy Wallet Docs](https://openos-labs.gitbook.io/unibase-docs/unibase-pay/privy-wallet)
- [config.md](config.md) — Full config reference
