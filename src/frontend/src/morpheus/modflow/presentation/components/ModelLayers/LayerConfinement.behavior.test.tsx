import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LayerConfinement from './LayerConfinement';

describe('layer confinement behavior', () => {
  it('saves a changed confinement type', async () => {
    const onSubmit = jest.fn();

    render(<LayerConfinement layerType="confined" onSubmit={onSubmit} readOnly={false}/>);

    const radios = screen.getAllByRole('radio');
    await userEvent.click(radios[1]);
    expect(screen.getByRole('button', {name: 'Save'})).toBeVisible();

    await userEvent.click(screen.getByRole('button', {name: 'Save'}));

    expect(onSubmit).toHaveBeenCalledWith('convertible');
  });

  it('does not expose editing controls in read-only mode', () => {
    render(<LayerConfinement layerType="confined" onSubmit={jest.fn()} readOnly={true}/>);

    expect(screen.getAllByRole('radio')[1]).toBeDisabled();
    expect(screen.queryByRole('button', {name: 'Save'})).not.toBeInTheDocument();
  });
});
