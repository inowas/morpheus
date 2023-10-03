import {renderHook} from '@testing-library/react-hooks';
import useTranslate from '../useTranslate';

<<<<<<<< HEAD:src/frontend/src/morpheus/T11/application/__tests__/useTranslate.test.ts
jest.mock('common/hooks', () => ({
========
jest.mock('morpheus/common/hooks', () => ({
>>>>>>>> origin/main:src/frontend/src/morpheus/T04/application/__tests__/useTranslate.test.ts
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
