import {renderHook} from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import {useEventListener} from '../useEventListener';

describe('useEventListener()', () => {
  it('add event listener to element and calls it', async () => {
    const listenFunc = jest.fn();
    const customEvent = 'click';
    renderHook(() => useEventListener<void>(customEvent, listenFunc, document.body));
    await userEvent.click(document.body);
    expect(listenFunc).toBeCalledTimes(1);
  });

  it('add nothing if no event', async () => {
    const listenFunc = jest.fn();
    const wrongEvent = 'onclick';
    renderHook(() => useEventListener<void>(wrongEvent, listenFunc, document.body));
    await userEvent.click(document.body);
    expect(listenFunc).toBeCalledTimes(0);
  });

  it('add nothing if no element', () => {
    const listenFunc = jest.fn();
    const customEvent = 'click';
    const {result} = renderHook(() => useEventListener<void>(customEvent, listenFunc, null));
    expect(result.current).toEqual(undefined);
  });
});

