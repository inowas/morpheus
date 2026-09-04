import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';

import SetupGridProperties from './SetupGridProperties';
import {ILengthUnit} from '../../../types';

const gridProperties = {
  n_cols: 10,
  n_rows: 20,
  rotation: 0,
  length_unit: 'meters' as ILengthUnit,
};

describe('model setup grid properties behavior', () => {
  it('reports edited rows, columns, and rotation', () => {
    const onChange = jest.fn();

    render(<SetupGridProperties gridProperties={gridProperties} onChange={onChange} readOnly={false}/>);
    fireEvent.change(screen.getByLabelText('Rows'), {target: {value: '30'}});
    fireEvent.change(screen.getByLabelText('Columns'), {target: {value: '40'}});
    fireEvent.change(screen.getByLabelText('Rotation angle (°)'), {target: {value: '15'}});

    expect(onChange).toHaveBeenNthCalledWith(1, {...gridProperties, n_rows: 30});
    expect(onChange).toHaveBeenNthCalledWith(2, {...gridProperties, n_cols: 40});
    expect(onChange).toHaveBeenNthCalledWith(3, {...gridProperties, rotation: 15});
  });

  it('disables grid inputs in read-only mode', () => {
    render(<SetupGridProperties gridProperties={gridProperties} onChange={jest.fn()} readOnly={true}/>);
    expect(screen.getByLabelText('Rows')).toBeDisabled();
    expect(screen.getByLabelText('Columns')).toBeDisabled();
    expect(screen.getByLabelText('Rotation angle (°)')).toBeDisabled();
  });
});
