// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import Page from './Page';
import React from 'react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Page',
  component: Page,
} as Meta<typeof Page>;

export const Primary: StoryFn<typeof Page> = () => <Page
  fluid={true}
  segmentStyle={{
    height: 'calc(100vh - 90px)',
    padding: 20,
  }}
  as='h1'
  header={'Page'}
>Page Content</Page>;
