import React, {ReactNode} from 'react';
import styles from './ContentWrapper.module.less';
import {IPageHeight, IPageWidth} from 'components/ContentWrapper';

interface IProps {
  maxWidth?: IPageWidth;
  minHeight?: IPageHeight;
  children: ReactNode;
  showSidebarMenu?: boolean;
}


const ContentWrapper = ({children, minHeight, maxWidth, showSidebarMenu = false}: IProps) => (
  <div
    className={`${styles.contentWrapper} ${showSidebarMenu ? styles.showSidebarMenu : ''}`}
    style={{
      maxWidth: maxWidth || '100%',
      minHeight: minHeight || '100vh',
    }}
  >
    {children}
  </div>
);

export default ContentWrapper;
