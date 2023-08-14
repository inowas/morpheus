import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn, Meta} from '@storybook/react';
import Label from './Label';
import {Container, Segment} from 'semantic-ui-react';

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

