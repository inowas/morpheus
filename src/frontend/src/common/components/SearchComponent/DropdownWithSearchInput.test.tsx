import {render, screen} from '@testing-library/react';
import React from 'react';
import DropdownWithSearchInput from './DropdownWithSearchInput';

describe('SearchComponent Tests', () => {

  test('It should render input field with search button and placeholder text', async () => {
    const mockOnSearch = jest.fn();
    render(
      <DropdownWithSearchInput
        dropDownText={'Add Boundaries'}
        searchPlaceholder={'Search...'}
        onChangeSearch={mockOnSearch}
        dropdownItems={[
          {text: 'Item 1', action: jest.fn()},
          {text: 'Item 2', action: jest.fn()},
        ]}
        isReadOnly={false}
      />,
    );

    expect(screen.getByTestId('test-search-component')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
});
