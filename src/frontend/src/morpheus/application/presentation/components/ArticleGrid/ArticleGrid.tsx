import ArticleItem, {IArticle} from './ArticleItem/ArticleItem';

import {Grid} from 'components';
import React from 'react';
import styles from './ArticleGrid.module.less';

interface IProps {
  articles: IArticle[];
  navigateTo: (path: string) => void;
  translate: (key: string) => string;
}

const openInNewTab = (url: string) => {
  window.open(url, '_blank', 'noreferrer');
};

const ArticleGrid: React.FC<IProps> = ({articles, navigateTo, translate}) => (
  <div
    className={styles.articleGrid}
    data-testid={'article-grid'}
  >
    <Grid.Grid stackable={true} columns={3}>
      {articles.map((article) => (
        <Grid.Column
          key={article.id}
          data-testid={`article-item-${article.id}`}
        >
          <ArticleItem
            article={article}
            navigateToTool={() => navigateTo(article.toolLink)}
            navigateToDocumentation={() => openInNewTab(article.documentationLink)}
            translate={translate}
          />
        </Grid.Column>
      ))}
    </Grid.Grid>
  </div>
);

export default ArticleGrid;
