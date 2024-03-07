import {render, screen} from '@testing-library/react';

import {ModelsCreate} from '../index';
import React from 'react';

describe('ModelCreate Tests', () => {
  test('It renders the component', async () => {
    render(<ModelsCreate/>);
    expect(screen.getByTestId('ModelCreate-container')).toBeInTheDocument();
  });
});
