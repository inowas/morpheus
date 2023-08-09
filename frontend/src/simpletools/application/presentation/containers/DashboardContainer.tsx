import React from 'react';
import ArticleGrid from '../components/ArticleGrid';
import PageTitle from '../components/PageTitle';
import {useTranslate} from '../../application';

const tools = ['T02', 'T08', 'T09', 'T13', 'T18'];



const DashboardContainer = () => {
  const {translate} = useTranslate();

  const articles = tools.map((tool, idx) => ({
    id: idx,
    title: `${tool}: ${translate(`${tool}_title`)}`,
    image: translate(`${tool}_image`),
    description: translate(`${tool}_description`),
    link: `/tools/${tool}`,
  }));

  return (
    <>
      <PageTitle
        title={translate('tools')}
        description={translate('tools_description')}
      />
      <ArticleGrid articles={articles}/>
    </>
  );
};

export default DashboardContainer;
