import {Button, Dimmer, Grid, Header, Icon, Image, Segment} from 'semantic-ui-react';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import image9A from '../images/T09A.png';
import image9B from '../images/T09B.png';
import image9C from '../images/T09C.png';
import image9D from '../images/T09D.png';
import image9E from '../images/T09E.png';
import image9F from '../images/T09F.png';

interface Item {
  tool: string;
  name: string;
  description: string;
  image: string;
}

const items: Item[] = [
  {
    tool: 'T09A',
    name: 'Depth of saltwater – freshwater interface (Ghyben-Herzberg relation).',
    description: 'The location of the interface between fresh and saltwater can be roughly approximated under static hydraulic conditions (no modflow). By considering the densities of fresh water and sea water, the tool helps to estimate the total thickness of the freshwater lens based on the elevation of groundwater table above sea level.',
    image: image9A,
  },
  {
    tool: 'T09B',
    name: 'Shape and extent of freshwater - saltwater interface (Glover equation).',
    description: 'Glover’s equation takes into account the fresh water gradient to approximate the interface between an area of fresh water and an area of sea water and provides some indication of the shape and extent of the interface. In contrast to the Ghyben-Herzberg relation, freshwater discharges into the sea along an area rather than along a line.',
    image: image9B,
  },
  {
    tool: 'T09C',
    name: 'Upconing of the saltwater interface by pumping.',
    description: 'Upconing of the saltwater interface can occur when the aquifer head is lowered by pumping from wells. The tool calculates the critical upconing elevation which should not be exceeded when pumping water from a well, as well as the corresponding critical pumping rate to avoid saltwater entering the well.',
    image: image9C,
  },
  {
    tool: 'T09D',
    name: 'Critical well discharge.',
    description: 'The tool estimates the critical abstraction rate of a pumping well located in a coastal aquifer. If exceeded, it can create an unstable situation where sea water will move inland to the well. The position of the toe of the saltwater - freshwater interface is calculated based on the distance between the well and the coast line and the aquifer’s characteristics.',
    image: image9D,
  },
  {
    tool: 'T09E',
    name: 'Sea level rise (vertical cliff).',
    description: 'The tool contains equations presented by Werner and Simmons, 2009 on the effects of sea level rise on sea water intrusion. These equations can be used to estimate the inland migration of the toe of the fresh water sea water interface in response to sea level rise, where there is a constant head boundary inland or constant flux inland.',
    image: image9E,
  },
  {
    tool: 'T09F',
    name: 'Sea level rise (inclined coast).',
    description: 'With the help of the analytical solution of Chesnaux (2015), the tool approximates the inland toe migration within coastal aquifers caused by sea level rise. In contrast to the solution by Werner and Simmons (2009) in tool T09E, the equation considers a low inclination of the sea shore and hence progressions of the sea boundary inland due to sea level rise.',
    image: image9F,
  },
];

const T09 = () => {

  const navigateTo = useNavigate();
  const redirectTo = (path: string): void => {
    navigateTo(`/tools/${path}`);
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
        dimmed={isHovered === i.tool ? true : false}
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
          inverted={true} active={isHovered === i.tool ? true : false}
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
      <Header
        as={'h3'}
        style={{paddingTop: '40px'}}
      >
        Please select the set of boundary conditions that apply to your problem:
      </Header>
      <Grid
        stretched={true}
        stackable={true}
        columns={2}
        style={{padding: '40px 0'}}
      >
        {columns}
      </Grid>
    </div>
  );
};

export default T09;
