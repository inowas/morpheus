import {render, screen} from '@testing-library/react';
import React from 'react';
import SearchInput from './SearchInput';

describe('SearchComponent Tests', () => {

  test('It should render input field with search button and placeholder text', async () => {
    const mockOnSearch = jest.fn();
    render(
      <SearchInput
        search={''}
        onChange={mockOnSearch}
        placeholder={'Search...'}
      />,
    );

    expect(screen.getByTestId('test-search-component')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
});
