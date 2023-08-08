import React from 'react';
import {Grid, Image} from 'semantic-ui-react';
import styles from './ArticleItem.module.less';
import {useNavigate} from '../../../../../common/hooks';

import imageT02 from '../../../../../T02/presentation/images/screenshotT02.png';
import imageT08 from '../../../../../T08/presentation/images/screenshotT08.png';
import imageT09 from '../../../../../T09/presentation/images/screenshotT09.png';
import imageT13 from '../../../../../T13/presentation/images/screenshotT13.png';
import imageT18 from '../../../../../T18/presentation/images/screenshotT18.png';

interface Article {
  id: number;
  title: string;
  image: string;
  description: string;
  link: string;
}

interface ImageMap {
  [key: string]: any; // Use a more specific type if possible
}

interface ArticleItemProps {
  article: Article;
}

const ArticleItem: React.FC<ArticleItemProps> = ({article}) => {

  console.log(imageT02);
  const imageMap: ImageMap = {
    T02: imageT02,
    T08: imageT08,
    T09: imageT09,
    T13: imageT13,
    T18: imageT18,
  };

  const navigateTo = useNavigate();
  const redirectTo = (path: string): void => {
    navigateTo(`/tools/${path}`);
  };
  const truncateDescription = (description: string) => {
    if (120 >= description.length) {
      return description;
    } else {
      return description.substring(0, 196) + '...';
    }
  };

  return (
    <Grid.Column className={styles.articleItem} onClick={() => redirectTo(article.link)}>
      <div className={styles.articleImage}>
        <Image
          className={styles.articleImage_Img}
          src={imageMap[article.image]}
          fluid={true}
          width="300" height="175"
        />
      </div>
      <div className={styles.articleInner}>
        <h2 className={styles.articleTitle}>
          {article.title}
        </h2>
        <p className={styles.articleDescription}>{truncateDescription(article.description)}</p>
        <span
          className={styles.articleLink}
        >
            Read more
        </span>
      </div>
    </Grid.Column>
  );
};

export default ArticleItem;
