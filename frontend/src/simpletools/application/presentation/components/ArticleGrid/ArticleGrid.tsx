import React from 'react';
import {Grid} from 'semantic-ui-react';
import ArticleItem from './ArticleItem';
import styles from './ArticleGrid.module.less';

interface Article {
  id: number;
  title: string;
  image: string;
  description: string;
  link: string;
}

interface ArticleGridProps {
  articles: Article[];
}

const ArticleGrid: React.FC<ArticleGridProps> = ({articles}) => {

  return (
    <div className={styles.articleGrid}>
      <Grid
        stackable={true}
        columns={3}
      >
        {articles.map((article) => (
          article.link &&
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
