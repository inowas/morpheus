import {render, screen} from '@testing-library/react';

import Header from './Header';
import React from 'react';
import {useNavbarItems} from '../../morpheus/application/application';

describe('Header Tests', () => {
  test('It renders a Header with default props', async () => {
    render(<Header
      navbarItems={[]} navigateTo={() => {
      }}
      pathname="/"
    />);
    const headerElement = screen.getByTestId('header');
    expect(headerElement).toBeInTheDocument();
  });

  test('It renders a Header with specified props', async () => {
    const {navbarItems} = useNavbarItems();
    const mockNavigateTo = jest.fn();
    render(
      <Header
        navbarItems={navbarItems}
        navigateTo={mockNavigateTo}
        pathname="/"
        language="en-GB"
        showSearchWrapper={true}
      />,
    );

    const headerElement = screen.getByTestId('header');
    expect(headerElement).toBeInTheDocument();
  });
});
