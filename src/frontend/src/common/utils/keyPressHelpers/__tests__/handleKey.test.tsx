import { fireEvent, render, screen } from '@testing-library/react';

import React from 'react';
import handleKey from '../handleKey';

describe('handleKey()', () => {
  it('returns function', () => {
    const handlerFunc = jest.fn();
    const listeners = {
      Enter: handlerFunc,
    };
    const result = handleKey(listeners, false);

    expect(result).toBeInstanceOf(Function);
  });

  it('calls handler function on event', () => {
    const handlerFunc = jest.fn();
    const listeners = {
      Enter: handlerFunc,
    };
    const result = handleKey(listeners, true);

    render(<input onKeyDown={result} data-testid="testDiv" />);
    const testDiv = screen.getByTestId('testDiv');

    fireEvent.keyDown(testDiv, { key: 'Enter' });

    expect(handlerFunc).toBeCalledTimes(1);
  });

  it('return if eventHandler returns false', () => {
    const handlerFunc = jest.fn();
    handlerFunc.mockReturnValue(false);
    const listeners = {
      Enter: handlerFunc,
    };

    const result = handleKey(listeners, false);

    render(<input onKeyDown={result} data-testid="testDiv" />);
    const testDiv = screen.getByTestId('testDiv');

    fireEvent.keyDown(testDiv, { key: 'Enter' });

    expect(handlerFunc).toBeCalledTimes(1);
  });
});

