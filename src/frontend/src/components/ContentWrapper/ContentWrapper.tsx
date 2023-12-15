import React, {ReactNode} from 'react';
import styles from './ContentWrapper.module.less';
import {IPageHeight, IPageWidth} from 'components/ContentWrapper';

interface IProps {
  maxWidth?: IPageWidth;
  minHeight?: IPageHeight;
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
