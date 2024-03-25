import {render, screen} from '@testing-library/react';

import CreateProjectModal from './CreateProjectModal';
import React from 'react';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();


describe('CreateProjectModal Tests', () => {
  test('It renders the component', async () => {
    render(<CreateProjectModal
      open={true}
      loading={false}
      onSubmit={mockOnSubmit}
      onCancel={mockOnCancel}
    />);

    expect(screen.getByTestId('create-project-modal')).toBeInTheDocument();
  });
});
