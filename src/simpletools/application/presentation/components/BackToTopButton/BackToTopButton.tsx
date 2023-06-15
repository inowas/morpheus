import React from 'react';
import style from './BackToTopButton.module.less';

const BackToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className={style.backToTopButton}
      onClick={scrollToTop}
      aria-label="Back to Top"
      role="button"
    >
      <i className={style.arrowUp}></i>
      <i className={style.arrowUp}></i>
      <span className="visually-hidden">Back to Top</span>
    </button>
  );
};

export default BackToTopButton;
