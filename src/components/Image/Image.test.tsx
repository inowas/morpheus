import {render, screen} from '@testing-library/react';
import React from 'react';
import Image from './Image';

describe('Image Tests', () => {
  test('It renders a Image', async () => {
    render(
      <Image data-testid={'image'} src={'image'}/>,
    );
    expect(screen.getByTestId('image')).toBeInTheDocument();
  });
});
