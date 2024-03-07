import {render, screen} from '@testing-library/react';

import Header from './Header';
import React from 'react';

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

  const navbarItems = [
    {
      name: 'home', label: 'Home', admin: false, basepath: '/', subMenu: [
        {name: 'T02', label: 'T02: Groundwater Mounding (Hantush)', admin: false, to: '/tools/T02'},
        {name: 'T04', label: 'T04: Database for GIS-based Suitability Mapping', admin: false, to: '/tools/T04'}],
    },
    {name: 'tools', label: 'Tools', admin: false, to: '/tools'},
    {name: 'modflow', label: 'Modflow', admin: false, to: '/modflow'},
    {name: 'support', label: 'Support', admin: false, to: '/support'},
    {name: 'news', label: 'News', admin: false, to: '/news'},
  ];

  test('It renders a Header with specified props', async () => {
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
