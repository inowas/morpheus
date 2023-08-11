import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn, Meta} from '@storybook/react';
import Divider from './Divider';
import {Container, Grid, Segment} from 'semantic-ui-react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Divider',
  component: Divider,
} as Meta<typeof Divider>;

export const Vertical: StoryFn<typeof Divider> = () => (
  <Container>
    <Segment>
      <Grid columns={2} >
        <Grid.Column>
          <p>
         Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eligendi iusto porro.
          </p>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eligendi iusto porro.

          </p>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eligendi iusto porro.

          </p>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eligendi iusto porro.

          </p>
        </Grid.Column>
        <Grid.Column>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eligendi iusto porro.

          </p>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eligendi iusto porro.

          </p>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eligendi iusto porro.

          </p>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eligendi iusto porro.

          </p>
        </Grid.Column>
      </Grid>

      <Divider vertical={true}>And</Divider>
    </Segment>
  </Container>

);

export const Horizontal: StoryFn<typeof Divider> = () => (
  <Container>
    <Segment>
      <Divider/>
    </Segment>
  </Container>
);

