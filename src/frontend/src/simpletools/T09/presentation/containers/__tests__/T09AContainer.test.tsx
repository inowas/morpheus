import {render, screen} from '@testing-library/react';

import React from 'react';
import T09AContainer from '../T09AContainer';

jest.mock('../../../application', () => ({
  useCalculationsT09A: () => ({
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
      <T09AContainer/>,
    );
    expect(screen.getByTestId('t09a-container')).toBeInTheDocument();
  });

});
