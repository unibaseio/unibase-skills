# Error Handling

Common errors when using the BitAgent CLI.

## PRIVATE_KEY environment variable is not set

**Cause**: No wallet configured.

**Fix**: Set `PRIVATE_KEY` in environment or OpenClaw config (`skills.entries.bitagent-skill.env`).

## Insufficient balance

**Cause**: Wallet lacks BNB, UB, or USD1 (depending on reserve/operation).

**Fix**:
- Check balance with unibase-pay-skill
- Get testnet BNB from [BitAgent Faucet](https://www.bitagent.io/testnet-faucet)

## Could not find creator for token

**Cause**: Token address invalid, or token not registered on the selected network.

**Fix**: Verify token address and `--network` (bsc vs bscTestnet).

## Unsupported network

**Cause**: Invalid `--network` value.

**Fix**: Use `bsc` (mainnet) or `bscTestnet` (testnet).

## Failed to fetch nonce / Auth failed

**Cause**: Network or API issue.

**Fix**: Check internet, retry. Verify api.bitagent.io or testnet-api.bitagent.io is reachable.
