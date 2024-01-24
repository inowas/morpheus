import React from 'react';
import {render, screen} from '@testing-library/react';
import {ModelsCreate} from '../index';

describe('ModelCreate Tests', () => {
  test('It renders the component', async () => {
    render(<ModelsCreate/>);
    expect(screen.getByTestId('ModelCreate-container')).toBeInTheDocument();
  });
});
