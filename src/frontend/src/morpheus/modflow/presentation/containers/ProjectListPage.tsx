import {Button, CardGrid, ContentWrapper, ICard, Navbar} from 'common/components';
import React, {useMemo, useState} from 'react';
import {useLocation, useNavigate} from 'common/hooks';
import {ModflowContainer, ProjectsFilter, SidebarContent} from '../components';
import {useProjectList, useTranslate} from '../../application';
import Loading from 'common/components/Loading';
import Error from 'common/components/Error';
import {useNavbarItems} from '../../../application/application';
import CreateProjectContainer from './CreateProjectContainer';
import SortDropdown from 'common/components/CardGrid/SortDropdown';
import {format} from 'date-fns';

interface IProps {
  basePath: string;
}

const ProjectListPage = ({basePath}: IProps) => {

  const navigateTo = useNavigate();
  const location = useLocation();
  const {navbarItems} = useNavbarItems();
  const {translate} = useTranslate();
  const {projects, loading, error, filter, onFilterChange, filterOptions, onSearchChange, search, orderOptions, onOrderChange} = useProjectList();
  const [showCreateProjectModel, setShowCreateProjectModel] = useState<boolean>(false);

  const cards = useMemo(() => {
    return projects.map((project) => {
      return {
        key: project.project_id,
        title: project.name,
        description: project.description,
        image: project.image,
        status: 'green',
        date_time: format(new Date(project.created_at), 'dd.MM.yyyy'),
        onViewClick: () => navigateTo(`${basePath}/${project.project_id}`),
        onDeleteClick: () => console.log('Delete', project.project_id),
        onCopyClick: () => console.log('Copy', project.project_id),
      } as ICard;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  return (
    <>
      <Navbar
        location={location}
        navbarItems={navbarItems}
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
