import {renderHook} from '@testing-library/react-hooks';
import useReleaseVersion from '../useReleaseVersion';

jest.mock('config', () => ({
  release: 'test-123',
  releaseDate: '123-dev',
}));

describe('test useReleaseVersion Hook', () => {
  it('render Hook', () => {
    const {result} = renderHook(() => useReleaseVersion());
    expect(result.current.release).toBe('test-123');
    expect(result.current.releaseDate).toBe('123-dev');
  });
});
