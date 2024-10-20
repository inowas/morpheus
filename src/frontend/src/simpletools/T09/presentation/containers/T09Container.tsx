import {Button, Dimmer, Grid, Header, Icon, Image, Segment} from 'semantic-ui-react';
import React, {useState} from 'react';
import {useNavigate, useShowBreadcrumbs, useTranslate} from '../../application';

import Breadcrumb from 'common/components/Breadcrumb';
import image9A from '../images/T09A.png';
import image9B from '../images/T09B.png';
import image9C from '../images/T09C.png';
import image9D from '../images/T09D.png';
import image9E from '../images/T09E.png';
import image9F from '../images/T09F.png';
import styles from './T09.module.less';

interface Item {
  tool: string;
  image: string;
}

export const items: Item[] = [
  {
    tool: 'T09A',
    image: image9A,
  },
  {
    tool: 'T09B',
    image: image9B,
  },
  {
    tool: 'T09C',
    image: image9C,
  },
  {
    tool: 'T09D',
    image: image9D,
  },
  {
    tool: 'T09E',
    image: image9E,
  },
  {
    tool: 'T09F',
    image: image9F,
  },
];

const tool = 'T09';

const T09 = () => {
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
    <Grid.Column
      key={i.tool} onClick={() => redirectTo(i.tool)}
      data-testid={`${i.tool}-gridcell`}
    >
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
        <strong>{translate(`${i.tool}_title`)}</strong><br/>
        {translate(`${i.tool}_description`)}
        {isHovered && (
          <Dimmer
            inverted={true}
            active={isHovered === i.tool}
          >
            <Button
              icon={true} primary={true}
              size="large" labelPosition="left"
            >
              <Icon name="pin"/>
              Select {i.tool}</Button>
          </Dimmer>
        )}
      </Dimmer.Dimmable>
    </Grid.Column>
  ));

  const title = `${tool}: ${translate(`${tool}_title`)}`;

  return (
    <div className={styles.toolWrapper} data-testid="t09-container">
      {showBreadcrumbs && <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />}
      <Header
        as={'h3'}
        style={{position: 'relative', zIndex: 2}}
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
