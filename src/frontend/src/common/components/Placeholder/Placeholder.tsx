import React from 'react';
import styles from './Placeholder.module.less';

interface IProps {
  header?: string;
  message?: string;
  children?: React.ReactNode;
}

const Placeholder = ({header, message, children}: IProps) => {
  return (
    <div className={styles.wrapper} data-testid={'placeholder'}>
      <h1 className={styles.title}>{header}</h1>
      <p>{message}</p>
      {children}
    </div>
  );
};
export default Placeholder;
