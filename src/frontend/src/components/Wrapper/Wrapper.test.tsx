import {render, screen} from '@testing-library/react';
import React from 'react';
import Wrapper from './Wrapper';

describe('Wrapper Tests', () => {
  test('It renders a Wrapper with children', async () => {
    render(
      <Wrapper data-testid={'wrapper'}>
        <p>Child Component 1</p>
        <p>Child Component 2</p>
      </Wrapper>,
    );

    // Assert that the Wrapper is rendered
    expect(screen.getByTestId('wrapper')).toBeInTheDocument();

    // Assert that the child components are rendered
    expect(screen.getByText('Child Component 1')).toBeInTheDocument();
    expect(screen.getByText('Child Component 2')).toBeInTheDocument();
  });
});
