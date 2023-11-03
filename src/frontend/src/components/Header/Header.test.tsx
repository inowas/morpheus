import {render, screen} from '@testing-library/react';
import React from 'react';
import Header from './Header';

describe('Header Tests', () => {
  test('It renders a Header', async () => {
    render(
      <Header data-testid={'header'} children={'header-content'}/>,
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
