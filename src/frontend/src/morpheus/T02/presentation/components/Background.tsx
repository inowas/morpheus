import React from 'react';
import {Container, Image} from 'semantic-ui-react';

interface IProps {
  title?: string;
  image: string;
}

const Background = (props: IProps) => (
  <Container
    textAlign={'center'}
    data-testid={'background-container'}
  >
    <Image
      src={props.image}
      fluid={true}
      alt={props.title}
    />
  </Container>
);

export default Background;
