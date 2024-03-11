import React, {ReactNode} from 'react';

import styles from './SectionTitle.module.less';

interface IProps {
  title: string | ReactNode;
}

const SectionTitle = ({title}: IProps) => {

  return (
    <div
      data-testid="section-title"
    >
      {'string' === typeof title ?
        <h2 className={styles.sectionTitle}>{title}</h2> :
        <h2 className={styles.sectionTitleSmall}>{title}</h2>}
    </div>
  );
};

export default SectionTitle;


