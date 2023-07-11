import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentStory, ComponentMeta} from '@storybook/react';
import Icon from './Icon';
import {Page} from '../index';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Icon',
  component: Icon,
} as ComponentMeta<typeof Icon>;


export const IconName: ComponentStory<typeof Icon> = () => (
  <Page>
    <Icon name='trash'/>
  </Page>
);

export const Circular: ComponentStory<typeof Icon> = () => (
  <Page>
    <Icon name='trash' circular={true}/>
  </Page>
);

export const Disabled: ComponentStory<typeof Icon> = () => (
  <Page>
    <Icon
      name='trash' circular={true}
      disabled={true}
    />
  </Page>
);

export const Size: ComponentStory<typeof Icon> = () => (
  <Page>
    <Icon
      name='trash' circular={true}
      size='large'
    />
  </Page>
);

export const Loading: ComponentStory<typeof Icon> = () => (
  <Page>
    <Icon
      name='arrow alternate circle down' circular={true}
      size='large'
      loading={true}
    />
  </Page>
);

