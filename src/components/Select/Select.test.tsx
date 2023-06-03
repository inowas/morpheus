import {render, screen} from '@testing-library/react';
import Select from './Select';
import React from 'react';

describe('Select Tests', () => {
  test('It renders a grid', async () => {
    render(
      <Select
        options={[{
          key: '9kkuykbwersd',
          value: '9kkuykbwersd',
          text: 'Option1',
        }]}
        data-testid={'select'}
      />,
    );

    expect(screen.getByTestId('select')).toBeInTheDocument();
  });
});
