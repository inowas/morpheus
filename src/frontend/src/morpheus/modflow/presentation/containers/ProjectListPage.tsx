import {CardGrid, ContentWrapper, ICard, ISortOption, Navbar} from 'common/components';
import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'common/hooks';
import {ModflowContainer, SidebarContent} from '../components';
import {useProjectList, useTranslate} from '../../application';
import Loading from 'common/components/Loading';
import Error from 'common/components/Error';
import {useNavbarItems} from '../../../application/application';
import SortDropdown from '../../../../common/components/CardGrid/SortDropdown';
import {format} from 'date-fns';


const sortOptions: ISortOption[] = [
  {text: 'Most Recent', value: 'mostRecent'},
  {text: 'Less Recent', value: 'lessRecent'},
  {text: 'A-Z', value: 'aToZ'},
  {text: 'Z-A', value: 'zToA'},
];

interface IProps {
  basePath: string;
}

const ProjectListPage = ({basePath}: IProps) => {

  const navigateTo = useNavigate();
  const location = useLocation();
  const {navbarItems, showSearchBar, showButton} = useNavbarItems();
  const {translate} = useTranslate();
  const {projects, loading, error} = useProjectList();
  const [cards, setCards] = useState<ICard[]>([]);

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
        showSearchWrapper={showSearchBar}
        showCreateButton={showButton}
      />
      <ModflowContainer>
        <SidebarContent maxWidth={350}>
          <div style={{padding: 20}}>
            <h3>{translate('Projects filter')}</h3>
          </div>
          {/*<ProjectsFilter data={modelData} updateModelData={updateModelData}/>*/}
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
    </>
  );
};

export default ProjectListPage;
