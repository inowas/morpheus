import {render, screen} from '@testing-library/react';

import {CreateProjectContainer} from '../index';
import React from 'react';

describe('ModelCreate Tests', () => {
  test('It renders the component', async () => {
    render(<CreateProjectContainer/>);
    expect(screen.getByTestId('ModelCreate-container')).toBeInTheDocument();
  });
});
