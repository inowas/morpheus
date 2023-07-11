import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Page from './Page';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Page',
  component: Page,
} as ComponentMeta<typeof Page>;

export const Primary: ComponentStory<typeof Page> = () => <Page
  fluid={true}
  segmentStyle={{
    height: 'calc(100vh - 90px)',
    padding: 20,
  }}
  as='h1'
  header={'Itexia Page'}
>Page Content</Page>;
