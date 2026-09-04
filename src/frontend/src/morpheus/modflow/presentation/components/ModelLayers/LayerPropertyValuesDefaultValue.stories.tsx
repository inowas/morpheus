import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryObj} from '@storybook/react';

import LayerPropertyValuesDefaultValue from './LayerPropertyValuesDefaultValue';

const meta = {
  title: 'Morpheus/ModelLayers/LayerPropertyValuesDefaultValue',
  component: LayerPropertyValuesDefaultValue,
  args: {
    value: 10,
    onSubmit: () => undefined,
    readOnly: false,
    unit: 'm/d',
    precision: 3,
  },
} satisfies Meta<typeof LayerPropertyValuesDefaultValue>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Editable: Story = {};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
};
