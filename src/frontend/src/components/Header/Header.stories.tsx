import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import Header from './Header';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Header',
  component: Header,
} as Meta<typeof Header>;


export const HeaderExample: StoryFn<typeof Header> = () => (
  <Header content={'ITEXIA HEADER'} as='h2'/>
);

export const HeaderExampleH1: StoryFn<typeof Header> = () => (
  <Header
    content={'ITEXIA HEADER'} as='h1'
    color='red'
  />
);
