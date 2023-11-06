import React from 'react';
import {render, screen} from '@testing-library/react';
import T11 from './T11Container';

jest.mock('../../application', () => ({
  useNavigate: () => () => {
    return;
  },
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

describe('T11Container Tests', () => {
  test('It renders the component', async () => {
    render(
      <T11/>,
    );

    expect(screen.getByTestId('T11-container')).toBeInTheDocument();
  });
});
