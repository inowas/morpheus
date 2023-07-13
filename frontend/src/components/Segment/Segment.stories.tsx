import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Segment from './Segment';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Segment',
  component: Segment,
} as ComponentMeta<typeof Segment>;


export const SegmentExample: ComponentStory<typeof Segment> = () => (
  <Segment placeholder={true} content={'ITEXIA SEGMENT'}/>
);
