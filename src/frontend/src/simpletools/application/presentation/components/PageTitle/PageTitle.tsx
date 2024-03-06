import {Header} from 'semantic-ui-react';
import React from 'react';
import styles from './PageTitle.module.less';

interface IProps {
  title: string;
  description?: string;
}

const PageTitle: React.FC<IProps> = ({title, description}) => {
  return (
    <div className={styles.pageTitle}>
      <Header className={styles.title} as="h1">{title}</Header>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

export default PageTitle;
