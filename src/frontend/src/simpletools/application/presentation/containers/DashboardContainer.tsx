import ArticleGrid from '../components/ArticleGrid';
import PageTitle from '../components/PageTitle';
import React from 'react';
import {useNavigate} from 'common/hooks';
import {useTranslate} from '../../application';

const tools = ['T02', 'T04', 'T06', 'T08', 'T09', 'T11', 'T13', 'T14', 'T18'];

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
