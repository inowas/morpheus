import {act, renderHook} from '@testing-library/react-hooks';
import {waitFor} from '@testing-library/react';

import useProjectList from '../useProjectList';
import useProjectCommandBus from '../useProjectCommandBus';
import useApi from '../../incoming/useApi';
import useUsers from '../../incoming/useUsers';

jest.mock('../useProjectCommandBus', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../incoming/useApi', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../incoming/useUsers', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseProjectCommandBus = useProjectCommandBus as jest.MockedFunction<typeof useProjectCommandBus>;
const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;
const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;

const projects = [
  {
    project_id: 'project-owned',
    name: 'Owned project',
    description: 'Owned by the current user',
    tags: [],
    owner_id: 'user-1',
    is_public: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    user_privileges: ['full_access'],
  },
  {
    project_id: 'project-shared',
    name: 'Shared project',
    description: 'Owned by another user',
    tags: [],
    owner_id: 'user-2',
    is_public: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    user_privileges: ['view_project'],
  },
];

describe('project list behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApi.mockReturnValue({httpGet: jest.fn().mockResolvedValue({ok: true, err: false, val: projects})} as ReturnType<typeof useApi>);
    mockUseUsers.mockReturnValue({
      authenticatedUser: {
        user_id: 'user-1',
        is_admin: false,
        email: 'user@example.com',
        username: 'user',
        full_name: 'Current User',
        keycloak_user_id: null,
        geo_node_user_id: null,
      },
      users: [],
    });
    mockUseProjectCommandBus.mockReturnValue({sendCommand: jest.fn()} as ReturnType<typeof useProjectCommandBus>);
  });

  it('loads only owned projects by default and filters them by search', async () => {
    const {result} = renderHook(() => useProjectList());

    await waitFor(() => expect(result.current.projects).toHaveLength(1));
    expect(result.current.projects[0].project_id).toBe('project-owned');

    act(() => result.current.onSearchChange('missing'));

    expect(result.current.projects).toHaveLength(0);
  });

  it('exposes loading while the project request is pending', async () => {
    let resolveRequest: (value: unknown) => void = () => undefined;
    const request = new Promise((resolve) => {
      resolveRequest = resolve;
    });
    mockUseApi.mockReturnValue({httpGet: jest.fn().mockReturnValue(request)} as ReturnType<typeof useApi>);

    const {result} = renderHook(() => useProjectList());

    expect(result.current.loading).toBe(true);

    await act(async () => resolveRequest({ok: true, err: false, val: []}));
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('returns an empty project list when the API has no projects', async () => {
    mockUseApi.mockReturnValue({httpGet: jest.fn().mockResolvedValue({ok: true, err: false, val: []})} as ReturnType<typeof useApi>);

    const {result} = renderHook(() => useProjectList());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.projects).toEqual([]);
  });

  it('exposes API errors to the screen', async () => {
    mockUseApi.mockReturnValue({
      httpGet: jest.fn().mockResolvedValue({ok: false, err: true, val: {message: 'Request failed', code: 500}}),
    } as ReturnType<typeof useApi>);

    const {result} = renderHook(() => useProjectList());

    await waitFor(() => expect(result.current.error?.message).toBe('Request failed'));
    expect(result.current.error?.code).toBe(500);
    expect(result.current.projects).toEqual([]);
  });
});
