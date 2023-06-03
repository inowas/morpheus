import React from 'react';
import {render, screen} from '@testing-library/react';
import Modal from './Modal';

describe('Modal Tests', () => {
  test('It renders a modal', async () => {
    render(
      <Modal
        content={'modal-content'}
        data-testid={'test-modal'}
        open={true}
      />,
    );

    expect(screen.getByTestId('test-modal')).toBeInTheDocument();
    expect(screen.getByTestId('test-modal')).toHaveTextContent('modal-content');
  });
});

