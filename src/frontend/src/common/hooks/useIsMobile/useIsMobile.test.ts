import {act, renderHook} from '@testing-library/react-hooks';

import useIsMobile from './useIsMobile';

describe('test useIsMobile', () => {

  it('should be defined', () => {
    expect(useIsMobile).toBeDefined();
  });

  it('should return current window dimensions', () => {
    const {result} = renderHook(() => useIsMobile());
    expect(typeof result.current).toBe('object');
    expect(typeof result.current.isMobile).toBe('boolean');
  });

  const triggerResize = (value: number) => {
    (window.innerWidth as number) = value;
    window.dispatchEvent(new Event('resize'));
  };

  it('should return isMobile:true if window width is less or equal than 1140px', () => {
    act(() => {
      triggerResize(1140);
    });

    const {result} = renderHook(() => useIsMobile());
    expect(result.current.isMobile).toBe(true);
  });

  it('should return isMobile:false if window width is greater or equal than 769px', () => {
    act(() => {
      triggerResize(1140);
    });

    const {result} = renderHook(() => useIsMobile());
    expect(result.current.isMobile).toBe(true);
  });
});
