import {render, screen} from '@testing-library/react';

import BackToTopButton from './BackToTopButton';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('BackToTopButton Tests', () => {
  test('It renders a BackToTopButton', async () => {
    render(
      <BackToTopButton/>,
    );

    expect(screen.getByTestId('test-backToTopButton')).toBeInTheDocument();
  });
  test('Clicking the BackToTopButton scrolls to the top', async () => {
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;
    render(<BackToTopButton/>);
    const button = screen.getByTestId('test-backToTopButton');
    await userEvent.click(button);
    // Expect that window.scrollTo was called with the expected arguments
    expect(scrollToMock).toHaveBeenCalledWith({top: 0, behavior: 'smooth'});
  });
});
