import {Button, Dimmer, Grid, Header, Icon, Image, Segment} from 'semantic-ui-react';
import React, {useState} from 'react';
import {useShowBreadcrumbs, useTranslate} from '../../application';

import {Breadcrumb} from '../../../../components';
import image14A from '../images/T14A.png';
import image14B from '../images/T14B.png';
import image14C from '../images/T14C.png';
import image14D from '../images/T14D.png';
import styles from './T14.module.less';
import {useNavigate} from 'common/hooks';

interface Item {
  tool: string;
  image: string;
}

const items: Item[] = [
  {
    tool: 'T14A',
    image: image14A,
  },
  {
    tool: 'T14B',
    image: image14B,
  },
  {
    tool: 'T14C',
    image: image14C,
  },
  {
    tool: 'T14D',
    image: image14D,
  },
];

const tool = 'T14';

const T14 = () => {
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const showBreadcrumbs = useShowBreadcrumbs();

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
      {showBreadcrumbs && <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />}
      <Header
        as={'h3'}
        style={{paddingTop: '40px', position: 'relative', zIndex: 2}}
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

export default T14;
