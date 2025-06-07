const fetch = require('node-fetch');
const { SLR } = require('ml-regression');

async function fetchPrice(symbol) {
  const url = `https://price.jup.ag/v4/price?ids=${symbol}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch price: ${resp.status}`);
  const json = await resp.json();
  return json.data[symbol].price;
}

class TradingAgent {
  constructor(symbol, window = 10) {
    this.symbol = symbol;
    this.window = window;
    this.prices = [];
  }

  async updatePrice() {
    const price = await fetchPrice(this.symbol);
    this.prices.push(price);
    if (this.prices.length > this.window) this.prices.shift();
    return price;
  }

  trainModel() {
    if (this.prices.length < this.window) return null;
    const xs = Array.from({ length: this.prices.length }, (_, i) => i);
    const ys = this.prices;
    this.model = new SLR(xs, ys);
    return this.model;
  }

  predictNext() {
    if (!this.model) return null;
    const nextX = this.prices.length;
    return this.model.predict(nextX);
  }
}

module.exports = { fetchPrice, TradingAgent };
