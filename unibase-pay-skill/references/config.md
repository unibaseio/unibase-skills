# Configuration

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `UNIBASE_PROXY_URL` | Yes | Privy Proxy API base (default: `https://api.pay.unibase.com`) |
| `UNIBASE_PROXY_AUTH` | No* | JWT token for API auth |
| `UNIBASE_AGENT_PRIVATE_KEY` | No* | For automated login (Path A) |

*Either `UNIBASE_PROXY_AUTH` (existing token) or `UNIBASE_AGENT_PRIVATE_KEY` (to obtain token) is required.

## Token Storage

**Priority**: `UNIBASE_PROXY_AUTH` env var > `config.json`

**config.json** (when not using env):
- **Location**: Project root (where the agent runs)
- **Format**: `{"token": "<jwt>"}` or `{"UNIBASE_PROXY_AUTH": "<jwt>"}`

## Platform Aliases

- **OpenClaw**: `PRIVY_PROXY_URL` = `UNIBASE_PROXY_URL`
