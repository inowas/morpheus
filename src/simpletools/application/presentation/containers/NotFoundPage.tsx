import React from 'react';
import styles from './NotFoundPage.module.less';

const NotFoundPage = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>404</h1>
      <p>Oops. The page you're looking for doesn't exist.</p>
    </div>
  );
};
export default NotFoundPage;
