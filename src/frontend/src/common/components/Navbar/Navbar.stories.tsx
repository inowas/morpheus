import React from 'react';
import Navbar from 'common/components/Navbar/Navbar';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import {Header, Icon, Input} from 'semantic-ui-react';
import {Button} from '../index';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Navbar',
  component: Navbar,
} as Meta<typeof Navbar>;

const navbarItems = [
  {
    'name': 'model',
    'label': 'Model',
    'admin': false,
    'to': '/projects/0abf17de-27c9-4cb5-8f63-67a0338e5171/model',
  },
  {
    'name': 'scenarios',
    'label': 'Scenarios',
    'admin': false,
    'to': '/projects/0abf17de-27c9-4cb5-8f63-67a0338e5171/scenarios',
  },
  {
    'name': 'assets',
    'label': 'Assets',
    'admin': false,
    'to': '/projects/0abf17de-27c9-4cb5-8f63-67a0338e5171/assets',
  },
  {
    'name': 'settings',
    'label': 'Settings',
    'admin': false,
    'basepath': '/projects/0abf17de-27c9-4cb5-8f63-67a0338e5171/settings',
    'subMenu': [
      {
        'name': 'general',
        'label': 'General',
        'admin': false,
        'to': '/projects/0abf17de-27c9-4cb5-8f63-67a0338e5171/settings/general',
      },
      {
        'name': 'permissions',
        'label': 'Permissions',
        'admin': false,
        'to': '/projects/0abf17de-27c9-4cb5-8f63-67a0338e5171/settings/permissions',
      },
      {
        'name': 'event-log',
        'label': 'Event Log',
        'admin': false,
        'to': '/projects/0abf17de-27c9-4cb5-8f63-67a0338e5171/event-log',
        'disabled': true,
      },
    ],
  },
];

export const NavBarDefault: StoryFn<typeof Navbar> = () => (
  <div style={{width: '100%'}}>
    <Navbar
      location={''}
      navbarItems={navbarItems}
      navigateTo={() => {
      }}
    />
  </div>
);

export const NavBarWithSearch: StoryFn<typeof Navbar> = () => {
  const [search, onSearchChange] = React.useState('');
  return (
    <div style={{width: '100%'}}>
      <Navbar
        location={''}
        navbarItems={navbarItems}
        navigateTo={() => {
        }}
      >
        <Input
          action={true}
          actionPosition="left"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        >
          <Button primary={true}>
            Search
          </Button>
          <input/>
        </Input>
      </Navbar>
    </div>
  );
};

export const NavBarWithProjectName: StoryFn<typeof Navbar> = () => (
  <div style={{width: '100%'}}>
    <Navbar
      location={''}
      navbarItems={navbarItems}
      navigateTo={() => {
      }}
    >
      <Header as={'h3'}>Project Name
        <Icon name={'edit'} size={'tiny'}/>
      </Header>
    </Navbar>
  </div>
);

export const NavBarEmpty: StoryFn<typeof Navbar> = () => (
  <div style={{width: '100%'}}>
    <Navbar
      location={''}
      navbarItems={[]}
      navigateTo={() => {
      }}
    />
  </div>
);
