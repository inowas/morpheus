import {act, renderHook} from '@testing-library/react-hooks';
import useAlert from '../useAlerts';
import {IAlert} from '../../Alert.type';

describe('test custom Hook', () => {

  const alert: IAlert = {
    uuid: '9jjhsh',
    type: 'success',
    messages: ['success'],
    delayMs: 300,
  };
  
  it('render Hook', () => {
    const {result} = renderHook(() => useAlert());
    expect(result.current.alerts).toEqual([]);
    act(() => {
      result.current.addAlert(alert);
    });
    expect(result.current.alerts).toEqual([alert]);
    act(() => {
      result.current.clearAlert(alert.uuid);
    });
    expect(result.current.alerts).toEqual([]);
    act(() => {
      result.current.addAlert(alert);
    });
    expect(result.current.alerts).toEqual([alert]);
    act(() => {
      result.current.clearAllAlerts();
    });
    expect(result.current.alerts).toEqual([]);
  });


});
