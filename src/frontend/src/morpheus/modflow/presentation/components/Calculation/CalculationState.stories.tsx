import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryObj} from '@storybook/react';

import CalculationState from './CalculationState';
import {ICalculation} from '../../../types/Calculation.type';

const calculation: ICalculation = {
  calculation_id: 'calculation-1',
  model_id: 'model-1',
  profile_id: 'profile-1',
  lifecycle: ['created', 'queued', 'preprocessing', 'preprocessed', 'calculating'],
  state: 'calculating',
  check_model_log: [],
  calculation_log: ['Calculation started'],
  result: null,
};

const meta = {
  title: 'Morpheus/CalculationState',
  component: CalculationState,
  args: {
    calculation,
    isReadOnly: false,
    onStartCalculation: () => undefined,
    onNavigateToResults: () => undefined,
  },
} satisfies Meta<typeof CalculationState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Calculating: Story = {};

export const ReadyToStart: Story = {
  args: {
    calculation: undefined,
  },
};

export const ReadOnly: Story = {
  args: {
    calculation: undefined,
    isReadOnly: true,
  },
};
