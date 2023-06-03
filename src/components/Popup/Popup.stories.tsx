import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Popup from './Popup';
import {Container, Segment} from 'semantic-ui-react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Popup',
  component: Popup,
} as ComponentMeta<typeof Popup>;

export const Content: ComponentStory<typeof Popup> = () => (
  <Container>
    <Segment>
      <Popup content={'This is only content.'} open={true}/>
    </Segment>
  </Container>
);
