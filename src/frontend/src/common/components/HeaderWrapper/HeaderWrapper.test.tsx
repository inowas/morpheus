import {render, screen} from '@testing-library/react';
import HeaderWrapper from './HeaderWrapper';
import React from 'react';

describe('HeaderWrapper Tests', () => {
  const mockUpdateHeight = jest.fn();

  test('renders HeaderWrapper component with default values', () => {
    render(<HeaderWrapper>Test Content</HeaderWrapper>);
    expect(screen.getByTestId('test-headerWrapper')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('calls updateHeight with the correct height when rendered', () => {
    render(<HeaderWrapper updateHeight={mockUpdateHeight}>Test Content</HeaderWrapper>);
    expect(mockUpdateHeight).toHaveBeenCalledWith(0);
  });

  test('applies the correct paddingTop style based on header height', () => {
    render(<HeaderWrapper>Test Content</HeaderWrapper>);
    const headerElement = screen.getByTestId('test-headerWrapper');
    expect(headerElement).toHaveStyle({paddingTop: '0px'});
  });
});
