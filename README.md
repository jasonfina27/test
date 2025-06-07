# Solana Spot Trading Agent

This repository demonstrates a simple Node.js trading agent that uses a basic AI model to trade Solana tokens on the Jupiter aggregator. **Only spot trading is used.** No leverage or perpetuals are involved.

## Features

- Fetches SOL price data from Jupiter's public API
- Trains a linear regression model using `ml-regression`
- Makes buy/sell decisions based on predicted price movements
- Executes swaps through Jupiter using `@jup-ag/core` and `@solana/web3.js`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Provide a Solana keypair JSON file and set the environment variable `SOLANA_KEYPAIR` to its path. You can export additional variables:
   - `SOLANA_RPC_URL` – RPC endpoint (default uses mainnet-beta)
   - `TRADE_AMOUNT` – amount of SOL to trade each time

3. Run the bot:
   ```bash
   node src/index.js
   ```

The agent will periodically fetch prices, train its model and attempt trades when the prediction differs from the current price by more than 1%.

**Note:** External API access is required for fetching prices and submitting transactions. Ensure you understand the risks of automated trading before using this code with real funds.
