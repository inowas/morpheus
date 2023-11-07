import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import NotFound from './NotFound';

export default {
  /* 👇 The title prop is optional.
* See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
* to learn how to generate automatic titles
*/
  title: 'NotFound',
  component: NotFound,
} as Meta<typeof NotFound>;


export const NotFoundExample: StoryFn<typeof NotFound> = () => (
  <NotFound/>
);


