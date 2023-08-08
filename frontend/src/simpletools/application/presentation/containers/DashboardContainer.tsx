import React from 'react';
import ArticleGrid from '../components/ArticleGrid';
import articles from '../components/ArticleGrid/article.json';
import PageTitle from '../components/PageTitle';

const DashboardContainer = () => {
  return (
    <>
      <PageTitle
        title="Tools"
        description="We provide a collection of simple, practical and reliable web-based tools for groundwater flow simulation."
      />
      <ArticleGrid articles={articles}/>
    </>
  );
};

export default DashboardContainer;
