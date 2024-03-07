import {render, screen} from '@testing-library/react';

import Confirm from './Confirm';
import React from 'react';

describe('Confirm Tests', () => {
  test('It renders a Confirm', async () => {
    render(
      <Confirm data-testid={'confirm'} open={true}/>,
    );
    expect(screen.getByTestId('confirm')).toBeInTheDocument();
  });
});
