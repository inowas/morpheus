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

  test('It renders the Info Title component with action', async () => {
    const actionText = 'Action Text';
    const actionDescription = 'Some action description';
    const onActionMock = jest.fn();

    render(
      <InfoTitle
        title={title}
        actions={[{actionText, actionDescription, onClick: onActionMock}]}
      />,
    );

    expect(screen.getByTestId('info-title')).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(actionText)).toBeInTheDocument();

    const actionButton = screen.getByText(actionText);
    await userEvent.click(actionButton);
    expect(onActionMock).toHaveBeenCalled();
  });

  test('It renders the Info Title component with multiple actions', async () => {
    const actionText1 = 'Action Text 1';
    const actionDescription1 = 'Some action description 1';
    const onActionMock1 = jest.fn();
    const actionText2 = 'Action Text 2';
    const actionDescription2 = 'Some action description 2';
    const onActionMock2 = jest.fn();

    render(
      <InfoTitle
        title={title}
        actions={[
          {actionText: actionText1, actionDescription: actionDescription1, onClick: onActionMock1},
          {actionText: actionText2, actionDescription: actionDescription2, onClick: onActionMock2},
        ]}
      />,
    );

    expect(screen.getByTestId('info-title')).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(actionText1)).toBeInTheDocument();
    expect(screen.getByText(actionText2)).toBeInTheDocument();

    const actionButton1 = screen.getByText(actionText1);
    const actionButton2 = screen.getByText(actionText2);

    await userEvent.click(actionButton1);
    await userEvent.click(actionButton2);

    expect(onActionMock1).toHaveBeenCalled();
    expect(onActionMock2).toHaveBeenCalled();
  });

});

