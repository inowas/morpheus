import React from 'react';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import T11 from './T11Container';


describe('T11Container Tests', () => {
  test('It renders the component', async () => {
    render(
      <BrowserRouter>
        <T11/>
      </BrowserRouter>,
    );

    expect(screen.getByTestId('T11-container')).toBeInTheDocument();
  });
});
