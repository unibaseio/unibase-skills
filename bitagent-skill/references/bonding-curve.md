# Bonding Curve — Launch and Trade Agent Tokens (CLI)

Launchpad is **BSC only** (`-n bsc` 56 or `-n bscTestnet` 97). Curves graduate into DEX pools once they complete (PancakeSwap on BSC, Uniswap v4 on Base).

## Prerequisites

- `bitagent` installed ([SKILL.md](../SKILL.md) Setup).
- Reads (`info`, `quote`, `balance`) need no credential.
- Writes (`launch`, `buy`, `sell`) need a **wallet private key**, not a JWT: `bitagent configure --private-key "0x…"` or `UNIBASE_WALLET_PRIVATE_KEY`. Only ask for a key when the owner actually wants to trade.

## Commands

```bash
bitagent token info    <token> --json                          # curve state
bitagent token quote   <token> --side buy  --amount 0.1 --json # price it first
bitagent token quote   <token> --side sell --amount 1000 --json
bitagent token buy     <token> --amount 0.1     -y --json      # --amount = RESERVE spent (UB/USD1/WBNB)
bitagent token sell    <token> --amount 1000000 -y --json      # --amount = agent TOKENS sold
bitagent token balance <token> --json
bitagent token launch  --name "My Agent" --symbol MYAG --reserve UB -y --json
```

- Reserve tokens: `UB`, `USD1`, `WBNB`.
- `--slippage` is in hundredths of a percent (`50` = 0.5%), the contract's own scale.
- `launch` registers the project record off-chain (gets `agentHash`), then deploys the exponential curve on-chain committing to that hash — one command, returns `{token, agentHash, transactionHash, url, network, chainId}`.
- `info` returns `{token, name, symbol, creator, currentSupply, maxSupply, progress (0–1), priceForNextMint, reserveSymbol, reserveBalance, buyRoyaltyPercent, sellRoyaltyPercent, url}`.
- Without `-y` the write commands prompt interactively, which most harnesses cannot answer — pass `-y` only after the owner confirmed.

## Execution protocol

1. **Fill in missing info** — "launch a token called AI" needs a symbol and a reserve before you run anything.
2. **Quote first** — run `token quote` and show the owner the numbers.
3. **Confirm** — "Buy on BSC Testnet: spend 0.1 UB on 0xABC…, min received X. Proceed?" Then run with `-y --json`.
4. **Report** — surface `transactionHash` and the `url` from the JSON result.

## Errors

| Message | Fix |
| --- | --- |
| `This command signs on-chain transactions and needs a wallet private key.` | JWT-only credential; ask the owner for a key or stop |
| `The bonding-curve launchpad is not available on <network>.` | Add `-n bscTestnet` or `-n bsc` |
| `Could not find the creator for token 0x…` | Token is on the other BSC network; fix `-n` |
