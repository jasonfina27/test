# Solana Spot Trading Agent

This repository demonstrates a simple Node.js trading agent that uses a basic AI model to identify opportunities on Solana tokens. The current code simulates trades against live prices fetched from Jupiter but **does not place real orders**. Only spot prices are considered and there is no leverage.

## Features

- Fetches token prices from Jupiter's public API
- Trains a linear regression model using `ml-regression`
- Makes simulated buy/sell decisions based on predicted price movements
- Tracks a portfolio in memory to demonstrate results

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the simulation:
   ```bash
   node src/index.js
   ```

The agent periodically fetches prices, trains models for a few popular tokens and prints simulated buy/sell events when the prediction differs from the current price by more than 1%.

**Note:** This project performs only a paper-trading simulation. It does not interact with wallets or send transactions.
