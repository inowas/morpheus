import {render, screen} from '@testing-library/react';

import React from 'react';
import T09BContainer from '../T09BContainer';

jest.mock('../../../application', () => ({
  useCalculationsT09B: () => ({
    range: jest.fn().mockReturnValue(1),
    calculateZofX: jest.fn().mockReturnValue(1),
    calculateZ: jest.fn().mockReturnValue(1),
    calculateL: jest.fn().mockReturnValue(1),
    calculateXT: jest.fn().mockReturnValue(1),
    calculateDiagramData: jest.fn().mockReturnValue(1),
  }),
  useNavigate: () => () => {
    return;
  },
  useShowBreadcrumbs: () => () => true,
  useTranslate: () => ({
    i18n: {
      changeLanguage: () => {
      },
    },
    translate: (key: string) => key,
    language: 'en',
  }),
}));

describe('Container Tests', () => {
  test('It renders the component', async () => {
    render(
      <T09BContainer/>,
    );
    expect(screen.getByTestId('t09b-container')).toBeInTheDocument();
  });
});
