import {render, screen} from '@testing-library/react';

import Placeholder from './Placeholder';
import React from 'react';

describe('Placeholder Tests', () => {
  test('It renders a placeholder', async () => {
    render(
      <Placeholder/>,
    );
    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
  });
});
