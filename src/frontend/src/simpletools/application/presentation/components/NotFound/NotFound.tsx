import React from 'react';
import styles from './NotFound.module.less';

const NotFound = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>404</h1>
      <p>Oops. The page you're looking for doesn't exist.</p>
    </div>
  );
};
export default NotFound;
