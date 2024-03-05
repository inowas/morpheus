import React from 'react';
import {render, screen, within} from '@testing-library/react';
import T06Container from './T06Container';
import {act} from '@testing-library/react-hooks';

jest.mock('../../application', () => ({
  useNavigate: () => jest.fn(),
  useShowBreadcrumbs: () => () => true,
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

describe('T06Container Tests', () => {
  test('It renders the component', async () => {
    render(
      <T06Container/>,
    );

    expect(screen.getByTestId('T06-container')).toBeInTheDocument();
  });

  test('It changes conditions', async () => {
    render(
      <T06Container/>,
    );

    expect(screen.getByTestId('T06-container')).toBeInTheDocument();
    expect(screen.getByTestId('Ponds')).toBeInTheDocument();
    expect(screen.getByTestId('Flooding')).toBeInTheDocument();
    expect(screen.getByTestId('Ditches')).toBeInTheDocument();
    expect(screen.getByTestId('SS Dam')).toBeInTheDocument();
    expect(screen.getByTestId('RD')).toBeInTheDocument();
    expect(screen.getByTestId('EI')).toBeInTheDocument();
    expect(screen.getByTestId('IBF')).toBeInTheDocument();
    expect(screen.getByTestId('CS')).toBeInTheDocument();


    const checkbox = within(screen.getByTestId('Land Use_Residential')).getByRole('checkbox') as HTMLInputElement;
    act(() => {
      checkbox.click();
    });

    expect(screen.getByTestId('T06-container')).toBeInTheDocument();
    expect(screen.queryByTestId('Ponds')).not.toBeInTheDocument();
    expect(screen.queryByTestId('Flooding')).not.toBeInTheDocument();
    expect(screen.queryByTestId('Ditches')).not.toBeInTheDocument();
    expect(screen.queryByTestId('SS Dam')).not.toBeInTheDocument();
    expect(screen.queryByTestId('RD')).not.toBeInTheDocument();
    expect(screen.queryByTestId('EI')).not.toBeInTheDocument();
    expect(screen.getByTestId('IBF')).toBeInTheDocument();
    expect(screen.queryByTestId('CS')).not.toBeInTheDocument();
  });
});
