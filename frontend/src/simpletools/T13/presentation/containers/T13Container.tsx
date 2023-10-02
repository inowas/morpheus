import {Button, Dimmer, Grid, Header, Icon, Image, Segment} from 'semantic-ui-react';
import React, {useState} from 'react';
import {useNavigate} from '../../../common/hooks';
import styles from './T13.module.less';
import image13A from '../images/T13A.png';
import image13B from '../images/T13B.png';
import image13C from '../images/T13C.png';
import image13D from '../images/T13D.png';
import image13E from '../images/T13E.png';
import {Breadcrumb} from '../../../../components';
import {useTranslate} from '../../application';

interface Item {
  tool: string;
  image: string;
}

const items: Item[] = [
  {
    tool: 'T13A',
    image: image13A,
  },
  {
    tool: 'T13B',
    image: image13B,
  },
  {
    tool: 'T13C',
    image: image13C,
  },
  {
    tool: 'T13D',
    image: image13D,
  },
  {
    tool: 'T13E',
    image: image13E,
  },
];

const tool = 'T13';

const T13 = () => {
  const navigateTo = useNavigate();
  const {translate} = useTranslate();

  const redirectTo = (path: string): void => {
    navigateTo(`/tools/${tool}/${path}`);
  };

  const [isHovered, setIsHovered] = useState('');
  const handleMouseEnter = (t: string) => {
    setIsHovered(t);
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
        <p>
          <strong>{translate(`${i.tool}_title`)}</strong><br/>
          {translate(`${i.tool}_description`)}
        </p>
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

  const title = `${tool}: ${translate(`${tool}_title`)}`;

  return (
    <div className={styles.toolWrapper}>
      <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />
      <Header
        as={'h3'}
        style={{position: 'relative', zIndex: 2}}
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
