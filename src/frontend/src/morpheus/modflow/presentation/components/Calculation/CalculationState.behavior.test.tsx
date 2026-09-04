import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CalculationState from './CalculationState';
import {ICalculation} from '../../../types/Calculation.type';

const calculation: ICalculation = {
  calculation_id: 'calculation-1',
  model_id: 'model-1',
  profile_id: 'profile-1',
  lifecycle: ['created', 'completed'],
  state: 'completed',
  check_model_log: [],
  calculation_log: [],
  result: {
    type: 'success',
    message: '',
    files: [],
    flow_head_results: {
      times: [],
      kstpkper: [],
      number_of_layers: 1,
      number_of_observations: 0,
      min_value: null,
      max_value: null,
    },
    flow_drawdown_results: null,
    flow_budget_results: null,
    transport_concentration_results: null,
    transport_budget_results: null,
    packages: [],
  },
};

describe('calculation state behavior', () => {
  it('offers starting a calculation when no calculation exists', async () => {
    const onStartCalculation = jest.fn();

    render(
      <CalculationState
        isReadOnly={false}
        onStartCalculation={onStartCalculation}
        onNavigateToResults={jest.fn()}
      />,
    );

    await userEvent.click(screen.getByRole('button', {name: 'Start Calculation'}));

    expect(onStartCalculation).toHaveBeenCalledTimes(1);
  });

  it('shows the results action after a successful calculation', async () => {
    const onNavigateToResults = jest.fn();

    render(
      <CalculationState
        calculation={calculation}
        isReadOnly={false}
        onStartCalculation={jest.fn()}
        onNavigateToResults={onNavigateToResults}
      />,
    );

    await userEvent.click(screen.getByRole('button', {name: 'Go to Results'}));

    expect(onNavigateToResults).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows the read-only waiting state instead of a start action', () => {
    render(
      <CalculationState
        isReadOnly={true}
        onStartCalculation={jest.fn()}
        onNavigateToResults={jest.fn()}
      />,
    );

    expect(screen.getByText('Waiting for Start Calculation')).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Start Calculation'})).not.toBeInTheDocument();
  });
});
