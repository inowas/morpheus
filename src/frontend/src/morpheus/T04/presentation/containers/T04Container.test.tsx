import React from 'react';
import {render, screen} from '@testing-library/react';
import T04Container from './T04Container';

jest.mock('../../application', () => ({
  useNavigate: () => jest.fn(),
  useShowBreadcrumbs: () => () => true,
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
  useCSVData: () => ({
    data: [],
  }),
}));

jest.mock('react-pivottable/PivotTableUI', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="react-pivottable">Mocked Pivot Table</div>),
  };
});

describe('T04Container Tests', () => {
  test('It renders the component', async () => {
    render(<T04Container/>);
    expect(screen.getByTestId('t04-container')).toBeInTheDocument();
    expect(screen.getByTestId('react-pivottable')).toBeInTheDocument();
  });
});
