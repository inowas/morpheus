import {renderHook} from '@testing-library/react-hooks';
import usePageTitle from './usePageTitle';

describe('test custom Hook', () => {
  it('render Hook', () => {
    document.title = 'before_running_hook';
    expect(document.title).toBe('before_running_hook');
    renderHook(() => usePageTitle('after_running_hook'));
    expect(document.title).toBe('after_running_hook');
  });
});
