import React from 'react';
import ArticleGrid from '../components/ArticleGrid';
import PageTitle from '../components/PageTitle';
import {useTranslate} from '../../application';
import {useNavigate} from 'common/hooks';
import {IModelGridItem} from '../../../../components/ModelGrid/types/ModelGrid.type';

const tools = ['T02', 'T04', 'T06', 'T08', 'T09', 'T11', 'T13', 'T14', 'T18'];

const models: IModelGridItem[] = [
  {
    id: 0,
    model_description: 'A comprehensive guide to React development',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    model_title: 'React Mastery: The Complete Guide',
    model_Link: '/tools/01',
    model_map: '/tools/01',
    meta_author_avatar: '/author/JohnDoe.jpeg',
    meta_author_name: 'John Doe',
    meta_link: 'https://metaLink1',
    meta_text: new Date().toLocaleDateString(),
    meta_status: false,
  },
  {
    id: 1,
    model_description: 'Explore the world of machine learning with Python',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    model_title: 'Machine Learning with Python',
    model_Link: '/tools/02',
    model_map: '/tools/01',
    meta_author_avatar: '/author/JaneSmith.jpeg',
    meta_author_name: 'Jane Smith',
    meta_link: 'https://metaLink2',
    meta_text: new Date().toLocaleDateString(),
    meta_status: false,
  },
  {
    id: 2,
    model_description: 'Base model in the Ezousa valley',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    model_title: 'Ezousa MAR site',
    model_Link: '/tools/03',
    model_map: '/tools/01',
    meta_author_avatar: '/author/RobertJohnson.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink3',
    meta_text: new Date().toLocaleDateString(),
    meta_status: true,
  },
  {
    id: 3,
    model_description: 'Small model at NU campus',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    model_title: 'Simulation ofSUDS impact',
    model_Link: '/tools/04',
    model_map: '/tools/01',
    meta_author_avatar: '/author/EmilyBrown.jpeg',
    meta_author_name: 'Emily Brown',
    meta_link: 'https://metaLink4',
    meta_text: new Date().toLocaleDateString(),
    meta_status: true,
  },
  {
    id: 4,
    model_description: 'Explore the world of data science and analytics',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    model_title: 'Data Science Foundations',
    model_Link: '/tools/05',
    model_map: '/tools/01',
    meta_author_avatar: '/author/DavidWilson.jpeg',
    meta_author_name: 'David Wilson',
    meta_link: 'https://metaLink5',
    meta_text: new Date().toLocaleDateString(),
    meta_status: true,
  },
];


const DashboardContainer = () => {
  const {translate} = useTranslate();
  const navigateTo = useNavigate();

  const articles = tools.map((tool, idx) => ({
    id: idx,
    title: `${tool}: ${translate(`${tool}_title`)}`,
    image: translate(`${tool}_image`),
    description: translate(`${tool}_description`),
    toolLink: `/tools/${tool}`,
    documentationLink: translate(`${tool}_documentation_link`),
  }));

  return (
    <>
      {/*<ModelGrid data={models} navigateTo={navigateTo}/>*/}
      <PageTitle
        title={translate('tools')}
        description={translate('tools_description')}
      />
      <ArticleGrid
        articles={articles}
        navigateTo={navigateTo}
        translate={translate}
      />
    </>
  );
};

export default DashboardContainer;
