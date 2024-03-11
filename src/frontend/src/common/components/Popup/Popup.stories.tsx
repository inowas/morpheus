import {Container, Segment} from 'semantic-ui-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import Popup from './Popup';
import React from 'react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Popup',
  component: Popup,
} as Meta<typeof Popup>;

export const Content: StoryFn<typeof Popup> = () => (
  <Container>
    <Segment>
      <Popup content={'This is only content.'} open={true}/>
    </Segment>
  </Container>
);
