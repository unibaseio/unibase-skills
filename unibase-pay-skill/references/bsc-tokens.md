# BSC Token Addresses

Common tokens on BNB Chain (BSC) for balance queries. Use `eip155:56` as `caip2`.

## Native

- **BNB** — Use `eth_getBalance` (no contract address)

## ERC20 Tokens

| Symbol | Address |
|--------|---------|
| $U | `0xcE24439F2D9C6a2289F741120FE202248B666666` |
| $UB | `0x40b8129B786D766267A7a118cF8C07E31CDB6Fde` |
| USDC | `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d` |
| USDT | `0x55d398326f99059fF775485246999027B3197955` |

For ERC20: use `eth_call` with `balanceOf(address)` selector. Encode the wallet address as the parameter.
