import {render, screen} from '@testing-library/react';

import {ModelCreate} from '../index';
import React from 'react';

describe('ModelCreate Tests', () => {
  test('It renders the component', async () => {
    render(<ModelCreate/>);
    expect(screen.getByTestId('ModelCreate-container')).toBeInTheDocument();
  });
});
