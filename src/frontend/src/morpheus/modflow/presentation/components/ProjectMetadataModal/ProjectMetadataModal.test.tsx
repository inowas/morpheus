import React from 'react';
import {render, screen} from '@testing-library/react';
import ProjectMetadataModal from './ProjectMetadataModal';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('ProjectMetadataModal Tests', () => {
  test('It renders the component', async () => {
    render(<ProjectMetadataModal
      open={true}
      loading={false}
      onSubmit={mockOnSubmit}
      onCancel={mockOnCancel}
    />);

    expect(screen.getByTestId('project-meta-data-modal')).toBeInTheDocument();
  });
});
