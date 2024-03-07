import {fireEvent, render, screen} from '@testing-library/react';

import React from 'react';
import SidebarDetails from './SidebarDetails';

describe('Details Tests', () => {
  test('It renders a details view in a sidebar', async () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    render(
      <SidebarDetails
        open={true}
        data={{name: 'test-123-123'}}
        attributes={[
          {
            fieldKey: 'name',
            label: 'Name',
            type: 'string',
            validate: (value: string) => {
              if (!value) {
                return 'Name cannot be empty';
              }
            },
            form_group: 'general',
          },
        ]}
        loading={false}
        onSubmit={onSubmit}
        onClose={onClose}
        isCreate={true}
        translate={(key) => key}
      />,
    );
    expect(screen.getByTestId('sideBar')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('sideBarSubmitButton'));
    expect(onSubmit).toHaveBeenCalled();

    const inputContainer = screen.getByTestId('string-input-name');
    expect(inputContainer).toBeInTheDocument();

    const input = screen.getByDisplayValue('test-123-123');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, {target: {value: '23'}});

    const closeButton = screen.getByTestId('sideBarCloseButton');
    fireEvent.click(closeButton);
  });
});
