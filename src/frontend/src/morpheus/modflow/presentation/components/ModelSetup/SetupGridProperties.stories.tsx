import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryObj} from '@storybook/react';

import SetupGridProperties from './SetupGridProperties';

const meta = {
  title: 'Morpheus/ModelSetup/SetupGridProperties',
  component: SetupGridProperties,
  args: {
    gridProperties: {
      n_cols: 100,
      n_rows: 100,
      rotation: 0,
      length_unit: 'meters' as const,
    },
    onChange: () => undefined,
    readOnly: false,
  },
} satisfies Meta<typeof SetupGridProperties>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
};
