import {render, screen} from '@testing-library/react';

import Icon from './Icon';
import React from 'react';

describe('Icon Tests', () => {
  test('It renders a Icon', async () => {
    render(
      <Icon data-testid={'icon'}/>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
