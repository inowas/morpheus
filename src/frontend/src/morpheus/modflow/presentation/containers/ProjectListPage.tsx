import {Button, CardGrid, ContentWrapper, ICard, Navbar, INavbarItem} from 'common/components';
import React, {useMemo, useState} from 'react';
import {useLocation, useNavigate} from 'common/hooks';
import {ModflowContainer, ProjectsFilter, SidebarContent} from '../components';
import {useProjectList, useTranslate} from '../../application';
import Error from 'common/components/Error';
import CreateProjectContainer from './CreateProjectContainer';
import SortDropdown from 'common/components/CardGrid/SortDropdown';
import {useUsers} from '../../incoming';
import {useDateTimeFormat} from 'common/hooks';

interface IProps {
  basePath: string;
}

const getProjectListNavbarItems = (translate: (key: string) => string): INavbarItem[] => ([
  {
    name: 'home',
    label: translate('home'),
    admin: false,
    to: '/',
  },
  {
    name: 'filter',
    label: translate('filter'),
    admin: false,
    to: '#filter',
  },
  {
    name: 'documentation',
    label: translate('documentation'),
    admin: false,
    to: '/documentation',
  },
]);

const ProjectListPage = ({basePath}: IProps) => {

  const navigateTo = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const {projects, error, filter, onFilterChange, filterOptions, onSearchChange, search, orderOptions, onOrderChange, onDeleteClick} = useProjectList();
  const [showCreateProjectModel, setShowCreateProjectModel] = useState<boolean>(false);
  const {users} = useUsers();

  const {formatISODate} = useDateTimeFormat();


  const cards: ICard[] = useMemo(() => {
    return projects.map((project) => {
      const canBeDeleted = project.user_privileges.includes('full_access');

      return {
        key: project.project_id,
        title: project.name,
        description: project.description,
        author: users.find((user) => user.user_id === project.owner_id)?.full_name || '',
        image: project.image,
        date_time: formatISODate(project.created_at),
        onViewClick: () => navigateTo(`${basePath}/${project.project_id}`),
        onDeleteClick: canBeDeleted ? () => onDeleteClick(project.project_id) : undefined,
        // onCopyClick: canBeCopied ? () => console.log('Copy project') : undefined,
        status: 'green',
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, users]);

  if (error) {
    return <Error message={error.message}/>;
  }

  return (
    <>
      <Navbar
        location={location}
        navbarItems={getProjectListNavbarItems(translate)}
        navigateTo={navigateTo}
        search={{
          value: search,
          onChange: onSearchChange,
        }}
        button={
          <Button
            style={{whiteSpace: 'nowrap'}}
            primary={true}
            onClick={() => setShowCreateProjectModel(true)}
          >
            Create new project
          </Button>}
      />
      <ModflowContainer>
        <SidebarContent maxWidth={400}>
          <ProjectsFilter
            filterParams={filter}
            filterOptions={filterOptions}
            onChangeFilterParams={onFilterChange}
          />
        </SidebarContent>
        <ContentWrapper style={{position: 'relative'}}>
          <SortDropdown
            placeholder="Order By"
            sortOptions={orderOptions}
            onChangeSortOption={onOrderChange}
            style={{
              position: 'absolute',
              top: 20,
              right: 50,
              zIndex: 10,
            }}
          />
          <CardGrid
            cards={cards}
            title={<><span>{projects.length}</span> {translate('Projects found')}</>}
          />
        </ContentWrapper>
      </ModflowContainer>

      <CreateProjectContainer open={showCreateProjectModel} onClose={() => setShowCreateProjectModel(false)}/>
    </>
  );
};

export default ProjectListPage;
