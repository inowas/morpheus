import React from 'react';
import styles from './LoaderAnimation.module.less';

const LoaderAnimation = () => {
  return (<div className={styles.container}>
    <div className={styles.loading}>
      <div className={[styles.ball, styles.one].join(' ')}></div>
      <div className={[styles.ball, styles.two].join(' ')}></div>
      <div className={[styles.ball, styles.three].join(' ')}></div>
      <div className={[styles.ball, styles.four].join(' ')}></div>
    </div>
  </div>);
};

export default LoaderAnimation;
