import Parameters, {sortParameters} from './Parameters';
import {render, screen} from '@testing-library/react';

import {IT08} from '../../types/T08.type';
import React from 'react';
import {defaults} from '../containers/T08Container';

type IParameter = IT08['parameters'][0];

const unsortedParameters: IParameter[] = [
  {
    order: 3,
    id: 'param3',
    name: 'Parameter 3',
    min: 0,
    max: 10,
    value: 5,
    stepSize: 1,
    type: 'number',
    decimals: 0,
    inputType: 'SLIDER',
    label: 'Parameter 3 Label',
    parseValue: (value: string) => parseFloat(value),
  },
  {
    order: 1,
    id: 'param1',
    name: 'Parameter 1',
    min: 0,
    max: 10,
    value: 3,
    stepSize: 1,
    type: 'number',
    decimals: 0,
    inputType: 'SLIDER',
    label: 'Parameter 1 Label',
    parseValue: (value: string) => parseFloat(value),
  },
  {
    order: 2,
    id: 'param2',
    name: 'Parameter 2',
    min: 0,
    max: 10,
    value: 7,
    stepSize: 1,
    type: 'number',
    decimals: 0,
    inputType: 'SLIDER',
    label: 'Parameter 2 Label',
    parseValue: (value: string) => parseFloat(value),
  },
];

const mockOnChange = jest.fn();
const mockOnReset = jest.fn();

describe('Parameters Tests', () => {

  test('It renders the component', async () => {
    render(
      <Parameters
        parameters={defaults.parameters}
        onChange={mockOnChange}
        onReset={mockOnReset}
      />,
    );

    expect(screen.getByTestId('parameters-container')).toBeInTheDocument();
  });

  test('Test sorts parameters', async () => {
    const sortedParameters = sortParameters(unsortedParameters);
    // Check if the sorted parameters are in the correct order
    expect(sortedParameters[0].order).toBe(1);
    expect(sortedParameters[1].order).toBe(2);
    expect(sortedParameters[2].order).toBe(3);
  });
});
