import numericallyIntegrate from '../numericallyIntegrate';

describe('Given the numericallyIntegrate-function', () => {
  const f = (x: number) => {
    return Math.pow(x, 3) - 2 * Math.pow(x, 2) + 2;
  };

  const values = [
    [-1.5, -1, 0.0001, 3, -1.599],
    [-1, 0, 0.0001, 3, 1.083],
    [-0.8, 0, 0.0001, 3, 1.156],
    [0, 1, 0.001, 3, 1.582],
    [0, 5, 0.0001, 1, 82.9],
  ];

  values.forEach( v => {
    const a = v[0];
    const b = v[1];
    const dx = v[2];
    const decimals = v[3];
    const expected = v[4].toFixed(decimals);

    it('calculating with a=' + a + ', b=' + b + ', dx=' + dx + ', should return ' + expected, () => {
      expect(numericallyIntegrate({a, b, dx, f}).toFixed(decimals)).toBe(expected);
    });
  });
});
