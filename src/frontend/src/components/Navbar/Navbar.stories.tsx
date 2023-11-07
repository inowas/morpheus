import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import Navbar from './Navbar';
import {ILanguage} from './LanguageSelector/types/languageSelector.type';
import Header from '../Header/Header';

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

const navbarItems2 = [
  {
    name: 'home', label: 'Home', admin: false, basepath: '/', subMenu: [
      {name: 'T02', label: 'T02: Groundwater Mounding (Hantush)', admin: false, to: '/tools/T02'},
      {name: 'T04', label: 'T04: Database for GIS-based Suitability Mapping', admin: false, to: '/tools/T04'}],
  },
  {name: 'filters', label: 'Filters', admin: false, to: '/tools'},
  {name: 'documentation', label: 'Documentation', admin: false, to: '/modflow'},
];
const languageList: ILanguage[] = [
  {code: 'en-GB', label: 'English'},
];

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Navbar',
  component: Navbar,
} as Meta<typeof Navbar>;

export const NavbarExampleBase: StoryFn<typeof Navbar> = () =>
  <div style={{margin: '-1rem'}}>
    <Header>
      <Navbar
        navbarItems={navbarItems}
        language="en-GB"
        languageList={languageList}
        onChangeLanguage={() => {
        }}
        navigateTo={() => {
        }}
        pathname={'/'}
        showSearchWrapper={false}
        showCreateButton={false}
      />
    </Header>
  </div>
;

export const NavbarExampleNoSearch: StoryFn<typeof Navbar> = () =>
  <div style={{margin: '-1rem'}}>
    <Header>
      <Navbar
        navbarItems={navbarItems2}
        language="en-GB"
        languageList={languageList}
        onChangeLanguage={() => {
        }}
        navigateTo={() => {
        }}
        pathname={'/'}
        showSearchWrapper={false}
      />
    </Header>
  </div>
;
export const NavbarExampleNoCreateButton: StoryFn<typeof Navbar> = () =>
  <div style={{margin: '-1rem'}}>
    <Header>
      <Navbar
        navbarItems={navbarItems2}
        language="en-GB"
        languageList={languageList}
        onChangeLanguage={() => {
        }}
        navigateTo={() => {
        }}
        pathname={'/'}
        showCreateButton={false}
      />
    </Header>
  </div>
;

export const NavbarExample: StoryFn<typeof Navbar> = () =>
  <div style={{margin: '-1rem'}}>
    <Header>
      <Navbar
        navbarItems={navbarItems2}
        language="en-GB"
        languageList={languageList}
        onChangeLanguage={() => {
        }}
        navigateTo={() => {
        }}
        pathname={'/'}
      />
    </Header>
  </div>
;
