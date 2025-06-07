const { fetchPrice, TradingAgent } = require('./agent');

class Portfolio {
  constructor(initialUSDC = 1000) {
    this.usdc = initialUSDC; // start with some USDC
    this.positions = {}; // symbol -> {amount, entry}
  }

  buy(symbol, amount, price) {
    const cost = amount * price;
    if (this.usdc < cost) return false;
    this.usdc -= cost;
    if (!this.positions[symbol]) {
      this.positions[symbol] = { amount: 0, entry: price };
    }
    this.positions[symbol].amount += amount;
    this.positions[symbol].entry = price; // update entry for simplicity
    return true;
  }

  sell(symbol, price) {
    const pos = this.positions[symbol];
    if (!pos) return false;
    const proceeds = pos.amount * price;
    this.usdc += proceeds;
    delete this.positions[symbol];
    return true;
  }
}

async function fetchTokenList() {
  const resp = await fetch('https://token.jup.ag/all');
  if (!resp.ok) throw new Error('failed token list');
  const data = await resp.json();
  return data.slice(0, 5).map(t => t.symbol).filter(s => s !== 'USDC');
}

async function runSimulation() {
  const symbols = await fetchTokenList();
  const agents = new Map(symbols.map(s => [s, new TradingAgent(s)]));
  const portfolio = new Portfolio();

  for (let step = 0; step < 20; step++) {
    for (const [sym, agent] of agents) {
      try {
        const price = await agent.updatePrice();
        agent.trainModel();
        const pred = agent.predictNext();
        const position = portfolio.positions[sym];
        if (!position && pred && pred > price * 1.01) {
          const amount = 1; // buy 1 token for simplicity
          if (portfolio.buy(sym, amount, price)) {
            console.log(`Sim BUY ${sym} at ${price.toFixed(2)}`);
          }
        } else if (position && pred && pred < price * 0.99) {
          portfolio.sell(sym, price);
          console.log(`Sim SELL ${sym} at ${price.toFixed(2)}`);
        }
      } catch (e) {
        console.error('update error', e.message);
      }
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('Final USDC balance', portfolio.usdc.toFixed(2));
}

if (require.main === module) {
  runSimulation().catch(err => console.error(err));
}

module.exports = { Portfolio, runSimulation };
