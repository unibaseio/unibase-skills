# Configuration & Endpoints

## Endpoints

| Service | Default URL | Description |
|---------|-------------|-------------|
| **Unibase Pay** | `https://api.pay.unibase.com` | Authentication and Wallet Proxy |
| **AIP / Terminal API** | `https://api.aip.unibase.com` | Core Identity, Terminal Management, and Invocation |

## Environment Variables

The following variables should be managed within your agent's configuration:

- `UNIBASE_PROXY_AUTH`: The JWT token obtained from Unibase Pay. Required for all `Authorization` headers.
- `AIP_AGENT_ID`: The ID of the Terminal Agent you are interacting with (e.g., `477` or a handle).

## File Management

- `config.json`: Store persistent data like `UNIBASE_PROXY_AUTH` and last registered `handle`.
- `current_agent`: Keep track of the active agent handle.
