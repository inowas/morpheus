import React from 'react';
import {Grid} from 'semantic-ui-react';
import ArticleItem from '../ArticleItem/ArticleItem';
import styles from './ArticleGrid.module.less';

export interface IArticle {
  id: number;
  title: string;
  image: string;
  description: string;
  link: string;
}

interface IProps {
  articles: IArticle[];
}

const ArticleGrid = ({articles}: IProps) => {
  return (
    <div className={styles.articleGrid}>
      <Grid
        stackable={true}
        columns={3}
      >
        {articles.map((article) => (
          <Grid.Column
            key={article.id}
          >
            <ArticleItem article={article}/>
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
};

export default ArticleGrid;
