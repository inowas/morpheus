import React, {ReactNode} from 'react';

import styles from './SectionTitle.module.less';

interface IProps {
  title?: string | ReactNode;
  style?: React.CSSProperties;
  className?: string;
  secondary?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: ReactNode;
}

const SectionTitle = ({
  title,
  style,
  className,
  secondary,
  as = 'h1',
  children,
}: IProps) => {
  
  return (
    <div
      data-testid="section-title"
      className={(secondary || className) && `${secondary ? styles.secondary : ''} ${className || ''}`}
      style={style}
    >
      <div className={styles.headline}>
        <h2 className={`${styles.title} ${as}`}>{title}</h2>
        {children && children}
      </div>
    </div>
  );
};

export default SectionTitle;


