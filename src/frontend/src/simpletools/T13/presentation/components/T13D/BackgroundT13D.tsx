import {Container, Header} from 'semantic-ui-react';

import Background from '../Background';
import {IT13B} from '../../../types/T13.type';
import React from 'react';
import {calculateXwd} from '../../../application/useCalculations';
import {getParameterValues} from 'simpletools/common/utils';
import image13B from '../../images/T13B.png';
import image13C from '../../images/T13C.png';
import {useNavigate} from 'common/hooks';

const tool = (xwd: number) => {
  if (0 <= xwd) {
    return {
      name: 'Tool 13B',
      image: image13B,
      href: 'T13B',
      title: 'T13B. Aquifer system with a flow divide within of the system',
    };
  }

  return {
    name: 'Tool 13C',
    image: image13C,
    href: 'T13C',
    title: 'T13C. Aquifer system with a flow divide outside of the system',
  };
};

interface IProps {
  parameters: IT13B['parameters'];
}

const BackgroundT13D = ({parameters}: IProps) => {
  const {W, K, L, hL, h0} = getParameterValues(parameters);
  const xwd = calculateXwd(L, K, W, hL, h0).toFixed(1);
  const navigateTo = useNavigate();

  return (
    <Container style={{textAlign: 'center'}}>
      <Background
        image={tool(+xwd).image}
        title={tool(+xwd).title}
      />
      <Header as={'h4'}>
        The water divide is located at {xwd}m. <br/>
        Proceed with:
        <strong
          style={{color: '#1EB1ED', cursor: 'pointer', paddingLeft: '0.5em'}}
          onClick={() => {
            navigateTo('/tools/T13/' + tool(+xwd).href);
          }}
        >
          {tool(+xwd).name}
        </strong>
      </Header>
    </Container>
  );
};


export default BackgroundT13D;
