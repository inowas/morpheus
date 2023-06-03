import {render, screen} from '@testing-library/react';
import React from 'react';
import Progress from './Progress';

describe('Progress Tests', () => {
  test('It renders a Progress', async () => {
    render(
      <Progress data-testid={'progress'}/>,
    );
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });
});
