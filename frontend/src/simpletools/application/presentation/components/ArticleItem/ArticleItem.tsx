import React from 'react';
import {Image, Button} from 'components';
import styles from './ArticleItem.module.less';

export interface IArticle {
  id: number;
  title: string;
  image: string;
  description: string;
  toolLink: string;
  documentationLink: string;
}

interface IProps {
  article: IArticle;
  navigateToTool: () => void;
  navigateToDocumentation: () => void;
  translate: (key: string) => string;
}

const ArticleItem: React.FC<IProps> = ({article, navigateToTool, navigateToDocumentation, translate}) => {

  const renderDescription = (description: string) => {
    if (120 >= description.length) {
      return description;
    }

    return description.substring(0, 196) + '...';
  };

  return (
    <div className={styles.articleItem}>
      <Image
        className={styles.articleImage}
        src={article.image} fluid={true}
        width="300" height="150"
      />
      <div className={styles.articleInner}>
        <h2 className={styles.articleTitle}>
          {article.title}
        </h2>
        <p className={styles.articleDescription}>
          {renderDescription(article.description)}
        </p>
        <div>
          <Button
            className={styles.articleLink}
            floated={'right'}
            onClick={navigateToDocumentation}
          >
            {translate('read_more')}
          </Button>
          <Button
            floated={'left'}
            positive={true}
            onClick={navigateToTool}
          >
            {translate('start_tool')}
          </Button>

        </div>
      </div>
    </div>
  );
};

export default ArticleItem;
