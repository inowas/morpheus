import React from 'react';
import {render, screen} from '@testing-library/react';
import {FormModelCreate} from '../index';

describe('FormModelCreate Tests', () => {
  test('It renders the component', async () => {
    render(<FormModelCreate/>);
    expect(screen.getByTestId('formModelCreate-container')).toBeInTheDocument();
  });
});
