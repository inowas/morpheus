import {Button, Modal} from 'common/components';
import {Container, Segment} from 'semantic-ui-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import React from 'react';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Modal/Modal',
  component: Modal.Modal,
} as Meta<typeof Modal.Modal>;

export const Default: StoryFn<typeof Modal.Modal> = () => (
  <Container>
    <Segment>
      <Modal.Modal content={'This is only content.'} open={true}>
        <Modal.Header>Modal Header</Modal.Header>
        <Modal.Content>
          <p>This is only content.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button content={'Cancel'}/>
          <Button content={'OK'}/>
        </Modal.Actions>
      </Modal.Modal>
    </Segment>
  </Container>
);
