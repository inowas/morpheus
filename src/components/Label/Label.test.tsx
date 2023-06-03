import React from 'react';
import {render, screen} from '@testing-library/react';
import Label from './Label';

describe('Label Tests', () => {
  test('It renders a button', async () => {
    render(
      <Label data-testid={'test-label'} content={'label-content'}/>,
    );

    expect(screen.getByTestId('test-label')).toBeInTheDocument();
    expect(screen.getByTestId('test-label')).toHaveTextContent('label-content');
  });
});

