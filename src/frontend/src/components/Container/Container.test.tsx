import {render, screen} from '@testing-library/react';
import React from 'react';
import Container from './Container';

describe('Container Tests', () => {
  test('It renders a Container', async () => {
    render(
      <Container data-testid={'container'}/>,
    );
    expect(screen.getByTestId('container')).toBeInTheDocument();
  });
});
