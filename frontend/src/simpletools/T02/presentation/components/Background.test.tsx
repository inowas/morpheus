import React from 'react';
import {render, screen} from '@testing-library/react';
import Background from './Background';

describe('Background Tests', () => {
  test('It renders the component', async () => {
    render(
      <Background image={''} title={''}/>,
    );

    expect(screen.getByTestId('background-container')).toBeInTheDocument();
  });
});