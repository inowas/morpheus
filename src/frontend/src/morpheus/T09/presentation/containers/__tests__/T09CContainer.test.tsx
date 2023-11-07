import React from 'react';
import {render, screen} from '@testing-library/react';
import T09CContainer from '../T09CContainer';

jest.mock('../../../application', () => ({
  useCalculationsT09C: () => ({
    calculateQ: jest.fn().mockReturnValue(1),
    calculateZCrit: jest.fn().mockReturnValue(1),
    calculateZ: jest.fn().mockReturnValue(1),
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
      <T09CContainer/>,
    );
    expect(screen.getByTestId('t09c-container')).toBeInTheDocument();
  });
});
