import {Button, Dimmer, Grid, Header, Icon, Image, Segment} from 'semantic-ui-react';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import image13A from '../images/T13A.png';
import image13B from '../images/T13B.png';
import image13C from '../images/T13C.png';
import image13D from '../images/T13D.png';
import image13E from '../images/T13E.png';
import BreadcrumbComponent from '../../../../components/BreadcrumbComponent/BreadcrumbComponent';

interface Item {
  tool: string;
  name: string;
  description: string;
  image: string;
}

const items: Item[] = [
  {
    tool: 'T13A',
    name: 'Aquifer system with one no-modflow boundary and one fixed head boundary condition and constant groundwater recharge',
    description: '',
    image: image13A,
  },
  {
    tool: 'T13B',
    name: 'Aquifer system with two fixed head boundary conditions, a modflow divide within the system and constant groundwater recharge',
    description: '',
    image: image13B,
  },
  {
    tool: 'T13C',
    name: 'Aquifer system with two fixed head boundary conditions, a modflow divide outside of the system and constant groundwater recharge',
    description: '',
    image: image13C,
  },
  {
    tool: 'T13D',
    name: 'Aquifer system with two fixed head boundary conditions, constant groundwater recharge but user is not sure whether the modflow divide lies within the system',
    description: '',
    image: image13D,
  },
  {
    tool: 'T13E',
    name: 'Aquifer system with one pumping well at constant rate, no groundwater recharge',
    description: '',
    image: image13E,
  },
];

const T13 = () => {

  const navigateTo = useNavigate();
  const redirectTo = (path: string): void => {
    navigateTo(`/tools/${path}`, {state: {text: 'T13', path: '/T13', title: 'T13: Some title'}});

  };

  const [isHovered, setIsHovered] = useState('');
  const handleMouseEnter = (tool: string) => {
    setIsHovered(tool);
  };

  const handleMouseLeave = () => {
    setIsHovered('');
  };

  const columns = items.map(i => (
    <Grid.Column key={i.tool} onClick={() => redirectTo(i.tool)}>
      <Dimmer.Dimmable
        as={Segment}
        color={'blue'}
        style={{cursor: 'pointer', marginBottom: '1em'}} padded={true}
        dimmed={isHovered === i.tool}
        onMouseEnter={() => handleMouseEnter(i.tool)}
        onMouseLeave={() => handleMouseLeave()}
      >
        <Image
          src={i.image} size={'medium'}
          floated={'left'}
        />
        <Header
          as={'h2'} color={'blue'}
          style={{marginTop: 0}}
        >{i.tool}</Header>
        <p><strong>{i.name}</strong>&nbsp;{i.description}</p>
        <Dimmer
          inverted={true} active={isHovered === i.tool}
        >
          <Button
            icon={true} primary={true}
            size="large" labelPosition="left"
          >
            <Icon name="pin"/>
            Select {i.tool}</Button>
        </Dimmer>
      </Dimmer.Dimmable>
    </Grid.Column>
  ));

  return (
    <div>
      <BreadcrumbComponent items={[{text: 'T13', path: '/T13', title: 'T13: Some title'}]}/>
      <Header
        as={'h3'}
        style={{paddingTop: '40px'}}
      >
        Please select the set of boundary conditions that apply to your problem:
      </Header>
      <Grid
        columns={2} stretched={true}
        style={{padding: '40px 0'}}
      >
        {columns}
      </Grid>
    </div>
  );
};

export default T13;
