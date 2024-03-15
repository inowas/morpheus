import React from 'react';
import styles from './Loading.module.less';

const Loading = () => {
  return (
    <div className={styles.wrapper} data-testid={'loading'}>
      <h1 className={styles.title}>Loading</h1>
      <p>Please wait...</p>
    </div>
  );
};
export default Loading;
