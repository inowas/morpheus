import React from 'react';
import {render, screen} from '@testing-library/react';
import Navbar from './Navbar';
import {MemoryRouter} from 'react-router-dom';
import {ILanguage} from './LanguageSelector/types/languageSelector.type';


const mockOnChangeLanguage = jest.fn();
const mockNavigateTo = jest.fn();
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
const languageList: ILanguage[] = [
  {code: 'en-GB', label: 'English'},
];

describe('Navbar Tests', () => {

  test('It renders a Navbar', async () => {
    render(
      <MemoryRouter>
        <Navbar
          navbarItems={navbarItems}
          language="en-GB"
          languageList={languageList}
          onChangeLanguage={mockOnChangeLanguage}
          navigateTo={mockNavigateTo}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('test-navbar')).toBeInTheDocument();
  });
});
