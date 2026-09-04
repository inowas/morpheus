import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, useLocation} from 'react-router-dom';

import HomePage from '../Home';
import {useAuthentication} from '../../../incoming';

jest.mock('../../../incoming', () => ({
  useAuthentication: jest.fn(),
}));

const mockUseAuthentication = useAuthentication as jest.MockedFunction<typeof useAuthentication>;

function Location() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}

describe('home page behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows login and starts authentication for signed-out users', async () => {
    const login = jest.fn();
    mockUseAuthentication.mockReturnValue({isAuthenticated: false, login, logout: jest.fn()});

    render(
      <MemoryRouter>
        <HomePage/>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', {name: 'Login'}));

    expect(screen.getByRole('heading', {name: 'Welcome to the INOWAS platform'})).toBeInTheDocument();
    expect(login).toHaveBeenCalledTimes(1);
  });

  it('redirects signed-in users to the project list', () => {
    mockUseAuthentication.mockReturnValue({isAuthenticated: true, login: jest.fn(), logout: jest.fn()});

    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage/>
        <Location/>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('location')).toHaveTextContent('/projects');
  });
});
