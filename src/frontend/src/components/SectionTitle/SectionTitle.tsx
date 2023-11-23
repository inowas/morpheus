import React from 'react';
import styles from './SectionTitle.module.less';

interface IProps {
  title: string;
}

const SectionTitle = ({title}: IProps) => {

  return (
    <div
      data-testid="section-title"
      className={styles.title}
    >
      <h2>{title}</h2>
    </div>
  );
};

export default SectionTitle;


