import React, {ReactNode} from 'react';
import {Container} from 'semantic-ui-react';
import styles from './ContentWrapper.module.less';

interface IProps {
  minHeight?: '100vh' | '100%' | 'auto' | 'inherit' | 'initial' | 'unset';
  children: ReactNode;
}

const ContentWrapper = ({children, minHeight}: IProps) => (
  <Container
    className={styles.flexColumn}
    style={{
      minHeight: minHeight || '100vh',
      margin: '0',
    }}
  >
    {children}
  </Container>
);

export default ContentWrapper;
