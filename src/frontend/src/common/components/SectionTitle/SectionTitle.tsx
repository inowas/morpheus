import React, {ReactNode} from 'react';

import styles from './SectionTitle.module.less';
import Button from '../Button/Button';

interface IProps {
  title?: string | ReactNode;
  btnTitle?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  faIcon?: ReactNode;
  faIconText?: string;
  faIconOnClick?: () => void;
  secondary?: boolean;
  disabled?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const SectionTitle = ({
  title,
  btnTitle,
  onClick,
  disabled,
  style,
  className,
  faIcon,
  faIconText,
  faIconOnClick,
  secondary,
  as = 'h1',
}: IProps) => {

  if (!title && !btnTitle) {
    return null;
  }

  const renderLockedIcon = () => {
    if (faIconOnClick) {
      return (
        <button
          disabled={disabled} className={styles.faButton}
          onClick={() => faIconOnClick && faIconOnClick()}
        >
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
      <div className={styles.headline}>
        <h2 className={`${styles.title} ${as}`}>{title}</h2>
        {faIcon && renderLockedIcon()}
        {btnTitle && onClick && (
          <Button
            disabled={disabled}
            className={styles.button}
            primary={true}
            size={'small'}
            onClick={onClick}
          >
            {btnTitle}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SectionTitle;


