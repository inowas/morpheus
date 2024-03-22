import {renderHook} from '@testing-library/react-hooks';
import useCalculateMounding from '../useCalculateMounding';

jest.mock('../../infrastructure', () => ({
  calculateMounding: jest.fn().mockReturnValue(2),
}));

describe('test custom Hook', () => {
  it('render Hook', () => {
    const {result} = renderHook(() => useCalculateMounding());
    expect(result.current.calculateHi(1, 2, 3, 4, 5, 6, 7, 8, 9)).toBe(2);
    expect(result.current.calculateHMax(1, 2, 3, 4, 5, 6, 7)).toBe(6);
  });
});


