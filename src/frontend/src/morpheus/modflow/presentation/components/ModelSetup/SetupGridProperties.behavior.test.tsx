import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';

import SetupGridProperties from './SetupGridProperties';

const gridProperties = {
  n_cols: 10,
  n_rows: 20,
  rotation: 0,
  length_unit: 'meters' as const,
};

describe('model setup grid properties behavior', () => {
  it('reports edited rows, columns, and rotation', () => {
    const onChange = jest.fn();

    render(<SetupGridProperties gridProperties={gridProperties} onChange={onChange} readOnly={false}/>);
    const inputs = screen.getAllByRole('spinbutton');

    fireEvent.change(inputs[0], {target: {value: '30'}});
    fireEvent.change(inputs[1], {target: {value: '40'}});
    fireEvent.change(inputs[2], {target: {value: '15'}});

    expect(onChange).toHaveBeenNthCalledWith(1, {...gridProperties, n_rows: 30});
    expect(onChange).toHaveBeenNthCalledWith(2, {...gridProperties, n_cols: 40});
    expect(onChange).toHaveBeenNthCalledWith(3, {...gridProperties, rotation: 15});
  });

  it('disables grid inputs in read-only mode', () => {
    render(<SetupGridProperties gridProperties={gridProperties} onChange={jest.fn()} readOnly={true}/>);
    const inputs = screen.getAllByRole('spinbutton');

    expect(inputs).toHaveLength(3);
    expect(inputs.every((input) => input.hasAttribute('disabled'))).toBe(true);
  });
});
