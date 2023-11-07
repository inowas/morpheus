import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import Navbar from './Navbar';
import {ILanguage} from './LanguageSelector/types/languageSelector.type';

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

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Navbar',
  component: Navbar,
} as Meta<typeof Navbar>;

export const NavbarExample: StoryFn<typeof Navbar> = () =>
  <Navbar
    navbarItems={navbarItems}
    language="en-GB"
    languageList={languageList}
    onChangeLanguage={() => {
    }}
    navigateTo={() => {
    }}
    pathname={'/'}
  />
;
