import React, {ReactNode} from 'react';

import styles from './ContentContainer.module.less';

interface IProps {
  children: ReactNode;
}

const ContentContainer = ({children}: IProps) => (
  <div className={`${styles.contentContainer}`}>
    {children}
  </div>
);

export default ContentContainer;
