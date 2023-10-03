import {erfc} from '../index';

describe('erfc', () => {
  it('calculates the value correctly', () => {
    const values = [
      [0.32174819950348343, 0.649094415807638],
      [-1.4927399793362868, 1.965232376471675],
      [3.7329859757222503, 1.299868493953582e-7],
      [10.202283237767181, 0],
    ];

    values.forEach(v => {
      const x = v[0];
      const expected = v[1];

      const result = erfc(x);
      expect(result).toEqual(expected);
    });
  });
});

