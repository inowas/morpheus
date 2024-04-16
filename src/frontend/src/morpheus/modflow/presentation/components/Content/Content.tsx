import React from 'react';
import styles from './Content.module.less';

interface IProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Content = ({children, fullWidth = true}: IProps) => (
  <div className={`${styles.sidebarContent} ${fullWidth ? styles.sidebarContentFullWidth : ''}`}>
    {children}
  </div>
);

export default Content;
