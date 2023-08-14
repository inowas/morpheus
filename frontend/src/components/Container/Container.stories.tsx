import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import Container from './Container';
import Segment from '../Segment/Segment';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Container',
  component: Container,
} as Meta<typeof Container>;


export const ContainerExample: StoryFn<typeof Container> = () => (
  <Container content={'ITEXIA Container'}>
    <Segment placeholder={true} content={'ITEXIA SEGMENT'}/>
  </Container>
);
