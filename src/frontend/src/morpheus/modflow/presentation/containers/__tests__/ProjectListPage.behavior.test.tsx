import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';

import ProjectListPage from '../ProjectListPage';
import {useProjectList, useTranslate} from '../../../application';
import {useUsers} from '../../../incoming';
import {useDateTimeFormat, useLocation, useNavigate} from 'common/hooks';

jest.mock('../../../application', () => ({
  useProjectList: jest.fn(),
  useTranslate: jest.fn(),
}));

jest.mock('../../../incoming', () => ({
  useUsers: jest.fn(),
}));

jest.mock('common/hooks', () => ({
  useDateTimeFormat: jest.fn(),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../../components', () => ({
  ModflowContainer: ({children}: {children: React.ReactNode}) => <div>{children}</div>,
  ProjectsFilter: () => <div>Project filters</div>,
  SidebarContent: ({children}: {children: React.ReactNode}) => <aside>{children}</aside>,
}));

jest.mock('common/components', () => ({
  Button: ({children, content, onClick}: {children?: React.ReactNode; content?: React.ReactNode; onClick?: () => void}) => (
    <button onClick={onClick}>{children || content}</button>
  ),
  CardGrid: ({cards}: {cards: {key: string; title: string; onViewClick: () => void}[]}) => (
    <div>
      {cards.map((card) => <button key={card.key} onClick={card.onViewClick}>{card.title}</button>)}
    </div>
  ),
  ContentWrapper: ({children}: {children: React.ReactNode}) => <main>{children}</main>,
  Navbar: ({children}: {children: React.ReactNode}) => <nav>{children}</nav>,
}));

jest.mock('common/components/Error', () => ({message}: {message: string}) => <div>{message}</div>);
jest.mock('common/components/CardGrid/SortDropdown', () => () => <div>Sort projects</div>);
jest.mock('../CreateProjectContainer', () => () => null);

const mockUseProjectList = useProjectList as jest.MockedFunction<typeof useProjectList>;
const mockUseTranslate = useTranslate as jest.MockedFunction<typeof useTranslate>;
const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;
const mockUseDateTimeFormat = useDateTimeFormat as jest.MockedFunction<typeof useDateTimeFormat>;
const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;
const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

describe('project list page behavior', () => {
  it('navigates to the selected project', async () => {
    const navigate = jest.fn();
    mockUseNavigate.mockReturnValue(navigate);
    mockUseLocation.mockReturnValue({pathname: '/projects'} as ReturnType<typeof useLocation>);
    mockUseTranslate.mockReturnValue({translate: (key: string) => key} as ReturnType<typeof useTranslate>);
    mockUseDateTimeFormat.mockReturnValue({formatISODate: (value: string) => value} as ReturnType<typeof useDateTimeFormat>);
    mockUseUsers.mockReturnValue({authenticatedUser: null, users: []});
    mockUseProjectList.mockReturnValue({
      projects: [{
        project_id: 'project-1',
        name: 'Example project',
        description: 'A project',
        tags: [],
        owner_id: 'user-1',
        is_public: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        user_privileges: ['view_project'],
      }],
      error: null,
      filter: {},
      onFilterChange: jest.fn(),
      filterOptions: {} as ReturnType<typeof useProjectList>['filterOptions'],
      onSearchChange: jest.fn(),
      search: '',
      orderOptions: [],
      onOrderChange: jest.fn(),
      onDeleteClick: jest.fn(),
      order: {} as ReturnType<typeof useProjectList>['order'],
      loading: false,
    });

    render(
      <MemoryRouter>
        <ProjectListPage basePath="/projects"/>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', {name: 'Example project'}));

    expect(navigate).toHaveBeenCalledWith('/projects/project-1');
  });
});
