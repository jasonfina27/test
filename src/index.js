const fs = require('fs');
const { Keypair, Connection, PublicKey, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { Jupiter } = require('@jup-ag/core');
const { TradingAgent } = require('./agent');
const config = require('./config');

function loadKeypair(path) {
  const data = JSON.parse(fs.readFileSync(path));
  return Keypair.fromSecretKey(new Uint8Array(data));
}

async function createJupiter(connection, wallet) {
  const jup = await Jupiter.load({
    connection,
    cluster: 'mainnet-beta',
    user: wallet,
  });
  return jup;
}

async function trade(jup, wallet, fromMint, toMint, amount) {
  const { execute } = await jup.swapRoutes({
    inputMint: fromMint,
    outputMint: toMint,
    amount,
    slippageBps: 50,
  });
  const txs = await execute();
  for (const tx of txs) {
    const signature = await sendAndConfirmTransaction(jup.connection, tx.transaction, [wallet]);
    console.log('Trade confirmed:', signature);
  }
}

async function main() {
  const connection = new Connection(config.rpcUrl);
  const wallet = loadKeypair(config.keypairPath);
  const jup = await createJupiter(connection, wallet);
  const agent = new TradingAgent(config.buyToken);

  while (true) {
    try {
      const price = await agent.updatePrice();
      agent.trainModel();
      const prediction = agent.predictNext();
      console.log(`Current: ${price}, Predicted: ${prediction}`);

      if (prediction && prediction > price * 1.01) {
        console.log('Buying', config.buyToken);
        await trade(jup, wallet, new PublicKey(jup.tokenList.tokenMap.get(config.sellToken).address), new PublicKey(jup.tokenList.tokenMap.get(config.buyToken).address), config.tradeAmount * 10 ** 6);
      } else if (prediction && prediction < price * 0.99) {
        console.log('Selling', config.buyToken);
        await trade(jup, wallet, new PublicKey(jup.tokenList.tokenMap.get(config.buyToken).address), new PublicKey(jup.tokenList.tokenMap.get(config.sellToken).address), config.tradeAmount * 10 ** 9);
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
    await new Promise(r => setTimeout(r, 60000));
  }
}

main().catch(err => {
  console.error(err);
});
