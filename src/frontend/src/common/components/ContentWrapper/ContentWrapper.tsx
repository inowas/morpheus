import {IPageHeight, IPageWidth} from 'common/components/ContentWrapper';
import React, {ReactNode} from 'react';

import styles from './ContentWrapper.module.less';

interface IProps {
  maxWidth?: IPageWidth;
  minHeight?: IPageHeight;
  children: ReactNode;
  showSidebarMenu?: boolean;
  style?: React.CSSProperties;
}


const ContentWrapper = ({children, minHeight, maxWidth, showSidebarMenu = false, style}: IProps) => (
  <div
    className={`${styles.contentWrapper} ${showSidebarMenu ? styles.showSidebarMenu : ''}`}
    style={{
      maxWidth: maxWidth || '100%',
      minHeight: minHeight || 'auto',
      ...style,
    }}
  >
    {children}
  </div>
);

export default ContentWrapper;
