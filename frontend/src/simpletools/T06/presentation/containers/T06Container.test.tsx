import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import T06Container from './T06Container';


describe('T06Container Tests', () => {
  test('It renders the component', async () => {
    render(
      <MemoryRouter>
        <T06Container/>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('T06-container')).toBeInTheDocument();
  });
});
