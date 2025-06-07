const { TradingAgent } = require('../src/agent');

test('TradingAgent predicts after training', () => {
  const agent = new TradingAgent('SOL', 3);
  agent.prices = [10, 11, 12];
  agent.trainModel();
  const prediction = agent.predictNext();
  expect(typeof prediction).toBe('number');
});
const { Portfolio } = require('../src/simulator');

test('Portfolio buy and sell', () => {
  const p = new Portfolio(100);
  expect(p.buy('SOL', 1, 10)).toBe(true);
  expect(p.positions.SOL.amount).toBe(1);
  p.sell('SOL', 12);
  expect(p.positions.SOL).toBeUndefined();
  expect(p.usdc).toBeCloseTo(102);
});
