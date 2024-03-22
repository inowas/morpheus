import {render, screen} from '@testing-library/react';

import Container from './Container';
import React from 'react';

describe('Container Tests', () => {
  test('It renders a Container', async () => {
    render(
      <Container data-testid={'container'}/>,
    );
    expect(screen.getByTestId('container')).toBeInTheDocument();
  });
});
