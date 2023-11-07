import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import Wrapper from './Wrapper';
import Segment from '../Segment/Segment';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Wrapper',
  component: Wrapper,
} as Meta<typeof Wrapper>;


export const WrapperExample: StoryFn<typeof Wrapper> = () => (
  <Wrapper>
    <Segment placeholder={true} content={'ITEXIA SEGMENT'}/>
  </Wrapper>
);
