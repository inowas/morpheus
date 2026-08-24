import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter, useLocation} from 'react-router-dom';

import PrivateRoute from '../PrivateRoute';
import useAuthentication from '../../../application/useAuthentication';

jest.mock('../../../application/useAuthentication', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseAuthentication = useAuthentication as jest.MockedFunction<typeof useAuthentication>;

function Location() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}

describe('private route behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading state while authentication is resolving', () => {
    mockUseAuthentication.mockReturnValue({isAuthenticated: false, isLoading: true} as ReturnType<typeof useAuthentication>);

    render(
      <MemoryRouter initialEntries={['/private']}>
        <PrivateRoute><div>Private content</div></PrivateRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects signed-out users away from protected content', () => {
    mockUseAuthentication.mockReturnValue({isAuthenticated: false, isLoading: false} as ReturnType<typeof useAuthentication>);

    render(
      <MemoryRouter initialEntries={['/private']}>
        <PrivateRoute><div>Private content</div></PrivateRoute>
        <Location/>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/');
  });

  it('renders protected content for signed-in users', () => {
    mockUseAuthentication.mockReturnValue({isAuthenticated: true, isLoading: false} as ReturnType<typeof useAuthentication>);

    render(
      <MemoryRouter initialEntries={['/private']}>
        <PrivateRoute><div>Private content</div></PrivateRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Private content')).toBeInTheDocument();
  });
});
