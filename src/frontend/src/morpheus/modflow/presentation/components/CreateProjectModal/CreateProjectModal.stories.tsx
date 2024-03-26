// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from '@storybook/react';

import CreateProjectModal from './CreateProjectModal';
import React from 'react';
import { Button } from '../../../../../common/components';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'CreateProjectModal',
  component: CreateProjectModal,
} as Meta<typeof CreateProjectModal>;

export const CreateProjectModalExample: StoryFn<
  typeof CreateProjectModal
> = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div style={{ padding: 100 }}>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <CreateProjectModal isOpen={isOpen} onCancel={onClose} />
    </div>
  );
};
