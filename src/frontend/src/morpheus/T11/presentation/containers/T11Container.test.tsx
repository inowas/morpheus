import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import T11 from './T11Container';


describe('T11Container Tests', () => {
  test('It renders the component', async () => {
    render(
      <MemoryRouter>
        <T11/>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('T11-container')).toBeInTheDocument();
  });
});
