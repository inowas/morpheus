import {ContentWrapper, ICard, ISortOption, CardGrid} from 'common/components';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'common/hooks';
import {ModflowContainer, SidebarContent} from '../components';
import {useProjectList, useTranslate} from '../../application';
import Loading from 'common/components/Loading';
import Error from 'common/components/Error';


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

  const {translate} = useTranslate();
  const navigateTo = useNavigate();

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
    <ModflowContainer headerHeight={140}>
      <SidebarContent maxWidth={350}>
        <div style={{padding: 20}}>
          <h3>{translate('Projects filter')}</h3>
        </div>
        {/*<ProjectsFilter data={modelData} updateModelData={updateModelData}/>*/}
      </SidebarContent>
      <ContentWrapper>
        <CardGrid
          placeholder="Order By"
          sortOptions={sortOptions}
          onChangeCards={setCards}
          cards={cards}
          title={<><span>{projects.length}</span> {translate('Projects found')}</>}
        />
      </ContentWrapper>
    </ModflowContainer>
  );
};

export default ProjectListPage;
