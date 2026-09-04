import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryObj} from '@storybook/react';

import LayerConfinement from './LayerConfinement';

const meta = {
  title: 'Morpheus/ModelLayers/LayerConfinement',
  component: LayerConfinement,
  args: {
    layerType: 'confined' as const,
    onSubmit: () => undefined,
    readOnly: false,
  },
} satisfies Meta<typeof LayerConfinement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
};
