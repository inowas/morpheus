import React from 'react';
import {Segment} from 'semantic-ui-react';

import styles from './Section.module.less';

interface IProps {
  children?: React.ReactNode;
}

const Widget = ({children}: IProps) => {
  return (
    <Segment className={styles.wrapperWidget}>
      {children}
    </Segment>
  );
};

export default Widget;
