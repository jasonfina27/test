module.exports = {
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  keypairPath: process.env.SOLANA_KEYPAIR || './keypair.json',
  buyToken: 'SOL',
  sellToken: 'USDC',
  tradeAmount: parseFloat(process.env.TRADE_AMOUNT || '0.1'),
};
