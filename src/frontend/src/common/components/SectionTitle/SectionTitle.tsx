import React, {ReactNode} from 'react';

import styles from './SectionTitle.module.less';
import Button from '../Button/Button';

interface IProps {
  title?: string | ReactNode;
  subTitle?: string;
  btnTitle?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  faIcon?: ReactNode;
  faIconText?: string;
  faIconOnClick?: () => void;
  secondary?: boolean;
}

const SectionTitle = ({
  title,
  subTitle,
  btnTitle,
  onClick,
  style,
  className,
  faIcon,
  faIconText,
  faIconOnClick,
  secondary,
}: IProps) => {

  if (!title && !subTitle && !btnTitle) {
    return null;
  }

  const renderLockedIcon = () => {
    if (faIconOnClick) {
      return (
        <button className={styles.faButton} onClick={() => faIconOnClick && faIconOnClick()}>
          {faIcon}
          {faIconText && <span style={{marginLeft: '10px'}}>{faIconText}</span>}
        </button>
      );
    } else {
      return (
        <span className={styles.faIcon}>
          {faIcon}
          {faIconText && <span style={{marginLeft: '10px'}}>{faIconText}</span>}
        </span>
      );
    }

  };

  return (
    <div
      data-testid="section-title"
      className={(secondary || className) && `${secondary ? styles.secondary : ''} ${className || ''}`}
      style={style}
    >
      {title && (
        <div className={styles.headline}>
          <h2 className={`${styles.title} h1`}>{title}</h2>
          {faIcon && renderLockedIcon()}
          {btnTitle && onClick && (
            <Button
              className={styles.button}
              primary={true} size={'small'}
            >
              {btnTitle}
            </Button>
          )}
        </div>
      )}
      {(subTitle && !title) && (
        <div className={styles.headline}>
          <h3 className={`${styles.subtitle} h2`}>{subTitle}</h3>
          {faIcon && renderLockedIcon()}
          {btnTitle && (
            <Button
              className={styles.button}
              primary={true}
              size={'small'}
              onClick={onClick}
            >
              {btnTitle}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionTitle;


