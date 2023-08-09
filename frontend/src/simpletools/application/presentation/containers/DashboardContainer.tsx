import React from 'react';
import ArticleGrid from '../components/ArticleGrid';
import PageTitle from '../components/PageTitle';
import articles from '../components/ArticleGrid/article.json';
import {useTranslate} from '../../application';

const DashboardContainer = () => {
  const {translate} = useTranslate();
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
