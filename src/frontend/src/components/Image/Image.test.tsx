import {render, screen} from '@testing-library/react';

import Image from './Image';
import React from 'react';

describe('Image Tests', () => {
  test('It renders a Image', async () => {
    render(
      <Image data-testid={'image'} src={'image'}/>,
    );
    expect(screen.getByTestId('image')).toBeInTheDocument();
  });
});
