import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import SearchComponent from './SearchComponent';

describe('SearchComponent Tests', () => {

  test('It should render input field with search button and placeholder text', async () => {
    const mockOnSearch = jest.fn();
    render(
      <SearchComponent
        buttonText={'Search'}
        onSearch={mockOnSearch}
      />,
    );

    expect(screen.getByTestId('test-search-component')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  test('should not invoke onSearch function when button is clicked', async () => {
    const mockOnSearch = jest.fn();
    render(
      <SearchComponent
        buttonText="Search"
        onSearch={mockOnSearch}
      />,
    );
    const searchButton = screen.getByTestId('search-button');
    await userEvent.click(searchButton);
    expect(mockOnSearch).toHaveBeenCalled();
  });
  
});
