import React, {ReactNode} from 'react';
import styles from './ContentWrapper.module.less';

interface IProps {
  maxWidth?: '100vw' | '100%' | 'auto' | 'inherit' | 'initial' | 'unset' | number;
  minHeight?: '100vh' | '100%' | 'auto' | 'inherit' | 'initial' | 'unset';
  children: ReactNode;
}

const ContentWrapper = ({children, minHeight, maxWidth}: IProps) => (
  <div
    className={styles.contentWrapper}
    style={{
      maxWidth: maxWidth || '100%',
      minHeight: minHeight || '100vh',
    }}
  >
    {children}
  </div>
);

export default ContentWrapper;
