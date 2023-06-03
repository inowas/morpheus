import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Header from './Header';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Header',
  component: Header,
} as ComponentMeta<typeof Header>;


export const HeaderExample: ComponentStory<typeof Header> = () => (
  <Header content={'ITEXIA HEADER'} as='h2'/>
);

export const HeaderExampleH1: ComponentStory<typeof Header> = () => (
  <Header
    content={'ITEXIA HEADER'} as='h1'
    color='red'
  />
);
