import {render, screen, waitFor} from '@testing-library/react';

import Popup from './Popup';
import React from 'react';

describe('Popup Tests', () => {
  test('It renders a button', async () => {
    render(
      <Popup
        data-testid={'test-popup'}
        open={true}
        content={'test-popup'}
      />,
    );

    // fix Popper error
    // Warning: An update to Popper inside a test was not wrapped in act(...).
    await waitFor(() => ({}));

    expect(screen.getByTestId('test-popup')).toBeInTheDocument();
    expect(screen.getByTestId('test-popup')).toHaveTextContent('test-popup');
  });
});

