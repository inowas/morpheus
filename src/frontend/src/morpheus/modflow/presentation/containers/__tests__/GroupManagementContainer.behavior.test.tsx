import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';

import GroupManagementContainer from '../GroupManagementContainer';

const mockUseUsers = jest.fn();
const mockUseGroups = jest.fn();
const mockGroupManagement = {
  createGroup: jest.fn().mockResolvedValue(true),
  addGroupMembers: jest.fn().mockResolvedValue(true),
};

jest.mock('../../../incoming/useUsers', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUseUsers(...args),
}));

jest.mock('../../../application/useGroups', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUseGroups(...args),
}));

jest.mock('../../../application/useGroupManagement', () => ({
  __esModule: true,
  default: jest.fn(() => mockGroupManagement),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockUseGroups.mockReturnValue({
    groups: [
      {group_id: 'group-1', group_name: 'Hydro Team', members: [], admins: []},
    ],
    loading: false,
    error: null,
    reload: jest.fn(),
  });
  mockUseUsers.mockReturnValue({
    users: [
      {user_id: 'user-1', username: 'demo', full_name: 'Demo User'},
      {user_id: 'user-2', username: 'alice', full_name: 'Alice Example'},
    ],
    authenticatedUser: {user_id: 'admin-1', is_admin: true},
  });
});

const renderContainer = () => render(
  <MemoryRouter initialEntries={['/groups']}>
    <GroupManagementContainer/>
  </MemoryRouter>
);

describe('group management behavior', () => {
  it('creates a group for an admin', async () => {
    renderContainer();

    const input = screen.getByPlaceholderText('Group name');
    await userEvent.type(input, 'Hydro Team');

    await userEvent.click(screen.getByRole('button', {name: 'Create'}));

    expect(mockGroupManagement.createGroup).toHaveBeenCalledWith('Hydro Team');
  });

  it('lists existing groups', () => {
    renderContainer();

    expect(screen.getByText('Hydro Team')).toBeVisible();
  });

  it('redirects non-admins away', () => {
    mockUseUsers.mockReturnValue({
      users: [],
      authenticatedUser: {user_id: 'user-1', is_admin: false},
    });

    renderContainer();

    expect(screen.queryByText('Group management')).not.toBeInTheDocument();
  });
});
