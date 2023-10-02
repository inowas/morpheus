import calculateMounding from '../calculateMounding';

describe('test calculateMounding', () => {
  it('calculates correctly', () => {
    const result = calculateMounding({x: 1, y: 2, w: 3, L: 4, W: 5, hi: 6, Sy: 7, K: 8, t: 9});
    const rounded = Math.round(result * 10000) / 10000;
    const expected = 0.3245;
    expect(rounded).toBe(expected);
  });
});
