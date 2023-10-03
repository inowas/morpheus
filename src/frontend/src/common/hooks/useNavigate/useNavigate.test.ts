import {renderHook} from '@testing-library/react-hooks';
import useNavigate from './useNavigate';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('test useNavigate Hook', () => {
  it('render Hook', () => {
    const {result} = renderHook(() => useNavigate());
    expect(result.current).toBe(mockNavigate);
    result.current('/test', {replace: true});
    expect(mockNavigate).toBeCalledWith('/test', {replace: true});
  });
});
