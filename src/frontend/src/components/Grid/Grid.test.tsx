import {render, screen} from '@testing-library/react';

import Grid from './index';
import React from 'react';

describe('Grid Tests', () => {
  test('It renders a grid', async () => {
    render(
      <Grid.Grid
        columns={2}
        data-testid={'grid'}
      />,
    );

    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });
});

describe('Grid Tests', () => {
  test('It renders a grid', async () => {
    render(
      <Grid.Grid columns={2}>
        <Grid.Column
          data-testid={'grid'}
        >Content</Grid.Column>,
      </Grid.Grid>,
    );

    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });
});

describe('Grid Tests', () => {
  test('It renders a grid', async () => {
    render(
      <Grid.Grid columns={2}>
        <Grid.Row
          data-testid={'grid'}
        >Content</Grid.Row>,
      </Grid.Grid>,
    );
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });
});
