import {render, screen} from '@testing-library/react';

import Progress from './Progress';
import React from 'react';

describe('Progress Tests', () => {
  test('It renders a Progress', async () => {
    render(
      <Progress data-testid={'progress'}/>,
    );
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });
});
