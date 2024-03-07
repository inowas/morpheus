import {Container, Segment} from 'semantic-ui-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import Label from './Label';
import React from 'react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Label',
  component: Label,
} as Meta<typeof Label>;

export const Content: StoryFn<typeof Label> = () => (
  <Container>
    <Segment>
      <Label content={'This is only content.'}/>
    </Segment>
  </Container>
);

