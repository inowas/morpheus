import React from 'react';
import {Grid} from 'components';
import styles from './ArticleGrid.module.less';
import ArticleItem, {IArticle} from './ArticleItem/ArticleItem';

interface IProps {
  articles: IArticle[];
  navigateTo: (path: string) => void;
  translate: (key: string) => string;
}

const openInNewTab = (url: string) => {
  window.open(url, '_blank', 'noreferrer');
};

const ArticleGrid: React.FC<IProps> = ({articles, navigateTo, translate}) => (
  <div className={styles.articleGrid}>
    <Grid.Grid stackable={true} columns={3}>
      {articles.map((article) => (
        <Grid.Column key={article.id}>
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
