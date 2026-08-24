import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LayerPropertyValuesDefaultValue from './LayerPropertyValuesDefaultValue';

describe('layer property default value behavior', () => {
  it('saves a changed numeric value', async () => {
    const onSubmit = jest.fn();

    render(<LayerPropertyValuesDefaultValue value={10} onSubmit={onSubmit} readOnly={false} unit="m/d"/>);

    await userEvent.clear(screen.getByRole('spinbutton'));
    await userEvent.type(screen.getByRole('spinbutton'), '12.5');
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));

    expect(onSubmit).toHaveBeenCalledWith(12.5);
  });

  it('does not expose saving controls in read-only mode', () => {
    render(<LayerPropertyValuesDefaultValue value={10} onSubmit={jest.fn()} readOnly={true}/>);

    expect(screen.getByRole('spinbutton')).toBeDisabled();
    expect(screen.queryByRole('button', {name: 'Save'})).not.toBeInTheDocument();
  });
});
