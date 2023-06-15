import React, {ReactNode} from 'react';
import {Container} from 'semantic-ui-react';
import styles from './ContainerInowas.module.less';

interface IProps {
  children: ReactNode;
}

const ContainerInowas = ({children}: IProps) => {

  return (
    <Container
      className={styles.container}
    >
      {children}
    </Container>
  );
};

export default ContainerInowas;
