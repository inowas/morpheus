import {Button, CardGrid, ContentWrapper, ICard, ISortOption, Navbar} from 'common/components';
import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'common/hooks';
import {ModflowContainer, ProjectsFilter, SidebarContent} from '../components';
import {useProjectList, useTranslate} from '../../application';
import Loading from 'common/components/Loading';
import Error from 'common/components/Error';
import {useNavbarItems} from '../../../application/application';
import CreateProjectContainer from './CreateProjectContainer';
import SortDropdown from 'common/components/CardGrid/SortDropdown';
import {IFilterOptions} from 'morpheus/modflow/application/useProjectList';
import {format, formatISO, subYears} from 'date-fns';

const sortOptions: ISortOption[] = [
  {text: 'Most Recent', value: 'mostRecent'},
  {text: 'Less Recent', value: 'lessRecent'},
  {text: 'A-Z', value: 'aToZ'},
  {text: 'Z-A', value: 'zToA'},
];

const filterOptions: IFilterOptions = {
  number_of_my_projects: 10,
  number_of_my_group_projects: 12,
  users: [{
    user_id: 'Dmytro',
    unsername: 'Dmytro',
    count: 10,
  },
  {
    user_id: 'Ralf',
    unsername: 'Ralf',
    count: 2,
  }],
  by_status: {
    green: 100,
    yellow: 100,
    red: 100,
  },
  by_date: {
    created_at: {
      start_date: formatISO(subYears(new Date(), 8)),
      end_date: formatISO(new Date()),
    },
    updated_at: {
      start_date: formatISO(subYears(new Date(), 2)),
      end_date: formatISO(new Date()),
    },
    model_date: {
      start_date: formatISO(subYears(new Date(), 6)),
      end_date: formatISO(new Date()),
    },
  },
  boundary_conditions: {
    CHD: 10,
    FHB: 11,
    WEL: 12,
    RCH: 13,
    RIV: 14,
    GHB: 15,
    EVT: 12,
    DRN: 12,
    NB: 0,
  },
  additional_features: {
    soluteTransportMT3DMS: 12,
    dualDensityFlowSEAWAT: 1,
    realTimeSensors: 13,
    modelsWithScenarios: 1,
  },
  number_of_grid_cells: {
    min: 0,
    max: 240000,
    step: 100,
  },
  number_of_stress_periods: {
    min: 0,
    max: 50,
    step: 1,
  },
  number_of_layers: {
    min: 110,
    max: 300,
    step: 10,
  },
  tags: {
    groundwater: 46,
    recharge: 12,
  },
};

interface IProps {
  basePath: string;
}

const ProjectListPage = ({basePath}: IProps) => {

  const navigateTo = useNavigate();
  const location = useLocation();
  const {navbarItems} = useNavbarItems();
  const {translate} = useTranslate();
  const {projects, loading, error, filter, onFilterChange} = useProjectList();
  const [cards, setCards] = useState<ICard[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [showCreateProjectModel, setShowCreateProjectModel] = useState<boolean>(false);

  useEffect(() => {
    setCards(projects.map((project) => {
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
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  useEffect(() => {
    console.log(filter);
  }, [filter]);

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
          value: searchValue,
          onChange: setSearchValue,
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
            setModelData={setCards}
            sortOptions={sortOptions}
            data={cards}
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
