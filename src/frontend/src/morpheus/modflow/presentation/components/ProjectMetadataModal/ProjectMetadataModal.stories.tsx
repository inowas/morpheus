// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryObj} from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {expect, userEvent, within} from '@storybook/test';

import ProjectMetadataModal from './ProjectMetadataModal';
import React from 'react';
import {Button} from 'common/components';

const meta = {
  title: 'ProjectMetadataModal',
  component: ProjectMetadataModal,
} satisfies Meta<typeof ProjectMetadataModal>;

export default meta;

type Story = StoryObj<typeof meta>;

const CreateProjectModalStory = (args: React.ComponentProps<typeof ProjectMetadataModal>) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(args.open);

  return (
    <div style={{padding: 100}}>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ProjectMetadataModal
        {...args}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
      />
    </div>
  );
};

export const CreateProjectModalExample: Story = {
  args: {
    open: false,
    loading: false,
    onCancel: () => undefined,
    onSubmit: async () => undefined,
  },
  render: (args) => <CreateProjectModalStory {...args}/>,
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    await step('Open the modal', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Open Modal'}));
    });

    expect(await within(document.body).findByTestId('project-meta-data-modal')).toBeVisible();
  },
};
