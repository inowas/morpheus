import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Container from './Container';
import Segment from '../Segment/Segment';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Container',
  component: Container,
} as ComponentMeta<typeof Container>;


export const ContainerExample: ComponentStory<typeof Container> = () => (
  <Container content={'ITEXIA Container'}>
    <Segment placeholder={true} content={'ITEXIA SEGMENT'}/>
  </Container>
);
