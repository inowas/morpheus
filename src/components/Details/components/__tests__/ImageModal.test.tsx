import React from 'react';
import {render, screen} from '@testing-library/react';
import ImageModal from '../ImageModal';
import userEvent from '@testing-library/user-event';

describe('ImageModal component', () => {
  test('renders ImageModal', () => {
    const open = true;
    const onClose = jest.fn();
    const url = 'url';

    render(<ImageModal
      open={open}
      onClose={onClose}
      url={url}
    />);
    expect(screen.getByTestId('imageModal')).toBeInTheDocument();
  });

  test('modal close by click on button', async () => {
    const open = true;
    const onClose = jest.fn();
    const url = 'https://img.com';

    render(<ImageModal
      open={open} onClose={onClose}
      url={url}
    />);
    const modalButton = screen.getByTestId('modalButton');
    await userEvent.click(modalButton);
    expect(onClose).toHaveBeenCalled();
  });
});
