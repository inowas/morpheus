import React from 'react';
import {render, screen} from '@testing-library/react';
import T04Container from './T04Container';

jest.mock('../../application', () => ({
  useNavigate: () => jest.fn(),
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

jest.mock('./T04Container', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="t04-container">Mocked T04Container</div>),
  };
});

describe('T04Container Tests', () => {
  test('It renders the component', async () => {
    render(<T04Container/>);

    expect(screen.getByTestId('t04-container')).toBeInTheDocument();
  });
});
