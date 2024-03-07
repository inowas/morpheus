import {render, screen} from '@testing-library/react';

import InfoTitle from './InfoTitle';
import React from 'react';
import userEvent from '@testing-library/user-event';

const title = 'Some title';
describe('Info Title Tests', () => {
  test('It renders the Info Title component', () => {
    render(
      <InfoTitle
        title={title}
      />,
    );

    expect(screen.getByTestId('info-title')).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test('It renders the Info Title component with action', async () => {
    const actionText = 'Action Text';
    const actionDescription = 'Some action description';
    const onActionMock = jest.fn();

    render(
      <InfoTitle
        title={title}
        actionText={actionText}
        actionDescription={actionDescription}
        onAction={onActionMock}
      />,
    );

    expect(screen.getByTestId('info-title')).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(actionText)).toBeInTheDocument();

    const actionButton = screen.getByText(actionText);
    await userEvent.click(actionButton);
    expect(onActionMock).toHaveBeenCalled();
  });

  test('It renders the Section Title component without action', () => {
    render(
      <InfoTitle
        title={title}
      />,
    );

    expect(screen.getByTestId('info-title')).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();

    // Check that action button is not present
    expect(screen.queryByText('Action Text')).not.toBeInTheDocument();
  });
});

