import React from 'react';
import styles from './Error.module.less';

interface IProps {
  message?: string;
}

const Error = ({message}: IProps) => {
  return (
    <div className={styles.wrapper} data-testid={'error'}>
      <h1 className={styles.title}>Error</h1>
      <p>{message || 'Error'}</p>
    </div>
  );
};
export default Error;
