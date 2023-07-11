import React from 'react';
import {Button, Image} from 'semantic-ui-react';
import styles from './ArticleItem.module.less';

interface Article {
  id: number;
  title: string;
  image: string;
  description: string;
  link: string;
}

interface ArticleItemProps {
  article: Article;
}

const ArticleItem: React.FC<ArticleItemProps> = ({article}) => {

  const truncateDescription = (description: string) => {
    if (120 >= description.length) {
      return description;
    } else {
      return description.substring(0, 196) + '...';
    }
  };

  return (
    <div className={styles.articleItem}>
      <Image
        className={styles.articleImage}
        src={article.image} fluid={true}
        width="300" height="150"
        href={article.link}
      />
      <div className={styles.articleInner}>
        <h2 className={styles.articleTitle}>
          <a href={article.link}>{article.title}</a>
        </h2>
        <p className={styles.articleDescription}>{truncateDescription(article.description)}</p>
        <Button
          className={styles.articleLink}
          as="a" href={article.link}
        >
          Read more
        </Button>
      </div>
    </div>
  );
};

export default ArticleItem;
