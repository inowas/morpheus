import {render, screen} from '@testing-library/react';
import React from 'react';
import Segment from './Segment';

describe('Segment Tests', () => {
  test('It renders a Segment', async () => {
    render(
      <Segment data-testid={'segment'}/>,
    );
    expect(screen.getByTestId('segment')).toBeInTheDocument();
  });
});
