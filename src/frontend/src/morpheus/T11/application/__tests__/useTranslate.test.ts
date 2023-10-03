import {renderHook} from '@testing-library/react-hooks';
import useTranslate from '../useTranslate';

jest.mock('common/hooks', () => ({
  useTranslation: () => ({
    translate: (key: string) => key.toUpperCase(),
    language: 'en',
  }),
}));

describe('test custom Hook', () => {
  it('render Hook', () => {
    const {result} = renderHook(() => useTranslate());
    expect(result.current.translate('abc')).toBe('ABC');
    expect(result.current.language).toBe('en');
  });
});
