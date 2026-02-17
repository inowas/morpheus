import {render, screen} from '@testing-library/react';
import Navbar from './Navbar';
import React from 'react';
import userEvent from '@testing-library/user-event';

const mockNavigateTo = jest.fn();
const navbarItems = [
  {
    name: 'home',
    label: 'home',
    admin: false,
    basepath: '/',
    subMenu: [
      {
        name: 'about_us',
        label: 'about_us',
        admin: false,
        to: '/about-us',
      },
      {
        name: 'software_releases',
        label: 'software_releases',
        admin: false,
        to: '/software-releases',
      },
      {
        name: 'publications',
        label: 'publications',
        admin: false,
        to: '/publications',
      },
      {
        name: 'projects',
        label: 'projects',
        admin: false,
        to: '/projects',
      },
    ],
  },
  {
    name: 'tools',
    label: 'tools',
    admin: false,
    basepath: '/tools',
    subMenu: ['T02', 'T04', 'T06', 'T08', 'T09', 'T11', 'T13', 'T14', 'T18'].map((tool) => ({
      name: tool,
      label: `${tool}: tools_title`,
      admin: false,
      to: `/tools/${tool}`,
    })),
  },
  {
    name: 'modflow',
    label: 'modflow',
    admin: false,
    to: '/modflow',
  },
  {
    name: 'support',
    label: 'support',
    admin: false,
    to: '/support',
  },
  {
    name: 'news',
    label: 'news',
    admin: false,
    to: '/news',
  },
];
const location = {
  hash:
    '',
  key:
    'kofvch0s',
  pathname:
    '/',
  search:
    '',
  state:
    null,
};

describe('Navbar Tests', () => {

  test('renders Navbar component with default values', () => {
    render(
      <Navbar
        navbarItems={navbarItems}
        location={location}
        navigateTo={mockNavigateTo}
      />,
    );

    expect(screen.getByTestId('test-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('test-nav')).not.toHaveClass('navOpen');
    expect(screen.getByText('Innovative Groundwater Solutions')).toBeInTheDocument();
    expect(screen.getByAltText('inowas logo')).toBeInTheDocument();
  });

  test('renders sub-menu items when a parent menu item is clicked', async () => {
    render(
      <Navbar
        navbarItems={navbarItems}
        location={location}
        navigateTo={mockNavigateTo}
      />,
    );

    const aboutUsMenuItem = screen.getByText('about_us');
    await userEvent.click(aboutUsMenuItem);

    expect(mockNavigateTo).toHaveBeenCalledWith('/about-us');
  });

  test('renders sub-menu items for tools when "tools" is clicked', async () => {
    render(
      <Navbar
        navbarItems={navbarItems}
        location={location}
        navigateTo={mockNavigateTo}
      />,
    );

    const toolsMenuItem = screen.getByText('tools');
    await userEvent.click(toolsMenuItem);

    const toolSubMenuItems = ['T02', 'T04', 'T06', 'T08', 'T09', 'T11', 'T13', 'T14', 'T18'];
    toolSubMenuItems.forEach((tool) => {
      expect(screen.getByText(`${tool}: tools_title`)).toBeInTheDocument();
    });
  });

});
