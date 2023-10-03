import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn, Meta} from '@storybook/react';
import Icon from './Icon';
import {Page} from '../index';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Icon',
  component: Icon,
} as Meta<typeof Icon>;


export const IconName: StoryFn<typeof Icon> = () => (
  <Page>
    <Icon name='trash'/>
  </Page>
);

export const Circular: StoryFn<typeof Icon> = () => (
  <Page>
    <Icon name='trash' circular={true}/>
  </Page>
);

export const Disabled: StoryFn<typeof Icon> = () => (
  <Page>
    <Icon
      name='trash' circular={true}
      disabled={true}
    />
  </Page>
);

export const Size: StoryFn<typeof Icon> = () => (
  <Page>
    <Icon
      name='trash' circular={true}
      size='large'
    />
  </Page>
);

export const Loading: StoryFn<typeof Icon> = () => (
  <Page>
    <Icon
      name='arrow alternate circle down' circular={true}
      size='large'
      loading={true}
    />
  </Page>
);

