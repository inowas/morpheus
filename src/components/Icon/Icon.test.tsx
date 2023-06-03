import {render, screen} from '@testing-library/react';
import React from 'react';
import Icon from './Icon';

describe('Icon Tests', () => {
  test('It renders a Icon', async () => {
    render(
      <Icon data-testid={'icon'}/>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
